// serve-dist.js
import http from 'http';
import { createReadStream, existsSync } from 'fs';
import { extname, join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const DIST_DIR = join(__dirname, '..', 'web-viewer', 'dist');

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
    console.log(`✅ Serving dist on http://localhost:${PORT}`);
  });
