from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class DocumentBase(BaseModel):
    part_id: int
    name: str
    document_type: Optional[str] = None  # datasheet, schematic, manual, other
    url: Optional[str] = None
    storage_path: Optional[str] = None
    original_filename: Optional[str] = None
    content_type: Optional[str] = None  # MIME type
    file_size: Optional[int] = None


class DocumentCreate(DocumentBase):
    part_id: int
    name: str  # Required for creation


class DocumentUpdate(BaseModel):
    name: Optional[str] = None
    document_type: Optional[str] = None
    url: Optional[str] = None
    storage_path: Optional[str] = None
    original_filename: Optional[str] = None
    content_type: Optional[str] = None
    file_size: Optional[int] = None


class Document(DocumentBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True