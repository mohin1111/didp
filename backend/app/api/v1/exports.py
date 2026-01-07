from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from typing import List, Dict
from pydantic import BaseModel

from ...database import get_db
from ...schemas import ExportRequest
from ...services.export_service import ExportService

router = APIRouter(prefix="/exports", tags=["Data Export"])


class SqlExportRequest(BaseModel):
    columns: List[str]
    data: List[List[str]]


class ComparisonRow(BaseModel):
    table_key: str
    row_index: int
    data: List[str]


class ComparisonExportRequest(BaseModel):
    rows: List[ComparisonRow]
    table_names: Dict[str, str]


@router.post("/excel")
async def export_to_excel(
    request: ExportRequest,
    db: Session = Depends(get_db)
):
    """Export selected tables to Excel file"""
    if not request.table_keys:
        raise HTTPException(status_code=400, detail="No tables specified for export")

    service = ExportService(db)

    try:
        output = service.export_tables_to_excel(
            request.table_keys,
            request.include_headers
        )

        return StreamingResponse(
            output,
            media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            headers={
                "Content-Disposition": "attachment; filename=DIDP_Export.xlsx"
            }
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/csv/{table_key}")
async def export_to_csv(
    table_key: str,
    db: Session = Depends(get_db)
):
    """Export single table to CSV"""
    service = ExportService(db)

    try:
        output = service.export_table_to_csv(table_key)

        return StreamingResponse(
            output,
            media_type="text/csv",
            headers={
                "Content-Disposition": f"attachment; filename={table_key}.csv"
            }
        )
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/match-results/{result_id}")
async def export_match_results(
    result_id: int,
    include_matched: bool = True,
    include_unmatched: bool = True,
    db: Session = Depends(get_db)
):
    """Export match results to Excel"""
    service = ExportService(db)

    try:
        output = service.export_match_results(
            result_id,
            include_matched,
            include_unmatched
        )

        return StreamingResponse(
            output,
            media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            headers={
                "Content-Disposition": f"attachment; filename=match_results_{result_id}.xlsx"
            }
        )
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/sql-results")
async def export_sql_results(
    request: SqlExportRequest,
    db: Session = Depends(get_db)
):
    """Export SQL query results to Excel"""
    if not request.columns or not request.data:
        raise HTTPException(status_code=400, detail="No data to export")

    service = ExportService(db)

    try:
        output = service.export_sql_results(
            request.columns,
            request.data
        )

        return StreamingResponse(
            output,
            media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            headers={
                "Content-Disposition": "attachment; filename=DIDP_SQL_Results.xlsx"
            }
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/comparison")
async def export_comparison(
    request: ComparisonExportRequest,
    db: Session = Depends(get_db)
):
    """Export comparison rows to Excel"""
    if not request.rows:
        raise HTTPException(status_code=400, detail="No rows to export")

    service = ExportService(db)

    try:
        rows_data = [row.model_dump() for row in request.rows]
        output = service.export_comparison(rows_data, request.table_names)

        return StreamingResponse(
            output,
            media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            headers={
                "Content-Disposition": "attachment; filename=DIDP_Comparison.xlsx"
            }
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
