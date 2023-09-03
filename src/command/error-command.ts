import { BaseCommand } from "./base-command";

export class ErrorCommand extends BaseCommand {
  constructor(public additionalArgs: string[]) {
    super();
    Object.setPrototypeOf(this, ErrorCommand.prototype);
  }

  serializeResponse(): { message: string; severity: string | undefined } {
    return {
      message: `Could not find command ${this.additionalArgs.join(" ")}`,
      severity: "error",
    };
  }
}
