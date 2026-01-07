from typing import List, Dict, Optional
from sqlalchemy.orm import Session

from ..models import MatchConfig, MatchColumn, MatchResult, Table, TableColumn, TableRow, ValueMapping


class MatchingService:
    """Service for executing data matching between tables"""

    def __init__(self, db: Session):
        self.db = db

    def execute_match(self, config: MatchConfig) -> MatchResult:
        """
        Execute matching between source and target tables.

        Algorithm:
        1. Load source and target table data
        2. Build index of target rows by match key
        3. For each source row, create match key and lookup in target index
        4. Track matched pairs and unmatched rows
        5. Store and return results
        """
        # Load source table data
        source_table = self.db.query(Table).filter(Table.id == config.source_table_id).first()
        target_table = self.db.query(Table).filter(Table.id == config.target_table_id).first()

        if not source_table or not target_table:
            raise ValueError("Source or target table not found")

        source_columns = [c.name for c in sorted(source_table.columns, key=lambda x: x.index)]
        target_columns = [c.name for c in sorted(target_table.columns, key=lambda x: x.index)]

        source_rows = [(r.row_index, r.data) for r in sorted(source_table.data_rows, key=lambda x: x.row_index)]
        target_rows = [(r.row_index, r.data) for r in sorted(target_table.data_rows, key=lambda x: x.row_index)]

        # Build target index
        target_index: Dict[str, List[tuple]] = {}
        for row_idx, row_data in target_rows:
            key = self._create_match_key(
                row_data, target_columns, config.match_columns, is_source=False
            )
            if key not in target_index:
                target_index[key] = []
            target_index[key].append((row_idx, row_data))

        # Match source rows against target
        matched_pairs = []
        unmatched_source = []
        matched_target_indices = set()

        for source_row_idx, source_row_data in source_rows:
            key = self._create_match_key(
                source_row_data, source_columns, config.match_columns, is_source=True
            )

            if key in target_index and target_index[key]:
                # Found a match - take first matching target row
                target_row_idx, target_row_data = target_index[key][0]
                matched_pairs.append({
                    "source_row_index": source_row_idx,
                    "target_row_index": target_row_idx,
                    "source_row": source_row_data,
                    "target_row": target_row_data
                })
                matched_target_indices.add(target_row_idx)
                # Remove used target from index to prevent duplicate matches
                target_index[key].pop(0)
            else:
                unmatched_source.append({
                    "row_index": source_row_idx,
                    "row": source_row_data
                })

        # Find unmatched target rows
        unmatched_target = [
            {"row_index": row_idx, "row": row_data}
            for row_idx, row_data in target_rows
            if row_idx not in matched_target_indices
        ]

        # Create and save result
        result = MatchResult(
            config_id=config.id,
            matched_count=len(matched_pairs),
            unmatched_source_count=len(unmatched_source),
            unmatched_target_count=len(unmatched_target),
            matched_pairs=matched_pairs,
            unmatched_source=unmatched_source,
            unmatched_target=unmatched_target
        )

        self.db.add(result)
        self.db.commit()
        self.db.refresh(result)

        return result

    def _create_match_key(
        self,
        row: List[str],
        columns: List[str],
        match_columns: List[MatchColumn],
        is_source: bool
    ) -> str:
        """Create composite key for matching"""
        key_parts = []

        for match_col in match_columns:
            # Get column name based on source/target
            col_name = match_col.source_column if is_source else match_col.target_column

            # Find column index
            col_idx = -1
            for idx, c in enumerate(columns):
                if c == col_name:
                    col_idx = idx
                    break

            if col_idx == -1 or col_idx >= len(row):
                key_parts.append("")
                continue

            value = str(row[col_idx]) if row[col_idx] is not None else ""

            # Apply value mapping if specified (only for source side)
            if is_source and match_col.value_mapping_id:
                value = self._apply_value_mapping(match_col.value_mapping_id, value)

            # Normalize value
            value = self._normalize_value(value, match_col.case_sensitive)

            key_parts.append(value)

        return "|".join(key_parts)

    def _normalize_value(self, value: str, case_sensitive: bool) -> str:
        """Normalize value for comparison"""
        if not value:
            return ""

        # Trim whitespace
        value = value.strip()

        # Handle case sensitivity
        if not case_sensitive:
            value = value.upper()

        return value

    def _apply_value_mapping(self, mapping_id: int, value: str) -> str:
        """Apply value mapping transformation"""
        mapping = self.db.query(ValueMapping).filter(ValueMapping.id == mapping_id).first()
        if not mapping:
            return value

        return mapping.mappings.get(value, value)
