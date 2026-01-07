from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import datetime


# ============ SavedProcess ============

class SavedProcessCreate(BaseModel):
    name: str
    description: Optional[str] = None
    process_type: str
    config: Dict[str, Any]


class SavedProcessUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    config: Optional[Dict[str, Any]] = None


class SavedProcessResponse(BaseModel):
    id: int
    name: str
    description: Optional[str]
    process_type: str
    config: Dict[str, Any]
    created_at: datetime

    class Config:
        from_attributes = True


# ============ ProcessChain ============

class ProcessChainStepCreate(BaseModel):
    process_type: str
    config: Dict[str, Any]


class ProcessChainStepResponse(BaseModel):
    id: int
    order: int
    process_type: str
    config: Dict[str, Any]

    class Config:
        from_attributes = True


class ProcessChainCreate(BaseModel):
    name: str
    description: Optional[str] = None
    steps: List[ProcessChainStepCreate]


class ProcessChainResponse(BaseModel):
    id: int
    name: str
    description: Optional[str]
    steps: List[ProcessChainStepResponse]
    created_at: datetime

    class Config:
        from_attributes = True
