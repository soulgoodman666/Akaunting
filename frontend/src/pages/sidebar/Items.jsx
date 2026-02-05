import { useState, useEffect } from "react";
import { 
  Package,
  Plus, X, Search, Edit, Eye, Trash2, TrendingDown, Download, ChevronDown,
  Building,
  ChevronLeft, 
  ChevronRight, 
  Filter, 
  CheckSquare, 
  Square,
  MapPin,
  Activity,
  Calendar,
  BarChart3,
  TrendingUp,
  DollarSign,
  AlertCircle,
  FileText
} from "lucide-react";

const formatRupiah = (number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(number);
};

export default function Items() {
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showDownloadDropdown, setShowDownloadDropdown] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [showItemDownloadModal, setShowItemDownloadModal] = useState(false);
  const [selectedItemForPreview, setSelectedItemForPreview] = useState(null);
  const [showStockReductionModal, setShowStockReductionModal] = useState(false);
  const [selectedItemForReduction, setSelectedItemForReduction] = useState(null);
  const [reductionAmount, setReductionAmount] = useState("");
  const [reductionReason, setReductionReason] = useState("");
  const [reductionType, setReductionType] = useState("percentage"); // 'percentage' or 'quantity'
  const [reductionPercentage, setReductionPercentage] = useState("");
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8080/items');
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setItems(data);
    } catch (error) {
      console.error('Error fetching items:', error);
      setItems([
        { id: 1, kode: "M090", nama: "Gas Argon", merek: "Gas", kategori: "Industrial Gas", satuan: "Tube", jumlah: 5, initial_quantity: 5, quantity_percentage: 100, harga: 750000, status: "active", supplier: "PT Gas Indonesia", lokasi: "Gudang A", tanggal_masuk: "2024-01-15", deskripsi: "High purity argon gas for welding applications" },
        { id: 2, kode: "M089", nama: "Gas Oksigen", merek: "Gas", kategori: "Industrial Gas", satuan: "Tube", jumlah: 1, initial_quantity: 1, quantity_percentage: 100, harga: 500000, status: "active", supplier: "PT Gas Indonesia", lokasi: "Gudang A", tanggal_masuk: "2024-01-10", deskripsi: "Medical grade oxygen gas" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const fetchWarehouses = async () => {
    try {
      const response = await fetch('http://localhost:8080/warehouses');
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setWarehouses(data);
    } catch (error) {
      console.error('Error fetching warehouses:', error);
      setWarehouses([
        { id: 1, nama: "Gudang A", lokasi: "Jakarta", kapasitas: 1000, terpakai: 500, status: "active" },
        { id: 2, nama: "Gudang B", lokasi: "Surabaya", kapasitas: 800, terpakai: 300, status: "active" },
      ]);
    }
  };

  useEffect(() => { 
    fetchItems(); 
    fetchWarehouses();
  }, []);

  const filteredItems = items.filter(
    (item) =>
      item.nama.toLowerCase().includes(search.toLowerCase()) ||
      item.kode.toLowerCase().includes(search.toLowerCase()) ||
      item.merek.toLowerCase().includes(search.toLowerCase()) ||
      item.kategori.toLowerCase().includes(search.toLowerCase()) ||
      item.supplier.toLowerCase().includes(search.toLowerCase()) ||
      item.lokasi.toLowerCase().includes(search.toLowerCase())
  );

  const calculateStockPercentage = (currentQuantity, initialQuantity) => {
    if (!initialQuantity || initialQuantity === 0) return 100;
    return Math.round((currentQuantity / initialQuantity) * 100);
  };

  const getStockColor = (percentage) => {
    if (percentage >= 50) return 'bg-green-500';
    if (percentage >= 20) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const [form, setForm] = useState({
    kode: "", nama: "", merek: "", kategori: "", satuan: "", jumlah: "", initial_quantity: "", quantity_percentage: 100, harga: "", status: "active", supplier: "", lokasi: "", tanggal_masuk: "", deskripsi: "", gudang_id: "",
  });

  const resetForm = () => {
    setForm({
      kode: "", nama: "", merek: "", kategori: "", satuan: "", jumlah: "", initial_quantity: "", quantity_percentage: 100, harga: "", status: "active", supplier: "", lokasi: "", tanggal_masuk: "", deskripsi: "", gudang_id: "",
    });
    setEditId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!form.kode || !form.nama || !form.jumlah || !form.harga) {
      alert("Mohon lengkapi field yang wajib diisi");
      return;
    }

    try {
      const itemData = {
        ...form,
        jumlah: parseInt(form.jumlah),
        initial_quantity: parseInt(form.jumlah),
        quantity_percentage: 100,
        harga: parseInt(form.harga),
        gudang_id: form.gudang_id ? parseInt(form.gudang_id) : null,
        tanggal_masuk: form.tanggal_masuk || new Date().toISOString().split('T')[0]
      };

      let response;
      if (editId) {
        response = await fetch(`http://localhost:8080/items/${editId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(itemData),
        });
      } else {
        response = await fetch('http://localhost:8080/items', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(itemData),
        });
      }

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      // Create history record for new item
      if (!editId) {
        try {
          const newItem = await response.json();
          // Only create history if we have valid data
          if (newItem.id && newItem.gudang_id) {
            const historyResponse = await fetch('http://localhost:8080/api/v1/history/item', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                item_id: newItem.id,
                action: 'add',
                user_id: 1 // Default user for now
              })
            });
            if (historyResponse.ok) {
              console.log('History created for new item');
              // Refresh history data
              setTimeout(() => {
                window.location.reload(); // Refresh page to show new data
              }, 1000);
            } else {
              console.log('History creation failed, but item saved successfully');
            }
          }
        } catch (error) {
          console.error('Error creating history:', error);
        }
      }
      
      await fetchItems();
      setShowForm(false);
      resetForm();
      alert(editId ? "Item berhasil diperbarui!" : "Item berhasil ditambahkan!");
      
    } catch (error) {
      console.error('Error saving item:', error);
      alert("Gagal menyimpan item. Silakan coba lagi.");
    }
  };

  const handleEdit = (item) => {
    setForm({
      kode: item.kode,
      nama: item.nama,
      merek: item.merek,
      kategori: item.kategori,
      satuan: item.satuan,
      jumlah: item.jumlah.toString(),
      initial_quantity: item.initial_quantity?.toString() || item.jumlah.toString(),
      quantity_percentage: item.quantity_percentage || 100,
      harga: item.harga.toString(),
      status: item.status,
      supplier: item.supplier,
      lokasi: item.lokasi,
      tanggal_masuk: item.tanggal_masuk,
      deskripsi: item.deskripsi,
      gudang_id: item.gudang_id || "",
    });
    setEditId(item.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Apakah Anda yakin ingin menghapus item ini?")) return;
    
    try {
      const response = await fetch(`http://localhost:8080/items/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      await fetchItems();
      alert("Item berhasil dihapus!");
      
    } catch (error) {
      console.error('Error deleting item:', error);
      alert("Gagal menghapus item. Silakan coba lagi.");
    }
  };

  const openPreview = (item) => {
    setSelectedItemForPreview(item);
    setShowPreviewModal(true);
  };

  const closePreview = () => {
    setShowPreviewModal(false);
    setSelectedItemForPreview(null);
  };

  const openItemDownloadModal = (item) => {
    setSelectedItemForPreview(item);
    setShowItemDownloadModal(true);
  };

  const closeItemDownloadModal = () => {
    setShowItemDownloadModal(false);
    setSelectedItemForPreview(null);
  };

  const openStockReduction = (item) => {
    setSelectedItemForReduction(item);
    setReductionAmount("");
    setReductionReason("");
    setReductionPercentage("");
    setReductionType("percentage");
    setShowStockReductionModal(true);
  };

  const closeStockReduction = () => {
    setShowStockReductionModal(false);
    setSelectedItemForReduction(null);
    setReductionAmount("");
    setReductionReason("");
    setReductionPercentage("");
    setReductionType("percentage");
  };

  const calculateReductionAmount = () => {
    if (!selectedItemForReduction) return 0;
    
    if (reductionType === "percentage") {
      const percentage = parseFloat(reductionPercentage) || 0;
      return Math.round((percentage / 100) * selectedItemForReduction.jumlah);
    } else {
      return parseInt(reductionAmount) || 0;
    }
  };

  const calculateNewStock = () => {
    if (!selectedItemForReduction) return 0;
    return Math.max(0, selectedItemForReduction.jumlah - calculateReductionAmount());
  };

  const getItemReportHTML = () => {
    if (!selectedItemForPreview) return '';
    
    return `
    <div style="font-family: 'Times New Roman', Times, serif; height: 100%; background: white; padding: 60px; position: relative;">
        <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%) rotate(-45deg); font-size: 100px; color: rgba(52, 73, 94, 0.05); font-weight: bold; pointer-events: none;">OFFICIAL</div>
        
        <div style="text-align: center; border-bottom: 3px solid #2c3e50; padding-bottom: 30px; margin-bottom: 40px;">
            <div style="font-size: 28px; font-weight: bold; color: #2c3e50; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 2px;">Akaunting Inventory System</div>
            <div style="font-size: 14px; color: #7f8c8d; margin-bottom: 15px;">Jl. Teknologi No. 123, Jakarta 12345 - Indonesia</div>
            <div style="font-size: 20px; font-weight: bold; color: #2c3e50; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 10px;">Laporan Detail Item</div>
            <div style="font-size: 16px; color: #7f8c8d; font-style: italic;">Kode: ${selectedItemForPreview.kode}</div>
        </div>
        
        <div style="margin: 40px 0;">
            <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
                <tr>
                    <td style="padding: 12px 15px; border: 1px solid #ddd; font-weight: bold; background-color: #f8f9fa; width: 35%; text-transform: uppercase; font-size: 12px; color: #7f8c8d;">Kode Item</td>
                    <td style="padding: 12px 15px; border: 1px solid #ddd; font-size: 14px; color: #2c3e50;">${selectedItemForPreview.kode}</td>
                </tr>
                <tr>
                    <td style="padding: 12px 15px; border: 1px solid #ddd; font-weight: bold; background-color: #f8f9fa; text-transform: uppercase; font-size: 12px; color: #7f8c8d;">Nama Item</td>
                    <td style="padding: 12px 15px; border: 1px solid #ddd; font-size: 14px; color: #2c3e50;">${selectedItemForPreview.nama}</td>
                </tr>
                <tr>
                    <td style="padding: 12px 15px; border: 1px solid #ddd; font-weight: bold; background-color: #f8f9fa; text-transform: uppercase; font-size: 12px; color: #7f8c8d;">Merek</td>
                    <td style="padding: 12px 15px; border: 1px solid #ddd; font-size: 14px; color: #2c3e50;">${selectedItemForPreview.merek}</td>
                </tr>
                <tr>
                    <td style="padding: 12px 15px; border: 1px solid #ddd; font-weight: bold; background-color: #f8f9fa; text-transform: uppercase; font-size: 12px; color: #7f8c8d;">Kategori</td>
                    <td style="padding: 12px 15px; border: 1px solid #ddd; font-size: 14px; color: #2c3e50;">${selectedItemForPreview.kategori}</td>
                </tr>
                <tr>
                    <td style="padding: 12px 15px; border: 1px solid #ddd; font-weight: bold; background-color: #f8f9fa; text-transform: uppercase; font-size: 12px; color: #7f8c8d;">Satuan</td>
                    <td style="padding: 12px 15px; border: 1px solid #ddd; font-size: 14px; color: #2c3e50;">${selectedItemForPreview.satuan}</td>
                </tr>
                <tr>
                    <td style="padding: 12px 15px; border: 1px solid #ddd; font-weight: bold; background-color: #f8f9fa; text-transform: uppercase; font-size: 12px; color: #7f8c8d;">Jumlah Stok</td>
                    <td style="padding: 12px 15px; border: 1px solid #ddd; font-size: 14px; color: #27ae60; font-weight: bold;">${selectedItemForPreview.jumlah} ${selectedItemForPreview.satuan}</td>
                </tr>
                <tr>
                    <td style="padding: 12px 15px; border: 1px solid #ddd; font-weight: bold; background-color: #f8f9fa; text-transform: uppercase; font-size: 12px; color: #7f8c8d;">Harga Satuan</td>
                    <td style="padding: 12px 15px; border: 1px solid #ddd; font-size: 14px; color: #2c3e50;">${formatRupiah(selectedItemForPreview.harga)}</td>
                </tr>
                <tr>
                    <td style="padding: 12px 15px; border: 1px solid #ddd; font-weight: bold; background-color: #f8f9fa; text-transform: uppercase; font-size: 12px; color: #7f8c8d;">Total Nilai</td>
                    <td style="padding: 12px 15px; border: 1px solid #ddd; font-size: 14px; color: #2c3e50; font-weight: bold;">${formatRupiah(selectedItemForPreview.harga * selectedItemForPreview.jumlah)}</td>
                </tr>
                <tr>
                    <td style="padding: 12px 15px; border: 1px solid #ddd; font-weight: bold; background-color: #f8f9fa; text-transform: uppercase; font-size: 12px; color: #7f8c8d;">Status Item</td>
                    <td style="padding: 12px 15px; border: 1px solid #ddd; font-size: 14px; color: ${selectedItemForPreview.status === 'active' ? '#27ae60' : '#e74c3c'}; font-weight: bold; text-transform: uppercase;">
                        ${selectedItemForPreview.status}
                    </td>
                </tr>
                <tr>
                    <td style="padding: 12px 15px; border: 1px solid #ddd; font-weight: bold; background-color: #f8f9fa; text-transform: uppercase; font-size: 12px; color: #7f8c8d;">Supplier</td>
                    <td style="padding: 12px 15px; border: 1px solid #ddd; font-size: 14px; color: #2c3e50;">${selectedItemForPreview.supplier}</td>
                </tr>
                <tr>
                    <td style="padding: 12px 15px; border: 1px solid #ddd; font-weight: bold; background-color: #f8f9fa; text-transform: uppercase; font-size: 12px; color: #7f8c8d;">Lokasi Penyimpanan</td>
                    <td style="padding: 12px 15px; border: 1px solid #ddd; font-size: 14px; color: #2c3e50;">${selectedItemForPreview.lokasi}</td>
                </tr>
                <tr>
                    <td style="padding: 12px 15px; border: 1px solid #ddd; font-weight: bold; background-color: #f8f9fa; text-transform: uppercase; font-size: 12px; color: #7f8c8d;">Tanggal Masuk</td>
                    <td style="padding: 12px 15px; border: 1px solid #ddd; font-size: 14px; color: #2c3e50;">${selectedItemForPreview.tanggal_masuk}</td>
                </tr>
            </table>
            
            ${selectedItemForPreview.deskripsi ? `
            <div style="background: #f8f9fa; border: 1px solid #e9ecef; border-left: 4px solid #3498db; padding: 20px; margin: 20px 0; font-style: italic; color: #34495e;">
                <strong style="color: #2c3e50; font-style: normal;">Deskripsi Item:</strong><br>
                ${selectedItemForPreview.deskripsi}
            </div>
            ` : ''}
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

  const downloadItemReport = () => {
    if (!selectedItemForPreview) return;
    
    const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>Detail Item - ${selectedItemForPreview.kode}</title>
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
                <td>${selectedItemForPreview.kode}</td>
            </tr>
            <tr>
                <td>Nama Item</td>
                <td>${selectedItemForPreview.nama}</td>
            </tr>
            <tr>
                <td>Merek</td>
                <td>${selectedItemForPreview.merek}</td>
            </tr>
            <tr>
                <td>Kategori</td>
                <td>${selectedItemForPreview.kategori}</td>
            </tr>
            <tr>
                <td>Satuan</td>
                <td>${selectedItemForPreview.satuan}</td>
            </tr>
            <tr>
                <td>Jumlah Stok</td>
                <td>${selectedItemForPreview.jumlah} ${selectedItemForPreview.satuan}</td>
            </tr>
            <tr>
                <td>Harga Satuan</td>
                <td>${formatRupiah(selectedItemForPreview.harga)}</td>
            </tr>
            <tr>
                <td>Total Nilai</td>
                <td>${formatRupiah(selectedItemForPreview.harga * selectedItemForPreview.jumlah)}</td>
            </tr>
            <tr>
                <td>Status</td>
                <td class="status-${selectedItemForPreview.status}">${selectedItemForPreview.status}</td>
            </tr>
            <tr>
                <td>Supplier</td>
                <td>${selectedItemForPreview.supplier}</td>
            </tr>
            <tr>
                <td>Lokasi</td>
                <td>${selectedItemForPreview.lokasi}</td>
            </tr>
            <tr>
                <td>Tanggal Masuk</td>
                <td>${selectedItemForPreview.tanggal_masuk}</td>
            </tr>
            ${selectedItemForPreview.deskripsi ? `
            <tr>
                <td>Deskripsi</td>
                <td>${selectedItemForPreview.deskripsi}</td>
            </tr>
            ` : ''}
        </table>
        
        <div class="footer">
            <p>Dokumen ini dibuat secara otomatis pada ${new Date().toLocaleString('id-ID')}</p>
            <p>Generated by Akaunting Inventory System</p>
        </div>
    </body>
    </html>
    `;
    
    const blob = new Blob([htmlContent], { 
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' 
    });
    
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `Detail_Item_${selectedItemForPreview.kode}_${new Date().toISOString().split('T')[0]}.doc`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleStockReduction = async () => {
    if (!selectedItemForReduction || !reductionReason) {
      alert("Mohon lengkapi semua field");
      return;
    }

    const reduction = calculateReductionAmount();
    if (reduction <= 0) {
      alert("Jumlah pengurangan harus lebih dari 0");
      return;
    }

    if (reduction > selectedItemForReduction.jumlah) {
      alert("Jumlah pengurangan tidak boleh melebihi stok tersedia");
      return;
    }

    const newQuantity = calculateNewStock();
    const initialQuantity = selectedItemForReduction.initial_quantity || selectedItemForReduction.jumlah;
    const newPercentage = calculateStockPercentage(newQuantity, initialQuantity);

    const reductionText = reductionType === "percentage" 
      ? `${reductionPercentage}% (${reduction} ${selectedItemForReduction.satuan})`
      : `${reduction} ${selectedItemForReduction.satuan}`;

    const updatedItem = {
      ...selectedItemForReduction,
      jumlah: newQuantity,
      initial_quantity: initialQuantity,
      quantity_percentage: newPercentage,
      deskripsi: `${selectedItemForReduction.deskripsi}\n\n[Pengurangan Stok: ${reductionText} - ${reductionReason} - ${new Date().toLocaleString('id-ID')}]`
    };

    try {
      const response = await fetch(`http://localhost:8080/items/${selectedItemForReduction.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedItem),
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      setItems(items.map(item => 
        item.id === selectedItemForReduction.id ? updatedItem : item
      ));

      alert(`Stok berhasil dikurangi!\nPengurangan: ${reductionText}\nStok tersisa: ${newQuantity} ${selectedItemForReduction.satuan} (${newPercentage}%)`);
      
      // Create history record for stock reduction
      try {
        if (selectedItemForReduction.id && selectedItemForReduction.gudang_id) {
          const historyResponse = await fetch('http://localhost:8080/api/v1/history/item', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              item_id: selectedItemForReduction.id,
              action: 'reduce',
              user_id: 1, // Default user for now
              reduction_amount: reduction,
              reason: reductionReason
            })
          });
          if (historyResponse.ok) {
            console.log('History created for stock reduction');
            // Refresh history data
            setTimeout(() => {
              window.location.reload(); // Refresh page to show new data
            }, 1000);
          } else {
            console.log('History creation failed, but stock reduced successfully');
          }
        }
      } catch (error) {
        console.error('Error creating history:', error);
      }
      
      closeStockReduction();
      
    } catch (error) {
      console.error('Error reducing stock:', error);
      alert("Gagal mengurangi stok. Silakan coba lagi. Error: " + error.message);
    }
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedItems([]);
    } else {
      setSelectedItems(filteredItems.map(item => item.id));
    }
    setSelectAll(!selectAll);
  };

  const handleIndividualCheckbox = (itemId) => {
    setSelectedItems(prev => {
      if (prev.includes(itemId)) {
        return prev.filter(id => id !== itemId);
      } else {
        return [...prev, itemId];
      }
    });
  };

  const calculateTotalValue = () => {
    return items.reduce((total, item) => total + (item.harga * item.jumlah), 0);
  };

  const calculateLowStock = () => {
    return items.filter(item => {
      const percentage = calculateStockPercentage(item.jumlah, item.initial_quantity || item.jumlah);
      return percentage < 20;
    }).length;
  };

  const categories = ["Welding Equipment", "Cutting Tools", "Measuring Instruments", "Safety Equipment", "Power Tools", "Hand Tools", "Industrial Gas", "Electrical Components", "Hydraulic Systems", "Pneumatic Systems", "Fasteners", "Raw Materials", "Chemicals", "Lubricants", "Filters", "Pumps", "Valves", "Sensors", "Controllers", "Other"];
  const units = ["PCS", "SET", "BOX", "PACK", "PACK", "BOTTLE", "CAN", "TUBE", "CYLINDER", "BAG", "ROLL", "SHEET", "METER", "KILOGRAM", "LITER", "GALLON", "TON", "PAIR", "DOZEN", "REAM", "CASE", "PALLET", "DRUM", "BARREL", "CONTAINER", "UNIT", "LOT", "BATCH"];
  const suppliers = ["PT Welding Supply", "PT Industrial Tools", "PT Safety Equipment", "PT Chemical Industries", "PT Hydraulic Systems", "PT Electrical Components", "PT Measuring Instruments", "PT Cutting Tools", "PT Pneumatic Solutions", "PT Lubricant Center", "Other"];
  const locations = ["Gudang A", "Gudang B", "Gudang C", "Gudang D", "Gudang E", "Workshop Area", "Production Floor", "Quality Control", "Shipping Area", "Other"];

  const downloadCSV = () => {
    setShowDownloadDropdown(false);
    const csvHeaders = ['ID', 'Kode', 'Nama Item', 'Merek', 'Kategori', 'Satuan', 'Jumlah', 'Harga', 'Status', 'Supplier', 'Lokasi'];
    const csvData = filteredItems.map(item => [
      item.id, `"${item.kode}"`, `"${item.nama}"`, `"${item.merek}"`, `"${item.kategori}"`, `"${item.satuan}"`, item.jumlah, item.harga, `"${item.status}"`, `"${item.supplier}"`, `"${item.lokasi}"`
    ]);
    const csvContent = [csvHeaders.join(','), ...csvData.map(row => row.join(','))].join('\n');
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

  return (
    <div className="h-screen p-6 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900 overflow-y-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 backdrop-blur-sm bg-opacity-90">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl shadow-lg">
                <Package className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">Items Management</h1>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Kelola inventory dengan efisien</p>
              </div>
            </div>
            
            <div className="flex gap-2">
              <div className="relative">
                <button 
                  onClick={() => setShowDownloadDropdown(!showDownloadDropdown)}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                >
                  <Download className="w-4 h-4" />
                  Download
                  <ChevronDown className="w-4 h-4" />
                </button>
                {showDownloadDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-10">
                    <button
                      onClick={downloadCSV}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100 rounded-t-lg"
                    >
                      Export as CSV
                    </button>
                    <button className="block w-full text-left px-4 py-2 hover:bg-gray-100 rounded-b-lg">
                      Export as PDF
                    </button>
                  </div>
                )}
              </div>
              <button 
                onClick={() => {
                  resetForm();
                  setShowForm(true);
                }}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
              >
                <Plus className="w-4 h-4" />
                New Item
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
                  <p className="text-xs text-green-600 dark:text-green-400 font-medium">Active Items</p>
                  <p className="text-2xl font-bold text-green-900 dark:text-green-100">{items.filter(item => item.status === 'active').length}</p>
                </div>
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">✓</span>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl p-4 border border-purple-200 dark:border-purple-800">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-purple-600 dark:text-purple-400 font-medium">Total Value</p>
                  <p className="text-lg font-bold text-purple-900 dark:text-purple-100">{formatRupiah(calculateTotalValue())}</p>
                </div>
                <DollarSign className="w-8 h-8 text-purple-500" />
              </div>
            </div>
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-xl p-4 border border-orange-200 dark:border-orange-800">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-orange-600 dark:text-orange-400 font-medium">Low Stock</p>
                  <p className="text-2xl font-bold text-orange-900 dark:text-orange-100">{calculateLowStock()}</p>
                </div>
                <AlertCircle className="w-8 h-8 text-orange-500" />
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative max-w-md">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              placeholder="Search items by name, code, brand, category..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-slate-700">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-slate-700 border-b border-gray-200 dark:border-slate-600">
              <tr>
                <th className="px-6 py-4 text-left">
                  <input
                    type="checkbox"
                    checked={selectAll}
                    onChange={handleSelectAll}
                    className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Kode</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Nama Item</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Merek</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Kategori</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Jumlah</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Harga</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
              {filteredItems.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(item.id)}
                      onChange={() => handleIndividualCheckbox(item.id)}
                      className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">{item.kode}</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">{item.nama}</td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{item.merek}</td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{item.kategori}</td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-900 dark:text-white">{item.jumlah} {item.satuan}</span>
                      {item.initial_quantity && (
                        <div className="flex items-center gap-1">
                          <div className="w-12 h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                            <div 
                              className={`h-full ${getStockColor(calculateStockPercentage(item.jumlah, item.initial_quantity))}`}
                              style={{ width: `${calculateStockPercentage(item.jumlah, item.initial_quantity)}%` }}
                            />
                          </div>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {calculateStockPercentage(item.jumlah, item.initial_quantity)}%
                          </span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">{formatRupiah(item.harga)}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`px-3 py-1 text-xs rounded-full font-medium ${
                      item.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex gap-2">
                      <button 
                        onClick={() => openPreview(item)}
                        className="text-blue-600 hover:text-blue-800 transition-colors"
                        title="Preview"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleEdit(item)}
                        className="text-green-600 hover:text-green-800 transition-colors"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => openItemDownloadModal(item)}
                        className="text-purple-600 hover:text-purple-800 transition-colors"
                        title="Download Surat Detail"
                      >
                        <FileText className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => openStockReduction(item)}
                        className="text-orange-600 hover:text-orange-800 transition-colors"
                        title="Kurangi Stok"
                      >
                        <TrendingDown className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(item.id)}
                        className="text-red-600 hover:text-red-800 transition-colors"
                        title="Delete"
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

      {/* Stock Reduction Modal */}
      {showStockReductionModal && selectedItemForReduction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Kurangi Stok</h2>
              <button 
                onClick={closeStockReduction}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">
                Item: <span className="font-medium">{selectedItemForReduction.nama}</span>
              </p>
              <p className="text-sm text-gray-600">
                Stok Saat Ini: <span className="font-medium text-green-600">{selectedItemForReduction.jumlah} {selectedItemForReduction.satuan}</span>
              </p>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Tipe Pengurangan</label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setReductionType("percentage")}
                  className={`flex-1 py-2 px-4 rounded-lg border transition-colors ${
                    reductionType === "percentage" 
                      ? "bg-blue-600 text-white border-blue-600" 
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  Persen (%)
                </button>
                <button
                  type="button"
                  onClick={() => setReductionType("quantity")}
                  className={`flex-1 py-2 px-4 rounded-lg border transition-colors ${
                    reductionType === "quantity" 
                      ? "bg-blue-600 text-white border-blue-600" 
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  Jumlah
                </button>
              </div>
            </div>

            {reductionType === "percentage" ? (
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Persentase Pengurangan (%)</label>
                <input
                  type="number"
                  value={reductionPercentage}
                  onChange={(e) => setReductionPercentage(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Masukkan persentase (0-100)"
                  min="0"
                  max="100"
                  step="0.1"
                />
                {reductionPercentage && selectedItemForReduction && (
                  <p className="text-xs text-gray-500 mt-1">
                    {reductionPercentage}% = {calculateReductionAmount()} {selectedItemForReduction.satuan}
                  </p>
                )}
              </div>
            ) : (
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Jumlah Pengurangan</label>
                <input
                  type="number"
                  value={reductionAmount}
                  onChange={(e) => setReductionAmount(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Masukkan jumlah"
                  min="1"
                  max={selectedItemForReduction.jumlah}
                />
              </div>
            )}

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Alasan Pengurangan</label>
              <textarea
                value={reductionReason}
                onChange={(e) => setReductionReason(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="3"
                placeholder="Contoh: Barang rusak, kadaluarsa, dll."
                required
              />
            </div>

            {/* Preview Section */}
            {(reductionAmount || reductionPercentage) && (
              <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                <h3 className="text-sm font-medium mb-2">Preview Perubahan:</h3>
                <div className="space-y-1 text-sm">
                  <p>Stok Awal: <span className="font-medium">{selectedItemForReduction.jumlah} {selectedItemForReduction.satuan}</span></p>
                  <p>Pengurangan: <span className="font-medium text-red-600">-{calculateReductionAmount()} {selectedItemForReduction.satuan}</span></p>
                  <p>Stok Akhir: <span className="font-medium text-green-600">{calculateNewStock()} {selectedItemForReduction.satuan}</span></p>
                  {selectedItemForReduction.initial_quantity && (
                    <p>Persentase Stok: <span className="font-medium">{calculateStockPercentage(calculateNewStock(), selectedItemForReduction.initial_quantity)}%</span></p>
                  )}
                </div>
              </div>
            )}

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={closeStockReduction}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Batal
              </button>
              <button
                onClick={handleStockReduction}
                className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
              >
                Kurangi Stok
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Stock Reduction Modal */}
      {showStockReductionModal && selectedItemForReduction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Kurangi Stok</h2>
              <button 
                onClick={closeStockReduction}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">
                Item: <span className="font-medium">{selectedItemForReduction.nama}</span>
              </p>
              <p className="text-sm text-gray-600">
                Stok Saat Ini: <span className="font-medium text-green-600">{selectedItemForReduction.jumlah} {selectedItemForReduction.satuan}</span>
              </p>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Tipe Pengurangan</label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setReductionType("percentage")}
                  className={`flex-1 py-2 px-4 rounded-lg border transition-colors ${
                    reductionType === "percentage" 
                      ? "bg-blue-600 text-white border-blue-600" 
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  Persen (%)
                </button>
                <button
                  type="button"
                  onClick={() => setReductionType("quantity")}
                  className={`flex-1 py-2 px-4 rounded-lg border transition-colors ${
                    reductionType === "quantity" 
                      ? "bg-blue-600 text-white border-blue-600" 
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  Jumlah
                </button>
              </div>
            </div>

            {reductionType === "percentage" ? (
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Persentase Pengurangan (%)</label>
                <input
                  type="number"
                  value={reductionPercentage}
                  onChange={(e) => setReductionPercentage(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Masukkan persentase (0-100)"
                  min="0"
                  max="100"
                  step="0.1"
                />
                {reductionPercentage && selectedItemForReduction && (
                  <p className="text-xs text-gray-500 mt-1">
                    {reductionPercentage}% = {calculateReductionAmount()} {selectedItemForReduction.satuan}
                  </p>
                )}
              </div>
            ) : (
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Jumlah Pengurangan</label>
                <input
                  type="number"
                  value={reductionAmount}
                  onChange={(e) => setReductionAmount(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Masukkan jumlah"
                  min="1"
                  max={selectedItemForReduction.jumlah}
                />
              </div>
            )}

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Alasan Pengurangan</label>
              <textarea
                value={reductionReason}
                onChange={(e) => setReductionReason(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="3"
                placeholder="Contoh: Barang rusak, kadaluarsa, dll."
                required
              />
            </div>

            {/* Preview Section */}
            {(reductionAmount || reductionPercentage) && (
              <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                <h3 className="text-sm font-medium mb-2">Preview Perubahan:</h3>
                <div className="space-y-1 text-sm">
                  <p>Stok Awal: <span className="font-medium">{selectedItemForReduction.jumlah} {selectedItemForReduction.satuan}</span></p>
                  <p>Pengurangan: <span className="font-medium text-red-600">-{calculateReductionAmount()} {selectedItemForReduction.satuan}</span></p>
                  <p>Stok Akhir: <span className="font-medium text-green-600">{calculateNewStock()} {selectedItemForReduction.satuan}</span></p>
                  {selectedItemForReduction.initial_quantity && (
                    <p>Persentase Stok: <span className="font-medium">{calculateStockPercentage(calculateNewStock(), selectedItemForReduction.initial_quantity)}%</span></p>
                  )}
                </div>
              </div>
            )}

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={closeStockReduction}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Batal
              </button>
              <button
                onClick={handleStockReduction}
                className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
              >
                Kurangi Stok
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Item Download Modal */}
      {showItemDownloadModal && selectedItemForPreview && (
        <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center z-50">
          <div className="w-full h-full max-w-5xl max-h-[95vh] bg-white rounded-lg shadow-2xl overflow-hidden relative">
            {/* Close Button */}
            <button
              onClick={closeItemDownloadModal}
              className="absolute top-4 right-4 z-10 p-2 bg-red-600 hover:bg-red-700 text-white rounded-full transition-colors shadow-lg"
              title="Close Preview"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Content */}
            <div className="h-full overflow-y-auto">
              <div 
                dangerouslySetInnerHTML={{ __html: getItemReportHTML() }}
                className="min-h-full"
              />
            </div>

            {/* Action Buttons */}
            <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center bg-white/95 backdrop-blur-sm p-4 rounded-lg shadow-lg border border-gray-200">
              <div className="text-sm text-gray-600">
                Preview Surat Detail Item - {selectedItemForPreview.nama}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    const printWindow = window.open('', '_blank', 'width=900,height=800,scrollbars=yes,resizable=yes');
                    printWindow.document.write(`
                      <!DOCTYPE html>
                      <html>
                      <head>
                        <title>Detail Item - ${selectedItemForPreview.nama}</title>
                        <style>
                          body { margin: 0; padding: 20px; font-family: 'Times New Roman', serif; }
                          @media print { body { padding: 0; } }
                        </style>
                      </head>
                      <body>
                        ${getItemReportHTML()}
                      </body>
                      </html>
                    `);
                    printWindow.document.close();
                    setTimeout(() => {
                      printWindow.print();
                    }, 500);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                >
                  <Package className="w-4 h-4" />
                  Print
                </button>
                <button
                  onClick={downloadItemReport}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download Word
                </button>
                <button
                  onClick={closeItemDownloadModal}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 flex items-center gap-2"
                >
                  <X className="w-4 h-4" />
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {showPreviewModal && selectedItemForPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Item Detail</h2>
              <button 
                onClick={closePreview}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Kode</p>
                <p className="font-medium">{selectedItemForPreview.kode}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Nama Item</p>
                <p className="font-medium">{selectedItemForPreview.nama}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Merek</p>
                <p className="font-medium">{selectedItemForPreview.merek}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Kategori</p>
                <p className="font-medium">{selectedItemForPreview.kategori}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Satuan</p>
                <p className="font-medium">{selectedItemForPreview.satuan}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Jumlah</p>
                <p className="font-medium">{selectedItemForPreview.jumlah} {selectedItemForPreview.satuan}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Harga</p>
                <p className="font-medium">{formatRupiah(selectedItemForPreview.harga)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Status</p>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  selectedItemForPreview.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {selectedItemForPreview.status}
                </span>
              </div>
              <div>
                <p className="text-sm text-gray-600">Supplier</p>
                <p className="font-medium">{selectedItemForPreview.supplier}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Lokasi</p>
                <p className="font-medium">{selectedItemForPreview.lokasi}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Tanggal Masuk</p>
                <p className="font-medium">{selectedItemForPreview.tanggal_masuk}</p>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-gray-600">Deskripsi</p>
                <p className="font-medium">{selectedItemForPreview.deskripsi}</p>
              </div>
            </div>
            
            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={downloadItemReport}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2"
              >
                <FileText className="w-4 h-4" />
                Download Surat Detail
              </button>
              <button
                onClick={closePreview}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Item Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">{editId ? 'Edit Item' : 'Add New Item'}</h2>
              <button 
                onClick={() => {
                  setShowForm(false);
                  resetForm();
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Kode *</label>
                  <input
                    type="text"
                    value={form.kode}
                    onChange={(e) => setForm({...form, kode: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="M001"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Nama Item *</label>
                  <input
                    type="text"
                    value={form.nama}
                    onChange={(e) => setForm({...form, nama: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Nama item"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Merek</label>
                  <input
                    type="text"
                    value={form.merek}
                    onChange={(e) => setForm({...form, merek: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Merek"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Kategori</label>
                  <select
                    value={form.kategori}
                    onChange={(e) => setForm({...form, kategori: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Pilih kategori</option>
                    <option value="Barang Bangunan">Barang Bangunan</option>
                    <option value="Makanan">Makanan</option>
                    <option value="Minuman">Minuman</option>
                    <option value="Elektronik">Elektronik</option>
                    <option value="Pakaian">Pakaian</option>
                    <option value="Alat Tulis">Alat Tulis</option>
                    <option value="Kesehatan">Kesehatan</option>
                    <option value="Kosmetik">Kosmetik</option>
                    <option value="Otomotif">Otomotif</option>
                    <option value="Industrial Gas">Industrial Gas</option>
                    <option value="Lainnya">Lainnya</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Satuan</label>
                  <select
                    value={form.satuan}
                    onChange={(e) => setForm({...form, satuan: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Pilih satuan</option>
                    {units.map(unit => (
                      <option key={unit} value={unit}>{unit}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Jumlah *</label>
                  <input
                    type="number"
                    value={form.jumlah}
                    onChange={(e) => setForm({...form, jumlah: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0"
                    min="0"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Harga *</label>
                  <input
                    type="number"
                    value={form.harga}
                    onChange={(e) => setForm({...form, harga: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0"
                    min="0"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Status</label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm({...form, status: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Gudang</label>
                  <select
                    value={form.gudang_id}
                    onChange={(e) => setForm({...form, gudang_id: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Pilih gudang</option>
                    {warehouses.map(warehouse => (
                      <option key={warehouse.id} value={warehouse.id}>{warehouse.nama}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Supplier</label>
                  <input
                    type="text"
                    value={form.supplier}
                    onChange={(e) => setForm({...form, supplier: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Nama supplier"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Tanggal Masuk</label>
                  <input
                    type="date"
                    value={form.tanggal_masuk}
                    onChange={(e) => setForm({...form, tanggal_masuk: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-1">Deskripsi</label>
                  <textarea
                    value={form.deskripsi}
                    onChange={(e) => setForm({...form, deskripsi: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows="3"
                    placeholder="Deskripsi item"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    resetForm();
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  {editId ? 'Update' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
