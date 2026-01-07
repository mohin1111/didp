/**
 * Prepare chart data from SQL results
 */
export interface ChartDataPoint {
  name: string;
  value: number;
}

export const prepareChartData = (
  sqlOutput: string[][],
  chartXAxis: number,
  chartYAxis: number
): ChartDataPoint[] => {
  return sqlOutput.map(row => {
    const xValue = row[chartXAxis] || '';
    const yValue = parseFloat(row[chartYAxis]?.replace(/[^0-9.-]/g, '') || '0');
    return {
      name: xValue.length > 15 ? xValue.substring(0, 15) + '...' : xValue,
      value: yValue
    };
  });
};

/**
 * Get numeric column indices from columns array
 */
export const getNumericColumnIndices = (columns: string[]): number[] => {
  const numericKeywords = ['value', 'amount', 'qty', 'quantity', 'price', 'mtm', 'p/l', 'margin', 'brokerage'];
  return columns.reduce<number[]>((acc, col, idx) => {
    const colLower = col.toLowerCase();
    if (numericKeywords.some(kw => colLower.includes(kw))) {
      acc.push(idx);
    }
    return acc;
  }, []);
};

/**
 * Calculate chart axis defaults based on columns
 */
export const getDefaultChartAxes = (columns: string[]): { xAxis: number; yAxis: number } => {
  const numericIndices = getNumericColumnIndices(columns);
  return {
    xAxis: 0, // First column as X axis
    yAxis: numericIndices.length > 0 ? numericIndices[0] : 1 // First numeric column or second column
  };
};
