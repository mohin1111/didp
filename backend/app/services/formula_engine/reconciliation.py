"""
Reconciliation functions - variance, matching, break detection.
"""
from typing import Dict, Any

import pandas as pd


class ReconciliationFormulaMixin:
    """Mixin with reconciliation functions."""

    def variance(self, expected: float, actual: float) -> float:
        """Calculate variance between expected and actual values."""
        return round(actual - expected, 4)

    def variance_pct(self, expected: float, actual: float) -> float:
        """Calculate variance as percentage."""
        if expected == 0:
            return 0.0 if actual == 0 else float('inf')
        return round(((actual - expected) / abs(expected)) * 100, 4)

    def is_matched(self, val1: float, val2: float, tolerance: float = 0) -> bool:
        """Check if two values match within tolerance."""
        return abs(val1 - val2) <= tolerance

    def match_status(self, val1: float, val2: float, tolerance: float = 0) -> str:
        """Return match status with variance info."""
        diff = val2 - val1
        if abs(diff) <= tolerance:
            return "Match"
        return f"Break: {diff:+.2f}"

    def tolerance_match(self, val1: float, val2: float,
                        abs_tol: float = 0, pct_tol: float = 0) -> bool:
        """Match with both absolute and percentage tolerance."""
        abs_diff = abs(val1 - val2)

        if abs_tol > 0 and abs_diff <= abs_tol:
            return True

        if pct_tol > 0 and val1 != 0:
            pct_diff = abs_diff / abs(val1)
            if pct_diff <= pct_tol:
                return True

        return abs_diff == 0

    def find_breaks(self, df: pd.DataFrame, expected_col: str, actual_col: str,
                    tolerance: float = 0) -> pd.DataFrame:
        """Find all breaks in a DataFrame."""
        expected = pd.to_numeric(df[expected_col], errors='coerce').fillna(0)
        actual = pd.to_numeric(df[actual_col], errors='coerce').fillna(0)
        variance = (actual - expected).abs()
        mask = variance > tolerance
        return df[mask].copy()

    def break_summary(self, df: pd.DataFrame, expected_col: str, actual_col: str,
                      tolerance: float = 0) -> Dict[str, Any]:
        """Generate summary of breaks."""
        expected = pd.to_numeric(df[expected_col], errors='coerce').fillna(0)
        actual = pd.to_numeric(df[actual_col], errors='coerce').fillna(0)
        variance = actual - expected

        matched = (variance.abs() <= tolerance).sum()
        breaks = len(df) - matched

        return {
            'total_records': len(df),
            'matched': int(matched),
            'breaks': int(breaks),
            'match_rate': round(matched / len(df) * 100, 2) if len(df) > 0 else 0,
            'total_variance': round(variance.sum(), 2),
            'abs_variance': round(variance.abs().sum(), 2),
            'max_variance': round(variance.abs().max(), 2),
        }

    def reconcile_df(self, df: pd.DataFrame, expected_col: str, actual_col: str,
                     tolerance: float = 0) -> pd.DataFrame:
        """Add reconciliation columns to DataFrame."""
        df = df.copy()
        expected = pd.to_numeric(df[expected_col], errors='coerce').fillna(0)
        actual = pd.to_numeric(df[actual_col], errors='coerce').fillna(0)

        df['Variance'] = actual - expected
        df['Status'] = df['Variance'].apply(
            lambda x: 'Match' if abs(x) <= tolerance else 'Break'
        )
        return df

    def apply_reconcile(self, df: pd.DataFrame, col_name: str,
                        expected_col: str, actual_col: str,
                        tolerance: float = 0) -> pd.DataFrame:
        """Add match status column to DataFrame."""
        df = df.copy()
        expected = pd.to_numeric(df[expected_col], errors='coerce').fillna(0)
        actual = pd.to_numeric(df[actual_col], errors='coerce').fillna(0)

        df[col_name] = [
            self.match_status(e, a, tolerance)
            for e, a in zip(expected, actual)
        ]
        return df
