# Supabase Configuration Guide

## ✅ Configuration Complete

All API routes have been created and configured to connect to Supabase.

---

## 🔧 Environment Variables

Create a `.env.local` file in the root of `elegant-tiles-decor-user` with the following:

```env
# Supabase Configuration
# Project: elegant-tiles-admin (gqbdjkflempypooplval)

NEXT_PUBLIC_SUPABASE_URL=https://gqbdjkflempypooplval.supabase.co

# Legacy anon key (compatible with @supabase/ssr@0.7.0)
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdxYmRqa2ZsZW1weXBvb3BsdmFsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIxNTMzODQsImV4cCI6MjA3NzcyOTM4NH0.f3wGzFqVnR78dLho5BCxwg09-nZdtwOKZDU_-L74-8Y

# Service Role Key (get from Supabase Dashboard → Settings → API)
# Only needed if RLS blocks inserts, or for admin operations
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3001
# For production, use your actual domain:
# NEXT_PUBLIC_APP_URL=https://your-domain.com

# Optional: AI Features (for future use)
# OPENAI_API_KEY=sk-your-openai-key
```

---

## 📡 API Routes Created

### ✅ Public Blog API
- **GET** `/api/public/blog` - List all published blog posts
- **GET** `/api/public/blog/[slug]` - Get single blog post by slug

### ✅ Public Projects API
- **GET** `/api/public/projects` - List all published projects
- **GET** `/api/public/projects/[slug]` - Get single project by slug

### ✅ Existing API Routes (Already Working)
- **GET** `/api/products` - List all published products
- **GET** `/api/products/[slug]` - Get single product by slug
- **POST** `/api/orders` - Create new order
- **GET** `/api/orders?email=...` - Get orders by email
- **POST** `/api/inquiries` - Create new inquiry

---

## 🗄️ Database Tables Used

All routes connect to Supabase tables via the shared API layer (`@elegant/shared/lib/api`):

1. **`products`** - Product catalog
2. **`orders`** - Customer orders
3. **`inquiries`** - Contact form submissions
4. **`blog_posts`** - Blog/journal articles
5. **`projects`** - Portfolio projects

---

## 🔗 Shared API Layer

The shared API layer (`../shared/lib/api.ts`) provides:

- `productsAPI.getPublished()` - Get published products
- `productsAPI.getBySlug()` - Get product by slug
- `ordersAPI.create()` - Create order
- `ordersAPI.getByEmail()` - Get orders by email
- `inquiriesAPI.create()` - Create inquiry
- `blogAPI.getPublished()` - Get published blog posts ✨ **NEW**
- `blogAPI.getBySlug()` - Get blog post by slug ✨ **NEW**
- `projectsAPI.getPublished()` - Get published projects ✨ **NEW**
- `projectsAPI.getBySlug()` - Get project by slug ✨ **NEW**

---

## 🖼️ S3 Media Storage

Images are served from Supabase Storage:

- **Base URL**: `https://gqbdjkflempypooplval.storage.supabase.co/storage/v1/object/public/media`
- **Helper Function**: `lib/s3/getPublicUrl.ts`
- **Usage**: `getPublicMediaUrl(imageKey)` returns full URL

---

## 🧪 Testing the Connection

### 1. Start Development Server

```bash
cd elegant-tiles-decor-user
npm run dev
```

### 2. Test Blog API

```bash
# List all blog posts
curl http://localhost:3001/api/public/blog

# Get single post
curl http://localhost:3001/api/public/blog/your-post-slug
```

### 3. Test Projects API

```bash
# List all projects
curl http://localhost:3001/api/public/projects

# Get single project
curl http://localhost:3001/api/public/projects/your-project-slug
```

### 4. Test in Browser

- Visit `/journal` - Should load blog posts from Supabase
- Visit `/journal/[slug]` - Should load single blog post
- Visit `/work` - Should load projects from Supabase
- Visit `/work/[slug]` - Should load single project

---

## ⚠️ Important Notes

### Row Level Security (RLS)

If you encounter permission errors:

1. Check Supabase Dashboard → Authentication → Policies
2. Ensure public read access is enabled for:
   - `blog_posts` (where `status = 'published'` and `published = true`)
   - `projects` (where `status = 'published'`)
   - `products` (where `status = 'published'` and `in_stock = true`)

3. For inserts (orders, inquiries), you may need:
   - Public insert policies, OR
   - Use `SUPABASE_SERVICE_ROLE_KEY` in the API routes

### Missing Fields

- **Projects table** doesn't have `seo_title` or `seo_description` fields
  - These are set to `null` in the API response
  - Metadata uses `title` and `description` instead

- **Blog posts** don't have an `images` array field
  - Currently set to empty array `[]`
  - Can be extended later to fetch from `media` table

---

## 🚀 Next Steps

1. ✅ Add `.env.local` with Supabase credentials
2. ✅ Restart dev server: `npm run dev`
3. ✅ Test API routes in browser
4. ✅ Verify data appears on `/journal` and `/work` pages
5. ⏳ Add blog posts and projects via Admin Dashboard
6. ⏳ Configure RLS policies if needed
7. ⏳ Test image loading from S3 storage

---

## 📚 Related Files

- **Shared API**: `/shared/lib/api.ts`
- **Supabase Client**: `/shared/lib/supabaseClient.ts`
- **Public API Client**: `/lib/public-api.ts`
- **S3 Helper**: `/lib/s3/getPublicUrl.ts`
- **API Routes**: `/app/api/public/`

---

**Status**: ✅ All API routes created and configured  
**Build**: ✅ Passing  
**Ready**: ✅ Yes - Just add `.env.local` and restart server

