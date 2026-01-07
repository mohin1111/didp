from sqlalchemy import Column, Integer, String, Text, JSON, ForeignKey
from sqlalchemy.orm import relationship
from .base import Base, TimestampMixin


class SavedProcess(Base, TimestampMixin):
    """User-saved process configurations"""
    __tablename__ = "saved_processes"

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    process_type = Column(String(100), nullable=False)
    config = Column(JSON, nullable=False)


class ProcessChain(Base, TimestampMixin):
    """Saved process chain (sequence of steps)"""
    __tablename__ = "process_chains"

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)

    steps = relationship("ProcessChainStep", back_populates="chain", cascade="all, delete-orphan", order_by="ProcessChainStep.order")


class ProcessChainStep(Base):
    """Individual step in a process chain"""
    __tablename__ = "process_chain_steps"

    id = Column(Integer, primary_key=True, autoincrement=True)
    chain_id = Column(Integer, ForeignKey("process_chains.id", ondelete="CASCADE"), nullable=False)
    order = Column(Integer, nullable=False)
    process_type = Column(String(100), nullable=False)
    config = Column(JSON, nullable=False)

    chain = relationship("ProcessChain", back_populates="steps")
