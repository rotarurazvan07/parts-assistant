from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Query
from sqlalchemy.orm import Session
from typing import List, Optional
import csv
import json

from ... import models, schemas
from ...database import get_db
from ...exceptions import InvalidFileTypeException
from ...utils.common import validate_file_type
from ...utils.validation import sanitize_string

router = APIRouter()

@router.get("/search", response_model=List[schemas.Part])
def search_parts(
    query: str = Query(None, description="Search query across all fields"),
    category_id: Optional[int] = Query(None, description="Filter by category ID"),
    bin_id: Optional[int] = Query(None, description="Filter by bin ID"),
    page: int = Query(1, description="Page number for pagination"),
    limit: int = Query(100, description="Number of items per page"),
    sort_by: str = Query("id", description="Field to sort by"),
    sort_order: str = Query("asc", description="Sort order (asc or desc)"),
    db: Session = Depends(get_db)
):
    """
    Search for parts across all fields with query parameters.
    Supports filtering by category_id and bin_id.
    Full-text search capabilities across name, part number, manufacturer, description, and tags.
    """
    try:
        # Create the base query
        query_parts = db.query(models.Part)
        
        # If category_id filter is provided, apply it
        if category_id is not None:
            query_parts = query_parts.filter(models.Part.category_id == category_id)
        
        # If bin_id filter is provided, apply it
        if bin_id is not None:
            query_parts = query_parts.filter(models.Part.bin_id == bin_id)
        
        # If search query is provided, apply full-text search
        if query:
            # We'll implement a simple search across multiple fields
            # This would typically use database-specific full-text search capabilities
            search_query = f"%{query}%"
            query_parts = query_parts.filter(
                models.Part.name.like(search_query) |
                models.Part.part_number.like(search_query) |
                models.Part.manufacturer.like(search_query) |
                models.Part.description.like(search_query) |
                models.Part.tags.like(search_query)
            )
        
        # Apply sorting
        if sort_order.lower() == "desc":
            query_parts = query_parts.order_by(getattr(models.Part, sort_by).desc())
        else:
            query_parts = query_parts.order_by(getattr(models.Part, sort_by).asc())
        
        # Apply pagination
        query_parts = query_parts.offset((page - 1) * limit).limit(limit)
        
        # Execute the query
        parts = query_parts.all()
        return parts
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error searching parts: {str(e)}")

@router.get("/parts", response_model=List[schemas.Part])
def get_parts(
    page: int = Query(1, description="Page number for pagination"),
    limit: int = Query(100, description="Number of items per page"),
    sort_by: str = Query("id", description="Field to sort by"),
    sort_order: str = Query("asc", description="Sort order (asc or desc)"),
    db: Session = Depends(get_db)
):
    """
    Enhanced parts endpoint with pagination, sorting, and filtering capabilities.
    """
    try:
        # Create the base query
        query_parts = db.query(models.Part)
        
        # Apply sorting
        if sort_order.lower() == "desc":
            query_parts = query_parts.order_by(getattr(models.Part, sort_by).desc())
        else:
            query_parts = query_parts.order_by(getattr(models.Part, sort_by).asc())
        
        # Apply pagination
        query_parts = query_parts.offset((page - 1) * limit).limit(limit)
        
        # Execute the query
        parts = query_parts.all()
        return parts
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving parts: {str(e)}")

@router.post("/import/parts")
async def import_parts(file: UploadFile = File(...), db: Session = Depends(get_db)):
    try:
        if not validate_file_type(file.filename, ['.csv', '.json']):
            raise InvalidFileTypeException(['.csv', '.json'])
        
        contents = await file.read()
        
        if file.filename.endswith('.csv'):
            # Parse CSV
            decoded_contents = contents.decode('utf-8').splitlines()
            csv_reader = csv.DictReader(decoded_contents)
            
            for row in csv_reader:
                # Convert CSV row to Part model
                part_data = {
                    "name": row.get("name"),
                    "description": row.get("description"),
                    "part_number": row.get("part_number"),
                    "manufacturer": row.get("manufacturer"),
                    "category_id": int(row.get("category_id")) if row.get("category_id") and row.get("category_id").isdigit() else None,
                    "bin_id": int(row.get("bin_id")) if row.get("bin_id") and row.get("bin_id").isdigit() else None,
                    "quantity": int(row.get("quantity")) if row.get("quantity") and row.get("quantity").isdigit() else 0,
                    "datasheet_url": row.get("datasheet_url"),
                    "image_url": row.get("image_url"),
                    "supplier": row.get("supplier"),
                    "supplier_part_number": row.get("supplier_part_number"),
                    "location": row.get("location"),
                    "notes": row.get("notes"),
                }
                
                db_part = models.Part(**part_data)
                db.add(db_part)
        
        elif file.filename.endswith('.json'):
            # Parse JSON
            data = json.loads(contents)
            
            for item in data:
                db_part = models.Part(**item)
                db.add(db_part)
        
        db.commit()
        return {"message": f"Successfully imported parts from {file.filename}"}
    except json.JSONDecodeError:
        raise HTTPException(status_code=400, detail="Invalid JSON format")
    except UnicodeDecodeError:
        raise HTTPException(status_code=400, detail="Invalid file encoding")
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error importing parts: {str(e)}")

@router.get("/export/parts")
def export_parts(format: str = "json", db: Session = Depends(get_db)):
    try:
        parts = db.query(models.Part).all()
        
        if format == "json":
            return {"parts": [part.__dict__ for part in parts]}
        elif format == "csv":
            # Return CSV content
            headers = [
                "id", "name", "description", "part_number", "manufacturer", "category_id", 
                "bin_id", "quantity", "datasheet_url", 
                "image_url", "supplier", "supplier_part_number", "location", "notes"
            ]
            
            rows = []
            for part in parts:
                row = []
                for header in headers:
                    value = getattr(part, header)
                    if value is None:
                        row.append("")
                    else:
                        row.append(str(value))
                rows.append(row)
            
            # Create CSV content
            import io
            import csv
            
            output = io.StringIO()
            writer = csv.writer(output)
            writer.writerow(headers)
            writer.writerows(rows)
            
            return {"csv_content": output.getvalue()}
        else:
            raise HTTPException(status_code=400, detail="Format must be 'json' or 'csv'")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error exporting parts: {str(e)}")