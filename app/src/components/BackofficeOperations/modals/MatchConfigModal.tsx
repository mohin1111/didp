import { useState, useEffect } from 'react';
import { X, Plus, Trash2, Play, Save, Zap, Loader2 } from 'lucide-react';
import { useBackoffice } from '../context/BackofficeContext';
import type { MatchColumn } from '../types';

export default function MatchConfigModal() {
  const {
    showMatchConfigModal,
    setShowMatchConfigModal,
    editingMatchConfig,
    setEditingMatchConfig,
    addMatchConfig,
    updateMatchConfig,
    runMatch,
    tableDataOverrides,
    masterTables,
    valueMappings,
  } = useBackoffice();

  const [name, setName] = useState('');
  const [sourceTable, setSourceTable] = useState('');
  const [targetTable, setTargetTable] = useState('');
  const [matchColumns, setMatchColumns] = useState<MatchColumn[]>([
    { sourceColumn: '', targetColumn: '', caseSensitive: false },
  ]);

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
    if (editingMatchConfig) {
      setName(editingMatchConfig.name);
      setSourceTable(editingMatchConfig.sourceTable);
      setTargetTable(editingMatchConfig.targetTable);
      setMatchColumns(editingMatchConfig.matchColumns);
    } else {
      setName('');
      setSourceTable('');
      setTargetTable('');
      setMatchColumns([{ sourceColumn: '', targetColumn: '', caseSensitive: false }]);
    }
  }, [editingMatchConfig]);

  if (!showMatchConfigModal) return null;

  const handleClose = () => {
    setShowMatchConfigModal(false);
    setEditingMatchConfig(null);
  };

  const handleAddColumn = () => {
    setMatchColumns([...matchColumns, { sourceColumn: '', targetColumn: '', caseSensitive: false }]);
  };

  const handleRemoveColumn = (index: number) => {
    if (matchColumns.length > 1) {
      setMatchColumns(matchColumns.filter((_, i) => i !== index));
    }
  };

  const handleColumnChange = (index: number, field: keyof MatchColumn, value: string | boolean) => {
    const updated = [...matchColumns];
    updated[index] = { ...updated[index], [field]: value };
    setMatchColumns(updated);
  };

  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!name.trim() || !sourceTable || !targetTable) return;

    const validColumns = matchColumns.filter(mc => mc.sourceColumn && mc.targetColumn);
    if (validColumns.length === 0) return;

    setIsSaving(true);
    try {
      if (editingMatchConfig) {
        await updateMatchConfig(editingMatchConfig.id, {
          name: name.trim(),
          sourceTable,
          targetTable,
          matchColumns: validColumns,
        });
      } else {
        await addMatchConfig({
          name: name.trim(),
          sourceTable,
          targetTable,
          matchColumns: validColumns,
        });
      }
      handleClose();
    } catch (error) {
      console.error('Error saving match config:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveAndRun = async () => {
    if (!name.trim() || !sourceTable || !targetTable) return;

    const validColumns = matchColumns.filter(mc => mc.sourceColumn && mc.targetColumn);
    if (validColumns.length === 0) return;

    setIsSaving(true);
    try {
      let config;
      if (editingMatchConfig) {
        await updateMatchConfig(editingMatchConfig.id, {
          name: name.trim(),
          sourceTable,
          targetTable,
          matchColumns: validColumns,
        });
        config = { ...editingMatchConfig, name: name.trim(), sourceTable, targetTable, matchColumns: validColumns };
      } else {
        config = await addMatchConfig({
          name: name.trim(),
          sourceTable,
          targetTable,
          matchColumns: validColumns,
        });
      }

      await runMatch(config);
      handleClose();
    } catch (error) {
      console.error('Error saving/running match config:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const isValid = name.trim() && sourceTable && targetTable && matchColumns.some(mc => mc.sourceColumn && mc.targetColumn);

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 rounded-xl border border-slate-700 w-full max-w-3xl max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-cyan-500/20 rounded-lg">
              <Zap size={20} className="text-cyan-400" />
            </div>
            <div>
              <h2 className="font-semibold text-white text-lg">
                {editingMatchConfig ? 'Edit Match Configuration' : 'New Match Configuration'}
              </h2>
              <p className="text-xs text-slate-500">
                Define matching rules between two tables
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
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Name */}
          <div>
            <label className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-1 block">
              Configuration Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Trade File to Script Master Match"
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          {/* Source and Target Tables */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-1 block">
                Source Table *
              </label>
              <select
                value={sourceTable}
                onChange={(e) => {
                  setSourceTable(e.target.value);
                  setMatchColumns(mc => mc.map(m => ({ ...m, sourceColumn: '' })));
                }}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
              >
                <option value="">Select source table...</option>
                {availableTables.map((t) => (
                  <option key={t.key} value={t.key}>{t.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-1 block">
                Target Table *
              </label>
              <select
                value={targetTable}
                onChange={(e) => {
                  setTargetTable(e.target.value);
                  setMatchColumns(mc => mc.map(m => ({ ...m, targetColumn: '' })));
                }}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
              >
                <option value="">Select target table...</option>
                {availableTables.map((t) => (
                  <option key={t.key} value={t.key}>{t.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Match Columns */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-medium text-slate-400 uppercase tracking-wide">
                Match Columns *
              </label>
              <button
                onClick={handleAddColumn}
                className="flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300"
              >
                <Plus size={14} />
                Add Column
              </button>
            </div>

            <div className="space-y-2">
              {/* Header */}
              <div className="grid grid-cols-[1fr_1fr_auto_auto_auto] gap-2 text-xs text-slate-500 px-1">
                <span>Source Column</span>
                <span>Target Column</span>
                <span>Mapping</span>
                <span>Case</span>
                <span></span>
              </div>

              {/* Rows */}
              {matchColumns.map((mc, index) => (
                <div key={index} className="grid grid-cols-[1fr_1fr_auto_auto_auto] gap-2 items-center">
                  <select
                    value={mc.sourceColumn}
                    onChange={(e) => handleColumnChange(index, 'sourceColumn', e.target.value)}
                    disabled={!sourceTable}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2 py-1.5 text-sm text-white focus:outline-none focus:border-cyan-500 disabled:opacity-50"
                  >
                    <option value="">Select...</option>
                    {sourceColumns.map((col, i) => (
                      <option key={i} value={col}>{col}</option>
                    ))}
                  </select>
                  <select
                    value={mc.targetColumn}
                    onChange={(e) => handleColumnChange(index, 'targetColumn', e.target.value)}
                    disabled={!targetTable}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2 py-1.5 text-sm text-white focus:outline-none focus:border-cyan-500 disabled:opacity-50"
                  >
                    <option value="">Select...</option>
                    {targetColumns.map((col, i) => (
                      <option key={i} value={col}>{col}</option>
                    ))}
                  </select>
                  <select
                    value={mc.valueMapping || ''}
                    onChange={(e) => handleColumnChange(index, 'valueMapping', e.target.value)}
                    className="w-24 bg-slate-800 border border-slate-700 rounded-lg px-2 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="">None</option>
                    {valueMappings.map((vm) => (
                      <option key={vm.id} value={vm.id}>{vm.name}</option>
                    ))}
                  </select>
                  <label className="flex items-center gap-1 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={mc.caseSensitive || false}
                      onChange={(e) => handleColumnChange(index, 'caseSensitive', e.target.checked)}
                      className="rounded border-slate-600 bg-slate-800 text-cyan-500 focus:ring-cyan-500"
                    />
                    <span className="text-xs text-slate-500">Aa</span>
                  </label>
                  <button
                    onClick={() => handleRemoveColumn(index)}
                    disabled={matchColumns.length === 1}
                    className="p-1.5 hover:bg-slate-700 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <Trash2 size={14} className="text-red-400" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Summary */}
          {sourceTable && targetTable && matchColumns.some(mc => mc.sourceColumn && mc.targetColumn) && (
            <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700">
              <div className="text-xs font-medium text-slate-400 mb-2">Match Summary</div>
              <div className="text-sm text-slate-300">
                Records from <span className="text-amber-400 font-mono">{sourceTable}</span> will be matched to{' '}
                <span className="text-emerald-400 font-mono">{targetTable}</span> using{' '}
                <span className="text-cyan-400">{matchColumns.filter(mc => mc.sourceColumn && mc.targetColumn).length}</span> column(s).
              </div>
              {matchColumns.filter(mc => mc.valueMapping).length > 0 && (
                <div className="text-xs text-slate-500 mt-1">
                  Value mappings will be applied to {matchColumns.filter(mc => mc.valueMapping).length} column(s).
                </div>
              )}
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
            className="px-4 py-2 bg-slate-600 hover:bg-slate-500 disabled:bg-slate-700 disabled:text-slate-500 text-white rounded-lg text-sm font-medium flex items-center gap-2"
          >
            {isSaving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
            {isSaving ? 'Saving...' : 'Save'}
          </button>
          <button
            onClick={handleSaveAndRun}
            disabled={!isValid || isSaving}
            className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 disabled:bg-slate-700 disabled:text-slate-500 text-black rounded-lg text-sm font-medium flex items-center gap-2"
          >
            {isSaving ? <Loader2 size={14} className="animate-spin" /> : <Play size={14} />}
            {isSaving ? 'Processing...' : 'Save & Run Match'}
          </button>
        </div>
      </div>
    </div>
  );
}
