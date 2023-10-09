import inquirer from 'inquirer';
import { CreateExpressConfig } from '../../src/config/create-express-config';
import { inquireForMissingCreateExpressConfig } from '../../src/inquirer/create-express-inquirer';

jest.mock('inquirer');

describe('inquireForMissingCreateExpressConfig', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should inquire for description when needed', async () => {
    const createExpressConfig = new CreateExpressConfig('xarvis');
    createExpressConfig.shouldInquireDescription = jest.fn().mockReturnValue(true);
    createExpressConfig.shouldInquireTemplate = jest.fn().mockReturnValue(false);

    (inquirer.prompt as unknown as jest.Mock).mockResolvedValueOnce({ description: 'updated xarvis cli description' });
    const updatedConfig = await inquireForMissingCreateExpressConfig(createExpressConfig);

    expect(inquirer.prompt).toHaveBeenCalledWith([
      {
        type: 'input',
        name: 'description',
        message: 'Enter the project description:',
        default: CreateExpressConfig.defaultDescription,
      },
    ]);
    expect(updatedConfig.getDescription()).toBe('updated xarvis cli description');
  });

  it('should not inquire for description when valid description is provided', async () => {
    const createExpressConfig = new CreateExpressConfig('xarvis');
    createExpressConfig.shouldInquireDescription = jest.fn().mockReturnValue(false);
    createExpressConfig.shouldInquireTemplate = jest.fn().mockReturnValue(false);

    (inquirer.prompt as unknown as jest.Mock).mockResolvedValueOnce({});
    const updatedConfig = await inquireForMissingCreateExpressConfig(createExpressConfig);

    expect(inquirer.prompt).not.toHaveBeenCalledWith(
      expect.arrayContaining([expect.objectContaining({ name: 'description' })])
    );
    expect(updatedConfig.toString()).toBe(createExpressConfig.toString());
  });

  it('should inquire for template when needed', async () => {
    const createExpressConfig = new CreateExpressConfig('xarvis');
    createExpressConfig.shouldInquireDescription = jest.fn().mockReturnValue(false);
    createExpressConfig.shouldInquireTemplate = jest.fn().mockReturnValue(true);

    (inquirer.prompt as unknown as jest.Mock).mockResolvedValueOnce({ template: 'typescript' });
    const updatedConfig = await inquireForMissingCreateExpressConfig(createExpressConfig);

    expect(inquirer.prompt).toHaveBeenCalledWith([
      {
        type: 'list',
        name: 'template',
        message: 'Choose a project template to use:',
        choices: ['javascript', 'typescript'],
        default: 'javascript',
      },
    ]);
    expect(updatedConfig.getTemplate()).toBe('typescript');
  });

  it('should not inquire for template when valid template is provided', async () => {
    const createExpressConfig = new CreateExpressConfig('xarvis');
    createExpressConfig.shouldInquireDescription = jest.fn().mockReturnValue(false);
    createExpressConfig.shouldInquireTemplate = jest.fn().mockReturnValue(false);

    (inquirer.prompt as unknown as jest.Mock).mockResolvedValueOnce({});
    const updatedConfig = await inquireForMissingCreateExpressConfig(createExpressConfig);

    expect(inquirer.prompt).not.toHaveBeenCalledWith(
      expect.arrayContaining([expect.objectContaining({ name: 'template' })])
    );
    expect(updatedConfig.getTemplate()).toBe(createExpressConfig.getTemplate());
  });
});
