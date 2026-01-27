#!/bin/bash

# ==============================================================================
# BOOKING SYSTEM - FULL FLOW TEST
# ==============================================================================
# Tests the entire booking workflow from form submission to calendar creation
# Usage: ./scripts/test-booking-flow.sh
# ==============================================================================

set -e

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Config
BOOKING_JS="src/modules/booking/booking.js"
APPS_SCRIPT="src/modules/booking/google-apps-script.js"
BOOKING_HTML="booking.html"

echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║         BOOKING SYSTEM - FULL FLOW TEST                    ║${NC}"
echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo ""

# ==============================================================================
# 1. CHECK FILES EXIST
# ==============================================================================

echo -e "${YELLOW}[1/7] Checking files...${NC}"

if [ ! -f "$BOOKING_JS" ]; then
    echo -e "${RED}✗ Missing: $BOOKING_JS${NC}"
    exit 1
fi

if [ ! -f "$APPS_SCRIPT" ]; then
    echo -e "${RED}✗ Missing: $APPS_SCRIPT${NC}"
    exit 1
fi

if [ ! -f "$BOOKING_HTML" ]; then
    echo -e "${RED}✗ Missing: $BOOKING_HTML${NC}"
    exit 1
fi

echo -e "${GREEN}✓ All files present${NC}"
echo ""

# ==============================================================================
# 2. CHECK BACKEND URL CONFIGURED
# ==============================================================================

echo -e "${YELLOW}[2/7] Checking backend configuration...${NC}"

BACKEND_URL=$(grep "BACKEND_URL:" "$BOOKING_JS" | head -1 | sed "s/.*BACKEND_URL: *['\"]//g" | sed "s/['\"].*//g")
USE_BACKEND=$(grep "USE_BACKEND:" "$BOOKING_JS" | head -1 | sed "s/.*USE_BACKEND: *//g" | sed "s/[,;].*//g")

echo "Backend URL: $BACKEND_URL"
echo "Use Backend: $USE_BACKEND"

if [ "$BACKEND_URL" = "YOUR_GOOGLE_APPS_SCRIPT_URL" ]; then
    echo -e "${RED}✗ Backend URL not configured!${NC}"
    echo "  Update BACKEND_URL in $BOOKING_JS"
    exit 1
fi

if [ "$USE_BACKEND" = "false" ]; then
    echo -e "${YELLOW}⚠ Backend mode disabled - OAuth mode active${NC}"
else
    echo -e "${GREEN}✓ Backend mode enabled${NC}"
fi
echo ""

# ==============================================================================
# 3. VALIDATE BACKEND URL
# ==============================================================================

echo -e "${YELLOW}[3/7] Testing backend URL...${NC}"

if command -v curl &> /dev/null; then
    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$BACKEND_URL" || echo "000")
    
    if [ "$HTTP_CODE" = "200" ]; then
        echo -e "${GREEN}✓ Backend is reachable (HTTP $HTTP_CODE)${NC}"
    elif [ "$HTTP_CODE" = "302" ] || [ "$HTTP_CODE" = "405" ]; then
        echo -e "${GREEN}✓ Backend exists (HTTP $HTTP_CODE - expected for GET)${NC}"
    else
        echo -e "${RED}✗ Backend unreachable (HTTP $HTTP_CODE)${NC}"
        echo "  URL: $BACKEND_URL"
    fi
else
    echo -e "${YELLOW}⚠ curl not available, skipping URL test${NC}"
fi
echo ""

# ==============================================================================
# 4. CHECK APPS SCRIPT CONFIGURATION
# ==============================================================================

echo -e "${YELLOW}[4/7] Checking Apps Script configuration...${NC}"

ALLOWED_ORIGINS=$(grep -A 3 "ALLOWED_ORIGINS:" "$APPS_SCRIPT" | tail -2 | head -1 | grep -o "https://[^\"']*" || echo "")

if [ -z "$ALLOWED_ORIGINS" ]; then
    echo -e "${RED}✗ No production origins configured${NC}"
else
    echo -e "${GREEN}✓ Allowed origins configured:${NC}"
    echo "  $ALLOWED_ORIGINS"
fi
echo ""

# ==============================================================================
# 5. VALIDATE BOOKING.JS STRUCTURE
# ==============================================================================

echo -e "${YELLOW}[5/7] Validating booking.js structure...${NC}"

# Check for required functions
REQUIRED_FUNCTIONS=(
    "sendBookingToBackend"
    "validateForm"
    "initBookingForm"
    "showMessage"
)

for func in "${REQUIRED_FUNCTIONS[@]}"; do
    if grep -q "function $func" "$BOOKING_JS" || grep -q "$func.*function" "$BOOKING_JS"; then
        echo -e "${GREEN}✓ Function exists: $func${NC}"
    else
        echo -e "${RED}✗ Missing function: $func${NC}"
    fi
done
echo ""

# ==============================================================================
# 6. CHECK HTML FORM STRUCTURE
# ==============================================================================

echo -e "${YELLOW}[6/7] Checking HTML form...${NC}"

REQUIRED_FIELDS=(
    'id="name"'
    'id="phone"'
    'id="email"'
    'id="service"'
    'id="date"'
    'id="time"'
)

for field in "${REQUIRED_FIELDS[@]}"; do
    if grep -q "$field" "$BOOKING_HTML"; then
        echo -e "${GREEN}✓ Field exists: $field${NC}"
    else
        echo -e "${RED}✗ Missing field: $field${NC}"
    fi
done
echo ""

# ==============================================================================
# 7. TEST SUBMISSION (Mock)
# ==============================================================================

echo -e "${YELLOW}[7/7] Simulating form submission...${NC}"

if [ "$USE_BACKEND" = "true" ] && [ "$BACKEND_URL" != "YOUR_GOOGLE_APPS_SCRIPT_URL" ]; then
    
    # Create test payload
    TEST_DATA=$(cat <<EOF
{
  "name": "Test User",
  "phone": "+370 600 00000",
  "email": "test@example.com",
  "service": "Test Service",
  "date": "$(date -d '+1 day' +%Y-%m-%d)",
  "time": "14:00",
  "notes": "Automated test from smri",
  "origin": "https://vinas8.github.io"
}
EOF
)
    
    echo "Payload:"
    echo "$TEST_DATA"
    echo ""
    
    if command -v curl &> /dev/null; then
        echo "Sending POST request to backend..."
        
        RESPONSE=$(curl -s -X POST "$BACKEND_URL" \
            -H "Content-Type: application/json" \
            -d "$TEST_DATA" \
            -w "\nHTTP_CODE:%{http_code}" || echo "ERROR")
        
        HTTP_CODE=$(echo "$RESPONSE" | grep "HTTP_CODE" | cut -d':' -f2)
        BODY=$(echo "$RESPONSE" | sed '/HTTP_CODE/d')
        
        echo "Response:"
        echo "$BODY" | head -20
        echo ""
        
        if [ "$HTTP_CODE" = "200" ]; then
            echo -e "${GREEN}✓ Backend accepted request (HTTP 200)${NC}"
            
            if echo "$BODY" | grep -q "success"; then
                echo -e "${GREEN}✓✓ Success response received!${NC}"
                echo -e "${GREEN}   Check your calendar: https://calendar.google.com${NC}"
            else
                echo -e "${YELLOW}⚠ Unexpected response format${NC}"
            fi
        else
            echo -e "${RED}✗ Backend returned HTTP $HTTP_CODE${NC}"
        fi
    else
        echo -e "${YELLOW}⚠ curl not available, skipping POST test${NC}"
    fi
else
    echo -e "${YELLOW}⚠ Backend not configured, skipping POST test${NC}"
fi

echo ""

# ==============================================================================
# SUMMARY
# ==============================================================================

echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║                    TEST SUMMARY                            ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${GREEN}Configuration:${NC}"
echo "  Backend URL: $BACKEND_URL"
echo "  Use Backend: $USE_BACKEND"
echo ""
echo -e "${GREEN}Next Steps:${NC}"
echo "  1. Check Google Calendar: https://calendar.google.com"
echo "  2. Test on GitHub Pages: https://vinas8.github.io/catalog/booking.html"
echo "  3. Check Apps Script logs: https://script.google.com/home/executions"
echo ""
echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║                    TEST COMPLETE                           ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
