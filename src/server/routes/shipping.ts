import express, { Request, Response } from 'express';
import { getShiprocketToken, createShipment, trackShipment } from '../services/shiprocket';

const router = express.Router();

// Create shipment endpoint
router.post('/create-shipment', async (req: Request, res: Response) => {
  try {
    const { orderData } = req.body;
    
    if (!orderData) {
      return res.status(400).json({ error: 'Order data is required' });
    }

    // Get Shiprocket token
    const token = await getShiprocketToken();
    
    // Create shipment
    const shipment = await createShipment(orderData, token);
    
    res.json({
      success: true,
      shipmentId: shipment.shipment_id,
      trackingId: shipment.tracking_id,
      courierName: shipment.courier_name,
      awbCode: shipment.awb_code,
      estimatedDelivery: shipment.estimated_delivery
    });
    
  } catch (error: any) {
    console.error('Shipment creation error:', error);
    res.status(500).json({ 
      error: 'Failed to create shipment',
      message: error.message 
    });
  }
});

// Track shipment endpoint
router.get('/track/:shipmentId', async (req: Request, res: Response) => {
  try {
    const { shipmentId } = req.params;
    
    // Get Shiprocket token
    const token = await getShiprocketToken();
    
    // Track shipment
    const trackingData = await trackShipment(shipmentId, token);
    
    res.json({
      success: true,
      trackingData
    });
    
  } catch (error: any) {
    console.error('Tracking error:', error);
    res.status(500).json({ 
      error: 'Failed to track shipment',
      message: error.message 
    });
  }
});

// Get shipping rates endpoint
router.post('/shipping-rates', async (req: Request, res: Response) => {
  try {
    const { pincode, weight = 0.5, cod = false } = req.body;
    
    if (!pincode) {
      return res.status(400).json({ error: 'Pincode is required' });
    }

    // Get Shiprocket token
    const token = await getShiprocketToken();
    
    // Get shipping rates (this would need to be implemented based on Shiprocket's API)
    // For now, returning a mock response
    const rates = [
      {
        courier_name: 'Delhivery',
        estimated_delivery: '3-5 days',
        charges: cod ? 80 : 60,
        rating: 4.5
      },
      {
        courier_name: 'XpressBees',
        estimated_delivery: '2-4 days',
        charges: cod ? 85 : 65,
        rating: 4.3
      },
      {
        courier_name: 'Blue Dart',
        estimated_delivery: '2-3 days',
        charges: cod ? 90 : 70,
        rating: 4.7
      }
    ];
    
    res.json({
      success: true,
      rates
    });
    
  } catch (error: any) {
    console.error('Shipping rates error:', error);
    res.status(500).json({ 
      error: 'Failed to get shipping rates',
      message: error.message 
    });
  }
});

export default router;
