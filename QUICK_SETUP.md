# Quick Setup Guide - Achyutam Organics

## 🚨 Fix "Access Denied" Error

The "Invalid API key" error is because Supabase credentials are missing. Follow these steps:

### 1. Get Supabase Credentials
1. Go to [supabase.com](https://supabase.com)
2. Create a new project or use existing one
3. Go to Project Settings → API
4. Copy:
   - **Project URL** (e.g., `https://xxxxxxxx.supabase.co`)
   - **anon/public key** (starts with `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`)

### 2. Update .env File
Create or update your `.env` file with:
```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# Server Configuration
PORT=4000
NODE_ENV=development
CLIENT_ORIGIN=http://localhost:5173,http://localhost:4173

# Razorpay (for payments)
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

# Email (optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
EMAIL_FROM="Achyutam Organics" <noreply@achyutamorganics.com>
OWNER_EMAIL=admin@achyutamorganics.com

# Frontend Configuration
VITE_API_BASE_URL=http://localhost:4000
VITE_FRONTEND_URL=http://localhost:5173
```

### 3. Setup Database
Run these SQL files in Supabase SQL Editor:
1. `supabase_schema.sql` - Creates database tables
2. `achyutam_products.sql` - Adds products and categories

### 4. Create Admin User
1. In Supabase Dashboard → Authentication → Users
2. Click "Add user"
3. Email: `admin@achyutamorganics.com`
4. Password: Choose secure password
5. Add this email to `OWNER_EMAIL` in .env

### 5. Restart Development Server
```bash
npm run dev
```

## ✅ Fixes Applied

I've already fixed the UI issues you requested:

1. ✅ **Removed italic from heading** - "Pure Nutrition" is now normal text
2. ✅ **Made heading smaller** - Reduced from text-8xl to text-7xl
3. ✅ **Removed hero background animation** - No more hover scale effect
4. ✅ **Removed newsletter section** - Completely removed from homepage

## 🎯 Next Steps

1. Set up Supabase (required for app to work)
2. Configure environment variables
3. Restart development server
4. Test admin login at: `http://localhost:5173/admin-portal/login`

## 🧪 Test the Application

### Frontend
- Visit: `http://localhost:5173`
- Browse products
- Add to cart
- Test checkout

### Admin Panel
- Visit: `http://localhost:5173/admin-portal/login`
- Login with admin credentials
- Manage products and orders

## 📱 Mobile Responsive

The application is fully responsive:
- Desktop: Full experience
- Tablet: Optimized layout
- Mobile: Touch-friendly interface

---

**Note**: The "Access Denied" error will be fixed once you configure Supabase credentials in the .env file.
