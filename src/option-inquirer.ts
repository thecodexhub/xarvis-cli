import inquirer from 'inquirer';
import { Options } from './options/options';
import { Template, convertStringToTemplate } from './options/template';

export class OptionInquirer {
  static promptForMissingOptions = async (options: Options): Promise<Options> => {
    const questions = [];

    if (!options.appName) {
      questions.push({
        type: 'input',
        name: 'appName',
        message: 'Please enter the name of the app:',
        validate: function (input: string): boolean | string {
          if (/^([A-Za-z\-\\_\d])+$/.test(input)) return true;
          else {
            return 'Project name may only include letters, numbers, underscores and dashes.';
          }
        },
      });
    }

    if (options.template === Template.NotSelected) {
      questions.push({
        type: 'list',
        name: 'template',
        message: 'Please choose which project template to use:',
        choices: [Template.JavaScript, Template.TypeScript],
        default: Template.JavaScript,
      });
    }

    const answers = await inquirer.prompt(questions);

    const template: Template =
      options.template === Template.NotSelected ? convertStringToTemplate(answers.template) : options.template;

    return new Options(
      options.help,
      options.version,
      options.method,
      options.appType,
      template,
      options.appName || answers.appName
    );
  };
}
