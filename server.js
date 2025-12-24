const path = require('path');
const fs = require('fs');

// Set environment to production
process.env.NODE_ENV = process.env.NODE_ENV || 'production';

// Get port from environment (cPanel will set this)
const PORT = parseInt(process.env.PORT || process.env.NODE_PORT || '3000', 10);
process.env.PORT = PORT.toString();

// Get the application root directory (where server.js is located)
const appRoot = __dirname;

// Paths to Next.js build files
const standalonePath = path.join(appRoot, '.next', 'standalone');
const staticPath = path.join(appRoot, '.next', 'static');
const serverPath = path.join(standalonePath, 'server.js');

// Verify standalone build exists
if (!fs.existsSync(standalonePath)) {
  console.error(`❌ Error: Standalone build not found at ${standalonePath}`);
  console.error('Please ensure the Next.js build completed successfully.');
  process.exit(1);
}

if (!fs.existsSync(serverPath)) {
  console.error(`❌ Error: Server file not found at ${serverPath}`);
  console.error('Please ensure the Next.js build completed successfully.');
  process.exit(1);
}

// Verify static files exist (required for CSS and JS chunks)
if (!fs.existsSync(staticPath)) {
  console.error(`⚠️  Warning: Static files not found at ${staticPath}`);
  console.error('Static assets may not load correctly.');
} else {
  console.log(`✅ Static files found at ${staticPath}`);
}

// CRITICAL FIX: Set the static folder path for Next.js
// Next.js standalone needs to know where to find static files
// We need to create a symlink or copy the static folder into standalone
const standaloneNextPath = path.join(standalonePath, '.next');
const standaloneStaticPath = path.join(standaloneNextPath, 'static');

// Create .next directory in standalone if it doesn't exist
if (!fs.existsSync(standaloneNextPath)) {
  fs.mkdirSync(standaloneNextPath, { recursive: true });
  console.log(`✅ Created .next directory in standalone: ${standaloneNextPath}`);
}

// Create symlink or copy static folder to standalone/.next/static
// This allows Next.js to find static files when running from standalone directory
if (!fs.existsSync(standaloneStaticPath)) {
  try {
    // Try to create symlink (works on most Unix systems)
    const relativeStaticPath = path.relative(standaloneNextPath, staticPath);
    fs.symlinkSync(relativeStaticPath, standaloneStaticPath, 'dir');
    console.log(`✅ Created symlink: ${standaloneStaticPath} -> ${relativeStaticPath}`);
  } catch (error) {
    // If symlink fails (e.g., on Windows or permission issues), copy the folder
    console.log(`⚠️  Symlink failed (${error.message}), copying static folder instead...`);
    try {
      fs.cpSync(staticPath, standaloneStaticPath, { recursive: true });
      console.log(`✅ Copied static folder to: ${standaloneStaticPath}`);
    } catch (copyError) {
      console.error(`❌ Failed to copy static folder: ${copyError.message}`);
      console.error('Static files may not load correctly.');
    }
  }
} else {
  console.log(`✅ Static folder already exists at: ${standaloneStaticPath}`);
}

// Log startup information
console.log('═══════════════════════════════════════════════════════');
console.log('🚀 Starting Elegant Tiles & Décor Application');
console.log('═══════════════════════════════════════════════════════');
console.log(`📁 Application Root: ${appRoot}`);
console.log(`📦 Standalone Path: ${standalonePath}`);
console.log(`📂 Static Path: ${staticPath}`);
console.log(`📂 Standalone Static Path: ${standaloneStaticPath}`);
console.log(`🌐 Port: ${PORT}`);
console.log(`🔧 Environment: ${process.env.NODE_ENV}`);
console.log('═══════════════════════════════════════════════════════');

// Change to standalone directory (required by Next.js standalone)
// This is necessary for Next.js to find its files correctly
try {
  process.chdir(standalonePath);
  console.log(`✅ Changed working directory to: ${standalonePath}`);
} catch (error) {
  console.error(`❌ Failed to change directory: ${error.message}`);
  console.error('This might be a CloudLinux permission issue.');
  console.error('Trying alternative approach...');
  // Fallback: try to load without changing directory
  // This may not work, but worth trying
}

// Load and start the Next.js standalone server
try {
  console.log('⏳ Loading Next.js server...');
  require(serverPath);
  console.log('✅ Next.js server started successfully');
} catch (error) {
  console.error('❌ Failed to start server:');
  console.error(error);
  // Log detailed error information
  if (error.code === 'MODULE_NOT_FOUND') {
    console.error('\n💡 Troubleshooting:');
    console.error('   - Ensure .next/standalone/node_modules exists');
    console.error('   - Check that all files were extracted correctly');
    console.error('   - Verify environment variables are set');
  } else if (error.code === 'EACCES' || error.message.includes('permission')) {
    console.error('\n💡 Permission Issue:');
    console.error('   - Contact your hosting provider');
    console.error('   - Check file permissions in .next/standalone');
  }
  process.exit(1);
}

