import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Use mock data if Supabase is not configured
const useMockData = !supabaseUrl || !supabaseAnonKey || supabaseUrl === "your_supabase_url_here";

if (useMockData) {
    console.warn("Using mock data - Supabase credentials not configured. Please check your .env file.");
}

export const supabase = createClient(supabaseUrl || "https://placeholder.supabase.co", supabaseAnonKey || "placeholder-key", {
    realtime: {
        params: {
            eventsPerSecond: 2,
        },
    },
    global: {
        headers: {
            'x-application-name': 'achyutam-organics',
        },
    },
});

export { useMockData };
