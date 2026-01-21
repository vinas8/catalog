#!/usr/bin/env node
/**
 * Demo Server - Serves static files + saves demo logs
 * Run: node scripts/demo-server.cjs
 * Port: 8000
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8001;
const ROOT_DIR = path.join(__dirname, '..');
const LOG_DIR = path.join(ROOT_DIR, 'logs/demo');

// Ensure log directory exists
if (!fs.existsSync(LOG_DIR)) {
  fs.mkdirSync(LOG_DIR, { recursive: true });
}

// MIME types
const MIME_TYPES = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  // Handle log saving
  if (req.method === 'POST' && req.url === '/save-log') {
    let body = '';
    
    req.on('data', chunk => {
      body += chunk.toString();
    });
    
    req.on('end', () => {
      try {
        const data = JSON.parse(body);
        const { filename, content } = data;
        
        const filepath = path.join(LOG_DIR, filename);
        fs.writeFileSync(filepath, content);
        
        console.log(`💾 Saved: ${filename}`);
        
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, path: filepath }));
        
      } catch (error) {
        console.error('❌ Save error:', error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: error.message }));
      }
    });
    return;
  }

  // Serve static files
  let filePath = path.join(ROOT_DIR, req.url === '/' ? '/index.html' : req.url.split('?')[0]);
  
  const ext = path.extname(filePath);
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, data) => {
    if (err) {
      if (err.code === 'ENOENT') {
        res.writeHead(404);
        res.end('404 Not Found');
      } else {
        res.writeHead(500);
        res.end('500 Internal Server Error');
      }
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(data);
    }
  });
});

server.listen(PORT, () => {
  console.log(`\n🚀 Demo Server running on http://localhost:${PORT}`);
  console.log(`📁 Logs saved to: ${LOG_DIR}`);
  console.log(`✅ Ready!\n`);
});
