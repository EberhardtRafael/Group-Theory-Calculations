"""
Test script to explore SymPy's Lie algebra capabilities
"""

from sympy.liealgebras.root_system import RootSystem
from sympy.liealgebras.weyl_group import WeylGroup
from sympy.liealgebras.cartan_type import CartanType
from sympy.liealgebras.dynkin_diagram import DynkinDiagram
import numpy as np

def test_lie_algebra_basics():
    """Test basic Lie algebra functionality"""
    
    print("=" * 60)
    print("TESTING LIE ALGEBRA CAPABILITIES")
    print("=" * 60)
    
    # Test different Cartan types (simple Lie algebras)
    algebras = [
        ("A", 2),  # SU(3)
        ("A", 4),  # SU(5)
        ("D", 5),  # SO(10)
        ("E", 6),  # E6
        ("E", 7),  # E7
        ("E", 8),  # E8
    ]
    
    for series, rank in algebras:
        print(f"\n{'-'*60}")
        print(f"Algebra: {series}{rank}")
        print(f"{'-'*60}")
        
        try:
            # Create Cartan type string
            cartan_str = series + str(rank)
            ct = CartanType(cartan_str)
            print(f"Cartan Type: {ct}")
            print(f"Rank: {ct.rank()}")
            print(f"Dimension: {ct.dimension()}")
            
            # Create root system (pass string directly)
            rs = RootSystem(cartan_str)
            print(f"\nRoot System:")
            print(f"  Number of roots: {len(rs.all_roots())}")
            print(f"  Positive roots: {len(rs.positive_roots())}")
            
            # Get simple roots
            simple_roots = rs.simple_roots()
            print(f"\n  Simple roots ({len(simple_roots)}):")
            for i, root in enumerate(simple_roots[:3], 1):  # Show first 3
                print(f"    α_{i}: {root}")
            if len(simple_roots) > 3:
                print(f"    ... and {len(simple_roots) - 3} more")
            
            # Get Cartan matrix
            cartan_matrix = ct.cartan_matrix()
            print(f"\n  Cartan Matrix:")
            print(f"    {cartan_matrix}")
            
            # Dynkin diagram
            dd = DynkinDiagram(series + str(rank))
            print(f"\n  Dynkin Diagram Vertices: {dd.vertices()}")
            print(f"  Dynkin Diagram Edges: {dd.edges()}")
            
            # Weyl group
            try:
                wg = WeylGroup(cartan_str)
                print(f"\n  Weyl Group Order: {wg.order()}")
            except Exception as e:
                print(f"\n  Weyl Group: (computation skipped)")
            
        except Exception as e:
            print(f"Error: {e}")
            import traceback
            traceback.print_exc()

def test_root_operations():
    """Test operations with roots"""
    
    print("\n" + "=" * 60)
    print("TESTING ROOT OPERATIONS (SU(5) example)")
    print("=" * 60)
    
    ct = CartanType("A4")  # SU(5)
    rs = RootSystem("A4")
    
    # Get all roots
    all_roots = rs.all_roots()
    positive_roots = rs.positive_roots()
    
    print(f"\nAll roots: {len(all_roots)}")
    print(f"Positive roots: {len(positive_roots)}")
    
    print("\nAll positive roots:")
    for i, root in enumerate(positive_roots, 1):
        print(f"  {i}. {root}")

def test_weights_and_representations():
    """Test weight system"""
    
    print("\n" + "=" * 60)
    print("TESTING WEIGHTS (SU(5) example)")
    print("=" * 60)
    
    ct = CartanType("A4")  # SU(5)
    rs = RootSystem("A4")
    
    # Fundamental weights
    fundamental_weights = rs.fundamental_weights()
    print(f"\nFundamental weights ({len(fundamental_weights)}):")
    for i, weight in enumerate(fundamental_weights, 1):
        print(f"  Λ_{i}: {weight}")

def test_tensor_products():
    """Test if we can compute tensor product decompositions"""
    
    print("\n" + "=" * 60)
    print("TESTING TENSOR PRODUCTS")
    print("=" * 60)
    
    print("\nNote: SymPy doesn't have direct tensor product decomposition.")
    print("We'll need to implement this using root/weight systems.")
    print("This will require:")
    print("  1. Weight system of irreps")
    print("  2. Tensor product of weights")
    print("  3. Decomposition into irreducible reps")

if __name__ == "__main__":
    try:
        test_lie_algebra_basics()
        test_root_operations()
        test_weights_and_representations()
        test_tensor_products()
        
        print("\n" + "=" * 60)
        print("TEST COMPLETE - SymPy Lie Algebras Working!")
        print("=" * 60)
        
    except Exception as e:
        print(f"\nError during testing: {e}")
        import traceback
        traceback.print_exc()
