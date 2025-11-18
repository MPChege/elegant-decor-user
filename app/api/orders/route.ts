import { NextRequest, NextResponse } from 'next/server';
import { ordersAPI } from '@elegant/shared/lib/api';
import { orderSchema } from '@elegant/shared/utils/validators';

/**
 * POST /api/orders
 * Create a new order from the user site
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request body
    const validatedData = orderSchema.parse(body);

    // Create order using shared API
    const order = await ordersAPI.create(validatedData);

    return NextResponse.json(
      {
        success: true,
        data: order,
        message: 'Order created successfully',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating order:', error);

    if (error && typeof error === 'object' && 'name' in error && error.name === 'ZodError') {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation error',
          details: 'errors' in error ? error.errors : [],
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create order',
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/orders?email=customer@email.com
 * Get orders by customer email (for order tracking)
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json(
        {
          success: false,
          error: 'Email parameter is required',
        },
        { status: 400 }
      );
    }

    const orders = await ordersAPI.getByEmail(email);

    return NextResponse.json({
      success: true,
      data: orders,
    });
  } catch (error) {
    console.error('Error fetching orders:', error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch orders',
      },
      { status: 500 }
    );
  }
}
