-- UGMarket Sample Data
-- This script inserts sample data for testing and development

-- Insert default categories
INSERT INTO categories (name, slug, description, parent_id, is_active) VALUES
('Electronics', 'electronics', 'Electronic devices and accessories', NULL, true),
('Phones & Tablets', 'phones-tablets', 'Mobile phones and tablets', 1, true),
('Computers', 'computers', 'Computers and accessories', 1, true),
('Fashion', 'fashion', 'Clothing and accessories', NULL, true),
('Home & Garden', 'home-garden', 'Home and garden items', NULL, true),
('Vehicles', 'vehicles', 'Vehicles and automotive parts', NULL, true)
ON CONFLICT (slug) DO UPDATE SET
name = EXCLUDED.name,
description = EXCLUDED.description,
parent_id = EXCLUDED.parent_id,
is_active = EXCLUDED.is_active;

-- Insert default commission rates
INSERT INTO commission_rates (category_id, rate, min_amount, max_amount, is_active) 
SELECT id, 10.00, 0, 10000000, true FROM categories WHERE slug = 'electronics'
ON CONFLICT (category_id) DO UPDATE SET
rate = EXCLUDED.rate,
min_amount = EXCLUDED.min_amount,
max_amount = EXCLUDED.max_amount,
is_active = EXCLUDED.is_active;

INSERT INTO commission_rates (category_id, rate, min_amount, max_amount, is_active) 
SELECT id, 12.00, 0, 10000000, true FROM categories WHERE slug = 'fashion'
ON CONFLICT (category_id) DO UPDATE SET
rate = EXCLUDED.rate,
min_amount = EXCLUDED.min_amount,
max_amount = EXCLUDED.max_amount,
is_active = EXCLUDED.is_active;

INSERT INTO commission_rates (category_id, rate, min_amount, max_amount, is_active) 
SELECT id, 8.00, 0, 10000000, true FROM categories WHERE slug = 'vehicles'
ON CONFLICT (category_id) DO UPDATE SET
rate = EXCLUDED.rate,
min_amount = EXCLUDED.min_amount,
max_amount = EXCLUDED.max_amount,
is_active = EXCLUDED.is_active;

-- Insert system settings
INSERT INTO system_settings (setting_key, setting_value, data_type, description, is_public) VALUES
('platform_name', 'UGMarket', 'string', 'The name displayed throughout the platform', true),
('default_currency', 'UGX', 'string', 'The currency used for all transactions', true),
('default_commission_rate', '10', 'number', 'Default commission percentage charged on sales', false),
('session_timeout', '60', 'number', 'Automatic logout after period of inactivity (minutes)', false),
('maintenance_mode', 'false', 'boolean', 'Take the site offline for maintenance', true),
('min_order_amount', '5000', 'number', 'Minimum order amount', true),
('max_products_per_user', '100', 'number', 'Maximum number of products a seller can list', false),
('return_period_days', '7', 'number', 'Number of days for return eligibility', true)
ON CONFLICT (setting_key) DO UPDATE SET
setting_value = EXCLUDED.setting_value,
data_type = EXCLUDED.data_type,
description = EXCLUDED.description,
is_public = EXCLUDED.is_public;

-- Insert admin user (password: admin123 - will be hashed)
INSERT INTO users (email, password_hash, first_name, last_name, role, is_verified, status) VALUES
('admin@ugmarket.ug', crypt('admin123', gen_salt('bf')), 'System', 'Administrator', 'admin', TRUE, 'active')
ON CONFLICT (email) DO UPDATE SET
password_hash = EXCLUDED.password_hash,
first_name = EXCLUDED.first_name,
last_name = EXCLUDED.last_name,
role = EXCLUDED.role,
is_verified = EXCLUDED.is_verified,
status = EXCLUDED.status;

-- Insert sample seller user (password: seller123)
INSERT INTO users (email, password_hash, first_name, last_name, phone_number, role, is_verified, business_name, business_type, business_category, location, status) VALUES
('gadgethub@example.com', crypt('seller123', gen_salt('bf')), 'Grace', 'K.', '+256772123456', 'seller', TRUE, 'GadgetHub Uganda', 'Limited Company', 'Mobile Phones & Electronics', 'Kampala, Central Division', 'active')
ON CONFLICT (email) DO UPDATE SET
password_hash = EXCLUDED.password_hash,
first_name = EXCLUDED.first_name,
last_name = EXCLUDED.last_name,
phone_number = EXCLUDED.phone_number,
role = EXCLUDED.role,
is_verified = EXCLUDED.is_verified,
business_name = EXCLUDED.business_name,
business_type = EXCLUDED.business_type,
business_category = EXCLUDED.business_category,
location = EXCLUDED.location,
status = EXCLUDED.status;

-- Insert sample buyer user (password: buyer123)
INSERT INTO users (email, password_hash, first_name, last_name, phone_number, role, is_verified, status) VALUES
('jamesk@example.com', crypt('buyer123', gen_salt('bf')), 'James', 'K.', '+256712345678', 'buyer', TRUE, 'active')
ON CONFLICT (email) DO UPDATE SET
password_hash = EXCLUDED.password_hash,
first_name = EXCLUDED.first_name,
last_name = EXCLUDED.last_name,
phone_number = EXCLUDED.phone_number,
role = EXCLUDED.role,
is_verified = EXCLUDED.is_verified,
status = EXCLUDED.status;

-- Insert sample addresses for users
INSERT INTO user_addresses (user_id, address_type, street_address, city, region, postal_code, is_default) VALUES
(2, 'home', 'Shop 45, Garden City Mall', 'Kampala', 'Central Division', '00256', true),
(3, 'home', '123 Main Street', 'Kampala', 'Central Division', '00256', true)
ON CONFLICT DO NOTHING;

-- Get category IDs for products
WITH category_ids AS (
    SELECT id, name FROM categories
)
-- Insert sample products
INSERT INTO products (seller_id, title, slug, description, price, compare_at_price, cost_per_item, category_id, condition, weight_kg, sku, stock_quantity, status) 
SELECT 
    2, 
    'iPhone 12 Pro Max 256GB', 
    'iphone-12-pro-max-256gb',
    'Brand new iPhone 12 Pro Max, still sealed in original box with full Apple warranty. Never opened or used. Includes all original accessories.', 
    3200000, 
    3500000,
    2800000,
    (SELECT id FROM category_ids WHERE name = 'Phones & Tablets'),
    'new', 
    0.5, 
    'IP12PM256', 
    5, 
    'published'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'iphone-12-pro-max-256gb');

INSERT INTO products (seller_id, title, slug, description, price, compare_at_price, cost_per_item, category_id, condition, weight_kg, sku, stock_quantity, status) 
SELECT 
    2, 
    'Samsung Galaxy S21 Ultra 5G', 
    'samsung-galaxy-s21-ultra-5g',
    'Latest Samsung flagship with 5G capability and excellent camera. Includes original box and accessories.', 
    2800000, 
    3000000,
    2400000,
    (SELECT id FROM category_ids WHERE name = 'Phones & Tablets'),
    'new', 
    0.4, 
    'SGS21U5G', 
    3, 
    'published'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'samsung-galaxy-s21-ultra-5g');

INSERT INTO products (seller_id, title, slug, description, price, compare_at_price, cost_per_item, category_id, condition, weight_kg, sku, stock_quantity, status) 
SELECT 
    2, 
    'Tecno Camon 16 Premier', 
    'tecno-camon-16-premier',
    'New Tecno Camon with amazing camera features and large storage. Perfect condition with warranty.', 
    950000, 
    1100000,
    800000,
    (SELECT id FROM category_ids WHERE name = 'Phones & Tablets'),
    'new', 
    0.3, 
    'TEC16P', 
    10, 
    'published'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'tecno-camon-16-premier');

-- Insert sample product images
INSERT INTO product_images (product_id, image_url, alt_text, is_main) 
SELECT 
    id, 
    'https://via.placeholder.com/600x500?text=iPhone+12+Pro+Max', 
    'iPhone 12 Pro Max 256GB',
    true
FROM products WHERE slug = 'iphone-12-pro-max-256gb'
ON CONFLICT DO NOTHING;

INSERT INTO product_images (product_id, image_url, alt_text, is_main) 
SELECT 
    id, 
    'https://via.placeholder.com/600x500?text=Samsung+S21+Ultra', 
    'Samsung Galaxy S21 Ultra 5G',
    true
FROM products WHERE slug = 'samsung-galaxy-s21-ultra-5g'
ON CONFLICT DO NOTHING;

INSERT INTO product_images (product_id, image_url, alt_text, is_main) 
SELECT 
    id, 
    'https://via.placeholder.com/600x500?text=Tecno+Camon+16', 
    'Tecno Camon 16 Premier',
    true
FROM products WHERE slug = 'tecno-camon-16-premier'
ON CONFLICT DO NOTHING;

-- Insert sample favorites
INSERT INTO favorites (user_id, product_id) 
SELECT 
    3, 
    id 
FROM products WHERE slug = 'iphone-12-pro-max-256gb'
ON CONFLICT DO NOTHING;

-- Insert sample wishlist
INSERT INTO wishlists (user_id, name, is_public) 
VALUES (3, 'My Tech Wishlist', true)
ON CONFLICT DO NOTHING;

-- Insert sample wishlist items
INSERT INTO wishlist_items (wishlist_id, product_id) 
SELECT 
    (SELECT id FROM wishlists WHERE user_id = 3 LIMIT 1), 
    id 
FROM products WHERE slug = 'samsung-galaxy-s21-ultra-5g'
ON CONFLICT DO NOTHING;