// Safe code updates - backup before making changes
const fs = require('fs');
const path = require('path');

// Function to backup current files before making changes
function backupFilesBeforeUpdate() {
    console.log('🔒 BACKING UP FILES BEFORE CODE UPDATES');
    console.log('=======================================');
    
    const filesToBackup = [
        'src/pages/sidebar/Items.jsx',
        'src/pages/sidebar/Warehouse.jsx',
        'src/pages/sidebar/TransferOrder.jsx',
        'src/pages/sidebar/Groups.jsx',
        'src/pages/sidebar/GroupDetail.jsx'
    ];
    
    const backupDir = `backup-files-${new Date().toISOString().split('T')[0]}`;
    
    // Create backup directory
    if (!fs.existsSync(backupDir)) {
        fs.mkdirSync(backupDir, { recursive: true });
    }
    
    filesToBackup.forEach(file => {
        const sourcePath = path.join(__dirname, file);
        const backupPath = path.join(backupDir, path.basename(file));
        
        if (fs.existsSync(sourcePath)) {
            fs.copyFileSync(sourcePath, backupPath);
            console.log(`✅ Backed up: ${file}`);
        } else {
            console.log(`⚠️ File not found: ${file}`);
        }
    });
    
    console.log(`📁 Backup directory: ${backupDir}`);
    console.log('🔒 All files backed up safely!');
    
    return backupDir;
}

// Function to restore files from backup
function restoreFilesFromBackup(backupDir) {
    console.log('🔄 RESTORING FILES FROM BACKUP');
    console.log('===============================');
    
    const filesToRestore = [
        'Items.jsx',
        'Warehouse.jsx', 
        'TransferOrder.jsx',
        'Groups.jsx',
        'GroupDetail.jsx'
    ];
    
    filesToRestore.forEach(file => {
        const backupPath = path.join(backupDir, file);
        const restorePath = path.join(__dirname, 'src/pages/sidebar', file);
        
        if (fs.existsSync(backupPath)) {
            fs.copyFileSync(backupPath, restorePath);
            console.log(`✅ Restored: ${file}`);
        } else {
            console.log(`⚠️ Backup not found: ${file}`);
        }
    });
    
    console.log('🔄 All files restored from backup!');
}

// Function to create a data preservation plan
function createDataPreservationPlan() {
    console.log('📋 CREATING DATA PRESERVATION PLAN');
    console.log('==================================');
    
    const plan = {
        timestamp: new Date().toISOString(),
        steps: [
            '1. Backup all current data from database',
            '2. Backup current source code files',
            '3. Make code changes safely',
            '4. Test with backup data',
            '5. Restore if needed',
            '6. Keep backup for future reference'
        ],
        backupCommands: [
            'node backup-data-node.cjs backup',
            'node safe-code-updates.js backup-files',
            'node safe-code-updates.js restore-files <backup-dir>'
        ],
        dataLocations: [
            'Database: MySQL akaunting',
            'Backup Files: ./backup-*.json',
            'Code Backups: ./backup-files-*/'
        ]
    };
    
    fs.writeFileSync('data-preservation-plan.json', JSON.stringify(plan, null, 2));
    console.log('📋 Data preservation plan saved to data-preservation-plan.json');
    
    console.log('\n📋 PRESERVATION STEPS:');
    plan.steps.forEach(step => console.log(`   ${step}`));
    
    console.log('\n🔧 BACKUP COMMANDS:');
    plan.backupCommands.forEach(cmd => console.log(`   ${cmd}`));
    
    console.log('\n📁 DATA LOCATIONS:');
    plan.dataLocations.forEach(location => console.log(`   ${location}`));
    
    return plan;
}

// Command line interface
const command = process.argv[2];

if (command === 'backup-files') {
    backupFilesBeforeUpdate();
} else if (command === 'restore-files' && process.argv[3]) {
    restoreFilesFromBackup(process.argv[3]);
} else if (command === 'plan') {
    createDataPreservationPlan();
} else {
    console.log('Safe Code Updates - Data Preservation Tool');
    console.log('===========================================');
    console.log('');
    console.log('Usage:');
    console.log('  node safe-code-updates.js backup-files     - Backup source code files');
    console.log('  node safe-code-updates.js restore-files <dir> - Restore from backup');
    console.log('  node safe-code-updates.js plan              - Create preservation plan');
    console.log('');
    console.log('Workflow:');
    console.log('  1. node backup-data-node.cjs backup      - Backup database data');
    console.log('  2. node safe-code-updates.js backup-files  - Backup source files');
    console.log('  3. Make your code changes');
    console.log('  4. Test the changes');
    console.log('  5. If needed: node safe-code-updates.js restore-files <backup-dir>');
    console.log('  6. If needed: node backup-data-node.cjs restore <backup-file>');
}
