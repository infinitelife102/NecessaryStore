'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { Product, Review } from '@/types';
import {
  Star,
  ShoppingCart,
  Heart,
  Share2,
  Truck,
  Shield,
  RotateCcw,
  Store,
  Check,
  Minus,
  Plus,
} from 'lucide-react';

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [activeTab, setActiveTab] = useState<'description' | 'reviews' | 'shipping'>('description');

  useEffect(() => {
    if (slug) {
      fetchProduct();
    }
  }, [slug]);

  const fetchProduct = async () => {
    setIsLoading(true);
    
    const { data: productData, error: productError } = await supabase
      .from('products')
      .select('*, vendor:vendors(*), category:categories(*)')
      .eq('slug', slug)
      .single();

    if (productError) {
      console.error('Error fetching product:', productError);
      setIsLoading(false);
      return;
    }

    setProduct(productData as Product);

    // Fetch reviews
    const { data: reviewsData } = await supabase
      .from('reviews')
      .select('*, user:profiles(full_name, avatar_url)')
      .eq('product_id', productData.id)
      .eq('is_approved', true)
      .order('created_at', { ascending: false });

    if (reviewsData) {
      setReviews(reviewsData as Review[]);
    }

    setIsLoading(false);
  };

  const handleAddToCart = async () => {
    // Implement cart functionality
    alert(`Added ${quantity} item(s) to cart`);
  };

  const handleToggleWishlist = async () => {
    setIsInWishlist(!isInWishlist);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner border-primary-600 h-12 w-12" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Product not found</h2>
          <p className="text-gray-500 mb-4">The product you are looking for does not exist.</p>
          <Link href="/products" className="btn-primary">
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  const discount = product.compare_at_price
    ? Math.round(((product.compare_at_price - product.price) / product.compare_at_price) * 100)
    : 0;

  const images = product.images.length > 0 ? product.images : [product.featured_image];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center text-sm text-gray-500">
            <Link href="/" className="hover:text-gray-900">Home</Link>
            <span className="mx-2">/</span>
            <Link href="/products" className="hover:text-gray-900">Products</Link>
            <span className="mx-2">/</span>
            {product.category && (
              <>
                <Link href={`/categories/${product.category.slug}`} className="hover:text-gray-900">
                  {product.category.name}
                </Link>
                <span className="mx-2">/</span>
              </>
            )}
            <span className="text-gray-900">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="aspect-square bg-white rounded-xl overflow-hidden border border-gray-200">
              <img
                src={images[selectedImage] || 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600'}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            {images.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                      selectedImage === index ? 'border-primary-600' : 'border-gray-200'
                    }`}
                  >
                    <img
                      src={image ?? ''}
                      alt={`${product.name} - ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <Link
                href={`/vendors/${product.vendor?.store_slug}`}
                className="text-sm text-primary-600 hover:text-primary-700 font-medium"
              >
                {product.vendor?.store_name}
              </Link>
              <h1 className="text-3xl font-bold text-gray-900 mt-2">{product.name}</h1>
              <div className="flex items-center mt-3 space-x-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.floor(product.rating)
                          ? 'text-yellow-400 fill-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                  <span className="ml-2 text-sm text-gray-600">
                    {product.rating.toFixed(1)} ({product.review_count} reviews)
                  </span>
                </div>
                <span className="text-gray-300">|</span>
                <span className="text-sm text-gray-600">{product.total_sales} sold</span>
              </div>
            </div>

            <div className="flex items-baseline space-x-3">
              <span className="text-4xl font-bold text-gray-900">
                ${product.price.toFixed(2)}
              </span>
              {product.compare_at_price && (
                <>
                  <span className="text-xl text-gray-500 line-through">
                    ${product.compare_at_price.toFixed(2)}
                  </span>
                  <span className="bg-red-100 text-red-600 px-2 py-1 rounded text-sm font-medium">
                    Save {discount}%
                  </span>
                </>
              )}
            </div>

            <p className="text-gray-600">{product.short_description}</p>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4 py-4 border-y border-gray-200">
              <div className="flex flex-col items-center text-center">
                <Truck className="h-6 w-6 text-primary-600 mb-1" />
                <span className="text-xs text-gray-600">Free Shipping</span>
              </div>
              <div className="flex flex-col items-center text-center">
                <Shield className="h-6 w-6 text-primary-600 mb-1" />
                <span className="text-xs text-gray-600">Secure Payment</span>
              </div>
              <div className="flex flex-col items-center text-center">
                <RotateCcw className="h-6 w-6 text-primary-600 mb-1" />
                <span className="text-xs text-gray-600">30-Day Returns</span>
              </div>
            </div>

            {/* Quantity and Actions */}
            <div className="space-y-4">
              <div>
                <label className="label">Quantity</label>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-12 text-center font-medium">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                  <span className="text-sm text-gray-500">
                    {product.inventory_quantity} available
                  </span>
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 btn-primary py-4 text-lg"
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Add to Cart
                </button>
                <button
                  onClick={handleToggleWishlist}
                  className={`px-4 py-4 rounded-lg border-2 ${
                    isInWishlist
                      ? 'border-red-500 text-red-500'
                      : 'border-gray-300 text-gray-600 hover:border-gray-400'
                  }`}
                >
                  <Heart className={`h-5 w-5 ${isInWishlist ? 'fill-current' : ''}`} />
                </button>
                <button className="px-4 py-4 rounded-lg border-2 border-gray-300 text-gray-600 hover:border-gray-400">
                  <Share2 className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Vendor Info */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                  <Store className="h-6 w-6 text-primary-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{product.vendor?.store_name}</p>
                  <p className="text-sm text-gray-500">Verified Vendor</p>
                </div>
                <Link
                  href={`/vendors/${product.vendor?.store_slug}`}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-white"
                >
                  View Store
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-12">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8">
              {(['description', 'reviews', 'shipping'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm capitalize ${
                    activeTab === tab
                      ? 'border-primary-600 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab}
                  {tab === 'reviews' && ` (${reviews.length})`}
                </button>
              ))}
            </nav>
          </div>

          <div className="py-8">
            {activeTab === 'description' && (
              <div className="prose max-w-none">
                <p className="text-gray-600 whitespace-pre-line">{product.description}</p>
                {product.attributes && Object.keys(product.attributes).length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-4">Product Specifications</h3>
                    <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {Object.entries(product.attributes).map(([key, value]) => (
                        <div key={key} className="flex">
                          <dt className="w-1/3 text-gray-500 capitalize">{key}:</dt>
                          <dd className="w-2/3 text-gray-900">{value as string}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-6">
                {reviews.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">
                    No reviews yet. Be the first to review this product!
                  </p>
                ) : (
                  reviews.map((review) => (
                    <div key={review.id} className="border-b border-gray-200 pb-6">
                      <div className="flex items-start space-x-4">
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                          {review.user?.avatar_url ? (
                            <img
                              src={review.user?.avatar_url ?? ''}
                              alt={review.user.full_name || ''}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                          ) : (
                            <span className="text-gray-600 font-medium">
                              {review.user?.full_name?.charAt(0) || 'U'}
                            </span>
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <span className="font-medium text-gray-900">
                              {review.user?.full_name || 'Anonymous'}
                            </span>
                            {review.is_verified_purchase && (
                              <span className="flex items-center text-xs text-green-600">
                                <Check className="h-3 w-3 mr-1" />
                                Verified Purchase
                              </span>
                            )}
                          </div>
                          <div className="flex items-center mt-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < review.rating
                                    ? 'text-yellow-400 fill-yellow-400'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                          <p className="text-gray-600 mt-2">{review.content}</p>
                          <p className="text-sm text-gray-400 mt-2">
                            {new Date(review.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === 'shipping' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Shipping Information</h3>
                  <p className="text-gray-600">
                    We offer free standard shipping on all orders over $50. Orders are typically
                    processed within 1-2 business days and delivered within 5-7 business days.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Return Policy</h3>
                  <p className="text-gray-600">
                    We accept returns within 30 days of delivery. Items must be in original
                    condition with all tags attached. Return shipping is free for defective
                    items.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
