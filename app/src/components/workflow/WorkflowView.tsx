import { useState } from 'react';
import { ArrowLeft, ArrowRight, Play, RefreshCw, Eye, CandlestickChart, Package, TrendingUp, BookOpen } from 'lucide-react';
import { useToast } from '../Toast';
import AGGridView from '../AGGridView';
import type { TableItem, WorkflowStep } from '../../types';

interface WorkflowViewProps {
  selectedTable: string;
  setSelectedTable: (table: string) => void;
  workflowTables: TableItem[];
}

const workflowSteps: WorkflowStep[] = [
  { id: 1, title: 'Trade Upload & Entry', description: 'Validates and inserts trades into respective tables based on market type (Futures, Options, Cash)', color: 'text-blue-700', bgColor: 'bg-blue-50', borderColor: 'border-blue-300', tables: ['tbl_DayTradeFut', 'tbl_DayTradeOpt', 'tbl_DayTradeCash'], tableIds: ['dayTradeFut', 'dayTradeOpt', 'dayTradeCash'], procedure: 'usp_SaveTrade' },
  { id: 2, title: 'Position Management', description: 'Maintains open positions, creates closed positions using FIFO/LIFO matching', color: 'text-green-700', bgColor: 'bg-green-50', borderColor: 'border-green-300', tables: ['tbl_OpenPositon', 'tbl_ClosePositon'], tableIds: ['openPositions', 'closedPositions'], procedure: 'usp_ManageTradePosition' },
  { id: 3, title: 'Mark-to-Market (MTM)', description: 'Daily valuation of open positions using closing prices', color: 'text-purple-700', bgColor: 'bg-purple-50', borderColor: 'border-purple-300', tables: ['tbl_MarkToMarket', 'tbl_ClosingPrice'], tableIds: ['mtm', 'closingPrices'], formula: 'MTM = (ClosePrice - AvgPrice) × Qty × Multiplier × ConvRate', procedure: 'usp_ManageMTM' },
  { id: 4, title: 'Brokerage Calculation', description: 'Calculates commissions based on trade value or per-lot basis', color: 'text-amber-700', bgColor: 'bg-amber-50', borderColor: 'border-amber-300', tables: ['tbl_BrokerCommission', 'tbl_ClientCommission'], tableIds: ['brokerage'], formula: 'Brokerage = TradeValue × (Rate/100) OR Qty × PerLot', procedure: 'usp_CalculateBrokerage' },
  { id: 5, title: 'P&L Posting', description: 'Posts realized P&L to accounting system via bill posting', color: 'text-rose-700', bgColor: 'bg-rose-50', borderColor: 'border-rose-300', tables: ['tbl_ClosePositon', 'tbl_AccountPosting'], tableIds: ['closedPositions', 'accountPostings'], procedure: 'usp_BillPostingPL' },
  { id: 6, title: 'GL Journal Entries', description: 'Creates double-entry journal postings for all transactions', color: 'text-indigo-700', bgColor: 'bg-indigo-50', borderColor: 'border-indigo-300', tables: ['tbl_AccountPosting'], tableIds: ['accountPostings'], procedure: 'usp_PostAccountEntry' },
];

export function WorkflowView({ selectedTable, setSelectedTable, workflowTables }: WorkflowViewProps) {
  const { addToast } = useToast();
  const [activeStep, setActiveStep] = useState<number | null>(null);
  const [showDataView, setShowDataView] = useState(false);

  const handleStepClick = (step: WorkflowStep) => { setActiveStep(step.id); addToast(`Step ${step.id}: ${step.title}`, 'info'); };
  const handleViewData = (tableId: string) => { setSelectedTable(tableId); setShowDataView(true); };
  const handleBackToWorkflow = () => { setShowDataView(false); setActiveStep(null); };

  if (showDataView) {
    return (
      <div className="flex-1 flex flex-col">
        <div className="bg-white border-b border-slate-200 px-6 py-3 flex items-center gap-4">
          <button onClick={handleBackToWorkflow} className="px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-100 rounded-lg flex items-center gap-2"><ArrowLeft className="w-4 h-4" />Back to Workflow</button>
          <span className="text-slate-400">|</span>
          <span className="text-sm font-medium text-slate-700">Viewing: {workflowTables.find(t => t.id === selectedTable)?.name || selectedTable}</span>
        </div>
        <div className="flex-1 flex">
          <aside className="w-56 bg-white border-r border-slate-200 p-4">
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Workflow Tables</h3>
            <div className="space-y-1">
              {workflowTables.map(table => (
                <button key={table.id} onClick={() => setSelectedTable(table.id)} className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all ${selectedTable === table.id ? 'bg-indigo-50 text-indigo-700 font-medium' : 'text-slate-600 hover:bg-slate-50'}`}>
                  <table.icon className={`w-4 h-4 ${selectedTable === table.id ? 'text-indigo-500' : 'text-slate-400'}`} />
                  <span className="flex-1 text-left truncate">{table.name}</span>
                  <span className={`text-xs px-1.5 py-0.5 rounded ${selectedTable === table.id ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-500'}`}>{table.count}</span>
                </button>
              ))}
            </div>
          </aside>
          <div className="flex-1"><AGGridView selectedTable={selectedTable} /></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-slate-50 overflow-auto">
      <div className="bg-white border-b border-slate-200 px-8 py-6">
        <div className="flex items-center justify-between">
          <div><h1 className="text-xl font-bold text-slate-800">Trade Lifecycle Workflow</h1><p className="text-sm text-slate-500 mt-1">End-to-end trade processing from entry to accounting</p></div>
          <div className="flex gap-3">
            <button onClick={() => addToast('Workflow executed successfully', 'success')} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg flex items-center gap-2"><Play className="w-4 h-4" />Run Workflow</button>
            <button onClick={() => addToast('Workflow refreshed', 'info')} className="px-4 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 text-sm font-medium rounded-lg flex items-center gap-2"><RefreshCw className="w-4 h-4" />Refresh</button>
          </div>
        </div>
      </div>
      <div className="flex-1 p-8">
        <div className="max-w-6xl mx-auto">
          <div data-demo="workflow-steps">
          {[0, 3].map(startIdx => (
            <div key={startIdx} className={`grid grid-cols-3 gap-6 ${startIdx === 0 ? 'mb-8' : ''}`}>
              {workflowSteps.slice(startIdx, startIdx + 3).map((step, index) => (
                <div key={step.id} className="relative" data-demo={`workflow-step-${step.id}`}>
                  <div onClick={() => handleStepClick(step)} className={`${step.bgColor} ${step.borderColor} border-2 rounded-xl p-5 cursor-pointer hover:shadow-lg transition-all ${activeStep === step.id ? 'ring-2 ring-offset-2 ring-indigo-500' : ''}`}>
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`w-8 h-8 rounded-full ${step.bgColor} border-2 ${step.borderColor} flex items-center justify-center text-sm font-bold ${step.color}`}>{step.id}</div>
                      <h3 className={`font-semibold ${step.color}`}>{step.title}</h3>
                    </div>
                    <p className="text-sm text-slate-600 mb-3">{step.description}</p>
                    {step.formula && <div className="bg-white/50 rounded-lg p-2 mb-3"><code className="text-xs text-slate-700">{step.formula}</code></div>}
                    <div className="space-y-1">
                      {step.tables.map((table, i) => (
                        <button key={i} onClick={(e) => { e.stopPropagation(); handleViewData(step.tableIds[i] || step.tableIds[0]); }} className="w-full text-left px-2 py-1 bg-white/70 hover:bg-white rounded text-xs font-mono text-slate-600 hover:text-indigo-600 transition-colors flex items-center justify-between">
                          {table}<Eye className="w-3 h-3 opacity-0 group-hover:opacity-100" />
                        </button>
                      ))}
                    </div>
                    {step.procedure && <div className="mt-3 pt-3 border-t border-slate-200"><span className="text-xs text-slate-500">Procedure: </span><code className="text-xs font-medium text-slate-700">{step.procedure}</code></div>}
                  </div>
                  {index < 2 && <div className="absolute top-1/2 -right-3 transform -translate-y-1/2 z-10"><ArrowRight className="w-6 h-6 text-slate-400" /></div>}
                </div>
              ))}
            </div>
          ))}
          </div>
          {/* Connector */}
          <div className="flex justify-center -mt-4 mb-4"><div className="w-px h-8 bg-slate-300"></div></div>
          {/* Stats */}
          <div className="mt-6 grid grid-cols-4 gap-4">
            <div className="bg-white rounded-xl border border-slate-200 p-4 text-center"><p className="text-2xl font-bold text-indigo-600">12</p><p className="text-sm text-slate-500">Day Trades</p></div>
            <div className="bg-white rounded-xl border border-slate-200 p-4 text-center"><p className="text-2xl font-bold text-green-600">6</p><p className="text-sm text-slate-500">Open Positions</p></div>
            <div className="bg-white rounded-xl border border-slate-200 p-4 text-center"><p className="text-2xl font-bold text-purple-600">4</p><p className="text-sm text-slate-500">MTM Records</p></div>
            <div className="bg-white rounded-xl border border-slate-200 p-4 text-center"><p className="text-2xl font-bold text-amber-600">8</p><p className="text-sm text-slate-500">Journal Entries</p></div>
          </div>
          {/* Quick Actions */}
          <div className="mt-8 bg-white rounded-xl border border-slate-200 p-6">
            <h3 className="font-semibold text-slate-800 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-4 gap-4">
              {[{ id: 'dayTradeFut', icon: CandlestickChart, color: 'blue', title: 'View Trades', desc: 'Day trades across markets' }, { id: 'openPositions', icon: Package, color: 'green', title: 'Open Positions', desc: 'Current holdings' }, { id: 'mtm', icon: TrendingUp, color: 'purple', title: 'MTM Report', desc: 'Mark-to-market data' }, { id: 'accountPostings', icon: BookOpen, color: 'indigo', title: 'Journal Entries', desc: 'GL postings' }].map(a => (
                <button key={a.id} onClick={() => handleViewData(a.id)} className="p-4 border border-slate-200 rounded-lg hover:border-indigo-300 hover:bg-indigo-50 transition-colors text-left">
                  <a.icon className={`w-5 h-5 text-${a.color}-500 mb-2`} /><p className="font-medium text-slate-800">{a.title}</p><p className="text-xs text-slate-500">{a.desc}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
