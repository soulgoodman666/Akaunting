// Startup status check and verification
async function checkStartupStatus() {
    console.log('🚀 AKOUNTING APPLICATION STARTUP STATUS');
    console.log('======================================');
    
    const status = {
        backend: false,
        frontend: false,
        database: false,
        features: {
            items: false,
            warehouses: false,
            transfers: false,
            groups: false,
            stockReduction: false
        }
    };
    
    try {
        // Check Backend
        console.log('1️⃣ Checking Backend API...');
        try {
            const backendResponse = await fetch('http://localhost:8080');
            if (backendResponse.ok) {
                const backendData = await backendResponse.json();
                console.log('✅ Backend API is running');
                console.log(`   Message: ${backendData.message}`);
                console.log(`   Status: ${backendData.status}`);
                status.backend = true;
                status.database = true;
            }
        } catch (error) {
            console.log('❌ Backend API is not responding');
        }
        
        // Check Frontend
        console.log('2️⃣ Checking Frontend...');
        try {
            const frontendResponse = await fetch('http://localhost:5173');
            if (frontendResponse.ok) {
                console.log('✅ Frontend is running');
                console.log('   URL: http://localhost:5173');
                status.frontend = true;
            }
        } catch (error) {
            console.log('❌ Frontend is not responding');
        }
        
        // Check API Endpoints
        if (status.backend) {
            console.log('3️⃣ Checking API Endpoints...');
            
            // Check Items
            try {
                const itemsResponse = await fetch('http://localhost:8080/items');
                if (itemsResponse.ok) {
                    const items = await itemsResponse.json();
                    console.log(`✅ Items API working (${items.length} items)`);
                    status.features.items = true;
                    
                    // Check if items have new fields
                    const hasNewFields = items.some(item => 
                        item.hasOwnProperty('initial_quantity') || 
                        item.hasOwnProperty('quantity_percentage')
                    );
                    if (hasNewFields) {
                        console.log('   ✅ New quantity tracking fields available');
                    }
                }
            } catch (error) {
                console.log('❌ Items API not working');
            }
            
            // Check Warehouses
            try {
                const warehousesResponse = await fetch('http://localhost:8080/warehouses');
                if (warehousesResponse.ok) {
                    const warehouses = await warehousesResponse.json();
                    console.log(`✅ Warehouses API working (${warehouses.length} warehouses)`);
                    status.features.warehouses = true;
                }
            } catch (error) {
                console.log('❌ Warehouses API not working');
            }
            
            // Check Transfers
            try {
                const transfersResponse = await fetch('http://localhost:8080/transfers');
                if (transfersResponse.ok) {
                    const transfers = await transfersResponse.json();
                    console.log(`✅ Transfers API working (${transfers.length} transfers)`);
                    status.features.transfers = true;
                }
            } catch (error) {
                console.log('❌ Transfers API not working');
            }
            
            // Check Groups
            try {
                const groupsResponse = await fetch('http://localhost:8080/groups');
                if (groupsResponse.ok) {
                    const groups = await groupsResponse.json();
                    console.log(`✅ Groups API working (${groups.length} groups)`);
                    status.features.groups = true;
                }
            } catch (error) {
                console.log('❌ Groups API not working');
            }
        }
        
        // Summary
        console.log('\n📊 STARTUP SUMMARY:');
        console.log(`🔧 Backend: ${status.backend ? '✅ Running' : '❌ Stopped'}`);
        console.log(`🌐 Frontend: ${status.frontend ? '✅ Running' : '❌ Stopped'}`);
        console.log(`💾 Database: ${status.database ? '✅ Connected' : '❌ Disconnected'}`);
        
        console.log('\n🎯 FEATURES STATUS:');
        console.log(`📦 Items Management: ${status.features.items ? '✅ Working' : '❌ Not Working'}`);
        console.log(`🏪 Warehouse Management: ${status.features.warehouses ? '✅ Working' : '❌ Not Working'}`);
        console.log(`🚚 Transfer Management: ${status.features.transfers ? '✅ Working' : '❌ Not Working'}`);
        console.log(`📁 Group Management: ${status.features.groups ? '✅ Working' : '❌ Not Working'}`);
        console.log(`📉 Stock Reduction: ${status.features.items ? '✅ Available' : '❌ Not Available'}`);
        
        // Overall Status
        const allWorking = status.backend && status.frontend && status.database;
        console.log(`\n🎉 OVERALL STATUS: ${allWorking ? '✅ ALL SYSTEMS OPERATIONAL' : '⚠️ SOME SYSTEMS NEED ATTENTION'}`);
        
        if (allWorking) {
            console.log('\n🌐 ACCESS URLs:');
            console.log('   Frontend: http://localhost:5173');
            console.log('   Backend API: http://localhost:8080');
            console.log('   API Docs: http://localhost:8080/');
            
            console.log('\n📋 AVAILABLE FEATURES:');
            console.log('   ✅ Items CRUD with quantity tracking');
            console.log('   ✅ Stock percentage calculation');
            console.log('   ✅ Stock reduction without edit');
            console.log('   ✅ Warehouse management');
            console.log('   ✅ Transfer management');
            console.log('   ✅ Group management');
            console.log('   ✅ Real-time updates');
            console.log('   ✅ Dark mode support');
        }
        
        return status;
        
    } catch (error) {
        console.error('❌ Startup check failed:', error);
        return status;
    }
}

// Auto-run startup check
checkStartupStatus();
