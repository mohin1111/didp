import { useState, useEffect } from 'react';
import { X, Link2, Save, Loader2 } from 'lucide-react';
import { useBackoffice } from '../context/BackofficeContext';

export default function RelationshipModal() {
  const {
    showRelationshipModal,
    setShowRelationshipModal,
    editingRelationship,
    setEditingRelationship,
    addRelationship,
    updateRelationship,
    tableDataOverrides,
    masterTables,
  } = useBackoffice();

  const [name, setName] = useState('');
  const [sourceTable, setSourceTable] = useState('');
  const [sourceColumn, setSourceColumn] = useState('');
  const [targetTable, setTargetTable] = useState('');
  const [targetColumn, setTargetColumn] = useState('');
  const [relationType, setRelationType] = useState<'lookup' | 'foreignKey' | 'match'>('match');

  // Get all available tables (master + imported)
  const availableTables = [
    ...Object.keys(masterTables).map(key => ({
      key,
      name: masterTables[key].label,
      columns: masterTables[key].columns,
    })),
    ...Object.keys(tableDataOverrides)
      .filter(key => !masterTables[key])
      .map(key => ({
        key,
        name: key.replace(/_/g, ' '),
        columns: tableDataOverrides[key]?.columns || [],
      })),
  ];

  // Get columns for selected table
  const getColumnsForTable = (tableKey: string) => {
    if (!tableKey) return [];
    const master = masterTables[tableKey];
    if (master) return master.columns;
    const override = tableDataOverrides[tableKey];
    if (override) return override.columns;
    return [];
  };

  const sourceColumns = getColumnsForTable(sourceTable);
  const targetColumns = getColumnsForTable(targetTable);

  useEffect(() => {
    if (editingRelationship) {
      setName(editingRelationship.name || '');
      setSourceTable(editingRelationship.sourceTable);
      setSourceColumn(editingRelationship.sourceColumn);
      setTargetTable(editingRelationship.targetTable);
      setTargetColumn(editingRelationship.targetColumn);
      setRelationType(editingRelationship.type);
    } else {
      setName('');
      setSourceTable('');
      setSourceColumn('');
      setTargetTable('');
      setTargetColumn('');
      setRelationType('match');
    }
  }, [editingRelationship]);

  const [isSaving, setIsSaving] = useState(false);

  if (!showRelationshipModal) return null;

  const handleClose = () => {
    setShowRelationshipModal(false);
    setEditingRelationship(null);
  };

  const handleSave = async () => {
    if (!sourceTable || !sourceColumn || !targetTable || !targetColumn) return;

    setIsSaving(true);
    try {
      if (editingRelationship) {
        await updateRelationship(editingRelationship.id, {
          name: name.trim() || undefined,
          sourceTable,
          sourceColumn,
          targetTable,
          targetColumn,
          type: relationType,
        });
      } else {
        await addRelationship({
          name: name.trim() || undefined,
          sourceTable,
          sourceColumn,
          targetTable,
          targetColumn,
          type: relationType,
        });
      }
      handleClose();
    } catch (error) {
      console.error('Error saving relationship:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const isValid = sourceTable && sourceColumn && targetTable && targetColumn;

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 rounded-xl border border-slate-700 w-full max-w-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-500/20 rounded-lg">
              <Link2 size={20} className="text-purple-400" />
            </div>
            <div>
              <h2 className="font-semibold text-white text-lg">
                {editingRelationship ? 'Edit Relationship' : 'Create Relationship'}
              </h2>
              <p className="text-xs text-slate-500">
                Link columns between two tables
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
          >
            <X size={20} className="text-slate-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Relationship Name */}
          <div>
            <label className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-1 block">
              Relationship Name (Optional)
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Trade to Script Master Link"
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-purple-500"
            />
          </div>

          {/* Relationship Type */}
          <div>
            <label className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-2 block">
              Relationship Type
            </label>
            <div className="flex gap-2">
              {(['match', 'lookup', 'foreignKey'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setRelationType(type)}
                  className={`flex-1 px-3 py-2 rounded-lg text-sm transition-colors ${
                    relationType === type
                      ? 'bg-purple-500/20 text-purple-400 border border-purple-500/40'
                      : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                  }`}
                >
                  {type === 'match' && 'Match'}
                  {type === 'lookup' && 'Lookup'}
                  {type === 'foreignKey' && 'Foreign Key'}
                </button>
              ))}
            </div>
          </div>

          {/* Source and Target Tables */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="text-xs font-medium text-slate-400 uppercase tracking-wide text-center pb-2 border-b border-slate-700">
                Source Table
              </div>
              <div>
                <label className="text-xs text-slate-500 mb-1 block">Table</label>
                <select
                  value={sourceTable}
                  onChange={(e) => {
                    setSourceTable(e.target.value);
                    setSourceColumn('');
                  }}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500"
                >
                  <option value="">Select table...</option>
                  {availableTables.map((t) => (
                    <option key={t.key} value={t.key}>{t.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs text-slate-500 mb-1 block">Column</label>
                <select
                  value={sourceColumn}
                  onChange={(e) => setSourceColumn(e.target.value)}
                  disabled={!sourceTable}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500 disabled:opacity-50"
                >
                  <option value="">Select column...</option>
                  {sourceColumns.map((col, i) => (
                    <option key={i} value={col}>{col}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-3">
              <div className="text-xs font-medium text-slate-400 uppercase tracking-wide text-center pb-2 border-b border-slate-700">
                Target Table
              </div>
              <div>
                <label className="text-xs text-slate-500 mb-1 block">Table</label>
                <select
                  value={targetTable}
                  onChange={(e) => {
                    setTargetTable(e.target.value);
                    setTargetColumn('');
                  }}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500"
                >
                  <option value="">Select table...</option>
                  {availableTables.map((t) => (
                    <option key={t.key} value={t.key}>{t.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs text-slate-500 mb-1 block">Column</label>
                <select
                  value={targetColumn}
                  onChange={(e) => setTargetColumn(e.target.value)}
                  disabled={!targetTable}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500 disabled:opacity-50"
                >
                  <option value="">Select column...</option>
                  {targetColumns.map((col, i) => (
                    <option key={i} value={col}>{col}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Preview */}
          {isValid && (
            <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700">
              <div className="text-xs font-medium text-slate-400 mb-2">Relationship Preview</div>
              <div className="flex items-center gap-2 text-sm font-mono">
                <span className="text-amber-400">{sourceTable}</span>
                <span className="text-slate-500">.</span>
                <span className="text-white">{sourceColumn}</span>
                <span className="text-purple-400 px-2">→</span>
                <span className="text-emerald-400">{targetTable}</span>
                <span className="text-slate-500">.</span>
                <span className="text-white">{targetColumn}</span>
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
            className="px-4 py-2 bg-purple-500 hover:bg-purple-600 disabled:bg-slate-700 disabled:text-slate-500 text-white rounded-lg text-sm font-medium flex items-center gap-2"
          >
            {isSaving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
            {isSaving ? 'Saving...' : editingRelationship ? 'Update Relationship' : 'Create Relationship'}
          </button>
        </div>
      </div>
    </div>
  );
}
