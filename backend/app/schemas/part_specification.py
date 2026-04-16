from pydantic import BaseModel, Field, field_validator
from typing import Optional


class PartSpecificationBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=200, description="Specification name")
    value: str = Field(..., min_length=1, max_length=500, description="Specification value")


class PartSpecificationCreate(PartSpecificationBase):
    pass


class PartSpecificationUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=200, description="Specification name")
    value: Optional[str] = Field(None, min_length=1, max_length=500, description="Specification value")


class PartSpecification(PartSpecificationBase):
    id: int
    part_id: int

    class Config:
        from_attributes = True