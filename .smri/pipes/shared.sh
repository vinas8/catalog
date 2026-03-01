#!/bin/bash
# pipes/shared.sh — SMRI v3 shared library for all neuron.sh scripts
# Source at top: source "${SMRI_DIR:-$HOME/.smri}/pipes/shared.sh"
# When updated → copy to ALL projects: find ~ -name shared.sh -path "*smri*"

SMRI_DIR="${SMRI_DIR:-$HOME/.smri}"
source "${SMRI_DIR}/config.sh"
SMRI_PIPES="${SMRI_PIPES_DIR}"
SMRI_DATA="${SMRI_DATA_DIR}"
SMRI_LOG="${SMRI_LOG_DIR}"

# ── Relation Hash Resolution ─────────────────────────────
# Resolve hash → full relation string
_smri_resolve_hash() {
  local hash="$1"
  [[ "$hash" == "0" || "$hash" == "X" ]] && echo "$hash" && return
  echo "${SMRI_RELATION_HASH[$hash]:-$hash}"
}

# Generate hash from relation string
_smri_hash_relation() {
  local rel="$1"
  [[ "$rel" == "0" || "$rel" == "X" ]] && echo "$rel" && return
  echo -n "$rel" | md5sum | cut -c1-6
}

# Expand pipe ID: replace hash segment with full relation
_smri_expand_pipe_id() {
  local pipe_id="$1"
  local IFS='.'; read -ra parts <<< "$pipe_id"
  [[ ${#parts[@]} -lt 2 ]] && echo "$pipe_id" && return
  parts[1]="$(_smri_resolve_hash "${parts[1]}")"
  local result="${parts[0]}"
  for ((i=1; i<${#parts[@]}; i++)); do result+=".${parts[i]}"; done
  echo "$result"
}

# ── Auto-load pipe context ───────────────────────────────
_smri_load_pipe_context() {
  # BASH_SOURCE[0]=shared.sh, [1]=shared.sh (call site), [2]=neuron.sh that sourced us
  local caller="${BASH_SOURCE[2]:-${BASH_SOURCE[1]:-}}"
  [[ -z "$caller" ]] && return
  PIPE_DIR="$(cd "$(dirname "$caller")" && pwd)"
  PIPE_FOLDER="$(basename "$PIPE_DIR")"
  # Derive pipe ID: S0-smri/0-conductor/X/00-name → S0-0.X.00-name
  local rel="${PIPE_DIR#${SMRI_PIPES}/}"
  # Handle project pipes too
  for pdir in "${SMRI_PROJECT_PIPE_DIRS[@]:-}"; do
    [[ -n "$pdir" && "$PIPE_DIR" == "$pdir"/* ]] && rel="${PIPE_DIR#${pdir}/}"
  done
  local IFS='/'; read -ra segs <<< "$rel"
  if [[ ${#segs[@]} -ge 4 ]]; then
    # S0-smri/0-conductor/X/00-name → S0-0.X.00-name (strip labels)
    local mod="${segs[0]%%-*}" sub="${segs[1]%%-*}"
    PIPE_ID="${mod}-${sub}.${segs[2]}.${segs[3]}"
  else
    PIPE_ID="$(echo "$rel" | tr '/' '.')"
  fi
  PIPE_ID_FULL="$(_smri_expand_pipe_id "$PIPE_ID")"
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
  while IFS= read -r readme; do
    local d=$(dirname "$readme")
    local pipe_id="$(_smri_path_to_id "$SMRI_PIPES" "$d")"
    echo "=== $pipe_id ==="
    head -30 "$readme"
    echo ""
  done < <(find "$SMRI_PIPES" -name "README.md" -path "*/S*" 2>/dev/null | sort)
  # Also load project pipe READMEs
  for pdir in "${SMRI_PROJECT_PIPE_DIRS[@]:-}"; do
    [[ -d "$pdir" ]] || continue
    while IFS= read -r readme; do
      local d=$(dirname "$readme")
      local pipe_id="$(_smri_path_to_id "$pdir" "$d")"
      echo "=== $pipe_id (project) ==="
      head -30 "$readme"
      echo ""
    done < <(find "$pdir" -name "README.md" -path "*/S*" 2>/dev/null | sort)
  done
}

# ── Pipe Map ─────────────────────────────────────────────
_smri_pipe_map_bump() {
  local chain_json="$1"
  [[ ! -f "$SMRI_PIPE_MAP" ]] && echo '[]' > "$SMRI_PIPE_MAP"
  local tmp=$(mktemp)
  # Find existing entry with same chain, bump count or append new
  local idx=$(jq --argjson c "$chain_json" 'to_entries | map(select(.value.chain == $c)) | .[0].key // -1' "$SMRI_PIPE_MAP")
  if [[ "$idx" != "-1" && "$idx" != "null" ]]; then
    jq --argjson i "$idx" '.[$i].count += 1' "$SMRI_PIPE_MAP" > "$tmp" && mv "$tmp" "$SMRI_PIPE_MAP"
    jq --argjson i "$idx" '.[$i].count' "$SMRI_PIPE_MAP"
  else
    jq --argjson c "$chain_json" '. += [{chain: $c, count: 1}]' "$SMRI_PIPE_MAP" > "$tmp" && mv "$tmp" "$SMRI_PIPE_MAP"
    echo 1
  fi
}

# ── Prompt Log ───────────────────────────────────────────
_smri_prompt_log() {
  local text="$1" chain="$2"
  local logfile="${SMRI_DATA}/prompt-log/$(date +%Y-%m-%d_%H%M%S).json"
  mkdir -p "${SMRI_DATA}/prompt-log"
  cat > "$logfile" << LOGEOF
{"timestamp":"$(date -Iseconds)","prompt":"$text","chain":$chain}
LOGEOF
}

# ── Playwright Bridge ────────────────────────────────────
_smri_run_playwright() {
  local larch="${LARCH_DIR:-$HOME/larchsupply/src}"
  local base_url="${BASE_URL:-${LARCH_URL}}"
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
_smri_find_pipes() {
  local search="${1:?}"
  local results=()
  while IFS= read -r readme; do
    local d=$(dirname "$readme")
    local pipe_id="$(_smri_path_to_id "$SMRI_PIPES" "$d")"
    if echo "$pipe_id $(head -5 "$readme")" | grep -qiE "$search"; then
      results+=("$pipe_id")
    fi
  done < <(find "$SMRI_PIPES" -name "README.md" -path "*/S*" 2>/dev/null | sort)
  printf '%s\n' "${results[@]}"
}

# ── Resolve pipe ID to filesystem path ────────────────────
_smri_id_to_path() {
  local pipe_id="$1"
  local IFS='.'; read -ra parts <<< "$pipe_id"
  [[ ${#parts[@]} -lt 3 ]] && return 1
  local mod="${parts[0]%%-*}" sub="${parts[0]#*-}"  # S0-1 → S0, 1
  local rel="${parts[1]}"
  local idx="${parts[2]}"
  # Search all pipe dirs for matching module/submodule/relation/index
  local search_dirs=("$SMRI_PIPES")
  for pdir in "${SMRI_PROJECT_PIPE_DIRS[@]:-}"; do
    [[ -d "$pdir" ]] && search_dirs+=("$pdir")
  done
  for base in "${search_dirs[@]}"; do
    for mod_dir in "$base"/${mod}-*/; do
      [[ ! -d "$mod_dir" ]] && continue
      for sub_dir in "$mod_dir"${sub}-*/; do
        [[ ! -d "$sub_dir" ]] && continue
        local target="${sub_dir}${rel}/${idx}"
        [[ -d "$target" ]] && echo "$target" && return 0
      done
    done
  done
  return 1
}

# ── Derive pipe ID from path ──────────────────────────────
_smri_path_to_id() {
  local base="$1" full="$2"
  local rel="${full#${base}/}"
  local IFS='/'; read -ra segs <<< "$rel"
  if [[ ${#segs[@]} -ge 4 ]]; then
    local mod="${segs[0]%%-*}" sub="${segs[1]%%-*}"
    echo "${mod}-${sub}.${segs[2]}.${segs[3]}"
  else
    echo "$rel" | tr '/' '.'
  fi
}

# ── Step Logging (temp files) ────────────────────────────
_smri_init_steps() {
  rm -rf "${SMRI_DATA}/steps"
  mkdir -p "${SMRI_DATA}/steps"
}

# Write step output to temp file — args-based, no stdin needed
_smri_write_step() {
  local pipe_id="$1" command="$2" output="$3"
  local steps_dir="${SMRI_DATA}/steps"
  mkdir -p "$steps_dir"
  local seq=$(find "$steps_dir" -maxdepth 1 -name "*.json" 2>/dev/null | wc -l)
  local safe_id=$(echo "$pipe_id" | tr '.' '-')
  local out_json
  out_json=$(echo "$output" | jq -R . | jq -s .)
  jq -n --arg id "$pipe_id" --arg cmd "$command" --argjson out "$out_json" \
    '{pipe: $id, command: $cmd, output: $out}' > "$steps_dir/${seq}-${safe_id}.json"
}

# Backward compat: accepts output as $3 or stdin
_smri_append_step() {
  local pipe_id="$1" command="$2"
  local output="${3:-$(cat)}"
  _smri_write_step "$pipe_id" "$command" "$output"
}

# ── Extract agent-relevant sections from README ──────────
# Looks for ## Agent* sections (e.g. "## Agent Approach", "## Agent Rules")
_smri_readme_agent_section() {
  local readme="$1"
  [[ ! -f "$readme" ]] && return
  sed -n '/^## Agent/,/^## [^A]/p' "$readme" | sed '${ /^## [^A]/d }'
}

# ── Run Pipe (execute + auto-log full output) ────────────
_smri_run_pipe() {
  local pipe_id="$1"; shift
  local pipe_path
  pipe_path="$(_smri_id_to_path "$pipe_id")"
  if [[ $? -ne 0 || -z "$pipe_path" ]]; then
    local err="❌ Pipe not found: $pipe_id"
    echo "$err" >&2
    _smri_write_step "$pipe_id" "resolve" "$err"
    return 1
  fi
  # Surface agent instructions from README if present
  local agent_ctx
  agent_ctx="$(_smri_readme_agent_section "${pipe_path}/README.md")"
  local cmd="bash ${pipe_path}/neuron.sh $*"
  local output exit_code
  output=$(bash "${pipe_path}/neuron.sh" "$@" 2>&1)
  exit_code=$?
  if [[ -n "$agent_ctx" ]]; then
    output="[README: ${pipe_id}]
${agent_ctx}
[/README]
${output}"
  fi
  echo "$output"
  if [[ $exit_code -ne 0 ]]; then
    _smri_write_step "$pipe_id" "$cmd" "EXIT $exit_code: $output"
    echo "⚠ STEP LOGGED (FAILED): $pipe_id" >&2
    return $exit_code
  fi
  _smri_write_step "$pipe_id" "$cmd" "$output"
  echo "✓ STEP LOGGED: $pipe_id" >&2
}

# ── Tree ─────────────────────────────────────────────────
_smri_tree() {
  find -L "$SMRI_PIPES" -name "README.md" -path "*/S*" -exec dirname {} \; 2>/dev/null | sort | while read -r d; do
    local pid="$(_smri_path_to_id "$SMRI_PIPES" "$d")"
    echo "$pid → $(_smri_expand_pipe_id "$pid")"
  done
}

# ── Pipe Tests ───────────────────────────────────────────
# Run test.sh for one pipe or all pipes. test.sh is optional (max 5 files still).
# test.sh must exit 0 on pass, non-zero on fail, and print results to stdout.
_smri_test_pipe() {
  local pipe_id="$1"
  local pipe_path
  pipe_path="$(_smri_id_to_path "$pipe_id")"
  [[ $? -ne 0 || -z "$pipe_path" ]] && echo "❌ Pipe not found: $pipe_id" && return 1
  [[ ! -f "$pipe_path/test.sh" ]] && echo "⊘ $pipe_id: no test.sh" && return 0
  local output exit_code
  output=$(bash "$pipe_path/test.sh" 2>&1)
  exit_code=$?
  if [[ $exit_code -eq 0 ]]; then
    echo "✅ $pipe_id: PASS"
  else
    echo "❌ $pipe_id: FAIL (exit $exit_code)"
    echo "$output"
  fi
  return $exit_code
}

_smri_run_tests() {
  local target="${1:-all}"
  local passed=0 failed=0 skipped=0
  echo "━━━ SMRI Pipe Tests ━━━"
  if [[ "$target" != "all" ]]; then
    _smri_test_pipe "$target"
    return $?
  fi
  while IFS= read -r nsh; do
    local d=$(dirname "$nsh")
    local pid="$(_smri_path_to_id "$SMRI_PIPES" "$d")"
    if [[ ! -f "$d/test.sh" ]]; then
      ((skipped++))
      continue
    fi
    _smri_test_pipe "$pid"
    [[ $? -eq 0 ]] && ((passed++)) || ((failed++))
  done < <(find "$SMRI_PIPES" -name "neuron.sh" -path "*/S*" 2>/dev/null | sort)
  echo "━━━ Results: $passed passed, $failed failed, $skipped skipped ━━━"
  [[ $failed -gt 0 ]] && return 1 || return 0
}