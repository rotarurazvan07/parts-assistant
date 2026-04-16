from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from ..database import Base


class Document(Base):
    __tablename__ = "documents"

    id = Column(Integer, primary_key=True, index=True)
    part_id = Column(Integer, ForeignKey("parts.id"), nullable=False)
    name = Column(String, nullable=False)
    document_type = Column(String)  # datasheet, schematic, manual, other
    url = Column(String)
    storage_path = Column(String)
    original_filename = Column(String)
    content_type = Column(String)  # MIME type
    file_size = Column(Integer)

    # Relationship
    part = relationship("Part", back_populates="documents")