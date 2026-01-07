"""
FX & Currency functions - conversion, cross rates, FX gain/loss.
"""
import pandas as pd


class FXFormulaMixin:
    """Mixin with FX and currency functions."""

    def fx_convert(self, amount: float, rate: float, direction: str = 'multiply') -> float:
        """Convert currency amount."""
        if direction == 'divide':
            return round(amount / rate, 2) if rate != 0 else 0
        return round(amount * rate, 2)

    def cross_rate(self, rate1: float, rate2: float) -> float:
        """Calculate cross rate from two rates."""
        if rate2 == 0:
            return 0.0
        return round(rate1 / rate2, 6)

    def fx_gain_loss(self, original_amount: float, original_rate: float,
                     current_rate: float) -> float:
        """Calculate FX gain/loss."""
        original_value = original_amount * original_rate
        current_value = original_amount * current_rate
        return round(current_value - original_value, 2)

    def base_currency_value(self, local_amount: float, fx_rate: float) -> float:
        """Convert to base currency."""
        if fx_rate == 0:
            return 0.0
        return round(local_amount / fx_rate, 2)

    def apply_fx(self, df: pd.DataFrame, col_name: str,
                 amount_col: str, rate_col: str,
                 direction: str = 'multiply') -> pd.DataFrame:
        """Add currency converted column to DataFrame."""
        df = df.copy()
        amounts = pd.to_numeric(df[amount_col], errors='coerce').fillna(0)
        rates = pd.to_numeric(df[rate_col], errors='coerce').fillna(1)

        df[col_name] = [
            self.fx_convert(a, r, direction)
            for a, r in zip(amounts, rates)
        ]
        return df
