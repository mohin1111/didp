import { useState, useCallback, useRef } from 'react';
import * as XLSX from 'xlsx';
import type { TableDataOverrides } from '../types';

interface ImportedData {
  columns: string[];
  data: string[][];
  fileName: string;
  sheetName: string;
}

export function useImportState(
  tableDataOverrides: TableDataOverrides,
  setTableDataOverrides: React.Dispatch<React.SetStateAction<TableDataOverrides>>,
  selectedTables: string[],
  setSelectedTables: React.Dispatch<React.SetStateAction<string[]>>,
  setExpandedTable: React.Dispatch<React.SetStateAction<string | null>>,
  setPythonError: (error: string) => void
) {
  const [showImportModal, setShowImportModal] = useState(false);
  const [importedData, setImportedData] = useState<ImportedData | null>(null);
  const [importTargetTable, setImportTargetTable] = useState('');
  const [importSheets, setImportSheets] = useState<string[]>([]);
  const [selectedImportSheet, setSelectedImportSheet] = useState('');
  const [importWorkbook, setImportWorkbook] = useState<XLSX.WorkBook | null>(null);
  const [importFileName, setImportFileName] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadSheetData = useCallback((workbook: XLSX.WorkBook, sheetName: string, fileName: string) => {
    const worksheet = workbook.Sheets[sheetName];
    if (!worksheet) return;

    const jsonData = XLSX.utils.sheet_to_json<string[]>(worksheet, { header: 1 });
    if (jsonData.length === 0) {
      setImportedData(null);
      return;
    }

    const headers = (jsonData[0] || []).map(h => String(h || ''));
    const rows = jsonData.slice(1).map(row =>
      headers.map((_, i) => String((row as string[])[i] ?? ''))
    );

    setImportedData({ columns: headers, data: rows, fileName, sheetName });
  }, []);

  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        setImportWorkbook(workbook);
        setImportFileName(file.name);
        setImportSheets(workbook.SheetNames);
        setSelectedImportSheet(workbook.SheetNames[0] || '');
        if (workbook.SheetNames.length > 0) {
          loadSheetData(workbook, workbook.SheetNames[0], file.name);
        }
        setShowImportModal(true);
      } catch (error) {
        console.error('Error reading Excel file:', error);
        setPythonError('Error reading Excel file.');
      }
    };
    reader.readAsArrayBuffer(file);
    event.target.value = '';
  }, [loadSheetData, setPythonError]);

  const handleSheetChange = useCallback((sheetName: string) => {
    setSelectedImportSheet(sheetName);
    if (importWorkbook) {
      loadSheetData(importWorkbook, sheetName, importFileName);
    }
  }, [importWorkbook, importFileName, loadSheetData]);

  const cancelImport = useCallback(() => {
    setShowImportModal(false);
    setImportedData(null);
    setImportWorkbook(null);
    setImportSheets([]);
    setSelectedImportSheet('');
    setImportFileName('');
    setImportTargetTable('');
  }, []);

  const confirmImport = useCallback(() => {
    if (!importedData || !importTargetTable) return;
    setTableDataOverrides(prev => ({
      ...prev,
      [importTargetTable]: { columns: importedData.columns, data: importedData.data }
    }));
    cancelImport();
    if (!selectedTables.includes(importTargetTable)) {
      setSelectedTables(prev => [...prev, importTargetTable]);
    }
    setExpandedTable(importTargetTable);
  }, [importedData, importTargetTable, selectedTables, cancelImport, setTableDataOverrides, setSelectedTables, setExpandedTable]);

  const createNewTableFromImport = useCallback(() => {
    if (!importedData) return;
    const baseKey = importFileName.replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
    let tableKey = `imported_${baseKey}`;
    let counter = 1;
    while (tableDataOverrides[tableKey]) {
      tableKey = `imported_${baseKey}_${counter}`;
      counter++;
    }
    setTableDataOverrides(prev => ({
      ...prev,
      [tableKey]: { columns: importedData.columns, data: importedData.data }
    }));
    cancelImport();
    setSelectedTables(prev => [...prev, tableKey]);
    setExpandedTable(tableKey);
  }, [importedData, importFileName, tableDataOverrides, cancelImport, setTableDataOverrides, setSelectedTables, setExpandedTable]);

  return {
    showImportModal, setShowImportModal,
    importedData, setImportedData,
    importTargetTable, setImportTargetTable,
    importSheets, setImportSheets,
    selectedImportSheet, setSelectedImportSheet,
    importWorkbook, setImportWorkbook,
    importFileName, setImportFileName,
    fileInputRef,
    handleFileSelect, handleSheetChange, confirmImport, cancelImport, createNewTableFromImport,
  };
}
