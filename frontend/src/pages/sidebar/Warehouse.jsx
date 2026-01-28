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
  Eye,
  Activity,
  Calendar,
  BarChart3,
} from "lucide-react";

export default function Warehouse() {
  const [search, setSearch] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedWarehouses, setSelectedWarehouses] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [editId, setEditId] = useState(null);
  const [selectedWarehouse, setSelectedWarehouse] = useState(null);

  const [form, setForm] = useState({
    name: "",
    code: "",
    location: "",
    address: "",
    manager: "",
    phone: "",
    email: "",
    capacity: "",
  });

  const [warehouses, setWarehouses] = useState([
    { 
      id: 1, 
      name: 'Main Warehouse', 
      code: 'WH-001', 
      location: 'Jakarta Pusat', 
      address: 'Jl. Sudirman No. 123',
      manager: 'John Doe',
      phone: '+62 21 1234 5678',
      email: 'john@company.com',
      capacity: 1000,
      used: 750,
      status: 'Active',
      type: 'Main Distribution',
      establishedDate: '2020-01-15',
      operatingHours: '08:00 - 17:00',
      totalItems: 450,
      lastInventory: '2024-01-10'
    },
    { 
      id: 2, 
      name: 'Secondary Warehouse', 
      code: 'WH-002', 
      location: 'Jakarta Utara', 
      address: 'Jl. Ancol No. 456',
      manager: 'Jane Smith',
      phone: '+62 21 8765 4321',
      email: 'jane@company.com',
      capacity: 500,
      used: 200,
      status: 'Active',
      type: 'Regional Storage',
      establishedDate: '2021-03-20',
      operatingHours: '09:00 - 18:00',
      totalItems: 120,
      lastInventory: '2024-01-08'
    },
    { 
      id: 3, 
      name: 'Distribution Center', 
      code: 'WH-003', 
      location: 'Surabaya', 
      address: 'Jl. Gubeng Pojok No. 789',
      manager: 'Mike Johnson',
      phone: '+62 31 9876 5432',
      email: 'mike@company.com',
      capacity: 800,
      used: 600,
      status: 'Active',
      type: 'Distribution Hub',
      establishedDate: '2019-07-10',
      operatingHours: '07:00 - 19:00',
      totalItems: 320,
      lastInventory: '2024-01-12'
    },
  ]);

  const filteredWarehouses = warehouses.filter((warehouse) =>
    warehouse.name.toLowerCase().includes(search.toLowerCase()) ||
    warehouse.code.toLowerCase().includes(search.toLowerCase()) ||
    warehouse.location.toLowerCase().includes(search.toLowerCase())
  );

  const handleIndividualCheckbox = (warehouseId) => {
    setSelectedWarehouses(prev => {
      if (prev.includes(warehouseId)) {
        return prev.filter(id => id !== warehouseId);
      } else {
        return [...prev, warehouseId];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedWarehouses([]);
    } else {
      setSelectedWarehouses(filteredWarehouses.map(warehouse => warehouse.id));
    }
    setSelectAll(!selectAll);
  };

  const openAdd = () => {
    setForm({ 
      name: "", 
      code: "", 
      location: "", 
      address: "",
      manager: "",
      phone: "",
      email: "",
      capacity: "",
    });
    setEditId(null);
    setShowAddForm(true);
  };

  const openEdit = (warehouse) => {
    setForm({
      name: warehouse.name,
      code: warehouse.code,
      location: warehouse.location,
      address: warehouse.address,
      manager: warehouse.manager,
      phone: warehouse.phone,
      email: warehouse.email,
      capacity: warehouse.capacity,
    });
    setEditId(warehouse.id);
    setShowAddForm(true);
  };

  const closeForm = () => {
    setShowAddForm(false);
    setEditId(null);
    setForm({ 
      name: "", 
      code: "", 
      location: "", 
      address: "",
      manager: "",
      phone: "",
      email: "",
      capacity: "",
    });
  };

  const saveWarehouse = () => {
    if (editId) {
      setWarehouses(warehouses.map(w => w.id === editId ? { ...form, id: editId, used: w.used, status: w.status } : w));
    } else {
      setWarehouses([...warehouses, { ...form, id: warehouses.length > 0 ? Math.max(...warehouses.map(w => w.id)) + 1 : 1, used: 0, status: 'Active' }]);
    }
    closeForm();
  };

  const openDelete = (warehouseIds) => {
    setSelectedWarehouses(warehouseIds);
    setShowDeleteConfirm(true);
  };

  const deleteWarehouses = () => {
    setWarehouses(warehouses.filter(warehouse => !selectedWarehouses.includes(warehouse.id)));
    setShowDeleteConfirm(false);
    setSelectedWarehouses([]);
    setSelectAll(false);
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setSelectedWarehouses([]);
  };

  const getCapacityPercentage = (used, capacity) => {
    return Math.round((used / capacity) * 100);
  };

  const getCapacityColor = (percentage) => {
    if (percentage >= 90) return 'text-red-600 bg-red-100';
    if (percentage >= 70) return 'text-yellow-600 bg-yellow-100';
    return 'text-green-600 bg-green-100';
  };

  return (
    <div className="h-screen p-6 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900 overflow-y-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 backdrop-blur-sm bg-opacity-90">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl shadow-lg">
                <Building className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">Warehouses</h1>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Kelola lokasi gudang dengan efisien</p>
              </div>
            </div>
            
            <button
              onClick={openAdd}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              <Plus size={20} /> Tambah Gudang
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl p-4 border border-purple-200 dark:border-purple-800">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-purple-600 dark:text-purple-400 font-medium">Total Gudang</p>
                  <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">{warehouses.length}</p>
                </div>
                <Building className="w-8 h-8 text-purple-500" />
              </div>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl p-4 border border-green-200 dark:border-green-800">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-green-600 dark:text-green-400 font-medium">Aktif</p>
                  <p className="text-2xl font-bold text-green-900 dark:text-green-100">{warehouses.filter(w => w.status === 'Active').length}</p>
                </div>
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">✓</span>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">Total Kapasitas</p>
                  <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">{warehouses.reduce((sum, w) => sum + w.capacity, 0)}</p>
                </div>
                <Package className="w-8 h-8 text-blue-500" />
              </div>
            </div>
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-xl p-4 border border-orange-200 dark:border-orange-800">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-orange-600 dark:text-orange-400 font-medium">Terpakai</p>
                  <p className="text-2xl font-bold text-orange-900 dark:text-orange-100">{warehouses.reduce((sum, w) => sum + w.used, 0)}</p>
                </div>
                <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative max-w-md">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
              placeholder="Cari gudang berdasarkan nama, kode, atau lokasi..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Table */}
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Manager</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Capacity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>

            <tbody className="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-slate-700">
              {filteredWarehouses.length > 0 ? (
                filteredWarehouses.map((warehouse) => (
                  <tr key={warehouse.id} className="hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors cursor-pointer" onClick={() => setSelectedWarehouse(warehouse)}>
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedWarehouses.includes(warehouse.id)}
                        onChange={(e) => { e.stopPropagation(); handleIndividualCheckbox(warehouse.id); }}
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
                          <div className="text-sm text-gray-500 dark:text-gray-400">{warehouse.address}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">{warehouse.code}</td>
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">{warehouse.location}</td>
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">{warehouse.manager}</td>
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                      <div className="flex items-center">
                        <div className="flex-1">
                          <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{warehouse.used}/{warehouse.capacity}</div>
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${
                                getCapacityPercentage(warehouse.used, warehouse.capacity) >= 90
                                  ? 'bg-red-500'
                                  : getCapacityPercentage(warehouse.used, warehouse.capacity) >= 70
                                  ? 'bg-yellow-500'
                                  : 'bg-green-500'
                              }`}
                              style={{ width: `${getCapacityPercentage(warehouse.used, warehouse.capacity)}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        warehouse.status === 'Active' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                      }`}>
                        {warehouse.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right text-sm font-medium">
                      <button
                        onClick={(e) => { e.stopPropagation(); openEdit(warehouse); }}
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 mr-3"
                      >
                        Edit
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); openDelete([warehouse.id]); }}
                        className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 mr-3"
                      >
                        Delete
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); setSelectedWarehouse(warehouse); }}
                        className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="px-6 py-12 text-center">
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

      {/* Modal Add/Edit Form */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-900 dark:bg-gray-900 rounded-lg shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto border border-gray-700">
            <div className="flex justify-between items-center p-6 border-b border-gray-700 sticky top-0 bg-gray-900">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-600 rounded-lg">
                  {editId ? <Edit className="w-5 h-5 text-white" /> : <Plus className="w-5 h-5 text-white" />}
                </div>
                <h2 className="text-xl font-bold text-white">
                  {editId ? "Edit Warehouse" : "New Warehouse"}
                </h2>
              </div>
              <button
                onClick={closeForm}
                className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {["name", "code", "location", "address", "manager", "phone", "email", "capacity"].map((field) => (
                <div key={field}>
                  <label className="block text-sm font-medium text-gray-300 mb-2 capitalize">
                    {field} *
                  </label>
                  <input
                    type={field === "capacity" ? "number" : "text"}
                    placeholder={`Enter ${field}`}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    value={form[field]}
                    onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                  />
                </div>
              ))}

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={closeForm}
                  className="flex-1 px-4 py-2 border border-gray-600 text-gray-300 rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={saveWarehouse}
                  disabled={!form.name || !form.code || !form.location || !form.manager || !form.capacity}
                  className={`flex-1 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors ${
                    !form.name || !form.code || !form.location || !form.manager || !form.capacity
                      ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                      : "bg-purple-600 text-white hover:bg-purple-700"
                  }`}
                >
                  {editId ? "Update Warehouse" : "Create Warehouse"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Konfirmasi Hapus */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-red-100 rounded-lg">
                  <Trash2 className="w-5 h-5 text-red-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">Delete Warehouses</h2>
              </div>
              
              <p className="text-gray-700 dark:text-gray-300 mb-6">
                Are you sure you want to delete {selectedWarehouses.length} selected warehouse(s)? 
                This action cannot be undone.
              </p>
              
              <div className="flex gap-3">
                <button
                  onClick={cancelDelete}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={deleteWarehouses}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {selectedWarehouse && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-800">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <Building className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">Detail Gudang</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{selectedWarehouse.code}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedWarehouse(null)}
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
                    <Building className="w-5 h-5 text-blue-600" />
                    Informasi Dasar
                  </h3>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Nama Gudang</span>
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">{selectedWarehouse.name}</span>
                    </div>
                    
                    <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Kode</span>
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">{selectedWarehouse.code}</span>
                    </div>
                    
                    <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Tipe</span>
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">{selectedWarehouse.type}</span>
                    </div>
                    
                    <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Status</span>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        selectedWarehouse.status === 'Active' 
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400' 
                          : 'bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400'
                      }`}>
                        {selectedWarehouse.status}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Lokasi & Kontak */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-green-600" />
                    Lokasi & Kontak
                  </h3>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Lokasi</span>
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">{selectedWarehouse.location}</span>
                    </div>
                    
                    <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Alamat</span>
                      <span className="text-sm font-semibold text-gray-900 dark:text-white text-right">{selectedWarehouse.address}</span>
                    </div>
                    
                    <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Telepon</span>
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">{selectedWarehouse.phone}</span>
                    </div>
                    
                    <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Email</span>
                      <span className="text-sm font-semibold text-gray-900 dark:text-white text-right">{selectedWarehouse.email}</span>
                    </div>
                  </div>
                </div>

                {/* Kapasitas & Utilisasi */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-purple-600" />
                    Kapasitas & Utilisasi
                  </h3>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Kapasitas</span>
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">{selectedWarehouse.capacity} unit</span>
                    </div>
                    
                    <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Terpakai</span>
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">{selectedWarehouse.used} unit</span>
                    </div>
                    
                    <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Tersedia</span>
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">{selectedWarehouse.capacity - selectedWarehouse.used} unit</span>
                    </div>
                    
                    <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Utilisasi</span>
                      <span className={`text-sm font-semibold ${
                        getCapacityPercentage(selectedWarehouse.used, selectedWarehouse.capacity) >= 90
                          ? 'text-red-600'
                          : getCapacityPercentage(selectedWarehouse.used, selectedWarehouse.capacity) >= 70
                          ? 'text-yellow-600'
                          : 'text-green-600'
                      }`}>
                        {getCapacityPercentage(selectedWarehouse.used, selectedWarehouse.capacity)}%
                      </span>
                    </div>
                  </div>
                </div>

                {/* Informasi Operasional */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <Activity className="w-5 h-5 text-orange-600" />
                    Informasi Operasional
                  </h3>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Manager</span>
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">{selectedWarehouse.manager}</span>
                    </div>
                    
                    <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Jam Operasional</span>
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">{selectedWarehouse.operatingHours}</span>
                    </div>
                    
                    <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Item</span>
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">{selectedWarehouse.totalItems} item</span>
                    </div>
                    
                    <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Tanggal Didirikan</span>
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">{selectedWarehouse.establishedDate}</span>
                    </div>
                  </div>
                </div>

                {/* Informasi Inventory */}
                <div className="space-y-4 md:col-span-2">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <Package className="w-5 h-5 text-indigo-600" />
                    Informasi Inventory
                  </h3>
                  
                  <div className="mt-4">
                    <div className="flex items-start py-2 border-b border-gray-200 dark:border-gray-700">
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400 mr-4 mt-1">Inventory Terakhir</span>
                      <span className="text-sm text-gray-900 dark:text-white flex-1">{selectedWarehouse.lastInventory}</span>
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
