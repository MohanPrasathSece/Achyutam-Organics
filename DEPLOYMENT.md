# Deployment Guide - Achyutam Organics

## 🚀 Quick Deployment

### Prerequisites
- Node.js 18+
- Supabase account
- Razorpay account
- Domain name (optional)

## Step 1: Database Setup

1. **Create Supabase Project**
   - Go to [supabase.com](https://supabase.com)
   - Create new project
   - Note project URL and anon key

2. **Run Database Schema**
   ```sql
   -- Run the contents of supabase_schema.sql in Supabase SQL Editor
   ```

3. **Run Product Data**
   ```sql
   -- Run the contents of achyutam_products.sql in Supabase SQL Editor
   ```

4. **Set Up Authentication**
   - Go to Authentication > Settings
   - Enable email signup
   - Create admin user with email from .env file

## Step 2: Environment Configuration

1. **Create .env file**
   ```bash
   cp .env.example .env
   ```

2. **Fill Environment Variables**
   ```env
   # Server Configuration
   PORT=4000
   NODE_ENV=production
   CLIENT_ORIGIN=https://yourdomain.com,https://www.yourdomain.com

   # Supabase Configuration
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

   # Razorpay Configuration
   RAZORPAY_KEY_ID=your_razorpay_key_id
   RAZORPAY_KEY_SECRET=your_razorpay_key_secret

   # Email Configuration
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your_email@gmail.com
   SMTP_PASS=your_app_password
   EMAIL_FROM="Achyutam Organics" <noreply@achyutamorganics.com>
   OWNER_EMAIL=admin@achyutamorganics.com

   # Frontend Configuration
   VITE_API_BASE_URL=https://your-api-url.com
   VITE_FRONTEND_URL=https://yourdomain.com
   ```

## Step 3: Vercel Deployment (Recommended)

### Frontend Deployment
1. **Connect to Vercel**
   ```bash
   npm install -g vercel
   vercel login
   vercel
   ```

2. **Configure Vercel**
   - Follow prompts to configure project
   - Set environment variables in Vercel dashboard:
     ```bash
     VITE_API_BASE_URL=https://www.achyutamorganic.com
     VITE_FRONTEND_URL=https://www.achyutamorganic.com
     CLIENT_ORIGIN=https://www.achyutamorganic.com,https://achyutamorganic.com
     ```
   - Deploy automatically

### Backend Deployment
1. **Update vercel.json**
   ```json
   {
     "version": 2,
     "builds": [
       {
         "src": "api/orders.js",
         "use": "@vercel/node"
       }
     ],
     "routes": [
       {
         "src": "/api/(.*)",
         "dest": "/api/$1"
       },
       {
         "src": "/(.*)",
         "dest": "/index.html"
       }
     ]
   }
   ```

2. **Deploy API**
   - Push to GitHub
   - Vercel will automatically deploy

## Step 4: Manual Deployment

### Build Frontend
```bash
npm run build
```

### Deploy Backend
```bash
# Install PM2 for process management
npm install -g pm2

# Start production server
pm2 start src/server/index.js --name "achyutam-api"

# Save PM2 configuration
pm2 save
pm2 startup
```

### Nginx Configuration (if using VPS)
```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    
    # Frontend
    location / {
        root /path/to/dist;
        try_files $uri $uri/ /index.html;
    }
    
    # Backend API
    location /api/ {
        proxy_pass http://localhost:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Step 5: Payment Setup

### Razorpay Configuration
1. **Login to Razorpay Dashboard**
2. **Enable Test Mode** (for development)
3. **Get API Keys**
4. **Set Webhooks** (for production)
   - URL: `https://yourdomain.com/api/orders/verify`
   - Events: `payment.captured`, `payment.failed`

### Payment Testing
```bash
# Test Razorpay integration
curl -X POST https://your-api.com/api/orders/create \
  -H "Content-Type: application/json" \
  -d '{
    "customer": {
      "name": "Test User",
      "email": "test@example.com",
      "phone": "9999999999"
    },
    "shippingAddress": {
      "line1": "123 Test Street",
      "city": "Katni",
      "state": "Madhya Pradesh",
      "postalCode": "483501",
      "country": "India"
    },
    "items": [
      {
        "id": 1,
        "name": "Pure Desi Cow Ghee - 500ml",
        "price": 450,
        "quantity": 1
      }
    ]
  }'
```

## Step 6: Email Setup

### Gmail Configuration
1. **Enable 2-Factor Authentication**
2. **Generate App Password**
   - Go to Google Account settings
   - Security > App passwords
   - Generate new app password
3. **Update SMTP credentials**

### Email Templates
- Order confirmation
- Payment success
- Order status updates
- Admin notifications

## Step 7: SSL Certificate

### Let's Encrypt (Free)
```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Get certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

## Step 8: Monitoring

### Application Monitoring
```bash
# PM2 monitoring
pm2 monit

# Log monitoring
pm2 logs achyutam-api

# Restart if needed
pm2 restart achyutam-api
```

### Error Tracking
- Set up Sentry for error tracking
- Monitor Supabase logs
- Check Razorpay dashboard

## Step 9: Performance Optimization

### CDN Setup
- Use Cloudflare for CDN
- Configure caching rules
- Optimize images

### Database Optimization
- Monitor Supabase performance
- Add indexes where needed
- Regular cleanup of old orders

## Step 10: Security

### Security Headers
```javascript
// Already configured in app.js
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://checkout.razorpay.com"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      imgSrc: ["'self'", "data:", "https://*.supabase.co"],
      connectSrc: ["'self'", "https://*.supabase.co", "https://lapi.razorpay.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      frameSrc: ["'self'", "https://api.razorpay.com"]
    }
  }
}));
```

### Rate Limiting
- Already configured: 100 requests per 15 minutes
- Adjust based on your needs

## Troubleshooting

### Common Issues

1. **CORS Errors**
   - Check CLIENT_ORIGIN in .env
   - Verify Vercel domain settings

2. **Database Connection**
   - Verify Supabase URL and keys
   - Check RLS policies

3. **Payment Issues**
   - Verify Razorpay keys
   - Check webhook configuration

4. **Email Issues**
   - Verify SMTP credentials
   - Check app password for Gmail

### Debug Mode
```bash
# Enable debug logging
DEBUG=* npm run dev
```

## Production Checklist

- [ ] Environment variables configured
- [ ] SSL certificate installed
- [ ] Database schema updated
- [ ] Payment gateway tested
- [ ] Email sending verified
- [ ] Error monitoring set up
- [ ] Backup strategy implemented
- [ ] Performance optimization done
- [ ] Security audit completed

## Support

For deployment issues:
- Check logs: `pm2 logs`
- Verify environment variables
- Test API endpoints
- Monitor Supabase dashboard

---

**Note**: This deployment guide assumes you're using Vercel for frontend and a VPS for backend. Adjust based on your hosting provider.
