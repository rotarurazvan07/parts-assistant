from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from typing import List
import csv
import json

from ... import models, schemas
from ...database import get_db
from ...exceptions import InvalidFileTypeException
from ...utils.common import validate_file_type
from ...utils.validation import sanitize_string

router = APIRouter()

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
            
            # Check if category and bin columns exist in the CSV
            fieldnames = csv_reader.fieldnames
            has_category = "category" in fieldnames
            has_bin = "bin" in fieldnames
            
            # Create a mapping for category and bin names to IDs
            category_map = {}
            bin_map = {}
            
            for row in csv_reader:
                # Handle category and bin creation/lookup
                category_name = row.get("category")
                bin_name = row.get("bin")
                
                # Create category if it doesn't exist and is provided
                if has_category and category_name and category_name not in category_map:
                    # Check if category already exists in database
                    existing_category = db.query(models.Category).filter_by(name=category_name).first()
                    if not existing_category:
                        # Create new category
                        new_category = models.Category(name=category_name)
                        db.add(new_category)
                        db.commit()
                        db.refresh(new_category)
                        category_map[category_name] = new_category.id
                    else:
                        category_map[category_name] = existing_category.id
                
                # Create bin if it doesn't exist and is provided
                if has_bin and bin_name and bin_name not in bin_map:
                    # Check if bin already exists in database
                    existing_bin = db.query(models.Bin).filter_by(name=bin_name).first()
                    if not existing_bin:
                        # Create new bin
                        new_bin = models.Bin(name=bin_name)
                        db.add(new_bin)
                        db.commit()
                        db.refresh(new_bin)
                        bin_map[bin_name] = new_bin.id
                    else:
                        bin_map[bin_name] = existing_bin.id
                
                # Convert CSV row to Part model and sanitize text fields
                part_data = {
                    "name": sanitize_string(row.get("name", "")),
                    "description": sanitize_string(row.get("description", "")),
                    "part_number": row.get("part_number"),
                    "manufacturer": sanitize_string(row.get("manufacturer", "")),
                    "category_id": int(row.get("category_id")) if row.get("category_id") and row.get("category_id").isdigit() else None,
                    "bin_id": int(row.get("bin_id")) if row.get("bin_id") and row.get("bin_id").isdigit() else None,
                    "quantity": int(row.get("quantity")) if row.get("quantity") and row.get("quantity").isdigit() else 0,
                    "datasheet_url": row.get("datasheet_url"),
                    "image_url": row.get("image_url"),
                    "supplier": sanitize_string(row.get("supplier", "")),
                    "supplier_part_number": row.get("supplier_part_number"),
                    "location": sanitize_string(row.get("location", "")),
                    "notes": sanitize_string(row.get("notes", "")),
                }
                
                db_part = models.Part(**part_data)
                db.add(db_part)
                db.commit()
        
        elif file.filename.endswith('.json'):
            # Parse JSON
            data = json.loads(contents)
            
            for item in data:
                # Sanitize text fields in JSON data
                if 'name' in item:
                    item['name'] = sanitize_string(item['name'])
                if 'description' in item:
                    item['description'] = sanitize_string(item['description'])
                if 'manufacturer' in item:
                    item['manufacturer'] = sanitize_string(item['manufacturer'])
                if 'supplier' in item:
                    item['supplier'] = sanitize_string(item['supplier'])
                if 'location' in item:
                    item['location'] = sanitize_string(item['location'])
                if 'notes' in item:
                    item['notes'] = sanitize_string(item['notes'])
                
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