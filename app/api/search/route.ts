import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { getPublicMediaUrl } from '@/lib/s3/getPublicUrl';

interface SearchResult {
  id: string;
  title: string;
  description: string | null;
  type: 'product' | 'project' | 'article' | 'page';
  url: string;
  image?: string | null;
}

/**
 * GET /api/search?q=query
 * Search across products, projects, blog posts, and services
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q') || '';
    const limit = Math.min(parseInt(searchParams.get('limit') || '20', 10), 50);

    if (!query.trim()) {
      return NextResponse.json({
        success: true,
        data: [],
        total: 0,
      });
    }

    const searchTerm = query.toLowerCase().trim();
    const results: SearchResult[] = [];

    // Validate Supabase config
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (!supabaseUrl || supabaseUrl === 'https://placeholder.supabase.co' || supabaseUrl.includes('localhost')) {
      console.error('[Search API] ❌ NEXT_PUBLIC_SUPABASE_URL is not configured properly!');
      return NextResponse.json({
        success: false,
        error: 'Server configuration error',
        data: [],
      }, { status: 500 });
    }

    // Search Products
    try {
      const { data: products, error: productsError } = await supabaseAdmin
        .from('products')
        .select('id, title, name, description, slug, featured_image, images')
        .or(`title.ilike.%${searchTerm}%,name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,category.ilike.%${searchTerm}%`)
        .limit(limit);

      if (!productsError && products) {
        products.forEach((product: Record<string, unknown>) => {
          const title = (product.title as string) || (product.name as string) || '';
          const slug = (product.slug as string) || (product.id as string);
          const description = (product.description as string) || null;
          const featuredImage = product.featured_image as string | null;
          const images = (product.images as string[]) || [];
          const image = featuredImage || images[0] || null;

          results.push({
            id: product.id as string,
            title,
            description,
            type: 'product',
            url: `/products/${slug}`,
            image: image ? getPublicMediaUrl(image) : null,
          });
        });
      }
    } catch (error) {
      console.error('[Search API] Error searching products:', error);
    }

    // Search Projects
    try {
      const { data: projects, error: projectsError } = await supabaseAdmin
        .from('projects')
        .select('id, title, description, slug, featured_image, images, location')
        .or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,category.ilike.%${searchTerm}%,location.ilike.%${searchTerm}%`)
        .limit(limit);

      if (!projectsError && projects) {
        projects.forEach((project: Record<string, unknown>) => {
          const title = project.title as string;
          const slug = (project.slug as string) || (project.id as string);
          const description = (project.description as string) || null;
          const featuredImage = project.featured_image as string | null;
          const images = (project.images as string[]) || [];
          const image = featuredImage || images[0] || null;

          results.push({
            id: project.id as string,
            title,
            description,
            type: 'project',
            url: `/work/${slug}`,
            image: image ? getPublicMediaUrl(image, 'media') : null,
          });
        });
      }
    } catch (error) {
      console.error('[Search API] Error searching projects:', error);
    }

    // Search Blog Posts (Journal)
    try {
      const { data: blogPosts, error: blogError } = await supabaseAdmin
        .from('blog_posts')
        .select('id, title, excerpt, content, slug, featured_image, featured_image_key')
        .or(`title.ilike.%${searchTerm}%,excerpt.ilike.%${searchTerm}%,content.ilike.%${searchTerm}%`)
        .limit(limit);

      if (!blogError && blogPosts) {
        blogPosts.forEach((post: Record<string, unknown>) => {
          const title = post.title as string;
          const slug = post.slug as string;
          const excerpt = (post.excerpt as string) || null;
          const content = (post.content as string) || '';
          const description = excerpt || content.substring(0, 150) || null;
          const featuredImage = (post.featured_image_key as string) || (post.featured_image as string) || null;

          results.push({
            id: post.id as string,
            title,
            description,
            type: 'article',
            url: `/journal/${slug}`,
            image: featuredImage ? getPublicMediaUrl(featuredImage, 'media') : null,
          });
        });
      }
    } catch (error) {
      console.error('[Search API] Error searching blog posts:', error);
    }

    // Add static pages (Services, About, Contact, etc.)
    const staticPages = [
      {
        id: 'services',
        title: 'Services',
        description: 'Interior Design, Construction, Renovations, Landscaping, and more',
        type: 'page' as const,
        url: '/services',
      },
      {
        id: 'about',
        title: 'About Us',
        description: 'Learn about Elegant Tiles & Décor Centre Ltd',
        type: 'page' as const,
        url: '/about',
      },
      {
        id: 'contact',
        title: 'Contact Us',
        description: 'Get in touch with our team',
        type: 'page' as const,
        url: '/contact',
      },
      {
        id: 'products',
        title: 'Products',
        description: 'Browse our collection of premium tiles and materials',
        type: 'page' as const,
        url: '/products',
      },
      {
        id: 'work',
        title: 'Projects',
        description: 'View our portfolio of completed projects',
        type: 'page' as const,
        url: '/work',
      },
      {
        id: 'journal',
        title: 'Journal',
        description: 'Design inspiration, trends, and insights',
        type: 'page' as const,
        url: '/journal',
      },
    ];

    // Filter static pages by search term
    const matchingPages = staticPages.filter(
      (page) =>
        page.title.toLowerCase().includes(searchTerm) ||
        page.description.toLowerCase().includes(searchTerm)
    );

    results.push(...matchingPages);

    // Sort results by relevance (exact title matches first, then partial matches)
    const sortedResults = results.sort((a, b) => {
      const aTitleMatch = a.title.toLowerCase().startsWith(searchTerm);
      const bTitleMatch = b.title.toLowerCase().startsWith(searchTerm);
      
      if (aTitleMatch && !bTitleMatch) return -1;
      if (!aTitleMatch && bTitleMatch) return 1;
      
      return a.title.localeCompare(b.title);
    });

    // Limit total results
    const limitedResults = sortedResults.slice(0, limit);

    return NextResponse.json({
      success: true,
      data: limitedResults,
      total: limitedResults.length,
      query: searchTerm,
    });
  } catch (error) {
    console.error('[Search API] Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to search',
        data: [],
      },
      { status: 500 }
    );
  }
}

