# Vercel Environment Variables Setup

## Required Environment Variables

To fix the issue where projects, journals, and products are not showing on Vercel, you **MUST** set these environment variables in your Vercel project settings:

### 1. Go to Vercel Dashboard
- Navigate to your project
- Go to **Settings** → **Environment Variables**

### 2. Add These Variables

#### Required Variables:
```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
```

#### Optional (but recommended):
```
NEXT_PUBLIC_APP_URL=https://your-vercel-domain.vercel.app
NEXT_PUBLIC_SITE_URL=https://your-vercel-domain.vercel.app
```

### 3. Important Notes:

1. **Use the SAME values as your admin dashboard** - Both projects must point to the same Supabase instance
2. **SUPABASE_SERVICE_ROLE_KEY is critical** - Without it, the API routes will fail due to RLS policies
3. **Redeploy after adding variables** - Vercel requires a new deployment to pick up new environment variables

### 4. How to Get Your Supabase Credentials:

1. Go to your Supabase project dashboard
2. Click on **Settings** → **API**
3. Copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** key → `SUPABASE_SERVICE_ROLE_KEY` (⚠️ Keep this secret!)

### 5. Verify Setup:

After adding the variables and redeploying, check:
- Projects page should show projects from database
- Journal page should show blog posts from database
- Products page should show products from database

If still not working, check Vercel logs for error messages.


