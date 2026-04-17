import csv
import io
import json
from fastapi import APIRouter, Depends
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.models import Part, Category, Bin, PartSpecification
from app.schemas.schemas import ImportRequest, ImportResponse

router = APIRouter(tags=["import_export"])

CSV_COLUMNS = [
    "name", "part_number", "manufacturer", "category", "bin",
    "quantity", "description", "tags", "specifications",
]

SAMPLE_CSV = (
    "name,part_number,manufacturer,category,bin,quantity,description,tags,specifications\n"
    'Resistor 10kΩ,RES-10K,Yageo,Resistors,Drawer A1,100,Carbon film 1/4W,resistor;thru-hole,"[{""key"":""resistance"",""value"":""10kΩ""},{""key"":""power"",""value"":""0.25W""}]"\n'
    'ESP32-WROOM-32,ESP32-WROOM,Espressif,ESP32,Shelf B2,5,WiFi+BLE module,esp32;wifi;ble,[]\n'
)


def _get_or_create_category(db: Session, name: str) -> int | None:
    if not name or not name.strip():
        return None
    name = name.strip()
    cat = db.query(Category).filter(Category.name.ilike(name)).first()
    if cat:
        return cat.id
    cat = Category(name=name, description=f"Auto-created from CSV import")
    db.add(cat)
    db.flush()
    return cat.id


def _get_or_create_bin(db: Session, name: str) -> int | None:
    if not name or not name.strip():
        return None
    name = name.strip()
    b = db.query(Bin).filter(Bin.name.ilike(name)).first()
    if b:
        return b.id
    b = Bin(name=name)
    db.add(b)
    db.flush()
    return b.id


@router.post("/import", response_model=ImportResponse)
def import_parts(data: ImportRequest, db: Session = Depends(get_db)):
    reader = csv.DictReader(io.StringIO(data.csv_data.strip()))
    imported = 0
    errors = []

    for i, row in enumerate(reader, start=2):
        try:
            name = row.get("name", "").strip()
            if not name:
                errors.append(f"Row {i}: name is required")
                continue

            category_id = _get_or_create_category(db, row.get("category", ""))
            bin_id = _get_or_create_bin(db, row.get("bin", ""))

            qty_raw = row.get("quantity", "0").strip()
            try:
                quantity = int(qty_raw) if qty_raw else 0
            except ValueError:
                quantity = 0

            part = Part(
                name=name,
                part_number=row.get("part_number", "").strip() or None,
                manufacturer=row.get("manufacturer", "").strip() or None,
                category_id=category_id,
                bin_id=bin_id,
                quantity=quantity,
                description=row.get("description", "").strip() or None,
                tags=row.get("tags", "").replace(";", ",").strip() or None,
            )
            db.add(part)
            db.flush()

            specs_raw = row.get("specifications", "").strip()
            if specs_raw:
                try:
                    specs = json.loads(specs_raw)
                    for s in specs:
                        if isinstance(s, dict) and "key" in s and "value" in s:
                            db.add(PartSpecification(part_id=part.id, key=s["key"], value=s["value"]))
                except (json.JSONDecodeError, TypeError):
                    pass

            imported += 1

        except Exception as e:
            errors.append(f"Row {i}: {str(e)}")
            db.rollback()
            continue

    db.commit()
    return ImportResponse(imported=imported, errors=errors)


@router.get("/export")
def export_parts(db: Session = Depends(get_db)):
    parts = db.query(Part).all()

    output = io.StringIO()
    writer = csv.DictWriter(output, fieldnames=CSV_COLUMNS, quoting=csv.QUOTE_ALL)
    writer.writeheader()

    for part in parts:
        cat_name = part.category.name if part.category else ""
        bin_name = part.bin.name if part.bin else ""
        specs = [{"key": s.key, "value": s.value} for s in part.specifications]

        writer.writerow({
            "name": part.name or "",
            "part_number": part.part_number or "",
            "manufacturer": part.manufacturer or "",
            "category": cat_name,
            "bin": bin_name,
            "quantity": part.quantity or 0,
            "description": part.description or "",
            "tags": (part.tags or "").replace(",", ";"),
            "specifications": json.dumps(specs),
        })

    output.seek(0)
    return StreamingResponse(
        io.StringIO(output.getvalue()),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=parts_export.csv"},
    )


@router.get("/export/sample")
def export_sample():
    return StreamingResponse(
        io.StringIO(SAMPLE_CSV),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=sample_import.csv"},
    )
