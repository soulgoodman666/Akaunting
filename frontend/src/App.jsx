import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Items from "./pages/sidebar/Items";
import Groups from "./pages/sidebar/Groups";
import GroupDetail from "./pages/sidebar/GroupDetail";
import TransferOrder from "./pages/sidebar/TransferOrder";
import Adjustment from "./pages/sidebar/Adjustment";
import Warehouse from "./pages/sidebar/Warehouse";
import History from "./pages/sidebar/History";

export default function App() {
  return (
    <BrowserRouter>
      <div className="flex h-screen bg-gray-50 dark:bg-slate-900">
        <Sidebar />

        <main className="flex-1 bg-gray-50 dark:bg-slate-900 p-6">
          <Routes>
            <Route path="/" element={<History />} />
            <Route path="/inventory/items" element={<Items />} />
            <Route path="/inventory/groups" element={<Groups />} />
            <Route path="/inventory/groups/:id" element={<GroupDetail />} />
            <Route path="/inventory/transfer-order" element={<TransferOrder />} />
            <Route path="/inventory/adjustment" element={<Adjustment />} />
            <Route path="/inventory/warehouse" element={<Warehouse />} />
            <Route path="/inventory/history" element={<History />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
