import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Truck, Clock, Shield } from 'lucide-react';

interface ShippingAddress {
  name: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
}

interface ShippingOption {
  courier_name: string;
  estimated_delivery: string;
  charges: number;
  rating: number;
}

interface ShippingCalculatorProps {
  onShippingSelect: (option: ShippingOption, address: ShippingAddress) => void;
}

const ShippingCalculator: React.FC<ShippingCalculatorProps> = ({ onShippingSelect }) => {
  const [address, setAddress] = useState<ShippingAddress>({
    name: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: ''
  });

  const [paymentMethod, setPaymentMethod] = useState<'prepaid' | 'cod'>('prepaid');
  const [shippingOptions, setShippingOptions] = useState<ShippingOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedOption, setSelectedOption] = useState<ShippingOption | null>(null);

  const calculateShipping = async () => {
    if (!address.pincode || address.pincode.length !== 6) {
      alert('Please enter a valid 6-digit pincode');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/shipping/shipping-rates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pincode: address.pincode,
          weight: 0.5,
          cod: paymentMethod === 'cod'
        }),
      });

      const data = await response.json();
      if (data.success) {
        setShippingOptions(data.rates);
      }
    } catch (error) {
      console.error('Error calculating shipping:', error);
      alert('Failed to calculate shipping rates');
    } finally {
      setLoading(false);
    }
  };

  const handleShippingSelect = () => {
    if (selectedOption && address.name && address.phone && address.address) {
      onShippingSelect(selectedOption, address);
    } else {
      alert('Please fill all address details and select a shipping option');
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Truck className="w-5 h-5" />
            Shipping Address
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={address.name}
                onChange={(e) => setAddress({ ...address, name: e.target.value })}
                placeholder="Enter your full name"
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={address.phone}
                onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                placeholder="10-digit phone number"
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              value={address.address}
              onChange={(e) => setAddress({ ...address, address: e.target.value })}
              placeholder="Street address, house number"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                value={address.city}
                onChange={(e) => setAddress({ ...address, city: e.target.value })}
                placeholder="City"
              />
            </div>
            <div>
              <Label htmlFor="state">State</Label>
              <Select value={address.state} onValueChange={(value) => setAddress({ ...address, state: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select state" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Madhya Pradesh">Madhya Pradesh</SelectItem>
                  <SelectItem value="Maharashtra">Maharashtra</SelectItem>
                  <SelectItem value="Delhi">Delhi</SelectItem>
                  <SelectItem value="Karnataka">Karnataka</SelectItem>
                  <SelectItem value="Tamil Nadu">Tamil Nadu</SelectItem>
                  <SelectItem value="Uttar Pradesh">Uttar Pradesh</SelectItem>
                  <SelectItem value="Gujarat">Gujarat</SelectItem>
                  <SelectItem value="Rajasthan">Rajasthan</SelectItem>
                  <SelectItem value="West Bengal">West Bengal</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="pincode">Pincode</Label>
              <Input
                id="pincode"
                value={address.pincode}
                onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
                placeholder="6-digit pincode"
                maxLength={6}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Payment Method</CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup value={paymentMethod} onValueChange={(value: 'prepaid' | 'cod') => setPaymentMethod(value)}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="prepaid" id="prepaid" />
              <Label htmlFor="prepaid">Prepaid (Online Payment)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="cod" id="cod" />
              <Label htmlFor="cod">Cash on Delivery (COD)</Label>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      <Button 
        onClick={calculateShipping} 
        disabled={loading || !address.pincode}
        className="w-full"
      >
        {loading ? 'Calculating...' : 'Calculate Shipping'}
      </Button>

      {shippingOptions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Available Shipping Options
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {shippingOptions.map((option, index) => (
              <div
                key={index}
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  selectedOption?.courier_name === option.courier_name
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                }`}
                onClick={() => setSelectedOption(option)}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold">{option.courier_name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {option.estimated_delivery}
                    </p>
                    <div className="flex items-center gap-1 mt-1">
                      <Shield className="w-4 h-4 text-primary" />
                      <span className="text-sm">Rating: {option.rating}/5</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-primary">₹{option.charges}</p>
                    <p className="text-xs text-muted-foreground">
                      {paymentMethod === 'cod' ? 'COD charges included' : 'Prepaid'}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {selectedOption && (
        <Button onClick={handleShippingSelect} className="w-full">
          Continue with {selectedOption.courier_name} - ₹{selectedOption.charges}
        </Button>
      )}
    </div>
  );
};

export default ShippingCalculator;
