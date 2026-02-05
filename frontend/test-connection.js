// Test connection script
async function testConnection() {
    console.log('Testing frontend-backend connection...');
    
    try {
        // Test GET
        console.log('1. Testing GET /items...');
        const getResponse = await fetch('http://localhost:8080/items');
        console.log('GET Status:', getResponse.status);
        const getData = await getResponse.json();
        console.log('GET Data:', getData);
        
        // Test POST
        console.log('2. Testing POST /items...');
        const testItem = {
            kode: "CONN001",
            nama: "Connection Test",
            merek: "Test",
            kategori: "Test",
            satuan: "PCS",
            jumlah: 5,
            harga: 25000,
            status: "active",
            supplier: "Test Supplier",
            lokasi: "Test Location",
            tanggal_masuk: "2024-01-01",
            deskripsi: "Connection test item"
        };
        
        const postResponse = await fetch('http://localhost:8080/items', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(testItem)
        });
        console.log('POST Status:', postResponse.status);
        const postData = await postResponse.json();
        console.log('POST Data:', postData);
        
        // Test DELETE
        if (postData.id) {
            console.log('3. Testing DELETE /items...');
            const deleteResponse = await fetch(`http://localhost:8080/items/${postData.id}`, {
                method: 'DELETE'
            });
            console.log('DELETE Status:', deleteResponse.status);
            const deleteData = await deleteResponse.json();
            console.log('DELETE Data:', deleteData);
        }
        
        console.log('✅ Connection test completed successfully!');
        
    } catch (error) {
        console.error('❌ Connection test failed:', error);
    }
}

// Run test
testConnection();
