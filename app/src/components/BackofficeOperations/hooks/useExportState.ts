import { useCallback } from 'react';
import { masterTables } from '../data';
import {
  exportTableToExcel as exportTable,
  exportSqlResultsToExcel as exportSql,
  exportAllSelectedTablesToExcel as exportAll,
  exportComparisonToExcel as exportComparison,
} from '../utils';
import type { TableDataOverrides, CompareRow } from '../types';

export function useExportState(
  tableDataOverrides: TableDataOverrides,
  getFilteredData: (tableKey: string, data: string[][]) => string[][],
  sqlOutput: string[][],
  sqlColumns: string[],
  compareRows: CompareRow[],
  selectedTables: string[]
) {
  const exportTableToExcel = useCallback((tableKey: string) => {
    exportTable(tableKey, masterTables, tableDataOverrides, getFilteredData);
  }, [tableDataOverrides, getFilteredData]);

  const exportSqlResultsToExcel = useCallback(() => {
    if (sqlOutput.length > 0 && sqlColumns.length > 0) {
      exportSql(sqlOutput, sqlColumns);
    }
  }, [sqlOutput, sqlColumns]);

  const exportComparisonToExcel = useCallback(() => {
    if (compareRows.length > 0) {
      exportComparison(compareRows, masterTables);
    }
  }, [compareRows]);

  const exportAllSelectedTablesToExcel = useCallback(() => {
    if (selectedTables.length > 0) {
      exportAll(selectedTables, masterTables, tableDataOverrides, getFilteredData);
    }
  }, [selectedTables, tableDataOverrides, getFilteredData]);

  return {
    exportTableToExcel,
    exportSqlResultsToExcel,
    exportComparisonToExcel,
    exportAllSelectedTablesToExcel,
  };
}
