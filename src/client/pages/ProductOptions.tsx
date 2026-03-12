import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/cart";
import { useToast } from "@/hooks/use-toast";
import SEO from "@/components/SEO";
import ghee250 from "@/assets/ghee-250ml.png";
import ghee500 from "@/assets/ghee-500ml.png";
import ghee1kg from "@/assets/ghee-1kg.png";
import freshMilk from "@/assets/fresh-milk.png";

const ProductOptions = () => {
  const navigate = useNavigate();
  const { category } = useParams();
  const { addItem } = useCart();
  const { toast } = useToast();

  const products = {
    ghee: [
      { id: 101, name: "Pure Desi Cow Ghee - 250ml", price: "₹250", image: ghee250 },
      { id: 102, name: "Pure Desi Cow Ghee - 500ml", price: "₹450", image: ghee500 },
      { id: 103, name: "Pure Desi Cow Ghee - 1 Liter", price: "₹850", image: ghee1kg },
    ],
    milk: [
      { id: 104, name: "Fresh Cow Milk - Daily Delivery", price: "₹60", image: freshMilk },
    ]
  };

  const currentProducts = products[category as keyof typeof products] || [];

  const handleAddToCart = (product: typeof currentProducts[0]) => {
    const price = Number(product.price.replace(/[^0-9.-]+/g, "")) || 0;
    addItem({
      id: product.id,
      name: product.name,
      price: price,
      image: product.image,
      quantity: 1,
    });

    toast({
      title: "Added to your cart",
      description: `${product.name} is now in your basket.`,
    });
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <SEO
        title={`${category === 'ghee' ? 'Ghee' : 'Milk'} Options | Achyutam Organics`}
        description={`Choose from our range of ${category === 'ghee' ? 'premium desi cow ghee' : 'fresh cow milk'} products.`}
        canonicalUrl={`/products/${category}`}
      />

      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={handleBack}
              className="rounded-full px-8 py-4 text-sm sm:text-base font-semibold border-primary text-primary hover:bg-primary hover:text-white transition-all duration-300"
            >
              ← Back
            </Button>
            <h1 className="text-2xl font-bold text-gray-900 capitalize">
              {category === 'ghee' ? 'Ghee Options' : 'Milk Options'}
            </h1>
          </div>
        </div>
      </div>

      {/* Product Grid */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {currentProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 overflow-hidden"
            >
              {/* Product Image */}
              <div className="aspect-square overflow-hidden bg-gray-50">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-contain p-8 rounded-[10px]"
                />
              </div>

              {/* Product Details */}
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {product.name}
                </h3>
                <p className="text-2xl font-bold text-primary mb-4">
                  {product.price}
                </p>
                
                {/* Delivery Info */}
                <div className="mb-6">
                  {category === 'ghee' ? (
                    <div className="text-sm text-green-600 bg-green-50 p-3 rounded-lg">
                      ✓ All India Delivery
                    </div>
                  ) : (
                    <div className="text-sm text-orange-600 bg-orange-50 p-3 rounded-lg">
                      ✓ Katni Only
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <Button
                    onClick={() => handleAddToCart(product)}
                    className="flex-1 rounded-full px-8 py-4 text-sm sm:text-base font-semibold bg-primary text-white hover:shadow-glow hover:scale-[1.02] transition-transform"
                  >
                    Add to Cart
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => navigate('/checkout')}
                    className="rounded-full px-8 py-4 text-sm sm:text-base font-semibold border-primary text-primary hover:bg-primary hover:text-white transition-all duration-300"
                  >
                    Checkout
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductOptions;
