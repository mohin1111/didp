from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel

from ...database import get_db
from ...services.python_executor import PythonExecutorService

router = APIRouter(prefix="/python", tags=["Python Execution"])


class PythonExecuteRequest(BaseModel):
    script: str
    table_keys: Optional[List[str]] = None


class PythonExecuteResponse(BaseModel):
    output: str
    error: Optional[str] = None
    execution_time_ms: int
    result_columns: Optional[List[str]] = None
    result_data: Optional[List[List[str]]] = None


class TableInfo(BaseModel):
    key: str
    name: str
    columns: List[str]
    row_count: int


@router.post("/execute", response_model=PythonExecuteResponse)
async def execute_python(
    request: PythonExecuteRequest,
    db: Session = Depends(get_db)
):
    """
    Execute Python script with access to table data.

    The script has access to:
    - `pandas` as `pd`
    - `numpy` as `np`
    - `tables`: dict of DataFrames keyed by table_key

    To return data, set a `result` variable to a DataFrame or list.

    Example:
    ```python
    df = tables['my_table']
    result = df[df['amount'] > 1000]
    print(f"Found {len(result)} rows")
    ```
    """
    service = PythonExecutorService(db)
    result = service.execute_script(request.script, request.table_keys)

    return PythonExecuteResponse(
        output=result['output'],
        error=result['error'],
        execution_time_ms=result['execution_time_ms'],
        result_columns=result['result_columns'],
        result_data=result['result_data'],
    )


@router.get("/tables", response_model=List[TableInfo])
async def get_available_tables(db: Session = Depends(get_db)):
    """Get list of available tables for Python scripts"""
    service = PythonExecutorService(db)
    return service.get_available_tables()
