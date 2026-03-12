// Admin Configuration
export const ADMIN_CONFIG = {
  // Default admin credentials (can be overridden by environment variables)
  email: import.meta.env.ADMIN_EMAIL || "saritaagarwal287@gmail.com",
  password: import.meta.env.ADMIN_PASSWORD || "admin123",
  
  // Admin features
  features: {
    productManagement: true,
    orderManagement: true,
    categoryManagement: true,
    giftManagement: true,
    dashboard: true,
  },
  
  // Admin UI settings
  ui: {
    theme: "emerald",
    primaryColor: "emerald-600",
    secondaryColor: "slate-600",
    accentColor: "emerald-500",
  },
  
  // Security settings
  security: {
    sessionTimeout: 24 * 60 * 60 * 1000, // 24 hours
    requireAuth: true,
    enableLogging: true,
  }
};

// Check if admin is configured
export const isAdminConfigured = () => {
  return !!(import.meta.env.ADMIN_EMAIL && import.meta.env.ADMIN_PASSWORD);
};

// Get admin credentials
export const getAdminCredentials = () => {
  return {
    email: ADMIN_CONFIG.email,
    password: ADMIN_CONFIG.password,
  };
};
