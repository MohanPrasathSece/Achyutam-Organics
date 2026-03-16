import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import SEO from "@/components/SEO";
import {
  Truck,
  Package,
  CheckCircle,
  Clock,
  Search,
  MapPin,
  Calendar,
  Receipt,
  Phone,
  Mail
} from "lucide-react";
import { cn } from "@/lib/utils";

const trackingSchema = z.object({
  orderNumber: z.string().min(1, "Order number is required"),
  email: z.string().email("Valid email is required"),
});

type TrackingForm = z.infer<typeof trackingSchema>;

interface OrderData {
  id: string;
  orderNumber: string;
  status: "processing" | "shipped" | "delivered" | "cancelled";
  customerName: string;
  customerEmail: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  totalAmount: number;
  shippingAddress: string;
  createdAt: string;
  updatedAt: string;
  trackingNumber?: string;
  estimatedDelivery?: string;
}

const statusSteps = [
  { key: "processing", label: "Order Placed", icon: Receipt, description: "We've received your order" },
  { key: "shipped", label: "Shipped", icon: Truck, description: "Your order is on the way" },
  { key: "delivered", label: "Delivered", icon: CheckCircle, description: "Package delivered successfully" },
] as const;

const TrackOrder = () => {
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TrackingForm>({
    resolver: zodResolver(trackingSchema),
  });

  const onSubmit = async (data: TrackingForm) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/track-order?orderNumber=${encodeURIComponent(data.orderNumber)}&email=${encodeURIComponent(data.email)}`);

      if (!response.ok) {
        throw new Error('Order not found');
      }

      const order = await response.json();
      setOrderData(order);
    } catch (error) {
      toast({
        title: "Order not found",
        description: "Please check your order number and email address.",
        variant: "destructive",
      });
      setOrderData(null);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIndex = (status: string) => {
    return statusSteps.findIndex(step => step.key === status);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <SEO
        title="Track Your Order | Achyutam Organics"
        description="Track your Achyutam Organics order status in real-time. Get updates on processing, shipping, and delivery."
        canonicalUrl="/track-order"
      />

      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-playfair mb-4">Track Your Order</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Enter your order number and email address to track your Achyutam Organics order in real-time.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          {/* Tracking Form */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="w-5 h-5" />
                Order Tracking
              </CardTitle>
              <CardDescription>
                Enter the details from your order confirmation email
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <label htmlFor="orderNumber" className="block text-sm font-medium mb-2">
                    Order Number
                  </label>
                  <Input
                    id="orderNumber"
                    placeholder="e.g., ACH-2024-001"
                    {...register("orderNumber")}
                    className="w-full"
                  />
                  {errors.orderNumber && (
                    <p className="text-sm text-red-600 mt-1">{errors.orderNumber.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2">
                    Email Address
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@example.com"
                    {...register("email")}
                    className="w-full"
                  />
                  {errors.email && (
                    <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>
                  )}
                </div>

                <Button type="submit" disabled={isLoading} className="w-full">
                  {isLoading ? "Searching..." : "Track Order"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Order Status */}
          {orderData && (
            <div className="space-y-6">
              {/* Order Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Order #{orderData.orderNumber}</span>
                    <Badge variant={
                      orderData.status === 'delivered' ? 'default' :
                      orderData.status === 'shipped' ? 'secondary' :
                      'outline'
                    }>
                      {orderData.status.charAt(0).toUpperCase() + orderData.status.slice(1)}
                    </Badge>
                  </CardTitle>
                  <CardDescription>
                    Placed on {formatDate(orderData.createdAt)}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <span>{orderData.customerEmail}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span>₹{orderData.totalAmount.toLocaleString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Status Timeline */}
              <Card>
                <CardHeader>
                  <CardTitle>Order Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {statusSteps.map((step, index) => {
                      const currentStatusIndex = getStatusIndex(orderData.status);
                      const isCompleted = index <= currentStatusIndex;
                      const isCurrent = index === currentStatusIndex;

                      return (
                        <div key={step.key} className="flex items-center gap-4">
                          <div className={cn(
                            "flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center",
                            isCompleted ? "bg-green-500 text-white" :
                            isCurrent ? "bg-accent text-accent-foreground" :
                            "bg-gray-200 text-gray-500"
                          )}>
                            <step.icon className="w-5 h-5" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h4 className={cn(
                                "font-medium",
                                isCompleted ? "text-green-700" :
                                isCurrent ? "text-accent-foreground" :
                                "text-muted-foreground"
                              )}>
                                {step.label}
                              </h4>
                              {isCurrent && <Clock className="w-4 h-4 text-accent" />}
                            </div>
                            <p className="text-sm text-muted-foreground">{step.description}</p>
                            {isCurrent && orderData.estimatedDelivery && (
                              <p className="text-xs text-accent mt-1">
                                Estimated delivery: {new Date(orderData.estimatedDelivery).toLocaleDateString('en-IN')}
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Shipping Information */}
              {orderData.trackingNumber && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Truck className="w-5 h-5" />
                      Shipping Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Package className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">Tracking Number: <strong>{orderData.trackingNumber}</strong></span>
                      </div>
                      <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="text-sm font-medium">Delivery Address:</p>
                          <p className="text-sm text-muted-foreground">{orderData.shippingAddress}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Order Items */}
              <Card>
                <CardHeader>
                  <CardTitle>Order Items</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {orderData.items.map((item, index) => (
                      <div key={index} className="flex justify-between items-center py-2">
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                        </div>
                        <p className="font-medium">₹{(item.price * item.quantity).toLocaleString()}</p>
                      </div>
                    ))}
                    <Separator />
                    <div className="flex justify-between items-center font-bold">
                      <span>Total</span>
                      <span>₹{orderData.totalAmount.toLocaleString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Support */}
              <Card className="bg-accent/5 border-accent/20">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <h3 className="font-medium mb-2">Need Help?</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Contact our support team for any questions about your order.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-2 justify-center">
                      <Button variant="outline" size="sm" className="flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        Call Support
                      </Button>
                      <Button variant="outline" size="sm" className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        Email Support
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrackOrder;
