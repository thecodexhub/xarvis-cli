import path from 'path';
import { BaseCommand } from './base-command';
import fs from 'fs';

export class VersionCommand extends BaseCommand {
  serializeResponse(): { message: string; severity?: string } {
    const filePath = path.join(__dirname, '../../' + '/package.json');

    const buffer = fs.readFileSync(filePath, { encoding: 'utf-8' });
    const parsedJson = JSON.parse(buffer);

    if (parsedJson.version === undefined) {
      return { message: 'Could not find current version', severity: 'error' };
    }

    return { message: `v${parsedJson.version}` };
  }
}
