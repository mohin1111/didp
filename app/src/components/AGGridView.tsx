import { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import type { ColDef, GetRowIdParams, CellSelectionChangedEvent, CellValueChangedEvent, GridReadyEvent, GridApi } from 'ag-grid-community';
import { getTableConfig } from '../data/tableConfigs';
import { useToast } from './Toast';
import { evaluateFormula, isFormula } from '../utils/formulaEngine';
import { GridToolbar } from './grid/GridToolbar';
import { FormulaBar } from './grid/FormulaBar';
import { ContextMenu } from './grid/ContextMenu';
import { ColumnPanel } from './grid/ColumnPanel';
import { StatusBar } from './grid/StatusBar';
import { balanceCellStyle, statusFields, numericStyleFields } from './grid/gridUtils';

ModuleRegistry.registerModules([AllCommunityModule]);

interface AGGridViewProps {
  selectedTable: string;
}

const statusCellRenderer = (params: { value: string }) => {
  const colors: Record<string, string> = { 'Active': 'bg-green-100 text-green-700', 'Inactive': 'bg-slate-100 text-slate-600', 'Suspended': 'bg-red-100 text-red-700', 'Executed': 'bg-green-100 text-green-700', 'Pending': 'bg-amber-100 text-amber-700', 'Partial': 'bg-blue-100 text-blue-700', 'Normal': 'bg-green-100 text-green-700', 'Warning': 'bg-amber-100 text-amber-700', 'Critical': 'bg-red-100 text-red-700', 'Verified': 'bg-green-100 text-green-700', 'Rejected': 'bg-red-100 text-red-700', 'Settled': 'bg-green-100 text-green-700', 'Open': 'bg-blue-100 text-blue-700', 'Closed': 'bg-slate-100 text-slate-600', 'Long': 'bg-green-100 text-green-700', 'Short': 'bg-red-100 text-red-700', 'BUY': 'bg-green-100 text-green-700', 'SELL': 'bg-red-100 text-red-700', 'Posted': 'bg-green-100 text-green-700', 'Calculated': 'bg-blue-100 text-blue-700', 'DR': 'bg-amber-100 text-amber-700', 'CR': 'bg-green-100 text-green-700' };
  return <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${colors[params.value] || 'bg-slate-100 text-slate-600'}`}>{params.value}</span>;
};

export default function AGGridView({ selectedTable }: AGGridViewProps) {
  const gridRef = useRef<AgGridReact>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [gridApi, setGridApi] = useState<GridApi | null>(null);
  const [cellRef, setCellRef] = useState('A1');
  const [formulaBarValue, setFormulaBarValue] = useState('');
  const [selectedCells, setSelectedCells] = useState({ sum: 0, avg: 0, count: 0 });
  const [showColumnPanel, setShowColumnPanel] = useState(false);
  const [quickFilter, setQuickFilter] = useState('');
  const [undoSize, setUndoSize] = useState(0);
  const [redoSize, setRedoSize] = useState(0);
  const [hasChanges, setHasChanges] = useState(false);
  const [contextMenu, setContextMenu] = useState({ x: 0, y: 0, visible: false });
  const [formulas, setFormulas] = useState<Map<string, string>>(new Map());
  const [showFormulaHelper, setShowFormulaHelper] = useState(false);
  const { addToast } = useToast();

  const tableConfig = useMemo(() => getTableConfig(selectedTable), [selectedTable]);
  const [rowData, setRowData] = useState([...tableConfig.data]);

  const getCellValueForFormula = useCallback((col: number, row: number): number | string | null => {
    if (!gridApi) return null;
    const rowNode = gridApi.getDisplayedRowAtIndex(row);
    if (!rowNode?.data) return null;
    const allCols = gridApi.getColumns();
    if (!allCols || col >= allCols.length) return null;
    const field = allCols[col]?.getColDef()?.field;
    if (!field) return null;
    const formulaKey = `${row}:${col}`;
    const formula = formulas.get(formulaKey);
    if (formula) return evaluateFormula(formula, getCellValueForFormula, { col, row });
    return rowNode.data[field] ?? null;
  }, [gridApi, formulas]);

  const getColumnIndex = useCallback((field: string): number => {
    if (!gridApi) return -1;
    const allCols = gridApi.getColumns();
    return allCols?.findIndex(col => col.getColDef().field === field) ?? -1;
  }, [gridApi]);

  useEffect(() => {
    const config = getTableConfig(selectedTable);
    setRowData([...config.data]);
    setQuickFilter('');
    setCellRef('A1');
    setFormulaBarValue('');
    setSelectedCells({ sum: 0, avg: 0, count: 0 });
    setHasChanges(false);
    setFormulas(new Map());
    addToast(`Loaded ${config.data.length} records from ${selectedTable}`, 'info');
  }, [selectedTable, addToast]);

  const columnDefs = useMemo<ColDef[]>(() => {
    return tableConfig.columns.map(col => ({
      ...col,
      editable: true,
      cellStyle: col.field && numericStyleFields.includes(col.field) ? balanceCellStyle : undefined,
      cellRenderer: col.field && statusFields.includes(col.field) ? statusCellRenderer : undefined,
    }));
  }, [tableConfig.columns]);

  const defaultColDef = useMemo<ColDef>(() => ({ sortable: true, filter: true, resizable: true, suppressMovable: false, editable: true }), []);
  const getRowId = useCallback((params: GetRowIdParams) => String(params.data.id), []);
  const onGridReady = useCallback((params: GridReadyEvent) => setGridApi(params.api), []);
  const updateUndoRedoState = useCallback(() => { if (gridApi) { setUndoSize(gridApi.getCurrentUndoSize()); setRedoSize(gridApi.getCurrentRedoSize()); } }, [gridApi]);

  const onCellSelectionChanged = useCallback((_event: CellSelectionChangedEvent) => {
    if (!gridApi) return;
    const ranges = gridApi.getCellRanges();
    if (!ranges?.length) return;
    const range = ranges[0];
    const startRow = range.startRow?.rowIndex ?? 0;
    const columns = range.columns;
    setCellRef(`${columns[0]?.getColDef()?.headerName?.charAt(0) || 'A'}${startRow + 1}`);
    let sum = 0, count = 0;
    for (let r = Math.min(startRow, range.endRow?.rowIndex ?? 0); r <= Math.max(startRow, range.endRow?.rowIndex ?? 0); r++) {
      const node = gridApi.getDisplayedRowAtIndex(r);
      if (node?.data) {
        for (const col of columns) {
          const val = node.data[col.getColDef().field || ''];
          if (typeof val === 'number') { sum += val; count++; }
        }
      }
    }
    setSelectedCells({ sum, avg: count > 0 ? sum / count : 0, count });
    if (startRow === (range.endRow?.rowIndex ?? 0) && columns.length === 1) {
      const node = gridApi.getDisplayedRowAtIndex(startRow);
      if (node?.data) {
        const field = columns[0].getColDef().field;
        const colIdx = getColumnIndex(field ?? '');
        const formula = formulas.get(`${startRow}:${colIdx}`);
        setFormulaBarValue(formula || String(node.data[field || ''] ?? ''));
      }
    }
  }, [gridApi, formulas, getColumnIndex]);

  const onCellValueChanged = useCallback((_event: CellValueChangedEvent) => { setHasChanges(true); updateUndoRedoState(); }, [updateUndoRedoState]);
  const handleQuickFilterChange = useCallback((value: string) => { setQuickFilter(value); gridApi?.setGridOption('quickFilterText', value); }, [gridApi]);

  const handleFormulaSubmit = useCallback(() => {
    if (!gridApi) return;
    const ranges = gridApi.getCellRanges();
    if (!ranges?.length) { addToast('Please select a cell first', 'warning'); return; }
    const range = ranges[0];
    const rowIdx = range.startRow?.rowIndex ?? 0;
    const field = range.columns[0]?.getColDef()?.field;
    const colIdx = getColumnIndex(field ?? '');
    if (isFormula(formulaBarValue)) {
      const result = evaluateFormula(formulaBarValue, getCellValueForFormula, { col: colIdx, row: rowIdx });
      setFormulas(new Map(formulas).set(`${rowIdx}:${colIdx}`, formulaBarValue));
      const node = gridApi.getDisplayedRowAtIndex(rowIdx);
      if (node && field) { node.setDataValue(field, result); }
      addToast('Formula applied', 'success');
    } else {
      const node = gridApi.getDisplayedRowAtIndex(rowIdx);
      if (node && field) {
        const numVal = parseFloat(formulaBarValue);
        node.setDataValue(field, isNaN(numVal) ? formulaBarValue : numVal);
      }
      formulas.delete(`${rowIdx}:${colIdx}`);
      setFormulas(new Map(formulas));
    }
    setHasChanges(true);
  }, [gridApi, formulaBarValue, formulas, getColumnIndex, getCellValueForFormula, addToast]);

  const handleFormulaCancel = useCallback(() => setFormulaBarValue(''), []);
  const handleInsertFunction = useCallback((fn: string) => setFormulaBarValue(`=${fn}(`), []);

  // Toolbar actions
  const handleSave = useCallback(() => { addToast('Changes saved successfully', 'success'); setHasChanges(false); }, [addToast]);
  const handleAddRow = useCallback(() => { const newRow = { id: Date.now(), ...Object.fromEntries(tableConfig.columns.map(c => [c.field, ''])) }; setRowData(prev => [newRow, ...prev]); addToast('New row added', 'success'); setHasChanges(true); }, [tableConfig.columns, addToast]);
  const handleDeleteRow = useCallback(() => { const rows = gridApi?.getSelectedRows(); if (rows?.length) { setRowData(prev => prev.filter(r => !rows.includes(r))); addToast(`Deleted ${rows.length} row(s)`, 'info'); setHasChanges(true); } }, [gridApi, addToast]);
  const handleDuplicate = useCallback(() => { const rows = gridApi?.getSelectedRows(); if (rows?.length) { const newRows = rows.map(r => ({ ...r, id: Date.now() + Math.random() })); setRowData(prev => [...newRows, ...prev]); addToast(`Duplicated ${rows.length} row(s)`, 'success'); setHasChanges(true); } }, [gridApi, addToast]);
  const handleExport = useCallback(() => { gridApi?.exportDataAsCsv({ fileName: `${selectedTable}_export.csv` }); addToast('Exported to CSV', 'success'); }, [gridApi, selectedTable, addToast]);
  const handleRefresh = useCallback(() => { setRowData([...tableConfig.data]); setHasChanges(false); addToast('Data refreshed', 'info'); }, [tableConfig.data, addToast]);
  const handlePrint = useCallback(() => { window.print(); }, []);

  // Context menu actions
  const handleCut = useCallback(() => { addToast('Cut to clipboard', 'info'); }, [addToast]);
  const handleCopy = useCallback(() => { addToast('Copied to clipboard', 'info'); }, [addToast]);
  const handlePaste = useCallback(() => { addToast('Pasted from clipboard', 'info'); }, [addToast]);
  const handleInsertAbove = useCallback(() => { handleAddRow(); }, [handleAddRow]);
  const handleInsertBelow = useCallback(() => { handleAddRow(); }, [handleAddRow]);

  // Context menu handler
  const onCellContextMenu = useCallback((e: React.MouseEvent) => { e.preventDefault(); setContextMenu({ x: e.clientX, y: e.clientY, visible: true }); }, []);

  return (
    <div ref={containerRef} className="flex-1 flex flex-col bg-white relative" onContextMenu={onCellContextMenu}>
      <div data-demo="toolbar">
        <GridToolbar gridApi={gridApi} undoSize={undoSize} redoSize={redoSize} hasChanges={hasChanges} quickFilter={quickFilter} showColumnPanel={showColumnPanel} onQuickFilterChange={handleQuickFilterChange} onShowColumnPanel={setShowColumnPanel} onSave={handleSave} onAddRow={handleAddRow} onDeleteRow={handleDeleteRow} onDuplicate={handleDuplicate} onExport={handleExport} onRefresh={handleRefresh} onPrint={handlePrint} />
        <FormulaBar cellRef={cellRef} formulaBarValue={formulaBarValue} showFormulaHelper={showFormulaHelper} onFormulaChange={setFormulaBarValue} onFormulaSubmit={handleFormulaSubmit} onFormulaCancel={handleFormulaCancel} onToggleHelper={() => setShowFormulaHelper(!showFormulaHelper)} onInsertFunction={handleInsertFunction} />
      </div>
      <div className="flex-1 ag-theme-alpine">
        <AgGridReact ref={gridRef} rowData={rowData} columnDefs={columnDefs} defaultColDef={defaultColDef} getRowId={getRowId} onGridReady={onGridReady} onCellSelectionChanged={onCellSelectionChanged} onCellValueChanged={onCellValueChanged} rowSelection={{ mode: 'multiRow' }} cellSelection={true} undoRedoCellEditing={true} undoRedoCellEditingLimit={20} animateRows={true} />
      </div>
      <StatusBar rowCount={rowData.length} selectedCells={selectedCells} />
      {showColumnPanel && <ColumnPanel gridApi={gridApi} columns={gridApi?.getColumns() ?? null} onClose={() => setShowColumnPanel(false)} />}
      <ContextMenu x={contextMenu.x} y={contextMenu.y} visible={contextMenu.visible} onClose={() => setContextMenu(prev => ({ ...prev, visible: false }))} onCut={handleCut} onCopy={handleCopy} onPaste={handlePaste} onDelete={handleDeleteRow} onInsertAbove={handleInsertAbove} onInsertBelow={handleInsertBelow} onDuplicate={handleDuplicate} />
    </div>
  );
}
