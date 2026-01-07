import { useState } from 'react';
import { X, FolderOpen, Bookmark, Star, Play, Trash2, Loader2 } from 'lucide-react';
import { useBackoffice } from '../context/BackofficeContext';
import { processes, colorClasses } from '../data';

export default function LoadProcessModal() {
  const {
    showLoadModal,
    setShowLoadModal,
    savedProcesses,
    loadSavedProcess,
    deleteSavedProcess,
    isProcessesLoading,
  } = useBackoffice();

  const [deletingId, setDeletingId] = useState<number | null>(null);

  if (!showLoadModal) return null;

  const handleDelete = async (id: number) => {
    setDeletingId(id);
    try {
      await deleteSavedProcess(id);
    } catch (error) {
      console.error('Error deleting process:', error);
    } finally {
      setDeletingId(null);
    }
  };

  const handleLoad = (saved: typeof savedProcesses[0]) => {
    loadSavedProcess(saved);
    setShowLoadModal(false);
  };

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-8">
      <div className="bg-slate-900 rounded-xl border border-slate-700 w-full max-w-lg max-h-[80vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <FolderOpen size={20} className="text-blue-400" />
            </div>
            <div>
              <h2 className="font-semibold text-white text-lg">Saved Processes</h2>
              <p className="text-xs text-slate-500">{savedProcesses.length} saved configurations</p>
            </div>
          </div>
          <button
            onClick={() => setShowLoadModal(false)}
            className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
          >
            <X size={20} className="text-slate-400" />
          </button>
        </div>

        <div className="flex-1 p-4 overflow-y-auto space-y-2">
          {isProcessesLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="animate-spin text-slate-500" size={24} />
            </div>
          ) : savedProcesses.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              <Bookmark size={32} className="mx-auto mb-2 opacity-50" />
              <p>No saved processes yet</p>
              <p className="text-xs mt-1">Save your first process configuration</p>
            </div>
          ) : (
            savedProcesses.map((saved) => {
              const process = processes.find(p => p.id === saved.processId);
              const colors = colorClasses[process?.color || 'blue'];
              const isDeleting = deletingId === saved.id;

              return (
                <div
                  key={saved.id}
                  className={`p-3 bg-slate-800/50 hover:bg-slate-800 border border-slate-700 rounded-lg transition-colors group ${isDeleting ? 'opacity-50' : ''}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Star size={14} className="text-yellow-400" />
                        <span className="font-medium">{saved.name}</span>
                      </div>
                      {saved.description && (
                        <p className="text-xs text-slate-500 mb-2">{saved.description}</p>
                      )}
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 ${colors.bg} ${colors.text} text-xs rounded`}>
                          {process?.name}
                        </span>
                        <span className="text-xs text-slate-600">Created {saved.createdAt}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleLoad(saved)}
                        disabled={isDeleting}
                        className="p-1.5 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded disabled:opacity-50"
                        title="Load this process"
                      >
                        <Play size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(saved.id)}
                        disabled={isDeleting}
                        className="p-1.5 hover:bg-red-500/20 text-slate-500 hover:text-red-400 rounded disabled:opacity-50"
                        title="Delete"
                      >
                        {isDeleting ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="flex justify-end p-4 border-t border-slate-700">
          <button
            onClick={() => setShowLoadModal(false)}
            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
