#!/usr/bin/env node

import { ArgsParser } from "./args-parser";
import chalk from "chalk";

const startXarvisCli = (args: string[]) => {
  const command = ArgsParser.parseArgsInCommand(args);
  const response = command.serializeResponse();

  if (response.severity === "error") {
    console.log(chalk.red(response.message));
    process.exit(1);
  }

  console.log(response.message);
};

startXarvisCli(process.argv);
