import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// Lazy import to avoid build-time errors
async function getSupabaseClient() {
  const { supabase } = await import('@/lib/supabase');
  return supabase;
}

/**
 * POST /api/newsletter
 * Subscribe to newsletter
 * 
 * Request body:
 * {
 *   "email": "string" // Required, valid email
 * }
 */
const newsletterSchema = z.object({
  email: z.string().email('Please provide a valid email address'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request body
    const validatedData = newsletterSchema.parse(body);
    const { email } = validatedData;

    const supabase = await getSupabaseClient();
    
    // Check if email already exists
    const { data: existing } = await supabase
      .from('newsletter_subscribers')
      .select('id, email, active')
      .eq('email', email.toLowerCase().trim())
      .maybeSingle();

    if (existing) {
      const subscriber = existing as { id: string; email: string; active: boolean };
      // If already subscribed and active, return success message
      if (subscriber.active) {
        return NextResponse.json(
          {
            success: true,
            message: 'You are already subscribed to our newsletter!',
            data: {
              id: subscriber.id,
              email: subscriber.email,
              active: subscriber.active,
            },
          },
          { status: 200 }
        );
      }

      // If exists but inactive, reactivate
      const { data: updated, error: updateError } = await supabase
        .from('newsletter_subscribers')
        .update({ active: true } as never)
        .eq('email', email.toLowerCase().trim())
        .select()
        .single();

      if (updateError) throw updateError;

      return NextResponse.json(
        {
          success: true,
          data: updated,
          message: 'Subscribed successfully',
        },
        { status: 201 }
      );
    }

    // Create new subscription
    const { data: subscriber, error: insertError } = await supabase
      .from('newsletter_subscribers')
      .insert({
        email: email.toLowerCase().trim(),
        active: true,
      } as never)
      .select()
      .single();

    if (insertError) {
      // Handle unique constraint violation
      if (insertError.code === '23505') {
        return NextResponse.json(
          {
            success: true,
            message: 'You are already subscribed to our newsletter!',
          },
          { status: 200 }
        );
      }
      throw insertError;
    }

    return NextResponse.json(
      {
        success: true,
        data: subscriber,
        message: 'Subscribed successfully',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error subscribing to newsletter:', error);

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
        error: error instanceof Error ? error.message : 'Failed to subscribe',
      },
      { status: 500 }
    );
  }
}

