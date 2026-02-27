# Group Theory Web Calculator - Technical Specification
**Project:** Web-based GUT (Grand Unified Theory) Calculator  
**Purpose:** Interactive tool for Lie algebra calculations and symmetry breaking visualization  
**Author:** Rafael Sarate  
**Date:** February 2026  

---

## 1. PROJECT VISION

### Problem Statement
Physicists need to perform group theory calculations for particle physics (GUTs), but current tools require:
- Installing large software (Sage ~2GB)
- Expensive licenses (Mathematica for LieART)
- Complex CLI interfaces (LiE)
- Manual calculations (tedious, error-prone)

### Solution
**Web application** providing instant access to group theory calculations with:
- Zero installation
- Interactive visualizations
- Mobile-friendly interface
- Shareable calculation URLs
- Educational focus

### Target Users
1. **Graduate students** learning GUTs
2. **Researchers** doing quick checks
3. **Professors** for teaching demonstrations
4. **Undergraduate physics majors** exploring group theory

---

## 2. TECHNICAL STACK

### Backend
```
Language: Python 3.10+
Framework: FastAPI (async, fast, modern)
API Style: REST + WebSocket (for long calculations)
Compute Engine: Sage (via subprocess) or LiE wrapper
Caching: Redis
Database: PostgreSQL (for user accounts, saved calculations)
Task Queue: Celery (for heavy calculations)
```

**Why FastAPI:**
- Automatic OpenAPI docs
- Type hints & validation (Pydantic)
- Async support for concurrent requests
- WebSocket support for real-time updates
- You have Python backend experience

### Frontend
```
Framework: React 18+ with TypeScript
State Management: Zustand (lightweight) or Redux Toolkit
UI Library: shadcn/ui (Tailwind-based, modern)
Visualization: D3.js for Dynkin diagrams, Three.js for 3D multiplets
Math Rendering: MathJax v3
HTTP Client: Axios
Build Tool: Vite
```

**Why React:**
- Component reusability for diagrams
- Large ecosystem for math/viz
- Easy to make interactive diagrams
- TypeScript for type safety

### Infrastructure
```
Deployment: Docker + Docker Compose
Hosting: Railway (simple) or AWS ECS (scalable)
CDN: Cloudflare (caching, DDoS protection)
CI/CD: GitHub Actions
Monitoring: Sentry (errors) + Prometheus (metrics)
```

### Development Tools
```
Backend Testing: pytest, pytest-asyncio
Frontend Testing: Vitest, React Testing Library
Linting: ruff (Python), eslint (TypeScript)
Formatting: black (Python), prettier (TypeScript)
API Testing: httpie or Postman
```

---

## 3. SYSTEM ARCHITECTURE

### High-Level Architecture
```
┌─────────────────┐
│   Web Browser   │
│  (React SPA)    │
└────────┬────────┘
         │ HTTPS/WSS
         ↓
┌─────────────────┐
│   Load Balancer │
│   (Cloudflare)  │
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│  FastAPI Server │
│  (Python)       │
└────┬────┬───────┘
     │    │
     │    └─────→ ┌──────────┐
     │            │  Redis   │ (Cache)
     │            └──────────┘
     │
     └─────→ ┌──────────────┐
             │  Celery      │ (Task Queue)
             │  Workers     │
             └──────┬───────┘
                    │
                    ↓
             ┌──────────────┐
             │  Sage/LiE    │ (Compute)
             │  (C libs)    │
             └──────────────┘

┌─────────────────┐
│   PostgreSQL    │ (Persistent Data)
└─────────────────┘
```

### Request Flow

**Simple Calculation (< 1 second):**
```
User → Frontend → API → Sage/LiE → API → Frontend → User
                   ↓
                 Redis (cache result)
```

**Heavy Calculation (> 1 second):**
```
User → Frontend → API → Celery Task ID → Frontend (polling)
                         ↓
                    Celery Worker
                         ↓
                    Sage/LiE computation
                         ↓
                    Update task status
                         ↑
Frontend polls ← API checks task status
```

**WebSocket Real-time (alternative):**
```
User → Frontend ←─WebSocket─→ API → Celery → Updates via socket
```

---

## 4. API DESIGN

### Base URL
```
Production: https://api.grouptheory.app
Development: http://localhost:8000
```

### Endpoints

#### 4.1 Group Operations
```http
POST /api/v1/groups/create
Content-Type: application/json

{
  "name": "SO10",
  "notation": "cartan"  // or "physicist"
}

Response 200:
{
  "id": "uuid",
  "name": "SO10",
  "cartan_name": "D5",
  "rank": 5,
  "cartan_matrix": [[2, -1, 0, 0, 0], ...],
  "simple_roots": [...],
  "dynkin_diagram_svg": "<svg>...</svg>"
}
```

#### 4.2 Symmetry Breaking
```http
POST /api/v1/groups/{group_id}/break-symmetry
Content-Type: application/json

{
  "node_index": 4,
  "method": "standard"  // or "extended"
}

Response 200:
{
  "original_group": "SO10",
  "broken_groups": ["SU5", "U1"],
  "diagram_svg": "<svg>...</svg>",
  "latex": "SO(10) \\rightarrow SU(5) \\otimes U(1)"
}
```

#### 4.3 Irrep Construction
```http
POST /api/v1/groups/{group_id}/irreps
Content-Type: application/json

{
  "highest_weight": [0, 0, 0, 1, 0],
  "method": "weyl_reflection"  // or "freudenthal"
}

Response 200:
{
  "dimension": 16,
  "weights": [...],
  "multiplicities": [...],
  "hasse_diagram": {...},
  "latex_name": "16"
}
```

#### 4.4 Tensor Product
```http
POST /api/v1/irreps/tensor-product
Content-Type: application/json

{
  "group": "SU3",
  "irrep1": [1, 0],
  "irrep2": [1, 0]
}

Response 200:
{
  "decomposition": [
    {"weight": [0, 1], "dimension": 3, "name": "3̄"},
    {"weight": [2, 0], "dimension": 6, "name": "6"}
  ],
  "latex": "3 \\otimes 3 = \\bar{3} \\oplus 6"
}
```

#### 4.5 Heavy Calculation (Async)
```http
POST /api/v1/calculations/submit
Content-Type: application/json

{
  "operation": "tensor_product_power",
  "group": "E6",
  "irrep": [1, 0, 0, 0, 0, 0],
  "power": 7
}

Response 202:
{
  "task_id": "uuid",
  "status": "pending",
  "estimated_time": 120  // seconds
}

GET /api/v1/calculations/{task_id}/status

Response 200:
{
  "task_id": "uuid",
  "status": "completed",  // or "pending", "running", "failed"
  "progress": 100,
  "result": {...}
}
```

#### 4.6 Visualization
```http
GET /api/v1/visualizations/dynkin?group=SO10&crossed_node=4

Response 200:
{
  "svg": "<svg>...</svg>",
  "nodes": [
    {"index": 0, "crossed": false, "position": [0, 0]},
    ...
  ]
}

POST /api/v1/visualizations/multiplet
Content-Type: application/json

{
  "group": "SU3",
  "irrep": [1, 1],
  "dimension": "2d"  // or "3d"
}

Response 200:
{
  "weights": [[x, y], ...],
  "svg": "<svg>...</svg>"  // or "three_js_data" for 3D
}
```

---

## 5. DATABASE SCHEMA

### PostgreSQL Tables

```sql
-- Users (optional, for saving calculations)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    is_active BOOLEAN DEFAULT TRUE
);

-- Saved Calculations
CREATE TABLE calculations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    operation_type VARCHAR(50) NOT NULL,
    input_data JSONB NOT NULL,
    result_data JSONB,
    status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT NOW(),
    completed_at TIMESTAMP,
    share_token VARCHAR(32) UNIQUE,  -- for sharing URLs
    is_public BOOLEAN DEFAULT FALSE
);

CREATE INDEX idx_calculations_user ON calculations(user_id);
CREATE INDEX idx_calculations_share ON calculations(share_token);

-- Cached Results (in addition to Redis)
CREATE TABLE result_cache (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cache_key VARCHAR(255) UNIQUE NOT NULL,
    result_data JSONB NOT NULL,
    computation_time FLOAT,
    created_at TIMESTAMP DEFAULT NOW(),
    access_count INT DEFAULT 0,
    last_accessed TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_cache_key ON result_cache(cache_key);

-- Usage Analytics
CREATE TABLE api_requests (
    id BIGSERIAL PRIMARY KEY,
    endpoint VARCHAR(255),
    method VARCHAR(10),
    status_code INT,
    duration_ms FLOAT,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_requests_created ON api_requests(created_at);
```

### Redis Cache Structure
```
# Pattern: operation:group:params:hash
cache_key = f"tensor_prod:SU3:{hash(params)}"

# Example keys:
"irrep:SU3:1,0" → dimension, weights, etc.
"symmetry_break:SO10:4" → broken groups
"tensor:E6:1,0,0,0,0,0:power:3" → decomposition
```

---

## 6. FRONTEND ARCHITECTURE

### Component Structure
```
src/
├── components/
│   ├── common/
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   └── Card.tsx
│   ├── diagrams/
│   │   ├── DynkinDiagram.tsx       # Interactive Dynkin diagram
│   │   ├── HasseDiagram.tsx        # Irrep construction visualization
│   │   ├── MultipletDiagram2D.tsx  # Quantum number space
│   │   └── MultipletDiagram3D.tsx  # Three.js 3D visualization
│   ├── calculators/
│   │   ├── GroupSelector.tsx
│   │   ├── SymmetryBreaker.tsx
│   │   ├── IrrepBuilder.tsx
│   │   └── TensorProductCalc.tsx
│   └── layout/
│       ├── Header.tsx
│       ├── Sidebar.tsx
│       └── Footer.tsx
├── pages/
│   ├── Home.tsx
│   ├── Calculator.tsx
│   ├── Learn.tsx                   # Educational content
│   └── Results.tsx                 # Shared calculation view
├── hooks/
│   ├── useGroupTheory.ts
│   ├── useCalculation.ts
│   └── useVisualization.ts
├── services/
│   ├── api.ts                      # Axios instance
│   └── websocket.ts                # WebSocket connection
├── store/
│   └── calculationStore.ts         # Zustand store
├── types/
│   └── grouptheory.ts              # TypeScript types
└── utils/
    ├── mathHelpers.ts
    └── formatting.ts
```

### Key Component: DynkinDiagram.tsx
```typescript
interface DynkinDiagramProps {
  group: Group;
  crossedNode?: number;
  onNodeClick?: (index: number) => void;
  interactive?: boolean;
}

export const DynkinDiagram: React.FC<DynkinDiagramProps> = ({
  group,
  crossedNode,
  onNodeClick,
  interactive = false
}) => {
  // Render SVG with D3
  // Nodes as circles
  // Edges as lines (1, 2, 3 lines based on Cartan matrix)
  // Click handler for interactive mode
  // Crossed node styling
}
```

### State Management
```typescript
// Zustand store
interface CalculationState {
  currentGroup: Group | null;
  currentIrrep: Irrep | null;
  calculationHistory: Calculation[];
  setGroup: (group: Group) => void;
  breakSymmetry: (nodeIndex: number) => Promise<void>;
  calculateTensorProduct: (irrep1, irrep2) => Promise<void>;
}

export const useCalculationStore = create<CalculationState>((set) => ({...}));
```

---

## 7. COMPUTATION BACKEND

### Sage Integration (Primary Option)

```python
# backend/compute/sage_wrapper.py

import subprocess
import json
from typing import List, Dict, Any

class SageCompute:
    """Wrapper for Sage computations via subprocess"""
    
    @staticmethod
    def call_sage(script: str, timeout: int = 30) -> Dict[str, Any]:
        """Execute Sage script and return JSON result"""
        process = subprocess.run(
            ["sage", "-c", script],
            capture_output=True,
            text=True,
            timeout=timeout
        )
        return json.loads(process.stdout)
    
    def create_group(self, name: str) -> Dict[str, Any]:
        """Create Lie group and return properties"""
        script = f"""
from sage.all import *
from sage.combinat.root_system.cartan_type import CartanType

ct = CartanType('{name}')
cartan_matrix = ct.cartan_matrix()
dynkin_diagram = ct.dynkin_diagram()

print(json.dumps({{
    'rank': ct.rank(),
    'cartan_matrix': cartan_matrix.rows(),
    'simple_roots': list(dynkin_diagram.vertices())
}}))
"""
        return self.call_sage(script)
    
    def tensor_product(self, group: str, irrep1: List[int], 
                      irrep2: List[int]) -> Dict[str, Any]:
        """Calculate tensor product decomposition"""
        script = f"""
from sage.all import *
from sage.combinat.sf.sf import SymmetricFunctions

# For SU(n) example
s = SymmetricFunctions(QQ).schur()
result = s{irrep1} * s{irrep2}

# Convert to list of (partition, coefficient)
decomposition = [(list(p), int(c)) for p, c in result]
print(json.dumps({{'decomposition': decomposition}}))
"""
        return self.call_sage(script, timeout=60)
```

### Alternative: LiE Integration

```python
# backend/compute/lie_wrapper.py

class LiECompute:
    """Wrapper for LiE C library"""
    
    def __init__(self, lie_executable: str = "lie"):
        self.lie_exec = lie_executable
    
    def execute(self, commands: str) -> str:
        """Execute LiE commands"""
        process = subprocess.run(
            [self.lie_exec],
            input=commands,
            capture_output=True,
            text=True
        )
        return process.stdout
    
    def decompose(self, group: str, weights: List[int]) -> List[Dict]:
        """Decompose representation"""
        commands = f"""
{group}
decomp({weights})
quit
"""
        result = self.execute(commands)
        return self._parse_lie_output(result)
```

---

## 8. IMPLEMENTATION PHASES

### Phase 1: MVP (4 weeks)
**Week 1: Backend Foundation**
- [ ] FastAPI project setup
- [ ] Sage wrapper for basic operations
- [ ] Create group endpoint
- [ ] Simple irrep construction
- [ ] Unit tests

**Week 2: Frontend Foundation**
- [ ] React + TypeScript setup
- [ ] API client with Axios
- [ ] Group selector component
- [ ] Basic calculation form
- [ ] Result display

**Week 3: Visualization**
- [ ] Dynkin diagram rendering (D3.js)
- [ ] Interactive node clicking
- [ ] Simple 2D multiplet plot
- [ ] LaTeX rendering (MathJax)

**Week 4: Integration & Deploy**
- [ ] Connect frontend to backend
- [ ] Docker containerization
- [ ] Deploy to Railway/Heroku
- [ ] Basic testing
- [ ] Alpha release

### Phase 2: Core Features (4 weeks)
- [ ] Symmetry breaking (standard + extended)
- [ ] Tensor product calculator
- [ ] Hasse diagram visualization
- [ ] 3D multiplet viewer (Three.js)
- [ ] Result caching (Redis)
- [ ] Heavy calculation queue (Celery)
- [ ] WebSocket for real-time updates

### Phase 3: Polish (2 weeks)
- [ ] User accounts (optional)
- [ ] Save/share calculations
- [ ] Calculation history
- [ ] Mobile responsive design
- [ ] Performance optimization
- [ ] Error handling improvements

### Phase 4: Educational Content (2 weeks)
- [ ] Tutorial pages
- [ ] Example calculations
- [ ] Interactive learning mode
- [ ] Documentation
- [ ] Video tutorials

---

## 9. FILE STRUCTURE

### Backend
```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py                 # FastAPI app
│   ├── config.py               # Settings
│   ├── dependencies.py         # DI
│   ├── api/
│   │   ├── v1/
│   │   │   ├── endpoints/
│   │   │   │   ├── groups.py
│   │   │   │   ├── irreps.py
│   │   │   │   ├── calculations.py
│   │   │   │   └── visualizations.py
│   │   │   └── router.py
│   ├── compute/
│   │   ├── sage_wrapper.py
│   │   ├── lie_wrapper.py
│   │   └── cache.py
│   ├── models/
│   │   ├── group.py
│   │   ├── irrep.py
│   │   └── calculation.py
│   ├── schemas/
│   │   ├── group.py
│   │   ├── irrep.py
│   │   └── calculation.py
│   ├── services/
│   │   ├── group_service.py
│   │   ├── irrep_service.py
│   │   └── calculation_service.py
│   ├── tasks/
│   │   └── celery_tasks.py
│   └── utils/
│       ├── math_helpers.py
│       └── visualization.py
├── tests/
│   ├── test_groups.py
│   ├── test_irreps.py
│   └── test_calculations.py
├── alembic/                    # DB migrations
├── docker/
│   ├── Dockerfile
│   └── docker-compose.yml
├── requirements.txt
└── pyproject.toml
```

### Frontend
```
frontend/
├── public/
│   └── index.html
├── src/
│   ├── App.tsx
│   ├── main.tsx
│   ├── components/           # (detailed above)
│   ├── pages/
│   ├── hooks/
│   ├── services/
│   ├── store/
│   ├── types/
│   ├── utils/
│   └── styles/
│       └── globals.css
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.js
```

---

## 10. DEPLOYMENT

### Docker Setup
```yaml
# docker-compose.yml

version: '3.8'

services:
  backend:
    build: ./backend
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=postgresql://user:pass@db:5432/grouptheory
      - REDIS_URL=redis://redis:6379/0
    depends_on:
      - db
      - redis
    volumes:
      - ./backend:/app
    command: uvicorn app.main:app --host 0.0.0.0 --reload

  celery_worker:
    build: ./backend
    command: celery -A app.tasks worker --loglevel=info
    environment:
      - DATABASE_URL=postgresql://user:pass@db:5432/grouptheory
      - REDIS_URL=redis://redis:6379/0
    depends_on:
      - redis
      - db

  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    volumes:
      - ./frontend:/app
    command: npm run dev

  db:
    image: postgres:15
    environment:
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=pass
      - POSTGRES_DB=grouptheory
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

volumes:
  postgres_data:
```

### Environment Variables
```bash
# backend/.env

DATABASE_URL=postgresql://user:pass@localhost:5432/grouptheory
REDIS_URL=redis://localhost:6379/0
SECRET_KEY=your-secret-key-here
SAGE_PATH=/usr/bin/sage
LIE_PATH=/usr/bin/lie
CELERY_BROKER_URL=redis://localhost:6379/0
CELERY_RESULT_BACKEND=redis://localhost:6379/0
CORS_ORIGINS=http://localhost:3000,https://grouptheory.app
```

```bash
# frontend/.env

VITE_API_URL=http://localhost:8000
VITE_WS_URL=ws://localhost:8000/ws
```

---

## 11. KEY ALGORITHMS TO IMPLEMENT

### 11.1 Cartan Matrix Generation
```python
CARTAN_MATRICES = {
    "SU2": [[2]],
    "SU3": [[2, -1], [-1, 2]],
    "SU4": [[2, -1, 0], [-1, 2, -1], [0, -1, 2]],
    # ... etc for all groups
}

def get_cartan_matrix(group_name: str) -> List[List[int]]:
    """Get Cartan matrix for named group"""
    # Parse group name (e.g., "SU5" -> rank 4)
    # Return appropriate matrix
```

### 11.2 Weyl Reflection (for fast irrep construction)
```python
def weyl_reflection(weight: List[int], simple_root_idx: int,
                   cartan_matrix: List[List[int]]) -> List[int]:
    """Reflect weight across hyperplane perpendicular to simple root"""
    # w' = w - 2*(w,α)/(α,α) * α
    # Implementation from dissertation Section 3.3.2
```

### 11.3 Freudenthal Formula (for multiplicities)
```python
def freudenthal_multiplicity(
    weight: List[int],
    highest_weight: List[int],
    roots: List[List[int]],
    known_multiplicities: Dict
) -> int:
    """Calculate weight multiplicity using Freudenthal's recursion"""
    # From dissertation equation (formula in Section 3.2.2.1)
```

---

## 12. TESTING STRATEGY

### Backend Tests
```python
# tests/test_groups.py

def test_create_su3():
    """Test SU(3) group creation"""
    group = create_group("SU3")
    assert group.rank == 2
    assert len(group.simple_roots) == 2
    assert group.cartan_matrix == [[2, -1], [-1, 2]]

def test_symmetry_breaking_so10():
    """Test SO(10) -> SU(5) breaking"""
    result = break_symmetry("SO10", node_index=4)
    assert "SU5" in result.broken_groups
    assert "U1" in result.broken_groups
```

### Frontend Tests
```typescript
// tests/DynkinDiagram.test.tsx

test('renders 3 nodes for SU(3)', () => {
  render(<DynkinDiagram group={su3} />);
  const nodes = screen.getAllByRole('circle');
  expect(nodes).toHaveLength(2);
});

test('crosses node when clicked', () => {
  const onClick = jest.fn();
  render(<DynkinDiagram group={su3} onNodeClick={onClick} />);
  fireEvent.click(screen.getAllByRole('circle')[0]);
  expect(onClick).toHaveBeenCalledWith(0);
});
```

---

## 13. PERFORMANCE CONSIDERATIONS

### Caching Strategy
1. **Redis L1 Cache**: Fast operations (< 100ms)
2. **PostgreSQL L2 Cache**: Slower operations (> 1s)
3. **Cache warming**: Pre-compute common calculations
4. **TTL**: 24h for results, 1h for visualizations

### Optimization
- **Pagination**: Limit large irrep displays
- **Lazy loading**: Load 3D visualizations on demand
- **WebWorkers**: Heavy frontend calculations
- **CDN**: Static SVG diagrams
- **Connection pooling**: Database connections

---

## 14. SECURITY

### API Security
- Rate limiting: 100 req/min per IP
- JWT authentication (optional feature)
- CORS configuration
- Input validation (Pydantic)
- SQL injection prevention (ORM)

### Deployment Security
- HTTPS only
- Environment variable secrets
- Database encryption at rest
- Regular dependency updates
- Security headers (helmet)

---

## 15. MONITORING & ANALYTICS

### Metrics to Track
- API response times
- Calculation success/failure rates
- Popular groups/operations
- User retention (if accounts)
- Error rates by endpoint
- Cache hit rates

### Tools
- Sentry: Error tracking
- Prometheus + Grafana: Metrics
- Cloudflare Analytics: Traffic
- Custom logging: Calculation stats

---

## 16. FUTURE ENHANCEMENTS

### Phase 5+ (Post-MVP)
- [ ] Jupyter notebook export
- [ ] Python API client library
- [ ] Batch calculation API
- [ ] Mobile apps (React Native)
- [ ] Collaborative calculations (multi-user)
- [ ] AI assistant for learning
- [ ] Integration with research databases
- [ ] Paper citation generator
- [ ] Custom group definitions
- [ ] Animation of symmetry breaking

---

## 17. SUCCESS METRICS

### Technical
- API latency < 200ms (p95)
- Uptime > 99.5%
- Page load < 2s
- Test coverage > 80%

### Product
- 100+ active users in month 1
- 1000+ calculations/month
- 70%+ user satisfaction
- Featured in physics course

---

## 18. REFERENCES & RESOURCES

### Your Dissertation
- Section 3.2: Building Irreps (algorithm reference)
- Section 3.3: Symmetry Breaking (implementation guide)
- Appendix A: Complete method list
- Chapter 5: Validation test cases (E6, E8 examples)

### External Libraries
- Sage Documentation: https://doc.sagemath.org/
- LiE Manual: http://wwwmathlabo.univ-poitiers.fr/~maavl/LiE/
- D3.js: https://d3js.org/
- Three.js: https://threejs.org/

### Papers
- Dynkin: Classification of semisimple Lie algebras
- Freudenthal: Multiplicity formula
- Slansky: Group theory for particle physics

---

## 19. GETTING STARTED

### Development Setup
```bash
# Clone repo
git clone https://github.com/your-username/group-theory-calculator
cd group-theory-calculator

# Backend setup
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Install Sage (Ubuntu/Debian)
sudo apt-get install sagemath

# Start services
docker-compose up -d db redis

# Run backend
uvicorn app.main:app --reload

# Frontend setup (new terminal)
cd ../frontend
npm install
npm run dev
```

### First Contribution
1. Implement `create_group("SU3")` endpoint
2. Add basic Dynkin diagram rendering
3. Connect frontend to backend
4. Test with SU(3) example

---

## 20. CONTACT & COLLABORATION

**Project Lead:** Rafael Sarate  
**Dissertation:** "A Python Library for Group Theory Calculations in Particle Physics" (2021)  
**Original Library:** PyLA (to be recovered or rebuilt)

**Contribution Welcome:**
- Frontend developers (React/D3.js)
- Physics students (testing, documentation)
- Backend developers (FastAPI/Sage)
- Designers (UI/UX)

---

**END OF SPECIFICATION**

*This document serves as complete architectural blueprint. Any developer should be able to pick up and implement this project using this specification.*

**Version:** 1.0  
**Last Updated:** February 2026  
**Status:** Planning → Ready for Implementation
