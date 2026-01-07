"""
Settlement functions - settlement dates, accrued interest, day count conventions.
"""
from datetime import datetime, timedelta
from typing import List

import pandas as pd


class SettlementFormulaMixin:
    """Mixin with settlement functions."""

    def settlement_date(self, trade_date: str, cycle: str = 'T+2',
                        holidays: List[str] = None) -> str:
        """Calculate settlement date based on settlement cycle."""
        if holidays is None:
            holidays = []

        try:
            dt = datetime.strptime(str(trade_date)[:10], "%Y-%m-%d")
        except ValueError:
            return str(trade_date)

        try:
            days = int(cycle.upper().replace('T+', '').replace('T', ''))
        except ValueError:
            days = 2

        holiday_set = set(holidays)
        business_days = 0

        while business_days < days:
            dt += timedelta(days=1)
            if dt.weekday() < 5 and dt.strftime("%Y-%m-%d") not in holiday_set:
                business_days += 1

        return dt.strftime("%Y-%m-%d")

    def days_to_settlement(self, trade_date: str, settlement_date: str,
                           holidays: List[str] = None) -> int:
        """Calculate business days between trade and settlement."""
        if holidays is None:
            holidays = []

        try:
            start = datetime.strptime(str(trade_date)[:10], "%Y-%m-%d")
            end = datetime.strptime(str(settlement_date)[:10], "%Y-%m-%d")
        except ValueError:
            return 0

        holiday_set = set(holidays)
        business_days = 0
        current = start

        while current < end:
            current += timedelta(days=1)
            if current.weekday() < 5 and current.strftime("%Y-%m-%d") not in holiday_set:
                business_days += 1

        return business_days

    def accrued_interest(self, face_value: float, coupon_rate: float,
                         days_accrued: int, day_count: str = 'ACT/365') -> float:
        """Calculate accrued interest for bonds."""
        if day_count == 'ACT/360':
            year_days = 360
        elif day_count == '30/360':
            year_days = 360
        else:
            year_days = 365

        accrued = face_value * coupon_rate * (days_accrued / year_days)
        return round(accrued, 2)

    def clean_price(self, dirty_price: float, accrued_interest: float, face_value: float = 100) -> float:
        """Calculate clean price from dirty price."""
        return round(dirty_price - (accrued_interest / face_value * 100), 4)

    def dirty_price(self, clean_price: float, accrued_interest: float, face_value: float = 100) -> float:
        """Calculate dirty price from clean price."""
        return round(clean_price + (accrued_interest / face_value * 100), 4)

    def settlement_amount(self, quantity: float, price: float,
                          accrued: float = 0, fees: float = 0) -> float:
        """Calculate total settlement amount."""
        return round(quantity * price + accrued + fees, 2)

    def day_count_fraction(self, start_date: str, end_date: str,
                           convention: str = 'ACT/365') -> float:
        """Calculate day count fraction."""
        try:
            start = datetime.strptime(str(start_date)[:10], "%Y-%m-%d")
            end = datetime.strptime(str(end_date)[:10], "%Y-%m-%d")
        except ValueError:
            return 0.0

        if convention == '30/360':
            d1 = min(start.day, 30)
            d2 = min(end.day, 30) if d1 == 30 else end.day
            days = (end.year - start.year) * 360 + (end.month - start.month) * 30 + (d2 - d1)
            return round(days / 360, 6)
        else:
            actual_days = (end - start).days
            year_days = 360 if convention == 'ACT/360' else 365
            return round(actual_days / year_days, 6)

    def apply_settlement_date(self, df: pd.DataFrame, col_name: str,
                              trade_date_col: str, cycle: str = 'T+2') -> pd.DataFrame:
        """Add settlement date column to DataFrame."""
        df = df.copy()
        df[col_name] = df[trade_date_col].apply(
            lambda d: self.settlement_date(str(d), cycle)
        )
        return df
