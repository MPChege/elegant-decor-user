import { NextRequest, NextResponse } from 'next/server';
import { projectsAPI } from '@elegant/shared/lib/api';
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
    const project = await projectsAPI.getBySlug(slug);

    // Map database format to public API format
    const publicProject: PublicProject = {
      id: project.id,
      title: project.title,
      slug: project.slug,
      description: project.description,
      client_name: project.client_name || null,
      location: project.location || null,
      year: project.year || null,
      featured_image: project.featured_image,
      featured_image_key: project.featured_image, // Use featured_image as key if it's a path
      images: project.images || [],
      tags: project.tags || [],
      seo_title: null, // Projects table doesn't have seo_title field
      seo_description: null, // Projects table doesn't have seo_description field
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

