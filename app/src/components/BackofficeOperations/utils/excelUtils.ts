import * as XLSX from 'xlsx';
import type { MasterTablesMap, TableDataOverrides, ImportedData } from '../types';

/**
 * Export data to Excel file
 */
export const exportToExcel = (data: string[][], columns: string[], filename: string): void => {
  // Create worksheet data with headers
  const wsData = [columns, ...data];
  const ws = XLSX.utils.aoa_to_sheet(wsData);

  // Auto-size columns
  const colWidths = columns.map((col, i) => {
    const maxLength = Math.max(
      col.length,
      ...data.map(row => (row[i] || '').toString().length)
    );
    return { wch: Math.min(maxLength + 2, 50) };
  });
  ws['!cols'] = colWidths;

  // Create workbook
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Data');

  // Generate filename with timestamp
  const timestamp = new Date().toISOString().slice(0, 10);
  XLSX.writeFile(wb, `${filename}_${timestamp}.xlsx`);
};

/**
 * Export a single table to Excel
 */
export const exportTableToExcel = (
  tableKey: string,
  masterTables: MasterTablesMap,
  tableDataOverrides: TableDataOverrides,
  getFilteredData: (key: string, data: string[][]) => string[][]
): void => {
  // Check for imported table override first
  const override = tableDataOverrides[tableKey];
  if (override) {
    const filteredData = getFilteredData(tableKey, override.data);
    const displayName = masterTables[tableKey]?.label || tableKey.replace(/_/g, ' ');
    exportToExcel(filteredData, override.columns, `CNSDB_${displayName.replace(/\s+/g, '_')}`);
    return;
  }

  // Fallback to master table
  const table = masterTables[tableKey];
  if (!table) return;

  const filteredData = getFilteredData(tableKey, table.data);
  exportToExcel(filteredData, table.columns, `CNSDB_${table.label.replace(/\s+/g, '_')}`);
};

/**
 * Export SQL results to Excel
 */
export const exportSqlResultsToExcel = (sqlOutput: string[][], sqlColumns: string[]): void => {
  if (sqlOutput.length === 0 || sqlColumns.length === 0) return;
  exportToExcel(sqlOutput, sqlColumns, 'CNSDB_SQL_Results');
};

/**
 * Export multiple selected tables to Excel (each as a separate sheet)
 */
export const exportAllSelectedTablesToExcel = (
  selectedTables: string[],
  masterTables: MasterTablesMap,
  tableDataOverrides: TableDataOverrides,
  getFilteredData: (key: string, data: string[][]) => string[][]
): void => {
  if (selectedTables.length === 0) return;

  const wb = XLSX.utils.book_new();
  const timestamp = new Date().toISOString().slice(0, 10);

  selectedTables.forEach(tableKey => {
    // Check for imported table override first
    const override = tableDataOverrides[tableKey];
    let columns: string[];
    let data: string[][];
    let label: string;

    if (override) {
      columns = override.columns;
      data = getFilteredData(tableKey, override.data);
      label = masterTables[tableKey]?.label || tableKey.replace(/_/g, ' ');
    } else {
      const table = masterTables[tableKey];
      if (!table) return;
      columns = table.columns;
      data = getFilteredData(tableKey, table.data);
      label = table.label;
    }

    const wsData = [columns, ...data];
    const ws = XLSX.utils.aoa_to_sheet(wsData);

    // Auto-size columns
    const colWidths = columns.map((col, i) => {
      const maxLength = Math.max(
        col.length,
        ...data.map(row => (row[i] || '').toString().length)
      );
      return { wch: Math.min(maxLength + 2, 50) };
    });
    ws['!cols'] = colWidths;

    // Use shortened sheet name (max 31 chars for Excel)
    const sheetName = label.substring(0, 31);
    XLSX.utils.book_append_sheet(wb, ws, sheetName);
  });

  XLSX.writeFile(wb, `CNSDB_Export_${timestamp}.xlsx`);
};

/**
 * Export comparison rows to Excel
 */
export const exportComparisonToExcel = (
  compareRows: { tableKey: string; rowIndex: number; data: string[] }[],
  masterTables: MasterTablesMap
): void => {
  if (compareRows.length === 0) return;

  const maxCols = Math.max(...compareRows.map(r => r.data.length));
  const headers = ['Source Table', 'Row #', ...Array.from({ length: maxCols }, (_, i) => `Column ${i + 1}`)];

  const data = compareRows.map(row => [
    masterTables[row.tableKey]?.label || row.tableKey,
    (row.rowIndex + 1).toString(),
    ...row.data
  ]);

  exportToExcel(data, headers, 'CNSDB_Comparison');
};

/**
 * Read Excel file and return workbook
 */
export const readExcelFile = (file: File): Promise<XLSX.WorkBook> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        resolve(workbook);
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
};

/**
 * Parse worksheet data into columns and rows
 */
export const parseWorksheetData = (
  workbook: XLSX.WorkBook,
  sheetName: string,
  fileName: string
): ImportedData | null => {
  const worksheet = workbook.Sheets[sheetName];
  if (!worksheet) return null;

  const jsonData = XLSX.utils.sheet_to_json<string[]>(worksheet, { header: 1 });

  if (jsonData.length === 0) {
    return null;
  }

  // First row as headers, rest as data
  const headers = (jsonData[0] || []).map(h => String(h || ''));
  const rows = jsonData.slice(1).map(row =>
    headers.map((_, i) => String((row as string[])[i] ?? ''))
  );

  return {
    columns: headers,
    data: rows,
    fileName,
    sheetName
  };
};
