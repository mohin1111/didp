import { useState } from 'react';
import { Check, X, FunctionSquare, ChevronRight, Search } from 'lucide-react';
import { getSupportedFunctions } from '../../utils/formulaEngine';

interface FormulaBarProps {
  cellRef: string;
  formulaBarValue: string;
  showFormulaHelper: boolean;
  onFormulaChange: (value: string) => void;
  onFormulaSubmit: () => void;
  onFormulaCancel: () => void;
  onToggleHelper: () => void;
  onInsertFunction: (fn: string) => void;
}

const formulaDescriptions: Record<string, string> = {
  SUM: 'Adds all numbers in a range. Example: =SUM(A1:A10)',
  AVERAGE: 'Returns the average of numbers. Example: =AVERAGE(A1:A10)',
  COUNT: 'Counts cells with numbers. Example: =COUNT(A1:A10)',
  COUNTA: 'Counts non-empty cells. Example: =COUNTA(A1:A10)',
  MIN: 'Returns minimum value. Example: =MIN(A1:A10)',
  MAX: 'Returns maximum value. Example: =MAX(A1:A10)',
  ABS: 'Returns absolute value. Example: =ABS(-5)',
  ROUND: 'Rounds to specified decimals. Example: =ROUND(3.14159, 2)',
  FLOOR: 'Rounds down to integer. Example: =FLOOR(3.7)',
  CEILING: 'Rounds up to integer. Example: =CEILING(3.2)',
  SQRT: 'Returns square root. Example: =SQRT(16)',
  POWER: 'Returns number raised to power. Example: =POWER(2, 8)',
  MOD: 'Returns remainder. Example: =MOD(10, 3)',
  IF: 'Conditional logic. Example: =IF(A1>100,"High","Low")',
  AND: 'Returns true if all conditions true. Example: =AND(A1>0,B1>0)',
  OR: 'Returns true if any condition true. Example: =OR(A1>0,B1>0)',
  NOT: 'Reverses logic. Example: =NOT(A1>0)',
  CONCAT: 'Joins text strings. Example: =CONCAT(A1,B1)',
  LEFT: 'Returns leftmost characters. Example: =LEFT(A1,3)',
  RIGHT: 'Returns rightmost characters. Example: =RIGHT(A1,3)',
  MID: 'Returns middle characters. Example: =MID(A1,2,3)',
  LEN: 'Returns text length. Example: =LEN(A1)',
  UPPER: 'Converts to uppercase. Example: =UPPER(A1)',
  LOWER: 'Converts to lowercase. Example: =LOWER(A1)',
  TRIM: 'Removes extra spaces. Example: =TRIM(A1)',
  VLOOKUP: 'Vertical lookup. Example: =VLOOKUP(A1,B1:C10,2)',
  STDEV: 'Standard deviation. Example: =STDEV(A1:A10)',
  VAR: 'Variance. Example: =VAR(A1:A10)',
  TODAY: 'Returns current date. Example: =TODAY()',
  NOW: 'Returns current date/time. Example: =NOW()',
  COUNTIF: 'Counts cells matching criteria. Example: =COUNTIF(A1:A10,"Active")',
  SUMIF: 'Sums cells matching criteria. Example: =SUMIF(A1:A10,">100")',
};

export function FormulaBar({
  cellRef, formulaBarValue, showFormulaHelper,
  onFormulaChange, onFormulaSubmit, onFormulaCancel, onToggleHelper, onInsertFunction
}: FormulaBarProps) {
  const [formulaFilter, setFormulaFilter] = useState('');
  const supportedFunctions = getSupportedFunctions();
  const filteredFunctions = formulaFilter
    ? supportedFunctions.filter(fn => fn.toLowerCase().includes(formulaFilter.toLowerCase()))
    : supportedFunctions;

  const quickExamples = [
    { label: 'Sum Column', formula: '=SUM(A1:A100)' },
    { label: 'Average', formula: '=AVERAGE(B1:B50)' },
    { label: 'Count Values', formula: '=COUNT(C1:C100)' },
    { label: 'If Condition', formula: '=IF(A1>100,"High","Low")' },
  ];

  return (
    <div className="relative">
      <div className="bg-slate-50 border-b border-slate-200 px-4 py-2 flex items-center gap-3">
        <div className="w-16 px-2 py-1 bg-white border border-slate-300 rounded text-sm text-center font-mono text-slate-700">
          {cellRef}
        </div>
        <button
          onClick={onToggleHelper}
          className={`p-1.5 rounded transition-colors ${showFormulaHelper ? 'bg-indigo-100 text-indigo-600' : 'hover:bg-slate-200 text-slate-500'}`}
          title="Formula Helper"
        >
          <FunctionSquare className="w-4 h-4" />
        </button>
        <div className="flex-1 flex items-center gap-2">
          <input
            type="text"
            value={formulaBarValue}
            onChange={(e) => onFormulaChange(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') onFormulaSubmit(); if (e.key === 'Escape') onFormulaCancel(); }}
            placeholder="Enter value or formula (e.g., =SUM(A1:A10))"
            className="flex-1 px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-mono"
          />
          <button onClick={onFormulaSubmit} className="p-1.5 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors" title="Apply (Enter)">
            <Check className="w-4 h-4" />
          </button>
          <button onClick={onFormulaCancel} className="p-1.5 bg-slate-200 hover:bg-slate-300 text-slate-600 rounded-lg transition-colors" title="Cancel (Esc)">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {showFormulaHelper && (
        <div className="absolute top-full left-0 right-0 bg-white border-b border-x border-slate-200 shadow-lg z-50 max-h-80 overflow-hidden flex">
          <div className="w-64 border-r border-slate-200 flex flex-col">
            <div className="p-2 border-b border-slate-100">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-2 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={formulaFilter}
                  onChange={(e) => setFormulaFilter(e.target.value)}
                  placeholder="Search functions..."
                  className="w-full pl-8 pr-3 py-1.5 text-sm border border-slate-200 rounded focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>
            <div className="flex-1 overflow-auto p-2">
              <div className="grid grid-cols-3 gap-1">
                {filteredFunctions.slice(0, 30).map(fn => (
                  <button
                    key={fn}
                    onClick={() => onInsertFunction(fn)}
                    className="px-2 py-1 text-xs font-mono bg-slate-50 hover:bg-indigo-50 hover:text-indigo-600 rounded text-left truncate transition-colors"
                    title={formulaDescriptions[fn] || `${fn} function`}
                  >
                    {fn}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="flex-1 p-3">
            <h4 className="text-xs font-semibold text-slate-500 uppercase mb-2">Quick Examples</h4>
            <div className="space-y-1">
              {quickExamples.map((ex, i) => (
                <button
                  key={i}
                  onClick={() => onFormulaChange(ex.formula)}
                  className="w-full flex items-center gap-2 px-2 py-1.5 text-sm hover:bg-slate-50 rounded text-left group"
                >
                  <ChevronRight className="w-3 h-3 text-slate-400 group-hover:text-indigo-500" />
                  <span className="text-slate-600">{ex.label}:</span>
                  <code className="text-xs bg-slate-100 px-1.5 py-0.5 rounded font-mono text-indigo-600">{ex.formula}</code>
                </button>
              ))}
            </div>
            <div className="mt-3 p-2 bg-slate-50 rounded text-xs text-slate-500">
              <strong>Tip:</strong> Start formulas with = sign. Use cell references like A1, B2. Use ranges like A1:A10.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
