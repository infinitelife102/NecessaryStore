'use client';

import Link from 'next/link';
import { StarIcon } from './icons';
import type { Product } from '@/types';

export function ProductCard({ product }: { product: Product }) {
  const discount = product.compare_at_price
    ? Math.round(((product.compare_at_price - product.price) / product.compare_at_price) * 100)
    : 0;

  return (
    <Link href={`/products/${product.slug}`} className="group">
      <div className="card-hover">
        <div className="relative aspect-square overflow-hidden">
          <img
            src={product.featured_image || product.images?.[0] || 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400'}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          {discount > 0 && (
            <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
              -{discount}%
            </div>
          )}
          {product.is_featured && (
            <div className="absolute top-2 right-2 bg-primary-600 text-white text-xs font-bold px-2 py-1 rounded">
              Featured
            </div>
          )}
        </div>
        <div className="p-4">
          <p className="text-xs text-gray-500 mb-1">{product.vendor?.store_name}</p>
          <h3 className="font-medium text-gray-900 line-clamp-2 mb-2 group-hover:text-primary-600 transition-colors">
            {product.name}
          </h3>
          <div className="flex items-center mb-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <StarIcon
                  key={i}
                  className={`h-4 w-4 ${
                    i < Math.floor(product.rating)
                      ? 'text-yellow-400 fill-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-gray-500 ml-1">({product.review_count})</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-lg font-bold text-gray-900">
              ${product.price.toFixed(2)}
            </span>
            {product.compare_at_price && (
              <span className="text-sm text-gray-500 line-through">
                ${product.compare_at_price.toFixed(2)}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
