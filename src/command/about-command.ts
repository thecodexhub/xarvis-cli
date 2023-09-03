import { BaseCommand } from "./base-command";

export class AboutCommand extends BaseCommand {
  serializeResponse(): { message: string; tasks?: string[] | undefined } {
    return { message: "🚀 Xarvis Command-Line Interface" };
  }
}
