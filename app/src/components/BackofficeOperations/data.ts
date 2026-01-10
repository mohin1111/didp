import {
  TrendingUp, RefreshCw, Calculator, DollarSign,
  FileCheck, Scale, Percent, BarChart
} from 'lucide-react';

// Re-export from constants
export { CHART_COLORS, DEFAULT_SQL_QUERY, DEFAULT_PYTHON_SCRIPT } from './data/constants';

// Process definitions
export const processes = [
  {
    id: 'eodProcess',
    name: 'EOD Processing',
    description: 'End of day position and P&L calculations',
    color: 'blue',
    icon: TrendingUp,
  },
  {
    id: 'mtmCalc',
    name: 'MTM Calculation',
    description: 'Mark-to-market valuation',
    color: 'green',
    icon: RefreshCw,
  },
  {
    id: 'brokerageCalc',
    name: 'Brokerage Calc',
    description: 'Calculate brokerage and fees',
    color: 'amber',
    icon: Calculator,
  },
  {
    id: 'pnlCalc',
    name: 'P&L Calculation',
    description: 'Profit and loss computation',
    color: 'purple',
    icon: DollarSign,
  },
  {
    id: 'reconciliation',
    name: 'Reconciliation',
    description: 'Data reconciliation across sources',
    color: 'cyan',
    icon: FileCheck,
  },
  {
    id: 'marginCalc',
    name: 'Margin Calculation',
    description: 'Calculate margin requirements',
    color: 'red',
    icon: Scale,
  },
  {
    id: 'interestCalc',
    name: 'Interest Calc',
    description: 'Calculate interest accruals',
    color: 'orange',
    icon: Percent,
  },
  {
    id: 'reporting',
    name: 'Reporting',
    description: 'Generate regulatory reports',
    color: 'indigo',
    icon: BarChart,
  },
];

// Color class mappings
export const colorClasses: Record<string, { bg: string; border: string; text: string }> = {
  blue: {
    bg: 'bg-blue-500/20',
    border: 'border-blue-500/40',
    text: 'text-blue-400',
  },
  green: {
    bg: 'bg-green-500/20',
    border: 'border-green-500/40',
    text: 'text-green-400',
  },
  amber: {
    bg: 'bg-amber-500/20',
    border: 'border-amber-500/40',
    text: 'text-amber-400',
  },
  purple: {
    bg: 'bg-purple-500/20',
    border: 'border-purple-500/40',
    text: 'text-purple-400',
  },
  cyan: {
    bg: 'bg-cyan-500/20',
    border: 'border-cyan-500/40',
    text: 'text-cyan-400',
  },
  red: {
    bg: 'bg-red-500/20',
    border: 'border-red-500/40',
    text: 'text-red-400',
  },
  orange: {
    bg: 'bg-orange-500/20',
    border: 'border-orange-500/40',
    text: 'text-orange-400',
  },
  indigo: {
    bg: 'bg-indigo-500/20',
    border: 'border-indigo-500/40',
    text: 'text-indigo-400',
  },
};

// Excel formula categories
export const excelFormulas = [
  {
    category: 'Math',
    formulas: [
      { name: 'SUM', desc: 'Sum of values' },
      { name: 'AVG', desc: 'Average of values' },
      { name: 'MIN', desc: 'Minimum value' },
      { name: 'MAX', desc: 'Maximum value' },
      { name: 'COUNT', desc: 'Count of values' },
      { name: 'ABS', desc: 'Absolute value' },
    ],
  },
  {
    category: 'Financial',
    formulas: [
      { name: 'PV', desc: 'Present value' },
      { name: 'FV', desc: 'Future value' },
      { name: 'NPV', desc: 'Net present value' },
      { name: 'IRR', desc: 'Internal rate of return' },
      { name: 'PMT', desc: 'Payment amount' },
      { name: 'RATE', desc: 'Interest rate' },
    ],
  },
  {
    category: 'Logic',
    formulas: [
      { name: 'IF', desc: 'Conditional logic' },
      { name: 'AND', desc: 'All conditions true' },
      { name: 'OR', desc: 'Any condition true' },
      { name: 'NOT', desc: 'Negate condition' },
      { name: 'IFERROR', desc: 'Error handling' },
    ],
  },
  {
    category: 'Lookup',
    formulas: [
      { name: 'VLOOKUP', desc: 'Vertical lookup' },
      { name: 'HLOOKUP', desc: 'Horizontal lookup' },
      { name: 'INDEX', desc: 'Value at index' },
      { name: 'MATCH', desc: 'Find position' },
    ],
  },
];
