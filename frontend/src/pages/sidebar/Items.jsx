import { useState } from "react";
import { Box, Plus, Trash2, X, Search, Edit, CheckSquare, Square } from "lucide-react";
import Layout from '../../components/layout/Layout';

export default function Items() {
  const [search, setSearch] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [editId, setEditId] = useState(null);

  const [form, setForm] = useState({
    kode: "",
    nama: "",
    merek: "",
    satuan: "",
    jumlah: "",
  });

  const [items, setItems] = useState([
    { id: 1, kode: "M090", nama: "Gas Argon", merek: "Gas", satuan: "Tube", jumlah: 5 },
    { id: 2, kode: "M089", nama: "Gas Oksigen", merek: "Gas", satuan: "Tube", jumlah: 1 },
    { id: 3, kode: "M088", nama: "Long Back Up", merek: "Welding", satuan: "PCS", jumlah: 0 },
    { id: 4, kode: "M087", nama: "Keramik Las Argon", merek: "Welding", satuan: "PCS", jumlah: 13 },
    { id: 5, kode: "M086", nama: "Body Collet", merek: "Welding", satuan: "PCS", jumlah: 21 },
  ]);

  const filteredItems = items.filter((item) =>
    item.nama.toLowerCase().includes(search.toLowerCase()) ||
    item.kode.toLowerCase().includes(search.toLowerCase()) ||
    item.merek.toLowerCase().includes(search.toLowerCase())
  );

  // Fungsi untuk handle checkbox individual
  const handleIndividualCheckbox = (itemId) => {
    setSelectedItems(prev => {
      if (prev.includes(itemId)) {
        return prev.filter(id => id !== itemId);
      } else {
        return [...prev, itemId];
      }
    });
  };

  // Fungsi untuk handle select all
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedItems([]);
    } else {
      const allIds = filteredItems.map(item => item.id);
      setSelectedItems(allIds);
    }
    setSelectAll(!selectAll);
  };

  // Fungsi untuk hapus data tunggal
  const handleDeleteSingle = (itemId, itemName) => {
    if (window.confirm(`Are you sure you want to delete item "${itemName}"?`)) {
      setItems(prev => prev.filter(item => item.id !== itemId));
      // Hapus juga dari selectedItems jika ada
      setSelectedItems(prev => prev.filter(id => id !== itemId));
    }
  };

  // Fungsi untuk hapus multiple
  const handleDeleteMultiple = () => {
    if (selectedItems.length === 0) {
      alert("Please select at least one item to delete.");
      return;
    }
    setShowDeleteConfirm(true);
  };

  // Konfirmasi hapus multiple
  const confirmDeleteMultiple = () => {
    setItems(prev => prev.filter(item => !selectedItems.includes(item.id)));
    setSelectedItems([]);
    setSelectAll(false);
    setShowDeleteConfirm(false);
  };

  // Cancel hapus multiple
  const cancelDeleteMultiple = () => {
    setShowDeleteConfirm(false);
  };

  const openAdd = () => {
    setEditId(null);
    setForm({ kode: "", nama: "", merek: "", satuan: "", jumlah: "" });
    setShowAddForm(true);
  };

  const openEdit = (item) => {
    setEditId(item.id);
    setForm(item);
    setShowAddForm(true);
  };

  const closeForm = () => {
    setShowAddForm(false);
    setEditId(null);
    setForm({ kode: "", nama: "", merek: "", satuan: "", jumlah: "" });
  };

  const saveItem = () => {
    if (!form.kode || !form.nama || !form.merek || !form.satuan || !form.jumlah) {
      alert("Please fill all required fields");
      return;
    }

    if (editId) {
      setItems(items.map(i => i.id === editId ? { ...form, id: editId } : i));
    } else {
      setItems([...items, { ...form, id: items.length > 0 ? Math.max(...items.map(i => i.id)) + 1 : 1 }]);
    }
    closeForm();
  };

  return (
    <Layout>
      <div className="p-6 bg-blue-50 min-h-screen">
        {/* Header dengan tombol New Item */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Box className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Items</h1>
              <p className="text-gray-600 text-sm">
                Manage your inventory items | Total: {items.length} items
              </p>
            </div>
          </div>
          
          <div className="flex gap-2">
            {selectedItems.length > 0 && (
              <button
                onClick={handleDeleteMultiple}
                className="inline-flex items-center px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-medium hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete ({selectedItems.length})
              </button>
            )}
            
            <button
              onClick={openAdd}
              className="inline-flex items-center px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Item
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
                  <h2 className="text-xl font-bold text-gray-800">Delete Items</h2>
                </div>
                
                <p className="text-gray-700 mb-6">
                  Are you sure you want to delete {selectedItems.length} selected item(s)? 
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

        {/* Modal Add/Edit Form */}
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
                    {editId ? "Edit Item" : "New Item"}
                  </h2>
                </div>
                <button
                  onClick={closeForm}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* Form Content */}
              <div className="p-6 space-y-4">
                {["kode", "nama", "merek", "satuan", "jumlah"].map((field) => (
                  <div key={field}>
                    <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">
                      {field === "jml" ? "Quantity" : field} *
                    </label>
                    <input
                      type={field === "jumlah" ? "number" : "text"}
                      placeholder={`Enter ${field === "jml" ? "quantity" : field}`}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={form[field]}
                      onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                    />
                  </div>
                ))}

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={closeForm}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={saveItem}
                    disabled={!form.kode || !form.nama || !form.merek || !form.satuan || !form.jumlah}
                    className={`flex-1 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                      !form.kode || !form.nama || !form.merek || !form.satuan || !form.jumlah
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-blue-600 text-white hover:bg-blue-700"
                    }`}
                  >
                    {editId ? "Update Item" : "Create Item"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by item name, code, or brand..."
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="p-4 w-12">
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
                  <th className="p-4 text-left">No</th>
                  <th className="p-4 text-left">Code</th>
                  <th className="p-4 text-left">Item Name</th>
                  <th className="p-4 text-center">Brand</th>
                  <th className="p-4 text-center">Unit</th>
                  <th className="p-4 text-center">Qty</th>
                  <th className="p-4 text-left">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y">
                {filteredItems.length > 0 ? (
                  filteredItems.map((item, index) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="p-4">
                        <input
                          type="checkbox"
                          checked={selectedItems.includes(item.id)}
                          onChange={() => handleIndividualCheckbox(item.id)}
                          className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                        />
                      </td>
                      <td className="p-4">{index + 1}</td>
                      <td className="p-4 font-medium">{item.kode}</td>
                      <td className="p-4">{item.nama}</td>
                      <td className="p-4 text-center">
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                          {item.merek}
                        </span>
                      </td>
                      <td className="p-4 text-center">{item.satuan}</td>
                      <td className="p-4 text-center">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          item.jumlah > 10 
                            ? "bg-green-100 text-green-700" 
                            : item.jumlah > 0 
                            ? "bg-yellow-100 text-yellow-700" 
                            : "bg-red-100 text-red-700"
                        }`}>
                          {item.jumlah}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => openEdit(item)}
                            className="inline-flex items-center px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-200"
                            title="Edit item"
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
                    <td colSpan="8" className="p-12 text-center">
                      <Box className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        {search ? "No items found" : "No items yet"}
                      </h3>
                      <p className="text-gray-500 mb-4">
                        {search 
                          ? "Try adjusting your search term" 
                          : "Get started by adding your first item."}
                      </p>
                      {!search && (
                        <button
                          onClick={openAdd}
                          className="inline-flex items-center px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add Your First Item
                        </button>
                      )}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Table Footer */}
        <div className="mt-4 flex justify-between items-center text-sm text-gray-600">
          <div>
            Showing {filteredItems.length} of {items.length} items
          </div>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 bg-green-100 rounded-sm"></span>
              <span>In Stock (&gt;10)</span>
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 bg-yellow-100 rounded-sm"></span>
              <span>Low Stock (1-10)</span>
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 bg-red-100 rounded-sm"></span>
              <span>Out of Stock (0)</span>
            </span>
          </div>
        </div>
      </div>
    </Layout>
  );
}