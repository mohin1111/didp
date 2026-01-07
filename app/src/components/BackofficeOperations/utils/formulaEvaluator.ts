import { parseNumericValue } from './formatters';
import type { CellSelection } from '../types';

/**
 * Evaluate a formula expression with cell references and built-in functions
 */
export const evaluateFormula = (expression: string, selectedCells: CellSelection[]): string => {
  try {
    // Replace cell references like {0}, {1} with actual values
    let evalExpr = expression;
    selectedCells.forEach((cell, index) => {
      const numValue = parseNumericValue(cell.value);
      evalExpr = evalExpr.replace(new RegExp(`\\{${index}\\}`, 'g'), numValue.toString());
    });

    // Built-in functions
    evalExpr = evalExpr.replace(/SUM\((.*?)\)/gi, (_, args) => {
      const nums = args.split(',').map((n: string) => parseFloat(n.trim()) || 0);
      return nums.reduce((a: number, b: number) => a + b, 0).toString();
    });

    evalExpr = evalExpr.replace(/AVG\((.*?)\)/gi, (_, args) => {
      const nums = args.split(',').map((n: string) => parseFloat(n.trim()) || 0);
      return (nums.reduce((a: number, b: number) => a + b, 0) / nums.length).toString();
    });

    evalExpr = evalExpr.replace(/MAX\((.*?)\)/gi, (_, args) => {
      const nums = args.split(',').map((n: string) => parseFloat(n.trim()) || 0);
      return Math.max(...nums).toString();
    });

    evalExpr = evalExpr.replace(/MIN\((.*?)\)/gi, (_, args) => {
      const nums = args.split(',').map((n: string) => parseFloat(n.trim()) || 0);
      return Math.min(...nums).toString();
    });

    evalExpr = evalExpr.replace(/COUNT\((.*?)\)/gi, (_, args) => {
      const nums = args.split(',').filter((n: string) => !isNaN(parseFloat(n.trim())));
      return nums.length.toString();
    });

    evalExpr = evalExpr.replace(/ABS\((.*?)\)/gi, (_, arg) => {
      return Math.abs(parseFloat(arg.trim()) || 0).toString();
    });

    evalExpr = evalExpr.replace(/ROUND\((.*?),(.*?)\)/gi, (_, value, decimals) => {
      const num = parseFloat(value.trim()) || 0;
      const dec = parseInt(decimals.trim()) || 0;
      return num.toFixed(dec);
    });

    evalExpr = evalExpr.replace(/POWER\((.*?),(.*?)\)/gi, (_, base, exp) => {
      return Math.pow(parseFloat(base.trim()) || 0, parseFloat(exp.trim()) || 0).toString();
    });

    // Safe eval for basic math
    // eslint-disable-next-line no-new-func
    const result = Function('"use strict"; return (' + evalExpr + ')')();
    return typeof result === 'number' ? result.toLocaleString() : String(result);
  } catch {
    return 'Error';
  }
};

/**
 * Create a cell reference string from selected cells
 */
export const createCellReferences = (selectedCells: CellSelection[]): string => {
  return selectedCells.map((_, i) => `{${i}}`).join(' + ');
};
