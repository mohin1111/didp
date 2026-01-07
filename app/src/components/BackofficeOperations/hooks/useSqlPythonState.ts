import { useState, useCallback } from 'react';
import { DEFAULT_SQL_QUERY, DEFAULT_PYTHON_SCRIPT } from '../data';
import { sqlApi, pythonApi } from '../api';
import type { TableDataOverrides } from '../types';

export function useSqlPythonState(
  _tableDataOverrides: TableDataOverrides,
  setChartYAxis: React.Dispatch<React.SetStateAction<number>>
) {
  const [sqlQuery, setSqlQuery] = useState(DEFAULT_SQL_QUERY);
  const [sqlOutput, setSqlOutput] = useState<string[][]>([]);
  const [sqlColumns, setSqlColumns] = useState<string[]>([]);
  const [customScript, setCustomScript] = useState(DEFAULT_PYTHON_SCRIPT);
  const [pythonOutput, setPythonOutput] = useState('');
  const [pythonError, setPythonError] = useState('');
  const [pythonResultColumns, setPythonResultColumns] = useState<string[]>([]);
  const [pythonResultData, setPythonResultData] = useState<string[][]>([]);
  const [isExecuting, setIsExecuting] = useState(false);

  const executeSqlQuery = useCallback(async () => {
    setPythonError('');
    setIsExecuting(true);

    try {
      const result = await sqlApi.execute(sqlQuery);
      if (result.error) {
        setPythonError(result.error);
        setSqlColumns([]);
        setSqlOutput([]);
      } else {
        setSqlColumns(result.columns);
        setSqlOutput(result.data);
        const numericIdx = result.columns.findIndex(c =>
          c.includes('Value') || c.includes('Price') || c.includes('Qty') || c.includes('Amount')
        );
        if (numericIdx >= 0) setChartYAxis(numericIdx);
      }
    } catch (error) {
      setPythonError(error instanceof Error ? error.message : 'SQL execution failed');
      setSqlColumns([]);
      setSqlOutput([]);
    } finally {
      setIsExecuting(false);
    }
  }, [sqlQuery, setChartYAxis]);

  const executePythonScript = useCallback(async () => {
    setPythonOutput('');
    setPythonError('');
    setPythonResultColumns([]);
    setPythonResultData([]);
    setIsExecuting(true);

    try {
      const result = await pythonApi.execute(customScript);

      // Set output
      if (result.output) {
        setPythonOutput(result.output);
      }

      // Set error if any
      if (result.error) {
        setPythonError(result.error);
      }

      // Set result data if returned
      if (result.result_columns && result.result_data) {
        setPythonResultColumns(result.result_columns);
        setPythonResultData(result.result_data);

        // Also set to SQL output for display in results tab
        setSqlColumns(result.result_columns);
        setSqlOutput(result.result_data);
      }

      // Add execution info to output
      const execInfo = `\n[Executed in ${result.execution_time_ms}ms]`;
      setPythonOutput(prev => prev + execInfo);

    } catch (error) {
      setPythonError(error instanceof Error ? error.message : 'Python execution failed');
    } finally {
      setIsExecuting(false);
    }
  }, [customScript]);

  return {
    sqlQuery, setSqlQuery,
    sqlOutput, setSqlOutput,
    sqlColumns, setSqlColumns,
    customScript, setCustomScript,
    pythonOutput, setPythonOutput,
    pythonError, setPythonError,
    pythonResultColumns, setPythonResultColumns,
    pythonResultData, setPythonResultData,
    isExecuting,
    executeSqlQuery, executePythonScript,
  };
}
