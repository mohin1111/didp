import React from 'react';

/**
 * Parse a numeric value from a formatted string (removes currency symbols, commas, etc.)
 */
export const parseNumericValue = (val: string): number => {
  const cleaned = val.replace(/[$£€,+%]/g, '').trim();
  const num = parseFloat(cleaned);
  return isNaN(num) ? 0 : num;
};

/**
 * Highlight matching text in a string with yellow background
 */
export const highlightMatch = (text: string, query: string): React.ReactNode => {
  if (!query) return text;
  const parts = text.split(new RegExp(`(${query})`, 'gi'));
  return React.createElement(
    React.Fragment,
    null,
    ...parts.map((part, i) =>
      part.toLowerCase() === query.toLowerCase()
        ? React.createElement('span', { key: i, className: 'bg-yellow-500/40 text-yellow-200 rounded px-0.5' }, part)
        : part
    )
  );
};

/**
 * Format a number with locale string
 */
export const formatNumber = (num: number): string => {
  return num.toLocaleString();
};

/**
 * Format a date string
 */
export const formatDate = (date: string | Date): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toISOString().slice(0, 10);
};

/**
 * Generate a timestamp string for filenames
 */
export const getTimestamp = (): string => {
  return new Date().toISOString().slice(0, 10);
};
