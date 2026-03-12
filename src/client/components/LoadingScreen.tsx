import { Loader2 } from "lucide-react";
import logoMain from "@/assets/logo_main.png";

const LoadingScreen = () => {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-50">
            <div className="flex flex-col items-center gap-6">
                <div className="relative flex flex-col items-center">
                    <img src={logoMain} alt="Achyutam Organics" className="h-24 w-auto animate-pulse" />
                    <div className="absolute inset-x-0 -bottom-4 h-1 bg-emerald-700/20 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-700 animate-loading-bar" style={{ width: '50%' }}></div>
                    </div>
                </div>
                <p className="text-sm font-medium tracking-[0.3em] text-emerald-800 animate-pulse uppercase mt-4">
                    Pure & Traditional
                </p>
            </div>
        </div>
    );
};

export default LoadingScreen;
