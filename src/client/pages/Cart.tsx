import { useCart } from "@/context/cart";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingBag, ArrowRight } from "lucide-react";
import SEO from "@/components/SEO";

const formatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

const Cart = () => {
  const { items, subtotal, totalQuantity, updateQuantity, removeItem, clearCart } = useCart();
  const navigate = useNavigate();
  const hasItems = items.length > 0;

  const handleQuantityChange = (id: number | string, delta: number) => {
    const current = items.find((item) => item.id === id);
    if (!current) return;
    const nextQuantity = current.quantity + delta;
    updateQuantity(id, Math.max(0, nextQuantity));
  };

  const formattedSubtotal = formatter.format(subtotal);

  const handleWhatsAppCheckout = () => {
    const message = `Hello Achyutam Organics, I would like to order the following products:

*Products:*
${items.map((item) => `- ${item.name} (x${item.quantity}) - ${formatter.format(item.price * item.quantity)}`).join("\n")}

*Subtotal:* ${formatter.format(subtotal)}

Please confirm my order and share delivery schedule. Thank you!`.trim();

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/919425156801?text=${encodedMessage}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <>
      <SEO
        title="Your Cart | Achyutam Organics"
        description="Review your selection of pure organic Desi Gir cow Ghee and dairy products."
        canonicalUrl="/cart"
      />

      <main className="min-h-screen pt-24 pb-16 bg-slate-50 font-lato">
        <section className="px-4 text-slate-700">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-10 animate-fade-in font-lato">
              <p className="uppercase tracking-[0.35em] text-xs text-primary mb-3">Your Selection</p>
              <h1 className="font-playfair text-4xl md:text-5xl text-primary pb-1">
                Pure goodness for your home
              </h1>
              <p className="text-slate-600 max-w-2xl mx-auto mt-4 font-medium">
                Review your selection of farm-fresh A2 Desi Gir cow Ghee and organic dairy products. Each jar is filled with tradition and purity.
              </p>
            </div>

            <div className="grid gap-8 lg:grid-cols-3">
              <div className="space-y-6 lg:col-span-2">
                {hasItems ? (
                  <>
                    {items.map((item, index) => (
                      <div
                        key={`${item.id}-${index}`}
                        className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300"
                      >
                        <div className="w-full sm:w-20 md:w-24 shrink-0 aspect-square overflow-hidden rounded-xl bg-slate-50 border border-slate-100">
                          <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                        </div>
                        <div className="flex-1 space-y-1">
                          <div className="flex flex-col xl:flex-row xl:items-start xl:justify-between gap-1 xl:gap-3">
                            <div>
                              <h2 className="text-sm sm:text-base md:text-lg text-primary line-clamp-2 md:line-clamp-none leading-tight font-lato font-semibold">{item.name}</h2>
                            </div>
                            <span className="text-primary text-sm sm:text-base md:text-lg font-bold font-sans tracking-tight">{formatter.format(item.price * item.quantity)}</span>
                          </div>
                          <div className="flex flex-wrap items-center gap-2 md:gap-4 md:pt-1 text-xs md:text-sm text-slate-500 font-medium font-lato">
                            <div className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50">
                              <button
                                type="button"
                                className="px-3 py-1 text-lg font-bold hover:text-emerald-700 transition-colors"
                                onClick={() => handleQuantityChange(item.id, -1)}
                              >
                                −
                              </button>
                              <span className="px-4 py-1 text-sm font-bold text-slate-800 font-sans">{item.quantity}</span>
                              <button
                                type="button"
                                className="px-3 py-1 text-lg font-bold hover:text-emerald-700 transition-colors"
                                onClick={() => handleQuantityChange(item.id, 1)}
                              >
                                +
                              </button>
                            </div>
                            <button
                              type="button"
                              className="underline underline-offset-4 hover:text-red-500 transition-colors font-bold"
                              onClick={() => removeItem(item.id)}
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                    <div className="flex flex-wrap gap-4 pt-4">
                      <Button
                        variant="outline"
                        className="rounded-full border-slate-200 text-slate-600 hover:bg-slate-50 font-bold px-8 font-lato"
                        onClick={() => clearCart()}
                      >
                        Clear cart
                      </Button>
                      <Button asChild variant="outline" className="rounded-full border-accent text-accent hover:bg-accent/5 px-8 font-lato">
                        <Link to="/products">Continue shopping</Link>
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="flex items-center justify-center min-h-[50vh]">
                    <div className="p-8 sm:p-16 rounded-3xl bg-white border border-slate-100 text-center space-y-8 shadow-sm max-w-md w-full font-lato">
                      <div className="mx-auto w-20 h-20 sm:w-24 sm:h-24 bg-slate-50 rounded-full flex items-center justify-center">
                        <ShoppingBag className="w-10 h-10 sm:w-12 sm:h-12 text-slate-300" />
                      </div>
                      <div>
                        <h2 className="font-playfair text-3xl mb-2">Your cart is empty</h2>
                        <p className="text-slate-500 font-medium">Bring home the purity of traditional Bilona Ghee.</p>
                      </div>
                      <Button asChild className="rounded-full bg-primary text-white hover:bg-primary/90 shadow-xl shadow-primary/10 px-12 py-8 text-lg font-lato">
                        <Link to="/products">Explore Our Products</Link>
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              {hasItems && (
                <aside className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-100 shadow-xl space-y-6 md:space-y-8 animate-fade-in h-fit sticky top-24 font-lato w-full">
                  <div>
                    <h2 className="font-playfair text-2xl mb-2 font-bold">Summary</h2>
                    <p className="text-sm text-slate-500 font-medium leading-relaxed">
                      Secure checkout and farm-fresh delivery in 3-5 business days.
                    </p>
                  </div>

                  <div className="space-y-4 text-sm font-medium text-slate-600">
                    <div className="flex items-center justify-between">
                      <span>Total Items</span>
                      <span className="font-bold text-slate-800 font-sans">{totalQuantity}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Subtotal</span>
                      <span className="font-bold text-slate-800 font-sans">{formattedSubtotal}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-lato">Delivery</span>
                      <span className="text-emerald-600 font-bold font-lato">FREE</span>
                    </div>
                    <div className="flex items-center justify-between font-playfair text-primary text-2xl border-t border-slate-100 pt-6 mt-2">
                      <span className="font-playfair">Total</span>
                      <span className="font-sans">{formattedSubtotal}</span>
                    </div>
                  </div>

                  <div className="space-y-3 pt-4">
                    <Button
                      size="lg"
                      className="w-full rounded-full bg-primary text-white hover:bg-primary/90 shadow-lg shadow-primary/10 py-3 md:py-4 text-xs md:text-base group transition-all font-lato font-bold"
                      onClick={() => navigate("/checkout")}
                    >
                      Checkout Now
                      <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                    <Button
                      variant="outline"
                      size="lg"
                      className="w-full rounded-full border-2 border-primary text-primary hover:bg-primary/5 py-3 md:py-4 text-xs md:text-base transition-all font-lato font-bold"
                      onClick={handleWhatsAppCheckout}
                    >
                      Order via WhatsApp
                    </Button>
                  </div>

                  <div className="rounded-2xl border border-emerald-100 bg-emerald-50/50 p-6 text-sm">
                    <p className="font-bold text-emerald-900 mb-1 font-lato">Secure Checkout</p>
                    <p className="text-emerald-800 leading-relaxed font-medium">We use Razorpay for 100% secure payments. All major cards and UPI accepted.</p>
                  </div>
                </aside>
              )}
            </div>
          </div>
        </section>
      </main>

    </>
  );
};

export default Cart;
