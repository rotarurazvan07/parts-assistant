from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.models.models import Category
from app.schemas.schemas import CategoryCreate, CategoryUpdate, CategoryOut, CategoryTree

router = APIRouter(prefix="/categories", tags=["categories"])


def build_tree(categories: list, parent_id=None) -> list:
    result = []
    for cat in categories:
        if cat.parent_id == parent_id:
            children = build_tree(categories, cat.id)
            item = CategoryTree(
                id=cat.id,
                name=cat.name,
                parent_id=cat.parent_id,
                description=cat.description,
                subcategories=children,
            )
            result.append(item)
    return result


@router.get("", response_model=List[CategoryTree])
def list_categories(db: Session = Depends(get_db)):
    all_cats = db.query(Category).order_by(Category.name).all()
    return build_tree(all_cats, parent_id=None)


@router.get("/{category_id}", response_model=CategoryOut)
def get_category(category_id: int, db: Session = Depends(get_db)):
    cat = db.query(Category).filter(Category.id == category_id).first()
    if not cat:
        raise HTTPException(status_code=404, detail="Category not found")
    return cat


@router.post("", response_model=CategoryOut, status_code=201)
def create_category(data: CategoryCreate, db: Session = Depends(get_db)):
    if data.parent_id:
        parent = db.query(Category).filter(Category.id == data.parent_id).first()
        if not parent:
            raise HTTPException(status_code=404, detail="Parent category not found")
    cat = Category(**data.model_dump())
    db.add(cat)
    db.commit()
    db.refresh(cat)
    return cat


@router.put("/{category_id}", response_model=CategoryOut)
def update_category(category_id: int, data: CategoryUpdate, db: Session = Depends(get_db)):
    cat = db.query(Category).filter(Category.id == category_id).first()
    if not cat:
        raise HTTPException(status_code=404, detail="Category not found")
    for k, v in data.model_dump(exclude_none=True).items():
        setattr(cat, k, v)
    db.commit()
    db.refresh(cat)
    return cat


@router.delete("/{category_id}", status_code=204)
def delete_category(category_id: int, db: Session = Depends(get_db)):
    cat = db.query(Category).filter(Category.id == category_id).first()
    if not cat:
        raise HTTPException(status_code=404, detail="Category not found")
    # Nullify parts referencing this category
    from app.models.models import Part
    db.query(Part).filter(Part.category_id == category_id).update({"category_id": None})
    db.delete(cat)
    db.commit()
