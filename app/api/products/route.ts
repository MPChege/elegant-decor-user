import { NextResponse } from 'next/server';
import { productsAPI } from '@elegant/shared/lib/api';

/**
 * GET /api/products
 * Get all published products for the user site
 */
export async function GET() {
  try {
    const products = await productsAPI.getPublished();

    return NextResponse.json({
      success: true,
      data: products,
    });
  } catch (error) {
    console.error('Error fetching products:', error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch products',
      },
      { status: 500 }
    );
  }
}
