'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { orderSchema } from '@elegant/shared/utils/validators';
import type { Product } from '@elegant/shared/types/database.types';
import { formatCurrency } from '@elegant/shared/utils/formatters';
import { z } from 'zod';

type OrderFormData = z.infer<typeof orderSchema>;

interface OrderRequestFormProps {
  product?: Product;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function OrderRequestForm({ product, onSuccess, onCancel }: OrderRequestFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm<OrderFormData>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      product_id: product?.id || '',
      product_title: product?.title || '',
      quantity: 1,
      unit_price: product?.price || 0,
      total_price: product?.price || 0,
      currency: product?.currency || 'KES',
    },
  });

  const quantity = watch('quantity');
  const unitPrice = watch('unit_price');
  const totalPrice = quantity * unitPrice;

  async function onSubmit(data: OrderFormData) {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          total_price: totalPrice,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to submit order request');
      }

      setSubmitSuccess(true);
      reset();

      setTimeout(() => {
        setSubmitSuccess(false);
        onSuccess?.();
      }, 3000);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Failed to submit order');
    } finally {
      setIsSubmitting(false);
    }
  }

  if (submitSuccess) {
    return (
      <div className="p-8 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-green-100">
          <svg
            className="w-8 h-8 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h3 className="mb-2 text-xl font-semibold text-gray-900">Order Request Sent!</h3>
        <p className="text-gray-600">
          Thank you for your interest. We&apos;ll get back to you shortly with more details.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Product Info */}
      {product && (
        <div className="p-4 rounded-lg bg-gray-50">
          <h3 className="font-semibold text-gray-900">{product.title}</h3>
          {product.price && (
            <p className="mt-1 text-sm text-gray-600">
              {formatCurrency(product.price, product.currency)} per unit
            </p>
          )}
        </div>
      )}

      {/* Customer Information */}
      <div className="space-y-4">
        <div>
          <label htmlFor="customer_name" className="block text-sm font-medium text-gray-700">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            {...register('customer_name')}
            type="text"
            id="customer_name"
            className={`mt-1 block w-full rounded-md border ${
              errors.customer_name ? 'border-red-300' : 'border-gray-300'
            } px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-primary`}
            placeholder="John Doe"
          />
          {errors.customer_name && (
            <p className="mt-1 text-sm text-red-600">{errors.customer_name.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="customer_email" className="block text-sm font-medium text-gray-700">
            Email Address <span className="text-red-500">*</span>
          </label>
          <input
            {...register('customer_email')}
            type="email"
            id="customer_email"
            className={`mt-1 block w-full rounded-md border ${
              errors.customer_email ? 'border-red-300' : 'border-gray-300'
            } px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-primary`}
            placeholder="john@example.com"
          />
          {errors.customer_email && (
            <p className="mt-1 text-sm text-red-600">{errors.customer_email.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="customer_phone" className="block text-sm font-medium text-gray-700">
            Phone Number
          </label>
          <input
            {...register('customer_phone')}
            type="tel"
            id="customer_phone"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-primary"
            placeholder="+254 712 345 678"
          />
        </div>
      </div>

      {/* Order Details */}
      {!product && (
        <div>
          <label htmlFor="product_title" className="block text-sm font-medium text-gray-700">
            Product/Service <span className="text-red-500">*</span>
          </label>
          <input
            {...register('product_title')}
            type="text"
            id="product_title"
            className={`mt-1 block w-full rounded-md border ${
              errors.product_title ? 'border-red-300' : 'border-gray-300'
            } px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-primary`}
            placeholder="e.g., Ceramic Wall Tiles"
          />
          {errors.product_title && (
            <p className="mt-1 text-sm text-red-600">{errors.product_title.message}</p>
          )}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
            Quantity <span className="text-red-500">*</span>
          </label>
          <input
            {...register('quantity', { valueAsNumber: true })}
            type="number"
            id="quantity"
            min="1"
            className={`mt-1 block w-full rounded-md border ${
              errors.quantity ? 'border-red-300' : 'border-gray-300'
            } px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-primary`}
          />
          {errors.quantity && (
            <p className="mt-1 text-sm text-red-600">{errors.quantity.message}</p>
          )}
        </div>

        {!product && (
          <div>
            <label htmlFor="unit_price" className="block text-sm font-medium text-gray-700">
              Estimated Price (per unit)
            </label>
            <input
              {...register('unit_price', { valueAsNumber: true })}
              type="number"
              id="unit_price"
              min="0"
              step="0.01"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-primary"
              placeholder="0.00"
            />
          </div>
        )}
      </div>

      {/* Total */}
      <div className="p-4 rounded-lg bg-gray-50">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">Estimated Total:</span>
          <span className="text-xl font-bold text-primary">
            {formatCurrency(totalPrice, product?.currency || 'KES')}
          </span>
        </div>
        <p className="mt-1 text-xs text-gray-500">
          Final pricing will be confirmed by our team
        </p>
      </div>

      {/* Additional Notes */}
      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
          Additional Notes
        </label>
        <textarea
          {...register('notes')}
          id="notes"
          rows={4}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-primary"
          placeholder="Any specific requirements or questions?"
        />
      </div>

      {/* Error Message */}
      {submitError && (
        <div className="p-4 rounded-md bg-red-50">
          <p className="text-sm text-red-800">{submitError}</p>
        </div>
      )}

      {/* Buttons */}
      <div className="flex gap-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 px-6 py-3 text-white transition-colors bg-primary rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
        >
          {isSubmitting ? 'Sending Request...' : 'Request Quote'}
        </button>

        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 text-gray-700 transition-colors bg-gray-200 rounded-lg hover:bg-gray-300 font-medium"
          >
            Cancel
          </button>
        )}
      </div>

      <p className="text-xs text-center text-gray-500">
        By submitting this form, you agree to be contacted by our team regarding your request.
      </p>
    </form>
  );
}
