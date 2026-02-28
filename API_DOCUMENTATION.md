# Group Theory Calculator - API Documentation

This document describes the REST API endpoints for the Group Theory Calculator backend.

## Base URL

```
http://localhost:8000/api/v1
```

---

## Groups API

### Create Group

Create a Lie group and get its properties.

**Endpoint:** `POST /groups/create`

**Request Body:**
```json
{
  "name": "SU3",
  "notation": "cartan"
}
```

**Response:** `201 Created`
```json
{
  "id": "a2-2",
  "name": "SU(3)",
  "cartan_name": "A2",
  "rank": 2,
  "cartan_matrix": [[2, -1], [-1, 2]],
  "simple_roots": [[1.0, -1.0, 0.0], [0.0, 1.0, -1.0]],
  "dimension": 8,
  "positive_roots": [[1.0, -1.0, 0.0], [1.0, 0.0, -1.0], [0.0, 1.0, -1.0]]
}
```

**Supported Groups:**
- `SU3` / `SU(3)` → A2
- `SU5` / `SU(5)` → A4
- `SO10` / `SO(10)` → D5
- `E6` → E6
- `E7` → E7
- `E8` → E8

---

### Get Group

Get group details by name.

**Endpoint:** `GET /groups/{group_name}`

**Example:** `GET /groups/SU3`

**Response:** `200 OK` (same as Create Group)

---

### List All Groups

Get list of all supported groups.

**Endpoint:** `GET /groups/`

**Query Parameters:**
- `skip` (optional): Number of records to skip (default: 0)
- `limit` (optional): Maximum number of records (default: 100)

**Response:** `200 OK`
```json
[
  {
    "cartan_type": "A2",
    "physics_name": "SU(3)",
    "rank": 2
  },
  {
    "cartan_type": "A4",
    "physics_name": "SU(5)",
    "rank": 4
  },
  ...
]
```

---

### Get Group Info

Get detailed algebra information.

**Endpoint:** `GET /groups/{group_name}/info`

**Example:** `GET /groups/E6/info`

**Response:** `200 OK`
```json
{
  "cartan_type": "E6",
  "physics_name": "E6",
  "rank": 6,
  "dimension": 78,
  "num_roots": 72,
  "num_positive_roots": 36
}
```

---

### Get Root System

Get complete root system data.

**Endpoint:** `GET /groups/{group_name}/root-system`

**Response:** `200 OK`
```json
{
  "simple_roots": [[...], [...]],
  "positive_roots": [[...], [...], ...],
  "cartan_matrix": [[2, -1], [-1, 2]]
}
```

---

### Get Dynkin Diagram

Get Dynkin diagram representation.

**Endpoint:** `GET /groups/{group_name}/dynkin-diagram`

**Response:** `200 OK`
```json
{
  "diagram_string": "O---O\n0   1",
  "vertices": [0, 1],
  "edges": [{"from": 0, "to": 1, "type": 1}],
  "node_labels": ["α1", "α2"]
}
```

---

## Irreps API

### Create Irrep

Construct an irreducible representation from highest weight.

**Endpoint:** `POST /irreps/`

**Request Body:**
```json
{
  "group_id": "SU3",
  "highest_weight": [1, 0],
  "method": "weyl_reflection"
}
```

**Methods:**
- `weyl_reflection` (default): Fast Weyl reflection algorithm
- `freudenthal`: Freudenthal's multiplicity formula

**Response:** `201 Created`
```json
{
  "id": "su3-1_0",
  "group_id": "SU3",
  "highest_weight": [1, 0],
  "dimension": 3,
  "weights": [[1, 0]],
  "multiplicities": [1],
  "latex_name": "3"
}
```

**Common SU(3) Representations:**
- `[1, 0]` → **3** (fundamental)
- `[0, 1]` → **3̄** (antifundamental)
- `[2, 0]` → **6** (sextet)
- `[1, 1]` → **8** (adjoint)
- `[3, 0]` → **10** (decuplet)

---

### Get Irrep

Get irrep details by ID.

**Endpoint:** `GET /irreps/{irrep_id}`

**Example:** `GET /irreps/su3-1_0`

**Response:** `200 OK` (same as Create Irrep)

---

### Calculate Tensor Product

Calculate tensor product decomposition of two irreps.

**Endpoint:** `POST /irreps/tensor-product`

**Request Body:**
```json
{
  "group": "SU3",
  "irrep1": [1, 0],
  "irrep2": [1, 0]
}
```

**Response:** `200 OK`
```json
{
  "decomposition": [
    {
      "weight": [2, 0],
      "multiplicity": 1,
      "dimension": 6,
      "latex_name": "6"
    },
    {
      "weight": [0, 1],
      "multiplicity": 1,
      "dimension": 3,
      "latex_name": "\\bar{3}"
    }
  ],
  "latex": "3 \\otimes 3 = 6 \\oplus \\bar{3}"
}
```

**Common SU(3) Tensor Products:**
- 3 ⊗ 3 = 6 ⊕ 3̄
- 3 ⊗ 3̄ = 8 ⊕ 1
- 3̄ ⊗ 3̄ = 3 ⊕ 6̄
- 8 ⊗ 8 = 27 ⊕ 10 ⊕ 1̄0 ⊕ 8 ⊕ 8 ⊕ 1

---

## Calculations API (Async)

For heavy calculations that take longer time.

### Submit Calculation

**Endpoint:** `POST /calculations/submit`

**Request Body:**
```json
{
  "operation": "branching_rules",
  "parameters": {
    "group": "E6",
    "irrep": [1, 0, 0, 0, 0, 0]
  }
}
```

**Response:** `202 Accepted`
```json
{
  "task_id": "abc123",
  "status": "pending",
  "progress": 0,
  "created_at": "2026-02-27T12:00:00Z"
}
```

---

### Get Calculation Status

**Endpoint:** `GET /calculations/{task_id}/status`

**Response:** `200 OK`
```json
{
  "task_id": "abc123",
  "status": "completed",
  "progress": 100,
  "result": { ... },
  "created_at": "2026-02-27T12:00:00Z",
  "completed_at": "2026-02-27T12:00:05Z"
}
```

**Status Values:**
- `pending`: Queued, not yet started
- `running`: Currently computing
- `completed`: Finished successfully
- `failed`: Error occurred

---

## Frontend Usage Examples

### TypeScript/React Example

```typescript
import { api } from '@/services/api';

// Create a group
const createGroup = async () => {
  try {
    const response = await api.createGroup('SU3');
    console.log('Group:', response.data);
  } catch (error) {
    console.error('Error:', error);
  }
};

// Calculate tensor product
const calculateTensor = async () => {
  try {
    const response = await api.calculateTensorProduct({
      group: 'SU3',
      irrep1: [1, 0],
      irrep2: [1, 0],
    });
    console.log('Decomposition:', response.data.latex);
  } catch (error) {
    console.error('Error:', error);
  }
};
```

---

## Python Usage Examples

### Using requests library

```python
import requests

BASE_URL = "http://localhost:8000/api/v1"

# Create a group
response = requests.post(
    f"{BASE_URL}/groups/create",
    json={"name": "E6"}
)
group = response.json()
print(f"Created {group['name']} with rank {group['rank']}")

# Calculate tensor product
response = requests.post(
    f"{BASE_URL}/irreps/tensor-product",
    json={
        "group": "SU3",
        "irrep1": [1, 0],
        "irrep2": [1, 0]
    }
)
result = response.json()
print(f"Tensor product: {result['latex']}")
for term in result['decomposition']:
    print(f"  - {term['latex_name']} (dim={term['dimension']})")
```

---

## Error Responses

All endpoints return standard error responses:

**400 Bad Request:**
```json
{
  "detail": "Failed to create group SU99: Group not supported"
}
```

**404 Not Found:**
```json
{
  "detail": "Group XYZ not found"
}
```

**500 Internal Server Error:**
```json
{
  "detail": "Internal server error"
}
```

---

## Testing

Run the integration test suite:

```bash
cd backend
python test_api_integration.py
```

This will test all endpoints and verify correct behavior.

---

## API Documentation (Interactive)

When the server is running, visit:

- **Swagger UI:** http://localhost:8000/docs
- **ReDoc:** http://localhost:8000/redoc

These provide interactive API documentation where you can test endpoints directly in the browser.
