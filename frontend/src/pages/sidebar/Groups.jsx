import { 
  FolderTree, Search, Plus, Trash2, X, CheckSquare, Square, Edit, Eye, Activity, Tag, Layers
} from 'lucide-react';
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function Groups() {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load groups from backend when component mounts
  const fetchGroups = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8080/groups');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setGroups(data);
    } catch (error) {
      console.error('Error fetching groups:', error);
      // Use default data if backend is not available
      setGroups([
        { id: 1, nama: 'Charge Adopters', kategori: 'General', items: 1, deskripsi: 'Electronic charging accessories', status: 'active', createdDate: '2024-01-10' },
        { id: 2, nama: 'Charge Cable', kategori: 'General', items: 1, deskripsi: 'Various types of charging cables', status: 'active', createdDate: '2024-01-11' },
        { id: 3, nama: 'Office Supplies', kategori: 'Stationery', items: 15, deskripsi: 'Daily office necessities', status: 'active', createdDate: '2024-01-05' },
        { id: 4, nama: 'Safety Equipment', kategori: 'Safety', items: 8, deskripsi: 'Protective gear and equipment', status: 'inactive', createdDate: '2023-12-20' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch groups on component mount
  useEffect(() => {
    fetchGroups();
  }, []);

  const [showAddForm, setShowAddForm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedGroups, setSelectedGroups] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [editId, setEditId] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState(null);
  
  const [form, setForm] = useState({
    nama: "",
    kategori: "",
    deskripsi: "",
    status: "active"
  });

  const [search, setSearch] = useState("");

  const filteredGroups = groups.filter((group) =>
    group.nama.toLowerCase().includes(search.toLowerCase()) ||
    group.kategori.toLowerCase().includes(search.toLowerCase()) ||
    group.deskripsi.toLowerCase().includes(search.toLowerCase())
  );

  const handleIndividualCheckbox = (groupId) => {
    setSelectedGroups(prev => {
      if (prev.includes(groupId)) {
        return prev.filter(id => id !== groupId);
      } else {
        return [...prev, groupId];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedGroups([]);
    } else {
      setSelectedGroups(filteredGroups.map(group => group.id));
    }
    setSelectAll(!selectAll);
  };

  const handleDeleteSingle = async (groupId, groupName) => {
    if (window.confirm(`Are you sure you want to delete group "${groupName}"?`)) {
      try {
        const response = await fetch(`http://localhost:8080/groups/${groupId}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Update local state
        setGroups(prev => prev.filter(group => group.id !== groupId));
        setSelectedGroups(prev => prev.filter(id => id !== groupId));
        alert("Group deleted successfully!");
        
      } catch (error) {
        console.error('Error deleting group:', error);
        alert("Failed to delete group. Please try again.");
      }
    }
  };

  const handleDeleteMultiple = async () => {
    if (selectedGroups.length === 0) {
      alert("Please select at least one group to delete");
      return;
    }
    setShowDeleteConfirm(true);
  };

  const confirmDeleteMultiple = () => {
    setGroups(groups.filter(group => !selectedGroups.includes(group.id)));
    setSelectedGroups([]);
    setSelectAll(false);
    setShowDeleteConfirm(false);
  };

  const cancelDeleteMultiple = () => {
    setShowDeleteConfirm(false);
  };

  const openAdd = () => {
    setForm({ nama: "", kategori: "", deskripsi: "", status: "active" });
    setEditId(null);
    setShowAddForm(true);
  };

  const openEdit = (group) => {
    setForm({
      nama: group.nama,
      kategori: group.kategori,
      deskripsi: group.deskripsi,
      status: group.status
    });
    setEditId(group.id);
    setShowAddForm(true);
  };

  const closeForm = () => {
    setShowAddForm(false);
    setEditId(null);
    setForm({ nama: "", kategori: "", deskripsi: "", status: "active" });
  };

  const saveGroup = async () => {
    if (!form.nama || !form.kategori) {
      alert("Please fill all required fields");
      return;
    }

    try {
      let response;
      if (editId) {
        // Update existing group
        response = await fetch(`http://localhost:8080/groups/${editId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(form),
        });
      } else {
        // Add new group
        response = await fetch(`http://localhost:8080/groups`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(form),
        });
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const savedGroup = await response.json();
      
      // Update local state
      if (editId) {
        setGroups(groups.map(g => g.id === editId ? { ...savedGroup, id: editId } : g));
      } else {
        setGroups([...groups, savedGroup]);
      }

      closeForm();
      alert(editId ? "Group updated successfully!" : "Group created successfully!");
      
    } catch (error) {
      console.error('Error saving group:', error);
      alert("Failed to save group. Please try again.");
    }
  };

  const getStatusBadge = (status) => {
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${
        status === 'Active' 
          ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800'
          : 'bg-gray-100 dark:bg-gray-900/20 text-gray-700 dark:text-gray-400 border-gray-200 dark:border-gray-800'
      }`}>
        <div className={`w-2 h-2 rounded-full mr-2 ${status === 'Active' ? 'bg-green-500' : 'bg-gray-500'}`}></div>
        {status}
      </span>
    );
  };

  return (
    <div className="h-screen p-6 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900 overflow-y-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 backdrop-blur-sm bg-opacity-90">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl shadow-lg">
                <FolderTree className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">Groups</h1>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Kelola kategori dan grup inventory dengan mudah</p>
              </div>
            </div>
            
            <button
              onClick={openAdd}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              <Plus size={20} /> Tambah Grup
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl p-4 border border-purple-200 dark:border-purple-800">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-purple-600 dark:text-purple-400 font-medium">Total Grup</p>
                  <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">{groups.length}</p>
                </div>
                <FolderTree className="w-8 h-8 text-purple-500" />
              </div>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl p-4 border border-green-200 dark:border-green-800">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-green-600 dark:text-green-400 font-medium">Aktif</p>
                  <p className="text-2xl font-bold text-green-900 dark:text-green-100">{groups.filter(g => g.status === 'Active').length}</p>
                </div>
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">✓</span>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">Total Items</p>
                  <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">{groups.reduce((sum, g) => sum + g.items, 0)}</p>
                </div>
                <Layers className="w-8 h-8 text-blue-500" />
              </div>
            </div>
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-xl p-4 border border-orange-200 dark:border-orange-800">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-orange-600 dark:text-orange-400 font-medium">Kategori</p>
                  <p className="text-2xl font-bold text-orange-900 dark:text-orange-100">{[...new Set(groups.map(g => g.category))].length}</p>
                </div>
                <Tag className="w-8 h-8 text-orange-500" />
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative max-w-md">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
              placeholder="Cari grup berdasarkan nama, kategori, atau deskripsi..."
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
                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">Delete Groups</h2>
              </div>
              
              <p className="text-gray-700 dark:text-gray-300 mb-6">
                Are you sure you want to delete {selectedGroups.length} selected group(s)? 
                This action cannot be undone.
              </p>
              
              <div className="flex gap-3">
                <button
                  onClick={cancelDeleteMultiple}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
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

      {/* Form Add/Edit Group */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl w-full max-w-md">
            <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-slate-700">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  {editId ? <Edit className="w-5 h-5 text-blue-600" /> : <Plus className="w-5 h-5 text-blue-600" />}
                </div>
                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">
                  {editId ? "Edit Group" : "New Group"}
                </h2>
              </div>
              <button
                onClick={closeForm}
                className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Group Name *</label>
                <input
                  type="text"
                  placeholder="Enter group name"
                  value={form.nama}
                  onChange={(e) => setForm({ ...form, nama: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Category *</label>
                <input
                  type="text"
                  placeholder="Enter category"
                  value={form.kategori}
                  onChange={(e) => setForm({ ...form, kategori: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description</label>
                <textarea
                  placeholder="Enter description"
                  value={form.deskripsi}
                  onChange={(e) => setForm({ ...form, deskripsi: e.target.value })}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Items</label>
                  <input
                    type="number"
                    placeholder="0"
                    value={form.items}
                    onChange={(e) => setForm({ ...form, items: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Status</label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={closeForm}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={saveGroup}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                >
                  {editId ? "Update" : "Save"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden backdrop-blur-sm">
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-gray-700 dark:to-gray-800 px-6 py-4 border-b border-gray-200 dark:border-gray-600">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <FolderTree className="w-5 h-5 text-purple-600" />
            Daftar Groups
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
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Group Name</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Category</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Items</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-100 dark:divide-gray-700">
              {filteredGroups.map((group) => (
                <tr key={group.id} className="hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 dark:hover:from-gray-700 dark:hover:to-gray-600 transition-all duration-200 cursor-pointer group" onClick={() => setSelectedGroup(group)}>
                  <td className="px-6 py-4">
                    <button
                      onClick={(e) => { e.stopPropagation(); handleIndividualCheckbox(group.id); }}
                      className="focus:outline-none"
                    >
                      {selectedGroups.includes(group.id) ? (
                        <CheckSquare className="w-5 h-5 text-blue-600" />
                      ) : (
                        <Square className="w-5 h-5 text-gray-400" />
                      )}
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-xl group-hover:scale-110 transition-transform duration-200">
                        <FolderTree className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900 dark:text-white">{group.nama}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">{group.deskripsi}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 text-purple-800 dark:text-purple-200 border border-purple-200 dark:border-purple-800">
                      {group.kategori}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Layers className="w-4 h-4 text-gray-400" />
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">{group.items ? group.items.length : 0}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(group.status)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <button 
                        onClick={(e) => { e.stopPropagation(); setSelectedGroup(group); }}
                        className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                        title="View details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); openEdit(group); }}
                        className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                        title="Edit group"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleDeleteSingle(group.id, group.nama); }}
                        className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        title="Delete group"
                      >
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
      {selectedGroup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-800">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <FolderTree className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">Detail Group</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{selectedGroup.nama}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedGroup(null)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              </button>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <FolderTree className="w-5 h-5 text-purple-600" />
                    Informasi Dasar
                  </h3>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Nama Group</span>
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">{selectedGroup.nama}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Kategori</span>
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">{selectedGroup.kategori}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Status</span>
                      {getStatusBadge(selectedGroup.status)}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <Activity className="w-5 h-5 text-blue-600" />
                    Informasi Tambahan
                  </h3>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Jumlah Items</span>
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">{selectedGroup.items ? selectedGroup.items.length : 0} items</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Tanggal Dibuat</span>
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">{selectedGroup.created_at ? new Date(selectedGroup.created_at).toLocaleDateString('id-ID') : 'N/A'}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Deskripsi</span>
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">{selectedGroup.deskripsi}</span>
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
