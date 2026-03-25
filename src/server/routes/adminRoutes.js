import express from "express";
import multer from "multer";
import path from "path";
import { adminAuth } from "../middleware/auth.js";
import { supabase } from "../lib/supabase.js";

const router = express.Router();

// Configure multer for image uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(process.cwd(), 'public', 'product-images'));
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    },
    fileFilter: function (req, file, cb) {
        const allowedTypes = /jpeg|jpg|png|gif|webp/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        
        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Only image files are allowed'));
        }
    }
});

// Get dashboard statistics
router.get("/stats", adminAuth, async (req, res) => {
    try {
        const [
            totalOrdersResult,
            totalRevenueResult,
            recentOrdersResult,
            lowStockResult,
            pendingOrdersResult
        ] = await Promise.all([
            supabase.from('orders').select('id', { count: 'exact' }),
            supabase.from('orders').select('total_price').eq('status', 'delivered'),
            supabase.from('orders').select('*').order('created_at', { ascending: false }).limit(5),
            supabase.from('low_stock_products').select('*'),
            supabase.from('orders').select('id', { count: 'exact' }).eq('status', 'pending')
        ]);

        const totalRevenue = totalRevenueResult.data?.reduce((sum, order) => sum + parseFloat(order.total_price), 0) || 0;

        res.json({
            totalOrders: totalOrdersResult.count || 0,
            totalRevenue,
            recentOrders: recentOrdersResult.data || [],
            lowStockProducts: lowStockResult.data || [],
            pendingOrders: pendingOrdersResult.count || 0
        });
    } catch (error) {
        console.error("Dashboard stats error:", error);
        res.status(500).json({ error: "Failed to fetch dashboard statistics" });
    }
});

// Get all orders with pagination and filtering
router.get("/orders", adminAuth, async (req, res) => {
    try {
        const { page = 1, limit = 10, status, search } = req.query;
        const offset = (page - 1) * limit;

        let query = supabase
            .from('orders')
            .select('*', { count: 'exact' })
            .order('created_at', { ascending: false })
            .range(offset, offset + limit - 1);

        if (status) {
            query = query.eq('status', status);
        }

        if (search) {
            query = query.or(`customer_name.ilike.%${search}%,email.ilike.%${search}%,order_number.ilike.%${search}%`);
        }

        const { data, error, count } = await query;

        if (error) throw error;

        res.json({
            orders: data || [],
            total: count || 0,
            page: parseInt(page),
            totalPages: Math.ceil((count || 0) / limit)
        });
    } catch (error) {
        console.error("Get orders error:", error);
        res.status(500).json({ error: "Failed to fetch orders" });
    }
});

// Get all products
router.get("/products", adminAuth, async (req, res) => {
    try {
        const { page = 1, limit = 50, category, status } = req.query;
        const offset = (page - 1) * limit;

        let query = supabase
            .from('products')
            .select(`
                *,
                categories(name, slug)
            `, { count: 'exact' })
            .order('created_at', { ascending: false })
            .range(offset, offset + limit - 1);

        if (category) {
            query = query.eq('category_id', category);
        }

        if (status) {
            query = query.eq('status', status);
        }

        const { data, error, count } = await query;

        if (error) throw error;

        res.json({
            products: data || [],
            total: count || 0,
            page: parseInt(page),
            totalPages: Math.ceil((count || 0) / limit)
        });
    } catch (error) {
        console.error("Get products error:", error);
        res.status(500).json({ error: "Failed to fetch products" });
    }
});

// Create new product with image upload
router.post("/products", adminAuth, upload.array('images', 5), async (req, res) => {
    try {
        const productData = JSON.parse(req.body.productData);
        
        // Handle uploaded images
        const imagePaths = [];
        if (req.files && req.files.length > 0) {
            req.files.forEach(file => {
                imagePaths.push(`/product-images/${file.filename}`);
            });
        }
        
        // Add image paths to product data
        if (imagePaths.length > 0) {
            productData.images = imagePaths;
        }
        
        const { data, error } = await supabase
            .from('products')
            .insert([productData])
            .select()
            .single();

        if (error) throw error;

        res.json({ success: true, product: data });
    } catch (error) {
        console.error("Create product error:", error);
        res.status(500).json({ error: "Failed to create product" });
    }
});

// Update product
router.put("/products/:id", adminAuth, async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        
        const { data, error } = await supabase
            .from('products')
            .update(updateData)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;

        res.json({ success: true, product: data });
    } catch (error) {
        console.error("Update product error:", error);
        res.status(500).json({ error: "Failed to update product" });
    }
});

// Delete product
router.delete("/products/:id", adminAuth, async (req, res) => {
    try {
        const { id } = req.params;
        
        const { error } = await supabase
            .from('products')
            .delete()
            .eq('id', id);

        if (error) throw error;

        res.json({ success: true });
    } catch (error) {
        console.error("Delete product error:", error);
        res.status(500).json({ error: "Failed to delete product" });
    }
});

// Get all categories
router.get("/categories", adminAuth, async (req, res) => {
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

// Create new category
router.post("/categories", adminAuth, async (req, res) => {
    try {
        const categoryData = req.body;
        
        const { data, error } = await supabase
            .from('categories')
            .insert([categoryData])
            .select()
            .single();

        if (error) throw error;

        res.json({ success: true, category: data });
    } catch (error) {
        console.error("Create category error:", error);
        res.status(500).json({ error: "Failed to create category" });
    }
});

// Update category
router.put("/categories/:id", adminAuth, async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        
        const { data, error } = await supabase
            .from('categories')
            .update(updateData)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;

        res.json({ success: true, category: data });
    } catch (error) {
        console.error("Update category error:", error);
        res.status(500).json({ error: "Failed to update category" });
    }
});

// Delete category
router.delete("/categories/:id", adminAuth, async (req, res) => {
    try {
        const { id } = req.params;
        
        const { error } = await supabase
            .from('categories')
            .delete()
            .eq('id', id);

        if (error) throw error;

        res.json({ success: true });
    } catch (error) {
        console.error("Delete category error:", error);
        res.status(500).json({ error: "Failed to delete category" });
    }
});

// Get gift options
router.get("/gift-options", adminAuth, async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('gift_options')
            .select('*')
            .order('sort_order', { ascending: true });

        if (error) throw error;

        res.json({ giftOptions: data || [] });
    } catch (error) {
        console.error("Get gift options error:", error);
        res.status(500).json({ error: "Failed to fetch gift options" });
    }
});

// Create gift option
router.post("/gift-options", adminAuth, async (req, res) => {
    try {
        const optionData = req.body;
        
        const { data, error } = await supabase
            .from('gift_options')
            .insert([optionData])
            .select()
            .single();

        if (error) throw error;

        res.json({ success: true, giftOption: data });
    } catch (error) {
        console.error("Create gift option error:", error);
        res.status(500).json({ error: "Failed to create gift option" });
    }
});

// Update gift option
router.put("/gift-options/:id", adminAuth, async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        
        const { data, error } = await supabase
            .from('gift_options')
            .update(updateData)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;

        res.json({ success: true, giftOption: data });
    } catch (error) {
        console.error("Update gift option error:", error);
        res.status(500).json({ error: "Failed to update gift option" });
    }
});

// Delete gift option
router.delete("/gift-options/:id", adminAuth, async (req, res) => {
    try {
        const { id } = req.params;
        
        const { error } = await supabase
            .from('gift_options')
            .delete()
            .eq('id', id);

        if (error) throw error;

        res.json({ success: true });
    } catch (error) {
        console.error("Delete gift option error:", error);
        res.status(500).json({ error: "Failed to delete gift option" });
    }
});

export default router;
