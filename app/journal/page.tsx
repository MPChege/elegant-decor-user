import { LuxuryLayout } from '@/components/layout/luxury-layout'
import { JournalPageClient } from '@/components/journal/journal-page-client'
import { fetchPublicBlogPosts } from '@/lib/public-api'

export const dynamic = 'force-dynamic'

export default async function JournalPage() {
  const posts = await fetchPublicBlogPosts()

  return (
    <LuxuryLayout>
      <JournalPageClient posts={posts} />
    </LuxuryLayout>
  )
}


