# Admin Portal Setup Guide

## Overview
The Achyutam Organics admin portal provides complete management capabilities for products, orders, categories, and gift options.

## Access Requirements

### 1. Environment Variables
Add these to your `.env` file:

```env
# Admin Authentication
ADMIN_EMAIL=admin@achyutamorganics.com
ADMIN_PASSWORD=your_secure_admin_password_here

# Supabase Configuration (Required for admin)
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
VITE_SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here
```

### 2. Supabase Setup
1. Create a Supabase project at https://supabase.com
2. Enable Authentication in Supabase Dashboard
3. Create an admin user with email: `admin@achyutamorganics.com`
4. Set up the following tables (SQL provided in `supabase_schema.sql`)

## Admin Features

### 📊 Dashboard Overview
- Total orders and revenue
- Product statistics
- Recent orders
- Quick actions

### 🛍️ Product Management
- Add/Edit/Delete products
- Manage product variants
- Update pricing
- Stock management
- Product visibility controls

### 📦 Order Management
- View all orders
- Update order status
- Order filtering and search
- Export order data
- Payment verification

### 🏷️ Category Management
- Create product categories
- Organize products
- Category visibility settings

### 🎁 Gift Management
- Manage gift options
- Gift pricing
- Gift availability

## Access URLs

### Admin Login
- URL: `/admin-portal/login`
- Email: `admin@achyutamorganics.com`
- Password: Set in environment variables

### Admin Dashboard
- URL: `/admin-portal`
- Full management interface

## Security Features

### 🔐 Authentication
- Supabase Auth integration
- Session management
- Auto-logout on session expiry
- Protected routes

### 🛡️ Access Control
- Admin-only access to management features
- Route protection
- Session validation

## Quick Setup Steps

### Step 1: Configure Environment
```bash
# Copy example file
cp .env.example .env

# Edit .env with your credentials
nano .env
```

### Step 2: Set Up Supabase
1. Go to https://supabase.com
2. Create new project
3. Get your URL and API keys
4. Update `.env` file with Supabase credentials
5. Run the SQL schema from `supabase_schema.sql`

### Step 3: Create Admin User
1. Go to Supabase Dashboard → Authentication
2. Click "Create User"
3. Email: `admin@achyutamorganics.com`
4. Set a secure password
5. User will be created automatically on first login

### Step 4: Access Admin Portal
1. Navigate to `/admin-portal/login`
2. Login with admin credentials
3. Access full dashboard at `/admin-portal`

## Database Schema

### Required Tables
- `products` - Product information
- `categories` - Product categories
- `orders` - Customer orders
- `gift_options` - Gift packaging options

### Sample Admin Credentials
For development/testing:
- Email: `admin@achyutamorganics.com`
- Password: Set in your `.env` file

## Troubleshooting

### Common Issues

#### "Access Denied" Error
- Check Supabase credentials in `.env`
- Ensure admin user exists in Supabase Auth
- Verify email and password are correct

#### "401 Unauthorized" Errors
- Supabase URL or keys are incorrect
- Check environment variable names
- Ensure Supabase project is active

#### Admin Features Not Working
- Verify user has admin privileges
- Check Supabase RLS policies
- Ensure database tables exist

### Support
For admin setup issues, check:
1. Environment variables are correctly set
2. Supabase project is properly configured
3. Database schema is applied
4. Admin user is created in Supabase Auth

## Best Practices

### 🔒 Security
- Use strong admin passwords
- Regular password changes
- Enable 2FA if available
- Monitor admin access logs

### 📝 Data Management
- Regular database backups
- Order data exports
- Product inventory tracking
- Customer data privacy compliance

### 🚀 Performance
- Regular database optimization
- Image compression for products
- Cache frequently accessed data
- Monitor admin portal performance
