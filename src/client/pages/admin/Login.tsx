import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import logoMain from "@/assets/logo_main.png";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Sparkles } from "lucide-react";

const AdminLogin = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { toast } = useToast();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Try Supabase authentication first
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) {
                // Fallback to environment variable authentication for development
                const adminEmail = import.meta.env.VITE_ADMIN_EMAIL || import.meta.env.ADMIN_EMAIL;
                const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD || import.meta.env.ADMIN_PASSWORD;

                if (email === adminEmail && password === adminPassword) {
                    // Store dev session token
                    localStorage.setItem("achyutam_admin_dev_session", "true");
                    toast({
                        title: "Welcome, Admin",
                        description: "Successfully logged in to Achyutam Organics portal.",
                    });
                    navigate("/admin");
                } else {
                    throw new Error("Invalid credentials");
                }
            } else {
                toast({
                    title: "Welcome, Admin",
                    description: "Successfully logged in to Achyutam Organics portal.",
                });
                navigate("/admin");
            }
        } catch (error: any) {
            toast({
                title: "Access Denied",
                description: error.message || "Invalid credentials.",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-slate-50 flex items-center justify-center p-4 font-lato admin-portal">
            {/* Background Image Section */}
            <div className="absolute inset-0">
                <img
                    src="https://images.unsplash.com/photo-1546501669-79a838be8196?auto=format&fit=crop&q=80"
                    alt="Achyutam Farm"
                    className="absolute inset-0 w-full h-full object-cover opacity-30"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-white/90 to-slate-500/10" />
            </div>

            {/* Back to Store Button */}
            <Link
                to="/"
                className="absolute top-8 left-8 z-20 flex items-center gap-3 text-emerald-700 hover:text-emerald-900 transition-all bg-white/80 hover:bg-white px-6 py-3 rounded-full shadow-lg border border-emerald-200 text-sm font-medium group"
            >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                Back to Store
            </Link>

            {/* Main Login Card - Single Column */}
            <div className="relative z-10 w-full max-w-md bg-white/95 backdrop-blur-xl rounded-3xl border border-emerald-200 shadow-2xl overflow-hidden">
                <div className="p-8 lg:p-12">
                    <div className="text-center space-y-8">
                        <div className="w-24 h-24 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-3xl flex items-center justify-center mx-auto border border-emerald-300 shadow-xl overflow-hidden p-4">
                            <img src={logoMain} alt="Achyutam Organics" className="w-full h-auto" />
                        </div>
                        <div className="space-y-4">
                            <h2 className="text-3xl font-lato font-bold text-emerald-800 tracking-wide">Admin Portal</h2>
                            <div className="w-16 h-1 bg-gradient-to-r from-emerald-400 to-emerald-600 mx-auto rounded-full" />
                            <p className="text-lg text-emerald-700 leading-relaxed font-light">
                                Farm Management System
                            </p>
                            <p className="text-emerald-600 text-sm italic">
                                "Purity in every drop, tradition in every jar."
                            </p>
                        </div>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6 mt-8">
                        <div className="space-y-2">
                            <Label htmlFor="email" className="font-bold text-emerald-700">Admin Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="Enter your admin email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="rounded-xl border-emerald-200 bg-white/90 backdrop-blur-sm text-emerald-900 placeholder-emerald-400 focus:ring-emerald-500 focus:border-emerald-500 h-12"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password" className="font-bold text-emerald-700">Security Key</Label>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="rounded-xl border-emerald-200 bg-white/90 backdrop-blur-sm text-emerald-900 placeholder-emerald-400 focus:ring-emerald-500 focus:border-emerald-500 h-12"
                                placeholder="Enter your password"
                                required
                            />
                        </div>

                        <Button
                            type="submit"
                            className="w-full rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:from-emerald-600 hover:to-emerald-700 h-12 transition-all font-bold tracking-wide mt-4 shadow-lg hover:shadow-emerald-300/50 hover:scale-[1.02] border border-emerald-400"
                            disabled={loading}
                        >
                            {loading ? (
                                <span className="flex items-center gap-2">
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Authenticating...
                                </span>
                            ) : (
                                "Access Dashboard"
                            )}
                        </Button>
                    </form>

                    <div className="pt-6 mt-8 border-t border-emerald-200 text-center">
                        <p className="text-xs text-emerald-600">
                            &copy; 2026 Achyutam Organics. Protected by enterprise-grade security.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
