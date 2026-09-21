const SUPABASE_URL = "https://hufujvmjhduwfhsuypsi.supabase.co";

// Colle ici UNIQUEMENT ta clé sb_publishable_
const SUPABASE_KEY = "sb_publishable_sCoMU7Uz9UfiyGZDupIQkg_7R7zDTHV";

const supabaseClient = supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);

console.log("🟢 Supabase initialisé");