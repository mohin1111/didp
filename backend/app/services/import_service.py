import pandas as pd
from io import BytesIO
from typing import Dict, Any, Optional, List
import uuid

from sqlalchemy.orm import Session

from ..models import Table, TableColumn, TableRow


class ImportService:
    """Service for handling file imports (Excel, CSV)"""

    # Temporary storage for uploaded files
    _temp_storage: Dict[str, bytes] = {}
    _temp_metadata: Dict[str, Dict[str, Any]] = {}

    def __init__(self, db: Session):
        self.db = db

    def process_upload(self, content: bytes, filename: str) -> Dict[str, Any]:
        """
        Process uploaded file and return preview data.

        Returns:
        - file_id: Temporary ID for this upload
        - filename: Original filename
        - sheets: List of sheet names (for Excel)
        - preview: First N rows of first sheet
        - columns: Column names
        - has_headers: Whether first row appears to be headers
        """
        file_id = str(uuid.uuid4())

        # Store content temporarily
        ImportService._temp_storage[file_id] = content

        is_csv = filename.lower().endswith('.csv')

        if is_csv:
            df = pd.read_csv(BytesIO(content), header=None, nrows=100)
            sheets = None
        else:
            # Excel file
            excel_file = pd.ExcelFile(BytesIO(content))
            sheets = excel_file.sheet_names
            df = pd.read_excel(BytesIO(content), sheet_name=0, header=None, nrows=100)

        # Detect headers
        has_headers = self._detect_headers(df)

        if has_headers:
            columns = [str(c) for c in df.iloc[0].tolist()]
            preview = df.iloc[1:20].values.tolist()
        else:
            columns = [f"Column_{i+1}" for i in range(len(df.columns))]
            preview = df.iloc[:20].values.tolist()

        # Convert NaN to empty strings
        preview = [['' if pd.isna(cell) else str(cell) for cell in row] for row in preview]

        # Store metadata
        ImportService._temp_metadata[file_id] = {
            "filename": filename,
            "sheets": sheets,
            "is_csv": is_csv
        }

        return {
            "file_id": file_id,
            "filename": filename,
            "sheets": sheets,
            "columns": columns,
            "preview": preview,
            "has_headers": has_headers,
            "row_count": len(df) - (1 if has_headers else 0)
        }

    def get_sheet_preview(
        self,
        file_id: str,
        sheet_name: Optional[str],
        has_headers: bool
    ) -> Dict[str, Any]:
        """Get preview for specific sheet"""
        if file_id not in ImportService._temp_storage:
            raise ValueError("File not found. Please upload again.")

        content = ImportService._temp_storage[file_id]
        metadata = ImportService._temp_metadata.get(file_id, {})

        if metadata.get("is_csv"):
            df = pd.read_csv(BytesIO(content), header=None, nrows=100)
        else:
            df = pd.read_excel(
                BytesIO(content),
                sheet_name=sheet_name or 0,
                header=None,
                nrows=100
            )

        if has_headers:
            columns = [str(c) for c in df.iloc[0].tolist()]
            preview = df.iloc[1:20].values.tolist()
        else:
            columns = [f"Column_{i+1}" for i in range(len(df.columns))]
            preview = df.iloc[:20].values.tolist()

        # Convert NaN to empty strings
        preview = [['' if pd.isna(cell) else str(cell) for cell in row] for row in preview]

        return {
            "columns": columns,
            "preview": preview,
            "row_count": len(df) - (1 if has_headers else 0)
        }

    def confirm_import(
        self,
        file_id: str,
        table_key: str,
        table_name: str,
        sheet_name: Optional[str],
        has_headers: bool,
        category: Optional[str],
        keep_file: bool = False
    ) -> Table:
        """Confirm import and create table in database"""
        if file_id not in ImportService._temp_storage:
            raise ValueError("File not found. Please upload again.")

        # Check if table key already exists
        existing = self.db.query(Table).filter(Table.key == table_key).first()
        if existing:
            raise ValueError(f"Table with key '{table_key}' already exists")

        content = ImportService._temp_storage[file_id]
        metadata = ImportService._temp_metadata.get(file_id, {})

        # Read full data
        if metadata.get("is_csv"):
            if has_headers:
                df = pd.read_csv(BytesIO(content))
            else:
                df = pd.read_csv(BytesIO(content), header=None)
        else:
            if has_headers:
                df = pd.read_excel(BytesIO(content), sheet_name=sheet_name or 0)
            else:
                df = pd.read_excel(BytesIO(content), sheet_name=sheet_name or 0, header=None)

        # Get columns
        if has_headers:
            columns = [str(c) for c in df.columns.tolist()]
        else:
            columns = [f"Column_{i+1}" for i in range(len(df.columns))]

        # Create table
        table = Table(
            key=table_key,
            name=table_name,
            category=category,
            source_type="imported",
            file_name=metadata.get("filename"),
            sheet_name=sheet_name,
            row_count=len(df)
        )
        self.db.add(table)
        self.db.flush()

        # Create columns
        for idx, col_name in enumerate(columns):
            column = TableColumn(table_id=table.id, index=idx, name=col_name)
            self.db.add(column)

        # Create rows
        for row_idx, row in df.iterrows():
            row_data = ['' if pd.isna(cell) else str(cell) for cell in row.tolist()]
            table_row = TableRow(table_id=table.id, row_index=row_idx, data=row_data)
            self.db.add(table_row)

        self.db.commit()
        self.db.refresh(table)

        # Cleanup temp storage only if not keeping file for batch import
        if not keep_file:
            del ImportService._temp_storage[file_id]
            if file_id in ImportService._temp_metadata:
                del ImportService._temp_metadata[file_id]

        return table

    def cleanup_temp_file(self, file_id: str) -> None:
        """Cleanup temporary file storage"""
        if file_id in ImportService._temp_storage:
            del ImportService._temp_storage[file_id]
        if file_id in ImportService._temp_metadata:
            del ImportService._temp_metadata[file_id]

    def batch_import(
        self,
        file_id: str,
        imports: List[Dict[str, Any]],
        has_headers: bool,
        category: Optional[str]
    ) -> List[Table]:
        """Import multiple sheets from the same file"""
        if file_id not in ImportService._temp_storage:
            raise ValueError("File not found. Please upload again.")

        tables = []
        for i, import_spec in enumerate(imports):
            is_last = (i == len(imports) - 1)
            table = self.confirm_import(
                file_id=file_id,
                table_key=import_spec["table_key"],
                table_name=import_spec["table_name"],
                sheet_name=import_spec.get("sheet_name"),
                has_headers=has_headers,
                category=category,
                keep_file=not is_last  # Only cleanup on last import
            )
            tables.append(table)

        return tables

    def _detect_headers(self, df: pd.DataFrame) -> bool:
        """
        Auto-detect if first row contains headers.
        Heuristics:
        - If first row has mostly string values and subsequent rows have numbers
        - If first row values look like column names (no numbers, spaces)
        """
        if df.empty or len(df) < 2:
            return False

        first_row = df.iloc[0]
        second_row = df.iloc[1]

        # Count string vs numeric values
        first_row_strings = sum(1 for v in first_row if isinstance(v, str) and not self._is_numeric(str(v)))
        second_row_strings = sum(1 for v in second_row if isinstance(v, str) and not self._is_numeric(str(v)))

        # If first row has more strings than second row, likely headers
        if first_row_strings > second_row_strings:
            return True

        # Check if first row looks like headers
        header_like = 0
        for val in first_row:
            if isinstance(val, str):
                s = str(val).strip()
                # Looks like a header if it's not a number and not too long
                if s and not self._is_numeric(s) and len(s) < 50:
                    header_like += 1

        return header_like > len(first_row) * 0.5

    def _is_numeric(self, s: str) -> bool:
        """Check if string is numeric"""
        try:
            float(s.replace(',', ''))
            return True
        except (ValueError, AttributeError):
            return False
