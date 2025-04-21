const path = require('path');
const { getDefaultConfig } = require('@react-native/metro-config');
const { getConfig } = require('react-native-builder-bob/metro-config');
const pkg = require('../package.json');

const { withNetVision } = require('../metro');

// const { withNetVision } = require('@omeratt/rn-net-vision/metro');

const root = path.resolve(__dirname, '..');

/**
 * Metro configuration
 * https://facebook.github.io/metro/docs/configuration
 *
 * @type {import('metro-config').MetroConfig}
 */
module.exports = getConfig(
  withNetVision(getDefaultConfig(__dirname), __dirname),
  {
    root,
    pkg,
    project: __dirname,
  }
);

// module.exports = (async () => {
//   const defaultConfig = await getDefaultConfig(__dirname);

//   defaultConfig.server = defaultConfig.server || {};
//   defaultConfig.server.enhanceMiddleware = enhanceMetroMiddleware({
//     projectRoot: __dirname,
//   });

//   console.log('✅ [NetVision] enhanceMiddleware attached to Metro');

//   return getConfig(defaultConfig, {
//     root,
//     pkg,
//     project: __dirname,
//   });
// })();
