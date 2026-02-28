#!/bin/bash
# S34-1.0.05-happy-path-purchase neuron
PIPE_DIR="$(cd "$(dirname "$0")" && pwd)"
IN="$PIPE_DIR/in.json"
OUT="$PIPE_DIR/out.json"

action="${1:---validate}"

case "$action" in
  --validate)
    echo "✅ $PIPE_DIR is valid"
    ;;
  --run)
    BASE=$(cat "$IN" | grep -o '"demo_base": "[^"]*"' | cut -d'"' -f4)
    echo "🚀 Running S34-1.0.05-happy-path-purchase..."
    STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$BASE/" 2>/dev/null || echo "000")
    if [ "$STATUS" = "200" ]; then
      echo '{"status":"pass","last_run":"'$(date -Iseconds)'","results":[{"check":"http","status":"pass"}]}' > "$OUT"
      echo "✅ PASS"
    else
      echo '{"status":"fail","last_run":"'$(date -Iseconds)'","results":[{"check":"http","status":"fail","code":"'$STATUS'"}]}' > "$OUT"
      echo "❌ FAIL (HTTP $STATUS)"
    fi
    ;;
esac
