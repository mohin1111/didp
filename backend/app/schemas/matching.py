from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


# ============ MatchConfig ============

class MatchColumnCreate(BaseModel):
    source_column: str
    target_column: str
    value_mapping_id: Optional[int] = None
    case_sensitive: bool = False


class MatchColumnResponse(BaseModel):
    id: int
    source_column: str
    target_column: str
    value_mapping_id: Optional[int]
    case_sensitive: bool

    class Config:
        from_attributes = True


class MatchConfigCreate(BaseModel):
    name: str
    source_table_key: str
    target_table_key: str
    match_columns: List[MatchColumnCreate]


class MatchConfigUpdate(BaseModel):
    name: Optional[str] = None
    match_columns: Optional[List[MatchColumnCreate]] = None


class MatchConfigResponse(BaseModel):
    id: int
    name: str
    source_table_key: str
    target_table_key: str
    match_columns: List[MatchColumnResponse]
    created_at: datetime

    class Config:
        from_attributes = True


# ============ MatchResult ============

class MatchedPair(BaseModel):
    source_row_index: int
    target_row_index: int
    source_row: List[str]
    target_row: List[str]


class UnmatchedRow(BaseModel):
    row_index: int
    row: List[str]


class MatchResultResponse(BaseModel):
    id: int
    config_id: int
    config_name: str
    source_table_key: str
    target_table_key: str
    matched_count: int
    unmatched_source_count: int
    unmatched_target_count: int
    matched_pairs: List[MatchedPair]
    unmatched_source: List[UnmatchedRow]
    unmatched_target: List[UnmatchedRow]
    created_at: datetime

    class Config:
        from_attributes = True


class MatchExecuteRequest(BaseModel):
    config_id: int
