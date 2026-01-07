import type { ExcelFormulaCategory } from '../types';

export const excelFormulas: ExcelFormulaCategory[] = [
  {
    category: 'Math',
    formulas: [
      { name: 'SUM', syntax: 'SUM(a, b, ...)', desc: 'Add all values' },
      { name: 'AVG', syntax: 'AVG(a, b, ...)', desc: 'Calculate average' },
      { name: 'MAX', syntax: 'MAX(a, b, ...)', desc: 'Find maximum value' },
      { name: 'MIN', syntax: 'MIN(a, b, ...)', desc: 'Find minimum value' },
      { name: 'COUNT', syntax: 'COUNT(a, b, ...)', desc: 'Count numeric values' },
      { name: 'ROUND', syntax: 'ROUND(value, decimals)', desc: 'Round to decimals' },
      { name: 'ABS', syntax: 'ABS(value)', desc: 'Absolute value' },
      { name: 'POWER', syntax: 'POWER(base, exp)', desc: 'Power calculation' },
    ]
  },
  {
    category: 'Conditional',
    formulas: [
      { name: 'IF', syntax: 'IF(condition, true_val, false_val)', desc: 'Conditional logic' },
      { name: 'SUMIF', syntax: 'SUMIF(range, criteria)', desc: 'Sum if condition met' },
      { name: 'COUNTIF', syntax: 'COUNTIF(range, criteria)', desc: 'Count if condition met' },
      { name: 'IFERROR', syntax: 'IFERROR(value, error_val)', desc: 'Handle errors' },
    ]
  },
  {
    category: 'Lookup',
    formulas: [
      { name: 'VLOOKUP', syntax: 'VLOOKUP(key, table, col)', desc: 'Vertical lookup' },
      { name: 'HLOOKUP', syntax: 'HLOOKUP(key, table, row)', desc: 'Horizontal lookup' },
      { name: 'INDEX', syntax: 'INDEX(array, row, col)', desc: 'Get value at position' },
      { name: 'MATCH', syntax: 'MATCH(value, range)', desc: 'Find position of value' },
    ]
  },
  {
    category: 'Text',
    formulas: [
      { name: 'CONCAT', syntax: 'CONCAT(a, b, ...)', desc: 'Join text strings' },
      { name: 'LEFT', syntax: 'LEFT(text, chars)', desc: 'Get left characters' },
      { name: 'RIGHT', syntax: 'RIGHT(text, chars)', desc: 'Get right characters' },
      { name: 'LEN', syntax: 'LEN(text)', desc: 'Get text length' },
      { name: 'UPPER', syntax: 'UPPER(text)', desc: 'Convert to uppercase' },
      { name: 'LOWER', syntax: 'LOWER(text)', desc: 'Convert to lowercase' },
      { name: 'TRIM', syntax: 'TRIM(text)', desc: 'Remove extra spaces' },
    ]
  },
  {
    category: 'Date',
    formulas: [
      { name: 'TODAY', syntax: 'TODAY()', desc: 'Current date' },
      { name: 'NOW', syntax: 'NOW()', desc: 'Current date & time' },
      { name: 'DATEDIF', syntax: 'DATEDIF(start, end, unit)', desc: 'Date difference' },
      { name: 'YEAR', syntax: 'YEAR(date)', desc: 'Extract year' },
      { name: 'MONTH', syntax: 'MONTH(date)', desc: 'Extract month' },
      { name: 'DAY', syntax: 'DAY(date)', desc: 'Extract day' },
    ]
  },
  {
    category: 'Financial',
    formulas: [
      { name: 'PV', syntax: 'PV(rate, nper, pmt)', desc: 'Present value' },
      { name: 'FV', syntax: 'FV(rate, nper, pmt)', desc: 'Future value' },
      { name: 'NPV', syntax: 'NPV(rate, values...)', desc: 'Net present value' },
      { name: 'IRR', syntax: 'IRR(values...)', desc: 'Internal rate of return' },
      { name: 'PMT', syntax: 'PMT(rate, nper, pv)', desc: 'Payment calculation' },
    ]
  },
];
