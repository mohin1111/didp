import { useState } from 'react';
import { X, Bookmark, Save, Loader2 } from 'lucide-react';
import { useBackoffice } from '../context/BackofficeContext';
import { processes } from '../data';

export default function SaveProcessModal() {
  const {
    showSaveModal,
    setShowSaveModal,
    newProcessName,
    setNewProcessName,
    newProcessDescription,
    setNewProcessDescription,
    selectedProcess,
    selectedTables,
    saveCurrentProcess,
  } = useBackoffice();

  const [isSaving, setIsSaving] = useState(false);

  if (!showSaveModal) return null;

  const currentProcess = processes.find(p => p.id === selectedProcess);

  const handleSave = async () => {
    if (!newProcessName.trim()) return;

    setIsSaving(true);
    try {
      await saveCurrentProcess();
      setShowSaveModal(false);
    } catch (error) {
      console.error('Error saving process:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-8">
      <div className="bg-slate-900 rounded-xl border border-slate-700 w-full max-w-md">
        <div className="flex items-center justify-between p-4 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-500/20 rounded-lg">
              <Bookmark size={20} className="text-green-400" />
            </div>
            <div>
              <h2 className="font-semibold text-white text-lg">Save Process</h2>
              <p className="text-xs text-slate-500">Save current configuration for future use</p>
            </div>
          </div>
          <button
            onClick={() => setShowSaveModal(false)}
            disabled={isSaving}
            className="p-2 hover:bg-slate-700 rounded-lg transition-colors disabled:opacity-50"
          >
            <X size={20} className="text-slate-400" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          <div>
            <label className="text-xs text-slate-500 mb-1 block">Process Name *</label>
            <input
              type="text"
              value={newProcessName}
              onChange={(e) => setNewProcessName(e.target.value)}
              placeholder="e.g., Daily Trade Reconciliation"
              disabled={isSaving}
              className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-sm focus:outline-none focus:border-green-500 disabled:opacity-50"
            />
          </div>
          <div>
            <label className="text-xs text-slate-500 mb-1 block">Description</label>
            <textarea
              value={newProcessDescription}
              onChange={(e) => setNewProcessDescription(e.target.value)}
              placeholder="Brief description of this process..."
              rows={3}
              disabled={isSaving}
              className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-sm focus:outline-none focus:border-green-500 resize-none disabled:opacity-50"
            />
          </div>
          <div className="p-3 bg-slate-800/50 rounded-lg border border-slate-700">
            <div className="text-xs text-slate-500 mb-2">Current Configuration</div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded">
                {currentProcess?.name}
              </span>
              <span className="px-2 py-1 bg-slate-700 text-slate-400 text-xs rounded">
                {selectedTables.length} table(s)
              </span>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 p-4 border-t border-slate-700">
          <button
            onClick={() => setShowSaveModal(false)}
            disabled={isSaving}
            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 rounded-lg text-sm"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!newProcessName.trim() || isSaving}
            className="px-4 py-2 bg-green-500 hover:bg-green-600 disabled:bg-slate-700 disabled:text-slate-500 rounded-lg text-sm flex items-center gap-2"
          >
            {isSaving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
            {isSaving ? 'Saving...' : 'Save Process'}
          </button>
        </div>
      </div>
    </div>
  );
}
