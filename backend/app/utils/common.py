from typing import Optional
from sqlalchemy.orm import Session
from ..models import Part, Category, Bin, Document, Setting, PartSpecification


def get_entity_by_id_or_raise(db: Session, model, entity_id: int, exception_class):
    """
    Generic function to get an entity by ID or raise a specific exception
    """
    entity = db.query(model).filter(model.id == entity_id).first()
    if not entity:
        raise exception_class(entity_id)
    return entity


def validate_file_type(filename: str, allowed_extensions: list) -> bool:
    """
    Validate if the file type is allowed based on its extension
    """
    if not filename:
        return False
    
    for ext in allowed_extensions:
        if filename.lower().endswith(ext.lower()):
            return True
    return False


def sanitize_input(input_str: Optional[str]) -> Optional[str]:
    """
    Sanitize input string by removing potentially harmful characters
    """
    if input_str is None:
        return None
    
    # Remove potentially harmful characters/sequences
    sanitized = input_str.replace('<script', '').replace('javascript:', '')
    return sanitized.strip()


def format_response(data, message: str = "Success", status_code: int = 200):
    """
    Standardize API response format
    """
    return {
        "status_code": status_code,
        "message": message,
        "data": data
    }