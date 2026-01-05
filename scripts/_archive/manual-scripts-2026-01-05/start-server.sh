#!/bin/bash
# Quick Start Script for Termux Hosting
# Run this to start the game server

echo "🐍 Serpent Town v3.2 - Server Startup"
echo "======================================"
echo ""

# Check if we're in the right directory
if [ ! -f "game.html" ]; then
    echo "❌ Error: game.html not found"
    echo "Please run from /root/catalog directory"
    exit 1
fi

echo "📁 Current directory: $(pwd)"
echo "✅ Game files found"
echo ""

# Check if port 8000 is already in use
if lsof -Pi :8000 -sTCP:LISTEN -t >/dev/null 2>&1 ; then
    echo "⚠️  Port 8000 is already in use"
    echo "Stopping existing server..."
    kill $(lsof -t -i:8000) 2>/dev/null
    sleep 1
fi

# Start server
echo "🚀 Starting server on port 8000..."
python3 -m http.server 8000 --bind 0.0.0.0 > /tmp/serpent-server.log 2>&1 &
SERVER_PID=$!
echo $SERVER_PID > /tmp/serpent-server.pid

sleep 2

# Verify server is running
if ps -p $SERVER_PID > /dev/null; then
    echo "✅ Server started successfully!"
    echo ""
    echo "📱 Access the game:"
    echo "   On this device: http://localhost:8000/game.html"
    echo ""
    echo "🌐 Share on network:"
    echo "   Find your IP: ip addr show | grep inet"
    echo "   Then share: http://YOUR_IP:8000/game.html"
    echo ""
    echo "🛑 To stop server:"
    echo "   kill $(cat /tmp/serpent-server.pid)"
    echo ""
    echo "📋 Server PID: $SERVER_PID"
    echo "📝 Logs: /tmp/serpent-server.log"
else
    echo "❌ Failed to start server"
    echo "Check logs: cat /tmp/serpent-server.log"
    exit 1
fi
