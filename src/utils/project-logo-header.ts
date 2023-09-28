import figlet from 'figlet';

/**
 * Displays the Xarvis CLI project logo using ASCII art.
 * @returns {Promise<void>} A promise that resolves after displaying the logo.
 */
export const showProjectLogoHeader = async (): Promise<void> => {
  return new Promise<void>((resolve) => {
    console.log('\n');
    figlet.text(
      'Xarvis CLI',
      {
        font: 'Doom',
        horizontalLayout: 'default',
        verticalLayout: 'default',
      },
      function (err, data) {
        if (err) {
          console.log('\n\n   Xarvis CLI\n\n');
        } else {
          console.log(data);
        }
        resolve();
      }
    );
  });
};
