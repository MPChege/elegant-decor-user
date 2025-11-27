import { LuxuryLayout } from '@/components/layout/luxury-layout'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy | Elegant Tiles & Décor',
  description: 'Privacy Policy for Elegant Tiles & Décor Centre Ltd',
}

export default function PrivacyPage() {
  return (
    <LuxuryLayout>
      <div className="container px-6 py-20">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-playfair font-bold mb-8">Privacy Policy</h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-muted-foreground mb-6">
              Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Introduction</h2>
              <p className="text-muted-foreground mb-4">
                Elegant Tiles & Décor Centre Ltd (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) is committed to protecting your privacy. 
                This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you 
                visit our website or use our services.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Information We Collect</h2>
              <p className="text-muted-foreground mb-4">
                We may collect information that you provide directly to us, including:
              </p>
              <ul className="list-disc list-inside text-muted-foreground mb-4 space-y-2">
                <li>Name and contact information (email, phone number, address)</li>
                <li>Project details and requirements</li>
                <li>Payment information (processed securely through third-party providers)</li>
                <li>Any other information you choose to provide</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">How We Use Your Information</h2>
              <p className="text-muted-foreground mb-4">
                We use the information we collect to:
              </p>
              <ul className="list-disc list-inside text-muted-foreground mb-4 space-y-2">
                <li>Provide, maintain, and improve our services</li>
                <li>Process your orders and inquiries</li>
                <li>Communicate with you about your projects</li>
                <li>Send you marketing communications (with your consent)</li>
                <li>Comply with legal obligations</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Data Security</h2>
              <p className="text-muted-foreground mb-4">
                We implement appropriate technical and organizational measures to protect your personal information 
                against unauthorized access, alteration, disclosure, or destruction.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
              <p className="text-muted-foreground mb-4">
                If you have any questions about this Privacy Policy, please contact us at:
              </p>
              <p className="text-muted-foreground">
                <strong>Email:</strong> info@elegantdecor.co.ke<br />
                <strong>Phone:</strong> +254 710 602110<br />
                <strong>Address:</strong> Mageta road, Lavington, Nairobi, Kenya
              </p>
            </section>
          </div>
        </div>
      </div>
    </LuxuryLayout>
  )
}

