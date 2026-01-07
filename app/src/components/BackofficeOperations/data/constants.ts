// Chart colors for visualizations
export const CHART_COLORS = [
  '#3b82f6', // blue
  '#10b981', // green
  '#f59e0b', // amber
  '#ef4444', // red
  '#8b5cf6', // purple
  '#06b6d4', // cyan
  '#ec4899', // pink
  '#84cc16', // lime
];

// Color classes for process types
export const colorClasses = {
  blue: { bg: 'bg-blue-500/20', border: 'border-blue-500/40', text: 'text-blue-400', solid: 'bg-blue-500' },
  green: { bg: 'bg-green-500/20', border: 'border-green-500/40', text: 'text-green-400', solid: 'bg-green-500' },
  orange: { bg: 'bg-orange-500/20', border: 'border-orange-500/40', text: 'text-orange-400', solid: 'bg-orange-500' },
  red: { bg: 'bg-red-500/20', border: 'border-red-500/40', text: 'text-red-400', solid: 'bg-red-500' },
  cyan: { bg: 'bg-cyan-500/20', border: 'border-cyan-500/40', text: 'text-cyan-400', solid: 'bg-cyan-500' },
  purple: { bg: 'bg-purple-500/20', border: 'border-purple-500/40', text: 'text-purple-400', solid: 'bg-purple-500' },
  yellow: { bg: 'bg-yellow-500/20', border: 'border-yellow-500/40', text: 'text-yellow-400', solid: 'bg-yellow-500' },
} as const;

export type ColorKey = keyof typeof colorClasses;

// Default Python script template
export const DEFAULT_PYTHON_SCRIPT = `# CNSDB Custom Processing Script
import pandas as pd
from datetime import datetime

def calculate_mtm(positions_df, closing_prices_df):
    """
    Calculate Mark-to-Market for open positions
    """
    # Merge positions with closing prices
    merged = positions_df.merge(
        closing_prices_df,
        on='contract_id',
        how='left'
    )

    # Calculate MTM
    merged['mtm'] = (merged['close_price'] - merged['avg_price']) * merged['quantity']
    merged['mtm'] = merged.apply(
        lambda x: -x['mtm'] if x['buy_sell'] == 'SELL' else x['mtm'],
        axis=1
    )

    # Group by client
    client_mtm = merged.groupby('client_id').agg({
        'mtm': 'sum',
        'quantity': 'sum'
    }).reset_index()

    # Flag significant MTM
    client_mtm['alert'] = client_mtm['mtm'].apply(
        lambda x: 'HIGH' if abs(x) > 100000 else 'NORMAL'
    )

    return client_mtm

# Execute
result = calculate_mtm(master_data['openPosition'], master_data['closingPrice'])
output.write(result)`;

// Default SQL query
export const DEFAULT_SQL_QUERY = `-- Query CNS Database
SELECT * FROM dayTrade
WHERE status = 'MATCHED'
ORDER BY value DESC
LIMIT 10;`;

// Initial saved processes
export const INITIAL_SAVED_PROCESSES = [
  { id: 1, name: 'Daily Trade Recon', description: 'Standard daily trade reconciliation', processId: 'reconciliation', config: { tolerance: 'exact', counterparty: 'all' }, createdAt: '2026-01-05' },
  { id: 2, name: 'EOD Settlement', description: 'End of day settlement processing', processId: 'settlement', config: { tolerance: '0.01', counterparty: 'DTCC' }, createdAt: '2026-01-04' },
  { id: 3, name: 'Weekly Risk Report', description: 'Weekly VaR calculation', processId: 'risk', config: { tolerance: '0.1', counterparty: 'all' }, createdAt: '2026-01-01' },
];
