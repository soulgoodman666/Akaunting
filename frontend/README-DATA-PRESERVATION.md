# 📋 Data Preservation Guide

## 🔒 Protect Your Data During Code Updates

This guide ensures your data is never lost when making code changes to your Akaunting application.

## 🚀 Quick Start

### 1. Backup Your Database Data
```bash
node backup-data-node.cjs backup
```
This creates a JSON file with all your items, groups, warehouses, and transfers.

### 2. Backup Your Source Code
```bash
node safe-code-updates.cjs backup-files
```
This backs up all your current React components.

### 3. Make Code Changes Safely
Now you can safely modify your code knowing everything is backed up.

### 4. Test Your Changes
Test your application with the existing data.

### 5. Restore If Needed
```bash
# Restore source code
node safe-code-updates.cjs restore-files backup-files-2026-02-03

# Restore database data
node backup-data-node.cjs restore akaunting-backup-2026-02-03.json
```

## 📁 Backup Files Location

### Database Backups
- **Files**: `akaunting-backup-YYYY-MM-DD.json`
- **Contains**: All items, groups, warehouses, transfers
- **Format**: JSON with timestamps

### Source Code Backups
- **Directory**: `backup-files-YYYY-MM-DD/`
- **Contains**: All React components
- **Files**: Items.jsx, Warehouse.jsx, TransferOrder.jsx, Groups.jsx, GroupDetail.jsx

## 🔄 Complete Workflow

### Before Making Changes:
1. **Backup Database**: `node backup-data-node.cjs backup`
2. **Backup Code**: `node safe-code-updates.cjs backup-files`
3. **Check Backups**: Verify files exist

### During Development:
1. **Make Changes**: Modify your code
2. **Test**: Test with existing data
3. **Iterate**: Continue improving

### If Something Goes Wrong:
1. **Stop**: Don't panic!
2. **Restore Code**: `node safe-code-updates.cjs restore-files <backup-dir>`
3. **Restore Data**: `node backup-data-node.cjs restore <backup-file>`
4. **Continue**: Try again with the restored state

## 📊 What Gets Backed Up

### Database Data:
- ✅ **Items**: All inventory items with quantities, prices, suppliers
- ✅ **Groups**: Item groups and categorizations
- ✅ **Warehouses**: Warehouse locations and details
- ✅ **Transfers**: All transfer records and history

### Source Code:
- ✅ **Items.jsx**: Inventory management component
- ✅ **Warehouse.jsx**: Warehouse management component
- ✅ **TransferOrder.jsx**: Transfer management component
- ✅ **Groups.jsx**: Group management component
- ✅ **GroupDetail.jsx**: Group details component

## 🛡️ Safety Features

### Automatic Timestamps
All backups include timestamps for easy tracking.

### Data Integrity
Backups preserve all relationships and data structure.

### Easy Restoration
One-command restore for both code and data.

### Multiple Backups
Keep multiple backup versions for safety.

## 📞 Emergency Procedures

### If Database Gets Corrupted:
1. Stop the application
2. Restore from latest backup: `node backup-data-node.cjs restore <latest-backup>`
3. Verify data integrity
4. Restart application

### If Code Changes Break Something:
1. Restore code: `node safe-code-updates.cjs restore-files <latest-backup>`
2. Test functionality
3. Make smaller, incremental changes

### If Both Code and Data Have Issues:
1. Restore code first
2. Restore data second
3. Test everything
4. Start fresh with backed up state

## 📝 Best Practices

### Regular Backups:
- Backup before major changes
- Backup daily if making frequent changes
- Keep multiple backup versions

### Testing:
- Always test with real data
- Test all CRUD operations
- Verify UI functionality

### Documentation:
- Document what changes you made
- Note any data migrations needed
- Keep track of backup versions

## 🎯 Your Data is Safe!

With this system:
- ✅ Your data is never lost
- ✅ You can always go back
- ✅ Changes are reversible
- ✅ Multiple safety layers
- ✅ Easy to use commands

**Happy coding with confidence!** 🚀
