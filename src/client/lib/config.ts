const DEFAULT_API_URL = "http://localhost:4001";

export const getApiUrl = () => {
  const envUrl = import.meta.env.VITE_API_BASE_URL?.trim();
  if (envUrl) {
    return envUrl.replace(/\/$/, "");
  }
  
  // Fallback for production when VITE_API_BASE_URL is not set
  if (import.meta.env.PROD && typeof window !== "undefined") {
    const origin = window.location.origin;
    // If deployed on same domain, use same origin for API
    return origin;
  }
  
  return DEFAULT_API_URL;
};

export const getFrontendUrl = () => {
  const envUrl = import.meta.env.VITE_FRONTEND_URL?.trim();
  if (envUrl) {
    return envUrl.replace(/\/$/, "");
  }
  if (typeof window !== "undefined") {
    return window.location.origin;
  }
  return "http://localhost:5173";
};
