import { AboutCommand } from "./command/about-command";
import { BaseCommand } from "./command/base-command";
import { ErrorCommand } from "./command/error-command";
import { VersionCommand } from "./command/version-command";

export class ArgsParser {
  public static parseArgsInCommand = (args: string[]): BaseCommand => {
    args.splice(0, 2);

    if (args.length === 0) {
      return new AboutCommand();
    }

    if (args.length === 1 && (args[0] === "--help" || args[0] === "-h")) {
      return new AboutCommand();
    }

    if (args.length === 1 && (args[0] === "--version" || args[0] === "-v")) {
      return new VersionCommand();
    }

    return new ErrorCommand(args);
  };
}
