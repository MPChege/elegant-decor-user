import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase'; // Use admin client to bypass RLS
import { getPublicMediaUrl } from '@/lib/s3/getPublicUrl';
import type { PublicProject } from '@/lib/public-api';

/**
 * GET /api/public/projects/[slug]
 * Get a single published project by slug
 */
export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await context.params;
    
    // Query project by slug first, then by id
    // Try with status filter first, then without if not found
    let project: Record<string, unknown> | null = null;

    // Try published first
    const publishedResult: { data: Record<string, unknown> | null; error: unknown } = await supabaseAdmin
      .from('projects')
      .select('*')
      .eq('slug', slug)
      .eq('status', 'published')
      .single() as { data: Record<string, unknown> | null; error: unknown };

    if (publishedResult.data && !publishedResult.error) {
      project = publishedResult.data;
    } else {
      // Try without status filter
      const allResult: { data: Record<string, unknown> | null; error: unknown } = await supabaseAdmin
        .from('projects')
        .select('*')
        .eq('slug', slug)
        .single() as { data: Record<string, unknown> | null; error: unknown };

      if (!allResult.error && allResult.data) {
        project = allResult.data;
      } else {
        // Try by id
        const idResult: { data: Record<string, unknown> | null; error: unknown } = await supabaseAdmin
          .from('projects')
          .select('*')
          .eq('id', slug)
          .single() as { data: Record<string, unknown> | null; error: unknown };

        if (!idResult.error && idResult.data) {
          project = idResult.data;
        }
      }
    }

    if (!project) {
      return NextResponse.json(
        {
          success: false,
          error: 'Project not found',
        },
        { status: 404 }
      );
    }

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

    // Map database format to public API format
    const publicProject: PublicProject = {
      id: project.id as string,
      title: project.title as string,
      slug: (project.slug as string) || (project.id as string),
      description: (project.description as string) || null,
      short_description: null,
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

    return NextResponse.json({
      success: true,
      data: publicProject,
    });
  } catch (error) {
    console.error('Error fetching project:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch project',
      },
      { status: 500 }
    );
  }
}
