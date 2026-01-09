import Layout from '../../components/layout/Layout';
import { FolderTree, Search, ChevronLeft, ChevronRight, Filter, Plus, Trash2 } from 'lucide-react';
import { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";



export default function Groups() {
  // Data contoh dari gambar
  const [groups, setGroups] = useState([
    { id: 1, name: 'Charge Adopters', category: 'General', items: 1 },
    { id: 2, name: 'Charge Cable', category: 'General', items: 1 },
  ]);

  // TOMBOL HAPUS 
  const handleDelete = (id) => {
    setGroups(prevGroups =>
      prevGroups.filter(group => group.id !== id)
    );
  };

  //TOMBOL NEW GROUP
  const [showForm, setShowForm] = useState(false);
  const [newGroup, setNewGroup] = useState({
    name: "",
    category: "",
    items: 0,
  });
  const handleAddGroup = () => {
    if (!newGroup.name || !newGroup.category) {
      alert("Semua field wajib diisi");
      return;
    }

    setGroups((prev) => [
      ...prev,
      {
        id: Date.now(), // id unik
        ...newGroup,
      },
    ]);

    setNewGroup({ name: "", category: "", items: 0 });
    setShowForm(false);
  };

  // TOMBOL FILTER ,SEARCH , DETAIL GROUP
  const [showFilter, setShowFilter] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");


  const [search, setSearch] = useState("");

  const filteredGroups = groups.filter((group) => {
    const matchCategory =
      selectedCategory === "All" || group.category === selectedCategory;

    const matchSearch =
      group.name.toLowerCase().includes(search.toLowerCase()) ||
      group.category.toLowerCase().includes(search.toLowerCase());

    return matchCategory && matchSearch;
  });
  {
    filteredGroups.map((group, index) => (
      <div key={index} className="p-3 border rounded-lg">
        <p className="font-medium">{group.name}</p>
        <p className="text-sm text-gray-500">{group.category}</p>
      </div>
    ))
  }
  const navigate = useNavigate();




  return (
    <Layout>
      <div className="p-6 min-h-screen bg-blue-50">
        {/* Header */}
        <div className="mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

            {/* Title */}
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-100 rounded-lg">
                <FolderTree className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Groups</h1>
                <p className="text-gray-600">
                  Manage your inventory groups/categories
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">

              {!showForm && (
                <button
                  onClick={() => setShowForm(true)}
                  className="inline-flex items-center px-2 py-2 rounded-2xl bg-purple-600 text-white text-sm font-medium hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                >
                  New Group
                </button>
              )}
              {showForm && (
                <div className="mb-2 p-4 border rounded-xl bg-gray-100">

                  <div className="flex flex-col gap-2">
                    <label className="text-xs text-gray-500">Group Name</label>
                    <input
                      type="text"
                      placeholder="Group name"
                      value={newGroup.name}
                      onChange={(e) =>
                        setNewGroup({ ...newGroup, name: e.target.value })
                      }
                      className="
                        w-56
                        rounded-lg
                        border border-gray-300
                        px-3 py-2
                        text-sm
                        focus:outline-none
                        focus:ring-1 focus:ring-purple-200
                        focus:border-purple-500
                        transition"
                    />
                  </div>


                  <div className="flex gap-2">
                    {["General", "Other"].map((item) => (
                      <label
                        key={item}
                        className={`flex items-center gap-3 px-4 py-2 rounded-lg border cursor-pointer transition
                          ${newGroup.category === item
                            ? "border-purple-500 bg-purple-50 text-purple-600"
                            : "border-gray-300 hover:border-purple-400"
                          }`}
                      >
                        <input
                          type="radio"
                          name="category"
                          value={item}
                          className="hidden"
                          checked={newGroup.category === item}
                          onChange={(e) =>
                            setNewGroup({ ...newGroup, category: e.target.value })
                          }
                        />

                        {/* custom radio */}
                        <div
                          className={`w-4 h-4 rounded-full border flex items-center justify-center
                            ${newGroup.category === item
                              ? "border-purple-500"
                              : "border-gray-400"
                            }`}
                        >
                          {newGroup.category === item && (
                            <div className="w-2 h-2 bg-purple-300 rounded-full" />
                          )}
                        </div>

                        <span className="text-sm font-medium">{item}</span>
                      </label>
                    ))}
                  </div>

                  <div className="flex items-center gap-3">
                    <input
                      type="number"
                      min="0"
                      placeholder="0"
                      value={newGroup.items}
                      onChange={(e) =>
                        setNewGroup({ ...newGroup, items: e.target.value })
                      }
                      className="
                        w-20
                        text-center
                        rounded-lg
                        border border-gray-300
                        px-2 py-1.5
                        text-sm
                        focus:outline-none
                        focus:ring-1 focus:ring-purple-200
                        focus:border-purple-500
                        transition
                        "
                    />
                    <span className="text-sm text-gray-500">Items</span>
                  </div>


                  <div className="flex items-center gap-3 mt-6">
                    <button
                      onClick={handleAddGroup}
                      className="
                      inline-flex items-center
                      px-4 py-2
                      rounded-lg
                      bg-green-600
                      text-white text-sm font-medium
                      hover:bg-green-700
                      focus:outline-none
                      focus:ring-2 focus:ring-green-500
                      transition
                    "
                    >
                      Add
                    </button>

                    <button
                      onClick={() => setShowForm(false)}
                      className="
                      inline-flex items-center
                      px-3 py-2
                      rounded-lg
                      bg-gray-500
                      text-white text-sm font-medium
                      hover:bg-gray-600
                      focus:outline-none
                      focus:ring-2 focus:ring-gray-400
                      transition
                    "
                    >
                      Cancel
                    </button>
                  </div>

                </div>
              )}
            </div>

          </div>
        </div>

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
                className="
                  block w-full
                  pl-10 pr-3 py-2
                  border border-gray-300
                  rounded-xl
                  text-sm
                  placeholder-gray-500
                  focus:outline-none
                  focus:ring-2 focus:ring-purple-500
                  focus:border-purple-500
                  transition
                "
              />
            </div>

            <button onClick={() => setShowFilter(!showFilter)} className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-xl shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </button>
            {showFilter && (
              <div className="mt-2 w-40 bg-white border rounded-lg shadow-lg">
                <button
                  onClick={() => {
                    setSelectedCategory("All");
                    setShowFilter(false);
                  }}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                >
                  All
                </button>

                <button
                  onClick={() => {
                    setSelectedCategory("General");
                    setShowFilter(false);
                  }}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                >
                  General
                </button>

                <button
                  onClick={() => {
                    setSelectedCategory("Other");
                    setShowFilter(false);
                  }}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100"
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

              {/*GROUP DETAIL*/}
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredGroups.map((group) => (
                  <tr
                    key={group.id}
                    className="hover:bg-gray-50"
                  >
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

                    {/* KOLOM TOMBOL ACTION */}
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <button onClick={() => handleDelete(group.id)}
                        className="inline-flex items-center px-3 py-2 rounded-2xl bg-red-600 text-white text-sm font-medium hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>

            </table>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-200"></div>

          {/* Pagination and Footer */}
          <div className="px-6 py-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              {/* Records Info */}
              <div className="text-sm text-gray-700">
                <span>25 per page. </span>
                <span className="font-medium">1-2</span>
                <span> of </span>
                <span className="font-medium">2</span>
                <span> records.</span>
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

        {/* Empty State (jika tidak ada data) */}
        {groups.length === 0 && (
          <div className="text-center py-12">
            <FolderTree className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No groups</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by creating a new group.</p>
          </div>
        )}
      </div>
    </Layout>
  );
}