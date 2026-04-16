"""
Validation utilities for business rules and data sanitization.
"""
import re
from typing import Optional
from fastapi import HTTPException
from sqlalchemy.orm import Session
from .common import get_entity_by_id_or_raise
from .. import models


def validate_part_references(db: Session, part_id: int, field_name: str, value: Optional[int] = None):
    """
    Validate that a part's reference to category or bin exists.
    Raises HTTPException if the reference is invalid.
    """
    if value is not None:
        if field_name == 'category_id':
            try:
                get_entity_by_id_or_raise(db, models.Category, value, Exception)
            except Exception:
                raise HTTPException(
                    status_code=400,
                    detail=f"Category with ID {value} does not exist"
                )
        elif field_name == 'bin_id':
            try:
                get_entity_by_id_or_raise(db, models.Bin, value, Exception)
            except Exception:
                raise HTTPException(
                    status_code=400,
                    detail=f"Bin with ID {value} does not exist"
                )


def validate_unique_part_number(db: Session, part_number: str, exclude_part_id: Optional[int] = None):
    """
    Validate that a part number is unique (case-insensitive).
    Raises HTTPException if duplicate found.
    """
    query = db.query(models.Part).filter(
        models.Part.part_number.ilike(part_number)
    )
    if exclude_part_id:
        query = query.filter(models.Part.id != exclude_part_id)
    
    existing = query.first()
    if existing:
        raise HTTPException(
            status_code=400,
            detail=f"Part number '{part_number}' already exists"
        )


def validate_category_delete(db: Session, category_id: int):
    """
    Validate that a category can be deleted.
    Raises HTTPException if there are parts referencing this category.
    """
    parts_count = db.query(models.Part).filter(
        models.Part.category_id == category_id
    ).count()
    
    if parts_count > 0:
        raise HTTPException(
            status_code=400,
            detail=f"Cannot delete category: {parts_count} part(s) are assigned to this category. "
                   f"Reassign or delete these parts first."
        )


def validate_bin_delete(db: Session, bin_id: int):
    """
    Validate that a bin can be deleted.
    Raises HTTPException if there are parts referencing this bin.
    """
    parts_count = db.query(models.Part).filter(
        models.Part.bin_id == bin_id
    ).count()
    
    if parts_count > 0:
        raise HTTPException(
            status_code=400,
            detail=f"Cannot delete bin: {parts_count} part(s) are stored in this bin. "
                   f"Reassign or delete these parts first."
        )


def sanitize_string(value: str) -> str:
    """
    Sanitize string input by removing potentially harmful characters.
    """
    if not value:
        return value
    
    # Remove control characters except newlines and tabs
    sanitized = ''.join(char for char in value if char.isprintable() or char in '\n\t')
    
    # Trim excessive whitespace
    sanitized = ' '.join(sanitized.split())
    
    return sanitized


def validate_url(url: str) -> str:
    """
    Validate URL format.
    """
    if url and not re.match(r'^https?://[^\s]+$', url):
        raise ValueError("URL must start with http:// or https:// and contain no spaces")
    return url


def validate_tags(tags: str) -> str:
    """
    Validate and sanitize tags string.
    """
    if not tags:
        return tags
    
    # Split by comma, strip each tag, remove empty tags
    tag_list = [tag.strip() for tag in tags.split(',') if tag.strip()]
    
    # Validate each tag (alphanumeric, hyphens, underscores, spaces)
    for tag in tag_list:
        if not re.match(r'^[a-zA-Z0-9\s\-_]+$', tag):
            raise ValueError(f"Invalid tag: '{tag}'. Tags can only contain letters, numbers, spaces, hyphens, and underscores")
    
    return ', '.join(tag_list)
