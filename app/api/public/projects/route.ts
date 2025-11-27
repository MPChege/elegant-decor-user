import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase'; // Use admin client to bypass RLS
import { getPublicMediaUrl } from '@/lib/s3/getPublicUrl';
import type { PublicProject } from '@/lib/public-api';

/**
 * GET /api/public/projects
 * Get all published projects with pagination and filters
 * 
 * Query parameters:
 * - limit (number, default: 50)
 * - offset (number, default: 0)
 * - featured (boolean, optional) - featured=true
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    // Parse query parameters
    const limit = Math.min(parseInt(searchParams.get('limit') || '50', 10), 100); // Max 100
    const offset = Math.max(parseInt(searchParams.get('offset') || '0', 10), 0);
    const featured = searchParams.get('featured') === 'true' ? true : undefined;

    // Query ALL projects from Supabase (temporarily show all for debugging)
    // TODO: Once confirmed working, filter to status='published' only
    console.log('[Projects API] Fetching all projects from database...');
    
    let queryBuilder = supabaseAdmin
      .from('projects')
      .select('*', { count: 'exact' });
    
    if (featured !== undefined) {
      queryBuilder = queryBuilder.eq('featured', featured);
    }
    
    const { data, error, count } = await queryBuilder
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);
    
    console.log('[Projects API] Query result:', {
      count: count || 0,
      dataLength: data?.length || 0,
      error: error?.message || null,
    });
    
    if (data && data.length > 0) {
      console.log('[Projects API] First project:', {
        id: (data[0] as Record<string, unknown>).id,
        title: (data[0] as Record<string, unknown>).title,
        status: (data[0] as Record<string, unknown>).status,
        featured: (data[0] as Record<string, unknown>).featured,
        featured_image: (data[0] as Record<string, unknown>).featured_image,
        images: (data[0] as Record<string, unknown>).images,
      });
    } else {
      console.log('[Projects API] ⚠️ No projects found in database!');
    }

    if (error) {
      throw error;
    }

    const projects = (data || []) as Record<string, unknown>[];
    const total = count || projects.length;

    // Map database format to public API format with full image URLs
    // Admin dashboard uploads project images to 'media' bucket
    // Image keys are stored as strings like "1234567890-abc123-filename.jpg"
    const publicProjects: PublicProject[] = projects.map((project: Record<string, unknown>) => {
      // Convert image keys to full URLs
      // Admin dashboard stores images in 'media' bucket
      const imagesArray = Array.isArray(project.images) ? (project.images as string[]) : [];
      const images = imagesArray
        .filter((img): img is string => Boolean(img && typeof img === 'string'))
        .map((img: string) => getPublicMediaUrl(img, 'media'));

      // featured_image is stored as a key string in the database
      const featuredImageKey = (project.featured_image as string) || null;
      const featuredImage = featuredImageKey
        ? getPublicMediaUrl(featuredImageKey, 'media')
        : images[0] || null;

      return {
        id: project.id as string,
        title: project.title as string,
        slug: (project.slug as string) || (project.id as string), // Use slug if available
        description: (project.description as string) || null,
        short_description: null, // Not in database schema
        client_name: (project.client_name as string) || null,
        location: (project.location as string) || null,
        year: null, // Extract from completion_date if needed
        completion_date: (project.completion_date as string) || null,
        featured_image: featuredImage,
        featured_image_key: featuredImageKey,
        images: images,
        tags: (project.tags as string[]) || [],
        featured: Boolean(project.featured),
        seo_title: (project.seo_title as string) || null,
        seo_description: (project.seo_description as string) || null,
      };
    });

    return NextResponse.json({
      success: true,
      data: publicProjects,
      meta: {
        total,
        limit,
        offset,
      },
    });
  } catch (error) {
    console.error('Error fetching projects:', error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch projects',
      },
      { status: 500 }
    );
  }
}

