import { X, Upload, Table, Plus, FileSpreadsheet, Download, ToggleLeft, ToggleRight, Edit3, Layers, CheckSquare, Square, CheckCircle2 } from 'lucide-react';
import { useBackoffice } from '../context/BackofficeContext';
import { useState } from 'react';

export default function ImportModal() {
  const {
    showImportModal,
    importFileName,
    importSheets,
    selectedImportSheet,
    selectedSheetsForImport,
    importedData,
    importTargetTable,
    setImportTargetTable,
    tableDataOverrides,
    masterTables,
    handleSheetChange,
    confirmImport,
    cancelImport,
    createNewTableFromImport,
    importAllSheets,
    hasHeaders,
    toggleHasHeaders,
    updateColumnName,
    toggleSheetForImport,
    selectAllSheets,
    deselectAllSheets,
    importSelectedSheets,
  } = useBackoffice();

  const [editingColumnIndex, setEditingColumnIndex] = useState<number | null>(null);
  const [editingColumnName, setEditingColumnName] = useState('');

  if (!showImportModal) return null;

  // Get list of existing tables (both master and imported)
  const existingTables = [
    ...Object.keys(masterTables).map(key => ({
      key,
      name: masterTables[key].label,
      category: masterTables[key].category
    })),
    ...Object.keys(tableDataOverrides)
      .filter(key => !masterTables[key])
      .map(key => ({
        key,
        name: key.replace(/_/g, ' ').replace(/^imported /, ''),
        category: 'Imported'
      }))
  ];

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 lg:p-8">
      <div className="bg-slate-900 rounded-xl border border-slate-700 w-full max-w-5xl h-[85vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-500/20 rounded-lg">
              <Upload size={20} className="text-green-400" />
            </div>
            <div>
              <h2 className="font-semibold text-white text-lg">Import Data from Excel</h2>
              <p className="text-xs text-slate-500">
                {importFileName ? `File: ${importFileName}` : 'Select a file to import'}
              </p>
            </div>
          </div>
          <button
            onClick={cancelImport}
            className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
          >
            <X size={20} className="text-slate-400" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          {/* Left Panel - Import Settings */}
          <div className="lg:w-1/3 p-4 border-b lg:border-b-0 lg:border-r border-slate-700 overflow-y-auto">
            {/* Sheet Selection */}
            {importSheets.length > 1 && (
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-medium text-slate-400 uppercase tracking-wide">
                    Select Sheets
                  </label>
                  {/* Select All / Deselect All buttons */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={selectAllSheets}
                      className="text-[10px] px-1.5 py-0.5 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded"
                      title="Select All"
                    >
                      All
                    </button>
                    <button
                      onClick={deselectAllSheets}
                      className="text-[10px] px-1.5 py-0.5 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded"
                      title="Deselect All"
                    >
                      None
                    </button>
                  </div>
                </div>
                <div className="space-y-1">
                  {importSheets.map((sheet) => (
                    <div
                      key={sheet}
                      className={`flex items-center gap-2 w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                        selectedImportSheet === sheet
                          ? 'bg-green-500/20 text-green-400 border border-green-500/40'
                          : selectedSheetsForImport.has(sheet)
                          ? 'bg-purple-500/20 text-purple-400 border border-purple-500/40'
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      {/* Checkbox for multi-select */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleSheetForImport(sheet);
                        }}
                        className="flex-shrink-0"
                      >
                        {selectedSheetsForImport.has(sheet) ? (
                          <CheckSquare size={16} className="text-purple-400" />
                        ) : (
                          <Square size={16} className="text-slate-500" />
                        )}
                      </button>
                      {/* Sheet name - click to preview */}
                      <button
                        onClick={() => handleSheetChange(sheet)}
                        className="flex-1 flex items-center gap-2 text-left"
                      >
                        <Table size={14} />
                        <span className="truncate">{sheet}</span>
                        {selectedImportSheet === sheet && (
                          <span className="text-[10px] text-green-400 ml-auto">(preview)</span>
                        )}
                      </button>
                    </div>
                  ))}
                </div>
                {selectedSheetsForImport.size > 0 && (
                  <div className="mt-2 text-xs text-purple-400 flex items-center gap-1">
                    <CheckCircle2 size={12} />
                    {selectedSheetsForImport.size} sheet{selectedSheetsForImport.size > 1 ? 's' : ''} selected for import
                  </div>
                )}
              </div>
            )}

            {/* Header Detection */}
            {importedData && (
              <div className="mb-4">
                <label className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-2 block">
                  Header Row
                </label>
                <button
                  onClick={toggleHasHeaders}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-colors ${
                    hasHeaders
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                      : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {hasHeaders ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
                    <span>{hasHeaders ? 'First row is headers' : 'No header row'}</span>
                  </div>
                  <span className="text-xs opacity-70">
                    {hasHeaders ? 'Auto-detected' : 'Click to toggle'}
                  </span>
                </button>
                {!hasHeaders && (
                  <p className="text-xs text-slate-500 mt-2">
                    Click column headers below to rename them
                  </p>
                )}
              </div>
            )}

            {/* Import Mode */}
            <div className="mb-4">
              <label className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-2 block">
                Import Mode
              </label>
              <div className="space-y-2">
                <button
                  onClick={() => setImportTargetTable('')}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                    importTargetTable === ''
                      ? 'bg-blue-500/20 text-blue-400 border border-blue-500/40'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Plus size={14} />
                    Create New Table
                  </div>
                  <p className="text-xs text-slate-500 mt-1">Import as a new data source</p>
                </button>
                <div className="text-xs text-slate-500 text-center py-1">— or —</div>
                <div className="text-xs text-slate-400 mb-2">Replace existing table:</div>
                <div className="max-h-48 overflow-y-auto space-y-1">
                  {existingTables.map((table) => (
                    <button
                      key={table.key}
                      onClick={() => setImportTargetTable(table.key)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                        importTargetTable === table.key
                          ? 'bg-orange-500/20 text-orange-400 border border-orange-500/40'
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="truncate">{table.name}</span>
                        <span className="text-xs text-slate-500">{table.category}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Import Summary */}
            {importedData && (
              <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700">
                <div className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-2">
                  Import Summary
                </div>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Columns:</span>
                    <span className="text-white font-mono">{importedData.columns.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Rows:</span>
                    <span className="text-white font-mono">{importedData.data.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Sheet:</span>
                    <span className="text-white">{importedData.sheetName}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Panel - Data Preview */}
          <div className="lg:w-2/3 flex flex-col overflow-hidden">
            <div className="px-4 py-2 bg-slate-800/50 border-b border-slate-700">
              <span className="text-xs font-medium text-slate-400 uppercase tracking-wide">Data Preview</span>
            </div>

            {importedData ? (
              <div className="flex-1 overflow-auto p-4">
                <table className="w-full text-xs border-collapse">
                  <thead className="sticky top-0 bg-slate-800">
                    <tr>
                      <th className="px-2 py-2 text-left text-slate-500 font-medium border-b border-slate-700">#</th>
                      {importedData.columns.map((col, i) => (
                        <th key={i} className="px-2 py-2 text-left border-b border-slate-700 whitespace-nowrap">
                          {editingColumnIndex === i ? (
                            <input
                              type="text"
                              value={editingColumnName}
                              onChange={(e) => setEditingColumnName(e.target.value)}
                              onBlur={() => {
                                if (editingColumnName.trim()) {
                                  updateColumnName(i, editingColumnName.trim());
                                }
                                setEditingColumnIndex(null);
                              }}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  if (editingColumnName.trim()) {
                                    updateColumnName(i, editingColumnName.trim());
                                  }
                                  setEditingColumnIndex(null);
                                } else if (e.key === 'Escape') {
                                  setEditingColumnIndex(null);
                                }
                              }}
                              autoFocus
                              className="w-full bg-slate-700 text-white px-1.5 py-0.5 rounded border border-blue-500 focus:outline-none text-xs"
                            />
                          ) : (
                            <button
                              onClick={() => {
                                setEditingColumnIndex(i);
                                setEditingColumnName(col || `Column_${i + 1}`);
                              }}
                              className={`flex items-center gap-1 font-medium transition-colors ${
                                !hasHeaders
                                  ? 'text-amber-400 hover:text-amber-300 cursor-pointer'
                                  : 'text-slate-400 cursor-default'
                              }`}
                              disabled={hasHeaders}
                            >
                              {col || `Column ${i + 1}`}
                              {!hasHeaders && <Edit3 size={10} className="opacity-50" />}
                            </button>
                          )}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {importedData.data.slice(0, 50).map((row, rowIdx) => (
                      <tr key={rowIdx} className="hover:bg-slate-800/50">
                        <td className="px-2 py-1.5 text-slate-500 font-mono border-b border-slate-700/50">
                          {rowIdx + 1}
                        </td>
                        {row.map((cell, cellIdx) => (
                          <td key={cellIdx} className="px-2 py-1.5 text-slate-300 font-mono border-b border-slate-700/50 whitespace-nowrap max-w-[200px] truncate">
                            {cell || '—'}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
                {importedData.data.length > 50 && (
                  <div className="text-center py-3 text-xs text-slate-500">
                    Showing first 50 of {importedData.data.length} rows
                  </div>
                )}
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center text-slate-500">
                <div className="text-center">
                  <FileSpreadsheet size={48} className="mx-auto mb-3 opacity-30" />
                  <p>No data to preview</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between p-4 border-t border-slate-700 bg-slate-800/50">
          <div className="text-xs text-slate-500">
            {importTargetTable
              ? `Data will replace "${masterTables[importTargetTable]?.label || importTargetTable}"`
              : selectedSheetsForImport.size > 0
              ? `${selectedSheetsForImport.size} sheet${selectedSheetsForImport.size > 1 ? 's' : ''} selected for import`
              : importSheets.length > 1
              ? `${importSheets.length} sheets available - click checkboxes to select`
              : 'Data will be imported as a new table'}
          </div>
          <div className="flex gap-2">
            <button
              onClick={cancelImport}
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm"
            >
              Cancel
            </button>
            {/* Multi-sheet import buttons */}
            {importSheets.length > 1 && !importTargetTable && (
              <>
                {/* Import All Sheets */}
                <button
                  onClick={importAllSheets}
                  disabled={!importedData}
                  className="px-4 py-2 bg-slate-600 hover:bg-slate-500 disabled:bg-slate-700 disabled:text-slate-500 text-white rounded-lg text-sm font-medium flex items-center gap-2"
                >
                  <Layers size={14} />
                  All {importSheets.length}
                </button>
                {/* Import Selected Sheets */}
                {selectedSheetsForImport.size > 0 && (
                  <button
                    onClick={importSelectedSheets}
                    disabled={!importedData}
                    className="px-4 py-2 bg-purple-500 hover:bg-purple-600 disabled:bg-slate-700 disabled:text-slate-500 text-white rounded-lg text-sm font-medium flex items-center gap-2"
                  >
                    <CheckSquare size={14} />
                    Import {selectedSheetsForImport.size} Selected
                  </button>
                )}
              </>
            )}
            {/* Single sheet / Replace import */}
            <button
              onClick={importTargetTable ? confirmImport : createNewTableFromImport}
              disabled={!importedData}
              className="px-4 py-2 bg-green-500 hover:bg-green-600 disabled:bg-slate-700 disabled:text-slate-500 text-black rounded-lg text-sm font-medium flex items-center gap-2"
            >
              <Download size={14} />
              {importTargetTable ? 'Import & Replace' : 'Import Current Sheet'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
