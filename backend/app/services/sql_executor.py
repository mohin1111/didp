import sqlite3
import time
from typing import List, Dict, Any, Optional
from io import StringIO

from sqlalchemy.orm import Session

from ..models import Table, TableColumn, TableRow
from ..schemas import SqlExecuteResponse
from ..config import settings


class SqlExecutorService:
    """Service for executing SQL queries against table data"""

    def __init__(self, db: Session):
        self.db = db

    def execute_query(
        self,
        query: str,
        table_keys: Optional[List[str]] = None
    ) -> SqlExecuteResponse:
        """
        Execute SQL query against in-memory SQLite database.

        1. Create in-memory SQLite database
        2. Load requested tables into SQLite
        3. Execute query
        4. Return results
        """
        start_time = time.time()

        # Create in-memory SQLite connection
        conn = sqlite3.connect(":memory:")

        try:
            # Load tables into SQLite
            self._load_tables_to_sqlite(conn, table_keys)

            # Execute query
            cursor = conn.execute(query)
            columns = [desc[0] for desc in cursor.description] if cursor.description else []
            data = cursor.fetchmany(settings.SQL_MAX_ROWS)

            # Convert to list of lists with string values
            data = [[str(cell) if cell is not None else '' for cell in row] for row in data]

            execution_time = int((time.time() - start_time) * 1000)

            return SqlExecuteResponse(
                columns=columns,
                data=data,
                row_count=len(data),
                execution_time_ms=execution_time
            )

        except Exception as e:
            execution_time = int((time.time() - start_time) * 1000)
            return SqlExecuteResponse(
                columns=[],
                data=[],
                row_count=0,
                execution_time_ms=execution_time,
                error=str(e)
            )
        finally:
            conn.close()

    def _load_tables_to_sqlite(
        self,
        conn: sqlite3.Connection,
        table_keys: Optional[List[str]] = None
    ) -> None:
        """Load table data into in-memory SQLite"""
        # Get tables to load
        query = self.db.query(Table)
        if table_keys:
            query = query.filter(Table.key.in_(table_keys))

        tables = query.all()

        for table in tables:
            # Get columns
            columns = [c.name for c in sorted(table.columns, key=lambda x: x.index)]
            if not columns:
                continue

            # Create table in SQLite
            col_defs = ", ".join([f'"{col}" TEXT' for col in columns])
            create_sql = f'CREATE TABLE "{table.key}" ({col_defs})'
            conn.execute(create_sql)

            # Insert rows
            rows = [r.data for r in sorted(table.data_rows, key=lambda x: x.row_index)]
            if rows:
                placeholders = ", ".join(["?" for _ in columns])
                insert_sql = f'INSERT INTO "{table.key}" VALUES ({placeholders})'

                for row in rows:
                    # Ensure row has correct number of values
                    padded_row = row + [''] * (len(columns) - len(row)) if len(row) < len(columns) else row[:len(columns)]
                    conn.execute(insert_sql, padded_row)

            conn.commit()

    def generate_ddl_schema(self) -> str:
        """Generate SQL DDL schema for all tables"""
        schema_parts = []
        schema_parts.append("-- Database Schema")
        schema_parts.append(f"-- Generated: {time.strftime('%Y-%m-%d %H:%M:%S')}")
        schema_parts.append("")

        tables = self.db.query(Table).all()

        # Group by category
        categories: Dict[str, List[Table]] = {}
        for table in tables:
            cat = table.category or "Other"
            if cat not in categories:
                categories[cat] = []
            categories[cat].append(table)

        for category, cat_tables in categories.items():
            schema_parts.append("-- " + "=" * 44)
            schema_parts.append(f"-- {category.upper()} TABLES")
            schema_parts.append("-- " + "=" * 44)
            schema_parts.append("")

            for table in cat_tables:
                columns = [c.name for c in sorted(table.columns, key=lambda x: x.index)]

                schema_parts.append(f"-- Table: {table.name} ({table.row_count:,} records)")
                schema_parts.append(f'CREATE TABLE "{table.key}" (')
                schema_parts.append(f'  id INTEGER PRIMARY KEY,')

                for idx, col in enumerate(columns):
                    col_type = self._infer_column_type(col)
                    is_last = idx == len(columns) - 1
                    schema_parts.append(f'  "{col}" {col_type}{"" if is_last else ","}')

                schema_parts.append(");")
                schema_parts.append("")

        return "\n".join(schema_parts)

    def _infer_column_type(self, column_name: str) -> str:
        """Infer SQL column type from column name"""
        name_lower = column_name.lower()

        if any(kw in name_lower for kw in ['date', 'time', 'dt']):
            return "DATETIME"
        elif any(kw in name_lower for kw in ['id', 'qty', 'quantity', 'no', 'number', 'count']):
            return "INTEGER"
        elif any(kw in name_lower for kw in ['price', 'value', 'amount', 'mtm', 'p/l', 'turnover', 'brokerage', 'charges', 'tax', 'rate']):
            return "DECIMAL(16,4)"
        elif any(kw in name_lower for kw in ['status', 'type', 'buy/sell', 'dr/cr', 'flag']):
            return "SMALLINT"
        else:
            return "VARCHAR(255)"
