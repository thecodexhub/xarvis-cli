import { Command } from 'commander';
import program from '../program';
import chalk from 'chalk';
import createExpressCommand from './subcommands/create-express-command';

const createCommand = new Command('create')
  .description('Creates a new xarvis project in the specified directory.')
  .usage('<subcommand> <project-name> [arguments]')
  .helpOption('-h, --help', 'Display the usage information.')
  .action(() => program.error('Missing subcommand for "xarvis create".'));

createCommand.addCommand(createExpressCommand);

createCommand.configureHelp({
  subcommandTerm: (cmd) => cmd.name(),
});

createCommand.showHelpAfterError(true);

createCommand.configureOutput({
  outputError: (err, write) => write(chalk.red(`Error: ${err.replace('error: ', '')}`)),
});

export default createCommand;
