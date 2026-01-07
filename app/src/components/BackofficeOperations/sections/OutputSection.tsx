import { useBackoffice } from '../context/BackofficeContext';
import { Download, BarChart3, FileSpreadsheet, FileText } from 'lucide-react';

export default function OutputSection() {
  const {
    outputTab, setOutputTab,
    sqlOutput, sqlColumns,
    setShowChartModal, exportSqlResultsToExcel,
    selectedTables, exportAllSelectedTablesToExcel,
    activeMatchResult,
  } = useBackoffice();

  return (
    <div className="w-[30%] flex flex-col bg-slate-900/20">
      <div className="flex border-b border-slate-700 bg-slate-900">
        {['results', 'logs', 'summary'].map(tab => (
          <button
            key={tab}
            onClick={() => setOutputTab(tab)}
            className={`flex-1 px-3 py-2 text-xs capitalize ${outputTab === tab ? 'bg-slate-800 text-white border-b-2 border-green-500' : 'text-slate-400 hover:text-white'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-3">
        {outputTab === 'results' && (
          <>
            {sqlOutput.length > 0 ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">{sqlOutput.length} rows returned</span>
                  <div className="flex gap-1">
                    <button onClick={() => setShowChartModal(true)} className="px-2 py-1 bg-orange-500/20 text-orange-400 rounded text-xs flex items-center gap-1">
                      <BarChart3 size={10} />Chart
                    </button>
                    <button onClick={exportSqlResultsToExcel} className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs flex items-center gap-1">
                      <FileSpreadsheet size={10} />Excel
                    </button>
                  </div>
                </div>
                <div className="bg-slate-900 rounded border border-slate-700 overflow-auto max-h-[calc(100vh-200px)]">
                  <table className="w-full text-[10px]">
                    <thead className="bg-slate-800 sticky top-0">
                      <tr>
                        {sqlColumns.map((col, i) => (
                          <th key={i} className="px-2 py-1.5 text-left text-slate-400 font-medium whitespace-nowrap">{col}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {sqlOutput.map((row, i) => (
                        <tr key={i} className="border-t border-slate-700/50 hover:bg-slate-800/50">
                          {row.map((cell, j) => (
                            <td key={j} className="px-2 py-1 whitespace-nowrap font-mono">{cell}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : activeMatchResult ? (
              <div className="space-y-3">
                <div className="text-xs text-slate-400 mb-2">Match Results: {activeMatchResult.configName}</div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="p-2 rounded-lg bg-green-500/10 border border-green-500/30 text-center">
                    <div className="text-lg font-bold text-green-400">{activeMatchResult.result.matchedCount}</div>
                    <div className="text-[10px] text-slate-500">Matched</div>
                  </div>
                  <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/30 text-center">
                    <div className="text-lg font-bold text-amber-400">{activeMatchResult.result.unmatchedSourceCount}</div>
                    <div className="text-[10px] text-slate-500">Unmatched Src</div>
                  </div>
                  <div className="p-2 rounded-lg bg-red-500/10 border border-red-500/30 text-center">
                    <div className="text-lg font-bold text-red-400">{activeMatchResult.result.unmatchedTargetCount}</div>
                    <div className="text-[10px] text-slate-500">Unmatched Tgt</div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <FileText size={32} className="text-slate-600 mb-2" />
                <p className="text-xs text-slate-500">No results yet</p>
                <p className="text-[10px] text-slate-600 mt-1">Run a query or match to see results</p>
              </div>
            )}
          </>
        )}
        {outputTab === 'logs' && (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <FileText size={32} className="text-slate-600 mb-2" />
            <p className="text-xs text-slate-500">No logs yet</p>
            <p className="text-[10px] text-slate-600 mt-1">Process activity will appear here</p>
          </div>
        )}
        {outputTab === 'summary' && (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <BarChart3 size={32} className="text-slate-600 mb-2" />
            <p className="text-xs text-slate-500">No summary data</p>
            <p className="text-[10px] text-slate-600 mt-1">Run a process to see summary</p>
          </div>
        )}
      </div>

      {/* Export Footer */}
      <div className="p-2 border-t border-slate-700 bg-slate-900">
        <button
          onClick={exportAllSelectedTablesToExcel}
          disabled={selectedTables.length === 0}
          className="w-full py-2 bg-green-600 hover:bg-green-700 disabled:bg-slate-700 disabled:text-slate-500 rounded-lg text-xs font-medium flex items-center justify-center gap-2"
        >
          <Download size={14} />
          Export All ({selectedTables.length} tables)
        </button>
      </div>
    </div>
  );
}
