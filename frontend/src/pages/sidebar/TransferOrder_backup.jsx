import { useState } from "react";
import { 
  Truck, 
  Plus, 
  X, 
  Calendar, 
  MapPin, 
  Package, 
  Trash2, 
  CheckSquare, 
  Square,
  Search,
  Edit,
  MoreVertical,
  Filter,
  Eye,
  ArrowLeftRight,
  Clock,
  User,
  FileText,
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
    totalValue: 3200000,
    requestedBy: "Mike Johnson",
    approvedBy: "Sarah Wilson",
    estimatedArrival: "12 Dec 2022",
    priority: "High",
    notes: "Urgent transfer needed for purchase order fulfillment"
  },
  {
    id: 3,
    date: "12 Dec 2022",
    number: "TO-00003",
    status: "Ready",
    statusColor: "orange",
    source: "Main Warehouse",
    destination: "Second Warehouse",
    description: "From Main to Logistics",
    items: 25,
    totalValue: 7500000,
    requestedBy: "Tom Brown",
    approvedBy: "Lisa Anderson",
    estimatedArrival: "15 Dec 2022",
    priority: "Low",
    notes: "Regular logistics transfer"
  },
];

const statusStyle = {
  ready: "bg-orange-100 text-orange-700",
  "in-transfer": "bg-blue-100 text-blue-700",
  transferred: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

const statusOptions = [
  { value: "ready", label: "Ready", color: "orange" },
  { value: "in-transfer", label: "In Transfer", color: "blue" },
  { value: "transferred", label: "Transferred", color: "green" },
  { value: "cancelled", label: "Cancelled", color: "red" },
];

const warehouseOptions = [
  "Main Warehouse",
  "Second Warehouse",
  "Third Warehouse",
  "Regional Warehouse",
  "Temp Storage"
];

export default function TransferOrders() {
  const [showAddForm, setShowAddForm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [transferOrders, setTransferOrders] = useState(initialTransferOrders);
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [editId, setEditId] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [formData, setFormData] = useState({
    date: "",
    status: "",
    source: "",
    destination: "",
    description: "",
  });

  const openAdd = () => {
    setEditId(null);
    setShowAddForm(true);
    // Set tanggal default ke hari ini
    const today = new Date();
    const formattedDate = today.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }).replace(/ /g, ' ');
    
    // Generate nomor baru
    const nextNumber = `TO-${String(transferOrders.length + 1).padStart(5, '0')}`;
    
    setFormData({
      date: today.toISOString().split('T')[0],
      status: "ready",
      source: "",
      destination: "",
      description: `From ${formData.source || ""} to ${formData.destination || ""}`,
      displayDate: formattedDate,
      number: nextNumber
    });
  };

  const closeAdd = () => {
    setShowAddForm(false);
    setEditId(null);
    setFormData({
      date: "",
      status: "",
      source: "",
      destination: "",
      description: "",
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
      // Update description otomatis
      description: name === 'source' || name === 'destination' 
        ? `From ${name === 'source' ? value : prev.source} to ${name === 'destination' ? value : prev.destination}`
        : prev.description
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editId) {
      // Update existing order
      setTransferOrders(transferOrders.map(order => 
        order.id === editId 
          ? { ...formData, id: editId, number: order.number }
          : order
      ));
    } else {
      // Add new order
      const newOrder = {
        ...formData,
        id: Date.now(),
        number: `TO-${String(transferOrders.length + 1).padStart(5, '0')}`,
        statusColor: statusOptions.find(s => s.value === formData.status)?.color || 'orange'
      };
      setTransferOrders([...transferOrders, newOrder]);
    }
    
    closeAdd();
  };

  // Fungsi untuk handle checkbox individual
  const handleIndividualCheckbox = (orderId) => {
    setSelectedOrders(prev => {
      if (prev.includes(orderId)) {
        return prev.filter(id => id !== orderId);
      } else {
        return [...prev, orderId];
      }
    });
  };

  // Fungsi untuk handle select all
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedOrders([]);
    } else {
      const allIds = transferOrders.map(order => order.id);
      setSelectedOrders(allIds);
    }
    setSelectAll(!selectAll);
  };

  // Fungsi untuk membuka edit form
  const openEdit = (order) => {
    setEditId(order.id);
    setFormData({
      date: order.date,
      status: order.statusColor === 'green' ? 'transferred' : 
            order.statusColor === 'blue' ? 'in-transfer' : 
            order.statusColor === 'orange' ? 'ready' : 'cancelled',
      source: order.source,
      destination: order.destination,
      description: order.description,
    });
    setShowAddForm(true);
  };

  // Fungsi untuk hapus data tunggal
  const handleDeleteSingle = (id, number) => {
    if (confirm(`Are you sure you want to delete transfer order ${number}?`)) {
      setTransferOrders(transferOrders.filter(order => order.id !== id));
    }
  };

  // Fungsi untuk hapus multiple
  const handleDeleteMultiple = () => {
    if (selectedOrders.length === 0) {
      alert("Please select at least one order to delete.");
      return;
    }
    
    setShowDeleteConfirm(true);
  };

  // Konfirmasi hapus multiple
  const confirmDeleteMultiple = () => {
    setTransferOrders(prev => prev.filter(order => !selectedOrders.includes(order.id)));
    setSelectedOrders([]);
    setSelectAll(false);
    setShowDeleteConfirm(false);
    alert(`${selectedOrders.length} order(s) have been deleted.`);
  };

  // Cancel hapus multiple
  const cancelDeleteMultiple = () => {
    setShowDeleteConfirm(false);
  };

  return (
    <div className="p-6 bg-gradient-to-br from-slate-50 via-orange-50 to-red-50 dark:from-gray-900 dark:via-gray-800 dark:to-slate-900 min-h-screen">
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
              {/* Header Modal */}
              <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-slate-700">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    {editId ? <Edit className="w-5 h-5 text-blue-600" /> : <Plus className="w-5 h-5 text-blue-600" />}
                  </div>
                  <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">
                    {editId ? "Edit Transfer Order" : "New Transfer Order"}
                  </h2>
                </div>
                <button
                  onClick={closeAdd}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                {/* Date Field */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <Calendar className="w-4 h-4" />
                    Date
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                  />
                </div>

                {/* Status Field */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <Package className="w-4 h-4" />
                    Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                  >
                    <option value="">Select Status</option>
                    {statusOptions.map((status) => (
                      <option key={status.value} value={status.value}>
                        {status.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Source Field */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <MapPin className="w-4 h-4" />
                    Source Warehouse
                  </label>
                  <select
                    name="source"
                    value={formData.source}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                  >
                    <option value="">Select Source</option>
                    {warehouseOptions.map((warehouse) => (
                      <option key={warehouse} value={warehouse}>
                        {warehouse}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Destination Field */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <MapPin className="w-4 h-4" />
                    Destination Warehouse
                  </label>
                  <select
                    name="destination"
                    value={formData.destination}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                  >
                    <option value="">Select Destination</option>
                    {warehouseOptions.map((warehouse) => (
                      <option key={warehouse} value={warehouse}>
                        {warehouse}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Preview */}
                {formData.source && formData.destination && (
                  <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      <span className="font-medium">Preview:</span> From {formData.source} to {formData.destination}
                    </p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={closeAdd}
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!formData.source || !formData.destination || formData.source === formData.destination}
                    className={`flex-1 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                      !formData.source || !formData.destination || formData.source === formData.destination
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-blue-600 text-white hover:bg-blue-700"
                    }`}
                  >
                    {editId ? "Update Order" : "Create Order"}
                  </button>
                </div>

                {/* Validation Message */}
                {formData.source && formData.destination && formData.source === formData.destination && (
                  <p className="text-red-500 text-sm text-center">
                    Source and destination cannot be the same
                  </p>
                )}
              </form>
            </div>
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
                  <button
                    onClick={handleSelectAll}
                    className="focus:outline-none"
                  >
                    {selectAll ? (
                      <CheckSquare className="w-5 h-5 text-blue-600" />
                    ) : (
                      <Square className="w-5 h-5 text-gray-400" />
                    )}
                  </button>
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Transfer Order</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Source</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Destination</th>
                <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {transferOrders.map((order) => (
                <tr
                  key={order.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                  onClick={() => setSelectedOrder(order)}
                >
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedOrders.includes(order.id)}
                      onChange={(e) => { e.stopPropagation(); handleIndividualCheckbox(order.id); }}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                        <Truck className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">{order.number}</div>
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
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        order.statusColor === 'ready' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400' :
                        order.statusColor === 'in-transfer' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400' :
                        order.statusColor === 'transferred' ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400' :
                        'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400'
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
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
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={(e) => { e.stopPropagation(); openEdit(order); }}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                        title="Edit order"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleDeleteSingle(order.id, order.number); }}
                        className="p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        title="Delete order"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); setSelectedOrder(order); }}
                        className="p-1.5 text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                        title="View details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Empty State */}
      {transferOrders.length === 0 && (
        <div className="text-center py-12">
          <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-full inline-block mb-4">
            <Truck className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">No Transfer Orders</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">Get started by creating a new transfer order.</p>
          <button
            onClick={openAdd}
            className="inline-flex items-center px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Your First Order
          </button>
        </div>
      )}

      {/* Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            {/* Header */}
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
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Informasi Dasar */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <FileText className="w-5 h-5 text-blue-600" />
                    Informasi Dasar
                  </h3>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Nomor Order</span>
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">{selectedOrder.number}</span>
                    </div>
                    
                    <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Tanggal</span>
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">{selectedOrder.date}</span>
                    </div>
                    
                    <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Status</span>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        selectedOrder.statusColor === 'green' ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400' :
                        selectedOrder.statusColor === 'blue' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400' :
                        selectedOrder.statusColor === 'orange' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400' :
                        'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400'
                      }`}>
                        {selectedOrder.status}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Prioritas</span>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        selectedOrder.priority === 'High' ? 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400' :
                        selectedOrder.priority === 'Normal' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400' :
                        'bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400'
                      }`}>
                        {selectedOrder.priority}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Lokasi Transfer */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <ArrowLeftRight className="w-5 h-5 text-green-600" />
                    Lokasi Transfer
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
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Estimasi Tiba</span>
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">{selectedOrder.estimatedArrival}</span>
                    </div>
                  </div>
                </div>

                {/* Informasi Barang */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <Package className="w-5 h-5 text-purple-600" />
                    Informasi Barang
                  </h3>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Jumlah Item</span>
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">{selectedOrder.items} items</span>
                    </div>
                    
                    <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Nilai Total</span>
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">
                        {new Intl.NumberFormat("id-ID", {
                          style: "currency",
                          currency: "IDR",
                          minimumFractionDigits: 0,
                        }).format(selectedOrder.totalValue)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Personel */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <User className="w-5 h-5 text-orange-600" />
                    Personel
                  </h3>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Diminta Oleh</span>
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">{selectedOrder.requestedBy}</span>
                    </div>
                    
                    <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Disetujui Oleh</span>
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">{selectedOrder.approvedBy}</span>
                    </div>
                  </div>
                </div>

                {/* Catatan */}
                <div className="space-y-4 md:col-span-2">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <FileText className="w-5 h-5 text-gray-600" />
                    Catatan
                  </h3>
                  
                  <div className="mt-4">
                    <div className="flex items-start py-2 border-b border-gray-200 dark:border-gray-700">
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400 mr-4 mt-1">Deskripsi</span>
                      <span className="text-sm text-gray-900 dark:text-white flex-1">{selectedOrder.description}</span>
                    </div>
                    <div className="flex items-start py-2 border-b border-gray-200 dark:border-gray-700">
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400 mr-4 mt-1">Catatan Tambahan</span>
                      <span className="text-sm text-gray-900 dark:text-white flex-1">{selectedOrder.notes}</span>
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
