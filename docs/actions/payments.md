
# Payments Server Actions Documentation

**File Location**: `actions/payments.ts`

This module handles the pre-payment processing logic for the application. It manages discount verification and the initialization of checkout transactions within the database.

## Table of Contents
- [Data Models & Schemas](#data-models--schemas)
- [Actions](#actions)
- [Common Logic](#common-logic)

---

## Data Models & Schemas

### `ActionResponse<T>`
Standard wrapper for action responses.

```typescript
type ActionResponse<T> = 
  | { success: true; data: T } 
  | { success: false, error: string };
```

### `ValidateDiscountSchema`
Schema for verifying coupon codes against specific products.

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `code` | string | - | The coupon code (normalized to uppercase). |
| `offeringId` | string (UUID) | - | The ID of the product/service. |
| `currency` | string | `'INR'` | The currency code (e.g., 'USD', 'INR'). |

### `InitializeCheckoutSchema`
Schema for starting a new payment transaction.

| Field | Type | Description |
|-------|------|-------------|
| `offeringId` | string (UUID) | The ID of the product/service. |
| `currency` | string | The currency code (e.g., 'USD', 'INR'). |
| `provider` | string | Payment provider identifier (e.g., 'razorpay', 'cashfree'). |
| `couponCode` | string | Optional promotional code. |

---

## Actions

### `verifyDiscountCode`
**Description**: 
Validates a coupon code's integrity, applicability, and calculates the final pricing. It performs strict checks against time constraints, usage limits, and currency scope.

**Parameters**: `ValidateDiscountSchema`

**Returns**: `ActionResponse<{ valid: boolean; discount: DiscountRow; basePrice: number; finalPrice: number; deductionAmount: number }>`

**Logic Flow**:
1.  **Offering Check**: Fetches the offering by ID. Verifies it is active (`is_active: true`).
2.  **Price Retrieval**: Extracts the base price from the `prices` JSONB column for the specified currency.
3.  **Discount Lookup**: Fetches the discount row by the provided code.
4.  **Validation Guards**:
    *   **Status**: Checks if `is_active` is true.
    *   **Usage Limits**: Ensures `uses_count` has not reached `max_uses`.
    *   **Time Window**: Ensures current time is between `starts_at` and `expires_at`.
    *   **Currency Scope**: Checks if the provided currency is listed in the `applicable_currencies` array.
5.  **Calculation**:
    *   If type is `percentage`: Deduction = Base Price * (Value / 100).
    *   If type is `fixed_amount`: Deduction = Value.
    *   Final Price = Base Price - Deduction (min 0).
6.  **Return**: Returns the discount details and calculated pricing rounded to 2 decimal places.

---

### `initializeCheckoutTransaction`
**Description**: 
Pre-registers a transaction in the `transactions` table with a 'pending' status. This action is called before redirecting the user to the payment gateway.

**Access Level**: Authenticated User

**Parameters**: `InitializeCheckoutSchema`

**Returns**: `ActionResponse<{ transaction: TransactionRow; gatewayPayload: any }>`

**Logic Flow**:
1.  **Authentication**: Ensures a user is logged in.
2.  **Offering Validation**: Fetches the offering to ensure it exists and is active.
3.  **Price Calculation**:
    *   Retrieves the base price from `prices` JSONB.
    *   If `couponCode` is provided, it calls `verifyDiscountCode` internally.
    *   Updates the `finalPayableAmount` based on the discount result. Captures the `discount_id` if applied.
4.  **Tracking ID**: Generates a mock `gatewayOrderId` string (`order_track_...`).
5.  **Database Insert**: Creates a new record in `transactions` with:
    *   `user_id`: Current user.
    *   `amount_paid`: Final calculated amount.
    *   `status`: `'pending'`.
    *   `provider_order_id`: The generated tracking ID.
6.  **Return**: Returns the created transaction row and a payload containing the `gatewayOrderId` and `amountToCharge` for the frontend.

---

## Common Logic

### Pricing Structure
Both actions assume the `offerings` table uses a `prices` column with a JSONB structure mapping currency codes to numbers (e.g., `{ "USD": 100, "INR": 5000 }`).

### Error Handling
- **Authentication**: Returns error if user is not logged in during checkout.
- **Availability**: Returns error if the offering is inactive or prices are missing for the currency.
- **Exhaustion**: Returns error if coupon usage limits are reached or expired.
