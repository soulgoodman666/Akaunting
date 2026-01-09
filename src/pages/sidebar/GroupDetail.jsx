import Layout from "../../components/layout/Layout";
import { useParams, useLocation, Link } from "react-router-dom";
import { useEffect, useState } from "react";

export default function GroupDetail() {
  const { id } = useParams();
  const location = useLocation();

  // 🔥 ambil nama group dari halaman sebelumnya
  const groupName = location.state?.groupName || `Group ${id}`;

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:8080/groups/${id}/items`)
      .then(res => res.json())
      .then(data => {
        setItems(Array.isArray(data) ? data : []);
      })
      .catch(() => {
        setItems([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  return (
    <Layout>
      <div className="p-6">
        {/* TOMBOL KEMBALI */}
        <Link
          to="/inventory/groups"
          className="inline-block mb-8 text-sm text-purple-600 hover:underline"
        >
          ← back
        </Link>

        <h1 className="text-2xl font-semibold mb-2">
          Detail Group
        </h1>

        <p className="text-gray-600 mb-6">
          Group: <span className="font-medium">{groupName}</span>
        </p>

        {/* ISI ITEM */}
        <div className="bg-white border rounded-xl">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Item Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Stock
                </th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200">
              {loading && (
                <tr>
                  <td colSpan="2" className="px-6 py-4 text-gray-500">
                    Loading...
                  </td>
                </tr>
              )}

              {!loading && items.length === 0 && (
                <tr>
                  <td colSpan="2" className="px-6 py-4 text-gray-500">
                    Belum ada item
                  </td>
                </tr>
              )}

              {items.map((item) => (
                <tr key={item.id}>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {item.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {item.stock}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}
