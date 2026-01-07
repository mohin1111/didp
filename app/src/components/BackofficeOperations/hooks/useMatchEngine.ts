import { useState, useCallback, useEffect } from 'react';
import type { MatchConfig, MatchResult, MatchSummary, ValueMapping } from '../types';
import {
  matchConfigsApi,
  matchingApi,
  type MatchConfigResponse,
  type MatchResultResponse,
} from '../api';

// Convert backend match config to frontend type
function toFrontendConfig(backend: MatchConfigResponse): MatchConfig {
  return {
    id: String(backend.id),
    name: backend.name,
    sourceTable: backend.source_table_key,
    targetTable: backend.target_table_key,
    matchColumns: backend.match_columns.map(mc => ({
      sourceColumn: mc.source_column,
      targetColumn: mc.target_column,
      valueMapping: mc.value_mapping_id ? String(mc.value_mapping_id) : undefined,
      caseSensitive: mc.case_sensitive,
    })),
    createdAt: new Date(backend.created_at).getTime(),
  };
}

// Convert backend match result to frontend type
function toFrontendResult(backend: MatchResultResponse): MatchSummary {
  const result: MatchResult = {
    matchedCount: backend.matched_count,
    unmatchedSourceCount: backend.unmatched_source_count,
    unmatchedTargetCount: backend.unmatched_target_count,
    matchedPairs: backend.matched_pairs.map(mp => ({
      sourceRowIndex: mp.source_row_index,
      targetRowIndex: mp.target_row_index,
      sourceRow: mp.source_row,
      targetRow: mp.target_row,
    })),
    unmatchedSource: backend.unmatched_source.map(us => ({
      rowIndex: us.row_index,
      row: us.row,
    })),
    unmatchedTarget: backend.unmatched_target.map(ut => ({
      rowIndex: ut.row_index,
      row: ut.row,
    })),
  };

  return {
    configId: String(backend.config_id),
    configName: backend.config_name,
    sourceTable: backend.source_table_key,
    targetTable: backend.target_table_key,
    runAt: new Date(backend.created_at).getTime(),
    result,
  };
}

export function useMatchEngine(
  tableDataOverrides: Record<string, { columns: string[]; data: string[][] }>,
  _valueMappings: ValueMapping[],
  _applyValueMapping: (mappingId: string, value: string) => string
) {
  const [matchConfigs, setMatchConfigs] = useState<MatchConfig[]>([]);
  const [matchResults, setMatchResults] = useState<MatchSummary[]>([]);
  const [isMatching, setIsMatching] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showMatchConfigModal, setShowMatchConfigModal] = useState(false);
  const [editingMatchConfig, setEditingMatchConfig] = useState<MatchConfig | null>(null);
  const [activeMatchResult, setActiveMatchResult] = useState<MatchSummary | null>(null);

  // Load match configs from backend
  const loadMatchConfigs = useCallback(async () => {
    try {
      const configs = await matchConfigsApi.list();
      setMatchConfigs(configs.map(toFrontendConfig));
    } catch (error) {
      console.error('Error loading match configs:', error);
    }
  }, []);

  // Load match results from backend
  const loadMatchResults = useCallback(async () => {
    try {
      const results = await matchingApi.listResults(undefined, 20);
      setMatchResults(results.map(toFrontendResult));
    } catch (error) {
      console.error('Error loading match results:', error);
    }
  }, []);

  // Initial load
  useEffect(() => {
    setIsLoading(true);
    Promise.all([loadMatchConfigs(), loadMatchResults()])
      .finally(() => setIsLoading(false));
  }, [loadMatchConfigs, loadMatchResults]);

  // Get data for a table
  const getTableData = useCallback((tableKey: string): { columns: string[]; data: string[][] } | null => {
    return tableDataOverrides[tableKey] || null;
  }, [tableDataOverrides]);

  // Run a match config via backend
  const runMatch = useCallback(async (config: MatchConfig) => {
    setIsMatching(true);

    try {
      const configId = parseInt(config.id, 10);
      const result = await matchingApi.execute(configId);
      const summary = toFrontendResult(result);

      setMatchResults(prev => [summary, ...prev.slice(0, 19)]); // Keep last 20 results
      setActiveMatchResult(summary);
    } catch (error) {
      console.error('Error executing match:', error);
    } finally {
      setIsMatching(false);
    }
  }, []);

  // Add a new match config via backend
  const addMatchConfig = useCallback(async (config: Omit<MatchConfig, 'id' | 'createdAt'>): Promise<MatchConfig> => {
    try {
      const backendConfig = await matchConfigsApi.create({
        name: config.name,
        source_table_key: config.sourceTable,
        target_table_key: config.targetTable,
        match_columns: config.matchColumns.map(mc => ({
          source_column: mc.sourceColumn,
          target_column: mc.targetColumn,
          value_mapping_id: mc.valueMapping ? parseInt(mc.valueMapping, 10) : undefined,
          case_sensitive: mc.caseSensitive ?? false,
        })),
      });

      const newConfig = toFrontendConfig(backendConfig);
      setMatchConfigs(prev => [...prev, newConfig]);
      return newConfig;
    } catch (error) {
      console.error('Error creating match config:', error);
      throw error;
    }
  }, []);

  // Update a match config via backend
  const updateMatchConfig = useCallback(async (id: string, updates: Partial<MatchConfig>) => {
    try {
      const configId = parseInt(id, 10);
      const updateData: Parameters<typeof matchConfigsApi.update>[1] = {};

      if (updates.name) updateData.name = updates.name;
      if (updates.matchColumns) {
        updateData.match_columns = updates.matchColumns.map(mc => ({
          source_column: mc.sourceColumn,
          target_column: mc.targetColumn,
          value_mapping_id: mc.valueMapping ? parseInt(mc.valueMapping, 10) : undefined,
          case_sensitive: mc.caseSensitive ?? false,
        }));
      }

      const backendConfig = await matchConfigsApi.update(configId, updateData);
      const updatedConfig = toFrontendConfig(backendConfig);

      setMatchConfigs(prev =>
        prev.map(config => config.id === id ? updatedConfig : config)
      );
    } catch (error) {
      console.error('Error updating match config:', error);
      throw error;
    }
  }, []);

  // Delete a match config via backend
  const deleteMatchConfig = useCallback(async (id: string) => {
    try {
      const configId = parseInt(id, 10);
      await matchConfigsApi.delete(configId);
      setMatchConfigs(prev => prev.filter(config => config.id !== id));
    } catch (error) {
      console.error('Error deleting match config:', error);
      throw error;
    }
  }, []);

  // Open modal to create new match config
  const openNewMatchConfig = useCallback(() => {
    setEditingMatchConfig(null);
    setShowMatchConfigModal(true);
  }, []);

  // Open modal to edit match config
  const openEditMatchConfig = useCallback((config: MatchConfig) => {
    setEditingMatchConfig(config);
    setShowMatchConfigModal(true);
  }, []);

  return {
    matchConfigs,
    setMatchConfigs,
    matchResults,
    setMatchResults,
    isMatching,
    isLoading,
    activeMatchResult,
    setActiveMatchResult,
    showMatchConfigModal,
    setShowMatchConfigModal,
    editingMatchConfig,
    setEditingMatchConfig,
    runMatch,
    addMatchConfig,
    updateMatchConfig,
    deleteMatchConfig,
    openNewMatchConfig,
    openEditMatchConfig,
    getTableData,
    loadMatchConfigs,
    loadMatchResults,
  };
}
