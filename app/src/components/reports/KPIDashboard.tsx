import { useState } from 'react';
import { Users, CandlestickChart, Wallet, TrendingUp, Database, BarChart3, FileText, PieChart, Plus, X, ChevronUp, ChevronDown, RefreshCw, Download } from 'lucide-react';
import { useToast } from '../Toast';

export function KPIDashboard() {
  const { addToast } = useToast();
  const [kpis, setKpis] = useState([
    { id: 1, title: 'Total Trade Value', value: '₹45.2 Cr', change: '+12.5%', up: true, icon: CandlestickChart, color: 'indigo' },
    { id: 2, title: 'Active Clients', value: '1,247', change: '+3.2%', up: true, icon: Users, color: 'green' },
    { id: 3, title: 'Pending Settlements', value: '₹8.7 Cr', change: '-5.1%', up: false, icon: Wallet, color: 'amber' },
    { id: 4, title: 'Margin Utilization', value: '78.5%', change: '+2.3%', up: true, icon: TrendingUp, color: 'blue' },
  ]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const availableKpis = [
    { title: 'Total Brokerage', value: '₹12.4 L', change: '+8.2%', up: true, icon: Database, color: 'purple' },
    { title: 'MTD Turnover', value: '₹234 Cr', change: '+15.7%', up: true, icon: BarChart3, color: 'cyan' },
    { title: 'Open Positions', value: '4,521', change: '-2.1%', up: false, icon: FileText, color: 'rose' },
    { title: "Today's P&L", value: '₹2.1 Cr', change: '+4.3%', up: true, icon: PieChart, color: 'emerald' },
  ];

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => { setIsRefreshing(false); addToast('Dashboard refreshed', 'success'); }, 800);
  };

  const handleAddKpi = (kpi: typeof availableKpis[0]) => {
    setKpis(prev => [...prev, { ...kpi, id: Date.now() }]);
    setShowAddModal(false);
    addToast(`Added "${kpi.title}" to dashboard`, 'success');
  };

  const handleRemoveKpi = (id: number) => {
    setKpis(prev => prev.filter(k => k.id !== id));
    addToast('Widget removed', 'info');
  };

  const colorClasses: Record<string, { bg: string; text: string; icon: string }> = {
    indigo: { bg: 'bg-indigo-50', text: 'text-indigo-600', icon: 'text-indigo-500' },
    green: { bg: 'bg-green-50', text: 'text-green-600', icon: 'text-green-500' },
    amber: { bg: 'bg-amber-50', text: 'text-amber-600', icon: 'text-amber-500' },
    blue: { bg: 'bg-blue-50', text: 'text-blue-600', icon: 'text-blue-500' },
    purple: { bg: 'bg-purple-50', text: 'text-purple-600', icon: 'text-purple-500' },
    cyan: { bg: 'bg-cyan-50', text: 'text-cyan-600', icon: 'text-cyan-500' },
    rose: { bg: 'bg-rose-50', text: 'text-rose-600', icon: 'text-rose-500' },
    emerald: { bg: 'bg-emerald-50', text: 'text-emerald-600', icon: 'text-emerald-500' },
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-800">KPI Dashboard</h2>
        <div className="flex gap-2">
          <button onClick={handleRefresh} disabled={isRefreshing} className="px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-100 rounded-lg flex items-center gap-1.5 disabled:opacity-50">
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />Refresh
          </button>
          <button onClick={() => addToast('Dashboard exported', 'success')} className="px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-100 rounded-lg flex items-center gap-1.5">
            <Download className="w-4 h-4" />Export
          </button>
        </div>
      </div>
      <div className="grid grid-cols-4 gap-6">
        {kpis.map((k) => {
          const colors = colorClasses[k.color] || colorClasses.indigo;
          return (
            <div key={k.id} className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-lg transition-shadow group relative">
              <button onClick={() => handleRemoveKpi(k.id)} className="absolute top-2 right-2 p-1 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                <X className="w-4 h-4" />
              </button>
              <div className="flex items-center gap-3 mb-3">
                <div className={`p-2 rounded-lg ${colors.bg}`}><k.icon className={`w-5 h-5 ${colors.icon}`} /></div>
                <p className="text-sm text-slate-500">{k.title}</p>
              </div>
              <p className="text-2xl font-bold text-slate-800">{k.value}</p>
              <div className="mt-3 flex items-center gap-2">
                <span className={`flex items-center gap-1 text-sm font-medium ${k.up ? 'text-green-600' : 'text-red-600'}`}>
                  {k.up ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}{k.change}
                </span>
                <span className="text-sm text-slate-400">vs yesterday</span>
              </div>
            </div>
          );
        })}
      </div>
      <button onClick={() => setShowAddModal(true)} className="w-full py-4 border-2 border-dashed border-slate-300 rounded-xl text-slate-500 hover:border-indigo-400 hover:text-indigo-600 hover:bg-indigo-50 flex items-center justify-center gap-2 transition-colors">
        <Plus className="w-5 h-5" />Add KPI Widget
      </button>
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowAddModal(false)}>
          <div className="bg-white rounded-xl shadow-xl w-96 p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-800">Add KPI Widget</h3>
              <button onClick={() => setShowAddModal(false)} className="p-1 hover:bg-slate-100 rounded"><X className="w-5 h-5 text-slate-500" /></button>
            </div>
            <div className="space-y-3">
              {availableKpis.map((kpi, i) => {
                const colors = colorClasses[kpi.color] || colorClasses.indigo;
                return (
                  <button key={i} onClick={() => handleAddKpi(kpi)} className="w-full p-4 border border-slate-200 rounded-lg hover:border-indigo-300 hover:bg-indigo-50/50 transition-colors flex items-center gap-3 text-left">
                    <div className={`p-2 rounded-lg ${colors.bg}`}><kpi.icon className={`w-5 h-5 ${colors.icon}`} /></div>
                    <div className="flex-1"><p className="font-medium text-slate-800">{kpi.title}</p><p className="text-sm text-slate-500">{kpi.value}</p></div>
                    <span className={`text-sm font-medium ${kpi.up ? 'text-green-600' : 'text-red-600'}`}>{kpi.change}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
