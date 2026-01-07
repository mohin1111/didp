import { useBackoffice } from '../context/BackofficeContext';
import { Download, BarChart3, FileSpreadsheet } from 'lucide-react';

// Simulated output results
const outputResults = [
  { id: 1, type: 'success', trade: 'TRD-2026-00146', message: 'Matched with counterparty DTCC - No breaks', time: '14:32:05', step: 1 },
  { id: 2, type: 'success', trade: 'TRD-2026-00144', message: 'Matched with counterparty EUROCLEAR - No breaks', time: '14:32:06', step: 1 },
  { id: 3, type: 'warning', trade: 'TRD-2026-00145', message: 'Quantity mismatch: Internal 1,500 vs CP 1,450', time: '14:32:07', step: 1 },
  { id: 4, type: 'error', trade: 'TRD-2026-00143', message: 'Settlement failed - Insufficient securities', time: '14:32:08', step: 2 },
  { id: 5, type: 'success', trade: 'TRD-2026-00142', message: 'Matched with counterparty DTCC - No breaks', time: '14:32:09', step: 1 },
];

export default function OutputSection() {
  const {
    outputTab, setOutputTab,
    sqlOutput, sqlColumns,
    setShowChartModal, exportSqlResultsToExcel,
    selectedTables, exportAllSelectedTablesToExcel,
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
            ) : (
              <div className="space-y-2">
                {outputResults.map(result => (
                  <div key={result.id} className={`p-2 rounded-lg border ${
                    result.type === 'success' ? 'bg-green-500/10 border-green-500/30' :
                    result.type === 'warning' ? 'bg-yellow-500/10 border-yellow-500/30' :
                    'bg-red-500/10 border-red-500/30'
                  }`}>
                    <div className="flex items-center justify-between text-[10px]">
                      <span className={`font-medium ${
                        result.type === 'success' ? 'text-green-400' :
                        result.type === 'warning' ? 'text-yellow-400' : 'text-red-400'
                      }`}>{result.trade}</span>
                      <span className="text-slate-500">{result.time}</span>
                    </div>
                    <p className="text-xs text-slate-300 mt-0.5">{result.message}</p>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
        {outputTab === 'logs' && (
          <div className="bg-slate-900 rounded-lg p-2 font-mono text-[10px] text-slate-400 space-y-1">
            <div><span className="text-slate-500">[14:32:01]</span> Process started: EOD Processing</div>
            <div><span className="text-slate-500">[14:32:02]</span> Loading data from 1 table(s)</div>
            <div><span className="text-slate-500">[14:32:03]</span> Processing 2,847 records...</div>
            <div className="text-green-400"><span className="text-slate-500">[14:32:05]</span> Matching complete - 2,842 matched</div>
            <div className="text-yellow-400"><span className="text-slate-500">[14:32:06]</span> Warning: 3 records with discrepancies</div>
            <div className="text-red-400"><span className="text-slate-500">[14:32:07]</span> Error: 2 records failed validation</div>
          </div>
        )}
        {outputTab === 'summary' && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: 'Total Processed', value: '2,847', color: 'blue' },
                { label: 'Matched', value: '2,842', color: 'green' },
                { label: 'Warnings', value: '3', color: 'yellow' },
                { label: 'Errors', value: '2', color: 'red' },
              ].map(stat => (
                <div key={stat.label} className={`p-2 rounded-lg bg-${stat.color}-500/10 border border-${stat.color}-500/30`}>
                  <div className={`text-lg font-bold text-${stat.color}-400`}>{stat.value}</div>
                  <div className="text-[10px] text-slate-500">{stat.label}</div>
                </div>
              ))}
            </div>
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
