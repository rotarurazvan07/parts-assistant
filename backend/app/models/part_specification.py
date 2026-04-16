from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from ..database import Base


class PartSpecification(Base):
    __tablename__ = "part_specifications"

    id = Column(Integer, primary_key=True, index=True)
    part_id = Column(Integer, ForeignKey("parts.id"), nullable=False)
    name = Column(String, nullable=False)
    value = Column(String, nullable=False)

    # Relationship
    part = relationship("Part", back_populates="specifications")