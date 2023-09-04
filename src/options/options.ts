import { AppType } from "./app-type";
import { Method } from "./method";
import { Template } from "./template";

export class Options {
  constructor(
    public help: boolean,
    public version: boolean,
    public method: Method,
    public appType: AppType,
    public template: Template,
    public appName: string
  ) {}
}
