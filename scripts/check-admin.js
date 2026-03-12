
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SECRET_KEY;

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

async function checkUser() {
  const email = process.env.ADMIN_EMAIL || "saritaagarwal287@gmail.com";
  console.log(`Checking user: ${email}`);
  
  const { data: { users }, error } = await supabaseAdmin.auth.admin.listUsers();
  
  if (error) {
    console.error("Error listing users:", error);
    return;
  }
  
  const user = users.find(u => u.email === email);
  if (user) {
    console.log("User found:");
    console.log(`ID: ${user.id}`);
    console.log(`Email Confirmed: ${!!user.email_confirmed_at}`);
    console.log(`Last Sign In: ${user.last_sign_in_at}`);
    console.log(`User Metadata:`, user.user_metadata);
    
    if (!user.email_confirmed_at) {
      console.log("Confirming user...");
      await supabaseAdmin.auth.admin.updateUserById(user.id, { email_confirm: true });
      console.log("User confirmed.");
    }
  } else {
    console.log("User NOT found in database.");
  }
}

checkUser();
