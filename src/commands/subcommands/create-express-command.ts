import chalk from 'chalk';
import { Command, Option } from 'commander';
import { CreateExpressConfig } from '../../config/create-express-config';
import { inquireForMissingCreateExpressConfig } from '../../inquirer/create-express-inquirer';
import { createExpressProject } from '../../tasks/create-express-task';
import program from '../../program';
import { showProjectLogoHeader } from '../../utils/project-logo-header';

/**
 * Represents the main command for creating a new Xarvis Express project.
 *
 * @remarks
 * This command allows users to create a new Express project using Xarvis CLI.
 */
const createExpressCommand = new Command('express-app')
  .description('Creates a new Xarvis Express project in the specified directory.')
  .usage('<project-name> [arguments]')
  .argument('<project-name>')
  .helpOption('-h, --help', 'Display the usage information.');

/**
 * Represents an option to specify the project template.
 *
 * @remarks
 * Users can choose either JavaScript or TypeScript as the project template.
 */
const templateOption = new Option('-t, --template <type>', 'The template for this project.').choices([
  'javascript',
  'typescript',
]);

/**
 * Represents an option to specify the project description.
 *
 * @remarks
 * Users can provide a description for the new project.
 */
const descrptionOption = new Option('--description [desc]', 'The description for this new project.').default(
  CreateExpressConfig.defaultDescription
);

createExpressCommand
  .option('-o, --output-directory [destination]', 'The optional desired output directory when creating a new project.')
  .addOption(templateOption)
  .addOption(descrptionOption)
  .option('--skip-git', 'Whether or not to skip initializing git', false)
  .action(async (command, options) => {
    // Create an initial configuration object
    const initialConfig = new CreateExpressConfig(
      command,
      options.outputDirectory,
      options.description,
      options.template,
      options.skipGit
    );

    // Inquire for missing configuration details
    const createExpressConfig = await inquireForMissingCreateExpressConfig(initialConfig);

    // Show Project Logo
    await showProjectLogoHeader();

    try {
      await createExpressProject(createExpressConfig);
    } catch (error) {
      const errorMessage = (error as Error).message || 'Something unexpected occurred.';
      program.error(`Error: ${errorMessage}`);
    }
  });

createExpressCommand.showHelpAfterError(true);

createExpressCommand.configureHelp({
  subcommandTerm: (cmd) => cmd.name(),
  optionTerm: (opt) => {
    const isShortAvailable = typeof opt.short !== 'undefined';
    const short = isShortAvailable ? opt.short : '  ';

    const isLongAvailable = typeof opt.long !== 'undefined';
    const long = isLongAvailable ? opt.long : '';

    const divider = isShortAvailable ? ',' : ' ';
    return `${short}${divider} ${long}`;
  },
});

createExpressCommand.configureOutput({
  outputError: (err, write) => write(chalk.red(`Error: ${err.replace('error: ', '')}`)),
});

export default createExpressCommand;
