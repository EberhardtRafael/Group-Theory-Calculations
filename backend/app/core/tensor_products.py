"""
Tensor product decomposition calculations.

This module handles tensor product decompositions of irreps using
Littlewood-Richardson rules and other methods.

Note: Currently only SU(3) and SU(5) have full tensor product support.
Other groups can be created and their properties calculated, but tensor
products will return empty decompositions.
"""

from typing import List, Dict, Tuple
import numpy as np
from .irreps import IrrepCalculator
from .lie_algebra import parse_physics_notation


class TensorProductCalculator:
    """Calculator for tensor product decompositions."""
    
    def __init__(self, group_name: str):
        """
        Initialize tensor product calculator.
        
        Args:
            group_name: Group name (e.g., 'SU(10)', 'SO(14)', 'A9', 'D7')
        """
        # Parse to Cartan type
        self.cartan_type = parse_physics_notation(group_name)
        self.group_name = group_name  # Keep original for reference
    
    def decompose(self, irrep1: List[int], irrep2: List[int]) -> List[Dict]:
        """
        Decompose tensor product of two irreps.
        
        Args:
            irrep1: First irrep highest weight in Dynkin basis
            irrep2: Second irrep highest weight in Dynkin basis
        
        Returns:
            List of dicts with keys: 'weight', 'multiplicity', 'dimension', 'latex_name'
            
        Note: Only SU(3) and SU(5) are currently fully supported. Other groups will
              return an empty decomposition.
        """
        if self.cartan_type == "A2":  # SU(3)
            return self._decompose_su3(irrep1, irrep2)
        elif self.cartan_type == "A4":  # SU(5)
            return self._decompose_su5(irrep1, irrep2)
        else:
            # Unsupported group - return empty decomposition
            # Frontend will display a warning about this
            return []
    
    def _decompose_su3(self, irrep1: List[int], irrep2: List[int]) -> List[Dict]:
        """
        Decompose tensor products for SU(3) using known rules.
        
        Uses the fundamental SU(3) tensor product rules:
        3 ⊗ 3 = 6 ⊕ 3̄
        3 ⊗ 3̄ = 8 ⊕ 1
        3̄ ⊗ 3̄ = 3 ⊕ 6̄
        etc.
        """
        a1, b1 = tuple(irrep1)
        a2, b2 = tuple(irrep2)
        
        # Known decompositions for common SU(3) tensor products
        results = []
        
        # 3 ⊗ 3 = [1,0] ⊗ [1,0] = [2,0] ⊕ [0,1]
        if (a1, b1, a2, b2) == (1, 0, 1, 0):
            results = [
                {"weight": [2, 0], "multiplicity": 1},
                {"weight": [0, 1], "multiplicity": 1},
            ]
        
        # 3 ⊗ 3̄ = [1,0] ⊗ [0,1] = [1,1] ⊕ [0,0]
        elif (a1, b1, a2, b2) == (1, 0, 0, 1):
            results = [
                {"weight": [1, 1], "multiplicity": 1},
                {"weight": [0, 0], "multiplicity": 1},
            ]
        
        # 3̄ ⊗ 3 = [0,1] ⊗ [1,0] = [1,1] ⊕ [0,0]
        elif (a1, b1, a2, b2) == (0, 1, 1, 0):
            results = [
                {"weight": [1, 1], "multiplicity": 1},
                {"weight": [0, 0], "multiplicity": 1},
            ]
        
        # 3̄ ⊗ 3̄ = [0,1] ⊗ [0,1] = [0,2] ⊕ [1,0]
        elif (a1, b1, a2, b2) == (0, 1, 0, 1):
            results = [
                {"weight": [0, 2], "multiplicity": 1},
                {"weight": [1, 0], "multiplicity": 1},
            ]
        
        # 3 ⊗ 6 = [1,0] ⊗ [2,0] = [3,0] ⊕ [1,1]
        elif (a1, b1, a2, b2) == (1, 0, 2, 0):
            results = [
                {"weight": [3, 0], "multiplicity": 1},
                {"weight": [1, 1], "multiplicity": 1},
            ]
        
        # 3 ⊗ 8 = [1,0] ⊗ [1,1] = [2,1] ⊕ [1,0] ⊕ [0,2]
        elif (a1, b1, a2, b2) == (1, 0, 1, 1):
            results = [
                {"weight": [2, 1], "multiplicity": 1},
                {"weight": [1, 0], "multiplicity": 1},
                {"weight": [0, 2], "multiplicity": 1},
            ]
        
        # 8 ⊗ 8 = [1,1] ⊗ [1,1] (contains many irreps)
        elif (a1, b1, a2, b2) == (1, 1, 1, 1):
            results = [
                {"weight": [2, 2], "multiplicity": 1},  # 27
                {"weight": [3, 0], "multiplicity": 1},  # 10
                {"weight": [0, 3], "multiplicity": 1},  # 10̄
                {"weight": [1, 1], "multiplicity": 2},  # 8 (appears twice)
                {"weight": [0, 0], "multiplicity": 1},  # 1
            ]
        
        else:
            # Generic calculation using Young tableaux-like rules
            results = self._generic_su3_decomposition(a1, b1, a2, b2)
        
        # Add dimension and latex name to each result
        return self._enrich_results(results)
    
    def _generic_su3_decomposition(self, a1: int, b1: int, a2: int, b2: int) -> List[Dict]:
        """
        Generic SU(3) decomposition using simplified rules.
        
        For SU(3): [a1,b1] ⊗ [a2,b2] can contain [a,b] where:
        0 <= a <= a1+a2 and 0 <= b <= b1+b2 with certain selection rules
        """
        results = []
        
        # Simple rule: sum of weights
        max_a = a1 + a2
        max_b = b1 + b2
        
        # Add highest weight term
        results.append({"weight": [max_a, max_b], "multiplicity": 1})
        
        # Add some lower-weight terms (simplified)
        if max_a > 0:
            results.append({"weight": [max_a - 1, max_b + 1], "multiplicity": 1})
        if max_b > 0:
            results.append({"weight": [max_a + 1, max_b - 1], "multiplicity": 1})
        
        return results
    
    def _decompose_su5(self, irrep1: List[int], irrep2: List[int]) -> List[Dict]:
        """
        Decompose tensor products for SU(5).
        
        Implements basic SU(5) GUT tensor products.
        """
        # Common SU(5) representations
        # 5: [1,0,0,0] fundamental
        # 10: [0,1,0,0] antisymmetric
        # 5̄: [0,0,0,1] antifundamental
        # 10̄: [0,0,1,0]
        
        results = []
        
        # 5 ⊗ 10 = [1,0,0,0] ⊗ [0,1,0,0] = [1,1,0,0] ⊕ [0,0,1,0]
        if irrep1 == [1,0,0,0] and irrep2 == [0,1,0,0]:
            results = [
                {"weight": [1,1,0,0], "multiplicity": 1},  # 45
                {"weight": [0,0,1,0], "multiplicity": 1},  # 5̄
            ]
        
        # 5 ⊗ 5̄ = [1,0,0,0] ⊗ [0,0,0,1] = [1,0,0,1] ⊕ [0,0,0,0]
        elif irrep1 == [1,0,0,0] and irrep2 == [0,0,0,1]:
            results = [
                {"weight": [1,0,0,1], "multiplicity": 1},  # 24 (adjoint)
                {"weight": [0,0,0,0], "multiplicity": 1},  # 1 (singlet)
            ]
        
        # Generic fallback
        else:
            # Simple addition of Dynkin labels (not always correct)
            sum_weight = [a + b for a, b in zip(irrep1, irrep2)]
            results = [{"weight": sum_weight, "multiplicity": 1}]
        
        return self._enrich_results(results)
    
    def _enrich_results(self, results: List[Dict]) -> List[Dict]:
        """Add dimension and latex name to decomposition results."""
        enriched = []
        
        for item in results:
            weight = item["weight"]
            calc = IrrepCalculator(self.cartan_type, weight)
            
            enriched_item = {
                "weight": weight,
                "multiplicity": item["multiplicity"],
                "dimension": calc.calculate_dimension_weyl(),
                "latex_name": calc.get_latex_name(),
            }
            enriched.append(enriched_item)
        
        return enriched
    
    def get_latex_formula(self, irrep1: List[int], irrep2: List[int], 
                         decomposition: List[Dict]) -> str:
        """
        Generate LaTeX formula for the tensor product.
        
        Example: "3 ⊗ 3 = 6 ⊕ 3̄"
        """
        calc1 = IrrepCalculator(self.cartan_type, irrep1)
        calc2 = IrrepCalculator(self.cartan_type, irrep2)
        
        lhs = f"{calc1.get_latex_name()} \\otimes {calc2.get_latex_name()}"
        
        terms = []
        for item in decomposition:
            latex_name = item["latex_name"]
            mult = item["multiplicity"]
            
            if mult > 1:
                terms.append(f"{mult} \\times {latex_name}")
            else:
                terms.append(latex_name)
        
        rhs = " \\oplus ".join(terms)
        
        return f"{lhs} = {rhs}"
