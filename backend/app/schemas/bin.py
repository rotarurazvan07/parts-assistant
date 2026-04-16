from pydantic import BaseModel, Field
from typing import Optional


class BinBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=100, description="Bin name")
    location: Optional[str] = Field(None, max_length=200, description="Storage location")
    description: Optional[str] = Field(None, max_length=500, description="Bin description")


class BinCreate(BinBase):
    name: str = Field(..., min_length=1, max_length=100, description="Bin name (required)")


class BinUpdate(BinBase):
    pass


class Bin(BinBase):
    id: int

    class Config:
        from_attributes = True