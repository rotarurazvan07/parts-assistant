from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.models import Setting
from app.schemas.schemas import SettingCreate, SettingUpdate, SettingOut

router = APIRouter(prefix="/settings", tags=["settings"])

MASK = "**********"


def _mask(setting: Setting) -> SettingOut:
    value = setting.value
    if setting.is_sensitive and value:
        # Show only last 4 chars
        value = MASK + value[-4:] if len(value) >= 4 else MASK
    return SettingOut(id=setting.id, key=setting.key, value=value, is_sensitive=setting.is_sensitive)


def _is_masked(value: str) -> bool:
    return value is not None and value.startswith(MASK)


@router.get("", response_model=List[SettingOut])
def list_settings(db: Session = Depends(get_db)):
    return [_mask(s) for s in db.query(Setting).all()]


@router.get("/{key}", response_model=SettingOut)
def get_setting(key: str, db: Session = Depends(get_db)):
    s = db.query(Setting).filter(Setting.key == key).first()
    if not s:
        raise HTTPException(status_code=404, detail="Setting not found")
    return _mask(s)


@router.post("", response_model=SettingOut, status_code=201)
def create_setting(data: SettingCreate, db: Session = Depends(get_db)):
    existing = db.query(Setting).filter(Setting.key == data.key).first()
    if existing:
        raise HTTPException(status_code=400, detail="Setting already exists. Use PUT to update.")
    s = Setting(key=data.key, value=data.value, is_sensitive=data.is_sensitive)
    db.add(s)
    db.commit()
    db.refresh(s)
    return _mask(s)


@router.put("/{key}", response_model=SettingOut)
def update_setting(key: str, data: SettingUpdate, db: Session = Depends(get_db)):
    s = db.query(Setting).filter(Setting.key == key).first()
    if not s:
        raise HTTPException(status_code=404, detail="Setting not found")
    # Only update value if it's not the masked placeholder
    if data.value is not None and not _is_masked(data.value):
        s.value = data.value
    if data.is_sensitive is not None:
        s.is_sensitive = data.is_sensitive
    db.commit()
    db.refresh(s)
    return _mask(s)


@router.delete("/{key}", status_code=204)
def delete_setting(key: str, db: Session = Depends(get_db)):
    s = db.query(Setting).filter(Setting.key == key).first()
    if not s:
        raise HTTPException(status_code=404, detail="Setting not found")
    db.delete(s)
    db.commit()
