import { CreateExpressConfig } from '../../src/config/create-express-config';

describe('CreateExpressConfig', () => {
  it('should create an instance of this with default values', () => {
    const createExpressConfig = new CreateExpressConfig('xarvis');

    expect(createExpressConfig.projectName).toBe('xarvis');
    expect(createExpressConfig.outputDirectory).toBeUndefined();
    expect(createExpressConfig.description).toBeUndefined();
    expect(createExpressConfig.template).toBeUndefined();
  });

  it('should have a default description', () => {
    expect(CreateExpressConfig.defaultDescription).toBeDefined();
    expect(CreateExpressConfig.defaultDescription).toBe('An Express starter project created by Xarvis CLI.');
  });

  describe('getProjectName', () => {
    it('should return the project name', () => {
      const createExpressConfig = new CreateExpressConfig('xarvis');
      expect(createExpressConfig.getProjectName()).toBe('xarvis');
    });
  });

  describe('getOutputDirectory', () => {
    it('should return the current working directory when output directory is undefined', () => {
      const createExpressConfig = new CreateExpressConfig('xarvis');
      expect(createExpressConfig.getOutputDirectory()).toBe(process.cwd());
    });

    it('should return the specified output directory when defined', () => {
      const createExpressConfig = new CreateExpressConfig('xarvis', '/path/to/xarvis');
      expect(createExpressConfig.getOutputDirectory()).toBe('/path/to/xarvis');
    });
  });

  describe('getDescription', () => {
    it('should return the specified description if defined', () => {
      const createExpressConfig = new CreateExpressConfig('xarvis', undefined, 'xarvis cli');
      expect(createExpressConfig.getDescription()).toBe('xarvis cli');
    });

    it('should return default description when undefined', () => {
      const createExpressConfig = new CreateExpressConfig('xarvis');
      expect(createExpressConfig.getDescription()).toBe(CreateExpressConfig.defaultDescription);
    });
  });

  describe('getTemplate', () => {
    it('should return the specified template if defined', () => {
      const createExpressConfig = new CreateExpressConfig('xarvis', undefined, undefined, 'typescript');
      expect(createExpressConfig.getTemplate()).toBe('typescript');
    });

    it('should return javascript when template is undefined', () => {
      const createExpressConfig = new CreateExpressConfig('xarvis');
      expect(createExpressConfig.getTemplate()).toBe('javascript');
    });
  });

  describe('shouldInquireDescription', () => {
    it('should return true if the description is same as default description', () => {
      const createExpressConfig = new CreateExpressConfig('xarvis', undefined, CreateExpressConfig.defaultDescription);
      expect(createExpressConfig.shouldInquireDescription()).toBe(true);
    });

    it('should return false if the description is not same as default description', () => {
      const createExpressConfig = new CreateExpressConfig('xarvis', undefined, 'xarvis cli');
      expect(createExpressConfig.shouldInquireDescription()).toBe(false);
    });
  });

  describe('shouldInquireTemplate', () => {
    it('should return true if the template is undefined', () => {
      const createExpressConfig = new CreateExpressConfig('xarvis');
      expect(createExpressConfig.shouldInquireTemplate()).toBe(true);
    });

    it('should return false if the template is specified', () => {
      const createExpressConfig = new CreateExpressConfig('xarvis-cli', undefined, undefined, 'javascript');
      expect(createExpressConfig.shouldInquireTemplate()).toBe(false);
    });
  });

  describe('toString', () => {
    it('should return the readable format of the instance', () => {
      const createExpressConfig = new CreateExpressConfig('xarvis', '/path/to/xarvis', 'xarvis-cli', 'javascript');
      expect(createExpressConfig.toString()).toBe(
        'CreateExpressConfig(projectName: xarvis, outputDirectory: /path/to/xarvis, description: xarvis-cli, template: javascript)'
      );
    });
  });

  describe('copyWith', () => {
    it('returns the same object if no arguments are provided', () => {
      const createExpressConfig = new CreateExpressConfig('xarvis', '/path/to/xarvis', 'xarvis-cli', 'javascript');
      expect(createExpressConfig.copyWith({})).toStrictEqual(createExpressConfig);
    });

    it('returns the same object if every value is passed as undefined', () => {
      const createExpressConfig = new CreateExpressConfig('xarvis', '/path/to/xarvis', 'xarvis-cli', 'javascript');
      expect(
        createExpressConfig.copyWith({
          projectName: undefined,
          outputDirectory: undefined,
          description: undefined,
          template: undefined,
        })
      ).toStrictEqual(createExpressConfig);
    });

    it('returns the new instance with the updated value', () => {
      const createExpressConfig = new CreateExpressConfig('xarvis', '/path/to/xarvis', 'xarvis-cli', 'javascript');
      expect(
        createExpressConfig.copyWith({
          projectName: 'xarvis 2',
          outputDirectory: '/path/to/xarvis/2',
          description: 'xarvis cli 2',
          template: 'typescript',
        })
      ).toStrictEqual(new CreateExpressConfig('xarvis 2', '/path/to/xarvis/2', 'xarvis cli 2', 'typescript'));
    });
  });
});
