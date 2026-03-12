import { useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import Sidebar from "@/components/admin/Sidebar";
import ProductManagement from "@/components/admin/ProductManagement";
import OrderManagement from "@/components/admin/OrderManagement";
import DashboardOverview from "@/components/admin/DashboardOverview";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const handleLogout = async () => {
        try {
            // Try Supabase logout first
            await supabase.auth.signOut();
        } catch (error) {
            // Ignore Supabase errors, continue with navigation
            console.log("Supabase logout not available");
        }
        // Clear dev session token
        localStorage.removeItem("achyutam_admin_dev_session");
        navigate("/admin/login");
    };

    return (
        <div className="flex min-h-screen bg-slate-50 font-lato admin-portal">
            <Sidebar
                onLogout={handleLogout}
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
            />
            <div className="flex-1 p-4 md:p-8 w-full max-w-[100vw] overflow-x-hidden">
                <header className="mb-6 md:mb-8 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="md:hidden text-slate-600 -ml-2"
                            onClick={() => setSidebarOpen(true)}
                        >
                            <Menu className="w-6 h-6" />
                        </Button>
                        <h1 className="text-2xl md:text-4xl font-bold text-slate-800">Dashboard</h1>
                    </div>
                    <div className="text-xs md:text-sm font-medium text-emerald-600 text-right">
                        <span className="hidden sm:inline">Achyutam Organics Management</span>
                        <span className="sm:hidden">Achyutam</span>
                    </div>
                </header>

                <Routes>
                    <Route path="/" element={<DashboardOverview />} />
                    <Route path="/products" element={<ProductManagement />} />
                    <Route path="/orders" element={<OrderManagement />} />
                </Routes>
            </div>
        </div>
    );
};

export default AdminDashboard;
