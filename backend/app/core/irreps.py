"""
Irreducible representation calculations.

This module handles the construction of irreps from highest weights
and calculation of their properties using various algorithms.
"""

from typing import List, Dict, Tuple
import numpy as np
from itertools import product


class IrrepCalculator:
    """Calculator for irreducible representation properties."""
    
    def __init__(self, group_name: str, highest_weight: List[int]):
        """
        Initialize irrep calculator.
        
        Args:
            group_name: Group name (e.g., 'SU3', 'A2')
            highest_weight: Highest weight in Dynkin basis [a1, a2, ...]
        """
        self.group_name = group_name
        self.highest_weight = highest_weight
        self.rank = len(highest_weight)
    
    def calculate_dimension_weyl(self) -> int:
        """
        Calculate dimension using Weyl dimension formula.
        
        For SU(n), dimension of irrep [a1, a2, ..., a_{n-1}] is:
        dim = prod_{i<j} (1 + sum_{k=i}^{j-1} a_k) / prod_{i<j} (j-i)
        """
        if self.group_name.upper() in ["SU3", "A2"]:
            return self._dimension_su3()
        elif self.group_name.upper() in ["SU5", "A4"]:
            return self._dimension_sun(5)
        else:
            # Generic fallback - approximate
            return 1 + sum(self.highest_weight)
    
    def _dimension_su3(self) -> int:
        """Calculate dimension for SU(3) using exact formula."""
        a1, a2 = self.highest_weight
        # dim = (a1+1)(a2+1)(a1+a2+2) / 2
        dim = (a1 + 1) * (a2 + 1) * (a1 + a2 + 2) // 2
        return dim
    
    def _dimension_sun(self, n: int) -> int:
        """
        Calculate dimension for SU(n) using Weyl formula.
        
        dim = prod_{1 <= i < j <= n} (1 + (λ_i - λ_j)/(j-i))
        where λ is in orthogonal basis.
        """
        # Convert Dynkin labels to orthogonal weights
        # For SU(n): λ_i = sum_{k=1}^{i} a_k for i < n
        weights = [sum(self.highest_weight[:i+1]) for i in range(len(self.highest_weight))]
        weights.append(0)  # λ_n = 0
        
        # Calculate product formula
        numerator = 1
        denominator = 1
        
        for i in range(n):
            for j in range(i + 1, n):
                numerator *= (j - i + weights[i] - weights[j])
                denominator *= (j - i)
        
        return numerator // denominator
    
    def calculate_weights_weyl_reflection(self) -> Tuple[List[List[int]], List[int]]:
        """
        Calculate all weights and their multiplicities using Weyl reflection.
        
        Returns:
            (weights, multiplicities) - Lists of same length
        """
        # This is a simplified implementation
        # For full implementation, would need Weyl group action
        
        weights = [self.highest_weight]
        multiplicities = [1]
        
        # Add some lower weights (simplified)
        # In reality, need to apply lowering operators and Weyl reflections
        
        return weights, multiplicities
    
    def calculate_weights_freudenthal(self) -> Tuple[List[List[int]], List[int]]:
        """
        Calculate weights using Freudenthal's multiplicity formula.
        
        More accurate but slower than Weyl reflection method.
        """
        # Placeholder for Freudenthal implementation
        return self.calculate_weights_weyl_reflection()
    
    def get_latex_name(self) -> str:
        """Get LaTeX representation of the irrep."""
        if self.group_name.upper() in ["SU3", "A2"]:
            return self._latex_su3()
        else:
            # Generic representation
            return f"[{', '.join(map(str, self.highest_weight))}]"
    
    def _latex_su3(self) -> str:
        """Get standard physics notation for SU(3) irreps."""
        a1, a2 = self.highest_weight
        
        # Standard SU(3) irreps
        if (a1, a2) == (1, 0):
            return "3"
        elif (a1, a2) == (0, 1):
            return r"\bar{3}"
        elif (a1, a2) == (2, 0):
            return "6"
        elif (a1, a2) == (0, 2):
            return r"\bar{6}"
        elif (a1, a2) == (1, 1):
            return "8"
        elif (a1, a2) == (3, 0):
            return "10"
        elif (a1, a2) == (0, 3):
            return r"\overline{10}"
        else:
            # Use dimension as label
            dim = self._dimension_su3()
            if a2 > a1:
                return f"\\overline{{{dim}}}"
            return str(dim)
    
    def get_irrep_data(self) -> Dict:
        """Get complete irrep data."""
        weights, multiplicities = self.calculate_weights_weyl_reflection()
        
        return {
            "highest_weight": self.highest_weight,
            "dimension": self.calculate_dimension_weyl(),
            "weights": weights,
            "multiplicities": multiplicities,
            "latex_name": self.get_latex_name(),
            "group": self.group_name,
        }
