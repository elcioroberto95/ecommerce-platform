'use client';

import React, { createContext, useContext, useCallback, useEffect, useState } from 'react';
import type { Cart } from '@/types';
import { apiClient } from '@/lib/api-client';
import { useAuth } from '@/context/AuthContext';

interface CartContextType {
  cart: Cart | null;
  isLoading: boolean;
  error: string | null;
  addItem: (productId: string, quantity: number) => Promise<void>;
  updateItem: (productId: string, quantity: number) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const [cart, setCart] = useState<Cart | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCart = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await apiClient.get('/cart');
      setCart(response.data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch cart';
      setError(message);
      setCart(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // The cart endpoint requires authentication: only fetch once the auth state
  // is known and the user is logged in. Anonymous visitors get an empty cart.
  useEffect(() => {
    if (isAuthLoading) {
      return;
    }

    if (isAuthenticated) {
      fetchCart();
    } else {
      setCart(null);
      setError(null);
      setIsLoading(false);
    }
  }, [isAuthenticated, isAuthLoading, fetchCart]);

  const addItem = useCallback(
    async (productId: string, quantity: number) => {
      try {
        setError(null);
        await apiClient.post('/cart/items', { productId, quantity });
        await fetchCart();
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to add item';
        setError(message);
        throw err;
      }
    },
    [fetchCart]
  );

  const updateItem = useCallback(
    async (productId: string, quantity: number) => {
      try {
        setError(null);
        await apiClient.patch(`/cart/items/${productId}`, { quantity });
        await fetchCart();
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to update item';
        setError(message);
        throw err;
      }
    },
    [fetchCart]
  );

  const removeItem = useCallback(
    async (productId: string) => {
      try {
        setError(null);
        await apiClient.delete(`/cart/items/${productId}`);
        await fetchCart();
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to remove item';
        setError(message);
        throw err;
      }
    },
    [fetchCart]
  );

  const clearCart = useCallback(async () => {
    try {
      setError(null);
      await apiClient.delete('/cart');
      setCart(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to clear cart';
      setError(message);
      throw err;
    }
  }, []);

  const refreshCart = useCallback(fetchCart, [fetchCart]);

  return (
    <CartContext.Provider value={{ cart, isLoading, error, addItem, updateItem, removeItem, clearCart, refreshCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
}
