from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from ...database import get_db
from ...models import ValueMapping
from ...schemas import ValueMappingCreate, ValueMappingUpdate, ValueMappingResponse

router = APIRouter(prefix="/value-mappings", tags=["Value Mappings"])


@router.get("/", response_model=List[ValueMappingResponse])
async def list_value_mappings(db: Session = Depends(get_db)):
    """List all value mappings"""
    mappings = db.query(ValueMapping).all()
    return mappings


@router.get("/{id}", response_model=ValueMappingResponse)
async def get_value_mapping(id: int, db: Session = Depends(get_db)):
    """Get a value mapping by ID"""
    mapping = db.query(ValueMapping).filter(ValueMapping.id == id).first()
    if not mapping:
        raise HTTPException(status_code=404, detail="Value mapping not found")
    return mapping


@router.post("/", response_model=ValueMappingResponse, status_code=201)
async def create_value_mapping(
    data: ValueMappingCreate,
    db: Session = Depends(get_db)
):
    """Create a new value mapping"""
    mapping = ValueMapping(
        name=data.name,
        description=data.description,
        mappings=data.mappings
    )
    db.add(mapping)
    db.commit()
    db.refresh(mapping)
    return mapping


@router.put("/{id}", response_model=ValueMappingResponse)
async def update_value_mapping(
    id: int,
    data: ValueMappingUpdate,
    db: Session = Depends(get_db)
):
    """Update a value mapping"""
    mapping = db.query(ValueMapping).filter(ValueMapping.id == id).first()
    if not mapping:
        raise HTTPException(status_code=404, detail="Value mapping not found")

    if data.name is not None:
        mapping.name = data.name
    if data.description is not None:
        mapping.description = data.description
    if data.mappings is not None:
        mapping.mappings = data.mappings

    db.commit()
    db.refresh(mapping)
    return mapping


@router.delete("/{id}", status_code=204)
async def delete_value_mapping(id: int, db: Session = Depends(get_db)):
    """Delete a value mapping"""
    mapping = db.query(ValueMapping).filter(ValueMapping.id == id).first()
    if not mapping:
        raise HTTPException(status_code=404, detail="Value mapping not found")
    db.delete(mapping)
    db.commit()
    return None


@router.post("/{id}/apply")
async def apply_mapping(id: int, value: str, db: Session = Depends(get_db)):
    """Apply mapping to transform a single value"""
    mapping = db.query(ValueMapping).filter(ValueMapping.id == id).first()
    if not mapping:
        raise HTTPException(status_code=404, detail="Value mapping not found")

    transformed = mapping.mappings.get(value, value)
    return {"original": value, "transformed": transformed}


@router.post("/{id}/reverse")
async def reverse_mapping(id: int, value: str, db: Session = Depends(get_db)):
    """Reverse lookup in mapping"""
    mapping = db.query(ValueMapping).filter(ValueMapping.id == id).first()
    if not mapping:
        raise HTTPException(status_code=404, detail="Value mapping not found")

    # Reverse lookup
    reverse_map = {v: k for k, v in mapping.mappings.items()}
    original = reverse_map.get(value, value)
    return {"transformed": value, "original": original}
