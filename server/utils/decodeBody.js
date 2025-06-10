const zlib = require('zlib');
const { Buffer } = require('node:buffer');
const logger = require('../../logger');
/**
 * @param {string} encoding
 * @param {string} body
 * @returns {Promise<string|null>}
 */
function decodeResponseBody(encoding, base64Body) {
  return new Promise((resolve, reject) => {
    if (!base64Body || typeof base64Body !== 'string') return resolve(null);
    const buffer = Buffer.from(base64Body, 'base64'); // Decode base64

    if (encoding?.includes?.('gzip')) {
      zlib.gunzip(buffer, (err, decoded) => {
        if (err) {
          logger.error(`🔥 Gunzip failed: ${err.message}`);
          return resolve(null);
        }
        resolve(decoded.toString('utf-8'));
      });
    } else {
      resolve(buffer.toString('utf-8'));
    }
  });
}

module.exports = { decodeResponseBody };
