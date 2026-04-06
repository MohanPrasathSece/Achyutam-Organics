# CORS Issue Fix - Production Deployment

## 🔍 Problem Identified
The deployed website at `https://www.achyutamorganic.com` is trying to connect to `localhost:4001` instead of the production API, causing CORS errors.

## 🚨 Error Messages
```
Access to fetch at 'http://localhost:4001/api/orders/create-cod' from origin 'https://www.achyutamorganic.com' has been blocked by CORS policy: Response to preflight request doesn't pass access control check: No 'Access-Control-Allow-Origin' header is present on the requested resource.
```

## 🔧 Solution Steps

### 1. Set Environment Variables in Production

You need to set these environment variables in your hosting platform (Vercel, Railway, etc.):

```bash
# Frontend Environment Variables
VITE_API_BASE_URL=https://your-api-domain.com
VITE_FRONTEND_URL=https://www.achyutamorganic.com

# Backend Environment Variables  
CLIENT_ORIGIN=https://www.achyutamorganic.com,https://achyutamorganic.com
NODE_ENV=production
```

### 2. Update API Configuration

The frontend config has been updated to handle production:

```javascript
// src/client/lib/config.ts
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
```

### 3. Deployment Options

#### Option A: Same Domain Deployment (Recommended)
If frontend and backend are on the same domain:

```bash
# Set VITE_API_BASE_URL to same domain
VITE_API_BASE_URL=https://www.achyutamorganic.com
```

#### Option B: Separate API Domain
If API is on a different domain:

```bash
# Set VITE_API_BASE_URL to API domain
VITE_API_BASE_URL=https://api.achyutamorganic.com
```

#### Option C: Vercel Serverless Functions
If using Vercel serverless functions:

```bash
# Set VITE_API_BASE_URL to Vercel API
VITE_API_BASE_URL=https://your-app.vercel.app
```

### 4. Vercel Specific Configuration

Add to your `vercel.json`:

```json
{
  "build": {
    "env": {
      "VITE_API_BASE_URL": "@api-base-url",
      "VITE_FRONTEND_URL": "@frontend-url"
    }
  },
  "functions": {
    "src/server/index.js": {
      "maxDuration": 10
    }
  }
}
```

### 5. Environment Variables Setup

#### For Vercel:
1. Go to Vercel dashboard
2. Select your project
3. Go to Settings → Environment Variables
4. Add these variables:
   - `VITE_API_BASE_URL`: `https://www.achyutamorganic.com`
   - `VITE_FRONTEND_URL`: `https://www.achyutamorganic.com`

#### For Railway:
1. Go to Railway dashboard
2. Select your project
3. Go to Variables tab
4. Add these variables:
   - `VITE_API_BASE_URL`: `https://your-app.railway.app`
   - `VITE_FRONTEND_URL`: `https://www.achyutamorganic.com`
   - `CLIENT_ORIGIN`: `https://www.achyutamorganic.com,https://achyutamorganic.com`

#### For Custom VPS:
Add to your `.env` file:
```bash
VITE_API_BASE_URL=https://www.achyutamorganic.com
VITE_FRONTEND_URL=https://www.achyutamorganic.com
CLIENT_ORIGIN=https://www.achyutamorganic.com,https://achyutamorganic.com
```

### 6. Testing the Fix

After setting environment variables:

1. **Redeploy the application**
2. **Clear browser cache**
3. **Test checkout process**
4. **Check browser console** for API calls
5. **Verify API endpoints** are working

### 7. Verification Steps

Check that API calls go to the correct URL:

```javascript
// Should show production URL, not localhost
console.log('API URL:', getApiUrl());
```

### 8. Common Issues & Solutions

#### Issue: Still connecting to localhost
**Solution:** 
- Clear browser cache
- Redeploy application
- Check environment variables are set correctly

#### Issue: CORS errors persist
**Solution:**
- Verify CLIENT_ORIGIN includes your domain
- Check server logs for CORS configuration
- Ensure API server is running in production

#### Issue: API calls fail
**Solution:**
- Check API server is deployed and running
- Verify API endpoints are accessible
- Check server logs for errors

### 9. Quick Fix Checklist

- [ ] Set `VITE_API_BASE_URL` environment variable
- [ ] Set `VITE_FRONTEND_URL` environment variable  
- [ ] Set `CLIENT_ORIGIN` on backend
- [ ] Redeploy application
- [ ] Clear browser cache
- [ ] Test checkout process
- [ ] Verify API calls go to production URL

### 10. Emergency Fix

If you need an immediate fix, you can hardcode the production URL temporarily:

```javascript
// src/client/lib/config.ts
const DEFAULT_API_URL = "https://www.achyutamorganic.com";
```

**⚠️ Warning:** This is not recommended for long-term use. Use environment variables instead.

## 🚀 Next Steps

1. **Set environment variables** in your hosting platform
2. **Redeploy the application**
3. **Test the checkout process**
4. **Monitor for any remaining issues**

The CORS issue will be resolved once the frontend connects to the production API instead of localhost.
