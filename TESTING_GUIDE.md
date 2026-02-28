# Testing Guide

## Overview

This project has comprehensive unit, integration, and end-to-end tests for both backend and frontend.

## Backend Testing

### Structure

```
backend/
├── tests/
│   ├── test_models.py          # Pydantic model validation
│   ├── test_lie_algebra.py     # SymPy Lie algebra tests
│   ├── test_algorithms.py      # Representation theory algorithms
│   └── test_api.py             # API endpoint integration tests
├── conftest.py                 # pytest configuration
└── pytest.ini                  # pytest settings
```

### Running Backend Tests

```bash
cd backend

# Run all tests
python3 -m pytest

# Run specific test file
python3 -m pytest tests/test_models.py -v

# Run only unit tests
python3 -m pytest -m unit

# Run only integration tests
python3 -m pytest -m integration

# Skip slow tests
python3 -m pytest -m "not slow"

# Run with coverage
python3 -m pytest --cov=app --cov-report=html

# Run specific test
python3 -m pytest tests/test_models.py::TestIrrep::test_valid_irrep -v
```

### Test Markers

- `@pytest.mark.unit` - Unit tests for individual functions
- `@pytest.mark.integration` - Integration tests for endpoints
- `@pytest.mark.slow` - Slow tests (E8 computations, etc.)
- `@pytest.mark.algebra` - Tests for specific algebras

### Backend Test Coverage

**Current Status:**
- ✅ Models: 22/22 tests passing
- ✅ Lie Algebra: 29/29 tests passing
- ⏳ Algorithms: 0 tests (implementation pending)
- ⏳ API Endpoints: 0 tests (implementation pending)

**What's Tested:**
- Pydantic model validation and serialization
- SymPy Lie algebra computations
  - Root systems for all GUT algebras
  - Cartan matrices and properties
  - Mathematical properties (invertibility, symmetry)
- Enum mappings and type safety

**What's Stubbed (TODO):**
- Fundamental weights computation
- Weyl dimension formula
- Freudenthal's formula for weight multiplicities
- Tensor product decomposition
- Branching rules
- API endpoints

## Frontend Testing

### Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── ui/__tests__/              # UI component tests
│   │   ├── calculators/__tests__/     # Calculator component tests
│   │   └── pages/__tests__/           # Page component tests
│   └── services/__tests__/            # API service tests
├── jest.config.ts                     # Jest configuration
└── jest.setup.ts                      # Jest global setup
```

### Running Frontend Tests

```bash
cd frontend

# Install dependencies first
npm install

# Run all tests
npm test

# Run in watch mode
npm run test:watch

# Run with coverage
npm run test:coverage

# Run specific test file
npm test -- ui-components.test.tsx

# Update snapshots
npm test -- -u
```

### Frontend Test Coverage

**Current Status:**
- ⏳ UI Components: Tests created, awaiting component implementation
- ⏳ Calculator Components: Tests created, awaiting implementation
- ⏳ API Service: Tests created, awaiting implementation
- ⏳ Pages: Tests created, awaiting implementation

**What's Tested:**
- Button component (variants, sizes, disabled state, click handling)
- Card component (title, footer, custom classes)
- Input component (validation, error display, types)
- Group selector behavior
- Tensor product calculator form
- API service calls and error handling

## Testing Best Practices

### Backend

1. **Test Isolation**: Each test should be independent
2. **Use Fixtures**: Share test data via pytest fixtures
3. **Mock External Dependencies**: Don't rely on network or filesystem
4. **Test Edge Cases**: Negative Dynkin labels, zero dimensions, etc.
5. **Parametrize**: Use `@pytest.mark.parametrize` for multiple cases

Example:
```python
@pytest.mark.parametrize("dynkin_labels,expected_dim", [
    ([1, 0, 0, 0], 5),
    ([0, 0, 0, 1], 5),
    ([1, 0, 0, 1], 24),
])
def test_su5_dimensions(dynkin_labels, expected_dim):
    dim = weyl_dimension_formula("A4", dynkin_labels)
    assert dim == expected_dim
```

### Frontend

1. **User-Centric Testing**: Test from user's perspective
2. **Accessibility**: Use `getByRole`, `getByLabelText`
3. **Async Operations**: Use `waitFor` for async state updates
4. **Mock Heavy Dependencies**: Mock D3, Three.js visualizations
5. **Snapshot Testing**: Use sparingly, only for stable UI

Example:
```typescript
it('handles click events', async () => {
  const handleClick = jest.fn();
  const user = userEvent.setup();
  
  render(<Button onClick={handleClick}>Click me</Button>);
  await user.click(screen.getByRole('button'));
  
  expect(handleClick).toHaveBeenCalledTimes(1);
});
```

## Continuous Integration

### GitHub Actions Workflow (TODO)

```yaml
name: Tests

on: [push, pull_request]

jobs:
  backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Set up Python
        uses: actions/setup-python@v4
        with:
          python-version: '3.10'
      - name: Install dependencies
        run: |
          cd backend
          pip install -r requirements.txt
      - name: Run tests
        run: |
          cd backend
          pytest --cov=app

  frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Set up Node
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      - name: Install dependencies
        run: |
          cd frontend
          npm install
      - name: Run tests
        run: |
          cd frontend
          npm test
```

## Test Data

### Common Test Cases

**SU(3) Representations:**
- Fundamental 3: [1, 0]
- Anti-fundamental 3̄: [0, 1]
- Adjoint 8: [1, 1]
- Sextet 6: [2, 0]

**SU(5) Representations:**
- Fundamental 5: [1, 0, 0, 0]
- Anti-fundamental 5̄: [0, 0, 0, 1]
- Adjoint 24: [1, 0, 0, 1]
- Antisymmetric 10: [0, 1, 0, 0]
- Symmetric 15: [2, 0, 0, 0]

**SO(10) Representations:**
- Vector 10: [1, 0, 0, 0, 0]
- Spinor 16: [0, 0, 0, 1, 0]
- Conjugate spinor 16̄: [0, 0, 0, 0, 1]
- Adjoint 45: [0, 1, 0, 0, 0]

## Coverage Goals

### Backend
- Models: 100% (validation critical)
- Algorithms: 90% (core calculations)
- API Endpoints: 85% (request/response handling)

### Frontend
- UI Components: 80% (visual components)
- Calculator Logic: 90% (critical business logic)
- Pages: 70% (integration level)

## Running All Tests

```bash
# Backend
cd backend && pytest -v

# Frontend
cd frontend && npm test

# Both with coverage
cd backend && pytest --cov=app --cov-report=html
cd frontend && npm run test:coverage
```

## Debugging Tests

### Backend
```bash
# Run with print statements
pytest -s

# Run with debugger
pytest --pdb

# Verbose output
pytest -vv
```

### Frontend
```bash
# Debug specific test
npm test -- --no-coverage ui-components.test.tsx

# Watch mode for debugging
npm run test:watch
```

## Next Steps

1. **Implement remaining algorithms** and their tests
2. **Implement API endpoints** with integration tests
3. **Complete component implementations** to make frontend tests pass
4. **Add E2E tests** with Playwright or Cypress
5. **Set up CI/CD** with GitHub Actions
6. **Add performance tests** for large representations
7. **Add property-based tests** with Hypothesis (Python) / fast-check (TS)
