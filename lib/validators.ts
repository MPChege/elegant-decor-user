import { z } from 'zod'

/**
 * Validation schemas for API requests
 */

export const inquirySchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional().nullable(),
  subject: z.string().min(3, 'Subject must be at least 3 characters'),
  message: z.string().min(1, 'Message is required'),
  type: z.enum(['general', 'quote', 'support', 'project']).default('general'),
})

export const orderSchema = z.object({
  customer_name: z.string().min(2, 'Customer name must be at least 2 characters'),
  customer_email: z.string().email('Invalid email address'),
  customer_phone: z.string().optional().nullable(),
  product_id: z.string().uuid().optional().nullable(),
  product_title: z.string().min(1, 'Product title is required'),
  quantity: z.number().int().min(1, 'Quantity must be at least 1'),
  unit_price: z.number().min(0, 'Unit price must be 0 or greater'),
  total_price: z.number().min(0, 'Total price must be 0 or greater'),
  currency: z.string().default('KES'),
  shipping_address: z.record(z.unknown()).optional().nullable(),
  billing_address: z.record(z.unknown()).optional().nullable(),
  notes: z.string().optional().nullable(),
})

export type InquiryInput = z.infer<typeof inquirySchema>
export type OrderInput = z.infer<typeof orderSchema>

