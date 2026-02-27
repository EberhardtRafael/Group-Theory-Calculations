#!/bin/bash

echo "🎨 Group Theory Calculator - Frontend Quick Start"
echo "================================================="
echo ""

# Check Node
echo "✓ Checking Node.js..."
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install Node.js 18+"
    exit 1
fi
node --version
npm --version

# Check if we're in the right directory
if [ ! -f "PROJECT_SPEC.md" ]; then
    echo "❌ Please run this script from the project root directory"
    exit 1
fi

echo ""
echo "📦 Setting up frontend..."
cd frontend

# Install dependencies
if [ ! -d "node_modules" ]; then
    echo "  Installing dependencies (this may take a few minutes)..."
    npm install
else
    echo "  Dependencies already installed ✓"
fi

# Copy env file if needed
if [ ! -f ".env" ]; then
    echo "  Creating .env file..."
    cp .env.example .env
fi

echo ""
echo "🧪 Starting development server..."
echo "  Once started:"
echo "  - Frontend: http://localhost:3000"
echo "  - Hot reload enabled"
echo ""
echo "  Press Ctrl+C to stop"
echo ""

# Start the dev server
npm run dev
