import { transformTemplateWithConfig } from '../../src/tasks/create-express-task';
import { ObjectWritableMock } from 'stream-mock';

describe('CreateExpressTask', () => {
  describe('transformTemplateWithConfig', () => {
    it('should replace project name and description in the stream', (done) => {
      const projectName = 'xarvis';
      const description = 'a CLI tool to generate production ready apps';

      const input = 'Project name: {{project_name}}, and this is {{project_description}}';
      const expectedOutput = `Project name: ${projectName}, and this is ${description}`;

      const transformStream = transformTemplateWithConfig(projectName, description);
      const writableStream = new ObjectWritableMock();

      transformStream.write(input, 'utf-8', () => {
        transformStream.end();
      });

      transformStream.pipe(writableStream);

      writableStream.on('finish', () => {
        const transformedData = writableStream.data.toString();
        expect(transformedData).toEqual(expectedOutput);
        done();
      });
    });
  });
});
