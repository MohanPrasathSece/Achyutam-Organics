import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const [loading, setLoading] = useState(true);
    const [authenticated, setAuthenticated] = useState(false);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                // Try Supabase session first
                const { data: { session } } = await supabase.auth.getSession();
                
                if (session) {
                    setAuthenticated(true);
                } else {
                    // Fallback to environment variable check for development
                    const adminEmail = import.meta.env.VITE_ADMIN_EMAIL || import.meta.env.ADMIN_EMAIL;
                    const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD || import.meta.env.ADMIN_PASSWORD;
                    const hasDevSession = localStorage.getItem("achyutam_admin_dev_session") === "true";
                    
                    // Check if admin credentials are configured and logged in
                    if (adminEmail && adminPassword && hasDevSession) {
                        setAuthenticated(true); // Allow access for development
                    }
                }
            } catch (error) {
                console.error("Auth check error:", error);
                // Fallback to environment variable check
                const adminEmail = import.meta.env.VITE_ADMIN_EMAIL || import.meta.env.ADMIN_EMAIL;
                const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD || import.meta.env.ADMIN_PASSWORD;
                const hasDevSession = localStorage.getItem("achyutam_admin_dev_session") === "true";
                
                if (adminEmail && adminPassword && hasDevSession) {
                    setAuthenticated(true);
                }
            }
            setLoading(false);
        };

        checkAuth();

        // Listen for Supabase auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session) {
                setAuthenticated(true);
            } else {
                const hasDevSession = localStorage.getItem("achyutam_admin_dev_session") === "true";
                setAuthenticated(hasDevSession);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    if (loading) {
        return <div className="flex h-screen items-center justify-center font-lato text-2xl text-emerald-800 animate-pulse">Verifying Achyutam Organics credentials...</div>;
    }

    if (!authenticated) {
        return <Navigate to="/admin/login" replace />;
    }

    return <>{children}</>;
};
