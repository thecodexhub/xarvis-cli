import chalk from 'chalk';
import { Command, Option } from 'commander';

const createExpressCommand = new Command('express-app')
  .description('Creates a new Xarvis Express project in the specified directory.')
  .usage('<project-name> [arguments]')
  .argument('<project-name>')
  .helpOption('-h, --help', 'Display the usage information.')
  .action((name) => console.log(`generate xarvis express app with name: ${name}, options are null`));

const templateOption = new Option('-t, --template <type>', 'The template for this project.').choices([
  'javascript',
  'typescript',
]);

const descrptionOption = new Option('--description [desc]', 'The description for this new project.').default(
  'An Express project created by Xarvis CLI.'
);

createExpressCommand
  .option('-o, --output-directory [destination]', 'The optional desired output directory when creating a new project.')
  .addOption(templateOption)
  .addOption(descrptionOption)
  .action((command, options) =>
    console.log(`Options are: ${options.outputDirectory}, ${options.template}, ${options.description}`)
  );

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
