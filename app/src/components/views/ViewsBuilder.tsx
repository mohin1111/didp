import { Plus, Link, Eye, Save } from 'lucide-react';

export function ViewsBuilder() {
  return (
    <div className="flex-1 flex bg-slate-50" data-demo="views-builder">
      <div className="flex-1 p-6">
        <div className="bg-white rounded-xl border border-slate-200 h-full p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-slate-800">Visual Join Builder</h2>
            <button className="px-3 py-1.5 text-sm bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg flex items-center gap-1.5">
              <Eye className="w-4 h-4" />Preview
            </button>
          </div>
          <div className="relative min-h-80">
            <div className="absolute left-8 top-8 w-48 bg-white rounded-xl border-2 border-blue-300 shadow-lg">
              <div className="px-4 py-2 bg-blue-500 text-white rounded-t-lg text-sm font-medium">tbl_ClientMaster</div>
              <div className="p-2">
                {['n_ClientId (PK)', 's_ClientCode', 's_ClientName', 'n_Balance'].map((c, i) => (
                  <div key={i} className="px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-50 rounded flex items-center justify-between">
                    {c}
                    <div className="w-3 h-3 rounded-full border-2 border-slate-300"></div>
                  </div>
                ))}
              </div>
            </div>
            <div className="absolute left-72 top-16 w-48 bg-white rounded-xl border-2 border-green-300 shadow-lg">
              <div className="px-4 py-2 bg-green-500 text-white rounded-t-lg text-sm font-medium">tbl_DayTrade</div>
              <div className="p-2">
                {['n_TradeId (PK)', 'n_ClientId (FK)', 'd_TradeDate', 'n_Quantity'].map((c, i) => (
                  <div key={i} className="px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-50 rounded flex items-center justify-between">
                    {c}
                    <div className="w-3 h-3 rounded-full border-2 border-slate-300"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="w-72 bg-white border-l border-slate-200 p-6 space-y-6">
        <div>
          <h3 className="font-semibold text-slate-800 mb-3">Add Table</h3>
          <select className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm mb-2">
            <option>Select table...</option>
          </select>
          <button className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm rounded-lg flex items-center justify-center gap-2">
            <Plus className="w-4 h-4" />Add
          </button>
        </div>
        <div>
          <h3 className="font-semibold text-slate-800 mb-3">Joins</h3>
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <div className="flex items-center gap-2 text-sm">
              <span className="font-medium text-blue-600">Client</span>
              <Link className="w-4 h-4 text-slate-400" />
              <span className="font-medium text-green-600">Trade</span>
            </div>
            <select className="mt-2 w-full px-2 py-1 text-xs border border-slate-300 rounded">
              <option>INNER JOIN</option>
            </select>
            <p className="mt-2 text-xs text-slate-500">ON ClientId = ClientId</p>
          </div>
        </div>
        <div>
          <h3 className="font-semibold text-slate-800 mb-3">SQL</h3>
          <pre className="p-3 bg-slate-900 text-slate-100 rounded-lg text-xs overflow-auto">
{`SELECT c.*, t.*
FROM tbl_Client c
INNER JOIN tbl_Trade t
  ON c.ClientId = t.ClientId`}
          </pre>
        </div>
        <div className="flex gap-2">
          <input type="text" placeholder="View name..." className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-sm" />
          <button className="px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg">
            <Save className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
