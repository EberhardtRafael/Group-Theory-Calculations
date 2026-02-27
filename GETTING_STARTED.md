# Getting Started Guide

Welcome to the Group Theory Web Calculator! This guide will help you set up the development environment and start building.

## 📋 Prerequisites

Before you begin, ensure you have:

- **Python 3.10+** ([Download](https://www.python.org/downloads/))
- **Node.js 18+** and npm ([Download](https://nodejs.org/))
- **SageMath** - The computational engine
  - Ubuntu/Debian: `sudo apt-get install sagemath`
  - macOS: `brew install sagemath`
  - Other: See [SageMath installation](https://doc.sagemath.org/html/en/installation/)
- **Docker & Docker Compose** (optional but recommended)
- **Git** for version control

---

## 🚀 Quick Start with Docker (Recommended)

The easiest way to get started:

```bash
# 1. Clone the repository
git clone https://github.com/your-username/group-theory-calculator.git
cd group-theory-calculator

# 2. Start all services
docker-compose up -d

# 3. Wait for services to start (first time takes ~2 minutes)
docker-compose logs -f

# 4. Access the application
# Frontend: http://localhost:3000
# API: http://localhost:8000
# API Docs: http://localhost:8000/docs
```

That's it! The application should now be running.

---

## 🛠️ Manual Setup (For Development)

### Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create and activate virtual environment
python -m venv venv

# On Linux/Mac:
source venv/bin/activate

# On Windows:
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Copy environment variables
cp .env.example .env

# Edit .env with your settings
nano .env  # or use your favorite editor

# Check if Sage is installed
sage --version

# Run database migrations (when we add them)
# alembic upgrade head

# Start the backend server
uvicorn app.main:app --reload

# Server will start at http://localhost:8000
# API docs at http://localhost:8000/docs
```

### Frontend Setup

Open a **new terminal** (keep backend running):

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Edit .env if needed
nano .env

# Start development server
npm run dev

# Frontend will start at http://localhost:3000
```

### Supporting Services (PostgreSQL & Redis)

If not using Docker:

```bash
# Install PostgreSQL
# Ubuntu/Debian:
sudo apt-get install postgresql

# macOS:
brew install postgresql

# Start PostgreSQL
sudo service postgresql start  # Linux
brew services start postgresql  # macOS

# Create database
createdb grouptheory

# Install Redis
# Ubuntu/Debian:
sudo apt-get install redis-server

# macOS:
brew install redis

# Start Redis
sudo service redis-server start  # Linux
brew services start redis  # macOS
```

---

## ✅ Verify Installation

### 1. Check Backend

```bash
# Open browser or use curl
curl http://localhost:8000/health

# Expected response:
# {"status":"healthy","version":"0.1.0"}

# Try API docs
# Open: http://localhost:8000/docs
```

### 2. Check Frontend

```bash
# Open browser
# http://localhost:3000

# You should see the homepage
```

### 3. Test Sage Integration

```bash
# In Python REPL (in backend venv)
python

>>> from sage.all import *
>>> CT = CartanType("A2")  # SU(3)
>>> print(CT.cartan_matrix())
[ 2 -1]
[-1  2]
>>> exit()
```

---

## 🧪 Run Tests

### Backend Tests

```bash
cd backend
pytest

# With coverage
pytest --cov=app tests/

# Run specific test
pytest tests/test_groups.py
```

### Frontend Tests

```bash
cd frontend
npm test

# Watch mode
npm test -- --watch
```

---

## 📁 Project Structure Overview

```
Group-Theory-Calculations/
├── backend/                 # FastAPI backend
│   ├── app/
│   │   ├── api/v1/         # API endpoints
│   │   ├── compute/        # Sage integration (to be added)
│   │   ├── models/         # Database models (to be added)
│   │   ├── services/       # Business logic (to be added)
│   │   ├── config.py       # Configuration
│   │   └── main.py         # FastAPI app
│   ├── tests/              # Backend tests
│   ├── requirements.txt    # Python dependencies
│   └── Dockerfile
│
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API client
│   │   └── App.tsx        # Main app component
│   ├── package.json       # Node dependencies
│   └── Dockerfile
│
├── docker-compose.yml     # Multi-container setup
├── PROJECT_SPEC.md        # Complete technical specification
├── GETTING_STARTED.md     # This file
└── README.md              # Project overview
```

---

## 🎯 First Tasks

Now that everything is set up, here's what to do next:

### 1. Explore the API

Visit http://localhost:8000/docs and try the endpoints:

- `GET /` - Root endpoint
- `GET /health` - Health check
- `POST /api/v1/groups/create` - Create a group (mock data for now)
- `POST /api/v1/irreps/tensor-product` - Calculate tensor product

### 2. Test the Frontend

Visit http://localhost:3000:

- Browse the homepage
- Click "Open Calculator"
- Try the group selector
- Attempt a tensor product calculation

### 3. Implement Your First Feature

Choose one to start:

#### Option A: Implement Real Sage Integration

Edit `backend/app/compute/sage_wrapper.py` (you'll need to create this):

```python
# backend/app/compute/sage_wrapper.py

import subprocess
import json
from typing import Dict, Any

class SageCompute:
    @staticmethod
    def create_group(name: str) -> Dict[str, Any]:
        """Create Lie group using Sage"""
        script = f"""
from sage.all import *
import json

ct = CartanType('{name}')
cm = ct.cartan_matrix()

result = {{
    'rank': ct.rank(),
    'cartan_matrix': cm.rows(),
    'dimension': ct.root_system().ambient_space().dimension()
}}

print(json.dumps(result))
"""
        process = subprocess.run(
            ["sage", "-c", script],
            capture_output=True,
            text=True,
            timeout=30
        )
        return json.loads(process.stdout)
```

Then update `backend/app/api/v1/endpoints/groups.py` to use it.

#### Option B: Add Dynkin Diagram Visualization

Create `frontend/src/components/diagrams/DynkinDiagram.tsx`:

```typescript
import { useEffect, useRef } from 'react'
import * as d3 from 'd3'

interface DynkinDiagramProps {
  group: string
  cartanMatrix: number[][]
}

export function DynkinDiagram({ group, cartanMatrix }: DynkinDiagramProps) {
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    if (!svgRef.current) return

    const svg = d3.select(svgRef.current)
    // Clear previous
    svg.selectAll('*').remove()

    // Draw nodes and edges based on Cartan matrix
    // TODO: Implement D3 rendering logic
  }, [group, cartanMatrix])

  return <svg ref={svgRef} width={600} height={200} />
}
```

#### Option C: Add Tests

Create `backend/tests/test_groups.py`:

```python
import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_create_su3():
    response = client.post(
        "/api/v1/groups/create",
        json={"name": "SU3", "notation": "cartan"}
    )
    assert response.status_code == 201
    data = response.json()
    assert data["name"] == "SU3"
    assert data["rank"] == 2
```

---

## 🐛 Common Issues

### Issue: "sage: command not found"

**Solution:** Make sure Sage is installed and in PATH:

```bash
# Check installation
sage --version

# If not found, install:
# Ubuntu/Debian:
sudo apt-get install sagemath

# macOS:
brew install sagemath
```

### Issue: Frontend "Cannot connect to API"

**Solution:** Check if backend is running:

```bash
curl http://localhost:8000/health

# If not running, start it:
cd backend
source venv/bin/activate
uvicorn app.main:app --reload
```

### Issue: "Module 'app' not found"

**Solution:** Make sure you're in the correct directory with venv activated:

```bash
cd backend
source venv/bin/activate  # Linux/Mac
# or
venv\Scripts\activate  # Windows
python -c "import app; print(app.__version__)"
```

### Issue: Docker "sage: not found"

**Solution:** The Docker image uses `sagemath/sagemath:latest` which includes Sage. If issues persist:

```bash
docker-compose down
docker-compose build --no-cache
docker-compose up
```

---

## 📚 Next Steps

1. Read [PROJECT_SPEC.md](PROJECT_SPEC.md) for complete architecture
2. Check [README.md](README.md) for project overview
3. Browse the code to understand structure
4. Pick a feature from the roadmap and implement it
5. Submit a pull request!

---

## 🤝 Getting Help

- **GitHub Issues:** Report bugs or request features
- **GitHub Discussions:** Ask questions, share ideas
- **Documentation:** Check PROJECT_SPEC.md for detailed info

---

## 📖 Learning Resources

### Group Theory & Physics
- Georgi: "Lie Algebras in Particle Physics"
- Slansky: "Group Theory for Unified ModelBuilding"
- Your Master's dissertation (2021)

### Web Development
- [FastAPI Tutorial](https://fastapi.tiangolo.com/tutorial/)
- [React Docs](https://react.dev/learn)
- [D3.js Tutorial](https://d3js.org/getting-started)

### SageMath
- [Sage Documentation](https://doc.sagemath.org/)
- [Sage Tutorial](https://doc.sagemath.org/html/en/tutorial/)
- [Lie Algebras in Sage](https://doc.sagemath.org/html/en/reference/combinat/sage/combinat/root_system/root_system.html)

---

**You're all set! Happy coding! 🚀**

*Building the future of group theory calculations, one commit at a time.*
