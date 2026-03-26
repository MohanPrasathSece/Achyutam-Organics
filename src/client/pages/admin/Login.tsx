import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import logoMain from "@/assets/logo_main.png";
import farmImg from "@/assets/farm imags/farm.png"; // High quality farm image
import gheeHero from "@/assets/ghee-hero.jpg"; // Alternative high quality image
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Lock, Mail, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

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
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) {
                const adminEmail = import.meta.env.VITE_ADMIN_EMAIL || import.meta.env.ADMIN_EMAIL;
                const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD || import.meta.env.ADMIN_PASSWORD;

                if (email === adminEmail && password === adminPassword) {
                    localStorage.setItem("achyutam_admin_dev_session", "true");
                    toast({ title: "Welcome, Admin", description: "Successfully logged in to Achyutam Organics portal." });
                    navigate("/admin");
                } else {
                    throw new Error("Invalid credentials");
                }
            } else {
                toast({ title: "Welcome, Admin", description: "Successfully logged in to Achyutam Organics portal." });
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
        <div className="min-h-screen flex flex-col md:flex-row bg-white font-lato overflow-hidden">
            {/* Left Section: Visual Experience */}
            <motion.div 
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="hidden md:flex md:w-1/2 lg:w-3/5 relative overflow-hidden bg-emerald-900"
            >
                <motion.img
                    initial={{ scale: 1.1 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 10, repeat: Infinity, repeatType: "reverse", ease: "linear" }}
                    src={farmImg}
                    alt="Achyutam Farm"
                    className="absolute inset-0 w-full h-full object-cover opacity-60 ml-[-5%]" // Subtle shift to focus on center
                />
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/90 via-emerald-900/40 to-transparent" />
                
                <div className="relative z-10 flex flex-col justify-end p-12 lg:p-20 text-white space-y-6">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.6 }}
                    >
                        <ShieldCheck className="w-16 h-16 text-emerald-400 mb-6 drop-shadow-glow" />
                        <h1 className="text-4xl lg:text-6xl font-bold font-lato leading-tight text-white drop-shadow-md">
                            Purity in every drop,<br />
                            <span className="text-emerald-300">Tradition</span> in every jar.
                        </h1>
                        <p className="text-xl text-white/90 max-w-lg mt-6 leading-relaxed font-medium">
                            Managing the journey of freshness from our farm to your home. 
                            Welcome to the Achyutam Organics Control Center.
                        </p>
                    </motion.div>
                    
                    <div className="pt-12 flex items-center gap-8 text-white/70 text-sm border-t border-white/20">
                        <div className="flex flex-col">
                            <span className="font-bold text-white text-lg font-cormorant italic underline decoration-emerald-500/50 decoration-2 underline-offset-4">100%</span>
                            <span className="text-white/80 font-medium">Pure Bilona Ghee</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="font-bold text-white text-lg font-cormorant italic underline decoration-emerald-500/50 decoration-2 underline-offset-4">Traditional</span>
                            <span className="text-white/80 font-medium">A2 Vedic Process</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="font-bold text-white text-lg font-cormorant italic underline decoration-emerald-500/50 decoration-2 underline-offset-4">Organic</span>
                            <span className="text-white/80 font-medium">Certified Farm</span>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Right Section: Login Form */}
            <div className="flex-1 flex flex-col justify-center items-center p-6 lg:p-12 relative bg-slate-50/50">
                {/* Back to Store Button */}
                <Link
                    to="/"
                    className="absolute top-8 right-8 z-20 flex items-center gap-2 text-slate-500 hover:text-emerald-700 transition-all font-medium group text-sm"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Back to Store
                </Link>

                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="w-full max-w-[420px] space-y-10"
                >
                    <div className="text-center space-y-4">
                        <motion.div 
                            whileHover={{ rotate: 5, scale: 1.05 }}
                            className="inline-block p-4 bg-white rounded-3xl shadow-soft border border-slate-100 cursor-pointer"
                        >
                            <img src={logoMain} alt="Achyutam Organics" className="w-20 h-auto" />
                        </motion.div>
                        <div className="space-y-2">
                            <h2 className="text-2xl font-bold text-slate-800">Admin Dashboard</h2>
                            <p className="text-slate-500 text-sm">Please sign in to manage your inventory and orders.</p>
                        </div>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-slate-600 font-semibold ml-1">Email Address</Label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="Enter your admin email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="pl-12 rounded-2xl border-slate-200 bg-white h-14 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all shadow-sm"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between ml-1">
                                <Label htmlFor="password" className="text-slate-600 font-semibold">Security Key</Label>
                                <span className="text-[10px] uppercase font-bold text-emerald-600 tracking-wider">High Security</span>
                            </div>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="Enter your security key"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="pl-12 rounded-2xl border-slate-200 bg-white h-14 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all shadow-sm"
                                    required
                                />
                            </div>
                        </div>

                        <Button
                            type="submit"
                            className="w-full rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white h-14 transition-all font-bold text-lg shadow-emerald-200 shadow-xl hover:shadow-emerald-300 active:scale-[0.98] disabled:opacity-70"
                            disabled={loading}
                        >
                            {loading ? (
                                <span className="flex items-center gap-2">
                                    <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                                    Security Check...
                                </span>
                            ) : (
                                "Sign In to Admin"
                            )}
                        </Button>
                    </form>

                    <footer className="text-center space-y-4">
                        <div className="flex items-center justify-center gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            <span className="w-8 h-[1px] bg-slate-200" />
                            Secure Access Only
                            <span className="w-8 h-[1px] bg-slate-200" />
                        </div>
                        <p className="text-xs text-slate-400 leading-relaxed">
                            Unauthorized access is strictly prohibited. <br />
                            A2 Vedic Quality Control System &copy; 2026 Achyutam Organics.
                        </p>
                    </footer>
                </motion.div>
            </div>
        </div>
    );
};

export default AdminLogin;
