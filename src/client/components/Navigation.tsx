import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, ChevronRight, ShoppingBag } from "lucide-react";
import { useCart } from "@/context/cart";
import { cn } from "@/lib/utils";
import logoMain from "@/assets/logo_main.png";

const Navigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { totalQuantity } = useCart();
  const hasCartItems = totalQuantity > 0;
  const displayQuantity = totalQuantity > 99 ? "99+" : totalQuantity.toString();

  const isActive = (path: string) => location.pathname === path;

  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const isHome = location.pathname === "/";
  const isTransparent = isHome && !isScrolled;

  const links = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/products", label: "Products" },
    { href: "/faq", label: "FAQ" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <header 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isTransparent 
          ? "bg-transparent border-transparent" 
          : "bg-background/95 backdrop-blur-xl border-b border-border/50 shadow-sm"
      )}
    >
      <nav className="container mx-auto px-4 py-3 flex items-center justify-between md:relative">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => {
              navigate("/");
            }}
            className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-md flex items-center"
          >
            <img src={logoMain} alt="Achyutam Organics" className="h-12 md:h-16 w-auto" />
          </button>
        </div>

        <div className="hidden md:flex items-center gap-8 md:absolute md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2">
          {links.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              onClick={(e) => {
                if (isActive(link.href)) {
                  e.preventDefault();
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }
              }}
              className={cn(
                "text-sm font-lato tracking-wide transition-colors hover:text-accent",
                isActive(link.href) ? "text-accent font-bold" : "text-muted-foreground"
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label={`View cart${hasCartItems ? ` with ${totalQuantity} item${totalQuantity === 1 ? "" : "s"}` : ""}`}
            className={cn(
              "flex items-center gap-3 px-5 py-3 rounded-full shadow-soft border border-blue-400/30 backdrop-blur-md",
              "transition-all duration-300 hover:shadow-glow hover:-translate-y-0.5 active:scale-95 focus-visible:outline-none focus-visible:ring-blue-500",
              "text-primary hover:text-primary/80",
              "md:bg-blue-500 md:text-white md:hover:bg-blue-600"
            )}
            onClick={() => {
              setIsMobileMenuOpen(false);
              navigate("/cart");
            }}
          >
            <ShoppingBag className="h-5 w-5" />
            <span className="text-sm font-lato font-semibold hidden md:block">View Cart</span>
            {hasCartItems && (
              <span className="absolute -top-1 -right-1 min-w-[1.5rem] h-6 px-2 rounded-full bg-red-500 text-white text-xs font-lato font-bold flex items-center justify-center shadow-lg border-2 border-white">
                {displayQuantity}
              </span>
            )}
          </button>

          <button
            type="button"
            aria-expanded={isMobileMenuOpen}
            aria-label="Toggle menu"
            className={cn(
              "inline-flex h-11 w-11 items-center justify-center rounded-xl",
              "text-foreground border border-foreground/20 backdrop-blur-md",
              "transition-all hover:shadow-glow hover:-translate-y-0.5 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground md:hidden",
              "animate-menu-bounce"
            )}
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {isMobileMenuOpen ? (
        <div className="md:hidden fixed inset-0 z-40">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div
            className={cn(
              "absolute left-0 right-0 top-[64px]",
              "mx-4 rounded-3xl border border-white/40 bg-background/95 backdrop-blur-xl shadow-glow",
              "origin-top translate-y-0 animate-in fade-in-0 zoom-in-95"
            )}
          >
            <div className="h-1.5 w-16 rounded-full bg-accent mx-auto mt-4" />
            <div className="px-4 py-4 space-y-2">
              {links.map((link, index) => (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={(e) => {
                    if (isActive(link.href)) {
                      e.preventDefault();
                      setIsMobileMenuOpen(false);
                    }
                  }}
                  className={cn(
                    "flex items-center justify-between rounded-xl px-3 py-4 transition-colors",
                    isActive(link.href)
                      ? "text-accent font-bold bg-accent/10 border border-accent/20"
                      : "text-muted-foreground hover:text-accent hover:bg-accent/10"
                  )}
                >
                  <span className="text-base font-lato tracking-wide">{link.label}</span>
                  <ChevronRight className="h-4 w-4 opacity-70" />
                </Link>
              ))}
            </div>
            
            {/* Close Button */}
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              aria-label="Close menu"
            >
              <X className="h-6 w-6 text-foreground" />
            </button>
          </div>
        </div>
      ) : null}
    </header>
  );
};

export default Navigation;
