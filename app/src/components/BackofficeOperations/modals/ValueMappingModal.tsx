import { useState, useEffect } from 'react';
import { X, Plus, Trash2, ArrowRight, Save, Loader2 } from 'lucide-react';
import { useBackoffice } from '../context/BackofficeContext';

export default function ValueMappingModal() {
  const {
    showValueMappingModal,
    setShowValueMappingModal,
    editingValueMapping,
    setEditingValueMapping,
    addValueMapping,
    updateValueMapping,
  } = useBackoffice();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [mappings, setMappings] = useState<Array<{ from: string; to: string }>>([
    { from: '', to: '' },
  ]);

  useEffect(() => {
    if (editingValueMapping) {
      setName(editingValueMapping.name);
      setDescription(editingValueMapping.description || '');
      setMappings(
        Object.entries(editingValueMapping.mappings).map(([from, to]) => ({ from, to }))
      );
    } else {
      setName('');
      setDescription('');
      setMappings([{ from: '', to: '' }]);
    }
  }, [editingValueMapping]);

  const [isSaving, setIsSaving] = useState(false);

  if (!showValueMappingModal) return null;

  const handleClose = () => {
    setShowValueMappingModal(false);
    setEditingValueMapping(null);
  };

  const handleAddMapping = () => {
    setMappings([...mappings, { from: '', to: '' }]);
  };

  const handleRemoveMapping = (index: number) => {
    if (mappings.length > 1) {
      setMappings(mappings.filter((_, i) => i !== index));
    }
  };

  const handleMappingChange = (index: number, field: 'from' | 'to', value: string) => {
    const updated = [...mappings];
    updated[index][field] = value;
    setMappings(updated);
  };

  const handleSave = async () => {
    if (!name.trim()) return;

    const validMappings = mappings.filter(m => m.from.trim() && m.to.trim());
    if (validMappings.length === 0) return;

    const mappingsRecord = validMappings.reduce((acc, { from, to }) => {
      acc[from.trim()] = to.trim();
      return acc;
    }, {} as Record<string, string>);

    setIsSaving(true);
    try {
      if (editingValueMapping) {
        await updateValueMapping(editingValueMapping.id, {
          name: name.trim(),
          description: description.trim() || undefined,
          mappings: mappingsRecord,
        });
      } else {
        await addValueMapping({
          name: name.trim(),
          description: description.trim() || undefined,
          mappings: mappingsRecord,
        });
      }
      handleClose();
    } catch (error) {
      console.error('Error saving value mapping:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const isValid = name.trim() && mappings.some(m => m.from.trim() && m.to.trim());

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 rounded-xl border border-slate-700 w-full max-w-2xl max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-700">
          <div>
            <h2 className="font-semibold text-white text-lg">
              {editingValueMapping ? 'Edit Value Mapping' : 'Create Value Mapping'}
            </h2>
            <p className="text-xs text-slate-500">
              Define how values should be transformed between tables
            </p>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
          >
            <X size={20} className="text-slate-400" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Name & Description */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-1 block">
                Mapping Name *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Instrument Type Mapping"
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-1 block">
                Description
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Optional description"
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Mappings */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-medium text-slate-400 uppercase tracking-wide">
                Value Mappings
              </label>
              <button
                onClick={handleAddMapping}
                className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300"
              >
                <Plus size={14} />
                Add Mapping
              </button>
            </div>

            <div className="space-y-2">
              {/* Header */}
              <div className="grid grid-cols-[1fr_auto_1fr_auto] gap-2 text-xs text-slate-500 px-1">
                <span>Source Value</span>
                <span></span>
                <span>Target Value</span>
                <span></span>
              </div>

              {/* Mapping Rows */}
              {mappings.map((mapping, index) => (
                <div key={index} className="grid grid-cols-[1fr_auto_1fr_auto] gap-2 items-center">
                  <input
                    type="text"
                    value={mapping.from}
                    onChange={(e) => handleMappingChange(index, 'from', e.target.value)}
                    placeholder="e.g., FUTIDX"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 font-mono"
                  />
                  <ArrowRight size={16} className="text-slate-600" />
                  <input
                    type="text"
                    value={mapping.to}
                    onChange={(e) => handleMappingChange(index, 'to', e.target.value)}
                    placeholder="e.g., IDF"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 font-mono"
                  />
                  <button
                    onClick={() => handleRemoveMapping(index)}
                    disabled={mappings.length === 1}
                    className="p-2 hover:bg-slate-700 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <Trash2 size={14} className="text-red-400" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Preview */}
          {mappings.some(m => m.from && m.to) && (
            <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700">
              <div className="text-xs font-medium text-slate-400 mb-2">Preview</div>
              <div className="flex flex-wrap gap-2">
                {mappings
                  .filter(m => m.from && m.to)
                  .map((m, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1 px-2 py-1 bg-slate-700 rounded text-xs font-mono"
                    >
                      <span className="text-amber-400">{m.from}</span>
                      <ArrowRight size={10} className="text-slate-500" />
                      <span className="text-emerald-400">{m.to}</span>
                    </span>
                  ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 p-4 border-t border-slate-700 bg-slate-800/50">
          <button
            onClick={handleClose}
            disabled={isSaving}
            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 rounded-lg text-sm"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!isValid || isSaving}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-slate-700 disabled:text-slate-500 text-white rounded-lg text-sm font-medium flex items-center gap-2"
          >
            {isSaving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
            {isSaving ? 'Saving...' : editingValueMapping ? 'Update Mapping' : 'Create Mapping'}
          </button>
        </div>
      </div>
    </div>
  );
}
