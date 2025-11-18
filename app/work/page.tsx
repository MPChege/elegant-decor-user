import { WorkPageClient } from '@/components/work/work-page-client'
import { fetchPublicProjects } from '@/lib/public-api'

export const dynamic = 'force-dynamic'

export default async function WorkPage() {
  const projects = await fetchPublicProjects()
  return <WorkPageClient projects={projects} />
}


