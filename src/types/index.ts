// =====================================================
// Type Definitions for Multi-Vendor E-Commerce Platform
// =====================================================

// User & Profile Types
export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  phone: string | null;
  address: Address | null;
  role: 'customer' | 'vendor' | 'admin';
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
}

// Vendor Types
export interface Vendor {
  id: string;
  user_id: string;
  store_name: string;
  store_slug: string;
  store_description: string | null;
  store_logo: string | null;
  store_banner: string | null;
  business_email: string | null;
  business_phone: string | null;
  business_address: Address | null;
  commission_rate: number;
  is_verified: boolean;
  is_active: boolean;
  total_sales: number;
  total_revenue: number;
  created_at: string;
  updated_at: string;
}

// Category Types
export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  parent_id: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  children?: Category[];
}

// Product Types
export interface Product {
  id: string;
  vendor_id: string;
  category_id: string | null;
  name: string;
  slug: string;
  description: string | null;
  short_description: string | null;
  price: number;
  compare_at_price: number | null;
  cost_price: number | null;
  sku: string | null;
  barcode: string | null;
  inventory_quantity: number;
  inventory_policy: 'allow' | 'deny';
  weight: number | null;
  dimensions: Dimensions | null;
  images: string[];
  featured_image: string | null;
  attributes: Record<string, any>;
  tags: string[];
  rating: number;
  review_count: number;
  total_sales: number;
  is_featured: boolean;
  is_active: boolean;
  seo_title: string | null;
  seo_description: string | null;
  created_at: string;
  updated_at: string;
  vendor?: Vendor;
  category?: Category;
  variants?: ProductVariant[];
  reviews?: Review[];
}

export interface Dimensions {
  length: number;
  width: number;
  height: number;
}

export interface ProductVariant {
  id: string;
  product_id: string;
  title: string;
  price: number;
  compare_at_price: number | null;
  sku: string | null;
  barcode: string | null;
  inventory_quantity: number;
  options: Record<string, any>;
  image_url: string | null;
  is_active: boolean;
  created_at: string;
}

// Review Types
export interface Review {
  id: string;
  product_id: string;
  user_id: string;
  order_id: string | null;
  rating: number;
  title: string | null;
  content: string | null;
  is_verified_purchase: boolean;
  helpful_count: number;
  is_approved: boolean;
  created_at: string;
  updated_at: string;
  user?: Profile;
}

// Cart Types
export interface Cart {
  id: string;
  user_id: string | null;
  session_id: string | null;
  items: CartItem[];
  subtotal: number;
  tax_amount: number;
  shipping_amount: number;
  total_amount: number;
  created_at: string;
  updated_at: string;
}

export interface CartItem {
  id: string;
  product_id: string;
  variant_id: string | null;
  quantity: number;
  price: number;
  product?: Product;
  variant?: ProductVariant;
}

// Order Types
export interface Order {
  id: string;
  order_number: string;
  user_id: string | null;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded' | 'partially_refunded';
  fulfillment_status: 'unfulfilled' | 'partial' | 'fulfilled';
  currency: string;
  subtotal: number;
  tax_amount: number;
  shipping_amount: number;
  discount_amount: number;
  total_amount: number;
  shipping_address: Address | null;
  billing_address: Address | null;
  customer_email: string | null;
  customer_phone: string | null;
  customer_name: string | null;
  notes: string | null;
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
  items?: OrderItem[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string | null;
  variant_id: string | null;
  vendor_id: string | null;
  product_name: string;
  variant_title: string | null;
  sku: string | null;
  quantity: number;
  price: number;
  total: number;
  commission_amount: number;
  vendor_payout: number;
  created_at: string;
  product?: Product;
}

// Subscription Types
export interface Subscription {
  id: string;
  user_id: string;
  stripe_subscription_id: string | null;
  stripe_customer_id: string | null;
  plan_type: 'basic' | 'premium' | 'enterprise';
  status: 'active' | 'cancelled' | 'past_due' | 'unpaid' | 'paused';
  current_period_start: string | null;
  current_period_end: string | null;
  cancel_at_period_end: boolean;
  created_at: string;
  updated_at: string;
}

// Payment Types
export interface Payment {
  id: string;
  order_id: string | null;
  user_id: string | null;
  stripe_payment_intent_id: string | null;
  stripe_charge_id: string | null;
  amount: number;
  currency: string;
  status: 'pending' | 'succeeded' | 'failed' | 'refunded';
  payment_method: string | null;
  metadata: Record<string, any>;
  created_at: string;
}

// Wishlist Types
export interface Wishlist {
  id: string;
  user_id: string;
  product_id: string;
  created_at: string;
  product?: Product;
}

// Coupon Types
export interface Coupon {
  id: string;
  code: string;
  description: string | null;
  discount_type: 'percentage' | 'fixed_amount';
  discount_value: number;
  minimum_order_amount: number;
  maximum_discount_amount: number | null;
  usage_limit: number | null;
  usage_count: number;
  starts_at: string | null;
  expires_at: string | null;
  is_active: boolean;
  created_at: string;
}

// Analytics Types
export interface Analytics {
  id: string;
  date: string;
  vendor_id: string | null;
  total_orders: number;
  total_sales: number;
  total_revenue: number;
  total_commission: number;
  new_customers: number;
  returning_customers: number;
  created_at: string;
}

// AI Generated Content Types
export interface AIGeneratedContent {
  id: string;
  product_id: string;
  content_type: 'description' | 'review_summary' | 'seo_title' | 'seo_description';
  content: string;
  prompt: string | null;
  model: string | null;
  created_at: string;
}

// API Response Types
export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}

// Filter Types
export interface ProductFilter {
  category?: string;
  vendor?: string;
  min_price?: number;
  max_price?: number;
  rating?: number;
  search?: string;
  sort_by?: 'price_asc' | 'price_desc' | 'newest' | 'popular' | 'rating';
  page?: number;
  per_page?: number;
}

// Dashboard Types
export interface DashboardStats {
  total_revenue: number;
  total_orders: number;
  total_customers: number;
  total_products: number;
  revenue_change: number;
  orders_change: number;
  customers_change: number;
  products_change: number;
}

export interface SalesChartData {
  labels: string[];
  revenue: number[];
  orders: number[];
}

export interface RecentOrder {
  id: string;
  order_number: string;
  customer_name: string;
  total_amount: number;
  status: string;
  created_at: string;
}

// Form Types
export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  email: string;
  password: string;
  full_name: string;
}

export interface ProductFormData {
  name: string;
  description: string;
  short_description: string;
  price: number;
  compare_at_price: number;
  inventory_quantity: number;
  category_id: string;
  images: string[];
  tags: string[];
  is_active: boolean;
}

export interface VendorFormData {
  store_name: string;
  store_description: string;
  business_email: string;
  business_phone: string;
  business_address: Address;
}
