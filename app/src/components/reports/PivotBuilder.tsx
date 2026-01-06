import { useState } from 'react';
import { Filter, Columns, LayoutGrid, Calculator, X, Save, Download, RefreshCw, GripVertical } from 'lucide-react';
import { useToast } from '../Toast';

export function PivotBuilder() {
  const { addToast } = useToast();
  const [filters, setFilters] = useState<string[]>(['Exchange']);
  const [columns, setColumns] = useState<string[]>(['Trade Date']);
  const [rows, setRows] = useState<string[]>(['Client']);
  const [values, setValues] = useState<string[]>(['SUM(Value)']);
  const [isLoading, setIsLoading] = useState(false);

  const fields = ['Client Name', 'Trade Date', 'Scrip', 'Exchange', 'Quantity', 'Value', 'Broker', 'Segment', 'B/S'];
  const pivotData = [
    { client: 'Rajesh Kumar', jan15: 245600, jan14: 123400, jan13: 187500, total: 556500 },
    { client: 'Priya Sharma', jan15: 189200, jan14: 234100, jan13: 156800, total: 580100 },
    { client: 'Amit Patel', jan15: 312400, jan14: 98700, jan13: 267300, total: 678400 },
    { client: 'Sunita Gupta', jan15: 156800, jan14: 189400, jan13: 134200, total: 480400 },
  ];

  const handleAddField = (field: string, zone: 'filters' | 'columns' | 'rows' | 'values') => {
    const setters = { filters: setFilters, columns: setColumns, rows: setRows, values: setValues };
    const current = { filters, columns, rows, values };
    if (current[zone].includes(field)) { addToast(`${field} is already in ${zone}`, 'warning'); return; }
    setters[zone](prev => [...prev, zone === 'values' ? `SUM(${field})` : field]);
    addToast(`Added ${field} to ${zone}`, 'success');
  };

  const handleRemoveField = (field: string, zone: 'filters' | 'columns' | 'rows' | 'values') => {
    const setters = { filters: setFilters, columns: setColumns, rows: setRows, values: setValues };
    setters[zone](prev => prev.filter(f => f !== field));
  };

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => { setIsLoading(false); addToast('Pivot table refreshed', 'success'); }, 800);
  };

  const formatCurrency = (val: number) => `₹${val.toLocaleString('en-IN')}`;

  return (
    <div className="flex gap-6 h-full">
      <div className="w-56 bg-white rounded-xl border border-slate-200 p-4">
        <h3 className="font-semibold text-slate-800 mb-4">Available Fields</h3>
        <div className="space-y-1">
          {fields.map(f => (
            <div key={f} draggable onClick={() => handleAddField(f, 'rows')} className="flex items-center gap-2 px-3 py-2 bg-slate-50 hover:bg-indigo-50 hover:text-indigo-700 rounded-lg cursor-pointer text-sm text-slate-700 transition-colors">
              <GripVertical className="w-4 h-4 text-slate-400" />{f}
            </div>
          ))}
        </div>
        <div className="mt-4 pt-4 border-t border-slate-200">
          <button onClick={() => addToast('Pivot saved as "Trade Analysis"', 'success')} className="w-full py-2 text-sm text-indigo-600 hover:bg-indigo-50 rounded-lg flex items-center justify-center gap-2"><Save className="w-4 h-4" />Save Pivot</button>
        </div>
      </div>
      <div className="flex-1 grid grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2"><Filter className="w-4 h-4 text-slate-400" />Filters</h3>
          <div className="min-h-16 border-2 border-dashed border-slate-200 rounded-lg p-3 flex flex-wrap gap-2">
            {filters.map(f => (<span key={f} onClick={() => handleRemoveField(f, 'filters')} className="px-3 py-1.5 bg-indigo-100 text-indigo-700 rounded-full text-sm flex items-center gap-1 cursor-pointer hover:bg-indigo-200">{f} <X className="w-3 h-3" /></span>))}
            {filters.length === 0 && <span className="text-sm text-slate-400">Drop fields here</span>}
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2"><Columns className="w-4 h-4 text-slate-400" />Columns</h3>
          <div className="min-h-16 border-2 border-dashed border-slate-200 rounded-lg p-3 flex flex-wrap gap-2">
            {columns.map(f => (<span key={f} onClick={() => handleRemoveField(f, 'columns')} className="px-3 py-1.5 bg-green-100 text-green-700 rounded-full text-sm flex items-center gap-1 cursor-pointer hover:bg-green-200">{f} <X className="w-3 h-3" /></span>))}
            {columns.length === 0 && <span className="text-sm text-slate-400">Drop fields here</span>}
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2"><LayoutGrid className="w-4 h-4 text-slate-400" />Rows</h3>
          <div className="min-h-16 border-2 border-dashed border-slate-200 rounded-lg p-3 flex flex-wrap gap-2">
            {rows.map(f => (<span key={f} onClick={() => handleRemoveField(f, 'rows')} className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm flex items-center gap-1 cursor-pointer hover:bg-blue-200">{f} <X className="w-3 h-3" /></span>))}
            {rows.length === 0 && <span className="text-sm text-slate-400">Drop fields here</span>}
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2"><Calculator className="w-4 h-4 text-slate-400" />Values</h3>
          <div className="min-h-16 border-2 border-dashed border-slate-200 rounded-lg p-3 flex flex-wrap gap-2">
            {values.map(f => (<span key={f} onClick={() => handleRemoveField(f, 'values')} className="px-3 py-1.5 bg-amber-100 text-amber-700 rounded-full text-sm flex items-center gap-1 cursor-pointer hover:bg-amber-200">{f} <X className="w-3 h-3" /></span>))}
            {values.length === 0 && <span className="text-sm text-slate-400">Drop fields here</span>}
          </div>
        </div>
        <div className="col-span-2 bg-white rounded-xl border border-slate-200 p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-800">Preview</h3>
            <div className="flex gap-2">
              <button onClick={() => addToast('Exported to Excel', 'success')} className="px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-100 rounded-lg flex items-center gap-1.5"><Download className="w-4 h-4" />Export</button>
              <button onClick={handleRefresh} disabled={isLoading} className="px-3 py-1.5 text-sm text-indigo-600 hover:bg-indigo-50 rounded-lg flex items-center gap-1.5 disabled:opacity-50"><RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />Refresh</button>
            </div>
          </div>
          <div className="overflow-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-slate-100">
                  <th className="px-4 py-2 text-left border border-slate-200">Client</th>
                  <th className="px-4 py-2 text-right border border-slate-200">15-Jan</th>
                  <th className="px-4 py-2 text-right border border-slate-200">14-Jan</th>
                  <th className="px-4 py-2 text-right border border-slate-200">13-Jan</th>
                  <th className="px-4 py-2 text-right border border-slate-200 bg-slate-200 font-bold">Total</th>
                </tr>
              </thead>
              <tbody>
                {pivotData.map((row, i) => (
                  <tr key={i} className="hover:bg-slate-50">
                    <td className="px-4 py-2 border border-slate-200">{row.client}</td>
                    <td className="px-4 py-2 text-right border border-slate-200">{formatCurrency(row.jan15)}</td>
                    <td className="px-4 py-2 text-right border border-slate-200">{formatCurrency(row.jan14)}</td>
                    <td className="px-4 py-2 text-right border border-slate-200">{formatCurrency(row.jan13)}</td>
                    <td className="px-4 py-2 text-right border border-slate-200 bg-slate-50 font-medium">{formatCurrency(row.total)}</td>
                  </tr>
                ))}
                <tr className="bg-slate-100 font-bold">
                  <td className="px-4 py-2 border border-slate-200">Grand Total</td>
                  <td className="px-4 py-2 text-right border border-slate-200">{formatCurrency(pivotData.reduce((a, b) => a + b.jan15, 0))}</td>
                  <td className="px-4 py-2 text-right border border-slate-200">{formatCurrency(pivotData.reduce((a, b) => a + b.jan14, 0))}</td>
                  <td className="px-4 py-2 text-right border border-slate-200">{formatCurrency(pivotData.reduce((a, b) => a + b.jan13, 0))}</td>
                  <td className="px-4 py-2 text-right border border-slate-200 bg-slate-200">{formatCurrency(pivotData.reduce((a, b) => a + b.total, 0))}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
