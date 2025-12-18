'use client'

import * as React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Calendar, Clock, User, MapPin, Phone, Mail, CheckCircle, ArrowRight, Sparkles } from 'lucide-react'
import { LuxuryLayout } from '@/components/layout/luxury-layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'

const consultationTypes = [
  {
    id: 'studio',
    title: 'Studio Consultation',
    duration: '60 minutes',
    description: 'Free consultation at our studio. Perfect for first-time clients to discuss your vision and project requirements.',
    price: 'Free',
    location: 'studio',
    features: ['Project assessment', 'Design recommendations', 'Budget planning', 'At our studio location'],
  },
  {
    id: 'onsite-nairobi',
    title: 'On-Site Consultation (Nairobi)',
    duration: '90 minutes',
    description: 'Consultation at your location within Nairobi. We come to you for a detailed site assessment.',
    price: 'KSh 5,000',
    location: 'nairobi',
    features: ['Site visit included', 'Detailed assessment', 'Material recommendations', 'Within Nairobi'],
  },
  {
    id: 'onsite-out-of-town',
    title: 'On-Site Consultation (Out of Town)',
    duration: '90 minutes',
    description: 'Consultation at your location outside Nairobi. Pricing depends on distance and mileage.',
    price: 'Based on Distance',
    location: 'out-of-town',
    features: ['Site visit included', 'Distance-based pricing', 'Mileage calculation', 'Flexible scheduling'],
  },
]

const availableTimes = [
  '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
  '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM',
]

export default function ConsultationPage() {
  const { toast } = useToast()
  const [selectedType, setSelectedType] = React.useState<string>('studio')
  const [selectedDate, setSelectedDate] = React.useState('')
  const [selectedTime, setSelectedTime] = React.useState('')
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    location: 'studio', // studio, nairobi, out-of-town
    distance: '', // For out-of-town consultations
    projectType: 'residential',
    budget: '',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedDate || !selectedTime) {
      toast({
        title: 'Please select date and time',
        description: 'Choose your preferred consultation date and time.',
        variant: 'destructive',
      })
      return
    }

    setIsSubmitting(true)
    
    try {
      // Submit consultation request to inquiries API
      const response = await fetch('/api/inquiries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          subject: `Consultation Request: ${consultationTypes.find(t => t.id === selectedType)?.title}`,
          message: `Consultation Type: ${consultationTypes.find(t => t.id === selectedType)?.title}\nDate: ${selectedDate}\nTime: ${selectedTime}\nLocation: ${selectedType === 'studio' ? 'At Our Studio (Free)' : selectedType === 'onsite-nairobi' ? 'On-Site in Nairobi (KSh 5,000)' : `On-Site Out of Town${formData.distance ? ` (Distance: ${formData.distance}km - Pricing to be calculated)` : ' (Distance to be provided)'}`}\nProject Type: ${formData.projectType}\nBudget: ${formData.budget}\nAddress: ${formData.address}\n\nMessage: ${formData.message}\n\nNote: Design fees start from KSh 150,000 depending on project size.`,
          type: 'project', // Use 'project' type for consultations
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to book consultation')
      }

      toast({
        title: 'Consultation Booked!',
        description: `We've confirmed your ${consultationTypes.find(t => t.id === selectedType)?.title} on ${selectedDate} at ${selectedTime}. We'll send a confirmation email shortly.`,
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to book consultation. Please try again.',
        variant: 'destructive',
      })
      setIsSubmitting(false)
      return
    }
    
    // Reset form
    setFormData({
      name: '',
      email: '',
      phone: '',
      address: '',
      location: 'studio',
      distance: '',
      projectType: 'residential',
      budget: '',
      message: '',
    })
    setSelectedDate('')
    setSelectedTime('')
    setIsSubmitting(false)
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  // Get next 14 days for date selection - reserved for future feature
  // const getAvailableDates = () => {
  //   const dates = []
  //   const today = new Date()
  //   for (let i = 1; i <= 14; i++) {
  //     const date = new Date(today)
  //     date.setDate(today.getDate() + i)
  //     // Skip Sundays
  //     if (date.getDay() !== 0) {
  //       dates.push(date.toISOString().split('T')[0])
  //     }
  //   }
  //   return dates
  // }

  const selectedConsultation = consultationTypes.find(t => t.id === selectedType)

  return (
    <LuxuryLayout>
      {/* Hero Section */}
      <section className="py-20 md:py-32">
        <div className="container px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center"
          >
            <Badge variant="luxury" className="mb-6">
              <Sparkles className="h-3 w-3 mr-2" />
              Book Your Consultation
            </Badge>
            <h1 className="font-playfair text-5xl md:text-6xl lg:text-7xl font-bold mb-6">
              Book Your <span className="text-luxury-gradient">Consultation</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground">
              Schedule a personalized consultation with our designers
              and bring your vision to life.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Consultation Types */}
      <section className="py-12 bg-muted/30">
        <div className="container px-6">
          <h2 className="font-playfair text-3xl md:text-4xl font-bold text-center mb-12">
            Choose Your Consultation Type
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {consultationTypes.map((type, index) => (
              <motion.div
                key={type.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card
                  className={`cursor-pointer transition-all duration-300 h-full ${
                    selectedType === type.id
                      ? 'border-primary shadow-luxury-lg scale-105'
                      : 'hover:shadow-luxury-md border-luxury'
                  }`}
                  onClick={() => {
                    setSelectedType(type.id)
                    // Update location based on consultation type
                    if (type.id === 'studio') {
                      setFormData({ ...formData, location: 'studio', distance: '' })
                    } else if (type.id === 'onsite-nairobi') {
                      setFormData({ ...formData, location: 'nairobi', distance: '' })
                    } else if (type.id === 'onsite-out-of-town') {
                      setFormData({ ...formData, location: 'out-of-town', distance: '' })
                    }
                  }}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <CardTitle className="font-playfair text-xl">{type.title}</CardTitle>
                      {selectedType === type.id && (
                        <CheckCircle className="h-5 w-5 text-primary" />
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        {type.duration}
                      </div>
                      <Badge variant={type.price === 'Free' ? 'luxury' : 'outline'}>
                        {type.price}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      {type.description}
                    </p>
                    <ul className="space-y-2">
                      {type.features.map((feature) => (
                        <li key={feature} className="flex items-center gap-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-primary flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Booking Form */}
      <section className="py-20">
        <div className="container px-6">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Card className="border-2 border-primary/30 shadow-2xl bg-white dark:bg-card">
                <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5 dark:from-primary/10 dark:to-accent/10 border-b border-primary/20 pb-4">
                  <CardTitle className="font-playfair text-3xl text-foreground font-bold">
                    Book Your Consultation
                  </CardTitle>
                  {selectedConsultation && (
                    <p className="text-muted-foreground font-medium mt-2">
                      {selectedConsultation.title} - {selectedConsultation.duration}
                    </p>
                  )}
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Date & Time Selection */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="date" className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          Preferred Date *
                        </Label>
                        <Input
                          id="date"
                          type="date"
                          value={selectedDate}
                          onChange={(e) => setSelectedDate(e.target.value)}
                          min={new Date(Date.now() + 86400000).toISOString().split('T')[0]}
                          required
                          className="w-full"
                        />
                        <p className="text-xs text-muted-foreground">
                          Available dates shown (excluding Sundays)
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="time" className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          Preferred Time *
                        </Label>
                        <div className="grid grid-cols-4 gap-2">
                          {availableTimes.map((time) => (
                            <Button
                              key={time}
                              type="button"
                              variant={selectedTime === time ? 'luxury' : 'outline'}
                              size="sm"
                              onClick={() => setSelectedTime(time)}
                              className="text-xs"
                            >
                              {time}
                            </Button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Personal Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
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
                        />
                      </div>

                      <div className="space-y-2">
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
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
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
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="address" className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        Project Address *
                      </Label>
                      <Input
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        required
                        placeholder="123 Design Street, Nairobi"
                      />
                    </div>

                    {/* Distance field for out-of-town consultations */}
                    {selectedType === 'onsite-out-of-town' && (
                      <div className="space-y-2">
                        <Label htmlFor="distance">Distance from Nairobi (km) *</Label>
                        <Input
                          id="distance"
                          name="distance"
                          type="number"
                          value={formData.distance}
                          onChange={handleChange}
                          placeholder="e.g., 50"
                          min="0"
                          required
                        />
                        <p className="text-xs text-muted-foreground">
                          We'll calculate the consultation fee based on distance and mileage. Our team will contact you with the exact pricing after receiving your booking.
                        </p>
                      </div>
                    )}

                    {/* Pricing Display */}
                    <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Consultation Fee:</span>
                        <span className="text-lg font-bold text-primary">
                          {selectedType === 'studio' 
                            ? 'Free' 
                            : selectedType === 'onsite-nairobi'
                            ? 'KSh 5,000'
                            : formData.distance
                            ? 'To be calculated'
                            : 'Based on Distance'}
                        </span>
                      </div>
                      {selectedType === 'studio' && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Free consultation at our studio
                        </p>
                      )}
                      {selectedType === 'onsite-nairobi' && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Fixed rate for consultations within Nairobi
                        </p>
                      )}
                      {selectedType === 'onsite-out-of-town' && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Pricing will be calculated based on distance and mileage
                        </p>
                      )}
                    </div>

                    {/* Project Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="projectType">Project Type *</Label>
                        <select
                          id="projectType"
                          name="projectType"
                          value={formData.projectType}
                          onChange={handleChange}
                          required
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <option value="residential">Residential</option>
                          <option value="commercial">Commercial</option>
                          <option value="hospitality">Hospitality</option>
                          <option value="office">Office Space</option>
                        </select>
                      </div>

                        <div className="space-y-2">
                        <Label htmlFor="budget">Estimated Budget</Label>
                        <Input
                          id="budget"
                          name="budget"
                          value={formData.budget}
                          onChange={handleChange}
                          placeholder="KSh 500,000 - 1,000,000"
                        />
                        <p className="text-xs text-muted-foreground">
                          Note: Design fees start from KSh 150,000 depending on project size
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">Tell Us About Your Project</Label>
                      <Textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Share your vision, style preferences, or any specific requirements..."
                        rows={5}
                      />
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 pt-4">
                      <Button
                        type="submit"
                        variant="luxury"
                        size="lg"
                        className="flex-1 bg-primary text-white font-bold tracking-wide shadow-2xl hover:shadow-3xl hover:scale-105 border-2 border-primary"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          'Booking Consultation...'
                        ) : (
                          <>
                            Confirm Booking
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </>
                        )}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="lg"
                        className="bg-white text-primary border-2 border-primary font-bold shadow-xl hover:bg-primary hover:text-white hover:shadow-2xl hover:scale-105"
                        asChild
                      >
                        <Link href="/contact">Or Contact Us Directly</Link>
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Pricing Information */}
      <section className="py-20 bg-muted/30">
        <div className="container px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-playfair text-3xl md:text-4xl font-bold text-center mb-8">
              Consultation & Design Fees
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <Card className="border-primary/20">
                <CardHeader>
                  <CardTitle className="font-playfair text-xl">Consultation Fees</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Studio Consultation</span>
                    <Badge variant="luxury">Free</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">On-Site (Within Nairobi)</span>
                    <span className="font-semibold text-primary">KSh 5,000</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">On-Site (Out of Town)</span>
                    <span className="font-semibold text-primary">Based on Distance</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Out-of-town consultations are priced based on distance and mileage. We'll provide a quote after receiving your location details.
                  </p>
                </CardContent>
              </Card>
              <Card className="border-primary/20">
                <CardHeader>
                  <CardTitle className="font-playfair text-xl">Design Fees</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Design Services</span>
                    <span className="font-semibold text-primary">From KSh 150,000</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Design fees vary depending on the size and complexity of your project. Our team will provide a detailed quote after the initial consultation.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Why Book With Us */}
      <section className="py-20 bg-card">
        <div className="container px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-playfair text-3xl md:text-4xl font-bold text-center mb-12">
              Why Book a Consultation?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: CheckCircle,
                  title: 'Expert Guidance',
                  description: 'Get personalized advice from our designers.',
                },
                {
                  icon: Sparkles,
                  title: 'Custom Solutions',
                  description: 'Tailored recommendations for your specific project needs.',
                },
                {
                  icon: Calendar,
                  title: 'Flexible Scheduling',
                  description: 'Choose a time that works best for your schedule.',
                },
              ].map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <item.icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </LuxuryLayout>
  )
}

