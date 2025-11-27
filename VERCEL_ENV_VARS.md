# Vercel Environment Variables

## Required Environment Variables

Add these to your Vercel project settings (Settings → Environment Variables):

### Supabase Configuration (REQUIRED)

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

**Where to find these:**
1. Go to your Supabase project dashboard
2. Settings → API
3. Copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** key → `SUPABASE_SERVICE_ROLE_KEY` (keep this secret!)

### Optional Environment Variables

```
NEXT_PUBLIC_SITE_URL=https://elegant-decor-tiles.vercel.app
NEXT_PUBLIC_APP_URL=https://elegant-decor-tiles.vercel.app
```

**Note:** These are optional. If not set, the app will use relative URLs which work automatically.

## Important Notes

1. **Use the SAME Supabase credentials** as your admin dashboard
2. **Never commit** `SUPABASE_SERVICE_ROLE_KEY` to git
3. **Set these for all environments** (Production, Preview, Development) in Vercel
4. **Redeploy** after adding environment variables

## Verification

After setting environment variables:
1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Verify all variables are set
3. Redeploy the project
4. Check Vercel Function Logs to see if Supabase connection is working

