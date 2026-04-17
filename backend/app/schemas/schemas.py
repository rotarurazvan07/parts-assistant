from pydantic import BaseModel, Field
from typing import Optional, List, Any
from datetime import datetime


# ──────────────────────────────────────────────
# Category Schemas
# ──────────────────────────────────────────────

class CategoryBase(BaseModel):
    name: str
    parent_id: Optional[int] = None
    description: Optional[str] = None


class CategoryCreate(CategoryBase):
    pass


class CategoryUpdate(CategoryBase):
    pass


class CategoryOut(CategoryBase):
    id: int
    model_config = {"from_attributes": True}


class CategoryTree(CategoryOut):
    subcategories: List["CategoryTree"] = []
    model_config = {"from_attributes": True}


CategoryTree.model_rebuild()


# ──────────────────────────────────────────────
# Bin Schemas
# ──────────────────────────────────────────────

class BinBase(BaseModel):
    name: str
    location: Optional[str] = None
    description: Optional[str] = None


class BinCreate(BinBase):
    pass


class BinUpdate(BinBase):
    pass


class BinOut(BinBase):
    id: int
    model_config = {"from_attributes": True}


# ──────────────────────────────────────────────
# Specification Schemas
# ──────────────────────────────────────────────

class SpecificationBase(BaseModel):
    key: str
    value: str


class SpecificationCreate(SpecificationBase):
    pass


class SpecificationUpdate(SpecificationBase):
    pass


class SpecificationOut(SpecificationBase):
    id: int
    part_id: int
    model_config = {"from_attributes": True}


# ──────────────────────────────────────────────
# Document Schemas
# ──────────────────────────────────────────────

class DocumentBase(BaseModel):
    name: str
    document_type: Optional[str] = None
    url: Optional[str] = None
    storage_path: Optional[str] = None
    original_filename: Optional[str] = None
    content_type: Optional[str] = None
    file_size: Optional[int] = None


class DocumentCreate(DocumentBase):
    pass


class DocumentUpdate(DocumentBase):
    pass


class DocumentOut(DocumentBase):
    id: int
    part_id: int
    model_config = {"from_attributes": True}


# ──────────────────────────────────────────────
# Part Schemas
# ──────────────────────────────────────────────

class PartBase(BaseModel):
    name: str
    part_number: Optional[str] = None
    manufacturer: Optional[str] = None
    category_id: Optional[int] = None
    bin_id: Optional[int] = None
    quantity: int = 0
    description: Optional[str] = None
    tags: Optional[str] = None


class PartCreate(PartBase):
    specifications: Optional[List[SpecificationCreate]] = []


class PartUpdate(PartBase):
    specifications: Optional[List[SpecificationCreate]] = None


class PartListItem(PartBase):
    id: int
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    category: Optional[CategoryOut] = None
    bin: Optional[BinOut] = None
    model_config = {"from_attributes": True}


class PartOut(PartBase):
    id: int
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    category: Optional[CategoryOut] = None
    bin: Optional[BinOut] = None
    specifications: List[SpecificationOut] = []
    documents: List[DocumentOut] = []
    model_config = {"from_attributes": True}


class PartsPage(BaseModel):
    parts: List[PartListItem]
    total: int
    page: int
    pages: int


# ──────────────────────────────────────────────
# Setting Schemas
# ──────────────────────────────────────────────

class SettingBase(BaseModel):
    key: str
    value: Optional[str] = None
    is_sensitive: bool = False


class SettingCreate(SettingBase):
    pass


class SettingUpdate(BaseModel):
    value: Optional[str] = None
    is_sensitive: Optional[bool] = None


class SettingOut(BaseModel):
    id: int
    key: str
    value: Optional[str] = None
    is_sensitive: bool
    model_config = {"from_attributes": True}


# ──────────────────────────────────────────────
# AI Schemas
# ──────────────────────────────────────────────

class ChatMessage(BaseModel):
    role: str  # "user" | "assistant" | "system"
    content: str


class ChatRequest(BaseModel):
    message: str
    context_parts: Optional[List[int]] = []
    history: Optional[List[ChatMessage]] = []


class ChatResponse(BaseModel):
    response: str
    context_parts: Optional[List[int]] = []


# ──────────────────────────────────────────────
# Import / Export Schemas
# ──────────────────────────────────────────────

class ImportRequest(BaseModel):
    csv_data: str


class ImportResponse(BaseModel):
    imported: int
    errors: List[str] = []


# ──────────────────────────────────────────────
# Memory / History Schemas
# ──────────────────────────────────────────────

class StoredMessage(BaseModel):
    id: int
    role: str
    content: str
    created_at: Optional[datetime] = None
    model_config = {"from_attributes": True}


class MemoryNoteOut(BaseModel):
    content: str
    updated_at: Optional[datetime] = None
    model_config = {"from_attributes": True}
