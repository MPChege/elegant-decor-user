import { NextRequest, NextResponse } from 'next/server';
import { productsAPI } from '@elegant/shared/lib/api';

/**
 * GET /api/products/[slug]
 * Get product by slug
 */
export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await context.params;
    const product = await productsAPI.getBySlug(slug);

    return NextResponse.json({
      success: true,
      data: product,
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
