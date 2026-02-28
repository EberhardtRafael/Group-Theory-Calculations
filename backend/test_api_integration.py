"""
API Test Script - Test the implemented endpoints

Run this script to verify all the core API functionality works correctly.
Usage: python test_api_integration.py
"""

import sys
import requests
from typing import Dict, Any


BASE_URL = "http://localhost:8000/api/v1"


def print_test(name: str, result: bool):
    """Print test result"""
    status = "✓ PASS" if result else "✗ FAIL"
    print(f"  {status}: {name}")
    return result


def test_groups():
    """Test Groups API endpoints"""
    print("\n=== Testing Groups API ===")
    all_passed = True
    
    # Test 1: Create SU(3) group
    try:
        response = requests.post(f"{BASE_URL}/groups/create", json={"name": "SU3"})
        data = response.json()
        all_passed &= print_test(
            "Create SU(3) group",
            response.status_code == 201 and data["cartan_name"] == "A2"
        )
        print(f"    → Rank: {data['rank']}, Dimension: {data['dimension']}")
    except Exception as e:
        print_test("Create SU(3) group", False)
        print(f"    Error: {e}")
        all_passed = False
    
    # Test 2: Get group by name
    try:
        response = requests.get(f"{BASE_URL}/groups/SU3")
        data = response.json()
        all_passed &= print_test(
            "Get SU(3) group",
            response.status_code == 200 and data["rank"] == 2
        )
    except Exception as e:
        print_test("Get SU(3) group", False)
        print(f"    Error: {e}")
        all_passed = False
    
    # Test 3: List all groups
    try:
        response = requests.get(f"{BASE_URL}/groups/")
        data = response.json()
        all_passed &= print_test(
            "List all groups",
            response.status_code == 200 and len(data) >= 6
        )
        print(f"    → Found {len(data)} groups")
    except Exception as e:
        print_test("List all groups", False)
        print(f"    Error: {e}")
        all_passed = False
    
    # Test 4: Get Dynkin diagram
    try:
        response = requests.get(f"{BASE_URL}/groups/E6/dynkin-diagram")
        data = response.json()
        all_passed &= print_test(
            "Get E6 Dynkin diagram",
            response.status_code == 200 and len(data["vertices"]) == 6
        )
    except Exception as e:
        print_test("Get E6 Dynkin diagram", False)
        print(f"    Error: {e}")
        all_passed = False
    
    # Test 5: Get root system
    try:
        response = requests.get(f"{BASE_URL}/groups/A2/root-system")
        data = response.json()
        all_passed &= print_test(
            "Get A2 root system",
            response.status_code == 200 and len(data["simple_roots"]) == 2
        )
    except Exception as e:
        print_test("Get A2 root system", False)
        print(f"    Error: {e}")
        all_passed = False
    
    return all_passed


def test_irreps():
    """Test Irreps API endpoints"""
    print("\n=== Testing Irreps API ===")
    all_passed = True
    
    # Test 1: Create SU(3) fundamental irrep
    try:
        response = requests.post(
            f"{BASE_URL}/irreps/",
            json={
                "group_id": "SU3",
                "highest_weight": [1, 0],
                "method": "weyl_reflection"
            }
        )
        data = response.json()
        all_passed &= print_test(
            "Create SU(3) fundamental (3)",
            response.status_code == 201 and data["dimension"] == 3
        )
        print(f"    → LaTeX: {data['latex_name']}, Dimension: {data['dimension']}")
    except Exception as e:
        print_test("Create SU(3) fundamental", False)
        print(f"    Error: {e}")
        all_passed = False
    
    # Test 2: Create SU(3) adjoint irrep
    try:
        response = requests.post(
            f"{BASE_URL}/irreps/",
            json={
                "group_id": "SU3",
                "highest_weight": [1, 1]
            }
        )
        data = response.json()
        all_passed &= print_test(
            "Create SU(3) adjoint (8)",
            response.status_code == 201 and data["dimension"] == 8
        )
        print(f"    → LaTeX: {data['latex_name']}, Dimension: {data['dimension']}")
    except Exception as e:
        print_test("Create SU(3) adjoint", False)
        print(f"    Error: {e}")
        all_passed = False
    
    # Test 3: Get irrep by ID
    try:
        response = requests.get(f"{BASE_URL}/irreps/su3-1_0")
        data = response.json()
        all_passed &= print_test(
            "Get irrep by ID",
            response.status_code == 200 and data["dimension"] == 3
        )
    except Exception as e:
        print_test("Get irrep by ID", False)
        print(f"    Error: {e}")
        all_passed = False
    
    return all_passed


def test_tensor_products():
    """Test Tensor Product API"""
    print("\n=== Testing Tensor Product API ===")
    all_passed = True
    
    # Test 1: SU(3) 3 ⊗ 3
    try:
        response = requests.post(
            f"{BASE_URL}/irreps/tensor-product",
            json={
                "group": "SU3",
                "irrep1": [1, 0],
                "irrep2": [1, 0]
            }
        )
        data = response.json()
        all_passed &= print_test(
            "SU(3): 3 ⊗ 3",
            response.status_code == 200 and len(data["decomposition"]) >= 2
        )
        print(f"    → LaTeX: {data['latex']}")
        for term in data["decomposition"]:
            print(f"      {term['latex_name']} (dim={term['dimension']})")
    except Exception as e:
        print_test("SU(3): 3 ⊗ 3", False)
        print(f"    Error: {e}")
        all_passed = False
    
    # Test 2: SU(3) 3 ⊗ 3̄
    try:
        response = requests.post(
            f"{BASE_URL}/irreps/tensor-product",
            json={
                "group": "SU3",
                "irrep1": [1, 0],
                "irrep2": [0, 1]
            }
        )
        data = response.json()
        all_passed &= print_test(
            "SU(3): 3 ⊗ 3̄",
            response.status_code == 200 and len(data["decomposition"]) == 2
        )
        print(f"    → LaTeX: {data['latex']}")
    except Exception as e:
        print_test("SU(3): 3 ⊗ 3̄", False)
        print(f"    Error: {e}")
        all_passed = False
    
    # Test 3: SU(3) 8 ⊗ 8
    try:
        response = requests.post(
            f"{BASE_URL}/irreps/tensor-product",
            json={
                "group": "SU3",
                "irrep1": [1, 1],
                "irrep2": [1, 1]
            }
        )
        data = response.json()
        all_passed &= print_test(
            "SU(3): 8 ⊗ 8",
            response.status_code == 200 and len(data["decomposition"]) >= 4
        )
        print(f"    → LaTeX: {data['latex']}")
    except Exception as e:
        print_test("SU(3): 8 ⊗ 8", False)
        print(f"    Error: {e}")
        all_passed = False
    
    return all_passed


def main():
    """Run all tests"""
    print("=" * 60)
    print("Group Theory Calculator - API Integration Tests")
    print("=" * 60)
    
    # Check if server is running
    try:
        response = requests.get(f"{BASE_URL.replace('/api/v1', '')}/docs")
        if response.status_code != 200:
            print("\n❌ Backend server is not running!")
            print("   Start it with: cd backend && uvicorn app.main:app --reload")
            sys.exit(1)
    except requests.exceptions.ConnectionError:
        print("\n❌ Cannot connect to backend server at http://localhost:8000")
        print("   Start it with: cd backend && uvicorn app.main:app --reload")
        sys.exit(1)
    
    print("\n✓ Backend server is running\n")
    
    # Run test suites
    groups_passed = test_groups()
    irreps_passed = test_irreps()
    tensor_passed = test_tensor_products()
    
    # Summary
    print("\n" + "=" * 60)
    print("Test Summary")
    print("=" * 60)
    print(f"Groups API:         {'✓ PASS' if groups_passed else '✗ FAIL'}")
    print(f"Irreps API:         {'✓ PASS' if irreps_passed else '✗ FAIL'}")
    print(f"Tensor Products:    {'✓ PASS' if tensor_passed else '✗ FAIL'}")
    
    all_passed = groups_passed and irreps_passed and tensor_passed
    print("\n" + "=" * 60)
    if all_passed:
        print("✓ All tests passed!")
    else:
        print("✗ Some tests failed")
    print("=" * 60)
    
    sys.exit(0 if all_passed else 1)


if __name__ == "__main__":
    main()
