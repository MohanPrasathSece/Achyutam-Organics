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
import { CheckCircle2, ArrowRight, Phone, MapPin, Package } from "lucide-react";

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

    if (items.length === 0 && !submitted) {
        navigate("/cart");
        return null;
    }

    if (submitted) {
        return (
            <div className="container flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
                <span className="text-5xl text-emerald-600">✓</span>
                <h1 className="mt-4 text-3xl font-playfair">Order Confirmed!</h1>
                <p className="mt-4 text-muted-foreground max-w-md font-lato">Thank you for your order. We've received your payment and our farm team will contact you soon with delivery details.</p>
                <Button onClick={() => { navigate("/"); window.scrollTo({ top: 0 }); }} className="mt-8 rounded-full bg-primary px-8 py-6 shadow-lg">
                    Back to Home
                </Button>
            </div>
        );
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
            // Create demo order for Cash on Delivery
            setIsProcessing(true);
            try {
                // Create demo order
                const demoOrder = {
                    id: `ORD-${Date.now()}`,
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
                    items: items.map(item => ({
                        id: item.id,
                        name: item.name,
                        price: item.price,
                        quantity: item.quantity,
                    })),
                    totalAmount: subtotal,
                    paymentMethod: "COD",
                    status: "pending",
                    createdAt: new Date().toISOString(),
                };

                // Store demo order in localStorage for admin to see
                const existingOrders = JSON.parse(localStorage.getItem('demoOrders') || '[]');
                existingOrders.push(demoOrder);
                localStorage.setItem('demoOrders', JSON.stringify(existingOrders));

                // Show success message
                toast.success("Order placed successfully! Your order ID is " + demoOrder.id);
                setOrderDetails(demoOrder);
                setShowSuccessModal(true);
                clearCart();
                setSubmitted(true);
                
            } catch (error) {
                toast.error("Failed to place order. Please try again.");
            } finally {
                setIsProcessing(false);
            }
            return;
        }

        try {
            setIsProcessing(true);
            const apiUrl = getApiUrl();

            const response = await fetch(`${apiUrl}/api/orders/create`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
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
                    items: items.map(item => ({
                        id: item.id,
                        name: item.name,
                        price: item.price,
                        quantity: item.quantity,
                    })),
                }),
            });

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
                description: "Pure A2 Desi Cow Ghee",
                order_id: rzpOrderId,
                handler: async (payment) => {
                    setIsProcessing(true);
                    try {
                        const verifyRes = await fetch(`${apiUrl}/api/orders/verify`, {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                                razorpayOrderId: payment.razorpay_order_id,
                                razorpayPaymentId: payment.razorpay_payment_id,
                                razorpaySignature: payment.razorpay_signature,
                            }),
                        });

                        const verifyData = await verifyRes.json();
                        if (!verifyRes.ok) {
                            throw new Error(verifyData.error || "Payment verification failed");
                        }

                        toast.success("Payment successful! Order placed.");
                        clearCart();
                        setSubmitted(true);
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
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <SEO
                title="Checkout | Achyutam Organics"
                description="Complete your order for pure organic ghee and dairy products."
                canonicalUrl="/checkout"
            />

            <div className="container mx-auto max-w-6xl">
                <div className="mb-8 text-center">
                    <h1 className="text-3xl md:text-4xl font-playfair font-bold text-slate-800 mb-2">Checkout</h1>
                    <p className="text-muted-foreground">Complete your order details below</p>
                </div>

                <form onSubmit={handleSubmit} className="grid gap-6 lg:gap-10 lg:grid-cols-3">
                    <div className="space-y-4 md:space-y-6 lg:col-span-2">
                        <div className="bg-white rounded-xl md:rounded-3xl p-4 md:p-8 shadow-sm border border-slate-100">
                            <h2 className="text-lg md:text-2xl font-playfair mb-4 md:mb-6 underline decoration-accent/30 underline-offset-8">Customer Details</h2>
                            <div className="grid gap-4 md:gap-6 sm:grid-cols-2">
                                <div className="space-y-1.5 md:space-y-2">
                                    <Label htmlFor="name" className="text-xs md:text-sm uppercase tracking-wider text-muted-foreground">Full Name</Label>
                                    <Input id="name" name="name" value={form.name} onChange={handleChange} placeholder="Your full name" disabled={isProcessing} className={errors.name ? "border-destructive" : ""} />
                                    {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
                                </div>
                                <div className="space-y-1.5 md:space-y-2">
                                    <Label htmlFor="phone" className="text-xs md:text-sm font-semibold uppercase tracking-wider text-muted-foreground">Phone Number</Label>
                                    <Input id="phone" name="phone" type="tel" value={form.phone} onChange={handleChange} placeholder="10-digit mobile number" disabled={isProcessing} className={errors.phone ? "border-destructive" : ""} />
                                    {errors.phone && <p className="text-xs text-destructive">{errors.phone}</p>}
                                </div>
                                <div className="space-y-1.5 md:space-y-2 sm:col-span-2">
                                    <Label htmlFor="email" className="text-xs md:text-sm font-semibold uppercase tracking-wider text-muted-foreground">Email Address</Label>
                                    <Input id="email" name="email" type="email" value={form.email} onChange={handleChange} placeholder="your@email.com" disabled={isProcessing} className={errors.email ? "border-destructive" : ""} />
                                    {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl md:rounded-3xl p-4 md:p-8 shadow-sm border border-slate-100">
                            <h2 className="text-lg md:text-2xl font-playfair mb-4 md:mb-6 underline decoration-accent/30 underline-offset-8">Delivery Address</h2>
                            <div className="grid gap-4 md:gap-6 sm:grid-cols-2">
                                <div className="space-y-1.5 md:space-y-2 sm:col-span-2">
                                    <Label htmlFor="street" className="text-xs md:text-sm font-semibold uppercase tracking-wider text-muted-foreground">Street Address</Label>
                                    <Input id="street" name="street" value={form.street} onChange={handleChange} placeholder="Building, Street, Area" disabled={isProcessing} className={errors.street ? "border-destructive" : ""} />
                                    {errors.street && <p className="text-xs text-destructive">{errors.street}</p>}
                                </div>
                                <div className="space-y-1.5 md:space-y-2">
                                    <Label htmlFor="city" className="text-xs md:text-sm font-semibold uppercase tracking-wider text-muted-foreground">City</Label>
                                    <Input id="city" name="city" value={form.city} onChange={handleChange} placeholder="City" disabled={isProcessing} className={errors.city ? "border-destructive" : ""} />
                                    {errors.city && <p className="text-xs text-destructive">{errors.city}</p>}
                                </div>
                                <div className="space-y-1.5 md:space-y-2">
                                    <Label htmlFor="state" className="text-xs md:text-sm font-semibold uppercase tracking-wider text-muted-foreground">State</Label>
                                    <Input id="state" name="state" value={form.state} onChange={handleChange} placeholder="State" disabled={isProcessing} className={errors.state ? "border-destructive" : ""} />
                                    {errors.state && <p className="text-xs text-destructive">{errors.state}</p>}
                                </div>
                                <div className="space-y-1.5 md:space-y-2">
                                    <Label htmlFor="pincode" className="text-xs md:text-sm font-semibold uppercase tracking-wider text-muted-foreground">Pincode</Label>
                                    <Input id="pincode" name="pincode" value={form.pincode} onChange={handleChange} placeholder="6-digit pincode" disabled={isProcessing} className={errors.pincode ? "border-destructive" : ""} />
                                    {errors.pincode && <p className="text-xs text-destructive">{errors.pincode}</p>}
                                </div>
                            </div>
                            
                            {/* Location Validation Message */}
                            {form.city && form.state && form.pincode && (
                                <div className="mt-4 p-4 rounded-lg border">
                                    {(() => {
                                        const location = validateDeliveryLocation(form.city, form.state, form.pincode);
                                        const hasMilk = hasMilkProducts(items);
                                        
                                        if (hasMilk && location.isKatni) {
                                            return (
                                                <div className="text-sm text-green-700 bg-green-50 p-3 rounded">
                                                    <p className="font-medium">✅ Location Validated</p>
                                                    <p>Fresh milk delivery available in your area (Katni)</p>
                                                </div>
                                            );
                                        } else if (hasMilk && !location.isKatni) {
                                            return (
                                                <div className="text-sm text-red-700 bg-red-50 p-3 rounded">
                                                    <p className="font-medium">❌ Location Not Supported</p>
                                                    <p>Fresh milk delivery is only available in Katni, Madhya Pradesh</p>
                                                </div>
                                            );
                                        } else {
                                            return (
                                                <div className="text-sm text-accent bg-accent/5 p-3 rounded">
                                                    <p className="font-medium">📍 Delivery Information</p>
                                                    <p>Ghee products can be delivered all over India</p>
                                                </div>
                                            );
                                        }
                                    })()}
                                </div>
                            )}
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
                                {items.map((item, index) => (
                                    <div key={`${item.id}-${index}`} className="flex justify-between items-start gap-4 pb-4 border-b border-slate-50 last:border-0 last:pb-0">
                                        <div className="flex-1">
                                            <p className="font-bold text-slate-800 leading-tight text-sm md:text-base">{item.name}</p>
                                            <p className="text-xs text-muted-foreground mt-1">Quantity: {item.quantity}</p>
                                        </div>
                                        <span className="font-bold text-emerald-700 text-sm md:text-base">₹{item.price * item.quantity}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-3 border-t border-slate-100 pt-6">
                                <div className="flex justify-between text-xs md:text-sm text-slate-600">
                                    <span>Subtotal</span>
                                    <span>₹{subtotal}</span>
                                </div>
                                <div className="flex justify-between text-xs md:text-sm">
                                    <span>Delivery</span>
                                    <span className="text-accent font-bold">FREE</span>
                                </div>
                                <div className="flex justify-between text-xl pt-4 border-t border-slate-100 font-bold">
                                    <span>Total</span>
                                    <span>₹{subtotal}</span>
                                </div>
                            </div>

                            <Button
                                type="submit"
                                disabled={isProcessing}
                                size="lg"
                                className="w-full mt-6 md:mt-8 rounded-full bg-emerald-700 py-3 md:py-4 text-xs md:text-base font-bold shadow-lg shadow-emerald-100 hover:bg-emerald-800 hover:scale-[1.02] transition-all disabled:opacity-50"
                            >
                                {isProcessing ? "Processing..." : form.payment === "cod" ? `Place Order ₹${subtotal}` : `Pay ₹${subtotal}`}
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
                <DialogContent className="max-w-md w-full bg-white rounded-2xl p-6 text-center">
                    <DialogHeader>
                        <DialogTitle className="text-center">
                            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <CheckCircle2 className="w-8 h-8 text-emerald-600" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900">Order Confirmed!</h2>
                        </DialogTitle>
                    </DialogHeader>
                    
                    {orderDetails && (
                        <div className="space-y-4">
                            <div className="bg-emerald-50 rounded-lg p-4">
                                <p className="text-sm text-gray-600 mb-1">Order ID</p>
                                <p className="font-bold text-emerald-700">{orderDetails.id}</p>
                            </div>
                            
                            <div className="bg-gray-50 rounded-lg p-4">
                                <p className="text-sm text-gray-600 mb-1">Total Amount</p>
                                <p className="font-bold text-gray-900">₹{orderDetails.totalAmount}</p>
                            </div>
                            
                            <div className="bg-blue-50 rounded-lg p-4">
                                <p className="text-sm text-gray-600 mb-1">Payment Method</p>
                                <p className="font-bold text-blue-700">{orderDetails.paymentMethod}</p>
                            </div>
                            
                            <div className="border-t pt-4">
                                <div className="flex items-center gap-2 text-gray-600 mb-2">
                                    <Phone className="w-4 h-4" />
                                    <span className="text-sm">We'll call you to confirm delivery details</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-600">
                                    <MapPin className="w-4 h-4" />
                                    <span className="text-sm">Delivery to {orderDetails.shippingAddress.city}</span>
                                </div>
                            </div>
                            
                            <div className="mt-6 space-y-2">
                                <Button 
                                    onClick={() => { setShowSuccessModal(false); navigate("/"); }} 
                                    className="w-full rounded-full bg-emerald-600 text-white hover:bg-emerald-700"
                                >
                                    Continue Shopping
                                </Button>
                                <Button 
                                    variant="outline"
                                    onClick={() => setShowSuccessModal(false)}
                                    className="w-full rounded-full"
                                >
                                    View Order Details
                                </Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default Checkout;
