import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import ghee250 from "@/assets/ghee_product/ghee_250gm.jpeg";
import ghee500 from "@/assets/ghee_product/ghee_500ml.jpeg";
import ghee1kg from "@/assets/ghee_product/ghee_1kg.jpeg";
import gheeTexture from "@/assets/ghee-texture.jpg";
import freshMilk from "@/assets/fresh-milk.jpg";
import hero1 from "@/assets/new_hero_add_images/hero1.png";
import hero3 from "@/assets/new_hero_add_images/hero3.png";
import heroGhee from "@/assets/ghee-hero.jpg";
import bilonaProcess from "@/assets/bilona-churning.jpg";
import gheeJar from "@/assets/ghee-jar.jpg";
import gheePour from "@/assets/ghee-pour.jpg";
import gheeProduct from "@/assets/ghee-product.jpg";
import bilonaMethod from "@/assets/bilona-method.jpg";
import aboutProcess from "@/assets/about-process.jpg";
import bilonaProcessAlt from "@/assets/bilona-process.jpg";
import { Sparkles, ShieldCheck, Leaf } from "lucide-react";
import { cn } from "@/lib/utils";
import SEO from "@/components/SEO";
import FarmSection from "@/components/FarmSection";
import logoMain from "@/assets/logo_main.png";
import { supabase, useMockData } from "@/lib/supabase";


type FeaturedProduct = {
  id: number;
  name: string;
  price: string;
  image: string;
  category: string;
  deliveryInfo?: string;
  description?: string;
  weight?: number;
  unit?: string;
  shelfLife?: string;
  storage?: string;
  ingredients?: string[];
};

const products: FeaturedProduct[] = [
  { 
    id: 101, 
    name: "Pure Desi Cow Ghee - 250gm", 
    price: "₹550 per litre", 
    image: ghee250, 
    category: "Ghee", 
    deliveryInfo: "All India Delivery",
    description: "Premium quality desi cow ghee made using traditional Bilona method. Rich in aroma and nutrition.",
    weight: 250,
    unit: "gm",
    shelfLife: "12 months from manufacturing date",
    storage: "Store in a cool, dry place away from direct sunlight.",
    ingredients: ["Pure Cow Milk", "Traditional Bilona Method"]
  },
  { 
    id: 102, 
    name: "Pure Desi Cow Ghee - 500ml", 
    price: "₹1050 per litre", 
    image: ghee500, 
    category: "Ghee", 
    deliveryInfo: "All India Delivery",
    description: "Premium quality desi cow ghee made using traditional Bilona method. Rich in aroma and nutrition.",
    weight: 500,
    unit: "ml",
    shelfLife: "12 months from manufacturing date",
    storage: "Store in a cool, dry place away from direct sunlight.",
    ingredients: ["Pure Cow Milk", "Traditional Bilona Method"]
  },
  { 
    id: 103, 
    name: "Pure Desi Cow Ghee - 1kg", 
    price: "₹2100 per litre", 
    image: ghee1kg, 
    category: "Ghee", 
    deliveryInfo: "All India Delivery",
    description: "Premium quality desi cow ghee made using traditional Bilona method. Rich in aroma and nutrition.",
    weight: 1000,
    unit: "gm",
    shelfLife: "12 months from manufacturing date",
    storage: "Store in a cool, dry place away from direct sunlight.",
    ingredients: ["Pure Cow Milk", "Traditional Bilona Method"]
  },
  { 
    id: 104, 
    name: "Fresh Cow Milk - Daily Delivery", 
    price: "₹80 per litre", 
    image: freshMilk, 
    category: "Milk", 
    deliveryInfo: "Katni Area Only",
    description: "Pure and fresh cow milk delivered daily to your doorstep. From healthy grass-fed cows.",
    weight: 1000,
    unit: "ml",
    shelfLife: "2 days when refrigerated",
    storage: "Refrigerate immediately, consume within 2 days",
    ingredients: ["Fresh Cow Milk", "Natural Vitamins"]
  },
];

const FAQ_ITEMS = [
  {
    q: "Is your ghee organic?",
    a: "Yes, our ghee is made from 100% organic A2 milk sourced from our own farm."
  },
  {
    q: "How is the ghee prepared?",
    a: "We use the traditional Bilona method with hand-churning and slow-cooking."
  },
  {
    q: "Do you deliver across India?",
    a: "Yes! We deliver to all major cities and towns across India."
  },
  {
    q: "How should ghee be stored?",
    a: "Store in a cool, dry place away from direct sunlight. No refrigeration needed."
  }
];

const parsePrice = (price: string) => Number(price.replace(/[^0-9.-]+/g, "")) || 0;

const Home = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const handleProductNavigation = (category: string) => {
    navigate(`/products/${category}`);
  };

  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const [bgIndex, setBgIndex] = useState(0);
  const heroBgs = [hero1, hero3];
  const [featuredProducts, setFeaturedProducts] = useState<FeaturedProduct[]>([]);

  useEffect(() => {
    const fetchFeatured = async () => {
      if (useMockData) {
        setFeaturedProducts(products);
        return;
      }
      const { data } = await supabase
        .from("products")
        .select("*, categories(name)")
        .eq("status", "active")
        .eq("featured", true)
        .limit(4);

      if (data && data.length > 0) {
        setFeaturedProducts(data.map((p: any) => ({
          id: p.id,
          name: p.name,
          price: `₹${p.price.toLocaleString()}`,
          image: Array.isArray(p.images) && p.images.length > 0 ? p.images[0] : gheeTexture,
          category: p.categories?.name || "Dairy",
          deliveryInfo: p.categories?.name === "Fresh Milk" ? "Katni Area Only" : "All India Delivery"
        })));
      } else {
        setFeaturedProducts(products);
      }
    };
    fetchFeatured();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setBgIndex((prev) => (prev + 1) % heroBgs.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [heroBgs.length]);

  useEffect(() => {
    const state = location.state as { scrollToHero?: boolean } | null;
    if (state?.scrollToHero) {
      document.getElementById("hero")?.scrollIntoView({ behavior: "smooth" });
      navigate(location.pathname, { replace: true, state: { ...state, scrollToHero: false } });
    }
  }, [location.state, location.pathname, navigate]);



  const featuredProductsSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Featured Organic Dairy Products",
    "itemListElement": products.map((product, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "Product",
        "name": product.name,
        "image": `https://achyutamorganics.com${product.image}`,
        "description": `Pure traditional Bilona method Indian Desi Cow Ghee. Rich in aroma and nutrition.`,
        "offers": {
          "@type": "Offer",
          "price": parsePrice(product.price),
          "priceCurrency": "INR",
          "availability": "https://schema.org/InStock"
        }
      }
    }))
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
      }
    ]
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What is the Bilona method of ghee preparation?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "The Bilona method is a traditional Vedic technique where curd is churned into butter, and then the butter is slow-cooked in earthen pots to produce the purest ghee."
        }
      },
      {
        "@type": "Question",
        "name": "Is Achyutam Organics ghee made from A2 cow milk?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, our Desi Cow Ghee is made from the pure A2 milk of indigenous, grass-fed Indian cows, ensuring maximum health benefits."
        }
      },
      {
        "@type": "Question",
        "name": "How is the ghee delivered?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "We follow a farm-to-home delivery model, bringing fresh, traditionally prepared dairy products directly from our farm in Katni to your doorstep."
        }
      }
    ]
  };

  return (
    <main className="min-h-screen">
      <SEO
        title="Achyutam Organics | Pure Desi Cow Ghee & Organic Dairy"
        description="Experience the purity of traditional Bilona method Desi Cow Ghee from Achyutam Organics. Farm-fresh, 100% natural, and highly nutritious."
        canonicalUrl="/"
        schemas={[featuredProductsSchema, breadcrumbSchema, faqSchema]}
        preloadImage={hero1}
      />
      {/* Hero Section */}
       <section
        id="hero"
        className="relative h-screen md:h-screen flex items-center justify-start overflow-hidden font-lato"
      >
        <div className="absolute inset-0 z-0">
          {heroBgs.map((bg, idx) => (
            <div
              key={idx}
              className={cn(
                "absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out",
                idx === bgIndex ? "opacity-100 scale-105" : "opacity-0 scale-100"
              )}
              style={{ 
                backgroundImage: `url(${bg})`,
                transition: "opacity 1000ms ease-in-out, transform 10000ms linear"
              }}
            />
          ))}
          <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/60 to-transparent md:from-background/90 md:via-background/40 md:to-transparent" />
        </div>

        <div className="relative z-10 text-left px-6 md:px-12 animate-fade-in-slow max-w-4xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 mb-8">
            <div className="w-4 h-4 rounded-full bg-accent animate-pulse" />
            <p className="text-xs md:text-sm tracking-[0.2em] text-accent uppercase">The Gold Standard of Organic Ghee</p>
          </div>

          <h1 className="font-playfair text-4xl sm:text-6xl md:text-7xl mb-8 text-foreground tracking-tighter leading-[0.95]">
            A Legacy of <br />
            <span className="text-accent">Pure Nutrition</span>
          </h1>

          <p className="text-sm md:text-lg text-foreground/80 max-w-2xl mb-12 leading-relaxed">
            Pure Desi Cow Ghee delivered all over India. Fresh cow milk available daily in Katni only. Experience the taste of tradition.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-5 items-center sm:items-start">
            <Button
              asChild
              variant="default"
              size="sm"
              className="rounded-full px-6 py-3 md:px-10 md:py-4 text-sm md:text-base bg-accent text-accent-foreground hover:brightness-95 hover:scale-[1.02] transition-all shadow-xl hover:shadow-accent/20"
            >
              <Link to="/products" className="flex items-center gap-2 md:gap-3">
                Order Fresh Ghee
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Collection / OUR PRODUCTS */}
      <section id="collection" className="py-12 md:py-24 px-4 bg-secondary/30">
        <div className="container mx-auto">
          <div className="text-center mb-10 md:mb-16 animate-fade-in">
            <h2 className="font-playfair text-2xl sm:text-3xl md:text-5xl mb-3 md:mb-4">
              OUR PRODUCTS
            </h2>
            <div className="w-24 h-1 bg-accent mx-auto rounded-full" />
          </div>

          {/* Additional Product Images */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="relative overflow-hidden rounded-2xl shadow-xl group">
              <img 
                src={gheeProduct} 
                alt="Premium Ghee Products" 
                className="w-full h-64 md:h-80 object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                <div className="text-white">
                  <h3 className="text-xl md:text-2xl font-playfair font-bold mb-2 text-white">Premium Quality Ghee</h3>
                  <p className="text-white/90 text-sm md:text-base">Traditional Bilona Method - ₹2100 per litre</p>
                </div>
              </div>
            </div>
            
            <div className="relative overflow-hidden rounded-2xl shadow-xl group">
              <img 
                src={freshMilk} 
                alt="Fresh Cow Milk" 
                className="w-full h-64 md:h-80 object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                <div className="text-white">
                  <h3 className="text-xl md:text-2xl font-playfair font-bold mb-2 text-white">Farm Fresh Milk</h3>
                  <p className="text-white/90 text-sm md:text-base">Daily Delivery - ₹80 per litre</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-center pt-8">
            <Button
              asChild
              variant="default"
              className="rounded-full px-12 py-8 text-lg bg-accent text-accent-foreground hover:brightness-95 hover:scale-[1.05] transition-all shadow-xl shadow-accent/20"
            >
              <Link to="/products" className="flex items-center gap-3">
                Explore Our Collection
                <span className="text-xl">→</span>
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Brand Story / OUR STORY */}
      <section className="py-12 md:py-24 px-4 overflow-hidden">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in order-2 md:order-1">
              <h2 className="font-playfair text-3xl sm:text-5xl md:text-6xl mb-8 leading-tight">
                The Legend of <br />
                <span className="text-accent underline decoration-accent/30 underline-offset-8">Bilona Ghee</span>
              </h2>
              <div className="space-y-6 text-foreground/80 leading-relaxed text-lg">
                <p>
                  Achyutam Organics was born from a simple mission: to restore the purity of traditional Indian dairy. Our ghee isn't just a product—it's a tribute to the ancient Vedic techniques passed down through generations.
                </p>
                <p>
                  From our grass-fed indigenous cows to the slow, hand-churned Bilona process in earthen pots, every drop of our golden ghee represents our commitment to natural nutrition and farm-fresh quality.
                </p>
              </div>
            </div>
            <div className="relative order-1 md:order-2">
              <div className="absolute -inset-4 bg-accent/10 rounded-full blur-3xl animate-pulse" />
              <img
                src={bilonaProcess}
                alt="Traditional Bilona Churning Process"
                className="relative z-10 w-full h-auto drop-shadow-2xl hover:scale-105 transition-transform duration-700 rounded-3xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Highlights */}
      <section className="py-12 md:py-24 px-4 bg-secondary/30">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {[
              { icon: Sparkles, title: "A2 Cow Milk", desc: "Pure desi cow milk delivered daily in Katni. Farm-fresh goodness at your doorstep." },
              { icon: ShieldCheck, title: "Traditional Bilona Ghee", desc: "Hand-churned and slow-cooked in earthen pots. Available all over India." },
              { icon: Leaf, title: "Farm to Home", desc: "Direct delivery from our Katni farm - Fresh milk locally, Ghee nationwide." }
            ].map((item, idx) => (
              <div key={idx} className="bg-white rounded-3xl p-8 md:p-10 shadow-soft hover:shadow-glow transition-smooth text-center border border-accent/10 group">
                <div className="w-16 h-16 rounded-2xl bg-accent text-accent-foreground flex items-center justify-center mb-6 shadow-glow mx-auto group-hover:rotate-12 transition-transform">
                  <item.icon className="w-8 h-8" />
                </div>
                <h3 className="font-lato font-semibold text-sm md:text-lg mb-2">
                      {item.title}
                    </h3>
                <p className="text-muted-foreground font-lato leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* Testimonials */}
      <section className="py-12 md:py-24 px-4 bg-background">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="font-playfair text-3xl sm:text-5xl md:text-6xl mb-4">What Our Community Says</h2>
            <p className="text-muted-foreground font-lato text-lg">Real stories from our valued customers.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                quote: "The aroma takes me back to my childhood—this is the most authentic Bilona ghee I've found in years.",
                name: "Rajesh Kumar",
                location: "Mumbai, Maharashtra"
              },
              {
                quote: "Absolutely creamy and rich. My family loves it in our daily meals. The quality is unmatched.",
                name: "Priya Sharma",
                location: "Delhi, NCR"
              },
              {
                quote: "Achyutam's farm-to-home model is brilliant. I get pure, fresh ghee right at my doorstep.",
                name: "Amit Patel",
                location: "Ahmedabad, Gujarat"
              }
            ].map((testimonial, i) => (
              <div key={i} className="bg-card rounded-xl p-8 shadow-soft hover:shadow-glow transition-smooth border border-border/40 relative">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center text-accent-foreground font-bold">
                    {testimonial.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="ml-4">
                    <p className="font-playfair text-foreground text-lg">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.location}</p>
                  </div>
                </div>
                <div className="flex mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span key={star} className="text-accent text-lg">★</span>
                  ))}
                </div>
                <p className="text-foreground/80 font-lato text-lg leading-relaxed">"{testimonial.quote}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Farm Section */}
      <FarmSection />

      {/* FAQ Section */}
      <section className="py-12 md:py-24 px-4 bg-secondary">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="font-playfair text-3xl md:text-5xl mb-6">Frequently Asked Questions</h2>
            <div className="w-16 h-1 bg-accent mx-auto rounded-full mb-6" />
            <p className="text-muted-foreground mb-8">
              Find answers to common questions about our products
            </p>
          </div>
          
          <div className="space-y-4">
            {FAQ_ITEMS.map((faq, i) => (
              <div key={i} className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden transition-all duration-300">
                <button
                  className="w-full text-left p-6 text-sm sm:text-base transition-colors hover:text-accent focus:outline-none"
                  onClick={() => toggleFaq(i)}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">{faq.q}</span>
                    <span className={`text-accent transition-transform duration-300 font-bold ${openFaqIndex === i ? 'rotate-180' : ''}`}>
                      ▼
                    </span>
                  </div>
                </button>
                <div className={`px-6 pb-6 text-muted-foreground leading-relaxed transition-all duration-300 ${openFaqIndex === i ? 'block' : 'hidden'}`}>
                  {faq.a}
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <a href="/faq" className="rounded-full px-8 py-4 text-sm sm:text-base font-semibold border-2 border-accent text-accent hover:bg-accent hover:text-accent-foreground transition-all duration-300">
              View All Questions
            </a>
          </div>
        </div>
      </section>



      </main>
  );
};

export default Home;
