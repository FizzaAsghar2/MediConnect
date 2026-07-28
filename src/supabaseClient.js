import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://tsjrpfhypmcawqucozko.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRzanJwZmh5cG1jYXdxdWNvemtvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ4MDIyMDAsImV4cCI6MjEwMDM3ODIwMH0.jLVnoCHAwNslCcd1l7CykcONMdVLonIRVLR5dIY-J-g";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);