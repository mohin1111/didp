import { useBackoffice } from '../context/BackofficeContext';
import { masterTables } from '../data';
import { TableRenderer } from '../shared';
import {
  Database, Calendar, Filter, ArrowRight, ChevronDown, ChevronRight,
  Upload, Maximize2, FileSpreadsheet
} from 'lucide-react';

export default function MasterDataSection() {
  const {
    selectedDate, setSelectedDate,
    selectedTables, toggleTable, expandedTable, setExpandedTable,
    tableDataOverrides, tablesByCategory,
    showFilters, columnFilters, getActiveFilterCount,
    selectedCells, compareRows,
    toggleFilters, clearAllFilters, updateColumnFilter,
    handleCellClick, toggleRowForCompare,
    setFullViewTable, exportTableToExcel, fileInputRef,
  } = useBackoffice();

  return (
    <div className="w-[34%] min-w-[280px] border-r border-slate-700 flex flex-col bg-slate-900/50">
      <div className="p-2 lg:p-3 border-b border-slate-700 bg-slate-900">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Database size={16} className="text-blue-400" />
            <h2 className="font-semibold text-white text-sm">Master Data Sources</h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1 px-2 py-1 bg-green-600 hover:bg-green-700 rounded text-xs text-white transition-colors"
              title="Import from Excel"
            >
              <Upload size={12} />
              <span className="hidden lg:inline">Import</span>
            </button>
            <span className="text-[10px] text-slate-500">{selectedTables.length} selected</span>
          </div>
        </div>

        {/* Date Filter */}
        <div className="bg-slate-800 rounded-lg p-2 border border-slate-700">
          <div className="flex items-center gap-2 mb-1.5">
            <Filter size={12} className="text-slate-400" />
            <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wide">Date Range</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <label className="text-[10px] text-slate-500 mb-0.5 block">From</label>
              <div className="relative">
                <Calendar size={12} className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="date"
                  value={selectedDate.from}
                  onChange={(e) => setSelectedDate(prev => ({ ...prev, from: e.target.value }))}
                  className="w-full bg-slate-900 border border-slate-600 rounded pl-7 pr-2 py-1 text-xs focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
            <ArrowRight size={14} className="text-slate-600 mt-4" />
            <div className="flex-1">
              <label className="text-[10px] text-slate-500 mb-0.5 block">To</label>
              <div className="relative">
                <Calendar size={12} className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="date"
                  value={selectedDate.to}
                  onChange={(e) => setSelectedDate(prev => ({ ...prev, to: e.target.value }))}
                  className="w-full bg-slate-900 border border-slate-600 rounded pl-7 pr-2 py-1 text-xs focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Table List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-2">
        {Object.entries(tablesByCategory).map(([category, tables]) => (
          <div key={category}>
            <div className="text-[10px] font-medium text-slate-500 uppercase tracking-wide px-1 py-1">{category}</div>
            {tables.map(key => {
              const table = masterTables[key];
              const override = tableDataOverrides[key];
              const isSelected = selectedTables.includes(key);
              const isExpanded = expandedTable === key;
              const Icon = table?.icon || Database;
              const label = table?.label || key.replace(/_/g, ' ');
              const count = override ? override.data.length : table?.count || 0;
              const columns = override ? override.columns : table?.columns || [];
              const data = override ? override.data : table?.data || [];

              return (
                <div key={key} className="mb-1">
                  <div
                    className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-blue-500/20 border border-blue-500/40'
                        : 'bg-slate-800/50 border border-transparent hover:bg-slate-800'
                    }`}
                  >
                    <button
                      onClick={() => setExpandedTable(isExpanded ? null : key)}
                      className="text-slate-400 hover:text-white"
                    >
                      {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                    </button>
                    <div onClick={() => toggleTable(key)} className="flex-1 flex items-center gap-2">
                      <Icon size={14} className={isSelected ? 'text-blue-400' : 'text-slate-500'} />
                      <span className={`text-xs ${isSelected ? 'text-white' : 'text-slate-300'}`}>{label}</span>
                      {!table && <span className="text-[9px] bg-green-500/20 text-green-400 px-1 rounded">Imported</span>}
                    </div>
                    <span className="text-[10px] text-slate-500">{count.toLocaleString()}</span>
                    {isSelected && (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => setFullViewTable(key)}
                          className="p-1 hover:bg-slate-700 rounded"
                          title="Full view"
                        >
                          <Maximize2 size={12} className="text-slate-400" />
                        </button>
                        <button
                          onClick={() => exportTableToExcel(key)}
                          className="p-1 hover:bg-slate-700 rounded"
                          title="Export to Excel"
                        >
                          <FileSpreadsheet size={12} className="text-slate-400" />
                        </button>
                      </div>
                    )}
                  </div>
                  {isExpanded && isSelected && (
                    <div className="mt-1 ml-4">
                      <TableRenderer
                        tableKey={key}
                        columns={columns}
                        data={data}
                        filtersVisible={showFilters[key] || false}
                        filters={columnFilters[key] || {}}
                        activeFilterCount={getActiveFilterCount(key)}
                        selectedCells={selectedCells}
                        compareRows={compareRows}
                        onToggleFilters={() => toggleFilters(key)}
                        onClearAllFilters={() => clearAllFilters(key)}
                        onUpdateFilter={(colIdx, val) => updateColumnFilter(key, colIdx, val)}
                        onCellClick={(rowIdx, colIdx, val, col, e) => handleCellClick(key, rowIdx, colIdx, val, col, e)}
                        onToggleRowCompare={(rowIdx, rowData) => toggleRowForCompare(key, rowIdx, rowData)}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
