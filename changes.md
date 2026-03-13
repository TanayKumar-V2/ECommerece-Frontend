# Security Audit Fixes

**Date:** March 13, 2026
**Type:** Security Patches (Critical & High Priority)

---

## Summary

This document details security fixes applied to address vulnerabilities identified during the security audit. Two critical blockers and three high-risk issues have been resolved.

---

## Critical Fixes

### 1. Payment Verification Bypass (Price Manipulation)

**Severity:** 🔴 CRITICAL
**Risk:** Financial loss through payment manipulation

**Problem:**
The payment verification endpoint did not validate that the `razorpay_order_id` matched the `mongo_order_id`. An attacker could create a cheap order ($1), pay for it, then apply the valid signature to a different expensive order ($1,000).

**Files Changed:**

#### `src/models/Order.ts`
- Added `razorpayOrderId` field to `IOrder` interface (line 26)
- Added `razorpayOrderId` to schema with `required: true` (line 44)

#### `src/app/api/checkout/razorpay/route.ts`
- Now stores `razorpayOrderId` when creating MongoDB order (line 75)

#### `src/app/api/checkout/verify/route.ts`
- Added `razorpayOrderId` to the `findOneAndUpdate` query filter (line 48)
- Added fraud detection logging for mismatched order IDs (line 65)

---

### 2. Missing Stock/Inventory Validation

**Severity:** 🔴 CRITICAL
**Risk:** Revenue loss, fulfillment failures, customer complaints

**Problem:**
No stock validation during checkout. Users could order unlimited quantities regardless of inventory, leading to unfulfillable orders.

**Files Changed:**

#### `src/models/Product.ts`
- Added `stock` field to `IProduct` interface (line 12)
- Added `stock` field to schema with `default: 0` (line 24)

#### `src/app/api/checkout/razorpay/route.ts`
- Added stock availability validation before order creation (lines 42-47)
- Returns clear error message with available vs requested quantities

#### `src/app/api/checkout/verify/route.ts`
- Added inventory deduction after successful payment (lines 76-86)
- Uses MongoDB `$inc` operator for atomic decrements
- Errors logged but don't fail payment (for manual reconciliation)

#### `src/actions/productActions.ts`
- `createProduct()`: Now includes `stock` field (line 11)
- `updateProduct()`: Now includes `stock` field (line 29)

---

## High Priority Fixes

### 3. User Color Selection Ignored

**Severity:** 🟠 HIGH
**Risk:** Wrong products shipped, returns, refunds

**Problem:**
The order creation used `product.colors[0]` (first available color) instead of the customer's selected color from the cart.

**Files Changed:**

#### `src/app/api/checkout/razorpay/route.ts`
- Changed color assignment to use `item.color` from cart (line 54)
- Falls back to `product.colors[0]` if no color selected
- Falls back to `'N/A'` if product has no colors

**Before:**
```typescript
color: product.colors && product.colors.length > 0 ? product.colors[0] : 'N/A'
```

**After:**
```typescript
color: item.color || (product.colors && product.colors.length > 0 ? product.colors[0] : 'N/A')
```

---

### 4. Missing Authentication on Verify Endpoint

**Severity:** 🟠 HIGH
**Risk:** Unauthorized access, potential fraud

**Problem:**
The `/api/checkout/verify` endpoint had no authentication check. Any user (authenticated or not) could call it with valid parameters.

**Files Changed:**

#### `src/app/api/checkout/verify/route.ts`
- Added session authentication check at endpoint start (lines 18-23)
- Added order ownership verification (lines 69-73)
- Returns 401 Unauthorized for unauthenticated requests
- Returns 403 Forbidden if user doesn't own the order
- Logs fraud attempts for monitoring

---

### 5. TypeScript Build Errors Suppression

**Severity:** 🟠 HIGH
**Risk:** Runtime crashes from type errors

**Problem:**
`next.config.ts` contained `typescript.ignoreBuildErrors: true`, suppressing all TypeScript errors during build. This could hide critical type-related bugs.

**Files Changed:**

#### `next.config.ts`
- Removed `typescript.ignoreBuildErrors: true` configuration

**Note:** You may need to fix existing TypeScript errors before the next production build.

---

## Database Migration Required

Before deploying to production, run the following migrations:

### Add `stock` field to Products
```javascript
// MongoDB shell or migration script
db.products.updateMany({}, { $set: { stock: 0 } });
```

### Handle `razorpayOrderId` for Existing Orders

**Option A:** Mark old pending orders as invalid (recommended for clean state)
```javascript
db.orders.updateMany(
  { status: 'pending', razorpayOrderId: { $exists: false } },
  { $set: { status: 'cancelled' } }
);
```

**Option B:** Add field with empty string (orders created before this fix will need manual handling)
```javascript
db.orders.updateMany(
  { razorpayOrderId: { $exists: false } },
  { $set: { razorpayOrderId: '' } }
);
```

---

## Security Improvements Summary

| Issue | Before | After |
|-------|--------|-------|
| Payment verification | No order ID validation | Validates `razorpayOrderId` matches |
| Stock validation | None | Validates before order, deducts after payment |
| Color selection | Ignored, used first color | Uses customer's selected color |
| Verify endpoint auth | None | Session + ownership verification |
| TypeScript errors | Ignored during build | Will fail build on type errors |

---

## Remaining Recommendations (Non-Blocking)

These were identified but not implemented as they are enhancements rather than vulnerabilities:

1. **Rate Limiting** — Consider implementing rate limiting on checkout endpoints using Upstash Redis or similar
2. **Pending Order Cleanup** — Add scheduled job to cancel unpaid orders older than 24 hours
3. **Email Input Sanitization** — Sanitize shipping address fields before rendering in emails (low XSS risk in email clients)

---

## Testing Checklist

- [ ] Create a new product with stock quantity
- [ ] Attempt to order more than available stock (should fail)
- [ ] Complete a successful payment (stock should decrement)
- [ ] Verify color is correctly stored in order
- [ ] Test payment verification with wrong `razorpay_order_id` (should fail)
- [ ] Test payment verification as different user (should fail with 403)
- [ ] Run `npm run build` and fix any TypeScript errors