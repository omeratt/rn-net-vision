// serve-dist.js
import http from 'http';
import { createReadStream, existsSync } from 'fs';
import { extname, join, dirname } from 'path';
import { fileURLToPath } from 'url';
import logger from '../logger.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Robust dist directory detection - try multiple possible locations
let DIST_DIR = join(__dirname, 'dist');

// If dist doesn't exist at the expected location, try alternative locations
if (!existsSync(DIST_DIR)) {
  // Check if we're in the published package structure
  DIST_DIR = __dirname; // Fallback to the current directory
  console.log(
    `⚠️ Could not find dist folder at ${join(__dirname, 'dist')}, using ${DIST_DIR} instead`
  );
}

function serveStaticFile(req, res) {
  const url = req.url === '/' ? '/index.html' : req.url;
  const filePath = join(DIST_DIR, url);
  const ext = extname(filePath);

  if (!existsSync(filePath)) {
    res.writeHead(404);
    res.end(`Not found path: ${filePath}`);
    return;
  }

  const mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.ico': 'image/x-icon',
    '.png': 'image/png',
  };

  res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'text/plain' });
  createReadStream(filePath).pipe(res);
}

const PORT = 5173;

http
  .createServer((req, res) => {
    serveStaticFile(req, res);
  })
  .listen(PORT, () => {
    logger.info(`✅ Serving dist on http://localhost:${PORT}`);
  });
