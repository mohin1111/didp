from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime


# ============ Request Schemas ============

class TableCreate(BaseModel):
    key: str = Field(..., min_length=1, max_length=255)
    name: str = Field(..., min_length=1, max_length=255)
    category: Optional[str] = None
    columns: List[str]
    data: List[List[str]]


class TableUpdate(BaseModel):
    name: Optional[str] = None
    category: Optional[str] = None
    columns: Optional[List[str]] = None
    data: Optional[List[List[str]]] = None


class TableDataUpdate(BaseModel):
    """Update only the data of a table (override)"""
    columns: List[str]
    data: List[List[str]]


# ============ Response Schemas ============

class TableSummaryResponse(BaseModel):
    id: int
    key: str
    name: str
    category: Optional[str]
    source_type: str
    row_count: int
    column_count: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class TableDetailResponse(BaseModel):
    id: int
    key: str
    name: str
    category: Optional[str]
    source_type: str
    file_name: Optional[str]
    sheet_name: Optional[str]
    columns: List[str]
    data: List[List[str]]
    row_count: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class TableListResponse(BaseModel):
    tables: List[TableSummaryResponse]
    total: int
