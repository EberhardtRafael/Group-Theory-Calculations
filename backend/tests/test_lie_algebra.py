"""
Unit tests for Lie algebra computations using SymPy

Tests basic SymPy functionality and our wrapper functions.
"""

import pytest
from sympy.liealgebras.root_system import RootSystem
from sympy.liealgebras.cartan_type import CartanType


class TestSymPyBasics:
    """Test basic SymPy Lie algebra functionality"""
    
    @pytest.mark.parametrize("cartan_type,expected_rank", [
        ("A2", 2),
        ("A4", 4),
        ("D5", 5),
        ("E6", 6),
        ("E7", 7),
        ("E8", 8),
    ])
    def test_cartan_ranks(self, cartan_type, expected_rank):
        """Test rank computation for various algebras"""
        ct = CartanType(cartan_type)
        assert ct.rank() == expected_rank
    
    @pytest.mark.parametrize("cartan_type,expected_dim", [
        ("A2", 3),   # SU(3)
        ("A4", 5),   # SU(5)
        ("D5", 5),   # SO(10)
        ("E6", 8),   # E6
        ("E7", 8),   # E7
        ("E8", 8),   # E8
    ])
    def test_cartan_dimensions(self, cartan_type, expected_dim):
        """Test dimension of root space"""
        ct = CartanType(cartan_type)
        assert ct.dimension() == expected_dim
    
    @pytest.mark.parametrize("cartan_type,expected_num_roots", [
        ("A2", 6),     # 3² - 3 = 6
        ("A4", 20),    # 5² - 5 = 20
        ("D5", 40),    # 2*5*(5-1) = 40
        ("E6", 72),    # E6 has 72 roots
        ("E7", 126),   # E7 has 126 roots
        ("E8", 240),   # E8 has 240 roots
    ])
    def test_number_of_roots(self, cartan_type, expected_num_roots):
        """Test total number of roots"""
        rs = RootSystem(cartan_type)
        all_roots = rs.all_roots()
        assert len(all_roots) == expected_num_roots
    
    def test_simple_roots_su3(self):
        """Test simple roots for SU(3)"""
        rs = RootSystem("A2")
        simple = rs.simple_roots()
        
        assert len(simple) == 2
        assert simple[1] == [1, -1, 0]
        assert simple[2] == [0, 1, -1]
    
    def test_simple_roots_su5(self):
        """Test simple roots for SU(5)"""
        rs = RootSystem("A4")
        simple = rs.simple_roots()
        
        assert len(simple) == 4
        assert simple[1] == [1, -1, 0, 0, 0]
        assert simple[2] == [0, 1, -1, 0, 0]
        assert simple[3] == [0, 0, 1, -1, 0]
        assert simple[4] == [0, 0, 0, 1, -1]
    
    def test_cartan_matrix_su3(self):
        """Test Cartan matrix for SU(3)"""
        ct = CartanType("A2")
        cartan = ct.cartan_matrix()
        
        # Cartan matrix for A2: [[2, -1], [-1, 2]]
        assert cartan[0, 0] == 2
        assert cartan[0, 1] == -1
        assert cartan[1, 0] == -1
        assert cartan[1, 1] == 2
    
    def test_cartan_matrix_su5(self):
        """Test Cartan matrix for SU(5)"""
        ct = CartanType("A4")
        cartan = ct.cartan_matrix()
        
        # A4 Cartan matrix is 4x4 tridiagonal
        assert cartan.shape == (4, 4)
        # Diagonal elements are 2
        for i in range(4):
            assert cartan[i, i] == 2
        # Off-diagonal adjacent elements are -1
        for i in range(3):
            assert cartan[i, i+1] == -1
            assert cartan[i+1, i] == -1
    
    def test_positive_roots_su3(self):
        """Test positive roots for SU(3)"""
        rs = RootSystem("A2")
        all_roots = rs.all_roots()
        
        # Positive roots are first half
        num_positive = len(all_roots) // 2
        positive_roots = {k: v for k, v in all_roots.items() if k <= num_positive}
        
        assert len(positive_roots) == 3
        # Should contain simple roots plus their sum
        assert [1, -1, 0] in positive_roots.values()
        assert [0, 1, -1] in positive_roots.values()
        assert [1, 0, -1] in positive_roots.values()
    
    @pytest.mark.slow
    def test_e8_roots_count(self):
        """Test E8 has exactly 240 roots"""
        rs = RootSystem("E8")
        all_roots = rs.all_roots()
        assert len(all_roots) == 240


class TestRootSystemProperties:
    """Test mathematical properties of root systems"""
    
    def test_roots_come_in_pairs(self):
        """Test that for every root α, -α is also a root"""
        rs = RootSystem("A2")
        all_roots = rs.all_roots()
        
        root_list = list(all_roots.values())
        for root in root_list:
            neg_root = [-x for x in root]
            assert neg_root in root_list
    
    def test_simple_roots_count_equals_rank(self):
        """Test that number of simple roots equals rank"""
        for cartan_type in ["A2", "A4", "D5", "E6", "E7", "E8"]:
            ct = CartanType(cartan_type)
            rs = RootSystem(cartan_type)
            
            rank = ct.rank()
            simple_roots = rs.simple_roots()
            
            assert len(simple_roots) == rank
    
    def test_cartan_matrix_invertible(self):
        """Test that Cartan matrix is invertible"""
        for cartan_type in ["A2", "A4", "D5"]:
            ct = CartanType(cartan_type)
            cartan = ct.cartan_matrix()
            
            # Should be able to compute inverse
            cartan_inv = cartan.inv()
            
            # Product should be identity
            identity = cartan * cartan_inv
            rank = ct.rank()
            
            for i in range(rank):
                for j in range(rank):
                    expected = 1 if i == j else 0
                    assert abs(float(identity[i, j]) - expected) < 1e-10


class TestAlgebraSpecificProperties:
    """Test properties specific to particular algebras"""
    
    def test_su_n_algebra_dimension(self):
        """Test that SU(n) has dimension n²-1"""
        # A_{n-1} corresponds to SU(n)
        # A2 = SU(3): dim = 8 = 3²-1
        ct = CartanType("A2")
        n = 3
        assert ct.rank() + len(RootSystem("A2").all_roots()) == n**2 - 1
    
    def test_so_10_properties(self):
        """Test SO(10) specific properties"""
        ct = CartanType("D5")  # SO(10)
        rs = RootSystem("D5")
        
        # SO(10) has rank 5
        assert ct.rank() == 5
        
        # SO(10) has 40 roots
        assert len(rs.all_roots()) == 40
        
        # SO(10) algebra dimension = 5*(2*5-1) = 45
        # = rank + num_roots = 5 + 40
        assert ct.rank() + len(rs.all_roots()) == 45
