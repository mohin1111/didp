import { useState, useCallback, useMemo, useEffect } from 'react';
import type { DateRange, TableDataOverrides, MasterTablesMap } from '../types';
import { tablesApi, type TableSummary, type TableDetail } from '../api';

export function useTableState() {
  const today = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState<DateRange>({ from: today, to: today });
  const [selectedTables, setSelectedTables] = useState<string[]>([]);
  const [expandedTable, setExpandedTable] = useState<string | null>(null);
  const [tableDataOverrides, setTableDataOverrides] = useState<TableDataOverrides>({});
  const [backendTables, setBackendTables] = useState<TableSummary[]>([]);
  const [tableCache, setTableCache] = useState<Record<string, TableDetail>>({});
  const [isLoading, setIsLoading] = useState(false);

  // Fetch tables from backend on mount
  const refreshTables = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await tablesApi.list();
      setBackendTables(response.tables);
    } catch (error) {
      console.error('Error fetching tables:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshTables();
  }, [refreshTables]);

  // Fetch full table data when expanded
  const fetchTableData = useCallback(async (key: string) => {
    if (tableCache[key]) return tableCache[key];

    try {
      const tableDetail = await tablesApi.get(key);
      setTableCache(prev => ({ ...prev, [key]: tableDetail }));
      // Also update tableDataOverrides for compatibility with existing code
      setTableDataOverrides(prev => ({
        ...prev,
        [key]: { columns: tableDetail.columns, data: tableDetail.data }
      }));
      return tableDetail;
    } catch (error) {
      console.error('Error fetching table data:', error);
      return null;
    }
  }, [tableCache]);

  const toggleTable = useCallback((key: string) => {
    setSelectedTables(prev =>
      prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
    );
  }, []);

  // Group tables by category
  const tablesByCategory = useMemo(() => {
    const grouped: Record<string, string[]> = {};

    // Add backend tables
    backendTables.forEach(table => {
      const cat = table.category || 'Other';
      if (!grouped[cat]) grouped[cat] = [];
      if (!grouped[cat].includes(table.key)) {
        grouped[cat].push(table.key);
      }
    });

    return grouped;
  }, [backendTables]);

  // Create masterTables-like structure for compatibility
  const masterTables = useMemo<MasterTablesMap>(() => {
    const tables: MasterTablesMap = {};

    backendTables.forEach(table => {
      const cached = tableCache[table.key];
      tables[table.key] = {
        label: table.name,
        count: table.row_count,
        columns: cached?.columns || [],
        data: cached?.data || [],
        category: table.category || undefined,
      };
    });

    return tables;
  }, [backendTables, tableCache]);

  // Delete table from backend
  const deleteTable = useCallback(async (key: string) => {
    try {
      await tablesApi.delete(key);
      setBackendTables(prev => prev.filter(t => t.key !== key));
      setTableCache(prev => {
        const newCache = { ...prev };
        delete newCache[key];
        return newCache;
      });
      setTableDataOverrides(prev => {
        const newOverrides = { ...prev };
        delete newOverrides[key];
        return newOverrides;
      });
      setSelectedTables(prev => prev.filter(k => k !== key));
      if (expandedTable === key) {
        setExpandedTable(null);
      }
    } catch (error) {
      console.error('Error deleting table:', error);
    }
  }, [expandedTable]);

  return {
    selectedDate, setSelectedDate,
    selectedTables, setSelectedTables, toggleTable,
    expandedTable, setExpandedTable,
    tableDataOverrides, setTableDataOverrides,
    tablesByCategory,
    masterTables,
    backendTables,
    isLoading,
    refreshTables,
    fetchTableData,
    deleteTable,
  };
}
