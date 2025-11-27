import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { LuxuryLayout } from '@/components/layout/luxury-layout'

export default function NotFound() {
  return (
    <LuxuryLayout>
      <div className="min-h-[60vh] flex items-center justify-center px-6">
        <div className="text-center">
          <h1 className="font-playfair text-6xl md:text-8xl font-bold mb-4">404</h1>
          <h2 className="text-2xl md:text-3xl font-semibold mb-4">Page Not Found</h2>
          <p className="text-muted-foreground mb-8">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
          <Button asChild variant="luxury">
            <Link href="/">Return Home</Link>
          </Button>
        </div>
      </div>
    </LuxuryLayout>
  )
}
