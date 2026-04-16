from pydantic import BaseModel
from typing import Optional


class SettingBase(BaseModel):
    key: str
    value: Optional[str] = None
    is_sensitive: Optional[bool] = False


class SettingCreate(SettingBase):
    key: str  # Required for creation


class SettingUpdate(BaseModel):
    value: Optional[str] = None
    is_sensitive: Optional[bool] = None


class Setting(SettingBase):
    id: int

    class Config:
        from_attributes = True