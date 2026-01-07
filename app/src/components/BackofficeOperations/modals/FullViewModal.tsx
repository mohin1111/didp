import { X, GitCompare, MousePointer2, FileSpreadsheet } from 'lucide-react';
import { useBackoffice } from '../context/BackofficeContext';
import { TableRenderer } from '../shared';
import { masterTables } from '../data';

export default function FullViewModal() {
  const {
    fullViewTable,
    setFullViewTable,
    selectedCells,
    compareRows,
    setShowCompareModal,
    columnFilters,
    showFilters,
    toggleFilters,
    clearAllFilters,
    updateColumnFilter,
    getActiveFilterCount,
    handleCellClick,
    toggleRowForCompare,
    tableDataOverrides,
    exportTableToExcel,
  } = useBackoffice();

  if (!fullViewTable || !masterTables[fullViewTable]) return null;

  const table = masterTables[fullViewTable];
  const Icon = table.icon;
  const override = tableDataOverrides[fullViewTable];
  const columns = override ? override.columns : table.columns;
  const data = override ? override.data : table.data;

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 lg:p-8">
      <div className="bg-slate-900 rounded-xl border border-slate-700 w-full max-w-[95vw] xl:max-w-7xl h-[92vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-3 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <Icon size={20} className="text-blue-400" />
            </div>
            <div>
              <h2 className="font-semibold text-white text-lg">{table.label}</h2>
              <p className="text-xs text-slate-500">{table.count.toLocaleString()} rows</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {selectedCells.length > 0 && (
              <span className="px-3 py-1 bg-cyan-500/20 text-cyan-400 text-xs rounded-full">
                {selectedCells.length} cell(s) selected
              </span>
            )}
            {compareRows.length > 0 && (
              <button
                onClick={() => setShowCompareModal(true)}
                className="flex items-center gap-2 px-3 py-1.5 bg-purple-500/20 text-purple-400 text-sm rounded-lg hover:bg-purple-500/30"
              >
                <GitCompare size={14} />
                Compare ({compareRows.length})
              </button>
            )}
            <button
              onClick={() => setFullViewTable(null)}
              className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
            >
              <X size={20} className="text-slate-400" />
            </button>
          </div>
        </div>

        {/* Modal Content */}
        <div className="flex-1 p-4 overflow-hidden">
          <TableRenderer
            tableKey={fullViewTable}
            columns={columns}
            data={data}
            isFullView={true}
            filtersVisible={showFilters[fullViewTable] || false}
            filters={columnFilters[fullViewTable] || {}}
            activeFilterCount={getActiveFilterCount(fullViewTable)}
            selectedCells={selectedCells}
            compareRows={compareRows}
            onToggleFilters={() => toggleFilters(fullViewTable)}
            onClearAllFilters={() => clearAllFilters(fullViewTable)}
            onUpdateFilter={(colIdx, value) => updateColumnFilter(fullViewTable, colIdx, value)}
            onCellClick={(rowIdx, colIdx, value, column, e) => handleCellClick(fullViewTable, rowIdx, colIdx, value, column, e)}
            onToggleRowCompare={(rowIdx, rowData) => toggleRowForCompare(fullViewTable, rowIdx, rowData)}
          />
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between p-4 border-t border-slate-700 bg-slate-800/50">
          <div className="text-xs text-slate-500">
            <MousePointer2 size={12} className="inline mr-1" />
            Click cell to select &bull; Ctrl+Click for multi-select &bull; Check rows to compare
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => exportTableToExcel(fullViewTable)}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-sm flex items-center gap-2"
            >
              <FileSpreadsheet size={14} />
              Export to Excel
            </button>
            <button
              onClick={() => setFullViewTable(null)}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg text-sm"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
