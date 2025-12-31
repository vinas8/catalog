#!/bin/bash

# Serpent Town - Create User & Assign Snakes Script
# Usage: ./create-player.sh [username] [email]

WORKER_URL="https://catalog.navickaszilvinas.workers.dev"

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}🐍 Serpent Town - Player Creation${NC}"
echo "=================================="
echo ""

# Get username
if [ -z "$1" ]; then
  echo -n "Enter username: "
  read USERNAME
else
  USERNAME="$1"
fi

# Get email
if [ -z "$2" ]; then
  echo -n "Enter email (optional, press Enter to skip): "
  read EMAIL
else
  EMAIL="$2"
fi

# Generate unique user ID
USER_ID=$(date +%s | base64 | head -c 12 | tr '[:upper:]' '[:lower:]' | tr -d '=+/')
echo ""
echo -e "${BLUE}📝 Creating player account...${NC}"
echo "   Username: $USERNAME"
echo "   User ID: $USER_ID"
if [ -n "$EMAIL" ]; then
  echo "   Email: $EMAIL"
else
  EMAIL="${USER_ID}@temp.serpenttown.com"
  echo "   Email: (auto-generated) $EMAIL"
fi
echo ""

# Create user
RESPONSE=$(curl -s -X POST "$WORKER_URL/register-user" \
  -H "Content-Type: application/json" \
  -d "{\"user_id\":\"$USER_ID\",\"username\":\"$USERNAME\",\"email\":\"$EMAIL\"}")

if echo "$RESPONSE" | grep -q '"success":true'; then
  echo -e "${GREEN}✅ Player created successfully!${NC}"
  echo ""
  
  # Save user ID
  echo "$USER_ID" > .last_user_id
  
  # Show game URL
  GAME_URL="https://vinas8.github.io/catalog/game.html?user=$USER_ID"
  echo -e "${YELLOW}🎮 Game URL:${NC}"
  echo "$GAME_URL"
  echo ""
  echo -e "${YELLOW}📋 Copy this URL to access your game:${NC}"
  echo ""
  echo "  $GAME_URL"
  echo ""
  
  # Ask about assigning test snakes
  echo -n "Would you like to assign a test snake? (y/n): "
  read ASSIGN_SNAKE
  
  if [ "$ASSIGN_SNAKE" = "y" ] || [ "$ASSIGN_SNAKE" = "Y" ]; then
    echo ""
    echo -e "${BLUE}🐍 Assigning test snake...${NC}"
    
    ASSIGN_RESPONSE=$(curl -s -X POST "$WORKER_URL/assign-product" \
      -H "Content-Type: application/json" \
      -d "{
        \"user_id\":\"$USER_ID\",
        \"product_id\":\"starter_banana_python\",
        \"assignment_id\":\"assign_$(date +%s)\",
        \"name\":\"Banana Ball Python\",
        \"species\":\"ball_python\",
        \"morph\":\"banana\",
        \"product_type\":\"real\",
        \"price\":10000,
        \"currency\":\"eur\",
        \"acquired_at\":\"$(date -Iseconds)\"
      }")
    
    if echo "$ASSIGN_RESPONSE" | grep -q '"success":true'; then
      echo -e "${GREEN}✅ Test snake assigned!${NC}"
    else
      echo -e "${RED}❌ Failed to assign snake${NC}"
      echo "$ASSIGN_RESPONSE" | jq '.' 2>/dev/null || echo "$ASSIGN_RESPONSE"
    fi
  fi
  
  echo ""
  echo -e "${GREEN}🎉 Setup complete!${NC}"
  echo ""
  echo "Next steps:"
  echo "1. Bookmark your game URL"
  echo "2. Visit: https://vinas8.github.io/catalog/catalog.html to buy snakes"
  echo "3. Play: $GAME_URL"
  echo ""
  echo "User ID saved to: .last_user_id"
  
else
  echo -e "${RED}❌ Failed to create player${NC}"
  echo "$RESPONSE" | jq '.' 2>/dev/null || echo "$RESPONSE"
  exit 1
fi
