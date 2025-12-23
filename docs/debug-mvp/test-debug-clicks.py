#!/usr/bin/env python3
"""
Test debug page module button clicks
Uses HTTP requests to verify structure and provides debugging info
"""

import http.client
import json
import re

def fetch(url_path):
    """Fetch content from local server"""
    conn = http.client.HTTPConnection('localhost', 8000)
    conn.request('GET', url_path)
    response = conn.getresponse()
    body = response.read().decode('utf-8')
    conn.close()
    return response.status, body

def test_debug_page():
    print('🔍 Testing Debug Page Module Button Clicks\n')
    print('='*60)
    
    # Load debug page
    print('\n1️⃣  Loading debug page...')
    status, html = fetch('/src/modules/debug/index.html')
    
    if status != 200:
        print(f'   ❌ Failed to load: {status}')
        return False
    
    print(f'   ✅ Loaded: {len(html)} bytes')
    
    # Extract JavaScript
    print('\n2️⃣  Analyzing JavaScript...')
    script_match = re.search(r'<script type="module">(.*?)</script>', html, re.DOTALL)
    
    if not script_match:
        print('   ❌ No module script found')
        return False
    
    script = script_match.group(1)
    print('   ✅ Found module script')
    
    # Check switchModule function
    print('\n3️⃣  Checking switchModule function...')
    
    # Find the switchModule function definition
    switch_match = re.search(r'window\.switchModule\s*=\s*function\((.*?)\)\s*{(.*?)\n\s*};', 
                              script, re.DOTALL)
    
    if not switch_match:
        print('   ❌ switchModule function not found')
        return False
    
    params = switch_match.group(1)
    func_body = switch_match.group(2)
    
    print(f'   ✅ Function signature: switchModule({params})')
    print(f'   📝 Function body length: {len(func_body)} chars')
    
    # Check for critical parts
    checks = {
        'querySelectorAll': 'DOM query for tabs' in func_body or '.module-tab' in func_body,
        'classList.remove': "'active'" in func_body and 'remove' in func_body,
        'classList.add': "'active'" in func_body and 'add' in func_body,
        'module-content': "'module-content'" in func_body or '"module-content"' in func_body,
    }
    
    print('\n   Function implementation checks:')
    for check, passed in checks.items():
        status = '✅' if passed else '❌'
        print(f'   {status} {check}')
    
    # Check module tab onclick attributes
    print('\n4️⃣  Checking module tab buttons...')
    
    tabs = ['scenarios', 'catalog', 'users', 'admin', 'stripe', 'monitor', 'logs']
    all_good = True
    
    for tab in tabs:
        # Check for button with onclick
        pattern = f'onclick="switchModule\(\'{tab}\'[^"]*"'
        if re.search(pattern, html):
            print(f'   ✅ {tab}: onclick handler found')
        else:
            print(f'   ❌ {tab}: onclick handler MISSING')
            all_good = False
    
    # Check for event listener issue
    print('\n5️⃣  Checking for initialization issues...')
    
    # Look for the auto-initialize code
    if "document.querySelector('[onclick" in script and "addEventListener('click'" in script:
        print('   ⚠️  Found event listener trying to bind to scenarios tab')
        
        # Check if it's using the right selector
        if '[onclick*=' in script or 'onclick*="' in script:
            print('   ✅ Using contains selector (should work)')
        elif '[onclick="switchModule' in script:
            print('   ⚠️  Using exact match selector')
            print('   💡 This might not match onclick="switchModule(\'scenarios\', this)"')
    
    # Check browser console simulation
    print('\n6️⃣  Simulating browser load sequence...')
    print('   1. Browser loads HTML')
    print('   2. Browser parses <script type="module">')
    print('   3. Browser imports: ../../config/worker-config.js')
    
    # Check if import will work
    status, _ = fetch('/src/config/worker-config.js')
    if status == 200:
        print('   ✅ Import path accessible')
    else:
        print(f'   ❌ Import path fails: {status}')
        all_good = False
    
    print('   4. Browser executes inline module code')
    print('   5. window.switchModule assigned')
    print('   6. onclick handlers ready')
    
    # Summary
    print('\n' + '='*60)
    print('📊 DIAGNOSIS:')
    print('='*60)
    
    if all_good:
        print('\n✅ All structural checks passed!')
        print('\n💡 If buttons still don\'t work in browser, try:')
        print('   1. Open browser DevTools (F12)')
        print('   2. Go to Console tab')
        print('   3. Click a module tab button')
        print('   4. Check for JavaScript errors')
        print('   5. Try typing: switchModule(\'catalog\', null)')
        print('   6. If that works, the onclick is broken')
        print('   7. If that fails, check the function definition')
    else:
        print('\n❌ Issues found - see above')
    
    print('\n🔗 Test in browser: http://localhost:8000/debug.html')
    print('🔗 Direct link: http://localhost:8000/src/modules/debug/index.html\n')
    
    return all_good

if __name__ == '__main__':
    test_debug_page()
