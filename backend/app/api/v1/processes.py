from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from ...database import get_db
from ...models import SavedProcess, ProcessChain, ProcessChainStep
from ...schemas import (
    SavedProcessCreate, SavedProcessUpdate, SavedProcessResponse,
    ProcessChainCreate, ProcessChainResponse, ProcessChainStepResponse
)

router = APIRouter(prefix="/processes", tags=["Saved Processes"])


# ============ Process Chains ============
# NOTE: Chain routes must come BEFORE /{id} routes to avoid path conflicts

def chain_to_response(chain: ProcessChain) -> ProcessChainResponse:
    """Convert model to response"""
    return ProcessChainResponse(
        id=chain.id,
        name=chain.name,
        description=chain.description,
        steps=[
            ProcessChainStepResponse(
                id=step.id,
                order=step.order,
                process_type=step.process_type,
                config=step.config
            )
            for step in sorted(chain.steps, key=lambda s: s.order)
        ],
        created_at=chain.created_at
    )


@router.get("/chains", response_model=List[ProcessChainResponse])
async def list_process_chains(db: Session = Depends(get_db)):
    """List all process chains"""
    chains = db.query(ProcessChain).all()
    return [chain_to_response(c) for c in chains]


@router.get("/chains/{id}", response_model=ProcessChainResponse)
async def get_process_chain(id: int, db: Session = Depends(get_db)):
    """Get a process chain by ID"""
    chain = db.query(ProcessChain).filter(ProcessChain.id == id).first()
    if not chain:
        raise HTTPException(status_code=404, detail="Process chain not found")
    return chain_to_response(chain)


@router.post("/chains", response_model=ProcessChainResponse, status_code=201)
async def create_process_chain(
    data: ProcessChainCreate,
    db: Session = Depends(get_db)
):
    """Create a new process chain"""
    chain = ProcessChain(
        name=data.name,
        description=data.description
    )
    db.add(chain)
    db.flush()

    # Add steps
    for idx, step_data in enumerate(data.steps):
        step = ProcessChainStep(
            chain_id=chain.id,
            order=idx,
            process_type=step_data.process_type,
            config=step_data.config
        )
        db.add(step)

    db.commit()
    db.refresh(chain)

    return chain_to_response(chain)


@router.put("/chains/{id}", response_model=ProcessChainResponse)
async def update_process_chain(
    id: int,
    data: ProcessChainCreate,
    db: Session = Depends(get_db)
):
    """Update a process chain"""
    chain = db.query(ProcessChain).filter(ProcessChain.id == id).first()
    if not chain:
        raise HTTPException(status_code=404, detail="Process chain not found")

    chain.name = data.name
    chain.description = data.description

    # Delete existing steps
    db.query(ProcessChainStep).filter(ProcessChainStep.chain_id == chain.id).delete()

    # Add new steps
    for idx, step_data in enumerate(data.steps):
        step = ProcessChainStep(
            chain_id=chain.id,
            order=idx,
            process_type=step_data.process_type,
            config=step_data.config
        )
        db.add(step)

    db.commit()
    db.refresh(chain)

    return chain_to_response(chain)


@router.delete("/chains/{id}", status_code=204)
async def delete_process_chain(id: int, db: Session = Depends(get_db)):
    """Delete a process chain"""
    chain = db.query(ProcessChain).filter(ProcessChain.id == id).first()
    if not chain:
        raise HTTPException(status_code=404, detail="Process chain not found")
    db.delete(chain)
    db.commit()
    return None


# ============ Saved Processes ============

@router.get("/", response_model=List[SavedProcessResponse])
async def list_saved_processes(db: Session = Depends(get_db)):
    """List all saved processes"""
    processes = db.query(SavedProcess).all()
    return processes


@router.get("/{id}", response_model=SavedProcessResponse)
async def get_saved_process(id: int, db: Session = Depends(get_db)):
    """Get a saved process by ID"""
    process = db.query(SavedProcess).filter(SavedProcess.id == id).first()
    if not process:
        raise HTTPException(status_code=404, detail="Process not found")
    return process


@router.post("/", response_model=SavedProcessResponse, status_code=201)
async def create_saved_process(
    data: SavedProcessCreate,
    db: Session = Depends(get_db)
):
    """Create a new saved process"""
    process = SavedProcess(
        name=data.name,
        description=data.description,
        process_type=data.process_type,
        config=data.config
    )
    db.add(process)
    db.commit()
    db.refresh(process)
    return process


@router.put("/{id}", response_model=SavedProcessResponse)
async def update_saved_process(
    id: int,
    data: SavedProcessUpdate,
    db: Session = Depends(get_db)
):
    """Update a saved process"""
    process = db.query(SavedProcess).filter(SavedProcess.id == id).first()
    if not process:
        raise HTTPException(status_code=404, detail="Process not found")

    if data.name is not None:
        process.name = data.name
    if data.description is not None:
        process.description = data.description
    if data.config is not None:
        process.config = data.config

    db.commit()
    db.refresh(process)
    return process


@router.delete("/{id}", status_code=204)
async def delete_saved_process(id: int, db: Session = Depends(get_db)):
    """Delete a saved process"""
    process = db.query(SavedProcess).filter(SavedProcess.id == id).first()
    if not process:
        raise HTTPException(status_code=404, detail="Process not found")
    db.delete(process)
    db.commit()
    return None
