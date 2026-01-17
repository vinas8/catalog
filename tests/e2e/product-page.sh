#!/bin/bash
# Product Page E2E Test Runner
# Tests product page with real HTTP server

set -e

echo "🧪 Product Page E2E Tests"
echo "=========================="
echo ""

# Start HTTP server
echo "🚀 Starting HTTP server..."
python3 -m http.server 8080 --bind 0.0.0.0 > /tmp/server.log 2>&1 &
SERVER_PID=$!
echo "   Server PID: $SERVER_PID"

# Wait for server to start
sleep 2

# Cleanup function
cleanup() {
  echo ""
  echo "🧹 Cleaning up..."
  kill $SERVER_PID 2>/dev/null || true
  echo "✅ Server stopped"
}

trap cleanup EXIT

# Run tests
echo ""
echo "▶️  Running Node.js tests..."
echo ""
node tests/e2e/product-page.test.mjs

echo ""
echo "🎉 All tests passed!"
