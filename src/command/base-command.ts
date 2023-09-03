export abstract class BaseCommand {
  abstract serializeResponse(): {
    message: string;
    severity?: string;
    tasks?: string[];
  };
}
