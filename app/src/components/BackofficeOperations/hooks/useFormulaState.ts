import { useState, useCallback } from 'react';
import type { Formula, CellSelection } from '../types';
import { evaluateFormula } from '../utils';

export function useFormulaState(selectedCells: CellSelection[]) {
  const [formulas, setFormulas] = useState<Formula[]>([{ id: 1, name: 'Formula 1', expression: '', result: null }]);
  const [activeFormulaId, setActiveFormulaId] = useState(1);

  const updateFormula = useCallback((id: number, expression: string) => {
    setFormulas(prev => prev.map(f =>
      f.id === id ? { ...f, expression, result: expression ? evaluateFormula(expression, selectedCells) : null } : f
    ));
  }, [selectedCells]);

  const addFormula = useCallback(() => {
    const newId = Math.max(...formulas.map(f => f.id)) + 1;
    setFormulas(prev => [...prev, { id: newId, name: `Formula ${newId}`, expression: '', result: null }]);
    setActiveFormulaId(newId);
  }, [formulas]);

  const removeFormula = useCallback((id: number) => {
    if (formulas.length > 1) {
      setFormulas(prev => prev.filter(f => f.id !== id));
      if (activeFormulaId === id) {
        setActiveFormulaId(formulas[0].id === id ? formulas[1].id : formulas[0].id);
      }
    }
  }, [formulas, activeFormulaId]);

  const insertCellReference = useCallback(() => {
    if (selectedCells.length > 0) {
      const refs = selectedCells.map((_, i) => `{${i}}`).join(' + ');
      const activeFormula = formulas.find(f => f.id === activeFormulaId);
      if (activeFormula) {
        updateFormula(activeFormulaId, activeFormula.expression + refs);
      }
    }
  }, [selectedCells, formulas, activeFormulaId, updateFormula]);

  return {
    formulas, setFormulas,
    activeFormulaId, setActiveFormulaId,
    updateFormula, addFormula, removeFormula, insertCellReference,
  };
}
