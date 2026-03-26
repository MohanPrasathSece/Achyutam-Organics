import nodemailer from "nodemailer";

let transporter;

export const getTransporter = () => {
  if (transporter) return transporter;
  const {
    SMTP_HOST,
    SMTP_PORT,
    SMTP_USER,
    SMTP_PASS,
  } = process.env;

  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) {
    console.warn("⚠️ Email credentials missing. Emails will not be sent.");
    return null;
  }

  transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: Number(SMTP_PORT) === 465,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
    tls: {
      rejectUnauthorized: false
    }
  });

  return transporter;
};

export const sendMail = async ({ to, subject, html }) => {
  const mailer = getTransporter();
  if (!mailer) {
    console.warn("Skipping email send because transporter is not configured.");
    return;
  }

  const from = (process.env.EMAIL_FROM || process.env.SMTP_USER);
  console.log(`📧 Sending Email: "${subject}" | TO: ${to} | FROM: ${from}`);

  try {
    const info = await mailer.sendMail({
      from,
      to,
      subject,
      html,
    });
    console.log(`✅ Email Sent Successfully: ${info.messageId}`);
  } catch (error) {
    console.error(`❌ Email Delivery Failed: ${error.message}`);
    throw error;
  }
};

const generateOrderTable = (items) => {
  if (!items || !Array.isArray(items)) return "";

  const formattedItems = items
    .map(
      (item) => `
        <tr>
          <td style="padding: 10px 12px; border: 1px solid #e5e7eb; color: #374151;">${item.name}</td>
          <td style="padding: 10px 12px; border: 1px solid #e5e7eb; color: #374151; text-align: center;">${item.quantity}</td>
          <td style="padding: 10px 12px; border: 1px solid #e5e7eb; color: #374151; text-align: right;">₹${(Number(item.price) || 0).toLocaleString("en-IN")}</td>
        </tr>
      `
    )
    .join("");

  return `
    <table style="border-collapse: collapse; width: 100%; font-family: Arial, sans-serif; margin-top: 10px; border-radius: 8px; overflow: hidden; border: 1px solid #e5e7eb;">
      <thead>
        <tr style="background: #f9fafb;">
          <th style="padding: 12px; text-align: left; border: 1px solid #e5e7eb; color: #065f46; font-size: 13px; text-transform: uppercase;">Product</th>
          <th style="padding: 12px; text-align: center; border: 1px solid #e5e7eb; color: #065f46; font-size: 13px; text-transform: uppercase;">Qty</th>
          <th style="padding: 12px; text-align: right; border: 1px solid #e5e7eb; color: #065f46; font-size: 13px; text-transform: uppercase;">Price</th>
        </tr>
      </thead>
      <tbody>${formattedItems}</tbody>
    </table>
  `;
};

const generateAddressBlock = (address) => {
  if (!address) return `<p style="margin:0; color: #6b7280; font-style: italic;">No address provided</p>`;
  
  if (typeof address === 'object') {
    return `
      <div style="color: #4b5563; line-height: 1.5;">
        <p style="margin:0;">${address.line1 || ""}</p>
        ${address.line2 ? `<p style="margin:0;">${address.line2}</p>` : ""}
        <p style="margin:0;">${address.city || ""}, ${address.state || ""} ${address.postalCode || ""}</p>
        <p style="margin:0;">${address.country || ""}</p>
      </div>
    `;
  }
  return `<p style="margin:0; color: #4b5563;">${address}</p>`;
};

export const sendOrderEmails = async ({ order }) => {
  const orderTable = generateOrderTable(order.items);
  const addressBlock = generateAddressBlock(order.shipping_address || order.shippingAddress || order.address);

  const ownerHtml = `
    <h2 style="font-family: 'Cormorant Garamond', serif; color:#065f46;">New Achyutam Organics Order</h2>
    <p>A new order has been placed on Achyutam Organics.</p>
    <p><strong>Customer:</strong> ${order.customer.name}</p>
    <p><strong>Email:</strong> ${order.customer.email}</p>
    <p><strong>Phone:</strong> ${order.customer.phone}</p>
    <p><strong>Order ID:</strong> ${order.displayId || order.razorpayOrderId}</p>
    <p><strong>Razorpay Order:</strong> ${order.razorpayOrderId || "N/A (Cash on Delivery)"}</p>
    <p><strong>Payment ID:</strong> ${order.razorpayPaymentId || (order.payment_method === 'COD' ? "Cash on Delivery" : "Pending")}</p>
    <p><strong>Payment Method:</strong> ${order.payment_method || (order.razorpayOrderId ? "Online" : "Unknown")}</p>
    <h3 style="margin-top:24px;">Items</h3>
    ${orderTable}
    <p style="margin-top:24px;"><strong>Total:</strong> ₹${order.amount.toLocaleString("en-IN")}</p>
    <h3 style="margin-top:24px;">Shipping Address</h3>
    ${addressBlock}
  `;

  const customerHtml = `
    <h2 style="font-family: 'Cormorant Garamond', serif; color:#065f46;">Thank you for your order!</h2>
    <p>Hello ${order.customer.name},</p>
    <p>We're delighted to confirm your Achyutam Organics order. Our team will begin preparing your fresh dairy products.</p>
    <p><strong>Order ID:</strong> #${order.displayId || order.razorpayOrderId}</p>
    <h3 style="margin-top:24px;">Your Selection</h3>
    ${orderTable}
    <p style="margin-top:24px;"><strong>Total paid:</strong> ₹${order.amount.toLocaleString("en-IN")}</p>
    <h3 style="margin-top:24px;">Shipping Address</h3>
    ${addressBlock}
    <p style="margin-top:24px;">We'll send a dispatch update as soon as your products leave our farm.</p>
    <p style="margin-top:16px;">With purity,<br/>Achyutam Organics</p>
  `;

  await Promise.all([
    sendMail({ to: (process.env.OWNER_EMAIL || "saritaagarwal287@gmail.com"), subject: "New Achyutam Organics Order", html: ownerHtml }),
    sendMail({ to: order.customer.email, subject: "Your Achyutam Organics order is confirmed", html: customerHtml }),
  ]);
};

export const sendStatusUpdateEmail = async ({ email, customerName, status, orderId, trackingNumber, trackingUrl, items, address, totalAmount }) => {
  const statusMessages = {
    Confirmed: "Great news! Your organic order has been confirmed and is now being prepared using traditional methods.",
    Shipped: `Your farm-fresh products are on their way! They've officially left our Katni farm.`,
    "Out for Delivery": "Your Achyutam Organics package is out for delivery! Our courier partner will be reaching you shortly.",
    Delivered: "The wait is over! Your Achyutam Organics products have been delivered. We hope they bring health and purity to your home.",
    Cancelled: "Your order has been cancelled as requested or due to processing issues. If this was a mistake, please reach out.",
  };

  const message = statusMessages[status] || `Your order status has been updated to ${status}.`;

  const orderTable = items ? generateOrderTable(items) : "";
  const addressBlock = address ? generateAddressBlock(address) : "";

  let trackingBlock = "";
  if ((status === 'Shipped' || status === 'Out for Delivery') && (trackingNumber || trackingUrl)) {
    trackingBlock = `
      <div style="margin-top: 20px; padding: 15px; background-color: #f0fdf4; border-left: 4px solid #10b981; border-radius: 4px;">
        <h4 style="margin: 0 0 10px 0; color: #065f46;">Tracking Information</h4>
        ${trackingNumber ? `<p style="margin: 5px 0; color: #374151;"><strong>Tracking ID:</strong> ${trackingNumber}</p>` : ""}
        ${trackingUrl ? `<p style="margin: 5px 0;"><a href="${trackingUrl}" style="color: #059669; font-weight: bold; text-decoration: underline;">Track your package here &rarr;</a></p>` : ""}
      </div>
    `;
  }

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #f0f0f0; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
      <div style="background: linear-gradient(135deg, #065f46 0%, #059669 100%); padding: 32px 24px; text-align: center;">
        <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-family: 'Cormorant Garamond', serif;">Achyutam Organics</h1>
      </div>
      <div style="padding: 24px; color: #374151; line-height: 1.6;">
        <h2 style="color: #065f46; margin-top: 0;">Order Update: ${status}</h2>
        <p>Dear ${customerName},</p>
        <p>${message}</p>
        ${trackingBlock}

        <div style="margin-top: 32px; border-top: 1px solid #f0f0f0; padding-top: 24px;">
           <h3 style="color: #065f46; font-size: 18px; margin-bottom: 12px;">Order Summary</h3>
           <div style="background: #f9fafb; padding: 16px; border-radius: 8px; margin-bottom: 20px;">
              <p style="margin: 0; font-size: 14px; color: #374151;"><strong>Order ID:</strong> #${orderId}</p>
              <p style="margin: 4px 0 0; font-size: 14px; color: #374151;"><strong>Current Status:</strong> <span style="color: #059669; font-weight: bold;">${status}</span></p>
           </div>
           
           ${items ? `
             <h4 style="color: #065f46; margin: 20px 0 10px 0;">Items Ordered</h4>
             ${orderTable}
             ${totalAmount ? `<p style="text-align: right; margin-top: 12px; font-size: 16px;"><strong>Total:</strong> ₹${totalAmount.toLocaleString("en-IN")}</p>` : ""}
           ` : ""}

           ${address ? `
             <h4 style="color: #065f46; margin: 24px 0 10px 0;">Delivery Address</h4>
             <div style="background: #ffffff; border: 1px solid #e5e7eb; padding: 16px; border-radius: 8px;">
               ${addressBlock}
             </div>
           ` : ""}
        </div>

        <p style="margin-top: 32px; font-size: 14px; color: #6b7280;">If you have any questions, simply reply to this email or reach out to us on WhatsApp.</p>
        <p style="margin-top: 32px; border-top: 1px solid #f0f0f0; padding-top: 20px;">Purity in every drop,<br/><strong>Team Achyutam Organics</strong></p>
      </div>
    </div>
  `;

  await sendMail({
    to: email,
    subject: `Update on your Achyutam Organics Order #${orderId}: ${status}`,
    html
  });
};

export const sendLowStockEmail = async ({ productName, productId, remainingStock }) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px;">
      <div style="background-color: #f0fdf4; padding: 24px; text-align: center; border-bottom: 1px solid #e2e8f0;">
        <h2 style="margin: 0; color: #065f46;">Low Stock Alert</h2>
      </div>
      <div style="padding: 24px;">
        <p><strong>Item:</strong> ${productName}</p>
        <p><strong>ID:</strong> ${productId}</p>
        <p><strong>Remaining Quantity:</strong> <span style="font-size: 18px; font-weight: bold; color: #065f46;">${remainingStock}</span></p>
        <p>Please restock this item soon to avoid running out of inventory.</p>
        <div style="margin-top: 24px; text-align: center;">
          <a href="#" style="background-color: #065f46; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px;">Manage Inventory</a>
        </div>
      </div>
    </div>
  `;

  await sendMail({
    to: (process.env.OWNER_EMAIL || "saritaagarwal287@gmail.com"),
    subject: `Running Low: ${productName}`,
    html
  });
};
