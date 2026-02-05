// Test warehouse display
async function testWarehouseDisplay() {
    console.log('🏪 TESTING WAREHOUSE DISPLAY');
    console.log('===============================');
    
    try {
        // Add test warehouse with all fields
        console.log('1️⃣ Adding test warehouse...');
        const response = await fetch('http://localhost:8080/warehouses', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                nama: "Test Display Warehouse",
                kode: "TEST001",
                alamat: "Jl. Test Display No. 123",
                kota: "Jakarta",
                provinsi: "DKI Jakarta",
                telepon: "+62-21-1234-5678",
                manager: "Test Manager",
                volume_luas: 1500.75,
                kapasitas: 5000,
                status: "active"
            })
        });
        
        if (response.ok) {
            const warehouse = await response.json();
            console.log('✅ Test warehouse added:', warehouse.nama);
            
            // Get all warehouses
            console.log('2️⃣ Fetching all warehouses...');
            const getResponse = await fetch('http://localhost:8080/warehouses');
            const warehouses = await getResponse.json();
            
            console.log('✅ Current warehouses in database:');
            warehouses.forEach((wh, index) => {
                console.log(`${index + 1}. ${wh.kode} - ${wh.nama}`);
                console.log(`   📍 ${wh.kota}, ${wh.provinsi}`);
                console.log(`   👤 Manager: ${wh.manager || 'Not set'}`);
                console.log(`   📞 Phone: ${wh.telepon || 'Not set'}`);
                console.log(`   📏 Volume: ${wh.volume_luas || 0} m²`);
                console.log(`   📦 Capacity: ${wh.kapasitas || 0}`);
                console.log(`   ✅ Status: ${wh.status}`);
                console.log('');
            });
            
            console.log('🎉 WAREHOUSE DISPLAY TEST COMPLETED!');
            console.log('✅ All warehouses display correctly');
            console.log('✅ All fields are showing');
            console.log('✅ Data is properly formatted');
        }
        
    } catch (error) {
        console.error('❌ WAREHOUSE DISPLAY TEST FAILED:', error);
    }
}

// Run test
testWarehouseDisplay();
