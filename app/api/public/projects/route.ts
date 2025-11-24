import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
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

    // Query published projects from Supabase
    // Use status = 'published' (admin dashboard uses this field)
    let queryBuilder = supabase
      .from('projects')
      .select('*', { count: 'exact' })
      .eq('status', 'published');

    if (featured !== undefined) {
      queryBuilder = queryBuilder.eq('featured', featured);
    }

    const { data, error, count } = await queryBuilder
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      throw error;
    }

    const projects = (data || []) as Record<string, unknown>[];
    const total = count || projects.length;

    // Map database format to public API format with full image URLs
    const publicProjects: PublicProject[] = projects.map((project: Record<string, unknown>) => {
      // Convert image keys to full URLs
      const imagesArray = Array.isArray(project.images) ? (project.images as string[]) : [];
      const images = imagesArray.map((img: string) => getPublicMediaUrl(img));
      const featuredImage = images[0] || null;

      return {
        id: project.id as string,
        title: project.title as string,
        slug: project.id as string, // Use ID as slug if no slug field exists
        description: (project.description as string) || null,
        short_description: null, // Not in database schema
        client_name: (project.client_name as string) || (project.client as string) || null,
        location: (project.location as string) || null,
        year: (project.year as number) || null,
        completion_date: (project.completion_date as string) || null,
        featured_image: featuredImage,
        featured_image_key: images[0] || null,
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

