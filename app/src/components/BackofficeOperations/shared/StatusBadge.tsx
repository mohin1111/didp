
interface StatusBadgeProps {
  status: string;
}

const statusStyles: Record<string, string> = {
  'SETTLED': 'bg-green-500/20 text-green-400 border-green-500/30',
  'MATCHED': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  'PENDING': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  'FAILED': 'bg-red-500/20 text-red-400 border-red-500/30',
  'INSTRUCTED': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  'VERIFIED': 'bg-green-500/20 text-green-400 border-green-500/30',
  'ACTIVE': 'bg-green-500/20 text-green-400 border-green-500/30',
  'HIGH': 'bg-red-500/20 text-red-400 border-red-500/30',
  'MEDIUM': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  'LOW': 'bg-green-500/20 text-green-400 border-green-500/30',
  'SUCCESS': 'bg-green-500/20 text-green-400 border-green-500/30',
  'WARNING': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  'RUNNING': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  'COMPLETED': 'bg-green-500/20 text-green-400 border-green-500/30',
  'BUY': 'bg-green-500/20 text-green-400 border-green-500/30',
  'SELL': 'bg-red-500/20 text-red-400 border-red-500/30',
  'DR': 'bg-red-500/20 text-red-400 border-red-500/30',
  'CR': 'bg-green-500/20 text-green-400 border-green-500/30',
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  const style = statusStyles[status] || 'bg-slate-500/20 text-slate-400 border-slate-500/30';

  return (
    <span className={`px-1.5 py-0.5 text-[9px] font-medium rounded border ${style}`}>
      {status}
    </span>
  );
}

// For checking if a cell value should be rendered as a status badge
export const isStatusValue = (value: string): boolean => {
  return Object.keys(statusStyles).includes(value.toUpperCase()) ||
         ['Yes', 'No', 'True', 'False'].includes(value);
};
