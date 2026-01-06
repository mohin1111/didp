import { Eye, EyeOff } from 'lucide-react';
import type { Column, GridApi } from 'ag-grid-community';

interface ColumnPanelProps {
  gridApi: GridApi | null;
  columns: Column[] | null;
  onClose: () => void;
}

export function ColumnPanel({ gridApi, columns, onClose }: ColumnPanelProps) {
  if (!columns) return null;

  const toggleColumn = (col: Column) => {
    if (!gridApi) return;
    gridApi.setColumnsVisible([col], !col.isVisible());
  };

  const showAll = () => {
    if (!gridApi || !columns) return;
    gridApi.setColumnsVisible(columns, true);
  };

  const hideAll = () => {
    if (!gridApi || !columns) return;
    // Keep at least first column visible
    gridApi.setColumnsVisible(columns.slice(1), false);
  };

  return (
    <div className="absolute top-12 right-4 w-64 bg-white rounded-lg shadow-xl border border-slate-200 z-50">
      <div className="p-3 border-b border-slate-100 flex items-center justify-between">
        <h3 className="font-semibold text-slate-800">Toggle Columns</h3>
        <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
          <EyeOff className="w-4 h-4" />
        </button>
      </div>
      <div className="max-h-64 overflow-auto p-2">
        {columns.map((col, i) => (
          <label key={i} className="flex items-center gap-2 px-2 py-1.5 hover:bg-slate-50 rounded cursor-pointer">
            <input
              type="checkbox"
              checked={col.isVisible()}
              onChange={() => toggleColumn(col)}
              className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
            />
            <span className="text-sm text-slate-700">{col.getColDef().headerName || col.getColId()}</span>
          </label>
        ))}
      </div>
      <div className="p-2 border-t border-slate-100 flex gap-2">
        <button onClick={showAll} className="flex-1 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded flex items-center justify-center gap-1">
          <Eye className="w-3 h-3" />Show All
        </button>
        <button onClick={hideAll} className="flex-1 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded flex items-center justify-center gap-1">
          <EyeOff className="w-3 h-3" />Hide All
        </button>
      </div>
    </div>
  );
}
