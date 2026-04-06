# Email Configuration for Deployment

## Problem
Emails are not being sent after deployment due to missing SMTP configuration.

## Solution

### 1. Configure Environment Variables

Add these environment variables to your deployment platform (Vercel, Railway, etc.):

```bash
# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
EMAIL_FROM=Achyutam Organics <your-email@gmail.com>
OWNER_EMAIL=admin@achyutamorganics.com
```

### 2. Gmail Setup (Recommended)

#### Step 1: Enable 2-Factor Authentication
1. Go to your Google Account settings
2. Enable 2-Factor Authentication

#### Step 2: Generate App Password
1. Go to [Google App Passwords](https://myaccount.google.com/apppasswords)
2. Select "Mail" from the dropdown
3. Enter a name (e.g., "Achyutam App")
4. Copy the 16-character password

#### Step 3: Use App Password
- Use the app password as `SMTP_PASS`
- Use your Gmail address as `SMTP_USER` and `EMAIL_FROM`

### 3. Alternative SMTP Providers

#### SendGrid
```bash
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=YOUR_SENDGRID_API_KEY
```

#### Mailgun
```bash
SMTP_HOST=smtp.mailgun.org
SMTP_PORT=587
SMTP_USER=postmaster@yourdomain.com
SMTP_PASS=YOUR_MAILGUN_PASSWORD
```

### 4. Testing Email Configuration

After deployment, check the server logs for these messages:

✅ **Success:**
```
📧 Setting up email transporter with: {...}
✅ Email transporter is ready to send messages
✅ Owner email sent successfully
✅ Customer email sent successfully
```

❌ **Error Messages:**
```
⚠️ Email credentials missing. Emails will not be sent.
❌ Email transporter verification failed: [error details]
❌ Email Delivery Failed: [error details]
```

### 5. Common Issues & Solutions

#### Issue: "ERR_BLOCKED_BY_CLIENT"
**Cause:** Browser/network blocking email requests
**Solution:** This is a client-side error, server-side emails should still work. Check server logs.

#### Issue: "ECONNREFUSED"
**Cause:** Wrong SMTP host/port
**Solution:** Verify SMTP_HOST and SMTP_PORT values

#### Issue: "EAUTH"
**Cause:** Invalid credentials
**Solution:** Use app password (not regular password) for Gmail

#### Issue: "ENOTFOUND"
**Cause:** Invalid SMTP host
**Solution:** Check SMTP_HOST spelling and format

### 6. Vercel Specific Setup

Add to your `vercel.json` or Vercel dashboard:

```json
{
  "env": {
    "SMTP_HOST": "@smtp-host",
    "SMTP_PORT": "@smtp-port",
    "SMTP_USER": "@smtp-user",
    "SMTP_PASS": "@smtp-pass",
    "EMAIL_FROM": "@email-from",
    "OWNER_EMAIL": "@owner-email"
  }
}
```

### 7. Railway Specific Setup

In Railway dashboard, add environment variables:
1. Go to your project
2. Click "Variables" tab
3. Add all SMTP variables

### 8. Debugging

To debug email issues:

1. **Check Server Logs:** Look for email-related messages
2. **Test SMTP Connection:** Use tools like [SMTP Tester](https://www.smtpdiagnostics.com/)
3. **Verify Credentials:** Test with email client first
4. **Check Firewall:** Ensure SMTP port is open

### 9. Email Template Updates

The system now includes:
- ✅ Payment method (Cash on Delivery/Prepaid)
- ✅ Better error handling
- ✅ Detailed logging
- ✅ Accessibility fixes for dialogs

### 10. Monitoring

Monitor email delivery by:
- Checking server logs
- Setting up email delivery monitoring
- Testing with real orders

## Support

If you still face issues:
1. Check server logs for specific error messages
2. Verify all environment variables are set
3. Test SMTP credentials with email client
4. Contact your SMTP provider support
