import type { ColDef } from 'ag-grid-community';

// Currency formatter for INR
export const currencyFormatter = (params: { value: number }) => {
  if (params.value == null) return '';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(params.value);
};

// Percentage formatter
export const percentFormatter = (params: { value: number }) => {
  if (params.value == null) return '';
  return `${params.value.toFixed(2)}%`;
};

// Number formatter with Indian format
export const numberFormatter = (params: { value: number }) => {
  if (params.value == null) return '';
  return new Intl.NumberFormat('en-IN').format(params.value);
};

// Date formatter
export const dateFormatter = (params: { value: string }) => {
  if (!params.value) return '';
  const date = new Date(params.value);
  return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
};

// Table config interface
export interface TableConfig {
  columns: ColDef[];
  data: Record<string, unknown>[];
}
