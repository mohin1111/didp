"""
Python Executor Service - executes Python scripts against table data.
"""
import sys
import time
import traceback
from io import StringIO
from typing import List, Dict, Any, Optional
from contextlib import redirect_stdout, redirect_stderr

from sqlalchemy.orm import Session
import pandas as pd
import numpy as np

from ..models import Table
from ..config import settings
from .formula_engine import ExcelFormulaEngine


class PythonExecutorService:
    """Service for executing Python scripts against table data."""

    def __init__(self, db: Session):
        self.db = db

    def execute_script(
        self,
        script: str,
        table_keys: Optional[List[str]] = None,
        timeout_seconds: int = 30
    ) -> Dict[str, Any]:
        """
        Execute Python script with access to table data.

        The script has access to:
        - pandas as pd
        - numpy as np
        - tables: dict of DataFrames keyed by table_key
        - excel: ExcelFormulaEngine instance
        - print() output is captured

        Returns:
        - output: captured stdout
        - error: any error message
        - execution_time_ms: time taken
        - result_data: if script sets 'result' variable, it's returned
        """
        start_time = time.time()
        output_buffer = StringIO()
        error_buffer = StringIO()

        try:
            # Load tables as DataFrames
            tables = self._load_tables_as_dataframes(table_keys)

            # Create Excel formula engine
            excel = ExcelFormulaEngine()

            # Create restricted globals
            safe_globals = {
                '__builtins__': {
                    'print': print,
                    'len': len,
                    'range': range,
                    'enumerate': enumerate,
                    'zip': zip,
                    'map': map,
                    'filter': filter,
                    'sorted': sorted,
                    'reversed': reversed,
                    'list': list,
                    'dict': dict,
                    'set': set,
                    'tuple': tuple,
                    'str': str,
                    'int': int,
                    'float': float,
                    'bool': bool,
                    'sum': sum,
                    'min': min,
                    'max': max,
                    'abs': abs,
                    'round': round,
                    'isinstance': isinstance,
                    'type': type,
                    'getattr': getattr,
                    'hasattr': hasattr,
                    'True': True,
                    'False': False,
                    'None': None,
                },
                'pd': pd,
                'np': np,
                'pandas': pd,
                'numpy': np,
                'tables': tables,
                'excel': excel,
            }

            # Create locals dict to capture result
            local_vars = {}

            # Execute with captured output
            with redirect_stdout(output_buffer), redirect_stderr(error_buffer):
                exec(script, safe_globals, local_vars)

            execution_time = int((time.time() - start_time) * 1000)

            # Check if result was set
            result_data = None
            result_columns = None
            if 'result' in local_vars:
                result = local_vars['result']
                if isinstance(result, pd.DataFrame):
                    result_columns = result.columns.tolist()
                    result_data = result.head(1000).values.tolist()
                    result_data = [[str(cell) if cell is not None else '' for cell in row] for row in result_data]
                elif isinstance(result, (list, tuple)):
                    result_data = [[str(item)] for item in result[:1000]]
                    result_columns = ['result']

            return {
                'output': output_buffer.getvalue(),
                'error': error_buffer.getvalue() if error_buffer.getvalue() else None,
                'execution_time_ms': execution_time,
                'result_columns': result_columns,
                'result_data': result_data,
            }

        except Exception as e:
            execution_time = int((time.time() - start_time) * 1000)
            error_msg = traceback.format_exc()

            return {
                'output': output_buffer.getvalue(),
                'error': error_msg,
                'execution_time_ms': execution_time,
                'result_columns': None,
                'result_data': None,
            }

    def _load_tables_as_dataframes(
        self,
        table_keys: Optional[List[str]] = None
    ) -> Dict[str, Any]:
        """Load table data as pandas DataFrames."""
        tables_dict = {}

        query = self.db.query(Table)
        if table_keys:
            query = query.filter(Table.key.in_(table_keys))

        tables = query.all()

        for table in tables:
            columns = [c.name for c in sorted(table.columns, key=lambda x: x.index)]
            if not columns:
                continue

            rows = [r.data for r in sorted(table.data_rows, key=lambda x: x.row_index)]
            df = pd.DataFrame(rows, columns=columns)
            tables_dict[table.key] = df

        return tables_dict

    def get_available_tables(self) -> List[Dict[str, Any]]:
        """Get list of available tables with their columns."""
        tables = self.db.query(Table).all()

        result = []
        for table in tables:
            columns = [c.name for c in sorted(table.columns, key=lambda x: x.index)]
            result.append({
                'key': table.key,
                'name': table.name,
                'columns': columns,
                'row_count': table.row_count,
            })

        return result
