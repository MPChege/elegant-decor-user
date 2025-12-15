/**
 * Structured Data (JSON-LD) for SEO
 * Helps Google understand your business information
 */

export function StructuredData() {
  const businessData = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Elegant Tiles & Décor Centre Ltd",
    "image": "https://www.elegantdecor.co.ke/etd_logo-removebg-preview.png",
    "@id": "https://www.elegantdecor.co.ke",
    "url": "https://www.elegantdecor.co.ke",
    "description": "Interior design and décor company specializing in luxury tiles, custom interiors, and premium design projects in Kenya.",
    "telephone": "+254-XXX-XXX-XXX", // TODO: Update with actual phone number
    "priceRange": "$$",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Your Street Address", // TODO: Update with actual address
      "addressLocality": "Nairobi",
      "addressRegion": "Nairobi",
      "postalCode": "00100",
      "addressCountry": "KE"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": -1.2921, // TODO: Update with actual coordinates
      "longitude": 36.8219
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday"
      ],
      "opens": "09:00",
      "closes": "17:00"
    },
    "sameAs": [
      // TODO: Add your social media profiles
      // "https://www.facebook.com/yourpage",
      // "https://www.instagram.com/yourpage",
      // "https://www.linkedin.com/company/yourcompany"
    ],
    "areaServed": {
      "@type": "Country",
      "name": "Kenya"
    },
    "serviceType": [
      "Interior Design",
      "Architectural Drawings",
      "Construction",
      "Renovations",
      "Landscaping",
      "3D Rendering"
    ]
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(businessData) }}
    />
  )
}

