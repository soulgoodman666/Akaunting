import { useState } from "react";
import { 
  Settings, 
  Search,
  ChevronLeft, 
  ChevronRight, 
  Filter, 
  Plus, 
  Trash2, 
  X, 
  CheckSquare, 
  Square,
  Edit,
  Package
} from "lucide-react";

export default function Adjustment() {
  // Data contoh untuk inventory adjustments
  const [adjustments, setAdjustments] = useState([
    { 
      id: 1, 
      date: '2024-01-15', 
      reference: 'ADJ-001', 
      type: 'Stock In', 
      item: 'Gas Argon', 
      quantity: 10, 
      reason: 'New stock received',
      status: 'Completed'
    },
    { 
      id: 2, 
      date: '2024-01-14', 
      reference: 'ADJ-002', 
      type: 'Stock Out', 
      item: 'Gas Oksigen', 
      quantity: -5, 
      reason: 'Damaged items',
      status: 'Completed'
    },
    { 
      id: 3, 
      date: '2024-01-13', 
      reference: 'ADJ-003', 
      type: 'Stock In', 
      item: 'Long Back Up', 
      quantity: 15, 
      reason: 'Purchase order',
      status: 'Pending'
    },
  ]);

  // State untuk form
  const [showAddForm, setShowAddForm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedAdjustments, setSelectedAdjustments] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [editId, setEditId] = useState(null);
  
  const [newAdjustment, setNewAdjustment] = useState({
    date: "",
    reference: "",
    type: "",
    item: "",
    quantity: "",
    reason: "",
    status: "Pending",
  });

  // State untuk filter dan search
  const [showFilter, setShowFilter] = useState(false);
  const [selectedType, setSelectedType] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [search, setSearch] = useState("");

  // Filter adjustments berdasarkan search, type dan status
  const filteredAdjustments = adjustments.filter((adjustment) => {
    const matchType = selectedType === "All" || adjustment.type === selectedType;
    const matchStatus = selectedStatus === "All" || adjustment.status === selectedStatus;
    const matchSearch =
      adjustment.reference.toLowerCase().includes(search.toLowerCase()) ||
      adjustment.item.toLowerCase().includes(search.toLowerCase()) ||
      adjustment.reason.toLowerCase().includes(search.toLowerCase());
    return matchType && matchStatus && matchSearch;
  });

  // Fungsi untuk handle checkbox individual
  const handleIndividualCheckbox = (adjustmentId) => {
    setSelectedAdjustments(prev => {
      if (prev.includes(adjustmentId)) {
        return prev.filter(id => id !== adjustmentId);
      } else {
        return [...prev, adjustmentId];
      }
    });
  };

  // Fungsi untuk handle select all
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedAdjustments([]);
    } else {
      const allIds = filteredAdjustments.map(adjustment => adjustment.id);
      setSelectedAdjustments(allIds);
    }
    setSelectAll(!selectAll);
  };

  // Fungsi untuk hapus data tunggal
  const handleDeleteSingle = (adjustmentId, adjustmentRef) => {
    if (window.confirm(`Are you sure you want to delete adjustment "${adjustmentRef}"?`)) {
      setAdjustments(prev => prev.filter(adj => adj.id !== adjustmentId));
      setSelectedAdjustments(prev => prev.filter(id => id !== adjustmentId));
    }
  };

  // Fungsi untuk hapus multiple
  const handleDeleteMultiple = () => {
    if (selectedAdjustments.length === 0) {
      alert("Please select at least one adjustment to delete.");
      return;
    }
    setShowDeleteConfirm(true);
  };

  // Konfirmasi hapus multiple
  const confirmDeleteMultiple = () => {
    setAdjustments(prev => prev.filter(adj => !selectedAdjustments.includes(adj.id)));
    setSelectedAdjustments([]);
    setSelectAll(false);
    setShowDeleteConfirm(false);
  };

  // Cancel hapus multiple
  const cancelDeleteMultiple = () => {
    setShowDeleteConfirm(false);
  };

  // Fungsi untuk tambah/edit adjustment
  const openAdd = () => {
    setEditId(null);
    setNewAdjustment({
      date: new Date().toISOString().split('T')[0],
      reference: `ADJ-${String(adjustments.length + 1).padStart(3, '0')}`,
      type: "",
      item: "",
      quantity: "",
      reason: "",
      status: "Pending",
    });
    setShowAddForm(true);
  };

  const openEdit = (adjustment) => {
    setEditId(adjustment.id);
    setNewAdjustment(adjustment);
    setShowAddForm(true);
  };

  const saveAdjustment = () => {
    if (!newAdjustment.type || !newAdjustment.item || !newAdjustment.quantity || !newAdjustment.reason) {
      alert("Please fill all required fields");
      return;
    }

    if (editId) {
      setAdjustments(adjustments.map(adj => adj.id === editId ? newAdjustment : adj));
    } else {
      setAdjustments([...adjustments, { ...newAdjustment, id: adjustments.length > 0 ? Math.max(...adjustments.map(a => a.id)) + 1 : 1 }]);
    }
    setShowAddForm(false);
    setEditId(null);
  };

  // Fungsi untuk reset form
  const resetForm = () => {
    setNewAdjustment({
      date: "",
      reference: "",
      type: "",
      item: "",
      quantity: "",
      reason: "",
      status: "Pending",
    });
    setShowAddForm(false);
    setEditId(null);
  };

  return (
      <div className="p-6 min-h-screen bg-blue-50 dark:bg-slate-800">
        {/* Header dengan tombol New Adjustment */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Settings className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Adjustments</h1>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Manage inventory adjustments | Total: {adjustments.length} adjustments
              </p>
            </div>
          </div>
          
          <div className="flex gap-2">
            {selectedAdjustments.length > 0 && (
              <button
                onClick={handleDeleteMultiple}
                className="inline-flex items-center px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-medium hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete ({selectedAdjustments.length})
              </button>
            )}
            
            {!showAddForm && (
              <button
                onClick={openAdd}
                className="inline-flex items-center px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                New Adjustment
              </button>
            )}
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
                  <h2 className="text-xl font-bold text-gray-800">Delete Adjustments</h2>
                </div>
                
                <p className="text-gray-700 mb-6">
                  Are you sure you want to delete {selectedAdjustments.length} selected adjustment(s)? 
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

        {/* Form Add/Edit Adjustment (Modal Style) */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
              {/* Header Modal */}
              <div className="flex justify-between items-center p-6 border-b">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    {editId ? <Edit className="w-5 h-5 text-blue-600" /> : <Plus className="w-5 h-5 text-blue-600" />}
                  </div>
                  <h2 className="text-xl font-bold text-gray-800">
                    {editId ? "Edit Adjustment" : "New Adjustment"}
                  </h2>
                </div>
                <button
                  onClick={resetForm}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* Form Content */}
              <div className="p-6 space-y-4">
                {/* Date Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date *
                  </label>
                  <input
                    type="date"
                    value={newAdjustment.date}
                    onChange={(e) => setNewAdjustment({ ...newAdjustment, date: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                {/* Reference Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Reference *
                  </label>
                  <input
                    type="text"
                    placeholder="Enter reference number"
                    value={newAdjustment.reference}
                    onChange={(e) => setNewAdjustment({ ...newAdjustment, reference: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                {/* Type Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type *
                  </label>
                  <div className="flex gap-3">
                    {["Stock In", "Stock Out"].map((type) => (
                      <label
                        key={type}
                        className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border cursor-pointer transition ${
                          newAdjustment.type === type
                            ? "border-blue-500 bg-blue-50 text-blue-600"
                            : "border-gray-300 hover:border-blue-400"
                        }`}
                      >
                        <input
                          type="radio"
                          name="type"
                          value={type}
                          checked={newAdjustment.type === type}
                          onChange={(e) => setNewAdjustment({ ...newAdjustment, type: e.target.value })}
                          className="hidden"
                        />
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                          newAdjustment.type === type ? "border-blue-500" : "border-gray-400"
                        }`}>
                          {newAdjustment.type === type && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full" />
                          )}
                        </div>
                        <span className="text-sm font-medium">{type}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Item Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Item *
                  </label>
                  <input
                    type="text"
                    placeholder="Enter item name"
                    value={newAdjustment.item}
                    onChange={(e) => setNewAdjustment({ ...newAdjustment, item: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                {/* Quantity Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quantity *
                  </label>
                  <input
                    type="number"
                    placeholder="Enter quantity"
                    value={newAdjustment.quantity}
                    onChange={(e) => setNewAdjustment({ ...newAdjustment, quantity: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Use positive numbers for stock in, negative for stock out
                  </p>
                </div>

                {/* Reason Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Reason *
                  </label>
                  <textarea
                    placeholder="Enter adjustment reason"
                    value={newAdjustment.reason}
                    onChange={(e) => setNewAdjustment({ ...newAdjustment, reason: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                {/* Status Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    value={newAdjustment.status}
                    onChange={(e) => setNewAdjustment({ ...newAdjustment, status: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={saveAdjustment}
                    disabled={!newAdjustment.type || !newAdjustment.item || !newAdjustment.quantity || !newAdjustment.reason}
                    className={`flex-1 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                      !newAdjustment.type || !newAdjustment.item || !newAdjustment.quantity || !newAdjustment.reason
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-blue-600 text-white hover:bg-blue-700"
                    }`}
                  >
                    {editId ? "Update Adjustment" : "Create Adjustment"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search reference, item, or reason..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-xl text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
              />
            </div>

            <button 
              onClick={() => setShowFilter(!showFilter)} 
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 rounded-xl shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </button>
            
            {/* Filter Dropdown */}
            {showFilter && (
              <div className="absolute right-4 mt-32 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                <div className="p-3 border-b">
                  <p className="text-xs font-medium text-gray-700">Type</p>
                  <button
                    onClick={() => setSelectedType("All")}
                    className={`block w-full text-left px-2 py-1 hover:bg-gray-100 ${selectedType === "All" ? "bg-purple-50 text-purple-600" : ""}`}
                  >
                    All Types
                  </button>
                  <button
                    onClick={() => setSelectedType("Stock In")}
                    className={`block w-full text-left px-2 py-1 hover:bg-gray-100 ${selectedType === "Stock In" ? "bg-purple-50 text-purple-600" : ""}`}
                  >
                    Stock In
                  </button>
                  <button
                    onClick={() => setSelectedType("Stock Out")}
                    className={`block w-full text-left px-2 py-1 hover:bg-gray-100 ${selectedType === "Stock Out" ? "bg-purple-50 text-purple-600" : ""}`}
                  >
                    Stock Out
                  </button>
                </div>
                <div className="p-3">
                  <p className="text-xs font-medium text-gray-700 mb-2">Status</p>
                  <button
                    onClick={() => setSelectedStatus("All")}
                    className={`block w-full text-left px-2 py-1 hover:bg-gray-100 ${selectedStatus === "All" ? "bg-purple-50 text-purple-600" : ""}`}
                  >
                    All Status
                  </button>
                  <button
                    onClick={() => setSelectedStatus("Pending")}
                    className={`block w-full text-left px-2 py-1 hover:bg-gray-100 ${selectedStatus === "Pending" ? "bg-purple-50 text-purple-600" : ""}`}
                  >
                    Pending
                  </button>
                  <button
                    onClick={() => setSelectedStatus("Completed")}
                    className={`block w-full text-left px-2 py-1 hover:bg-gray-100 ${selectedStatus === "Completed" ? "bg-purple-50 text-purple-600" : ""}`}
                  >
                    Completed
                  </button>
                  <button
                    onClick={() => setSelectedStatus("Cancelled")}
                    className={`block w-full text-left px-2 py-1 hover:bg-gray-100 ${selectedStatus === "Cancelled" ? "bg-purple-50 text-purple-600" : ""}`}
                  >
                    Cancelled
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Adjustments Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200 w-12">
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
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
                    Reference
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
                    Type
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
                    Item
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
                    Quantity
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAdjustments.length > 0 ? (
                  filteredAdjustments.map((adjustment) => (
                    <tr key={adjustment.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap border-r border-gray-100">
                        <input
                          type="checkbox"
                          checked={selectedAdjustments.includes(adjustment.id)}
                          onChange={() => handleIndividualCheckbox(adjustment.id)}
                          className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap border-r border-gray-100">
                        <div className="text-sm text-gray-900">{adjustment.date}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap border-r border-gray-100">
                        <div className="text-sm font-medium text-purple-600">{adjustment.reference}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap border-r border-gray-100">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          adjustment.type === 'Stock In' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {adjustment.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap border-r border-gray-100">
                        <div className="flex items-center">
                          <Package className="w-4 h-4 text-gray-400 mr-2" />
                          <span className="text-sm text-gray-900">{adjustment.item}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap border-r border-gray-100">
                        <div className={`text-sm font-medium ${
                          adjustment.quantity > 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {adjustment.quantity > 0 ? '+' : ''}{adjustment.quantity}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap border-r border-gray-100">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          adjustment.status === 'Completed' 
                            ? 'bg-green-100 text-green-800'
                            : adjustment.status === 'Pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {adjustment.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex gap-2">
                          <button
                            onClick={() => openEdit(adjustment)}
                            className="inline-flex items-center px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-200"
                            title="Edit adjustment"
                          >
                            <Edit className="w-4 h-4 mr-1" />
                            Edit
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="px-6 py-12 text-center">
                      <Settings className="mx-auto h-12 w-12 text-gray-400" />
                      <h3 className="mt-2 text-sm font-medium text-gray-900">No adjustments found</h3>
                      <p className="mt-1 text-sm text-gray-500">
                        {search || selectedType !== "All" || selectedStatus !== "All" 
                          ? "Try adjusting your search or filter" 
                          : "Get started by creating a new adjustment."}
                      </p>
                      {!search && selectedType === "All" && selectedStatus === "All" && (
                        <button
                          onClick={openAdd}
                          className="mt-4 inline-flex items-center px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Create Your First Adjustment
                        </button>
                      )}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination and Footer */}
          <div className="px-6 py-4 border-t border-gray-200">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              {/* Records Info */}
              <div className="text-sm text-gray-700">
                <span>Showing {filteredAdjustments.length} of {adjustments.length} adjustments</span>
              </div>

              {/* Pagination */}
              <div className="flex items-center space-x-2">
                <button className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed" disabled>
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
}
