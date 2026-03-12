// Location validation for Katni-only milk delivery

export interface DeliveryLocation {
  city: string;
  state: string;
  pincode: string;
  isKatni: boolean;
}

// Katni location data
const KATNI_LOCATIONS = {
  city: 'Katni',
  state: 'Madhya Pradesh',
  pincodes: [
    '483501', // Katni Main
    '483502', // Katni Rural
    '483503', // Katni Industrial Area
    '483504', // Katni Bypass
    '483505', // Nearby Katni areas
    '483551', // Murwara
    '483552', // Barwara
    '483553', // Bahoriband
    '483554', // Dheemarkheda
    '483555', // Vijayraghavgarh
  ]
};

export const validateDeliveryLocation = (city: string, state: string, pincode: string): DeliveryLocation => {
  const normalizedCity = city.toLowerCase().trim();
  const normalizedState = state.toLowerCase().trim();
  const normalizedPincode = pincode.trim();
  
  const isKatniCity = normalizedCity === 'katni' || normalizedCity === 'murwara';
  const isKatniState = normalizedState === 'madhya pradesh' || normalizedState === 'mp';
  const isKatniPincode = KATNI_LOCATIONS.pincodes.includes(normalizedPincode);
  
  const isKatni = isKatniCity && isKatniState && isKatniPincode;
  
  return {
    city: city,
    state: state,
    pincode: pincode,
    isKatni
  };
};

export const canDeliverMilk = (location: DeliveryLocation): boolean => {
  return location.isKatni;
};

export const canDeliverGhee = (location: DeliveryLocation): boolean => {
  // Ghee can be delivered all over India
  return true;
};

export const getDeliveryMessage = (location: DeliveryLocation, productType: 'milk' | 'ghee'): string => {
  if (productType === 'milk') {
    if (location.isKatni) {
      return '✅ Fresh milk delivery available in your area';
    } else {
      return '❌ Fresh milk delivery available only in Katni, Madhya Pradesh';
    }
  }
  
  if (productType === 'ghee') {
    return '✅ Ghee delivery available all over India';
  }
  
  return '';
};

export const formatDeliveryInfo = (location: DeliveryLocation): string => {
  if (location.isKatni) {
    return `${location.city}, ${location.state} - ${location.pincode} (Milk Delivery Available)`;
  } else {
    return `${location.city}, ${location.state} - ${location.pincode} (Only Ghee Delivery)`;
  }
};

// Check if cart contains milk products
export const hasMilkProducts = (cartItems: any[]): boolean => {
  return cartItems.some(item => 
    item.name?.toLowerCase().includes('milk') || 
    item.category?.toLowerCase().includes('milk')
  );
};

// Validate cart for delivery location
export const validateCartForLocation = (cartItems: any[], location: DeliveryLocation): {
  isValid: boolean;
  message: string;
  invalidItems: any[];
} => {
  const invalidItems = cartItems.filter(item => {
    const isMilk = item.name?.toLowerCase().includes('milk') || 
                   item.category?.toLowerCase().includes('milk');
    return isMilk && !location.isKatni;
  });
  
  if (invalidItems.length > 0) {
    return {
      isValid: false,
      message: 'Fresh milk products can only be delivered in Katni, Madhya Pradesh. Please remove milk items from cart.',
      invalidItems
    };
  }
  
  return {
    isValid: true,
    message: 'All items can be delivered to your location.',
    invalidItems: []
  };
};
