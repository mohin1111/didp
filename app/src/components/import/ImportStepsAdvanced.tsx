import { Upload, CheckCircle, AlertCircle, ArrowRight, GripVertical, Save, Eye, Download } from 'lucide-react';
import { useToast } from '../Toast';

interface ImportStep3Props {
  mappings: { source: string; target: string; transform: string; required: boolean }[];
  onMappingChange: (idx: number, field: string, value: string | boolean) => void;
}

export function ImportStep3({ mappings, onMappingChange }: ImportStep3Props) {
  const { addToast } = useToast();
  const targetColumns = ['d_TradeDate', 'n_ClientId', 's_ScripCode', 'n_Quantity', 'n_Rate', 'n_Value', 'n_Brokerage', 's_Exchange', 's_Segment', 's_BuySell', 'n_NetValue'];
  const transforms = ['None', 'Parse Date', 'Parse Number', 'Lookup', 'Uppercase', 'Trim', 'Calculate'];

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm border border-slate-200 p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-slate-800">Column Mapping</h2>
        <div className="flex gap-2">
          <button onClick={() => addToast('Template loaded', 'success')} className="px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-100 rounded-lg flex items-center gap-1.5">
            <Upload className="w-4 h-4" />Load Template
          </button>
          <button onClick={() => addToast('Template saved as "NSE_Trade_Mapping"', 'success')} className="px-3 py-1.5 text-sm text-indigo-600 hover:bg-indigo-50 rounded-lg flex items-center gap-1.5">
            <Save className="w-4 h-4" />Save Template
          </button>
        </div>
      </div>
      <div className="space-y-3">
        <div className="grid grid-cols-12 gap-4 px-4 py-2 bg-slate-50 rounded-lg text-xs font-semibold text-slate-600 uppercase">
          <div className="col-span-1"></div>
          <div className="col-span-3">Source Column</div>
          <div className="col-span-1 text-center"></div>
          <div className="col-span-3">Target Column</div>
          <div className="col-span-3">Transform</div>
          <div className="col-span-1 text-center">Required</div>
        </div>
        {mappings.map((m, i) => (
          <div key={i} className="grid grid-cols-12 gap-4 px-4 py-3 border border-slate-200 rounded-lg items-center hover:bg-slate-50 transition-colors">
            <div className="col-span-1"><GripVertical className="w-4 h-4 text-slate-400 cursor-grab hover:text-slate-600" /></div>
            <div className="col-span-3"><div className="px-3 py-2 bg-blue-50 border border-blue-200 rounded text-sm text-blue-700 font-medium">{m.source}</div></div>
            <div className="col-span-1 text-center"><ArrowRight className="w-5 h-5 text-slate-400 mx-auto" /></div>
            <div className="col-span-3">
              <select value={m.target} onChange={(e) => onMappingChange(i, 'target', e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded text-sm focus:ring-2 focus:ring-indigo-500">
                {targetColumns.map(col => <option key={col} value={col}>{col}</option>)}
              </select>
            </div>
            <div className="col-span-3">
              <select value={m.transform} onChange={(e) => onMappingChange(i, 'transform', e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded text-sm focus:ring-2 focus:ring-indigo-500">
                {transforms.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div className="col-span-1 text-center">
              <input type="checkbox" checked={m.required} onChange={(e) => onMappingChange(i, 'required', e.target.checked)} className="w-4 h-4 text-indigo-600 rounded cursor-pointer" />
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-center gap-2">
        <AlertCircle className="w-5 h-5 text-amber-500" />
        <span className="text-sm text-amber-700">Tip: Drag and drop columns to reorder. Required fields must have a mapping.</span>
      </div>
    </div>
  );
}

interface ImportStep4Props {
  results: { total: number; valid: number; errors: number; warnings: number };
}

export function ImportStep4({ results }: ImportStep4Props) {
  const errors = [
    { row: 45, column: 'Client Code', value: 'XYZ999', error: 'Client not found in master', action: 'Skip' },
    { row: 123, column: 'Rate', value: '-100', error: 'Rate cannot be negative', action: 'Skip' },
  ];
  const warnings = [{ row: 567, column: 'Value', value: '0', warning: 'Zero value trade - verify manually' }];

  return (
    <div className="max-w-5xl mx-auto">
      <div className="grid grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-xl border border-slate-200 p-6 text-center hover:shadow-md transition-shadow">
          <p className="text-3xl font-bold text-slate-800">{results.total.toLocaleString()}</p>
          <p className="text-sm text-slate-500 mt-1">Total Rows</p>
        </div>
        <div className="bg-green-50 rounded-xl border border-green-200 p-6 text-center hover:shadow-md transition-shadow">
          <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
          <p className="text-3xl font-bold text-green-600">{results.valid.toLocaleString()}</p>
          <p className="text-sm text-green-600 mt-1">Valid</p>
        </div>
        <div className="bg-red-50 rounded-xl border border-red-200 p-6 text-center hover:shadow-md transition-shadow">
          <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
          <p className="text-3xl font-bold text-red-600">{results.errors}</p>
          <p className="text-sm text-red-600 mt-1">Errors</p>
        </div>
        <div className="bg-amber-50 rounded-xl border border-amber-200 p-6 text-center hover:shadow-md transition-shadow">
          <AlertCircle className="w-8 h-8 text-amber-500 mx-auto mb-2" />
          <p className="text-3xl font-bold text-amber-600">{results.warnings}</p>
          <p className="text-sm text-amber-600 mt-1">Warnings</p>
        </div>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
        <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-red-500" />Validation Errors ({errors.length})
        </h2>
        <table className="w-full text-sm">
          <thead className="bg-slate-50"><tr><th className="px-4 py-3 text-left font-medium">Row</th><th className="px-4 py-3 text-left font-medium">Column</th><th className="px-4 py-3 text-left font-medium">Value</th><th className="px-4 py-3 text-left font-medium">Error</th><th className="px-4 py-3 text-left font-medium">Action</th></tr></thead>
          <tbody>
            {errors.map((e, i) => (
              <tr key={i} className="border-t border-slate-200 hover:bg-slate-50">
                <td className="px-4 py-3 font-medium">#{e.row}</td>
                <td className="px-4 py-3">{e.column}</td>
                <td className="px-4 py-3"><code className="px-2 py-1 bg-red-50 text-red-600 rounded text-xs">{e.value}</code></td>
                <td className="px-4 py-3 text-red-600">{e.error}</td>
                <td className="px-4 py-3"><select className="px-2 py-1 text-xs border border-slate-300 rounded"><option>Skip Row</option><option>Set Default</option><option>Manual Fix</option></select></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-amber-500" />Warnings ({warnings.length})
        </h2>
        <table className="w-full text-sm">
          <thead className="bg-slate-50"><tr><th className="px-4 py-3 text-left font-medium">Row</th><th className="px-4 py-3 text-left font-medium">Column</th><th className="px-4 py-3 text-left font-medium">Value</th><th className="px-4 py-3 text-left font-medium">Warning</th></tr></thead>
          <tbody>
            {warnings.map((w, i) => (
              <tr key={i} className="border-t border-slate-200 hover:bg-slate-50">
                <td className="px-4 py-3 font-medium">#{w.row}</td>
                <td className="px-4 py-3">{w.column}</td>
                <td className="px-4 py-3"><code className="px-2 py-1 bg-amber-50 text-amber-600 rounded text-xs">{w.value}</code></td>
                <td className="px-4 py-3 text-amber-600">{w.warning}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

interface ImportStep5Props {
  file: { name: string; size: string; rows: number } | null;
  targetTable: string;
  validationResults: { total: number; valid: number; errors: number; warnings: number };
  importProgress: number;
  importStatus: 'idle' | 'importing' | 'completed' | 'error';
}

export function ImportStep5({ file, targetTable, validationResults, importProgress, importStatus }: ImportStep5Props) {
  const tableNames: Record<string, string> = { trades: 'tbl_DayTrade - Daily Trades', clients: 'tbl_ClientMaster - Client Master', scrips: 'tbl_ScripMaster - Scrip Master', ledger: 'tbl_Ledger - Ledger Entries' };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-sm border border-slate-200 p-8">
      <h2 className="text-lg font-semibold text-slate-800 mb-6">Import Summary</h2>
      {importStatus !== 'idle' && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-700">{importStatus === 'importing' ? 'Importing...' : importStatus === 'completed' ? 'Import Completed!' : 'Error'}</span>
            <span className="text-sm text-slate-500">{importProgress}%</span>
          </div>
          <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
            <div className={`h-full transition-all duration-300 rounded-full ${importStatus === 'completed' ? 'bg-green-500' : importStatus === 'error' ? 'bg-red-500' : 'bg-indigo-600'}`} style={{ width: `${importProgress}%` }} />
          </div>
          {importStatus === 'completed' && (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
              <CheckCircle className="w-6 h-6 text-green-500" />
              <div><p className="font-medium text-green-800">Import successful!</p><p className="text-sm text-green-600">{validationResults.valid.toLocaleString()} records imported to {tableNames[targetTable] || targetTable}</p></div>
            </div>
          )}
        </div>
      )}
      <div className="space-y-4 mb-8">
        <div className="flex justify-between py-3 border-b border-slate-100"><span className="text-slate-600">Source File</span><span className="font-medium text-slate-800">{file?.name || 'No file selected'}</span></div>
        <div className="flex justify-between py-3 border-b border-slate-100"><span className="text-slate-600">Target Table</span><span className="font-medium text-slate-800">{tableNames[targetTable] || 'Not selected'}</span></div>
        <div className="flex justify-between py-3 border-b border-slate-100"><span className="text-slate-600">Rows to Import</span><span className="font-medium text-green-600">{validationResults.valid.toLocaleString()}</span></div>
        <div className="flex justify-between py-3 border-b border-slate-100"><span className="text-slate-600">Rows to Skip</span><span className="font-medium text-red-600">{validationResults.errors}</span></div>
        <div className="flex justify-between py-3 border-b border-slate-100"><span className="text-slate-600">Estimated Time</span><span className="font-medium text-slate-800">~2 seconds</span></div>
      </div>
      <div className="space-y-3 mb-8">
        <h3 className="text-sm font-medium text-slate-700">Import Options</h3>
        <label className="flex items-center gap-3 cursor-pointer hover:bg-slate-50 p-2 rounded-lg -mx-2">
          <input type="checkbox" disabled={importStatus !== 'idle'} className="w-4 h-4 text-indigo-600 rounded" />
          <div><span className="text-sm text-slate-700">Dry run (validate only)</span><p className="text-xs text-slate-500">Run validation without actually importing data</p></div>
        </label>
        <label className="flex items-center gap-3 cursor-pointer hover:bg-slate-50 p-2 rounded-lg -mx-2">
          <input type="checkbox" defaultChecked disabled={importStatus !== 'idle'} className="w-4 h-4 text-indigo-600 rounded" />
          <div><span className="text-sm text-slate-700">Skip duplicates</span><p className="text-xs text-slate-500">Skip rows that already exist in the database</p></div>
        </label>
        <label className="flex items-center gap-3 cursor-pointer hover:bg-slate-50 p-2 rounded-lg -mx-2">
          <input type="checkbox" defaultChecked disabled={importStatus !== 'idle'} className="w-4 h-4 text-indigo-600 rounded" />
          <div><span className="text-sm text-slate-700">Create backup</span><p className="text-xs text-slate-500">Create a backup of existing data before import</p></div>
        </label>
      </div>
      {importStatus === 'completed' && (
        <div className="flex gap-3">
          <button className="flex-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg flex items-center justify-center gap-2"><Eye className="w-4 h-4" />View Imported Data</button>
          <button className="px-4 py-2 border border-slate-300 hover:bg-slate-50 rounded-lg flex items-center gap-2"><Download className="w-4 h-4" />Export Log</button>
        </div>
      )}
    </div>
  );
}
