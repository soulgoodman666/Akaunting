// Test Items page for debugging
console.log('🔍 Testing Items Page...');

// Test 1: Check if Items component can be imported
try {
  console.log('1️⃣ Testing import...');
  
  // Simulate import check
  const fs = require('fs');
  const path = require('path');
  
  const itemsPath = path.join(__dirname, 'src/pages/sidebar/Items.jsx');
  
  if (fs.existsSync(itemsPath)) {
    console.log('✅ Items.jsx file exists');
    
    const content = fs.readFileSync(itemsPath, 'utf8');
    
    // Check for common issues
    const issues = [];
    
    // Check for duplicate variable declarations
    const filteredItemsMatches = content.match(/const filteredItems/g);
    if (filteredItemsMatches && filteredItemsMatches.length > 1) {
      issues.push('❌ Duplicate filteredItems declaration');
    }
    
    // Check for duplicate function declarations
    const downloadSingleItemMatches = content.match(/const downloadSingleItem/g);
    if (downloadSingleItemMatches && downloadSingleItemMatches.length > 1) {
      issues.push('❌ Duplicate downloadSingleItem declaration');
    }
    
    // Check for missing imports
    if (!content.includes('Download, ChevronDown')) {
      issues.push('❌ Missing Download or ChevronDown import');
    }
    
    // Check for syntax errors (basic)
    const openBraces = (content.match(/{/g) || []).length;
    const closeBraces = (content.match(/}/g) || []).length;
    
    if (openBraces !== closeBraces) {
      issues.push(`❌ Brace mismatch: ${openBraces} open, ${closeBraces} close`);
    }
    
    if (issues.length > 0) {
      console.log('\n🚨 ISSUES FOUND:');
      issues.forEach(issue => console.log(issue));
    } else {
      console.log('✅ No obvious syntax issues found');
    }
    
  } else {
    console.log('❌ Items.jsx file not found');
  }
  
} catch (error) {
  console.error('❌ Import test failed:', error.message);
}

// Test 2: Check backend API
async function testBackend() {
  try {
    console.log('\n2️⃣ Testing backend API...');
    const response = await fetch('http://localhost:8080/items');
    
    if (response.ok) {
      const data = await response.json();
      console.log(`✅ Backend API working (${data.length} items)`);
      
      // Check if items have required fields
      const hasRequiredFields = data.every(item => 
        item.id && item.kode && item.nama && item.jumlah !== undefined
      );
      
      if (hasRequiredFields) {
        console.log('✅ Items have required fields');
      } else {
        console.log('❌ Some items missing required fields');
      }
      
    } else {
      console.log(`❌ Backend API error: ${response.status}`);
    }
  } catch (error) {
    console.log('❌ Backend API test failed:', error.message);
  }
}

// Test 3: Check frontend server
async function testFrontend() {
  try {
    console.log('\n3️⃣ Testing frontend server...');
    const response = await fetch('http://localhost:5173');
    
    if (response.ok) {
      console.log('✅ Frontend server responding');
      const text = await response.text();
      
      if (text.includes('html')) {
        console.log('✅ Frontend serving HTML');
      } else {
        console.log('❌ Frontend not serving proper HTML');
      }
    } else {
      console.log(`❌ Frontend server error: ${response.status}`);
    }
  } catch (error) {
    console.log('❌ Frontend server test failed:', error.message);
  }
}

// Run tests
testBackend();
testFrontend();

console.log('\n🔍 Test completed. Check browser console for React errors.');
