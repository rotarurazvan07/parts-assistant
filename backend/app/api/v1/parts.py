import math
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import or_, func

from app.database import get_db
from app.models.models import Part, Category, Bin, PartSpecification, Document
from app.schemas.schemas import (
    PartCreate, PartUpdate, PartOut, PartListItem, PartsPage,
    SpecificationCreate, SpecificationUpdate, SpecificationOut,
)

router = APIRouter(prefix="/parts", tags=["parts"])


def _mask_none(val):
    return val


# ──────────────────────────────────────────────
# Parts CRUD
# ──────────────────────────────────────────────

@router.get("", response_model=PartsPage)
def list_parts(
    page: int = Query(1, ge=1),
    limit: int = Query(25, ge=1, le=200),
    search: Optional[str] = Query(None),
    category_id: Optional[int] = Query(None),
    bin_id: Optional[int] = Query(None),
    sort_by: Optional[str] = Query("name"),
    sort_order: Optional[str] = Query("asc"),
    db: Session = Depends(get_db),
):
    q = db.query(Part).options(
        joinedload(Part.category),
        joinedload(Part.bin),
    )

    if search:
        term = f"%{search}%"
        q = q.filter(
            or_(
                Part.name.ilike(term),
                Part.part_number.ilike(term),
                Part.manufacturer.ilike(term),
                Part.description.ilike(term),
                Part.tags.ilike(term),
            )
        )

    if category_id is not None:
        q = q.filter(Part.category_id == category_id)

    if bin_id is not None:
        q = q.filter(Part.bin_id == bin_id)

    total = q.count()

    sortable = {
        "name": Part.name,
        "part_number": Part.part_number,
        "manufacturer": Part.manufacturer,
        "category_id": Part.category_id,
        "bin_id": Part.bin_id,
        "quantity": Part.quantity,
        "created_at": Part.created_at,
        "updated_at": Part.updated_at,
    }
    sort_col = sortable.get(sort_by, Part.name)
    if sort_order == "desc":
        sort_col = sort_col.desc()
    q = q.order_by(sort_col)

    offset = (page - 1) * limit
    parts = q.offset(offset).limit(limit).all()

    return PartsPage(
        parts=parts,
        total=total,
        page=page,
        pages=math.ceil(total / limit) if total else 1,
    )


@router.get("/{part_id}", response_model=PartOut)
def get_part(part_id: int, db: Session = Depends(get_db)):
    part = (
        db.query(Part)
        .options(
            joinedload(Part.category),
            joinedload(Part.bin),
            joinedload(Part.specifications),
            joinedload(Part.documents),
        )
        .filter(Part.id == part_id)
        .first()
    )
    if not part:
        raise HTTPException(status_code=404, detail="Part not found")
    return part


@router.post("", response_model=PartOut, status_code=201)
def create_part(data: PartCreate, db: Session = Depends(get_db)):
    specs = data.specifications or []
    part_data = data.model_dump(exclude={"specifications"})
    part = Part(**part_data)
    db.add(part)
    db.flush()
    for s in specs:
        db.add(PartSpecification(part_id=part.id, key=s.key, value=s.value))
    db.commit()
    db.refresh(part)
    return db.query(Part).options(
        joinedload(Part.category),
        joinedload(Part.bin),
        joinedload(Part.specifications),
        joinedload(Part.documents),
    ).filter(Part.id == part.id).first()


@router.put("/{part_id}", response_model=PartOut)
def update_part(part_id: int, data: PartUpdate, db: Session = Depends(get_db)):
    part = db.query(Part).filter(Part.id == part_id).first()
    if not part:
        raise HTTPException(status_code=404, detail="Part not found")

    update_data = data.model_dump(exclude={"specifications"}, exclude_none=True)
    for k, v in update_data.items():
        setattr(part, k, v)

    if data.specifications is not None:
        db.query(PartSpecification).filter(PartSpecification.part_id == part_id).delete()
        for s in data.specifications:
            db.add(PartSpecification(part_id=part_id, key=s.key, value=s.value))

    db.commit()
    db.refresh(part)
    return db.query(Part).options(
        joinedload(Part.category),
        joinedload(Part.bin),
        joinedload(Part.specifications),
        joinedload(Part.documents),
    ).filter(Part.id == part_id).first()


@router.delete("/{part_id}", status_code=204)
def delete_part(part_id: int, db: Session = Depends(get_db)):
    part = db.query(Part).filter(Part.id == part_id).first()
    if not part:
        raise HTTPException(status_code=404, detail="Part not found")
    db.delete(part)
    db.commit()


# ──────────────────────────────────────────────
# Specifications
# ──────────────────────────────────────────────

@router.get("/{part_id}/specifications", response_model=list[SpecificationOut])
def list_specs(part_id: int, db: Session = Depends(get_db)):
    part = db.query(Part).filter(Part.id == part_id).first()
    if not part:
        raise HTTPException(status_code=404, detail="Part not found")
    return db.query(PartSpecification).filter(PartSpecification.part_id == part_id).all()


@router.post("/{part_id}/specifications", response_model=SpecificationOut, status_code=201)
def add_spec(part_id: int, data: SpecificationCreate, db: Session = Depends(get_db)):
    part = db.query(Part).filter(Part.id == part_id).first()
    if not part:
        raise HTTPException(status_code=404, detail="Part not found")
    spec = PartSpecification(part_id=part_id, key=data.key, value=data.value)
    db.add(spec)
    db.commit()
    db.refresh(spec)
    return spec


@router.put("/{part_id}/specifications/{spec_id}", response_model=SpecificationOut)
def update_spec(part_id: int, spec_id: int, data: SpecificationUpdate, db: Session = Depends(get_db)):
    spec = db.query(PartSpecification).filter(
        PartSpecification.id == spec_id,
        PartSpecification.part_id == part_id,
    ).first()
    if not spec:
        raise HTTPException(status_code=404, detail="Specification not found")
    spec.key = data.key
    spec.value = data.value
    db.commit()
    db.refresh(spec)
    return spec


@router.delete("/{part_id}/specifications/{spec_id}", status_code=204)
def delete_spec(part_id: int, spec_id: int, db: Session = Depends(get_db)):
    spec = db.query(PartSpecification).filter(
        PartSpecification.id == spec_id,
        PartSpecification.part_id == part_id,
    ).first()
    if not spec:
        raise HTTPException(status_code=404, detail="Specification not found")
    db.delete(spec)
    db.commit()
