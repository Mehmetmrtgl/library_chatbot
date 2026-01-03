# Startup Guide

This guide explains how to start the LLM Chatbot system.

## Quick Start

### First Time Setup
Run the main startup script which handles everything:
```bash
./start.sh
```

This script will:
1. ✅ Check and start Ollama
2. ✅ Create Python virtual environment (if needed)
3. ✅ Install Python dependencies (if needed)
4. ✅ Create database and tables (if needed)
5. ✅ Install frontend npm dependencies (if needed)
6. ✅ Start the React frontend application (npm start)
7. ✅ Start the Flask backend application

### Regular Startup (After First Time)
If everything is already set up, use the quick start script:
```bash
./start_app.sh
```

Or manually:
```bash
# Start frontend (in one terminal)
cd chatbot_frontend/frontend
npm start

# Start backend (in another terminal)
cd chatbot
source venv/bin/activate
python3 -m app.app
```

## Check System Status
To check the status of all components:
```bash
./check_status.sh
```

## Manual Steps (if needed)

### Start Ollama
```bash
ollama serve
```

### Setup Python Environment
```bash
cd chatbot
source venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt
```

### Create Database
```bash
cd chatbot/scripts
python3 create_db.py
```

### Install Frontend Dependencies
```bash
cd chatbot_frontend/frontend
npm install
```

### Start Frontend Application
```bash
cd chatbot_frontend/frontend
npm start
```

## Scripts Overview

- **`start.sh`** - Full setup and startup (use for first time)
- **`start_app.sh`** - Quick start (assumes everything is set up)
- **`check_status.sh`** - Check status of all components
- **`chatbot/activate_venv.sh`** - Activate Python virtual environment
- **`chatbot/setup_venv.sh`** - Setup Python virtual environment only

## Troubleshooting

### Ollama not starting
- Make sure Ollama is installed: `ollama --version`
- Check if port 11434 is available
- Try starting manually: `ollama serve`

### Database connection errors
- Ensure PostgreSQL is running
- Check database credentials in `.env` file
- Run `chatbot/scripts/create_db.py` to recreate database

### Python dependencies issues
- Make sure virtual environment is activated
- Try: `pip install --upgrade pip && pip install -r requirements.txt`

### Frontend issues
- Make sure Node.js is installed: `node --version`
- Try: `cd chatbot_frontend/frontend && npm install`
- Frontend runs on http://localhost:3000 by default
- If port 3000 is in use, React will prompt to use another port

