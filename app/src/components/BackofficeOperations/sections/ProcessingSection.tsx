import { useBackoffice } from '../context/BackofficeContext';
import { processes, excelFormulas, colorClasses } from '../data';
import {
  Zap, Terminal, Code, Calculator, Play, Download, Link2, Unlink,
  Plus, Trash2, ArrowDown, GitBranch, Maximize2, Bookmark, FolderOpen,
  TableProperties, BarChart3, PlayCircle, Combine, ArrowRightLeft, Settings,
  CheckCircle2, XCircle, AlertCircle
} from 'lucide-react';

export default function ProcessingSection() {
  const {
    processingMode, setProcessingMode,
    selectedProcess, setSelectedProcess,
    isProcessing, processComplete, handleRunProcess,
    chainingEnabled, setChainingEnabled,
    processChain, currentChainStep,
    addToChain, removeFromChain, moveChainStep, updateChainStepProcess,
    setShowSaveModal, setShowLoadModal,
    sqlQuery, setSqlQuery, sqlOutput, setShowSchemaModal, executeSqlQuery,
    customScript, setCustomScript, setShowPythonModal, executePythonScript,
    formulas, activeFormulaId, setActiveFormulaId, updateFormula, addFormula, removeFormula,
    selectedCells, insertCellReference,
    selectedTables, setShowChartModal,
    // Relationship & Matching
    valueMappings,
    openNewValueMapping,
    openEditValueMapping,
    matchConfigs,
    matchResults,
    isMatching,
    activeMatchResult,
    openNewMatchConfig,
    openEditMatchConfig,
    runMatch,
    deleteMatchConfig,
  } = useBackoffice();

  const currentProcess = processes.find(p => p.id === selectedProcess);

  return (
    <div className="w-[36%] border-r border-slate-700 flex flex-col bg-slate-900/30">
      {/* Processing Mode Tabs */}
      <div className="flex border-b border-slate-700 bg-slate-900">
        {[
          { id: 'operations', label: 'Operations', icon: Zap },
          { id: 'matching', label: 'Matching', icon: Combine },
          { id: 'sql', label: 'SQL', icon: Terminal },
          { id: 'python', label: 'Python', icon: Code },
          { id: 'excel', label: 'Excel', icon: Calculator },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setProcessingMode(tab.id as typeof processingMode)}
            className={`flex-1 flex items-center justify-center gap-1.5 px-2 py-2 text-xs transition-colors ${
              processingMode === tab.id
                ? 'bg-slate-800 text-white border-b-2 border-blue-500'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <tab.icon size={12} />
            <span className="hidden lg:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-3">
        {processingMode === 'operations' && (
          <div className="space-y-3">
            {/* Process Selection */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-slate-400">Select Process</span>
                <div className="flex items-center gap-2">
                  <button onClick={() => setShowSaveModal(true)} className="p-1 hover:bg-slate-700 rounded" title="Save"><Bookmark size={12} className="text-slate-400" /></button>
                  <button onClick={() => setShowLoadModal(true)} className="p-1 hover:bg-slate-700 rounded" title="Load"><FolderOpen size={12} className="text-slate-400" /></button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                {processes.slice(0, 8).map(proc => {
                  const colors = colorClasses[proc.color];
                  const Icon = proc.icon;
                  return (
                    <button
                      key={proc.id}
                      onClick={() => setSelectedProcess(proc.id)}
                      className={`p-2 rounded-lg text-left transition-all ${
                        selectedProcess === proc.id
                          ? `${colors.bg} ${colors.border} border`
                          : 'bg-slate-800/50 border border-transparent hover:bg-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-0.5">
                        <Icon size={12} className={selectedProcess === proc.id ? colors.text : 'text-slate-500'} />
                        <span className={`text-[10px] font-medium ${selectedProcess === proc.id ? 'text-white' : 'text-slate-300'}`}>
                          {proc.name}
                        </span>
                      </div>
                      <p className="text-[9px] text-slate-500 line-clamp-1">{proc.description}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Chaining */}
            <div className="bg-slate-800/50 rounded-lg p-2 border border-slate-700">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <GitBranch size={12} className="text-purple-400" />
                  <span className="text-xs font-medium text-slate-300">Process Chaining</span>
                </div>
                <button
                  onClick={() => setChainingEnabled(!chainingEnabled)}
                  className={`p-1 rounded ${chainingEnabled ? 'bg-purple-500/20 text-purple-400' : 'text-slate-500'}`}
                >
                  {chainingEnabled ? <Link2 size={14} /> : <Unlink size={14} />}
                </button>
              </div>
              {chainingEnabled && (
                <div className="space-y-1">
                  {processChain.map((step, idx) => (
                    <div key={step.id} className={`p-2 rounded border ${currentChainStep === idx + 1 ? 'border-green-500 bg-green-500/10' : 'border-slate-600 bg-slate-800/30'}`}>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-slate-500 w-4">{idx + 1}.</span>
                        <select
                          value={step.processId}
                          onChange={(e) => updateChainStepProcess(step.id, e.target.value)}
                          className="flex-1 bg-slate-700 border-none rounded px-2 py-1 text-xs"
                        >
                          {processes.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                        </select>
                        <button onClick={() => moveChainStep(idx, 'up')} disabled={idx === 0} className="p-1 text-slate-500 hover:text-white disabled:opacity-30">
                          <ArrowDown size={10} className="rotate-180" />
                        </button>
                        <button onClick={() => moveChainStep(idx, 'down')} disabled={idx === processChain.length - 1} className="p-1 text-slate-500 hover:text-white disabled:opacity-30">
                          <ArrowDown size={10} />
                        </button>
                        <button onClick={() => removeFromChain(step.id)} disabled={processChain.length <= 1} className="p-1 text-slate-500 hover:text-red-400 disabled:opacity-30">
                          <Trash2 size={10} />
                        </button>
                      </div>
                    </div>
                  ))}
                  <button onClick={() => addToChain('eodProcess')} className="w-full p-2 border border-dashed border-slate-600 rounded text-xs text-slate-500 hover:text-white hover:border-slate-500 flex items-center justify-center gap-1">
                    <Plus size={12} />Add Step
                  </button>
                </div>
              )}
            </div>

            {/* Run Button */}
            <button
              onClick={handleRunProcess}
              disabled={isProcessing || selectedTables.length === 0}
              className={`w-full py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-all ${
                isProcessing
                  ? 'bg-blue-500/50 cursor-not-allowed'
                  : processComplete
                  ? 'bg-green-500 hover:bg-green-600'
                  : 'bg-blue-500 hover:bg-blue-600'
              }`}
            >
              {isProcessing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Processing...
                </>
              ) : processComplete ? (
                <>
                  <Download size={16} />
                  Complete - Download Results
                </>
              ) : (
                <>
                  <Play size={16} />
                  Run {currentProcess?.name || 'Process'}
                </>
              )}
            </button>
          </div>
        )}

        {processingMode === 'matching' && (
          <div className="space-y-3">
            {/* Value Mappings */}
            <div className="bg-slate-800/50 rounded-lg p-2 border border-slate-700">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <ArrowRightLeft size={12} className="text-amber-400" />
                  <span className="text-xs font-medium text-slate-300">Value Mappings</span>
                </div>
                <button
                  onClick={openNewValueMapping}
                  className="p-1 hover:bg-slate-700 rounded text-slate-400 hover:text-white"
                  title="Add Mapping"
                >
                  <Plus size={14} />
                </button>
              </div>
              {valueMappings.length === 0 ? (
                <p className="text-xs text-slate-500 text-center py-2">No value mappings defined</p>
              ) : (
                <div className="space-y-1">
                  {valueMappings.map(vm => (
                    <button
                      key={vm.id}
                      onClick={() => openEditValueMapping(vm)}
                      className="w-full text-left p-2 bg-slate-800 hover:bg-slate-700 rounded text-xs flex items-center justify-between"
                    >
                      <span className="text-white">{vm.name}</span>
                      <span className="text-slate-500">{Object.keys(vm.mappings).length} rules</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Match Configurations */}
            <div className="bg-slate-800/50 rounded-lg p-2 border border-slate-700">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Combine size={12} className="text-cyan-400" />
                  <span className="text-xs font-medium text-slate-300">Match Configurations</span>
                </div>
                <button
                  onClick={openNewMatchConfig}
                  className="p-1 hover:bg-slate-700 rounded text-slate-400 hover:text-white"
                  title="New Match Config"
                >
                  <Plus size={14} />
                </button>
              </div>
              {matchConfigs.length === 0 ? (
                <div className="text-center py-4">
                  <p className="text-xs text-slate-500 mb-2">No match configurations</p>
                  <button
                    onClick={openNewMatchConfig}
                    className="px-3 py-1.5 bg-cyan-500/20 text-cyan-400 rounded text-xs hover:bg-cyan-500/30"
                  >
                    Create First Match
                  </button>
                </div>
              ) : (
                <div className="space-y-1">
                  {matchConfigs.map(config => (
                    <div
                      key={config.id}
                      className="p-2 bg-slate-800 rounded border border-slate-700 hover:border-slate-600"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-white font-medium">{config.name}</span>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => openEditMatchConfig(config)}
                            className="p-1 hover:bg-slate-700 rounded text-slate-400 hover:text-white"
                          >
                            <Settings size={12} />
                          </button>
                          <button
                            onClick={() => runMatch(config)}
                            disabled={isMatching}
                            className="p-1 hover:bg-slate-700 rounded text-cyan-400 hover:text-cyan-300 disabled:opacity-50"
                          >
                            <Play size={12} />
                          </button>
                          <button
                            onClick={() => deleteMatchConfig(config.id)}
                            className="p-1 hover:bg-slate-700 rounded text-slate-400 hover:text-red-400"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>
                      <div className="text-[10px] text-slate-500">
                        {config.sourceTable} → {config.targetTable}
                      </div>
                      <div className="text-[10px] text-slate-600">
                        {config.matchColumns.length} column(s)
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Active Match Result */}
            {activeMatchResult && (
              <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-slate-300">Match Results</span>
                  <span className="text-[10px] text-slate-500">
                    {new Date(activeMatchResult.runAt).toLocaleTimeString()}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 mb-2">
                  <div className="text-center p-2 bg-green-500/10 rounded border border-green-500/30">
                    <div className="flex items-center justify-center gap-1 text-green-400 mb-1">
                      <CheckCircle2 size={12} />
                    </div>
                    <div className="text-lg font-bold text-green-400">
                      {activeMatchResult.result.matchedCount}
                    </div>
                    <div className="text-[10px] text-slate-500">Matched</div>
                  </div>
                  <div className="text-center p-2 bg-amber-500/10 rounded border border-amber-500/30">
                    <div className="flex items-center justify-center gap-1 text-amber-400 mb-1">
                      <AlertCircle size={12} />
                    </div>
                    <div className="text-lg font-bold text-amber-400">
                      {activeMatchResult.result.unmatchedSourceCount}
                    </div>
                    <div className="text-[10px] text-slate-500">Unmatched Src</div>
                  </div>
                  <div className="text-center p-2 bg-red-500/10 rounded border border-red-500/30">
                    <div className="flex items-center justify-center gap-1 text-red-400 mb-1">
                      <XCircle size={12} />
                    </div>
                    <div className="text-lg font-bold text-red-400">
                      {activeMatchResult.result.unmatchedTargetCount}
                    </div>
                    <div className="text-[10px] text-slate-500">Unmatched Tgt</div>
                  </div>
                </div>
                <div className="text-[10px] text-slate-500">
                  {activeMatchResult.sourceTable} ↔ {activeMatchResult.targetTable}
                </div>
              </div>
            )}

            {/* Match History */}
            {matchResults.length > 1 && (
              <div className="bg-slate-800/50 rounded-lg p-2 border border-slate-700">
                <span className="text-xs font-medium text-slate-400 mb-2 block">Recent Matches</span>
                <div className="space-y-1 max-h-32 overflow-y-auto">
                  {matchResults.slice(1, 5).map((result, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-1.5 bg-slate-800 rounded text-xs"
                    >
                      <span className="text-slate-400">{result.configName}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-green-400">{result.result.matchedCount}</span>
                        <span className="text-slate-500">/</span>
                        <span className="text-amber-400">{result.result.unmatchedSourceCount}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {processingMode === 'sql' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-400">SQL Query Editor</span>
              <button onClick={() => setShowSchemaModal(true)} className="flex items-center gap-1 px-2 py-1 bg-slate-700 hover:bg-slate-600 rounded text-xs">
                <TableProperties size={12} />Schema
              </button>
            </div>
            <textarea
              value={sqlQuery}
              onChange={(e) => setSqlQuery(e.target.value)}
              className="w-full h-40 bg-slate-900 border border-slate-700 rounded-lg p-3 text-xs font-mono text-green-400 resize-none focus:outline-none focus:border-blue-500"
              spellCheck={false}
            />
            <div className="flex gap-2">
              <button onClick={executeSqlQuery} className="flex-1 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg text-sm font-medium flex items-center justify-center gap-2">
                <Play size={14} />Execute
              </button>
              {sqlOutput.length > 0 && (
                <button onClick={() => setShowChartModal(true)} className="px-4 py-2 bg-orange-500 hover:bg-orange-600 rounded-lg text-sm flex items-center gap-2">
                  <BarChart3 size={14} />Chart
                </button>
              )}
            </div>
          </div>
        )}

        {processingMode === 'python' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-400">Python Script</span>
              <button onClick={() => setShowPythonModal(true)} className="flex items-center gap-1 px-2 py-1 bg-slate-700 hover:bg-slate-600 rounded text-xs">
                <Maximize2 size={12} />Full Editor
              </button>
            </div>
            <textarea
              value={customScript}
              onChange={(e) => setCustomScript(e.target.value)}
              className="w-full h-48 bg-slate-900 border border-slate-700 rounded-lg p-3 text-xs font-mono text-green-400 resize-none focus:outline-none focus:border-blue-500"
              spellCheck={false}
            />
            <button onClick={executePythonScript} className="w-full py-2 bg-yellow-500 hover:bg-yellow-600 text-black rounded-lg text-sm font-medium flex items-center justify-center gap-2">
              <PlayCircle size={14} />Run Script
            </button>
          </div>
        )}

        {processingMode === 'excel' && (
          <div className="space-y-3">
            <span className="text-xs font-medium text-slate-400">Excel Formula Builder</span>
            {/* Formula reference */}
            <div className="bg-slate-800/50 rounded-lg p-2 border border-slate-700 max-h-[200px] overflow-y-auto">
              {excelFormulas.map(cat => (
                <div key={cat.category} className="mb-2">
                  <div className="text-[10px] text-slate-500 font-medium mb-1">{cat.category}</div>
                  <div className="grid grid-cols-2 gap-1">
                    {cat.formulas.map(f => (
                      <button key={f.name} onClick={() => updateFormula(activeFormulaId, formulas.find(ff => ff.id === activeFormulaId)?.expression + f.name + '()')} className="text-left p-1.5 bg-slate-800 hover:bg-slate-700 rounded text-xs">
                        <span className="text-blue-400 font-mono">{f.name}</span>
                        <span className="text-slate-500 text-[9px] block">{f.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            {/* Cell references */}
            {selectedCells.length > 0 && (
              <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-2">
                <div className="text-[10px] text-cyan-400 mb-1">Selected Cells:</div>
                <div className="flex flex-wrap gap-1">
                  {selectedCells.map((cell, i) => (
                    <span key={i} className="px-1.5 py-0.5 bg-cyan-500/20 text-cyan-300 rounded text-[10px] font-mono">
                      {`{${i}}`}: {cell.value}
                    </span>
                  ))}
                </div>
                <button onClick={insertCellReference} className="mt-2 w-full py-1.5 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 rounded text-xs">
                  Insert Cell References
                </button>
              </div>
            )}
            {/* Formula input */}
            <div className="space-y-2">
              {formulas.map(f => (
                <div key={f.id} className={`p-2 rounded-lg border ${activeFormulaId === f.id ? 'border-blue-500 bg-blue-500/10' : 'border-slate-700 bg-slate-800/50'}`}>
                  <div className="flex items-center justify-between mb-1">
                    <button onClick={() => setActiveFormulaId(f.id)} className="text-xs font-medium">{f.name}</button>
                    {formulas.length > 1 && <button onClick={() => removeFormula(f.id)} className="text-slate-500 hover:text-red-400"><Trash2 size={10} /></button>}
                  </div>
                  <input
                    type="text"
                    value={f.expression}
                    onChange={(e) => updateFormula(f.id, e.target.value)}
                    placeholder="Enter formula..."
                    className="w-full bg-slate-900 border border-slate-600 rounded px-2 py-1 text-xs font-mono focus:outline-none focus:border-blue-500"
                  />
                  {f.result !== null && (
                    <div className="mt-1 text-xs text-green-400 font-mono">= {f.result}</div>
                  )}
                </div>
              ))}
              <button onClick={addFormula} className="w-full py-2 border border-dashed border-slate-600 rounded-lg text-xs text-slate-500 hover:text-white flex items-center justify-center gap-1">
                <Plus size={12} />Add Formula
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
