import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { getPublicMediaUrl } from '@/lib/s3/getPublicUrl';

// Type for product data from database (may have different schema than expected)
type ProductData = {
  id: string;
  title?: string;
  name?: string;
  slug?: string;
  description?: string | null;
  category?: string;
  subcategory?: string | null;
  price?: number | string | null;
  currency?: string;
  images?: string[];
  featured_image?: string | null;
  tags?: string[];
  featured?: boolean;
  in_stock?: boolean;
  status?: string;
  specifications?: Record<string, unknown> | null;
  seo_title?: string | null;
  seo_description?: string | null;
  created_at: string;
  updated_at: string;
};

/**
 * GET /api/public/products
 * Get all published products with pagination and filters
 * 
 * Query parameters:
 * - limit (number, default: 50)
 * - offset (number, default: 0)
 * - category (string, optional)
 * - featured (boolean, optional) - featured=true
 * - in_stock (boolean, optional) - in_stock=true
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    // Parse query parameters
    const limit = Math.min(parseInt(searchParams.get('limit') || '50', 10), 100); // Max 100
    const offset = Math.max(parseInt(searchParams.get('offset') || '0', 10), 0);
    const category = searchParams.get('category') || undefined;
    const featured = searchParams.get('featured') === 'true' ? true : undefined;
    const inStock = searchParams.get('in_stock') === 'true' ? true : undefined;

    // Build Supabase query
    // Filter by status = 'published' (admin dashboard uses this field)
    let query = supabase
      .from('products')
      .select('*', { count: 'exact' })
      .eq('status', 'published'); // Only show published products

    // Apply filters
    if (category) {
      query = query.eq('category', category);
    }
    if (featured !== undefined) {
      query = query.eq('featured', featured);
    }
    if (inStock !== undefined) {
      query = query.eq('in_stock', inStock);
    }

    // Apply ordering and pagination
    query = query
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    const { data, error, count } = await query;

    if (error) {
      console.error('Supabase query error:', error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      if (errorMessage.includes('supabaseUrl') || errorMessage.includes('required')) {
        console.error('⚠️ Supabase configuration missing. Please create .env.local with NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY');
        return NextResponse.json(
          {
            success: false,
            error: 'Database configuration error. Please check server logs.',
            details: process.env.NODE_ENV === 'development' 
              ? 'Supabase environment variables are not configured. See SUPABASE_SETUP.md for instructions.'
              : undefined,
          },
          { status: 500 }
        );
      }
      throw error;
    }

    const products: ProductData[] = (data || []) as ProductData[];
    const total = count || products.length;

    // Map to public API format with full image URLs
    // Admin dashboard uses 'title' and 'slug' fields
    const publicProducts = products.map((product: ProductData) => {
      // Convert image keys to full URLs
      const images = (product.images || []).map((img: string) => getPublicMediaUrl(img));
      const featuredImage = product.featured_image 
        ? getPublicMediaUrl(product.featured_image)
        : images[0] || null;

      return {
        id: product.id,
        title: product.title || product.name || product.id, // Use title from admin dashboard
        slug: product.slug || product.id, // Use slug if available
        description: product.description || null,
        category: product.category || 'Uncategorized',
        subcategory: product.subcategory || null,
        price: product.price ? Number(product.price) : null,
        currency: product.currency || 'KES',
        featured_image: featuredImage,
        images: images,
        tags: product.tags || [],
        featured: product.featured || false,
        in_stock: product.in_stock !== undefined ? product.in_stock : true,
        specifications: product.specifications as Record<string, unknown> | null || null,
        seo_title: product.seo_title || null,
        seo_description: product.seo_description || null,
        created_at: product.created_at,
        updated_at: product.updated_at,
      };
    });

    return NextResponse.json({
      success: true,
      data: publicProducts,
      meta: {
        total,
        limit,
        offset,
      },
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    
    // Log more details for debugging
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch products',
        details: process.env.NODE_ENV === 'development' 
          ? (error instanceof Error ? error.stack : String(error))
          : undefined,
      },
      { status: 500 }
    );
  }
}

