-- Achyutam Organics Product Data
-- Run this SQL after the main schema is set up

-- Clear existing data
TRUNCATE TABLE products, categories RESTART IDENTITY CASCADE;

-- Insert Categories
INSERT INTO categories (name, slug, description, featured, sort_order) VALUES
('Pure Desi Ghee', 'pure-desi-ghee', 'Premium quality desi cow ghee available in multiple sizes', true, 1),
('Fresh Milk', 'fresh-milk', 'Pure and fresh cow milk delivered daily in Katni only', true, 2);

-- Insert Ghee Products (All India Delivery)
INSERT INTO products (name, slug, description, price, original_price, sku, stock_quantity, category_id, images, featured, bestseller, weight, unit, status, sort_order) VALUES
(
    'Pure Desi Cow Ghee - 1 Liter',
    'pure-desi-cow-ghee-1l',
    'Traditional bilona method desi cow ghee. Made from pure cow milk using traditional vedic methods. Rich in aroma and nutrients. Perfect for cooking, medicinal use, and religious ceremonies.',
    850.00,
    950.00,
    'AG-001-1L',
    50,
    (SELECT id FROM categories WHERE slug = 'pure-desi-ghee'),
    ARRAY['/images/ghee-1l-main.jpg', '/images/ghee-1l-side.jpg'],
    true,
    true,
    1000,
    'ml',
    'active',
    1
),
(
    'Pure Desi Cow Ghee - 500ml',
    'pure-desi-cow-ghee-500ml',
    'Premium quality desi cow ghee in convenient 500ml packaging. Perfect for small families and regular use. Made using traditional bilona method for maximum purity and health benefits.',
    450.00,
    500.00,
    'AG-001-500ML',
    75,
    (SELECT id FROM categories WHERE slug = 'pure-desi-ghee'),
    ARRAY['/images/ghee-500ml-main.jpg', '/images/ghee-500ml-side.jpg'],
    true,
    true,
    500,
    'ml',
    'active',
    2
),
(
    'Pure Desi Cow Ghee - 250ml',
    'pure-desi-cow-ghee-250ml',
    'Small pack of pure desi cow ghee, ideal for trial or gifting. Experience the authentic taste and health benefits of traditionally prepared cow ghee.',
    250.00,
    280.00,
    'AG-001-250ML',
    100,
    (SELECT id FROM categories WHERE slug = 'pure-desi-ghee'),
    ARRAY['/images/ghee-250ml-main.jpg', '/images/ghee-250ml-side.jpg'],
    false,
    false,
    250,
    'ml',
    'active',
    3
);

-- Insert Fresh Milk Product (Katni Only)
INSERT INTO products (name, slug, description, price, original_price, sku, stock_quantity, category_id, images, featured, bestseller, weight, unit, status, sort_order) VALUES
(
    'Fresh Cow Milk - Daily Delivery',
    'fresh-cow-milk-daily',
    'Pure and fresh cow milk delivered daily at your doorstep in Katni. Sourced from healthy grass-fed cows. No preservatives, no adulteration. Perfect for your family daily needs.',
    60.00,
    65.00,
    'AM-001-1L',
    30,
    (SELECT id FROM categories WHERE slug = 'fresh-milk'),
    ARRAY['/images/milk-fresh-1l.jpg'],
    true,
    true,
    1000,
    'ml',
    'active',
    1
);

-- Add nutritional information for ghee
UPDATE products SET nutritional_info = '{
    "calories_per_100g": 884,
    "fat": "99.5g",
    "saturated_fat": "61.9g",
    "cholesterol": "256mg",
    "vitamin_a": "3069 IU",
    "vitamin_e": "15.3 mg",
    "vitamin_k": "8.6 mcg",
    "protein": "0.3g",
    "carbohydrates": "0g"
}' WHERE category_id = (SELECT id FROM categories WHERE slug = 'pure-desi-ghee');

-- Add nutritional information for milk
UPDATE products SET nutritional_info = '{
    "calories_per_100ml": 42,
    "fat": "3.9g",
    "saturated_fat": "2.4g",
    "protein": "3.2g",
    "carbohydrates": "4.8g",
    "calcium": "120mg",
    "phosphorus": "95mg",
    "vitamin_d": "42 IU",
    "vitamin_b12": "0.5 mcg"
}' WHERE category_id = (SELECT id FROM categories WHERE slug = 'fresh-milk');

-- Add storage instructions
UPDATE products SET storage_instructions = 'Store in a cool, dry place away from direct sunlight. Use a clean, dry spoon. Keep the container tightly closed. No refrigeration needed.' WHERE category_id = (SELECT id FROM categories WHERE slug = 'pure-desi-ghee');

UPDATE products SET storage_instructions = 'Refrigerate immediately upon receipt. Consume within 2 days of delivery. Boil before consumption. Keep in clean container.' WHERE category_id = (SELECT id FROM categories WHERE slug = 'fresh-milk');

-- Add shelf life
UPDATE products SET shelf_life = '12 months from manufacturing date' WHERE category_id = (SELECT id FROM categories WHERE slug = 'pure-desi-ghee');

UPDATE products SET shelf_life = '2 days from delivery date' WHERE category_id = (SELECT id FROM categories WHERE slug = 'fresh-milk');

-- Add ingredients
UPDATE products SET ingredients = ARRAY['Pure Cow Milk', 'Traditional Bilona Method'] WHERE category_id = (SELECT id FROM categories WHERE slug = 'pure-desi-ghee');

UPDATE products SET ingredients = ARRAY['Fresh Cow Milk'] WHERE category_id = (SELECT id FROM categories WHERE slug = 'fresh-milk');

-- Verify the data
SELECT 
    p.name,
    p.slug,
    p.price,
    p.weight,
    p.unit,
    c.name as category_name,
    c.slug as category_slug
FROM products p
JOIN categories c ON p.category_id = c.id
ORDER BY c.sort_order, p.sort_order;
