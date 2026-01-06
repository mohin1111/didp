import { Table, BarChart3, TrendingUp } from 'lucide-react';
import { PivotBuilder } from './PivotBuilder';
import { ChartBuilder } from './ChartBuilder';
import { KPIDashboard } from './KPIDashboard';

interface ReportBuilderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function ReportBuilder({ activeTab, setActiveTab }: ReportBuilderProps) {
  const tabs = [
    { id: 'pivot', label: 'Pivot Table', icon: Table },
    { id: 'chart', label: 'Charts', icon: BarChart3 },
    { id: 'kpi', label: 'KPI Dashboard', icon: TrendingUp }
  ];

  return (
    <div className="flex-1 flex flex-col bg-slate-50" data-demo="reports">
      <div className="bg-white border-b border-slate-200 px-6">
        <div className="flex gap-6">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 py-4 border-b-2 text-sm font-medium ${
                activeTab === tab.id
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>
      <div className="flex-1 overflow-auto p-6">
        {activeTab === 'pivot' && <PivotBuilder />}
        {activeTab === 'chart' && <ChartBuilder />}
        {activeTab === 'kpi' && <KPIDashboard />}
      </div>
    </div>
  );
}
