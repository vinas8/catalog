#!/usr/bin/env python3
"""Simple HTTP upload server for Termux"""

from http.server import HTTPServer, BaseHTTPRequestHandler
import os

class UploadHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        self.send_response(200)
        self.send_header('Content-type', 'text/html')
        self.end_headers()
        html = '''
        <html><body>
        <h2>📤 Upload File to Termux</h2>
        <form method="POST" enctype="multipart/form-data">
            <input type="file" name="file" required>
            <button type="submit">Upload</button>
        </form>
        </body></html>
        '''
        self.wfile.write(html.encode())
    
    def do_POST(self):
        content_length = int(self.headers['Content-Length'])
        boundary = self.headers['Content-Type'].split('boundary=')[1].encode()
        
        line = self.rfile.readline()
        remaining = content_length - len(line)
        
        line = self.rfile.readline()
        remaining -= len(line)
        
        filename = line.decode().split('filename="')[1].split('"')[0]
        
        line = self.rfile.readline()
        remaining -= len(line)
        line = self.rfile.readline()
        remaining -= len(line)
        
        filepath = os.path.join('/root/catalog', filename)
        with open(filepath, 'wb') as f:
            data = self.rfile.read(remaining - len(boundary) - 8)
            f.write(data)
        
        self.send_response(200)
        self.send_header('Content-type', 'text/html')
        self.end_headers()
        self.wfile.write(f'<html><body><h2>✅ Uploaded: {filename}</h2><a href="/">Upload another</a></body></html>'.encode())

if __name__ == '__main__':
    print('📤 Upload server running on http://localhost:8080')
    print('Open this URL in your phone browser to upload files!')
    HTTPServer(('0.0.0.0', 8080), UploadHandler).serve_forever()
