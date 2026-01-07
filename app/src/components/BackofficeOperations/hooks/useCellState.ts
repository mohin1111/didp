import { useState, useCallback } from 'react';
import type { CellSelection, CompareRow } from '../types';

export function useCellState() {
  const [selectedCells, setSelectedCells] = useState<CellSelection[]>([]);
  const [compareRows, setCompareRows] = useState<CompareRow[]>([]);

  const handleCellClick = useCallback((
    tableKey: string,
    rowIdx: number,
    colIdx: number,
    value: string,
    column: string,
    event: React.MouseEvent
  ) => {
    const cellSelection: CellSelection = { tableKey, rowIndex: rowIdx, colIndex: colIdx, value, column };
    if (event.ctrlKey || event.metaKey) {
      setSelectedCells(prev => {
        const exists = prev.some(c => c.tableKey === tableKey && c.rowIndex === rowIdx && c.colIndex === colIdx);
        return exists
          ? prev.filter(c => !(c.tableKey === tableKey && c.rowIndex === rowIdx && c.colIndex === colIdx))
          : [...prev, cellSelection];
      });
    } else {
      setSelectedCells([cellSelection]);
    }
  }, []);

  const isCellSelected = useCallback((tableKey: string, rowIdx: number, colIdx: number) => {
    return selectedCells.some(c => c.tableKey === tableKey && c.rowIndex === rowIdx && c.colIndex === colIdx);
  }, [selectedCells]);

  const clearCellSelection = useCallback(() => setSelectedCells([]), []);

  const toggleRowForCompare = useCallback((tableKey: string, rowIdx: number, data: string[]) => {
    setCompareRows(prev => {
      const exists = prev.some(r => r.tableKey === tableKey && r.rowIndex === rowIdx);
      return exists
        ? prev.filter(r => !(r.tableKey === tableKey && r.rowIndex === rowIdx))
        : [...prev, { tableKey, rowIndex: rowIdx, data }];
    });
  }, []);

  const isRowSelectedForCompare = useCallback((tableKey: string, rowIdx: number) => {
    return compareRows.some(r => r.tableKey === tableKey && r.rowIndex === rowIdx);
  }, [compareRows]);

  return {
    selectedCells, setSelectedCells,
    handleCellClick, isCellSelected, clearCellSelection,
    compareRows, setCompareRows,
    toggleRowForCompare, isRowSelectedForCompare,
  };
}
