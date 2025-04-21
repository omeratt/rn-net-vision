// enhanceMetroMiddleware.js

const path = require('path');
const fs = require('fs');
const { spawn } = require('child_process');

module.exports = function enhanceMetroMiddleware({ projectRoot }) {
  console.log('[NetVision] Middleware activated');

  let absDebuggerPath = path.join(
    projectRoot,
    'node_modules',
    '@omeratt',
    'rn-net-vision',
    'server',
    'start-debugger.js'
  );

  if (!fs.existsSync(absDebuggerPath)) {
    // fallback – מצב פיתוח
    absDebuggerPath = path.join(
      projectRoot,
      '..',
      'server',
      'start-debugger.js'
    );
  }

  return function middlewareWrapper(middleware) {
    return (req, res, next) => {
      if (req.url === '/net-vision-trigger' && req.method === 'POST') {
        try {
          spawn('node', [absDebuggerPath], {
            cwd: projectRoot,
            shell: true,
            detached: true,
            stdio: 'ignore',
          }).unref();

          res.writeHead(200);
          res.end('NetVision launched');
        } catch (err) {
          console.error('[NetVision] Failed to launch:', err);
          res.writeHead(500);
          res.end('NetVision failed');
        }
      } else {
        return middleware(req, res, next);
      }
    };
  };
};
