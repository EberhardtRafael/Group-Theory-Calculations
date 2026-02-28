#!/bin/bash

# Test runner script for the entire project
# Run all backend and frontend tests with coverage

set -e  # Exit on error

echo "======================================================================"
echo "  GROUP THEORY CALCULATOR - COMPREHENSIVE TEST SUITE"
echo "======================================================================"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Track results
BACKEND_PASSED=0
FRONTEND_PASSED=0

# Backend Tests
echo "======================================================================"
echo "  BACKEND TESTS (Python/FastAPI)"
echo "======================================================================"
echo ""

cd backend

if python3 -m pytest -v --tb=short; then
    echo -e "${GREEN}✅ Backend tests PASSED${NC}"
    BACKEND_PASSED=1
else
    echo -e "${RED}❌ Backend tests FAILED${NC}"
fi

echo ""
echo "Running backend tests with coverage..."
python3 -m pytest --cov=app --cov-report=term --cov-report=html:coverage_html

echo ""
echo -e "${YELLOW}📊 Backend coverage report generated at: backend/coverage_html/index.html${NC}"
echo ""

cd ..

# Frontend Tests
echo "======================================================================"
echo "  FRONTEND TESTS (React/Next.js)"
echo "======================================================================"
echo ""

cd frontend

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "Installing frontend dependencies..."
    npm install
fi

if npm test -- --ci --coverage; then
    echo -e "${GREEN}✅ Frontend tests PASSED${NC}"
    FRONTEND_PASSED=1
else
    echo -e "${RED}❌ Frontend tests FAILED${NC}"
fi

echo ""
echo -e "${YELLOW}📊 Frontend coverage report generated at: frontend/coverage/index.html${NC}"
echo ""

cd ..

# Summary
echo "======================================================================"
echo "  TEST SUMMARY"
echo "======================================================================"
echo ""

if [ $BACKEND_PASSED -eq 1 ]; then
    echo -e "${GREEN}✅ Backend:  PASSED${NC}"
else
    echo -e "${RED}❌ Backend:  FAILED${NC}"
fi

if [ $FRONTEND_PASSED -eq 1 ]; then
    echo -e "${GREEN}✅ Frontend: PASSED${NC}"
else
    echo -e "${RED}❌ Frontend: FAILED (No tests yet or dependencies not installed)${NC}"
fi

echo ""

if [ $BACKEND_PASSED -eq 1 ] && [ $FRONTEND_PASSED -eq 1 ]; then
    echo -e "${GREEN}======================================================================"
    echo "  ✅ ALL TESTS PASSED!"
    echo -e "======================================================================${NC}"
    exit 0
elif [ $BACKEND_PASSED -eq 1 ]; then
    echo -e "${YELLOW}======================================================================"
    echo "  ⚠️  BACKEND PASSED, FRONTEND NEEDS WORK"
    echo -e "======================================================================${NC}"
    exit 1
else
    echo -e "${RED}======================================================================"
    echo "  ❌ TESTS FAILED"
    echo -e "======================================================================${NC}"
    exit 1
fi
