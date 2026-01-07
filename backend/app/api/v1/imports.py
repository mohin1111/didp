from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException
from sqlalchemy.orm import Session
from typing import Optional, List
import uuid

from ...database import get_db
from ...services.import_service import ImportService
from ...schemas import TableDetailResponse
from ..v1.tables import table_to_detail_response

router = APIRouter(prefix="/imports", tags=["File Import"])


@router.post("/upload")
async def upload_file(
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    """
    Upload Excel/CSV file and return preview data.
    Returns: file_id, sheets (for Excel), columns, preview rows, has_headers
    """
    if not file.filename:
        raise HTTPException(status_code=400, detail="No file provided")

    # Check file extension
    filename = file.filename.lower()
    if not (filename.endswith('.xlsx') or filename.endswith('.xls') or filename.endswith('.csv')):
        raise HTTPException(
            status_code=400,
            detail="Invalid file type. Supported: .xlsx, .xls, .csv"
        )

    content = await file.read()
    service = ImportService(db)

    try:
        result = service.process_upload(content, file.filename)
        return result
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/preview")
async def preview_sheet(
    file_id: str = Form(...),
    sheet_name: Optional[str] = Form(None),
    has_headers: bool = Form(True),
    db: Session = Depends(get_db)
):
    """Get preview data for a specific sheet with header detection"""
    service = ImportService(db)

    try:
        result = service.get_sheet_preview(file_id, sheet_name, has_headers)
        return result
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/confirm", response_model=TableDetailResponse)
async def confirm_import(
    file_id: str = Form(...),
    table_key: str = Form(...),
    table_name: str = Form(...),
    sheet_name: Optional[str] = Form(None),
    has_headers: bool = Form(True),
    category: Optional[str] = Form(None),
    db: Session = Depends(get_db)
):
    """Confirm import and create table from uploaded file"""
    service = ImportService(db)

    try:
        table = service.confirm_import(
            file_id=file_id,
            table_key=table_key,
            table_name=table_name,
            sheet_name=sheet_name,
            has_headers=has_headers,
            category=category
        )
        return table_to_detail_response(table)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
