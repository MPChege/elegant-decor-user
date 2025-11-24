import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

/**
 * GET /api/products/[slug]
 * Get product by slug (ID)
 */
export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await context.params;
    
    // Query product by ID
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', slug)
      .single();

    if (error || !data) {
      return NextResponse.json(
        {
          success: false,
          error: 'Product not found',
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: data,
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
