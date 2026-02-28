"""
Groups endpoints - Lie group creation and manipulation
"""

from typing import List, Any, Dict
from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, Field

from app.core.lie_algebra import LieAlgebraCalculator

router = APIRouter()


# Schemas
class GroupCreate(BaseModel):
    """Request schema for creating a group"""
    name: str = Field(..., description="Group name (e.g., 'SU3', 'SO10', 'E6')")
    notation: str = Field(default="cartan", description="Notation: 'cartan' or 'physicist'")


class GroupResponse(BaseModel):
    """Response schema for group data"""
    id: str
    name: str
    cartan_name: str
    rank: int
    cartan_matrix: List[List[int]]
    simple_roots: List[List[float]]
    dimension: int
    positive_roots: List[List[float]] = []


class SymmetryBreakRequest(BaseModel):
    """Request schema for symmetry breaking"""
    node_index: int = Field(..., description="Index of node to cross out (0-based)")
    method: str = Field(default="standard", description="Method: 'standard' or 'extended'")


class SymmetryBreakResponse(BaseModel):
    """Response schema for symmetry breaking"""
    original_group: str
    broken_groups: List[str]
    latex: str


# Endpoints
@router.post("/create", response_model=GroupResponse, status_code=status.HTTP_201_CREATED)
async def create_group(group: GroupCreate):
    """
    Create a Lie group and return its properties.
    
    Supports:
    - Classical groups: SU(n), SO(n)
    - Exceptional groups: E6, E7, E8
    """
    try:
        calc = LieAlgebraCalculator(group.name)
        
        # Generate unique ID from group name
        group_id = f"{calc.cartan_type.lower()}-{calc.get_rank()}"
        
        return {
            "id": group_id,
            "name": calc.physics_name,
            "cartan_name": calc.cartan_type,
            "rank": calc.get_rank(),
            "cartan_matrix": calc.get_cartan_matrix(),
            "simple_roots": calc.get_simple_roots(),
            "dimension": calc.get_dimension(),
            "positive_roots": calc.get_positive_roots(),
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to create group {group.name}: {str(e)}"
        )


@router.get("/{group_name}", response_model=GroupResponse)
async def get_group(group_name: str):
    """Get group details by name (e.g., 'SU3', 'A2', 'E6')"""
    try:
        calc = LieAlgebraCalculator(group_name)
        group_id = f"{calc.cartan_type.lower()}-{calc.get_rank()}"
        
        return {
            "id": group_id,
            "name": calc.physics_name,
            "cartan_name": calc.cartan_type,
            "rank": calc.get_rank(),
            "cartan_matrix": calc.get_cartan_matrix(),
            "simple_roots": calc.get_simple_roots(),
            "dimension": calc.get_dimension(),
            "positive_roots": calc.get_positive_roots(),
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Group {group_name} not found: {str(e)}"
        )


@router.post("/{group_id}/break-symmetry", response_model=SymmetryBreakResponse)
async def break_symmetry(group_id: str, request: SymmetryBreakRequest):
    """
    Break symmetry by crossing out a Dynkin diagram node.
    
    Example: SO(10) with node 4 crossed → SU(5) ⊗ U(1)
    """
    # TODO: Implement symmetry breaking algorithm
    raise HTTPException(
        status_code=status.HTTP_501_NOT_IMPLEMENTED,
        detail="Symmetry breaking not yet implemented"
    )


@router.get("/", response_model=List[Dict[str, Any]])
async def list_groups(skip: int = 0, limit: int = 100):
    """List all available groups"""
    groups = LieAlgebraCalculator.list_available_groups()
    return groups[skip:skip + limit]


@router.get("/{group_name}/info")
async def get_group_info(group_name: str):
    """Get detailed algebra information"""
    try:
        calc = LieAlgebraCalculator(group_name)
        return calc.get_algebra_info()
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Group {group_name} not found: {str(e)}"
        )


@router.get("/{group_name}/root-system")
async def get_root_system(group_name: str):
    """Get complete root system data"""
    try:
        calc = LieAlgebraCalculator(group_name)
        return calc.get_root_system_data()
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Group {group_name} not found: {str(e)}"
        )


@router.get("/{group_name}/dynkin-diagram")
async def get_dynkin_diagram(group_name: str):
    """Get Dynkin diagram representation"""
    try:
        calc = LieAlgebraCalculator(group_name)
        return calc.get_dynkin_diagram()
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Group {group_name} not found: {str(e)}"
        )
