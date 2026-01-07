"""
Trade calculation functions - commission, fees, gross/net values.
"""
from typing import List

import pandas as pd


class TradeFormulaMixin:
    """Mixin with trade calculation functions."""

    def commission(self, trade_value: float, rate: float, min_fee: float = 0, max_fee: float = None) -> float:
        """Calculate commission with optional min/max bounds."""
        comm = abs(trade_value) * rate
        comm = max(comm, min_fee)
        if max_fee is not None:
            comm = min(comm, max_fee)
        return round(comm, 2)

    def commission_tiered(self, trade_value: float, tiers: List[tuple]) -> float:
        """Calculate tiered commission based on trade value brackets."""
        trade_value = abs(trade_value)
        total_comm = 0.0
        prev_threshold = 0

        for i, (threshold, rate) in enumerate(sorted(tiers, key=lambda x: x[0])):
            if trade_value <= threshold and i > 0:
                break
            if i < len(tiers) - 1:
                next_threshold = tiers[i + 1][0] if i + 1 < len(tiers) else trade_value
                bracket_value = min(trade_value, next_threshold) - threshold
            else:
                bracket_value = trade_value - threshold

            if bracket_value > 0:
                total_comm += bracket_value * rate

        return round(total_comm, 2)

    def brokerage_fee(self, trade_value: float, fee_type: str = 'percentage',
                      rate: float = 0, flat_fee: float = 0) -> float:
        """Calculate brokerage fee (percentage, flat, or both)."""
        if fee_type == 'percentage':
            return round(abs(trade_value) * rate, 2)
        elif fee_type == 'flat':
            return flat_fee
        elif fee_type == 'both':
            return round(abs(trade_value) * rate + flat_fee, 2)
        return 0.0

    def stamp_duty(self, trade_value: float, rate: float, side: str = 'buy') -> float:
        """Calculate stamp duty (typically on purchases only)."""
        if side.lower() == 'buy':
            return round(abs(trade_value) * rate, 2)
        return 0.0

    def transaction_tax(self, trade_value: float, rate: float, side: str = 'sell') -> float:
        """Calculate transaction tax (STT, CTT, etc.)."""
        if side.lower() in ['both', 'buy', 'sell']:
            return round(abs(trade_value) * rate, 2)
        return 0.0

    def gross_value(self, quantity: float, price: float) -> float:
        """Calculate gross trade value."""
        return round(quantity * price, 2)

    def net_value(self, gross: float, commission: float = 0, fees: float = 0,
                  taxes: float = 0, side: str = 'buy') -> float:
        """Calculate net settlement value."""
        total_costs = commission + fees + taxes
        if side.lower() == 'buy':
            return round(gross + total_costs, 2)
        else:
            return round(gross - total_costs, 2)

    def total_cost(self, *charges) -> float:
        """Sum all charges/costs."""
        return round(sum(charges), 2)

    def effective_price(self, net_value: float, quantity: float) -> float:
        """Calculate effective price per unit including all costs."""
        if quantity == 0:
            return 0.0
        return round(net_value / quantity, 4)

    def apply_commission(self, df: pd.DataFrame, col_name: str, value_col: str,
                         rate: float, min_fee: float = 0, max_fee: float = None) -> pd.DataFrame:
        """Add commission column to DataFrame."""
        df = df.copy()
        values = pd.to_numeric(df[value_col], errors='coerce').fillna(0)
        df[col_name] = values.apply(lambda v: self.commission(v, rate, min_fee, max_fee))
        return df
