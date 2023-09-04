#!/usr/bin/env node

import { ArgsParser } from './args-parser';
import chalk from 'chalk';

const startXarvisCli = async (args: string[]) => {
  const command = await ArgsParser.parseArgsInCommand(args);
  const response = command.serializeResponse();

  if (response.severity === 'error') {
    console.log(chalk.red(response.message));
    process.exit(1);
  }

  console.log(response.message);
};

// xarvis create express-app
startXarvisCli(process.argv);
