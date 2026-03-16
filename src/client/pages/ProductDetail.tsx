import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/cart";
import { useToast } from "@/hooks/use-toast";
import SEO from "@/components/SEO";
import { ArrowLeft, Plus, Minus, ShoppingCart, X } from "lucide-react";
import ghee250gm from "@/assets/ghee_product/ghee_250gm.jpeg";
import ghee500ml from "@/assets/ghee_product/ghee_500ml.jpeg";
import ghee1kg from "@/assets/ghee_product/ghee_1kg.jpeg";
import freshMilk from "@/assets/fresh-milk.jpg";

// Quantity Selection Modal Component
const QuantityModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  product, 
  selectedVariant, 
  variants 
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (variantId: string, quantity: number) => void;
  product: any;
  selectedVariant: string;
  variants: any[];
}) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedVariantId, setSelectedVariantId] = useState(selectedVariant || variants[0]?.id);

  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm(selectedVariantId, quantity);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Select Quantity</h3>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Variant</label>
            <select 
              value={selectedVariantId}
              onChange={(e) => setSelectedVariantId(e.target.value)}
              className="w-full p-2 border rounded-lg"
            >
              {variants.map(variant => (
                <option key={variant.id} value={variant.id}>
                  {variant.name} - {variant.price}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Quantity</label>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
              >
                <Minus className="w-3 h-3" />
              </Button>
              <span className="px-3 py-1 border rounded-lg min-w-[50px] text-center text-sm">{quantity}</span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setQuantity(quantity + 1)}
              >
                <Plus className="w-3 h-3" />
              </Button>
            </div>
          </div>
          
          <div className="flex space-x-2 pt-4">
            <Button onClick={handleConfirm} size="sm" className="flex-1">
              <ShoppingCart className="w-3 h-3 mr-2" />
              Add to Cart
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Product data - in a real app this would come from API
const getProductData = (id: string) => {
  // All ghee products (101, 102, 103) should return the same ghee data
  if (id === "101" || id === "102" || id === "103") {
    return {
      name: "Pure Desi Cow Ghee",
      description: "Premium quality desi cow ghee made using traditional Bilona method. Rich in aroma and nutrition.",
      variants: [
        { id: "101", name: "250gm", price: "₹550 per litre", image: ghee250gm },
        { id: "102", name: "500ml", price: "₹1050 per litre", image: ghee500ml },
        { id: "103", name: "1kg", price: "₹2100 per litre", image: ghee1kg }
      ],
      features: ["100% Organic", "Traditional Bilona Method", "A2 Cow Milk", "No Preservatives"],
      nutritionalInfo: "Rich in healthy fats, vitamins A, D, E, and K",
      storage: "Store in cool, dry place away from direct sunlight",
      category: "Ghee"
    };
  }
  
  const products = {
    "104": {
      name: "Fresh Cow Milk",
      description: "Pure and fresh cow milk delivered daily at your doorstep. Sourced from healthy grass-fed cows.",
      variants: [
        { id: "104", name: "Daily Delivery - 1L", price: "₹80 per litre", image: freshMilk }
      ],
      features: ["Farm Fresh", "Daily Delivery", "No Preservatives", "Grass-fed Cows"],
      nutritionalInfo: "Rich in calcium, protein, and essential nutrients",
      storage: "Refrigerate immediately, consume within 2 days",
      category: "Milk"
    }
  };
  
  return products[id];
};

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { toast } = useToast();
  
  const [selectedVariant, setSelectedVariant] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);
  const [showQuantityModal, setShowQuantityModal] = useState(false);
  const [modalAction, setModalAction] = useState<'cart' | 'buy'>('cart');
  
  const product = getProductData(id);
  
  if (!product) {
    return <div>Product not found</div>;
  }

  const handleAddToCart = (variantId?: string, qty?: number) => {
    const variantToUse = variantId || selectedVariant;
    const quantityToUse = qty || quantity;
    
    const variant = product.variants.find(v => v.id === variantToUse);
    if (!variant) {
      toast({
        title: "Please select a variant",
        description: "Choose a product variant to add to cart.",
        variant: "destructive",
      });
      return;
    }
    
    const price = Number(variant.price.replace(/[^0-9.-]+/g, "")) || 0;
    
    addItem({
      id: variant.id,
      name: `${product.name} - ${variant.name}`,
      price: price,
      image: variant.image,
      quantity: quantityToUse,
    });
    
    toast({
      title: "Added to cart",
      description: `${product.name} - ${variant.name} added to your basket.`,
    });
  };
  
  const handleBuyNow = (variantId?: string, qty?: number) => {
    const variantToUse = variantId || selectedVariant;
    const quantityToUse = qty || quantity;
    
    const variant = product.variants.find(v => v.id === variantToUse);
    if (!variant) {
      toast({
        title: "Please select a variant",
        description: "Choose a product variant to proceed to checkout.",
        variant: "destructive",
      });
      return;
    }
    
    const price = Number(variant.price.replace(/[^0-9.-]+/g, "")) || 0;
    
    addItem({
      id: variant.id,
      name: `${product.name} - ${variant.name}`,
      price: price,
      image: variant.image,
      quantity: quantityToUse,
    });
    
    navigate('/checkout');
  };

  const handleCartClick = () => {
    if (selectedVariant) {
      handleAddToCart();
    } else {
      setModalAction('cart');
      setShowQuantityModal(true);
    }
  };

  const handleBuyNowClick = () => {
    if (selectedVariant) {
      handleBuyNow();
    } else {
      setModalAction('buy');
      setShowQuantityModal(true);
    }
  };

  const handleModalConfirm = (variantId: string, qty: number) => {
    if (modalAction === 'cart') {
      handleAddToCart(variantId, qty);
    } else {
      handleBuyNow(variantId, qty);
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <SEO
        title={`${product.name} | Achyutam Organics`}
        description={product.description}
        canonicalUrl={`/product/${id}`}
      />
      
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center">
            <Button
              variant="outline"
              onClick={() => navigate(-1)}
              size="sm"
              className="rounded-full px-3 py-2 md:px-6 md:py-3 text-xs md:text-sm font-semibold border-primary/30 text-primary hover:bg-primary/5 hover:brightness-95 transition-all"
            >
              <ArrowLeft className="w-3 h-3 mr-2" />
              Back
            </Button>
          </div>
        </div>
      </div>

      {/* Product Details */}
      <div className="container mx-auto px-4 py-8">
        {/* Category Section Header */}
        <section className="mb-12">
          <div className="text-center">
            <h2 className="font-playfair text-3xl md:text-5xl mb-4">
              {product.category === "Ghee" ? "Premium Ghee Collection" : "Fresh Dairy Products"}
            </h2>
            <div className="w-24 h-1 bg-accent mx-auto rounded-full mb-6" />
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              {product.category === "Ghee" 
                ? "Traditional Bilona method ghee made from pure A2 cow milk. Available in multiple sizes for your convenience."
                : "Farm-fresh cow milk delivered daily from our grass-fed cows. Pure and nutritious."
              }
            </p>
          </div>
          
          {/* Category Navigation */}
          <div className="flex justify-center mt-8">
            <div className="inline-flex items-center bg-white rounded-full shadow-lg p-2">
              <Button
                variant={product.category === "Ghee" ? "default" : "ghost"}
                size="sm"
                className="rounded-full px-3 py-2 md:px-6 md:py-3 font-semibold"
                disabled
              >
                Ghee
              </Button>
              <div className="w-px h-8 bg-gray-300 mx-2" />
              <Button
                variant={product.category === "Milk" ? "default" : "ghost"}
                size="sm"
                className="rounded-full px-3 py-2 md:px-6 md:py-3 font-semibold"
                disabled
              >
                Milk
              </Button>
            </div>
          </div>
        </section>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-8">
              {(() => {
                const currentVariant = selectedVariant ? product.variants.find(v => v.id === selectedVariant) : product.variants[0];
                const isSmallVariant = currentVariant?.name === "250gm" || currentVariant?.name === "500ml";
                return (
                  <img
                    src={selectedVariant ? product.variants.find(v => v.id === selectedVariant)?.image || product.variants[0].image : product.variants[0].image}
                    alt={product.name}
                    className={`w-full h-auto max-h-[600px] object-contain rounded-lg transition-transform duration-700 hover:scale-${isSmallVariant ? 150 : 125} cursor-zoom-in`}
                  />
                );
              })()}
            </div>
          </div>

          {/* Product Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* Product Name */}
            <h1 className="text-3xl mb-4 font-lato">
              {product.name}
            </h1>
            
            {/* Description */}
            <p className="text-gray-600 leading-relaxed mb-6">
              {product.description}
            </p>
            
            {/* Variant Selection */}
            <div className="mb-6">
              <h3 className="text-sm md:text-base text-slate-500 mb-3 uppercase tracking-wider">Select Variant</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-3">
                {product.variants.map((variant) => (
                  <div
                    key={variant.id}
                    className={`border rounded-xl p-3 md:p-4 cursor-pointer transition-all flex flex-col items-center justify-center text-center relative overflow-hidden ${
                      selectedVariant === variant.id
                        ? 'border-accent bg-accent/5 shadow-sm'
                        : 'border-slate-200 bg-white hover:border-accent/20 hover:bg-slate-50'
                    }`}
                    onClick={() => setSelectedVariant(variant.id)}
                  >
                    {selectedVariant === variant.id && (
                        <div className="absolute top-0 right-0 w-0 h-0 border-t-[24px] border-r-[24px] border-t-accent border-r-transparent">
                            <span className="absolute -top-[22px] right-[2px] text-white text-[10px]">✓</span>
                        </div>
                    )}
                    <div className="text-foreground font-semibold text-sm md:text-base mb-1">{variant.name}</div>
                    <div className="text-base md:text-lg text-accent-foreground">{variant.price}</div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Quantity Selector */}
            <div className="mb-6">
              <h3 className="text-lg mb-3">Quantity</h3>
              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                  className="w-10 h-10 rounded-full"
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <span className="w-16 text-center">{quantity}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 rounded-full"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            {/* Features */}
            <div className="mb-6">
              <h3 className="text-lg mb-3">Features</h3>
              <div className="grid grid-cols-2 gap-3">
                {product.features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">✓</span>
                    </div>
                    <span className="text-sm text-gray-600">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Additional Info */}
            <div className="space-y-4">
              <div>
                <h3 className="text-lg mb-2">Nutritional Information</h3>
                <p className="text-sm text-gray-600">{product.nutritionalInfo}</p>
              </div>
              <div>
                <h3 className="text-lg mb-2">Storage Instructions</h3>
                <p className="text-sm text-gray-600">{product.storage}</p>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                onClick={handleCartClick}
                className="flex-1 rounded-full py-6 text-sm sm:text-base font-bold bg-accent text-accent-foreground hover:brightness-95 transition-all"
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                Add to Cart
              </Button>
              <Button
                onClick={handleBuyNowClick}
                variant="outline"
                className="flex-1 rounded-full py-6 text-sm sm:text-base font-bold border-primary/30 text-primary hover:bg-primary/5 hover:brightness-95 transition-all"
              >
                Buy Now
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Recommended Products */}
      <div className="container mx-auto px-4 py-12 bg-white">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-playfair mb-4">Recommended Products</h2>
          <div className="w-16 h-1 bg-accent mx-auto rounded-full" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {/* Only Milk Product */}
          <div className="bg-gray-50 rounded-xl p-6 text-center hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/product/104')}>
            <img src={freshMilk} alt="Fresh Cow Milk" className="w-32 h-32 mx-auto object-contain mb-4 rounded-lg" />
            <h3 className="font-lato font-semibold mb-2">Fresh Cow Milk - Daily Delivery</h3>
            <p className="text-accent font-bold mb-2">₹80 per litre</p>
            <p className="text-sm text-gray-600">Farm Fresh Daily</p>
          </div>
        </div>
        
        <div className="text-center mt-8">
          <Button
            onClick={() => navigate('/products')}
            variant="outline"
            className="rounded-full px-8 py-3 border-accent text-accent hover:bg-accent hover:text-accent-foreground transition-all"
          >
            View All Products
          </Button>
        </div>
      </div>

      {/* Quantity Selection Modal */}
      <QuantityModal
        isOpen={showQuantityModal}
        onClose={() => setShowQuantityModal(false)}
        onConfirm={handleModalConfirm}
        product={product}
        selectedVariant={selectedVariant}
        variants={product.variants}
      />
    </div>
  );
};

export default ProductDetail;
