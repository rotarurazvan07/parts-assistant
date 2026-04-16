from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from ... import models, schemas
from ...database import get_db
from ...exceptions import BinNotFoundException
from ...utils.common import get_entity_by_id_or_raise
from ...utils.validation import sanitize_string, validate_bin_delete

router = APIRouter()

@router.get("/bins", response_model=List[schemas.Bin])
def get_bins(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    try:
        bins = db.query(models.Bin).offset(skip).limit(limit).all()
        return bins
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving bins: {str(e)}")

@router.get("/bins/{bin_id}", response_model=schemas.Bin)
def get_bin(bin_id: int, db: Session = Depends(get_db)):
    try:
        bin = get_entity_by_id_or_raise(
            db, models.Bin, bin_id, BinNotFoundException
        )
        return bin
    except BinNotFoundException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving bin: {str(e)}")

@router.post("/bins", response_model=schemas.Bin)
def create_bin(bin: schemas.BinCreate, db: Session = Depends(get_db)):
    try:
        # Sanitize text fields
        bin_data = bin.dict()
        if bin_data.get('name'):
            bin_data['name'] = sanitize_string(bin_data['name'])
        if bin_data.get('location'):
            bin_data['location'] = sanitize_string(bin_data['location'])
        if bin_data.get('description'):
            bin_data['description'] = sanitize_string(bin_data['description'])
        
        db_bin = models.Bin(**bin_data)
        db.add(db_bin)
        db.commit()
        db.refresh(db_bin)
        return db_bin
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error creating bin: {str(e)}")

@router.put("/bins/{bin_id}", response_model=schemas.Bin)
def update_bin(bin_id: int, bin: schemas.BinUpdate, db: Session = Depends(get_db)):
    try:
        db_bin = get_entity_by_id_or_raise(
            db, models.Bin, bin_id, BinNotFoundException
        )
        
        # Sanitize text fields
        bin_data = bin.dict(exclude_unset=True)
        for field in ['name', 'location', 'description']:
            if field in bin_data and bin_data[field]:
                bin_data[field] = sanitize_string(bin_data[field])
        
        for key, value in bin_data.items():
            setattr(db_bin, key, value)
        
        db.commit()
        db.refresh(db_bin)
        return db_bin
    except BinNotFoundException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error updating bin: {str(e)}")

@router.delete("/bins/{bin_id}")
def delete_bin(bin_id: int, db: Session = Depends(get_db)):
    try:
        db_bin = get_entity_by_id_or_raise(
            db, models.Bin, bin_id, BinNotFoundException
        )
        
        # Validate business rules for bin deletion
        validate_bin_delete(db, bin_id)
        
        db.delete(db_bin)
        db.commit()
        return {"message": "Bin deleted successfully"}
    except HTTPException:
        raise
    except BinNotFoundException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error deleting bin: {str(e)}")