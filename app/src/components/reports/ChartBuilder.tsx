import { useState } from 'react';
import { BarChart3, TrendingUp, PieChart, Save, Download, RefreshCw } from 'lucide-react';
import { useToast } from '../Toast';

export function ChartBuilder() {
  const { addToast } = useToast();
  const [chartType, setChartType] = useState<'bar' | 'line' | 'pie'>('bar');
  const [xAxis, setXAxis] = useState('Trade Date');
  const [yAxis, setYAxis] = useState('SUM(Value)');
  const [groupBy, setGroupBy] = useState('None');
  const [isGenerating, setIsGenerating] = useState(false);

  const chartData = [
    { label: '9 Jan', value: 65 }, { label: '10 Jan', value: 45 }, { label: '11 Jan', value: 80 },
    { label: '12 Jan', value: 55 }, { label: '13 Jan', value: 70 }, { label: '14 Jan', value: 40 }, { label: '15 Jan', value: 85 },
  ];
  const pieData = [
    { label: 'NSE', value: 45, color: 'bg-indigo-500' }, { label: 'BSE', value: 30, color: 'bg-green-500' },
    { label: 'MCX', value: 15, color: 'bg-amber-500' }, { label: 'NCDEX', value: 10, color: 'bg-red-500' },
  ];

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => { setIsGenerating(false); addToast('Chart generated successfully', 'success'); }, 600);
  };

  const chartTypes = [{ id: 'bar' as const, icon: BarChart3, label: 'Bar' }, { id: 'line' as const, icon: TrendingUp, label: 'Line' }, { id: 'pie' as const, icon: PieChart, label: 'Pie' }];

  return (
    <div className="flex gap-6 h-full">
      <div className="w-72 bg-white rounded-xl border border-slate-200 p-6 space-y-6">
        <div>
          <h3 className="font-semibold text-slate-800 mb-4">Chart Type</h3>
          <div className="grid grid-cols-3 gap-2">
            {chartTypes.map(t => (
              <button key={t.id} onClick={() => setChartType(t.id)} className={`p-3 rounded-lg border-2 flex flex-col items-center gap-1 transition-colors ${chartType === t.id ? 'border-indigo-500 bg-indigo-50' : 'border-slate-200 hover:border-slate-300'}`}>
                <t.icon className={`w-5 h-5 ${chartType === t.id ? 'text-indigo-600' : 'text-slate-400'}`} />
                <span className={`text-xs ${chartType === t.id ? 'text-indigo-600 font-medium' : 'text-slate-500'}`}>{t.label}</span>
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">X-Axis / Category</label>
          <select value={xAxis} onChange={(e) => setXAxis(e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500">
            <option>Trade Date</option><option>Client</option><option>Scrip</option><option>Exchange</option><option>Broker</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Y-Axis / Value</label>
          <select value={yAxis} onChange={(e) => setYAxis(e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500">
            <option>SUM(Value)</option><option>SUM(Quantity)</option><option>COUNT(Trades)</option><option>AVG(Rate)</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Group By</label>
          <select value={groupBy} onChange={(e) => setGroupBy(e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500">
            <option>None</option><option>Exchange</option><option>Segment</option><option>B/S</option>
          </select>
        </div>
        <button onClick={handleGenerate} disabled={isGenerating} className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg flex items-center justify-center gap-2 disabled:opacity-50">
          <RefreshCw className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />{isGenerating ? 'Generating...' : 'Generate'}
        </button>
        <button onClick={() => addToast('Chart saved as "Daily Trade Volume"', 'success')} className="w-full py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 text-sm font-medium rounded-lg flex items-center justify-center gap-2">
          <Save className="w-4 h-4" />Save Chart
        </button>
      </div>
      <div className="flex-1 bg-white rounded-xl border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-semibold text-slate-800">{yAxis} by {xAxis}</h3>
          <button onClick={() => addToast('Chart exported as PNG', 'success')} className="px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-100 rounded-lg flex items-center gap-1.5"><Download className="w-4 h-4" />Export</button>
        </div>
        {chartType === 'bar' && (
          <div className="h-64 flex items-end justify-around gap-3 px-8 pb-8 border-b border-l border-slate-200 relative">
            {chartData.map((d, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                <div className="absolute -top-6 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">₹{(d.value * 1000).toLocaleString()}</div>
                <div className="w-full max-w-10 bg-gradient-to-t from-indigo-600 to-indigo-400 rounded-t-lg transition-all hover:opacity-80" style={{ height: `${d.value}%` }} />
                <span className="text-xs text-slate-500">{d.label}</span>
              </div>
            ))}
          </div>
        )}
        {chartType === 'line' && (
          <div className="h-64 relative px-8 pb-8 border-b border-l border-slate-200">
            <svg className="w-full h-full" viewBox="0 0 700 200" preserveAspectRatio="none">
              <polyline fill="none" stroke="#6366f1" strokeWidth="3" points={chartData.map((d, i) => `${i * 100 + 50},${200 - d.value * 2}`).join(' ')} />
              {chartData.map((d, i) => (<circle key={i} cx={i * 100 + 50} cy={200 - d.value * 2} r="6" fill="#6366f1" className="hover:r-8 transition-all" />))}
            </svg>
            <div className="absolute bottom-0 left-8 right-0 flex justify-around">{chartData.map((d, i) => (<span key={i} className="text-xs text-slate-500">{d.label}</span>))}</div>
          </div>
        )}
        {chartType === 'pie' && (
          <div className="h-64 flex items-center justify-center gap-8">
            <div className="relative w-48 h-48">
              <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                {pieData.reduce((acc, d, i) => {
                  const startAngle = acc.offset;
                  const angle = (d.value / 100) * 360;
                  const endAngle = startAngle + angle;
                  const x1 = 50 + 40 * Math.cos((startAngle * Math.PI) / 180);
                  const y1 = 50 + 40 * Math.sin((startAngle * Math.PI) / 180);
                  const x2 = 50 + 40 * Math.cos((endAngle * Math.PI) / 180);
                  const y2 = 50 + 40 * Math.sin((endAngle * Math.PI) / 180);
                  const largeArc = angle > 180 ? 1 : 0;
                  const colors = ['#6366f1', '#22c55e', '#f59e0b', '#ef4444'];
                  acc.elements.push(<path key={i} d={`M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArc} 1 ${x2} ${y2} Z`} fill={colors[i]} className="hover:opacity-80 transition-opacity cursor-pointer" />);
                  acc.offset = endAngle;
                  return acc;
                }, { elements: [] as React.ReactNode[], offset: 0 }).elements}
              </svg>
            </div>
            <div className="space-y-2">
              {pieData.map((d, i) => (<div key={i} className="flex items-center gap-2"><div className={`w-3 h-3 rounded ${d.color}`} /><span className="text-sm text-slate-600">{d.label}</span><span className="text-sm font-medium text-slate-800">{d.value}%</span></div>))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
