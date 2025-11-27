import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { StickyCTABar } from '@/components/mobile/sticky-cta-bar'
import { LoadingScreen } from '@/components/loading-screen'
import { ScrollToTop } from '@/components/scroll-to-top'
import { ScrollProgress } from '@/components/scroll-progress'
import { Toaster } from '@/components/ui/toaster'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://eleganttiles.co.ke'),
  title: 'Elegant Tiles & Décor Centre Ltd - Luxury Interior Design',
  description:
    'Award-winning interior design and décor company specializing in luxury tiles, custom interiors, and premium design projects.',
  keywords:
    'interior design, luxury tiles, décor, custom design, elegant interiors, Kenya',
  authors: [{ name: 'Elegant Tiles & Décor Centre Ltd' }],
  icons: {
    icon: '/etd_logo-removebg-preview.png',
    apple: '/etd_logo-removebg-preview.png',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://eleganttiles.co.ke',
    siteName: 'Elegant Tiles & Décor Centre',
    title: 'Elegant Tiles & Décor Centre Ltd - Luxury Interior Design',
    description:
      'Award-winning interior design and décor company specializing in luxury tiles and custom design projects.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Elegant Tiles & Décor Centre',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Elegant Tiles & Décor Centre Ltd',
    description: 'Award-winning luxury interior design and décor',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning className="light">
      <head>
        <link rel="icon" href="/etd_logo-removebg-preview.png" type="image/png" sizes="any" />
        <link rel="apple-touch-icon" href="/etd_logo-removebg-preview.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#ffffff" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5, viewport-fit=cover" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://gqbdjkflempypooplval.supabase.co" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                // Force light mode on initial load
                document.documentElement.classList.remove('dark');
                document.documentElement.classList.add('light');
                // Set theme in localStorage if not already set
                if (!localStorage.getItem('theme')) {
                  localStorage.setItem('theme', 'light');
                }
              })();
            `,
          }}
        />
      </head>
      <body
        className={`${inter.variable} ${playfair.variable} font-inter antialiased smooth-scroll`}
      >
        <LoadingScreen />
        <ScrollProgress />
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-1 pt-[57px] md:pt-[61px]">{children}</main>
          <Footer />
          <StickyCTABar />
          <ScrollToTop />
          <Toaster />
        </div>
      </body>
    </html>
  )
}

