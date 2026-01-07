from sqlalchemy import Column, Integer, String, Text, JSON, ForeignKey
from .base import Base, TimestampMixin


class TableRelationship(Base, TimestampMixin):
    """Defines relationships between tables"""
    __tablename__ = "table_relationships"

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(255), nullable=True)
    source_table_id = Column(Integer, ForeignKey("tables.id", ondelete="CASCADE"), nullable=False)
    source_column = Column(String(255), nullable=False)
    target_table_id = Column(Integer, ForeignKey("tables.id", ondelete="CASCADE"), nullable=False)
    target_column = Column(String(255), nullable=False)
    relationship_type = Column(String(50), nullable=False)  # "lookup" | "foreignKey" | "match"


class ValueMapping(Base, TimestampMixin):
    """Value transformation mappings for matching"""
    __tablename__ = "value_mappings"

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    mappings = Column(JSON, nullable=False)  # {"source_val": "target_val", ...}
