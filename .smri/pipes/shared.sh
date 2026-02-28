#!/bin/bash
# pipes/shared.sh — SMRI shared library for all neuron.sh scripts
# Source at top: source "${SMRI_DIR:-$HOME/.smri}/pipes/shared.sh"
# Provides: pipe context loading, logging, playwright bridge, pipe discovery
# When updated → update all copies: find ~ -name shared.sh -path "*smri*"

SMRI_DIR="${SMRI_DIR:-$HOME/.smri}"
SMRI_PIPES="${SMRI_DIR}/pipes"

# ── Auto-load pipe context ───────────────────────────────
# Detects calling pipe dir and loads README, in, out, data
_smri_load_pipe_context() {
  local caller="${BASH_SOURCE[1]:-}"
  [[ -z "$caller" ]] && return
  PIPE_DIR="$(cd "$(dirname "$caller")" && pwd)"
  PIPE_ID="$(basename "$PIPE_DIR")"
  PIPE_README=""; PIPE_IN=""; PIPE_OUT=""; PIPE_DATA=""
  [[ -f "$PIPE_DIR/README.md" ]] && PIPE_README=$(cat "$PIPE_DIR/README.md")
  [[ -f "$PIPE_DIR/in.json" ]] && PIPE_IN=$(cat "$PIPE_DIR/in.json")
  [[ -f "$PIPE_DIR/out.json" ]] && PIPE_OUT=$(cat "$PIPE_DIR/out.json")
  [[ -f "$PIPE_DIR/data.json" ]] && PIPE_DATA=$(cat "$PIPE_DIR/data.json")
}
_smri_load_pipe_context

# ── README Loader ────────────────────────────────────────
_smri_load_readme() {
  local pipe_dir="${1:-${PIPE_DIR:-$(pwd)}}"
  [[ -f "$pipe_dir/README.md" ]] && cat "$pipe_dir/README.md" || echo "(no README)"
}

# Load all pipe READMEs as indexed context
_smri_load_all_readmes() {
  while IFS= read -r neuron; do
    local d=$(dirname "$neuron")
    local name=$(basename "$d")
    [[ -f "$d/README.md" ]] && echo "=== $name ===" && head -30 "$d/README.md" && echo ""
  done < <(find "$SMRI_PIPES" -name "neuron.sh" -not -path "*/shared*" 2>/dev/null)
}

# ── Logging ──────────────────────────────────────────────
# Save pipe log with descriptive name (4-word prompt description, never random)
_smri_log_save() {
  local pipe_id="${PIPE_ID:-unknown}"
  local output="$1"
  local status="${2:-ok}"
  local desc_name="$3"
  local log_dir="${SMRI_DIR}/data/pipe-logs/$pipe_id"
  mkdir -p "$log_dir"
  local run_name
  if [ -n "$desc_name" ]; then
    run_name=$(echo "$desc_name" | tr ' ' '-' | tr '[:upper:]' '[:lower:]' | cut -c1-60)
  else
    run_name="${pipe_id}-${ACTION:-run}"
  fi
  local run_dir="$log_dir/$run_name"
  mkdir -p "$run_dir"
  echo "$output" > "$run_dir/output.json"
  cat > "$run_dir/meta.json" << METAEOF
{"pipe":"$pipe_id","timestamp":"$(date -Iseconds)","status":"$status","run_name":"$run_name"}
METAEOF
  local count=$(ls -dt "$log_dir"/*/ 2>/dev/null | wc -l)
  [ "$count" -gt 20 ] && ls -dt "$log_dir"/*/ | tail -n +21 | xargs rm -rf
}

# ── Footer (auto-log execution) ─────────────────────────
_smri_footer() {
  local desc="${PIPE_ID:-unknown}-${ACTION:-run}"
  _smri_log_save "{\"pipe\":\"${PIPE_ID:-unknown}\",\"action\":\"${ACTION:-status}\",\"timestamp\":\"$(date -Iseconds)\"}" "ok" "$desc" 2>/dev/null || true
}

# ── Playwright Bridge ────────────────────────────────────
_smri_run_playwright() {
  local larch="${LARCH_DIR:-$HOME/larchsupply/src}"
  local base_url="${BASE_URL:-http://localhost:8888}"
  local spec="${1:-${SPEC:-}}"
  local mode="${2:-regression}"
  [ ! -d "$larch" ] && echo "❌ LarchSupply not found at $larch" && return 1
  cd "$larch"
  local extra_args=""
  [ "$mode" = "demo" ] && export DEMO=true && extra_args="--headed"
  [ -n "$spec" ] && extra_args="$extra_args tests/playwright/$spec"
  BASE_URL="$base_url" npx playwright test $extra_args 2>&1
}

# ── Pipe Discovery ───────────────────────────────────────
_smri_find_action() {
  local search="${1:?}" hint="${2:-}"
  local MATCHES=() MATCH_PATHS=()
  for smri_root in $(find /home/vinas -maxdepth 4 -name ".smri" -type d 2>/dev/null); do
    while IFS= read -r infile; do
      [ -f "$infile" ] || continue
      local pipe_dir=$(basename "$(dirname "$infile")")
      local pipe_full=$(dirname "$infile")
      local pipe_action=$(jq -r '.action // ""' "$infile" 2>/dev/null)
      if echo "$pipe_action $pipe_dir" | grep -qi "$search"; then
        MATCHES+=("$pipe_dir"); MATCH_PATHS+=("$pipe_full")
      fi
    done < <(find "$smri_root/pipes" -name "in.json" -not -path "*/shared*" 2>/dev/null)
  done
  if [[ -n "$hint" && ${#MATCHES[@]} -gt 1 ]]; then
    for i in "${!MATCHES[@]}"; do
      echo "${MATCHES[$i]}" | grep -qi "$hint" && MATCHES=("${MATCHES[$i]}") && MATCH_PATHS=("${MATCH_PATHS[$i]}") && break
    done
  fi
  if [[ ${#MATCHES[@]} -eq 0 ]]; then
    echo "{\"found\":0,\"action\":\"$search\"}"
  elif [[ ${#MATCHES[@]} -eq 1 ]]; then
    echo "━━━ Found: ${MATCHES[0]} ━━━"
    echo "${MATCH_PATHS[0]}"
  else
    echo "{\"found\":${#MATCHES[@]},\"action\":\"$search\",\"pipes\":[$(printf '"%s",' "${MATCHES[@]}" | sed 's/,$//')]}"
  fi
}
