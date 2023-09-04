import { BaseCommand } from './base-command';

export class AssistCommand extends BaseCommand {
  constructor(public message: string) {
    super();
    Object.setPrototypeOf(this, AssistCommand.prototype);
  }

  serializeResponse(): { message: string; tasks?: string[] | undefined } {
    return { message: this.message };
  }
}
