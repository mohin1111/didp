import { useCallback, useState } from 'react';
import { exportsApi } from '../api';
import type { TableDataOverrides, CompareRow, MasterTablesMap } from '../types';

// Helper to download a blob as a file
function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function useExportState(
  masterTables: MasterTablesMap,
  _tableDataOverrides: TableDataOverrides,
  _getFilteredData: (tableKey: string, data: string[][]) => string[][],
  sqlOutput: string[][],
  sqlColumns: string[],
  compareRows: CompareRow[],
  selectedTables: string[]
) {
  const [isExporting, setIsExporting] = useState(false);

  // Export a single table to Excel via backend
  const exportTableToExcel = useCallback(async (tableKey: string) => {
    setIsExporting(true);
    try {
      const blob = await exportsApi.exportTables([tableKey], true);
      const displayName = masterTables[tableKey]?.label || tableKey.replace(/_/g, ' ');
      const timestamp = new Date().toISOString().slice(0, 10);
      downloadBlob(blob, `DIDP_${displayName.replace(/\s+/g, '_')}_${timestamp}.xlsx`);
    } catch (error) {
      console.error('Error exporting table:', error);
      throw error;
    } finally {
      setIsExporting(false);
    }
  }, [masterTables]);

  // Export SQL results to Excel via backend
  const exportSqlResultsToExcel = useCallback(async () => {
    if (sqlOutput.length === 0 || sqlColumns.length === 0) return;

    setIsExporting(true);
    try {
      const blob = await exportsApi.exportSqlResults(sqlColumns, sqlOutput);
      const timestamp = new Date().toISOString().slice(0, 10);
      downloadBlob(blob, `DIDP_SQL_Results_${timestamp}.xlsx`);
    } catch (error) {
      console.error('Error exporting SQL results:', error);
      throw error;
    } finally {
      setIsExporting(false);
    }
  }, [sqlOutput, sqlColumns]);

  // Export comparison rows to Excel via backend
  const exportComparisonToExcel = useCallback(async () => {
    if (compareRows.length === 0) return;

    setIsExporting(true);
    try {
      // Convert CompareRow to backend format
      const rows = compareRows.map(row => ({
        table_key: row.tableKey,
        row_index: row.rowIndex,
        data: row.data,
      }));

      // Build table names map
      const tableNames: Record<string, string> = {};
      compareRows.forEach(row => {
        if (!tableNames[row.tableKey]) {
          tableNames[row.tableKey] = masterTables[row.tableKey]?.label || row.tableKey;
        }
      });

      const blob = await exportsApi.exportComparison(rows, tableNames);
      const timestamp = new Date().toISOString().slice(0, 10);
      downloadBlob(blob, `DIDP_Comparison_${timestamp}.xlsx`);
    } catch (error) {
      console.error('Error exporting comparison:', error);
      throw error;
    } finally {
      setIsExporting(false);
    }
  }, [compareRows, masterTables]);

  // Export all selected tables to Excel via backend
  const exportAllSelectedTablesToExcel = useCallback(async () => {
    if (selectedTables.length === 0) return;

    setIsExporting(true);
    try {
      const blob = await exportsApi.exportTables(selectedTables, true);
      const timestamp = new Date().toISOString().slice(0, 10);
      downloadBlob(blob, `DIDP_Export_${timestamp}.xlsx`);
    } catch (error) {
      console.error('Error exporting tables:', error);
      throw error;
    } finally {
      setIsExporting(false);
    }
  }, [selectedTables]);

  // Export match results to Excel via backend
  const exportMatchResultsToExcel = useCallback(async (
    resultId: number,
    includeMatched: boolean = true,
    includeUnmatched: boolean = true
  ) => {
    setIsExporting(true);
    try {
      const blob = await exportsApi.exportMatchResults(resultId, includeMatched, includeUnmatched);
      const timestamp = new Date().toISOString().slice(0, 10);
      downloadBlob(blob, `DIDP_Match_Results_${resultId}_${timestamp}.xlsx`);
    } catch (error) {
      console.error('Error exporting match results:', error);
      throw error;
    } finally {
      setIsExporting(false);
    }
  }, []);

  return {
    exportTableToExcel,
    exportSqlResultsToExcel,
    exportComparisonToExcel,
    exportAllSelectedTablesToExcel,
    exportMatchResultsToExcel,
    isExporting,
  };
}
