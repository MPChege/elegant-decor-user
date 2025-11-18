'use client'

import * as React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { CreditCard, Building, Smartphone, Truck, CheckCircle } from 'lucide-react'
import { LuxuryLayout } from '@/components/layout/luxury-layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'

export default function CheckoutPage() {
  const [paymentMethod, setPaymentMethod] = React.useState<'mpesa' | 'bank' | 'card'>('mpesa')
  const [deliveryMethod, setDeliveryMethod] = React.useState<'standard' | 'express'>('standard')
  const [step, setStep] = React.useState<'details' | 'payment' | 'delivery' | 'success'>('details')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Progress through steps
    if (step === 'details') setStep('payment')
    else if (step === 'payment') setStep('delivery')
    else if (step === 'delivery') setStep('success')
  }

  return (
    <LuxuryLayout>
      <section className="py-20">
        <div className="container px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto"
          >
            <h1 className="font-playfair text-4xl md:text-5xl font-bold mb-8">
              Checkout
            </h1>

            {/* Progress Steps */}
            <div className="flex items-center justify-between mb-12">
              {['Details', 'Payment', 'Delivery', 'Success'].map((label, index) => {
                const steps = ['details', 'payment', 'delivery', 'success']
                const currentIndex = steps.indexOf(step)
                const isActive = index <= currentIndex
                
                return (
                  <div key={label} className="flex items-center flex-1">
                    <div className={`flex flex-col items-center ${index < 3 ? 'flex-1' : ''}`}>
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                          isActive
                            ? 'bg-primary border-primary text-primary-foreground'
                            : 'border-muted-foreground/30 text-muted-foreground'
                        }`}
                      >
                        {isActive ? <CheckCircle className="h-5 w-5" /> : index + 1}
                      </div>
                      <span className="text-xs mt-2 font-medium">{label}</span>
                    </div>
                    {index < 3 && (
                      <div
                        className={`h-0.5 flex-1 transition-all ${
                          index < currentIndex ? 'bg-primary' : 'bg-muted'
                        }`}
                      />
                    )}
                  </div>
                )
              })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Form */}
              <div className="lg:col-span-2">
                <form onSubmit={handleSubmit}>
                  {/* Customer Details */}
                  {step === 'details' && (
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                    >
                      <Card>
                        <CardHeader>
                          <CardTitle>Customer Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="firstName">First Name *</Label>
                              <Input id="firstName" required />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="lastName">Last Name *</Label>
                              <Input id="lastName" required />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="email">Email *</Label>
                            <Input id="email" type="email" required />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="phone">Phone Number *</Label>
                            <Input id="phone" type="tel" placeholder="+254 700 000 000" required />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="address">Delivery Address *</Label>
                            <Input id="address" required />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="city">City *</Label>
                              <Input id="city" required />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="postal">Postal Code</Label>
                              <Input id="postal" />
                            </div>
                          </div>
                          <Button type="submit" variant="luxury" className="w-full">
                            Continue to Payment
                          </Button>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )}

                  {/* Payment Method */}
                  {step === 'payment' && (
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                    >
                      <Card>
                        <CardHeader>
                          <CardTitle>Payment Method</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          {/* M-Pesa */}
                          <button
                            type="button"
                            onClick={() => setPaymentMethod('mpesa')}
                            className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                              paymentMethod === 'mpesa'
                                ? 'border-primary bg-primary/5'
                                : 'border-border hover:border-primary/50'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <Smartphone className="h-6 w-6 text-primary" />
                              <div>
                                <div className="font-semibold">M-Pesa</div>
                                <div className="text-sm text-muted-foreground">
                                  Pay via M-Pesa mobile money
                                </div>
                              </div>
                            </div>
                          </button>

                          {paymentMethod === 'mpesa' && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              className="space-y-3 pl-4"
                            >
                              <div className="space-y-2">
                                <Label htmlFor="mpesaPhone">M-Pesa Number *</Label>
                                <Input id="mpesaPhone" placeholder="254700000000" required />
                              </div>
                              <p className="text-sm text-muted-foreground">
                                You&apos;ll receive an STK push to your phone
                              </p>
                            </motion.div>
                          )}

                          {/* Bank Transfer */}
                          <button
                            type="button"
                            onClick={() => setPaymentMethod('bank')}
                            className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                              paymentMethod === 'bank'
                                ? 'border-primary bg-primary/5'
                                : 'border-border hover:border-primary/50'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <Building className="h-6 w-6 text-primary" />
                              <div>
                                <div className="font-semibold">Bank Transfer</div>
                                <div className="text-sm text-muted-foreground">
                                  Direct bank transfer
                                </div>
                              </div>
                            </div>
                          </button>

                          {paymentMethod === 'bank' && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              className="space-y-3 pl-4 bg-muted p-4 rounded-lg"
                            >
                              <p className="text-sm font-medium">Bank Details:</p>
                              <div className="space-y-1 text-sm">
                                <p><strong>Bank:</strong> Kenya Commercial Bank</p>
                                <p><strong>Account Name:</strong> Elegant Tiles & Décor Centre Ltd</p>
                                <p><strong>Account Number:</strong> 1234567890</p>
                                <p><strong>Branch:</strong> Nairobi Branch</p>
                              </div>
                              <p className="text-xs text-muted-foreground mt-2">
                                Please use your order number as reference
                              </p>
                            </motion.div>
                          )}

                          {/* Card Payment */}
                          <button
                            type="button"
                            onClick={() => setPaymentMethod('card')}
                            className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                              paymentMethod === 'card'
                                ? 'border-primary bg-primary/5'
                                : 'border-border hover:border-primary/50'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <CreditCard className="h-6 w-6 text-primary" />
                              <div>
                                <div className="font-semibold">Credit/Debit Card</div>
                                <div className="text-sm text-muted-foreground">
                                  Visa, Mastercard accepted
                                </div>
                              </div>
                            </div>
                          </button>

                          {paymentMethod === 'card' && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              className="space-y-3 pl-4"
                            >
                              <div className="space-y-2">
                                <Label htmlFor="cardNumber">Card Number *</Label>
                                <Input id="cardNumber" placeholder="1234 5678 9012 3456" required />
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label htmlFor="expiry">Expiry Date *</Label>
                                  <Input id="expiry" placeholder="MM/YY" required />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="cvv">CVV *</Label>
                                  <Input id="cvv" placeholder="123" maxLength={3} required />
                                </div>
                              </div>
                            </motion.div>
                          )}

                          <Button type="submit" variant="luxury" className="w-full mt-4">
                            Continue to Delivery
                          </Button>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )}

                  {/* Delivery Options */}
                  {step === 'delivery' && (
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                    >
                      <Card>
                        <CardHeader>
                          <CardTitle>Delivery Options</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <button
                            type="button"
                            onClick={() => setDeliveryMethod('standard')}
                            className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                              deliveryMethod === 'standard'
                                ? 'border-primary bg-primary/5'
                                : 'border-border hover:border-primary/50'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <Truck className="h-6 w-6 text-primary" />
                                <div>
                                  <div className="font-semibold">Standard Delivery</div>
                                  <div className="text-sm text-muted-foreground">
                                    3-5 business days
                                  </div>
                                </div>
                              </div>
                              <div className="font-semibold">Free</div>
                            </div>
                          </button>

                          <button
                            type="button"
                            onClick={() => setDeliveryMethod('express')}
                            className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                              deliveryMethod === 'express'
                                ? 'border-primary bg-primary/5'
                                : 'border-border hover:border-primary/50'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <Truck className="h-6 w-6 text-primary" />
                                <div>
                                  <div className="font-semibold flex items-center gap-2">
                                    Express Delivery
                                    <Badge variant="luxury">Fast</Badge>
                                  </div>
                                  <div className="text-sm text-muted-foreground">
                                    1-2 business days
                                  </div>
                                </div>
                              </div>
                              <div className="font-semibold">KSh 1,500</div>
                            </div>
                          </button>

                          <div className="space-y-2 mt-6">
                            <Label htmlFor="notes">Delivery Instructions (Optional)</Label>
                            <Input
                              id="notes"
                              placeholder="e.g., Leave at reception"
                            />
                          </div>

                          <Button type="submit" variant="luxury" className="w-full mt-4">
                            Place Order
                          </Button>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )}

                  {/* Success Message */}
                  {step === 'success' && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                    >
                      <Card>
                        <CardContent className="p-12 text-center">
                          <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-6">
                            <CheckCircle className="h-10 w-10 text-green-500" />
                          </div>
                          <h2 className="font-playfair text-3xl font-bold mb-4">
                            Order Placed Successfully!
                          </h2>
                          <p className="text-muted-foreground mb-8">
                            Thank you for your order. We&apos;ll send you a confirmation email shortly.
                          </p>
                          <div className="bg-muted p-4 rounded-lg mb-6">
                            <p className="text-sm text-muted-foreground mb-1">Order Number</p>
                            <p className="font-mono text-lg font-bold">#ETD-2025-001</p>
                          </div>
                          <Button variant="luxury" size="lg" asChild>
                            <Link href="/">Back to Home</Link>
                          </Button>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )}
                </form>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <Card className="sticky top-24">
                  <CardHeader>
                    <CardTitle>Order Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span>Subtotal</span>
                        <span>KSh 45,000</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Delivery</span>
                        <span>{deliveryMethod === 'express' ? 'KSh 1,500' : 'Free'}</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between font-semibold text-lg">
                        <span>Total</span>
                        <span>
                          KSh {deliveryMethod === 'express' ? '46,500' : '45,000'}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </LuxuryLayout>
  )
}

