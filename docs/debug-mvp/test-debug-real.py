#!/usr/bin/env python3
"""
Real browser test using Python http.server already running on port 8000
Tests the debug page module switching WITHOUT playwright/selenium
"""

import http.client
import json
import re
from html.parser import HTMLParser

class DebugPageParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.modules_found = []
        self.tabs_found = []
        self.dropdown_options = []
        self.in_select = False
        self.in_script = False
        self.script_content = ''
        
    def handle_starttag(self, tag, attrs):
        attrs_dict = dict(attrs)
        
        # Check for module content divs
        if tag == 'div' and 'id' in attrs_dict:
            if attrs_dict['id'].startswith('module-'):
                module_name = attrs_dict['id'].replace('module-', '')
                is_active = 'active' in attrs_dict.get('class', '')
                self.modules_found.append({
                    'name': module_name,
                    'active': is_active
                })
        
        # Check for module tabs
        if tag == 'div' and 'data-module' in attrs_dict:
            self.tabs_found.append({
                'module': attrs_dict['data-module'],
                'active': 'active' in attrs_dict.get('class', '')
            })
        
        # Check for dropdown
        if tag == 'select' and attrs_dict.get('id') == 'module-selector':
            self.in_select = True
        
        if tag == 'option' and self.in_select:
            self.dropdown_options.append(attrs_dict.get('value', ''))
        
        # Track script tags
        if tag == 'script':
            self.in_script = True
    
    def handle_endtag(self, tag):
        if tag == 'select':
            self.in_select = False
        if tag == 'script':
            self.in_script = False
    
    def handle_data(self, data):
        if self.in_script:
            self.script_content += data

def fetch_debug_page():
    """Fetch the debug page HTML"""
    conn = http.client.HTTPConnection('localhost', 8000)
    conn.request('GET', '/src/modules/debug/index.html')
    response = conn.getresponse()
    html = response.read().decode('utf-8')
    conn.close()
    return html

def test_debug_page():
    print('🧪 Testing Debug Page (No Playwright/Selenium)\n')
    print('='*60)
    
    # Fetch page
    print('\n1️⃣  Fetching debug page...')
    try:
        html = fetch_debug_page()
        print(f'   ✅ Loaded: {len(html)} bytes')
    except Exception as e:
        print(f'   ❌ Failed to load: {e}')
        return False
    
    # Parse page
    print('\n2️⃣  Parsing HTML structure...')
    parser = DebugPageParser()
    parser.feed(html)
    
    print(f'   📦 Found {len(parser.modules_found)} module content divs')
    print(f'   🏷️  Found {len(parser.tabs_found)} tab buttons')
    print(f'   📋 Found dropdown with {len(parser.dropdown_options)} options')
    
    # Check modules
    print('\n3️⃣  Module Content Divs:')
    active_count = 0
    for mod in parser.modules_found:
        status = '✅ ACTIVE' if mod['active'] else '⚪ hidden'
        print(f'   {status} module-{mod["name"]}')
        if mod['active']:
            active_count += 1
    
    if active_count == 1:
        print(f'   ✅ Exactly 1 module active (correct)')
    else:
        print(f'   ⚠️  {active_count} modules active (should be 1)')
    
    # Check tabs
    print('\n4️⃣  Tab Buttons:')
    for tab in parser.tabs_found:
        status = '✅ ACTIVE' if tab['active'] else '⚪ inactive'
        print(f'   {status} data-module="{tab["module"]}"')
    
    # Check dropdown
    print('\n5️⃣  Dropdown Options:')
    for opt in parser.dropdown_options:
        print(f'   ✅ {opt}')
    
    # Check JavaScript
    print('\n6️⃣  JavaScript Analysis:')
    
    if 'window.switchModule' in parser.script_content:
        print('   ✅ switchModule() function defined')
    else:
        print('   ❌ switchModule() function NOT FOUND')
    
    if 'addEventListener' in parser.script_content:
        count = parser.script_content.count('addEventListener')
        print(f'   ✅ Event listeners found ({count} calls)')
    else:
        print('   ❌ No event listeners found')
    
    if "getAttribute('data-module')" in parser.script_content:
        print('   ✅ Uses data-module attributes (correct)')
    else:
        print('   ⚠️  Not using data-module attributes')
    
    if 'module-selector' in parser.script_content:
        print('   ✅ Dropdown selector hooked up')
    else:
        print('   ❌ Dropdown selector NOT hooked up')
    
    # Check for errors
    print('\n7️⃣  Potential Issues:')
    issues = []
    
    if len(parser.modules_found) == 0:
        issues.append('No module content divs found')
    
    if len(parser.tabs_found) == 0:
        issues.append('No tab buttons found')
    
    if len(parser.dropdown_options) == 0:
        issues.append('Dropdown has no options')
    
    if 'window.switchModule' not in parser.script_content:
        issues.append('switchModule function missing')
    
    if len(issues) == 0:
        print('   ✅ No structural issues found')
    else:
        for issue in issues:
            print(f'   ❌ {issue}')
    
    # Instructions
    print('\n' + '='*60)
    print('📊 RESULTS:\n')
    
    if len(issues) == 0:
        print('✅ Page structure is CORRECT!\n')
        print('🔍 To debug why modules don\'t switch in browser:\n')
        print('1. Open: http://localhost:8000/debug.html')
        print('2. Press F12 to open DevTools')
        print('3. Go to Console tab')
        print('4. Type: switchModule(\'catalog\')')
        print('5. If error appears, that\'s the issue')
        print('6. If no error but nothing happens, check CSS')
        print('7. Try: document.getElementById(\'module-catalog\').classList.add(\'active\')')
    else:
        print('❌ Page structure has ISSUES (see above)\n')
    
    print('\n🔗 Test URL: http://localhost:8000/debug.html')
    print('🔗 Direct: http://localhost:8000/src/modules/debug/index.html\n')

if __name__ == '__main__':
    test_debug_page()
