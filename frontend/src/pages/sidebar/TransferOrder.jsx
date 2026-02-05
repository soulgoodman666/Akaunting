import { useState, useEffect } from "react";
import { 
  Truck, Plus, X, Search, Edit, Eye, Trash2, CheckSquare, Square,
} from "lucide-react";

export default function TransferOrder() {
  const [transfers, setTransfers] = useState([]);
  const [items, setItems] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [selectedTransfers, setSelectedTransfers] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedTransfer, setSelectedTransfer] = useState(null);

  const [form, setForm] = useState({
    kode: "",
    item_id: "",
    from_warehouse_id: "",
    to_warehouse_id: "",
    jumlah: "",
    status: "pending",
    tanggal_transfer: new Date().toISOString().split('T')[0],
    catatan: ""
  });

  // Load items and warehouses for dropdowns
  const fetchItems = async () => {
    try {
      console.log('Fetching items for dropdown...');
      const response = await fetch('http://localhost:8080/items');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Items loaded:', data);
      setItems(data);
    } catch (error) {
      console.error('Error fetching items:', error);
      // Use default data if backend is not available
      setItems([
        { id: 1, kode: "M090", nama: "Gas Argon" },
        { id: 2, kode: "M089", nama: "Gas Oksigen" },
        { id: 3, kode: "M088", nama: "Gas Nitrogen" },
        { id: 4, kode: "M087", nama: "Gas Helium" },
        { id: 5, kode: "M086", nama: "Gas Propane" }
      ]);
    }
  };

  const fetchWarehouses = async () => {
    try {
      console.log('Fetching warehouses for dropdown...');
      const response = await fetch('http://localhost:8080/warehouses');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Warehouses loaded:', data);
      setWarehouses(data);
    } catch (error) {
      console.error('Error fetching warehouses:', error);
      // Use default data if backend is not available
      setWarehouses([
        { id: 1, nama: "Gudang Utama Jakarta" },
        { id: 2, nama: "Gudang Cabang Surabaya" },
        { id: 3, nama: "Gudang Distribusi Bandung" }
      ]);
    }
  };

  // Load transfers from backend when component mounts
  const fetchTransfers = async () => {
    try {
      setLoading(true);
      console.log('Fetching transfers from backend...');
      const response = await fetch('http://localhost:8080/transfers');
      
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Transfers loaded:', data);
      setTransfers(data);
    } catch (error) {
      console.error('Error fetching transfers:', error);
      // Use default data if backend is not available
      setTransfers([
        {
          id: 1,
          kode: "TO-00001",
          item_id: 1,
          from_warehouse_id: 1,
          to_warehouse_id: 2,
          jumlah: 15,
          status: "completed",
          tanggal_transfer: "2024-01-08",
          catatan: "Standard transfer for job site requirements"
        },
        {
          id: 2,
          kode: "TO-00002", 
          item_id: 2,
          from_warehouse_id: 1,
          to_warehouse_id: 2,
          jumlah: 10,
          status: "pending",
          tanggal_transfer: "2024-01-10",
          catatan: "Urgent transfer needed"
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch transfers, items, and warehouses on component mount
  useEffect(() => {
    fetchTransfers();
    fetchItems();
    fetchWarehouses();
  }, []);

  const filteredTransfers = transfers.filter(transfer =>
    transfer.kode.toLowerCase().includes(search.toLowerCase()) ||
    transfer.status.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedTransfers([]);
    } else {
      setSelectedTransfers(filteredTransfers.map(transfer => transfer.id));
    }
    setSelectAll(!selectAll);
  };

  const handleSelectTransfer = (transferId) => {
    if (selectedTransfers.includes(transferId)) {
      setSelectedTransfers(selectedTransfers.filter(id => id !== transferId));
    } else {
      setSelectedTransfers([...selectedTransfers, transferId]);
    }
  };

  const openAdd = () => {
    setEditId(null);
    setForm({
      kode: "",
      item_id: "",
      from_warehouse_id: "",
      to_warehouse_id: "",
      jumlah: "",
      status: "pending",
      tanggal_transfer: new Date().toISOString().split('T')[0],
      catatan: ""
    });
    setShowAddForm(true);
  };

  const openEdit = (transfer) => {
    setEditId(transfer.id);
    setForm({
      kode: transfer.kode,
      item_id: transfer.item_id,
      from_warehouse_id: transfer.from_warehouse_id,
      to_warehouse_id: transfer.to_warehouse_id,
      jumlah: transfer.jumlah,
      status: transfer.status,
      tanggal_transfer: transfer.tanggal_transfer,
      catatan: transfer.catatan
    });
    setShowAddForm(true);
  };

  const closeAdd = () => {
    setShowAddForm(false);
    setEditId(null);
    setForm({
      kode: "",
      item_id: "",
      from_warehouse_id: "",
      to_warehouse_id: "",
      jumlah: "",
      status: "pending",
      tanggal_transfer: new Date().toISOString().split('T')[0],
      catatan: ""
    });
  };

  const saveTransfer = async () => {
    if (!form.kode || !form.item_id || !form.from_warehouse_id || !form.to_warehouse_id || !form.jumlah) {
      alert("Please fill all required fields");
      return;
    }

    if (form.from_warehouse_id === form.to_warehouse_id) {
      alert("Source and destination cannot be the same");
      return;
    }

    const transferData = {
      ...form,
      item_id: parseInt(form.item_id) || 0,
      from_warehouse_id: parseInt(form.from_warehouse_id) || 0,
      to_warehouse_id: parseInt(form.to_warehouse_id) || 0,
      jumlah: parseInt(form.jumlah) || 0,
    };

    console.log("Saving transfer:", transferData);

    try {
      let response;
      if (editId) {
        // Update existing transfer
        response = await fetch(`http://localhost:8080/transfers/${editId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(transferData),
        });
      } else {
        // Add new transfer
        response = await fetch('http://localhost:8080/transfers', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(transferData),
        });
      }

      console.log("Response status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Response error:", errorText);
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }

      const savedTransfer = await response.json();
      console.log("Saved transfer:", savedTransfer);
      
      // Create history record for transfer
      try {
        const historyResponse = await fetch('http://localhost:8080/api/v1/history/transfer', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            transfer_id: savedTransfer.id,
            action: 'create',
            user_id: 1 // Default user for now
          })
        });
        if (historyResponse.ok) {
          console.log('History created for transfer');
          // Refresh history data
          setTimeout(() => {
            window.location.reload(); // Refresh page to show new data
          }, 1000);
        } else {
          console.log('History creation failed, but transfer saved successfully');
        }
      } catch (error) {
        console.error('Error creating history:', error);
      }
      
      // Update local state
      if (editId) {
        setTransfers(transfers.map(t => t.id === editId ? { ...savedTransfer, id: editId } : t));
      } else {
        setTransfers([...transfers, savedTransfer]);
      }

      closeAdd();
      alert(editId ? "Transfer updated successfully!" : "Transfer created successfully!");
      
    } catch (error) {
      console.error('Error saving transfer:', error);
      alert("Failed to save transfer. Please try again. Error: " + error.message);
    }
  };

  const deleteTransfer = async (id, kode) => {
    if (window.confirm(`Are you sure you want to delete transfer "${kode}"?`)) {
      try {
        const response = await fetch(`http://localhost:8080/transfers/${id}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Update local state
        setTransfers(transfers.filter(t => t.id !== id));
        setSelectedTransfers(prev => prev.filter(transferId => transferId !== id));
        alert("Transfer deleted successfully!");
        
      } catch (error) {
        console.error('Error deleting transfer:', error);
        alert("Failed to delete transfer. Please try again.");
      }
    }
  };

  const handleDeleteSingle = (transferId, transferKode) => {
    if (confirm(`Are you sure you want to delete transfer "${transferKode}"?`)) {
      deleteTransfer(transferId, transferKode);
    }
  };

  const handleDeleteMultiple = () => {
    if (selectedTransfers.length === 0) {
      alert("Please select at least one transfer to delete");
      return;
    }
    setShowDeleteConfirm(true);
  };

  const confirmDeleteMultiple = () => {
    selectedTransfers.forEach(transferId => {
      const transfer = transfers.find(t => t.id === transferId);
      if (transfer) {
        deleteTransfer(transferId, transfer.kode);
      }
    });
    setSelectedTransfers([]);
    setSelectAll(false);
    setShowDeleteConfirm(false);
  };

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const cancelDeleteMultiple = () => {
    setShowDeleteConfirm(false);
  };

  return (
    <div className="h-screen p-6 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900 overflow-y-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 backdrop-blur-sm bg-opacity-90">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                <Truck className="w-8 h-8 text-blue-600" />
                Transfer Orders
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-2">Manage inventory transfers between warehouses</p>
            </div>
            <button
              onClick={openAdd}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl flex items-center gap-2 transition-all duration-200 shadow-lg hover:shadow-xl"
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
                  <p className="text-2xl font-bold text-orange-900 dark:text-orange-100">{transfers.length}</p>
                </div>
                <Truck className="w-8 h-8 text-orange-500" />
              </div>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl p-4 border border-green-200 dark:border-green-800">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-green-600 dark:text-green-400 font-medium">Selesai</p>
                  <p className="text-2xl font-bold text-green-900 dark:text-green-100">{transfers.filter(t => t.status === 'completed').length}</p>
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
                  <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">{transfers.filter(t => t.status === 'pending').length}</p>
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
                  <p className="text-2xl font-bold text-yellow-900 dark:text-yellow-100">{transfers.filter(t => t.status === 'approved').length}</p>
                </div>
                <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">!</span>
                </div>
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative max-w-md">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search transfers..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
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
                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">Delete Transfers</h2>
              </div>
              
              <p className="text-gray-700 dark:text-gray-300 mb-6">
                Are you sure you want to delete {selectedTransfers.length} selected transfer(s)? 
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

            <form onSubmit={saveTransfer} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Transfer Code</label>
                <input 
                  type="text" 
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" 
                  value={form.kode} 
                  onChange={(e) => setForm({ ...form, kode: e.target.value })} 
                  placeholder="TO-00001" 
                  required 
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Item</label>
                <select 
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" 
                  value={form.item_id} 
                  onChange={(e) => setForm({ ...form, item_id: e.target.value })} 
                  required 
                >
                  <option value="">Select Item</option>
                  {items.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.kode} - {item.nama}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">From Warehouse</label>
                  <select 
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" 
                    value={form.from_warehouse_id} 
                    onChange={(e) => setForm({ ...form, from_warehouse_id: e.target.value })} 
                    required 
                  >
                    <option value="">Select Warehouse</option>
                    {warehouses.map((warehouse) => (
                      <option key={warehouse.id} value={warehouse.id}>
                        {warehouse.nama}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">To Warehouse</label>
                  <select 
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" 
                    value={form.to_warehouse_id} 
                    onChange={(e) => setForm({ ...form, to_warehouse_id: e.target.value })} 
                    required 
                  >
                    <option value="">Select Warehouse</option>
                    {warehouses.map((warehouse) => (
                      <option key={warehouse.id} value={warehouse.id}>
                        {warehouse.nama}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Quantity</label>
                  <input 
                    type="number" 
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" 
                    value={form.jumlah} 
                    onChange={(e) => setForm({ ...form, jumlah: e.target.value })} 
                    placeholder="10" 
                    min="0" 
                    required 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Status</label>
                  <select 
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" 
                    value={form.status} 
                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                  >
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="in_transit">Diperjalanan</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Transfer Date</label>
                <input 
                  type="date" 
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" 
                  value={form.tanggal_transfer} 
                  onChange={(e) => setForm({ ...form, tanggal_transfer: e.target.value })} 
                  required 
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Notes</label>
                <textarea 
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" 
                  value={form.catatan} 
                  onChange={(e) => setForm({ ...form, catatan: e.target.value })} 
                  placeholder="Additional notes..." 
                  rows="3"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button type="button" onClick={closeAdd} className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors">Cancel</button>
                <button type="submit" className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors">{editId ? "Update" : "Save"}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Transfer Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectAll}
                    onChange={handleSelectAll}
                    className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Transfer Code</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Item</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">From Warehouse</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">To Warehouse</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Quantity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>

            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredTransfers.length > 0 ? (
                filteredTransfers.map((transfer) => (
                  <tr key={transfer.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors group">
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedTransfers.includes(transfer.id)}
                        onChange={(e) => { e.stopPropagation(); handleSelectTransfer(transfer.id); }}
                        className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <Truck className="w-4 h-4 text-gray-400 mr-2" />
                        <span className="text-sm font-medium text-gray-900 dark:text-white">{transfer.kode}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                      {(() => {
                        const item = items.find(i => i.id === transfer.item_id);
                        return item ? `${item.kode} - ${item.nama}` : transfer.item_id;
                      })()}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                      {(() => {
                        const warehouse = warehouses.find(w => w.id === transfer.from_warehouse_id);
                        return warehouse ? warehouse.nama : transfer.from_warehouse_id;
                      })()}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                      {(() => {
                        const warehouse = warehouses.find(w => w.id === transfer.to_warehouse_id);
                        return warehouse ? warehouse.nama : transfer.to_warehouse_id;
                      })()}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">{transfer.jumlah}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        transfer.status === 'completed' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' 
                          : transfer.status === 'approved'
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
                          : transfer.status === 'in_transit'
                          ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400'
                          : transfer.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
                      }`}>
                        {transfer.status === 'in_transit' ? 'Diperjalanan' : transfer.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">{transfer.tanggal_transfer}</td>
                    <td className="px-6 py-4 text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <button
                          onClick={(e) => { e.stopPropagation(); setSelectedTransfer(transfer); }}
                          className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                          title="View details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); openEdit(transfer); }}
                          className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                          title="Edit transfer"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleDeleteSingle(transfer.id, transfer.kode); }}
                          className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                          title="Delete transfer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="px-6 py-12 text-center">
                    <Truck className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                      {search ? "No transfers found" : "No transfers yet"}
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400">
                      {search ? "Try adjusting your search terms" : "Create your first transfer to get started"}
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
