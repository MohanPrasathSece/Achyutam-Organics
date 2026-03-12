import { getApiUrl } from './config';

const API_BASE_URL = getApiUrl();

class ApiError extends Error {
    constructor(public status: number, message: string) {
        super(message);
        this.name = 'ApiError';
    }
}

const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
    const url = `${API_BASE_URL}/api${endpoint}`;
    
    const config: RequestInit = {
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
        ...options,
    };

    // Add auth token if available
    const token = localStorage.getItem('supabase.auth.token');
    if (token) {
        try {
            const { access_token } = JSON.parse(token);
            if (access_token) {
                config.headers = {
                    ...config.headers,
                    'Authorization': `Bearer ${access_token}`,
                };
            }
        } catch (e) {
            console.warn('Failed to parse auth token');
        }
    }

    try {
        const response = await fetch(url, config);
        const data = await response.json();

        if (!response.ok) {
            throw new ApiError(response.status, data.error || 'API request failed');
        }

        return data;
    } catch (error) {
        if (error instanceof ApiError) {
            throw error;
        }
        throw new ApiError(0, 'Network error occurred');
    }
};

// Public API endpoints
export const publicApi = {
    // Products
    getProducts: async (params?: {
        category?: string;
        featured?: boolean;
        bestseller?: boolean;
        search?: string;
        limit?: number;
        offset?: number;
    }) => {
        const searchParams = new URLSearchParams();
        if (params) {
            Object.entries(params).forEach(([key, value]) => {
                if (value !== undefined) {
                    searchParams.append(key, value.toString());
                }
            });
        }
        const query = searchParams.toString() ? `?${searchParams.toString()}` : '';
        return apiRequest(`/public/products${query}`);
    },

    getProduct: async (slug: string) => {
        return apiRequest(`/public/products/${slug}`);
    },

    // Categories
    getCategories: async () => {
        return apiRequest('/public/categories');
    },

    getFeaturedCategories: async () => {
        return apiRequest('/public/categories/featured');
    },

    // Gift Options
    getGiftOptions: async () => {
        return apiRequest('/public/gift-options');
    },

    // Order Tracking
    trackOrder: async (orderNumber: string) => {
        return apiRequest(`/public/orders/track/${orderNumber}`);
    },

    // Search
    searchProducts: async (query: string, params?: {
        category?: string;
        limit?: number;
        offset?: number;
    }) => {
        const searchParams = new URLSearchParams({ q: query });
        if (params) {
            Object.entries(params).forEach(([key, value]) => {
                if (value !== undefined) {
                    searchParams.append(key, value.toString());
                }
            });
        }
        return apiRequest(`/public/search?${searchParams.toString()}`);
    },
};

// Order API endpoints
export const orderApi = {
    createOrder: async (orderData: any) => {
        return apiRequest('/orders/create', {
            method: 'POST',
            body: JSON.stringify(orderData),
        });
    },

    verifyPayment: async (paymentData: any) => {
        return apiRequest('/orders/verify', {
            method: 'POST',
            body: JSON.stringify(paymentData),
        });
    },
};

// Admin API endpoints
export const adminApi = {
    // Dashboard
    getStats: async () => {
        return apiRequest('/admin/stats');
    },

    // Orders
    getOrders: async (params?: {
        page?: number;
        limit?: number;
        status?: string;
        search?: string;
    }) => {
        const searchParams = new URLSearchParams();
        if (params) {
            Object.entries(params).forEach(([key, value]) => {
                if (value !== undefined) {
                    searchParams.append(key, value.toString());
                }
            });
        }
        const query = searchParams.toString() ? `?${searchParams.toString()}` : '';
        return apiRequest(`/admin/orders${query}`);
    },

    updateOrderStatus: async (orderId: string, status: string, trackingNumber?: string) => {
        return apiRequest('/orders/update-status', {
            method: 'POST',
            body: JSON.stringify({
                orderId,
                status,
                trackingNumber,
            }),
        });
    },

    // Products
    getProducts: async (params?: {
        page?: number;
        limit?: number;
        category?: string;
        status?: string;
    }) => {
        const searchParams = new URLSearchParams();
        if (params) {
            Object.entries(params).forEach(([key, value]) => {
                if (value !== undefined) {
                    searchParams.append(key, value.toString());
                }
            });
        }
        const query = searchParams.toString() ? `?${searchParams.toString()}` : '';
        return apiRequest(`/admin/products${query}`);
    },

    createProduct: async (productData: any) => {
        return apiRequest('/admin/products', {
            method: 'POST',
            body: JSON.stringify(productData),
        });
    },

    updateProduct: async (id: string, productData: any) => {
        return apiRequest(`/admin/products/${id}`, {
            method: 'PUT',
            body: JSON.stringify(productData),
        });
    },

    deleteProduct: async (id: string) => {
        return apiRequest(`/admin/products/${id}`, {
            method: 'DELETE',
        });
    },

    // Categories
    getCategories: async () => {
        return apiRequest('/admin/categories');
    },

    createCategory: async (categoryData: any) => {
        return apiRequest('/admin/categories', {
            method: 'POST',
            body: JSON.stringify(categoryData),
        });
    },

    updateCategory: async (id: string, categoryData: any) => {
        return apiRequest(`/admin/categories/${id}`, {
            method: 'PUT',
            body: JSON.stringify(categoryData),
        });
    },

    deleteCategory: async (id: string) => {
        return apiRequest(`/admin/categories/${id}`, {
            method: 'DELETE',
        });
    },

    // Gift Options
    getGiftOptions: async () => {
        return apiRequest('/admin/gift-options');
    },

    createGiftOption: async (optionData: any) => {
        return apiRequest('/admin/gift-options', {
            method: 'POST',
            body: JSON.stringify(optionData),
        });
    },

    updateGiftOption: async (id: string, optionData: any) => {
        return apiRequest(`/admin/gift-options/${id}`, {
            method: 'PUT',
            body: JSON.stringify(optionData),
        });
    },

    deleteGiftOption: async (id: string) => {
        return apiRequest(`/admin/gift-options/${id}`, {
            method: 'DELETE',
        });
    },
};

export { ApiError };
