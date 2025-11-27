import { LuxuryLayout } from '@/components/layout/luxury-layout'
import { WorkPageClient } from '@/components/work/work-page-client'
import { fetchPublicProjects } from '@/lib/public-api'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Projects | Elegant Tiles & Décor',
  description: 'Explore our portfolio of exceptional design projects showcasing our commitment to excellence in luxury interiors.',
}

export default async function WorkPage() {
  // Fetch real projects from Supabase database
  const projects = await fetchPublicProjects()

  return (
    <LuxuryLayout>
      <WorkPageClient projects={projects} />
    </LuxuryLayout>
  )
}
