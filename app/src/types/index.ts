import type { LucideIcon } from 'lucide-react';

export interface TableItem {
  id: string;
  name: string;
  icon: LucideIcon;
  count: number;
}

export interface TabItem {
  id: string;
  label: string;
  icon: LucideIcon;
}

export interface ImportState {
  file: { name: string; size: string; rows: number } | null;
  targetTable: string;
  delimiter: string;
  dateFormat: string;
  hasHeader: boolean;
  mappings: { source: string; target: string; transform: string; required: boolean }[];
  validationResults: { total: number; valid: number; errors: number; warnings: number };
  importProgress: number;
  importStatus: 'idle' | 'importing' | 'completed' | 'error';
}

export interface WorkflowStep {
  id: number;
  title: string;
  description: string;
  color: string;
  bgColor: string;
  borderColor: string;
  tables: string[];
  tableIds: string[];
  formula?: string;
  procedure?: string;
}
