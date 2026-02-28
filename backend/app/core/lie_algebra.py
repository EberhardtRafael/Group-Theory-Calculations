"""
Lie Algebra calculations using SymPy.

This module provides high-level wrappers around SymPy's Lie algebra functionality
for use in the FastAPI endpoints.
"""

from typing import List, Dict, Tuple, Optional
import re
import numpy as np
from sympy.liealgebras.root_system import RootSystem
from sympy.liealgebras.cartan_type import CartanType


def parse_physics_notation(group_name: str) -> str:
    """
    Parse physics notation to Cartan type.
    
    Examples:
        SU(5) -> A4
        SO(10) -> D5
        Sp(6) -> C3
        A7 -> A7 (pass through)
    """
    group_clean = group_name.upper().replace(" ", "")
    
    # SU(n) -> A_{n-1}
    match = re.match(r'SU\(?(\d+)\)?', group_clean)
    if match:
        n = int(match.group(1))
        return f"A{n-1}"
    
    # SO(2n) -> D_n for even dimensions >= 8
    # SO(2n+1) -> B_n for odd dimensions
    match = re.match(r'SO\(?(\d+)\)?', group_clean)
    if match:
        dim = int(match.group(1))
        if dim % 2 == 0 and dim >= 8:
            return f"D{dim//2}"
        elif dim % 2 == 1:
            return f"B{(dim-1)//2}"
        elif dim == 6:
            return "D3"
        elif dim == 4:
            return "D2"
        elif dim == 2:
            return "A1"
    
    # Sp(2n) or USp(2n) -> C_n
    match = re.match(r'U?SP\(?(\d+)\)?', group_clean)
    if match:
        dim = int(match.group(1))
        if dim % 2 == 0:
            return f"C{dim//2}"
    
    # Already in Cartan notation (A5, B3, C4, D6, E6, E7, E8, F4, G2)
    if re.match(r'^[A-G]\d+$', group_clean):
        return group_clean
    
    # Fallback
    return group_clean


def cartan_to_physics(cartan_type: str) -> str:
    """Convert Cartan type to physics notation."""
    match = re.match(r'([A-G])(\d+)', cartan_type)
    if not match:
        return cartan_type
    
    series, n_str = match.groups()
    n = int(n_str)
    
    if series == 'A':
        return f"SU({n+1})"
    elif series == 'B':
        return f"SO({2*n+1})"
    elif series == 'C':
        return f"Sp({2*n})"
    elif series == 'D':
        return f"SO({2*n})"
    else:
        return cartan_type


class LieAlgebraCalculator:
    """Calculator for Lie algebra properties and operations."""
    
    def __init__(self, group_name: str):
        """
        Initialize calculator for a specific group.
        
        Args:
            group_name: Either physics notation (e.g., 'SU(10)', 'SO(14)') 
                       or Cartan type (e.g., 'A9', 'D7')
        """
        self.group_name = group_name.strip()
        
        # Parse to Cartan type
        self.cartan_type = parse_physics_notation(self.group_name)
        self.physics_name = cartan_to_physics(self.cartan_type)
        
        # Initialize SymPy objects
        self.cartan = CartanType(self.cartan_type)
        self.root_system = RootSystem(self.cartan_type)
    
    def get_rank(self) -> int:
        """Get the rank of the Lie algebra."""
        return self.cartan.rank()
    
    def get_dimension(self) -> int:
        """Get the dimension (number of generators) of the Lie algebra."""
        # For simple Lie algebras: dim = rank + number of roots
        return self.get_rank() + len(self.root_system.all_roots())
    
    def get_cartan_matrix(self) -> List[List[int]]:
        """Get the Cartan matrix as a list of lists."""
        cartan_matrix = self.cartan.cartan_matrix()
        rank = self.get_rank()
        
        # Convert sympy Matrix to list of lists
        matrix = []
        for i in range(rank):
            row = []
            for j in range(rank):
                row.append(int(cartan_matrix[i, j]))
            matrix.append(row)
        
        return matrix
    
    def get_simple_roots(self) -> List[List[float]]:
        """Get the simple roots as a list of vectors."""
        simple_roots_dict = self.root_system.simple_roots()
        
        # Convert to list of lists, maintaining order
        roots = []
        for i in range(1, len(simple_roots_dict) + 1):
            root = simple_roots_dict[i]
            roots.append([float(x) for x in root])
        
        return roots
    
    def get_positive_roots(self) -> List[List[float]]:
        """Get all positive roots."""
        all_roots = self.root_system.all_roots()
        num_positive = len(all_roots) // 2
        
        positive_roots = []
        for i in range(1, num_positive + 1):
            root = all_roots[i]
            positive_roots.append([float(x) for x in root])
        
        return positive_roots
    
    def get_all_roots(self) -> List[List[float]]:
        """Get all roots (positive and negative)."""
        all_roots_dict = self.root_system.all_roots()
        
        roots = []
        for i in sorted(all_roots_dict.keys()):
            root = all_roots_dict[i]
            roots.append([float(x) for x in root])
        
        return roots
    
    def get_algebra_info(self) -> Dict:
        """Get complete information about the Lie algebra."""
        all_roots = self.root_system.all_roots()
        
        return {
            "cartan_type": self.cartan_type,
            "physics_name": self.physics_name,
            "rank": self.get_rank(),
            "dimension": self.get_dimension(),
            "num_roots": len(all_roots),
            "num_positive_roots": len(all_roots) // 2,
        }
    
    def get_root_system_data(self) -> Dict:
        """Get complete root system data."""
        return {
            "simple_roots": self.get_simple_roots(),
            "positive_roots": self.get_positive_roots(),
            "cartan_matrix": self.get_cartan_matrix(),
        }
    
    def get_dynkin_diagram(self) -> Dict:
        """
        Get Dynkin diagram representation.
        
        Returns a simple textual representation and connectivity info.
        """
        rank = self.get_rank()
        cartan_matrix = self.get_cartan_matrix()
        
        # Build connectivity from Cartan matrix
        edges = []
        for i in range(rank):
            for j in range(i + 1, rank):
                if cartan_matrix[i][j] != 0:
                    # Off-diagonal non-zero means connected
                    edge_type = abs(cartan_matrix[i][j])
                    edges.append({"from": i, "to": j, "type": edge_type})
        
        # Create simple ASCII representation
        diagram_lines = []
        
        if self.cartan_type.startswith("A"):
            # A_n: Linear chain
            diagram_lines.append("---".join(["O"] * rank))
            diagram_lines.append(" ".join(str(i) for i in range(rank)))
        elif self.cartan_type.startswith("D"):
            # D_n: Fork at the end
            diagram_lines.append(f"Dynkin diagram for {self.cartan_type}")
            diagram_lines.append("(Fork-shaped diagram)")
        elif self.cartan_type.startswith("E"):
            # E_n: Special exceptional structure
            diagram_lines.append(f"Dynkin diagram for {self.cartan_type}")
            diagram_lines.append("(Exceptional group diagram)")
        else:
            diagram_lines.append(f"Dynkin diagram for {self.cartan_type}")
        
        return {
            "diagram_string": "\n".join(diagram_lines),
            "vertices": list(range(rank)),
            "edges": edges,
            "node_labels": [f"α{i+1}" for i in range(rank)],
            "cartan_type": self.cartan_type,
        }
    
    @staticmethod
    def list_available_groups() -> List[Dict]:
        """List all supported groups."""
        supported = [
            {"cartan_type": "A2", "physics_name": "SU(3)", "rank": 2},
            {"cartan_type": "A4", "physics_name": "SU(5)", "rank": 4},
            {"cartan_type": "D5", "physics_name": "SO(10)", "rank": 5},
            {"cartan_type": "E6", "physics_name": "E6", "rank": 6},
            {"cartan_type": "E7", "physics_name": "E7", "rank": 7},
            {"cartan_type": "E8", "physics_name": "E8", "rank": 8},
        ]
        return supported
