/**
 * Admin User Creation Script
 * 
 * This script creates the admin user in Supabase Auth using the service role key.
 * Run once: node scripts/create-admin.js
 */

import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
// Uses the secret/service role key (bypasses RLS and can create users)
const supabaseServiceKey = process.env.SUPABASE_SECRET_KEY;

const adminEmail    = process.env.ADMIN_EMAIL    || "saritaagarwal287@gmail.com";
const adminPassword = process.env.ADMIN_PASSWORD || "admin@2026achyutam";

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("❌ Missing VITE_SUPABASE_URL or SUPABASE_SECRET_KEY in .env");
  process.exit(1);
}

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function createAdminUser() {
  console.log("🔧 Achyutam Organics – Admin User Setup");
  console.log("=========================================");
  console.log(`📧 Email    : ${adminEmail}`);
  console.log(`🔐 Password : ${adminPassword}`);
  console.log("");

  // Check if user already exists by listing users
  const { data: listData, error: listError } = await supabaseAdmin.auth.admin.listUsers();

  if (listError) {
    console.error("❌ Failed to list users:", listError.message);
    process.exit(1);
  }

  const existingUser = listData.users.find((u) => u.email === adminEmail);

  if (existingUser) {
    console.log("ℹ️  Admin user already exists in Supabase Auth.");
    console.log(`   User ID   : ${existingUser.id}`);
    console.log(`   Created   : ${existingUser.created_at}`);
    console.log("");

    // Update password to keep it in sync with .env
    const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
      existingUser.id,
      { password: adminPassword }
    );

    if (updateError) {
      console.warn("⚠️  Could not sync password:", updateError.message);
    } else {
      console.log("✅ Password synced with .env credentials.");
    }
    return;
  }

  // Create new admin user
  const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email: adminEmail,
    password: adminPassword,
    email_confirm: true,           // Mark email as already confirmed
    user_metadata: {
      role: "admin",
      name: "Achyutam Admin",
    },
  });

  if (error) {
    console.error("❌ Failed to create admin user:", error.message);
    process.exit(1);
  }

  console.log("✅ Admin user created successfully!");
  console.log(`   User ID   : ${data.user.id}`);
  console.log(`   Email     : ${data.user.email}`);
  console.log(`   Confirmed : ${data.user.email_confirmed_at ? "Yes" : "No"}`);
  console.log("");
  console.log("🚀 You can now log in at: /admin-portal/login");
}

createAdminUser().catch((err) => {
  console.error("❌ Unexpected error:", err);
  process.exit(1);
});
