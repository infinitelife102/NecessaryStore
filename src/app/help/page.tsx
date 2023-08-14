'use client';

import Link from 'next/link';
import { HelpCircle, ShoppingBag, User, Store, CreditCard, Truck, MessageCircle } from 'lucide-react';

export default function HelpPage() {
  const categories = [
    {
      icon: ShoppingBag,
      title: 'Shopping',
      description: 'Learn how to browse, search, and purchase products',
      href: '/faq',
    },
    {
      icon: User,
      title: 'Account',
      description: 'Manage your account settings and preferences',
      href: '/profile',
    },
    {
      icon: Store,
      title: 'Selling',
      description: 'Everything about becoming a vendor and selling products',
      href: '/vendor/learn-more',
    },
    {
      icon: CreditCard,
      title: 'Payments',
      description: 'Information about payment methods and billing',
      href: '/faq',
    },
    {
      icon: Truck,
      title: 'Shipping',
      description: 'Track orders and learn about shipping options',
      href: '/faq',
    },
    {
      icon: MessageCircle,
      title: 'Contact Us',
      description: 'Get in touch with our support team',
      href: '/contact',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <HelpCircle className="h-12 w-12 text-primary-600 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900">Help Center</h1>
          <p className="text-gray-500 mt-2">How can we help you today?</p>
        </div>
      </div>

      {/* Categories */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Link
              key={category.title}
              href={category.href}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                <category.icon className="h-6 w-6 text-primary-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{category.title}</h3>
              <p className="text-gray-500">{category.description}</p>
            </Link>
          ))}
        </div>

        {/* Quick Links */}
        <div className="mt-12 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Popular Topics</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <Link href="/faq" className="text-primary-600 hover:underline">
              How do I track my order?
            </Link>
            <Link href="/faq" className="text-primary-600 hover:underline">
              What is your return policy?
            </Link>
            <Link href="/faq" className="text-primary-600 hover:underline">
              How do I become a vendor?
            </Link>
            <Link href="/faq" className="text-primary-600 hover:underline">
              What payment methods do you accept?
            </Link>
            <Link href="/faq" className="text-primary-600 hover:underline">
              How long does shipping take?
            </Link>
            <Link href="/faq" className="text-primary-600 hover:underline">
              How do I reset my password?
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
