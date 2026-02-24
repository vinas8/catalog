const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 8000;
const CATALOG_ROOT = process.env.CATALOG_ROOT || path.join(__dirname, '..');
const DASHBOARD_DIR = path.join(__dirname, 'dashboard');

const MIME = {
    '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css',
    '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg',
    '.svg': 'image/svg+xml', '.ico': 'image/x-icon', '.woff2': 'font/woff2',
    '.webp': 'image/webp', '.gif': 'image/gif', '.map': 'application/json',
};

function serve(res, filePath) {
    if (!fs.existsSync(filePath)) {
        res.writeHead(404);
        res.end('Not found');
        return;
    }
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
        const idx = path.join(filePath, 'index.html');
        if (fs.existsSync(idx)) { filePath = idx; }
        else { res.writeHead(404); res.end('Not found'); return; }
    }
    const ext = path.extname(filePath).toLowerCase();
    const mime = MIME[ext] || 'application/octet-stream';
    res.writeHead(200, { 
        'Content-Type': mime, 
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'no-cache'
    });
    fs.createReadStream(filePath).pipe(res);
}

const server = http.createServer((req, res) => {
    const url = decodeURIComponent(req.url.split('?')[0]);

    // SMRI dashboard at /smri/
    if (url.startsWith('/smri/')) {
        const rel = url.slice(6) || 'index.html';
        serve(res, path.join(DASHBOARD_DIR, rel));
        return;
    }

    // Everything else serves from catalog root
    const rel = url === '/' ? 'index.html' : url.slice(1);
    serve(res, path.join(CATALOG_ROOT, rel));
});

server.listen(PORT, '0.0.0.0', () => {
    console.log(`Catalog server running on port ${PORT}`);
    console.log(`  Site: http://localhost:${PORT}/`);
    console.log(`  SMRI: http://localhost:${PORT}/smri/executor/`);
});
