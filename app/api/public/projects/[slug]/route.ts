import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
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
    
    // Query project by ID (slug is actually the project ID)
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', slug)
      .single();

    if (error || !data) {
      return NextResponse.json(
        {
          success: false,
          error: 'Project not found',
        },
        { status: 404 }
      );
    }

    const project = data as Record<string, unknown>;

    // Convert image keys to full URLs
    const imagesArray = Array.isArray(project.images) ? (project.images as string[]) : [];
    const images = imagesArray.map((img: string) => getPublicMediaUrl(img));
    const featuredImage = images[0] || null;

    // Map database format to public API format with full image URLs
    const publicProject: PublicProject = {
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

    return NextResponse.json({
      success: true,
      data: publicProject,
    });
  } catch (error) {
    console.error('Error fetching project:', error);

    const errorMessage = error instanceof Error ? error.message : '';

    if (errorMessage.includes('not found') || errorMessage.includes('No rows')) {
      return NextResponse.json(
        {
          success: false,
          error: 'Project not found',
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: errorMessage || 'Failed to fetch project',
      },
      { status: 500 }
    );
  }
}

