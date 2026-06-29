// actions/payments.schemas.ts
import { z } from 'zod';

export const ValidateDiscountSchema = z.object({
  code: z.string().min(1).trim().toUpperCase(),
  offeringId: z.string().uuid(),
  currency: z.string().min(3).max(5).trim().toUpperCase().default('INR'),
});

export const InitializeCheckoutSchema = z.object({
  offeringId: z.string().uuid(),
  currency: z.string().min(3).max(5).trim().toUpperCase().default('INR'),
  provider: z.string().min(1), // e.g., 'razorpay', 'cashfree', 'mock_gateway'
  couponCode: z.string().trim().toUpperCase().optional().nullable(),
});

export const CompleteCheckoutSchema = z.object({
  transactionId: z.string().uuid(),
});