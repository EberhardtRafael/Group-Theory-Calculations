# API Quick Start Guide

Get up and running with the Group Theory Calculator API in 5 minutes.

## 1. Start the Backend (Terminal 1)

```bash
cd backend
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

You should see:
```
INFO:     Uvicorn running on http://0.0.0.0:8000
INFO:     Application startup complete.
```

## 2. Verify API is Running

Open browser: http://localhost:8000/docs

You'll see an interactive API documentation page (Swagger UI).

## 3. Test Basic Endpoints

### Create a Group (SU(3))
```bash
curl -X POST "http://localhost:8000/api/v1/groups/create" \
  -H "Content-Type: application/json" \
  -d '{"name":"SU3"}'
```

**Response:**
```json
{
  "id": "a2-2",
  "name": "SU(3)",
  "rank": 2,
  "dimension": 8,
  "cartan_matrix": [[2, -1], [-1, 2]]
}
```

### Calculate Tensor Product
```bash
curl -X POST "http://localhost:8000/api/v1/irreps/tensor-product" \
  -H "Content-Type: application/json" \
  -d '{"group":"SU3","irrep1":[1,0],"irrep2":[1,0]}'
```

**Response:**
```json
{
  "decomposition": [
    {"weight": [2, 0], "dimension": 6, "latex_name": "6"},
    {"weight": [0, 1], "dimension": 3, "latex_name": "\\bar{3}"}
  ],
  "latex": "3 \\otimes 3 = 6 \\oplus \\bar{3}"
}
```

### List All Groups
```bash
curl "http://localhost:8000/api/v1/groups/"
```

## 4. Run Tests

```bash
cd backend
python3 test_api_integration.py
```

All tests should pass with ✓ marks.

## 5. Use in Frontend

### Install the frontend dependencies (if not already done)
```bash
cd frontend
npm install
```

### Use the API service in your React components

```typescript
import { api } from '@/services/api';

// In your component
const MyComponent = () => {
  const [group, setGroup] = useState(null);

  useEffect(() => {
    const fetchGroup = async () => {
      try {
        const response = await api.getGroup('SU3');
        setGroup(response.data);
      } catch (error) {
        console.error('Error fetching group:', error);
      }
    };
    fetchGroup();
  }, []);

  return (
    <div>
      {group && (
        <>
          <h2>{group.name}</h2>
          <p>Rank: {group.rank}</p>
          <p>Dimension: {group.dimension}</p>
        </>
      )}
    </div>
  );
};
```

## Common API Calls

### Get Group Information
```typescript
const group = await api.getGroup('E6');
console.log(group.data.rank);  // 6
```

### Calculate Irrep Dimension
```typescript
const irrep = await api.createIrrep({
  group_id: 'SU3',
  highest_weight: [1, 1]  // adjoint representation
});
console.log(irrep.data.dimension);  // 8
console.log(irrep.data.latex_name);  // "8"
```

### List Available Groups
```typescript
const groups = await api.listGroups();
groups.data.forEach(g => {
  console.log(`${g.physics_name} (${g.cartan_type}), rank ${g.rank}`);
});
```

### Get Root System
```typescript
const roots = await api.getRootSystem('A2');
console.log(roots.data.simple_roots);
// [[1.0, -1.0, 0.0], [0.0, 1.0, -1.0]]
```

### Calculate Tensor Product
```typescript
const result = await api.calculateTensorProduct({
  group: 'SU3',
  irrep1: [1, 0],  // 3
  irrep2: [0, 1]   // 3̄
});
console.log(result.data.latex);
// "3 \otimes \bar{3} = 8 \oplus 1"
```

## Supported Groups

| Name | Cartan | Use Case |
|------|--------|----------|
| SU3 / SU(3) | A2 | QCD, Standard Model color |
| SU5 / SU(5) | A4 | Georgi-Glashow GUT |
| SO10 / SO(10) | D5 | SO(10) Grand Unification |
| E6 | E6 | E6 GUT |
| E7 | E7 | E7 theories |
| E8 | E8 | E8 / Heterotic string theory |

## Common Dynkin Labels (SU(3))

| Label | Name | Dimension | LaTeX |
|-------|------|-----------|-------|
| [1,0] | Fundamental | 3 | 3 |
| [0,1] | Anti-fundamental | 3 | 3̄ |
| [2,0] | Sextet | 6 | 6 |
| [1,1] | Adjoint | 8 | 8 |
| [3,0] | Decuplet | 10 | 10 |

## Troubleshooting

### Server won't start
```bash
# Check if port 8000 is already in use
lsof -i :8000

# Kill process if needed
kill -9 <PID>
```

### Import errors
```bash
# Install dependencies
cd backend
pip install -r requirements.txt
```

### Frontend can't connect
Check `.env` or environment variable:
```bash
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### Tests fail
Make sure the backend is running:
```bash
# Terminal 1
cd backend
uvicorn app.main:app --reload

# Terminal 2
cd backend
python3 test_api_integration.py
```

## Interactive Documentation

When the server is running, visit:

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

Both provide:
- Complete API reference
- Try-it-now functionality
- Schema definitions
- Example requests/responses

## Next Steps

1. ✅ API is running
2. ✅ Tests pass
3. 📝 Read full docs: `API_DOCUMENTATION.md`
4. 🎨 Use in frontend components
5. 🚀 Build your calculator UI

## Need Help?

- Full API reference: See `API_DOCUMENTATION.md`
- Implementation details: See `API_IMPLEMENTATION_SUMMARY.md`
- Test examples: See `backend/test_api_integration.py`

Happy calculating! 🎉
