'use client';

import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { CartItem } from '@/components/CartItem';
import { OrderSummary } from '@/components/OrderSummary';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';

export default function CartPage() {
  const { isAuthenticated } = useAuth();
  const { cart, isLoading, error, clearCart } = useCart();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth/login?redirect=/cart');
    }
  }, [isAuthenticated, isLoading, router]);

  if (!isAuthenticated) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="mx-auto max-w-6xl px-4">
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-800">
            <p className="font-semibold">Error loading cart</p>
            <p className="text-sm">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  const isEmpty = !cart || cart.items.length === 0;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="mx-auto max-w-6xl px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

        {isEmpty ? (
          <div className="text-center py-16">
            <p className="text-gray-600 text-lg mb-6">Your cart is empty</p>
            <Link href="/products" className="text-blue-600 font-semibold hover:text-blue-700">
              Continue Shopping →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="rounded-lg border bg-white p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Items ({cart.items.length})
                  </h2>
                  <button
                    onClick={() => {
                      if (confirm('Clear entire cart?')) {
                        clearCart();
                      }
                    }}
                    className="text-sm text-gray-600 hover:text-red-600"
                  >
                    Clear Cart
                  </button>
                </div>

                <div className="space-y-4">
                  {cart.items.map((item) => (
                    <CartItem key={item.product.id} item={item} />
                  ))}
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <OrderSummary cart={cart} isLoading={isLoading} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
