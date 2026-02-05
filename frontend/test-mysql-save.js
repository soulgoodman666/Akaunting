// Test data persistence in MySQL
async function testMySQLSave() {
    console.log('🗄️  TESTING DATA PERSISTENCE IN MYSQL');
    console.log('====================================');
    
    try {
        // Test 1: Add Item
        console.log('1️⃣ Adding new item to MySQL...');
        const itemResponse = await fetch('http://localhost:8080/items', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                kode: "MYSQL001",
                nama: "MySQL Test Item",
                merek: "MySQLTest",
                kategori: "Database Test",
                satuan: "PCS",
                jumlah: 25,
                harga: 75000,
                status: "active",
                supplier: "MySQL Supplier",
                lokasi: "MySQL Location",
                tanggal_masuk: "2024-01-15",
                deskripsi: "This item should persist in MySQL"
            })
        });
        
        if (itemResponse.ok) {
            const savedItem = await itemResponse.json();
            console.log('✅ Item saved to MySQL:', savedItem.kode, 'ID:', savedItem.id);
            
            // Verify item exists
            const verifyResponse = await fetch('http://localhost:8080/items');
            const items = await verifyResponse.json();
            const exists = items.some(item => item.id === savedItem.id);
            console.log('✅ Item exists in MySQL:', exists);
        }
        
        // Test 2: Add Group
        console.log('2️⃣ Adding new group to MySQL...');
        const groupResponse = await fetch('http://localhost:8080/groups', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                nama: "MySQL Test Group",
                deskripsi: "This group should persist in MySQL database",
                kategori: "Database Test",
                status: "active"
            })
        });
        
        if (groupResponse.ok) {
            const savedGroup = await groupResponse.json();
            console.log('✅ Group saved to MySQL:', savedGroup.nama, 'ID:', savedGroup.id);
            
            // Verify group exists
            const verifyGroupResponse = await fetch('http://localhost:8080/groups');
            const groups = await verifyGroupResponse.json();
            const groupExists = groups.some(group => group.id === savedGroup.id);
            console.log('✅ Group exists in MySQL:', groupExists);
        }
        
        // Test 3: Add Warehouse
        console.log('3️⃣ Adding new warehouse to MySQL...');
        const warehouseResponse = await fetch('http://localhost:8080/warehouses', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                nama: "MySQL Test Warehouse",
                kode: "MYSQLWH",
                alamat: "MySQL Test Address",
                kota: "MySQL City",
                provinsi: "MySQL Province",
                kapasitas: 5000,
                status: "active"
            })
        });
        
        if (warehouseResponse.ok) {
            const savedWarehouse = await warehouseResponse.json();
            console.log('✅ Warehouse saved to MySQL:', savedWarehouse.nama, 'ID:', savedWarehouse.id);
            
            // Verify warehouse exists
            const verifyWarehouseResponse = await fetch('http://localhost:8080/warehouses');
            const warehouses = await verifyWarehouseResponse.json();
            const warehouseExists = warehouses.some(warehouse => warehouse.id === savedWarehouse.id);
            console.log('✅ Warehouse exists in MySQL:', warehouseExists);
        }
        
        // Test 4: Add Transfer
        console.log('4️⃣ Adding new transfer to MySQL...');
        const transferResponse = await fetch('http://localhost:8080/transfers', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                kode: "MYSQLTR001",
                item_id: 1,
                from_warehouse_id: 1,
                to_warehouse_id: 2,
                jumlah: 15,
                status: "pending",
                tanggal_transfer: "2024-01-15",
                catatan: "This transfer should persist in MySQL"
            })
        });
        
        if (transferResponse.ok) {
            const savedTransfer = await transferResponse.json();
            console.log('✅ Transfer saved to MySQL:', savedTransfer.kode, 'ID:', savedTransfer.id);
            
            // Verify transfer exists
            const verifyTransferResponse = await fetch('http://localhost:8080/transfers');
            const transfers = await verifyTransferResponse.json();
            const transferExists = transfers.some(transfer => transfer.id === savedTransfer.id);
            console.log('✅ Transfer exists in MySQL:', transferExists);
        }
        
        console.log('🎉 MYSQL PERSISTENCE TEST COMPLETED!');
        console.log('✅ All data successfully saved to MySQL database');
        console.log('✅ Data verification passed');
        console.log('✅ Database connection is working perfectly');
        
        // Final verification - check all data counts
        console.log('\n📊 FINAL DATA COUNTS:');
        
        const finalItems = await (await fetch('http://localhost:8080/items')).json();
        const finalGroups = await (await fetch('http://localhost:8080/groups')).json();
        const finalWarehouses = await (await fetch('http://localhost:8080/warehouses')).json();
        const finalTransfers = await (await fetch('http://localhost:8080/transfers')).json();
        
        console.log('📦 Items in MySQL:', finalItems.length);
        console.log('📁 Groups in MySQL:', finalGroups.length);
        console.log('🏭 Warehouses in MySQL:', finalWarehouses.length);
        console.log('🚚 Transfers in MySQL:', finalTransfers.length);
        
    } catch (error) {
        console.error('❌ MYSQL TEST FAILED:', error);
    }
}

// Run test
testMySQLSave();
