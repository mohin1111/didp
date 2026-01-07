import { Clock, TrendingUp, AlertTriangle, Database, Calculator, FileText, Building2, Code } from 'lucide-react';
import type { ProcessDefinition } from '../types';

export const processes: ProcessDefinition[] = [
  { id: 'eodProcess', name: 'EOD Processing', description: 'End of day position calculation & settlement', icon: Clock, color: 'blue' },
  { id: 'mtmCalc', name: 'MTM Calculation', description: 'Mark-to-market for all open positions', icon: TrendingUp, color: 'green' },
  { id: 'marginCalc', name: 'Margin Calculation', description: 'Calculate daily margin requirements', icon: AlertTriangle, color: 'red' },
  { id: 'closingPrice', name: 'Closing Price Import', description: 'Import EOD closing prices from exchanges', icon: Database, color: 'cyan' },
  { id: 'brokerageCalc', name: 'Brokerage Calculation', description: 'Calculate client & broker commissions', icon: Calculator, color: 'orange' },
  { id: 'plCalc', name: 'P/L Calculation', description: 'Calculate realized profit/loss', icon: TrendingUp, color: 'purple' },
  { id: 'corporateAction', name: 'Corporate Actions', description: 'Process dividends, splits, bonus', icon: FileText, color: 'yellow' },
  { id: 'accountPosting', name: 'Account Posting', description: 'Generate journal entries', icon: Building2, color: 'blue' },
  { id: 'formula', name: 'Custom Formula', description: 'Apply formulas on selected cells', icon: Calculator, color: 'yellow' },
  { id: 'custom', name: 'Custom Script', description: 'Execute custom Python processing', icon: Code, color: 'yellow' },
];

export const getProcessById = (id: string): ProcessDefinition | undefined => {
  return processes.find(p => p.id === id);
};
