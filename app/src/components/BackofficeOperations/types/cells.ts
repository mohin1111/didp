export interface CellSelection {
  tableKey: string;
  rowIndex: number;
  colIndex: number;
  value: string;
  column: string;
}

export interface CompareRow {
  tableKey: string;
  rowIndex: number;
  data: string[];
}
