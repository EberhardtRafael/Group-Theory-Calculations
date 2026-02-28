"""
pytest configuration for backend tests
"""

import sys
from pathlib import Path

# Add app directory to path
sys.path.insert(0, str(Path(__file__).parent / "app"))

# Configure pytest
def pytest_configure(config):
    """Configure pytest with custom markers"""
    config.addinivalue_line(
        "markers", "unit: Unit tests for individual functions/classes"
    )
    config.addinivalue_line(
        "markers", "integration: Integration tests for API endpoints"
    )
    config.addinivalue_line(
        "markers", "slow: Slow tests that involve heavy computation"
    )
    config.addinivalue_line(
        "markers", "algebra: Tests for specific Lie algebras"
    )
