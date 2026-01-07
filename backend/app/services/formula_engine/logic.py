"""
Logic formula functions - AND, OR, NOT, XOR.
"""
from typing import List, Any

import pandas as pd


class LogicFormulaMixin:
    """Mixin with logic formula functions."""

    def and_func(self, *conditions) -> bool:
        """AND function - returns True if ALL conditions are True."""
        return all(conditions)

    def or_func(self, *conditions) -> bool:
        """OR function - returns True if ANY condition is True."""
        return any(conditions)

    def not_func(self, condition: bool) -> bool:
        """NOT function - returns the opposite of the condition."""
        return not condition

    def xor_func(self, *conditions) -> bool:
        """XOR function - returns True if an ODD number of conditions are True."""
        return sum(bool(c) for c in conditions) % 2 == 1

    def _evaluate_condition(self, data: pd.DataFrame, col: str, op: str, val: Any):
        """Helper to evaluate a column condition."""
        col_data = pd.to_numeric(data[col], errors='coerce') if op in ['>', '<', '>=', '<='] else data[col]
        if op == '>':
            return col_data > val
        elif op == '<':
            return col_data < val
        elif op == '>=':
            return col_data >= val
        elif op == '<=':
            return col_data <= val
        elif op == '==':
            return data[col] == val
        elif op == '!=':
            return data[col] != val
        return pd.Series([False] * len(data))

    def and_col(self, data: pd.DataFrame, *column_conditions) -> List[bool]:
        """AND applied to columns - evaluate multiple column conditions."""
        masks = [self._evaluate_condition(data, col, op, val) for col, op, val in column_conditions]
        result = masks[0]
        for mask in masks[1:]:
            result = result & mask
        return result.tolist()

    def or_col(self, data: pd.DataFrame, *column_conditions) -> List[bool]:
        """OR applied to columns - evaluate multiple column conditions."""
        masks = [self._evaluate_condition(data, col, op, val) for col, op, val in column_conditions]
        result = masks[0]
        for mask in masks[1:]:
            result = result | mask
        return result.tolist()

    def not_col(self, data: pd.DataFrame, column: str, operator: str, value: Any) -> List[bool]:
        """NOT applied to a column condition."""
        mask = self._evaluate_condition(data, column, operator, value)
        return (~mask).tolist()

    def apply_and(self, data: pd.DataFrame, column_name: str,
                  value_if_true: Any, value_if_false: Any, *column_conditions) -> pd.DataFrame:
        """Apply AND condition to create a new column."""
        results = self.and_col(data, *column_conditions)
        data = data.copy()
        data[column_name] = [value_if_true if r else value_if_false for r in results]
        return data

    def apply_or(self, data: pd.DataFrame, column_name: str,
                 value_if_true: Any, value_if_false: Any, *column_conditions) -> pd.DataFrame:
        """Apply OR condition to create a new column."""
        results = self.or_col(data, *column_conditions)
        data = data.copy()
        data[column_name] = [value_if_true if r else value_if_false for r in results]
        return data

    def apply_not(self, data: pd.DataFrame, column_name: str,
                  value_if_true: Any, value_if_false: Any,
                  condition_col: str, operator: str, value: Any) -> pd.DataFrame:
        """Apply NOT condition to create a new column."""
        results = self.not_col(data, condition_col, operator, value)
        data = data.copy()
        data[column_name] = [value_if_true if r else value_if_false for r in results]
        return data

    def filter_and(self, data: pd.DataFrame, *column_conditions) -> pd.DataFrame:
        """Filter DataFrame where ALL conditions are True (AND)."""
        results = self.and_col(data, *column_conditions)
        return data[results].reset_index(drop=True)

    def filter_or(self, data: pd.DataFrame, *column_conditions) -> pd.DataFrame:
        """Filter DataFrame where ANY condition is True (OR)."""
        results = self.or_col(data, *column_conditions)
        return data[results].reset_index(drop=True)
