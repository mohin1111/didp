/**
 * Excel Formula Parser
 * Tokenizes and parses formulas
 */

import { FUNCTIONS, type CellValueGetter } from './functions';

// Patterns
const CELL_REF_PATTERN = /^([A-Z]+)(\d+)$/;
const RANGE_PATTERN = /^([A-Z]+)(\d+):([A-Z]+)(\d+)$/;

export function columnToIndex(col: string): number {
  let result = 0;
  for (let i = 0; i < col.length; i++) {
    result = result * 26 + (col.charCodeAt(i) - 64);
  }
  return result - 1;
}

export function indexToColumn(index: number): string {
  let result = '';
  index++;
  while (index > 0) {
    const remainder = (index - 1) % 26;
    result = String.fromCharCode(65 + remainder) + result;
    index = Math.floor((index - 1) / 26);
  }
  return result;
}

export function parseCellRef(ref: string): { col: number; row: number } | null {
  const match = ref.toUpperCase().match(CELL_REF_PATTERN);
  if (!match) return null;
  return { col: columnToIndex(match[1]), row: parseInt(match[2], 10) - 1 };
}

export function parseRange(range: string): { col: number; row: number }[] | null {
  const match = range.toUpperCase().match(RANGE_PATTERN);
  if (!match) return null;
  const startCol = columnToIndex(match[1]);
  const startRow = parseInt(match[2], 10) - 1;
  const endCol = columnToIndex(match[3]);
  const endRow = parseInt(match[4], 10) - 1;
  const cells: { col: number; row: number }[] = [];
  for (let row = Math.min(startRow, endRow); row <= Math.max(startRow, endRow); row++) {
    for (let col = Math.min(startCol, endCol); col <= Math.max(startCol, endCol); col++) {
      cells.push({ col, row });
    }
  }
  return cells;
}

export function tokenize(formula: string): string[] {
  const tokens: string[] = [];
  let current = '';
  let inString = false;
  let stringChar = '';

  for (let i = 0; i < formula.length; i++) {
    const char = formula[i];
    if (inString) {
      current += char;
      if (char === stringChar) { tokens.push(current); current = ''; inString = false; }
      continue;
    }
    if (char === '"' || char === "'") {
      if (current) tokens.push(current);
      current = char; inString = true; stringChar = char;
      continue;
    }
    if ('+-*/^%(),:<>=!&|'.includes(char)) {
      if (current) tokens.push(current);
      if (i + 1 < formula.length) {
        const next = formula[i + 1];
        if ((char === '<' && next === '=') || (char === '>' && next === '=') ||
            (char === '<' && next === '>') || (char === '=' && next === '=') ||
            (char === '!' && next === '=') || (char === '&' && next === '&') ||
            (char === '|' && next === '|')) {
          tokens.push(char + next); i++; current = ''; continue;
        }
      }
      tokens.push(char); current = '';
    } else if (char === ' ') {
      if (current) tokens.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  if (current) tokens.push(current);
  return tokens;
}

function resolveArgument(
  argTokens: string[],
  getCellValue: CellValueGetter,
  currentCell?: { col: number; row: number }
): (number | string | null)[] {
  if (argTokens.length === 1) {
    const token = argTokens[0];
    const rangeMatch = parseRange(token);
    if (rangeMatch) {
      return rangeMatch.map(cell => getCellValue(cell.col, cell.row));
    }
    const cellMatch = parseCellRef(token);
    if (cellMatch) {
      return [getCellValue(cellMatch.col, cellMatch.row)];
    }
    if ((token.startsWith('"') && token.endsWith('"')) || (token.startsWith("'") && token.endsWith("'"))) {
      return [token.slice(1, -1)];
    }
    const num = parseFloat(token);
    if (!isNaN(num)) return [num];
    return [token];
  }
  const result = parseExpression(argTokens, getCellValue, currentCell);
  return [result];
}

function parseFunctionCall(
  tokens: string[],
  getCellValue: CellValueGetter,
  currentCell?: { col: number; row: number }
): number | string {
  const funcName = tokens[0].toUpperCase();
  const func = FUNCTIONS[funcName];
  if (!func) return '#NAME?';

  let depth = 0;
  let argsEnd = tokens.length - 1;
  for (let i = 1; i < tokens.length; i++) {
    if (tokens[i] === '(') depth++;
    if (tokens[i] === ')') { depth--; if (depth === 0) { argsEnd = i; break; } }
  }

  const args: (number | string | null)[] = [];
  let argTokens: string[] = [];
  depth = 0;

  for (let i = 2; i < argsEnd; i++) {
    const token = tokens[i];
    if (token === '(') depth++;
    if (token === ')') depth--;
    if (token === ',' && depth === 0) {
      if (argTokens.length > 0) args.push(...resolveArgument(argTokens, getCellValue, currentCell));
      argTokens = [];
    } else {
      argTokens.push(token);
    }
  }
  if (argTokens.length > 0) args.push(...resolveArgument(argTokens, getCellValue, currentCell));
  return func(args, getCellValue);
}

function parseArithmetic(
  tokens: string[],
  getCellValue: CellValueGetter,
  currentCell?: { col: number; row: number }
): number | string {
  const values: (number | string)[] = [];
  const operators: string[] = [];

  const resolveSingleToken = (token: string): number | string => {
    const cellRef = parseCellRef(token);
    if (cellRef) {
      const val = getCellValue(cellRef.col, cellRef.row);
      return val === null ? 0 : val;
    }
    const num = parseFloat(token);
    return isNaN(num) ? token : num;
  };

  let i = 0;
  while (i < tokens.length) {
    const token = tokens[i];
    if ('+-*/%^'.includes(token)) {
      operators.push(token);
    } else if (['>', '<', '>=', '<=', '=', '==', '<>', '!='].includes(token)) {
      operators.push(token);
    } else if (FUNCTIONS[token.toUpperCase()] && tokens[i + 1] === '(') {
      let depth = 0, end = i + 1;
      for (let j = i + 1; j < tokens.length; j++) {
        if (tokens[j] === '(') depth++;
        if (tokens[j] === ')') { depth--; if (depth === 0) { end = j + 1; break; } }
      }
      values.push(parseFunctionCall(tokens.slice(i, end), getCellValue, currentCell) as number | string);
      i = end - 1;
    } else if (token !== '(' && token !== ')') {
      values.push(resolveSingleToken(token));
    }
    i++;
  }

  if (values.length === 0) return '';
  if (operators.length === 0) return values[0];

  let result = typeof values[0] === 'string' ? parseFloat(values[0]) || 0 : values[0];
  for (let j = 0; j < operators.length && j + 1 < values.length; j++) {
    const op = operators[j];
    const next = typeof values[j + 1] === 'string' ? parseFloat(values[j + 1] as string) || 0 : values[j + 1] as number;
    switch (op) {
      case '+': result += next; break;
      case '-': result -= next; break;
      case '*': result *= next; break;
      case '/': result = next !== 0 ? result / next : 0; break;
      case '%': result %= next; break;
      case '^': result = Math.pow(result, next); break;
      case '>': return result > next ? 1 : 0;
      case '<': return result < next ? 1 : 0;
      case '>=': return result >= next ? 1 : 0;
      case '<=': return result <= next ? 1 : 0;
      case '=': case '==': return result === next ? 1 : 0;
      case '<>': case '!=': return result !== next ? 1 : 0;
    }
  }
  return result;
}

function parseExpression(
  tokens: string[],
  getCellValue: CellValueGetter,
  currentCell?: { col: number; row: number }
): number | string {
  if (tokens.length === 0) return '';
  const firstToken = tokens[0].toUpperCase();
  if (FUNCTIONS[firstToken] && tokens[1] === '(') {
    return parseFunctionCall(tokens, getCellValue, currentCell);
  }
  return parseArithmetic(tokens, getCellValue, currentCell);
}

export function evaluateFormula(
  formula: string,
  getCellValue: CellValueGetter,
  currentCell?: { col: number; row: number }
): number | string {
  if (formula.startsWith('=')) formula = formula.slice(1);
  try {
    return parseExpression(tokenize(formula), getCellValue, currentCell);
  } catch {
    return '#ERROR!';
  }
}

export function isFormula(value: string | number | null | undefined): boolean {
  return typeof value === 'string' && value.startsWith('=');
}
