from typing import Optional, List
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import or_

from app.database import get_db
from app.models.models import Part
from app.schemas.schemas import PartListItem

router = APIRouter(prefix="/search", tags=["search"])


@router.get("", response_model=List[PartListItem])
def search_parts(
    q: str = Query(..., min_length=1),
    category_id: Optional[int] = Query(None),
    bin_id: Optional[int] = Query(None),
    db: Session = Depends(get_db),
):
    term = f"%{q}%"
    query = db.query(Part).options(
        joinedload(Part.category),
        joinedload(Part.bin),
    ).filter(
        or_(
            Part.name.ilike(term),
            Part.part_number.ilike(term),
            Part.manufacturer.ilike(term),
            Part.description.ilike(term),
            Part.tags.ilike(term),
        )
    )

    if category_id is not None:
        query = query.filter(Part.category_id == category_id)
    if bin_id is not None:
        query = query.filter(Part.bin_id == bin_id)

    return query.limit(100).all()
