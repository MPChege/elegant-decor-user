# Disk Quota Exceeded - Fix Guide

## Problem
Your cPanel hosting has run out of disk space. The error "OSError: [Errno 122] Disk quota exceeded" means you need to free up space before deploying.

## Solution Steps

### Step 1: Clean Up Old Files on Server

**IMPORTANT**: Before uploading the new package, you MUST clean up old files on your server.

1. **Log into cPanel File Manager**
2. **Navigate to your application directory**: `/home/elegant6/elegant`
3. **Delete old files**:
   - Old `.next` folders (if any)
   - Old `node_modules` folders (if any)
   - Old deployment files
   - Any backup files or old zip files

4. **Check Disk Usage**:
   - In cPanel, go to "Disk Space Usage" or "Disk Usage"
   - See what's taking up space
   - Delete unnecessary files

### Step 2: Check Current Disk Usage

In cPanel:
- Go to **"Disk Space Usage"** or **"Disk Usage"**
- Check how much space you're using
- You need at least **800MB free** to extract the deployment package

### Step 3: Free Up Space

**Safe to Delete**:
- Old backup files
- Old log files
- Old zip files
- Old `.next` build folders (if you have old ones)
- Old `node_modules` (if you have old ones)
- Temporary files

**DO NOT DELETE**:
- Current `.next/standalone` folder (if app is running)
- Current `node_modules` (if app is running)
- `public` folder
- `server.js`
- Environment files

### Step 4: Alternative - Delete Everything and Start Fresh

If you have backups, you can:

1. **Stop the Node.js application** in cPanel
2. **Delete everything** in `/home/elegant6/elegant` (except keep a backup)
3. **Upload and extract** the new zip file
4. **Configure** the Node.js app again
5. **Set environment variables**
6. **Start** the application

### Step 5: Contact Hosting Provider

If you can't free up enough space:
- **Contact your hosting provider**
- **Ask them to increase your disk quota**
- **Explain you need at least 1GB for a Next.js application**

## Quick Cleanup Commands (if you have SSH access)

```bash
# Navigate to your app directory
cd /home/elegant6/elegant

# Check disk usage
du -sh *

# Remove old build files (if any)
rm -rf .next.old
rm -rf node_modules.old

# Remove old zip files
rm -f *.zip

# Remove old log files
find . -name "*.log" -type f -delete

# Check space freed
df -h .
```

## After Cleaning Up

1. **Verify you have at least 800MB free space**
2. **Upload the new deployment package**
3. **Extract it**
4. **Configure and start the application**

## Prevention

- Regularly clean up old files
- Don't keep multiple versions of the app
- Remove old backup files
- Monitor disk usage in cPanel


