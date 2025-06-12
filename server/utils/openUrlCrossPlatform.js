const { exec } = require('child_process');
const logger = require('../../logger');
const fs = require('fs');
const path = require('path');
const os = require('os');

// File-based tracking to avoid duplicate tab opening across process restarts
const LOCK_FILE = path.join(os.tmpdir(), 'netvision-browser-tab.lock');
const LOCK_EXPIRY = 60 * 1000; // 60 seconds - shortened to avoid issues if actual tab is closed

// Utility: Open URL in default browser with file-based tracking to prevent duplicate tabs
let shouldOpen = true;

const deleteLockFileContent = function () {
  try {
    if (fs.existsSync(LOCK_FILE)) {
      fs.writeFileSync(
        LOCK_FILE,
        JSON.stringify({ url: '', timestamp: Date.now() })
      );
      shouldOpen = true;
      logger.debug('Lock file content cleared successfully');
    }
  } catch (err) {
    logger.debug(`Error clearing lock file content: ${err.message}`);
  }
};

const openUrlCrossPlatform = function (url) {
  // Check if we've recently opened a tab by looking at the lock file

  try {
    if (fs.existsSync(LOCK_FILE)) {
      const data = JSON.parse(fs.readFileSync(LOCK_FILE, 'utf8'));
      const fileUrl = data.url;
      const timestamp = data.timestamp;
      const now = Date.now();

      // If the lock file exists and isn't expired, and it's for the same URL, don't open again
      if (fileUrl === url && now - timestamp < LOCK_EXPIRY) {
        logger.info(
          `Browser tab was opened recently (lock file found), preventing duplicate, ${os.tmpdir}`
        );
        shouldOpen = false;
      } else {
        // Lock file expired or for a different URL, update it
        createLockFile(url);
      }
    } else {
      // No lock file exists, create it
      createLockFile(url);
    }
  } catch (err) {
    // If there's any error reading the file, just continue and create a new lock
    logger.debug(`Error reading lock file: ${err.message}`);
    createLockFile(url);
  }

  // Helper function to create or update the lock file
  function createLockFile(urlToSave) {
    try {
      fs.writeFileSync(
        LOCK_FILE,
        JSON.stringify({
          url: urlToSave,
          timestamp: Date.now(),
        })
      );
    } catch (err) {
      logger.debug(`Error writing lock file: ${err.message}`);
    }
  }

  // If we shouldn't open the URL after all our checks, return early
  if (!shouldOpen) {
    return;
  }

  const platform = process.platform;
  let command;

  // Use Chrome specifically on macOS which has better tab reuse
  if (platform === 'darwin') {
    // Try to open in Chrome first, which has better tab reuse
    command = `open -a "Google Chrome" "${url}"`;
  } else if (platform === 'win32') {
    command = `start chrome "${url}"`;
  } else {
    // Linux - try chrome/chromium first
    command = `xdg-open "${url}"`;
  }

  logger.debug(`Opening browser: ${url}`);
  exec(command, (err) => {
    if (err) {
      // Fall back to default browser if Chrome isn't available
      logger.debug('Chrome not found, trying default browser');

      if (platform === 'darwin') {
        exec(`open "${url}"`, (fallbackErr) => {
          if (fallbackErr) {
            logger.error(`Failed to open browser: ${fallbackErr}`);
          }
        });
      } else if (platform === 'win32') {
        exec(`start "" "${url}"`, (fallbackErr) => {
          if (fallbackErr) {
            logger.error(`Failed to open browser: ${fallbackErr}`);
          }
        });
      } else {
        // Already tried xdg-open above
        logger.error(`Failed to open browser: ${err}`);
      }
    }
  });
};

module.exports = {
  openUrlCrossPlatform,
  deleteLockFileContent,
};
