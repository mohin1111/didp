import { X, Columns, FileSpreadsheet } from 'lucide-react';
import { useBackoffice } from '../context/BackofficeContext';

export default function CompareModal() {
  const {
    showCompareModal,
    setShowCompareModal,
    compareRows,
    setCompareRows,
    exportComparisonToExcel,
    masterTables,
  } = useBackoffice();

  if (!showCompareModal || compareRows.length === 0) return null;

  const tableKeys = [...new Set(compareRows.map(r => r.tableKey))];
  const maxCols = Math.max(...compareRows.map(r => r.data.length));

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-8">
      <div className="bg-slate-900 rounded-xl border border-slate-700 w-full max-w-[95vw] xl:max-w-6xl max-h-[85vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-500/20 rounded-lg">
              <Columns size={20} className="text-purple-400" />
            </div>
            <div>
              <h2 className="font-semibold text-white text-lg">Row Comparison</h2>
              <p className="text-xs text-slate-500">Comparing {compareRows.length} rows from {tableKeys.length} table(s)</p>
            </div>
          </div>
          <button
            onClick={() => setShowCompareModal(false)}
            className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
          >
            <X size={20} className="text-slate-400" />
          </button>
        </div>

        {/* Comparison Content */}
        <div className="flex-1 p-4 overflow-auto">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-800">
                  <th className="px-3 py-2 text-left text-slate-400 font-medium">Source</th>
                  <th className="px-3 py-2 text-left text-slate-400 font-medium">Row</th>
                  {Array.from({ length: maxCols }).map((_, i) => (
                    <th key={i} className="px-3 py-2 text-left text-slate-400 font-medium">Col {i + 1}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {compareRows.map((row, idx) => (
                  <tr key={idx} className="border-t border-slate-700">
                    <td className="px-3 py-2">
                      <span className="px-2 py-1 bg-purple-500/20 text-purple-400 text-xs rounded">
                        {masterTables[row.tableKey]?.label}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-slate-400">#{row.rowIndex + 1}</td>
                    {row.data.map((cell, cellIdx) => {
                      const otherValues = compareRows.filter((_, i) => i !== idx).map(r => r.data[cellIdx]);
                      const isDifferent = otherValues.length > 0 && otherValues.some(v => v !== cell);

                      return (
                        <td
                          key={cellIdx}
                          className={`px-3 py-2 font-mono ${
                            isDifferent ? 'bg-yellow-500/20 text-yellow-300' : ''
                          }`}
                        >
                          {cell}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Legend */}
          <div className="mt-4 flex items-center gap-4 text-xs text-slate-500">
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 bg-yellow-500/20 rounded"></span>
              Values differ across rows
            </span>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between p-4 border-t border-slate-700 bg-slate-800/50">
          <button
            onClick={() => setCompareRows([])}
            className="text-sm text-slate-400 hover:text-white"
          >
            Clear comparison
          </button>
          <div className="flex gap-2">
            <button
              onClick={exportComparisonToExcel}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-sm flex items-center gap-2"
            >
              <FileSpreadsheet size={14} />
              Export to Excel
            </button>
            <button
              onClick={() => setShowCompareModal(false)}
              className="px-4 py-2 bg-purple-500 hover:bg-purple-600 rounded-lg text-sm"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
