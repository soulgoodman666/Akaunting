import Layout from '../../components/layout/Layout';
import { 
  FolderTree, 
  Search, 
  ChevronLeft, 
  ChevronRight, 
  Filter, 
  Plus, 
  Trash2, 
  X, 
  CheckSquare, 
  Square 
} from 'lucide-react';
import { useState } from "react";
import { Link } from "react-router-dom";

export default function Groups() {
  // Data contoh dari gambar
  const [groups, setGroups] = useState([
    { id: 1, name: 'Charge Adopters', category: 'General', items: 1 },
    { id: 2, name: 'Charge Cable', category: 'General', items: 1 },
  ]);

  // State untuk form
  const [showAddForm, setShowAddForm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedGroups, setSelectedGroups] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  
  const [newGroup, setNewGroup] = useState({
    name: "",
    category: "",
    items: 0,
  });

  // State untuk filter dan search
  const [showFilter, setShowFilter] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [search, setSearch] = useState("");

  // Filter groups berdasarkan search dan category
  const filteredGroups = groups.filter((group) => {
    const matchCategory =
      selectedCategory === "All" || group.category === selectedCategory;
    const matchSearch =
      group.name.toLowerCase().includes(search.toLowerCase()) ||
      group.category.toLowerCase().includes(search.toLowerCase());
    return matchCategory && matchSearch;
  });

  // Fungsi untuk handle checkbox individual
  const handleIndividualCheckbox = (groupId) => {
    setSelectedGroups(prev => {
      if (prev.includes(groupId)) {
        return prev.filter(id => id !== groupId);
      } else {
        return [...prev, groupId];
      }
    });
  };

  // Fungsi untuk handle select all
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedGroups([]);
    } else {
      const allIds = filteredGroups.map(group => group.id);
      setSelectedGroups(allIds);
    }
    setSelectAll(!selectAll);
  };

  // Fungsi untuk hapus data tunggal
  const handleDeleteSingle = (groupId, groupName) => {
    if (window.confirm(`Are you sure you want to delete group "${groupName}"?`)) {
      setGroups(prev => prev.filter(group => group.id !== groupId));
      // Hapus juga dari selectedGroups jika ada
      setSelectedGroups(prev => prev.filter(id => id !== groupId));
    }
  };

  // Fungsi untuk hapus multiple
  const handleDeleteMultiple = () => {
    if (selectedGroups.length === 0) {
      alert("Please select at least one group to delete.");
      return;
    }
    setShowDeleteConfirm(true);
  };

  // Konfirmasi hapus multiple
  const confirmDeleteMultiple = () => {
    setGroups(prev => prev.filter(group => !selectedGroups.includes(group.id)));
    setSelectedGroups([]);
    setSelectAll(false);
    setShowDeleteConfirm(false);
  };

  // Cancel hapus multiple
  const cancelDeleteMultiple = () => {
    setShowDeleteConfirm(false);
  };

  // Fungsi untuk tambah group baru
  const handleAddGroup = () => {
    if (!newGroup.name || !newGroup.category) {
      alert("Please fill all required fields");
      return;
    }

    const newGroupWithId = {
      id: groups.length > 0 ? Math.max(...groups.map(g => g.id)) + 1 : 1,
      name: newGroup.name,
      category: newGroup.category,
      items: parseInt(newGroup.items) || 0,
    };

    setGroups(prev => [...prev, newGroupWithId]);
    setNewGroup({ name: "", category: "", items: 0 });
    setShowAddForm(false);
  };

  // Fungsi untuk reset form
  const resetForm = () => {
    setNewGroup({ name: "", category: "", items: 0 });
    setShowAddForm(false);
  };

  return (
    <Layout>
      <div className="p-6 min-h-screen bg-blue-50">
        {/* Header dengan tombol New Group */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-100 rounded-lg">
              <FolderTree className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Groups</h1>
              <p className="text-gray-600 text-sm">
                Manage your inventory groups/categories | Total: {groups.length} groups
              </p>
            </div>
          </div>
          
          <div className="flex gap-2">
            {selectedGroups.length > 0 && (
              <button
                onClick={handleDeleteMultiple}
                className="inline-flex items-center px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-medium hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete ({selectedGroups.length})
              </button>
            )}
            
            {!showAddForm && (
              <button
                onClick={() => setShowAddForm(true)}
                className="inline-flex items-center px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                New Group
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
                  <h2 className="text-xl font-bold text-gray-800">Delete Groups</h2>
                </div>
                
                <p className="text-gray-700 mb-6">
                  Are you sure you want to delete {selectedGroups.length} selected group(s)? 
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

        {/* Form Add Group (Modal Style) */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
              {/* Header Modal */}
              <div className="flex justify-between items-center p-6 border-b">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Plus className="w-5 h-5 text-blue-600" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-800">New Group</h2>
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
                {/* Group Name Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Group Name *
                  </label>
                  <input
                    type="text"
                    placeholder="Enter group name"
                    value={newGroup.name}
                    onChange={(e) => setNewGroup({ ...newGroup, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                {/* Category Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <div className="flex gap-3">
                    {["General", "Other"].map((category) => (
                      <label
                        key={category}
                        className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border cursor-pointer transition ${
                          newGroup.category === category
                            ? "border-blue-500 bg-blue-50 text-blue-600"
                            : "border-gray-300 hover:border-blue-400"
                        }`}
                      >
                        <input
                          type="radio"
                          name="category"
                          value={category}
                          checked={newGroup.category === category}
                          onChange={(e) => setNewGroup({ ...newGroup, category: e.target.value })}
                          className="hidden"
                        />
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                          newGroup.category === category ? "border-blue-500" : "border-gray-400"
                        }`}>
                          {newGroup.category === category && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full" />
                          )}
                        </div>
                        <span className="text-sm font-medium">{category}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Items Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Items
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="number"
                      min="0"
                      placeholder="0"
                      value={newGroup.items}
                      onChange={(e) => setNewGroup({ ...newGroup, items: e.target.value })}
                      className="w-24 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center"
                    />
                    <span className="text-sm text-gray-500">Items</span>
                  </div>
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
                    onClick={handleAddGroup}
                    disabled={!newGroup.name || !newGroup.category}
                    className={`flex-1 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                      !newGroup.name || !newGroup.category
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-blue-600 text-white hover:bg-blue-700"
                    }`}
                  >
                    Create Group
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
                placeholder="Search group name or category..."
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
                    setSelectedCategory("All");
                    setShowFilter(false);
                  }}
                  className={`block w-full text-left px-4 py-2 hover:bg-gray-100 ${selectedCategory === "All" ? "bg-purple-50 text-purple-600" : ""}`}
                >
                  All Categories
                </button>
                <button
                  onClick={() => {
                    setSelectedCategory("General");
                    setShowFilter(false);
                  }}
                  className={`block w-full text-left px-4 py-2 hover:bg-gray-100 ${selectedCategory === "General" ? "bg-purple-50 text-purple-600" : ""}`}
                >
                  General
                </button>
                <button
                  onClick={() => {
                    setSelectedCategory("Other");
                    setShowFilter(false);
                  }}
                  className={`block w-full text-left px-4 py-2 hover:bg-gray-100 ${selectedCategory === "Other" ? "bg-purple-50 text-purple-600" : ""}`}
                >
                  Other
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Groups Table */}
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
                    Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
                    Category
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Items
                  </th>
                </tr>
              </thead>

              <tbody className="bg-white divide-y divide-gray-200">
                {filteredGroups.length > 0 ? (
                  filteredGroups.map((group) => (
                    <tr key={group.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap border-r border-gray-100">
                        <input
                          type="checkbox"
                          checked={selectedGroups.includes(group.id)}
                          onChange={() => handleIndividualCheckbox(group.id)}
                          className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap border-r border-gray-100">
                        <Link
                          to={`/inventory/groups/${group.id}`}
                          state={{ groupName: group.name }}
                          className="text-sm font-medium text-purple-600 hover:underline"
                        >
                          {group.name}
                        </Link>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap border-r border-gray-100">
                        <div className="flex items-center">
                          <span className="inline-block w-2 h-2 mr-2 bg-blue-500 rounded-full"></span>
                          <span className="text-sm text-gray-900">{group.category}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap border-r border-gray-100">
                        <div className="text-sm text-gray-900">{group.items}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center">
                      <FolderTree className="mx-auto h-12 w-12 text-gray-400" />
                      <h3 className="mt-2 text-sm font-medium text-gray-900">No groups found</h3>
                      <p className="mt-1 text-sm text-gray-500">
                        {search || selectedCategory !== "All" 
                          ? "Try adjusting your search or filter" 
                          : "Get started by creating a new group."}
                      </p>
                      {!search && selectedCategory === "All" && (
                        <button
                          onClick={() => setShowAddForm(true)}
                          className="mt-4 inline-flex items-center px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Create Your First Group
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
                <span>Showing {filteredGroups.length} of {groups.length} groups</span>
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
    </Layout>
  );
}