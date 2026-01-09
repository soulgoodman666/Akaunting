import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, ChevronRight, 
  LayoutDashboard, ShoppingCart, 
  Package, CreditCard, BarChart3, 
  AppWindow, Home, DollarSign, 
  Users, FileText, Settings,
  // Inventory icons
  Box, FolderTree, Layers, Truck, 
  RefreshCw, Warehouse, History,
  // Sales icons
  TrendingUp, ClipboardList, Send,
  // Purchase icons
  ShoppingBag, Receipt, PackageCheck,
  // Banking icons
  Landmark, Wallet, ArrowLeftRight,
  // Reports icons
  PieChart, LineChart, FileBarChart
} from "lucide-react";

export default function Sidebar() {
  const [openMenus, setOpenMenus] = useState({
    dashboard: false,
    sales: false,
    purchase: false,
    inventory: true,
    banking: false,
    reports: false,
    apps: false
  });

  const toggleMenu = (menu) => {
    setOpenMenus(prev => ({
      ...prev,
      [menu]: !prev[menu]
    }));
  };

  return (
    <aside className="w-64 h-screen bg-green-50 text-gray-800 border-r border-gray-200 p-4 overflow-y-auto">
      
      {/* Logo / Brand */}
      <div className="flex items-center gap-3 p-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-br rounded-lg flex items-center justify-center">
        </div>
        <div>
          <h1 className="font-bold text-lg text-gray-900">Akaunting</h1>
        </div>
      </div>

      {/* Dashboard */}
      <div className="mb-2">
        <Link
          to="/dashboard"
          className="flex items-center gap-3 px-3 py-2.5 hover:bg-blue-100 rounded-lg transition-colors group"
        >
          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200">
            <LayoutDashboard className="w-5 h-5 text-blue-600" />
          </div>
          <span className="font-medium text-gray-700">Dashboard</span>
        </Link>
      </div>

      {/* Sales */}
      <div className="mb-2">
        <button
          onClick={() => toggleMenu('sales')}
          className="flex items-center justify-between w-full px-3 py-2.5 hover:bg-green-100 rounded-lg transition-colors group"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200">
              <ShoppingCart className="w-5 h-5 text-green-600" />
            </div>
            <span className="font-medium text-gray-700">Sales</span>
          </div>
          {openMenus.sales ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
        </button>

        {openMenus.sales && (
          <ul className="ml-12 mt-2 space-y-1 text-sm">
            <li>
              <Link to="/sales/overview" className="flex items-center gap-3 px-3 py-2 hover:bg-green-50 rounded-lg transition-colors group">
                <TrendingUp className="w-4 h-4 text-green-600" />
                <span>Overview</span>
              </Link>
            </li>
            <li>
              <Link to="/sales/orders" className="flex items-center gap-3 px-3 py-2 hover:bg-green-50 rounded-lg transition-colors group">
                <ClipboardList className="w-4 h-4 text-green-600" />
                <span>Orders</span>
              </Link>
            </li>
            <li>
              <Link to="/sales/invoices" className="flex items-center gap-3 px-3 py-2 hover:bg-green-50 rounded-lg transition-colors group">
                <FileText className="w-4 h-4 text-green-600" />
                <span>Invoices</span>
              </Link>
            </li>
            <li>
              <Link to="/sales/customers" className="flex items-center gap-3 px-3 py-2 hover:bg-green-50 rounded-lg transition-colors group">
                <Users className="w-4 h-4 text-green-600" />
                <span>Customers</span>
              </Link>
            </li>
            <li>
              <Link to="/sales/quotation" className="flex items-center gap-3 px-3 py-2 hover:bg-green-50 rounded-lg transition-colors group">
                <Send className="w-4 h-4 text-green-600" />
                <span>Quotation</span>
              </Link>
            </li>
          </ul>
        )}
      </div>

      {/* Purchase */}
      <div className="mb-2">
        <button
          onClick={() => toggleMenu('purchase')}
          className="flex items-center justify-between w-full px-3 py-2.5 hover:bg-orange-100 rounded-lg transition-colors group"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center group-hover:bg-orange-200">
              <ShoppingBag className="w-5 h-5 text-orange-600" />
            </div>
            <span className="font-medium text-gray-700">Purchase</span>
          </div>
          {openMenus.purchase ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
        </button>

        {openMenus.purchase && (
          <ul className="ml-12 mt-2 space-y-1 text-sm">
            <li>
              <Link to="/purchase/orders" className="flex items-center gap-3 px-3 py-2 hover:bg-orange-50 rounded-lg transition-colors group">
                <ShoppingBag className="w-4 h-4 text-orange-600" />
                <span>Purchase Orders</span>
              </Link>
            </li>
            <li>
              <Link to="/purchase/bills" className="flex items-center gap-3 px-3 py-2 hover:bg-orange-50 rounded-lg transition-colors group">
                <Receipt className="w-4 h-4 text-orange-600" />
                <span>Bills</span>
              </Link>
            </li>
            <li>
              <Link to="/purchase/vendors" className="flex items-center gap-3 px-3 py-2 hover:bg-orange-50 rounded-lg transition-colors group">
                <Users className="w-4 h-4 text-orange-600" />
                <span>Vendors</span>
              </Link>
            </li>
            <li>
              <Link to="/purchase/receipts" className="flex items-center gap-3 px-3 py-2 hover:bg-orange-50 rounded-lg transition-colors group">
                <PackageCheck className="w-4 h-4 text-orange-600" />
                <span>Receipts</span>
              </Link>
            </li>
          </ul>
        )}
      </div>

      {/* Inventory */}
      <div className="mb-2">
        <button
          onClick={() => toggleMenu('inventory')}
          className="flex items-center justify-between w-full px-3 py-2.5 hover:bg-purple-100 rounded-lg transition-colors group"
        >
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center group-hover:from-purple-600 group-hover:to-blue-700">
                <Package className="w-5 h-5 text-white" />
              </div>
            </div>
            <span className="font-medium text-gray-700">Inventory</span>
          </div>
          {openMenus.inventory ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
        </button>

        {openMenus.inventory && (
          <ul className="ml-12 mt-2 space-y-1 text-sm">
            <li>
              <Link to="/inventory/items" className="flex items-center gap-3 px-3 py-2 hover:bg-purple-50 rounded-lg transition-colors group">
                <Box className="w-4 h-4 text-purple-600" />
                <span>Items</span>
              </Link>
            </li>
            <li>
              <Link to="/inventory/groups" className="flex items-center gap-3 px-3 py-2 hover:bg-purple-50 rounded-lg transition-colors group">
                <FolderTree className="w-4 h-4 text-purple-600" />
                <span>Groups</span>
              </Link>
            </li>
            <li>
              <Link to="/inventory/variants" className="flex items-center gap-3 px-3 py-2 hover:bg-purple-50 rounded-lg transition-colors group">
                <Layers className="w-4 h-4 text-purple-600" />
                <span>Variants</span>
              </Link>
            </li>
            <li>
              <Link to="/inventory/transfer-order" className="flex items-center gap-3 px-3 py-2 hover:bg-purple-50 rounded-lg transition-colors group">
                <Truck className="w-4 h-4 text-orange-600" />
                <span>Transfer Order</span>
              </Link>
            </li>
            <li>
              <Link to="/inventory/adjustment" className="flex items-center gap-3 px-3 py-2 hover:bg-purple-50 rounded-lg transition-colors group">
                <RefreshCw className="w-4 h-4 text-yellow-600" />
                <span>Adjustment</span>
              </Link>
            </li>
            <li>
              <Link to="/inventory/warehouse" className="flex items-center gap-3 px-3 py-2 hover:bg-purple-50 rounded-lg transition-colors group">
                <Warehouse className="w-4 h-4 text-green-600" />
                <span>Warehouse</span>
              </Link>
            </li>
            <li>
              <Link to="/inventory/history" className="flex items-center gap-3 px-3 py-2 hover:bg-purple-50 rounded-lg transition-colors group">
                <History className="w-4 h-4 text-gray-600" />
                <span>History</span>
              </Link>
            </li>
          </ul>
        )}
      </div>

      {/* Banking */}
      <div className="mb-2">
        <button
          onClick={() => toggleMenu('banking')}
          className="flex items-center justify-between w-full px-3 py-2.5 hover:bg-teal-100 rounded-lg transition-colors group"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center group-hover:bg-teal-200">
              <Landmark className="w-5 h-5 text-teal-600" />
            </div>
            <span className="font-medium text-gray-700">Banking</span>
          </div>
          {openMenus.banking ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
        </button>

        {openMenus.banking && (
          <ul className="ml-12 mt-2 space-y-1 text-sm">
            <li>
              <Link to="/banking/accounts" className="flex items-center gap-3 px-3 py-2 hover:bg-teal-50 rounded-lg transition-colors group">
                <CreditCard className="w-4 h-4 text-teal-600" />
                <span>Accounts</span>
              </Link>
            </li>
            <li>
              <Link to="/banking/transactions" className="flex items-center gap-3 px-3 py-2 hover:bg-teal-50 rounded-lg transition-colors group">
                <ArrowLeftRight className="w-4 h-4 text-teal-600" />
                <span>Transactions</span>
              </Link>
            </li>
            <li>
              <Link to="/banking/transfer" className="flex items-center gap-3 px-3 py-2 hover:bg-teal-50 rounded-lg transition-colors group">
                <DollarSign className="w-4 h-4 text-teal-600" />
                <span>Fund Transfer</span>
              </Link>
            </li>
            <li>
              <Link to="/banking/reconciliation" className="flex items-center gap-3 px-3 py-2 hover:bg-teal-50 rounded-lg transition-colors group">
                <Wallet className="w-4 h-4 text-teal-600" />
                <span>Reconciliation</span>
              </Link>
            </li>
          </ul>
        )}
      </div>

      {/* Reports */}
      <div className="mb-2">
        <button
          onClick={() => toggleMenu('reports')}
          className="flex items-center justify-between w-full px-3 py-2.5 hover:bg-red-100 rounded-lg transition-colors group"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center group-hover:bg-red-200">
              <BarChart3 className="w-5 h-5 text-red-600" />
            </div>
            <span className="font-medium text-gray-700">Reports</span>
          </div>
          {openMenus.reports ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
        </button>

        {openMenus.reports && (
          <ul className="ml-12 mt-2 space-y-1 text-sm">
            <li>
              <Link to="/reports/financial" className="flex items-center gap-3 px-3 py-2 hover:bg-red-50 rounded-lg transition-colors group">
                <PieChart className="w-4 h-4 text-red-600" />
                <span>Financial</span>
              </Link>
            </li>
            <li>
              <Link to="/reports/sales-report" className="flex items-center gap-3 px-3 py-2 hover:bg-red-50 rounded-lg transition-colors group">
                <LineChart className="w-4 h-4 text-red-600" />
                <span>Sales Report</span>
              </Link>
            </li>
            <li>
              <Link to="/reports/inventory-report" className="flex items-center gap-3 px-3 py-2 hover:bg-red-50 rounded-lg transition-colors group">
                <FileBarChart className="w-4 h-4 text-red-600" />
                <span>Inventory Report</span>
              </Link>
            </li>
            <li>
              <Link to="/reports/analytics" className="flex items-center gap-3 px-3 py-2 hover:bg-red-50 rounded-lg transition-colors group">
                <BarChart3 className="w-4 h-4 text-red-600" />
                <span>Analytics</span>
              </Link>
            </li>
          </ul>
        )}
      </div>

      {/* Apps */}
      <div className="mb-2">
        <Link
          to="/apps"
          className="flex items-center gap-3 px-3 py-2.5 hover:bg-indigo-100 rounded-lg transition-colors group"
        >
          <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center group-hover:bg-indigo-200">
            <AppWindow className="w-5 h-5 text-indigo-600" />
          </div>
          <span className="font-medium text-gray-700">Apps</span>
        </Link>
      </div>
    </aside>
  );
}