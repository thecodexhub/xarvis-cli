import arg from 'arg';
import { AboutCommand } from './command/about-command';
import { BaseCommand } from './command/base-command';
import { ErrorCommand } from './command/error-command';
import { VersionCommand } from './command/version-command';
import { Options } from './options/options';
import { Method, convertStringToMethod } from './options/method';
import { AppType, convertStringToAppType } from './options/app-type';
import { Template, convertStringToTemplate } from './options/template';
import { AssistCommand } from './command/assist-command';
import { OptionInquirer } from './option-inquirer';

export class ArgsParser {
  public static parseArgsInCommand = async (
    rawArgs: string[],
  ): Promise<BaseCommand> => {
    let args: arg.Result<{
      '--help': BooleanConstructor;
      '--version': BooleanConstructor;
      '--template': StringConstructor;
      '-h': string;
      '-v': string;
      '-t': string;
    }>;

    try {
      args = arg(
        {
          '--help': Boolean,
          '--version': Boolean,
          '--template': String,
          '-h': '--help',
          '-v': '--version',
          '-t': '--template',
        },
        {
          argv: rawArgs.slice(2),
        },
      );
    } catch (_) {
      return new ErrorCommand(rawArgs);
    }

    let options: Options = {
      help: args['--help'] || false,
      version: args['--version'] || false,
      method: convertStringToMethod(args._[0]),
      appType: convertStringToAppType(args._[1]),
      template: convertStringToTemplate(args['--template']),
      appName: args._[2],
    };

    // If no argument is passed, or no options are selected
    if (isPropertiesDefault(options)) return new AboutCommand();

    // If help and version both are true, throw error, not valid command
    if (options.help && options.version) return new ErrorCommand(rawArgs);

    // If help is asked, show about as of now
    if (options.help) return new AboutCommand();

    // If version is asked, run [VersionCommand].
    if (options.version) return new VersionCommand();

    // The code reaches here, means help and version are not asked.
    // Check if create method is asked
    if (options.method === Method.Create) {
      // If express-app is not mentioned, assist with
      // `This is not a valid command. Please try with <xarvis create express-app>`
      if (options.appType === AppType.NotSelected) {
        return new AssistCommand(
          'This is not a valid command. Please try with <xarvis create express-app>',
        );
      }

      // If template is not mentioned, ask the question.
      options = await OptionInquirer.promptForMissingOptions(options);
    }

    console.log(options);
    return new ErrorCommand(rawArgs);
  };
}

const isPropertiesDefault = (options: Options): boolean => {
  return (
    !options.help &&
    !options.version &&
    options.method === Method.NotSelected &&
    options.appType === AppType.NotSelected &&
    options.template === Template.NotSelected &&
    options.appName === undefined
  );
};
