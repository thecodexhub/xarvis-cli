import figlet from 'figlet';
import { showProjectLogoHeader } from '../../src/utils/project-logo-header';

jest.mock('figlet', () => ({
  text: jest.fn(),
}));

describe('showProjectLogoHeader', () => {
  let consoleSpy: jest.SpyInstance;

  beforeEach(() => {
    consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  it('should display the Xarvis CLI logo in ASCII art', async () => {
    const expectedLogo = 'Xarvis CLI';
    (figlet.text as jest.Mock).mockImplementationOnce((text, options, callback) => callback(null, expectedLogo));

    await showProjectLogoHeader();

    expect(figlet.text).toHaveBeenCalledWith(
      'Xarvis CLI',
      {
        font: 'Doom',
        horizontalLayout: 'default',
        verticalLayout: 'default',
      },
      expect.any(Function)
    );

    expect(consoleSpy).toHaveBeenCalledWith('\n');
    expect(consoleSpy).toHaveBeenCalledWith(expectedLogo);
  });

  it('should display a fallback text on error', async () => {
    (figlet.text as jest.Mock).mockImplementationOnce((text, options, callback) => callback(new Error(), ''));

    await showProjectLogoHeader();

    expect(figlet.text).toHaveBeenCalledWith(
      'Xarvis CLI',
      {
        font: 'Doom',
        horizontalLayout: 'default',
        verticalLayout: 'default',
      },
      expect.any(Function)
    );

    expect(consoleSpy).toHaveBeenCalledWith('\n');
    expect(consoleSpy).toHaveBeenCalledWith('\n\n   Xarvis CLI\n\n');
  });
});
