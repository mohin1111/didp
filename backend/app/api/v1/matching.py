from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional

from ...database import get_db
from ...models import MatchConfig, MatchResult, Table
from ...schemas import MatchExecuteRequest, MatchResultResponse, MatchedPair, UnmatchedRow
from ...services.matching_service import MatchingService

router = APIRouter(prefix="/matching", tags=["Match Execution"])


def get_table_key_by_id(db: Session, table_id: int) -> str:
    """Get table key by ID"""
    table = db.query(Table).filter(Table.id == table_id).first()
    return table.key if table else ""


def result_to_response(db: Session, result: MatchResult) -> MatchResultResponse:
    """Convert model to response"""
    config = result.config
    return MatchResultResponse(
        id=result.id,
        config_id=result.config_id,
        config_name=config.name if config else "",
        source_table_key=get_table_key_by_id(db, config.source_table_id) if config else "",
        target_table_key=get_table_key_by_id(db, config.target_table_id) if config else "",
        matched_count=result.matched_count,
        unmatched_source_count=result.unmatched_source_count,
        unmatched_target_count=result.unmatched_target_count,
        matched_pairs=[
            MatchedPair(
                source_row_index=p["source_row_index"],
                target_row_index=p["target_row_index"],
                source_row=p["source_row"],
                target_row=p["target_row"]
            )
            for p in result.matched_pairs
        ],
        unmatched_source=[
            UnmatchedRow(row_index=r["row_index"], row=r["row"])
            for r in result.unmatched_source
        ],
        unmatched_target=[
            UnmatchedRow(row_index=r["row_index"], row=r["row"])
            for r in result.unmatched_target
        ],
        created_at=result.created_at
    )


@router.post("/execute", response_model=MatchResultResponse)
async def execute_match(
    request: MatchExecuteRequest,
    db: Session = Depends(get_db)
):
    """Execute matching based on a saved config"""
    config = db.query(MatchConfig).filter(MatchConfig.id == request.config_id).first()
    if not config:
        raise HTTPException(status_code=404, detail="Match config not found")

    service = MatchingService(db)
    result = service.execute_match(config)

    return result_to_response(db, result)


@router.get("/results", response_model=List[MatchResultResponse])
async def list_match_results(
    config_id: Optional[int] = None,
    limit: int = Query(10, ge=1, le=100),
    db: Session = Depends(get_db)
):
    """Get history of match results"""
    query = db.query(MatchResult).order_by(MatchResult.created_at.desc())

    if config_id:
        query = query.filter(MatchResult.config_id == config_id)

    results = query.limit(limit).all()
    return [result_to_response(db, r) for r in results]


@router.get("/results/{id}", response_model=MatchResultResponse)
async def get_match_result(id: int, db: Session = Depends(get_db)):
    """Get a match result by ID"""
    result = db.query(MatchResult).filter(MatchResult.id == id).first()
    if not result:
        raise HTTPException(status_code=404, detail="Match result not found")
    return result_to_response(db, result)


@router.delete("/results/{id}", status_code=204)
async def delete_match_result(id: int, db: Session = Depends(get_db)):
    """Delete a match result"""
    result = db.query(MatchResult).filter(MatchResult.id == id).first()
    if not result:
        raise HTTPException(status_code=404, detail="Match result not found")
    db.delete(result)
    db.commit()
    return None
