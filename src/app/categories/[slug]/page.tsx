import Link from 'next/link';
import { notFound } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { ProductCard } from '@/components/product-card';
import type { Category, Product } from '@/types';
import { ArrowLeftIcon } from '@/components/icons';

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .maybeSingle();

  if (error || !data) return null;
  return data as Category;
}

async function getChildCategoryIds(parentId: string): Promise<string[]> {
  const { data } = await supabase
    .from('categories')
    .select('id')
    .eq('parent_id', parentId)
    .eq('is_active', true);
  return (data || []).map((r) => r.id);
}

async function getProductsForCategory(categoryIds: string[]): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*, vendor:vendors(store_name), category:categories(name, slug)')
    .eq('is_active', true)
    .in('category_id', categoryIds)
    .order('total_sales', { ascending: false });

  if (error) return [];
  return (data as Product[]) || [];
}

export default async function CategorySlugPage({ params }: PageProps) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) notFound();

  const childIds = category.parent_id == null ? await getChildCategoryIds(category.id) : [];
  const productCategoryIds = childIds.length > 0 ? childIds : [category.id];
  const products = await getProductsForCategory(productCategoryIds);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link
            href="/categories"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4 font-medium"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            All Categories
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">{category.name}</h1>
          {category.description && (
            <p className="text-gray-500 mt-2 text-lg max-w-3xl">{category.description}</p>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {products.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
            <p className="text-gray-500 text-lg">No products in this category yet.</p>
            <Link
              href="/products"
              className="mt-4 inline-block text-primary-600 hover:text-primary-700 font-medium"
            >
              Browse all products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
