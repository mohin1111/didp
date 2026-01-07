import type { MasterTablesMap, TableDataOverrides } from '../types';

/**
 * Generate SQL DDL schema from master tables
 */
export const generateSqlSchema = (masterTables: MasterTablesMap): string => {
  let schema = '-- Database Schema\n-- Generated: ' + new Date().toISOString() + '\n\n';

  // Group tables by category
  const categories = [...new Set(Object.values(masterTables).map(t => t.category || 'Other'))];

  categories.forEach(category => {
    schema += `-- ============================================\n`;
    schema += `-- ${category?.toUpperCase()} TABLES\n`;
    schema += `-- ============================================\n\n`;

    Object.entries(masterTables).forEach(([key, table]) => {
      if ((table.category || 'Other') === category) {
        // Map friendly names to SQL table names
        const sqlTableName = 'tbl_' + key.charAt(0).toUpperCase() + key.slice(1);
        schema += `-- Table: ${table.label} (${table.count.toLocaleString()} records)\n`;
        schema += `CREATE TABLE ${sqlTableName} (\n`;
        schema += `  n_${key}Id BigInt NOT NULL IDENTITY PRIMARY KEY,\n`;
        table.columns.forEach((col, idx) => {
          const colName = col.toLowerCase().replace(/[^a-z0-9]/g, '_').replace(/_+/g, '_');
          let colType = 'VARCHAR(255)';
          let prefix = 's_';
          if (col.includes('Date') || col.includes('date') || col.includes('Time')) {
            colType = 'DateTime';
            prefix = 'd_';
          } else if (col.includes('ID') || col.includes('Id') || col.includes('Qty') || col.includes('Quantity') || col.includes('No')) {
            colType = 'Int';
            prefix = 'n_';
          } else if (col.includes('Price') || col.includes('Value') || col.includes('Amount') || col.includes('MTM') || col.includes('P/L') || col.includes('Turnover') || col.includes('Brokerage') || col.includes('Charges') || col.includes('Tax')) {
            colType = 'Decimal(16,4)';
            prefix = 'n_';
          } else if (col.includes('Status') || col.includes('Type') || col.includes('Buy/Sell') || col.includes('Dr/Cr')) {
            colType = 'SmallInt';
            prefix = 'n_';
          }
          const fullColName = prefix + colName;
          schema += `  ${fullColName.padEnd(25)} ${colType.padEnd(15)} ${idx === table.columns.length - 1 ? 'NULL' : 'NOT NULL'},\n`;
        });
        schema += `);\n\n`;
      }
    });
  });

  return schema;
};

/**
 * Execute a simulated SQL query on master tables
 */
export interface SqlExecutionResult {
  columns: string[];
  data: string[][];
  error?: string;
}

export const executeSqlQuery = (
  query: string,
  masterTables: MasterTablesMap,
  tableDataOverrides: TableDataOverrides = {}
): SqlExecutionResult => {
  try {
    const queryLower = query.toLowerCase();
    let targetTable = '';

    // Find target table (check both master tables and overrides)
    const allTableKeys = [...new Set([...Object.keys(masterTables), ...Object.keys(tableDataOverrides)])];
    allTableKeys.forEach(key => {
      if (queryLower.includes(`from ${key.toLowerCase()}`)) {
        targetTable = key;
      }
    });

    if (!targetTable) {
      return { columns: [], data: [], error: 'Table not found in query' };
    }

    // Get table data (override takes precedence)
    const override = tableDataOverrides[targetTable];
    const table = masterTables[targetTable];

    if (!override && !table) {
      return { columns: [], data: [], error: 'Table not found in query' };
    }

    let results = override ? [...override.data] : [...table.data];
    const columns = override ? override.columns : table.columns;

    // Apply WHERE clause (basic)
    if (queryLower.includes('where')) {
      const whereMatch = queryLower.match(/where\s+(\w+)\s*=\s*'([^']+)'/);
      if (whereMatch) {
        const colName = whereMatch[1];
        const value = whereMatch[2].toUpperCase();
        const colIdx = columns.findIndex(c =>
          c.toLowerCase().replace(/[^a-z0-9]/g, '') === colName.replace(/[^a-z0-9]/g, '')
        );
        if (colIdx >= 0) {
          results = results.filter(row => row[colIdx]?.toUpperCase() === value);
        }
      }
    }

    // Apply ORDER BY (basic)
    if (queryLower.includes('order by')) {
      const orderMatch = queryLower.match(/order by\s+(\w+)\s*(asc|desc)?/);
      if (orderMatch) {
        const numericColIdx = columns.findIndex(c =>
          c.toLowerCase().includes('value') || c.toLowerCase().includes('amount') || c.toLowerCase().includes('qty')
        );
        if (numericColIdx >= 0) {
          const isDesc = orderMatch[2] === 'desc';
          results.sort((a, b) => {
            const aVal = parseFloat(a[numericColIdx]?.replace(/[^0-9.-]/g, '') || '0');
            const bVal = parseFloat(b[numericColIdx]?.replace(/[^0-9.-]/g, '') || '0');
            return isDesc ? bVal - aVal : aVal - bVal;
          });
        }
      }
    }

    // Apply LIMIT
    if (queryLower.includes('limit')) {
      const limitMatch = queryLower.match(/limit\s+(\d+)/);
      if (limitMatch) {
        results = results.slice(0, parseInt(limitMatch[1]));
      }
    }

    return { columns, data: results };
  } catch (error) {
    return { columns: [], data: [], error: String(error) };
  }
};
