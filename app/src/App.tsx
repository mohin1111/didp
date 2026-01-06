import { useState, useEffect } from 'react';
import {
  Table, Upload, BarChart3, GitBranch, Search, Bell, Settings, User,
  ChevronDown, ChevronRight, Users, Building2, CandlestickChart, Wallet,
  FileText, TrendingUp, PieChart, Database, Workflow, Package, BookOpen,
  DollarSign, Receipt, CheckCircle, Play
} from 'lucide-react';
import AGGridView from './components/AGGridView';
import { ImportWizard } from './components/import/ImportWizard';
import { ReportBuilder } from './components/reports/ReportBuilder';
import { ViewsBuilder } from './components/views/ViewsBuilder';
import { WorkflowView } from './components/workflow/WorkflowView';
import { DemoProvider, useDemo, DemoOverlay, type TabId } from './components/demo';
import type { TableItem, TabItem } from './types';

function AppContent() {
  const [activeTab, setActiveTab] = useState<TabId | string>('tables');
  const [selectedTable, setSelectedTable] = useState('clients');
  const [tablesExpanded, setTablesExpanded] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [importStep, setImportStep] = useState(1);
  const [reportTab, setReportTab] = useState('pivot');

  const { startDemo, registerTabCallback } = useDemo();

  // Register tab callback for demo navigation
  useEffect(() => {
    registerTabCallback((tab: TabId) => setActiveTab(tab));
  }, [registerTabCallback]);

  const tables: TableItem[] = [
    { id: 'clients', name: 'Clients', icon: Users, count: 1247 },
    { id: 'brokers', name: 'Brokers', icon: Building2, count: 89 },
    { id: 'trades', name: 'Trades', icon: CandlestickChart, count: 45672 },
    { id: 'scrips', name: 'Scrips', icon: FileText, count: 2156 },
    { id: 'positions', name: 'Positions', icon: TrendingUp, count: 8934 },
    { id: 'margins', name: 'Margins', icon: Wallet, count: 3421 },
    { id: 'ledger', name: 'Ledger', icon: Database, count: 156789 },
    { id: 'pnl', name: 'P&L', icon: PieChart, count: 4521 },
  ];

  const workflowTables: TableItem[] = [
    { id: 'dayTradeFut', name: 'Day Trade (Futures)', icon: CandlestickChart, count: 4 },
    { id: 'dayTradeOpt', name: 'Day Trade (Options)', icon: CandlestickChart, count: 3 },
    { id: 'dayTradeCash', name: 'Day Trade (Cash)', icon: CandlestickChart, count: 5 },
    { id: 'openPositions', name: 'Open Positions', icon: Package, count: 6 },
    { id: 'closedPositions', name: 'Closed Positions', icon: CheckCircle, count: 5 },
    { id: 'mtm', name: 'Mark to Market', icon: TrendingUp, count: 4 },
    { id: 'brokerage', name: 'Brokerage', icon: DollarSign, count: 5 },
    { id: 'accountPostings', name: 'Journal Entries', icon: BookOpen, count: 8 },
    { id: 'closingPrices', name: 'Closing Prices', icon: Receipt, count: 5 },
  ];

  const tabs: TabItem[] = [
    { id: 'tables', label: 'Tables', icon: Table },
    { id: 'workflow', label: 'Workflow', icon: Workflow },
    { id: 'import', label: 'Import', icon: Upload },
    { id: 'reports', label: 'Reports', icon: BarChart3 },
    { id: 'views', label: 'Views', icon: GitBranch },
  ];

  return (
    <div className="h-screen flex flex-col bg-slate-50 text-slate-800 font-sans">
      {/* Header */}
      <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-4 shadow-sm">
        <div className="flex items-center gap-6">
          <h1 className="text-lg font-bold text-indigo-600">CNS DataGrid</h1>
          <nav className="flex gap-1">
            {tabs.map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === tab.id ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-100'}`}>
                <tab.icon className="w-4 h-4" />{tab.label}
              </button>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={startDemo}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-sm font-medium rounded-lg shadow-sm transition-all"
          >
            <Play className="w-4 h-4" />
            Start Demo
          </button>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="text" placeholder="Search tables, records..." className="pl-10 pr-4 py-2 w-64 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
          </div>
          <button className="p-2 hover:bg-slate-100 rounded-lg relative"><Bell className="w-5 h-5 text-slate-500" /><span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span></button>
          <button className="p-2 hover:bg-slate-100 rounded-lg"><Settings className="w-5 h-5 text-slate-500" /></button>
          <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white text-sm font-medium"><User className="w-4 h-4" /></div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar - only show for tables tab */}
        {activeTab === 'tables' && (
          <aside data-demo="sidebar" className={`${sidebarCollapsed ? 'w-16' : 'w-64'} bg-white border-r border-slate-200 flex flex-col transition-all duration-300`}>
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              {!sidebarCollapsed && <h2 className="font-semibold text-slate-700">Database</h2>}
              <button onClick={() => setSidebarCollapsed(!sidebarCollapsed)} className="p-1.5 hover:bg-slate-100 rounded">
                <ChevronDown className={`w-4 h-4 text-slate-400 transform transition-transform ${sidebarCollapsed ? 'rotate-90' : ''}`} />
              </button>
            </div>
            {!sidebarCollapsed && (<div className="flex-1 overflow-auto p-3">
              <div className="mb-2">
                <button onClick={() => setTablesExpanded(!tablesExpanded)} className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg">
                  {tablesExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                  <Database className="w-4 h-4 text-slate-400" />Tables
                  <span className="ml-auto text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">{tables.length}</span>
                </button>
                {tablesExpanded && (
                  <div className="ml-4 mt-1 space-y-0.5">
                    {tables.map(table => (
                      <button key={table.id} onClick={() => setSelectedTable(table.id)} className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all ${selectedTable === table.id ? 'bg-indigo-50 text-indigo-700 font-medium' : 'text-slate-600 hover:bg-slate-50'}`}>
                        <table.icon className={`w-4 h-4 ${selectedTable === table.id ? 'text-indigo-500' : 'text-slate-400'}`} />
                        <span className="flex-1 text-left">{table.name}</span>
                        <span className={`text-xs px-1.5 py-0.5 rounded ${selectedTable === table.id ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-500'}`}>{table.count.toLocaleString()}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>)}
          </aside>
        )}

        {/* Content Area */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {activeTab === 'tables' && <AGGridView selectedTable={selectedTable} />}
          {activeTab === 'workflow' && <WorkflowView selectedTable={selectedTable} setSelectedTable={setSelectedTable} workflowTables={workflowTables} />}
          {activeTab === 'import' && <ImportWizard step={importStep} setStep={setImportStep} />}
          {activeTab === 'reports' && <ReportBuilder activeTab={reportTab} setActiveTab={setReportTab} />}
          {activeTab === 'views' && <ViewsBuilder />}
        </main>
      </div>

      {/* Demo Overlay */}
      <DemoOverlay />
    </div>
  );
}

export default function App() {
  return (
    <DemoProvider>
      <AppContent />
    </DemoProvider>
  );
}
