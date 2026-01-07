import { useState, useCallback, useRef } from 'react';
import type { TableDataOverrides } from '../types';
import { importsApi, type UploadResponse } from '../api';

interface ImportedData {
  columns: string[];
  data: string[][];
  fileName: string;
  sheetName: string;
}

export function useImportState(
  tableDataOverrides: TableDataOverrides,
  _setTableDataOverrides: React.Dispatch<React.SetStateAction<TableDataOverrides>>,
  selectedTables: string[],
  setSelectedTables: React.Dispatch<React.SetStateAction<string[]>>,
  setExpandedTable: React.Dispatch<React.SetStateAction<string | null>>,
  setPythonError: (error: string) => void,
  refreshTables: () => void
) {
  const [showImportModal, setShowImportModal] = useState(false);
  const [importedData, setImportedData] = useState<ImportedData | null>(null);
  const [importTargetTable, setImportTargetTable] = useState('');
  const [importSheets, setImportSheets] = useState<string[]>([]);
  const [selectedImportSheet, setSelectedImportSheet] = useState('');
  const [importFileName, setImportFileName] = useState('');
  const [hasHeaders, setHasHeaders] = useState(true);
  const [customColumnNames, setCustomColumnNames] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResponse, setUploadResponse] = useState<UploadResponse | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const response = await importsApi.upload(file);
      setUploadResponse(response);
      setImportFileName(response.filename);
      setImportSheets(response.sheets || []);
      setSelectedImportSheet(response.sheets?.[0] || '');
      setHasHeaders(response.has_headers);

      if (response.has_headers) {
        setCustomColumnNames([]);
      } else {
        setCustomColumnNames(response.columns);
      }

      setImportedData({
        columns: response.columns,
        data: response.preview,
        fileName: response.filename,
        sheetName: response.sheets?.[0] || '',
      });

      setShowImportModal(true);
    } catch (error) {
      console.error('Error uploading file:', error);
      setPythonError(error instanceof Error ? error.message : 'Error uploading file');
    } finally {
      setIsUploading(false);
      event.target.value = '';
    }
  }, [setPythonError]);

  const handleSheetChange = useCallback(async (sheetName: string) => {
    if (!uploadResponse) return;

    setSelectedImportSheet(sheetName);
    try {
      const preview = await importsApi.preview(uploadResponse.file_id, sheetName, hasHeaders);
      setImportedData({
        columns: preview.columns,
        data: preview.preview,
        fileName: importFileName,
        sheetName,
      });
    } catch (error) {
      console.error('Error loading sheet:', error);
      setPythonError(error instanceof Error ? error.message : 'Error loading sheet');
    }
  }, [uploadResponse, hasHeaders, importFileName, setPythonError]);

  const toggleHasHeaders = useCallback(async () => {
    if (!uploadResponse) return;

    const newHasHeaders = !hasHeaders;
    setHasHeaders(newHasHeaders);

    try {
      const preview = await importsApi.preview(
        uploadResponse.file_id,
        selectedImportSheet || undefined,
        newHasHeaders
      );
      setImportedData(prev => prev ? {
        ...prev,
        columns: preview.columns,
        data: preview.preview,
      } : null);

      if (!newHasHeaders) {
        setCustomColumnNames(preview.columns);
      } else {
        setCustomColumnNames([]);
      }
    } catch (error) {
      console.error('Error toggling headers:', error);
    }
  }, [uploadResponse, hasHeaders, selectedImportSheet]);

  const updateColumnName = useCallback((index: number, name: string) => {
    if (!importedData) return;

    const newNames = [...importedData.columns];
    newNames[index] = name;

    if (!hasHeaders) {
      setCustomColumnNames(newNames);
    }
    setImportedData({
      ...importedData,
      columns: newNames,
    });
  }, [importedData, hasHeaders]);

  const cancelImport = useCallback(() => {
    setShowImportModal(false);
    setImportedData(null);
    setUploadResponse(null);
    setImportSheets([]);
    setSelectedImportSheet('');
    setImportFileName('');
    setImportTargetTable('');
    setHasHeaders(true);
    setCustomColumnNames([]);
  }, []);

  const confirmImport = useCallback(async () => {
    if (!uploadResponse || !importTargetTable) return;

    try {
      await importsApi.confirm({
        fileId: uploadResponse.file_id,
        tableKey: importTargetTable,
        tableName: importTargetTable.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
        sheetName: selectedImportSheet || undefined,
        hasHeaders,
        category: 'Imported',
      });

      // Refresh tables from backend
      refreshTables();

      cancelImport();
      if (!selectedTables.includes(importTargetTable)) {
        setSelectedTables(prev => [...prev, importTargetTable]);
      }
      setExpandedTable(importTargetTable);
    } catch (error) {
      console.error('Error confirming import:', error);
      setPythonError(error instanceof Error ? error.message : 'Error importing data');
    }
  }, [uploadResponse, importTargetTable, selectedImportSheet, hasHeaders, selectedTables, cancelImport, refreshTables, setSelectedTables, setExpandedTable, setPythonError]);

  const createNewTableFromImport = useCallback(async () => {
    if (!uploadResponse) return;

    const baseKey = importFileName.replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
    let tableKey = `imported_${baseKey}`;
    let counter = 1;
    while (tableDataOverrides[tableKey]) {
      tableKey = `imported_${baseKey}_${counter}`;
      counter++;
    }

    try {
      await importsApi.confirm({
        fileId: uploadResponse.file_id,
        tableKey,
        tableName: tableKey.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
        sheetName: selectedImportSheet || undefined,
        hasHeaders,
        category: 'Imported',
      });

      // Refresh tables from backend
      refreshTables();

      cancelImport();
      setSelectedTables(prev => [...prev, tableKey]);
      setExpandedTable(tableKey);
    } catch (error) {
      console.error('Error creating table:', error);
      setPythonError(error instanceof Error ? error.message : 'Error creating table');
    }
  }, [uploadResponse, importFileName, selectedImportSheet, hasHeaders, tableDataOverrides, cancelImport, refreshTables, setSelectedTables, setExpandedTable, setPythonError]);

  return {
    showImportModal, setShowImportModal,
    importedData, setImportedData,
    importTargetTable, setImportTargetTable,
    importSheets, setImportSheets,
    selectedImportSheet, setSelectedImportSheet,
    importFileName, setImportFileName,
    hasHeaders, setHasHeaders,
    customColumnNames, setCustomColumnNames,
    isUploading,
    fileInputRef,
    handleFileSelect, handleSheetChange, confirmImport, cancelImport, createNewTableFromImport,
    toggleHasHeaders, updateColumnName,
  };
}
