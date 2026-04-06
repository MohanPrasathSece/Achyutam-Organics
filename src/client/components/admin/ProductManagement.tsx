import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit2, Trash2, ImagePlus, Package, PackageX } from "lucide-react";
import { cn } from "@/lib/utils";

interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    category_id: string;
    stock_quantity?: number;
    status: string; // 'active' | 'inactive' | 'draft'
    images: string[];
    organic: boolean;
    bestseller: boolean;
    featured: boolean;
}

const ProductManagement = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const { toast } = useToast();

    const [formData, setFormData] = useState({
        id: "",
        name: "",
        description: "",
        price: 0,
        category_id: "",
        status: "active" as string,
        stock_quantity: 0,
        images: [] as string[],
        organic: true,
        bestseller: false,
        featured: false,
    });

    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

    const fetchProducts = async () => {
        try {
            const { data: productsData } = await supabase
                .from("products")
                .select("*")
                .order("created_at", { ascending: false });

            if (productsData) {
                setProducts(productsData);
            } else {
                // Fallback to demo products if no data from Supabase
                const demoProducts = [
                    {
                        id: "demo-1",
                        name: "Pure Desi Gir Cow Ghee - 250gm",
                        description: "Premium quality desi Gir cow ghee made using traditional Bilona method. Rich in aroma and nutrition.",
                        price: 550,
                        category_id: "demo-cat-1",
                        stock_quantity: 50,
                        status: "active",
                        images: ["/src/assets/ghee_product/ghee_250gm.jpeg"],
                        organic: true,
                        bestseller: true,
                        featured: true
                    },
                    {
                        id: "demo-2",
                        name: "Pure Desi Gir Cow Ghee - 500ml",
                        description: "Premium quality desi Gir cow ghee made using traditional Bilona method. Rich in aroma and nutrition.",
                        price: 1050,
                        category_id: "demo-cat-1",
                        stock_quantity: 30,
                        status: "active",
                        images: ["/src/assets/ghee_product/ghee_500ml.jpeg"],
                        organic: true,
                        bestseller: false,
                        featured: false
                    },
                    {
                        id: "demo-3",
                        name: "Pure Desi Gir Cow Ghee - 1kg",
                        description: "Premium quality desi Gir cow ghee made using traditional Bilona method. Rich in aroma and nutrition.",
                        price: 2100,
                        category_id: "demo-cat-1",
                        stock_quantity: 20,
                        status: "active",
                        images: ["/src/assets/ghee_product/ghee_1kg.jpeg"],
                        organic: true,
                        bestseller: true,
                        featured: true
                    },
                    {
                        id: "demo-4",
                        name: "Fresh Gir Cow Milk - Daily Delivery",
                        description: "Pure and fresh Gir cow milk delivered daily to your doorstep. From healthy grass-fed Gir cows.",
                        price: 80,
                        category_id: "demo-cat-2",
                        stock_quantity: 0,
                        status: "active",
                        images: ["/src/assets/fresh-milk.jpg"],
                        organic: true,
                        bestseller: false,
                        featured: false
                    }
                ];
                setProducts(demoProducts);
            }
        } catch (error) {
            console.error('Error fetching products:', error);
            // Fallback to demo products on error
            const demoProducts = [
                {
                    id: "demo-1",
                    name: "Pure Desi Gir Cow Ghee - 250gm",
                    description: "Premium quality desi Gir cow ghee made using traditional Bilona method. Rich in aroma and nutrition.",
                    price: 550,
                    category_id: "demo-cat-1",
                    stock_quantity: 50,
                    status: "active",
                    images: ["/src/assets/ghee_product/ghee_250gm.jpeg"],
                    organic: true,
                    bestseller: true,
                    featured: true
                },
                {
                    id: "demo-2",
                    name: "Pure Desi Gir Cow Ghee - 500ml",
                    description: "Premium quality desi Gir cow ghee made using traditional Bilona method. Rich in aroma and nutrition.",
                    price: 1050,
                    category_id: "demo-cat-1",
                    stock_quantity: 30,
                    status: "active",
                    images: ["/src/assets/ghee_product/ghee_500ml.jpeg"],
                    organic: true,
                    bestseller: false,
                    featured: false
                },
                {
                    id: "demo-3",
                    name: "Pure Desi Gir Cow Ghee - 1kg",
                    description: "Premium quality desi Gir cow ghee made using traditional Bilona method. Rich in aroma and nutrition.",
                    price: 2100,
                    category_id: "demo-cat-1",
                    stock_quantity: 20,
                    status: "active",
                    images: ["/src/assets/ghee_product/ghee_1kg.jpeg"],
                    organic: true,
                    bestseller: true,
                    featured: true
                },
                {
                    id: "demo-4",
                    name: "Fresh Gir Cow Milk - Daily Delivery",
                    description: "Pure and fresh Gir cow milk delivered daily to your doorstep. From healthy grass-fed Gir cows.",
                    price: 80,
                    category_id: "demo-cat-2",
                    stock_quantity: 0,
                    status: "active",
                    images: ["/src/assets/fresh-milk.jpg"],
                    organic: true,
                    bestseller: false,
                    featured: false
                }
            ];
            setProducts(demoProducts);
        }
        setLoading(false);
    };

    const fetchCategories = async () => {
        const { data } = await supabase.from("categories").select("*");
        if (data) setCategories(data);
    };

    useEffect(() => {
        fetchProducts();
        fetchCategories();

        const subscription = supabase
            .channel("products-changes")
            .on("postgres_changes", { event: "*", schema: "public", table: "products" }, () => {
                fetchProducts();
            })
            .subscribe();

        return () => {
            supabase.removeChannel(subscription);
        };
    }, []);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const formDataObj = new FormData();
            
            // Add product data as JSON
            const payload = {
                name: formData.name,
                description: formData.description,
                price: formData.price,
                category_id: formData.category_id || null,
                status: formData.status,
                images: formData.images,
                organic: formData.organic,
                bestseller: formData.bestseller,
                featured: formData.featured,
                stock_quantity: formData.stock_quantity || 0,
            };
            
            formDataObj.append('productData', JSON.stringify(payload));
            
            // Add image files
            if (selectedFiles.length > 0) {
                selectedFiles.forEach(file => {
                    formDataObj.append('images', file);
                });
            }

            const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4001';
            
            if (formData.id) {
                // Update existing product (no image upload for updates in this version)
                const { error } = await supabase
                    .from("products")
                    .update(payload)
                    .eq("id", formData.id);
                if (error) throw error;
                toast({ title: "Product Updated" });
            } else {
                // Create new product with images
                const response = await fetch(`${apiUrl}/api/admin/products`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
                    },
                    body: formDataObj,
                });
                
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || 'Failed to create product');
                }
                
                toast({ title: "Product Created" });
            }
            
            setIsDialogOpen(false);
            resetForm();
            fetchProducts();
        } catch (error: any) {
            toast({ title: "Error", description: error.message, variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this Achyutam product?")) return;

        const { error } = await supabase.from("products").delete().eq("id", id);
        if (error) {
            toast({ title: "Error", description: error.message, variant: "destructive" });
        } else {
            toast({ title: "Product Deleted" });
            fetchProducts();
        }
    };

    const resetForm = () => {
        setFormData({
            id: "",
            name: "",
            description: "",
            price: 0,
            category_id: "",
            status: "active",
            stock_quantity: 0,
            images: [],
            organic: true,
            bestseller: false,
            featured: false,
        });
        setSelectedFiles([]);
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        setSelectedFiles(files);
    };

    const openEdit = (product: Product) => {
        setFormData({
            ...product,
            stock_quantity: product.stock_quantity ?? 0
        });
        setIsDialogOpen(true);
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setLoading(true);
        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random()}.${fileExt}`;
            const filePath = `products/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('images')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('images')
                .getPublicUrl(filePath);

            setFormData(prev => ({ ...prev, images: [...prev.images, publicUrl] }));
            toast({ title: "Image Uploaded" });
        } catch (error: any) {
            toast({ title: "Upload Failed", description: error.message, variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <h2 className="text-2xl font-bold text-slate-800">Inventory Management</h2>
                <Dialog open={isDialogOpen} onOpenChange={(open) => {
                    setIsDialogOpen(open);
                    if (!open) resetForm();
                }}>
                    <DialogTrigger asChild>
                        <Button className="rounded-full bg-emerald-700 hover:bg-emerald-800 text-white gap-2 shadow-lg w-full md:w-auto">
                            <Plus className="w-4 h-4" /> Add Dairy Product
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl w-[95%] md:w-full bg-white rounded-3xl p-6 md:p-8 max-h-[90vh] overflow-y-auto font-lato">
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-lato">{formData.id ? "Edit Dairy Product" : "New Dairy Product"}</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSave} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Product Name</Label>
                                    <Input value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required className="rounded-xl border-slate-200" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Category</Label>
                                    <select
                                        className="w-full h-10 px-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-600 outline-none"
                                        value={formData.category_id}
                                        onChange={e => setFormData({ ...formData, category_id: e.target.value })}
                                    >
                                        <option value="">Select Category</option>
                                        {categories.map(cat => (
                                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Description</Label>
                                <Textarea value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} required className="rounded-xl border-slate-200" />
                            </div>
                            <div className="space-y-2">
                                <Label>Product Images</Label>
                                <Input 
                                    type="file" 
                                    multiple 
                                    accept="image/*"
                                    onChange={handleFileSelect}
                                    className="rounded-xl border-slate-200" 
                                />
                                {selectedFiles.length > 0 && (
                                    <div className="text-sm text-slate-600">
                                        {selectedFiles.length} file(s) selected
                                    </div>
                                )}
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label>Price (₹)</Label>
                                    <Input type="number" value={formData.price} onChange={e => setFormData({ ...formData, price: Number(e.target.value) })} required className="rounded-xl border-slate-200" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Stock Quantity</Label>
                                    <Input 
                                        type="number" 
                                        value={formData.stock_quantity ?? 0} 
                                        onChange={e => {
                                            const val = Number(e.target.value);
                                            setFormData({ 
                                                ...formData, 
                                                stock_quantity: val,
                                                status: val <= 0 ? "inactive" : "active"
                                            });
                                        }} 
                                        className="rounded-xl border-slate-200" 
                                    />
                                </div>
                                <div className="flex flex-wrap gap-4 items-end pb-1 pt-2 md:pt-0">
                                    <div
                                        className="flex items-center gap-2 cursor-pointer p-2 border rounded-xl hover:bg-slate-50 transition-colors"
                                        onClick={() => setFormData({ ...formData, status: formData.status === "active" ? "inactive" : "active" })}
                                    >
                                        {formData.status === "active" ? <Package className="w-5 h-5 text-green-500" /> : <PackageX className="w-5 h-5 text-red-500" />}
                                        <span className="text-sm font-bold">{formData.status === "active" ? "In Stock" : "Out of Stock"}</span>
                                    </div>

                                    <div className="flex items-center gap-4 border p-2 rounded-xl">
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input type="checkbox" checked={formData.organic} onChange={e => setFormData({...formData, organic: e.target.checked})} className="rounded text-emerald-600" />
                                            <span className="text-xs font-bold">Organic</span>
                                        </label>
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input type="checkbox" checked={formData.bestseller} onChange={e => setFormData({...formData, bestseller: e.target.checked})} className="rounded text-amber-600" />
                                            <span className="text-xs font-bold">Bestseller</span>
                                        </label>
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input type="checkbox" checked={formData.featured} onChange={e => setFormData({...formData, featured: e.target.checked})} className="rounded text-blue-600" />
                                            <span className="text-xs font-bold">Featured</span>
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Images</Label>
                                <div className="flex flex-wrap gap-2">
                                    {formData.images.map((url, i) => (
                                        <div key={i} className="relative w-20 h-20 rounded-lg overflow-hidden border">
                                            <img src={url} className="w-full h-full object-cover" />
                                            <button type="button" onClick={() => setFormData({ ...formData, images: formData.images.filter((_, idx) => idx !== i) })} className="absolute top-0 right-0 bg-red-500 text-white p-0.5 rounded-bl">
                                                <Trash2 className="w-3 h-3" />
                                            </button>
                                        </div>
                                    ))}
                                    <Label className="w-20 h-20 border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 border-slate-300">
                                        <ImagePlus className="w-6 h-6 text-slate-400" />
                                        <span className="text-[10px] mt-1">Upload</span>
                                        <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={loading} />
                                    </Label>
                                </div>
                            </div>

                            <Button type="submit" className="w-full rounded-full bg-emerald-700 hover:bg-emerald-800 text-white h-12" disabled={loading}>
                                {loading ? "Processing..." : "Save Product"}
                            </Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {products.map(product => {
                    const cat = categories.find(c => c.id === product.category_id);
                    return (
                        <div key={product.id} className="bg-white rounded-3xl p-4 shadow-soft border border-slate-100 flex flex-col sm:flex-row gap-4 group transition-all hover:shadow-lg">
                            <div className="w-full sm:w-24 h-40 sm:h-24 rounded-2xl overflow-hidden shadow-sm shrink-0">
                                <img
                                    src={(Array.isArray(product.images) && product.images.length > 0) ? product.images[0] : "/placeholder.jpg"}
                                    className="w-full h-full object-cover"
                                    alt={product.name}
                                />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between">
                                    <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">{cat?.name || "Uncategorized"}</span>
                                    <div className="flex gap-1 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => openEdit(product)} className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-600"><Edit2 className="w-4 h-4" /></button>
                                        <button onClick={() => handleDelete(product.id)} className="p-1.5 hover:bg-red-50 rounded-lg text-red-600"><Trash2 className="w-4 h-4" /></button>
                                    </div>
                                </div>
                                <h3 className="font-bold text-slate-800 truncate pr-8">{product.name}</h3>
                                <p className="text-lg font-bold text-slate-900 mt-1">₹{product.price.toLocaleString()}</p>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                                        product.status === 'active' ? 'bg-green-100 text-green-700' :
                                        product.status === 'inactive' ? 'bg-red-100 text-red-700' :
                                        'bg-amber-100 text-amber-700'
                                    }`}>
                                        {product.status === 'active' ? 'Active' : product.status === 'inactive' ? 'Inactive' : 'Draft'}
                                    </span>
                                    {product.stock_quantity !== undefined && (
                                        <span className={cn(
                                            "text-[10px] px-2 py-0.5 rounded-full font-bold uppercase border",
                                            (product.stock_quantity ?? 0) < 5
                                                ? "bg-amber-100 text-amber-700 border-amber-200"
                                                : "bg-slate-100 text-slate-800 border-slate-200"
                                        )}>
                                            {(product.stock_quantity ?? 0) < 5 && "Low: "}{product.stock_quantity}
                                        </span>
                                    )}
                                    {product.organic && <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase bg-emerald-100 text-emerald-800">Organic</span>}
                                    {product.bestseller && <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase bg-amber-100 text-amber-800 border border-amber-200">Bestseller</span>}
                                    {product.featured && <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase bg-blue-100 text-blue-800 border border-blue-200">Featured</span>}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div >
    );
};

export default ProductManagement;
