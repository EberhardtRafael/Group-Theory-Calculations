"""
Unit tests for Pydantic models

Tests validation, serialization, and edge cases for all API models.
"""

import pytest
from pydantic import ValidationError

from app.models import (
    AlgebraType,
    PhysicsGroup,
    ALGEBRA_MAPPING,
    LieAlgebraInfo,
    RootSystem,
    DynkinDiagram,
    Irrep,
    Weight,
    WeightSystem,
    GroupInfoRequest,
    GroupInfoResponse,
    IrrepDimensionRequest,
    IrrepDimensionResponse,
    TensorProductRequest,
    TensorProductResponse,
    TensorProductTerm,
    ErrorResponse,
)


class TestEnumsAndMappings:
    """Test enum types and their mappings"""
    
    def test_algebra_type_enum(self):
        """Test AlgebraType enum values"""
        assert AlgebraType.A2 == "A2"
        assert AlgebraType.A4 == "A4"
        assert AlgebraType.E8 == "E8"
    
    def test_physics_group_enum(self):
        """Test PhysicsGroup enum values"""
        assert PhysicsGroup.SU3 == "SU(3)"
        assert PhysicsGroup.SU5 == "SU(5)"
        assert PhysicsGroup.E8 == "E8"
    
    def test_algebra_mapping(self):
        """Test mapping between physics names and Cartan types"""
        assert ALGEBRA_MAPPING[PhysicsGroup.SU3] == AlgebraType.A2
        assert ALGEBRA_MAPPING[PhysicsGroup.SU5] == AlgebraType.A4
        assert ALGEBRA_MAPPING[PhysicsGroup.SO10] == AlgebraType.D5
        assert ALGEBRA_MAPPING[PhysicsGroup.E6] == AlgebraType.E6


class TestLieAlgebraInfo:
    """Test LieAlgebraInfo model"""
    
    def test_valid_creation(self):
        """Test creating valid LieAlgebraInfo"""
        info = LieAlgebraInfo(
            cartan_type="A4",
            physics_name="SU(5)",
            rank=4,
            dimension=24,
            num_roots=20,
            num_positive_roots=10
        )
        assert info.cartan_type == "A4"
        assert info.rank == 4
        assert info.dimension == 24
    
    def test_serialization(self):
        """Test JSON serialization"""
        info = LieAlgebraInfo(
            cartan_type="A2",
            physics_name="SU(3)",
            rank=2,
            dimension=3,
            num_roots=6,
            num_positive_roots=3
        )
        data = info.model_dump()
        assert data["cartan_type"] == "A2"
        assert data["physics_name"] == "SU(3)"


class TestRootSystem:
    """Test RootSystem model"""
    
    def test_valid_root_system(self):
        """Test creating valid root system"""
        rs = RootSystem(
            simple_roots=[[1, -1, 0], [0, 1, -1]],
            positive_roots=[[1, -1, 0], [1, 0, -1], [0, 1, -1]],
            cartan_matrix=[[2, -1], [-1, 2]]
        )
        assert len(rs.simple_roots) == 2
        assert len(rs.positive_roots) == 3
        assert rs.cartan_matrix == [[2, -1], [-1, 2]]


class TestIrrep:
    """Test Irrep model"""
    
    def test_valid_irrep(self):
        """Test creating valid irrep"""
        irrep = Irrep(
            dynkin_labels=[1, 0, 0, 0],
            dimension=5,
            name="5"
        )
        assert irrep.dynkin_labels == [1, 0, 0, 0]
        assert irrep.dimension == 5
        assert irrep.name == "5"
    
    def test_negative_dynkin_labels_rejected(self):
        """Test that negative Dynkin labels are rejected"""
        with pytest.raises(ValidationError) as exc_info:
            Irrep(dynkin_labels=[1, -1, 0, 0])
        
        assert "non-negative" in str(exc_info.value).lower()
    
    def test_optional_fields(self):
        """Test irrep with only required fields"""
        irrep = Irrep(dynkin_labels=[2, 0, 0, 1])
        assert irrep.dynkin_labels == [2, 0, 0, 1]
        assert irrep.dimension is None
        assert irrep.name is None


class TestWeight:
    """Test Weight model"""
    
    def test_valid_weight(self):
        """Test creating valid weight"""
        weight = Weight(
            components=[1.0, 0.0, 0.0, 0.0],
            multiplicity=1,
            dynkin_labels=[1, 0, 0, 0]
        )
        assert weight.components == [1.0, 0.0, 0.0, 0.0]
        assert weight.multiplicity == 1
    
    def test_fractional_components(self):
        """Test weight with fractional components (E6, E7, E8)"""
        weight = Weight(
            components=[0.5, -0.5, -0.5, -0.5],
            multiplicity=2
        )
        assert weight.components[0] == 0.5


class TestGroupInfoRequest:
    """Test GroupInfoRequest model"""
    
    def test_valid_request(self):
        """Test creating valid group info request"""
        req = GroupInfoRequest(
            group=PhysicsGroup.SU5,
            include_roots=True,
            include_dynkin=True
        )
        assert req.group == PhysicsGroup.SU5
        assert req.include_roots is True
        assert req.include_dynkin is True
    
    def test_default_values(self):
        """Test default values"""
        req = GroupInfoRequest(group=PhysicsGroup.SU3)
        assert req.include_roots is False
        assert req.include_dynkin is True


class TestIrrepDimensionRequest:
    """Test IrrepDimensionRequest model"""
    
    def test_valid_request(self):
        """Test creating valid dimension request"""
        req = IrrepDimensionRequest(
            group=PhysicsGroup.SU5,
            dynkin_labels=[1, 0, 0, 0]
        )
        assert req.group == PhysicsGroup.SU5
        assert req.dynkin_labels == [1, 0, 0, 0]
    
    def test_negative_labels_rejected(self):
        """Test that negative Dynkin labels are rejected"""
        with pytest.raises(ValidationError):
            IrrepDimensionRequest(
                group=PhysicsGroup.SU5,
                dynkin_labels=[1, -1, 0, 0]
            )


class TestTensorProductRequest:
    """Test TensorProductRequest model"""
    
    def test_valid_request(self):
        """Test creating valid tensor product request"""
        req = TensorProductRequest(
            group=PhysicsGroup.SU5,
            irrep1=[1, 0, 0, 0],
            irrep2=[0, 0, 0, 1],
            compute_multiplicities=True
        )
        assert req.group == PhysicsGroup.SU5
        assert req.irrep1 == [1, 0, 0, 0]
        assert req.irrep2 == [0, 0, 0, 1]
    
    def test_default_compute_multiplicities(self):
        """Test default value for compute_multiplicities"""
        req = TensorProductRequest(
            group=PhysicsGroup.SU5,
            irrep1=[1, 0, 0, 0],
            irrep2=[0, 0, 0, 1]
        )
        assert req.compute_multiplicities is True


class TestTensorProductResponse:
    """Test TensorProductResponse model"""
    
    def test_valid_response(self):
        """Test creating valid tensor product response"""
        resp = TensorProductResponse(
            irrep1=Irrep(dynkin_labels=[1, 0, 0, 0], dimension=5),
            irrep2=Irrep(dynkin_labels=[0, 0, 0, 1], dimension=5),
            decomposition=[
                TensorProductTerm(
                    irrep=Irrep(dynkin_labels=[0, 0, 0, 0], dimension=1),
                    multiplicity=1
                ),
                TensorProductTerm(
                    irrep=Irrep(dynkin_labels=[1, 0, 0, 1], dimension=24),
                    multiplicity=1
                )
            ],
            total_dimension=25
        )
        assert resp.total_dimension == 25
        assert len(resp.decomposition) == 2
        assert resp.decomposition[0].multiplicity == 1
    
    def test_dimension_conservation(self):
        """Test that total dimension equals product of input dimensions"""
        # This would be validated in the actual computation
        # Here we just test the model accepts it
        resp = TensorProductResponse(
            irrep1=Irrep(dynkin_labels=[1, 0, 0, 0], dimension=5),
            irrep2=Irrep(dynkin_labels=[0, 0, 0, 1], dimension=5),
            decomposition=[
                TensorProductTerm(
                    irrep=Irrep(dynkin_labels=[0, 0, 0, 0], dimension=1),
                    multiplicity=1
                ),
                TensorProductTerm(
                    irrep=Irrep(dynkin_labels=[1, 0, 0, 1], dimension=24),
                    multiplicity=1
                )
            ],
            total_dimension=25
        )
        # Verify: 5 * 5 = 25 = 1*1 + 1*24
        assert resp.irrep1.dimension * resp.irrep2.dimension == resp.total_dimension
        total_from_decomp = sum(
            term.irrep.dimension * term.multiplicity 
            for term in resp.decomposition
        )
        assert total_from_decomp == resp.total_dimension


class TestErrorResponse:
    """Test ErrorResponse model"""
    
    def test_valid_error(self):
        """Test creating valid error response"""
        err = ErrorResponse(
            error="InvalidDynkinLabels",
            detail="Dynkin labels must have length 4 for SU(5)",
            suggestion="Use format [a1, a2, a3, a4] where all ai >= 0"
        )
        assert err.error == "InvalidDynkinLabels"
        assert "length 4" in err.detail
    
    def test_optional_suggestion(self):
        """Test error without suggestion"""
        err = ErrorResponse(
            error="ComputationError",
            detail="Failed to compute dimension"
        )
        assert err.suggestion is None


class TestWeightSystem:
    """Test WeightSystem model"""
    
    def test_valid_weight_system(self):
        """Test creating valid weight system"""
        highest = Weight(components=[1, 0, 0, 0], multiplicity=1)
        ws = WeightSystem(
            irrep=Irrep(dynkin_labels=[1, 0, 0, 0], dimension=5),
            weights=[
                highest,
                Weight(components=[0, 1, 0, 0], multiplicity=1),
            ],
            highest_weight=highest
        )
        assert len(ws.weights) == 2
        assert ws.highest_weight.multiplicity == 1
        assert ws.irrep.dimension == 5
