from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, func
from sqlalchemy.orm import relationship
from ..database import Base


class Part(Base):
    __tablename__ = "parts"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    part_number = Column(String)
    manufacturer = Column(String)
    category_id = Column(Integer, ForeignKey("categories.id"))
    bin_id = Column(Integer, ForeignKey("bins.id"))
    quantity = Column(Integer, default=0)
    description = Column(Text)
    tags = Column(Text)  # Comma-separated list of tags
    datasheet_url = Column(String)
    image_url = Column(String)
    supplier = Column(String)
    supplier_part_number = Column(String)
    location = Column(String)
    notes = Column(Text)
    created_at = Column(DateTime, default=func.current_timestamp())
    updated_at = Column(DateTime, default=func.current_timestamp(), onupdate=func.current_timestamp())

    # Relationships
    category = relationship("Category", back_populates="parts")
    bin = relationship("Bin", back_populates="parts")
    specifications = relationship("PartSpecification", back_populates="part", cascade="all, delete-orphan")
    documents = relationship("Document", back_populates="part", cascade="all, delete-orphan")