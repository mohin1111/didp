import React from 'react';
import { Filter, FilterX, Search, X, GitCompare } from 'lucide-react';
import StatusBadge from './StatusBadge';
import { highlightMatch } from '../utils';

interface TableRendererProps {
  tableKey: string;
  columns: string[];
  data: string[][];
  isFullView?: boolean;
  // Filter state
  filtersVisible: boolean;
  filters: Record<number, string>;
  activeFilterCount: number;
  // Selection state
  selectedCells: Array<{ tableKey: string; rowIndex: number; colIndex: number }>;
  compareRows: Array<{ tableKey: string; rowIndex: number }>;
  // Handlers
  onToggleFilters: () => void;
  onClearAllFilters: () => void;
  onUpdateFilter: (colIndex: number, value: string) => void;
  onCellClick: (rowIndex: number, colIndex: number, value: string, column: string, e: React.MouseEvent) => void;
  onToggleRowCompare: (rowIndex: number, data: string[]) => void;
}

const statusValues = ['SETTLED', 'MATCHED', 'PENDING', 'FAILED', 'INSTRUCTED', 'VERIFIED', 'ACTIVE', 'HIGH', 'MEDIUM', 'LOW', 'SUCCESS', 'WARNING', 'RUNNING', 'COMPLETED', 'BUY', 'SELL', 'DR', 'CR'];

export default function TableRenderer({
  tableKey,
  columns,
  data,
  isFullView = false,
  filtersVisible,
  filters,
  activeFilterCount,
  selectedCells,
  compareRows,
  onToggleFilters,
  onClearAllFilters,
  onUpdateFilter,
  onCellClick,
  onToggleRowCompare,
}: TableRendererProps) {
  // Filter data based on column filters
  const filteredData = React.useMemo(() => {
    const activeFilters = Object.entries(filters).filter(([_, value]) => value && value.trim() !== '');
    if (activeFilters.length === 0) return data;

    return data.filter(row => {
      return activeFilters.every(([colIndex, filterValue]) => {
        const cellValue = row[parseInt(colIndex)]?.toLowerCase() || '';
        return cellValue.includes(filterValue.toLowerCase());
      });
    });
  }, [data, filters]);

  const isCellSelected = (rowIndex: number, colIndex: number) => {
    return selectedCells.some(
      c => c.tableKey === tableKey && c.rowIndex === rowIndex && c.colIndex === colIndex
    );
  };

  const isRowSelectedForCompare = (rowIndex: number) => {
    return compareRows.some(r => r.tableKey === tableKey && r.rowIndex === rowIndex);
  };

  return (
    <div className={`bg-slate-900 rounded border border-slate-700 overflow-hidden ${isFullView ? 'h-full flex flex-col' : ''}`}>
      {/* Filter Toggle Bar */}
      <div className="flex items-center justify-between px-2 py-1.5 bg-slate-800/50 border-b border-slate-700/50">
        <div className="flex items-center gap-2">
          <button
            onClick={onToggleFilters}
            className={`flex items-center gap-1.5 px-2 py-1 rounded text-xs transition-colors ${
              filtersVisible
                ? 'bg-blue-500/20 text-blue-400'
                : 'hover:bg-slate-700 text-slate-400'
            }`}
          >
            <Filter size={12} />
            Filters
            {activeFilterCount > 0 && (
              <span className="px-1.5 py-0.5 bg-blue-500 text-white text-[10px] rounded-full">
                {activeFilterCount}
              </span>
            )}
          </button>
          {activeFilterCount > 0 && (
            <button
              onClick={onClearAllFilters}
              className="flex items-center gap-1 px-2 py-1 text-xs text-slate-500 hover:text-red-400 transition-colors"
            >
              <FilterX size={12} />
              Clear
            </button>
          )}
        </div>
        <span className="text-xs text-slate-500">
          {filteredData.length} / {data.length} rows
        </span>
      </div>

      <div className={`overflow-x-auto overflow-y-auto ${isFullView ? 'flex-1' : ''}`} style={{ maxHeight: isFullView ? 'calc(100vh - 240px)' : '160px' }}>
        <table className="w-full text-[11px]">
          <thead className="sticky top-0 z-10">
            <tr className="bg-slate-800">
              <th className="px-1.5 py-1.5 text-left text-slate-400 font-medium whitespace-nowrap w-6">
                <GitCompare size={10} />
              </th>
              {columns.map((col, i) => (
                <th key={i} className="px-1.5 py-1.5 text-left text-slate-400 font-medium whitespace-nowrap text-[10px]">
                  {col}
                </th>
              ))}
            </tr>
            {/* Filter Row */}
            {filtersVisible && (
              <tr className="bg-slate-800/80">
                <th className="px-2 py-1.5"></th>
                {columns.map((_, i) => (
                  <th key={i} className="px-1 py-1.5">
                    <div className="relative">
                      <Search size={10} className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-500" />
                      <input
                        type="text"
                        value={filters[i] || ''}
                        onChange={(e) => onUpdateFilter(i, e.target.value)}
                        placeholder="Filter..."
                        className="w-full bg-slate-900 border border-slate-600 rounded pl-6 pr-2 py-1 text-xs focus:outline-none focus:border-blue-500 placeholder:text-slate-600"
                        onClick={(e) => e.stopPropagation()}
                      />
                      {filters[i] && (
                        <button
                          onClick={(e) => { e.stopPropagation(); onUpdateFilter(i, ''); }}
                          className="absolute right-1.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                        >
                          <X size={10} />
                        </button>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            )}
          </thead>
          <tbody>
            {filteredData.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 1} className="px-4 py-8 text-center text-slate-500">
                  <FilterX size={24} className="mx-auto mb-2 opacity-50" />
                  No matching records found
                </td>
              </tr>
            ) : (
              filteredData.map((row, filteredRowIdx) => {
                // Find original row index for proper selection tracking
                const originalRowIdx = data.findIndex(r => r === row);
                return (
                  <tr
                    key={filteredRowIdx}
                    className={`border-t border-slate-700/50 hover:bg-slate-800/50 ${
                      isRowSelectedForCompare(originalRowIdx) ? 'bg-purple-500/10' : ''
                    }`}
                  >
                    <td className="px-1.5 py-1 whitespace-nowrap">
                      <button
                        onClick={() => onToggleRowCompare(originalRowIdx, row)}
                        className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                          isRowSelectedForCompare(originalRowIdx)
                            ? 'bg-purple-500 border-purple-500 text-white'
                            : 'border-slate-600 hover:border-purple-400 text-slate-500 hover:text-purple-400'
                        }`}
                        title="Add to compare"
                      >
                        <GitCompare size={8} />
                      </button>
                    </td>
                    {row.map((cell, colIdx) => {
                      const isSelected = isCellSelected(originalRowIdx, colIdx);
                      const isStatus = statusValues.includes(cell);
                      const filterValue = filters[colIdx]?.toLowerCase();
                      const shouldHighlight = filterValue && cell.toLowerCase().includes(filterValue);

                      return (
                        <td
                          key={colIdx}
                          className={`px-1.5 py-1 whitespace-nowrap cursor-pointer transition-all ${
                            isSelected
                              ? 'bg-cyan-500/30 ring-1 ring-cyan-400'
                              : 'hover:bg-slate-700/50'
                          }`}
                          onClick={(e) => onCellClick(originalRowIdx, colIdx, cell, columns[colIdx], e)}
                          title="Click to select, Ctrl+Click for multi-select"
                        >
                          {isStatus ? (
                            <StatusBadge status={cell} />
                          ) : shouldHighlight ? (
                            <span className={`${cell.includes('$') || cell.includes('£') || cell.includes('%') ? 'font-mono' : ''}`}>
                              {highlightMatch(cell, filterValue)}
                            </span>
                          ) : (
                            <span className={cell.includes('$') || cell.includes('£') || cell.includes('%') ? 'font-mono' : ''}>{cell}</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
