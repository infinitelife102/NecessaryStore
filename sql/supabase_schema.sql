-- =====================================================
-- Multi-Vendor E-Commerce Platform - Supabase Schema
-- =====================================================
-- Safe to re-run: drops existing app tables first (in dependency order),
-- then recreates everything. Does not touch auth.users.

-- =====================================================
-- DROP EXISTING TABLES (order: dependents first)
-- =====================================================
DROP TABLE IF EXISTS ai_generated_content CASCADE;
DROP TABLE IF EXISTS analytics CASCADE;
DROP TABLE IF EXISTS wishlists CASCADE;
DROP TABLE IF EXISTS payments CASCADE;
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS subscriptions CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS carts CASCADE;
DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS product_variants CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS vendors CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;
DROP TABLE IF EXISTS coupons CASCADE;

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- PROFILES TABLE (extends auth.users)
-- =====================================================
CREATE TABLE profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    phone TEXT,
    address JSONB,
    role TEXT DEFAULT 'customer' CHECK (role IN ('customer', 'vendor', 'admin')),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- =====================================================
-- VENDORS TABLE
-- =====================================================
CREATE TABLE vendors (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE UNIQUE NOT NULL,
    store_name TEXT NOT NULL,
    store_slug TEXT UNIQUE NOT NULL,
    store_description TEXT,
    store_logo TEXT,
    store_banner TEXT,
    business_email TEXT,
    business_phone TEXT,
    business_address JSONB,
    commission_rate DECIMAL(5,2) DEFAULT 10.00,
    is_verified BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    total_sales INTEGER DEFAULT 0,
    total_revenue DECIMAL(12,2) DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- =====================================================
-- CATEGORIES TABLE
-- =====================================================
CREATE TABLE categories (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    image_url TEXT,
    parent_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- =====================================================
-- PRODUCTS TABLE
-- =====================================================
CREATE TABLE products (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    vendor_id UUID REFERENCES vendors(id) ON DELETE CASCADE NOT NULL,
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    short_description TEXT,
    price DECIMAL(10,2) NOT NULL,
    compare_at_price DECIMAL(10,2),
    cost_price DECIMAL(10,2),
    sku TEXT,
    barcode TEXT,
    inventory_quantity INTEGER DEFAULT 0,
    inventory_policy TEXT DEFAULT 'deny' CHECK (inventory_policy IN ('allow', 'deny')),
    weight DECIMAL(8,2),
    dimensions JSONB,
    images TEXT[] DEFAULT '{}',
    featured_image TEXT,
    attributes JSONB DEFAULT '{}',
    tags TEXT[] DEFAULT '{}',
    rating DECIMAL(2,1) DEFAULT 0.0,
    review_count INTEGER DEFAULT 0,
    total_sales INTEGER DEFAULT 0,
    is_featured BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    seo_title TEXT,
    seo_description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- =====================================================
-- PRODUCT VARIANTS TABLE
-- =====================================================
CREATE TABLE product_variants (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    compare_at_price DECIMAL(10,2),
    sku TEXT,
    barcode TEXT,
    inventory_quantity INTEGER DEFAULT 0,
    options JSONB DEFAULT '{}',
    image_url TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- =====================================================
-- REVIEWS TABLE
-- =====================================================
CREATE TABLE reviews (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    order_id UUID,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title TEXT,
    content TEXT,
    is_verified_purchase BOOLEAN DEFAULT false,
    helpful_count INTEGER DEFAULT 0,
    is_approved BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    UNIQUE(product_id, user_id)
);

-- =====================================================
-- CARTS TABLE
-- =====================================================
CREATE TABLE carts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    session_id TEXT,
    items JSONB DEFAULT '[]',
    subtotal DECIMAL(10,2) DEFAULT 0.00,
    tax_amount DECIMAL(10,2) DEFAULT 0.00,
    shipping_amount DECIMAL(10,2) DEFAULT 0.00,
    total_amount DECIMAL(10,2) DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    UNIQUE(user_id)
);

-- =====================================================
-- ORDERS TABLE
-- =====================================================
CREATE TABLE orders (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    order_number TEXT UNIQUE NOT NULL,
    user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded')),
    payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded', 'partially_refunded')),
    fulfillment_status TEXT DEFAULT 'unfulfilled' CHECK (fulfillment_status IN ('unfulfilled', 'partial', 'fulfilled')),
    currency TEXT DEFAULT 'USD',
    subtotal DECIMAL(10,2) NOT NULL,
    tax_amount DECIMAL(10,2) DEFAULT 0.00,
    shipping_amount DECIMAL(10,2) DEFAULT 0.00,
    discount_amount DECIMAL(10,2) DEFAULT 0.00,
    total_amount DECIMAL(10,2) NOT NULL,
    shipping_address JSONB,
    billing_address JSONB,
    customer_email TEXT,
    customer_phone TEXT,
    customer_name TEXT,
    notes TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- =====================================================
-- ORDER ITEMS TABLE
-- =====================================================
CREATE TABLE order_items (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE NOT NULL,
    product_id UUID REFERENCES products(id) ON DELETE SET NULL,
    variant_id UUID REFERENCES product_variants(id) ON DELETE SET NULL,
    vendor_id UUID REFERENCES vendors(id) ON DELETE SET NULL,
    product_name TEXT NOT NULL,
    variant_title TEXT,
    sku TEXT,
    quantity INTEGER NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    total DECIMAL(10,2) NOT NULL,
    commission_amount DECIMAL(10,2) DEFAULT 0.00,
    vendor_payout DECIMAL(10,2) DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- =====================================================
-- SUBSCRIPTIONS TABLE
-- =====================================================
CREATE TABLE subscriptions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    stripe_subscription_id TEXT UNIQUE,
    stripe_customer_id TEXT,
    plan_type TEXT NOT NULL CHECK (plan_type IN ('basic', 'premium', 'enterprise')),
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'past_due', 'unpaid', 'paused')),
    current_period_start TIMESTAMP WITH TIME ZONE,
    current_period_end TIMESTAMP WITH TIME ZONE,
    cancel_at_period_end BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- =====================================================
-- PAYMENTS TABLE
-- =====================================================
CREATE TABLE payments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
    user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    stripe_payment_intent_id TEXT,
    stripe_charge_id TEXT,
    amount DECIMAL(10,2) NOT NULL,
    currency TEXT DEFAULT 'USD',
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'succeeded', 'failed', 'refunded')),
    payment_method TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- =====================================================
-- WISHLISTS TABLE
-- =====================================================
CREATE TABLE wishlists (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    UNIQUE(user_id, product_id)
);

-- =====================================================
-- COUPONS TABLE
-- =====================================================
CREATE TABLE coupons (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    code TEXT UNIQUE NOT NULL,
    description TEXT,
    discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'fixed_amount')),
    discount_value DECIMAL(10,2) NOT NULL,
    minimum_order_amount DECIMAL(10,2) DEFAULT 0.00,
    maximum_discount_amount DECIMAL(10,2),
    usage_limit INTEGER,
    usage_count INTEGER DEFAULT 0,
    starts_at TIMESTAMP WITH TIME ZONE,
    expires_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- =====================================================
-- ANALYTICS TABLE
-- =====================================================
CREATE TABLE analytics (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    date DATE NOT NULL,
    vendor_id UUID REFERENCES vendors(id) ON DELETE CASCADE,
    total_orders INTEGER DEFAULT 0,
    total_sales DECIMAL(12,2) DEFAULT 0.00,
    total_revenue DECIMAL(12,2) DEFAULT 0.00,
    total_commission DECIMAL(12,2) DEFAULT 0.00,
    new_customers INTEGER DEFAULT 0,
    returning_customers INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    UNIQUE(date, vendor_id)
);

-- =====================================================
-- AI GENERATED CONTENT TABLE
-- =====================================================
CREATE TABLE ai_generated_content (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    content_type TEXT NOT NULL CHECK (content_type IN ('description', 'review_summary', 'seo_title', 'seo_description')),
    content TEXT NOT NULL,
    prompt TEXT,
    model TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- =====================================================
-- INDEXES
-- =====================================================
CREATE INDEX idx_products_vendor_id ON products(vendor_id);
CREATE INDEX idx_products_category_id ON products(category_id);
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_is_active ON products(is_active);
CREATE INDEX idx_products_is_featured ON products(is_featured);
CREATE INDEX idx_products_price ON products(price);
CREATE INDEX idx_products_created_at ON products(created_at);

CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at);

CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_product_id ON order_items(product_id);
CREATE INDEX idx_order_items_vendor_id ON order_items(vendor_id);

CREATE INDEX idx_reviews_product_id ON reviews(product_id);
CREATE INDEX idx_reviews_user_id ON reviews(user_id);
CREATE INDEX idx_reviews_rating ON reviews(rating);

CREATE INDEX idx_vendors_user_id ON vendors(user_id);
CREATE INDEX idx_vendors_store_slug ON vendors(store_slug);

CREATE INDEX idx_categories_parent_id ON categories(parent_id);

-- =====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE carts ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_generated_content ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone" ON profiles
    FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile" ON profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id);

-- Vendors policies
CREATE POLICY "Vendors are viewable by everyone" ON vendors
    FOR SELECT USING (is_active = true);

CREATE POLICY "Users can create their own vendor profile" ON vendors
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Vendors can update their own profile" ON vendors
    FOR UPDATE USING (auth.uid() = user_id);

-- Products policies
CREATE POLICY "Active products are viewable by everyone" ON products
    FOR SELECT USING (is_active = true);

CREATE POLICY "Vendors can create products" ON products
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM vendors 
            WHERE vendors.id = products.vendor_id 
            AND vendors.user_id = auth.uid()
        )
    );

CREATE POLICY "Vendors can update their own products" ON products
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM vendors 
            WHERE vendors.id = products.vendor_id 
            AND vendors.user_id = auth.uid()
        )
    );

CREATE POLICY "Vendors can delete their own products" ON products
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM vendors 
            WHERE vendors.id = products.vendor_id 
            AND vendors.user_id = auth.uid()
        )
    );

-- Reviews policies
CREATE POLICY "Approved reviews are viewable by everyone" ON reviews
    FOR SELECT USING (is_approved = true);

CREATE POLICY "Users can create reviews" ON reviews
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reviews" ON reviews
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reviews" ON reviews
    FOR DELETE USING (auth.uid() = user_id);

-- Carts policies
CREATE POLICY "Users can view their own cart" ON carts
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own cart" ON carts
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own cart" ON carts
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own cart" ON carts
    FOR DELETE USING (auth.uid() = user_id);

-- Orders policies
CREATE POLICY "Users can view their own orders" ON orders
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create orders" ON orders
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Wishlists policies
CREATE POLICY "Users can view their own wishlist" ON wishlists
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can add to their wishlist" ON wishlists
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove from their wishlist" ON wishlists
    FOR DELETE USING (auth.uid() = user_id);

-- Subscriptions policies
CREATE POLICY "Users can view their own subscriptions" ON subscriptions
    FOR SELECT USING (auth.uid() = user_id);

-- =====================================================
-- FUNCTIONS & TRIGGERS
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_vendors_updated_at BEFORE UPDATE ON vendors
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_product_variants_updated_at BEFORE UPDATE ON product_variants
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON reviews
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_carts_updated_at BEFORE UPDATE ON carts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON subscriptions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to generate order number
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TEXT AS $$
DECLARE
    new_order_number TEXT;
BEGIN
    new_order_number := 'ORD-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0');
    RETURN new_order_number;
END;
$$ LANGUAGE plpgsql;

-- Function to update product rating when review is added/updated
CREATE OR REPLACE FUNCTION update_product_rating()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE products
    SET 
        rating = (SELECT AVG(rating)::DECIMAL(2,1) FROM reviews WHERE product_id = COALESCE(NEW.product_id, OLD.product_id) AND is_approved = true),
        review_count = (SELECT COUNT(*) FROM reviews WHERE product_id = COALESCE(NEW.product_id, OLD.product_id) AND is_approved = true)
    WHERE id = COALESCE(NEW.product_id, OLD.product_id);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_product_rating_on_review
    AFTER INSERT OR UPDATE OR DELETE ON reviews
    FOR EACH ROW EXECUTE FUNCTION update_product_rating();

-- Function to update vendor stats when order is completed
CREATE OR REPLACE FUNCTION update_vendor_stats()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'delivered' AND OLD.status != 'delivered' THEN
        UPDATE vendors
        SET 
            total_sales = total_sales + (SELECT SUM(quantity) FROM order_items WHERE order_id = NEW.id),
            total_revenue = total_revenue + (SELECT SUM(vendor_payout) FROM order_items WHERE order_id = NEW.id)
        WHERE id IN (SELECT vendor_id FROM order_items WHERE order_id = NEW.id);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_vendor_stats_on_order
    AFTER UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION update_vendor_stats();

-- =====================================================
-- INSERT SAMPLE CATEGORIES
-- =====================================================
INSERT INTO categories (name, slug, description, image_url, sort_order) VALUES
('Electronics', 'electronics', 'Latest gadgets and electronic devices', 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400', 1),
('Clothing', 'clothing', 'Fashion for men, women, and kids', 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400', 2),
('Home & Garden', 'home-garden', 'Everything for your home and garden', 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400', 3),
('Sports & Outdoors', 'sports-outdoors', 'Sports equipment and outdoor gear', 'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=400', 4),
('Books', 'books', 'Physical and digital books', 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400', 5),
('Toys & Games', 'toys-games', 'Toys, games, and entertainment', 'https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=400', 6),
('Health & Beauty', 'health-beauty', 'Health and beauty products', 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400', 7),
('Food & Grocery', 'food-grocery', 'Fresh food and grocery items', 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400', 8);

-- Subcategories for Electronics
INSERT INTO categories (name, slug, description, parent_id, sort_order) VALUES
('Smartphones', 'smartphones', 'Mobile phones and accessories', (SELECT id FROM categories WHERE slug = 'electronics'), 1),
('Laptops', 'laptops', 'Notebooks and laptops', (SELECT id FROM categories WHERE slug = 'electronics'), 2),
('Audio', 'audio', 'Headphones, speakers, and audio equipment', (SELECT id FROM categories WHERE slug = 'electronics'), 3),
('Cameras', 'cameras', 'Digital cameras and accessories', (SELECT id FROM categories WHERE slug = 'electronics'), 4);

-- Subcategories for Clothing
INSERT INTO categories (name, slug, description, parent_id, sort_order) VALUES
('Men', 'men', 'Men''s clothing and accessories', (SELECT id FROM categories WHERE slug = 'clothing'), 1),
('Women', 'women', 'Women''s clothing and accessories', (SELECT id FROM categories WHERE slug = 'clothing'), 2),
('Kids', 'kids', 'Children''s clothing', (SELECT id FROM categories WHERE slug = 'clothing'), 3);

-- =====================================================
-- CREATE STORAGE BUCKETS
-- =====================================================
-- Note: Run these in Supabase Dashboard > Storage
-- INSERT INTO storage.buckets (id, name, public) VALUES ('products', 'products', true);
-- INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true);
-- INSERT INTO storage.buckets (id, name, public) VALUES ('vendors', 'vendors', true);
