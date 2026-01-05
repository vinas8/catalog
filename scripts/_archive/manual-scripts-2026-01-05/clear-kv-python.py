#!/usr/bin/env python3
"""
Clear all KV data using Cloudflare API
"""
import os
import json
import requests
from pathlib import Path

# Load environment variables
env_file = Path(__file__).parent.parent / '.env'
env_vars = {}
with open(env_file) as f:
    for line in f:
        if '=' in line and not line.startswith('#'):
            key, value = line.strip().split('=', 1)
            env_vars[key] = value

API_TOKEN = env_vars.get('CLOUDFLARE_API_TOKEN')
ACCOUNT_ID = env_vars.get('CLOUDFLARE_ACCOUNT_ID')
NAMESPACE_ID = env_vars.get('CLOUDFLARE_KV_NAMESPACE_ID')

BASE_URL = f"https://api.cloudflare.com/client/v4/accounts/{ACCOUNT_ID}/storage/kv/namespaces/{NAMESPACE_ID}"
HEADERS = {
    "Authorization": f"Bearer {API_TOKEN}",
    "Content-Type": "application/json"
}

def list_keys():
    """List all keys in KV"""
    response = requests.get(f"{BASE_URL}/keys", headers=HEADERS)
    response.raise_for_status()
    data = response.json()
    return [item['name'] for item in data['result']]

def delete_key(key_name):
    """Delete a single key"""
    response = requests.delete(f"{BASE_URL}/values/{key_name}", headers=HEADERS)
    response.raise_for_status()
    return response.json()

def main():
    print("🗑️  Cloudflare KV Data Cleanup")
    print("=" * 50)
    print()
    
    # List keys
    print("🔍 Fetching all keys...")
    keys = list_keys()
    print(f"Found {len(keys)} keys")
    
    if len(keys) == 0:
        print("✅ KV is already empty")
        return
    
    print()
    print("⚠️  WARNING: This will DELETE ALL data!")
    print()
    confirm = input("Type 'yes' to confirm: ")
    
    if confirm.lower() != 'yes':
        print("❌ Aborted")
        return
    
    print()
    print(f"🗑️  Deleting {len(keys)} keys...")
    deleted = 0
    
    for key in keys:
        try:
            delete_key(key)
            deleted += 1
            if deleted % 10 == 0:
                print(f"  Deleted {deleted}/{len(keys)} keys...")
        except Exception as e:
            print(f"  ❌ Failed to delete {key}: {e}")
    
    print()
    print(f"✅ Deleted {deleted}/{len(keys)} keys")
    
    # Verify
    print()
    print("📊 Verification:")
    remaining = list_keys()
    print(f"Keys remaining: {len(remaining)}")
    
    if len(remaining) == 0:
        print("✅ KV cleanup complete!")
    else:
        print(f"⚠️  Warning: {len(remaining)} keys still remain")
        print("Remaining keys:", remaining[:10])

if __name__ == "__main__":
    main()
