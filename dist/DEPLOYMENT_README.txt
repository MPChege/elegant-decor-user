========================================
ELEGANT TILES & DÉCOR - CPANEL DEPLOYMENT
========================================

This package contains the production build of the Elegant Tiles & Décor website.

DEPLOYMENT STEPS:
=================

1. UPLOAD FILES TO CPANEL
   -----------------------
   - Upload the entire contents of this folder to your cPanel File Manager
   - Recommended location: /home/username/elegant (NOT public_html directly)
   - Extract all files if uploaded as ZIP

2. SET UP NODE.JS APP IN CPANEL
   ------------------------------
   - Go to cPanel > Software > Node.js App
   - Click "Create Application"
   - Application root: elegant (or your chosen folder name)
   - Application URL: elegantdecor.co.ke (or your domain)
   - Application startup file: server.js
   - Application mode: Production
   - Node.js version: 22.x (or latest available)

3. SET ENVIRONMENT VARIABLES
   ---------------------------
   In the Node.js App settings, add these environment variables:
   
   NODE_ENV=production
   PORT=3000
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   NEXT_PUBLIC_SITE_URL=https://www.elegantdecor.co.ke

4. INSTALL DEPENDENCIES
   ---------------------
   - In Node.js App settings, click "Run NPM Install"
   - Wait for installation to complete
   - If you see an error about node_modules, delete the node_modules folder first
     (CloudLinux creates it in a virtual environment)

5. START THE APPLICATION
   ----------------------
   - Click "Restart App" in Node.js App settings
   - Wait for status to show "Running"
   - Check logs if there are any errors

6. CONFIGURE APACHE (if needed)
   -----------------------------
   - If your app is not in public_html, create an .htaccess file in public_html:
   
   RewriteEngine On
   RewriteCond %{REQUEST_FILENAME} !-f
   RewriteCond %{REQUEST_FILENAME} !-d
   RewriteRule ^(.*)$ http://localhost:3000/$1 [P,L]

7. VERIFY DEPLOYMENT
   ------------------
   - Visit https://www.elegantdecor.co.ke
   - Check that all pages load correctly
   - Test product pages, contact form, etc.

TROUBLESHOOTING:
================

- If the app doesn't start:
  * Check Node.js App logs in cPanel
  * Verify all environment variables are set
  * Ensure PORT is set to 3000
  * Check that server.js exists in the application root

- If you see "Directory not allowed" error:
  * Don't set Application root to public_html
  * Use a subdirectory like /home/username/elegant

- If npm install fails:
  * Delete node_modules folder from application root
  * CloudLinux will create it in a virtual environment

- If the website shows errors:
  * Check browser console for errors
  * Verify Supabase environment variables are correct
  * Check that NEXT_PUBLIC_SITE_URL matches your domain

SUPPORT:
========
For issues, check the application logs in cPanel Node.js App settings.

Last Updated: December 2024
