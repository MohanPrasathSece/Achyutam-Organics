import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
                    navigate("/admin-portal");
                } else {
                    throw new Error("Invalid credentials");
                }
            } else {
                toast({
                    title: "Welcome, Admin",
                    description: "Successfully logged in to Achyutam Organics portal.",
                });
                navigate("/admin-portal");
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
        <div className="flex min-h-screen font-manrope admin-portal bg-white overflow-hidden">
            {/* Left Side - Image Landing */}
            <div className="hidden lg:flex lg:w-1/2 relative bg-emerald-900 items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-black/40 z-10" />
                <div className="absolute inset-0 bg-emerald-950 opacity-60 z-0" />
                <img
                    src="https://images.unsplash.com/photo-1546501669-79a838be8196?auto=format&fit=crop&q=80"
                    alt="Achyutam Farm"
                    className="absolute inset-0 w-full h-full object-cover opacity-50 z-0"
                />
                <div className="relative z-20 text-center text-white p-12 max-w-lg">
                    <div className="w-24 h-24 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mx-auto mb-8 border border-white/20 shadow-2xl overflow-hidden p-4">
                        <span className="text-xl font-playfair font-bold text-white text-center leading-tight">Achyutam<br />Organics</span>
                    </div>
                    <h2 className="text-4xl font-playfair font-bold mb-6 tracking-wide">Farm Management</h2>
                    <p className="text-lg text-white/80 leading-relaxed font-light border-t border-white/10 pt-6">
                        "Purity in every drop, tradition in every jar."
                    </p>
                </div>

                <Link
                    to="/"
                    className="absolute top-8 left-8 z-30 flex items-center gap-3 text-white/70 hover:text-white transition-all bg-black/20 hover:bg-black/50 px-5 py-2.5 rounded-full backdrop-blur-md border border-white/10 text-sm font-medium group"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Back to Store
                </Link>
            </div>

            {/* Right Side - Login Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-12 relative bg-gradient-to-br from-emerald-50/50 to-slate-50/50">
                <Link
                    to="/"
                    className="absolute top-6 left-6 lg:hidden flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Store
                </Link>

                <div className="w-full max-w-md space-y-8">
                    <div className="text-center lg:text-left">
                        <h1 className="text-3xl font-bold text-slate-900 mb-2 font-playfair">Admin Portal</h1>
                        <p className="text-slate-500">Secure access for Achyutam Organics management.</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6 mt-8">
                        <div className="space-y-2">
                            <Label htmlFor="email" className="font-bold text-slate-700">Admin Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="saritaagarwal287@gmail.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="rounded-xl border-slate-200 focus:ring-emerald-500 h-12 bg-white/80 backdrop-blur-sm"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password" className="font-bold text-slate-700">Security Key</Label>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="rounded-xl border-slate-200 focus:ring-emerald-500 h-12 bg-white/80 backdrop-blur-sm"
                                required
                            />
                        </div>

                        <Button
                            type="submit"
                            className="w-full rounded-xl bg-emerald-700 text-white hover:bg-emerald-800 h-12 transition-all font-bold tracking-wide mt-4 shadow-lg hover:shadow-emerald-100"
                            disabled={loading}
                        >
                            {loading ? "Authenticating..." : "Access Dashboard"}
                        </Button>
                    </form>

                    <div className="pt-8 mt-8 border-t border-slate-200/60 text-center">
                        <p className="text-xs text-slate-400">
                            &copy; 2026 Achyutam Organics. <span className="hidden sm:inline">Protected by strict security protocols.</span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
