from sqlalchemy import (
    Column, Integer, String, Text, Boolean,
    DateTime, ForeignKey, func
)
from sqlalchemy.orm import relationship
from app.database import Base


class Category(Base):
    __tablename__ = "categories"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    parent_id = Column(Integer, ForeignKey("categories.id"), nullable=True)
    description = Column(Text, nullable=True)

    parent = relationship("Category", remote_side=[id], back_populates="subcategories")
    subcategories = relationship("Category", back_populates="parent", cascade="all, delete-orphan")
    parts = relationship("Part", back_populates="category")


class Bin(Base):
    __tablename__ = "bins"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    location = Column(String, nullable=True)
    description = Column(Text, nullable=True)

    parts = relationship("Part", back_populates="bin")


class Part(Base):
    __tablename__ = "parts"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False, index=True)
    part_number = Column(String, nullable=True, index=True)
    manufacturer = Column(String, nullable=True, index=True)
    category_id = Column(Integer, ForeignKey("categories.id"), nullable=True)
    bin_id = Column(Integer, ForeignKey("bins.id"), nullable=True)
    quantity = Column(Integer, default=0)
    description = Column(Text, nullable=True)
    tags = Column(String, nullable=True)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())

    category = relationship("Category", back_populates="parts")
    bin = relationship("Bin", back_populates="parts")
    specifications = relationship("PartSpecification", back_populates="part", cascade="all, delete-orphan")
    documents = relationship("Document", back_populates="part", cascade="all, delete-orphan")


class PartSpecification(Base):
    __tablename__ = "part_specifications"

    id = Column(Integer, primary_key=True, index=True)
    part_id = Column(Integer, ForeignKey("parts.id", ondelete="CASCADE"), nullable=False)
    key = Column(String, nullable=False)
    value = Column(String, nullable=False)

    part = relationship("Part", back_populates="specifications")


class Document(Base):
    __tablename__ = "documents"

    id = Column(Integer, primary_key=True, index=True)
    part_id = Column(Integer, ForeignKey("parts.id", ondelete="CASCADE"), nullable=False)
    name = Column(String, nullable=False)
    document_type = Column(String, nullable=True)  # datasheet, schematic, manual, other
    url = Column(String, nullable=True)
    storage_path = Column(String, nullable=True)
    original_filename = Column(String, nullable=True)
    content_type = Column(String, nullable=True)
    file_size = Column(Integer, nullable=True)

    part = relationship("Part", back_populates="documents")


class Setting(Base):
    __tablename__ = "settings"

    id = Column(Integer, primary_key=True, index=True)
    key = Column(String, unique=True, nullable=False)
    value = Column(Text, nullable=True)
    is_sensitive = Column(Boolean, default=False)


class ChatMessageModel(Base):
    """Persistent chat history — every user/assistant turn stored here."""
    __tablename__ = "chat_messages"

    id = Column(Integer, primary_key=True, index=True)
    role = Column(String, nullable=False)          # "user" | "assistant"
    content = Column(Text, nullable=False)
    created_at = Column(DateTime, default=func.now(), index=True)


class MemoryNote(Base):
    """Single-row rolling summary injected into every system prompt."""
    __tablename__ = "memory_notes"

    id = Column(Integer, primary_key=True, index=True)
    content = Column(Text, nullable=False)
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
