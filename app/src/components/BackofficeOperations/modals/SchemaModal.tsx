import { X, Copy, TableProperties } from 'lucide-react';
import { useBackoffice } from '../context/BackofficeContext';
import { masterTables } from '../data';
import { generateSqlSchema } from '../utils';

export default function SchemaModal() {
  const {
    showSchemaModal,
    setShowSchemaModal,
  } = useBackoffice();

  if (!showSchemaModal) return null;

  const schema = generateSqlSchema(masterTables);

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-8">
      <div className="bg-slate-900 rounded-xl border border-slate-700 w-full max-w-[95vw] lg:max-w-4xl max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-500/20 rounded-lg">
              <TableProperties size={20} className="text-orange-400" />
            </div>
            <div>
              <h2 className="font-semibold text-white text-lg">Database Schema</h2>
              <p className="text-xs text-slate-500">SQL schema for all master tables</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigator.clipboard.writeText(schema)}
              className="flex items-center gap-2 px-3 py-1.5 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm"
            >
              <Copy size={14} />
              Copy
            </button>
            <button
              onClick={() => setShowSchemaModal(false)}
              className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
            >
              <X size={20} className="text-slate-400" />
            </button>
          </div>
        </div>

        <div className="flex-1 p-4 overflow-auto">
          <pre className="bg-slate-950 p-4 rounded-lg border border-slate-700 text-xs font-mono text-green-400 whitespace-pre-wrap">
            {schema}
          </pre>
        </div>

        <div className="p-4 border-t border-slate-700 bg-slate-800/50">
          <div className="flex items-center justify-between">
            <div className="text-xs text-slate-500">
              <TableProperties size={12} className="inline mr-1" />
              {Object.keys(masterTables).length} tables &bull; Use this schema to write SQL queries
            </div>
            <button
              onClick={() => setShowSchemaModal(false)}
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
