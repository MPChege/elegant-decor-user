import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase'; // Use admin client to bypass RLS
import { inquirySchema } from '@/lib/validators';
import { ZodError } from 'zod';
import type { Database } from '@/lib/database.types'

type InquiryInsert = Database['public']['Tables']['inquiries']['Insert']

/**
 * GET /api/inquiries
 * Fetch all inquiries (for admin dashboard)
 * Query params: status, priority, type, limit, offset
 */
export async function GET(request: NextRequest) {
  try {
    // Check if Supabase is configured with production URL
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    if (!supabaseUrl || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      console.error('[Inquiries API GET] ❌ Supabase environment variables are not set!')
      return NextResponse.json(
        { 
          success: false, 
          error: 'Server configuration error. Please contact support.' 
        },
        { status: 500 }
      );
    }

    // Validate production URL
    if (supabaseUrl === 'https://placeholder.supabase.co' || supabaseUrl.includes('localhost') || supabaseUrl.includes('127.0.0.1')) {
      console.error('[Inquiries API GET] ❌ NEXT_PUBLIC_SUPABASE_URL is not a production URL! Current value:', supabaseUrl)
      return NextResponse.json(
        { 
          success: false, 
          error: 'Server configuration error. Please contact support.' 
        },
        { status: 500 }
      );
    }

    if (!supabaseUrl.startsWith('https://') || !supabaseUrl.includes('.supabase.co')) {
      console.error('[Inquiries API GET] ❌ NEXT_PUBLIC_SUPABASE_URL is not a valid Supabase URL:', supabaseUrl)
      return NextResponse.json(
        { 
          success: false, 
          error: 'Server configuration error. Please contact support.' 
        },
        { status: 500 }
      );
    }

    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status');
    const priority = searchParams.get('priority');
    const type = searchParams.get('type');
    const limit = parseInt(searchParams.get('limit') || '50', 10);
    const offset = parseInt(searchParams.get('offset') || '0', 10);

    // Build query
    let query = supabaseAdmin
      .from('inquiries')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    // Apply filters
    if (status) {
      query = query.eq('status', status);
    }
    if (priority) {
      query = query.eq('priority', priority);
    }
    if (type) {
      query = query.eq('type', type);
    }

    const { data, error, count } = await query;

    if (error) {
      console.error('Supabase error fetching inquiries:', error);
      return NextResponse.json(
        {
          success: false,
          error: error.message || 'Failed to fetch inquiries',
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: data || [],
        count: count || 0,
        limit,
        offset,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching inquiries:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch inquiries',
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/inquiries
 * Create a new inquiry from the contact form
 */
export async function POST(request: NextRequest) {
  try {
    // Check if Supabase is configured with production URL
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    if (!supabaseUrl || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      console.error('[Inquiries API POST] ❌ Supabase environment variables are not set!')
      return NextResponse.json(
        { 
          success: false, 
          error: 'Server configuration error. Please contact support.' 
        },
        { status: 500 }
      );
    }

    // Validate production URL
    if (supabaseUrl === 'https://placeholder.supabase.co' || supabaseUrl.includes('localhost') || supabaseUrl.includes('127.0.0.1')) {
      console.error('[Inquiries API POST] ❌ NEXT_PUBLIC_SUPABASE_URL is not a production URL! Current value:', supabaseUrl)
      return NextResponse.json(
        { 
          success: false, 
          error: 'Server configuration error. Please contact support.' 
        },
        { status: 500 }
      );
    }

    if (!supabaseUrl.startsWith('https://') || !supabaseUrl.includes('.supabase.co')) {
      console.error('[Inquiries API POST] ❌ NEXT_PUBLIC_SUPABASE_URL is not a valid Supabase URL:', supabaseUrl)
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
    const validatedData = inquirySchema.parse(body);

    // Determine priority based on type
    const priority = validatedData.type === 'quote' || validatedData.type === 'project' ? 'high' : 'medium';

    // Insert inquiry using admin client (bypasses RLS for public submissions)
    const insertData: InquiryInsert = {
      name: validatedData.name,
      email: validatedData.email,
      phone: validatedData.phone || null,
      subject: validatedData.subject,
      message: validatedData.message,
      type: validatedData.type,
      status: 'new',
      priority: priority,
    };

    const { data, error } = await supabaseAdmin
      .from('inquiries')
      .insert(insertData as never)
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }

    if (!data) {
      throw new Error('Failed to create inquiry - no data returned');
    }

    return NextResponse.json(
      {
        success: true,
        data: {
          ...(data as Record<string, unknown>),
          priority,
        },
        message: 'Your message has been sent successfully. We will get back to you soon!',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating inquiry:', error);

    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation error',
          details: error.errors,
        },
        { status: 400 }
      );
    }

    // Log the full error for debugging
    if (error && typeof error === 'object' && 'message' in error) {
      console.error('Full error details:', JSON.stringify(error, null, 2));
    }

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to send message',
      },
      { status: 500 }
    );
  }
}
