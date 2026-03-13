import { Link } from "react-router-dom";
import { Instagram, Facebook } from "lucide-react";
import logoMain from "@/assets/logo_main.png";

const Footer = () => {
  return (
    <footer className="bg-footer-yellow border-t border-slate-200 py-12">
      <div className="container mx-auto px-4">
        {/* Main Footer Content */}
        <div className="flex flex-col lg:flex-row items-start justify-between gap-8">
          {/* Brand Section */}
          <div className="w-full lg:w-auto text-center lg:text-left">
            <Link to="/" className="flex items-center justify-center lg:justify-start mb-4">
              <img src={logoMain} alt="Achyutam Organics" className="h-14 w-auto" />
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs mx-auto lg:mx-0 transition-colors hover:text-foreground">
              Creating the finest Organic Desi Ghee and creamy milk straight from our farm to your home.
            </p>
          </div>

          {/* Navigation Links */}
          <div className="w-full lg:w-auto flex flex-col items-center lg:items-start">
            <h3 className="font-lato font-bold mb-4 text-foreground">Quick Links</h3>
            <div className="flex flex-col lg:flex-row items-center lg:items-start gap-4 lg:gap-6">
              <Link
                to="/"
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Home
              </Link>
              <Link
                to="/about"
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                About
              </Link>
              <Link
                to="/products"
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Products
              </Link>
              <Link
                to="/contact"
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Contact
              </Link>
            </div>
          </div>

          {/* Social Links */}
          <div className="w-full lg:w-auto flex flex-col items-center lg:items-start">
            <h3 className="font-lato font-bold mb-4 text-foreground">Follow Us</h3>
            <div className="flex items-center gap-4">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left pt-8 border-t border-border/60">
          <div>
            <h4 className="font-lato font-bold mb-2">Our Location</h4>
            <p className="text-sm text-muted-foreground">Katni, Madhya Pradesh 483501, India</p>
          </div>
          <div>
            <h4 className="font-lato font-bold mb-2">Contact Us</h4>
            <p className="text-sm text-muted-foreground mb-1">
              <a href="tel:+919425156801" className="hover:text-primary transition-colors">+91 94251 56801</a>
            </p>
            <p className="text-sm text-muted-foreground">
              <a href="mailto:saritaagarwal287@gmail.com" className="hover:text-primary transition-colors">saritaagarwal287@gmail.com</a>
            </p>
          </div>
          <div>
            <h4 className="font-lato font-bold mb-2">Business Hours</h4>
            <p className="text-sm text-muted-foreground">Mon-Sat: 9AM - 6PM</p>
            <p className="text-sm text-muted-foreground">Sunday: Closed</p>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="mt-12 pt-6 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4 text-center">
          <p className="text-xs text-muted-foreground order-2 md:order-1">
            &copy; {new Date().getFullYear()} Achyutam Organics. All rights reserved.
          </p>
          <div className="flex gap-6 order-3 md:order-2">
            <Link to="/terms-and-conditions" className="text-xs text-muted-foreground hover:text-primary transition-colors">
              Terms & Conditions
            </Link>
            <Link to="/privacy-policy" className="text-xs text-muted-foreground hover:text-primary transition-colors">
              Privacy Policy
            </Link>
          </div>
          <a
            href="https://www.zyradigitals.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-muted-foreground hover:text-primary transition-colors order-1 md:order-3"
          >
            Made with by Zyra Digitals
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
