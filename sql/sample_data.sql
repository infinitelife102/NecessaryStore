-- =====================================================
-- Sample Data for Multi-Vendor E-Commerce Platform
-- =====================================================
-- Run order: 1) supabase_schema.sql  2) this file (sample_data.sql)
--
-- This file seeds auth.users + profiles first so that vendors/reviews
-- foreign keys are satisfied. All sample users use password: Password123!

-- Enable password hashing for auth seed
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =====================================================
-- SEED AUTH USERS (required for profiles → vendors FK)
-- =====================================================
DO $$
DECLARE
  v_pw TEXT := crypt('Password123!', gen_salt('bf'));
  v_instance_id UUID := '00000000-0000-0000-0000-000000000000';
  v_uid UUID;
  v_email TEXT;
  v_name TEXT;
  v_role TEXT;
  rec RECORD;
BEGIN
  FOR rec IN
    SELECT * FROM (VALUES
      ('00000000-0000-0000-0000-000000000001'::UUID, 'vendor1@sample.com', 'TechWorld Vendor', 'vendor'),
      ('00000000-0000-0000-0000-000000000002'::UUID, 'vendor2@sample.com', 'Fashion Hub Vendor', 'vendor'),
      ('00000000-0000-0000-0000-000000000003'::UUID, 'vendor3@sample.com', 'Home Comfort Vendor', 'vendor'),
      ('00000000-0000-0000-0000-000000000004'::UUID, 'vendor4@sample.com', 'Sports Pro Vendor', 'vendor'),
      ('00000000-0000-0000-0000-000000000005'::UUID, 'vendor5@sample.com', 'Bookworm Vendor', 'vendor'),
      ('00000000-0000-0000-0000-000000000006'::UUID, 'customer6@sample.com', 'Customer Six', 'customer'),
      ('00000000-0000-0000-0000-000000000007'::UUID, 'customer7@sample.com', 'Customer Seven', 'customer'),
      ('00000000-0000-0000-0000-000000000008'::UUID, 'customer8@sample.com', 'Customer Eight', 'customer'),
      ('00000000-0000-0000-0000-000000000009'::UUID, 'customer9@sample.com', 'Customer Nine', 'customer'),
      ('00000000-0000-0000-0000-00000000000a'::UUID, 'customer10@sample.com', 'Customer Ten', 'customer')
    ) AS t(id, email, full_name, role)
  LOOP
    v_uid := rec.id;
    v_email := rec.email;
    v_name := rec.full_name;
    v_role := rec.role;

    INSERT INTO auth.users (
      id, instance_id, aud, role, email, encrypted_password,
      email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at
    )
    VALUES (
      v_uid, v_instance_id, 'authenticated', 'authenticated', v_email, v_pw,
      NOW(), '{"provider":"email","providers":["email"]}', jsonb_build_object('full_name', v_name),
      NOW(), NOW()
    )
    ON CONFLICT (id) DO NOTHING;

    INSERT INTO auth.identities (
      id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    )
    VALUES (
      v_uid, v_uid,
      format('{"sub": "%s", "email": "%s"}', v_uid, v_email)::jsonb,
      'email', v_uid::text, NOW(), NOW(), NOW()
    )
    ON CONFLICT (id) DO NOTHING;
  END LOOP;
END $$;

-- =====================================================
-- SAMPLE PROFILES (required before vendors/reviews)
-- =====================================================
INSERT INTO profiles (id, email, full_name, role) VALUES
('00000000-0000-0000-0000-000000000001', 'vendor1@sample.com', 'TechWorld Vendor', 'vendor'),
('00000000-0000-0000-0000-000000000002', 'vendor2@sample.com', 'Fashion Hub Vendor', 'vendor'),
('00000000-0000-0000-0000-000000000003', 'vendor3@sample.com', 'Home Comfort Vendor', 'vendor'),
('00000000-0000-0000-0000-000000000004', 'vendor4@sample.com', 'Sports Pro Vendor', 'vendor'),
('00000000-0000-0000-0000-000000000005', 'vendor5@sample.com', 'Bookworm Vendor', 'vendor'),
('00000000-0000-0000-0000-000000000006', 'customer6@sample.com', 'Customer Six', 'customer'),
('00000000-0000-0000-0000-000000000007', 'customer7@sample.com', 'Customer Seven', 'customer'),
('00000000-0000-0000-0000-000000000008', 'customer8@sample.com', 'Customer Eight', 'customer'),
('00000000-0000-0000-0000-000000000009', 'customer9@sample.com', 'Customer Nine', 'customer'),
('00000000-0000-0000-0000-00000000000a', 'customer10@sample.com', 'Customer Ten', 'customer')
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- SAMPLE VENDORS
-- =====================================================
INSERT INTO vendors (user_id, store_name, store_slug, store_description, store_logo, store_banner, business_email, business_phone, commission_rate, is_verified, is_active) VALUES
('00000000-0000-0000-0000-000000000001', 'TechWorld Store', 'techworld-store', 'Your one-stop shop for all things tech. We offer the latest gadgets at competitive prices.', 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=200', 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800', 'contact@techworld.com', '+1-555-0101', 8.00, true, true),

('00000000-0000-0000-0000-000000000002', 'Fashion Hub', 'fashion-hub', 'Trendy fashion for the modern lifestyle. Quality clothing at affordable prices.', 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=200', 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=800', 'hello@fashionhub.com', '+1-555-0102', 10.00, true, true),

('00000000-0000-0000-0000-000000000003', 'Home Comfort', 'home-comfort', 'Everything you need to make your house a home. Furniture, decor, and more.', 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=200', 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800', 'support@homecomfort.com', '+1-555-0103', 12.00, true, true),

('00000000-0000-0000-0000-000000000004', 'Sports Pro', 'sports-pro', 'Premium sports equipment for athletes of all levels.', 'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=200', 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800', 'info@sportspro.com', '+1-555-0104', 10.00, true, true),

('00000000-0000-0000-0000-000000000005', 'Bookworm Haven', 'bookworm-haven', 'A paradise for book lovers. Fiction, non-fiction, and everything in between.', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200', 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800', 'books@bookworm.com', '+1-555-0105', 15.00, true, true);

-- =====================================================
-- SAMPLE PRODUCTS - ELECTRONICS (20 products)
-- =====================================================

-- Smartphones (5 products)
INSERT INTO products (vendor_id, category_id, name, slug, description, short_description, price, compare_at_price, inventory_quantity, sku, images, featured_image, rating, review_count, total_sales, is_featured, is_active, tags) VALUES
((SELECT id FROM vendors WHERE store_slug = 'techworld-store'), (SELECT id FROM categories WHERE slug = 'smartphones'), 'iPhone 15 Pro Max', 'iphone-15-pro-max', 'The most advanced iPhone ever. Featuring a titanium design, A17 Pro chip, and an incredible camera system.', 'Latest iPhone with titanium design and A17 Pro chip', 1199.00, 1299.00, 50, 'IPH15-PM-001', ARRAY['https://images.unsplash.com/photo-1696446701796-da61225697cc?w=600', 'https://images.unsplash.com/photo-1696446702183-cbd13d78e1e7?w=600'], 'https://images.unsplash.com/photo-1696446701796-da61225697cc?w=600', 4.8, 128, 342, true, true, ARRAY['smartphone', 'apple', 'iphone', '5g']),

((SELECT id FROM vendors WHERE store_slug = 'techworld-store'), (SELECT id FROM categories WHERE slug = 'smartphones'), 'Samsung Galaxy S24 Ultra', 'samsung-galaxy-s24-ultra', 'The ultimate Galaxy experience with AI-powered features, S Pen, and 200MP camera.', 'AI-powered smartphone with S Pen and 200MP camera', 1299.00, 1399.00, 45, 'SAM-S24U-001', ARRAY['https://images.unsplash.com/photo-1610945265078-3858a0828671?w=600', 'https://images.unsplash.com/photo-1610945264803-c22b0d4cd8e2?w=600'], 'https://images.unsplash.com/photo-1610945265078-3858a0828671?w=600', 4.7, 96, 278, true, true, ARRAY['smartphone', 'samsung', 'android', '5g']),

((SELECT id FROM vendors WHERE store_slug = 'techworld-store'), (SELECT id FROM categories WHERE slug = 'smartphones'), 'Google Pixel 8 Pro', 'google-pixel-8-pro', 'The smartest Pixel yet with Google AI and the best camera on a Pixel phone.', 'Google AI-powered phone with best-in-class camera', 999.00, 1099.00, 60, 'PIX-8P-001', ARRAY['https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600'], 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600', 4.6, 84, 195, false, true, ARRAY['smartphone', 'google', 'pixel', 'android']),

((SELECT id FROM vendors WHERE store_slug = 'techworld-store'), (SELECT id FROM categories WHERE slug = 'smartphones'), 'OnePlus 12', 'oneplus-12', 'Fast and smooth performance with Snapdragon 8 Gen 3 and 100W charging.', 'Flagship performance with ultra-fast charging', 799.00, 899.00, 80, 'OP-12-001', ARRAY['https://images.unsplash.com/photo-1660463974457-370df46d0a25?w=600'], 'https://images.unsplash.com/photo-1660463974457-370df46d0a25?w=600', 4.5, 62, 156, false, true, ARRAY['smartphone', 'oneplus', 'android', 'fast-charge']),

((SELECT id FROM vendors WHERE store_slug = 'techworld-store'), (SELECT id FROM categories WHERE slug = 'smartphones'), 'Xiaomi 14 Ultra', 'xiaomi-14-ultra', 'Professional photography phone with Leica optics and 1-inch sensor.', 'Leica-powered camera phone for photography enthusiasts', 1099.00, 1199.00, 35, 'XM-14U-001', ARRAY['https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600'], 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600', 4.4, 45, 89, false, true, ARRAY['smartphone', 'xiaomi', 'leica', 'camera']);

-- Laptops (5 products)
INSERT INTO products (vendor_id, category_id, name, slug, description, short_description, price, compare_at_price, inventory_quantity, sku, images, featured_image, rating, review_count, total_sales, is_featured, is_active, tags) VALUES
((SELECT id FROM vendors WHERE store_slug = 'techworld-store'), (SELECT id FROM categories WHERE slug = 'laptops'), 'MacBook Pro 16 M3 Max', 'macbook-pro-16-m3-max', 'The most powerful MacBook Pro ever with M3 Max chip and stunning Liquid Retina XDR display.', 'Ultimate pro laptop with M3 Max chip', 3499.00, 3999.00, 25, 'MBP-16-M3M', ARRAY['https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600', 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=600'], 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600', 4.9, 156, 423, true, true, ARRAY['laptop', 'apple', 'macbook', 'pro']),

((SELECT id FROM vendors WHERE store_slug = 'techworld-store'), (SELECT id FROM categories WHERE slug = 'laptops'), 'Dell XPS 15', 'dell-xps-15', 'Premium laptop with InfinityEdge display and powerful performance.', 'Premium Windows laptop with stunning display', 1899.00, 2199.00, 40, 'DELL-XPS15', ARRAY['https://images.unsplash.com/photo-1593642632823-8f78536788c6?w=600'], 'https://images.unsplash.com/photo-1593642632823-8f78536788c6?w=600', 4.6, 89, 234, true, true, ARRAY['laptop', 'dell', 'windows', 'premium']),

((SELECT id FROM vendors WHERE store_slug = 'techworld-store'), (SELECT id FROM categories WHERE slug = 'laptops'), 'Lenovo ThinkPad X1 Carbon', 'lenovo-thinkpad-x1-carbon', 'Ultra-light business laptop with legendary ThinkPad reliability.', 'Ultra-light business laptop', 1699.00, 1899.00, 55, 'TP-X1C-001', ARRAY['https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600'], 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600', 4.7, 112, 312, false, true, ARRAY['laptop', 'lenovo', 'thinkpad', 'business']),

((SELECT id FROM vendors WHERE store_slug = 'techworld-store'), (SELECT id FROM categories WHERE slug = 'laptops'), 'ASUS ROG Zephyrus G14', 'asus-rog-zephyrus-g14', 'Compact gaming powerhouse with RTX 4070 and AMD Ryzen 9.', 'Compact gaming laptop with RTX 4070', 1799.00, 1999.00, 30, 'ASUS-G14-001', ARRAY['https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=600'], 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=600', 4.5, 78, 189, false, true, ARRAY['laptop', 'asus', 'gaming', 'rtx']),

((SELECT id FROM vendors WHERE store_slug = 'techworld-store'), (SELECT id FROM categories WHERE slug = 'laptops'), 'HP Spectre x360', 'hp-spectre-x360', 'Versatile 2-in-1 laptop with stunning design and all-day battery.', 'Premium 2-in-1 convertible laptop', 1499.00, 1699.00, 45, 'HP-S360-001', ARRAY['https://images.unsplash.com/photo-1544731612-de7f96afe55f?w=600'], 'https://images.unsplash.com/photo-1544731612-de7f96afe55f?w=600', 4.4, 67, 145, false, true, ARRAY['laptop', 'hp', '2-in-1', 'convertible']);

-- Audio (5 products)
INSERT INTO products (vendor_id, category_id, name, slug, description, short_description, price, compare_at_price, inventory_quantity, sku, images, featured_image, rating, review_count, total_sales, is_featured, is_active, tags) VALUES
((SELECT id FROM vendors WHERE store_slug = 'techworld-store'), (SELECT id FROM categories WHERE slug = 'audio'), 'Sony WH-1000XM5', 'sony-wh-1000xm5', 'Industry-leading noise canceling headphones with exceptional sound quality.', 'Best noise-canceling headphones', 399.00, 449.00, 100, 'SONY-XM5-001', ARRAY['https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=600'], 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=600', 4.8, 234, 567, true, true, ARRAY['headphones', 'sony', 'noise-canceling', 'wireless']),

((SELECT id FROM vendors WHERE store_slug = 'techworld-store'), (SELECT id FROM categories WHERE slug = 'audio'), 'AirPods Pro 2', 'airpods-pro-2', 'Active noise cancellation for immersive sound with Adaptive Audio.', 'Premium wireless earbuds with ANC', 249.00, 299.00, 150, 'APP-2-001', ARRAY['https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=600'], 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=600', 4.7, 312, 892, true, true, ARRAY['earbuds', 'apple', 'wireless', 'anc']),

((SELECT id FROM vendors WHERE store_slug = 'techworld-store'), (SELECT id FROM categories WHERE slug = 'audio'), 'Bose QuietComfort Ultra', 'bose-quietcomfort-ultra', 'World-class noise cancellation with immersive spatial audio.', 'Premium noise-canceling with spatial audio', 429.00, 479.00, 75, 'BOSE-QCU-001', ARRAY['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600'], 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600', 4.6, 156, 378, false, true, ARRAY['headphones', 'bose', 'noise-canceling', 'spatial']),

((SELECT id FROM vendors WHERE store_slug = 'techworld-store'), (SELECT id FROM categories WHERE slug = 'audio'), 'JBL Flip 6', 'jbl-flip-6', 'Portable Bluetooth speaker with bold JBL sound and 12-hour battery.', 'Portable waterproof Bluetooth speaker', 129.00, 149.00, 200, 'JBL-F6-001', ARRAY['https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600'], 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600', 4.5, 189, 456, false, true, ARRAY['speaker', 'jbl', 'bluetooth', 'portable']),

((SELECT id FROM vendors WHERE store_slug = 'techworld-store'), (SELECT id FROM categories WHERE slug = 'audio'), 'Sennheiser Momentum 4', 'sennheiser-momentum-4', 'Audiophile wireless headphones with 60-hour battery life.', 'Audiophile wireless headphones', 379.00, 429.00, 60, 'SEN-M4-001', ARRAY['https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600'], 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600', 4.7, 98, 234, false, true, ARRAY['headphones', 'sennheiser', 'audiophile', 'wireless']);

-- Cameras (5 products)
INSERT INTO products (vendor_id, category_id, name, slug, description, short_description, price, compare_at_price, inventory_quantity, sku, images, featured_image, rating, review_count, total_sales, is_featured, is_active, tags) VALUES
((SELECT id FROM vendors WHERE store_slug = 'techworld-store'), (SELECT id FROM categories WHERE slug = 'cameras'), 'Sony A7 IV', 'sony-a7-iv', 'Full-frame mirrorless camera with 33MP sensor and 4K 60p video.', 'Professional full-frame mirrorless camera', 2498.00, 2798.00, 20, 'SONY-A7IV', ARRAY['https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600'], 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600', 4.8, 87, 198, true, true, ARRAY['camera', 'sony', 'mirrorless', 'full-frame']),

((SELECT id FROM vendors WHERE store_slug = 'techworld-store'), (SELECT id FROM categories WHERE slug = 'cameras'), 'Canon EOS R6 Mark II', 'canon-eos-r6-mark-ii', 'Versatile full-frame mirrorless with 40fps burst and 4K 60p video.', 'Versatile full-frame mirrorless', 2499.00, 2799.00, 18, 'CAN-R6II-001', ARRAY['https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=600'], 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=600', 4.7, 76, 167, true, true, ARRAY['camera', 'canon', 'mirrorless', 'full-frame']),

((SELECT id FROM vendors WHERE store_slug = 'techworld-store'), (SELECT id FROM categories WHERE slug = 'cameras'), 'Fujifilm X-T5', 'fujifilm-x-t5', 'Classic design with 40MP APS-C sensor and film simulations.', 'Classic design with 40MP sensor', 1699.00, 1899.00, 30, 'FUJ-XT5-001', ARRAY['https://images.unsplash.com/photo-1519638831568-d9897f54ed69?w=600'], 'https://images.unsplash.com/photo-1519638831568-d9897f54ed69?w=600', 4.6, 54, 123, false, true, ARRAY['camera', 'fujifilm', 'mirrorless', 'aps-c']),

((SELECT id FROM vendors WHERE store_slug = 'techworld-store'), (SELECT id FROM categories WHERE slug = 'cameras'), 'GoPro Hero 12 Black', 'gopro-hero-12-black', 'Ultimate action camera with 5.3K video and HyperSmooth 6.0.', 'Ultimate action camera', 399.00, 449.00, 80, 'GPRO-12-001', ARRAY['https://images.unsplash.com/photo-1564466021188-1e1a5f48a3be?w=600'], 'https://images.unsplash.com/photo-1564466021188-1e1a5f48a3be?w=600', 4.5, 145, 389, false, true, ARRAY['camera', 'gopro', 'action', 'waterproof']),

((SELECT id FROM vendors WHERE store_slug = 'techworld-store'), (SELECT id FROM categories WHERE slug = 'cameras'), 'DJI Mini 4 Pro', 'dji-mini-4-pro', 'Lightweight drone with 4K/60fps HDR video and omnidirectional sensing.', 'Lightweight 4K drone with HDR', 759.00, 899.00, 45, 'DJI-M4P-001', ARRAY['https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=600'], 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=600', 4.7, 89, 234, false, true, ARRAY['drone', 'dji', '4k', 'camera']);

-- =====================================================
-- SAMPLE PRODUCTS - CLOTHING (20 products)
-- =====================================================

-- Men''s Clothing (7 products)
INSERT INTO products (vendor_id, category_id, name, slug, description, short_description, price, compare_at_price, inventory_quantity, sku, images, featured_image, rating, review_count, total_sales, is_featured, is_active, tags) VALUES
((SELECT id FROM vendors WHERE store_slug = 'fashion-hub'), (SELECT id FROM categories WHERE slug = 'men'), 'Classic Fit Oxford Shirt', 'classic-fit-oxford-shirt', 'Timeless oxford shirt crafted from premium cotton with a comfortable classic fit.', 'Premium cotton oxford shirt', 59.00, 79.00, 200, 'SHIRT-OX-001', ARRAY['https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600'], 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600', 4.5, 234, 567, true, true, ARRAY['shirt', 'men', 'cotton', 'classic']),

((SELECT id FROM vendors WHERE store_slug = 'fashion-hub'), (SELECT id FROM categories WHERE slug = 'men'), 'Slim Fit Chino Pants', 'slim-fit-chino-pants', 'Versatile chino pants in a modern slim fit, perfect for work or weekend.', 'Versatile slim fit chinos', 69.00, 89.00, 150, 'PANT-CH-001', ARRAY['https://images.unsplash.com/photo-1473968963056-7d9b7a97a1a9?w=600'], 'https://images.unsplash.com/photo-1473968963056-7d9b7a97a1a9?w=600', 4.4, 189, 445, false, true, ARRAY['pants', 'men', 'chino', 'slim-fit']),

((SELECT id FROM vendors WHERE store_slug = 'fashion-hub'), (SELECT id FROM categories WHERE slug = 'men'), 'Merino Wool Sweater', 'merino-wool-sweater', 'Luxuriously soft merino wool sweater that''s breathable and temperature regulating.', 'Soft merino wool sweater', 89.00, 119.00, 100, 'SWTR-MR-001', ARRAY['https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600'], 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600', 4.6, 156, 378, true, true, ARRAY['sweater', 'men', 'merino', 'wool']),

((SELECT id FROM vendors WHERE store_slug = 'fashion-hub'), (SELECT id FROM categories WHERE slug = 'men'), 'Denim Jacket', 'denim-jacket', 'Classic denim jacket with a modern fit and premium wash.', 'Classic denim jacket', 79.00, 99.00, 120, 'JKT-DEN-001', ARRAY['https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?w=600'], 'https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?w=600', 4.3, 98, 267, false, true, ARRAY['jacket', 'men', 'denim', 'casual']),

((SELECT id FROM vendors WHERE store_slug = 'fashion-hub'), (SELECT id FROM categories WHERE slug = 'men'), 'Polo Shirt', 'polo-shirt', 'Classic polo shirt made from breathable pique cotton.', 'Classic cotton polo shirt', 45.00, 59.00, 250, 'POLO-001', ARRAY['https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=600'], 'https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=600', 4.4, 178, 423, false, true, ARRAY['polo', 'men', 'cotton', 'casual']),

((SELECT id FROM vendors WHERE store_slug = 'fashion-hub'), (SELECT id FROM categories WHERE slug = 'men'), 'Wool Overcoat', 'wool-overcoat', 'Sophisticated wool overcoat for the modern gentleman.', 'Sophisticated wool overcoat', 199.00, 259.00, 50, 'COAT-WL-001', ARRAY['https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=600'], 'https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=600', 4.7, 67, 156, true, true, ARRAY['coat', 'men', 'wool', 'formal']),

((SELECT id FROM vendors WHERE store_slug = 'fashion-hub'), (SELECT id FROM categories WHERE slug = 'men'), 'Casual Sneakers', 'casual-sneakers', 'Comfortable everyday sneakers with cushioned insoles.', 'Comfortable everyday sneakers', 79.00, 99.00, 180, 'SNK-CAS-001', ARRAY['https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600'], 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600', 4.5, 234, 534, false, true, ARRAY['shoes', 'men', 'sneakers', 'casual']);

-- Women''s Clothing (7 products)
INSERT INTO products (vendor_id, category_id, name, slug, description, short_description, price, compare_at_price, inventory_quantity, sku, images, featured_image, rating, review_count, total_sales, is_featured, is_active, tags) VALUES
((SELECT id FROM vendors WHERE store_slug = 'fashion-hub'), (SELECT id FROM categories WHERE slug = 'women'), 'Floral Maxi Dress', 'floral-maxi-dress', 'Elegant floral maxi dress perfect for summer occasions.', 'Elegant floral maxi dress', 89.00, 119.00, 80, 'DRESS-FL-001', ARRAY['https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=600'], 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=600', 4.6, 198, 456, true, true, ARRAY['dress', 'women', 'floral', 'summer']),

((SELECT id FROM vendors WHERE store_slug = 'fashion-hub'), (SELECT id FROM categories WHERE slug = 'women'), 'High-Waist Skinny Jeans', 'high-waist-skinny-jeans', 'Figure-flattering high-waist skinny jeans with stretch comfort.', 'Flattering high-waist jeans', 69.00, 89.00, 150, 'JEANS-SK-001', ARRAY['https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600'], 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600', 4.4, 267, 623, true, true, ARRAY['jeans', 'women', 'skinny', 'casual']),

((SELECT id FROM vendors WHERE store_slug = 'fashion-hub'), (SELECT id FROM categories WHERE slug = 'women'), 'Cashmere Turtleneck', 'cashmere-turtleneck', 'Luxurious cashmere turtleneck sweater in classic colors.', 'Luxurious cashmere turtleneck', 149.00, 199.00, 60, 'KNIT-CA-001', ARRAY['https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600'], 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600', 4.8, 123, 289, true, true, ARRAY['sweater', 'women', 'cashmere', 'luxury']),

((SELECT id FROM vendors WHERE store_slug = 'fashion-hub'), (SELECT id FROM categories WHERE slug = 'women'), 'Blazer Jacket', 'blazer-jacket', 'Tailored blazer jacket for professional and smart-casual looks.', 'Tailored blazer jacket', 119.00, 159.00, 90, 'BLAZ-001', ARRAY['https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600'], 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600', 4.5, 145, 334, false, true, ARRAY['blazer', 'women', 'formal', 'work']),

((SELECT id FROM vendors WHERE store_slug = 'fashion-hub'), (SELECT id FROM categories WHERE slug = 'women'), 'Pleated Midi Skirt', 'pleated-midi-skirt', 'Elegant pleated midi skirt that moves beautifully.', 'Elegant pleated midi skirt', 59.00, 79.00, 120, 'SKRT-PL-001', ARRAY['https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600'], 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600', 4.3, 89, 212, false, true, ARRAY['skirt', 'women', 'pleated', 'elegant']),

((SELECT id FROM vendors WHERE store_slug = 'fashion-hub'), (SELECT id FROM categories WHERE slug = 'women'), 'Silk Blouse', 'silk-blouse', 'Luxurious silk blouse with elegant drape and feel.', 'Luxurious silk blouse', 99.00, 129.00, 70, 'BLSE-SK-001', ARRAY['https://images.unsplash.com/photo-1598532163257-ae3c6b2524b6?w=600'], 'https://images.unsplash.com/photo-1598532163257-ae3c6b2524b6?w=600', 4.6, 112, 267, false, true, ARRAY['blouse', 'women', 'silk', 'elegant']),

((SELECT id FROM vendors WHERE store_slug = 'fashion-hub'), (SELECT id FROM categories WHERE slug = 'women'), 'Ankle Boots', 'ankle-boots', 'Stylish ankle boots with comfortable block heel.', 'Stylish ankle boots', 109.00, 139.00, 100, 'BOOTS-AN-001', ARRAY['https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600'], 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600', 4.5, 178, 401, false, true, ARRAY['shoes', 'women', 'boots', 'stylish']);

-- Kids Clothing (6 products)
INSERT INTO products (vendor_id, category_id, name, slug, description, short_description, price, compare_at_price, inventory_quantity, sku, images, featured_image, rating, review_count, total_sales, is_featured, is_active, tags) VALUES
((SELECT id FROM vendors WHERE store_slug = 'fashion-hub'), (SELECT id FROM categories WHERE slug = 'kids'), 'Kids Graphic T-Shirt', 'kids-graphic-t-shirt', 'Fun graphic t-shirt for kids in soft cotton.', 'Fun kids graphic tee', 19.00, 29.00, 300, 'KIDS-T-001', ARRAY['https://images.unsplash.com/photo-1519278407-7e5f4b54cc6a?w=600'], 'https://images.unsplash.com/photo-1519278407-7e5f4b54cc6a?w=600', 4.5, 234, 567, false, true, ARRAY['tshirt', 'kids', 'cotton', 'casual']),

((SELECT id FROM vendors WHERE store_slug = 'fashion-hub'), (SELECT id FROM categories WHERE slug = 'kids'), 'Kids Denim Jeans', 'kids-denim-jeans', 'Durable denim jeans for active kids.', 'Durable kids jeans', 29.00, 39.00, 200, 'KIDS-JN-001', ARRAY['https://images.unsplash.com/photo-1519238263496-6361911f2d4a?w=600'], 'https://images.unsplash.com/photo-1519238263496-6361911f2d4a?w=600', 4.4, 156, 378, false, true, ARRAY['jeans', 'kids', 'denim', 'durable']),

((SELECT id FROM vendors WHERE store_slug = 'fashion-hub'), (SELECT id FROM categories WHERE slug = 'kids'), 'Kids Hooded Sweatshirt', 'kids-hooded-sweatshirt', 'Cozy hooded sweatshirt for everyday wear.', 'Cozy kids hoodie', 34.00, 44.00, 250, 'KIDS-HD-001', ARRAY['https://images.unsplash.com/photo-1519238263496-6361911f2d4a?w=600'], 'https://images.unsplash.com/photo-1519238263496-6361911f2d4a?w=600', 4.6, 189, 445, true, true, ARRAY['hoodie', 'kids', 'cozy', 'casual']),

((SELECT id FROM vendors WHERE store_slug = 'fashion-hub'), (SELECT id FROM categories WHERE slug = 'kids'), 'Kids Winter Jacket', 'kids-winter-jacket', 'Warm winter jacket to keep kids cozy in cold weather.', 'Warm kids winter jacket', 59.00, 79.00, 150, 'KIDS-JK-001', ARRAY['https://images.unsplash.com/photo-1519238263496-6361911f2d4a?w=600'], 'https://images.unsplash.com/photo-1519238263496-6361911f2d4a?w=600', 4.7, 123, 289, true, true, ARRAY['jacket', 'kids', 'winter', 'warm']),

((SELECT id FROM vendors WHERE store_slug = 'fashion-hub'), (SELECT id FROM categories WHERE slug = 'kids'), 'Kids Sneakers', 'kids-sneakers', 'Comfortable sneakers for active kids.', 'Comfortable kids sneakers', 39.00, 49.00, 200, 'KIDS-SN-001', ARRAY['https://images.unsplash.com/photo-1519238263496-6361911f2d4a?w=600'], 'https://images.unsplash.com/photo-1519238263496-6361911f2d4a?w=600', 4.5, 178, 423, false, true, ARRAY['shoes', 'kids', 'sneakers', 'comfortable']),

((SELECT id FROM vendors WHERE store_slug = 'fashion-hub'), (SELECT id FROM categories WHERE slug = 'kids'), 'Kids Pajama Set', 'kids-pajama-set', 'Soft cotton pajama set for a good night''s sleep.', 'Soft cotton pajama set', 24.00, 34.00, 180, 'KIDS-PJ-001', ARRAY['https://images.unsplash.com/photo-1519238263496-6361911f2d4a?w=600'], 'https://images.unsplash.com/photo-1519238263496-6361911f2d4a?w=600', 4.6, 145, 334, false, true, ARRAY['pajamas', 'kids', 'cotton', 'sleepwear']);

-- =====================================================
-- SAMPLE PRODUCTS - HOME & GARDEN (20 products)
-- =====================================================
INSERT INTO products (vendor_id, category_id, name, slug, description, short_description, price, compare_at_price, inventory_quantity, sku, images, featured_image, rating, review_count, total_sales, is_featured, is_active, tags) VALUES
((SELECT id FROM vendors WHERE store_slug = 'home-comfort'), (SELECT id FROM categories WHERE slug = 'home-garden'), 'Modern Sofa', 'modern-sofa', 'Contemporary 3-seater sofa with premium fabric upholstery.', 'Contemporary 3-seater sofa', 899.00, 1199.00, 20, 'SOFA-MD-001', ARRAY['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600'], 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600', 4.7, 89, 234, true, true, ARRAY['furniture', 'sofa', 'living-room', 'modern']),

((SELECT id FROM vendors WHERE store_slug = 'home-comfort'), (SELECT id FROM categories WHERE slug = 'home-garden'), 'Dining Table Set', 'dining-table-set', 'Elegant dining table with 6 matching chairs.', 'Elegant dining set for 6', 1299.00, 1699.00, 15, 'DINE-SET-001', ARRAY['https://images.unsplash.com/photo-1617806118233-18e1de247200?w=600'], 'https://images.unsplash.com/photo-1617806118233-18e1de247200?w=600', 4.6, 67, 178, true, true, ARRAY['furniture', 'dining', 'table', 'chairs']),

((SELECT id FROM vendors WHERE store_slug = 'home-comfort'), (SELECT id FROM categories WHERE slug = 'home-garden'), 'Floor Lamp', 'floor-lamp', 'Modern floor lamp with adjustable brightness.', 'Modern adjustable floor lamp', 129.00, 179.00, 50, 'LAMP-FL-001', ARRAY['https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600'], 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600', 4.5, 123, 312, false, true, ARRAY['lighting', 'lamp', 'modern', 'decor']),

((SELECT id FROM vendors WHERE store_slug = 'home-comfort'), (SELECT id FROM categories WHERE slug = 'home-garden'), 'Area Rug', 'area-rug', 'Soft area rug in contemporary patterns.', 'Soft contemporary area rug', 199.00, 279.00, 40, 'RUG-AR-001', ARRAY['https://images.unsplash.com/photo-1575414723220-2948986a3c99?w=600'], 'https://images.unsplash.com/photo-1575414723220-2948986a3c99?w=600', 4.4, 156, 389, false, true, ARRAY['rug', 'decor', 'contemporary', 'soft']),

((SELECT id FROM vendors WHERE store_slug = 'home-comfort'), (SELECT id FROM categories WHERE slug = 'home-garden'), 'Coffee Table', 'coffee-table', 'Stylish coffee table with storage shelf.', 'Stylish coffee table with storage', 249.00, 329.00, 35, 'TABLE-CF-001', ARRAY['https://images.unsplash.com/photo-1532372320572-cda25653a26d?w=600'], 'https://images.unsplash.com/photo-1532372320572-cda25653a26d?w=600', 4.6, 98, 245, false, true, ARRAY['furniture', 'table', 'coffee', 'storage']),

((SELECT id FROM vendors WHERE store_slug = 'home-comfort'), (SELECT id FROM categories WHERE slug = 'home-garden'), 'Bookshelf', 'bookshelf', 'Modern bookshelf with 5 spacious shelves.', 'Modern 5-shelf bookshelf', 179.00, 239.00, 45, 'SHELF-BK-001', ARRAY['https://images.unsplash.com/photo-1594620302200-9a762244a156?w=600'], 'https://images.unsplash.com/photo-1594620302200-9a762244a156?w=600', 4.5, 134, 334, false, true, ARRAY['furniture', 'bookshelf', 'storage', 'modern']),

((SELECT id FROM vendors WHERE store_slug = 'home-comfort'), (SELECT id FROM categories WHERE slug = 'home-garden'), 'Bed Frame', 'bed-frame', 'Queen-size platform bed frame with headboard.', 'Queen platform bed frame', 499.00, 699.00, 25, 'BED-QN-001', ARRAY['https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=600'], 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=600', 4.7, 78, 198, true, true, ARRAY['furniture', 'bed', 'bedroom', 'platform']),

((SELECT id FROM vendors WHERE store_slug = 'home-comfort'), (SELECT id FROM categories WHERE slug = 'home-garden'), 'Mattress', 'mattress', 'Memory foam mattress for ultimate comfort.', 'Memory foam mattress', 699.00, 999.00, 20, 'MAT-FOAM-001', ARRAY['https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=600'], 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=600', 4.8, 234, 567, true, true, ARRAY['mattress', 'bedroom', 'memory-foam', 'comfort']),

((SELECT id FROM vendors WHERE store_slug = 'home-comfort'), (SELECT id FROM categories WHERE slug = 'home-garden'), 'Kitchen Organizer', 'kitchen-organizer', 'Multi-functional kitchen organizer for utensils.', 'Multi-functional kitchen organizer', 39.00, 59.00, 100, 'ORG-KIT-001', ARRAY['https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=600'], 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=600', 4.4, 189, 445, false, true, ARRAY['kitchen', 'organizer', 'storage', 'utensils']),

((SELECT id FROM vendors WHERE store_slug = 'home-comfort'), (SELECT id FROM categories WHERE slug = 'home-garden'), 'Pots and Pans Set', 'pots-and-pans-set', 'Non-stick cookware set with 10 pieces.', '10-piece non-stick cookware set', 149.00, 199.00, 60, 'COOK-SET-001', ARRAY['https://images.unsplash.com/photo-1556911220-bff31c812dba?w=600'], 'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=600', 4.6, 156, 378, true, true, ARRAY['kitchen', 'cookware', 'pots', 'pans']),

((SELECT id FROM vendors WHERE store_slug = 'home-comfort'), (SELECT id FROM categories WHERE slug = 'home-garden'), 'Throw Pillows Set', 'throw-pillows-set', 'Set of 4 decorative throw pillows.', 'Set of 4 decorative throw pillows', 49.00, 69.00, 150, 'PILLOW-SET-001', ARRAY['https://images.unsplash.com/photo-1584100936595-c0654b55a2e6?w=600'], 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e6?w=600', 4.5, 234, 534, false, true, ARRAY['decor', 'pillows', 'throw', 'set']),

((SELECT id FROM vendors WHERE store_slug = 'home-comfort'), (SELECT id FROM categories WHERE slug = 'home-garden'), 'Curtains', 'curtains', 'Blackout curtains in various sizes and colors.', 'Blackout curtains', 79.00, 109.00, 80, 'CURT-BLK-001', ARRAY['https://images.unsplash.com/photo-1507089947368-19c1da9775ae?w=600'], 'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?w=600', 4.4, 123, 289, false, true, ARRAY['curtains', 'blackout', 'window', 'decor']),

((SELECT id FROM vendors WHERE store_slug = 'home-comfort'), (SELECT id FROM categories WHERE slug = 'home-garden'), 'Garden Tools Set', 'garden-tools-set', 'Complete garden tools set with 8 pieces.', '8-piece garden tools set', 59.00, 79.00, 100, 'GARD-SET-001', ARRAY['https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600'], 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600', 4.6, 89, 212, false, true, ARRAY['garden', 'tools', 'set', 'outdoor']),

((SELECT id FROM vendors WHERE store_slug = 'home-comfort'), (SELECT id FROM categories WHERE slug = 'home-garden'), 'Outdoor Furniture Set', 'outdoor-furniture-set', 'Patio furniture set with table and 4 chairs.', 'Patio set with table and 4 chairs', 599.00, 799.00, 20, 'OUT-SET-001', ARRAY['https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=600'], 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=600', 4.5, 67, 167, true, true, ARRAY['outdoor', 'furniture', 'patio', 'garden']),

((SELECT id FROM vendors WHERE store_slug = 'home-comfort'), (SELECT id FROM categories WHERE slug = 'home-garden'), 'Plant Pots Set', 'plant-pots-set', 'Set of 5 ceramic plant pots in various sizes.', '5 ceramic plant pots', 39.00, 59.00, 120, 'POT-SET-001', ARRAY['https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=600'], 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=600', 4.7, 156, 378, false, true, ARRAY['garden', 'pots', 'ceramic', 'plants']),

((SELECT id FROM vendors WHERE store_slug = 'home-comfort'), (SELECT id FROM categories WHERE slug = 'home-garden'), 'Wall Art Canvas', 'wall-art-canvas', 'Large abstract canvas wall art.', 'Large abstract canvas art', 129.00, 179.00, 50, 'ART-CAN-001', ARRAY['https://images.unsplash.com/photo-1513519245088-0e12902e35ca?w=600'], 'https://images.unsplash.com/photo-1513519245088-0e12902e35ca?w=600', 4.5, 78, 189, false, true, ARRAY['decor', 'wall-art', 'canvas', 'abstract']),

((SELECT id FROM vendors WHERE store_slug = 'home-comfort'), (SELECT id FROM categories WHERE slug = 'home-garden'), 'Desk Lamp', 'desk-lamp', 'LED desk lamp with wireless charging base.', 'LED desk lamp with wireless charging', 79.00, 109.00, 80, 'LAMP-DK-001', ARRAY['https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600'], 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600', 4.6, 145, 356, false, true, ARRAY['lighting', 'desk', 'led', 'wireless']),

((SELECT id FROM vendors WHERE store_slug = 'home-comfort'), (SELECT id FROM categories WHERE slug = 'home-garden'), 'Storage Bins Set', 'storage-bins-set', 'Set of 6 collapsible storage bins.', '6 collapsible storage bins', 34.00, 49.00, 150, 'BIN-SET-001', ARRAY['https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=600'], 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=600', 4.4, 234, 534, false, true, ARRAY['storage', 'bins', 'organizer', 'set']),

((SELECT id FROM vendors WHERE store_slug = 'home-comfort'), (SELECT id FROM categories WHERE slug = 'home-garden'), 'Bedding Set', 'bedding-set', 'Complete bedding set with comforter and sheets.', 'Complete bedding set', 149.00, 199.00, 60, 'BED-SET-001', ARRAY['https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=600'], 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=600', 4.7, 189, 445, true, true, ARRAY['bedding', 'comforter', 'sheets', 'bedroom']),

((SELECT id FROM vendors WHERE store_slug = 'home-comfort'), (SELECT id FROM categories WHERE slug = 'home-garden'), 'Vacuum Cleaner', 'vacuum-cleaner', 'Cordless stick vacuum cleaner.', 'Cordless stick vacuum', 299.00, 399.00, 40, 'VAC-CRD-001', ARRAY['https://images.unsplash.com/photo-1558317374-067fb5f30001?w=600'], 'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=600', 4.5, 267, 623, true, true, ARRAY['appliance', 'vacuum', 'cordless', 'cleaning']);

-- =====================================================
-- SAMPLE REVIEWS
-- =====================================================
INSERT INTO reviews (product_id, user_id, rating, title, content, is_verified_purchase, is_approved, helpful_count) VALUES
((SELECT id FROM products WHERE slug = 'iphone-15-pro-max'), '00000000-0000-0000-0000-000000000006', 5, 'Amazing phone!', 'Best iPhone I have ever owned. The camera is incredible.', true, true, 45),
((SELECT id FROM products WHERE slug = 'iphone-15-pro-max'), '00000000-0000-0000-0000-000000000007', 4, 'Great but expensive', 'Excellent phone but the price is quite high.', true, true, 23),
((SELECT id FROM products WHERE slug = 'sony-wh-1000xm5'), '00000000-0000-0000-0000-000000000008', 5, 'Best noise canceling', 'These headphones block out everything. Perfect for travel.', true, true, 67),
((SELECT id FROM products WHERE slug = 'macbook-pro-16-m3-max'), '00000000-0000-0000-0000-000000000009', 5, 'Powerhouse laptop', 'Handles everything I throw at it. Perfect for video editing.', true, true, 34),
((SELECT id FROM products WHERE slug = 'floral-maxi-dress'), '00000000-0000-0000-0000-00000000000a', 5, 'Beautiful dress', 'Got so many compliments wearing this dress!', true, true, 28);

-- =====================================================
-- SAMPLE COUPONS
-- =====================================================
INSERT INTO coupons (code, description, discount_type, discount_value, minimum_order_amount, usage_limit, starts_at, expires_at, is_active) VALUES
('WELCOME10', '10% off your first order', 'percentage', 10.00, 50.00, 1000, NOW(), NOW() + INTERVAL '30 days', true),
('SAVE20', 'Save $20 on orders over $100', 'fixed_amount', 20.00, 100.00, 500, NOW(), NOW() + INTERVAL '14 days', true),
('FLASH25', 'Flash sale - 25% off', 'percentage', 25.00, 0.00, 200, NOW(), NOW() + INTERVAL '3 days', true),
('FREESHIP', 'Free shipping on all orders', 'fixed_amount', 15.00, 75.00, 1000, NOW(), NOW() + INTERVAL '60 days', true);
