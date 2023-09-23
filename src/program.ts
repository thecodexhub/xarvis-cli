import { Command } from 'commander';
import createCommand from './commands/create-command';

/**
 * Represents the main program for the Xarvis CLI tool.
 *
 * @remarks
 * This program uses the {@link https://github.com/tj/commander.js commander.js} library to define and manage commands for the CLI tool.
 */
const program = new Command();

// Add the "create" command to the program
program.addCommand(createCommand);

// Add a help command to display usage information
program.addHelpCommand('help [command]', 'Display the usage information.');

export default program;
