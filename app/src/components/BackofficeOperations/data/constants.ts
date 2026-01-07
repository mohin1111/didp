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
export const DEFAULT_PYTHON_SCRIPT = `# Data Processing Script
import pandas as pd

# Access imported tables via: tables['table_name']
# Example:
# df = tables['my_imported_table']
# result = df.groupby('column').sum()
# output.write(result)
`;

// Default SQL query
export const DEFAULT_SQL_QUERY = `-- Query imported tables
SELECT * FROM imported_table
LIMIT 10;`;

// No initial saved processes - start fresh
export const INITIAL_SAVED_PROCESSES: never[] = [];
