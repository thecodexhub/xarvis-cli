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
export const transformTemplateWithConfig = (projectName: string, projectDescription: string): stream.Transform => {
  return new stream.Transform({
    transform(chunk, _, callback) {
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
 * @param {TaskFunction} runFinalConfigurations - A Listr task to init git and setup husky for pre-commit hook.
 * @param {string} projectName - The name of the xarvis project
 * @returns A Listr task list for creating an Express project.
 */
const tasksListForCreateExpressProject = (
  generateProjectFilesTask: TaskFunction,
  installDependenciesWithYarn: TaskFunction,
  installDependenciesWithNpm: TaskFunction,
  runFinalConfigurations: TaskFunction,
  projectName: string,
  config: CreateExpressConfig
): Listr<CreateExpressProjectContext> => {
  return new Listr<CreateExpressProjectContext>(
    [
      {
        title: 'Generating project files...',
        task: generateProjectFilesTask,
      },
      {
        title: `Installing dependencies with "yarn" in ./${projectName}...`,
        task: installDependenciesWithYarn,
      },
      {
        title: `Installing dependencies with "npm install" in ./${projectName}...`,
        enabled: (context) => context.yarn === false,
        task: installDependenciesWithNpm,
      },
      {
        title: `Running additional configurations in ./${projectName}...`,
        enabled: (_) => !config.skipGit,
        task: runFinalConfigurations,
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

    // Decode the file content. The file content is base-64 encoded string.
    const decodedContent = Buffer.from(content, 'base64').toString();
    await writeAsync(destinationFile, decodedContent);
  }
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
  targetDirectory: string
) => {
  try {
    await execa('yarn', [], { cwd: targetDirectory });
  } catch (error) {
    context.yarn = false;
    task.skip('Yarn is not available, install it using <npm install -g yarn>');
  }
};

/**
 * Installs project dependencies using NPM.
 * @param {string} targetDirectory - The directory path where the dependencies should be installed.
 */
const installDependenciesWithNpm = async (targetDirectory: string) => {
  await execa('npm', ['install'], { cwd: targetDirectory });
};

/**
 * Init git and setup husky for pre-commit hook.
 * @param {string} targetDirectory - The directory path where the dependencies should be installed.
 */
const runFinalConfigurations = async (targetDirectory: string) => {
  await execa('git', ['init'], { cwd: targetDirectory });
  await execa('npx', ['husky', 'install'], { cwd: targetDirectory });
  await execa('npx', ['husky', 'add', '.husky/pre-commit', '"npx lint-staged"'], { cwd: targetDirectory });
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
    (_, __) => generateProjectFilesTask(templateDirectory, targetDirectory, projectName, projectDescription),
    (context, task) => installDependenciesWithYarn(context, task, targetDirectory),
    (_, __) => installDependenciesWithNpm(targetDirectory),
    (_, __) => runFinalConfigurations(targetDirectory),
    projectName,
    config
  );

  try {
    await createExpressTasks.run();
  } catch (err) {
    throw new Error('Something unexpected occurred while running tasks');
  }

  const setupDocsLink =
    config.getTemplate() === 'javascript'
      ? 'https://github.com/thecodexhub/xarvis-express-js#project-setup'
      : 'https://github.com/thecodexhub/xarvis-express-ts#project-setup';

  console.info(`\n${chalk.magenta.bold(`Generated a Xarvis Express app! ✨`)}`);

  console.info(`\nNext Steps:`);
  console.info(`===========`);
  console.info(`  * Navigate to project folder:    ${chalk.yellow(`cd ./${projectName}`)}`);
  console.info(`  * Project setup & configuration: ${chalk.cyan(setupDocsLink)}`);
  console.info(`  * Start the development server:  ${chalk.yellow(`npm run dev`)}`);

  console.info(`\nStay updated: ${chalk.cyan('https://github.com/thecodexhub/xarvis-cli/releases')}`);
  console.info(`Thanks for using Xarvis!\n`);
};
