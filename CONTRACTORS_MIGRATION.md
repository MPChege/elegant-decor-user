# Contractors Migration Guide

## SQL Migration File Created

The contractors migration has been created at:
```
admin-dashboard/supabase/migrations/004_add_contractors.sql
```

## How to Run the Migration

1. **Open Supabase Dashboard**
   - Go to your Supabase project: https://supabase.com/dashboard
   - Navigate to your project: `gqbdjkflempypooplval`

2. **Open SQL Editor**
   - Click on "SQL Editor" in the left sidebar
   - Click "New query"

3. **Run the Migration**
   - Copy the entire contents of `admin-dashboard/supabase/migrations/004_add_contractors.sql`
   - Paste it into the SQL Editor
   - Click "Run" or press `Ctrl+Enter` (Windows) / `Cmd+Enter` (Mac)

4. **Verify the Migration**
   - Go to "Table Editor" in the left sidebar
   - You should now see a new `contractors` table
   - Check the `inquiries` table - it should now have a `contractor_id` column

## What the Migration Does

1. **Creates `contractors` table** with fields:
   - `id` (UUID, primary key)
   - `name` (TEXT, required)
   - `profession` (TEXT, optional)
   - `email` (TEXT, optional)
   - `phone` (TEXT, optional)
   - `image_url` (TEXT, optional)
   - `bio` (TEXT, optional)
   - `specialties` (TEXT[], array of specialties)
   - `active` (BOOLEAN, default true)
   - `created_at` and `updated_at` timestamps

2. **Adds `contractor_id` column to `inquiries` table**
   - Links inquiries to specific contractors
   - Foreign key relationship with `contractors(id)`
   - Set to NULL if contractor is deleted

3. **Creates indexes** for better query performance

4. **Sets up Row Level Security (RLS) policies**:
   - Anyone can view active contractors (for public listing)
   - Only authenticated users (admins) can create/update/delete contractors

## Next Steps

After running the migration, you can:
1. Add contractor management pages in the admin dashboard
2. Create API endpoints for contractors
3. Add contractor listing on the frontend
4. Link inquiries to contractors when users contact them

