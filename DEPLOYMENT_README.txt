ELEGANT TILES & DÉCOR - CPANEL DEPLOYMENT GUIDE
================================================

IMPORTANT: The 503 error means the Node.js application is not running!
Follow these steps carefully:

DEPLOYMENT STEPS:
-----------------

1. Upload and Extract:
   - Upload site.zip to your cPanel File Manager
   - Extract the zip file in your public_html directory
   - Make sure all files are extracted correctly

2. Set Up Node.js Application in cPanel (CRITICAL):
   - Go to cPanel > "Node.js Selector" or "Setup Node.js App"
   - Click "Create Application" or "+ CREATE"
   - Fill in the form:
     * Node.js Version: Select 18.x or 20.x (latest stable)
     * Application Mode: Production
     * Application Root: /home/username/public_html
     * Application URL: elegantdecor.co.ke (or your domain)
     * Application Startup File: server.js
   - Click "CREATE" or "Save"

3. Set Environment Variables (REQUIRED):
   - After creating the app, click "Manage" or the pencil icon
   - Click on "Environment Variables" or "ENV VARS"
   - Add these variables (click "Add Variable" for each):
     * NODE_ENV = production
     * NEXT_PUBLIC_SUPABASE_URL = (your Supabase project URL)
     * NEXT_PUBLIC_SUPABASE_ANON_KEY = (your Supabase anon key)
     * SUPABASE_SERVICE_ROLE_KEY = (if needed for server-side operations)
   - Click "Save" after adding each variable

4. Install Dependencies:
   - In cPanel Terminal or SSH, run:
     cd ~/public_html/.next/standalone
     npm install --production
   - OR use cPanel File Manager to navigate and use Terminal there

5. Start the Application:
   - Go back to Node.js Selector
   - Find your application
   - Click "RESTART" or "START" button
   - Wait for it to show "Running" status

6. Update .htaccess (if using proxy method):
   - If cPanel doesn't auto-route, you may need to update .htaccess
   - The PORT in .htaccess should match the port shown in Node.js Selector
   - Format: RewriteRule ^(.*)$ http://localhost:PORT/$1 [P,L]

7. Verify:
   - Visit your domain (e.g., elegantdecor.co.ke)
   - The site should load without 503 errors
   - Check Node.js Selector logs if there are issues

TROUBLESHOOTING 503 ERRORS:
----------------------------
1. Check Node.js App Status:
   - Go to Node.js Selector
   - Verify the app shows "Running" status
   - If it shows "Stopped", click "START"

2. Check Application Logs:
   - In Node.js Selector, click "View Logs" or "Logs"
   - Look for error messages
   - Common issues:
     * Missing environment variables
     * Port conflicts
     * Missing dependencies

3. Verify File Structure:
   - Ensure server.js exists in public_html root
   - Ensure .next/standalone folder exists
   - Ensure public folder exists in .next/standalone/

4. Check Port Configuration:
   - Note the PORT shown in Node.js Selector
   - Update .htaccess if using proxy (replace PORT with actual port)
   - Or remove .htaccess if cPanel handles routing automatically

5. Verify Environment Variables:
   - All required env vars must be set
   - Check for typos in variable names
   - Ensure values are correct (no extra spaces)

6. File Permissions:
   - Directories: 755
   - Files: 644
   - server.js: 755 (executable)

7. If Still Not Working:
   - Check cPanel error logs
   - Verify Node.js version compatibility (18.x or higher)
   - Try stopping and starting the app again
   - Contact your hosting provider if Node.js Selector is not working

QUICK CHECKLIST:
----------------
□ Files extracted to public_html
□ Node.js app created in cPanel
□ Environment variables set
□ Dependencies installed (if needed)
□ Application started/running
□ Port matches in .htaccess (if using proxy)
□ Site accessible without 503 error

