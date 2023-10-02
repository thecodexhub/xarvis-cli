# Xarvis CLI

A Command-Line Interface for generating a production-ready starter template.

Developed with 💜 by [thecodexhub](https://github.com/thecodexhub)

<!-- <img src="assets/images/recording.gif?raw=true" alt="xarvis cli"> -->

## Supported Templates

- [xarvis-express-js](https://github.com/thecodexhub/xarvis-express-js) - A Xarvis Express app with JavaScript: (See [features](https://github.com/thecodexhub/xarvis-express-js#features) list)
- [xarvis-express-ts](https://github.com/thecodexhub/xarvis-express-ts) - A Xarvis Express app with TypeScript: (See [features](https://github.com/thecodexhub/xarvis-express-ts#features) list)

## Installation

```
$ npm install -g xarvis-cli
```

## Commands

### `xarvis -h` or `xarvis --help` - Display the usage information.

```
Usage: xarvis <command> [arguments]

🚀 A Command-Line Interface for generating production ready starter template.

Options:
  -v, --version   Display the current version.
  -h, --help      Display the usage information.

Commands:
  create          Creates a new xarvis project in the specified directory.
  help [command]  Display the usage information.
```

### `xarvis create express-app` - Creates a new Xarvis Express project in the specified directory.

```
Usage: xarvis create express-app <project-name> [arguments]

Creates a new Xarvis Express project in the specified directory.

Options:
  -o, --output-directory  The optional desired output directory when creating a new project.
  -t, --template          The template for this project. (choices: "javascript", "typescript")
      --description       The description for this new project. (default: "An Express starter project
                          created by Xarvis CLI.")
  -h, --help              Display the usage information.
```

_Note: The `--template` and `--description` are required. If not provided by the CLI options, questions will be prompted, as shown in the below example._

```
$ xarvis create express-app my-app
? Enter the project description: An Express starter project created by Xarvis CLI.
? Choose a project template to use: (Use arrow keys)
> javascript
  typescript
```

### Use `-h` or `--help` for any usage information

```shell
# Displays usage information for Xarvis CLI
$ xarvis -h

# Displays usage information for `xarvis create` command
$ xarvis create -h

# Displays usage information for `xarvis create express-app` command
$ xarvis create express-app -h
```

## License

[MIT](LICENSE)

<pre align="center">T h a n k s   f o r   u s i n g   X a r v i s   C L I ! ✨</pre>
