import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.main import app
from app.database import Base
from app.models import Part, Category, Bin, Document, Setting, PartSpecification

# Create test database
SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base.metadata.create_all(bind=engine)

def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

# Override the database dependency
from app.database import get_db
app.dependency_overrides[get_db] = override_get_db

client = TestClient(app)

def test_read_root():
    response = client.get("/")
    assert response.status_code == 200
    assert "message" in response.json()

def test_create_and_get_category():
    # Test creating a category
    category_data = {
        "name": "Test Category",
        "description": "A test category"
    }
    response = client.post("/api/v1/categories", json=category_data)
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Test Category"
    category_id = data["id"]
    
    # Test getting the created category
    response = client.get(f"/api/v1/categories/{category_id}")
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Test Category"

def test_create_and_get_bin():
    # Test creating a bin
    bin_data = {
        "name": "Test Bin",
        "location": "Test Location",
        "description": "A test bin"
    }
    response = client.post("/api/v1/bins", json=bin_data)
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Test Bin"
    bin_id = data["id"]
    
    # Test getting the created bin
    response = client.get(f"/api/v1/bins/{bin_id}")
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Test Bin"

def test_create_and_get_part():
    # First create a category and bin to associate with the part
    category_data = {
        "name": "Part Test Category",
        "description": "A test category for parts"
    }
    response = client.post("/api/v1/categories", json=category_data)
    assert response.status_code == 200
    category_id = response.json()["id"]
    
    bin_data = {
        "name": "Part Test Bin",
        "location": "Test Location",
        "description": "A test bin for parts"
    }
    response = client.post("/api/v1/bins", json=bin_data)
    assert response.status_code == 200
    bin_id = response.json()["id"]
    
    # Test creating a part
    part_data = {
        "name": "Test Part",
        "part_number": "TP-001",
        "manufacturer": "Test Manufacturer",
        "category_id": category_id,
        "bin_id": bin_id,
        "quantity": 10,
        "description": "A test part"
    }
    response = client.post("/api/v1/parts", json=part_data)
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Test Part"
    part_id = data["id"]
    
    # Test getting the created part
    response = client.get(f"/api/v1/parts/{part_id}")
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Test Part"

def test_create_and_get_part_specification():
    # First create a category and bin to associate with the part
    category_data = {
        "name": "Spec Test Category",
        "description": "A test category for specs"
    }
    response = client.post("/api/v1/categories", json=category_data)
    assert response.status_code == 200
    category_id = response.json()["id"]
    
    bin_data = {
        "name": "Spec Test Bin",
        "location": "Test Location",
        "description": "A test bin for specs"
    }
    response = client.post("/api/v1/bins", json=bin_data)
    assert response.status_code == 200
    bin_id = response.json()["id"]
    
    # Create a part to associate with the specification
    part_data = {
        "name": "Test Part for Spec",
        "part_number": "TPS-001",
        "manufacturer": "Test Manufacturer",
        "category_id": category_id,
        "bin_id": bin_id,
        "quantity": 5,
        "description": "A test part for specifications"
    }
    response = client.post("/api/v1/parts", json=part_data)
    assert response.status_code == 200
    part_id = response.json()["id"]
    
    # Test creating a part specification
    spec_data = {
        "name": "Test Specification",
        "value": "Test Value"
    }
    response = client.post(f"/api/v1/parts/{part_id}/specifications", json=spec_data)
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Test Specification"
    spec_id = data["id"]
    
    # Test getting the created specification
    response = client.get(f"/api/v1/parts/{part_id}/specifications/{spec_id}")
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Test Specification"
    
    # Test getting all specifications for the part
    response = client.get(f"/api/v1/parts/{part_id}/specifications")
    assert response.status_code == 200
    specs = response.json()
    assert len(specs) >= 1
    assert specs[0]["name"] == "Test Specification"
    
    # Test updating the specification
    update_data = {
        "name": "Updated Specification",
        "value": "Updated Value"
    }
    response = client.put(f"/api/v1/parts/{part_id}/specifications/{spec_id}", json=update_data)
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Updated Specification"
    
    # Test deleting the specification
    response = client.delete(f"/api/v1/parts/{part_id}/specifications/{spec_id}")
    assert response.status_code == 200

def test_search_functionality():
    # Create test data for search
    category_data = {
        "name": "Search Test Category",
        "description": "A test category for search"
    }
    response = client.post("/api/v1/categories", json=category_data)
    assert response.status_code == 200
    category_id = response.json()["id"]
    
    bin_data = {
        "name": "Search Test Bin",
        "location": "Test Location",
        "description": "A test bin for search"
    }
    response = client.post("/api/v1/bins", json=bin_data)
    assert response.status_code == 200
    bin_id = response.json()["id"]
    
    # Create multiple parts for search testing
    part_data_1 = {
        "name": "Resistor 1K Ohm",
        "part_number": "R-1K-001",
        "manufacturer": "Test Electronics",
        "category_id": category_id,
        "bin_id": bin_id,
        "quantity": 100,
        "description": "1K Ohm resistor"
    }
    response = client.post("/api/v1/parts", json=part_data_1)
    assert response.status_code == 200
    
    part_data_2 = {
        "name": "Capacitor 100uF",
        "part_number": "C-100U-001",
        "manufacturer": "Test Electronics",
        "category_id": category_id,
        "bin_id": bin_id,
        "quantity": 50,
        "description": "100 microfarad capacitor"
    }
    response = client.post("/api/v1/parts", json=part_data_2)
    assert response.status_code == 200
    
    # Test search functionality
    response = client.get("/api/v1/search?query=Resistor")
    assert response.status_code == 200
    results = response.json()
    assert len(results) >= 1
    assert results[0]["name"] == "Resistor 1K Ohm"
    
    # Test search with category filter
    response = client.get(f"/api/v1/search?query=Capacitor&category_id={category_id}")
    assert response.status_code == 200
    results = response.json()
    assert len(results) >= 1
    assert results[0]["name"] == "Capacitor 100uF"
    
    # Test search with bin filter
    response = client.get(f"/api/v1/search?query=Test&bin_id={bin_id}")
    assert response.status_code == 200
    results = response.json()
    assert len(results) >= 1

def test_import_export_functionality():
    # Test export functionality
    response = client.get("/api/v1/export/parts?format=json")
    assert response.status_code == 200
    data = response.json()
    assert "parts" in data
    
    # Test export in CSV format
    response = client.get("/api/v1/export/parts?format=csv")
    assert response.status_code == 200
    data = response.json()
    assert "csv_content" in data

def test_enhanced_parts_endpoint():
    # Test enhanced parts endpoint with pagination
    response = client.get("/api/v1/parts?page=1&limit=10")
    assert response.status_code == 200
    parts = response.json()
    assert isinstance(parts, list)
    
    # Test enhanced parts endpoint with sorting
    response = client.get("/api/v1/parts?sort_by=name&sort_order=asc")
    assert response.status_code == 200
    parts = response.json()
    assert isinstance(parts, list)

def test_api_health_check():
    # Test that the API is accessible
    response = client.get("/docs")
    assert response.status_code == 200

if __name__ == "__main__":
    pytest.main()