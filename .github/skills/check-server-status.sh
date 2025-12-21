#!/bin/bash
# Check server status WITHOUT modifying anything
# Usage: Returns server process info if running

echo "⚠️  REMINDER: Do not modify or restart servers"
echo "📋 Server status (read-only check):"
echo ""

# Check if processes are running
ps aux | grep -E "(python.*server|start-server)" | grep -v grep || echo "No servers running"

exit 0
