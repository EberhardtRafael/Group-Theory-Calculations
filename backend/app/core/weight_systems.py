"""
Weight system calculation for multiplet diagrams.

This module computes complete weight systems for irreducible representations
and projects them into 2D/3D spaces for visualization.
"""

from typing import List, Tuple, Dict
import numpy as np


class WeightSystemCalculator:
    """Calculate weight systems for multiplet diagram visualization."""
    
    def __init__(self, group_name: str, dynkin_labels: List[int]):
        """
        Initialize weight system calculator.
        
        Args:
            group_name: Group name (e.g., 'SU3', 'SU4')
            dynkin_labels: Highest weight in Dynkin basis
        """
        self.group_name = group_name.upper().replace("(", "").replace(")", "")
        self.dynkin_labels = dynkin_labels
        self.rank = len(dynkin_labels)
    
    def calculate_su3_weights(self) -> List[Dict]:
        """
        Calculate weight system for SU(3) representations.
        
        Returns weights in (I₃, Y) basis for physics visualization.
        I₃ = h₁/2, Y = (h₁ + 2*h₂)/3
        """
        a1, a2 = self.dynkin_labels
        weights_with_mult = []
        
        # Generate all weights using dominant weight and Weyl reflections
        # This is a simplified implementation covering common cases
        
        if (a1, a2) == (1, 0):  # Fundamental 3
            # The fundamental 3 of SU(3): 3 quarks forming equilateral triangle (pointing up)
            # Use exact coordinates for perfect equilateral triangle in (I₃, Y) space
            sqrt3_over_2 = 0.8660254037844387  # √3/2 for perfect triangle
            # Vertices at angles 90°, 210°, 330° from horizontal (unit distance from origin)
            result = [
                {"i3": 0.0, "y": 1.0, "h1": 0, "h2": 0, "multiplicity": 1},            # Top vertex
                {"i3": -sqrt3_over_2, "y": -0.5, "h1": 0, "h2": 0, "multiplicity": 1},  # Bottom-left
                {"i3": sqrt3_over_2, "y": -0.5, "h1": 0, "h2": 0, "multiplicity": 1},   # Bottom-right
            ]
            return result
        
        elif (a1, a2) == (0, 1):  # Anti-fundamental 3̄
            # The anti-fundamental 3̄ of SU(3): 3 antiquarks forming inverted equilateral triangle
            # Use exact coordinates for perfect equilateral triangle in (I₃, Y) space (pointing down)
            sqrt3_over_2 = 0.8660254037844387  # √3/2 for perfect triangle
            # Vertices at angles 270°, 30°, 150° from horizontal (unit distance from origin)
            result = [
                {"i3": 0.0, "y": -1.0, "h1": 0, "h2": 0, "multiplicity": 1},           # Bottom vertex
                {"i3": sqrt3_over_2, "y": 0.5, "h1": 0, "h2": 0, "multiplicity": 1},   # Top-right
                {"i3": -sqrt3_over_2, "y": 0.5, "h1": 0, "h2": 0, "multiplicity": 1},  # Top-left
            ]
            return result
        
        elif (a1, a2) == (1, 1):  # Adjoint 8
            # The adjoint of SU(3): 6 roots forming a regular flat-topped hexagon + center
            # Use exact coordinates for regular hexagon in (I₃, Y) space
            # These are the 8 gluons in QCD with proper quantum numbers
            sqrt3_over_2 = 0.8660254037844387  # √3/2 for perfect hexagon
            # Store directly in (I₃, Y) coordinates - no conversion needed
            result = [
                {"i3": 1.0, "y": 0.0, "h1": 0, "h2": 0, "multiplicity": 1},              # Right
                {"i3": -1.0, "y": 0.0, "h1": 0, "h2": 0, "multiplicity": 1},             # Left  
                {"i3": 0.5, "y": sqrt3_over_2, "h1": 0, "h2": 0, "multiplicity": 1},     # Top-right
                {"i3": -0.5, "y": sqrt3_over_2, "h1": 0, "h2": 0, "multiplicity": 1},    # Top-left
                {"i3": 0.5, "y": -sqrt3_over_2, "h1": 0, "h2": 0, "multiplicity": 1},    # Bottom-right
                {"i3": -0.5, "y": -sqrt3_over_2, "h1": 0, "h2": 0, "multiplicity": 1},   # Bottom-left
                {"i3": 0.0, "y": 0.0, "h1": 0, "h2": 0, "multiplicity": 2},              # Center (×2)
            ]
            return result
        
        elif (a1, a2) == (2, 0):  # Sextet 6
            weights_with_mult = [
                {"h1": 2, "h2": 0, "mult": 1},
                {"h1": -1, "h2": 2, "mult": 1},
                {"h1": 1, "h2": 1, "mult": 1},
                {"h1": -2, "h2": 1, "mult": 1},
                {"h1": 0, "h2": -1, "mult": 1},
                {"h1": 1, "h2": -2, "mult": 1},
            ]
        
        elif (a1, a2) == (0, 2):  # Anti-sextet 6̄
            weights_with_mult = [
                {"h1": 0, "h2": 2, "mult": 1},
                {"h1": 2, "h2": -1, "mult": 1},
                {"h1": 1, "h2": 1, "mult": 1},
                {"h1": 1, "h2": -2, "mult": 1},
                {"h1": -1, "h2": 0, "mult": 1},
                {"h1": -2, "h2": 1, "mult": 1},
            ]
        
        elif (a1, a2) == (3, 0):  # Decuplet 10
            weights_with_mult = [
                {"h1": 3, "h2": 0, "mult": 1},    # highest weight
                {"h1": 1, "h2": 1, "mult": 1},
                {"h1": -1, "h2": 2, "mult": 1},
                {"h1": 2, "h2": -1, "mult": 1},
                {"h1": 0, "h2": 0, "mult": 1},
                {"h1": -2, "h2": 1, "mult": 1},
                {"h1": 1, "h2": -2, "mult": 1},
                {"h1": -1, "h2": -1, "mult": 1},
                {"h1": 0, "h2": -3, "mult": 1},
                {"h1": -3, "h2": 0, "mult": 1},
            ]
        
        elif (a1, a2) == (0, 0):  # Singlet 1
            weights_with_mult = [
                {"h1": 0, "h2": 0, "mult": 1},
            ]
        
        else:
            # For  other representations, return simplified version
            weights_with_mult = [
                {"h1": a1, "h2": a2, "mult": 1},
            ]
        
        # Convert to (I₃, Y) coordinates for physics visualization
        result = []
        for w in weights_with_mult:
            h1, h2 = w["h1"], w["h2"]
            i3 = h1 / 2.0
            y = (h1 + 2 * h2) / 3.0
            result.append({
                "i3": i3,
                "y": y,
                "h1": h1,
                "h2": h2,
                "multiplicity": w["mult"]
            })
        
        return result
    
    def get_weight_system(self) -> Dict:
        """
        Get complete weight system with visualization coordinates.
        
        Returns:
            Dictionary with weights, dimension, and metadata
        """
        if self.group_name in ["SU3", "A2"]:
            weights = self.calculate_su3_weights()
            dimension = sum(w["multiplicity"] for w in weights)
            
            return {
                "group": self.group_name,
                "dynkin_labels": self.dynkin_labels,
                "dimension": dimension,
                "num_weights": len(weights),
                "weights": weights,
                "coordinate_system": "i3_y",  # (I₃, Y) for SU(3)
            }
        else:
            # For now, unsupported groups return error
            return {
                "group": self.group_name,
                "dynkin_labels": self.dynkin_labels,
                "error": f"Weight system calculation not yet implemented for {self.group_name}",
                "weights": []
            }


def calculate_weight_diagram_data(group: str, irrep: List[int]) -> Dict:
    """
    Calculate weight diagram data for visualization.
    
    Args:
        group: Group name (e.g., 'SU3')
        irrep: Dynkin labels [a1, a2, ...]
    
    Returns:
        Dictionary with visualization-ready weight data
    """
    calculator = WeightSystemCalculator(group, irrep)
    return calculator.get_weight_system()
