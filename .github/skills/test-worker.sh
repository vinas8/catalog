#!/bin/bash
# Test Cloudflare Worker endpoints
# Usage: Run worker tests

cd /root/catalog/worker || exit 1

echo "🧪 Testing Cloudflare Worker..."
node test-worker.js

exit $?
