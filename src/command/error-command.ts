import { BaseCommand } from "./base-command";

export class ErrorCommand extends BaseCommand {
  constructor(public additionalArgs: string[]) {
    super();
    Object.setPrototypeOf(this, ErrorCommand.prototype);
  }

  serializeResponse(): { message: string; severity: string | undefined } {
    const errorArgs = this.additionalArgs.slice(2);
    return {
      message: `Could not find command ${errorArgs.join(" ")}`,
      severity: "error",
    };
  }
}
