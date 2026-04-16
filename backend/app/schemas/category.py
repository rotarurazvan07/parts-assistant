from pydantic import BaseModel, Field
from typing import List, Optional


class CategoryBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=100, description="Category name")
    parent_id: Optional[int] = Field(None, ge=1, description="Parent category ID")
    description: Optional[str] = Field(None, max_length=500, description="Category description")


class CategoryCreate(CategoryBase):
    name: str = Field(..., min_length=1, max_length=100, description="Category name (required)")


class CategoryUpdate(CategoryBase):
    pass


class Category(CategoryBase):
    id: int
    subcategories: List['Category'] = []

    class Config:
        from_attributes = True