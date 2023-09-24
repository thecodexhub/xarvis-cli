import chalk from 'chalk';
import fs from 'fs';
import ncp from 'ncp';
import path from 'path';
import stream from 'stream';
import { promisify } from 'util';
import { CreateExpressConfig } from '../config/create-express-config';

// Promisify the 'fs.access' method to check file system access.
const accessAsync = promisify(fs.access);

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
 * Creates the express project based on the specified [CreateExpressConfig].
 * @param {CreateExpressConfig} config - Configuration for the Xarvis Express project.
 * @returns {Promise<void>} A Promise that resolves when the project creation is complete.
 * @throws {Error} Throws an error if unable to read the templates directory.
 */
export const createExpressProject = async (config: CreateExpressConfig): Promise<void> => {
  const templateName = config.getTemplate() === 'javascript' ? 'xarvis-express-js' : 'xarvis-express-ts';
  const templateDirectory = path.resolve(__dirname, '../../templates', templateName);

  const outputDirectory = path.resolve(config.getOutputDirectory(), config.getProjectName());

  try {
    await accessAsync(templateDirectory, fs.constants.R_OK);
  } catch (err) {
    throw new Error('Unable to read the templates directory');
  }

  await copyAsync(templateDirectory, outputDirectory, {
    clobber: false,
    transform: (read: NodeJS.ReadableStream, write: NodeJS.WritableStream) => {
      const replaceStream = transformTemplateWithConfig(config.getProjectName(), config.getDescription());
      read.pipe(replaceStream).pipe(write);
    },
  });

  console.log('%s Project ready', chalk.green.bold('DONE'));
};
