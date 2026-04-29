import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://eaofxanagjidpvfinavr.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVhb2Z4YW5hZ2ppZHB2ZmluYXZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY5OTIyNTUsImV4cCI6MjA5MjU2ODI1NX0.jF2nnUKbPhWxU62MTCyYo-D9QiX1dzBWiDWyU90IDts";

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey
);
