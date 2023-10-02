#!/usr/bin/env node

import chalk from 'chalk';
import program from './program';

program
  .name('xarvis')
  .description('🚀 A Command-Line Interface for generating production ready starter template.')
  .version('v0.1.2-pre-release', '-v, --version', 'Display the current version.')
  .usage('<command> [arguments]')
  .helpOption('-h, --help', 'Display the usage information.');

program.showHelpAfterError();

program.configureOutput({
  outputError: (err, write) => write(chalk.red(`Error: ${err.replace('error: ', '')}`)),
});

program.configureHelp({ sortSubcommands: true });

program.parse(process.argv);
