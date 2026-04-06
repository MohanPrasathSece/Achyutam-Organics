import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/context/cart";
import { useToast } from "@/hooks/use-toast";
import { ShieldCheck, Leaf, Sparkles } from "lucide-react";

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: {
    id: number;
    name: string;
    price: string;
    image: string;
    category: string;
    deliveryInfo?: string;
    description?: string;
    weight?: number;
    unit?: string;
    shelfLife?: string;
    storage?: string;
    ingredients?: string[];
  };
}

const ProductModal = ({ isOpen, onClose, product }: ProductModalProps) => {
  const { addItem } = useCart();
  const { toast } = useToast();

  const handleAddToCart = () => {
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
    onClose();
  };

  const parsePrice = (price: string) => Number(price.replace(/[^0-9.-]+/g, "")) || 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-900">
            {product.name}
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid md:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="aspect-square overflow-hidden bg-gray-50 rounded-lg">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-contain p-8 rounded-[10px]"
            />
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            {/* Price and Delivery Info */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-2xl font-bold text-primary">
                  {product.price}
                </span>
                {product.deliveryInfo && (
                  <Badge variant="secondary" className="text-xs">
                    {product.deliveryInfo}
                  </Badge>
                )}
              </div>
            </div>

            {/* Product Information */}
            <div className="space-y-4">
              {product.weight && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Weight:</span>
                  <span className="font-medium">{product.weight} {product.unit}</span>
                </div>
              )}

              {product.shelfLife && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Shelf Life:</span>
                  <span className="font-medium">{product.shelfLife}</span>
                </div>
              )}

              {product.storage && (
                <div>
                  <span className="text-gray-600">Storage:</span>
                  <p className="text-sm mt-1 text-gray-700">{product.storage}</p>
                </div>
              )}

              {product.ingredients && product.ingredients.length > 0 && (
                <div>
                  <span className="text-gray-600">Ingredients:</span>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {product.ingredients.map((ingredient, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {ingredient}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-2 pt-4 pb-2 text-center border-t border-gray-50 mt-4">
                <div className="flex flex-col items-center gap-1">
                  <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-tighter text-gray-500">100% Pure</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-tighter text-gray-500">Bilona Method</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <Leaf className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-tighter text-gray-500">Direct Farm</span>
                </div>
              </div>
            </div>

            {/* Description */}
            {product.description && (
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Description</h4>
                <p className="text-gray-700 leading-relaxed">{product.description}</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4 pt-6">
              <Button
                onClick={handleAddToCart}
                className="flex-1 rounded-full py-6 text-sm md:text-base font-bold bg-primary text-white hover:brightness-95 hover:scale-[1.01] transition-all"
              >
                Add to Cart
              </Button>
              <Button
                variant="outline"
                onClick={onClose}
                className="flex-1 rounded-full py-6 text-sm md:text-base font-bold border-primary/20 text-primary hover:bg-primary/5 hover:brightness-95 transition-all"
              >
                Keep Browsing
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductModal;
