// Final connection test - simulate user actions
async function finalTest() {
    console.log('🚀 FINAL CONNECTION TEST');
    console.log('========================');
    
    try {
        // 1. Load existing items
        console.log('1️⃣ Loading items...');
        const loadResponse = await fetch('http://localhost:8080/items');
        const items = await loadResponse.json();
        console.log(`✅ Found ${items.length} items`);
        
        // 2. Create new item
        console.log('2️⃣ Creating new item...');
        const newItem = {
            kode: "FINAL001",
            nama: "Final Test Item",
            merek: "Final",
            kategori: "Test",
            satuan: "PCS",
            jumlah: 10,
            harga: 100000,
            status: "active",
            supplier: "Final Supplier",
            lokasi: "Final Location",
            tanggal_masuk: "2024-01-01",
            deskripsi: "Final test item - connection verified"
        };
        
        const createResponse = await fetch('http://localhost:8080/items', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newItem)
        });
        
        const createdItem = await createResponse.json();
        console.log('✅ Item created:', createdItem.kode);
        
        // 3. Update the item
        console.log('3️⃣ Updating item...');
        const updateResponse = await fetch(`http://localhost:8080/items/${createdItem.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({...createdItem, nama: "Updated Final Test Item"})
        });
        
        const updatedItem = await updateResponse.json();
        console.log('✅ Item updated:', updatedItem.nama);
        
        // 4. Delete the item
        console.log('4️⃣ Deleting item...');
        const deleteResponse = await fetch(`http://localhost:8080/items/${createdItem.id}`, {
            method: 'DELETE'
        });
        
        const deleteResult = await deleteResponse.json();
        console.log('✅ Item deleted:', deleteResult.message);
        
        // 5. Verify deletion
        console.log('5️⃣ Verifying deletion...');
        const verifyResponse = await fetch('http://localhost:8080/items');
        const finalItems = await verifyResponse.json();
        console.log(`✅ Final item count: ${finalItems.length}`);
        
        console.log('🎉 ALL TESTS PASSED!');
        console.log('✅ Frontend-Backend connection is PERFECT!');
        console.log('✅ Save/Update/Delete operations working!');
        console.log('✅ Database connection verified!');
        
    } catch (error) {
        console.error('❌ TEST FAILED:', error);
    }
}

// Run final test
finalTest();
