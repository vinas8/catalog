#!/usr/bin/env python3
"""
Trigger wrangler CLI to clear all KV namespaces
Reads namespaces from wrangler.toml and clears all keys
"""

import subprocess
import json
import re
from pathlib import Path

# Read wrangler.toml to get all KV namespace IDs
wrangler_path = Path(__file__).parent.parent / "worker" / "wrangler.toml"
wrangler_toml = wrangler_path.read_text()

# Parse KV namespaces
namespaces = []
pattern = r'binding\s*=\s*"([^"]+)"[\s\S]*?id\s*=\s*"([^"]+)"'
for match in re.finditer(pattern, wrangler_toml):
    namespaces.append({
        'binding': match.group(1),
        'id': match.group(2)
    })

print(f"🗑️  Clearing {len(namespaces)} KV namespaces...\n")

results = []
worker_dir = Path(__file__).parent.parent / "worker"

for ns in namespaces:
    try:
        print(f"📦 {ns['binding']} ({ns['id']})")
        
        # List all keys
        list_cmd = ['npx', 'wrangler', 'kv:key', 'list', f"--namespace-id={ns['id']}"]
        list_output = subprocess.check_output(list_cmd, cwd=worker_dir, text=True)
        keys = json.loads(list_output)
        
        print(f"   Found {len(keys)} keys")
        
        if len(keys) == 0:
            results.append({'namespace': ns['binding'], 'deleted': 0, 'success': True})
            continue
        
        # Delete each key
        deleted = 0
        for key in keys:
            try:
                delete_cmd = ['npx', 'wrangler', 'kv:key', 'delete', key['name'], f"--namespace-id={ns['id']}"]
                subprocess.run(delete_cmd, cwd=worker_dir, capture_output=True, check=True)
                deleted += 1
            except subprocess.CalledProcessError:
                print(f"   ❌ Failed to delete: {key['name']}")
        
        print(f"   ✅ Deleted {deleted}/{len(keys)} keys\n")
        results.append({
            'namespace': ns['binding'],
            'deleted': deleted,
            'total': len(keys),
            'success': True
        })
        
    except Exception as err:
        print(f"   ❌ Error: {err}\n")
        results.append({'namespace': ns['binding'], 'success': False, 'error': str(err)})

print('\n📊 Summary:')
print(json.dumps(results, indent=2))

total_deleted = sum(r.get('deleted', 0) for r in results)
print(f"\n✅ Total keys deleted: {total_deleted}")
