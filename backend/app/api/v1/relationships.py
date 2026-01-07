from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional

from ...database import get_db
from ...models import TableRelationship, Table
from ...schemas import (
    TableRelationshipCreate, TableRelationshipUpdate, TableRelationshipResponse
)

router = APIRouter(prefix="/relationships", tags=["Table Relationships"])


def get_table_id_by_key(db: Session, key: str) -> int:
    """Get table ID by key or raise 404"""
    table = db.query(Table).filter(Table.key == key).first()
    if not table:
        raise HTTPException(status_code=404, detail=f"Table '{key}' not found")
    return table.id


def get_table_key_by_id(db: Session, table_id: int) -> str:
    """Get table key by ID"""
    table = db.query(Table).filter(Table.id == table_id).first()
    return table.key if table else ""


def relationship_to_response(db: Session, rel: TableRelationship) -> TableRelationshipResponse:
    """Convert model to response"""
    return TableRelationshipResponse(
        id=rel.id,
        name=rel.name,
        source_table_key=get_table_key_by_id(db, rel.source_table_id),
        source_column=rel.source_column,
        target_table_key=get_table_key_by_id(db, rel.target_table_id),
        target_column=rel.target_column,
        relationship_type=rel.relationship_type,
        created_at=rel.created_at
    )


@router.get("/", response_model=List[TableRelationshipResponse])
async def list_relationships(
    table_key: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """List all relationships, optionally filtered by table"""
    query = db.query(TableRelationship)

    if table_key:
        table_id = get_table_id_by_key(db, table_key)
        query = query.filter(
            (TableRelationship.source_table_id == table_id) |
            (TableRelationship.target_table_id == table_id)
        )

    relationships = query.all()
    return [relationship_to_response(db, r) for r in relationships]


@router.get("/{id}", response_model=TableRelationshipResponse)
async def get_relationship(id: int, db: Session = Depends(get_db)):
    """Get a relationship by ID"""
    rel = db.query(TableRelationship).filter(TableRelationship.id == id).first()
    if not rel:
        raise HTTPException(status_code=404, detail="Relationship not found")
    return relationship_to_response(db, rel)


@router.post("/", response_model=TableRelationshipResponse, status_code=201)
async def create_relationship(
    data: TableRelationshipCreate,
    db: Session = Depends(get_db)
):
    """Create a new relationship between tables"""
    source_table_id = get_table_id_by_key(db, data.source_table_key)
    target_table_id = get_table_id_by_key(db, data.target_table_key)

    rel = TableRelationship(
        name=data.name,
        source_table_id=source_table_id,
        source_column=data.source_column,
        target_table_id=target_table_id,
        target_column=data.target_column,
        relationship_type=data.relationship_type
    )
    db.add(rel)
    db.commit()
    db.refresh(rel)

    return relationship_to_response(db, rel)


@router.put("/{id}", response_model=TableRelationshipResponse)
async def update_relationship(
    id: int,
    data: TableRelationshipUpdate,
    db: Session = Depends(get_db)
):
    """Update a relationship"""
    rel = db.query(TableRelationship).filter(TableRelationship.id == id).first()
    if not rel:
        raise HTTPException(status_code=404, detail="Relationship not found")

    if data.name is not None:
        rel.name = data.name
    if data.source_column is not None:
        rel.source_column = data.source_column
    if data.target_column is not None:
        rel.target_column = data.target_column
    if data.relationship_type is not None:
        rel.relationship_type = data.relationship_type

    db.commit()
    db.refresh(rel)

    return relationship_to_response(db, rel)


@router.delete("/{id}", status_code=204)
async def delete_relationship(id: int, db: Session = Depends(get_db)):
    """Delete a relationship"""
    rel = db.query(TableRelationship).filter(TableRelationship.id == id).first()
    if not rel:
        raise HTTPException(status_code=404, detail="Relationship not found")
    db.delete(rel)
    db.commit()
    return None
