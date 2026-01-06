import type { CellClassParams } from 'ag-grid-community';

// Status cell renderer
export const statusCellRenderer = (params: { value: string }) => {
  const statusColors: Record<string, string> = {
    'Active': 'bg-green-100 text-green-700',
    'Inactive': 'bg-slate-100 text-slate-600',
    'Suspended': 'bg-red-100 text-red-700',
    'Executed': 'bg-green-100 text-green-700',
    'Pending': 'bg-amber-100 text-amber-700',
    'Partial': 'bg-blue-100 text-blue-700',
    'Normal': 'bg-green-100 text-green-700',
    'Warning': 'bg-amber-100 text-amber-700',
    'Critical': 'bg-red-100 text-red-700',
    'Verified': 'bg-green-100 text-green-700',
    'Rejected': 'bg-red-100 text-red-700',
    'Settled': 'bg-green-100 text-green-700',
    'Open': 'bg-blue-100 text-blue-700',
    'Closed': 'bg-slate-100 text-slate-600',
    'Long': 'bg-green-100 text-green-700',
    'Short': 'bg-red-100 text-red-700',
    'BUY': 'bg-green-100 text-green-700',
    'SELL': 'bg-red-100 text-red-700',
    'Posted': 'bg-green-100 text-green-700',
    'Calculated': 'bg-blue-100 text-blue-700',
  };
  const colorClass = statusColors[params.value] || 'bg-slate-100 text-slate-600';

  // Return a string that will be used as the cell value
  // The actual rendering is done via CSS classes
  return `<span class="inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${colorClass}">${params.value}</span>`;
};

// Balance/PnL cell styling
export const balanceCellStyle = (params: CellClassParams) => {
  const field = params.colDef.field;
  const numericFields = ['balance', 'pnl', 'realizedPnl', 'unrealizedPnl', 'totalPnl', 'netPnl', 'change', 'dayPnl', 'changePercent', 'pnlPercent', 'mtmPnl', 'dailyMtm', 'variationMargin'];

  if (numericFields.includes(field || '') && typeof params.value === 'number') {
    if (params.value < 0) {
      return { backgroundColor: '#FEE2E2', color: '#DC2626', fontWeight: '500' };
    }
    if (field === 'balance' && params.value > 500000) {
      return { backgroundColor: '#DCFCE7', color: '#16A34A', fontWeight: '500' };
    }
  }

  // Margin utilization warning
  if (field === 'utilizationPercent' && typeof params.value === 'number') {
    if (params.value >= 90) {
      return { backgroundColor: '#FEE2E2', color: '#DC2626', fontWeight: '500' };
    }
    if (params.value >= 75) {
      return { backgroundColor: '#FEF3C7', color: '#D97706', fontWeight: '500' };
    }
  }

  return null;
};

// Status fields that need special rendering
export const statusFields = ['status', 'buySell', 'type', 'kycStatus', 'settlementStatus', 'fundsStatus', 'securitiesStatus', 'debitCredit', 'marginPosted'];

// Numeric fields for conditional formatting
export const numericStyleFields = ['balance', 'pnl', 'realizedPnl', 'unrealizedPnl', 'totalPnl', 'netPnl', 'change', 'dayPnl', 'changePercent', 'pnlPercent', 'utilizationPercent', 'mtmPnl', 'dailyMtm', 'variationMargin'];
