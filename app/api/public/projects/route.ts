import { NextResponse } from 'next/server';
import { projectsAPI } from '@elegant/shared/lib/api';
import type { PublicProject } from '@/lib/public-api';

/**
 * GET /api/public/projects
 * Get all published projects for the user site
 */
export async function GET() {
  try {
    const projects = await projectsAPI.getPublished();

    // Map database format to public API format
    const publicProjects: PublicProject[] = projects.map((project) => ({
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
    }));

    return NextResponse.json({
      success: true,
      data: publicProjects,
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

