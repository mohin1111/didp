"""
Position & P&L functions - weighted average cost, FIFO, realized/unrealized P&L.
"""
from typing import List

import pandas as pd


class PnLFormulaMixin:
    """Mixin with position and P&L functions."""

    def weighted_avg_cost(self, df: pd.DataFrame, qty_col: str, price_col: str,
                          value_col: str = None) -> float:
        """Calculate weighted average cost."""
        quantities = pd.to_numeric(df[qty_col], errors='coerce').fillna(0)
        prices = pd.to_numeric(df[price_col], errors='coerce').fillna(0)

        if value_col:
            values = pd.to_numeric(df[value_col], errors='coerce').fillna(0)
        else:
            values = quantities * prices

        total_qty = quantities.sum()
        if total_qty == 0:
            return 0.0

        return round(values.sum() / total_qty, 4)

    def fifo_cost(self, position_qty: float, buys: List[tuple]) -> float:
        """Calculate FIFO cost basis for a position."""
        remaining_qty = position_qty
        total_cost = 0.0

        for qty, price in buys:
            if remaining_qty <= 0:
                break
            use_qty = min(qty, remaining_qty)
            total_cost += use_qty * price
            remaining_qty -= use_qty

        if position_qty == 0:
            return 0.0
        return round(total_cost / position_qty, 4)

    def realized_pnl(self, sell_value: float, cost_basis: float) -> float:
        """Calculate realized profit/loss."""
        return round(sell_value - cost_basis, 2)

    def unrealized_pnl(self, position_qty: float, avg_cost: float, current_price: float) -> float:
        """Calculate unrealized profit/loss."""
        return round(position_qty * (current_price - avg_cost), 2)

    def mark_to_market(self, position_qty: float, market_price: float) -> float:
        """Calculate mark-to-market value."""
        return round(position_qty * market_price, 2)

    def position_value(self, quantity: float, price: float) -> float:
        """Calculate position value."""
        return round(quantity * price, 2)

    def pnl_percentage(self, pnl: float, cost_basis: float) -> float:
        """Calculate P&L as percentage."""
        if cost_basis == 0:
            return 0.0
        return round((pnl / abs(cost_basis)) * 100, 2)

    def total_return(self, ending_value: float, beginning_value: float,
                     dividends: float = 0, contributions: float = 0) -> float:
        """Calculate total return."""
        if beginning_value == 0:
            return 0.0
        adjusted_beginning = beginning_value + contributions
        gain = ending_value - adjusted_beginning + dividends
        return round((gain / beginning_value) * 100, 2)

    def annualized_return(self, total_return_pct: float, days: int) -> float:
        """Calculate annualized return."""
        if days <= 0:
            return 0.0
        return round(((1 + total_return_pct / 100) ** (365 / days) - 1) * 100, 2)

    def apply_pnl(self, df: pd.DataFrame, col_name: str,
                  cost_col: str, value_col: str) -> pd.DataFrame:
        """Add P&L column to DataFrame."""
        df = df.copy()
        costs = pd.to_numeric(df[cost_col], errors='coerce').fillna(0)
        values = pd.to_numeric(df[value_col], errors='coerce').fillna(0)
        df[col_name] = values - costs
        return df
