"""
Irreps endpoints - Irreducible representation calculations
"""

from typing import List
from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, Field

from app.core.irreps import IrrepCalculator
from app.core.tensor_products import TensorProductCalculator
from app.core.weight_systems import calculate_weight_diagram_data

router = APIRouter()


# Schemas
class IrrepCreate(BaseModel):
    """Request schema for creating an irrep"""
    group_id: str
    highest_weight: List[int] = Field(..., description="Highest weight in Dynkin basis")
    method: str = Field(default="weyl_reflection", description="Construction method")


class IrrepResponse(BaseModel):
    """Response schema for irrep data"""
    id: str
    group_id: str
    highest_weight: List[int]
    dimension: int
    weights: List[List[int]]
    multiplicities: List[int]
    latex_name: str


class TensorProductRequest(BaseModel):
    """Request schema for tensor product"""
    group: str = Field(..., description="Group name (e.g., 'SU3')")
    irrep1: List[int] = Field(..., description="First irrep highest weight")
    irrep2: List[int] = Field(..., description="Second irrep highest weight")


class TensorProductResponse(BaseModel):
    """Response schema for tensor product decomposition"""
    decomposition: List[dict]
    latex: str


class WeightSystemVisualizationRequest(BaseModel):
    """Request schema for weight system visualization"""
    group: str = Field(..., description="Group name (e.g., 'SU3')")
    irrep: List[int] = Field(..., description="Dynkin labels [a1, a2, ...]")


class WeightSystemVisualizationResponse(BaseModel):
    """Response schema for weight system visualization data"""
    group: str
    dynkin_labels: List[int]
    dimension: int
    num_weights: int
    weights: List[dict]
    coordinate_system: str


# Endpoints
@router.post("/", response_model=IrrepResponse, status_code=status.HTTP_201_CREATED)
async def create_irrep(irrep: IrrepCreate):
    """
    Construct an irreducible representation from highest weight.
    
    Methods:
    - weyl_reflection: Fast Weyl reflection algorithm
    - freudenthal: Freudenthal's multiplicity formula
    """
    try:
        calc = IrrepCalculator(irrep.group_id, irrep.highest_weight)
        data = calc.get_irrep_data()
        
        # Generate ID
        weight_str = "_".join(map(str, irrep.highest_weight))
        irrep_id = f"{irrep.group_id.lower()}-{weight_str}"
        
        return {
            "id": irrep_id,
            "group_id": irrep.group_id,
            "highest_weight": data["highest_weight"],
            "dimension": data["dimension"],
            "weights": data["weights"],
            "multiplicities": data["multiplicities"],
            "latex_name": data["latex_name"],
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to create irrep: {str(e)}"
        )


@router.get("/{irrep_id}", response_model=IrrepResponse)
async def get_irrep(irrep_id: str):
    """
    Get irrep details by ID.
    
    ID format: 'groupname-weight1_weight2_...'
    Example: 'su3-1_0' for SU(3) fundamental representation
    """
    try:
        # Parse ID to extract group and weight
        parts = irrep_id.split("-")
        if len(parts) < 2:
            raise ValueError("Invalid irrep ID format")
        
        group_id = parts[0]
        weight_str = "-".join(parts[1:])
        highest_weight = [int(x) for x in weight_str.split("_")]
        
        calc = IrrepCalculator(group_id, highest_weight)
        data = calc.get_irrep_data()
        
        return {
            "id": irrep_id,
            "group_id": group_id,
            "highest_weight": data["highest_weight"],
            "dimension": data["dimension"],
            "weights": data["weights"],
            "multiplicities": data["multiplicities"],
            "latex_name": data["latex_name"],
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Irrep {irrep_id} not found: {str(e)}"
        )


@router.post("/tensor-product", response_model=TensorProductResponse)
async def tensor_product(request: TensorProductRequest):
    """
    Calculate tensor product decomposition.
    
    Example: SU(3): [1,0] ⊗ [1,0] = [0,1] ⊕ [2,0]
              (3 ⊗ 3 = 3̄ ⊕ 6)
    """
    try:
        calc = TensorProductCalculator(request.group)
        decomposition = calc.decompose(request.irrep1, request.irrep2)
        latex_formula = calc.get_latex_formula(request.irrep1, request.irrep2, decomposition)
        
        return {
            "decomposition": decomposition,
            "latex": latex_formula,
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to calculate tensor product: {str(e)}"
        )


@router.get("/", response_model=List[IrrepResponse])
async def list_irreps(group_id: str = None, skip: int = 0, limit: int = 100):
    """List irreps, optionally filtered by group"""
    # TODO: Return list of irreps
    return []


@router.post("/weight-system", response_model=WeightSystemVisualizationResponse)
async def get_weight_system_visualization(request: WeightSystemVisualizationRequest):
    """
    Get weight system with visualization coordinates for multiplet diagrams.
    
    For SU(3), returns weights in (I₃, Y) coordinates.
    For higher rank groups, returns weights in appropriate projection.
    
    Example: SU(3) fundamental [1,0] returns 3 weights forming a triangle
    """
    try:
        weight_data = calculate_weight_diagram_data(request.group, request.irrep)
        
        if "error" in weight_data:
            raise HTTPException(
                status_code=status.HTTP_501_NOT_IMPLEMENTED,
                detail=weight_data["error"]
            )
        
        return weight_data
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to calculate weight system: {str(e)}"
        )

