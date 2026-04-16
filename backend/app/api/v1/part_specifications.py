from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional

from ... import models, schemas
from ...database import get_db
from ...exceptions import PartSpecificationNotFoundException
from ...utils.common import get_entity_by_id_or_raise
from ...utils.validation import sanitize_string

router = APIRouter()

@router.get("/parts/{part_id}/specifications", response_model=List[schemas.PartSpecification])
def get_part_specifications(part_id: int, db: Session = Depends(get_db)):
    """
    Retrieve specifications for a specific part.
    """
    try:
        # Check if part exists
        get_entity_by_id_or_raise(db, models.Part, part_id, HTTPException)
        
        # Get specifications for the part
        specifications = db.query(models.PartSpecification).filter(
            models.PartSpecification.part_id == part_id
        ).all()
        
        return specifications
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving part specifications: {str(e)}")


@router.get("/parts/{part_id}/specifications/{spec_id}", response_model=schemas.PartSpecification)
def get_part_specification(
    part_id: int,
    spec_id: int,
    db: Session = Depends(get_db)
):
    """
    Retrieve a specific specification for a part.
    """
    try:
        # Check if part exists
        get_entity_by_id_or_raise(db, models.Part, part_id, HTTPException)
        
        # Get the specification
        spec = get_entity_by_id_or_raise(
            db, models.PartSpecification, spec_id, PartSpecificationNotFoundException
        )
        
        # Verify the specification belongs to the part
        if spec.part_id != part_id:
            raise HTTPException(status_code=404, detail="Specification not found for this part")
        
        return spec
    except HTTPException:
        raise
    except PartSpecificationNotFoundException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving part specification: {str(e)}")

@router.post("/parts/{part_id}/specifications", response_model=schemas.PartSpecification)
def create_part_specification(
    part_id: int,
    spec: schemas.PartSpecificationCreate,
    db: Session = Depends(get_db)
):
    """
    Add a specification to a part.
    """
    try:
        # Check if part exists
        get_entity_by_id_or_raise(db, models.Part, part_id, HTTPException)
        
        # Sanitize text fields
        spec_data = spec.dict()
        if spec_data.get('name'):
            spec_data['name'] = sanitize_string(spec_data['name'])
        if spec_data.get('value'):
            spec_data['value'] = sanitize_string(spec_data['value'])
        
        # Create the specification
        db_spec = models.PartSpecification(**spec_data, part_id=part_id)
        db.add(db_spec)
        db.commit()
        db.refresh(db_spec)
        return db_spec
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error creating part specification: {str(e)}")

@router.put("/parts/{part_id}/specifications/{spec_id}", response_model=schemas.PartSpecification)
def update_part_specification(
    part_id: int,
    spec_id: int,
    spec: schemas.PartSpecificationUpdate,
    db: Session = Depends(get_db)
):
    """
    Update a specific specification.
    """
    try:
        # Check if part exists
        get_entity_by_id_or_raise(db, models.Part, part_id, HTTPException)
        
        # Get the specification
        db_spec = get_entity_by_id_or_raise(
            db, models.PartSpecification, spec_id, PartSpecificationNotFoundException
        )
        
        # Sanitize text fields
        spec_data = spec.dict(exclude_unset=True)
        for field in ['name', 'value']:
            if field in spec_data and spec_data[field]:
                spec_data[field] = sanitize_string(spec_data[field])
        
        # Update the specification
        for key, value in spec_data.items():
            setattr(db_spec, key, value)
        
        db.commit()
        db.refresh(db_spec)
        return db_spec
    except HTTPException:
        raise
    except PartSpecificationNotFoundException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error updating part specification: {str(e)}")

@router.delete("/parts/{part_id}/specifications/{spec_id}")
def delete_part_specification(
    part_id: int,
    spec_id: int,
    db: Session = Depends(get_db)
):
    """
    Delete a specific specification.
    """
    try:
        # Check if part exists
        get_entity_by_id_or_raise(db, models.Part, part_id, HTTPException)
        
        # Get the specification
        db_spec = get_entity_by_id_or_raise(
            db, models.PartSpecification, spec_id, PartSpecificationNotFoundException
        )
        
        # Delete the specification
        db.delete(db_spec)
        db.commit()
        return {"message": "Part specification deleted successfully"}
    except HTTPException:
        raise
    except PartSpecificationNotFoundException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error deleting part specification: {str(e)}")