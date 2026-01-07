import { BackofficeProvider, useBackoffice } from './context/BackofficeContext';
import {
  FullViewModal, CompareModal, ChartModal, SaveProcessModal,
  LoadProcessModal, SchemaModal, PythonModal, ImportModal, ValueMappingModal,
  RelationshipModal, MatchConfigModal,
} from './modals';
import { MasterDataSection, ProcessingSection, OutputSection } from './sections';
import { Database, Clock, X, MousePointer2, GitCompare } from 'lucide-react';

function BackofficeContent() {
  const {
    selectedCells, clearCellSelection,
    compareRows, setShowCompareModal,
    fileInputRef, handleFileSelect,
  } = useBackoffice();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Modals */}
      <FullViewModal />
      <CompareModal />
      <ChartModal />
      <SaveProcessModal />
      <LoadProcessModal />
      <SchemaModal />
      <PythonModal />
      <ImportModal />
      <ValueMappingModal />
      <RelationshipModal />
      <MatchConfigModal />

      {/* Hidden file input for Excel import */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept=".xlsx,.xls,.csv"
        className="hidden"
      />

      {/* Header */}
      <header className="bg-slate-900 border-b border-slate-700 px-3 lg:px-6 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 lg:gap-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 lg:w-8 lg:h-8 bg-gradient-to-br from-orange-500 to-amber-400 rounded-lg flex items-center justify-center">
                <Database size={16} className="text-white" />
              </div>
              <span className="text-base lg:text-lg font-bold bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">
                DIDP
              </span>
            </div>
            <span className="text-slate-500 hidden md:inline">|</span>
            <span className="text-xs lg:text-sm text-slate-400 hidden md:inline">Data Integration & Processing</span>
          </div>
          <div className="flex items-center gap-2 lg:gap-4">
            {selectedCells.length > 0 && (
              <button
                onClick={clearCellSelection}
                className="flex items-center gap-1.5 px-2 py-1 bg-cyan-500/20 text-cyan-400 text-xs rounded-lg hover:bg-cyan-500/30"
              >
                <MousePointer2 size={10} />
                {selectedCells.length} cells
                <X size={10} />
              </button>
            )}
            {compareRows.length > 0 && (
              <button
                onClick={() => setShowCompareModal(true)}
                className="flex items-center gap-1.5 px-2 py-1 bg-purple-500/20 text-purple-400 text-xs rounded-lg hover:bg-purple-500/30"
              >
                <GitCompare size={10} />
                Compare {compareRows.length}
              </button>
            )}
            <div className="hidden lg:flex items-center gap-2 text-xs text-slate-400">
              <Clock size={12} />
              <span>{new Date().toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-1.5 px-2 py-1 bg-green-500/10 border border-green-500/30 rounded-full">
              <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
              <span className="text-[10px] text-green-400 font-medium">LIVE</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content: 3-Panel Layout */}
      <div className="flex h-[calc(100vh-49px)]">
        <MasterDataSection />
        <ProcessingSection />
        <OutputSection />
      </div>
    </div>
  );
}

export default function BackofficeOperations() {
  return (
    <BackofficeProvider>
      <BackofficeContent />
    </BackofficeProvider>
  );
}
