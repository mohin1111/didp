import { currencyFormatter } from '../../data/tableConfigs';

interface StatusBarProps {
  rowCount: number;
  selectedCells: { sum: number; avg: number; count: number };
}

export function StatusBar({ rowCount, selectedCells }: StatusBarProps) {
  return (
    <div className="bg-slate-50 border-t border-slate-200 px-4 py-2 flex items-center justify-between text-xs text-slate-500">
      <div className="flex items-center gap-4">
        <span>Rows: <strong className="text-slate-700">{rowCount.toLocaleString()}</strong></span>
      </div>
      <div className="flex items-center gap-6">
        {selectedCells.count > 0 && (
          <>
            <span>Count: <strong className="text-slate-700">{selectedCells.count}</strong></span>
            <span>Sum: <strong className="text-slate-700">{currencyFormatter({ value: selectedCells.sum })}</strong></span>
            <span>Avg: <strong className="text-slate-700">{currencyFormatter({ value: selectedCells.avg })}</strong></span>
          </>
        )}
      </div>
    </div>
  );
}
