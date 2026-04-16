"""
Unit tests for validation functions.
"""
import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.utils.validation import (
    sanitize_string, 
    validate_url, 
    validate_tags,
    validate_unique_part_number,
    validate_category_delete,
    validate_bin_delete,
    validate_part_references
)
from app import models


def test_sanitize_string():
    """Test string sanitization function."""
    # Test basic sanitization
    assert sanitize_string("hello world") == "hello world"
    assert sanitize_string("  hello   world  ") == "hello world"
    assert sanitize_string("hello\tworld") == "hello world"
    assert sanitize_string("hello\nworld") == "hello world"
    assert sanitize_string("hello\r\nworld") == "hello world"
    
    # Test with None
    assert sanitize_string(None) is None
    
    # Test with empty string
    assert sanitize_string("") == ""


def test_validate_url():
    """Test URL validation function."""
    # Test valid URLs
    assert validate_url("http://example.com") == "http://example.com"
    assert validate_url("https://example.com") == "https://example.com"
    assert validate_url("https://sub.example.com/path?query=1") == "https://sub.example.com/path?query=1"
    
    # Test None
    assert validate_url(None) is None
    
    # Test empty string
    assert validate_url("") == ""


def test_validate_tags():
    """Test tags validation function."""
    # Test valid tags
    assert validate_tags("tag1, tag2, tag3") == "tag1, tag2, tag3"
    assert validate_tags("tag1,tag2") == "tag1, tag2"
    assert validate_tags("  tag1  ,  tag2  ") == "tag1, tag2"
    
    # Test with None
    assert validate_tags(None) is None
    
    # Test with empty string
    assert validate_tags("") == ""
    
    # Test with single tag
    assert validate_tags("tag1") == "tag1"


def test_validate_tags_invalid():
    """Test invalid tags."""
    # Test invalid characters in tags
    with pytest.raises(ValueError):
        validate_tags("tag1, tag@invalid")
    
    with pytest.raises(ValueError):
        validate_tags("tag1, tag#invalid")