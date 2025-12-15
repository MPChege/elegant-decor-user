'use client'

import * as React from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Sparkles,
  Quote,
  User,
  Mail,
  Phone,
  MapPin,
  Package,
  DollarSign,
  MessageSquare,
  CheckCircle2,
  ArrowRight,
  Star,
  Zap,
  Heart,
  TrendingUp,
} from 'lucide-react'
import { LuxuryLayout } from '@/components/layout/luxury-layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'

const floatingIcons = [
  { icon: Star, delay: 0, duration: 3 },
  { icon: Sparkles, delay: 0.5, duration: 4 },
  { icon: Heart, delay: 1, duration: 3.5 },
  { icon: Zap, delay: 1.5, duration: 4.5 },
  { icon: TrendingUp, delay: 2, duration: 3.8 },
]

const projectTypes = [
  { id: 'residential', label: 'Residential', icon: '🏠' },
  { id: 'commercial', label: 'Commercial', icon: '🏢' },
  { id: 'hospitality', label: 'Hospitality', icon: '🏨' },
  { id: 'office', label: 'Office Space', icon: '💼' },
  { id: 'renovation', label: 'Renovation', icon: '🔨' },
]

const budgetRanges = [
  { id: 'under-500k', label: 'Under KSh 500K', value: 'under-500k' },
  { id: '500k-1m', label: 'KSh 500K - 1M', value: '500k-1m' },
  { id: '1m-3m', label: 'KSh 1M - 3M', value: '1m-3m' },
  { id: '3m-5m', label: 'KSh 3M - 5M', value: '3m-5m' },
  { id: 'over-5m', label: 'Over KSh 5M', value: 'over-5m' },
]

function QuotePageContent() {
  const { toast } = useToast()
  const searchParams = useSearchParams()
  const [currentStep, setCurrentStep] = React.useState(1)
  
  // Get product info from URL params if coming from product page
  const productName = searchParams.get('product')
  const productCategory = searchParams.get('category')
  const productPrice = searchParams.get('price')
  
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    projectType: '',
    budget: '',
    productInterest: productName || '',
    quantity: '',
    message: productName 
      ? `I'm interested in getting a quote for: ${productName}${productCategory ? ` (${productCategory})` : ''}${productPrice ? ` - KSh ${parseInt(productPrice).toLocaleString()}` : ''}`
      : '',
  })
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [isSuccess, setIsSuccess] = React.useState(false)
  
  // Auto-advance to step 2 if product info is pre-filled
  React.useEffect(() => {
    if (productName && currentStep === 1) {
      // Small delay to let user see step 1 first
      const timer = setTimeout(() => {
        if (formData.name && formData.email && formData.phone) {
          setCurrentStep(2)
        }
      }, 100)
      return () => clearTimeout(timer)
    }
  }, [productName, currentStep, formData.name, formData.email, formData.phone])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSelect = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value })
  }

  const canProceed = () => {
    if (currentStep === 1) {
      return formData.name && formData.email && formData.phone
    }
    if (currentStep === 2) {
      return formData.projectType && formData.budget
    }
    return true
  }

  const nextStep = () => {
    if (canProceed()) {
      setCurrentStep((prev) => Math.min(prev + 1, 3))
    }
  }

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/inquiries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          subject: `Quote Request - ${formData.productInterest || formData.projectType}`,
          message: `Project Type: ${formData.projectType}\nBudget: ${formData.budget}\nProduct Interest: ${formData.productInterest}\nQuantity: ${formData.quantity}\nAddress: ${formData.address}\n\nMessage: ${formData.message}`,
          type: 'quote', // Use 'quote' type for quote requests
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to submit quote request')
      }

      setIsSuccess(true)
      toast({
        title: 'Quote Request Sent! 🎉',
        description: 'We&apos;ll contact you within 24 hours with a personalized quote.',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to submit request',
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSuccess) {
    return (
      <LuxuryLayout>
        <div className="min-h-screen flex items-center justify-center py-20 px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-2xl w-full text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="w-24 h-24 mx-auto mb-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center"
            >
              <CheckCircle2 className="h-12 w-12 text-white" />
            </motion.div>
            <h1 className="font-playfair text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Request Received!
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Thank you for your interest. Our team will contact you within 24 hours with a
              personalized quote tailored to your needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="luxury" size="lg" asChild>
                <Link href="/products">Browse Products</Link>
              </Button>
              <Button variant="outline" size="lg" onClick={() => window.location.reload()}>
                Submit Another Request
              </Button>
            </div>
          </motion.div>
        </div>
      </LuxuryLayout>
    )
  }

  return (
    <LuxuryLayout>
      {/* Floating Background Icons */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        {floatingIcons.map((item, index) => {
          const getRandomPosition = () => {
            if (typeof window === 'undefined') return { x: 0, y: 0 }
            return {
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
            }
          }
          const initialPos = getRandomPosition()
          return (
            <motion.div
              key={index}
              className="absolute"
              initial={{
                x: initialPos.x,
                y: initialPos.y,
                opacity: 0.1,
              }}
              animate={{
                y: [null, typeof window !== 'undefined' ? Math.random() * window.innerHeight : initialPos.y],
                x: [null, typeof window !== 'undefined' ? Math.random() * window.innerWidth : initialPos.x],
                rotate: [0, 360],
                opacity: [0.1, 0.2, 0.1],
              }}
              transition={{
                duration: item.duration,
                delay: item.delay,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              <item.icon className="h-8 w-8 text-primary/20" />
            </motion.div>
          )
        })}
      </div>

      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
        <div className="container px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="inline-block mb-6"
            >
              <Badge variant="luxury" className="text-lg px-6 py-2">
                <Quote className="h-4 w-4 mr-2" />
                Get Your Custom Quote
              </Badge>
            </motion.div>
            <h1 className="font-playfair text-5xl md:text-6xl lg:text-7xl font-bold mb-6">
              Request Your{' '}
              <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-gradient">
                Personalized Quote
              </span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Tell us about your project and we&apos;ll create a customized quote just for you. It only
              takes a few minutes!
            </p>
          </motion.div>
        </div>
      </section>

      {/* Progress Indicator */}
      <section className="py-8 bg-muted/30">
        <div className="container px-6">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-4">
              {[1, 2, 3].map((step) => (
                <React.Fragment key={step}>
                  <div className="flex flex-col items-center flex-1">
                    <motion.div
                      initial={false}
                      animate={{
                        scale: currentStep === step ? 1.1 : 1,
                        backgroundColor:
                          currentStep >= step
                            ? 'hsl(352, 68%, 50%)'
                            : 'hsl(30, 20%, 88%)',
                      }}
                      className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-white mb-2 relative z-10"
                    >
                      {currentStep > step ? (
                        <CheckCircle2 className="h-6 w-6" />
                      ) : (
                        step
                      )}
                    </motion.div>
                    <span
                      className={`text-sm font-medium ${
                        currentStep >= step ? 'text-primary' : 'text-muted-foreground'
                      }`}
                    >
                      {step === 1 && 'Contact Info'}
                      {step === 2 && 'Project Details'}
                      {step === 3 && 'Final Details'}
                    </span>
                  </div>
                  {step < 3 && (
                    <div className="flex-1 h-1 mx-4 relative">
                      <div className="absolute inset-0 bg-muted rounded-full" />
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: currentStep > step ? '100%' : '0%' }}
                        className="absolute inset-0 bg-primary rounded-full"
                      />
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-20">
        <div className="container px-6">
          <div className="max-w-4xl mx-auto">
            <Card className="border-2 border-primary/30 shadow-2xl bg-white dark:bg-card overflow-hidden">
              <CardContent className="p-8 md:p-12">
                <form onSubmit={handleSubmit}>
                  <AnimatePresence mode="wait">
                    {/* Step 1: Contact Information */}
                    {currentStep === 1 && (
                      <motion.div
                        key="step1"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-6"
                      >
                        <div className="text-center mb-8">
                          <h2 className="font-playfair text-3xl md:text-4xl font-bold mb-3">
                            Let&apos;s Get Started
                          </h2>
                          <p className="text-muted-foreground">
                            We&apos;ll need some basic information to get in touch with you
                          </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="space-y-2"
                          >
                            <Label htmlFor="name" className="flex items-center gap-2">
                              <User className="h-4 w-4" />
                              Full Name *
                            </Label>
                            <Input
                              id="name"
                              name="name"
                              value={formData.name}
                              onChange={handleChange}
                              required
                              placeholder="John Doe"
                              className="h-12"
                            />
                          </motion.div>

                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="space-y-2"
                          >
                            <Label htmlFor="email" className="flex items-center gap-2">
                              <Mail className="h-4 w-4" />
                              Email Address *
                            </Label>
                            <Input
                              id="email"
                              name="email"
                              type="email"
                              value={formData.email}
                              onChange={handleChange}
                              required
                              placeholder="john@example.com"
                              className="h-12"
                            />
                          </motion.div>
                        </div>

                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 }}
                          className="space-y-2"
                        >
                          <Label htmlFor="phone" className="flex items-center gap-2">
                            <Phone className="h-4 w-4" />
                            Phone Number *
                          </Label>
                          <Input
                            id="phone"
                            name="phone"
                            type="tel"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                            placeholder="+254 700 000 000"
                            className="h-12"
                          />
                        </motion.div>

                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.4 }}
                          className="space-y-2"
                        >
                          <Label htmlFor="address" className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            Project Address
                          </Label>
                          <Input
                            id="address"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            placeholder="123 Design Street, Nairobi"
                            className="h-12"
                          />
                        </motion.div>
                      </motion.div>
                    )}

                    {/* Step 2: Project Details */}
                    {currentStep === 2 && (
                      <motion.div
                        key="step2"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-6"
                      >
                        <div className="text-center mb-8">
                          <h2 className="font-playfair text-3xl md:text-4xl font-bold mb-3">
                            Tell Us About Your Project
                          </h2>
                          <p className="text-muted-foreground">
                            Help us understand what you&apos;re looking for
                          </p>
                        </div>

                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="space-y-3"
                        >
                          <Label className="flex items-center gap-2">
                            <Package className="h-4 w-4" />
                            Project Type *
                          </Label>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {projectTypes.map((type) => (
                              <motion.button
                                key={type.id}
                                type="button"
                                onClick={() => handleSelect('projectType', type.id)}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className={`p-4 rounded-lg border-2 transition-all ${
                                  formData.projectType === type.id
                                    ? 'border-primary bg-primary/10 shadow-lg'
                                    : 'border-border hover:border-primary/50'
                                }`}
                              >
                                <div className="text-2xl mb-2">{type.icon}</div>
                                <div className="text-sm font-medium">{type.label}</div>
                              </motion.button>
                            ))}
                          </div>
                        </motion.div>

                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 }}
                          className="space-y-3"
                        >
                          <Label className="flex items-center gap-2">
                            <DollarSign className="h-4 w-4" />
                            Budget Range *
                          </Label>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {budgetRanges.map((range) => (
                              <motion.button
                                key={range.id}
                                type="button"
                                onClick={() => handleSelect('budget', range.value)}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className={`p-4 rounded-lg border-2 text-left transition-all ${
                                  formData.budget === range.value
                                    ? 'border-primary bg-primary/10 shadow-lg'
                                    : 'border-border hover:border-primary/50'
                                }`}
                              >
                                {range.label}
                              </motion.button>
                            ))}
                          </div>
                        </motion.div>

                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 }}
                          className="space-y-2"
                        >
                          <Label htmlFor="productInterest">
                            Product/Service of Interest
                          </Label>
                          <Input
                            id="productInterest"
                            name="productInterest"
                            value={formData.productInterest}
                            onChange={handleChange}
                            placeholder="e.g., Ceramic Tiles, Marble, Bathroom Fixtures"
                            className="h-12"
                          />
                        </motion.div>

                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 }}
                          className="space-y-2"
                        >
                          <Label htmlFor="quantity">Estimated Quantity</Label>
                          <Input
                            id="quantity"
                            name="quantity"
                            value={formData.quantity}
                            onChange={handleChange}
                            placeholder="e.g., 100 sq meters, 50 pieces"
                            className="h-12"
                          />
                        </motion.div>
                      </motion.div>
                    )}

                    {/* Step 3: Final Details */}
                    {currentStep === 3 && (
                      <motion.div
                        key="step3"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-6"
                      >
                        <div className="text-center mb-8">
                          <h2 className="font-playfair text-3xl md:text-4xl font-bold mb-3">
                            Almost There!
                          </h2>
                          <p className="text-muted-foreground">
                            Share any additional details or questions you have
                          </p>
                        </div>

                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="space-y-2"
                        >
                          <Label htmlFor="message" className="flex items-center gap-2">
                            <MessageSquare className="h-4 w-4" />
                            Additional Details or Questions
                          </Label>
                          <Textarea
                            id="message"
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            placeholder="Tell us about your vision, style preferences, timeline, or any specific requirements..."
                            rows={8}
                            className="resize-none"
                          />
                        </motion.div>

                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 }}
                          className="p-6 rounded-lg bg-primary/5 border border-primary/20"
                        >
                          <h3 className="font-semibold mb-3 flex items-center gap-2">
                            <Sparkles className="h-5 w-5 text-primary" />
                            What Happens Next?
                          </h3>
                          <ul className="space-y-2 text-sm text-muted-foreground">
                            <li className="flex items-start gap-2">
                              <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                              <span>We&apos;ll review your request within 24 hours</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                              <span>Our team will contact you to discuss your project</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                              <span>You&apos;ll receive a personalized quote tailored to your needs</span>
                            </li>
                          </ul>
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Navigation Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4 mt-8 pt-8 border-t">
                    {currentStep > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="lg"
                        onClick={prevStep}
                        className="flex-1"
                      >
                        Previous
                      </Button>
                    )}
                    {currentStep < 3 ? (
                      <Button
                        type="button"
                        variant="luxury"
                        size="lg"
                        onClick={nextStep}
                        disabled={!canProceed()}
                        className="flex-1"
                      >
                        Continue
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    ) : (
                      <Button
                        type="submit"
                        variant="luxury"
                        size="lg"
                        disabled={isSubmitting}
                        className="flex-1"
                      >
                        {isSubmitting ? (
                          'Submitting...'
                        ) : (
                          <>
                            Submit Quote Request
                            <Sparkles className="ml-2 h-4 w-4" />
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-16 bg-muted/30">
        <div className="container px-6">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              {[
                { icon: Zap, title: 'Fast Response', desc: 'Within 24 hours' },
                { icon: Star, title: 'Our Designers', desc: 'Experienced professionals' },
                { icon: Heart, title: 'Personalized', desc: 'Custom quotes for you' },
              ].map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <item.icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </LuxuryLayout>
  )
}

export default function QuotePage() {
  return (
    <Suspense fallback={
      <LuxuryLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </div>
      </LuxuryLayout>
    }>
      <QuotePageContent />
    </Suspense>
  )
}

