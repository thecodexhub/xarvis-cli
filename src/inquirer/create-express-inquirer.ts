import inquirer from 'inquirer';
import { CreateExpressConfig } from '../config/create-express-config';

/**
 * Interactively prompts the user for missing configuration details and returns an updated
 * CreateExpressConfig instance with the provided values.
 *
 * @param {CreateExpressConfig} config - The current configuration object.
 *
 * @returns {Promise<CreateExpressConfig>} A Promise that resolves to a new instance of
 * `CreateExpressConfig` with updated values based on user input.
 *
 * @throws {Error} If there is an issue with the interactive prompts.
 */
const inquireForMissingCreateExpressConfig = async (config: CreateExpressConfig): Promise<CreateExpressConfig> => {
  const questions = [];

  if (config.shouldInquireDescription()) {
    questions.push({
      type: 'input',
      name: 'description',
      message: 'Enter the project description:',
      default: CreateExpressConfig.defaultDescription,
    });
  }

  if (config.shouldInquireTemplate()) {
    questions.push({
      type: 'list',
      name: 'template',
      message: 'Choose a project template to use:',
      choices: ['javascript', 'typescript'],
      default: 'javascript',
    });
  }

  const answers = await inquirer.prompt(questions);
  return config.copyWith({ description: answers.description, template: answers.template });
};

export { inquireForMissingCreateExpressConfig };
