import crypto from "crypto";
// MongoDB import removed - migrating to Supabase
import { getRazorpayClient } from "../lib/razorpay.js";
import { sendOrderEmails, sendStatusUpdateEmail, sendLowStockEmail, sendMail } from "../utils/email.js";
import { supabase } from "../lib/supabase.js";

const getDisplayId = (order) => {
  if (order.order_number) return order.order_number;
  let hash = 0;
  const oId = order.id || "";
  for (let i = 0; i < oId.length; i++) {
    hash = ((hash << 5) - hash) + oId.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash % 9000) + 1000;
};

import { z } from "zod";

const orderSchema = z.object({
  customer: z.object({
    name: z.string().min(2).max(100),
    email: z.string().email(),
    phone: z.string().min(10).max(15),
  }),
  shippingAddress: z.object({
    line1: z.string().min(1),
    line2: z.string().optional(),
    city: z.string().min(1),
    state: z.string().min(1),
    postalCode: z.string().min(1).max(20),
    country: z.string().min(1),
  }),
  items: z.array(z.object({
    id: z.union([z.string(), z.number()]),
    name: z.string(),
    price: z.coerce.number().positive(),
    quantity: z.coerce.number().int().positive(),
  })).min(1),
  notes: z.string().max(500).optional().nullable(),
  isGift: z.boolean().optional(),
  giftOptionId: z.string().optional(),
  giftOptionName: z.string().optional(),
  giftOptionPrice: z.coerce.number().optional().nullable(),
  giftCustomText: z.string().optional(),
});

const verifyRequiredFields = (data) => {
  const result = orderSchema.safeParse(data);
  if (!result.success) {
    const errorMsg = result.error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ');
    throw new Error(`Data validation failed: ${errorMsg}`);
  }
  return result.data;
};

const calculateAmounts = (items, giftPrice = 0) => {
  const productsAmount = items.reduce((total, item) => {
    const itemPrice = Number(item.price) || 0;
    const itemQty = Number(item.quantity) || 0;
    return total + itemPrice * itemQty;
  }, 0);

  const amount = productsAmount + (Number(giftPrice) || 0);
  const amountInPaise = Math.round(amount * 100);

  if (!amountInPaise) {
    throw new Error("Order amount must be greater than zero.");
  }

  return { amount, amountInPaise };
};

export const createOrder = async (req, res) => {
  try {
    const razorpayClient = getRazorpayClient();
    if (!razorpayClient) {
      const missing = [];
      if (!process.env.RAZORPAY_KEY_ID) missing.push("RAZORPAY_KEY_ID");
      if (!process.env.RAZORPAY_KEY_SECRET) missing.push("RAZORPAY_KEY_SECRET");
      return res.status(500).json({
        error: "Payment gateway not configured",
        details: `Missing: ${missing.join(", ")}. Please add these to your Vercel Environment Variables.`
      });
    }

    if (!supabase) {
      const missing = [];
      if (!process.env.VITE_SUPABASE_URL) missing.push("VITE_SUPABASE_URL");
      if (!process.env.VITE_SUPABASE_ANON_KEY) missing.push("VITE_SUPABASE_ANON_KEY");
      return res.status(500).json({
        error: "Database not configured",
        details: `Missing: ${missing.join(", ")}. Please add these to your Vercel Environment Variables.`
      });
    }

    const validatedData = verifyRequiredFields(req.body);
    const { customer, shippingAddress, items, notes, isGift, giftOptionName, giftOptionPrice, giftCustomText } = validatedData;

    // Append gift option to notes if it's the old boolean gift
    let finalNotes = notes || "";
    if (isGift && !giftOptionName) {
      finalNotes = finalNotes ? `${finalNotes} | GIFT OPTION: YES` : "GIFT OPTION: YES";
    } else if (giftOptionName) {
      finalNotes = finalNotes ? `${finalNotes} | GIFT: ${giftOptionName} (₹${giftOptionPrice})` : `GIFT: ${giftOptionName} (₹${giftOptionPrice})`;
      if (giftCustomText) {
        finalNotes = `${finalNotes} | MSG: ${giftCustomText}`;
      }
    }

    const { amount, amountInPaise } = calculateAmounts(items, giftOptionPrice);

    const razorpayOrder = await razorpayClient.orders.create({
      amount: amountInPaise,
      currency: "INR",
      receipt: `achyutam_${Date.now()}`,
      notes: {
        customerEmail: customer.email,
        customerName: customer.name,
        // Fallback: keeping orderData in notes just in case
        orderData: JSON.stringify({
          customer,
          shippingAddress,
          items,
          subtotal: amount,
          total_price: amount,
          notes: finalNotes || null,
        }).substring(0, 255) // Still trying to keep it within limits as fallback
      },
    });

    // Create a pending record in Supabase to avoid Razorpay notes size limits
    const { error: pendingError } = await supabase.from("orders").insert([{
      razorpay_order_id: razorpayOrder.id,
      status: "pending",
      subtotal: amount,
      total_price: amount,
      currency: razorpayOrder.currency,
      customer_name: customer.name,
      email: customer.email,
      phone: customer.phone,
      shipping_address: shippingAddress,
      items: items,
      notes: finalNotes || null,
      payment_method: "Prepaid",
      order_number: Number(Date.now().toString().slice(-6) + Math.floor(100 + Math.random() * 900).toString()),
    }]).select().single();

    if (pendingError) {
      console.error("Failed to create pending order record:", pendingError);
    }

    return res.json({
      success: true,
      message: "Payment initiated",
      orderId: razorpayOrder.id,
      amount: amountInPaise,
      currency: razorpayOrder.currency,
      razorpayKey: razorpayClient.key_id,
    });
  } catch (error) {
    console.error("Failed to create order:", error);
    return res.status(400).json({ error: error.message || "Unable to create order" });
  }
};

export const createCODOrder = async (req, res) => {
  try {
    if (!supabase) {
      return res.status(500).json({ error: "Database not configured" });
    }

    const validatedData = verifyRequiredFields(req.body);
    const { customer, shippingAddress, items, notes, isGift, giftOptionName, giftOptionPrice, giftCustomText } = validatedData;
    
    // Append gift option to notes
    let finalNotes = notes || "";
    if (isGift && !giftOptionName) {
      finalNotes = finalNotes ? `${finalNotes} | GIFT OPTION: YES` : "GIFT OPTION: YES";
    } else if (giftOptionName) {
      finalNotes = finalNotes ? `${finalNotes} | GIFT: ${giftOptionName} (₹${giftOptionPrice})` : `GIFT: ${giftOptionName} (₹${giftOptionPrice})`;
      if (giftCustomText) {
        finalNotes = `${finalNotes} | MSG: ${giftCustomText}`;
      }
    }

    const { amount } = calculateAmounts(items, giftOptionPrice);
    // Generate a purely numeric order number to avoid type errors in DB (integer column)
    const orderNumber = Number(Date.now().toString().slice(-6) + Math.floor(100 + Math.random() * 900).toString());

    // 1. Insert order into Supabase
    const { data: newOrder, error: createError } = await supabase.from("orders").insert([{
      order_number: orderNumber,
      status: "confirmed", // COD is confirmed as it doesn't wait for online payment
      payment_method: "COD",
      subtotal: amount,
      total_price: amount,
      currency: "INR",
      customer_name: customer.name,
      email: customer.email,
      phone: customer.phone,
      shipping_address: shippingAddress,
      items: items,
      notes: finalNotes || null,
    }]).select().single();

    if (createError) {
      console.error("Failed to create COD order:", createError);
      throw new Error("Unable to save order to database");
    }

    // 2. Reduce Stock
    try {
      for (const item of items) {
        if (!item.id) continue;
        const { data: product } = await supabase.from("products").select("stock_quantity, name").eq("id", item.id).single();
        if (product) {
          const qtyBought = Number(item.quantity) || 0;
          const newStock = Math.max(0, (Number(product.stock_quantity) || 0) - qtyBought);
          await supabase.from("products").update({ stock_quantity: newStock, status: newStock === 0 ? "inactive" : "active" }).eq("id", item.id);
          if (newStock < 5) sendLowStockEmail({ productName: product.name, productId: item.id, remainingStock: newStock }).catch(e => console.error("Low stock alert failed:", e));
        }
      }
    } catch (stockError) {
      console.error("Stock update failed for COD order:", stockError);
    }

    // 3. Send Confirmation Emails
    sendOrderEmails({
      order: {
        ...newOrder,
        customer: { name: newOrder.customer_name, email: newOrder.email, phone: newOrder.phone },
        items: newOrder.items,
        amount: newOrder.total_price,
        displayId: orderNumber,
        shippingAddress: newOrder.shipping_address,
        payment_method: "COD"
      }
    }).catch(e => console.error("COD Order Email Failed:", e));

    return res.json({
      success: true,
      message: "Order placed successfully",
      orderId: orderNumber,
      databaseOrderId: newOrder.id
    });
  } catch (error) {
    console.error("Failed to create COD order:", error);
    return res.status(400).json({ error: error.message || "Unable to place COD order" });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

    if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
      return res.status(400).json({ error: "Payment verification data is incomplete." });
    }

    if (!supabase) {
      return res.status(500).json({ error: "Supabase status: unavailable" });
    }

    // 1. Signature Verification
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest("hex");

    if (expectedSignature !== razorpaySignature) {
      console.warn(`❌ SECURITY ALERT: Invalid payment signature for Razorpay Order ${razorpayOrderId}.`);
      return res.status(400).json({ error: "Invalid payment signature." });
    }

    // 2. Idempotency & Transition Check
    const { data: existingOrder } = await supabase
      .from("orders")
      .select("*")
      .eq("razorpay_order_id", razorpayOrderId)
      .maybeSingle();

    let updatedOrder = null;

    if (existingOrder && existingOrder.status === "confirmed") {
      console.log(`Order ${razorpayOrderId} already confirmed, returning success.`);
      return res.json({ 
        success: true, 
        message: "Payment already verified", 
        orderId: existingOrder.razorpay_order_id, 
        databaseOrderId: existingOrder.id 
      });
    }

    if (existingOrder && existingOrder.status === "pending") {
      // Transition from pending to confirmed
      const { data: confirmedOrder, error: updateError } = await supabase
        .from("orders")
        .update({
          status: "confirmed",
          payment_method: "Prepaid",
          razorpay_payment_id: razorpayPaymentId,
          razorpay_signature: razorpaySignature,
          updated_at: new Date().toISOString()
        })
        .eq("razorpay_order_id", razorpayOrderId)
        .select()
        .single();

      if (updateError) {
        console.error("Failed to confirm pending order:", updateError);
        return res.status(500).json({ error: "Failed to confirm payment status" });
      }
      updatedOrder = confirmedOrder;
    } else {
      // Fallback: If for some reason the pending order wasn't created, create it now
      // This uses order data from Razorpay notes (if it fits) or defaults
      const razorpay = getRazorpayClient();
      const razorpayOrderDetails = await razorpay.orders.fetch(razorpayOrderId);
      
      let orderData = {};
      try {
        orderData = JSON.parse(razorpayOrderDetails.notes.orderData || '{}');
      } catch (e) {
        console.warn("Could not parse orderData from notes, using minimal info");
      }

      const { customer = {}, shippingAddress = {}, items = [], subtotal = 0, total_price = 0, notes = null } = orderData;

      const { data: newOrder, error: createError } = await supabase.from("orders").insert([{
        razorpay_order_id: razorpayOrderId,
        razorpay_payment_id: razorpayPaymentId,
        razorpay_signature: razorpaySignature,
        subtotal: subtotal || (razorpayOrderDetails.amount / 100),
        total_price: total_price || (razorpayOrderDetails.amount / 100),
        currency: razorpayOrderDetails.currency,
        status: "confirmed",
        payment_method: "Prepaid",
        customer_name: customer.name || razorpayOrderDetails.notes.customerName,
        email: customer.email || razorpayOrderDetails.notes.customerEmail,
        phone: customer.phone || "N/A",
        shipping_address: shippingAddress || {},
        items: items || [],
        notes: notes || null,
      }]).select().single();

      if (createError) {
        console.error("Failed to create order after payment fallback:", createError);
        return res.status(500).json({ error: "Payment successful but failed to save order" });
      }
      updatedOrder = newOrder;
    }

    // Use the confirmed order for stock and email
    const newOrder = updatedOrder; 


    try {
      // Use the newly created order
      const updatedOrder = newOrder;
      const items = updatedOrder.items;

      // We process stock reduction sequentially to avoid race conditions as much as possible without RPC
      for (const item of items) {
        if (!item.id) continue;

        // Fetch current stock
        const { data: product, error: prodError } = await supabase
          .from("products")
          .select("id, stock_quantity, status, name")
          .eq("id", item.id)
          .single();

        if (prodError || !product) {
          console.error(`Could not fetch product ${item.id} for stock reduction`);
          continue;
        }

        // Calculate new stock
        // item.quantity is string usually from JSON, convert to number
        const qtyBought = Number(item.quantity) || 0;
        const currentStock = Number(product.stock_quantity) || 0;
        const newStock = Math.max(0, currentStock - qtyBought);

        const isOutOfStock = newStock === 0;

        // Update product stock
        await supabase
          .from("products")
          .update({
            stock_quantity: newStock,
            status: isOutOfStock ? "inactive" : "active"
          })
          .eq("id", item.id);

        // Low Stock Check (threshold < 5)
        if (newStock < 5) {
          sendLowStockEmail({
            productName: product.name,
            productId: item.id,
            remainingStock: newStock
          }).catch(e => console.error("Failed to send low stock alert:", e));
        }
      }

      // Map Supabase order back to expected format for email utils if necessary
      // Background email sending to make checkout "very very fast"
      sendOrderEmails({
        order: {
          ...updatedOrder,
          customer: { name: updatedOrder.customer_name, email: updatedOrder.email, phone: updatedOrder.phone },
          items: updatedOrder.items,
          amount: updatedOrder.total_price,
          razorpayOrderId: updatedOrder.razorpay_order_id,
          razorpayPaymentId: updatedOrder.razorpay_payment_id || razorpayPaymentId,
          displayId: getDisplayId(updatedOrder),
          shippingAddress: updatedOrder.shipping_address,
          payment_method: updatedOrder.payment_method || "Prepaid"
        }
      }).catch(e => console.error("Background Order Email Failed:", e));

    } catch (saveError) {
      console.error("Failed to send post-payment emails or update stock", saveError);
    }

    return res.json({ success: true, message: "Payment verified and order created", orderId: newOrder.razorpay_order_id, databaseOrderId: newOrder.id });
  } catch (error) {
    console.error("Payment verification failed", error);
    
    // CRISIS EMAIL: If payment was verified but order creation/processing failed
    // we must notify the owner immediately so they don't lose a paid order.
    try {
      const { razorpayOrderId, razorpayPaymentId } = req.body;
      if (razorpayOrderId && razorpayPaymentId) {
        sendMail({
          to: process.env.OWNER_EMAIL || "saritaagarwal287@gmail.com",
          subject: "🚨 URGENT: Payment Success but Order Processing Failed",
          html: `
            <h1>Urgent Action Required</h1>
            <p>A payment was completed, but the server encountered an error during order creation.</p>
            <p><strong>Razorpay Order ID:</strong> ${razorpayOrderId}</p>
            <p><strong>Razorpay Payment ID:</strong> ${razorpayPaymentId}</p>
            <p><strong>Error:</strong> ${error.message}</p>
            <p>Please check the Razorpay dashboard and manually create this order if necessary.</p>
          `
        }).catch(e => console.error("Crisis mail failed:", e));
      }
    } catch (e) {
      console.error("Failed to send crisis mail:", e);
    }

    return res.status(400).json({ error: error.message || "Unable to verify payment" });
  }
};


// Clean up abandoned Razorpay orders (older than 1 hour)
export const cleanupAbandonedOrders = async () => {
  try {
    const razorpay = getRazorpayClient();
    if (!razorpay) return;

    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    
    // Fetch all orders from the last hour
    const orders = await razorpay.orders.all({
      from: oneHourAgo.toISOString(),
      to: new Date().toISOString()
    });

    for (const order of orders) {
      // Check if order exists in our database
      const { data: existingOrder } = await supabase
        .from("orders")
        .select("id")
        .eq("razorpay_order_id", order.id)
        .single();

      if (!existingOrder && order.status !== 'paid') {
        console.log(`Cleaning up abandoned Razorpay order: ${order.id}`);
        // Optionally: Add to a failed_orders table for analytics
      }
    }
  } catch (error) {
    console.error("Failed to cleanup abandoned orders:", error);
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId, status, trackingNumber, trackingId } = req.body;

    if (!supabase) {
      return res.status(503).json({ error: "Supabase service is not available. Please check environment variables." });
    }

    // Fetch order from Supabase
    const { data: order, error: fetchError } = await supabase
      .from("orders")
      .select("*")
      .eq("id", orderId)
      .single();

    if (fetchError || !order) {
      return res.status(404).json({ error: "Order not found" });
    }

    // Update order in Supabase
    const { error: updateError } = await supabase
      .from("orders")
      .update({
        status,
        tracking_number: trackingNumber || order.tracking_number,
        tracking_url: trackingId || order.tracking_url,
        updated_at: new Date().toISOString()
      })
      .eq("id", orderId);

    if (updateError) throw updateError;

    // Send email via existing email util
    try {
      // Background email sending
      sendStatusUpdateEmail({
        email: order.email,
        customerName: order.customer_name,
        status,
        orderId: getDisplayId(order),
        trackingNumber: trackingNumber || order.tracking_number,
        trackingUrl: trackingId || order.tracking_url,
        items: order.items,
        address: order.shipping_address,
        totalAmount: order.total_price
      }).catch(e => console.error("Background Status Email Failed:", e));
    } catch (emailErr) {
      console.error("Failed to send status email", emailErr);
    }

    return res.json({ success: true, message: "Status updated successfully" });
  } catch (error) {
    console.error("Update status failed", error);
    return res.status(500).json({ error: "Failed to update order status" });
  }
};

export const updateTracking = async (req, res) => {
  try {
    const { orderId, trackingNumber, trackingUrl } = req.body;

    if (!supabase) {
      return res.status(503).json({ error: "Supabase service is not available. Please check environment variables." });
    }

    // Update tracking information in Supabase
    const updateData = { updated_at: new Date().toISOString() };
    if (trackingNumber !== undefined) updateData.tracking_number = trackingNumber;
    if (trackingUrl !== undefined) updateData.tracking_url = trackingUrl;

    const { error: updateError } = await supabase
      .from("orders")
      .update(updateData)
      .eq("id", orderId);

    if (updateError) throw updateError;

    return res.json({ success: true, message: "Tracking updated successfully" });
  } catch (error) {
    console.error("Update tracking failed", error);
    return res.status(500).json({ error: "Failed to update tracking information" });
  }
};

export const getOrders = async (req, res) => {
  try {
    if (!supabase) {
      return res.status(503).json({ error: "Supabase service is not available. Please check environment variables." });
    }

    // Fetch all orders from Supabase
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .neq("status", "pending")
      .order("created_at", { ascending: false });

    if (error) throw error;

    return res.json({ success: true, orders: data || [] });
  } catch (error) {
    console.error("Fetch orders failed", error);
    return res.status(500).json({ error: "Failed to fetch orders" });
  }
};
