import { useState, useCallback, useMemo } from 'react';
import type { DateRange, TableDataOverrides } from '../types';
import { masterTables } from '../data';

export function useTableState() {
  const [selectedDate, setSelectedDate] = useState<DateRange>({ from: '2026-01-06', to: '2026-01-07' });
  const [selectedTables, setSelectedTables] = useState<string[]>(['dayTrade']);
  const [expandedTable, setExpandedTable] = useState<string | null>('dayTrade');
  const [tableDataOverrides, setTableDataOverrides] = useState<TableDataOverrides>({});

  const toggleTable = useCallback((key: string) => {
    setSelectedTables(prev =>
      prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
    );
  }, []);

  const tablesByCategory = useMemo(() => {
    const grouped: Record<string, string[]> = {};
    Object.entries(masterTables).forEach(([key, table]) => {
      const cat = table.category || 'Other';
      if (!grouped[cat]) grouped[cat] = [];
      grouped[cat].push(key);
    });
    Object.keys(tableDataOverrides).filter(k => !masterTables[k]).forEach(key => {
      if (!grouped['Imported']) grouped['Imported'] = [];
      grouped['Imported'].push(key);
    });
    return grouped;
  }, [tableDataOverrides]);

  return {
    selectedDate, setSelectedDate,
    selectedTables, setSelectedTables, toggleTable,
    expandedTable, setExpandedTable,
    tableDataOverrides, setTableDataOverrides,
    tablesByCategory,
  };
}
