/**
 * Unit Tests for E-Commerce Domain Logic & Calculators
 * Author: EHSANKiNG
 * Engine: Seller Platform
 */

import { describe, it, expect } from 'vitest';

// Cart Calculation Helper using integer cents to avoid floating point precision issues
interface CartItem {
  price: number;
  quantity: number;
}

function calculateCartSubtotal(items: CartItem[]): number {
  const totalCents = items.reduce((sum, item) => {
    if (item.price < 0 || item.quantity < 0) {
      throw new Error('Negative values not permitted in cart calculations');
    }
    const itemCents = Math.round(item.price * 100) * item.quantity;
    return sum + itemCents;
  }, 0);
  return Number((totalCents / 100).toFixed(2));
}

function applyDiscount(subtotal: number, couponCode: string): { discountAmount: number; finalTotal: number } {
  let discount = 0;
  const upperCode = couponCode.toUpperCase();
  
  if (upperCode === 'EHSAN20') {
    discount = subtotal * 0.20;
  } else if (upperCode === 'SAVE50' && subtotal >= 100) {
    discount = 50;
  } else if (upperCode === 'EXPIRED') {
    throw new Error('Coupon code has expired');
  }

  const finalTotal = Math.max(0, subtotal - discount);
  return {
    discountAmount: Number(discount.toFixed(2)),
    finalTotal: Number(finalTotal.toFixed(2))
  };
}

function calculateShipping(subtotal: number, region: string): number {
  if (subtotal >= 75) return 0; // Free shipping threshold
  return region === 'international' ? 25.00 : 5.99;
}

describe('Seller Domain Logic - Cart & Pricing Engine (Author: EHSANKiNG)', () => {
  it('calculates exact cart subtotal with decimal precision', () => {
    const items: CartItem[] = [
      { price: 29.99, quantity: 2 },
      { price: 15.50, quantity: 1 }
    ];
    const subtotal = calculateCartSubtotal(items);
    expect(subtotal).toBe(75.48);
  });

  it('rejects negative prices or quantities with domain error', () => {
    const invalidItems: CartItem[] = [{ price: -10, quantity: 2 }];
    expect(() => calculateCartSubtotal(invalidItems)).toThrowError(/Negative values/);
  });

  it('applies percentage coupon correctly (EHSAN20)', () => {
    const subtotal = 100.00;
    const { discountAmount, finalTotal } = applyDiscount(subtotal, 'EHSAN20');
    expect(discountAmount).toBe(20.00);
    expect(finalTotal).toBe(80.00);
  });

  it('applies tiered coupon with minimum threshold (SAVE50)', () => {
    const subtotal = 120.00;
    const { discountAmount, finalTotal } = applyDiscount(subtotal, 'SAVE50');
    expect(discountAmount).toBe(50.00);
    expect(finalTotal).toBe(70.00);
  });

  it('throws error on expired coupon redemption', () => {
    expect(() => applyDiscount(100, 'EXPIRED')).toThrowError(/expired/);
  });

  it('applies free shipping when subtotal reaches $75 threshold', () => {
    expect(calculateShipping(80.00, 'domestic')).toBe(0);
    expect(calculateShipping(50.00, 'domestic')).toBe(5.99);
    expect(calculateShipping(50.00, 'international')).toBe(25.00);
  });
});
