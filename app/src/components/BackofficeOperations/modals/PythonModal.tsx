import { X, Copy, FileCode, Play, PlayCircle } from 'lucide-react';
import { useBackoffice } from '../context/BackofficeContext';

export default function PythonModal() {
  const {
    showPythonModal,
    setShowPythonModal,
    customScript,
    setCustomScript,
    pythonOutput,
    pythonError,
    executePythonScript,
  } = useBackoffice();

  if (!showPythonModal) return null;

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-8">
      <div className="bg-slate-900 rounded-xl border border-slate-700 w-full max-w-5xl h-[85vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-500/20 rounded-lg">
              <FileCode size={20} className="text-yellow-400" />
            </div>
            <div>
              <h2 className="font-semibold text-white text-lg">Python Script Editor</h2>
              <p className="text-xs text-slate-500">Write and execute Python code on your data</p>
            </div>
          </div>
          <button
            onClick={() => setShowPythonModal(false)}
            className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
          >
            <X size={20} className="text-slate-400" />
          </button>
        </div>

        <div className="flex-1 flex overflow-hidden">
          {/* Editor Panel */}
          <div className="w-1/2 flex flex-col border-r border-slate-700">
            <div className="flex items-center justify-between px-4 py-2 bg-slate-800/50 border-b border-slate-700">
              <span className="text-xs text-slate-400 font-medium">script.py</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => navigator.clipboard.writeText(customScript)}
                  className="p-1.5 hover:bg-slate-700 rounded"
                  title="Copy"
                >
                  <Copy size={14} className="text-slate-400" />
                </button>
              </div>
            </div>
            <textarea
              value={customScript}
              onChange={(e) => setCustomScript(e.target.value)}
              className="flex-1 bg-slate-950 p-4 text-xs font-mono text-green-400 resize-none focus:outline-none"
              spellCheck={false}
            />
          </div>

          {/* Output Panel */}
          <div className="w-1/2 flex flex-col">
            <div className="flex items-center justify-between px-4 py-2 bg-slate-800/50 border-b border-slate-700">
              <span className="text-xs text-slate-400 font-medium">Output</span>
              {pythonOutput && (
                <span className="text-xs text-green-400">Executed successfully</span>
              )}
            </div>
            <div className="flex-1 bg-slate-950 p-4 overflow-auto">
              {pythonError ? (
                <pre className="text-xs font-mono text-red-400">{pythonError}</pre>
              ) : pythonOutput ? (
                <pre className="text-xs font-mono text-slate-300 whitespace-pre-wrap">{pythonOutput}</pre>
              ) : (
                <div className="text-center text-slate-500 py-8">
                  <PlayCircle size={32} className="mx-auto mb-2 opacity-50" />
                  <p>Click "Run Script" to execute</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between p-4 border-t border-slate-700 bg-slate-800/50">
          <div className="flex items-center gap-4 text-xs text-slate-500">
            <span>Available: pandas, numpy, datetime</span>
            <span>&bull;</span>
            <span>Data: master_data['trades'], master_data['settlements'], ...</span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowPythonModal(false)}
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm"
            >
              Close
            </button>
            <button
              onClick={executePythonScript}
              className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-black rounded-lg text-sm font-medium flex items-center gap-2"
            >
              <Play size={14} />
              Run Script
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
