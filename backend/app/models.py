"""
Pydantic models for Group Theory Calculator API

These models define the contract between the frontend and backend.
All calculations are stateless - no database needed.
"""

from typing import List, Dict, Optional, Tuple
from pydantic import BaseModel, Field, field_validator
from enum import Enum


# ============================================================================
# ENUMS AND CONSTANTS
# ============================================================================

class AlgebraType(str, Enum):
    """Supported Lie algebra types (Cartan classification)"""
    A2 = "A2"  # SU(3) - Standard Model color
    A4 = "A4"  # SU(5) - Georgi-Glashow GUT
    D5 = "D5"  # SO(10) GUT
    E6 = "E6"  # E6 GUT
    E7 = "E7"  # E7 GUT
    E8 = "E8"  # E8 GUT / Heterotic string


class PhysicsGroup(str, Enum):
    """Physics notation for groups"""
    SU3 = "SU(3)"
    SU5 = "SU(5)"
    SO10 = "SO(10)"
    E6 = "E6"
    E7 = "E7"
    E8 = "E8"


# Mapping between physics names and Cartan types
ALGEBRA_MAPPING = {
    PhysicsGroup.SU3: AlgebraType.A2,
    PhysicsGroup.SU5: AlgebraType.A4,
    PhysicsGroup.SO10: AlgebraType.D5,
    PhysicsGroup.E6: AlgebraType.E6,
    PhysicsGroup.E7: AlgebraType.E7,
    PhysicsGroup.E8: AlgebraType.E8,
}


# ============================================================================
# BASIC LIE ALGEBRA MODELS
# ============================================================================

class LieAlgebraInfo(BaseModel):
    """Basic information about a Lie algebra"""
    cartan_type: str = Field(..., description="Cartan type (e.g., 'A4')")
    physics_name: str = Field(..., description="Physics notation (e.g., 'SU(5)')")
    rank: int = Field(..., description="Rank of the algebra (Cartan subalgebra dimension)")
    dimension: int = Field(..., description="Dimension of the algebra (number of generators)")
    num_roots: int = Field(..., description="Total number of roots")
    num_positive_roots: int = Field(..., description="Number of positive roots")
    
    class Config:
        json_schema_extra = {
            "example": {
                "cartan_type": "A4",
                "physics_name": "SU(5)",
                "rank": 4,
                "dimension": 24,
                "num_roots": 20,
                "num_positive_roots": 10
            }
        }


class RootSystem(BaseModel):
    """Root system of a Lie algebra"""
    simple_roots: List[List[float]] = Field(..., description="Simple roots (basis of root system)")
    positive_roots: List[List[float]] = Field(..., description="All positive roots")
    cartan_matrix: List[List[int]] = Field(..., description="Cartan matrix")
    
    class Config:
        json_schema_extra = {
            "example": {
                "simple_roots": [[1, -1, 0], [0, 1, -1]],
                "positive_roots": [[1, -1, 0], [1, 0, -1], [0, 1, -1]],
                "cartan_matrix": [[2, -1], [-1, 2]]
            }
        }


class DynkinDiagram(BaseModel):
    """Dynkin diagram representation"""
    diagram_string: str = Field(..., description="ASCII art representation of Dynkin diagram")
    vertices: List[int] = Field(..., description="Node indices")
    edges: List[Tuple[int, int]] = Field(..., description="Edges between nodes")
    
    class Config:
        json_schema_extra = {
            "example": {
                "diagram_string": "0---0---0---0\n1   2   3   4",
                "vertices": [1, 2, 3, 4],
                "edges": [(1, 2), (2, 3), (3, 4)]
            }
        }


# ============================================================================
# REPRESENTATION THEORY MODELS
# ============================================================================

class Irrep(BaseModel):
    """
    Irreducible representation specified by Dynkin labels (highest weight)
    
    Dynkin labels [a₁, a₂, ..., aᵣ] specify the highest weight in terms of 
    fundamental weights: Λ = a₁Λ₁ + a₂Λ₂ + ... + aᵣΛᵣ
    """
    dynkin_labels: List[int] = Field(..., description="Dynkin labels (highest weight coefficients)")
    dimension: Optional[int] = Field(None, description="Dimension of the representation (computed)")
    name: Optional[str] = Field(None, description="Common name (e.g., '5', '10', '24')")
    
    @field_validator('dynkin_labels')
    @classmethod
    def validate_non_negative(cls, v):
        if any(x < 0 for x in v):
            raise ValueError("Dynkin labels must be non-negative integers")
        return v
    
    class Config:
        json_schema_extra = {
            "example": {
                "dynkin_labels": [1, 0, 0, 0],
                "dimension": 5,
                "name": "5"
            }
        }


class Weight(BaseModel):
    """A weight in a representation"""
    components: List[float] = Field(..., description="Weight vector components")
    multiplicity: int = Field(..., description="Multiplicity of this weight in the representation")
    dynkin_labels: Optional[List[int]] = Field(None, description="Dynkin labels if dominant weight")
    
    class Config:
        json_schema_extra = {
            "example": {
                "components": [1, 0, 0, 0],
                "multiplicity": 1,
                "dynkin_labels": [1, 0, 0, 0]
            }
        }


class WeightSystem(BaseModel):
    """Complete weight system of an irreducible representation"""
    irrep: Irrep = Field(..., description="The representation")
    weights: List[Weight] = Field(..., description="All weights with multiplicities")
    highest_weight: Weight = Field(..., description="Highest weight")
    
    class Config:
        json_schema_extra = {
            "example": {
                "irrep": {"dynkin_labels": [1, 0, 0, 0], "dimension": 5, "name": "5"},
                "weights": [
                    {"components": [1, 0, 0, 0], "multiplicity": 1},
                    {"components": [0, 1, 0, 0], "multiplicity": 1},
                ],
                "highest_weight": {"components": [1, 0, 0, 0], "multiplicity": 1}
            }
        }


# ============================================================================
# CALCULATION REQUEST/RESPONSE MODELS
# ============================================================================

class GroupInfoRequest(BaseModel):
    """Request for basic group information"""
    group: PhysicsGroup = Field(..., description="Physics group name")
    include_roots: bool = Field(default=False, description="Include root system details")
    include_dynkin: bool = Field(default=True, description="Include Dynkin diagram")
    
    class Config:
        json_schema_extra = {
            "example": {
                "group": "SU(5)",
                "include_roots": True,
                "include_dynkin": True
            }
        }


class GroupInfoResponse(BaseModel):
    """Response with group information"""
    info: LieAlgebraInfo
    dynkin_diagram: Optional[DynkinDiagram] = None
    root_system: Optional[RootSystem] = None


class IrrepDimensionRequest(BaseModel):
    """Request to compute dimension of an irrep"""
    group: PhysicsGroup
    dynkin_labels: List[int] = Field(..., description="Dynkin labels of the representation")
    
    @field_validator('dynkin_labels')
    @classmethod
    def validate_non_negative(cls, v):
        if any(x < 0 for x in v):
            raise ValueError("Dynkin labels must be non-negative integers")
        return v
    
    class Config:
        json_schema_extra = {
            "example": {
                "group": "SU(5)",
                "dynkin_labels": [1, 0, 0, 0]
            }
        }


class IrrepDimensionResponse(BaseModel):
    """Response with irrep dimension"""
    irrep: Irrep
    dimension: int
    computation_method: str = Field(default="weyl_dimension_formula", description="Method used")


class WeightSystemRequest(BaseModel):
    """Request for weight system of an irrep"""
    group: PhysicsGroup
    dynkin_labels: List[int]
    max_weights: Optional[int] = Field(default=100, description="Maximum number of weights to return")
    
    class Config:
        json_schema_extra = {
            "example": {
                "group": "SU(5)",
                "dynkin_labels": [1, 0, 0, 0],
                "max_weights": 50
            }
        }


class WeightSystemResponse(BaseModel):
    """Response with weight system"""
    weight_system: WeightSystem
    num_weights: int
    truncated: bool = Field(default=False, description="Whether weight list was truncated")


class TensorProductRequest(BaseModel):
    """Request to decompose tensor product of two irreps"""
    group: PhysicsGroup
    irrep1: List[int] = Field(..., description="Dynkin labels of first irrep")
    irrep2: List[int] = Field(..., description="Dynkin labels of second irrep")
    compute_multiplicities: bool = Field(default=True, description="Compute multiplicities")
    
    class Config:
        json_schema_extra = {
            "example": {
                "group": "SU(5)",
                "irrep1": [1, 0, 0, 0],
                "irrep2": [0, 0, 0, 1],
                "compute_multiplicities": True
            }
        }


class TensorProductTerm(BaseModel):
    """Single term in tensor product decomposition"""
    irrep: Irrep
    multiplicity: int = Field(..., description="How many times this irrep appears")


class TensorProductResponse(BaseModel):
    """Response with tensor product decomposition"""
    irrep1: Irrep
    irrep2: Irrep
    decomposition: List[TensorProductTerm] = Field(..., description="List of irreps in decomposition")
    total_dimension: int = Field(..., description="Total dimension (should equal dim(irrep1) * dim(irrep2))")
    
    class Config:
        json_schema_extra = {
            "example": {
                "irrep1": {"dynkin_labels": [1, 0, 0, 0], "dimension": 5},
                "irrep2": {"dynkin_labels": [0, 0, 0, 1], "dimension": 5},
                "decomposition": [
                    {"irrep": {"dynkin_labels": [0, 0, 0, 0], "dimension": 1}, "multiplicity": 1},
                    {"irrep": {"dynkin_labels": [1, 0, 0, 1], "dimension": 24}, "multiplicity": 1}
                ],
                "total_dimension": 25
            }
        }


class BranchingRuleRequest(BaseModel):
    """Request for branching rule G ⊃ H"""
    parent_group: PhysicsGroup = Field(..., description="Parent group G")
    subgroup: str = Field(..., description="Subgroup H (e.g., 'SU(3)xSU(2)xU(1)')")
    parent_irrep: List[int] = Field(..., description="Irrep of parent group")
    
    class Config:
        json_schema_extra = {
            "example": {
                "parent_group": "SU(5)",
                "subgroup": "SU(3)xSU(2)xU(1)",
                "parent_irrep": [1, 0, 0, 0]
            }
        }


class SubgroupIrrep(BaseModel):
    """Irrep of subgroup in branching rule"""
    subgroup_name: str
    dynkin_labels: List[List[int]] = Field(..., description="Dynkin labels for each factor")
    quantum_numbers: Dict[str, float] = Field(..., description="Quantum numbers (e.g., hypercharge)")
    dimension: int


class BranchingRuleResponse(BaseModel):
    """Response with branching rule decomposition"""
    parent_irrep: Irrep
    parent_group: str
    subgroup: str
    decomposition: List[SubgroupIrrep]


# ============================================================================
# ERROR RESPONSES
# ============================================================================

class ErrorResponse(BaseModel):
    """Standard error response"""
    error: str = Field(..., description="Error type")
    detail: str = Field(..., description="Detailed error message")
    suggestion: Optional[str] = Field(None, description="Suggestion for fixing the error")
    
    class Config:
        json_schema_extra = {
            "example": {
                "error": "InvalidDynkinLabels",
                "detail": "Dynkin labels must have length 4 for SU(5)",
                "suggestion": "Use format [a1, a2, a3, a4] where all ai >= 0"
            }
        }


# ============================================================================
# COMMON IRREPS DATABASE
# ============================================================================

class CommonIrrepsRequest(BaseModel):
    """Request for list of common irreps for a group"""
    group: PhysicsGroup
    
    class Config:
        json_schema_extra = {
            "example": {
                "group": "SU(5)"
            }
        }


class CommonIrrep(BaseModel):
    """A commonly used irrep with metadata"""
    irrep: Irrep
    standard_name: str = Field(..., description="Standard physics name")
    description: Optional[str] = Field(None, description="Brief description")
    
    class Config:
        json_schema_extra = {
            "example": {
                "irrep": {"dynkin_labels": [1, 0, 0, 0], "dimension": 5, "name": "5"},
                "standard_name": "fundamental",
                "description": "Fundamental representation of SU(5)"
            }
        }


class CommonIrrepsResponse(BaseModel):
    """Response with list of common irreps"""
    group: PhysicsGroup
    irreps: List[CommonIrrep]
