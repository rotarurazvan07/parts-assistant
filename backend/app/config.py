from pydantic_settings import BaseSettings
from pydantic import field_validator
from typing import Optional


class Settings(BaseSettings):
    app_name: str = "Smart Electronics Lab API"
    app_version: str = "1.0.0"
    database_url: str = "sqlite:///./smart_electronics_lab.db"
    debug: bool = False
    log_level: str = "INFO"
    
    # API settings
    api_v1_prefix: str = "/api/v1"
    
    # File upload settings
    max_upload_size: int = 10 * 1024 * 1024  # 10MB
    allowed_file_types: list = ["application/json", "text/csv"]
    
    class Config:
        env_file = ".env"
    
    @field_validator('debug', mode='before')
    @classmethod
    def parse_debug(cls, v):
        if isinstance(v, bool):
            return v
        if isinstance(v, str):
            return v.lower() in ('true', '1', 'yes', 'on')
        return bool(v)


settings = Settings()