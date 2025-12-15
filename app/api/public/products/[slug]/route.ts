import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { getPublicMediaUrl } from '@/lib/s3/getPublicUrl';

/**
 * GET /api/public/products/[slug]
 * Get single product by slug
 */
export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await context.params;
    
    // Query product by slug or ID (try both)
    let { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('slug', slug)
      .eq('status', 'published') // Only show published products
      .single();

    // If not found by slug, try by id
    if (error || !data) {
      const result = await supabase
        .from('products')
        .select('*')
        .eq('id', slug)
        .eq('status', 'published')
        .single();
      
      data = result.data;
      error = result.error;
    }

    if (error || !data) {
      return NextResponse.json(
        {
          success: false,
          error: 'Product not found',
        },
        { status: 404 }
      );
    }

    const product = data as Record<string, unknown>;

    // Convert image keys to full URLs
    const imagesArray = Array.isArray(product.images) ? (product.images as string[]) : [];
    const images = imagesArray.map((img: string) => getPublicMediaUrl(img));
    const featuredImage = product.featured_image 
      ? getPublicMediaUrl(product.featured_image as string)
      : images[0] || null;

    // Map to public API format
    const publicProduct = {
      id: product.id as string,
      title: (product.title as string) || (product.name as string) || (product.id as string), // Use title from admin dashboard
      slug: (product.slug as string) || (product.id as string), // Use slug if available
      description: (product.description as string) || null,
      category: (product.category as string) || 'Uncategorized',
      subcategory: (product.subcategory as string) || null,
      price: product.price ? Number(product.price) : null,
      currency: (product.currency as string) || 'KES',
      price_unit: (product.price_unit as 'per_sqm' | 'unit' | null) || null,
      is_imported: product.is_imported !== undefined ? Boolean(product.is_imported) : false,
      featured_image: featuredImage,
      images: images,
      tags: (product.tags as string[]) || [],
      featured: Boolean(product.featured),
      in_stock: product.in_stock !== undefined ? Boolean(product.in_stock) : true,
      specifications: (product.specifications as Record<string, unknown> | null) || null,
      seo_title: (product.seo_title as string) || null,
      seo_description: (product.seo_description as string) || null,
      created_at: product.created_at as string,
      updated_at: product.updated_at as string,
    };

    return NextResponse.json({
      success: true,
      data: publicProduct,
    });
  } catch (error) {
    console.error('Error fetching product:', error);

    const errorMessage = error instanceof Error ? error.message : '';

    if (errorMessage.includes('not found')) {
      return NextResponse.json(
        {
          success: false,
          error: 'Product not found',
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: errorMessage || 'Failed to fetch product',
      },
      { status: 500 }
    );
  }
}

