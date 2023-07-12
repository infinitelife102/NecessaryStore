'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { Vendor } from '@/types';
import { Store, Star, Package, CheckCircle } from 'lucide-react';

export default function VendorsPage() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async () => {
    const { data, error } = await supabase
      .from('vendors')
      .select('*')
      .eq('is_active', true)
      .eq('is_verified', true)
      .order('total_sales', { ascending: false });

    if (data) {
      setVendors(data as Vendor[]);
    }
    setIsLoading(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner border-primary-600 h-12 w-12" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-4xl font-bold text-gray-900">Our Vendors</h1>
          <p className="text-gray-500 mt-2 text-lg">
            Discover unique products from our verified sellers
          </p>
        </div>
      </div>

      {/* Vendors Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vendors.map((vendor) => (
            <Link
              key={vendor.id}
              href={`/vendors/${vendor.store_slug}`}
              className="group"
            >
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                {/* Banner */}
                <div className="h-32 bg-gradient-to-r from-primary-500 to-primary-700 relative">
                  {vendor.store_banner && (
                    <img
                      src={vendor.store_banner}
                      alt={`${vendor.store_name} banner`}
                      className="w-full h-full object-cover"
                    />
                  )}
                  <div className="absolute -bottom-10 left-6">
                    <div className="w-20 h-20 bg-white rounded-xl shadow-md flex items-center justify-center overflow-hidden">
                      {vendor.store_logo ? (
                        <img
                          src={vendor.store_logo}
                          alt={vendor.store_name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Store className="h-10 w-10 text-primary-600" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="pt-12 pb-6 px-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="text-xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors">
                        {vendor.store_name}
                      </h2>
                      {vendor.is_verified && (
                        <span className="inline-flex items-center text-xs text-green-600 mt-1">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Verified Vendor
                        </span>
                      )}
                    </div>
                  </div>

                  <p className="text-gray-500 text-sm mt-3 line-clamp-2">
                    {vendor.store_description || 'No description available'}
                  </p>

                  <div className="flex items-center mt-4 space-x-4 text-sm text-gray-500">
                    <span className="flex items-center">
                      <Package className="h-4 w-4 mr-1" />
                      {vendor.total_sales} sales
                    </span>
                    <span className="flex items-center">
                      <Star className="h-4 w-4 mr-1 text-yellow-400" />
                      4.5 rating
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-primary-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Want to Sell on MarketHub?
          </h2>
          <p className="text-primary-100 text-lg max-w-2xl mx-auto mb-8">
            Join thousands of successful vendors and reach millions of customers worldwide.
          </p>
          <Link
            href="/vendor/register"
            className="inline-block px-8 py-3 bg-white text-primary-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Become a Vendor
          </Link>
        </div>
      </div>
    </div>
  );
}
