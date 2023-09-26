import fs from 'fs';
import ncp from 'ncp';
import path from 'path';
import stream from 'stream';
import { promisify } from 'util';
import Listr from 'listr';
import execa from 'execa';
import chalk from 'chalk';
import { CreateExpressConfig } from '../config/create-express-config';
import { OraUpdateRenderer } from '../renderer/ora-update-renderer';
import { CreateExpressProjectContext, TaskFunction } from '../types';

// Promisify the 'fs.access' method to check file system access.
const accessAsync = promisify(fs.access);

// Promisify the `fs.readFile` method to read the entire contents of a file asynchronously.
const readAsync = promisify(fs.readFile);

// Promisify the `fs.readFile` method to write data to the file asynchronously.
const writeAsync = promisify(fs.writeFile);

// Promisify the 'ncp' (copy) method to perform file and directory copying.
const copyAsync = promisify(ncp);

/**
 * Create a transform stream to replace placeholders in a template.
 * @param {string} projectName - The name of the xarvis project.
 * @param {string} projectDescription - The description of the xarvis project.
 * @returns {stream.Transform} A transform stream that replaces placeholders with provided values.
 */
const transformTemplateWithConfig = (projectName: string, projectDescription: string): stream.Transform => {
  return new stream.Transform({
    transform(chunk, encoding, callback) {
      let modifiedChunk = chunk.toString('utf8');

      // Replace project name and project description
      modifiedChunk = modifiedChunk.replace(/{{project_name}}/g, projectName);
      modifiedChunk = modifiedChunk.replace(/{{project_description}}/g, projectDescription);

      this.push(modifiedChunk);
      callback();
    },
  });
};

/**
 * A Listr task list for creating an Express project.
 *
 * @param {TaskFunction} generateProjectFilesTask - A Listr task to generate project files.
 * @param {TaskFunction} installDependenciesWithYarn - A Listr task to install package dependencies with Yarn.
 * @param {TaskFunction} installDependenciesWithNpm - A Listr task to install package dependencies with npm.
 * @returns A Listr task list for creating an Express project.
 */
const tasksListForCreateExpressProject = (
  generateProjectFilesTask: TaskFunction,
  installDependenciesWithYarn: TaskFunction,
  installDependenciesWithNpm: TaskFunction
): Listr<CreateExpressProjectContext> => {
  return new Listr<CreateExpressProjectContext>(
    [
      {
        title: 'Generating project files...',
        task: generateProjectFilesTask,
      },
      {
        title: 'Install package dependencies with Yarn',
        task: installDependenciesWithYarn,
      },
      {
        title: 'Install package dependencies with npm',
        enabled: (context) => context.yarn === false,
        task: installDependenciesWithNpm,
      },
    ],
    {
      renderer: OraUpdateRenderer,
    }
  );
};

/**
 * Generates the project files, copying from the `templateDirectory` to the `targetDirectory`.
 * It also replaces the template strings with the values configured by the user.
 * @param {string} templateDirectory - The path to the template directory.
 * @param {string} targetDirectory - The target directory where the project will be created.
 * @param {string} projectName - The name of the xarvis project.
 * @param {string} projectDescription - The description of the xarvis project.
 */
const generateProjectFilesTask = async (
  task: Listr.ListrTaskWrapper<CreateExpressProjectContext>,
  templateDirectory: string,
  targetDirectory: string,
  projectName: string,
  projectDescription: string
) => {
  const sourceDirectory = path.resolve(templateDirectory, 'template');
  await copyAsync(sourceDirectory, targetDirectory, {
    clobber: false,
    transform: (read: NodeJS.ReadableStream, write: NodeJS.WritableStream) => {
      const replaceStream = transformTemplateWithConfig(projectName, projectDescription);
      read.pipe(replaceStream).pipe(write);
    },
  });

  const extraFilePath = path.resolve(templateDirectory, 'extra.json');
  const data = await readAsync(extraFilePath, { encoding: 'utf-8' });
  const fileContent: { file: string; content: string }[] = JSON.parse(data);

  for (const item of fileContent) {
    const { file, content } = item;

    const destinationFile = path.resolve(targetDirectory, file);
    const decodedContent = Buffer.from(content, 'base64').toString();

    await writeAsync(destinationFile, decodedContent);
  }

  task.title = 'Generated project files!';
};

/**
 * Installs project dependencies using Yarn. If error occurs, skips the task, and sets the `context.yarn` to false.
 * @param {CreateExpressProjectContext} context - The context for the createExpressProject task.
 * @param {Listr.ListrTaskWrapper<CreateExpressProjectContext>} task - The Listr task wrapper.
 * @param {string} targetDirectory - The directory path where the dependencies should be installed.
 */
const installDependenciesWithYarn = async (
  context: CreateExpressProjectContext,
  task: Listr.ListrTaskWrapper<CreateExpressProjectContext>,
  targetDirectory: string,
  projectName: string
) => {
  try {
    await execa('yarn', [], { cwd: targetDirectory });
    task.title = `Installed dependencies with "yarn" in ./${projectName}`;
  } catch (error) {
    context.yarn = false;
    task.skip('Yarn is not available, install it via <npm install -g yarn>');
  }
};

/**
 * Installs project dependencies using NPM.
 * @param {string} targetDirectory - The directory path where the dependencies should be installed.
 */
const installDependenciesWithNpm = async (
  targetDirectory: string,
  task: Listr.ListrTaskWrapper<CreateExpressProjectContext>,
  projectName: string
) => {
  await execa('npm', ['install'], { cwd: targetDirectory });
  task.title = `Installed dependencies with "npm install" in ./${projectName}`;
};

/**
 * Creates the express project based on the specified [CreateExpressConfig].
 * @param {CreateExpressConfig} config - Configuration for the Xarvis Express project.
 * @returns {Promise<void>} A Promise that resolves when the project creation is complete.
 * @throws {Error} Throws an error if unable to read the templates directory.
 */
export const createExpressProject = async (config: CreateExpressConfig): Promise<void> => {
  const templateName = config.getTemplate() === 'javascript' ? 'xarvis-express-js' : 'xarvis-express-ts';
  const templateDirectory = path.resolve(__dirname, '../../templates', templateName);

  const projectName = config.getProjectName();
  const projectDescription = config.getDescription();

  const targetDirectory = path.resolve(config.getOutputDirectory(), projectName);

  try {
    await accessAsync(templateDirectory, fs.constants.R_OK);
  } catch (err) {
    throw new Error('Unable to read the templates directory');
  }

  const createExpressTasks = tasksListForCreateExpressProject(
    (_, task) => generateProjectFilesTask(task, templateDirectory, targetDirectory, projectName, projectDescription),
    (context, task) => installDependenciesWithYarn(context, task, targetDirectory, projectName),
    (_, task) => installDependenciesWithNpm(targetDirectory, task, projectName)
  );

  try {
    await createExpressTasks.run();
  } catch (err) {
    throw new Error('Something unexpected occurred while running tasks');
  }

  console.log(`\n${chalk.cyan.bold(`Generated a Xarvis Express app! ✨`)}`);
};
