from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.models.models import Bin
from app.schemas.schemas import BinCreate, BinUpdate, BinOut

router = APIRouter(prefix="/bins", tags=["bins"])


@router.get("", response_model=List[BinOut])
def list_bins(db: Session = Depends(get_db)):
    return db.query(Bin).order_by(Bin.name).all()


@router.get("/{bin_id}", response_model=BinOut)
def get_bin(bin_id: int, db: Session = Depends(get_db)):
    b = db.query(Bin).filter(Bin.id == bin_id).first()
    if not b:
        raise HTTPException(status_code=404, detail="Bin not found")
    return b


@router.post("", response_model=BinOut, status_code=201)
def create_bin(data: BinCreate, db: Session = Depends(get_db)):
    b = Bin(**data.model_dump())
    db.add(b)
    db.commit()
    db.refresh(b)
    return b


@router.put("/{bin_id}", response_model=BinOut)
def update_bin(bin_id: int, data: BinUpdate, db: Session = Depends(get_db)):
    b = db.query(Bin).filter(Bin.id == bin_id).first()
    if not b:
        raise HTTPException(status_code=404, detail="Bin not found")
    for k, v in data.model_dump(exclude_none=True).items():
        setattr(b, k, v)
    db.commit()
    db.refresh(b)
    return b


@router.delete("/{bin_id}", status_code=204)
def delete_bin(bin_id: int, db: Session = Depends(get_db)):
    b = db.query(Bin).filter(Bin.id == bin_id).first()
    if not b:
        raise HTTPException(status_code=404, detail="Bin not found")
    from app.models.models import Part
    db.query(Part).filter(Part.bin_id == bin_id).update({"bin_id": None})
    db.delete(b)
    db.commit()
