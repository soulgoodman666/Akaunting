import { useState } from "react";
import { 
  Truck, Plus, X, Calendar, MapPin, Package, Trash2, CheckSquare, Square,
  Search, Edit, Eye, ArrowLeftRight, User, FileText, Clock,
} from "lucide-react";

const initialTransferOrders = [
  {
    id: 1,
    date: "08 Dec 2022",
    number: "TO-00001",
    status: "Transferred",
    statusColor: "green",
    source: "Main Warehouse",
    destination: "Second Warehouse",
    description: "From Main to Job",
    items: 15,
    totalValue: 5000000,
    requestedBy: "John Doe",
    approvedBy: "Jane Smith",
    estimatedArrival: "10 Dec 2022",
    priority: "Normal",
    notes: "Standard transfer for job site requirements"
  },
  {
    id: 2,
    date: "10 Dec 2022",
    number: "TO-00002",
    status: "In Transfer",
    statusColor: "blue",
    source: "Main Warehouse",
    destination: "Second Warehouse",
    description: "From Main to Purchase",
    items: 8,
    totalValue: 3000000,
    requestedBy: "Bob Johnson",
    approvedBy: "Alice Brown",
    estimatedArrival: "12 Dec 2022",
    priority: "High",
    notes: "Urgent transfer for purchase order fulfillment"
  },
  {
    id: 3,
    date: "12 Dec 2022",
    number: "TO-00003",
    status: "Ready",
    statusColor: "yellow",
    source: "Main Warehouse",
    destination: "Second Warehouse",
    description: "From Main to Sales",
    items: 12,
    totalValue: 4500000,
    requestedBy: "Carol White",
    approvedBy: "David Green",
    estimatedArrival: "14 Dec 2022",
    priority: "Normal",
    notes: "Regular sales inventory transfer"
  }
];

export default function TransferOrder() {
  const [transferOrders, setTransferOrders] = useState(initialTransferOrders);
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [search, setSearch] = useState("");

  const [formData, setFormData] = useState({
    date: "", number: "", status: "Ready", source: "", destination: "",
    description: "", items: "", totalValue: "", requestedBy: "", approvedBy: "",
    estimatedArrival: "", priority: "Normal", notes: ""
  });

  const filteredOrders = transferOrders.filter(order =>
    order.number.toLowerCase().includes(search.toLowerCase()) ||
    order.source.toLowerCase().includes(search.toLowerCase()) ||
    order.destination.toLowerCase().includes(search.toLowerCase()) ||
    order.status.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(filteredOrders.map(order => order.id));
    }
    setSelectAll(!selectAll);
  };

  const handleSelectOrder = (orderId) => {
    if (selectedOrders.includes(orderId)) {
      setSelectedOrders(selectedOrders.filter(id => id !== orderId));
    } else {
      setSelectedOrders([...selectedOrders, orderId]);
    }
  };

  const openAdd = () => {
    setEditId(null);
    setFormData({
      date: new Date().toISOString().split('T')[0],
      number: `TO-${String(transferOrders.length + 1).padStart(5, '0')}`,
      status: "Ready", source: "", destination: "", description: "",
      items: "", totalValue: "", requestedBy: "", approvedBy: "",
      estimatedArrival: "", priority: "Normal", notes: ""
    });
    setShowAddForm(true);
  };

  const openEdit = (order) => {
    setEditId(order.id);
    setFormData(order);
    setShowAddForm(true);
  };

  const closeAdd = () => {
    setShowAddForm(false);
    setEditId(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.source || !formData.destination) {
      alert("Source and destination are required");
      return;
    }

    if (formData.source === formData.destination) {
      alert("Source and destination cannot be the same");
      return;
    }

    if (editId) {
      setTransferOrders(transferOrders.map(order => 
        order.id === editId ? { ...formData, id: editId } : order
      ));
    } else {
      const newOrder = {
        ...formData,
        id: Date.now(),
        statusColor: formData.status === "Transferred" ? "green" : 
                   formData.status === "In Transfer" ? "blue" : "yellow"
      };
      setTransferOrders([...transferOrders, newOrder]);
    }
    
    closeAdd();
  };

  const handleDeleteSingle = (orderId) => {
    if (confirm("Are you sure you want to delete this transfer order?")) {
      setTransferOrders(transferOrders.filter(order => order.id !== orderId));
    }
  };

  const handleDeleteMultiple = () => {
    if (selectedOrders.length === 0) {
      alert("Please select at least one order to delete");
      return;
    }
    setShowDeleteConfirm(true);
  };

  const confirmDeleteMultiple = () => {
    setTransferOrders(transferOrders.filter(order => !selectedOrders.includes(order.id)));
    setSelectedOrders([]);
    setSelectAll(false);
    setShowDeleteConfirm(false);
    alert(`${selectedOrders.length} order(s) have been deleted.`);
  };

  const cancelDeleteMultiple = () => {
    setShowDeleteConfirm(false);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      "Transferred": { bg: "bg-green-100 dark:bg-green-900/20", text: "text-green-700 dark:text-green-400", border: "border-green-200 dark:border-green-800" },
      "In Transfer": { bg: "bg-blue-100 dark:bg-blue-900/20", text: "text-blue-700 dark:text-blue-400", border: "border-blue-200 dark:border-blue-800" },
      "Ready": { bg: "bg-yellow-100 dark:bg-yellow-900/20", text: "text-yellow-700 dark:text-yellow-400", border: "border-yellow-200 dark:border-yellow-800" }
    };
    
    const config = statusConfig[status] || statusConfig["Ready"];
    
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${config.bg} ${config.text} ${config.border}`}>
        <div className={`w-2 h-2 rounded-full mr-2 ${
          status === "Transferred" ? "bg-green-500" : 
          status === "In Transfer" ? "bg-blue-500" : "bg-yellow-500"
        }`}></div>
        {status}
      </span>
    );
  };

  const formatRupiah = (number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(number);

  return (
    <div className="h-screen p-6 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900 overflow-y-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 backdrop-blur-sm bg-opacity-90">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl shadow-lg">
                <Truck className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">Transfer Orders</h1>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Kelola transfer antar gudang dengan efisien</p>
              </div>
            </div>
            <button
              onClick={openAdd}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              <Plus size={20} /> Transfer Baru
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-xl p-4 border border-orange-200 dark:border-orange-800">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-orange-600 dark:text-orange-400 font-medium">Total Transfer</p>
                  <p className="text-2xl font-bold text-orange-900 dark:text-orange-100">{transferOrders.length}</p>
                </div>
                <Truck className="w-8 h-8 text-orange-500" />
              </div>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl p-4 border border-green-200 dark:border-green-800">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-green-600 dark:text-green-400 font-medium">Selesai</p>
                  <p className="text-2xl font-bold text-green-900 dark:text-green-100">{transferOrders.filter(o => o.status === 'Transferred').length}</p>
                </div>
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">✓</span>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">Dalam Proses</p>
                  <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">{transferOrders.filter(o => o.status === 'In Transfer').length}</p>
                </div>
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">→</span>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 rounded-xl p-4 border border-yellow-200 dark:border-yellow-800">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-yellow-600 dark:text-yellow-400 font-medium">Siap</p>
                  <p className="text-2xl font-bold text-yellow-900 dark:text-yellow-100">{transferOrders.filter(o => o.status === 'Ready').length}</p>
                </div>
                <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">!</span>
                </div>
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative max-w-md">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
              placeholder="Cari transfer order..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Modal Konfirmasi Hapus Multiple */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-red-100 rounded-lg">
                  <Trash2 className="w-5 h-5 text-red-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">Delete Orders</h2>
              </div>
              
              <p className="text-gray-700 dark:text-gray-300 mb-6">
                Are you sure you want to delete {selectedOrders.length} selected order(s)? 
                This action cannot be undone.
              </p>
              
              <div className="flex gap-3">
                <button
                  onClick={cancelDeleteMultiple}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDeleteMultiple}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal/Form Overlay */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl w-full max-w-md">
            <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-slate-700">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  {editId ? <Edit className="w-5 h-5 text-blue-600" /> : <Plus className="w-5 h-5 text-blue-600" />}
                </div>
                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">
                  {editId ? "Edit Transfer Order" : "New Transfer Order"}
                </h2>
              </div>
              <button onClick={closeAdd} className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
                <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Date</label>
                <input type="date" className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} required />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Transfer Order Number</label>
                <input type="text" className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" value={formData.number} onChange={(e) => setFormData({ ...formData, number: e.target.value })} required />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Source</label>
                  <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" value={formData.source} onChange={(e) => setFormData({ ...formData, source: e.target.value })} required>
                    <option value="">Select Source</option>
                    <option value="Main Warehouse">Main Warehouse</option>
                    <option value="Second Warehouse">Second Warehouse</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Destination</label>
                  <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" value={formData.destination} onChange={(e) => setFormData({ ...formData, destination: e.target.value })} required>
                    <option value="">Select Destination</option>
                    <option value="Main Warehouse">Main Warehouse</option>
                    <option value="Second Warehouse">Second Warehouse</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description</label>
                <input type="text" className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="e.g., From Main to Job" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Items</label>
                  <input type="number" className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" value={formData.items} onChange={(e) => setFormData({ ...formData, items: e.target.value })} placeholder="0" min="0" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Total Value</label>
                  <input type="number" className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" value={formData.totalValue} onChange={(e) => setFormData({ ...formData, totalValue: e.target.value })} placeholder="0" min="0" />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button type="button" onClick={closeAdd} className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors">Cancel</button>
                <button type="submit" className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors">{editId ? "Update" : "Save"}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden backdrop-blur-sm">
        <div className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-gray-700 dark:to-gray-800 px-6 py-4 border-b border-gray-200 dark:border-gray-600">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <Truck className="w-5 h-5 text-orange-600" />
            Daftar Transfer Order
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
              <tr>
                <th className="px-6 py-4 text-left">
                  <button onClick={handleSelectAll} className="focus:outline-none">
                    {selectAll ? <CheckSquare className="w-5 h-5 text-blue-600" /> : <Square className="w-5 h-5 text-gray-400" />}
                  </button>
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Transfer Order</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Source</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Destination</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Items</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Total Value</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-100 dark:divide-gray-700">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gradient-to-r hover:from-orange-50 hover:to-red-50 dark:hover:from-gray-700 dark:hover:to-gray-600 transition-all duration-200 cursor-pointer group" onClick={() => setSelectedOrder(order)}>
                  <td className="px-6 py-4">
                    <button onClick={(e) => { e.stopPropagation(); handleSelectOrder(order.id); }} className="focus:outline-none">
                      {selectedOrders.includes(order.id) ? <CheckSquare className="w-5 h-5 text-blue-600" /> : <Square className="w-5 h-5 text-gray-400" />}
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-gradient-to-br from-orange-100 to-red-100 dark:from-orange-900/30 dark:to-red-900/30 rounded-xl group-hover:scale-110 transition-transform duration-200">
                        <Truck className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900 dark:text-white">{order.number}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">{order.description}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-900 dark:text-gray-100">{order.date}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">{getStatusBadge(order.status)}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-900 dark:text-gray-100">{order.source}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-900 dark:text-gray-100">{order.destination}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Package className="w-4 h-4 text-gray-400" />
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">{order.items}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">{formatRupiah(order.totalValue)}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <button onClick={(e) => { e.stopPropagation(); setSelectedOrder(order); }} className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors" title="View details">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button onClick={(e) => { e.stopPropagation(); openEdit(order); }} className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors" title="Edit order">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button onClick={(e) => { e.stopPropagation(); handleDeleteSingle(order.id); }} className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors" title="Delete order">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-800">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-orange-100 rounded-lg">
                  <Truck className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">Detail Transfer Order</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{selectedOrder.number}</p>
                </div>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              </button>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <FileText className="w-5 h-5 text-orange-600" />
                    Informasi Dasar
                  </h3>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Nomor Transfer</span>
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">{selectedOrder.number}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Tanggal</span>
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">{selectedOrder.date}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Status</span>
                      {getStatusBadge(selectedOrder.status)}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <ArrowLeftRight className="w-5 h-5 text-blue-600" />
                    Detail Transfer
                  </h3>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Asal</span>
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">{selectedOrder.source}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Tujuan</span>
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">{selectedOrder.destination}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Jumlah Item</span>
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">{selectedOrder.items} items</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
