import { useState } from "react";
import Layout from '../../components/layout/Layout';
import { Truck, Plus, X, Calendar, MapPin, Package, Trash2, CheckSquare, Square } from "lucide-react";

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
  const [formData, setFormData] = useState({
    date: "",
    status: "",
    source: "",
    destination: "",
    description: "",
  });

  const openAdd = () => {
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
    
    // Format date untuk display
    const dateObj = new Date(formData.date);
    const formattedDate = dateObj.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }).replace(/ /g, ' ');
    
    // Generate ID baru
    const newId = transferOrders.length > 0 
      ? Math.max(...transferOrders.map(order => order.id)) + 1 
      : 1;
    
    // Generate nomor baru
    const nextNumber = `TO-${String(transferOrders.length + 1).padStart(5, '0')}`;
    
    // Get status label
    const statusObj = statusOptions.find(opt => opt.value === formData.status);
    const statusLabel = statusObj ? statusObj.label : formData.status;
    
    // Buat objek transfer order baru
    const newTransferOrder = {
      id: newId,
      date: formattedDate,
      number: nextNumber,
      status: statusLabel,
      statusColor: statusObj ? statusObj.value : "ready",
      source: formData.source,
      destination: formData.destination,
      description: `From ${formData.source} to ${formData.destination}`,
    };
    
    // Tambahkan ke state transferOrders
    setTransferOrders(prev => [newTransferOrder, ...prev]);
    
    // Tampilkan konfirmasi
    alert(`New Transfer Order Created!\nNumber: ${nextNumber}\nDate: ${formattedDate}\nStatus: ${statusLabel}\nSource: ${formData.source}\nDestination: ${formData.destination}`);
    
    // Reset form dan tutup
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

  // Fungsi untuk hapus data tunggal
  const handleDeleteSingle = (orderId, orderNumber) => {
    if (window.confirm(`Are you sure you want to delete transfer order ${orderNumber}?`)) {
      setTransferOrders(prev => prev.filter(order => order.id !== orderId));
      // Hapus juga dari selectedOrders jika ada
      setSelectedOrders(prev => prev.filter(id => id !== orderId));
      alert(`Transfer order ${orderNumber} has been deleted.`);
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
    <Layout>
      <div className="p-6 min-h-screen bg-blue-50">
        {/* Header dengan tombol New Transfer Order */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Truck className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Transfer Order</h1>
              <p className="text-gray-600 text-sm">Total: {transferOrders.length} orders | Selected: {selectedOrders.length}</p>
            </div>
          </div>
          
          <div className="flex gap-2">
            {selectedOrders.length > 0 && (
              <button
                onClick={handleDeleteMultiple}
                className="inline-flex items-center px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-medium hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete ({selectedOrders.length})
              </button>
            )}
            
            <button
              onClick={openAdd}
              className="inline-flex items-center px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Transfer Order
            </button>
          </div>
        </div>

        {/* Modal Konfirmasi Hapus Multiple */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <Trash2 className="w-5 h-5 text-red-600" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-800">Delete Orders</h2>
                </div>
                
                <p className="text-gray-700 mb-6">
                  Are you sure you want to delete {selectedOrders.length} selected order(s)? 
                  This action cannot be undone.
                </p>
                
                <div className="flex gap-3">
                  <button
                    onClick={cancelDeleteMultiple}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
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
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
              {/* Header Modal */}
              <div className="flex justify-between items-center p-6 border-b">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Plus className="w-5 h-5 text-blue-600" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-800">New Transfer Order</h2>
                </div>
                <button
                  onClick={closeAdd}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                {/* Date Field */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="w-4 h-4" />
                    Date
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Status Field */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <Package className="w-4 h-4" />
                    Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <MapPin className="w-4 h-4" />
                    Source Warehouse
                  </label>
                  <select
                    name="source"
                    value={formData.source}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <MapPin className="w-4 h-4" />
                    Destination Warehouse
                  </label>
                  <select
                    name="destination"
                    value={formData.destination}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                  <div className="p-3 bg-gray-50 rounded-md">
                    <p className="text-sm text-gray-700">
                      <span className="font-medium">Preview:</span> From {formData.source} to {formData.destination}
                    </p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={closeAdd}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!formData.source || !formData.destination || formData.source === formData.destination}
                    className={`flex-1 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                      !formData.source || !formData.destination || formData.source === formData.destination
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    Create Order
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
        )}

        {/* Search */}
        <input
          type="text"
          placeholder="Search or filter results..."
          className="w-full mb-4 px-4 py-2 border rounded-md"
        />

        {/* Table */}
        <div className="bg-white rounded-md shadow-sm">
          <table className="w-full text-sm">
            <thead className="border-b text-gray-500">
              <tr>
                <th className="p-4 w-10">
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
                <th className="p-4 text-left">Date<br />Number</th>
                <th className="p-4 text-left">Status</th>
                <th className="p-4 text-left">Source<br />Destination</th>
                <th className="p-4 text-left">Transfer Order</th>
                <th className="p-4 text-left">Actions</th>
              </tr>
            </thead>

            <tbody>
              {transferOrders.map((order) => (
                <tr
                  key={order.id}
                  className="border-b hover:bg-gray-50"
                >
                  <td className="p-4">
                    <input
                      type="checkbox"
                      checked={selectedOrders.includes(order.id)}
                      onChange={() => handleIndividualCheckbox(order.id)}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                  </td>

                  <td className="p-4">
                    <div className="font-medium">{order.date}</div>
                    <div className="text-gray-400 text-xs">
                      {order.number}
                    </div>
                  </td>

                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${statusStyle[order.statusColor] || 'bg-gray-100 text-gray-700'}`}
                    >
                      {order.status}
                    </span>
                  </td>

                  <td className="p-4">
                    <div className="font-medium">{order.source}</div>
                    <div className="text-gray-400 text-xs">
                      {order.destination}
                    </div>
                  </td>

                  <td className="p-4 text-gray-600">
                    {order.description}
                  </td>

                  <td className="p-4">
                    <button
                      onClick={() => handleDeleteSingle(order.id, order.number)}
                      className="p-1.5 text-red-600 hover:bg-red-50 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-red-200"
                      title="Delete order"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {transferOrders.length === 0 && (
          <div className="text-center py-12">
            <div className="p-4 bg-gray-100 rounded-full inline-block mb-4">
              <Truck className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-700 mb-2">No Transfer Orders</h3>
            <p className="text-gray-500 mb-4">Get started by creating a new transfer order.</p>
            <button
              onClick={openAdd}
              className="inline-flex items-center px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Order
            </button>
          </div>
        )}
      </div>
    </Layout>
  );
}