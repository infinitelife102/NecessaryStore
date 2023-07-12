import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { Product, Category } from '@/types';
import { FeaturesSection } from '@/components/features-section';
import { ProductCard } from '@/components/product-card';

function ArrowIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}

async function getFeaturedProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*, vendor:vendors(store_name), category:categories(name)')
    .eq('is_featured', true)
    .eq('is_active', true)
    .order('total_sales', { ascending: false })
    .limit(8);

  if (error) {
    console.error('Error fetching featured products:', error);
    return [];
  }

  return data as Product[];
}

async function getCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .is('parent_id', null)
    .eq('is_active', true)
    .order('sort_order', { ascending: true })
    .limit(8);

  if (error) {
    console.error('Error fetching categories:', error);
    return [];
  }

  return data as Category[];
}

async function getNewArrivals(): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*, vendor:vendors(store_name), category:categories(name)')
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .limit(8);

  if (error) {
    console.error('Error fetching new arrivals:', error);
    return [];
  }

  return data as Product[];
}

export default async function HomePage() {
  const [featuredProducts, categories, newArrivals] = await Promise.all([
    getFeaturedProducts(),
    getCategories(),
    getNewArrivals(),
  ]);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                Discover Amazing Products from{' '}
                <span className="text-yellow-300">Verified Vendors</span>
              </h1>
              <p className="text-lg lg:text-xl text-primary-100 max-w-lg">
                Shop from thousands of trusted sellers worldwide. Find everything you need in one place.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/products"
                  className="inline-flex items-center px-6 py-3 bg-white text-primary-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                >
                  Shop Now
                  <ArrowIcon className="ml-2 h-5 w-5" />
                </Link>
                <Link
                  href="/vendors"
                  className="inline-flex items-center px-6 py-3 border-2 border-white text-white rounded-lg font-semibold hover:bg-white/10 transition-colors"
                >
                  Become a Vendor
                </Link>
              </div>
            </div>
            <div className="hidden lg:block">
              <div className="relative">
                <div className="absolute -inset-4 bg-white/10 rounded-2xl blur-2xl"></div>
                <img
                  src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800"
                  alt="Shopping"
                  className="relative rounded-2xl shadow-2xl"
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
              fill="white"
            />
          </svg>
        </div>
      </section>

      {/* Features Section - client component so lucide icons are not undefined on server */}
      <FeaturesSection />

      {/* Categories Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Shop by Category</h2>
            <Link
              href="/categories"
              className="text-primary-600 hover:text-primary-700 font-medium flex items-center"
            >
              View All
              <ArrowIcon className="ml-1 h-5 w-5" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/categories/${category.slug}`}
                className="group"
              >
                <div className="relative overflow-hidden rounded-xl aspect-square">
                  <img
                    src={category.image_url || 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400'}
                    alt={category.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-white font-semibold text-lg">{category.name}</h3>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Featured Products</h2>
              <p className="text-gray-500 mt-1">Handpicked items just for you</p>
            </div>
            <Link
              href="/products?featured=true"
              className="text-primary-600 hover:text-primary-700 font-medium flex items-center"
            >
              View All
              <ArrowIcon className="ml-1 h-5 w-5" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* New Arrivals Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">New Arrivals</h2>
              <p className="text-gray-500 mt-1">Check out the latest products</p>
            </div>
            <Link
              href="/products?sort=newest"
              className="text-primary-600 hover:text-primary-700 font-medium flex items-center"
            >
              View All
              <ArrowIcon className="ml-1 h-5 w-5" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {newArrivals.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Start Selling on MarketHub Today
          </h2>
          <p className="text-primary-100 text-lg max-w-2xl mx-auto mb-8">
            Join thousands of successful vendors and reach millions of customers worldwide.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/vendor/register"
              className="px-8 py-3 bg-white text-primary-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Become a Vendor
            </Link>
            <Link
              href="/vendor/learn-more"
              className="px-8 py-3 border-2 border-white text-white rounded-lg font-semibold hover:bg-white/10 transition-colors"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
