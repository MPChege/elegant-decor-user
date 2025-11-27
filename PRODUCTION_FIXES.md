# Production Fixes Applied

## Issues Fixed

### 1. ✅ Hardcoded Localhost URLs
**Problem:** `lib/public-api.ts` had hardcoded `http://localhost:3001` fallback
**Fix:** Updated `getBaseUrl()` to:
- Use `VERCEL_URL` environment variable when available
- Use `NEXT_PUBLIC_APP_URL` or `NEXT_PUBLIC_SITE_URL` if set
- Fall back to relative URLs (which work automatically in Next.js server components)
- Use `window.location.origin` on client-side

### 2. ✅ Supabase Client Configuration
**Problem:** Production validation was too strict and could cause build failures
**Fix:** 
- Removed throwing errors during module load
- Added proper validation with clear error messages
- Uses placeholder values only during build time
- Validates production URLs at runtime

### 3. ✅ API Route Validation
**Problem:** Inconsistent validation across API routes
**Fix:** 
- Standardized production URL validation in all API routes
- Added consistent error messages
- All routes now check for localhost/placeholder URLs

### 4. ✅ Data Fetching Strategy
**Status:** ✅ Already correct
- All pages use `export const dynamic = 'force-dynamic'`
- Pages query Supabase directly (not via API routes)
- Uses `supabaseAdmin` to bypass RLS

### 5. ✅ Blog API Route
**Problem:** Missing production URL validation
**Fix:** Added same validation as other routes

## Files Changed

1. `lib/public-api.ts` - Fixed `getBaseUrl()` to use relative URLs
2. `lib/supabase.ts` - Improved production validation
3. `app/api/public/blog/route.ts` - Added production URL validation
4. `VERCEL_ENV_VARS.md` - Created documentation for environment variables

## Environment Variables Required

### Required (Must Set in Vercel):

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

### Optional:

```
NEXT_PUBLIC_SITE_URL=https://elegant-decor-tiles.vercel.app
NEXT_PUBLIC_APP_URL=https://elegant-decor-tiles.vercel.app
```

## Verification Checklist

After deploying to Vercel:

- [ ] Set all required environment variables in Vercel
- [ ] Verify `NEXT_PUBLIC_SUPABASE_URL` is your production Supabase URL (not localhost)
- [ ] Verify `NEXT_PUBLIC_SUPABASE_ANON_KEY` is set
- [ ] Verify `SUPABASE_SERVICE_ROLE_KEY` is set
- [ ] Redeploy the project
- [ ] Check Vercel Function Logs for any errors
- [ ] Test Projects page - should show data
- [ ] Test Journal page - should show data
- [ ] Test Products page - should show data
- [ ] Test Contact form submission
- [ ] Test Order form submission

## How to Set Environment Variables in Vercel

1. Go to Vercel Dashboard
2. Select your project
3. Go to Settings → Environment Variables
4. Add each variable:
   - Key: `NEXT_PUBLIC_SUPABASE_URL`
   - Value: Your Supabase project URL
   - Environment: Production, Preview, Development (select all)
5. Repeat for all required variables
6. Click "Save"
7. Redeploy the project

## Troubleshooting

If data still doesn't show:

1. **Check Vercel Function Logs:**
   - Go to Vercel Dashboard → Your Project → Functions
   - Check logs for errors
   - Look for Supabase connection errors

2. **Verify Environment Variables:**
   - Make sure they're set for the correct environment (Production)
   - Check for typos in variable names
   - Ensure values don't have extra spaces

3. **Check Supabase RLS Policies:**
   - The code uses `supabaseAdmin` which bypasses RLS
   - If still having issues, check Supabase logs

4. **Verify Supabase URL Format:**
   - Should be: `https://xxxxx.supabase.co`
   - Should NOT be: `http://localhost:...` or `https://placeholder.supabase.co`

