import { X, Copy, FileCode, Play, PlayCircle, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useBackoffice } from '../context/BackofficeContext';

export default function PythonModal() {
  const {
    showPythonModal,
    setShowPythonModal,
    customScript,
    setCustomScript,
    pythonOutput,
    pythonError,
    pythonResultColumns,
    pythonResultData,
    isExecuting,
    executePythonScript,
  } = useBackoffice();

  if (!showPythonModal) return null;

  const hasResults = pythonResultColumns.length > 0 && pythonResultData.length > 0;

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-8">
      <div className="bg-slate-900 rounded-xl border border-slate-700 w-full max-w-5xl h-[85vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-500/20 rounded-lg">
              <FileCode size={20} className="text-yellow-400" />
            </div>
            <div>
              <h2 className="font-semibold text-white text-lg">Python Script Editor</h2>
              <p className="text-xs text-slate-500">Write and execute Python code on your data</p>
            </div>
          </div>
          <button
            onClick={() => setShowPythonModal(false)}
            disabled={isExecuting}
            className="p-2 hover:bg-slate-700 rounded-lg transition-colors disabled:opacity-50"
          >
            <X size={20} className="text-slate-400" />
          </button>
        </div>

        <div className="flex-1 flex overflow-hidden">
          {/* Editor Panel */}
          <div className="w-1/2 flex flex-col border-r border-slate-700">
            <div className="flex items-center justify-between px-4 py-2 bg-slate-800/50 border-b border-slate-700">
              <span className="text-xs text-slate-400 font-medium">script.py</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => navigator.clipboard.writeText(customScript)}
                  className="p-1.5 hover:bg-slate-700 rounded"
                  title="Copy"
                >
                  <Copy size={14} className="text-slate-400" />
                </button>
              </div>
            </div>
            <textarea
              value={customScript}
              onChange={(e) => setCustomScript(e.target.value)}
              disabled={isExecuting}
              className="flex-1 bg-slate-950 p-4 text-xs font-mono text-green-400 resize-none focus:outline-none disabled:opacity-50"
              spellCheck={false}
            />
          </div>

          {/* Output Panel */}
          <div className="w-1/2 flex flex-col">
            <div className="flex items-center justify-between px-4 py-2 bg-slate-800/50 border-b border-slate-700">
              <span className="text-xs text-slate-400 font-medium">Output</span>
              {isExecuting && (
                <span className="flex items-center gap-1 text-xs text-blue-400">
                  <Loader2 size={12} className="animate-spin" />
                  Executing...
                </span>
              )}
              {!isExecuting && pythonOutput && !pythonError && (
                <span className="flex items-center gap-1 text-xs text-green-400">
                  <CheckCircle2 size={12} />
                  Success
                </span>
              )}
              {!isExecuting && pythonError && (
                <span className="flex items-center gap-1 text-xs text-red-400">
                  <AlertCircle size={12} />
                  Error
                </span>
              )}
            </div>
            <div className="flex-1 bg-slate-950 p-4 overflow-auto">
              {isExecuting ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <Loader2 size={32} className="animate-spin text-yellow-400 mx-auto mb-2" />
                    <p className="text-slate-400 text-sm">Executing script...</p>
                  </div>
                </div>
              ) : pythonError ? (
                <pre className="text-xs font-mono text-red-400 whitespace-pre-wrap">{pythonError}</pre>
              ) : pythonOutput || hasResults ? (
                <div className="space-y-4">
                  {pythonOutput && (
                    <pre className="text-xs font-mono text-slate-300 whitespace-pre-wrap">{pythonOutput}</pre>
                  )}
                  {hasResults && (
                    <div className="mt-4">
                      <div className="text-xs text-slate-400 mb-2">
                        Result DataFrame ({pythonResultData.length} rows)
                      </div>
                      <div className="bg-slate-900 rounded border border-slate-700 overflow-auto max-h-64">
                        <table className="w-full text-[10px]">
                          <thead className="bg-slate-800 sticky top-0">
                            <tr>
                              {pythonResultColumns.map((col, i) => (
                                <th key={i} className="px-2 py-1.5 text-left text-slate-400 font-medium whitespace-nowrap">
                                  {col}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {pythonResultData.slice(0, 100).map((row, i) => (
                              <tr key={i} className="border-t border-slate-700/50 hover:bg-slate-800/50">
                                {row.map((cell, j) => (
                                  <td key={j} className="px-2 py-1 whitespace-nowrap font-mono text-slate-300">
                                    {cell}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center text-slate-500 py-8">
                  <PlayCircle size={32} className="mx-auto mb-2 opacity-50" />
                  <p>Click "Run Script" to execute</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between p-4 border-t border-slate-700 bg-slate-800/50">
          <div className="flex flex-col gap-1 text-xs text-slate-500">
            <span>Available: <code className="text-yellow-400">pd</code> (pandas), <code className="text-yellow-400">np</code> (numpy), <code className="text-yellow-400">excel</code> (Excel formulas)</span>
            <span>Data: <code className="text-cyan-400">tables['table_key']</code> - dict of DataFrames</span>
            <span>Excel: <code className="text-green-400">excel.evaluate("=SUM(A2:A10)", df)</code>, <code className="text-green-400">excel.vlookup(val, df, col)</code></span>
            <span>Return data: Set <code className="text-green-400">result = df</code> to display DataFrame</span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowPythonModal(false)}
              disabled={isExecuting}
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 rounded-lg text-sm"
            >
              Close
            </button>
            <button
              onClick={executePythonScript}
              disabled={isExecuting}
              className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 disabled:bg-slate-700 disabled:text-slate-500 text-black rounded-lg text-sm font-medium flex items-center gap-2"
            >
              {isExecuting ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  Running...
                </>
              ) : (
                <>
                  <Play size={14} />
                  Run Script
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
