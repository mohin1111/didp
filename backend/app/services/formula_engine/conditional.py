"""
Conditional formula functions - IF, IFERROR, IFS, SWITCH, CHOOSE.
"""
from typing import List, Any

import pandas as pd
import numpy as np


class ConditionalFormulaMixin:
    """Mixin with conditional formula functions."""

    def if_func(self, condition: Any, value_if_true: Any, value_if_false: Any) -> Any:
        """IF function - returns value based on condition."""
        if condition:
            return value_if_true
        return value_if_false

    def if_col(self, data: pd.DataFrame, condition_col: str, operator: str,
               compare_value: Any, value_if_true: Any, value_if_false: Any) -> List[Any]:
        """IF function applied to a column - returns list of values based on condition."""
        col_data = pd.to_numeric(data[condition_col], errors='coerce')

        if operator == '>':
            mask = col_data > compare_value
        elif operator == '<':
            mask = col_data < compare_value
        elif operator == '>=':
            mask = col_data >= compare_value
        elif operator == '<=':
            mask = col_data <= compare_value
        elif operator == '==':
            mask = data[condition_col] == compare_value
        elif operator == '!=':
            mask = data[condition_col] != compare_value
        else:
            raise ValueError(f"Unknown operator: {operator}")

        return [value_if_true if m else value_if_false for m in mask]

    def apply_if(self, data: pd.DataFrame, column_name: str, condition_col: str,
                 operator: str, compare_value: Any, value_if_true: Any, value_if_false: Any) -> pd.DataFrame:
        """Apply IF function to create a new column."""
        results = self.if_col(data, condition_col, operator, compare_value, value_if_true, value_if_false)
        data = data.copy()
        data[column_name] = results
        return data

    def iferror(self, value: Any, value_if_error: Any) -> Any:
        """IFERROR function - returns value_if_error if value is an error/None/NaN."""
        try:
            if value is None:
                return value_if_error
            if isinstance(value, float) and np.isnan(value):
                return value_if_error
            return value
        except Exception:
            return value_if_error

    def iferror_col(self, data: pd.DataFrame, column: str, value_if_error: Any) -> List[Any]:
        """IFERROR applied to a column - replaces errors/None/NaN with specified value."""
        results = []
        for val in data[column]:
            results.append(self.iferror(val, value_if_error))
        return results

    def apply_iferror(self, data: pd.DataFrame, column: str, value_if_error: Any) -> pd.DataFrame:
        """Apply IFERROR to a column in place (modifies existing column)."""
        data = data.copy()
        data[column] = data[column].fillna(value_if_error)
        return data

    def ifs(self, *args) -> Any:
        """IFS function - evaluates multiple conditions and returns first matching result."""
        if len(args) % 2 != 0:
            raise ValueError("IFS requires pairs of condition, value")

        for i in range(0, len(args), 2):
            condition = args[i]
            value = args[i + 1]
            if condition:
                return value
        return None

    def switch(self, expression: Any, *args) -> Any:
        """SWITCH function - compares expression against values and returns matching result."""
        has_default = len(args) % 2 != 0
        pairs_count = len(args) // 2

        for i in range(pairs_count):
            match_value = args[i * 2]
            result = args[i * 2 + 1]
            if expression == match_value:
                return result

        if has_default:
            return args[-1]
        return None

    def choose(self, index: int, *values) -> Any:
        """CHOOSE function - returns value at specified index (1-based)."""
        if index < 1 or index > len(values):
            return None
        return values[index - 1]
