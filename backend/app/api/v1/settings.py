from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from ... import models, schemas
from ...database import get_db
from ...exceptions import SettingNotFoundException
from ...utils.common import get_entity_by_id_or_raise

router = APIRouter()

@router.get("/settings", response_model=List[schemas.Setting])
def get_settings(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    try:
        settings = db.query(models.Setting).offset(skip).limit(limit).all()
        return settings
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving settings: {str(e)}")

@router.get("/settings/{setting_id}", response_model=schemas.Setting)
def get_setting(setting_id: int, db: Session = Depends(get_db)):
    try:
        setting = get_entity_by_id_or_raise(
            db, models.Setting, setting_id, SettingNotFoundException
        )
        return setting
    except SettingNotFoundException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving setting: {str(e)}")

@router.post("/settings", response_model=schemas.Setting)
def create_setting(setting: schemas.SettingCreate, db: Session = Depends(get_db)):
    try:
        db_setting = models.Setting(**setting.dict())
        db.add(db_setting)
        db.commit()
        db.refresh(db_setting)
        return db_setting
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error creating setting: {str(e)}")

@router.put("/settings/{setting_id}", response_model=schemas.Setting)
def update_setting(setting_id: int, setting: schemas.SettingUpdate, db: Session = Depends(get_db)):
    try:
        db_setting = get_entity_by_id_or_raise(
            db, models.Setting, setting_id, SettingNotFoundException
        )
        
        for key, value in setting.dict(exclude_unset=True).items():
            setattr(db_setting, key, value)
        
        db.commit()
        db.refresh(db_setting)
        return db_setting
    except SettingNotFoundException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error updating setting: {str(e)}")

@router.delete("/settings/{setting_id}")
def delete_setting(setting_id: int, db: Session = Depends(get_db)):
    try:
        db_setting = get_entity_by_id_or_raise(
            db, models.Setting, setting_id, SettingNotFoundException
        )
        
        db.delete(db_setting)
        db.commit()
        return {"message": "Setting deleted successfully"}
    except SettingNotFoundException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error deleting setting: {str(e)}")