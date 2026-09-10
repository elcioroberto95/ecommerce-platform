'use client';

import Link from 'next/link';
import type { Cart } from '@/types';

interface OrderSummaryProps {
  cart: Cart | null;
  isLoading?: boolean;
}

const TAX_RATE = 0.05;
const SHIPPING_COST = 10;

export function OrderSummary({ cart }: OrderSummaryProps) {
  if (!cart || cart.items.length === 0) {
    return (
      <div className="rounded-lg border bg-gray-50 p-6">
        <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
        <p className="text-gray-600 text-center py-8">Your cart is empty</p>
      </div>
    );
  }

  const subtotal = cart.items.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);
  const tax = subtotal * TAX_RATE;
  const total = subtotal + tax + SHIPPING_COST;

  return (
    <div className="rounded-lg border bg-gray-50 p-6 sticky top-20 h-fit">
      <h2 className="text-lg font-semibold mb-6">Order Summary</h2>

      <div className="space-y-3 mb-6">
        <div className="flex justify-between text-gray-600">
          <span>Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-gray-600">
          <span>Shipping</span>
          <span>${SHIPPING_COST.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-gray-600">
          <span>Tax (5%)</span>
          <span>${tax.toFixed(2)}</span>
        </div>
        <div className="border-t pt-3 flex justify-between text-lg font-bold text-gray-900">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>

      <Link
        href="/checkout"
        className="block w-full bg-blue-600 text-white font-semibold py-3 rounded-lg text-center hover:bg-blue-700 transition disabled:opacity-50"
      >
        Proceed to Checkout
      </Link>

      <Link
        href="/products"
        className="block w-full mt-3 text-center text-blue-600 font-semibold hover:text-blue-700 transition"
      >
        Continue Shopping
      </Link>

      {subtotal < 50 && (
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded text-sm text-blue-800">
          🎁 Add ${(50 - subtotal).toFixed(2)} more for free shipping!
        </div>
      )}
    </div>
  );
}
