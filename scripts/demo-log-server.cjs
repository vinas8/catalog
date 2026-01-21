#!/usr/bin/env node
/**
 * Demo Log Server - Saves demo scenario logs to files
 * Run: node scripts/demo-log-server.js
 * Port: 8001
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8001;
const LOG_DIR = path.join(__dirname, '../logs/demo');

// Ensure log directory exists
if (!fs.existsSync(LOG_DIR)) {
  fs.mkdirSync(LOG_DIR, { recursive: true });
  console.log(`📁 Created ${LOG_DIR}`);
}

const server = http.createServer((req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  if (req.method === 'POST' && req.url === '/log') {
    let body = '';
    
    req.on('data', chunk => {
      body += chunk.toString();
    });
    
    req.on('end', () => {
      try {
        const data = JSON.parse(body);
        const { scenario, smri, timestamp, level, message } = data;
        
        // Create filename: S9.2.3.10.01_2026-01-21_00-30-00.log
        const date = new Date(timestamp);
        const dateStr = date.toISOString().split('T')[0];
        const timeStr = date.toTimeString().split(' ')[0].replace(/:/g, '-');
        const filename = `${smri || 'unknown'}_${dateStr}_${timeStr}.log`;
        const filepath = path.join(LOG_DIR, filename);
        
        // Format log line
        const logLine = `[${new Date(timestamp).toISOString()}] ${level.toUpperCase()}: ${message}\n`;
        
        // Append to file
        fs.appendFileSync(filepath, logLine);
        
        console.log(`📝 ${filename}: ${message.substring(0, 60)}...`);
        
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, file: filename }));
        
      } catch (error) {
        console.error('❌ Log error:', error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: error.message }));
      }
    });
    
  } else if (req.method === 'POST' && req.url === '/save-batch') {
    let body = '';
    
    req.on('data', chunk => {
      body += chunk.toString();
    });
    
    req.on('end', () => {
      try {
        const data = JSON.parse(body);
        const { smri, title, timestamp, logs } = data;
        
        // Create filename with current timestamp
        const date = new Date();
        const dateStr = date.toISOString().split('T')[0];
        const timeStr = date.toTimeString().split(' ')[0].replace(/:/g, '-');
        const filename = `${smri}_${dateStr}_${timeStr}.log`;
        const filepath = path.join(LOG_DIR, filename);
        
        // Write header + all logs
        const header = `=== ${title} (${smri}) ===\n=== Started: ${timestamp} ===\n\n`;
        const content = header + logs + '\n';
        
        // Write to file (overwrite if exists to consolidate)
        fs.writeFileSync(filepath, content);
        
        console.log(`💾 ${filename}: Saved batch (${logs.split('\n').length} lines)`);
        
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, file: filename }));
        
      } catch (error) {
        console.error('❌ Batch save error:', error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: error.message }));
      }
    });
    
  } else {
    res.writeHead(404);
    res.end('Not Found');
  }
});

server.listen(PORT, () => {
  console.log(`\n🚀 Demo Log Server running on http://localhost:${PORT}`);
  console.log(`📁 Logs saved to: ${LOG_DIR}`);
  console.log(`✅ Ready to receive logs!\n`);
});
