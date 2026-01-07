from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional, List

from ...database import get_db
from ...models import Table, TableColumn, TableRow
from ...schemas import (
    TableCreate, TableUpdate, TableDataUpdate,
    TableSummaryResponse, TableDetailResponse, TableListResponse
)

router = APIRouter(prefix="/tables", tags=["Tables"])


def get_table_by_key(db: Session, key: str) -> Table:
    """Helper to get table by key or raise 404"""
    table = db.query(Table).filter(Table.key == key).first()
    if not table:
        raise HTTPException(status_code=404, detail=f"Table '{key}' not found")
    return table


def table_to_detail_response(table: Table) -> TableDetailResponse:
    """Convert Table model to detail response"""
    columns = [col.name for col in sorted(table.columns, key=lambda c: c.index)]
    data = [row.data for row in sorted(table.data_rows, key=lambda r: r.row_index)]
    return TableDetailResponse(
        id=table.id,
        key=table.key,
        name=table.name,
        category=table.category,
        source_type=table.source_type,
        file_name=table.file_name,
        sheet_name=table.sheet_name,
        columns=columns,
        data=data,
        row_count=table.row_count,
        created_at=table.created_at,
        updated_at=table.updated_at
    )


def table_to_summary_response(table: Table) -> TableSummaryResponse:
    """Convert Table model to summary response"""
    return TableSummaryResponse(
        id=table.id,
        key=table.key,
        name=table.name,
        category=table.category,
        source_type=table.source_type,
        row_count=table.row_count,
        column_count=len(table.columns),
        created_at=table.created_at,
        updated_at=table.updated_at
    )


@router.get("/", response_model=TableListResponse)
async def list_tables(
    category: Optional[str] = None,
    source_type: Optional[str] = None,
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=500),
    db: Session = Depends(get_db)
):
    """List all tables with optional filtering"""
    query = db.query(Table)

    if category:
        query = query.filter(Table.category == category)
    if source_type:
        query = query.filter(Table.source_type == source_type)

    total = query.count()
    tables = query.offset(skip).limit(limit).all()

    return TableListResponse(
        tables=[table_to_summary_response(t) for t in tables],
        total=total
    )


@router.get("/{key}", response_model=TableDetailResponse)
async def get_table(key: str, db: Session = Depends(get_db)):
    """Get full table details including columns and data"""
    table = get_table_by_key(db, key)
    return table_to_detail_response(table)


@router.post("/", response_model=TableDetailResponse, status_code=201)
async def create_table(table_data: TableCreate, db: Session = Depends(get_db)):
    """Create a new table"""
    # Check if key already exists
    existing = db.query(Table).filter(Table.key == table_data.key).first()
    if existing:
        raise HTTPException(status_code=400, detail=f"Table with key '{table_data.key}' already exists")

    # Create table
    table = Table(
        key=table_data.key,
        name=table_data.name,
        category=table_data.category,
        source_type="master",
        row_count=len(table_data.data)
    )
    db.add(table)
    db.flush()

    # Create columns
    for idx, col_name in enumerate(table_data.columns):
        column = TableColumn(table_id=table.id, index=idx, name=col_name)
        db.add(column)

    # Create rows
    for row_idx, row_data in enumerate(table_data.data):
        row = TableRow(table_id=table.id, row_index=row_idx, data=row_data)
        db.add(row)

    db.commit()
    db.refresh(table)

    return table_to_detail_response(table)


@router.put("/{key}", response_model=TableDetailResponse)
async def update_table(key: str, table_data: TableUpdate, db: Session = Depends(get_db)):
    """Update table metadata and/or data"""
    table = get_table_by_key(db, key)

    if table_data.name is not None:
        table.name = table_data.name
    if table_data.category is not None:
        table.category = table_data.category

    if table_data.columns is not None and table_data.data is not None:
        # Delete existing columns and rows
        db.query(TableColumn).filter(TableColumn.table_id == table.id).delete()
        db.query(TableRow).filter(TableRow.table_id == table.id).delete()

        # Create new columns
        for idx, col_name in enumerate(table_data.columns):
            column = TableColumn(table_id=table.id, index=idx, name=col_name)
            db.add(column)

        # Create new rows
        for row_idx, row_data in enumerate(table_data.data):
            row = TableRow(table_id=table.id, row_index=row_idx, data=row_data)
            db.add(row)

        table.row_count = len(table_data.data)

    db.commit()
    db.refresh(table)

    return table_to_detail_response(table)


@router.put("/{key}/data", response_model=TableDetailResponse)
async def update_table_data(key: str, data: TableDataUpdate, db: Session = Depends(get_db)):
    """Override table data (columns and rows)"""
    table = get_table_by_key(db, key)

    # Delete existing columns and rows
    db.query(TableColumn).filter(TableColumn.table_id == table.id).delete()
    db.query(TableRow).filter(TableRow.table_id == table.id).delete()

    # Create new columns
    for idx, col_name in enumerate(data.columns):
        column = TableColumn(table_id=table.id, index=idx, name=col_name)
        db.add(column)

    # Create new rows
    for row_idx, row_data in enumerate(data.data):
        row = TableRow(table_id=table.id, row_index=row_idx, data=row_data)
        db.add(row)

    table.row_count = len(data.data)

    db.commit()
    db.refresh(table)

    return table_to_detail_response(table)


@router.delete("/{key}", status_code=204)
async def delete_table(key: str, db: Session = Depends(get_db)):
    """Delete a table and all its data"""
    table = get_table_by_key(db, key)
    db.delete(table)
    db.commit()
    return None
