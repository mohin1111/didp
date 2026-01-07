import { useState, useCallback } from 'react';
import { masterTables, DEFAULT_SQL_QUERY, DEFAULT_PYTHON_SCRIPT } from '../data';
import { executeSqlQuery as executeSql } from '../utils';
import type { TableDataOverrides } from '../types';

export function useSqlPythonState(
  tableDataOverrides: TableDataOverrides,
  setChartYAxis: React.Dispatch<React.SetStateAction<number>>
) {
  const [sqlQuery, setSqlQuery] = useState(DEFAULT_SQL_QUERY);
  const [sqlOutput, setSqlOutput] = useState<string[][]>([]);
  const [sqlColumns, setSqlColumns] = useState<string[]>([]);
  const [customScript, setCustomScript] = useState(DEFAULT_PYTHON_SCRIPT);
  const [pythonOutput, setPythonOutput] = useState('');
  const [pythonError, setPythonError] = useState('');

  const executeSqlQuery = useCallback(() => {
    setPythonError('');
    const result = executeSql(sqlQuery, masterTables, tableDataOverrides);
    if (result.error) {
      setPythonError(result.error);
    } else {
      setSqlColumns(result.columns);
      setSqlOutput(result.data);
      const numericIdx = result.columns.findIndex(c =>
        c.includes('Value') || c.includes('Price') || c.includes('Qty') || c.includes('Amount')
      );
      if (numericIdx >= 0) setChartYAxis(numericIdx);
    }
  }, [sqlQuery, tableDataOverrides, setChartYAxis]);

  const executePythonScript = useCallback(() => {
    setPythonOutput('');
    setPythonError('');
    setTimeout(() => {
      setPythonOutput(`[Execution Output - ${new Date().toLocaleTimeString()}]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Loading data from selected tables...
✓ Loaded trades: 1,247 rows
✓ Loaded settlements: 892 rows

Processing trades...
✓ Filtered settled trades: 847 rows
✓ Calculated net positions for 156 clients

Results Summary:
┌─────────────────────┬──────────┬────────────┐
│ Metric              │ Value    │ Change     │
├─────────────────────┼──────────┼────────────┤
│ Total Trades        │ 1,247    │ +12.3%     │
│ Settled Value       │ $45.2M   │ +8.7%      │
│ Avg Trade Size      │ $36,247  │ -2.1%      │
│ Flagged for Review  │ 23       │ -15.0%     │
└─────────────────────┴──────────┴────────────┘

✓ Script completed successfully in 2.34s
✓ Results exported to: output/positions_${new Date().toISOString().split('T')[0]}.csv`);
    }, 1500);
  }, []);

  return {
    sqlQuery, setSqlQuery,
    sqlOutput, setSqlOutput,
    sqlColumns, setSqlColumns,
    customScript, setCustomScript,
    pythonOutput, setPythonOutput,
    pythonError, setPythonError,
    executeSqlQuery, executePythonScript,
  };
}
