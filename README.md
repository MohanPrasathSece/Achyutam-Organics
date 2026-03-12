# Achyutam Organics - Pure Desi Cow Ghee & Organic Dairy Products

A full-stack e-commerce application for selling organic dairy products, built with React, Node.js, and Supabase.

## 🚀 Features

### Customer Experience
- **Beautiful UI**: Modern, responsive design with Tailwind CSS
- **Product Catalog**: Browse organic dairy products with categories
- **Shopping Cart**: Persistent cart with local storage
- **Secure Checkout**: Razorpay payment integration
- **Order Tracking**: Track orders with real-time status updates
- **Gift Options**: Premium gift wrapping and messaging
- **Mobile Responsive**: Optimized for all devices

### Admin Panel
- **Dashboard**: Real-time analytics and insights
- **Order Management**: Complete order lifecycle management
- **Product Management**: Add, edit, and organize products
- **Category Management**: Organize products efficiently
- **Gift Options**: Manage gift wrapping options
- **Inventory Tracking**: Low stock alerts and management
- **Secure Authentication**: Admin-only access with Supabase Auth

### Technical Features
- **TypeScript**: Full type safety across frontend and backend
- **Real-time Updates**: Supabase real-time subscriptions
- **Email Notifications**: Automated order and shipping emails
- **SEO Optimized**: Meta tags, structured data, and sitemaps
- **Performance**: Lazy loading, code splitting, and caching
- **Security**: Rate limiting, CORS, and input validation

## 🛠 Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development
- **Tailwind CSS** for styling
- **Radix UI** for accessible components
- **React Router** for navigation
- **React Query** for data fetching
- **Framer Motion** for animations

### Backend
- **Node.js** with Express
- **Supabase** for database and auth
- **Razorpay** for payments
- **Nodemailer** for emails
- **Zod** for validation
- **Helmet** for security

### Database
- **PostgreSQL** via Supabase
- **Row Level Security** (RLS)
- **Real-time subscriptions**
- **Automatic backups**

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account
- Razorpay account

### 1. Clone the repository
```bash
git clone <repository-url>
cd achyutam-organics
```

### 2. Install dependencies
```bash
npm install
```

### 3. Environment Setup
Copy the example environment file:
```bash
cp .env.example .env
```

Fill in your environment variables:
```env
# Server Configuration
PORT=4000
NODE_ENV=development
CLIENT_ORIGIN=http://localhost:5173,http://localhost:4173

# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# Razorpay Configuration
RAZORPAY_KEY_ID=your_razorpay_key_id_here
RAZORPAY_KEY_SECRET=your_razorpay_key_secret_here

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password_here
EMAIL_FROM="Achyutam Organics" <noreply@achyutamorganics.com>
OWNER_EMAIL=admin@achyutamorganics.com

# Frontend Configuration
VITE_API_BASE_URL=http://localhost:4000
VITE_FRONTEND_URL=http://localhost:5173
```

### 4. Database Setup
1. Create a new Supabase project
2. Run the SQL schema in `supabase_schema.sql` in your Supabase SQL Editor
3. Run the order number setup in `supabase_add_order_number.sql`
4. Set up authentication in Supabase dashboard
5. Create admin user with email from `OWNER_EMAIL`

### 5. Start Development Server
```bash
npm run dev
```

This will start both the frontend (http://localhost:5173) and backend (http://localhost:4000) concurrently.

## 🏗️ Project Structure

```
achyutam-organics/
├── src/
│   ├── client/                 # React frontend
│   │   ├── components/         # Reusable UI components
│   │   │   ├── ui/            # Base UI components
│   │   │   └── admin/         # Admin panel components
│   │   ├── pages/             # Page components
│   │   │   └── admin/         # Admin pages
│   │   ├── lib/               # Utilities and API clients
│   │   ├── context/           # React contexts
│   │   └── hooks/             # Custom hooks
│   └── server/                # Node.js backend
│       ├── controllers/       # Route controllers
│       ├── routes/            # API routes
│       ├── middleware/        # Express middleware
│       ├── lib/               # Server utilities
│       └── utils/             # Helper functions
├── public/                    # Static assets
├── api/                       # Vercel serverless functions
└── docs/                      # Documentation
```

## 📱 Usage

### For Customers
1. Browse products by category
2. Add items to cart
3. Proceed to checkout
4. Fill shipping details
5. Pay securely with Razorpay
6. Track order status

### For Admins
1. Login at `/admin-portal/login`
2. View dashboard analytics
3. Manage products and categories
4. Process orders and update status
5. Handle inventory and stock

## 🔧 Configuration

### Supabase Setup
1. Enable Row Level Security (RLS)
2. Configure authentication providers
3. Set up storage buckets for product images
4. Configure email templates

### Razorpay Setup
1. Create Razorpay account
2. Get API keys from dashboard
3. Configure webhook endpoints
4. Set up payment methods

### Email Setup
1. Configure SMTP settings
2. Set up email templates
3. Test email delivery
4. Configure bounce handling

## 🚀 Deployment

### Vercel (Recommended)
1. Connect repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Manual Deployment
```bash
# Build frontend
npm run build

# Start production server
npm start
```

## 📊 Database Schema

### Main Tables
- **products**: Product information and inventory
- **categories**: Product categorization
- **orders**: Customer orders and payments
- **gift_options**: Gift wrapping options
- **order_status_history**: Order status tracking
- **inventory_movements**: Stock movement tracking

### Views
- **low_stock_products**: Products below minimum stock
- **sales_analytics**: Monthly sales reports

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is proprietary to Achyutam Organics.

## 🆘 Support

For support and queries:
- Email: admin@achyutamorganics.com
- Phone: [Your Phone Number]

## 🔄 Updates

### Version 1.0.0
- Initial release
- Full e-commerce functionality
- Admin panel
- Payment integration
- Order tracking
- Email notifications

---

Built with ❤️ for Achyutam Organics
