from pydantic import BaseModel
from typing import Optional, Dict
from datetime import datetime


# ============ TableRelationship ============

class TableRelationshipCreate(BaseModel):
    name: Optional[str] = None
    source_table_key: str
    source_column: str
    target_table_key: str
    target_column: str
    relationship_type: str  # "lookup" | "foreignKey" | "match"


class TableRelationshipUpdate(BaseModel):
    name: Optional[str] = None
    source_column: Optional[str] = None
    target_column: Optional[str] = None
    relationship_type: Optional[str] = None


class TableRelationshipResponse(BaseModel):
    id: int
    name: Optional[str]
    source_table_key: str
    source_column: str
    target_table_key: str
    target_column: str
    relationship_type: str
    created_at: datetime

    class Config:
        from_attributes = True


# ============ ValueMapping ============

class ValueMappingCreate(BaseModel):
    name: str
    description: Optional[str] = None
    mappings: Dict[str, str]


class ValueMappingUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    mappings: Optional[Dict[str, str]] = None


class ValueMappingResponse(BaseModel):
    id: int
    name: str
    description: Optional[str]
    mappings: Dict[str, str]
    created_at: datetime

    class Config:
        from_attributes = True
