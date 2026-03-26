import { useState } from "react";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Mail, Phone, MapPin, Clock, MessageCircle } from "lucide-react";
import heroGhee from "@/assets/ghee-jar.jpg";

import { getApiUrl } from "@/lib/config";

const Contact = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const apiUrl = getApiUrl();
      const response = await fetch(`${apiUrl}/api/public/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to send message");
      }

      toast({
        title: "Message sent!",
        description: "Thank you for reaching out. We'll get back to you soon.",
      });
      setFormData({ name: "", email: "", message: "" });
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Something went wrong. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };


  const handleWhatsApp = () => {
    const message = encodeURIComponent(
      "Hi, I'd like to learn more about Achyutam Organics farm-fresh ghee and dairy."
    );
    // Placeholder WhatsApp number, user can update later
    window.open(`https://wa.me/919425156801?text=${message}`, "_blank");
  };

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "DairyFarm",
    "name": "Achyutam Organics",
    "image": "https://achyutamorganics.com/src/client/assets/ghee-hero.jpg",
    "@id": "https://achyutamorganics.com/#organization",
    "url": "https://achyutamorganics.com/contact",
    "telephone": "+91-9425156801",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Katni",
      "addressLocality": "Katni",
      "addressRegion": "MP",
      "postalCode": "483501",
      "addressCountry": "IN"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 23.8344,
      "longitude": 80.3894
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday"
      ],
      "opens": "09:00",
      "closes": "19:00"
    }
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://achyutamorganics.com/"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Contact",
        "item": "https://achyutamorganics.com/contact"
      }
    ]
  };

  return (
    <main className="min-h-screen pt-14 md:pt-16">
      <SEO
        title="Contact Us | Inquiry & Support"
        description="Have questions about our organic ghee or dairy products? Reach out to Achyutam Organics. We're here to help with orders and farm-fresh inquiries."
        canonicalUrl="/contact"
        schemas={[localBusinessSchema, breadcrumbSchema]}
      />
      {/* Banner Section */}
      <section className="relative h-[40vh] md:h-[50vh] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroGhee})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/50 to-black/70" />
        </div>
        <div className="relative z-10 h-full flex items-center justify-center px-4">
          <div className="text-center">
            <div className="bg-secondary border border-accent/20 rounded-full px-4 py-2 mb-4 inline-block">
              <span className="text-xs text-accent font-medium">Contact Us</span>
            </div>
            <h1 className="font-playfair text-4xl md:text-6xl mb-4 text-white">
              We're Here to Help
            </h1>
            <p className="text-base text-white/90 max-w-2xl mx-auto">
              Reach out with questions or orders.
            </p>
          </div>
        </div>
      </section>


      <section className="py-12 md:py-24 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-16">
            {/* Contact Form */}
            <div className="animate-fade-in">
              <h2 className="font-playfair text-3xl md:text-4xl mb-8">
                Send Us a Message
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6 rounded-2xl border border-border/40 bg-card p-6 md:p-8 shadow-soft transition-smooth hover:shadow-glow">
                <div>
                  <Label htmlFor="name" className="block text-base font-medium mb-2">
                    Name
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="w-full"
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <Label htmlFor="email" className="block text-base font-medium mb-2">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    className="w-full"
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <Label htmlFor="message" className="block text-base font-medium mb-2">
                    Message
                  </Label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    required
                    className="w-full min-h-[120px]"
                    placeholder="Tell us about your inquiry..."
                  />
                </div>

                <Button
                  type="submit"
                  size="sm"
                  disabled={isSubmitting}
                  className="w-full rounded-full px-6 py-3 md:px-8 md:py-4 text-base font-semibold bg-accent text-accent-foreground hover:shadow-glow hover:scale-[1.02] transition-transform disabled:opacity-50"
                >
                  {isSubmitting ? "Sending..." : "Send Message"}
                </Button>

              </form>
            </div>

            {/* Contact Information */}
            <div className="animate-fade-in space-y-8" style={{ animationDelay: "200ms" }}>
              <div>
                <h2 className="font-playfair text-3xl md:text-4xl mb-8">
                  Get in Touch
                </h2>
                
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <Phone className="w-6 h-6 text-accent" />
                    </div>
                    <div>
                      <h3 className="text-base mb-1">Phone</h3>
                      <p className="text-muted-foreground">+91 94251 56801</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <Mail className="w-6 h-6 text-accent" />
                    </div>
                    <div>
                      <p className="text-base mb-1">Email</p>
                      <p className="text-muted-foreground">saritaagarwal287@gmail.com</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-6 h-6 text-accent" />
                    </div>
                    <div>
                      <p className="text-base mb-4">Need Help?</p>
                      <p className="text-muted-foreground">
                        Katni, Madhya Pradesh 483501<br />
                        India
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <Clock className="w-6 h-6 text-accent" />
                    </div>
                    <div>
                      <h3 className="text-lg mb-1">Business Hours</h3>
                      <p className="text-muted-foreground">
                        Monday - Saturday: 9:00 AM - 6:00 PM<br />
                        Sunday: Closed
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-8">
                  <h3 className="text-lg mb-4">Quick Actions</h3>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button
                      onClick={handleWhatsApp}
                      size="sm"
                      className="flex-1 rounded-full px-4 py-2 md:px-6 md:py-3 text-base font-semibold bg-green-600 text-white hover:bg-green-700 transition-colors"
                    >
                      <MessageCircle className="w-3 h-3 mr-2" />
                      WhatsApp
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 rounded-full px-4 py-2 md:px-6 md:py-3 text-base font-semibold border-accent text-accent hover:bg-accent hover:text-accent-foreground transition-colors"
                    >
                      <Mail className="w-3 h-3 mr-2" />
                      Email
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-12 px-4 border-t border-border/40">
        <div className="container mx-auto max-w-6xl">
          <h2 className="font-playfair text-3xl md:text-4xl mb-8 text-center">
            Our Location
          </h2>
          <div className="bg-secondary rounded-xl overflow-hidden h-96 mb-8">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3674.3411019280456!2d80.3956795!3d23.8318882!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39810bb73e9e30a7%3A0x6b8f3689439f0eb0!2sKatni%2C%20Madhya%20Pradesh!5e0!3m2!1sen!2sin!4v1710123456789"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-full"
              title="Achyutam Organics Location"
            />
          </div>
          <div className="text-center text-muted-foreground">
            <p className="mb-2">
              <strong>Address:</strong> Katni, Madhya Pradesh 483501, India
            </p>
            <p>
              <strong>Delivery Areas:</strong> Fresh milk available in Katni, Ghee delivered all over India
            </p>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Contact;
