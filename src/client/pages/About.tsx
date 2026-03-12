import heroFarm from "@/assets/hero-farm.jpg";
import heroGhee from "@/assets/ghee-hero.jpg";
import bilonaProcess from "@/assets/bilona-process.jpg";
import SEO from "@/components/SEO";
import { Shield, Leaf, Award, Users } from "lucide-react";

const About = () => {
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
        "name": "About",
        "item": "https://achyutamorganics.com/about"
      }
    ]
  };

  return (
    <main className="min-h-screen">
      <SEO
        title="About Us | Achyutam Organics"
        description="Learn about Achyutam Organics' journey from farm to home. Discover our commitment to traditional dairy products."
        canonicalUrl="/about"
        schemas={[breadcrumbSchema]}
      />
      
      {/* Hero Section */}
      <section className="relative h-[60vh] md:h-[80vh] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroFarm})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/60 to-background" />
        </div>
        <div className="relative z-10 h-full flex items-center justify-center px-4">
            <h1 className="font-playfair text-4xl md:text-6xl text-center animate-fade-in leading-tight">
            Nurtured by Nature,
            <br />
            <span className="text-primary">Delivered with Care</span>
          </h1>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-24 px-4 bg-secondary">
        <div className="container mx-auto max-w-4xl">
          <div className="space-y-8 animate-fade-in transition-transform duration-500 hover:-translate-y-1">
            <div>
              <h2 className="font-playfair text-3xl md:text-5xl mb-6 text-center">
                Our Journey
              </h2>
              <div className="w-24 h-1 bg-accent mx-auto rounded-full mb-8" />
            </div>
            <p className="text-lg text-foreground/90 leading-relaxed text-center">
              Achyutam Organics is a small organic dairy brand based in Katni, Madhya Pradesh. We focus on producing traditional Indian dairy products, especially Desi Cow Ghee made using natural and ancient methods.
            </p>
            <p className="text-lg text-foreground/90 leading-relaxed text-center">
              Our farm-to-home concept ensures that every product reaching your table is fresh, pure, and full of natural nutrition. We believe in the healing power of traditional food, prepared the way nature intended.
            </p>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 px-4 bg-background">
        <div className="container mx-auto max-w-6xl">
          <h2 className="font-playfair text-3xl md:text-5xl mb-4 text-center">
            Our Core Values
          </h2>
          <div className="w-24 h-1 bg-accent mx-auto rounded-full mb-16" />
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center animate-fade-in rounded-2xl border border-border/40 bg-card px-6 py-10 shadow-soft hover:shadow-glow hover-lift transition-all duration-500" style={{ animationDelay: "100ms" }}>
              <div className="w-16 h-16 bg-accent rounded-full mx-auto mb-6 flex items-center justify-center">
                <Shield className="w-8 h-8 text-primary-foreground" />
              </div>
              <h3 className="font-playfair text-xl mb-3">
                Quality First
              </h3>
              <p className="text-muted-foreground">
                Every product is carefully crafted to maintain the highest standards of purity and nutrition.
              </p>
            </div>
            <div className="text-center animate-fade-in rounded-2xl border border-border/40 bg-card px-6 py-10 shadow-soft hover:shadow-glow hover-lift transition-all duration-500" style={{ animationDelay: "200ms" }}>
              <div className="w-16 h-16 bg-accent rounded-full mx-auto mb-6 flex items-center justify-center">
                <Leaf className="w-8 h-8 text-primary-foreground" />
              </div>
              <h3 className="font-playfair text-xl mb-3">
                Natural & Pure
              </h3>
              <p className="text-muted-foreground">
                We use only natural ingredients and traditional methods without any artificial additives.
              </p>
            </div>
            <div className="text-center animate-fade-in rounded-2xl border border-border/40 bg-card px-6 py-10 shadow-soft hover:shadow-glow hover-lift transition-all duration-500" style={{ animationDelay: "300ms" }}>
              <div className="w-16 h-16 bg-accent rounded-full mx-auto mb-6 flex items-center justify-center">
                <Award className="w-8 h-8 text-primary-foreground" />
              </div>
              <h3 className="font-playfair text-xl mb-3">
                Trusted by Thousands
              </h3>
              <p className="text-muted-foreground">
                Our growing community of happy customers trusts us for their daily dairy needs.
              </p>
            </div>
            <div className="text-center animate-fade-in rounded-2xl border border-border/40 bg-card px-6 py-10 shadow-soft hover:shadow-glow hover-lift transition-all duration-500" style={{ animationDelay: "400ms" }}>
              <div className="w-16 h-16 bg-accent rounded-full mx-auto mb-6 flex items-center justify-center">
                <Users className="w-8 h-8 text-primary-foreground" />
              </div>
              <h3 className="font-playfair text-xl mb-3">
                Community First
              </h3>
              <p className="text-muted-foreground">
                We prioritize our customers and community in everything we do.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-24 px-4 bg-secondary">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in">
              <h2 className="font-playfair text-3xl md:text-4xl mb-6">
                Our Mission
              </h2>
              <div className="w-24 h-1 bg-accent rounded-full mb-8" />
              <p className="text-lg text-foreground/90 leading-relaxed mb-6">
                To bring back the purity of traditional dairy products to modern homes, using ancient wisdom and sustainable practices that honor both nature and health.
              </p>
              <p className="text-lg text-foreground/90 leading-relaxed mb-6">
                We believe that everyone deserves access to pure, unadulterated dairy products that nourish the body and soul.
              </p>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-accent rounded-full"></div>
                  <span className="text-muted-foreground">100% Organic and Natural</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-accent rounded-full"></div>
                  <span className="text-muted-foreground">Traditional Bilona Method</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-accent rounded-full"></div>
                  <span className="text-muted-foreground">Farm-to-Home Delivery</span>
                </div>
              </div>
            </div>
            <div className="animate-fade-in lg:order-2">
              <div className="bg-background rounded-2xl p-8 text-center shadow-soft border border-border/40">
                <div className="text-6xl font-bold text-accent mb-4">5000+</div>
                <div className="text-lg font-playfair mb-2 text-foreground font-semibold">Happy Families</div>
                <div className="text-muted-foreground">Trusting us daily for their dairy needs</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-24 px-4 bg-background">
        <div className="container mx-auto max-w-6xl">
          <h2 className="font-playfair text-3xl md:text-5xl mb-4 text-center">
            Our Process
          </h2>
          <div className="w-24 h-1 bg-accent mx-auto rounded-full mb-16" />
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center animate-fade-in">
              <div className="w-20 h-20 bg-accent/20 rounded-full mx-auto mb-6 flex items-center justify-center">
                <span className="text-2xl font-bold text-foreground">1</span>
              </div>
              <h3 className="font-playfair text-xl font-semibold mb-3">
                Sourcing
              </h3>
              <p className="text-muted-foreground">
                We source milk from our own farm and trusted local farmers who follow organic practices.
              </p>
            </div>
            <div className="text-center animate-fade-in" style={{ animationDelay: "200ms" }}>
              <div className="w-20 h-20 bg-accent/20 rounded-full mx-auto mb-6 flex items-center justify-center">
                <span className="text-2xl font-bold text-foreground">2</span>
              </div>
              <h3 className="font-playfair text-xl font-semibold mb-3">
                Processing
              </h3>
              <p className="text-muted-foreground">
                Using traditional Bilona method, we hand-churn and slow-cook to preserve nutrients.
              </p>
            </div>
            <div className="text-center animate-fade-in" style={{ animationDelay: "400ms" }}>
              <div className="w-20 h-20 bg-accent/20 rounded-full mx-auto mb-6 flex items-center justify-center">
                <span className="text-2xl font-bold text-foreground">3</span>
              </div>
              <h3 className="font-playfair text-xl font-semibold mb-3">
                Delivery
              </h3>
              <p className="text-muted-foreground">
                Fresh products are carefully packaged and delivered directly to your doorstep.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 bg-secondary">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="font-playfair text-3xl md:text-4xl mb-6">
            Join Our Community
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Experience the difference of pure, traditional dairy products. Start your journey to healthier living today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/products" className="rounded-full px-8 py-4 text-sm sm:text-base font-semibold bg-primary text-white hover:shadow-glow hover:scale-[1.02] transition-transform text-center">
              Shop Products
            </a>
            <a href="/contact" className="rounded-full px-8 py-4 text-sm sm:text-base font-semibold border-2 border-accent text-accent hover:bg-accent hover:text-accent-foreground transition-all duration-300 text-center">
              Contact Us
            </a>
          </div>
        </div>
      </section>

      {/* Quote Section */}
      <section className="py-24 px-4 bg-secondary/20">
        <div className="container mx-auto max-w-3xl text-center animate-fade-in">
          <blockquote className="font-playfair text-2xl md:text-3xl italic font-light text-foreground mb-6 transition-transform duration-500 hover:scale-[1.02] leading-relaxed">
            "Pure ghee is not just food;
            <br />
            it is the essence of health and vitality."
          </blockquote>
          <div className="w-16 h-1 bg-accent mx-auto rounded-full" />
        </div>
      </section>
    </main>
  );
};

export default About;
