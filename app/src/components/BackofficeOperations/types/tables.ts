import type { LucideIcon } from 'lucide-react';

export interface MasterTable {
  icon: LucideIcon;
  label: string;
  count: number;
  columns: string[];
  data: string[][];
  category?: string;
  name?: string;
}

export type MasterTablesMap = Record<string, MasterTable>;

export interface TableDataOverride {
  columns: string[];
  data: string[][];
}

export type TableDataOverrides = Record<string, TableDataOverride>;

export interface ImportedData {
  columns: string[];
  data: string[][];
  fileName: string;
  sheetName: string;
}

export interface DateRange {
  from: string;
  to: string;
}
