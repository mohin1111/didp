from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, JSON
from sqlalchemy.orm import relationship
from .base import Base, TimestampMixin


class MatchConfig(Base, TimestampMixin):
    """Configuration for matching between two tables"""
    __tablename__ = "match_configs"

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(255), nullable=False)
    source_table_id = Column(Integer, ForeignKey("tables.id", ondelete="CASCADE"), nullable=False)
    target_table_id = Column(Integer, ForeignKey("tables.id", ondelete="CASCADE"), nullable=False)

    # Relationships
    match_columns = relationship("MatchColumn", back_populates="config", cascade="all, delete-orphan")
    results = relationship("MatchResult", back_populates="config", cascade="all, delete-orphan", order_by="MatchResult.created_at.desc()")


class MatchColumn(Base):
    """Column matching rules within a MatchConfig"""
    __tablename__ = "match_columns"

    id = Column(Integer, primary_key=True, autoincrement=True)
    config_id = Column(Integer, ForeignKey("match_configs.id", ondelete="CASCADE"), nullable=False)
    source_column = Column(String(255), nullable=False)
    target_column = Column(String(255), nullable=False)
    value_mapping_id = Column(Integer, ForeignKey("value_mappings.id", ondelete="SET NULL"), nullable=True)
    case_sensitive = Column(Boolean, default=False)

    config = relationship("MatchConfig", back_populates="match_columns")


class MatchResult(Base, TimestampMixin):
    """Stored results of a match execution"""
    __tablename__ = "match_results"

    id = Column(Integer, primary_key=True, autoincrement=True)
    config_id = Column(Integer, ForeignKey("match_configs.id", ondelete="CASCADE"), nullable=False)
    matched_count = Column(Integer, nullable=False)
    unmatched_source_count = Column(Integer, nullable=False)
    unmatched_target_count = Column(Integer, nullable=False)
    matched_pairs = Column(JSON, nullable=False)
    unmatched_source = Column(JSON, nullable=False)
    unmatched_target = Column(JSON, nullable=False)

    config = relationship("MatchConfig", back_populates="results")
