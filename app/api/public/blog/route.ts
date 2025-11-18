import { NextResponse } from 'next/server';
import { blogAPI } from '@elegant/shared/lib/api';
import type { PublicBlogPost } from '@/lib/public-api';

/**
 * GET /api/public/blog
 * Get all published blog posts for the user site
 */
export async function GET() {
  try {
    const posts = await blogAPI.getPublished();

    // Map database format to public API format
    const publicPosts: PublicBlogPost[] = posts.map((post) => ({
      id: post.id,
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: post.content,
      featured_image: post.featured_image,
      featured_image_key: post.featured_image, // Use featured_image as key if it's a path
      images: [], // Blog posts don't have images array in DB, but we can extend this later
      tags: post.tags || [],
      category: post.category || null,
      published: post.published,
      published_at: post.published_at || post.publish_date || null,
      read_time: post.read_time,
      seo_title: post.seo_title,
      seo_description: post.seo_description,
    }));

    return NextResponse.json({
      success: true,
      data: publicPosts,
    });
  } catch (error) {
    console.error('Error fetching blog posts:', error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch blog posts',
      },
      { status: 500 }
    );
  }
}

