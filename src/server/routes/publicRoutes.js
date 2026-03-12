import express from "express";
import { supabase } from "../lib/supabase.js";

const router = express.Router();

// Get all active products with optional filtering
router.get("/products", async (req, res) => {
    try {
        const { category, featured, bestseller, search, limit = 50, offset = 0 } = req.query;

        let query = supabase
            .from('products')
            .select(`
                *,
                categories(name, slug)
            `)
            .eq('status', 'active')
            .order('sort_order', { ascending: true })
            .order('created_at', { ascending: false })
            .range(parseInt(offset), parseInt(offset) + parseInt(limit) - 1);

        if (category) {
            query = query.eq('categories.slug', category);
        }

        if (featured === 'true') {
            query = query.eq('featured', true);
        }

        if (bestseller === 'true') {
            query = query.eq('bestseller', true);
        }

        if (search) {
            query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
        }

        const { data, error } = await query;

        if (error) throw error;

        res.json({ products: data || [] });
    } catch (error) {
        console.error("Get public products error:", error);
        res.status(500).json({ error: "Failed to fetch products" });
    }
});

// Get single product by slug
router.get("/products/:slug", async (req, res) => {
    try {
        const { slug } = req.params;

        const { data, error } = await supabase
            .from('products')
            .select(`
                *,
                categories(name, slug)
            `)
            .eq('slug', slug)
            .eq('status', 'active')
            .single();

        if (error) {
            if (error.code === 'PGRST116') {
                return res.status(404).json({ error: "Product not found" });
            }
            throw error;
        }

        // Get related products from same category
        let relatedProducts = [];
        if (data.category_id) {
            const { data: related } = await supabase
                .from('products')
                .select('id, name, slug, price, original_price, images')
                .eq('category_id', data.category_id)
                .eq('status', 'active')
                .neq('id', data.id)
                .limit(4);

            relatedProducts = related || [];
        }

        res.json({ product: data, relatedProducts });
    } catch (error) {
        console.error("Get product error:", error);
        res.status(500).json({ error: "Failed to fetch product" });
    }
});

// Get all categories
router.get("/categories", async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('categories')
            .select('*')
            .order('sort_order', { ascending: true });

        if (error) throw error;

        res.json({ categories: data || [] });
    } catch (error) {
        console.error("Get categories error:", error);
        res.status(500).json({ error: "Failed to fetch categories" });
    }
});

// Get featured categories
router.get("/categories/featured", async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('categories')
            .select('*')
            .eq('featured', true)
            .order('sort_order', { ascending: true });

        if (error) throw error;

        res.json({ categories: data || [] });
    } catch (error) {
        console.error("Get featured categories error:", error);
        res.status(500).json({ error: "Failed to fetch featured categories" });
    }
});

// Get gift options
router.get("/gift-options", async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('gift_options')
            .select('*')
            .eq('available', true)
            .order('sort_order', { ascending: true });

        if (error) throw error;

        res.json({ giftOptions: data || [] });
    } catch (error) {
        console.error("Get gift options error:", error);
        res.status(500).json({ error: "Failed to fetch gift options" });
    }
});

// Track order (public endpoint for customers)
router.get("/orders/track/:orderNumber", async (req, res) => {
    try {
        const { orderNumber } = req.params;

        const { data, error } = await supabase
            .from('orders')
            .select(`
                id,
                order_number,
                customer_name,
                email,
                status,
                payment_status,
                total_price,
                created_at,
                tracking_number,
                tracking_url,
                estimated_delivery,
                items
            `)
            .eq('order_number', orderNumber)
            .single();

        if (error) {
            if (error.code === 'PGRST116') {
                return res.status(404).json({ error: "Order not found" });
            }
            throw error;
        }

        // Get order status history
        const { data: history, error: historyError } = await supabase
            .from('order_status_history')
            .select('*')
            .eq('order_id', data.id)
            .order('created_at', { ascending: true });

        if (historyError) throw historyError;

        res.json({ 
            order: data, 
            statusHistory: history || [] 
        });
    } catch (error) {
        console.error("Track order error:", error);
        res.status(500).json({ error: "Failed to track order" });
    }
});

// Search products
router.get("/search", async (req, res) => {
    try {
        const { q, category, limit = 20, offset = 0 } = req.query;

        if (!q) {
            return res.status(400).json({ error: "Search query is required" });
        }

        let query = supabase
            .from('products')
            .select(`
                *,
                categories(name, slug)
            `)
            .eq('status', 'active')
            .or(`name.ilike.%${q}%,description.ilike.%${q}%,sku.ilike.%${q}%`)
            .order('sort_order', { ascending: true })
            .order('created_at', { ascending: false })
            .range(parseInt(offset), parseInt(offset) + parseInt(limit) - 1);

        if (category) {
            query = query.eq('categories.slug', category);
        }

        const { data, error } = await query;

        if (error) throw error;

        res.json({ 
            products: data || [],
            query: q,
            total: data?.length || 0
        });
    } catch (error) {
        console.error("Search error:", error);
        res.status(500).json({ error: "Failed to search products" });
    }
});

export default router;
