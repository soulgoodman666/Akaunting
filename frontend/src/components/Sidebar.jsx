import { useState } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import {
  ChevronDown, ChevronRight,
  LayoutDashboard, ShoppingCart, Building,
  Package, BarChart3,
  Users, FileText,
  Box, FolderTree, Truck,
  History,
  TrendingUp, ClipboardList, Send,
  PieChart, LineChart, FileBarChart,
  Grid3X3, Layers, ArrowLeftRight, Warehouse, Clock
} from "lucide-react";

export default function Sidebar() {
  // ✅ DARK MODE STATE
  const { darkMode, setDarkMode } = useTheme();

  const [openMenus, setOpenMenus] = useState({
    sales: false,
    inventory: true,
    reports: false,
  });

  const toggleMenu = (menu) => {
    setOpenMenus(prev => ({ ...prev, [menu]: !prev[menu] }));
  };

  return (
    <aside className="
      w-64 h-screen p-4 overflow-y-auto border-r
      bg-gradient-to-b from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900 text-gray-800 border-gray-200 dark:text-gray-100 dark:border-slate-700
    ">

      {/* LOGO */}
      <div className="flex items-center gap-3 p-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg" />
        <h1 className="font-bold text-xl bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">Akaunting</h1>
      </div>

      {/* DASHBOARD */}
      <Link
        to="/dashboard"
        className="flex items-center gap-3 px-3 py-2.5 rounded-lg
        hover:bg-gradient-to-r hover:from-blue-100 hover:to-indigo-100 dark:hover:from-slate-800 dark:hover:to-gray-800 transition-all duration-200 group"
      >
        <LayoutDashboard className="w-5 h-5 text-blue-600 group-hover:scale-110 transition-transform duration-200" />
        <span className="font-medium">Dashboard</span>
      </Link>

      {/* SALES */}
      <div className="mt-2">
        <button
          onClick={() => toggleMenu("sales")}
          className="flex w-full justify-between items-center px-3 py-2.5 rounded-lg
          hover:bg-green-100 dark:hover:bg-slate-800"
        >
          <div className="flex items-center gap-3">
            <ShoppingCart className="w-5 h-5 text-green-600" />
            Sales
          </div>
          {openMenus.sales ? <ChevronDown /> : <ChevronRight />}
        </button>

        {openMenus.sales && (
          <ul className="ml-10 mt-2 space-y-1 text-sm">
            <li>
              <Link to="/sales/overview" className="flex items-center gap-2 hover:text-green-600 dark:hover:text-green-400">
                <TrendingUp className="w-4 h-4" />
                Overview
              </Link>
            </li>
            <li>
              <Link to="/sales/orders" className="flex items-center gap-2 hover:text-green-600 dark:hover:text-green-400">
                <ClipboardList className="w-4 h-4" />
                Orders
              </Link>
            </li>
            <li>
              <Link to="/sales/invoices" className="flex items-center gap-2 hover:text-green-600 dark:hover:text-green-400">
                <FileText className="w-4 h-4" />
                Invoices
              </Link>
            </li>
            <li>
              <Link to="/sales/customers" className="flex items-center gap-2 hover:text-green-600 dark:hover:text-green-400">
                <Users className="w-4 h-4" />
                Customers
              </Link>
            </li>
            <li>
              <Link to="/sales/quotation" className="flex items-center gap-2 hover:text-green-600 dark:hover:text-green-400">
                <Send className="w-4 h-4" />
                Quotation
              </Link>
            </li>
          </ul>
        )}
      </div>

      {/* INVENTORY */}
      <div className="mt-2">
        <button
          onClick={() => toggleMenu("inventory")}
          className="flex w-full justify-between items-center px-3 py-2.5 rounded-lg
          hover:bg-purple-100 dark:hover:bg-slate-800"
        >
          <div className="flex items-center gap-3">
            <Package className="w-5 h-5 text-purple-600" />
            Inventory
          </div>
          {openMenus.inventory ? <ChevronDown /> : <ChevronRight />}
        </button>

        {openMenus.inventory && (
          <ul className="ml-10 mt-2 space-y-1 text-sm">
            <li>
              <Link to="/inventory/items" className="flex items-center gap-2 hover:text-blue-600 dark:hover:text-blue-400">
                <Grid3X3 className="w-4 h-4 text-blue-500" />
                Items
              </Link>
            </li>
            <li>
              <Link to="/inventory/groups" className="flex items-center gap-2 hover:text-blue-600 dark:hover:text-blue-400">
                <Layers className="w-4 h-4 text-purple-500" />
                Groups
              </Link>
            </li>
            <li>
              <Link to="/inventory/transfer-order" className="flex items-center gap-2 hover:text-blue-600 dark:hover:text-blue-400">
                <ArrowLeftRight className="w-4 h-4 text-orange-500" />
                Transfer
              </Link>
            </li>
            <li>
              <Link to="/inventory/warehouse" className="flex items-center gap-2 hover:text-blue-600 dark:hover:text-blue-400">
                <Warehouse className="w-4 h-4 text-green-500" />
                Warehouse
              </Link>
            </li>
            <li>
              <Link to="/inventory/history" className="flex items-center gap-2 hover:text-blue-600 dark:hover:text-blue-400">
                <Clock className="w-4 h-4 text-gray-500" />
                History
              </Link>
            </li>
          </ul>
        )}
      </div>

      {/* REPORTS */}
      <div className="mt-2">
        <button
          onClick={() => toggleMenu("reports")}
          className="flex w-full justify-between items-center px-3 py-2.5 rounded-lg
          hover:bg-red-100 dark:hover:bg-slate-800"
        >
          <div className="flex items-center gap-3">
            <BarChart3 className="w-5 h-5 text-red-600" />
            Reports
          </div>
          {openMenus.reports ? <ChevronDown /> : <ChevronRight />}
        </button>

        {openMenus.reports && (
          <ul className="ml-10 mt-2 space-y-1 text-sm">
            <li>
              <Link to="/reports/financial" className="flex items-center gap-2 hover:text-red-600 dark:hover:text-red-400">
                <LineChart className="w-4 h-4" />
                Financial
              </Link>
            </li>
            <li>
              <Link to="/reports/sales-report" className="flex items-center gap-2 hover:text-red-600 dark:hover:text-red-400">
                <PieChart className="w-4 h-4" />
                Sales
              </Link>
            </li>
            <li>
              <Link to="/reports/inventory-report" className="flex items-center gap-2 hover:text-red-600 dark:hover:text-red-400">
                <FileBarChart className="w-4 h-4" />
                Inventory
              </Link>
            </li>
          </ul>
        )}
      </div>

      {/* 🌙 DARK MODE TOGGLE */}
      <button
        onClick={() => setDarkMode()}
        className="
          mt-6 w-full rounded-lg px-4 py-2 text-sm font-semibold
          bg-slate-200 hover:bg-slate-300
          dark:bg-slate-800 dark:hover:bg-slate-700
        "
      >
        {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
      </button>

    </aside>
  );
}
