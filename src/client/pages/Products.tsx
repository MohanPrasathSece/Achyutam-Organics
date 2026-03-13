import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCart } from "@/context/cart";
import { useToast } from "@/hooks/use-toast";
import { supabase, useMockData } from "@/lib/supabase";
import { Search, SlidersHorizontal, ArrowDownWideNarrow, ArrowUpWideNarrow } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import SEO from "@/components/SEO";
import heroGhee from "@/assets/ghee-hero.jpg";

// New ghee images from src/client/assets folder
import ghee250gm from "../assets/ghee_product/ghee_250gm.jpeg";
import ghee500ml from "../assets/ghee_product/ghee_500ml.jpeg";
import ghee1kg from "../assets/ghee_product/ghee_1kg.jpeg";

// Fallback fresh milk image
import freshMilk from "@/assets/fresh-milk.jpg";

type CategoryName = string;

interface Product {
  id: string | number;
  name: string;
  price: string | number;
  category: CategoryName;
  image: string;
  featured?: boolean;
  stock_status?: boolean;
  visibility?: boolean;
}

const MOCK_PRODUCTS: Product[] = [
  { id: 101, name: "Pure Desi Cow Ghee", price: "₹2100/l", category: "Ghee", image: ghee1kg, visibility: true, stock_status: true, featured: true },
  { id: 104, name: "Fresh Cow Milk - Daily Delivery", price: "₹80/l", category: "Milk", image: freshMilk, visibility: true, stock_status: true, featured: true },
];

const Products = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { toast } = useToast();

  const [dbProducts, setDbProducts] = useState<Product[]>([]);
  const [dbCategories, setDbCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"featured" | "price-low" | "price-high">("featured");

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (useMockData) {
          // Use mock data when Supabase is not configured
          setDbProducts(MOCK_PRODUCTS);
          setDbCategories(["All", "Ghee", "Milk"]);
          setLoading(false);
          return;
        }

        // Fetch data from Supabase
        const [productsRes, categoriesRes] = await Promise.all([
          supabase.from("products").select("*, categories(name)").eq("status", "active"),
          supabase.from("categories").select("name"),
        ]);

        if (productsRes.error) throw productsRes.error;
        if (categoriesRes.error) throw categoriesRes.error;

        // Map Supabase rows to local Product shape
        const mappedProducts: Product[] = (productsRes.data || []).map((p: any) => ({
          id: p.id,
          name: p.name,
          price: p.price,
          category: p.categories?.name || "Uncategorized",
          image: Array.isArray(p.images) && p.images.length > 0 ? p.images[0] : ghee250gm,
          featured: p.featured || false,
          stock_status: p.status === "active",
        }));

        setDbProducts(mappedProducts);
        setDbCategories(["All", ...(categoriesRes.data?.map((c: any) => c.name) || [])]);
      } catch (error) {
        console.error("Error fetching data:", error);
        // Fallback to mock data
        setDbProducts(MOCK_PRODUCTS);
        setDbCategories(["All", "Ghee", "Milk"]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const products = dbProducts.length > 0 ? dbProducts : MOCK_PRODUCTS;
  const categories = dbCategories.length > 0 ? dbCategories : ["All", "Ghee", "Dairy"];

  const queryCategory = useMemo(() => {
    const params = new URLSearchParams(location.search);
    const categoryParam = params.get("category");
    if (!categoryParam) return undefined;
    const normalized = categoryParam.replace(/\+/g, " ");
    const match = categories.find((cat) => cat.toLowerCase() === normalized.toLowerCase());
    return match;
  }, [location.search, categories]);

  const [selectedCategory, setSelectedCategory] = useState<string>(queryCategory ?? "All");
  const gridRef = useRef<HTMLDivElement>(null);
  const hasScrolledForQueryRef = useRef(false);

  const scrollToGrid = () => {
    if (!gridRef.current) return;
    const rect = gridRef.current.getBoundingClientRect();
    // Only scroll if the grid top is above the current view area
    if (rect.top < 0) {
      const offset = window.pageYOffset + rect.top - 160;
      window.scrollTo({ top: Math.max(offset, 0), behavior: "smooth" });
    }
  };

  useEffect(() => {
    if (queryCategory && queryCategory !== selectedCategory) {
      setSelectedCategory(queryCategory);
      if (!hasScrolledForQueryRef.current) {
        requestAnimationFrame(() => scrollToGrid());
        hasScrolledForQueryRef.current = true;
      }
    }
    if (!queryCategory && selectedCategory !== "All") {
      setSelectedCategory("All");
    }
  }, [queryCategory, selectedCategory]);

  const updateCategory = (category: string) => {
    setSelectedCategory(category);
    const params = new URLSearchParams(location.search);
    if (category === "All") {
      params.delete("category");
    } else {
      params.set("category", category);
    }
    navigate({ pathname: location.pathname, search: params.toString() }, { replace: true });
    requestAnimationFrame(() => scrollToGrid());
  };

  const parsePrice = (price: string | number) => {
    if (typeof price === "number") return price;
    return Number(price.replace(/[^0-9.-]+/g, "")) || 0;
  };

  const filteredProducts = useMemo(() => {
    let base = selectedCategory === "All" ? products : products.filter((product) => product.category === selectedCategory);

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      base = base.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      );
    }

    return [...base].sort((a, b) => {
      if (sortBy === "price-low") return parsePrice(a.price) - parsePrice(b.price);
      if (sortBy === "price-high") return parsePrice(b.price) - parsePrice(a.price);
      return Number(!!b.featured) - Number(!!a.featured);
    });
  }, [selectedCategory, products, searchQuery, sortBy]);

  const handleAddToCart = (product: Product) => {
    if (product.stock_status === false) {
      toast({ title: "Out of Stock", description: "This dairy product is currently unavailable.", variant: "destructive" });
      return;
    }
    addItem({
      id: product.id,
      name: product.name,
      price: parsePrice(product.price),
      image: product.image,
      quantity: 1,
    });
    toast({
      title: "Added to your cart",
      description: `${product.name} is now in your basket. Pure nutrition awaits!`,
    });
  };
  const productListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "itemListElement": filteredProducts.slice(0, 20).map((product, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "Product",
        "url": `https://achyutamorganics.com/products?category=${product.category}&id=${product.id}`,
        "name": product.name,
        "image": product.image.startsWith("http") ? product.image : `https://achyutamorganics.com${product.image}`,
        "description": `Pure traditional Bilona method Indian Desi Cow Ghee from Achyutam Organics.`,
        "offers": {
          "@type": "Offer",
          "price": parsePrice(product.price),
          "priceCurrency": "INR",
          "availability": product.stock_status === false ? "https://schema.org/OutOfStock" : "https://schema.org/InStock"
        }
      }
    }))
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://achyutamorganics.com/"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Products",
        "item": "https://achyutamorganics.com/products"
      },
      ...(selectedCategory !== "All" ? [{
        "@type": "ListItem",
        "position": 3,
        "name": selectedCategory,
        "item": `https://achyutamorganics.com/products?category=${selectedCategory}`
      }] : [])
    ]
  };

  const collectionPageSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "mainEntity": productListSchema,
    "name": selectedCategory === "All" ? "Achyutam Organics Collection" : `${selectedCategory} Collection`,
    "description": `Browse our exclusive collection of ${selectedCategory.toLowerCase()} produced using traditional Vedic methods.`
  };

  return (
    <main className="min-h-screen pt-16">
      <SEO
        title={selectedCategory === "All" ? "Shop All Organic Products" : `${selectedCategory} Collection`}
        description={`Explore our ${selectedCategory.slice(0, 1).toLowerCase() + selectedCategory.slice(1)} collection. Achyutam Organics offers pure traditional Bilona ghee for your healthy lifestyle.`}
        canonicalUrl={selectedCategory === "All" ? "/products" : `/products?category=${selectedCategory}`}
        schemas={[productListSchema, breadcrumbSchema, collectionPageSchema]}
      />
      {/* Banner Section */}
      <section className="relative h-[40vh] md:h-[50vh] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroGhee})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/50 to-black/70" />
        </div>
        <div className="relative z-10 h-full flex items-center justify-center px-4">
          <div className="text-center">
            <div className="bg-secondary/60 border border-accent/20 rounded-full px-4 py-2 mb-4 inline-block">
              <span className="text-xs text-accent font-medium">Dairy Products</span>
            </div>
            <h1 className="font-playfair text-4xl md:text-6xl mb-4 text-white">
              Shop Organic
            </h1>
            <p className="text-lg text-white/90 max-w-2xl mx-auto">
              Experience the purity of traditional Vedic methods, delivered directly from our farm to your home.
            </p>
          </div>
        </div>
      </section>

      <section className="sticky top-16 md:top-14 bg-background/95 backdrop-blur-sm z-40 border-b border-border/50 shadow-sm">
        <div className="container mx-auto py-3 md:py-4 px-4">
          <div className="flex flex-col md:flex-row gap-3 md:gap-4 items-center justify-between">
            {/* Category Filter */}
            <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto no-scrollbar scroll-smooth py-1 mt-1 md:mt-0">
              <Button
                variant={selectedCategory === "All" ? "default" : "outline"}
                onClick={() => updateCategory("All")}
                size="sm"
                className={cn(
                  "h-8 md:h-10 text-xs md:text-sm rounded-full whitespace-nowrap transition-all duration-300",
                  selectedCategory === "All"
                    ? "bg-primary text-primary-foreground border-transparent shadow-soft"
                    : "bg-card border-border text-muted-foreground hover:border-primary/50 hover:text-primary"
                )}
              >
                All Products
              </Button>
              <Button
                variant={selectedCategory === "Ghee" ? "default" : "outline"}
                onClick={() => updateCategory("Ghee")}
                size="sm"
                className={cn(
                  "h-8 md:h-10 text-xs md:text-sm rounded-full whitespace-nowrap transition-all duration-300",
                  selectedCategory === "Ghee"
                    ? "bg-primary text-primary-foreground border-transparent shadow-soft"
                    : "bg-card border-border text-muted-foreground hover:border-primary/50 hover:text-primary"
                )}
              >
                Ghee
              </Button>
              <Button
                variant={selectedCategory === "Milk" ? "default" : "outline"}
                onClick={() => updateCategory("Milk")}
                size="sm"
                className={cn(
                  "h-8 md:h-10 text-xs md:text-sm rounded-full whitespace-nowrap transition-all duration-300",
                  selectedCategory === "Milk"
                    ? "bg-primary text-primary-foreground border-transparent shadow-soft"
                    : "bg-card border-border text-muted-foreground hover:border-primary/50 hover:text-primary"
                )}
              >
                Milk
              </Button>
            </div>

            {/* Search and Sort */}
            <div className="flex items-center gap-2 w-full md:w-64 lg:w-96">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 rounded-full border-border focus:ring-primary h-9 md:h-10 w-full bg-card"
                />
              </div>
              <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" className="rounded-full shrink-0 border-border h-9 w-9 md:h-10 md:w-10 bg-card">
                    <SlidersHorizontal className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-card border-border rounded-xl shadow-glow p-1">
                  <DropdownMenuItem onClick={() => setSortBy("price-low")}>Price: Low to High</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy("price-high")}>Price: High to Low</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </section>

      <section className="py-10 px-4">
        <div className="container mx-auto">
          <div className="mb-6 text-center h-6"> {/* Fixed height to prevent layout shift */}
            <p className="text-muted-foreground animate-fade-in font-medium">
              {filteredProducts.length === 0 ? "No products matching your selection" : `Showing ${filteredProducts.length} ${filteredProducts.length === 1 ? "product" : "products"}`}
            </p>
          </div>

          <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-6 md:gap-8 max-w-4xl mx-auto">
            {filteredProducts.map((product, index) => (
              <div
                key={product.id}
                className={`group bg-card rounded-xl md:rounded-2xl overflow-hidden shadow-soft hover:shadow-glow transition-all duration-500 animate-fade-in ${product.stock_status === false ? "opacity-75 grayscale-[0.5]" : ""}`}
                style={{ animationDelay: `${index * 50}ms` }}
                onClick={() => navigate(`/product/${product.id}`)}
              >
                <div className="aspect-square overflow-hidden relative bg-white">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-contain p-4 transition-all duration-1000 group-hover:scale-110"
                    loading="lazy"
                  />
                  {product.stock_status === false && (
                    <div className="absolute inset-0 bg-background/60 flex items-center justify-center backdrop-blur-[1px]">
                      <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-[10px] md:text-xs font-bold tracking-widest uppercase shadow-soft">Out of Stock</span>
                    </div>
                  )}
                </div>
                <div className="p-4 md:p-6">
                  <h3 className="font-lato text-lg md:text-xl mb-2">
                    {product.name}
                  </h3>
                  <p className="text-accent text-lg md:text-xl mb-2">
                    {typeof product.price === "number" ? `₹${product.price.toLocaleString()}` : product.price}
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full h-8 md:h-11 text-xs md:text-sm border-accent text-accent hover:bg-accent/5 hover:brightness-95 transition-all rounded-full font-semibold"
                    onClick={() => navigate(`/product/${product.id}`)}
                    disabled={product.stock_status === false}
                  >
                    {product.stock_status === false ? "Out of Stock" : "View Details"}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default Products;

