import { useState } from "react";
import { useCart } from "@/context/cart";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";
import { getApiUrl } from "@/lib/config";
import { openRazorpayCheckout } from "@/lib/razorpay";
import { validateDeliveryLocation, validateCartForLocation, hasMilkProducts } from "@/lib/locationValidation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import SEO from "@/components/SEO";
import { useToast } from "@/hooks/use-toast";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { CheckCircle2, ArrowRight, Phone, MapPin, Package, Truck } from "lucide-react";

const checkoutSchema = z.object({
    name: z.string().trim().min(1, "Name is required").max(100),
    phone: z.string().trim().min(10, "Valid phone required").max(15),
    email: z.string().trim().email("Valid email required").max(255),
    street: z.string().trim().min(1, "Street is required").max(200),
    city: z.string().trim().min(1, "City is required").max(100),
    state: z.string().trim().min(1, "State is required").max(100),
    pincode: z.string().trim().min(6, "Valid pincode required").max(10),
    payment: z.enum(["cod", "online"]),
});

const Checkout = () => {
    const { items, subtotal, clearCart } = useCart();
    const navigate = useNavigate();
    const [form, setForm] = useState({
        name: "",
        phone: "",
        email: "",
        street: "",
        city: "",
        state: "",
        pincode: "",
        payment: "online" as "cod" | "online"
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [submitted, setSubmitted] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [orderDetails, setOrderDetails] = useState<any>(null);
    
    // Katni Special Pricing Logic
    const isKatni = form.city.toLowerCase().trim() === 'katni' || 
                    form.city.toLowerCase().trim() === 'murwara' || 
                    form.pincode.startsWith('483');
    
    const getDiscountedPrice = (item: any) => {
        if (!isKatni) return item.price;
        const name = item.name.toLowerCase();
        if (name.includes('1kg') || name.includes('1 kg') || name.includes('1 litre') || name.includes('liter') || name.includes('1l') || name.includes('1 l')) return 1800;
        if (name.includes('500ml') || name.includes('500 ml') || name.includes('500g') || name.includes('500 g')) return 900;
        if (name.includes('250gm') || name.includes('250 ml') || name.includes('250g') || name.includes('250 g')) return 450;
        return item.price;
    };

    const displayItems = items.map(item => ({
        ...item,
        price: getDiscountedPrice(item)
    }));

    const displaySubtotal = displayItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const hasKatniDiscount = isKatni && items.some(item => {
        const name = item.name.toLowerCase();
        return name.includes('1kg') || name.includes('1 litre') || name.includes('1l') || 
               name.includes('500ml') || name.includes('500 ml') || name.includes('500g') ||
               name.includes('250gm') || name.includes('250 ml') || name.includes('250g');
    });


    if (items.length === 0 && !showSuccessModal) {
        navigate("/cart");
        return null;
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
        setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const result = checkoutSchema.safeParse(form);
        if (!result.success) {
            const fieldErrors: Record<string, string> = {};
            result.error.errors.forEach((err) => { fieldErrors[err.path[0] as string] = err.message; });
            setErrors(fieldErrors);
            return;
        }

        // Validate delivery location for milk products
        const location = validateDeliveryLocation(form.city, form.state, form.pincode);
        const cartValidation = validateCartForLocation(items, location);
        
        if (!cartValidation.isValid) {
            toast.error(cartValidation.message);
            return;
        }

        // Show warning if milk is being delivered outside Katni
        if (hasMilkProducts(items) && !location.isKatni) {
            toast.error("Fresh milk delivery is only available in Katni, Madhya Pradesh. Please remove milk items from your cart.");
            return;
        }

        if (form.payment === "cod") {
            setIsProcessing(true);
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 30000); // 30s timeout
            const apiUrl = getApiUrl();

            try {
                const response = await fetch(`${apiUrl}/api/orders/create-cod`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    signal: controller.signal,
                    body: JSON.stringify({
                        customer: {
                            name: form.name,
                            email: form.email,
                            phone: form.phone,
                        },
                        shippingAddress: {
                            line1: form.street,
                            city: form.city,
                            state: form.state,
                            postalCode: form.pincode,
                            country: "India",
                        },
                        items: displayItems.map(item => ({
                            id: item.id,
                            name: item.name,
                            price: item.price,
                            quantity: item.quantity,
                        })),
                    }),
                });

                clearTimeout(timeoutId);

                const data = await response.json();
                if (!response.ok) {
                    throw new Error(data.error || "Failed to place order");
                }

                setOrderDetails({
                    id: data.orderNumber || data.orderId,
                    totalAmount: displaySubtotal,
                    paymentMethod: "Cash on Delivery",
                    shippingAddress: { city: form.city }
                });
                
                setShowSuccessModal(true);
            } catch (error: any) {
                if (error.name === 'AbortError') {
                    toast.error("Request timed out. Please check your connection.");
                } else {
                    toast.error(error.message || "Something went wrong. Please try again.");
                }
            } finally {
                setIsProcessing(false);
            }
            return;
        }


        try {
            setIsProcessing(true);
            const apiUrl = getApiUrl();
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 30000); // 30s timeout

            const response = await fetch(`${apiUrl}/api/orders/create`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                signal: controller.signal,
                body: JSON.stringify({
                    customer: {
                        name: form.name,
                        email: form.email,
                        phone: form.phone,
                    },
                    shippingAddress: {
                        line1: form.street,
                        city: form.city,
                        state: form.state,
                        postalCode: form.pincode,
                        country: "India",
                    },
                    items: displayItems.map(item => ({
                        id: item.id,
                        name: item.name,
                        price: item.price,
                        quantity: item.quantity,
                    })),
                }),
            });

            clearTimeout(timeoutId);

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || "Failed to create order");
            }

            const { razorpayKey, orderId: rzpOrderId, amount, currency } = data;

            await openRazorpayCheckout({
                key: razorpayKey,
                amount,
                currency,
                name: "Achyutam Organics",
                description: "Pure A2 Desi Gir Cow Ghee",
                order_id: rzpOrderId,
                handler: async (payment) => {
                    setIsProcessing(true);
                    try {
                        const controller = new AbortController();
                        const timeoutId = setTimeout(() => controller.abort(), 30000); // 30s timeout

                        const verifyRes = await fetch(`${apiUrl}/api/orders/verify`, {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            signal: controller.signal,
                            body: JSON.stringify({
                                razorpayOrderId: payment.razorpay_order_id,
                                razorpayPaymentId: payment.razorpay_payment_id,
                                razorpaySignature: payment.razorpay_signature,
                            }),
                        });

                        clearTimeout(timeoutId);

                        const verifyData = await verifyRes.json();
                        if (!verifyRes.ok) {
                            throw new Error(verifyData.error || "Payment verification failed");
                        }

                        setOrderDetails({
                            id: verifyData.orderNumber || verifyData.orderId || "ONLINE",
                            totalAmount: displaySubtotal,
                            paymentMethod: "Online Payment",
                            shippingAddress: { city: form.city }
                        });
                        
                        setShowSuccessModal(true);
                    } catch (err: any) {
                        toast.error(err.message || "Unable to verify payment");
                    } finally {
                        setIsProcessing(false);
                    }
                },
                prefill: {
                    name: form.name,
                    email: form.email,
                    contact: form.phone,
                },
                theme: {
                    color: "#5299e5", // Soft Blue to match theme
                },
            });

        } catch (err: any) {
            toast.error(err.message || "An error occurred during checkout");
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4">
            <SEO
                title="Checkout | Achyutam Organics"
                description="Complete your order for pure organic ghee and dairy products."
                canonicalUrl="/checkout"
            />

            <div className="container mx-auto max-w-6xl">
                <div className="mb-8 text-center animate-fade-in">
                    <h1 className="text-3xl md:text-5xl font-playfair font-bold text-slate-800 mb-2">Checkout</h1>
                    <p className="text-muted-foreground font-lato">Complete your order details below to receive your farm-fresh goodies.</p>
                </div>

                <form onSubmit={handleSubmit} className="grid gap-6 lg:gap-10 lg:grid-cols-3">
                    <div className="space-y-6 lg:col-span-2">
                        <div className="bg-white rounded-3xl p-6 md:p-10 shadow-sm border border-slate-100 animate-slide-up">
                            {/* Combined Form */}
                            <div className="space-y-10">
                                <section>
                                    <h2 className="text-xl md:text-2xl font-playfair mb-6 flex items-center gap-3">
                                        <Truck className="w-6 h-6 text-primary" />
                                        Shipping & Contact Details
                                    </h2>
                                    <div className="grid gap-x-6 gap-y-5 md:grid-cols-2 font-lato">
                                        <div className="space-y-2">
                                            <Label htmlFor="name" className="text-xs font-bold uppercase tracking-widest text-slate-400">Full Name</Label>
                                            <Input id="name" name="name" value={form.name} onChange={handleChange} placeholder="Your full name" disabled={isProcessing} className={`rounded-xl border-slate-200 focus:ring-primary ${errors.name ? "border-destructive" : ""}`} />
                                            {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="phone" className="text-xs font-bold uppercase tracking-widest text-slate-400">Phone Number</Label>
                                            <Input id="phone" name="phone" type="tel" value={form.phone} onChange={handleChange} placeholder="10-digit mobile number" disabled={isProcessing} className={`rounded-xl border-slate-200 focus:ring-primary ${errors.phone ? "border-destructive" : ""}`} />
                                            {errors.phone && <p className="text-xs text-destructive">{errors.phone}</p>}
                                        </div>
                                        <div className="space-y-2 md:col-span-2">
                                            <Label htmlFor="email" className="text-xs font-bold uppercase tracking-widest text-slate-400">Email Address</Label>
                                            <Input id="email" name="email" type="email" value={form.email} onChange={handleChange} placeholder="your@email.com" disabled={isProcessing} className={`rounded-xl border-slate-200 focus:ring-primary ${errors.email ? "border-destructive" : ""}`} />
                                            {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
                                        </div>
                                        <div className="md:col-span-2 space-y-2">
                                            <Label htmlFor="street" className="text-xs font-bold uppercase tracking-widest text-slate-400">Street Address</Label>
                                            <Input id="street" name="street" value={form.street} onChange={handleChange} placeholder="House no, Building, Street, Area" disabled={isProcessing} className={`rounded-xl border-slate-200 focus:ring-primary ${errors.street ? "border-destructive" : ""}`} />
                                            {errors.street && <p className="text-xs text-destructive">{errors.street}</p>}
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="city" className="text-xs font-bold uppercase tracking-widest text-slate-400">City</Label>
                                            <Input id="city" name="city" value={form.city} onChange={handleChange} placeholder="Your City" disabled={isProcessing} className={`rounded-xl border-slate-200 focus:ring-primary ${errors.city ? "border-destructive" : ""}`} />
                                            {errors.city && <p className="text-xs text-destructive">{errors.city}</p>}
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="state" className="text-xs font-bold uppercase tracking-widest text-slate-400">State</Label>
                                            <Input id="state" name="state" value={form.state} onChange={handleChange} placeholder="Your State" disabled={isProcessing} className={`rounded-xl border-slate-200 focus:ring-primary ${errors.state ? "border-destructive" : ""}`} />
                                            {errors.state && <p className="text-xs text-destructive">{errors.state}</p>}
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="pincode" className="text-xs font-bold uppercase tracking-widest text-slate-400">Pincode</Label>
                                            <Input id="pincode" name="pincode" value={form.pincode} onChange={handleChange} placeholder="6-digit pincode" disabled={isProcessing} className={`rounded-xl border-slate-200 focus:ring-primary ${errors.pincode ? "border-destructive" : ""}`} />
                                            {errors.pincode && <p className="text-xs text-destructive">{errors.pincode}</p>}
                                        </div>
                                    </div>
                                    
                                    {/* Location Validation Message */}
                                    {form.city && form.state && form.pincode && (
                                        <div className="mt-6 font-lato animate-fade-in">
                                            {(() => {
                                                const location = validateDeliveryLocation(form.city, form.state, form.pincode);
                                                const hasMilk = hasMilkProducts(items);
                                                
                                                if (hasMilk && location.isKatni) {
                                                    return (
                                                        <div className="text-sm text-emerald-700 bg-emerald-50 p-4 rounded-2xl border border-emerald-100 flex items-start gap-3">
                                                            <div className="w-5 h-5 bg-emerald-100 rounded-full flex items-center justify-center shrink-0 mt-0.5">✓</div>
                                                            <div>
                                                                <p className="font-bold">Fresh Milk Delivery Available</p>
                                                                <p className="opacity-80 text-xs">We deliver farm-fresh milk directly to Katni addresses.</p>
                                                            </div>
                                                        </div>
                                                    );
                                                } else if (hasMilk && !location.isKatni) {
                                                    return (
                                                        <div className="text-sm text-red-700 bg-red-50 p-4 rounded-2xl border border-red-100 flex items-start gap-3">
                                                            <div className="w-5 h-5 bg-red-100 rounded-full flex items-center justify-center shrink-0 mt-0.5">✕</div>
                                                            <div>
                                                                <p className="font-bold">Milk Delivery Not Available</p>
                                                                <p className="opacity-80 text-xs">Farm-fresh milk is currently only delivered in Katni. Please remove milk products to continue.</p>
                                                            </div>
                                                        </div>
                                                    );
                                                } else {
                                                    return (
                                                        <div className="text-sm text-primary/70 bg-primary/5 p-4 rounded-2xl border border-primary/10 flex items-start gap-3">
                                                            <div className="w-5 h-5 bg-primary/10 rounded-full flex items-center justify-center shrink-0 mt-0.5 text-[10px]">ℹ</div>
                                                            <div>
                                                                <p className="font-bold">Shipping Information</p>
                                                                <p className="opacity-80 text-xs">Our Ghee and organic products can be shipped anywhere in India.</p>
                                                            </div>
                                                        </div>
                                                    );
                                                }
                                            })()}
                                            
                                            {hasKatniDiscount && (
                                                <div className="mt-3 text-sm text-amber-700 bg-amber-50 p-4 rounded-2xl border border-amber-100 flex items-start gap-3">
                                                    <div className="w-5 h-5 bg-amber-100 rounded-full flex items-center justify-center shrink-0 mt-0.5 text-xs text-amber-700 font-bold">✨</div>
                                                    <div>
                                                        <p className="font-bold">Katni Special Discount Applied!</p>
                                                        <p className="opacity-80 text-xs">Special pricing has been applied to Ghee products for your location.</p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </section>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl md:rounded-3xl p-4 md:p-8 shadow-sm border border-slate-100">
                            <h2 className="text-lg md:text-2xl font-playfair mb-4 md:mb-6 underline decoration-accent/30 underline-offset-8">Payment Method</h2>
                            <div className="mt-4 flex flex-col sm:flex-row gap-4">
                                {[
                                    { value: "online", label: "Online Payment", disabled: false },
                                    { value: "cod", label: "Cash on Delivery", disabled: false },
                                ].map((opt) => (
                                    <label key={opt.value} className={`flex-1 cursor-pointer rounded-xl md:rounded-2xl border-2 p-4 md:p-6 transition-all ${opt.disabled ? "opacity-50 cursor-not-allowed bg-slate-50 border-slate-100" :
                                        form.payment === opt.value ? "border-emerald-600 bg-emerald-50/30" : "border-slate-100 hover:border-emerald-200"
                                        }`}>
                                        <input type="radio" name="payment" value={opt.value} checked={form.payment === opt.value} onChange={() => setForm(f => ({ ...f, payment: opt.value as any }))} className="sr-only" disabled={opt.disabled || isProcessing} />
                                        <div className="flex flex-col items-center gap-2">
                                            <span className={`text-base ${form.payment === opt.value ? "text-accent font-bold" : "text-slate-600"}`}>{opt.label}</span>
                                            {opt.disabled && <span className="text-[10px] text-muted-foreground uppercase tracking-wider">(Temporarily Disabled)</span>}
                                        </div>
                                    </label>
                                ))}
                            </div>
                            <p className="mt-6 text-center text-xs text-muted-foreground font-lato">Secure payment powered by Razorpay. All major cards, UPI, and net banking accepted.</p>
                        </div>
                    </div>

                    <aside className="lg:sticky lg:top-24 h-fit space-y-6">
                        <div className="bg-white rounded-xl md:rounded-3xl border border-slate-100 shadow-xl p-4 md:p-8">
                            <h3 className="font-playfair text-lg md:text-2xl mb-4 md:mb-6">Order Summary</h3>
                            <div className="space-y-4 mb-8 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                                {displayItems.map((item, index) => (
                                    <div key={`${item.id}-${index}`} className="flex justify-between items-start gap-4 pb-4 border-b border-slate-50 last:border-0 last:pb-0">
                                        <div className="flex-1">
                                            <p className="font-bold text-slate-800 leading-tight text-sm md:text-base">{item.name}</p>
                                            <p className="text-xs text-muted-foreground mt-1">Quantity: {item.quantity}</p>
                                            {isKatni && (item.name.toLowerCase().includes('1kg') || item.name.toLowerCase().includes('liter') || item.name.toLowerCase().includes('1l') || item.name.toLowerCase().includes('500ml') || item.name.toLowerCase().includes('250g') || item.name.toLowerCase().includes('250gm')) && (
                                                <p className="text-[10px] text-emerald-600 font-bold mt-1">Katni Special Price Applied</p>
                                            )}
                                        </div>
                                        <div className="text-right">
                                            <span className="font-bold text-emerald-700 text-sm md:text-base">₹{item.price * item.quantity}</span>
                                            {isKatni && (item.name.toLowerCase().includes('1kg') || item.name.toLowerCase().includes('liter') || item.name.toLowerCase().includes('1l') || item.name.toLowerCase().includes('500ml') || item.name.toLowerCase().includes('250g') || item.name.toLowerCase().includes('250gm')) && (
                                                <p className="text-[10px] text-slate-400 line-through">₹{items.find(i => i.id === item.id)?.price! * item.quantity}</p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-3 border-t border-slate-100 pt-6">
                                <div className="flex justify-between text-xs md:text-sm text-slate-600">
                                    <span>Subtotal</span>
                                    <span>₹{displaySubtotal}</span>
                                </div>
                                <div className="flex justify-between text-xs md:text-sm">
                                    <span>Delivery</span>
                                    <span className="text-accent font-bold">FREE</span>
                                </div>
                                <div className="flex justify-between text-xl pt-4 border-t border-slate-100 font-bold">
                                    <span>Total</span>
                                    <span>₹{displaySubtotal}</span>
                                </div>
                            </div>

                            <Button
                                type="submit"
                                disabled={isProcessing}
                                size="lg"
                                className="w-full mt-6 md:mt-8 rounded-full bg-emerald-700 py-3 md:py-4 text-xs md:text-base font-bold shadow-lg shadow-emerald-100 hover:bg-emerald-800 hover:scale-[1.02] transition-all disabled:opacity-50"
                            >
                                {isProcessing ? "Processing..." : form.payment === "cod" ? `Place Order ₹${displaySubtotal}` : `Pay ₹${displaySubtotal}`}
                            </Button>
                        </div>

                        <div className="bg-emerald-50 rounded-2xl p-6 border border-emerald-100">
                            <p className="text-xs font-bold text-emerald-800 uppercase tracking-[0.2em] mb-2 text-center">Achyutam Promise</p>
                            <p className="text-[13px] text-emerald-700/80 leading-relaxed text-center font-medium">100% Traditional Bilona Method | grass-fed | No Preservatives | From Our Farm to Your Home.</p>
                        </div>
                    </aside>
                </form>
            </div>

            {/* Success Modal */}
            <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
                <DialogContent className="max-w-md w-[95%] bg-white rounded-3xl p-0 overflow-hidden border-none shadow-2xl fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] z-[100]">
                    <VisuallyHidden>
                        <DialogTitle>Order Success</DialogTitle>
                    </VisuallyHidden>
                    <div className="relative p-8 text-center bg-white">
                        <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce-subtle">
                            <CheckCircle2 className="w-10 h-10 text-emerald-600" />
                        </div>
                        
                        <h2 className="text-3xl font-playfair font-bold text-gray-900 mb-2">Order Confirmed!</h2>
                        <p className="text-gray-500 font-lato mb-8">Thank you for choosing Achyutam Organics. Your order has been placed successfully.</p>
                        
                        {orderDetails && (
                            <div className="space-y-3 mb-8 text-left">
                                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                    <span className="text-sm font-medium text-slate-500 font-lato uppercase tracking-wider">Order Number</span>
                                    <span className="font-bold text-primary font-mono">{orderDetails.id}</span>
                                </div>
                                
                                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                    <span className="text-sm font-medium text-slate-500 font-lato uppercase tracking-wider">Total amount</span>
                                    <span className="font-bold text-slate-900">₹{orderDetails.totalAmount}</span>
                                </div>

                                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                    <span className="text-sm font-medium text-slate-500 font-lato uppercase tracking-wider">Payment</span>
                                    <span className="font-bold text-emerald-700">{orderDetails.paymentMethod}</span>
                                </div>
                            </div>
                        )}
                        
                        <div className="space-y-3">
                            <Button 
                                onClick={() => { clearCart(); setShowSuccessModal(false); navigate("/"); }} 
                                className="w-full rounded-full bg-primary text-white hover:bg-primary/90 py-6 text-lg font-bold shadow-lg shadow-primary/20 transition-all hover:scale-[1.02]"
                            >
                                Continue Shopping
                            </Button>
                            <Button 
                                variant="ghost"
                                onClick={() => { clearCart(); setShowSuccessModal(false); navigate("/products"); }}
                                className="w-full rounded-full text-slate-500 hover:text-primary py-4 font-medium"
                            >
                                Explore more products
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default Checkout;

