'use client';

import Image from 'next/image';
import { useState } from 'react';
import type { CartItem as CartItemType } from '@/types';
import { useCart } from '@/context/CartContext';
import { Trash2, Plus, Minus } from 'lucide-react';

interface CartItemProps {
  item: CartItemType;
}

export function CartItem({ item }: CartItemProps) {
  const { updateItem, removeItem } = useCart();
  const [isUpdating, setIsUpdating] = useState(false);

  const handleQuantityChange = async (newQuantity: number) => {
    if (newQuantity < 1) return;
    try {
      setIsUpdating(true);
      await updateItem(item.product.id, newQuantity);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRemove = async () => {
    try {
      setIsUpdating(true);
      await removeItem(item.product.id);
    } finally {
      setIsUpdating(false);
    }
  };

  const subtotal = Number(item.product.price) * item.quantity;

  return (
    <div className="flex gap-4 border-b pb-4 last:border-b-0">
      <div className="relative h-24 w-24 flex-shrink-0">
        <Image
          src={`https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&h=200&fit=crop`}
          alt={item.product.name}
          fill
          className="rounded-lg object-cover"
        />
      </div>

      <div className="flex flex-1 flex-col">
        <div className="flex justify-between gap-4">
          <div>
            <h3 className="font-semibold text-gray-900">{item.product.name}</h3>
            <p className="text-sm text-gray-600">${Number(item.product.price).toFixed(2)}</p>
          </div>
          <button
            onClick={handleRemove}
            disabled={isUpdating}
            className="text-gray-400 hover:text-red-600 disabled:opacity-50"
            aria-label="Remove item"
          >
            <Trash2 size={20} />
          </button>
        </div>

        <div className="mt-auto flex items-center gap-2">
          <button
            onClick={() => handleQuantityChange(item.quantity - 1)}
            disabled={isUpdating || item.quantity <= 1}
            className="flex items-center justify-center w-8 h-8 border rounded hover:bg-gray-100 disabled:opacity-50"
            aria-label="Decrease quantity"
          >
            <Minus size={16} />
          </button>

          <span className="w-8 text-center font-semibold">{item.quantity}</span>

          <button
            onClick={() => handleQuantityChange(item.quantity + 1)}
            disabled={isUpdating}
            className="flex items-center justify-center w-8 h-8 border rounded hover:bg-gray-100 disabled:opacity-50"
            aria-label="Increase quantity"
          >
            <Plus size={16} />
          </button>

          <span className="ml-auto font-semibold text-gray-900">${subtotal.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}
