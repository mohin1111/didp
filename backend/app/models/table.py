from sqlalchemy import Column, Integer, String, Text, ForeignKey, JSON, Index
from sqlalchemy.orm import relationship
from .base import Base, TimestampMixin


class Table(Base, TimestampMixin):
    """Represents a logical table (master or imported)"""
    __tablename__ = "tables"

    id = Column(Integer, primary_key=True, autoincrement=True)
    key = Column(String(255), unique=True, nullable=False, index=True)
    name = Column(String(255), nullable=False)
    category = Column(String(100), nullable=True)
    source_type = Column(String(50), nullable=False)  # "master" | "imported"
    file_name = Column(String(255), nullable=True)
    sheet_name = Column(String(255), nullable=True)
    row_count = Column(Integer, default=0)
    metadata_json = Column(JSON, nullable=True)

    # Relationships
    columns = relationship("TableColumn", back_populates="table", cascade="all, delete-orphan", order_by="TableColumn.index")
    data_rows = relationship("TableRow", back_populates="table", cascade="all, delete-orphan", order_by="TableRow.row_index")


class TableColumn(Base):
    """Column definitions for a table"""
    __tablename__ = "table_columns"

    id = Column(Integer, primary_key=True, autoincrement=True)
    table_id = Column(Integer, ForeignKey("tables.id", ondelete="CASCADE"), nullable=False)
    index = Column(Integer, nullable=False)
    name = Column(String(255), nullable=False)
    data_type = Column(String(50), default="string")

    table = relationship("Table", back_populates="columns")


class TableRow(Base):
    """Row data stored as JSON array"""
    __tablename__ = "table_rows"

    id = Column(Integer, primary_key=True, autoincrement=True)
    table_id = Column(Integer, ForeignKey("tables.id", ondelete="CASCADE"), nullable=False)
    row_index = Column(Integer, nullable=False)
    data = Column(JSON, nullable=False)

    table = relationship("Table", back_populates="data_rows")

    __table_args__ = (
        Index('ix_table_rows_table_row', 'table_id', 'row_index'),
    )
