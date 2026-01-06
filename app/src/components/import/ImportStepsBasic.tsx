import { Upload, FileSpreadsheet, X, CheckCircle } from 'lucide-react';

interface ImportStep1Props {
  file: { name: string; size: string; rows: number } | null;
  targetTable: string;
  onFileSelect: () => void;
  onRemoveFile: () => void;
  onTableSelect: (table: string) => void;
  isDragging: boolean;
  setIsDragging: (dragging: boolean) => void;
}

export function ImportStep1({ file, targetTable, onFileSelect, onRemoveFile, onTableSelect, isDragging, setIsDragging }: ImportStep1Props) {
  return (
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-sm border border-slate-200 p-8">
      <h2 className="text-lg font-semibold text-slate-800 mb-4">Select File to Import</h2>
      <div
        onClick={onFileSelect}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => { e.preventDefault(); setIsDragging(false); onFileSelect(); }}
        className={`border-2 border-dashed rounded-xl p-12 text-center transition-colors cursor-pointer ${
          isDragging ? 'border-indigo-500 bg-indigo-50' : 'border-slate-300 hover:border-indigo-400 hover:bg-indigo-50/30'
        }`}
      >
        <Upload className={`w-12 h-12 mx-auto mb-4 ${isDragging ? 'text-indigo-500' : 'text-slate-400'}`} />
        <p className="text-slate-600 mb-2"><span className="font-medium text-indigo-600">Click to upload</span> or drag and drop</p>
        <p className="text-sm text-slate-500">CSV, XLSX, XLS up to 50MB</p>
      </div>
      {file && (
        <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200 flex items-center gap-3">
          <FileSpreadsheet className="w-10 h-10 text-green-600" />
          <div className="flex-1">
            <p className="font-medium text-slate-800">{file.name}</p>
            <p className="text-sm text-slate-500">{file.size} - {file.rows.toLocaleString()} rows</p>
          </div>
          <CheckCircle className="w-5 h-5 text-green-600" />
          <button onClick={(e) => { e.stopPropagation(); onRemoveFile(); }} className="p-2 hover:bg-green-100 rounded-lg text-slate-500">
            <X className="w-5 h-5" />
          </button>
        </div>
      )}
      <div className="mt-6">
        <label className="block text-sm font-medium text-slate-700 mb-2">Target Table</label>
        <select
          value={targetTable}
          onChange={(e) => onTableSelect(e.target.value)}
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="">Select target table...</option>
          <option value="trades">tbl_DayTrade - Daily Trades</option>
          <option value="clients">tbl_ClientMaster - Client Master</option>
          <option value="scrips">tbl_ScripMaster - Scrip Master</option>
          <option value="ledger">tbl_Ledger - Ledger Entries</option>
        </select>
      </div>
    </div>
  );
}

interface ImportStep2Props {
  delimiter: string;
  dateFormat: string;
  hasHeader: boolean;
  onDelimiterChange: (d: string) => void;
  onDateFormatChange: (f: string) => void;
  onHasHeaderChange: (h: boolean) => void;
}

export function ImportStep2({ delimiter, dateFormat, hasHeader, onDelimiterChange, onDateFormatChange, onHasHeaderChange }: ImportStep2Props) {
  const previewData = [
    { date: '15/01/2024', client: 'ABC001', scrip: 'RELIANCE', qty: 100, rate: 2450.50, value: 245050 },
    { date: '15/01/2024', client: 'XYZ002', scrip: 'TCS', qty: 50, rate: 3890.25, value: 194512.50 },
    { date: '15/01/2024', client: 'DEF003', scrip: 'INFY', qty: 200, rate: 1567.80, value: 313560 },
  ];

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm border border-slate-200 p-8">
      <h2 className="text-lg font-semibold text-slate-800 mb-6">File Settings</h2>
      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Delimiter</label>
          <select value={delimiter} onChange={(e) => onDelimiterChange(e.target.value)} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500">
            <option value="comma">Comma (,)</option>
            <option value="semicolon">Semicolon (;)</option>
            <option value="tab">Tab</option>
            <option value="pipe">Pipe (|)</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Date Format</label>
          <select value={dateFormat} onChange={(e) => onDateFormatChange(e.target.value)} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500">
            <option value="dd/mm/yyyy">DD/MM/YYYY (Indian)</option>
            <option value="mm/dd/yyyy">MM/DD/YYYY (US)</option>
            <option value="yyyy-mm-dd">YYYY-MM-DD (ISO)</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Number Format</label>
          <select className="w-full px-4 py-2 border border-slate-300 rounded-lg">
            <option>1,23,456.78 (Indian)</option>
            <option>1,234,567.89 (US)</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Encoding</label>
          <select className="w-full px-4 py-2 border border-slate-300 rounded-lg">
            <option>UTF-8</option>
            <option>ISO-8859-1</option>
            <option>Windows-1252</option>
          </select>
        </div>
      </div>
      <div className="flex items-center gap-6 mt-6 py-4 border-t border-slate-200">
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={hasHeader} onChange={(e) => onHasHeaderChange(e.target.checked)} className="w-4 h-4 text-indigo-600 rounded" />
          <span className="text-sm text-slate-700">Has header row</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" defaultChecked className="w-4 h-4 text-indigo-600 rounded" />
          <span className="text-sm text-slate-700">Trim whitespace</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" className="w-4 h-4 text-indigo-600 rounded" />
          <span className="text-sm text-slate-700">Skip empty rows</span>
        </label>
      </div>
      <div className="mt-6">
        <h3 className="text-sm font-medium text-slate-700 mb-3">Preview (First 3 rows)</h3>
        <div className="overflow-auto border border-slate-200 rounded-lg">
          <table className="w-full text-sm">
            <thead className="bg-slate-100">
              <tr>
                {hasHeader && <><th className="px-4 py-2 text-left font-medium">Trade Date</th><th className="px-4 py-2 text-left font-medium">Client</th><th className="px-4 py-2 text-left font-medium">Scrip</th><th className="px-4 py-2 text-right font-medium">Qty</th><th className="px-4 py-2 text-right font-medium">Rate</th><th className="px-4 py-2 text-right font-medium">Value</th></>}
                {!hasHeader && <><th className="px-4 py-2 text-left font-medium">Column A</th><th className="px-4 py-2 text-left font-medium">Column B</th><th className="px-4 py-2 text-left font-medium">Column C</th><th className="px-4 py-2 text-left font-medium">Column D</th><th className="px-4 py-2 text-left font-medium">Column E</th><th className="px-4 py-2 text-left font-medium">Column F</th></>}
              </tr>
            </thead>
            <tbody>
              {previewData.map((row, i) => (
                <tr key={i} className="border-t border-slate-200 hover:bg-slate-50">
                  <td className="px-4 py-2">{row.date}</td>
                  <td className="px-4 py-2 font-mono text-indigo-600">{row.client}</td>
                  <td className="px-4 py-2">{row.scrip}</td>
                  <td className="px-4 py-2 text-right">{row.qty.toLocaleString()}</td>
                  <td className="px-4 py-2 text-right">₹{row.rate.toLocaleString('en-IN')}</td>
                  <td className="px-4 py-2 text-right font-medium">₹{row.value.toLocaleString('en-IN')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
