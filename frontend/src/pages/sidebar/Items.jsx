import { useState } from "react";
import {
  Box,
  Plus,
  Trash2,
  X,
  Search,
  Edit,
  Package,
  MoreVertical,
  Eye,
  Package as ItemIcon,
  Tag,
  Layers,
  DollarSign,
  Activity,
  Download,
  ChevronDown,
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
  const [selectedItem, setSelectedItem] = useState(null);
  const [showDownloadDropdown, setShowDownloadDropdown] = useState(false);
  const [showDetailDownloadDropdown, setShowDetailDownloadDropdown] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  const [form, setForm] = useState({
    kode: "",
    nama: "",
    merek: "",
    kategori: "",
    satuan: "",
    jumlah: "",
    harga: "",
    status: "active", // Default aktif
    supplier: "",
    lokasi: "",
    tanggal_masuk: new Date().toISOString().split('T')[0], // Tanggal hari ini
  });

  // Kategori instrumen industri
  const industrialCategories = [
    "Industrial Gas",
    "Welding Equipment", 
    "Welding Materials",
    "Cutting Tools",
    "Measuring Instruments",
    "Safety Equipment",
    "Electrical Components",
    "Hydraulic Equipment",
    "Pneumatic Tools",
    "Industrial Chemicals",
    "Lubricants & Oils",
    "Fasteners & Hardware",
    "Industrial Filters",
    "Pumps & Valves",
    "Storage Tanks",
    "Industrial Sensors",
    "Control Systems",
    "Power Tools",
    "Hand Tools",
    "Other"
  ];

  // Satuan quantity
  const quantityUnits = [
    { value: "PCS", label: "Pieces (PCS)" },
    { value: "Liter", label: "Liter" },
    { value: "KG", label: "Kilogram (KG)" },
    { value: "Meter", label: "Meter" },
    { value: "Box", label: "Box" },
    { value: "Tube", label: "Tube" },
    { value: "Bottle", label: "Bottle" },
    { value: "Gallon", label: "Gallon" },
    { value: "Set", label: "Set" },
    { value: "Pair", label: "Pair" }
  ];

  // Daftar supplier
  const suppliers = [
    "PT Gas Indonesia",
    "PT Welding Supply", 
    "PT Industrial Tools",
    "PT Safety Equipment",
    "PT Chemical Industries",
    "PT Hydraulic Systems",
    "PT Electrical Components",
    "PT Measuring Instruments",
    "PT Cutting Tools",
    "PT Pneumatic Solutions",
    "PT Lubricant Center",
    "PT Hardware Supply",
    "PT Filter Systems",
    "PT Pump & Valve",
    "PT Storage Solutions",
    "PT Sensor Technology",
    "PT Control Systems",
    "PT Power Tools",
    "PT Hand Tools",
    "Other"
  ];

  // Daftar lokasi gudang
  const locations = [
    "Gudang A",
    "Gudang B", 
    "Gudang C",
    "Gudang D",
    "Gudang E",
    "Workshop Area",
    "Production Floor",
    "Quality Control",
    "Shipping Area",
    "Receiving Area",
    "Storage Room 1",
    "Storage Room 2",
    "Main Warehouse",
    "Secondary Warehouse",
    "Temporary Storage",
    "Outdoor Storage",
    "Cold Storage",
    "Hazardous Storage",
    "Office Storage",
    "Other"
  ];

  // Format harga untuk input
  const formatHargaInput = (value) => {
    // Hapus semua karakter non-digit
    const cleanValue = value.replace(/[^\d]/g, '');
    // Format dengan titik sebagai pemisah ribuan
    if (cleanValue === '') return '';
    return parseInt(cleanValue).toLocaleString('id-ID');
  };

  // Parse harga dari format input ke number
  const parseHarga = (formattedValue) => {
    const cleanValue = formattedValue.replace(/[^\d]/g, '');
    return cleanValue === '' ? 0 : parseInt(cleanValue);
  };

  const [items, setItems] = useState([
    { id: 1, kode: "M090", nama: "Gas Argon", merek: "Gas", satuan: "Tube", jumlah: 5, harga: 750000, status: "active", kategori: "Industrial Gas", deskripsi: "High purity argon gas for welding applications", supplier: "PT Gas Indonesia", tanggal_masuk: "2024-01-15", lokasi: "Gudang A" },
    { id: 2, kode: "M089", nama: "Gas Oksigen", merek: "Gas", satuan: "Tube", jumlah: 1, harga: 500000, status: "active", kategori: "Industrial Gas", deskripsi: "Medical grade oxygen gas", supplier: "PT Gas Indonesia", tanggal_masuk: "2024-01-10", lokasi: "Gudang A" },
    { id: 3, kode: "M088", nama: "Long Back Up", merek: "Welding", satuan: "PCS", jumlah: 0, harga: 250000, status: "inactive", kategori: "Welding Equipment", deskripsi: "Backup welding rod holder", supplier: "PT Welding Supply", tanggal_masuk: "2023-12-20", lokasi: "Gudang B" },
    { id: 4, kode: "M087", nama: "Keramik Las Argon", merek: "Welding", satuan: "PCS", jumlah: 13, harga: 120000, status: "active", kategori: "Welding Materials", deskripsi: "Ceramic backing for argon welding", supplier: "PT Welding Supply", tanggal_masuk: "2024-01-05", lokasi: "Gudang B" },
    { id: 5, kode: "M086", nama: "Body Collet", merek: "Welding", satuan: "PCS", jumlah: 21, harga: 90000, status: "active", kategori: "Welding Equipment", deskripsi: "Collet body for welding machine", supplier: "PT Industrial Tools", tanggal_masuk: "2023-11-15", lokasi: "Gudang C" },
  ]);

  const downloadSingleItem = () => {
    if (!selectedItem) return;
    
    // HTML content untuk format Word/Document seperti surat
    const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>Detail Item - ${selectedItem.kode}</title>
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
            .status-active {
                color: #28a745;
                font-weight: bold;
            }
            .status-inactive {
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
            <div>Detail Item Inventory</div>
        </div>
        
        <div class="title">LAPORAN DETAIL ITEM</div>
        
        <table class="info-table">
            <tr>
                <td>Kode Item</td>
                <td>${selectedItem.kode}</td>
            </tr>
            <tr>
                <td>Nama Item</td>
                <td>${selectedItem.nama}</td>
            </tr>
            <tr>
                <td>Merek</td>
                <td>${selectedItem.merek}</td>
            </tr>
            <tr>
                <td>Kategori</td>
                <td>${selectedItem.kategori}</td>
            </tr>
            <tr>
                <td>Satuan</td>
                <td>${selectedItem.satuan}</td>
            </tr>
            <tr>
                <td>Quantity</td>
                <td>${selectedItem.jumlah} ${selectedItem.satuan}</td>
            </tr>
            <tr>
                <td>Harga</td>
                <td>${formatRupiah(selectedItem.harga)}</td>
            </tr>
            <tr>
                <td>Total Nilai</td>
                <td>${formatRupiah(selectedItem.jumlah * selectedItem.harga)}</td>
            </tr>
            <tr>
                <td>Status</td>
                <td class="status-${selectedItem.status}">${selectedItem.status === 'active' ? 'Aktif' : 'Tidak Aktif'}</td>
            </tr>
            <tr>
                <td>Supplier</td>
                <td>${selectedItem.supplier}</td>
            </tr>
            <tr>
                <td>Tanggal Masuk</td>
                <td>${selectedItem.tanggal_masuk}</td>
            </tr>
            <tr>
                <td>Lokasi</td>
                <td>${selectedItem.lokasi}</td>
            </tr>
            <tr>
                <td>Deskripsi</td>
                <td>${selectedItem.deskripsi}</td>
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
    link.setAttribute('download', `Detail_Item_${selectedItem.kode}_${new Date().toISOString().split('T')[0]}.doc`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadSingleItemHTML = () => {
    if (!selectedItem) return;
    setShowPreviewModal(true);
  };

  const getPreviewHTML = () => {
    if (!selectedItem) return '';
    
    // HTML content untuk preview surat laporan resmi
    return `
    <div style="font-family: 'Times New Roman', Times, serif; height: 100%; background: white; padding: 60px; position: relative;">
        <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%) rotate(-45deg); font-size: 100px; color: rgba(52, 73, 94, 0.05); font-weight: bold; pointer-events: none;">OFFICIAL</div>
        
        <div style="text-align: center; border-bottom: 3px solid #2c3e50; padding-bottom: 30px; margin-bottom: 40px;">
            <div style="font-size: 28px; font-weight: bold; color: #2c3e50; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 2px;">Akaunting Inventory System</div>
            <div style="font-size: 14px; color: #7f8c8d; margin-bottom: 15px;">Jl. Teknologi No. 123, Jakarta 12345 - Indonesia</div>
            <div style="font-size: 20px; font-weight: bold; color: #2c3e50; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 10px;">Laporan Detail Item</div>
            <div style="font-size: 16px; color: #7f8c8d; font-style: italic;">Kode: ${selectedItem.kode}</div>
        </div>
        
        <div style="margin: 40px 0;">
            <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
                <tr>
                    <td style="padding: 12px 15px; border: 1px solid #ddd; font-weight: bold; background-color: #f8f9fa; width: 35%; text-transform: uppercase; font-size: 12px; color: #7f8c8d;">Kode Item</td>
                    <td style="padding: 12px 15px; border: 1px solid #ddd; font-size: 14px; color: #2c3e50;">${selectedItem.kode}</td>
                </tr>
                <tr>
                    <td style="padding: 12px 15px; border: 1px solid #ddd; font-weight: bold; background-color: #f8f9fa; text-transform: uppercase; font-size: 12px; color: #7f8c8d;">Nama Item</td>
                    <td style="padding: 12px 15px; border: 1px solid #ddd; font-size: 14px; color: #2c3e50;">${selectedItem.nama}</td>
                </tr>
                <tr>
                    <td style="padding: 12px 15px; border: 1px solid #ddd; font-weight: bold; background-color: #f8f9fa; text-transform: uppercase; font-size: 12px; color: #7f8c8d;">Merek</td>
                    <td style="padding: 12px 15px; border: 1px solid #ddd; font-size: 14px; color: #2c3e50;">${selectedItem.merek}</td>
                </tr>
                <tr>
                    <td style="padding: 12px 15px; border: 1px solid #ddd; font-weight: bold; background-color: #f8f9fa; text-transform: uppercase; font-size: 12px; color: #7f8c8d;">Kategori</td>
                    <td style="padding: 12px 15px; border: 1px solid #ddd; font-size: 14px; color: #2c3e50;">${selectedItem.kategori}</td>
                </tr>
                <tr>
                    <td style="padding: 12px 15px; border: 1px solid #ddd; font-weight: bold; background-color: #f8f9fa; text-transform: uppercase; font-size: 12px; color: #7f8c8d;">Satuan</td>
                    <td style="padding: 12px 15px; border: 1px solid #ddd; font-size: 14px; color: #2c3e50;">${selectedItem.satuan}</td>
                </tr>
                <tr>
                    <td style="padding: 12px 15px; border: 1px solid #ddd; font-weight: bold; background-color: #f8f9fa; text-transform: uppercase; font-size: 12px; color: #7f8c8d;">Quantity</td>
                    <td style="padding: 12px 15px; border: 1px solid #ddd; font-size: 14px; color: #2c3e50;">${selectedItem.jumlah} ${selectedItem.satuan}</td>
                </tr>
                <tr>
                    <td style="padding: 12px 15px; border: 1px solid #ddd; font-weight: bold; background-color: #f8f9fa; text-transform: uppercase; font-size: 12px; color: #7f8c8d;">Harga</td>
                    <td style="padding: 12px 15px; border: 1px solid #ddd; font-size: 14px; color: #2c3e50;">${formatRupiah(selectedItem.harga)}</td>
                </tr>
                <tr>
                    <td style="padding: 12px 15px; border: 1px solid #ddd; font-weight: bold; background-color: #f8f9fa; text-transform: uppercase; font-size: 12px; color: #7f8c8d;">Total Nilai</td>
                    <td style="padding: 12px 15px; border: 1px solid #ddd; font-size: 14px; color: #27ae60; font-weight: bold;">${formatRupiah(selectedItem.jumlah * selectedItem.harga)}</td>
                </tr>
                <tr>
                    <td style="padding: 12px 15px; border: 1px solid #ddd; font-weight: bold; background-color: #f8f9fa; text-transform: uppercase; font-size: 12px; color: #7f8c8d;">Status</td>
                    <td style="padding: 12px 15px; border: 1px solid #ddd; font-size: 14px; color: ${selectedItem.status === 'active' ? '#27ae60' : '#e74c3c'}; font-weight: bold; text-transform: uppercase;">
                        ${selectedItem.status === 'active' ? 'Aktif' : 'Tidak Aktif'}
                    </td>
                </tr>
                <tr>
                    <td style="padding: 12px 15px; border: 1px solid #ddd; font-weight: bold; background-color: #f8f9fa; text-transform: uppercase; font-size: 12px; color: #7f8c8d;">Supplier</td>
                    <td style="padding: 12px 15px; border: 1px solid #ddd; font-size: 14px; color: #2c3e50;">${selectedItem.supplier}</td>
                </tr>
                <tr>
                    <td style="padding: 12px 15px; border: 1px solid #ddd; font-weight: bold; background-color: #f8f9fa; text-transform: uppercase; font-size: 12px; color: #7f8c8d;">Tanggal Masuk</td>
                    <td style="padding: 12px 15px; border: 1px solid #ddd; font-size: 14px; color: #2c3e50;">${selectedItem.tanggal_masuk}</td>
                </tr>
                <tr>
                    <td style="padding: 12px 15px; border: 1px solid #ddd; font-weight: bold; background-color: #f8f9fa; text-transform: uppercase; font-size: 12px; color: #7f8c8d;">Lokasi</td>
                    <td style="padding: 12px 15px; border: 1px solid #ddd; font-size: 14px; color: #2c3e50;">${selectedItem.lokasi}</td>
                </tr>
            </table>
            
            <div style="background: #f8f9fa; border: 1px solid #e9ecef; border-left: 4px solid #3498db; padding: 20px; margin: 20px 0; font-style: italic; color: #34495e;">
                <strong style="color: #2c3e50; font-style: normal;">Deskripsi Item:</strong><br>
                ${selectedItem.deskripsi}
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
      'Kode Item',
      'Nama Item',
      'Merek',
      'Kategori',
      'Satuan',
      'Quantity',
      'Harga (Rp)',
      'Total Nilai (Rp)',
      'Status',
      'Supplier',
      'Tanggal Masuk',
      'Lokasi',
      'Deskripsi'
    ];
    
    // Format data yang lebih rapi dengan perhitungan total nilai
    const csvData = filteredItems.map(item => [
      item.id,
      `"${item.kode}"`,
      `"${item.nama}"`,
      `"${item.merek}"`,
      `"${item.kategori}"`,
      `"${item.satuan}"`,
      item.jumlah,
      item.harga,
      item.jumlah * item.harga, // Total nilai
      `"${item.jumlah > 10 ? 'Tersedia' : item.jumlah > 0 ? 'Stok Rendah' : 'Habis'}"`,
      `"${item.supplier}"`,
      `"${item.tanggal_masuk}"`,
      `"${item.lokasi}"`,
      `"${item.deskripsi}"`
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
    link.setAttribute('download', `Data_Inventory_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadJSON = () => {
    setShowDownloadDropdown(false);
    const dataToDownload = {
      export_date: new Date().toISOString(),
      total_records: filteredItems.length,
      search_query: search,
      data: filteredItems
    };
    
    const blob = new Blob([JSON.stringify(dataToDownload, null, 2)], { type: 'application/json' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `items_${new Date().toISOString().split('T')[0]}.json`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredItems = items.filter(
    (item) =>
      item.nama.toLowerCase().includes(search.toLowerCase()) ||
      item.kode.toLowerCase().includes(search.toLowerCase()) ||
      item.merek.toLowerCase().includes(search.toLowerCase())
  );

  const openAdd = () => {
    setEditId(null);
    setForm({
      kode: "",
      nama: "",
      merek: "",
      kategori: "",
      satuan: "",
      jumlah: "",
      harga: "",
      status: "active",
      supplier: "",
      lokasi: "",
      tanggal_masuk: new Date().toISOString().split('T')[0],
    });
    setShowForm(true);
  };

  const openEdit = (item) => {
    setEditId(item.id);
    setForm(item);
    setShowForm(true);
  };

  const saveItem = () => {
    if (!form.kode || !form.nama || !form.harga || !form.kategori || !form.satuan || !form.supplier || !form.lokasi) {
      return alert("Lengkapi semua data yang wajib diisi");
    }

    const newItem = {
      ...form,
      harga: parseHarga(form.harga.toString()),
      deskripsi: form.deskripsi || `${form.nama} - ${form.kategori} supplied by ${form.supplier}`,
    };

    if (editId) {
      setItems(items.map(item => 
        item.id === editId ? { ...newItem, id: editId } : item
      ));
    } else {
      const newId = Math.max(...items.map(item => item.id), 0) + 1;
      setItems([...items, { ...newItem, id: newId }]);
    }

    setForm({
      kode: "",
      nama: "",
      merek: "",
      kategori: "",
      satuan: "",
      jumlah: "",
      harga: "",
      status: "active",
      supplier: "",
      lokasi: "",
      tanggal_masuk: new Date().toISOString().split('T')[0],
    });
    setShowForm(false);
    setEditId(null);
  };

  const deleteItem = (id) => {
    if (confirm("Hapus item ini?")) {
      setItems(items.filter((i) => i.id !== id));
    }
  };

  return (
    <div className="h-screen p-6 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900 overflow-y-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 backdrop-blur-sm bg-opacity-90">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
                <Package className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">Inventory Items</h1>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Kelola inventory items dengan mudah</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <button 
                  onClick={() => setShowDownloadDropdown(!showDownloadDropdown)}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
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
              
              <button
                onClick={openAdd}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
              >
                <Plus size={20} /> Tambah Item
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">Total Items</p>
                  <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">{items.length}</p>
                </div>
                <Package className="w-8 h-8 text-blue-500" />
              </div>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl p-4 border border-green-200 dark:border-green-800">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-green-600 dark:text-green-400 font-medium">In Stock</p>
                  <p className="text-2xl font-bold text-green-900 dark:text-green-100">{items.filter(i => i.jumlah > 10).length}</p>
                </div>
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">✓</span>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 rounded-xl p-4 border border-yellow-200 dark:border-yellow-800">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-yellow-600 dark:text-yellow-400 font-medium">Low Stock</p>
                  <p className="text-2xl font-bold text-yellow-900 dark:text-yellow-100">{items.filter(i => i.jumlah > 0 && i.jumlah <= 10).length}</p>
                </div>
                <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">!</span>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 rounded-xl p-4 border border-red-200 dark:border-red-800">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-red-600 dark:text-red-400 font-medium">Out of Stock</p>
                  <p className="text-2xl font-bold text-red-900 dark:text-red-100">{items.filter(i => i.jumlah === 0).length}</p>
                </div>
                <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">×</span>
                </div>
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative max-w-md">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              placeholder="Cari item berdasarkan nama, SKU, atau merek..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden backdrop-blur-sm">
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 px-6 py-4 border-b border-gray-200 dark:border-gray-600">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <Package className="w-5 h-5 text-blue-600" />
            Daftar Items
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Item Name</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">SKU</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Category</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Quantity</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Price</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-100 dark:divide-gray-700">
              {filteredItems.map((item) => (
                <tr key={item.id} className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 dark:hover:from-gray-700 dark:hover:to-gray-600 transition-all duration-200 cursor-pointer group" onClick={() => setSelectedItem(item)}>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30 rounded-xl group-hover:scale-110 transition-transform duration-200">
                        <Package className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900 dark:text-white">{item.nama}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">{item.kode}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-mono font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-600">
                      {item.kode}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 text-purple-800 dark:text-purple-200 border border-purple-200 dark:border-purple-800">
                      {item.kategori}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-gray-900 dark:text-white">{item.jumlah} {item.satuan}</span>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="w-16 bg-gray-200 dark:bg-gray-600 rounded-full h-1.5">
                            <div 
                              className={`h-1.5 rounded-full transition-all duration-300 ${
                                item.jumlah > 10 ? "bg-gradient-to-r from-green-400 to-green-600" : item.jumlah > 0 ? "bg-gradient-to-r from-yellow-400 to-yellow-600" : "bg-gradient-to-r from-red-400 to-red-600"
                              }`}
                              style={{ width: `${Math.min((item.jumlah / 25) * 100, 100)}%` }}
                            ></div>
                          </div>
                          <span className={`text-xs font-medium ${
                            item.jumlah > 10 ? "text-green-600 dark:text-green-400" : item.jumlah > 0 ? "text-yellow-600 dark:text-yellow-400" : "text-red-600 dark:text-red-400"
                          }`}>
                            {Math.round((item.jumlah / 25) * 100)}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">{formatRupiah(item.harga)}</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">per {item.satuan}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${
                      item.jumlah > 10
                        ? "bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800"
                        : item.jumlah > 0
                        ? "bg-gradient-to-r from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800"
                        : "bg-gradient-to-r from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800"
                    }`}>
                      <div className={`w-2 h-2 rounded-full mr-2 ${
                        item.jumlah > 10 ? "bg-green-500" : item.jumlah > 0 ? "bg-yellow-500" : "bg-red-500"
                      }`}></div>
                      {item.jumlah > 10 ? "Tersedia" : item.jumlah > 0 ? "Stok Rendah" : "Habis"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <button 
                        onClick={(e) => { e.stopPropagation(); setSelectedItem(item); }}
                        className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                        title="View details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); openEdit(item); }}
                        className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                        title="Edit item"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); deleteItem(item.id); }}
                        className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        title="Delete item"
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

      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl w-full max-w-md">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">{editId ? "Edit Item" : "Add New Item"}</h2>
              <button 
                onClick={() => setShowForm(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Item Code</label>
                <input
                  type="text"
                  placeholder="Enter item code"
                  className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={form.kode}
                  onChange={(e) => setForm({ ...form, kode: e.target.value })}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Item Name</label>
                <input
                  type="text"
                  placeholder="Enter item name"
                  className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={form.nama}
                  onChange={(e) => setForm({ ...form, nama: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Category</label>
                <select
                  className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={form.kategori}
                  onChange={(e) => setForm({ ...form, kategori: e.target.value })}
                >
                  <option value="">Select Category</option>
                  {industrialCategories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Unit</label>
                  <select
                    className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={form.satuan}
                    onChange={(e) => setForm({ ...form, satuan: e.target.value })}
                  >
                    <option value="">Select Unit</option>
                    {quantityUnits.map((unit) => (
                      <option key={unit.value} value={unit.value}>
                        {unit.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Quantity</label>
                  <input
                    type="number"
                    placeholder="0"
                    className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={form.jumlah}
                    onChange={(e) => setForm({ ...form, jumlah: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Price (Rp)</label>
                <input
                  type="text"
                  placeholder="0"
                  className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={formatHargaInput(form.harga.toString())}
                  onChange={(e) => setForm({ ...form, harga: parseHarga(e.target.value).toString() })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Status</label>
                <select
                  className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                >
                  <option value="active">Aktif</option>
                  <option value="inactive">Tidak Aktif</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Supplier</label>
                <select
                  className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={form.supplier}
                  onChange={(e) => setForm({ ...form, supplier: e.target.value })}
                >
                  <option value="">Select Supplier</option>
                  {suppliers.map((supplier) => (
                    <option key={supplier} value={supplier}>
                      {supplier}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Location</label>
                <select
                  className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={form.lokasi}
                  onChange={(e) => setForm({ ...form, lokasi: e.target.value })}
                >
                  <option value="">Select Location</option>
                  {locations.map((location) => (
                    <option key={location} value={location}>
                      {location}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Entry Date</label>
                <input
                  type="date"
                  className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={form.tanggal_masuk}
                  onChange={(e) => setForm({ ...form, tanggal_masuk: e.target.value })}
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowForm(false)}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={saveItem}
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                {editId ? "Update" : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-800">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Package className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">Detail Item</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{selectedItem.kode}</p>
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
                        onClick={() => { setShowDetailDownloadDropdown(false); downloadSingleItem(); }}
                        className="flex items-center gap-2 w-full px-4 py-3 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors rounded-t-lg"
                      >
                        <Download size={16} />
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Download Word (.doc)</span>
                      </button>
                      <button
                        onClick={() => { setShowDetailDownloadDropdown(false); downloadSingleItemHTML(); }}
                        className="flex items-center gap-2 w-full px-4 py-3 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors rounded-b-lg"
                      >
                        <Eye size={16} />
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Preview & Print</span>
                      </button>
                    </div>
                  )}
                </div>
                <button
                  onClick={() => setSelectedItem(null)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Basic Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <Package className="w-5 h-5 text-blue-600" />
                    Informasi Dasar
                  </h3>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Nama Item</span>
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">{selectedItem.nama}</span>
                    </div>
                    
                    <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Kode SKU</span>
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">{selectedItem.kode}</span>
                    </div>
                    
                    <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Merek</span>
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">{selectedItem.merek}</span>
                    </div>
                    
                    <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Kategori</span>
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">{selectedItem.kategori}</span>
                    </div>
                  </div>
                </div>

                {/* Stock & Pricing */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-green-600" />
                    Stok & Harga
                  </h3>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Jumlah</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-gray-900 dark:text-white">{selectedItem.jumlah}</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">{selectedItem.satuan}</span>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Harga Satuan</span>
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">{formatRupiah(selectedItem.harga)}</span>
                    </div>
                    
                    <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Nilai Total</span>
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">{formatRupiah(selectedItem.harga * selectedItem.jumlah)}</span>
                    </div>
                    
                    <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Status</span>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        selectedItem.jumlah > 10
                          ? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                          : selectedItem.jumlah > 0
                          ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400"
                          : "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400"
                      }`}>
                        {selectedItem.jumlah > 10 ? "Tersedia" : selectedItem.jumlah > 0 ? "Stok Rendah" : "Habis"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Additional Information */}
                <div className="space-y-4 md:col-span-2">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <Activity className="w-5 h-5 text-purple-600" />
                    Informasi Tambahan
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Supplier</span>
                        <span className="text-sm font-semibold text-gray-900 dark:text-white">{selectedItem.supplier}</span>
                      </div>
                      
                      <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Lokasi</span>
                        <span className="text-sm font-semibold text-gray-900 dark:text-white">{selectedItem.lokasi}</span>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Tanggal Masuk</span>
                        <span className="text-sm font-semibold text-gray-900 dark:text-white">{selectedItem.tanggal_masuk}</span>
                      </div>
                      
                      <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Satuan</span>
                        <span className="text-sm font-semibold text-gray-900 dark:text-white">{selectedItem.satuan}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <div className="flex items-center py-2 border-b border-gray-200 dark:border-gray-700">
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400 mr-4">Deskripsi</span>
                      <span className="text-sm text-gray-900 dark:text-white flex-1">{selectedItem.deskripsi}</span>
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
