import { 
  Activity, Search, Filter, Download, Eye, X, Package, Clock, User, Warehouse, TrendingUp, AlertCircle, CheckCircle, AlertTriangle, RefreshCw, ChevronDown, Trash2
} from 'lucide-react';
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function History() {
  const [histories, setHistories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedHistory, setSelectedHistory] = useState(null);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showDownloadDropdown, setShowDownloadDropdown] = useState(false);
  const [showDetailDownloadDropdown, setShowDetailDownloadDropdown] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  // Fetch history from backend
  const fetchHistories = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8080/api/v1/history');
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setHistories(data);
    } catch (error) {
      console.error('Error fetching histories:', error);
      setHistories([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistories();
    // Create default user if not exists
    createDefaultUser();
  }, []);

  const createDefaultUser = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/v1/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          first_name: 'Default',
          last_name: 'User',
          email: 'admin@akaunting.com',
          password: 'admin123',
          phone: '08123456789',
          enabled: true,
          role: 'admin'
        })
      });
      if (response.ok) {
        console.log('Default user created successfully');
      } else {
        console.log('Default user already exists or failed to create');
      }
    } catch (error) {
      console.log('Error creating default user:', error);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Apakah Anda yakin ingin menghapus history ini?")) return;
    
    try {
      const response = await fetch(`http://localhost:8080/api/v1/history/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      setHistories(histories.filter(h => h.id !== id));
      alert("History berhasil dihapus!");
    } catch (error) {
      console.error('Error deleting history:', error);
      alert("Gagal menghapus history. Silakan coba lagi.");
    }
  };

  const downloadSingleHistory = () => {
    if (!selectedHistory) return;
    
    // HTML content untuk format Word/Document seperti surat
    const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>Detail Transaksi - ${selectedHistory.reference}</title>
        <style>
            body {
                font-family: 'Times New Roman', serif;
                line-height: 1.6;
                margin: 40px;
                color: #333;
            }
            .header {
                text-align: center;
                border-bottom: 2px solid #333;
                padding-bottom: 20px;
                margin-bottom: 30px;
            }
            .logo {
                font-size: 24px;
                font-weight: bold;
                margin-bottom: 10px;
            }
            .title {
                font-size: 20px;
                font-weight: bold;
                margin: 20px 0;
            }
            .info-table {
                width: 100%;
                border-collapse: collapse;
                margin: 20px 0;
            }
            .info-table td {
                padding: 8px;
                border: 1px solid #ddd;
            }
            .info-table td:first-child {
                font-weight: bold;
                background-color: #f5f5f5;
                width: 30%;
            }
            .status-completed {
                color: #28a745;
                font-weight: bold;
            }
            .status-pending {
                color: #ffc107;
                font-weight: bold;
            }
            .status-failed {
                color: #dc3545;
                font-weight: bold;
            }
            .footer {
                margin-top: 50px;
                text-align: right;
                font-style: italic;
                color: #666;
            }
        </style>
    </head>
    <body>
        <div class="header">
            <div class="logo">AKAUNTING INVENTORY SYSTEM</div>
            <div>Detail Transaksi Inventory</div>
        </div>
        
        <div class="title">LAPORAN DETAIL TRANSAKSI</div>
        
        <table class="info-table">
            <tr>
                <td>ID Transaksi</td>
                <td>#${selectedHistory.id}</td>
            </tr>
            <tr>
                <td>Nomor Referensi</td>
                <td>${selectedHistory.reference}</td>
            </tr>
            <tr>
                <td>Tanggal & Waktu</td>
                <td>${selectedHistory.date}</td>
            </tr>
            <tr>
                <td>Nama Item</td>
                <td>${selectedHistory.item}</td>
            </tr>
            <tr>
                <td>Warehouse</td>
                <td>${selectedHistory.warehouse}</td>
            </tr>
            <tr>
                <td>Tipe Transaksi</td>
                <td>${selectedHistory.type}</td>
            </tr>
            <tr>
                <td>Quantity</td>
                <td>${selectedHistory.quantity > 0 ? '+' : ''}${selectedHistory.quantity} unit</td>
            </tr>
            <tr>
                <td>Status</td>
                <td class="status-${selectedHistory.status.toLowerCase()}">${selectedHistory.status}</td>
            </tr>
            <tr>
                <td>User</td>
                <td>${selectedHistory.user}</td>
            </tr>
            <tr>
                <td>Deskripsi</td>
                <td>${selectedHistory.description}</td>
            </tr>
        </table>
        
        <div class="footer">
            <p>Dokumen ini dibuat secara otomatis pada ${new Date().toLocaleString('id-ID')}</p>
            <p>Generated by Akaunting Inventory System</p>
        </div>
    </body>
    </html>
    `;
    
    // Buat blob dengan MIME type untuk Word
    const blob = new Blob([htmlContent], { 
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' 
    });
    
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `Detail_Transaksi_${selectedHistory.reference}_${new Date().toISOString().split('T')[0]}.doc`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadSingleHistoryHTML = () => {
    if (!selectedHistory) return;
    setShowPreviewModal(true);
  };

  const getPreviewHTML = () => {
    if (!selectedHistory) return '';
    
    // HTML content untuk preview surat laporan resmi
    return `
    <div style="font-family: 'Times New Roman', Times, serif; height: 100%; background: white; padding: 60px; position: relative;">
        <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%) rotate(-45deg); font-size: 100px; color: rgba(52, 73, 94, 0.05); font-weight: bold; pointer-events: none;">OFFICIAL</div>
        
        <div style="text-align: center; border-bottom: 3px solid #2c3e50; padding-bottom: 30px; margin-bottom: 40px;">
            <div style="font-size: 28px; font-weight: bold; color: #2c3e50; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 2px;">Akaunting Inventory System</div>
            <div style="font-size: 14px; color: #7f8c8d; margin-bottom: 15px;">Jl. Teknologi No. 123, Jakarta 12345 - Indonesia</div>
            <div style="font-size: 20px; font-weight: bold; color: #2c3e50; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 10px;">Laporan Detail Transaksi</div>
            <div style="font-size: 16px; color: #7f8c8d; font-style: italic;">Nomor: ${selectedHistory.reference}</div>
        </div>
        
        <div style="margin: 40px 0;">
            <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
                <tr>
                    <td style="padding: 12px 15px; border: 1px solid #ddd; font-weight: bold; background-color: #f8f9fa; width: 35%; text-transform: uppercase; font-size: 12px; color: #7f8c8d;">ID Transaksi</td>
                    <td style="padding: 12px 15px; border: 1px solid #ddd; font-size: 14px; color: #2c3e50;">#${selectedHistory.id}</td>
                </tr>
                <tr>
                    <td style="padding: 12px 15px; border: 1px solid #ddd; font-weight: bold; background-color: #f8f9fa; text-transform: uppercase; font-size: 12px; color: #7f8c8d;">Tanggal & Waktu</td>
                    <td style="padding: 12px 15px; border: 1px solid #ddd; font-size: 14px; color: #2c3e50;">${selectedHistory.date}</td>
                </tr>
                <tr>
                    <td style="padding: 12px 15px; border: 1px solid #ddd; font-weight: bold; background-color: #f8f9fa; text-transform: uppercase; font-size: 12px; color: #7f8c8d;">Nama Item</td>
                    <td style="padding: 12px 15px; border: 1px solid #ddd; font-size: 14px; color: #2c3e50;">${selectedHistory.item}</td>
                </tr>
                <tr>
                    <td style="padding: 12px 15px; border: 1px solid #ddd; font-weight: bold; background-color: #f8f9fa; text-transform: uppercase; font-size: 12px; color: #7f8c8d;">Lokasi Warehouse</td>
                    <td style="padding: 12px 15px; border: 1px solid #ddd; font-size: 14px; color: #2c3e50;">${selectedHistory.warehouse}</td>
                </tr>
                <tr>
                    <td style="padding: 12px 15px; border: 1px solid #ddd; font-weight: bold; background-color: #f8f9fa; text-transform: uppercase; font-size: 12px; color: #7f8c8d;">Tipe Transaksi</td>
                    <td style="padding: 12px 15px; border: 1px solid #ddd; font-size: 14px; color: #2c3e50;">${selectedHistory.type}</td>
                </tr>
                <tr>
                    <td style="padding: 12px 15px; border: 1px solid #ddd; font-weight: bold; background-color: #f8f9fa; text-transform: uppercase; font-size: 12px; color: #7f8c8d;">Jumlah Quantity</td>
                    <td style="padding: 12px 15px; border: 1px solid #ddd; font-size: 14px; color: ${selectedHistory.quantity > 0 ? '#27ae60' : '#e74c3c'}; font-weight: bold;">
                        ${selectedHistory.quantity > 0 ? '+' : ''}${selectedHistory.quantity} unit
                    </td>
                </tr>
                <tr>
                    <td style="padding: 12px 15px; border: 1px solid #ddd; font-weight: bold; background-color: #f8f9fa; text-transform: uppercase; font-size: 12px; color: #7f8c8d;">Status Transaksi</td>
                    <td style="padding: 12px 15px; border: 1px solid #ddd; font-size: 14px; color: ${selectedHistory.status === 'Completed' ? '#27ae60' : selectedHistory.status === 'Pending' ? '#f39c12' : '#e74c3c'}; font-weight: bold; text-transform: uppercase;">
                        ${selectedHistory.status}
                    </td>
                </tr>
                <tr>
                    <td style="padding: 12px 15px; border: 1px solid #ddd; font-weight: bold; background-color: #f8f9fa; text-transform: uppercase; font-size: 12px; color: #7f8c8d;">Pengguna</td>
                    <td style="padding: 12px 15px; border: 1px solid #ddd; font-size: 14px; color: #2c3e50;">${selectedHistory.user}</td>
                </tr>
            </table>
            
            <div style="background: #f8f9fa; border: 1px solid #e9ecef; border-left: 4px solid #3498db; padding: 20px; margin: 20px 0; font-style: italic; color: #34495e;">
                <strong style="color: #2c3e50; font-style: normal;">Deskripsi Transaksi:</strong><br>
                ${selectedHistory.description}
            </div>
        </div>
        
        <div style="margin-top: 60px; text-align: right; padding-top: 30px; border-top: 1px solid #ecf0f1;">
            <div style="width: 250px; border-top: 1px solid #2c3e50; margin-top: 60px; margin-left: auto; text-align: center;">
                <div style="font-size: 12px; color: #7f8c8d; margin-top: 5px; text-transform: uppercase;">System Generated</div>
            </div>
            
            <div style="font-size: 11px; color: #95a5a6; margin-top: 20px; text-align: center;">
                Dokumen ini dibuat secara otomatis pada ${new Date().toLocaleString('id-ID', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                })}<br>
                Generated by Akaunting Inventory System v1.0
            </div>
        </div>
    </div>
    `;
  };

  const downloadCSV = () => {
    setShowDownloadDropdown(false);
    
    // CSV Headers yang lebih rapi
    const csvHeaders = [
      'ID',
      'Tanggal & Waktu',
      'Nama Item',
      'Warehouse',
      'Tipe Transaksi',
      'Quantity',
      'Status',
      'User',
      'No. Referensi',
      'Deskripsi'
    ];
    
    // Format data yang lebih rapi
    const csvData = filteredHistories.map(history => [
      history.id,
      `"${history.date}"`,
      `"${history.item}"`,
      `"${history.warehouse}"`,
      `"${history.type}"`,
      history.quantity,
      `"${history.status}"`,
      `"${history.user}"`,
      `"${history.reference}"`,
      `"${history.description}"`
    ]);
    
    // Buat CSV content dengan proper formatting
    const csvContent = [
      // Header row
      csvHeaders.join(','),
      // Data rows
      ...csvData.map(row => row.join(','))
    ].join('\n');
    
    // Tambah BOM untuk UTF-8 agar Excel bisa membaca karakter khusus
    const BOM = '\uFEFF';
    const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
    
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `History_Inventory_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadJSON = () => {
    setShowDownloadDropdown(false);
    const dataToDownload = {
      export_date: new Date().toISOString(),
      total_records: filteredHistories.length,
      filters: {
        search: search,
        type: filterType,
        status: filterStatus
      },
      data: filteredHistories
    };
    
    const blob = new Blob([JSON.stringify(dataToDownload, null, 2)], { type: 'application/json' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `history_${new Date().toISOString().split('T')[0]}.json`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredHistories = histories.filter((history) => {
    const matchesSearch = 
      history.item.toLowerCase().includes(search.toLowerCase()) ||
      history.warehouse.toLowerCase().includes(search.toLowerCase()) ||
      history.reference.toLowerCase().includes(search.toLowerCase()) ||
      history.user.toLowerCase().includes(search.toLowerCase());
    
    const matchesType = filterType === "all" || history.type === filterType;
    const matchesStatus = filterStatus === "all" || history.status === filterStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const getStatusBadge = (status) => {
    const statusConfig = {
      Completed: { bg: 'bg-green-100 dark:bg-green-900/20', text: 'text-green-700 dark:text-green-400', border: 'border-green-200 dark:border-green-800', icon: CheckCircle, color: 'text-green-500' },
      Pending: { bg: 'bg-yellow-100 dark:bg-yellow-900/20', text: 'text-yellow-700 dark:text-yellow-400', border: 'border-yellow-200 dark:border-yellow-800', icon: AlertCircle, color: 'text-yellow-500' },
      Failed: { bg: 'bg-red-100 dark:bg-red-900/20', text: 'text-red-700 dark:text-red-400', border: 'border-red-200 dark:border-red-800', icon: AlertTriangle, color: 'text-red-500' },
    };
    
    const config = statusConfig[status] || statusConfig.Pending;
    const Icon = config.icon;
    
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${config.bg} ${config.text} ${config.border}`}>
        <Icon className={`w-3 h-3 mr-1 ${config.color}`} />
        {status}
      </span>
    );
  };

  const getTypeBadge = (type) => {
    const typeConfig = {
      'Stock In': { bg: 'bg-blue-100 dark:bg-blue-900/20', text: 'text-blue-700 dark:text-blue-400', border: 'border-blue-200 dark:border-blue-800', icon: TrendingUp },
      'Stock Out': { bg: 'bg-orange-100 dark:bg-orange-900/20', text: 'text-orange-700 dark:text-orange-400', border: 'border-orange-200 dark:border-orange-800', icon: Package },
      'Adjustment': { bg: 'bg-purple-100 dark:bg-purple-900/20', text: 'text-purple-700 dark:text-purple-400', border: 'border-purple-200 dark:border-purple-800', icon: RefreshCw },
    };
    
    const config = typeConfig[type] || typeConfig['Stock In'];
    const Icon = config.icon;
    
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${config.bg} ${config.text} ${config.border}`}>
        <Icon className={`w-3 h-3 mr-1 ${type === 'Stock In' ? 'text-blue-500' : type === 'Stock Out' ? 'text-orange-500' : 'text-purple-500'}`} />
        {type}
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
              <div className="p-4 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
                <Activity className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">History Items</h1>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Lacak semua perubahan inventory dengan mudah</p>
              </div>
            </div>
            
            <div className="relative">
            <button 
              onClick={() => setShowDownloadDropdown(!showDownloadDropdown)}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              <Download size={20} /> Export <ChevronDown size={16} />
            </button>
            
            {showDownloadDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50">
                <button
                  onClick={downloadCSV}
                  className="flex items-center gap-2 w-full px-4 py-3 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors rounded-t-lg"
                >
                  <Download size={16} />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Download CSV</span>
                </button>
                <button
                  onClick={downloadJSON}
                  className="flex items-center gap-2 w-full px-4 py-3 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors rounded-b-lg"
                >
                  <Download size={16} />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Download JSON</span>
                </button>
              </div>
            )}
          </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">Total Transaksi</p>
                  <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">{histories.length}</p>
                </div>
                <Activity className="w-8 h-8 text-blue-500" />
              </div>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl p-4 border border-green-200 dark:border-green-800">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-green-600 dark:text-green-400 font-medium">Stock In</p>
                  <p className="text-2xl font-bold text-green-900 dark:text-green-100">{histories.filter(h => h.type === 'Stock In').length}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-500" />
              </div>
            </div>
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-xl p-4 border border-orange-200 dark:border-orange-800">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-orange-600 dark:text-orange-400 font-medium">Stock Out</p>
                  <p className="text-2xl font-bold text-orange-900 dark:text-orange-100">{histories.filter(h => h.type === 'Stock Out').length}</p>
                </div>
                <Package className="w-8 h-8 text-orange-500" />
              </div>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl p-4 border border-purple-200 dark:border-purple-800">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-purple-600 dark:text-purple-400 font-medium">Adjustment</p>
                  <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">{histories.filter(h => h.type === 'Adjustment').length}</p>
                </div>
                <RefreshCw className="w-8 h-8 text-purple-500" />
              </div>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Cari berdasarkan item, warehouse, referensi, atau user..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            >
              <option value="all">Semua Tipe</option>
              <option value="Stock In">Stock In</option>
              <option value="Stock Out">Stock Out</option>
              <option value="Adjustment">Adjustment</option>
            </select>
            
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            >
              <option value="all">Semua Status</option>
              <option value="Completed">Completed</option>
              <option value="Pending">Pending</option>
              <option value="Failed">Failed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden backdrop-blur-sm">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-800 px-6 py-4 border-b border-gray-200 dark:border-gray-600">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-600" />
            Riwayat Inventory
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Tanggal</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Item</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Warehouse</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Tipe</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Quantity</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">User</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Referensi</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-100 dark:divide-gray-700">
              {filteredHistories.map((history) => (
                <tr key={history.id} className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 dark:hover:from-gray-700 dark:hover:to-gray-600 transition-all duration-200 cursor-pointer group" onClick={() => setSelectedHistory(history)}>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <div>
                        <div className="text-sm font-semibold text-gray-900 dark:text-white">{history.date}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-lg group-hover:scale-110 transition-transform duration-200">
                        <Package className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900 dark:text-white">{history.item}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Warehouse className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-900 dark:text-white">{history.warehouse}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {getTypeBadge(history.type)}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-sm font-semibold ${
                      history.quantity > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                    }`}>
                      {history.quantity > 0 ? '+' : ''}{history.quantity}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(history.status)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-900 dark:text-white">{history.user}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-mono text-gray-600 dark:text-gray-400">{history.reference}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <button 
                        onClick={(e) => { e.stopPropagation(); setSelectedHistory(history); }}
                        className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                        title="View details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleDelete(history.id); }}
                        className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        title="Delete history"
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
      {selectedHistory && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-800">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Activity className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">Detail Transaksi</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{selectedHistory.reference}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <button
                    onClick={() => setShowDetailDownloadDropdown(!showDetailDownloadDropdown)}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                    title="Download Options"
                  >
                    <Download size={16} />
                    <span className="text-sm font-medium">Download</span>
                    <ChevronDown size={14} />
                  </button>
                  
                  {showDetailDownloadDropdown && (
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50">
                      <button
                        onClick={() => { setShowDetailDownloadDropdown(false); downloadSingleHistory(); }}
                        className="flex items-center gap-2 w-full px-4 py-3 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors rounded-t-lg"
                      >
                        <Download size={16} />
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Download Word (.doc)</span>
                      </button>
                      <button
                        onClick={() => { setShowDetailDownloadDropdown(false); downloadSingleHistoryHTML(); }}
                        className="flex items-center gap-2 w-full px-4 py-3 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors rounded-b-lg"
                      >
                        <Eye size={16} />
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Preview & Print</span>
                      </button>
                    </div>
                  )}
                </div>
                <button
                  onClick={() => setSelectedHistory(null)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <Activity className="w-5 h-5 text-blue-600" />
                    Informasi Transaksi
                  </h3>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Tanggal</span>
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">{selectedHistory.date}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Item</span>
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">{selectedHistory.item}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Warehouse</span>
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">{selectedHistory.warehouse}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Tipe</span>
                      {getTypeBadge(selectedHistory.type)}
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Quantity</span>
                      <span className={`text-sm font-semibold ${
                        selectedHistory.quantity > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                      }`}>
                        {selectedHistory.quantity > 0 ? '+' : ''}{selectedHistory.quantity}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Status</span>
                      {getStatusBadge(selectedHistory.status)}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <User className="w-5 h-5 text-blue-600" />
                    Informasi Tambahan
                  </h3>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">User</span>
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">{selectedHistory.user}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Referensi</span>
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">{selectedHistory.reference}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Deskripsi</span>
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">{selectedHistory.description}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {showPreviewModal && (
        <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center z-50">
          <div className="w-full h-full max-w-5xl max-h-[95vh] bg-white rounded-lg shadow-2xl overflow-hidden relative">
            {/* Close Button */}
            <button
              onClick={() => setShowPreviewModal(false)}
              className="absolute top-4 right-4 z-10 p-2 bg-red-600 hover:bg-red-700 text-white rounded-full transition-colors shadow-lg"
              title="Close Preview"
            >
              <X className="w-5 h-5" />
            </button>
            
            {/* Preview Content */}
            <div 
              className="w-full h-full overflow-y-auto"
              dangerouslySetInnerHTML={{ __html: getPreviewHTML() }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
