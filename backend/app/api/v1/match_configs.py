from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from ...database import get_db
from ...models import MatchConfig, MatchColumn, Table
from ...schemas import (
    MatchConfigCreate, MatchConfigUpdate, MatchConfigResponse, MatchColumnResponse
)

router = APIRouter(prefix="/match-configs", tags=["Match Configurations"])


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


def config_to_response(db: Session, config: MatchConfig) -> MatchConfigResponse:
    """Convert model to response"""
    return MatchConfigResponse(
        id=config.id,
        name=config.name,
        source_table_key=get_table_key_by_id(db, config.source_table_id),
        target_table_key=get_table_key_by_id(db, config.target_table_id),
        match_columns=[
            MatchColumnResponse(
                id=col.id,
                source_column=col.source_column,
                target_column=col.target_column,
                value_mapping_id=col.value_mapping_id,
                case_sensitive=col.case_sensitive
            )
            for col in config.match_columns
        ],
        created_at=config.created_at
    )


@router.get("/", response_model=List[MatchConfigResponse])
async def list_match_configs(db: Session = Depends(get_db)):
    """List all match configurations"""
    configs = db.query(MatchConfig).all()
    return [config_to_response(db, c) for c in configs]


@router.get("/{id}", response_model=MatchConfigResponse)
async def get_match_config(id: int, db: Session = Depends(get_db)):
    """Get a match config by ID"""
    config = db.query(MatchConfig).filter(MatchConfig.id == id).first()
    if not config:
        raise HTTPException(status_code=404, detail="Match config not found")
    return config_to_response(db, config)


@router.post("/", response_model=MatchConfigResponse, status_code=201)
async def create_match_config(
    data: MatchConfigCreate,
    db: Session = Depends(get_db)
):
    """Create a new match configuration"""
    source_table_id = get_table_id_by_key(db, data.source_table_key)
    target_table_id = get_table_id_by_key(db, data.target_table_key)

    config = MatchConfig(
        name=data.name,
        source_table_id=source_table_id,
        target_table_id=target_table_id
    )
    db.add(config)
    db.flush()

    # Add match columns
    for col_data in data.match_columns:
        col = MatchColumn(
            config_id=config.id,
            source_column=col_data.source_column,
            target_column=col_data.target_column,
            value_mapping_id=col_data.value_mapping_id,
            case_sensitive=col_data.case_sensitive
        )
        db.add(col)

    db.commit()
    db.refresh(config)

    return config_to_response(db, config)


@router.put("/{id}", response_model=MatchConfigResponse)
async def update_match_config(
    id: int,
    data: MatchConfigUpdate,
    db: Session = Depends(get_db)
):
    """Update a match configuration"""
    config = db.query(MatchConfig).filter(MatchConfig.id == id).first()
    if not config:
        raise HTTPException(status_code=404, detail="Match config not found")

    if data.name is not None:
        config.name = data.name

    if data.match_columns is not None:
        # Delete existing columns
        db.query(MatchColumn).filter(MatchColumn.config_id == config.id).delete()

        # Add new columns
        for col_data in data.match_columns:
            col = MatchColumn(
                config_id=config.id,
                source_column=col_data.source_column,
                target_column=col_data.target_column,
                value_mapping_id=col_data.value_mapping_id,
                case_sensitive=col_data.case_sensitive
            )
            db.add(col)

    db.commit()
    db.refresh(config)

    return config_to_response(db, config)


@router.delete("/{id}", status_code=204)
async def delete_match_config(id: int, db: Session = Depends(get_db)):
    """Delete a match configuration"""
    config = db.query(MatchConfig).filter(MatchConfig.id == id).first()
    if not config:
        raise HTTPException(status_code=404, detail="Match config not found")
    db.delete(config)
    db.commit()
    return None
