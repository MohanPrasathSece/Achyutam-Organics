import axios from 'axios';

// Shiprocket API configuration
const SHIPROCKET_API_BASE = 'https://apiv2.shiprocket.in/v1/external';

// Get Shiprocket API token
export const getShiprocketToken = async () => {
  try {
    const response = await axios.post(`${SHIPROCKET_API_BASE}/auth/login`, {
      email: process.env.SHIPROCKET_EMAIL,
      password: process.env.SHIPROCKET_PASSWORD
    });

    return response.data.token;
  } catch (error) {
    console.error('Error getting Shiprocket token:', error);
    throw new Error('Failed to authenticate with Shiprocket');
  }
};

// Create shipment for an order
export const createShipment = async (orderData: any, token: string) => {
  try {
    const shipmentPayload = {
      order_id: orderData.orderId,
      order_date: new Date().toISOString().split('T')[0],
      pickup_location: "Home",
      billing_customer_name: orderData.customerName,
      billing_last_name: "",
      billing_address: orderData.address,
      billing_city: orderData.city,
      billing_pincode: orderData.pincode,
      billing_state: orderData.state,
      billing_country: "India",
      billing_phone: orderData.phone,
      
      order_items: orderData.items.map((item: any) => ({
        name: item.name,
        sku: item.sku || `SKU_${item.id}`,
        units: item.quantity,
        selling_price: parseFloat(item.price.replace('₹', ''))
      })),
      
      payment_method: orderData.paymentMethod === 'cod' ? 'COD' : 'Prepaid',
      shipping_charges: orderData.shippingCharges || 0,
      total_discount: orderData.discount || 0,
      sub_total: orderData.subtotal,
      
      length: 10,
      breadth: 10,
      height: 5,
      weight: 0.5
    };

    const response = await axios.post(
      `${SHIPROCKET_API_BASE}/orders/create/adhoc`,
      shipmentPayload,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error('Error creating shipment:', error);
    throw new Error('Failed to create shipment');
  }
};

// Track shipment
export const trackShipment = async (shipmentId: string, token: string) => {
  try {
    const response = await axios.get(
      `${SHIPROCKET_API_BASE}/orders/track/${shipmentId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error('Error tracking shipment:', error);
    throw new Error('Failed to track shipment');
  }
};

// Get available couriers
export const getAvailableCouriers = async (token: string) => {
  try {
    const response = await axios.get(
      `${SHIPROCKET_API_BASE}/courier/serviceability/`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error('Error getting couriers:', error);
    throw new Error('Failed to get available couriers');
  }
};
