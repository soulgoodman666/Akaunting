import { useState } from "react";
import {
  Box,
  Plus,
  Trash2,
  X,
  Search,
  Edit,
} from "lucide-react";

const formatRupiah = (number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(number);

export default function Items() {
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);

  const [form, setForm] = useState({
    kode: "",
    nama: "",
    merek: "",
    satuan: "",
    jumlah: "",
    harga: "",
  });

  const [items, setItems] = useState([
    { id: 1, kode: "M090", nama: "Gas Argon", merek: "Gas", satuan: "Tube", jumlah: 5, harga: 750000 },
    { id: 2, kode: "M089", nama: "Gas Oksigen", merek: "Gas", satuan: "Tube", jumlah: 1, harga: 500000 },
    { id: 3, kode: "M088", nama: "Long Back Up", merek: "Welding", satuan: "PCS", jumlah: 0, harga: 250000 },
    { id: 4, kode: "M087", nama: "Keramik Las Argon", merek: "Welding", satuan: "PCS", jumlah: 13, harga: 120000 },
    { id: 5, kode: "M086", nama: "Body Collet", merek: "Welding", satuan: "PCS", jumlah: 21, harga: 90000 },
  ]);

  const filteredItems = items.filter(
    (item) =>
      item.nama.toLowerCase().includes(search.toLowerCase()) ||
      item.kode.toLowerCase().includes(search.toLowerCase()) ||
      item.merek.toLowerCase().includes(search.toLowerCase())
  );

  const openAdd = () => {
    setEditId(null);
    setForm({ kode: "", nama: "", merek: "", satuan: "", jumlah: "", harga: "" });
    setShowForm(true);
  };

  const openEdit = (item) => {
    setEditId(item.id);
    setForm(item);
    setShowForm(true);
  };

  const saveItem = () => {
    if (!form.kode || !form.nama || !form.harga) return alert("Lengkapi data");

    if (editId) {
      setItems(items.map((i) => (i.id === editId ? { ...form, id: editId } : i)));
    } else {
      setItems([...items, { ...form, id: Date.now() }]);
    }
    setShowForm(false);
  };

  const deleteItem = (id) => {
    if (confirm("Hapus item ini?")) {
      setItems(items.filter((i) => i.id !== id));
    }
  };

  return (
    <div className="p-6 bg-blue-50 dark:bg-slate-800 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold dark:text-white">Items</h1>
          <p className="text-sm text-gray-500">Total: {items.length} items</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg"
        >
          <Plus size={18} /> Add Item
        </button>
      </div>

      {/* Search */}
      <div className="mb-4 relative">
        <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
        <input
          className="w-full pl-10 pr-3 py-2 rounded-md border dark:bg-slate-700 dark:text-white"
          placeholder="Search item..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-slate-800 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100 dark:bg-slate-700 text-left">
            <tr>
              <th className="p-4">Item</th>
              <th>SKU</th>
              <th>Category</th>
              <th>Qty</th>
              <th>Price</th>
              <th>Status</th>
              <th className="text-right p-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.map((item) => (
              <tr key={item.id} className="border-t dark:border-slate-700">
                <td className="p-4">
                  <div className="font-medium">{item.nama}</div>
                  <div className="text-xs text-gray-500">{item.kode}</div>
                </td>
                <td>{item.kode}</td>
                <td>{item.merek}</td>
                <td>{item.jumlah} {item.satuan}</td>
                <td className="font-semibold">
                  {formatRupiah(item.harga)}
                </td>
                <td>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    item.jumlah > 10
                      ? "bg-green-100 text-green-700"
                      : item.jumlah > 0
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-red-100 text-red-700"
                  }`}>
                    {item.jumlah > 10 ? "In Stock" : item.jumlah > 0 ? "Low Stock" : "Out"}
                  </span>
                </td>
                <td className="text-right p-4">
                  <button onClick={() => openEdit(item)} className="text-blue-600 mr-3">Edit</button>
                  <button onClick={() => deleteItem(item.id)} className="text-red-600">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-lg w-full max-w-md">
            <div className="flex justify-between mb-4">
              <h2 className="font-bold">{editId ? "Edit Item" : "New Item"}</h2>
              <button onClick={() => setShowForm(false)}><X /></button>
            </div>

            {["kode", "nama", "merek", "satuan", "jumlah", "harga"].map((f) => (
              <input
                key={f}
                type={f === "jumlah" || f === "harga" ? "number" : "text"}
                placeholder={f.toUpperCase()}
                className="w-full mb-3 p-2 rounded border dark:bg-slate-700"
                value={form[f]}
                onChange={(e) => setForm({ ...form, [f]: e.target.value })}
              />
            ))}

            <button
              onClick={saveItem}
              className="w-full bg-blue-600 text-white py-2 rounded"
            >
              Save
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
