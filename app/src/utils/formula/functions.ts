/**
 * Excel Formula Functions
 * All supported function implementations
 */

export type CellValueGetter = (col: number, row: number) => number | string | null;
export type FormulaFunction = (args: (number | string | null)[], getCellValue?: CellValueGetter) => number | string;

export const FUNCTIONS: Record<string, FormulaFunction> = {
  // Math functions
  SUM: (args) => args.filter((a): a is number => typeof a === 'number').reduce((a, b) => a + b, 0),
  AVERAGE: (args) => {
    const nums = args.filter((a): a is number => typeof a === 'number');
    return nums.length > 0 ? nums.reduce((a, b) => a + b, 0) / nums.length : 0;
  },
  COUNT: (args) => args.filter((a): a is number => typeof a === 'number').length,
  COUNTA: (args) => args.filter((a) => a !== null && a !== undefined && a !== '').length,
  MIN: (args) => Math.min(...args.filter((a): a is number => typeof a === 'number')),
  MAX: (args) => Math.max(...args.filter((a): a is number => typeof a === 'number')),
  ABS: (args) => Math.abs(Number(args[0]) || 0),
  ROUND: (args) => {
    const num = Number(args[0]) || 0;
    const decimals = Number(args[1]) || 0;
    return Math.round(num * Math.pow(10, decimals)) / Math.pow(10, decimals);
  },
  ROUNDUP: (args) => {
    const num = Number(args[0]) || 0;
    const decimals = Number(args[1]) || 0;
    return Math.ceil(num * Math.pow(10, decimals)) / Math.pow(10, decimals);
  },
  ROUNDDOWN: (args) => {
    const num = Number(args[0]) || 0;
    const decimals = Number(args[1]) || 0;
    return Math.floor(num * Math.pow(10, decimals)) / Math.pow(10, decimals);
  },
  FLOOR: (args) => Math.floor(Number(args[0]) || 0),
  CEILING: (args) => Math.ceil(Number(args[0]) || 0),
  SQRT: (args) => Math.sqrt(Number(args[0]) || 0),
  POWER: (args) => Math.pow(Number(args[0]) || 0, Number(args[1]) || 1),
  MOD: (args) => (Number(args[0]) || 0) % (Number(args[1]) || 1),
  LOG: (args) => Math.log10(Number(args[0]) || 1),
  LN: (args) => Math.log(Number(args[0]) || 1),
  EXP: (args) => Math.exp(Number(args[0]) || 0),
  PI: () => Math.PI,
  RAND: () => Math.random(),

  // Logical functions
  IF: (args) => {
    const condition = Boolean(args[0]);
    return condition ? (args[1] ?? '') : (args[2] ?? '');
  },
  AND: (args) => args.every((a) => Boolean(a)) ? 1 : 0,
  OR: (args) => args.some((a) => Boolean(a)) ? 1 : 0,
  NOT: (args) => Boolean(args[0]) ? 0 : 1,
  TRUE: () => 1,
  FALSE: () => 0,
  ISNUMBER: (args) => typeof args[0] === 'number' ? 1 : 0,
  ISTEXT: (args) => typeof args[0] === 'string' ? 1 : 0,
  ISBLANK: (args) => args[0] === null || args[0] === '' ? 1 : 0,

  // String functions
  CONCAT: (args) => args.map(a => String(a ?? '')).join(''),
  CONCATENATE: (args) => args.map(a => String(a ?? '')).join(''),
  LEFT: (args) => String(args[0] ?? '').slice(0, Number(args[1]) || 1),
  RIGHT: (args) => {
    const str = String(args[0] ?? '');
    const len = Number(args[1]) || 1;
    return str.slice(-len);
  },
  MID: (args) => {
    const str = String(args[0] ?? '');
    const start = (Number(args[1]) || 1) - 1;
    const len = Number(args[2]) || 1;
    return str.slice(start, start + len);
  },
  LEN: (args) => String(args[0] ?? '').length,
  UPPER: (args) => String(args[0] ?? '').toUpperCase(),
  LOWER: (args) => String(args[0] ?? '').toLowerCase(),
  PROPER: (args) => String(args[0] ?? '').replace(/\w\S*/g, txt => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()),
  TRIM: (args) => String(args[0] ?? '').trim(),
  TEXT: (args) => {
    const value = Number(args[0]) || 0;
    const format = String(args[1] ?? '');
    if (format.includes('#,##')) return value.toLocaleString('en-IN');
    if (format.includes('%')) return (value * 100).toFixed(2) + '%';
    return String(value);
  },
  SUBSTITUTE: (args) => {
    const text = String(args[0] ?? '');
    const oldText = String(args[1] ?? '');
    const newText = String(args[2] ?? '');
    return text.split(oldText).join(newText);
  },
  REPT: (args) => String(args[0] ?? '').repeat(Number(args[1]) || 1),

  // Lookup functions
  VLOOKUP: (args) => args[0] ?? '',

  // Statistical functions
  STDEV: (args) => {
    const nums = args.filter((a): a is number => typeof a === 'number');
    if (nums.length < 2) return 0;
    const mean = nums.reduce((a, b) => a + b, 0) / nums.length;
    const squareDiffs = nums.map(n => Math.pow(n - mean, 2));
    return Math.sqrt(squareDiffs.reduce((a, b) => a + b, 0) / (nums.length - 1));
  },
  VAR: (args) => {
    const nums = args.filter((a): a is number => typeof a === 'number');
    if (nums.length < 2) return 0;
    const mean = nums.reduce((a, b) => a + b, 0) / nums.length;
    const squareDiffs = nums.map(n => Math.pow(n - mean, 2));
    return squareDiffs.reduce((a, b) => a + b, 0) / (nums.length - 1);
  },
  MEDIAN: (args) => {
    const nums = args.filter((a): a is number => typeof a === 'number').sort((a, b) => a - b);
    if (nums.length === 0) return 0;
    const mid = Math.floor(nums.length / 2);
    return nums.length % 2 !== 0 ? nums[mid] : (nums[mid - 1] + nums[mid]) / 2;
  },

  // Financial functions
  PMT: (args) => {
    const rate = Number(args[0]) || 0;
    const nper = Number(args[1]) || 1;
    const pv = Number(args[2]) || 0;
    if (rate === 0) return -pv / nper;
    return (rate * pv * Math.pow(1 + rate, nper)) / (Math.pow(1 + rate, nper) - 1);
  },

  // Date functions
  TODAY: () => new Date().toISOString().split('T')[0],
  NOW: () => new Date().toISOString(),
  YEAR: (args) => new Date(String(args[0])).getFullYear(),
  MONTH: (args) => new Date(String(args[0])).getMonth() + 1,
  DAY: (args) => new Date(String(args[0])).getDate(),
  HOUR: (args) => new Date(String(args[0])).getHours(),
  MINUTE: (args) => new Date(String(args[0])).getMinutes(),
  SECOND: (args) => new Date(String(args[0])).getSeconds(),

  // Conditional aggregation
  COUNTIF: (args) => {
    const values = args.slice(0, -1);
    const criteria = args[args.length - 1];
    return values.filter(v => v === criteria).length;
  },
  SUMIF: (args) => args.filter((a): a is number => typeof a === 'number').reduce((a, b) => a + b, 0),
  AVERAGEIF: (args) => {
    const nums = args.filter((a): a is number => typeof a === 'number');
    return nums.length > 0 ? nums.reduce((a, b) => a + b, 0) / nums.length : 0;
  },
};

export function getSupportedFunctions(): string[] {
  return Object.keys(FUNCTIONS).sort();
}
