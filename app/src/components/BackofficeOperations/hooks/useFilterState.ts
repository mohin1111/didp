import { useState, useCallback } from 'react';

export function useFilterState() {
  const [columnFilters, setColumnFilters] = useState<Record<string, Record<number, string>>>({});
  const [showFilters, setShowFilters] = useState<Record<string, boolean>>({});

  const updateColumnFilter = useCallback((tableKey: string, colIndex: number, value: string) => {
    setColumnFilters(prev => ({
      ...prev,
      [tableKey]: { ...prev[tableKey], [colIndex]: value }
    }));
  }, []);

  const clearAllFilters = useCallback((tableKey: string) => {
    setColumnFilters(prev => ({ ...prev, [tableKey]: {} }));
  }, []);

  const toggleFilters = useCallback((tableKey: string) => {
    setShowFilters(prev => ({ ...prev, [tableKey]: !prev[tableKey] }));
  }, []);

  const getActiveFilterCount = useCallback((tableKey: string) => {
    const filters = columnFilters[tableKey] || {};
    return Object.values(filters).filter(v => v).length;
  }, [columnFilters]);

  const getFilteredData = useCallback((tableKey: string, data: string[][]) => {
    const filters = columnFilters[tableKey] || {};
    if (Object.keys(filters).length === 0) return data;
    return data.filter(row =>
      Object.entries(filters).every(([colIdx, filterValue]) => {
        if (!filterValue) return true;
        const cellValue = row[parseInt(colIdx)] || '';
        return cellValue.toLowerCase().includes(filterValue.toLowerCase());
      })
    );
  }, [columnFilters]);

  return {
    columnFilters, setColumnFilters,
    showFilters, setShowFilters,
    updateColumnFilter, clearAllFilters, toggleFilters,
    getActiveFilterCount, getFilteredData,
  };
}
