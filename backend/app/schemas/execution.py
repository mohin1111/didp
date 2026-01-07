from pydantic import BaseModel
from typing import Optional, List, Dict, Any


# ============ SQL Execution ============

class SqlExecuteRequest(BaseModel):
    query: str
    table_keys: Optional[List[str]] = None


class SqlExecuteResponse(BaseModel):
    columns: List[str]
    data: List[List[Any]]
    row_count: int
    execution_time_ms: int
    error: Optional[str] = None


# ============ Python Execution ============

class PythonExecuteRequest(BaseModel):
    script: str
    table_keys: Optional[List[str]] = None


class PythonExecuteResponse(BaseModel):
    output: str
    error: Optional[str] = None
    execution_time_ms: int
    result_data: Optional[Dict[str, Any]] = None


# ============ Export ============

class ExportRequest(BaseModel):
    table_keys: List[str]
    format: str = "xlsx"  # "xlsx" | "csv"
    include_headers: bool = True
