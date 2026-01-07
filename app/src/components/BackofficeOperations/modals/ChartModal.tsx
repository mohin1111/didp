import { X, BarChart3, LineChart, PieChart, AreaChart, Table, FileSpreadsheet } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useBackoffice } from '../context/BackofficeContext';
import { ChartRenderer } from '../shared';
import type { ChartType, ChartDataPoint } from '../shared';

const chartOptions: Array<{ type: ChartType; icon: LucideIcon; label: string }> = [
  { type: 'bar', icon: BarChart3, label: 'Bar' },
  { type: 'line', icon: LineChart, label: 'Line' },
  { type: 'area', icon: AreaChart, label: 'Area' },
  { type: 'pie', icon: PieChart, label: 'Pie' },
];

export default function ChartModal() {
  const {
    showChartModal,
    setShowChartModal,
    sqlOutput,
    sqlColumns,
    chartType,
    setChartType,
    chartXAxis,
    setChartXAxis,
    chartYAxis,
    setChartYAxis,
    setOutputView,
    exportSqlResultsToExcel,
  } = useBackoffice();

  if (!showChartModal) return null;

  // Prepare chart data
  const chartData: ChartDataPoint[] = sqlOutput.map((row, idx) => {
    const xValue = row[chartXAxis] || `Row ${idx + 1}`;
    const yValue = parseFloat(row[chartYAxis]?.replace(/[$,£€+%]/g, '') || '0');

    const dataPoint: ChartDataPoint = {
      name: xValue.length > 15 ? xValue.substring(0, 15) + '...' : xValue,
      fullName: xValue,
      value: isNaN(yValue) ? 0 : yValue,
    };

    sqlColumns.forEach((col, i) => {
      dataPoint[col] = row[i] || '';
    });

    return dataPoint;
  });

  const yAxisLabel = sqlColumns[chartYAxis] || 'Value';

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-8">
      <div className="bg-slate-900 rounded-xl border border-slate-700 w-full max-w-[95vw] xl:max-w-6xl h-[85vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-500/20 rounded-lg">
              <BarChart3 size={20} className="text-orange-400" />
            </div>
            <div>
              <h2 className="font-semibold text-white text-lg">Query Results Visualization</h2>
              <p className="text-xs text-slate-500">{sqlOutput.length} rows from query</p>
            </div>
          </div>
          <button
            onClick={() => setShowChartModal(false)}
            className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
          >
            <X size={20} className="text-slate-400" />
          </button>
        </div>

        {/* Chart Controls */}
        <div className="flex items-center justify-between p-4 bg-slate-800/50 border-b border-slate-700">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500">Chart Type:</span>
              <div className="flex gap-1">
                {chartOptions.map((opt) => (
                  <button
                    key={opt.type}
                    onClick={() => setChartType(opt.type)}
                    className={`flex items-center gap-1.5 px-2 py-1.5 rounded text-xs transition-colors ${
                      chartType === opt.type
                        ? 'bg-orange-500 text-black'
                        : 'bg-slate-700 hover:bg-slate-600 text-slate-300'
                    }`}
                  >
                    <opt.icon size={12} />
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
            {chartType !== 'pie' && (
              <>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500">X-Axis:</span>
                  <select
                    value={chartXAxis}
                    onChange={(e) => setChartXAxis(parseInt(e.target.value))}
                    className="bg-slate-700 border border-slate-600 rounded px-2 py-1 text-xs focus:outline-none focus:border-orange-500"
                  >
                    {sqlColumns.map((col, i) => (
                      <option key={i} value={i}>{col}</option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500">Y-Axis:</span>
                  <select
                    value={chartYAxis}
                    onChange={(e) => setChartYAxis(parseInt(e.target.value))}
                    className="bg-slate-700 border border-slate-600 rounded px-2 py-1 text-xs focus:outline-none focus:border-orange-500"
                  >
                    {sqlColumns.map((col, i) => (
                      <option key={i} value={i}>{col}</option>
                    ))}
                  </select>
                </div>
              </>
            )}
          </div>
          <button
            onClick={() => setOutputView('table')}
            className="flex items-center gap-1 px-3 py-1.5 bg-slate-700 hover:bg-slate-600 rounded text-xs"
          >
            <Table size={12} />
            View Table
          </button>
        </div>

        {/* Chart Area */}
        <div className="flex-1 p-6">
          <ChartRenderer
            data={chartData}
            chartType={chartType}
            yAxisLabel={yAxisLabel}
          />
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between p-4 border-t border-slate-700 bg-slate-800/50">
          <div className="text-xs text-slate-500">
            {chartType === 'pie' ? 'Pie chart shows distribution of values' : `Showing ${yAxisLabel} by ${sqlColumns[chartXAxis] || 'X-Axis'}`}
          </div>
          <div className="flex gap-2">
            <button
              onClick={exportSqlResultsToExcel}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-sm flex items-center gap-2"
            >
              <FileSpreadsheet size={14} />
              Export Data to Excel
            </button>
            <button
              onClick={() => setShowChartModal(false)}
              className="px-4 py-2 bg-orange-500 hover:bg-orange-600 rounded-lg text-sm"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
