// Debug script to test email configuration
// Run this on your server: node debug-email.js

import dotenv from 'dotenv';
import { sendMail } from './src/server/utils/email.js';

// Load environment variables
dotenv.config();

console.log('🔍 Email Configuration Debug');
console.log('================================');

// Check environment variables
const requiredVars = ['SMTP_HOST', 'SMTP_PORT', 'SMTP_USER', 'SMTP_PASS'];
const optionalVars = ['EMAIL_FROM', 'OWNER_EMAIL'];

console.log('\n📋 Required Environment Variables:');
requiredVars.forEach(varName => {
  const value = process.env[varName];
  console.log(`${value ? '✅' : '❌'} ${varName}: ${value ? 'SET' : 'MISSING'}`);
});

console.log('\n📋 Optional Environment Variables:');
optionalVars.forEach(varName => {
  const value = process.env[varName];
  console.log(`${value ? '✅' : '❌'} ${varName}: ${value ? 'SET' : 'MISSING'}`);
});

console.log('\n🌍 Environment Info:');
console.log(`NODE_ENV: ${process.env.NODE_ENV || 'development'}`);
console.log(`VERCEL: ${process.env.VERCEL || 'false'}`);

// Test email sending
async function testEmail() {
  try {
    console.log('\n📧 Testing Email Sending...');
    
    const result = await sendMail({
      to: process.env.OWNER_EMAIL || 'test@example.com',
      subject: 'Debug Test Email',
      html: `
        <h2>Email Debug Test</h2>
        <p>This is a test email to verify email configuration.</p>
        <p>Timestamp: ${new Date().toISOString()}</p>
        <p>Environment: ${process.env.NODE_ENV || 'development'}</p>
        <p>SMTP Host: ${process.env.SMTP_HOST || 'Not configured'}</p>
      `
    });

    if (result.success) {
      console.log('✅ Email sent successfully!');
      console.log(`Message ID: ${result.messageId}`);
    } else {
      console.log('❌ Email failed to send');
      console.log(`Error: ${result.error}`);
    }
  } catch (error) {
    console.error('❌ Test failed with error:', error.message);
    
    // Provide specific suggestions based on error
    if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 Suggestion: Check SMTP_HOST and SMTP_PORT');
    } else if (error.code === 'EAUTH') {
      console.log('\n💡 Suggestion: Check SMTP_USER and SMTP_PASS');
      console.log('   For Gmail, use an App Password, not your regular password');
    } else if (error.code === 'ENOTFOUND') {
      console.log('\n💡 Suggestion: Check SMTP_HOST spelling');
    }
  }
}

// Run the test
testEmail().then(() => {
  console.log('\n🏁 Debug complete');
  process.exit(0);
}).catch(error => {
  console.error('\n💥 Debug failed:', error);
  process.exit(1);
});
