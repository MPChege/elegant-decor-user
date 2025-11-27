'use client'

import * as React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Clock, ArrowRight, Search } from 'lucide-react'
import type { PublicBlogPost } from '@/lib/public-api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { getBlogImageUrl } from '@/lib/s3/getPublicUrl'

const heroBackground = '/LEHIGH/RECEPTION%20FINAL_5%20-%20Photo.png'

interface JournalPageClientProps {
  posts: PublicBlogPost[]
}

export function JournalPageClient({ posts }: JournalPageClientProps) {
  const [searchQuery, setSearchQuery] = React.useState('')
  const [selectedCategory, setSelectedCategory] = React.useState('All')

  const categories = React.useMemo(() => {
    const cats = new Set<string>()
    posts.forEach((post) => {
      if (post.category) cats.add(post.category)
    })
    return ['All', ...Array.from(cats)]
  }, [posts])

  const filteredPosts = posts.filter((post) => {
    const text = `${post.title} ${post.excerpt ?? ''}`.toLowerCase()
    const matchesSearch =
      searchQuery === '' || text.includes(searchQuery.toLowerCase())
    const matchesCategory =
      selectedCategory === 'All' ||
      (post.category ?? '').toLowerCase() === selectedCategory.toLowerCase()
    return matchesSearch && matchesCategory
  })

  // Only show featured post if there are multiple posts
  // If there's only one post, show it in the grid instead
  const featuredPost =
    filteredPosts.length > 1
      ? filteredPosts.find((p) => p.tags?.includes('featured')) ?? filteredPosts[0]
      : null

  const otherPosts = featuredPost
    ? filteredPosts.filter((p) => p.id !== featuredPost.id)
    : filteredPosts

  return (
    <>
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <Image
          src={heroBackground}
          alt="Design studio moodboard"
          fill
          priority
          sizes="100vw"
          className="object-cover absolute inset-0 -z-10"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-black/75 via-black/45 to-background/95" />
        <div className="container px-6 text-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h1 className="font-playfair text-5xl md:text-6xl lg:text-7xl font-bold mb-6">
              Design <span className="text-luxury-gradient">Journal</span>
            </h1>
            <p className="text-lg md:text-xl text-white/85 mb-8">
              Insights, trends, and inspiration from our design experts.
            </p>

            {/* Search */}
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary" />
              <Input
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white/85 border-white/60 text-primary placeholder:text-primary/60 focus-visible:ring-primary/40"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Article */}
      {featuredPost && (
        <section className="py-12 bg-muted/30">
          <div className="container px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <Link href={`/journal/${featuredPost.slug}`}>
                <Card className="overflow-hidden hover:shadow-luxury-lg transition-all duration-300 border-luxury">
                  <div className="grid grid-cols-1 lg:grid-cols-2">
                    <div className="aspect-[16/10] lg:aspect-auto relative overflow-hidden bg-muted">
                      <Badge
                        variant="luxury"
                        className="absolute top-4 left-4 z-10"
                      >
                        Featured
                      </Badge>
                      <Image
                        src={getBlogImageUrl(
                          featuredPost.featured_image_key ||
                            featuredPost.featured_image
                        )}
                        alt={featuredPost.title}
                        fill
                        sizes="(min-width: 1024px) 50vw, 100vw"
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-br from-black/20 to-black/40" />
                    </div>
                    <CardContent className="p-8 lg:p-12 flex flex-col justify-center">
                      {featuredPost.category && (
                        <Badge variant="outline" className="w-fit mb-4">
                          {featuredPost.category}
                        </Badge>
                      )}
                      <h2 className="font-playfair text-3xl md:text-4xl font-bold mb-4">
                        {featuredPost.title}
                      </h2>
                      {featuredPost.excerpt && (
                        <p className="text-muted-foreground mb-6">
                          {featuredPost.excerpt}
                        </p>
                      )}
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
                        {featuredPost.published_at && (
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            <span>
                              {new Date(
                                featuredPost.published_at
                              ).toLocaleDateString()}
                            </span>
                          </div>
                        )}
                        {featuredPost.read_time && (
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            <span>{featuredPost.read_time} min read</span>
                          </div>
                        )}
                      </div>
                      <Button
                        variant="luxury"
                        className="inline-flex items-center justify-center px-6 py-3 font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                      >
                        Read Article
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </CardContent>
                  </div>
                </Card>
              </Link>
            </motion.div>
          </div>
        </section>
      )}

      {/* Categories */}
      <section className="py-8 border-y border-border">
        <div className="container px-6">
          <div className="flex items-center gap-4 overflow-x-auto pb-2 hide-scrollbar">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? 'luxury' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className="flex-shrink-0"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="py-20">
        <div className="container px-6">
          {posts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">
                No articles found. Please check back soon.
              </p>
            </div>
          ) : otherPosts.length === 0 && featuredPost ? (
            <p className="text-muted-foreground">
              No additional articles found. Please check back soon.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {otherPosts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  layout
                >
                  <Card className="group h-full hover:shadow-luxury-lg transition-all duration-300 border-luxury">
                    <div className="aspect-[16/10] relative overflow-hidden bg-muted rounded-t-lg">
                      <Image
                        src={getBlogImageUrl(
                          post.featured_image_key || post.featured_image
                        )}
                        alt={post.title}
                        fill
                        sizes="(min-width: 1024px) 33vw, 100vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/40" />
                    </div>
                    <CardContent className="p-6">
                      {post.category && (
                        <Badge variant="outline" className="mb-3">
                          {post.category}
                        </Badge>
                      )}
                      <h3 className="font-playfair text-xl font-semibold mb-2 line-clamp-2">
                        {post.title}
                      </h3>
                      {post.excerpt && (
                        <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                          {post.excerpt}
                        </p>
                      )}
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        {post.published_at && (
                          <span>
                            {new Date(post.published_at).toLocaleDateString()}
                          </span>
                        )}
                        {post.tags && post.tags.length > 0 && (
                          <span>{post.tags.slice(0, 2).join(' • ')}</span>
                        )}
                      </div>
                    </CardContent>
                    <CardFooter className="p-6 pt-0">
                      <Button
                        asChild
                        variant="outline"
                        className="w-full justify-center font-semibold text-primary border-primary/70 bg-white hover:bg-primary hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 focus-visible:ring-offset-2 focus-visible:ring-offset-background transition-colors"
                      >
                        <Link href={`/journal/${post.slug}`}>
                          Read More
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}


