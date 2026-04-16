"""
Performance tests for database queries.
"""
import pytest
import time
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.database import Base
from app import models


def test_database_connection_performance():
    """Test database connection performance."""
    # Create test database
    SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"
    
    engine = create_engine(
        SQLALCHEMY_DATABASE_URL,
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    
    # Test connection time
    start_time = time.time()
    db = TestingSessionLocal()
    end_time = time.time()
    
    connection_time = end_time - start_time
    assert connection_time < 0.1  # Should connect in less than 100ms
    
    # Clean up
    db.close()


def test_bulk_insert_performance():
    """Test bulk insert performance."""
    # Create test database
    SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"
    
    engine = create_engine(
        SQLALCHEMY_DATABASE_URL,
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    
    # Create tables
    Base.metadata.create_all(bind=engine)
    
    # Test bulk insert performance
    start_time = time.time()
    
    db = TestingSessionLocal()
    try:
        # Create 100 parts
        parts = []
        for i in range(100):
            part = models.Part(
                name=f"Test Part {i}",
                description=f"Description for part {i}"
            )
            parts.append(part)
        
        db.add_all(parts)
        db.commit()
        
        end_time = time.time()
        operation_time = end_time - start_time
        
        # Should complete in less than 1 second
        assert operation_time < 1.0
    finally:
        db.close()


def test_query_performance():
    """Test query performance."""
    # Create test database
    SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"
    
    engine = create_engine(
        SQLALCHEMY_DATABASE_URL,
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    
    # Create tables
    Base.metadata.create_all(bind=engine)
    
    # Add some test data
    db = TestingSessionLocal()
    try:
        # Create 50 parts
        parts = []
        for i in range(50):
            part = models.Part(
                name=f"Test Part {i}",
                description=f"Description for part {i}"
            )
            parts.append(part)
        
        db.add_all(parts)
        db.commit()
        
        # Test query performance
        start_time = time.time()
        results = db.query(models.Part).all()
        end_time = time.time()
        
        operation_time = end_time - start_time
        # Should complete in less than 100ms
        assert operation_time < 0.1
        assert len(results) == 50
    finally:
        db.close()


def test_search_performance():
    """Test search query performance."""
    # Create test database
    SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"
    
    engine = create_engine(
        SQLALCHEMY_DATABASE_URL,
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    
    # Create tables
    Base.metadata.create_all(bind=engine)
    
    # Add some test data
    db = TestingSessionLocal()
    try:
        # Create 100 parts with various data
        parts = []
        for i in range(100):
            part = models.Part(
                name=f"Test Part {i}",
                description=f"Description for part {i}",
                part_number=f"TP-{i:03d}",
                manufacturer=f"Manufacturer {i % 10}"
            )
            parts.append(part)
        
        db.add_all(parts)
        db.commit()
        
        # Test search performance
        start_time = time.time()
        # Search for parts with "Test" in name
        results = db.query(models.Part).filter(
            models.Part.name.like("%Test%")
        ).all()
        end_time = time.time()
        
        operation_time = end_time - start_time
        # Should complete in less than 100ms
        assert operation_time < 0.1
        assert len(results) == 100
    finally:
        db.close()