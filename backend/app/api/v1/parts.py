from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from ... import models, schemas
from ...database import get_db
from ...exceptions import PartNotFoundException
from ...utils.common import get_entity_by_id_or_raise
from ...utils.validation import (
    validate_part_references,
    validate_unique_part_number,
    sanitize_string
)

router = APIRouter()

@router.get("/parts", response_model=List[schemas.Part])
def get_parts(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    try:
        parts = db.query(models.Part).offset(skip).limit(limit).all()
        return parts
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving parts: {str(e)}")

@router.get("/parts/{part_id}", response_model=schemas.Part)
def get_part(part_id: int, db: Session = Depends(get_db)):
    try:
        part = get_entity_by_id_or_raise(
            db, models.Part, part_id, PartNotFoundException
        )
        return part
    except PartNotFoundException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving part: {str(e)}")

@router.post("/parts", response_model=schemas.Part)
def create_part(part: schemas.PartCreate, db: Session = Depends(get_db)):
    try:
        # Validate part number uniqueness
        if part.part_number:
            validate_unique_part_number(db, part.part_number)
        
        # Validate category and bin references
        validate_part_references(db, None, 'category_id', part.category_id)
        validate_part_references(db, None, 'bin_id', part.bin_id)
        
        # Sanitize text fields
        part_data = part.dict()
        if part_data.get('name'):
            part_data['name'] = sanitize_string(part_data['name'])
        if part_data.get('description'):
            part_data['description'] = sanitize_string(part_data['description'])
        if part_data.get('notes'):
            part_data['notes'] = sanitize_string(part_data['notes'])
        
        db_part = models.Part(**part_data)
        db.add(db_part)
        db.commit()
        db.refresh(db_part)
        return db_part
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error creating part: {str(e)}")

@router.put("/parts/{part_id}", response_model=schemas.Part)
def update_part(part_id: int, part: schemas.PartUpdate, db: Session = Depends(get_db)):
    try:
        db_part = get_entity_by_id_or_raise(
            db, models.Part, part_id, PartNotFoundException
        )
        
        part_data = part.dict(exclude_unset=True)
        
        # Validate part number uniqueness if being updated
        if 'part_number' in part_data and part_data['part_number']:
            validate_unique_part_number(db, part_data['part_number'], exclude_part_id=part_id)
        
        # Validate category and bin references if being updated
        if 'category_id' in part_data:
            validate_part_references(db, part_id, 'category_id', part_data.get('category_id'))
        if 'bin_id' in part_data:
            validate_part_references(db, part_id, 'bin_id', part_data.get('bin_id'))
        
        # Sanitize text fields
        for field in ['name', 'description', 'notes']:
            if field in part_data and part_data[field]:
                part_data[field] = sanitize_string(part_data[field])
        
        for key, value in part_data.items():
            setattr(db_part, key, value)
        
        db.commit()
        db.refresh(db_part)
        return db_part
    except HTTPException:
        raise
    except PartNotFoundException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error updating part: {str(e)}")

@router.delete("/parts/{part_id}")
def delete_part(part_id: int, db: Session = Depends(get_db)):
    try:
        db_part = get_entity_by_id_or_raise(
            db, models.Part, part_id, PartNotFoundException
        )
        
        db.delete(db_part)
        db.commit()
        return {"message": "Part deleted successfully"}
    except PartNotFoundException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error deleting part: {str(e)}")