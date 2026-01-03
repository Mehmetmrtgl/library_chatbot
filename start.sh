#!/bin/bash

# Main startup script for the LLM Chatbot system
# Handles: Ollama, npm dependencies, Python venv, database setup, and Flask app

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Get the script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CHATBOT_DIR="$SCRIPT_DIR/chatbot"
FRONTEND_DIR="$SCRIPT_DIR/chatbot_frontend/frontend"

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  LLM Chatbot System Startup${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to check if a service is running
is_running() {
    pgrep -f "$1" > /dev/null
}

# Function to check if Ollama is accessible
ollama_accessible() {
    curl -s http://localhost:11434/api/tags > /dev/null 2>&1
}

# 1. Check and start Ollama
echo -e "${YELLOW}[1/6] Checking Ollama...${NC}"
if command_exists ollama; then
    if ollama_accessible; then
        echo -e "${GREEN}✓ Ollama is already running and accessible${NC}"
    elif is_running "ollama serve"; then
        echo -e "${YELLOW}Ollama process found but not yet accessible, waiting...${NC}"
        sleep 3
        if ollama_accessible; then
            echo -e "${GREEN}✓ Ollama is now accessible${NC}"
        else
            echo -e "${YELLOW}⚠ Ollama may still be starting up${NC}"
        fi
    else
        echo -e "${YELLOW}Starting Ollama in background...${NC}"
        ollama serve > /dev/null 2>&1 &
        sleep 3
        if ollama_accessible; then
            echo -e "${GREEN}✓ Ollama started successfully${NC}"
        elif is_running "ollama serve"; then
            echo -e "${YELLOW}⚠ Ollama is starting (may take a moment)${NC}"
        else
            echo -e "${RED}✗ Failed to start Ollama${NC}"
            echo -e "${YELLOW}Try starting manually: ollama serve${NC}"
            exit 1
        fi
    fi
else
    echo -e "${RED}✗ Ollama is not installed. Please install it first.${NC}"
    exit 1
fi
echo ""

# 2. Setup Python virtual environment
echo -e "${YELLOW}[2/6] Setting up Python environment...${NC}"
cd "$CHATBOT_DIR"

# Check if venv exists
FIRST_TIME=false
if [ ! -d "venv" ]; then
    echo -e "${YELLOW}Virtual environment not found. Creating...${NC}"
    python3 -m venv venv
    FIRST_TIME=true
fi

# Activate virtual environment
source venv/bin/activate

# Check if requirements are installed
if [ "$FIRST_TIME" = true ] || ! python -c "import flask" 2>/dev/null; then
    echo -e "${YELLOW}Installing/upgrading Python dependencies...${NC}"
    pip install --upgrade pip --quiet
    pip install -r requirements.txt
    echo -e "${GREEN}✓ Python dependencies installed${NC}"
else
    echo -e "${GREEN}✓ Python dependencies already installed${NC}"
fi

# Setup NLTK data
echo -e "${YELLOW}Setting up NLTK data...${NC}"
cd "$CHATBOT_DIR/scripts"
python3 setup_nltk.py > /dev/null 2>&1 || echo -e "${YELLOW}⚠ NLTK data setup skipped (may already be installed)${NC}"
echo ""

# 3. Setup database
echo -e "${YELLOW}[3/6] Checking database...${NC}"
cd "$CHATBOT_DIR/scripts"
python3 create_db.py

if [ -f "load_manual_questions.py" ]; then
    echo -e "${YELLOW}Loading manual questions...${NC}"
    python3 load_manual_questions.py
fi
echo -e "${GREEN}✓ Database setup complete${NC}"
echo ""

# 4. Setup frontend npm dependencies
echo -e "${YELLOW}[4/6] Checking frontend dependencies...${NC}"
if [ -d "$FRONTEND_DIR" ]; then
    cd "$FRONTEND_DIR"
    if [ ! -d "node_modules" ]; then
        echo -e "${YELLOW}Installing npm dependencies...${NC}"
        npm install
        echo -e "${GREEN}✓ Frontend dependencies installed${NC}"
    else
        echo -e "${GREEN}✓ Frontend dependencies already installed${NC}"
    fi
else
    echo -e "${YELLOW}⚠ Frontend directory not found, skipping...${NC}"
fi
echo ""

# 5. Start frontend application
echo -e "${YELLOW}[5/6] Starting frontend application...${NC}"
FRONTEND_PID=""
if [ -d "$FRONTEND_DIR" ]; then
    cd "$FRONTEND_DIR"
    if [ -d "node_modules" ]; then
        echo -e "${YELLOW}Starting React frontend in background...${NC}"
        npm start > /dev/null 2>&1 &
        FRONTEND_PID=$!
        sleep 3
        if kill -0 $FRONTEND_PID 2>/dev/null; then
            echo -e "${GREEN}✓ Frontend started (PID: $FRONTEND_PID)${NC}"
            echo -e "${BLUE}  Frontend will be available at http://localhost:3000${NC}"
        else
            echo -e "${YELLOW}⚠ Frontend may still be starting...${NC}"
        fi
    else
        echo -e "${RED}✗ Frontend dependencies not installed. Run ./start.sh first.${NC}"
    fi
else
    echo -e "${YELLOW}⚠ Frontend directory not found, skipping...${NC}"
fi
echo ""

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

# 6. Start Flask application
echo -e "${YELLOW}[6/6] Starting Flask application...${NC}"
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

# Start the Flask app (this will block until Ctrl+C)
python3 -m app.app

