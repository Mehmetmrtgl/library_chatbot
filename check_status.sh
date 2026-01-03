#!/bin/bash

# Status check script - shows the status of all system components

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CHATBOT_DIR="$SCRIPT_DIR/chatbot"
FRONTEND_DIR="$SCRIPT_DIR/chatbot_frontend/frontend"

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  System Status Check${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# Check Ollama
echo -n "Ollama: "
if pgrep -f "ollama serve" > /dev/null; then
    echo -e "${GREEN}✓ Running${NC}"
else
    echo -e "${RED}✗ Not running${NC}"
fi

# Check Python venv
echo -n "Python Virtual Environment: "
if [ -d "$CHATBOT_DIR/venv" ]; then
    echo -e "${GREEN}✓ Exists${NC}"
    if [ -f "$CHATBOT_DIR/venv/bin/activate" ]; then
        source "$CHATBOT_DIR/venv/bin/activate"
        if python -c "import flask" 2>/dev/null; then
            echo -n "  Python Dependencies: "
            echo -e "${GREEN}✓ Installed${NC}"
        else
            echo -n "  Python Dependencies: "
            echo -e "${RED}✗ Not installed${NC}"
        fi
        deactivate 2>/dev/null || true
    fi
else
    echo -e "${RED}✗ Not found${NC}"
fi

# Check Database
echo -n "Database: "
if command -v psql >/dev/null 2>&1; then
    if psql -h localhost -U postgres -d hu_chatbot2 -c "SELECT 1" >/dev/null 2>&1; then
        echo -e "${GREEN}✓ Accessible${NC}"
    else
        echo -e "${YELLOW}⚠ May need setup (run start.sh)${NC}"
    fi
else
    echo -e "${YELLOW}⚠ psql not found${NC}"
fi

# Check Frontend
echo -n "Frontend Dependencies: "
if [ -d "$FRONTEND_DIR/node_modules" ]; then
    echo -e "${GREEN}✓ Installed${NC}"
else
    echo -e "${YELLOW}⚠ Not installed${NC}"
fi

# Check Frontend Application
echo -n "Frontend Application: "
if pgrep -f "react-scripts start" > /dev/null; then
    echo -e "${GREEN}✓ Running${NC}"
    echo -e "  ${BLUE}URL: http://localhost:3000${NC}"
else
    echo -e "${RED}✗ Not running${NC}"
fi

# Check Flask app
echo -n "Flask Application: "
if pgrep -f "python.*app.app" > /dev/null; then
    echo -e "${GREEN}✓ Running${NC}"
    echo -e "  ${BLUE}URL: http://0.0.0.0:5001${NC}"
else
    echo -e "${RED}✗ Not running${NC}"
fi

echo ""
echo -e "${BLUE}========================================${NC}"

