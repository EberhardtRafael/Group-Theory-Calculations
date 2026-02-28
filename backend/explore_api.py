"""
Explore SymPy Lie algebra API to understand available methods
"""

from sympy.liealgebras.root_system import RootSystem
from sympy.liealgebras.weyl_group import WeylGroup
from sympy.liealgebras.cartan_type import CartanType
from sympy.liealgebras.dynkin_diagram import DynkinDiagram

# Test with A2 (SU(3))
print("Exploring RootSystem API for A2 (SU(3)):")
print("="*60)

rs = RootSystem("A2")
print("\nRootSystem methods:")
print([m for m in dir(rs) if not m.startswith('_')])

print("\n\nTrying different methods:")
print("-"*60)

# Try different method names
try:
    print(f"all_roots(): {rs.all_roots()}")
except AttributeError as e:
    print(f"all_roots() failed: {e}")

try:
    print(f"root_system(): {rs.root_system()}")
except AttributeError as e:
    print(f"root_system() failed: {e}")

try:
    print(f"simple_roots(): {rs.simple_roots()}")
except AttributeError as e:
    print(f"simple_roots() failed: {e}")

try:
    print(f"fundamental_weights(): {rs.fundamental_weights()}")
except AttributeError as e:
    print(f"fundamental_weights() failed: {e}")

try:
    print(f"cartan_matrix(): {rs.cartan_type.cartan_matrix()}")  
except AttributeError as e:
    print(f"cartan_matrix() failed: {e}")

# Explore CartanType
print("\n\n" + "="*60)
print("Exploring CartanType API:")
print("="*60)
ct = CartanType("A2")
print("\nCartanType methods:")
print([m for m in dir(ct) if not m.startswith('_')])

print("\n\nCartanType properties:")
print(f"  rank: {ct.rank()}")
print(f"  dimension: {ct.dimension()}")
print(f"  cartan_matrix: {ct.cartan_matrix()}")

# Explore DynkinDiagram
print("\n\n" + "="*60)
print("Exploring DynkinDiagram API:")
print("="*60)
dd = DynkinDiagram("A2")
print("\nDynkinDiagram methods:")
print([m for m in dir(dd) if not m.startswith('_')])

print("\n\nDynkinDiagram properties:")
print(f"  vertices: {dd.vertices()}")
print(f"  edges: {dd.edges()}")
