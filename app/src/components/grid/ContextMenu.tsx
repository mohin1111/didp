import { useEffect, useRef } from 'react';
import { Copy, Scissors, ClipboardPaste, Trash2, Plus, ArrowUp, ArrowDown } from 'lucide-react';

interface ContextMenuItem {
  label: string;
  icon: React.ReactNode;
  action: () => void;
  shortcut?: string;
  divider?: boolean;
  disabled?: boolean;
}

interface ContextMenuProps {
  x: number;
  y: number;
  visible: boolean;
  onClose: () => void;
  onCut: () => void;
  onCopy: () => void;
  onPaste: () => void;
  onDelete: () => void;
  onInsertAbove: () => void;
  onInsertBelow: () => void;
  onDuplicate: () => void;
}

export function ContextMenu({
  x, y, visible, onClose,
  onCut, onCopy, onPaste, onDelete, onInsertAbove, onInsertBelow, onDuplicate
}: ContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (visible) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [visible, onClose]);

  if (!visible) return null;

  const menuItems: ContextMenuItem[] = [
    { label: 'Cut', icon: <Scissors className="w-4 h-4" />, action: onCut, shortcut: 'Ctrl+X' },
    { label: 'Copy', icon: <Copy className="w-4 h-4" />, action: onCopy, shortcut: 'Ctrl+C' },
    { label: 'Paste', icon: <ClipboardPaste className="w-4 h-4" />, action: onPaste, shortcut: 'Ctrl+V', divider: true },
    { label: 'Delete Row', icon: <Trash2 className="w-4 h-4" />, action: onDelete, shortcut: 'Delete', divider: true },
    { label: 'Insert Row Above', icon: <ArrowUp className="w-4 h-4" />, action: onInsertAbove },
    { label: 'Insert Row Below', icon: <ArrowDown className="w-4 h-4" />, action: onInsertBelow },
    { label: 'Duplicate Row', icon: <Plus className="w-4 h-4" />, action: onDuplicate, shortcut: 'Ctrl+D' },
  ];

  return (
    <div
      ref={menuRef}
      className="fixed bg-white rounded-lg shadow-xl border border-slate-200 py-1 min-w-48 z-50"
      style={{ left: x, top: y }}
    >
      {menuItems.map((item, index) => (
        <div key={index}>
          <button
            onClick={() => { item.action(); onClose(); }}
            disabled={item.disabled}
            className={`w-full flex items-center gap-3 px-3 py-2 text-sm hover:bg-slate-100 text-left ${
              item.disabled ? 'text-slate-300 cursor-not-allowed' : 'text-slate-700'
            }`}
          >
            <span className="text-slate-400">{item.icon}</span>
            <span className="flex-1">{item.label}</span>
            {item.shortcut && (
              <span className="text-xs text-slate-400">{item.shortcut}</span>
            )}
          </button>
          {item.divider && <div className="my-1 border-t border-slate-100" />}
        </div>
      ))}
    </div>
  );
}
