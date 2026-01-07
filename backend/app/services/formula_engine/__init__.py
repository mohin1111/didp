"""
Excel Formula Engine - combines all formula mixins into a single class.
"""
from .base import BaseFormulaMixin
from .conditional import ConditionalFormulaMixin
from .logic import LogicFormulaMixin
from .text import TextFormulaMixin
from .trade import TradeFormulaMixin
from .pnl import PnLFormulaMixin
from .settlement import SettlementFormulaMixin
from .reconciliation import ReconciliationFormulaMixin
from .fx import FXFormulaMixin


class ExcelFormulaEngine(
    BaseFormulaMixin,
    ConditionalFormulaMixin,
    LogicFormulaMixin,
    TextFormulaMixin,
    TradeFormulaMixin,
    PnLFormulaMixin,
    SettlementFormulaMixin,
    ReconciliationFormulaMixin,
    FXFormulaMixin
):
    """
    Excel formula evaluation engine combining all formula functions.

    Provides helper functions to evaluate Excel formulas on DataFrame data.
    Includes functions for:
    - Base: SUM, AVERAGE, VLOOKUP, INDEX/MATCH, etc.
    - Conditional: IF, IFERROR, IFS, SWITCH, CHOOSE
    - Logic: AND, OR, NOT, XOR
    - Text: LEFT, RIGHT, MID, TRIM, UPPER, LOWER, etc.
    - Trade: Commission, fees, gross/net values
    - P&L: Weighted avg cost, FIFO, realized/unrealized P&L
    - Settlement: Settlement dates, accrued interest, day count
    - Reconciliation: Variance, matching, break detection
    - FX: Currency conversion, cross rates, FX gain/loss
    """

    def __init__(self):
        # Initialize base mixin which handles pycel availability
        BaseFormulaMixin.__init__(self)


__all__ = ['ExcelFormulaEngine']
