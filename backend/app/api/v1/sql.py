from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ...database import get_db
from ...schemas import SqlExecuteRequest, SqlExecuteResponse
from ...services.sql_executor import SqlExecutorService

router = APIRouter(prefix="/sql", tags=["SQL Execution"])


@router.post("/execute", response_model=SqlExecuteResponse)
async def execute_sql(
    request: SqlExecuteRequest,
    db: Session = Depends(get_db)
):
    """Execute SQL query against imported tables"""
    service = SqlExecutorService(db)

    try:
        result = service.execute_query(request.query, request.table_keys)
        return result
    except Exception as e:
        return SqlExecuteResponse(
            columns=[],
            data=[],
            row_count=0,
            execution_time_ms=0,
            error=str(e)
        )


@router.get("/schema")
async def get_sql_schema(db: Session = Depends(get_db)):
    """Generate SQL DDL schema for all tables"""
    service = SqlExecutorService(db)
    schema = service.generate_ddl_schema()
    return {"schema": schema}
