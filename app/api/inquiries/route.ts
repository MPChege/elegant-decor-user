import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { inquirySchema } from '@/lib/validators';
import { ZodError } from 'zod';
import type { Database } from '@/lib/database.types';

type InquiryInsert = Database['public']['Tables']['inquiries']['Insert'];

/**
 * POST /api/inquiries
 * Create a new inquiry from the contact form
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request body
    const validatedData = inquirySchema.parse(body);

    // Determine priority based on type
    const priority = validatedData.type === 'quote' || validatedData.type === 'project' ? 'high' : 'medium';

    // Insert inquiry directly into Supabase
    // Phone can be null, but database expects string | null
    const insertData: InquiryInsert = {
      name: validatedData.name,
      email: validatedData.email,
      phone: validatedData.phone || null, // Use null instead of empty string
      message: `${validatedData.subject || ''}\n\n${validatedData.message}`, // Combine subject and message
      type: validatedData.type,
      status: 'new',
    };
    
    const { data, error } = await supabase
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
