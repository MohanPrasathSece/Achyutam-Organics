# Shiprocket Integration Guide for Achyutam Organics

## 🚀 Complete Shiprocket Integration Setup

### 📋 Prerequisites
1. **Shiprocket Account**: Create account at https://www.shiprocket.in
2. **GST Registration**: Recommended for business operations
3. **Pickup Address**: Your business address in Katni

### 🔧 Setup Instructions

#### 1. Install Required Dependencies
```bash
npm install axios @types/express
```

#### 2. Environment Configuration
Copy the example file:
```bash
cp .env.shiprocket.example .env
```

Update your `.env` file with:
```env
SHIPROCKET_EMAIL=your_email@shiprocket.com
SHIPROCKET_PASSWORD=your_shiprocket_password
```

#### 3. Get Shiprocket API Credentials
1. Login to Shiprocket dashboard
2. Go to Settings → API
3. Copy your email and password for API access

#### 4. Backend Integration
The following files have been created:
- `src/server/services/shiprocket.ts` - Shiprocket API service
- `src/server/routes/shipping.ts` - Express routes for shipping

#### 5. Frontend Integration
- `src/client/components/ShippingCalculator.tsx` - React component for shipping

### 📦 Features Implemented

#### ✅ Backend API Endpoints
- `POST /api/shipping/create-shipment` - Create new shipment
- `GET /api/shipping/track/:shipmentId` - Track shipment status
- `POST /api/shipping/shipping-rates` - Calculate shipping rates

#### ✅ Frontend Components
- Address form with validation
- Payment method selection (Prepaid/COD)
- Real-time shipping rate calculation
- Courier option selection
- Order tracking display

### 🔄 Integration Flow

#### Order Placement Flow:
1. Customer fills shipping address
2. System calculates shipping rates
3. Customer selects courier option
4. Payment processed (Razorpay + Shiprocket)
5. Shipment created automatically
6. Tracking ID generated
7. Customer receives tracking details

#### Example API Usage:
```javascript
// Create shipment
const shipment = await fetch('/api/shipping/create-shipment', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    orderData: {
      orderId: "ORD123",
      customerName: "John Doe",
      address: "123 Street, City",
      city: "Mumbai",
      pincode: "400001",
      state: "Maharashtra",
      phone: "9876543210",
      items: [
        { name: "Ghee 1kg", quantity: 1, price: "1100" }
      ],
      paymentMethod: "prepaid",
      subtotal: 1100
    }
  })
});
```

### 🚚 Supported Couriers
- Delhivery (3-5 days, ₹60-80)
- XpressBees (2-4 days, ₹65-85)
- Blue Dart (2-3 days, ₹70-90)

### 💰 Pricing Structure
- **Prepaid Orders**: Base shipping charges
- **COD Orders**: Base charges + ₹20 extra
- **Weight**: Standard 0.5kg for ghee products

### 📍 Serviceability
- **Pan India**: All major cities and towns
- **Remote Areas**: Additional charges may apply
- **International**: Not supported (India only)

### 📱 Tracking Integration
- Automatic tracking ID generation
- Real-time status updates
- Customer notifications
- Tracking page integration

### 🔒 Security Notes
- Store API credentials in environment variables
- Use HTTPS for all API calls
- Validate all input data
- Implement rate limiting

### 🛠️ Testing
1. Use test orders for initial testing
2. Verify pickup address in Shiprocket dashboard
3. Test both prepaid and COD flows
4. Check tracking integration

### 📞 Support
- Shiprocket Support: support@shiprocket.in
- Documentation: https://shiprocket.in/help
- API Docs: https://apiv2.shiprocket.in/

### 🎯 Next Steps
1. Set up Shiprocket account
2. Configure environment variables
3. Test with sample orders
4. Go live with real orders
5. Monitor delivery performance

This integration provides complete shipping automation for your Achyutam Organics website! 🚀📦
