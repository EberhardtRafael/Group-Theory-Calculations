"""
GROUP THEORY CALCULATOR - BACKEND IMPLEMENTATION GUIDE
======================================================

This document describes how to use SymPy for Lie algebra calculations and what
additional algorithms we need to implement.

## 1. SYMPY CAPABILITIES (What we get for free)

### Basic Lie Algebra Information

```python
from sympy.liealgebras.root_system import RootSystem
from sympy.liealgebras.cartan_type import CartanType

# Create Lie algebra
cartan_type = "A4"  # SU(5)
ct = CartanType(cartan_type)
rs = RootSystem(cartan_type)

# Get basic properties
rank = ct.rank()                    # 4
dimension = ct.dimension()          # 5
cartan_matrix = ct.cartan_matrix()  # Matrix([[2, -1, 0, 0], ...])

# Get roots
all_roots = rs.all_roots()         # Dict: {1: [1, -1, 0, 0, 0], ...}
simple_roots = rs.simple_roots()   # Dict: {1: [1, -1, 0, 0, 0], 2: ...}
```

### Supported Algebras

- **A_n** (SU(n+1)): Classical series
  - A2 = SU(3), A4 = SU(5)
  
- **D_n** (SO(2n)): Orthogonal series  
  - D5 = SO(10)
  
- **E_6, E_7, E_8**: Exceptional series
  - E6, E7, E8 GUTs

- **B_n** (SO(2n+1)), **C_n** (Sp(2n)), **F_4**, **G_2**: Also supported

### Root System Data

```python
# Simple roots (basis)
simple_roots = rs.simple_roots()
# {1: [1, -1, 0, 0, 0], 2: [0, 1, -1, 0, 0], ...}

# All roots
all_roots = rs.all_roots()
# Returns dict with all roots (positive and negative)

# Positive roots (first half of all_roots)
num_positive = len(all_roots) // 2
positive_roots = {k: v for k, v in all_roots.items() if k <= num_positive}
```

### Cartan Matrix

```python
cartan_matrix = ct.cartan_matrix()
# Returns sympy Matrix
# For SU(5): [[2, -1, 0, 0], [-1, 2, -1, 0], [0, -1, 2, -1], [0, 0, -1, 2]]

# Can convert to numpy
import numpy as np
C = np.array(cartan_matrix.tolist()).astype(float)
```

## 2. WHAT WE NEED TO IMPLEMENT

### 2.1 Fundamental Weights

Fundamental weights Λ_i satisfy: Λ_i · α_j = δ_{ij} (Kronecker delta)

In matrix form: Λ^T · C = I, where C is Cartan matrix

```python
def compute_fundamental_weights(cartan_type: str) -> List[List[float]]:
    """
    Compute fundamental weights from Cartan matrix.
    
    Theory:
    - Simple coroots: α_i^∨ = 2α_i / (α_i · α_i)
    - Cartan matrix: C_ij = α_i^∨ · α_j
    - Fundamental weights: Λ · C = I
    - Therefore: Λ = C^{-T} (inverse transpose)
    
    Implementation:
    1. Get Cartan matrix C
    2. Compute C^{-1}
    3. Fundamental weights are rows of C^{-T} = columns of C^{-1}
    """
    ct = CartanType(cartan_type)
    cartan_matrix = ct.cartan_matrix()
    
    # Compute inverse
    C_inv = cartan_matrix.inv()
    
    # Fundamental weights are columns of C^{-1}
    rank = ct.rank()
    fundamental_weights = []
    for i in range(rank):
        weight = [float(C_inv[j, i]) for j in range(rank)]
        fundamental_weights.append(weight)
    
    return fundamental_weights
```

### 2.2 Irrep Dimension via Weyl Dimension Formula

For simply-laced algebras (A, D, E series):

dim(Λ) = ∏_{α>0} (Λ+ρ, α) / (ρ, α)

where:
- Λ = highest weight
- α = positive root
- ρ = sum of fundamental weights (half-sum of positive roots)
- (·,·) = inner product

```python
def weyl_dimension_formula(cartan_type: str, dynkin_labels: List[int]) -> int:
    """
    Compute dimension using Weyl dimension formula.
    
    Algorithm:
    1. Convert Dynkin labels to highest weight: Λ = Σ a_i Λ_i
    2. Compute ρ = Σ Λ_i (sum of fundamental weights)
    3. For each positive root α:
       - Compute numerator: (Λ+ρ, α)
       - Compute denominator: (ρ, α)
    4. Return product of numerators / product of denominators
    """
    rs = RootSystem(cartan_type)
    
    # Get fundamental weights
    fund_weights = compute_fundamental_weights(cartan_type)
    
    # Compute highest weight Λ = Σ a_i Λ_i
    rank = len(dynkin_labels)
    highest_weight = [0.0] * len(fund_weights[0])
    for i, a in enumerate(dynkin_labels):
        for j in range(len(highest_weight)):
            highest_weight[j] += a * fund_weights[i][j]
    
    # Compute ρ (sum of fundamental weights)
    rho = [sum(fw[i] for fw in fund_weights) for i in range(len(fund_weights[0]))]
    
    # Compute (Λ+ρ)
    lambda_plus_rho = [highest_weight[i] + rho[i] for i in range(len(rho))]
    
    # Get positive roots
    all_roots = rs.all_roots()
    positive_roots = [list(root) for i, root in all_roots.items() 
                     if i <= len(all_roots) // 2]
    
    # Compute product
    numerator = 1.0
    denominator = 1.0
    for root in positive_roots:
        # Inner product (Λ+ρ, α)
        num = sum(lambda_plus_rho[i] * root[i] for i in range(len(root)))
        # Inner product (ρ, α)
        den = sum(rho[i] * root[i] for i in range(len(root)))
        
        numerator *= num
        denominator *= den
    
    return int(round(numerator / denominator))
```

### 2.3 Weight System via Freudenthal's Formula

Freudenthal's recursion formula computes weight multiplicities:

m(λ) = 2/(Λ+ρ, Λ+ρ) - (λ+ρ, λ+ρ) × Σ_{α>0} Σ_{k≥1} m(λ + kα) × (λ + kα, α)

where:
- m(λ) = multiplicity of weight λ
- Λ = highest weight
- ρ = sum of fundamental weights
- α = positive root

```python
def freudenthal_multiplicity(
    highest_weight: List[float],
    weight: List[float],
    cartan_type: str,
    memo: Dict
) -> int:
    """
    Compute weight multiplicity using Freudenthal's formula.
    
    This is a recursive formula with memoization.
    Base cases:
    - Highest weight has multiplicity 1
    - Weights not in weight system have multiplicity 0
    """
    # Base case: highest weight
    if weight == highest_weight:
        return 1
    
    # Check memo
    weight_tuple = tuple(weight)
    if weight_tuple in memo:
        return memo[weight_tuple]
    
    # Check if weight is in weight lattice
    # (λ - Λ) must be negative linear combination of simple roots
    # Implementation details...
    
    # Compute using recursion
    # Implementation details...
    
    return multiplicity
```

### 2.4 Tensor Product Decomposition

For tensor products R₁ ⊗ R₂:

1. **Algorithm**: Klimyk's formula or direct weight decomposition
2. **Steps**:
   - Compute weight system of R₁ and R₂
   - Add all weight pairs: w₁ + w₂
   - Count multiplicities
   - Find dominant weights (these are highest weights of irreps)
   - Determine multiplicities using Littlewood-Richardson rules

```python
def tensor_product_decomposition(
    cartan_type: str,
    dynkin1: List[int],
    dynkin2: List[int]
) -> List[Tuple[List[int], int]]:
    """
    Decompose tensor product into irreducible representations.
    
    Returns: List of (dynkin_labels, multiplicity)
    
    Algorithm:
    1. Compute weight systems of both irreps
    2. Form tensor product of weight systems (add all pairs)
    3. Find dominant weights
    4. For each dominant weight, determine multiplicity using
       Kostka numbers or Littlewood-Richardson coefficients
    """
    # Implementation depends on algebra type
    # For SU(n), can use Young tableaux
    # For general case, use weight system method
    pass
```

### 2.5 Branching Rules

For subgroup embeddings G ⊃ H, decompose G-irrep into H-irreps.

**Key Examples**:

```
SU(5) ⊃ SU(3) × SU(2) × U(1)
  5 → (3, 1)_{-2/3} + (1, 2)_{1}
  10 → (3, 2)_{1/6} + (3̄, 1)_{-2/3} + (1, 1)_{1}
  
SO(10) ⊃ SU(5) × U(1)
  16 → 5_{-3} + 10_{1} + 1_{5}
  
E6 ⊃ SO(10) × U(1)
  27 → 16_{-1} + 10_{2} + 1_{-4}
```

**Implementation**:
- Pre-compute tables for common breakings
- Implement algorithm using root restrictions
- Use projection/restriction of weight lattice

## 3. CACHING STRATEGY

Expensive computations should be cached:

```python
from functools import lru_cache

@lru_cache(maxsize=128)
def compute_irrep_dimension(group: str, dynkin_tuple: tuple) -> int:
    \"\"\"Cached dimension computation\"\"\"
    dynkin = list(dynkin_tuple)
    return weyl_dimension_formula(group, dynkin)
```

## 4. IMPLEMENTATION PRIORITIES

**Phase 1** (MVP):
1. Group info endpoints (use SymPy directly) ✓
2. Fundamental weights computation
3. Irrep dimension (Weyl formula)
4. Common irreps database (hardcoded)

**Phase 2**:
5. Weight system (Freudenthal)
6. Tensor product (weight system method)

**Phase 3**:
7. Branching rules (hardcoded tables)
8. Advanced features (conjugate reps, reality properties)

## 5. TESTING STRATEGY

### Unit Tests for Algorithms

```python
def test_fundamental_weights_su5():
    weights = compute_fundamental_weights("A4")
    assert len(weights) == 4  # rank 4
    # Verify orthogonality conditions

def test_weyl_dimension():
    # SU(5) fundamental: [1,0,0,0] should give dim 5
    assert weyl_dimension_formula("A4", [1,0,0,0]) == 5
    # SU(5) adjoint: [1,0,0,1] should give dim 24
    assert weyl_dimension_formula("A4", [1,0,0,1]) == 24
    
def test_tensor_product_su5():
    # 5 ⊗ 5̄ = 1 ⊕ 24
    result = tensor_product_decomposition("A4", [1,0,0,0], [0,0,0,1])
    assert ([0,0,0,0], 1) in result  # singlet
    assert ([1,0,0,1], 1) in result  # adjoint
```

### Integration Tests

```python
def test_su5_representation_table():
    \"\"\"Verify a table of known SU(5) dimensions\"\"\"
    known_dims = {
        (1,0,0,0): 5,      # fundamental
        (0,0,0,1): 5,      # anti-fundamental
        (1,0,0,1): 24,     # adjoint
        (2,0,0,0): 15,     # symmetric
        (0,1,0,0): 10,     # antisymmetric
    }
    for dynkin, expected_dim in known_dims.items():
        dim = weyl_dimension_formula("A4", list(dynkin))
        assert dim == expected_dim, f"Failed for {dynkin}: got {dim}, expected {expected_dim}"
```

## 6. NUMERICAL CONSIDERATIONS

- Use **exact arithmetic** where possible (SymPy rationals)
- Convert to float only for final output
- Round carefully when converting products to integers
- Validate dimensions: tensor product should conserve total dimension

## 7. ERROR HANDLING

```python
class GroupTheoryError(Exception):
    \"\"\"Base exception for group theory calculations\"\"\"
    pass

class InvalidDynkinLabels(GroupTheoryError):
    \"\"\"Dynkin labels invalid for this group\"\"\"
    pass

class ComputationTooLarge(GroupTheoryError):
    \"\"\"Computation would be too expensive\"\"\"
    pass
```

## 8. REFERENCES

- **Lie Algebras**: Humphreys, "Introduction to Lie Algebras and Representation Theory"
- **GUT Breaking**: Slansky, "Group Theory for Unified Model Building" (Physics Reports 1981)
- **Algorithms**: Di Francesco et al., "Conformal Field Theory" (Appendix on Lie algebras)
- **SymPy Docs**: https://docs.sympy.org/latest/modules/liealgebras/index.html

## 9. SYMPY QUIRKS AND GOTCHAS

1. RootSystem takes string, not CartanType object
2. Positive roots are first half of all_roots dict
3. Root vectors have different dimensions for different algebras
4. E series use 8-dimensional root vectors (not rank-dimensional)
5. DynkinDiagram returns string, not object

Remember: All calculations are stateless! No database needed.
"""

# This is a documentation file, not executable code
