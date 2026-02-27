#!/bin/bash

echo "🚀 Group Theory Calculator - Quick Start Test"
echo "=============================================="
echo ""

# Check Python
echo "✓ Checking Python..."
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 not found. Please install Python 3.10+"
    exit 1
fi
python3 --version

# Check if we're in the right directory
if [ ! -f "PROJECT_SPEC.md" ]; then
    echo "❌ Please run this script from the project root directory"
    exit 1
fi

echo ""
echo "📦 Setting up backend..."
cd backend

# Create venv if it doesn't exist
if [ ! -d "venv" ]; then
    echo "  Creating virtual environment..."
    python3 -m venv venv
fi

# Activate venv
echo "  Activating virtual environment..."
source venv/bin/activate

# Install dependencies
echo "  Installing dependencies..."
pip install -q --upgrade pip
pip install -q -r requirements.txt

# Copy env file if needed
if [ ! -f ".env" ]; then
    echo "  Creating .env file..."
    cp .env.example .env
fi

echo ""
echo "🧪 Testing backend..."
echo "  Starting FastAPI server (press Ctrl+C to stop)..."
echo ""
echo "  Once started:"
echo "  - API: http://localhost:8000"
echo "  - Docs: http://localhost:8000/docs"
echo "  - Health: http://localhost:8000/health"
echo ""

# Start the server
python -m uvicorn app.main:app --reload
