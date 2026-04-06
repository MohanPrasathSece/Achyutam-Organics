# Email Debugging Guide - Production Environment

## 🔍 How to Check Email Status in Production

### **Step 1: Open Browser Developer Tools**

1. **Visit your website**: `https://www.achyutamorganic.com`
2. **Open Developer Tools**: Press `F12` or right-click → "Inspect"
3. **Go to Console tab**
4. **Clear console** (click clear button)

### **Step 2: Place a Test Order**

1. **Add products to cart**
2. **Proceed to checkout**
3. **Fill in details** (use test email: `test@example.com`)
4. **Place order** (COD or Online payment)

### **Step 3: Watch Console for Email Logs**

You'll see detailed email logs like this:

#### **✅ SUCCESS - Email Working:**
```javascript
📧 EMAIL SENDING ATTEMPT: {
  "timestamp": "2026-04-06T09:30:00.000Z",
  "to": "customer@gmail.com",
  "from": "your-email@gmail.com", 
  "subject": "Your Achyutam Organics order is confirmed",
  "smtpHost": "smtp.gmail.com",
  "smtpPort": "587",
  "smtpUser": "your-email@gmail.com",
  "environment": "production"
}

✅ EMAIL SENT SUCCESSFULLY: {
  "success": true,
  "messageId": "abc123def456@mail.gmail.com",
  "timestamp": "2026-04-06T09:30:05.000Z",
  "to": "customer@gmail.com",
  "subject": "Your Achyutam Organics order is confirmed"
}

📧 SENDING COD ORDER EMAILS: {
  "orderId": "123456",
  "customerEmail": "customer@gmail.com",
  "customerName": "John Doe",
  "amount": 500,
  "paymentMethod": "COD",
  "timestamp": "2026-04-06T09:30:10.000Z"
}

✅ COD ORDER EMAILS SENT: {
  "orderId": "123456",
  "customerEmail": "customer@gmail.com",
  "timestamp": "2026-04-06T09:30:15.000Z",
  "results": [/* email results */]
}
```

#### **❌ ERROR - Email Not Working:**
```javascript
⚠️ EMAIL ERROR: Email transporter not configured
🔧 Required env vars: SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS

❌ EMAIL DELIVERY FAILED: {
  "success": false,
  "error": "connect ECONNREFUSED 127.0.0.1:587",
  "code": "ECONNREFUSED",
  "timestamp": "2026-04-06T09:30:00.000Z",
  "to": "customer@gmail.com",
  "subject": "Your Achyutam Organics order is confirmed",
  "smtpHost": "smtp.gmail.com",
  "smtpPort": "587", 
  "smtpUser": "your-email@gmail.com",
  "environment": "production",
  "stack": "Error: connect ECONNREFUSED..."
}

🔧 DIAGNOSTIC: {
  "issue": "SMTP server connection refused",
  "solution": "Check SMTP_HOST and SMTP_PORT. Server might be down or blocking connections."
}

❌ COD ORDER EMAILS FAILED: {
  "orderId": "123456",
  "customerEmail": "customer@gmail.com", 
  "error": "connect ECONNREFUSED 127.0.0.1:587",
  "timestamp": "2026-04-06T09:30:10.000Z",
  "stack": "Error: connect ECONNREFUSED..."
}
```

## 🔧 Common Email Issues & Solutions

### **Issue 1: Missing Environment Variables**
**Console Shows:**
```
⚠️ EMAIL ERROR: Email transporter not configured
🔧 Required env vars: SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS
```

**Solution:**
Add these environment variables to your hosting platform:
```bash
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
EMAIL_FROM=Achyutam Organics <your-email@gmail.com>
OWNER_EMAIL=admin@achyutamorganics.com
```

### **Issue 2: Gmail Authentication Failed**
**Console Shows:**
```
❌ EMAIL DELIVERY FAILED: {
  "code": "EAUTH",
  "error": "535-5.7.8 Username and Password not accepted"
}

🔧 DIAGNOSTIC: {
  "issue": "SMTP authentication failed",
  "solution": "Check SMTP_USER and SMTP_PASS. For Gmail, use App Password not regular password."
}
```

**Solution:**
1. **Enable 2-Factor Authentication** on your Google account
2. **Generate App Password** at: https://myaccount.google.com/apppasswords
3. **Use the 16-character app password** as `SMTP_PASS`

### **Issue 3: Connection Refused**
**Console Shows:**
```
❌ EMAIL DELIVERY FAILED: {
  "code": "ECONNREFUSED",
  "error": "connect ECONNREFUSED 127.0.0.1:587"
}

🔧 DIAGNOSTIC: {
  "issue": "SMTP server connection refused", 
  "solution": "Check SMTP_HOST and SMTP_PORT. Server might be down or blocking connections."
}
```

**Solution:**
1. **Check SMTP_HOST**: Should be `smtp.gmail.com`, not `localhost`
2. **Check SMTP_PORT**: Try `587` (TLS) instead of `465` (SSL)
3. **Check firewall**: Your hosting provider might block SMTP ports

### **Issue 4: Host Not Found**
**Console Shows:**
```
❌ EMAIL DELIVERY FAILED: {
  "code": "ENOTFOUND",
  "error": "getaddrinfo ENOTFOUND smtp.gmaill.com"
}

🔧 DIAGNOSTIC: {
  "issue": "SMTP host not found",
  "solution": "Check SMTP_HOST spelling and DNS resolution."
}
```

**Solution:**
- **Fix typo**: Should be `smtp.gmail.com`, not `smtp.gmaill.com`
- **Check DNS**: Ensure the hostname is correct

## 🧪 Quick Email Test

### **Test Email Endpoint**
Visit: `https://www.achyutamorganic.com/api/test-email`

**Response will show:**
```json
{
  "success": true,
  "message": "Test email sent successfully", 
  "result": {
    "success": true,
    "messageId": "abc123def456@mail.gmail.com"
  },
  "config": {
    "SMTP_HOST": "✅ Configured",
    "SMTP_PORT": "✅ Configured", 
    "SMTP_USER": "✅ Configured",
    "SMTP_PASS": "✅ Configured"
  }
}
```

## 📋 Email Debugging Checklist

### **Before Testing:**
- [ ] Environment variables set in hosting platform
- [ ] Gmail app password generated (if using Gmail)
- [ ] SMTP settings verified
- [ ] Browser console opened

### **During Testing:**
- [ ] Place test order (COD or online)
- [ ] Watch console for email logs
- [ ] Check for error messages
- [ ] Verify email configuration status

### **After Testing:**
- [ ] Check if emails received
- [ ] Review console logs for errors
- [ ] Test email endpoint if needed
- [ ] Fix any configuration issues

## 🚀 Emergency Fixes

### **Quick Fix 1: Use SendGrid**
If Gmail doesn't work, try SendGrid:
```bash
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=YOUR_SENDGRID_API_KEY
```

### **Quick Fix 2: Test Different Port**
Try port 25 instead of 587:
```bash
SMTP_PORT=25
```

### **Quick Fix 3: Check Email Provider**
Some hosting providers block SMTP. Try:
- **Resend** (recommended for production)
- **Mailgun** (free tier available)
- **SendGrid** (free tier available)

## 📊 Email Status Summary

| Status | Console Shows | Action Required |
|--------|---------------|-----------------|
| ✅ Working | `✅ EMAIL SENT SUCCESSFULLY` | No action needed |
| ⚠️ Not Configured | `⚠️ EMAIL ERROR: Email transporter not configured` | Set environment variables |
| ❌ Authentication Failed | `❌ EMAIL DELIVERY FAILED` with `EAUTH` | Use app password |
| ❌ Connection Failed | `❌ EMAIL DELIVERY FAILED` with `ECONNREFUSED` | Check SMTP settings |
| ❌ Host Not Found | `❌ EMAIL DELIVERY FAILED` with `ENOTFOUND` | Fix SMTP_HOST |

Now you can easily see exactly what's happening with emails in production by watching the browser console! 🎯
