#!/bin/bash

# Google Calendar API Setup Helper
# Grožio Salono Užsakymų Sistema

echo "=========================================="
echo "  Google Calendar API Setup Helper"
echo "=========================================="
echo ""

# Spalvos
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Funkcija rodymui
print_step() {
    echo -e "${BLUE}➜${NC} $1"
}

print_success() {
    echo -e "${GREEN}✓${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

# 1. Pasveikinimas
print_step "Šis scriptas padės sukonfigūruoti Google Calendar API"
echo ""
echo "Jums reikės:"
echo "  1. Google paskyros"
echo "  2. Naršyklės prieigos prie Google Cloud Console"
echo "  3. ~10 minučių laiko"
echo ""
read -p "Ar esate pasiruošę? (y/n): " ready

if [[ $ready != "y" && $ready != "Y" ]]; then
    echo "Gerai, paleiskite vėliau!"
    exit 0
fi

echo ""
echo "=========================================="
echo "  1. Google Cloud Console"
echo "=========================================="
echo ""

print_step "Atidarykite naršyklę ir eikite į:"
echo -e "${YELLOW}https://console.cloud.google.com/${NC}"
echo ""
print_warning "Prisijunkite su Google paskyra"
echo ""
read -p "Paspauskite Enter kai prisijungsite..."

echo ""
print_step "Sukurkite naują projektą:"
echo "  1. Viršuje spauskite projektą"
echo "  2. NEW PROJECT"
echo "  3. Pavadinimas: Grozio-Salonas"
echo "  4. CREATE"
echo ""
read -p "Paspauskite Enter kai sukursite projektą..."

echo ""
echo "=========================================="
echo "  2. Calendar API įjungimas"
echo "=========================================="
echo ""

print_step "Eikite į:"
echo -e "${YELLOW}https://console.cloud.google.com/apis/library${NC}"
echo ""
print_step "Ieškokite 'calendar' ir įjunkite 'Google Calendar API'"
echo ""
read -p "Paspauskite Enter kai įjungsite API..."

echo ""
echo "=========================================="
echo "  3. OAuth Consent Screen"
echo "=========================================="
echo ""

print_step "Eikite į:"
echo -e "${YELLOW}https://console.cloud.google.com/apis/credentials${NC}"
echo ""
print_step "Jei matote 'CONFIGURE CONSENT SCREEN', spauskite jį"
echo "  - Pasirinkite: External"
echo "  - App name: Grožio Salono Užsakymai"
echo "  - User support email: jūsų el. paštas"
echo "  - Developer email: jūsų el. paštas"
echo "  - Test users: pridėkite save"
echo ""
read -p "Paspauskite Enter kai baigsite..."

echo ""
echo "=========================================="
echo "  4. OAuth Client ID"
echo "=========================================="
echo ""

print_step "Toje pačioje Credentials puslapyje:"
echo "  1. + CREATE CREDENTIALS"
echo "  2. OAuth client ID"
echo "  3. Application type: Web application"
echo "  4. Name: Uzsakymai Web Client"
echo ""

# Gauti GitHub vartotoją
echo ""
print_warning "Koks jūsų GitHub vartotojo vardas? (pvz: martynas-dev)"
read -p "GitHub username: " github_user

if [ -z "$github_user" ]; then
    github_user="JUSU-VARTOTOJAS"
fi

echo ""
print_step "Authorized JavaScript origins (pridėkite ABUDU):"
echo -e "${GREEN}http://localhost:8000${NC}"
echo -e "${GREEN}https://${github_user}.github.io${NC}"
echo ""

print_step "Authorized redirect URIs (pridėkite ABUDU):"
echo -e "${GREEN}http://localhost:8000/catalog/booking.html${NC}"
echo -e "${GREEN}https://${github_user}.github.io/catalog/booking.html${NC}"
echo ""

read -p "Paspauskite Enter kai baigsite..."

echo ""
print_warning "Nukopijuokite CLIENT ID (atrodo kaip: 123456-abc.apps.googleusercontent.com)"
read -p "Įklijuokite Client ID čia: " client_id

if [ -z "$client_id" ]; then
    print_error "Client ID neįvestas!"
    exit 1
fi

print_success "Client ID: $client_id"

echo ""
echo "=========================================="
echo "  5. API Key"
echo "=========================================="
echo ""

print_step "Toje pačioje Credentials puslapyje:"
echo "  1. + CREATE CREDENTIALS"
echo "  2. API key"
echo "  3. RESTRICT KEY"
echo "  4. API restrictions: Restrict key → Google Calendar API"
echo "  5. Website restrictions: HTTP referrers"
echo "     - http://localhost:8000/*"
echo "     - https://${github_user}.github.io/*"
echo ""

read -p "Paspauskite Enter kai baigsite..."

echo ""
print_warning "Nukopijuokite API KEY (atrodo kaip: AIzaSyDXXXXXXXXXXXXXXXXXXX)"
read -p "Įklijuokite API Key čia: " api_key

if [ -z "$api_key" ]; then
    print_error "API Key neįvestas!"
    exit 1
fi

print_success "API Key: ${api_key:0:10}..."

echo ""
echo "=========================================="
echo "  6. Konfigūracijos įdiegimas"
echo "=========================================="
echo ""

# Rasti booking.js failą
booking_js="/root/catalog/src/modules/booking/booking.js"

if [ ! -f "$booking_js" ]; then
    print_error "Nerastas booking.js failas: $booking_js"
    exit 1
fi

print_step "Kuriama backup kopija..."
cp "$booking_js" "${booking_js}.backup"
print_success "Backup sukurtas: ${booking_js}.backup"

echo ""
print_step "Įdiegiamos konfigūracijos..."

# Pakeisti CLIENT_ID
sed -i "s|CLIENT_ID: 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com'|CLIENT_ID: '$client_id'|g" "$booking_js"

# Pakeisti API_KEY
sed -i "s|API_KEY: 'YOUR_GOOGLE_API_KEY'|API_KEY: '$api_key'|g" "$booking_js"

print_success "Konfigūracijos įdiegtos!"

echo ""
echo "=========================================="
echo "  7. Testavimas"
echo "=========================================="
echo ""

print_step "Paleiskite lokalų serverį:"
echo -e "${GREEN}cd /root/catalog${NC}"
echo -e "${GREEN}python3 -m http.server 8000${NC}"
echo ""

print_step "Atidarykite naršyklėje:"
echo -e "${YELLOW}http://localhost:8000/booking.html${NC}"
echo ""

print_step "Užpildykite formą ir pabandykite užsiregistruoti"
echo ""

echo "=========================================="
echo "  ✓ Setup Baigtas!"
echo "=========================================="
echo ""
print_success "booking.js failas atnaujintas"
print_success "Backup išsaugotas: ${booking_js}.backup"
echo ""
print_warning "Jei reikia grąžinti senas reikšmes:"
echo "  cp ${booking_js}.backup ${booking_js}"
echo ""
print_step "Instrukcijos: /root/catalog/src/modules/booking/GOOGLE-CALENDAR-SETUP.md"
echo ""
echo -e "${GREEN}Sėkmės! 🎉${NC}"
