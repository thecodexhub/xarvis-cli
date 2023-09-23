import { Command } from 'commander';
import createCommand from './commands/create-command';

const program = new Command();

program.addCommand(createCommand);
program.addHelpCommand('help [command]', 'Display the usage information.');

export default program;
