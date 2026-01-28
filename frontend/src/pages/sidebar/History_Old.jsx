import { useState } from "react";
import { Clock, Search } from "lucide-react";

export default function History() {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);

  const histories = [
    {
      id: 1,
      date: "18 Aug 2025 · 08:42",
      item: "Smart POS Terminal",
      warehouse: "Central Warehouse",
      action: "Stock In",
      change: 50,
      before: 120,
      after: 170,
      note: "Initial stock from supplier",
      user: "Warehouse Admin",
      source: "Items",
      reference: "INIT-STOCK-001",
    },
    {
      id: 2,
      date: "18 Aug 2025 · 11:30",
      item: "Thermal Receipt Paper Roll",
      warehouse: "Outlet Gresik",
      action: "Stock Out",
      change: -24,
      before: 140,
      after: 116,
      note: "Transfer to Outlet Gresik",
      user: "System",
      source: "Transfer Order",
      reference: "TO-0825-019",
    },
    {
      id: 3,
      date: "19 Aug 2025 · 15:10",
      item: "Customer Display 7”",
      warehouse: "Outlet Sidoarjo",
      action: "Adjustment",
      change: -3,
      before: 18,
      after: 15,
      note: "Damaged items",
      user: "Supervisor",
      source: "Items",
      reference: "ADJ-0007",
    },
  ];

  const filtered = histories.filter((h) =>
    h.item.toLowerCase().includes(search.toLowerCase())
  );

  const color = (action) => {
    if (action === "Stock In") return "emerald";
    if (action === "Stock Out") return "rose";
    if (action === "Adjustment") return "amber";
    return "slate";
  };

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gray-100 rounded-lg">
              <Clock className="w-6 h-6 text-gray-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Inventory History</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">Track all inventory movements and changes</p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Search history..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Item</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Warehouse</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Activity</th>
                <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Quantity</th>
              </tr>
            </thead>

          <tbody>
            {filtered.map((h) => (
              <tr
                key={h.id}
                onClick={() => setSelected(h)}
                className="border-b cursor-pointer
                           hover:bg-slate-50 dark:hover:bg-slate-800
                           transition"
              >
                <td className="py-4 text-slate-700 dark:text-slate-300">
                  {h.date}
                </td>
                <td className="py-4 font-semibold text-slate-800 dark:text-slate-100">
                  {h.item}
                </td>
                <td className="py-4 text-slate-700 dark:text-slate-300">
                  {h.warehouse}
                </td>
                <td className="py-4 space-x-2">
                  <span
                    className={`px-3 py-1 text-xs font-semibold rounded-full 
                    bg-${color(h.action)}-100 text-${color(h.action)}-700
                    dark:bg-${color(h.action)}-900 dark:text-${color(h.action)}-300`}
                  >
                    {h.action}
                  </span>
                  <span className="px-2 py-1 text-xs rounded-full 
                                   bg-slate-100 text-slate-600
                                   dark:bg-slate-800 dark:text-slate-300">
                    {h.source}
                  </span>
                </td>
                <td
                  className={`py-4 text-right font-bold ${
                    h.change > 0
                      ? "text-emerald-600"
                      : "text-rose-600"
                  }`}
                >
                  {h.change > 0 ? `+${h.change}` : h.change}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ================= DRAWER ================= */}
      {selected && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="flex-1 bg-black/40"
            onClick={() => setSelected(null)}
          />

          <div className="w-full max-w-md bg-white dark:bg-slate-800 shadow-2xl p-6 animate-slide-in">
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">
              {selected.item}
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
              {selected.action} • {selected.date}
            </p>

            <div className="space-y-4 text-sm">
              <Info label="Warehouse" value={selected.warehouse} />
              <Info label="Performed by" value={selected.user} />
              <Info label="Note" value={selected.note} />
            </div>

            <button
              onClick={() => setSelected(null)}
              className="mt-6 w-full py-2 bg-slate-800 dark:bg-slate-700
                         text-white rounded-lg hover:opacity-90"
            >
              Close
            </button>
          </div>
        </div>
      )}

      <style>
        {`
          @keyframes slide-in {
            from { transform: translateX(100%); }
            to { transform: translateX(0); }
          }
          .animate-slide-in {
            animation: slide-in 0.25s ease-out;
          }
        `}
      </table>
        </div>
      </div>
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div className="flex justify-between border-b
                    border-slate-200 dark:border-slate-700 pb-2">
      <span className="text-slate-500 dark:text-slate-400">{label}</span>
      <span className="font-semibold text-slate-800 dark:text-slate-100">
        {value}
      </span>
    </div>
  );
}
