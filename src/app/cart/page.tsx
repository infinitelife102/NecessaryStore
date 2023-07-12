'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/components/providers';
import { CartItem } from '@/types';
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  Package,
  Truck,
  Shield,
} from 'lucide-react';

export default function CartPage() {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchCart();
  }, [user]);

  const fetchCart = async () => {
    if (!user) {
      // Load from localStorage for guest users
      const guestCart = localStorage.getItem('guestCart');
      if (guestCart) {
        setCartItems(JSON.parse(guestCart));
      }
      setIsLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from('carts')
      .select('items')
      .eq('user_id', user.id)
      .single();

    if (data) {
      setCartItems(data.items as CartItem[]);
    }
    setIsLoading(false);
  };

  const updateQuantity = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;

    const updatedItems = cartItems.map((item) =>
      item.id === itemId ? { ...item, quantity: newQuantity } : item
    );

    setCartItems(updatedItems);

    if (user) {
      await supabase
        .from('carts')
        .update({ items: updatedItems })
        .eq('user_id', user.id);
    } else {
      localStorage.setItem('guestCart', JSON.stringify(updatedItems));
    }
  };

  const removeItem = async (itemId: string) => {
    const updatedItems = cartItems.filter((item) => item.id !== itemId);
    setCartItems(updatedItems);

    if (user) {
      await supabase
        .from('carts')
        .update({ items: updatedItems })
        .eq('user_id', user.id);
    } else {
      localStorage.setItem('guestCart', JSON.stringify(updatedItems));
    }
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shipping = subtotal > 50 ? 0 : 15;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner border-primary-600 h-12 w-12" />
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ShoppingCart className="h-24 w-24 text-gray-300 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Your cart is empty
          </h2>
          <p className="text-gray-500 mb-6">
            Looks like you haven&apos;t added anything to your cart yet.
          </p>
          <Link href="/products" className="btn-primary">
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-2xl font-bold text-gray-900">Shopping Cart</h1>
          <p className="text-gray-500 mt-1">
            {cartItems.length} item(s) in your cart
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-4"
              >
                <div className="flex items-start space-x-4">
                  <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={
                        item.product?.featured_image ||
                        item.product?.images[0] ||
                        'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=200'
                      }
                      alt={item.product?.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <Link
                      href={`/products/${item.product?.slug}`}
                      className="font-medium text-gray-900 hover:text-primary-600"
                    >
                      {item.product?.name}
                    </Link>
                    {item.variant && (
                      <p className="text-sm text-gray-500 mt-1">
                        {item.variant.title}
                      </p>
                    )}
                    <p className="text-sm text-gray-500">
                      {item.product?.vendor?.store_name}
                    </p>
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                          className="w-8 h-8 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="w-8 text-center font-medium">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                          className="w-8 h-8 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className="font-semibold text-gray-900">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-red-500 hover:text-red-600"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-24">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Order Summary
              </h2>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">
                    {shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax (8%)</span>
                  <span className="font-medium">${tax.toFixed(2)}</span>
                </div>
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between">
                    <span className="font-semibold text-gray-900">Total</span>
                    <span className="font-bold text-xl text-gray-900">
                      ${total.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              <Link
                href="/checkout"
                className="w-full btn-primary py-3 mt-6 flex items-center justify-center"
              >
                Proceed to Checkout
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>

              <div className="mt-6 space-y-3">
                <div className="flex items-center text-sm text-gray-500">
                  <Truck className="h-4 w-4 mr-2" />
                  Free shipping on orders over $50
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <Shield className="h-4 w-4 mr-2" />
                  Secure checkout
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <Package className="h-4 w-4 mr-2" />
                  30-day returns
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
