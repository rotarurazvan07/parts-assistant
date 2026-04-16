from pydantic import BaseModel, Field, field_validator
from datetime import datetime
from typing import List, Optional
from .part_specification import PartSpecification
from .document import Document


class PartBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=200, description="Part name")
    part_number: Optional[str] = Field(None, max_length=100, description="Manufacturer part number")
    manufacturer: Optional[str] = Field(None, max_length=200, description="Manufacturer name")
    category_id: Optional[int] = Field(None, ge=1, description="Category ID")
    bin_id: Optional[int] = Field(None, ge=1, description="Bin ID")
    quantity: Optional[int] = Field(0, ge=0, description="Quantity in stock")
    description: Optional[str] = Field(None, max_length=2000, description="Part description")
    tags: Optional[str] = Field(None, max_length=500, description="Comma-separated tags")
    datasheet_url: Optional[str] = Field(None, description="URL to datasheet")
    image_url: Optional[str] = Field(None, description="URL to part image")
    supplier: Optional[str] = Field(None, max_length=200, description="Supplier name")
    supplier_part_number: Optional[str] = Field(None, max_length=100, description="Supplier part number")
    location: Optional[str] = Field(None, max_length=200, description="Storage location")
    notes: Optional[str] = Field(None, max_length=2000, description="Additional notes")

    @field_validator('datasheet_url', 'image_url')
    @classmethod
    def validate_url(cls, v):
        if v and not v.startswith(('http://', 'https://')):
            raise ValueError('URL must start with http:// or https://')
        return v

    @field_validator('tags')
    @classmethod
    def validate_tags(cls, v):
        if v:
            # Remove extra spaces and ensure proper comma separation
            tags = [tag.strip() for tag in v.split(',') if tag.strip()]
            return ', '.join(tags)
        return v


class PartCreate(PartBase):
    name: str = Field(..., min_length=1, max_length=200, description="Part name (required)")


class PartUpdate(PartBase):
    pass


class Part(PartBase):
    id: int
    created_at: datetime
    updated_at: datetime
    
    # Relationships
    specifications: List[PartSpecification] = []
    documents: List[Document] = []

    class Config:
        from_attributes = True