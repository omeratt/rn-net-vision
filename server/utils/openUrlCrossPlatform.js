const { exec } = require('child_process');
const logger = require('../../logger');

// Utility: Open URL in default browser (Cross-Platform)
module.exports = function openUrlCrossPlatform(url) {
  const platform = process.platform;

  let command;
  if (platform === 'darwin') {
    command = `open "${url}"`;
  } else if (platform === 'win32') {
    command = `start "" "${url}"`;
  } else {
    command = `xdg-open "${url}"`;
  }

  exec(command, (err) => {
    if (err) {
      logger.error(`Failed to open browser: ${err}`);
    }
  });
};
