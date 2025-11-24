import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { getPublicMediaUrl } from '@/lib/s3/getPublicUrl';

// Shape returned to the frontend (kept compatible with existing UI expectations)
type PublicService = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  category: string | null;
  icon: string | null;
  featured_image: string | null;
  images: string[];
  featured: boolean;
  created_at: string;
  updated_at: string;
};

/**
 * GET /api/public/services
 * Get all published services with pagination and filters
 *
 * Query parameters:
 * - limit (number, default: 50)
 * - offset (number, default: 0)
 * - category (string, optional)
 * - featured (boolean, optional) - featured=true
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    const limit = Math.min(parseInt(searchParams.get('limit') || '50', 10), 100);
    const offset = Math.max(parseInt(searchParams.get('offset') || '0', 10), 0);
    const category = searchParams.get('category') || undefined;
    const featured = searchParams.get('featured') === 'true' ? true : undefined;

    // Build Supabase query against the shared `services` table
    let queryBuilder = supabase
      .from('services')
      .select('*', { count: 'exact' })
      .eq('status', 'published')
      .order('created_at', { ascending: false });

    if (category) {
      queryBuilder = queryBuilder.eq('category', category);
    }

    if (featured !== undefined) {
      queryBuilder = queryBuilder.eq('featured', featured);
    }

    const { data, error, count } = await queryBuilder
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('Supabase services query error:', error);
      return NextResponse.json(
        {
          success: false,
          error: error.message || 'Failed to fetch services',
        },
        { status: 500 }
      );
    }

    const services: PublicService[] = (data || []).map((service: Record<string, unknown>) => {
      const imagesArray = Array.isArray(service.images) ? (service.images as string[]) : [];
      const images = imagesArray.map((img: string) =>
        getPublicMediaUrl(img)
      );
      const featuredImage =
        service.featured_image
          ? getPublicMediaUrl(service.featured_image as string)
          : images[0] || null;

      return {
        id: service.id as string,
        title: service.title as string,
        slug: service.slug as string,
        description: (service.description as string) ?? null,
        category: (service.category as string) ?? null,
        icon: (service.icon as string) ?? null,
        featured_image: featuredImage,
        images,
        featured: Boolean(service.featured),
        created_at: service.created_at as string,
        updated_at: service.updated_at as string,
      };
    });

    return NextResponse.json({
      success: true,
      data: services,
      meta: {
        total: count ?? services.length,
        limit,
        offset,
      },
    });
  } catch (error) {
    console.error('Error fetching services:', error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch services',
      },
      { status: 500 }
    );
  }
}


