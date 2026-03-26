import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config();

const {
  SMTP_HOST,
  SMTP_PORT,
  SMTP_USER,
  SMTP_PASS,
  OWNER_EMAIL,
  EMAIL_FROM
} = process.env;

const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: Number(SMTP_PORT),
  secure: Number(SMTP_PORT) === 465,
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS, // Directly use it
  },
  tls: {
    rejectUnauthorized: false
  }
});

async function test() {
  try {
    console.log("Verifying connection...");
    await transporter.verify();
    console.log("✅ SMTP Connection Verified!");

    console.log("Sending test mail to:", OWNER_EMAIL);
    const info = await transporter.sendMail({
      from: EMAIL_FROM || SMTP_USER,
      to: OWNER_EMAIL,
      subject: "Achyutam Organics - SMTP Test",
      text: "If you received this, your SMTP settings are working perfectly!",
      html: "<h3>SMTP Test Successful</h3><p>If you received this, your SMTP settings are working perfectly!</p>"
    });
    console.log("✅ Email sent successfully!", info.messageId);
  } catch (err) {
    console.error("❌ SMTP Error:", err);
    process.exit(1);
  }
}

test();
