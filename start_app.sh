#!/bin/bash

# Quick start script - assumes everything is already set up
# Use this when you've already run start.sh once

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CHATBOT_DIR="$SCRIPT_DIR/chatbot"
FRONTEND_DIR="$SCRIPT_DIR/chatbot_frontend/frontend"

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  Quick Start${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# Start frontend application
FRONTEND_PID=""
if [ -d "$FRONTEND_DIR" ] && [ -d "$FRONTEND_DIR/node_modules" ]; then
    echo -e "${YELLOW}Starting frontend...${NC}"
    cd "$FRONTEND_DIR"
    npm start > /dev/null 2>&1 &
    FRONTEND_PID=$!
    sleep 3
    if kill -0 $FRONTEND_PID 2>/dev/null; then
        echo -e "${GREEN}✓ Frontend started (PID: $FRONTEND_PID)${NC}"
        echo -e "${BLUE}  Frontend: http://localhost:3000${NC}"
    else
        echo -e "${YELLOW}⚠ Frontend may still be starting...${NC}"
    fi
    echo ""
else
    echo -e "${YELLOW}⚠ Frontend not found or dependencies not installed${NC}"
    echo ""
fi

# Function to cleanup on exit
cleanup() {
    echo ""
    echo -e "${YELLOW}Shutting down services...${NC}"
    if [ ! -z "$FRONTEND_PID" ] && kill -0 $FRONTEND_PID 2>/dev/null; then
        echo -e "${YELLOW}Stopping frontend (PID: $FRONTEND_PID)...${NC}"
        # Kill the process group to ensure all child processes are terminated
        kill -TERM -$FRONTEND_PID 2>/dev/null || kill $FRONTEND_PID 2>/dev/null || true
    fi
    # Kill any remaining npm/react-scripts processes for this frontend
    pkill -f "react-scripts start" 2>/dev/null || true
    # Also kill npm processes running in the frontend directory
    pkill -f "npm.*start.*frontend" 2>/dev/null || true
    echo -e "${GREEN}✓ Cleanup complete${NC}"
    exit 0
}

# Set trap to cleanup on script exit
trap cleanup SIGINT SIGTERM EXIT

# Start Flask application
echo -e "${YELLOW}Starting Flask application...${NC}"
cd "$CHATBOT_DIR"
source venv/bin/activate

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  System is ready!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "${BLUE}Backend:  http://0.0.0.0:5001${NC}"
if [ ! -z "$FRONTEND_PID" ]; then
    echo -e "${BLUE}Frontend: http://localhost:3000${NC}"
fi
echo -e "${YELLOW}Press Ctrl+C to stop all services${NC}"
echo ""

python3 -m app.app

