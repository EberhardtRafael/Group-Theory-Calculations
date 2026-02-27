# Group Theory Web Calculator

**Interactive web application for Lie algebra calculations and symmetry breaking in particle physics**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Python 3.10+](https://img.shields.io/badge/python-3.10+-blue.svg)](https://www.python.org/downloads/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.104+-green.svg)](https://fastapi.tiangolo.com/)
[![React 18](https://img.shields.io/badge/React-18+-61dafb.svg)](https://react.dev/)

## 🎯 Vision

A **zero-installation** web tool for physicists to perform group theory calculations for Grand Unified Theories (GUTs), featuring:

- 🖱️ **Interactive Dynkin diagrams** - Click nodes to break symmetry
- 📊 **Real-time visualizations** - Multiplets, Hasse diagrams, weight spaces
- 🚀 **Fast computations** - Powered by SageMath C libraries
- 📱 **Mobile-friendly** - Use on any device
- 🔗 **Shareable results** - Generate URLs for your calculations
- 🎓 **Educational** - Perfect for teaching and learning

### Target Users
- Graduate students learning GUTs
- Researchers doing quick calculations
- Professors for classroom demonstrations
- Anyone exploring Lie algebras without installing heavy software

---

## 🏗️ Architecture

```
┌─────────────┐
│   React     │  ← Interactive UI with D3.js visualizations
│  Frontend   │
└──────┬──────┘
       │ REST API
       ↓
┌─────────────┐
│   FastAPI   │  ← Python async backend
│   Backend   │
└──────┬──────┘
       │
       ↓
┌─────────────┐
│  SageMath   │  ← Computational engine (C/Cython)
│   + Redis   │
└─────────────┘
```

**Tech Stack:**
- **Backend:** Python 3.10+, FastAPI, Celery, Redis, PostgreSQL
- **Frontend:** React 18, TypeScript, D3.js, Three.js, Vite
- **Compute:** SageMath (Lie algebra library)
- **Deploy:** Docker, Railway/AWS

---

## 🚀 Quick Start

### Prerequisites
- Python 3.10+
- Node.js 18+
- SageMath
- Docker & Docker Compose (optional)

### Option 1: Docker (Recommended)

```bash
# Clone the repository
git clone https://github.com/your-username/group-theory-calculator.git
cd group-theory-calculator

# Start all services
docker-compose up -d

# Access the application
# Frontend: http://localhost:3000
# API: http://localhost:8000
# API Docs: http://localhost:8000/docs
```

### Option 2: Manual Setup

#### Backend

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Install SageMath
# Ubuntu/Debian:
sudo apt-get install sagemath

# macOS:
brew install sagemath

# Set up database
alembic upgrade head

# Run development server
uvicorn app.main:app --reload
```

#### Frontend

```bash
cd frontend

# Install dependencies
npm install

# Run development server
npm run dev
```

---

## 📖 Features

### Core Calculations

#### 1. **Group Creation**
```python
# Create any classical or exceptional Lie group
POST /api/v1/groups/create
{
  "name": "SO10",
  "notation": "cartan"
}
```

#### 2. **Symmetry Breaking**
```python
# Break SO(10) → SU(5) ⊗ U(1)
POST /api/v1/groups/{id}/break-symmetry
{
  "node_index": 4,
  "method": "standard"
}
```

#### 3. **Irrep Construction**
```python
# Build irreducible representations
POST /api/v1/groups/{id}/irreps
{
  "highest_weight": [0, 0, 0, 1, 0],
  "method": "weyl_reflection"
}
```

#### 4. **Tensor Products**
```python
# Decompose 3 ⊗ 3 = 3̄ ⊕ 6
POST /api/v1/irreps/tensor-product
{
  "group": "SU3",
  "irrep1": [1, 0],
  "irrep2": [1, 0]
}
```

### Visualizations

- **Dynkin Diagrams** - Interactive node clicking
- **Hasse Diagrams** - Irrep construction paths
- **Weight Space** - 2D/3D multiplet visualization
- **Symmetry Breaking** - Visual group decomposition

---

## 🧪 Development

### Project Structure

```
Group-Theory-Calculations/
├── backend/
│   ├── app/
│   │   ├── api/v1/         # API endpoints
│   │   ├── compute/        # Sage/LiE wrappers
│   │   ├── models/         # Database models
│   │   ├── schemas/        # Pydantic schemas
│   │   ├── services/       # Business logic
│   │   └── main.py         # FastAPI app
│   ├── tests/
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Page components
│   │   ├── hooks/          # Custom hooks
│   │   ├── services/       # API client
│   │   └── App.tsx
│   ├── package.json
│   └── Dockerfile
├── docker-compose.yml
├── PROJECT_SPEC.md         # Complete technical spec
└── README.md
```

### Running Tests

```bash
# Backend tests
cd backend
pytest

# Frontend tests
cd frontend
npm test

# Integration tests
docker-compose -f docker-compose.test.yml up
```

### API Documentation

Once the backend is running, visit:
- **Swagger UI:** http://localhost:8000/docs
- **ReDoc:** http://localhost:8000/redoc

---

## 🎓 Educational Materials

### Example: SO(10) GUT Symmetry Breaking

```python
# Standard Model from SO(10)
SO(10) → SU(5) ⊗ U(1)
       → SU(3) ⊗ SU(2) ⊗ U(1) ⊗ U(1)
       → SU(3) ⊗ SU(2) ⊗ U(1)_Y

# Using the API
1. Create SO(10)
2. Cross node 4 → SU(5) ⊗ U(1)
3. Cross node 2 → SU(3) ⊗ SU(2) ⊗ U(1)
4. Visualize spinor 16 decomposition
```

### Tutorials
- [Getting Started with Dynkin Diagrams](docs/tutorials/dynkin-diagrams.md)
- [Understanding Symmetry Breaking](docs/tutorials/symmetry-breaking.md)
- [Tensor Product Calculations](docs/tutorials/tensor-products.md)
- [Building Custom Representations](docs/tutorials/custom-irreps.md)

---

## 🤝 Contributing

We welcome contributions! Areas where you can help:

- **Frontend:** React components, D3.js visualizations
- **Backend:** FastAPI endpoints, Sage integration
- **Documentation:** Tutorials, examples, API docs
- **Testing:** Unit tests, integration tests
- **Physics:** Validation, example calculations

### Development Workflow

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Run tests: `pytest` and `npm test`
5. Commit: `git commit -m 'Add amazing feature'`
6. Push: `git push origin feature/amazing-feature`
7. Open a Pull Request

---

## 📚 Background

This project originated from a Master's dissertation:

> **"A Python Library for Group Theory Calculations in Particle Physics"**  
> Rafael Sarate (2021)  
> Universidade Federal do Rio Grande do Sul (UFRGS), Brazil  
> Advisor: Prof. Dr. Daniel Gammerman

The original PyLA library (Python 2) is being reimagined as a modern web application, making group theory tools accessible to everyone without installation barriers.

### Key Innovations

1. **First web-based GUT calculator** - No competitors in this space
2. **Interactive symmetry breaking** - Visual, intuitive interface
3. **Zero installation** - Browser-based, works everywhere
4. **Educational focus** - Designed for learning and teaching

---

## 📄 License

MIT License - See [LICENSE](LICENSE) for details

---

## 🔗 Links

- **Live Demo:** [grouptheory.app](https://grouptheory.app) *(coming soon)*
- **Documentation:** [docs.grouptheory.app](https://docs.grouptheory.app) *(coming soon)*
- **Issues:** [GitHub Issues](https://github.com/your-username/group-theory-calculator/issues)
- **Discussions:** [GitHub Discussions](https://github.com/your-username/group-theory-calculator/discussions)

---

## 📧 Contact

**Rafael Sarate**  
Email: your.email@example.com  
GitHub: [@your-username](https://github.com/your-username)

---

## 🙏 Acknowledgments

- **SageMath** - Computational foundations
- **Prof. Daniel Gammerman** - Academic guidance
- **UFRGS Physics Department** - Original research support
- **FastAPI & React communities** - Excellent frameworks

---

## 🗺️ Roadmap

### Phase 1: MVP (Current) - Q1 2026
- [x] Technical specification
- [x] Project structure setup
- [ ] Backend foundation (FastAPI + Sage)
- [ ] Frontend foundation (React + TypeScript)
- [ ] Basic Dynkin diagram rendering
- [ ] Simple calculation endpoints
- [ ] Alpha deployment

### Phase 2: Core Features - Q2 2026
- [ ] Complete symmetry breaking
- [ ] Tensor product calculator
- [ ] 3D visualizations (Three.js)
- [ ] Caching system (Redis)
- [ ] Heavy calculation queue (Celery)
- [ ] WebSocket real-time updates

### Phase 3: Polish - Q3 2026
- [ ] User accounts (optional)
- [ ] Save/share calculations
- [ ] Mobile optimization
- [ ] Performance tuning
- [ ] Beta release

### Phase 4: Educational - Q4 2026
- [ ] Tutorial system
- [ ] Example library
- [ ] Video guides
- [ ] Academic partnerships
- [ ] Public release

---

**Built with ❤️ for the physics community**

*Making group theory accessible, one calculation at a time.*





