'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Product, Category } from '@/types';
import {
  Search,
  Filter,
  ChevronDown,
  Star,
  Grid3X3,
  List,
  SlidersHorizontal,
} from 'lucide-react';

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);

  // Filter states
  const [selectedCategory, setSelectedCategory] = useState<string>(
    searchParams.get('category') || ''
  );
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000]);
  const [minRating, setMinRating] = useState<number>(0);
  const [sortBy, setSortBy] = useState<string>(
    searchParams.get('sort') || 'newest'
  );
  const [searchQuery, setSearchQuery] = useState<string>(
    searchParams.get('search') || ''
  );

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, [selectedCategory, sortBy, searchQuery]);

  const fetchCategories = async () => {
    const { data } = await supabase
      .from('categories')
      .select('*')
      .is('parent_id', null)
      .eq('is_active', true)
      .order('sort_order');

    if (data) {
      setCategories(data as Category[]);
    }
  };

  const fetchProducts = async () => {
    setIsLoading(true);
    let query = supabase
      .from('products')
      .select('*, vendor:vendors(store_name), category:categories(name)')
      .eq('is_active', true);

    if (selectedCategory) {
      query = query.eq('category_id', selectedCategory);
    }

    if (searchQuery) {
      query = query.ilike('name', `%${searchQuery}%`);
    }

    switch (sortBy) {
      case 'price_asc':
        query = query.order('price', { ascending: true });
        break;
      case 'price_desc':
        query = query.order('price', { ascending: false });
        break;
      case 'popular':
        query = query.order('total_sales', { ascending: false });
        break;
      case 'rating':
        query = query.order('rating', { ascending: false });
        break;
      case 'newest':
      default:
        query = query.order('created_at', { ascending: false });
    }

    const { data, error } = await query;

    if (data) {
      let filtered = data as Product[];
      
      // Client-side price filtering
      filtered = filtered.filter(
        (p) => p.price >= priceRange[0] && p.price <= priceRange[1]
      );
      
      // Client-side rating filtering
      if (minRating > 0) {
        filtered = filtered.filter((p) => p.rating >= minRating);
      }

      setProducts(filtered);
    }

    setIsLoading(false);
  };

  const applyFilters = () => {
    fetchProducts();
  };

  const clearFilters = () => {
    setSelectedCategory('');
    setPriceRange([0, 5000]);
    setMinRating(0);
    setSearchQuery('');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">All Products</h1>
          <p className="text-gray-500 mt-1">
            Discover {products.length} amazing products from our vendors
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div
            className={`lg:w-64 ${
              showFilters ? 'block' : 'hidden lg:block'
            }`}
          >
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">Filters</h3>
                <button
                  onClick={clearFilters}
                  className="text-sm text-primary-600 hover:text-primary-700"
                >
                  Clear all
                </button>
              </div>

              {/* Categories */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Categories</h4>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="category"
                      checked={selectedCategory === ''}
                      onChange={() => setSelectedCategory('')}
                      className="h-4 w-4 text-primary-600"
                    />
                    <span className="ml-2 text-sm text-gray-600">All Categories</span>
                  </label>
                  {categories.map((category) => (
                    <label key={category.id} className="flex items-center">
                      <input
                        type="radio"
                        name="category"
                        checked={selectedCategory === category.id}
                        onChange={() => setSelectedCategory(category.id)}
                        className="h-4 w-4 text-primary-600"
                      />
                      <span className="ml-2 text-sm text-gray-600">
                        {category.name}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Price Range</h4>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    value={priceRange[0]}
                    onChange={(e) =>
                      setPriceRange([Number(e.target.value), priceRange[1]])
                    }
                    className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                    placeholder="Min"
                  />
                  <span className="text-gray-500">-</span>
                  <input
                    type="number"
                    value={priceRange[1]}
                    onChange={(e) =>
                      setPriceRange([priceRange[0], Number(e.target.value)])
                    }
                    className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                    placeholder="Max"
                  />
                </div>
              </div>

              {/* Rating */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Minimum Rating</h4>
                <div className="space-y-2">
                  {[4, 3, 2, 1].map((rating) => (
                    <label key={rating} className="flex items-center">
                      <input
                        type="radio"
                        name="rating"
                        checked={minRating === rating}
                        onChange={() => setMinRating(rating)}
                        className="h-4 w-4 text-primary-600"
                      />
                      <span className="ml-2 flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < rating
                                ? 'text-yellow-400 fill-yellow-400'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                        <span className="ml-1 text-sm text-gray-600">& Up</span>
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <button
                onClick={applyFilters}
                className="w-full btn-primary py-2"
              >
                Apply Filters
              </button>
            </div>
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                {/* Search */}
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search products..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <div className="flex items-center space-x-4">
                  {/* Mobile Filter Button */}
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="lg:hidden flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    <Filter className="h-5 w-5" />
                    <span>Filters</span>
                  </button>

                  {/* Sort */}
                  <div className="relative">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-10 focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="newest">Newest First</option>
                      <option value="price_asc">Price: Low to High</option>
                      <option value="price_desc">Price: High to Low</option>
                      <option value="popular">Most Popular</option>
                      <option value="rating">Highest Rated</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                  </div>

                  {/* View Mode */}
                  <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 ${
                        viewMode === 'grid'
                          ? 'bg-primary-600 text-white'
                          : 'bg-white text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <Grid3X3 className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 ${
                        viewMode === 'list'
                          ? 'bg-primary-600 text-white'
                          : 'bg-white text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <List className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Products */}
            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <div className="spinner border-primary-600" />
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-20">
                <SlidersHorizontal className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No products found
                </h3>
                <p className="text-gray-500">
                  Try adjusting your filters or search query
                </p>
              </div>
            ) : (
              <div
                className={
                  viewMode === 'grid'
                    ? 'grid grid-cols-2 md:grid-cols-3 gap-6'
                    : 'space-y-4'
                }
              >
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    viewMode={viewMode}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ProductCard({
  product,
  viewMode,
}: {
  product: Product;
  viewMode: 'grid' | 'list';
}) {
  const discount = product.compare_at_price
    ? Math.round(
        ((product.compare_at_price - product.price) / product.compare_at_price) *
          100
      )
    : 0;

  if (viewMode === 'list') {
    return (
      <Link href={`/products/${product.slug}`} className="group">
        <div className="card-hover flex flex-col sm:flex-row">
          <div className="relative w-full sm:w-48 h-48 flex-shrink-0 overflow-hidden">
            <img
              src={
                product.featured_image ||
                product.images[0] ||
                'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400'
              }
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            {discount > 0 && (
              <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                -{discount}%
              </div>
            )}
          </div>
          <div className="flex-1 p-4">
            <p className="text-xs text-gray-500 mb-1">
              {product.vendor?.store_name}
            </p>
            <h3 className="font-medium text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
              {product.name}
            </h3>
            <p className="text-sm text-gray-500 line-clamp-2 mb-3">
              {product.short_description}
            </p>
            <div className="flex items-center mb-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < Math.floor(product.rating)
                        ? 'text-yellow-400 fill-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs text-gray-500 ml-1">
                ({product.review_count})
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-xl font-bold text-gray-900">
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

  return (
    <Link href={`/products/${product.slug}`} className="group">
      <div className="card-hover">
        <div className="relative aspect-square overflow-hidden">
          <img
            src={
              product.featured_image ||
              product.images[0] ||
              'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400'
            }
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
          <p className="text-xs text-gray-500 mb-1">
            {product.vendor?.store_name}
          </p>
          <h3 className="font-medium text-gray-900 line-clamp-2 mb-2 group-hover:text-primary-600 transition-colors">
            {product.name}
          </h3>
          <div className="flex items-center mb-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < Math.floor(product.rating)
                      ? 'text-yellow-400 fill-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-gray-500 ml-1">
              ({product.review_count})
            </span>
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
