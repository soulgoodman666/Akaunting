import { useState } from "react";
import { 
  Building, 
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
  MapPin,
  Package,
  Eye
} from "lucide-react";

export default function Warehouse() {
  // Data contoh untuk warehouses
  const [warehouses, setWarehouses] = useState([
    { 
      id: 1, 
      name: 'Main Warehouse', 
      code: 'WH-001', 
      location: 'Jakarta Pusat', 
      address: 'Jl. Sudirman No. 123',
      manager: 'John Doe',
      phone: '+62 21 1234 5678',
      email: 'main@warehouse.com',
      capacity: 1000,
      used: 750,
      status: 'Active'
    },
    { 
      id: 2, 
      name: 'Secondary Warehouse', 
      code: 'WH-002', 
      location: 'Jakarta Utara', 
      address: 'Jl. Pluit No. 456',
      manager: 'Jane Smith',
      phone: '+62 21 8765 4321',
      email: 'secondary@warehouse.com',
      capacity: 500,
      used: 200,
      status: 'Active'
    },
    { 
      id: 3, 
      name: 'Distribution Center', 
      code: 'WH-003', 
      location: 'Jakarta Barat', 
      address: 'Jl. Kedoya No. 789',
      manager: 'Bob Johnson',
      phone: '+62 21 2468 1357',
      email: 'distribution@warehouse.com',
      capacity: 800,
      used: 800,
      status: 'Full'
    },
  ]);

  // State untuk form
  const [showAddForm, setShowAddForm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedWarehouses, setSelectedWarehouses] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [editId, setEditId] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedWarehouse, setSelectedWarehouse] = useState(null);
  
  const [newWarehouse, setNewWarehouse] = useState({
    name: "",
    code: "",
    location: "",
    address: "",
    manager: "",
    phone: "",
    email: "",
    capacity: "",
    status: "Active",
  });

  // State untuk filter dan search
  const [showFilter, setShowFilter] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [search, setSearch] = useState("");

  // Filter warehouses berdasarkan search dan status
  const filteredWarehouses = warehouses.filter((warehouse) => {
    const matchStatus = selectedStatus === "All" || warehouse.status === selectedStatus;
    const matchSearch =
      warehouse.name.toLowerCase().includes(search.toLowerCase()) ||
      warehouse.code.toLowerCase().includes(search.toLowerCase()) ||
      warehouse.location.toLowerCase().includes(search.toLowerCase()) ||
      warehouse.manager.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  // Fungsi untuk handle checkbox individual
  const handleIndividualCheckbox = (warehouseId) => {
    setSelectedWarehouses(prev => {
      if (prev.includes(warehouseId)) {
        return prev.filter(id => id !== warehouseId);
      } else {
        return [...prev, warehouseId];
      }
    });
  };

  // Fungsi untuk handle select all
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedWarehouses([]);
    } else {
      const allIds = filteredWarehouses.map(warehouse => warehouse.id);
      setSelectedWarehouses(allIds);
    }
    setSelectAll(!selectAll);
  };

  // Fungsi untuk lihat detail warehouse
  const handleViewDetail = (warehouse) => {
    setSelectedWarehouse(warehouse);
    setShowDetailModal(true);
  };

  // Fungsi untuk hapus data tunggal
  const handleDeleteSingle = (warehouseId, warehouseName) => {
    if (window.confirm(`Are you sure you want to delete warehouse "${warehouseName}"?`)) {
      setWarehouses(prev => prev.filter(wh => wh.id !== warehouseId));
      setSelectedWarehouses(prev => prev.filter(id => id !== warehouseId));
    }
  };

  // Fungsi untuk hapus multiple
  const handleDeleteMultiple = () => {
    if (selectedWarehouses.length === 0) {
      alert("Please select at least one warehouse to delete.");
      return;
    }
    setShowDeleteConfirm(true);
  };

  // Konfirmasi hapus multiple
  const confirmDeleteMultiple = () => {
    setWarehouses(prev => prev.filter(wh => !selectedWarehouses.includes(wh.id)));
    setSelectedWarehouses([]);
    setSelectAll(false);
    setShowDeleteConfirm(false);
  };

  // Cancel hapus multiple
  const cancelDeleteMultiple = () => {
    setShowDeleteConfirm(false);
  };

  // Fungsi untuk tambah/edit warehouse
  const openAdd = () => {
    setEditId(null);
    setNewWarehouse({
      name: "",
      code: `WH-${String(warehouses.length + 1).padStart(3, '0')}`,
      location: "",
      address: "",
      manager: "",
      phone: "",
      email: "",
      capacity: "",
      status: "Active",
    });
    setShowAddForm(true);
  };

  const openEdit = (warehouse) => {
    setEditId(warehouse.id);
    setNewWarehouse(warehouse);
    setShowAddForm(true);
  };

  const saveWarehouse = () => {
    if (!newWarehouse.name || !newWarehouse.code || !newWarehouse.location || !newWarehouse.manager) {
      alert("Please fill all required fields");
      return;
    }

    if (editId) {
      setWarehouses(warehouses.map(wh => wh.id === editId ? newWarehouse : wh));
    } else {
      setWarehouses([...warehouses, { ...newWarehouse, id: warehouses.length > 0 ? Math.max(...warehouses.map(w => w.id)) + 1 : 1 }]);
    }
    setShowAddForm(false);
    setEditId(null);
  };

  // Fungsi untuk reset form
  const resetForm = () => {
    setNewWarehouse({
      name: "",
      code: "",
      location: "",
      address: "",
      manager: "",
      phone: "",
      email: "",
      capacity: "",
      status: "Active",
    });
    setShowAddForm(false);
    setEditId(null);
  };

  // Calculate capacity percentage
  const getCapacityPercentage = (used, capacity) => {
    return Math.round((used / capacity) * 100);
  };

  // Get capacity color
  const getCapacityColor = (percentage) => {
    if (percentage >= 90) return 'text-red-600 bg-red-100';
    if (percentage >= 70) return 'text-yellow-600 bg-yellow-100';
    return 'text-green-600 bg-green-100';
  };

  return (
      <div className="p-6 min-h-screen bg-blue-50 dark:bg-slate-800">
        {/* Header dengan tombol New Warehouse */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Building className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Warehouses</h1>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Manage warehouse locations | Total: {warehouses.length} warehouses
              </p>
            </div>
          </div>
          
          <div className="flex gap-2">
            {selectedWarehouses.length > 0 && (
              <button
                onClick={handleDeleteMultiple}
                className="inline-flex items-center px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-medium hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete ({selectedWarehouses.length})
              </button>
            )}
            
            {!showAddForm && (
              <button
                onClick={openAdd}
                className="inline-flex items-center px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                New Warehouse
              </button>
            )}
          </div>
        </div>

        {/* Modal Detail Warehouse */}
        {showDetailModal && selectedWarehouse && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              {/* Header Modal */}
              <div className="flex justify-between items-center p-6 border-b">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Building className="w-5 h-5 text-purple-600" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-800">Warehouse Details</h2>
                </div>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* Detail Content */}
              <div className="p-6 space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Warehouse Name</h3>
                    <p className="text-lg font-semibold text-gray-900">{selectedWarehouse.name}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Code</h3>
                    <p className="text-lg font-semibold text-purple-600">{selectedWarehouse.code}</p>
                  </div>
                </div>

                {/* Location Info */}
                <div className="border-t pt-4">
                  <h3 className="text-sm font-medium text-gray-500 mb-3">Location Information</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-900">{selectedWarehouse.location}</span>
                    </div>
                    <p className="text-gray-600 ml-6">{selectedWarehouse.address}</p>
                  </div>
                </div>

                {/* Manager Info */}
                <div className="border-t pt-4">
                  <h3 className="text-sm font-medium text-gray-500 mb-3">Manager Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Name</p>
                      <p className="text-gray-900">{selectedWarehouse.manager}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      <p className="text-gray-900">{selectedWarehouse.phone}</p>
                    </div>
                    <div className="md:col-span-2">
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="text-gray-900">{selectedWarehouse.email}</p>
                    </div>
                  </div>
                </div>

                {/* Capacity Info */}
                <div className="border-t pt-4">
                  <h3 className="text-sm font-medium text-gray-500 mb-3">Capacity Information</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Used Space</span>
                      <span className="text-sm font-medium">{selectedWarehouse.used} / {selectedWarehouse.capacity} units</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all ${
                          getCapacityPercentage(selectedWarehouse.used, selectedWarehouse.capacity) >= 90
                            ? 'bg-red-500'
                            : getCapacityPercentage(selectedWarehouse.used, selectedWarehouse.capacity) >= 70
                            ? 'bg-yellow-500'
                            : 'bg-green-500'
                        }`}
                        style={{ width: `${getCapacityPercentage(selectedWarehouse.used, selectedWarehouse.capacity)}%` }}
                      />
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Utilization</span>
                      <span className={`text-sm font-medium px-2 py-1 rounded ${getCapacityColor(getCapacityPercentage(selectedWarehouse.used, selectedWarehouse.capacity))}`}>
                        {getCapacityPercentage(selectedWarehouse.used, selectedWarehouse.capacity)}%
                      </span>
                    </div>
                  </div>
                </div>

                {/* Status */}
                <div className="border-t pt-4">
                  <h3 className="text-sm font-medium text-gray-500 mb-3">Status</h3>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    selectedWarehouse.status === 'Active' 
                      ? 'bg-green-100 text-green-800'
                      : selectedWarehouse.status === 'Full'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {selectedWarehouse.status}
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4 border-t">
                  <button
                    onClick={() => openEdit(selectedWarehouse)}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                  >
                    <Edit className="w-4 h-4 mr-2 inline" />
                    Edit Warehouse
                  </button>
                  <button
                    onClick={() => setShowDetailModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal Konfirmasi Hapus Multiple */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <Trash2 className="w-5 h-5 text-red-600" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-800">Delete Warehouses</h2>
                </div>
                
                <p className="text-gray-700 mb-6">
                  Are you sure you want to delete {selectedWarehouses.length} selected warehouse(s)? 
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

        {/* Form Add/Edit Warehouse (Modal Style) */}
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
                    {editId ? "Edit Warehouse" : "New Warehouse"}
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
                {/* Name Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Warehouse Name *
                  </label>
                  <input
                    type="text"
                    placeholder="Enter warehouse name"
                    value={newWarehouse.name}
                    onChange={(e) => setNewWarehouse({ ...newWarehouse, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                {/* Code Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Code *
                  </label>
                  <input
                    type="text"
                    placeholder="Enter warehouse code"
                    value={newWarehouse.code}
                    onChange={(e) => setNewWarehouse({ ...newWarehouse, code: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                {/* Location Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location *
                  </label>
                  <input
                    type="text"
                    placeholder="Enter location"
                    value={newWarehouse.location}
                    onChange={(e) => setNewWarehouse({ ...newWarehouse, location: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                {/* Address Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address
                  </label>
                  <textarea
                    placeholder="Enter full address"
                    value={newWarehouse.address}
                    onChange={(e) => setNewWarehouse({ ...newWarehouse, address: e.target.value })}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Manager Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Manager Name *
                  </label>
                  <input
                    type="text"
                    placeholder="Enter manager name"
                    value={newWarehouse.manager}
                    onChange={(e) => setNewWarehouse({ ...newWarehouse, manager: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                {/* Phone Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    placeholder="Enter phone number"
                    value={newWarehouse.phone}
                    onChange={(e) => setNewWarehouse({ ...newWarehouse, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Email Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    placeholder="Enter email address"
                    value={newWarehouse.email}
                    onChange={(e) => setNewWarehouse({ ...newWarehouse, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Capacity Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Capacity
                  </label>
                  <input
                    type="number"
                    placeholder="Enter capacity"
                    value={newWarehouse.capacity}
                    onChange={(e) => setNewWarehouse({ ...newWarehouse, capacity: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Status Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    value={newWarehouse.status}
                    onChange={(e) => setNewWarehouse({ ...newWarehouse, status: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Full">Full</option>
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
                    onClick={saveWarehouse}
                    disabled={!newWarehouse.name || !newWarehouse.code || !newWarehouse.location || !newWarehouse.manager}
                    className={`flex-1 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                      !newWarehouse.name || !newWarehouse.code || !newWarehouse.location || !newWarehouse.manager
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-blue-600 text-white hover:bg-blue-700"
                    }`}
                  >
                    {editId ? "Update Warehouse" : "Create Warehouse"}
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
                placeholder="Search warehouse name, code, location, or manager..."
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
              <div className="absolute right-4 mt-32 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                <button
                  onClick={() => {
                    setSelectedStatus("All");
                    setShowFilter(false);
                  }}
                  className={`block w-full text-left px-4 py-2 hover:bg-gray-100 ${selectedStatus === "All" ? "bg-purple-50 text-purple-600" : ""}`}
                >
                  All Status
                </button>
                <button
                  onClick={() => {
                    setSelectedStatus("Active");
                    setShowFilter(false);
                  }}
                  className={`block w-full text-left px-4 py-2 hover:bg-gray-100 ${selectedStatus === "Active" ? "bg-purple-50 text-purple-600" : ""}`}
                >
                  Active
                </button>
                <button
                  onClick={() => {
                    setSelectedStatus("Full");
                    setShowFilter(false);
                  }}
                  className={`block w-full text-left px-4 py-2 hover:bg-gray-100 ${selectedStatus === "Full" ? "bg-purple-50 text-purple-600" : ""}`}
                >
                  Full
                </button>
                <button
                  onClick={() => {
                    setSelectedStatus("Inactive");
                    setShowFilter(false);
                  }}
                  className={`block w-full text-left px-4 py-2 hover:bg-gray-100 ${selectedStatus === "Inactive" ? "bg-purple-50 text-purple-600" : ""}`}
                >
                  Inactive
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Warehouses Table */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-slate-700">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-slate-700 border-b border-gray-200 dark:border-slate-600">
                <tr>
                  <th className="px-6 py-4 text-left">
                    <input
                      type="checkbox"
                      checked={selectAll}
                      onChange={handleSelectAll}
                      className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Warehouse Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Code</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Location</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Capacity</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                    </tr>
              </thead>

              <tbody className="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-slate-700">
                {filteredWarehouses.length > 0 ? (
                  filteredWarehouses.map((warehouse, index) => (
                    <tr key={warehouse.id} className="hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedWarehouses.includes(warehouse.id)}
                          onChange={() => handleIndividualCheckbox(warehouse.id)}
                          className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-slate-600 flex items-center justify-center">
                              <Building className="h-6 w-6 text-gray-500 dark:text-gray-400" />
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{warehouse.name}</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">{warehouse.code}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">{warehouse.location}</td>
                      <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">{warehouse.manager}</td>
                      <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                        <div className="flex items-center">
                          <div className="flex-1">
                            <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{warehouse.used}/{warehouse.capacity}</div>
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                              <div 
                                className={`h-2 rounded-full ${
                                  (warehouse.used / warehouse.capacity) >= 0.9 
                                    ? "bg-red-500" 
                                    : (warehouse.used / warehouse.capacity) >= 0.7 
                                    ? "bg-yellow-500" 
                                    : "bg-green-500"
                                }`}
                                style={{ width: `${(warehouse.used / warehouse.capacity) * 100}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          warehouse.status === "Active" 
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" 
                            : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                        }`}>
                          {warehouse.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right text-sm font-medium">
                        <button
                          onClick={() => openDetail(warehouse)}
                          className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 mr-3"
                        >
                          View
                        </button>
                        <button
                          onClick={() => openEdit(warehouse)}
                          className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 mr-3"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => openDelete([warehouse.id])}
                          className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="px-6 py-12 text-center">
                      <Building className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500 mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                        {search ? "No warehouses found" : "No warehouses yet"}
                      </h3>
                      <p className="text-gray-500 dark:text-gray-400 mb-4">
                        {search 
                          ? "Try adjusting your search term" 
                          : "Get started by adding your first warehouse."}
                      </p>
                      {!search && (
                        <button
                          onClick={openAdd}
                          className="inline-flex items-center px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add Your First Warehouse
                        </button>
                      )}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
                            <span>{warehouse.used} / {warehouse.capacity}</span>
                            <span className={`font-medium ${getCapacityPercentage(warehouse.used, warehouse.capacity) >= 90 ? 'text-red-600' : getCapacityPercentage(warehouse.used, warehouse.capacity) >= 70 ? 'text-yellow-600' : 'text-green-600'}`}>
                              {getCapacityPercentage(warehouse.used, warehouse.capacity)}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-1.5">
                            <div 
                              className={`h-1.5 rounded-full transition-all ${
                                getCapacityPercentage(warehouse.used, warehouse.capacity) >= 90
                                  ? 'bg-red-500'
                                  : getCapacityPercentage(warehouse.used, warehouse.capacity) >= 70
                                  ? 'bg-yellow-500'
                                  : 'bg-green-500'
                              }`}
                              style={{ width: `${getCapacityPercentage(warehouse.used, warehouse.capacity)}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap border-r border-gray-100">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          warehouse.status === 'Active' 
                            ? 'bg-green-100 text-green-800'
                            : warehouse.status === 'Full'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {warehouse.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleViewDetail(warehouse)}
                            className="inline-flex items-center px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-200"
                            title="View details"
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="px-6 py-12 text-center">
                      <Building className="mx-auto h-12 w-12 text-gray-400" />
                      <h3 className="mt-2 text-sm font-medium text-gray-900">No warehouses found</h3>
                      <p className="mt-1 text-sm text-gray-500">
                        {search || selectedStatus !== "All" 
                          ? "Try adjusting your search or filter" 
                          : "Get started by creating a new warehouse."}
                      </p>
                      {!search && selectedStatus === "All" && (
                        <button
                          onClick={openAdd}
                          className="mt-4 inline-flex items-center px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Create Your First Warehouse
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
                <span>Showing {filteredWarehouses.length} of {warehouses.length} warehouses</span>
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
