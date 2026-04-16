from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from ... import models, schemas
from ...database import get_db
from ...exceptions import CategoryNotFoundException
from ...utils.common import get_entity_by_id_or_raise
from ...utils.validation import sanitize_string, validate_category_delete

router = APIRouter()

@router.get("/categories", response_model=List[schemas.Category])
def get_categories(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    try:
        categories = db.query(models.Category).offset(skip).limit(limit).all()
        return categories
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving categories: {str(e)}")

@router.get("/categories/{category_id}", response_model=schemas.Category)
def get_category(category_id: int, db: Session = Depends(get_db)):
    try:
        category = get_entity_by_id_or_raise(
            db, models.Category, category_id, CategoryNotFoundException
        )
        return category
    except CategoryNotFoundException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving category: {str(e)}")

@router.post("/categories", response_model=schemas.Category)
def create_category(category: schemas.CategoryCreate, db: Session = Depends(get_db)):
    try:
        # Sanitize name and description
        category_data = category.dict()
        if category_data.get('name'):
            category_data['name'] = sanitize_string(category_data['name'])
        if category_data.get('description'):
            category_data['description'] = sanitize_string(category_data['description'])
        
        db_category = models.Category(**category_data)
        db.add(db_category)
        db.commit()
        db.refresh(db_category)
        return db_category
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error creating category: {str(e)}")

@router.put("/categories/{category_id}", response_model=schemas.Category)
def update_category(category_id: int, category: schemas.CategoryUpdate, db: Session = Depends(get_db)):
    try:
        db_category = get_entity_by_id_or_raise(
            db, models.Category, category_id, CategoryNotFoundException
        )
        
        category_data = category.dict(exclude_unset=True)
        
        # Sanitize text fields
        if 'name' in category_data and category_data['name']:
            category_data['name'] = sanitize_string(category_data['name'])
        if 'description' in category_data and category_data['description']:
            category_data['description'] = sanitize_string(category_data['description'])
        
        for key, value in category_data.items():
            setattr(db_category, key, value)
        
        db.commit()
        db.refresh(db_category)
        return db_category
    except CategoryNotFoundException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error updating category: {str(e)}")

@router.delete("/categories/{category_id}")
def delete_category(category_id: int, db: Session = Depends(get_db)):
    try:
        db_category = get_entity_by_id_or_raise(
            db, models.Category, category_id, CategoryNotFoundException
        )
        
        # Validate business rules for category deletion
        validate_category_delete(db, category_id)
        
        db.delete(db_category)
        db.commit()
        return {"message": "Category deleted successfully"}
    except HTTPException:
        raise
    except CategoryNotFoundException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error deleting category: {str(e)}")