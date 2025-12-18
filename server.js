const path = require('path');

// Set environment
process.env.NODE_ENV = process.env.NODE_ENV || 'production';

// Get port from environment or use default (cPanel will set this)
const PORT = process.env.PORT || process.env.NODE_PORT || 3000;
process.env.PORT = PORT.toString();

// Path to standalone server
const standalonePath = path.join(__dirname, '.next', 'standalone');
const serverPath = path.join(standalonePath, 'server.js');

// Verify standalone path exists
const fs = require('fs');
if (!fs.existsSync(standalonePath)) {
  console.error(`Error: Standalone build not found at ${standalonePath}`);
  console.error('Please run: npm run build');
  process.exit(1);
}

if (!fs.existsSync(serverPath)) {
  console.error(`Error: Server file not found at ${serverPath}`);
  process.exit(1);
}

// Change to standalone directory (required by Next.js)
process.chdir(standalonePath);

// Load and start the Next.js server
try {
  console.log(`Starting Next.js server...`);
  console.log(`Port: ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
  console.log(`Working directory: ${standalonePath}`);
  
  require(serverPath);
} catch (error) {
  console.error('Failed to start server:', error);
  process.exit(1);
}

