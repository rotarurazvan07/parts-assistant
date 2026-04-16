from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from ... import models, schemas
from ...database import get_db
from ...exceptions import DocumentNotFoundException
from ...utils.common import get_entity_by_id_or_raise

router = APIRouter()

@router.get("/documents", response_model=List[schemas.Document])
def get_documents(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    try:
        documents = db.query(models.Document).offset(skip).limit(limit).all()
        return documents
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving documents: {str(e)}")

@router.get("/documents/{document_id}", response_model=schemas.Document)
def get_document(document_id: int, db: Session = Depends(get_db)):
    try:
        document = get_entity_by_id_or_raise(
            db, models.Document, document_id, DocumentNotFoundException
        )
        return document
    except DocumentNotFoundException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving document: {str(e)}")

@router.post("/documents", response_model=schemas.Document)
def create_document(document: schemas.DocumentCreate, db: Session = Depends(get_db)):
    try:
        db_document = models.Document(**document.dict())
        db.add(db_document)
        db.commit()
        db.refresh(db_document)
        return db_document
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error creating document: {str(e)}")

@router.put("/documents/{document_id}", response_model=schemas.Document)
def update_document(document_id: int, document: schemas.DocumentUpdate, db: Session = Depends(get_db)):
    try:
        db_document = get_entity_by_id_or_raise(
            db, models.Document, document_id, DocumentNotFoundException
        )
        
        for key, value in document.dict(exclude_unset=True).items():
            setattr(db_document, key, value)
        
        db.commit()
        db.refresh(db_document)
        return db_document
    except DocumentNotFoundException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error updating document: {str(e)}")

@router.delete("/documents/{document_id}")
def delete_document(document_id: int, db: Session = Depends(get_db)):
    try:
        db_document = get_entity_by_id_or_raise(
            db, models.Document, document_id, DocumentNotFoundException
        )
        
        db.delete(db_document)
        db.commit()
        return {"message": "Document deleted successfully"}
    except DocumentNotFoundException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error deleting document: {str(e)}")