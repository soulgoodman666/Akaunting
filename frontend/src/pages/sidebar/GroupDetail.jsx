import { useEffect, useState } from "react";
import { useParams, useLocation, Link } from "react-router-dom";
import { 
  ArrowLeft, 
  FolderTree, 
  Plus, 
  Trash2, 
  Edit, 
  X, 
  Search, 
  Package,
  CheckSquare, 
  Square,
  AlertCircle
} from "lucide-react";

export default function GroupDetail() {
  const { id } = useParams();
  const location = useLocation();

  // State management
  const [groupName, setGroupName] = useState(location.state?.groupName || `Group ${id}`);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Form states
  const [showAddForm, setShowAddForm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");
  
  // Form data
  const [form, setForm] = useState({
    name: "",
    stock: "",
    code: "",
    brand: "",
    unit: "",
  });

  // Fetch items data
  useEffect(() => {
    const fetchItems = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:8080/groups/${id}/items`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        setItems(Array.isArray(data) ? data : []);
        setError(null);
      } catch (err) {
        console.error("Error fetching items:", err);
        setError("Failed to load items. Please try again.");
        setItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, [id]);

  // Filter items based on search
  const filteredItems = items.filter((item) =>
    item.name?.toLowerCase().includes(search.toLowerCase()) ||
    item.code?.toLowerCase().includes(search.toLowerCase()) ||
    item.brand?.toLowerCase().includes(search.toLowerCase())
  );

  // Handle checkbox selection
  const handleIndividualCheckbox = (itemId) => {
    setSelectedItems(prev => {
      if (prev.includes(itemId)) {
        return prev.filter(id => id !== itemId);
      } else {
        return [...prev, itemId];
      }
    });
  };

  // Handle select all
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedItems([]);
    } else {
      const allIds = filteredItems.map(item => item.id);
      setSelectedItems(allIds);
    }
    setSelectAll(!selectAll);
  };

  // Handle delete single item
  const handleDeleteSingle = async (itemId, itemName) => {
    if (window.confirm(`Are you sure you want to delete item "${itemName}"?`)) {
      try {
        // Simulate API call
        const response = await fetch(`http://localhost:8080/items/${itemId}`, {
          method: 'DELETE',
        });
        
        if (response.ok) {
          setItems(prev => prev.filter(item => item.id !== itemId));
          setSelectedItems(prev => prev.filter(id => id !== itemId));
          alert(`Item "${itemName}" has been deleted successfully.`);
        } else {
          throw new Error('Failed to delete item');
        }
      } catch (err) {
        alert('Failed to delete item. Please try again.');
      }
    }
  };

  // Handle delete multiple items
  const handleDeleteMultiple = () => {
    if (selectedItems.length === 0) {
      alert("Please select at least one item to delete.");
      return;
    }
    setShowDeleteConfirm(true);
  };

  // Confirm delete multiple
  const confirmDeleteMultiple = async () => {
    try {
      // Simulate API call for multiple deletion
      const response = await fetch(`http://localhost:8080/items/batch`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ids: selectedItems }),
      });
      
      if (response.ok) {
        setItems(prev => prev.filter(item => !selectedItems.includes(item.id)));
        setSelectedItems([]);
        setSelectAll(false);
        alert(`${selectedItems.length} item(s) have been deleted successfully.`);
      } else {
        throw new Error('Failed to delete items');
      }
    } catch (err) {
      alert('Failed to delete items. Please try again.');
    } finally {
      setShowDeleteConfirm(false);
    }
  };

  // Cancel delete multiple
  const cancelDeleteMultiple = () => {
    setShowDeleteConfirm(false);
  };

  // Open add form
  const openAdd = () => {
    setEditId(null);
    setForm({ name: "", stock: "", code: "", brand: "", unit: "" });
    setShowAddForm(true);
  };

  // Open edit form
  const openEdit = (item) => {
    setEditId(item.id);
    setForm({
      name: item.name || "",
      stock: item.stock || "",
      code: item.code || "",
      brand: item.brand || "",
      unit: item.unit || "",
    });
    setShowAddForm(true);
  };

  // Close form
  const closeForm = () => {
    setShowAddForm(false);
    setEditId(null);
    setForm({ name: "", stock: "", code: "", brand: "", unit: "" });
  };

  // Save item
  const saveItem = async () => {
    if (!form.name || !form.stock) {
      alert("Item name and stock are required fields.");
      return;
    }

    try {
      if (editId) {
        // Update existing item
        const response = await fetch(`http://localhost:8080/items/${editId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(form),
        });
        
        if (response.ok) {
          const updatedItem = await response.json();
          setItems(prev => prev.map(item => 
            item.id === editId ? { ...item, ...updatedItem } : item
          ));
          alert(`Item "${form.name}" has been updated successfully.`);
        } else {
          throw new Error('Failed to update item');
        }
      } else {
        // Add new item
        const response = await fetch(`http://localhost:8080/groups/${id}/items`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(form),
        });
        
        if (response.ok) {
          const newItem = await response.json();
          setItems(prev => [...prev, newItem]);
          alert(`Item "${form.name}" has been added successfully.`);
        } else {
          throw new Error('Failed to add item');
        }
      }
      closeForm();
    } catch (err) {
      alert('Failed to save item. Please try again.');
    }
  };

  return (
      <div className="p-6 min-h-screen bg-blue-50 dark:bg-slate-800">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <Link
              to="/inventory/groups"
              className="inline-flex items-center p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              title="Back to Groups"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="p-3 bg-purple-100 rounded-lg">
              <FolderTree className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{groupName}</h1>
              <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                <span>Group ID: {id}</span>
                <span>•</span>
                <span>Total Items: {items.length}</span>
                <span>•</span>
                <span>Selected: {selectedItems.length}</span>
              </div>
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
              Add Item
            </button>
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
                  <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">Delete Items</h2>
                </div>
                
                <p className="text-gray-700 dark:text-gray-300 mb-6">
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
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl w-full max-w-md">
              {/* Header Modal */}
              <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-slate-700">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    {editId ? <Edit className="w-5 h-5 text-blue-600" /> : <Plus className="w-5 h-5 text-blue-600" />}
                  </div>
                  <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">
                    {editId ? "Edit Item" : "Add New Item"}
                  </h2>
                </div>
                <button
                  onClick={closeForm}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                </button>
              </div>

              {/* Form Content */}
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Item Name *
                  </label>
                  <input
                    type="text"
                    placeholder="Enter item name"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Stock *
                    </label>
                    <input
                      type="number"
                      min="0"
                      placeholder="0"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                      value={form.stock}
                      onChange={(e) => setForm({ ...form, stock: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Code
                    </label>
                    <input
                      type="text"
                      placeholder="Item code"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                      value={form.code}
                      onChange={(e) => setForm({ ...form, code: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Brand
                    </label>
                    <input
                      type="text"
                      placeholder="Brand name"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                      value={form.brand}
                      onChange={(e) => setForm({ ...form, brand: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Unit
                    </label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                      value={form.unit}
                      onChange={(e) => setForm({ ...form, unit: e.target.value })}
                    >
                      <option value="">Select unit</option>
                      <option value="PCS">PCS</option>
                      <option value="BOX">BOX</option>
                      <option value="KG">KG</option>
                      <option value="LITER">LITER</option>
                      <option value="METER">METER</option>
                      <option value="SET">SET</option>
                    </select>
                  </div>
                </div>

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
                    disabled={!form.name || !form.stock}
                    className={`flex-1 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                      !form.name || !form.stock
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-blue-600 text-white hover:bg-blue-700"
                    }`}
                  >
                    {editId ? "Update Item" : "Add Item"}
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
              placeholder="Search items by name, code, or brand..."
              className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Items Table */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm overflow-hidden">
          {loading ? (
              <div className="p-12 text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">Loading items...</p>
            </div>
          ) : error ? (
            <div className="p-12 text-center">
              <AlertCircle className="mx-auto h-12 w-12 text-red-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">Error Loading Items</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="inline-flex items-center px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                Retry
              </button>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-700">
                  <thead className="bg-gray-50 dark:bg-slate-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-12">
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
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Item Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Code
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Brand
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Unit
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Stock
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody className="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-slate-700">
                    {filteredItems.length > 0 ? (
                      filteredItems.map((item) => (
                        <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-slate-700">
                          <td className="px-6 py-4">
                            <input
                              type="checkbox"
                              checked={selectedItems.includes(item.id)}
                              onChange={() => handleIndividualCheckbox(item.id)}
                              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                            />
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <Package className="w-4 h-4 text-gray-400" />
                              <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                {item.name}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                            {item.code || "-"}
                          </td>
                          <td className="px-6 py-4">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                              {item.brand || "N/A"}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                            {item.unit || "-"}
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                              parseInt(item.stock) > 20 
                                ? "bg-green-100 text-green-700" 
                                : parseInt(item.stock) > 0 
                                ? "bg-yellow-100 text-yellow-700" 
                                : "bg-red-100 text-red-700"
                            }`}>
                              {item.stock}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex gap-2">
                              <button
                                onClick={() => openEdit(item)}
                                className="inline-flex items-center px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-200"
                                title="Edit item"
                              >
                                <Edit className="w-4 h-4 mr-1" />
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteSingle(item.id, item.name)}
                                className="inline-flex items-center px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-red-200"
                                title="Delete item"
                              >
                                <Trash2 className="w-4 h-4 mr-1" />
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="7" className="px-6 py-12 text-center">
                          <Package className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                            {search ? "No items found" : "No items in this group"}
                          </h3>
                          <p className="text-gray-500 dark:text-gray-400 mb-4">
                            {search 
                              ? "Try adjusting your search term" 
                              : "Add items to this group to get started."}
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

              {/* Table Footer */}
              <div className="px-6 py-4 border-t border-gray-200 dark:border-slate-700">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="text-sm text-gray-700 dark:text-gray-300">
                    Showing {filteredItems.length} of {items.length} items
                  </div>
                  <div className="flex items-center gap-4 text-xs">
                    <span className="flex items-center gap-1">
                      <span className="w-3 h-3 bg-green-100 rounded-sm"></span>
                      <span>Good Stock (&gt;20)</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-3 h-3 bg-yellow-100 rounded-sm"></span>
                      <span>Low Stock (1-20)</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-3 h-3 bg-red-100 rounded-sm"></span>
                      <span>Out of Stock (0)</span>
                    </span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
  );
}