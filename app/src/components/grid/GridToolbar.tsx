import { Plus, Trash2, Copy, Download, Save, Undo, Redo, Filter, Columns, RefreshCw, Printer, Search } from 'lucide-react';
import type { GridApi } from 'ag-grid-community';

interface GridToolbarProps {
  gridApi: GridApi | null;
  undoSize: number;
  redoSize: number;
  hasChanges: boolean;
  quickFilter: string;
  showColumnPanel: boolean;
  onQuickFilterChange: (value: string) => void;
  onShowColumnPanel: (show: boolean) => void;
  onSave: () => void;
  onAddRow: () => void;
  onDeleteRow: () => void;
  onDuplicate: () => void;
  onExport: () => void;
  onRefresh: () => void;
  onPrint: () => void;
}

export function GridToolbar({
  gridApi, undoSize, redoSize, hasChanges, quickFilter, showColumnPanel,
  onQuickFilterChange, onShowColumnPanel, onSave, onAddRow, onDeleteRow,
  onDuplicate, onExport, onRefresh, onPrint
}: GridToolbarProps) {
  const handleUndo = () => gridApi?.undoCellEditing();
  const handleRedo = () => gridApi?.redoCellEditing();

  return (
    <div className="bg-white border-b border-slate-200 px-4 py-2 flex items-center gap-2">
      <div className="flex items-center gap-1 pr-3 border-r border-slate-200">
        <button onClick={onAddRow} className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors" title="Add Row (Ctrl+N)">
          <Plus className="w-4 h-4" />
        </button>
        <button onClick={onDeleteRow} className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors" title="Delete Row (Delete)">
          <Trash2 className="w-4 h-4" />
        </button>
        <button onClick={onDuplicate} className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors" title="Duplicate Row (Ctrl+D)">
          <Copy className="w-4 h-4" />
        </button>
      </div>

      <div className="flex items-center gap-1 px-3 border-r border-slate-200">
        <button onClick={handleUndo} disabled={undoSize === 0} className={`p-2 rounded-lg transition-colors ${undoSize > 0 ? 'hover:bg-slate-100 text-slate-600' : 'text-slate-300 cursor-not-allowed'}`} title="Undo (Ctrl+Z)">
          <Undo className="w-4 h-4" />
        </button>
        <button onClick={handleRedo} disabled={redoSize === 0} className={`p-2 rounded-lg transition-colors ${redoSize > 0 ? 'hover:bg-slate-100 text-slate-600' : 'text-slate-300 cursor-not-allowed'}`} title="Redo (Ctrl+Y)">
          <Redo className="w-4 h-4" />
        </button>
        <button onClick={onSave} disabled={!hasChanges} className={`p-2 rounded-lg transition-colors ${hasChanges ? 'hover:bg-indigo-100 text-indigo-600' : 'text-slate-300 cursor-not-allowed'}`} title="Save Changes (Ctrl+S)">
          <Save className="w-4 h-4" />
        </button>
      </div>

      <div className="flex items-center gap-1 px-3 border-r border-slate-200">
        <button onClick={() => gridApi?.setAdvancedFilterModel(null)} className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors" title="Clear Filters">
          <Filter className="w-4 h-4" />
        </button>
        <button onClick={() => onShowColumnPanel(!showColumnPanel)} className={`p-2 rounded-lg transition-colors ${showColumnPanel ? 'bg-indigo-100 text-indigo-600' : 'hover:bg-slate-100 text-slate-600'}`} title="Toggle Columns">
          <Columns className="w-4 h-4" />
        </button>
      </div>

      <div className="flex items-center gap-1 px-3 border-r border-slate-200">
        <button onClick={onExport} className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors" title="Export to CSV">
          <Download className="w-4 h-4" />
        </button>
        <button onClick={onRefresh} className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors" title="Refresh Data">
          <RefreshCw className="w-4 h-4" />
        </button>
        <button onClick={onPrint} className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors" title="Print">
          <Printer className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1"></div>

      <div className="relative">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={quickFilter}
          onChange={(e) => onQuickFilterChange(e.target.value)}
          placeholder="Quick filter..."
          className="pl-9 pr-4 py-1.5 w-48 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>
    </div>
  );
}
