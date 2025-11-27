import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase'; // Use admin client to bypass RLS
import { orderSchema } from '@/lib/validators';

/**
 * POST /api/orders
 * Create a new order from the user site
 */
export async function POST(request: NextRequest) {
  try {
    // Check if Supabase is configured
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Server configuration error. Please contact support.' 
        },
        { status: 500 }
      );
    }

    const body = await request.json();

    // Validate request body
    const validatedData = orderSchema.parse(body);

    // Generate order number
    const orderNumber = `ORD-${Date.now()}`;

    // Store orders as inquiries with type 'quote' (for product inquiries/orders)
    const insertData: Record<string, unknown> = {
      name: validatedData.customer_name,
      email: validatedData.customer_email,
      phone: validatedData.customer_phone || null,
      subject: `Order Request: ${validatedData.product_title}`, // Add subject field
      message: `Order Request: ${validatedData.product_title}\nQuantity: ${validatedData.quantity}\nUnit Price: ${validatedData.currency} ${validatedData.unit_price}\nTotal: ${validatedData.currency} ${validatedData.total_price}\nOrder Number: ${orderNumber}\n\n${validatedData.notes || ''}`,
      type: 'quote', // Use quote type for order requests
      status: 'new',
      priority: 'high', // Order requests are high priority
    };
    
    const { data, error } = await supabaseAdmin
      .from('inquiries')
      .insert(insertData as never)
      .select()
      .single();

    if (error || !data) {
      console.error('Supabase error:', error);
      throw error || new Error('Failed to create order');
    }

    const order = {
      id: (data as Record<string, unknown>).id as string,
      order_number: orderNumber,
      customer_name: validatedData.customer_name,
      customer_email: validatedData.customer_email,
      customer_phone: validatedData.customer_phone,
      product_id: validatedData.product_id,
      product_title: validatedData.product_title,
      quantity: validatedData.quantity,
      unit_price: validatedData.unit_price,
      total_price: validatedData.total_price,
      currency: validatedData.currency,
      status: 'pending',
      payment_status: 'unpaid',
      shipping_address: validatedData.shipping_address,
      billing_address: validatedData.billing_address,
      notes: validatedData.notes,
      created_at: (data as Record<string, unknown>).created_at as string,
    };

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

    // Query inquiries with type 'quote' (used for orders) by email
    const { data, error } = await supabaseAdmin
      .from('inquiries')
      .select('*')
      .eq('email', email)
      .eq('type', 'quote')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }

    // Map inquiries to order format
    const orders = (data || []).map((inquiry: Record<string, unknown>) => {
      // Extract order details from message (basic parsing)
      const message = (inquiry.message as string) || '';
      const messageLines = message.split('\n');
      const orderNumberMatch = message.match(/Order Number: (ORD-\d+)/);
      
      return {
        id: inquiry.id as string,
        order_number: orderNumberMatch ? orderNumberMatch[1] : `ORD-${(inquiry.id as string).slice(0, 8)}`,
        customer_name: inquiry.name as string,
        customer_email: inquiry.email as string,
        product_title: messageLines[0]?.replace('Order Request: ', '') || 'Unknown',
        quantity: 1, // Would need to parse from message
        total_price: 0, // Would need to parse from message
        currency: 'KES',
        status: inquiry.status === 'completed' ? 'completed' : inquiry.status === 'in_progress' ? 'processing' : 'pending',
        payment_status: 'unpaid', // Would need separate tracking
        created_at: inquiry.created_at as string,
      };
    });

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
