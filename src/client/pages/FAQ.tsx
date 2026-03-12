import { useState } from "react";
import { ChevronDown } from "lucide-react";
import AnimateOnScroll from "@/components/AnimateOnScroll";
import SEO from "@/components/SEO";
import bilonaProcess from "@/assets/bilona-process.jpg";

const faqs = [
    { q: "Is your ghee organic?", a: "Yes, our ghee is made from 100% organic A2 milk sourced from our own farm. No chemicals, pesticides, or artificial additives are used at any stage of production." },
    { q: "How is the ghee prepared?", a: "We use the traditional Bilona method. Whole milk is first curdled into yoghurt, then hand-churned using a wooden churner to separate the butter. This butter is slow-cooked over a gentle flame to produce pure, aromatic ghee." },
    { q: "Do you deliver across India?", a: "Yes! We deliver to all major cities and towns across India. We partner with trusted courier services to ensure your products arrive fresh and on time." },
    { q: "How long does delivery take?", a: "Delivery typically takes 3-7 business days depending on your location. Metro cities usually receive orders within 3-4 days." },
    { q: "How should ghee be stored?", a: "Store our ghee in a cool, dry place away from direct sunlight. It does not need refrigeration. Always use a clean, dry spoon to scoop ghee to maintain its freshness." },
    { q: "What makes your ghee different?", a: "Our ghee is made using the ancient Bilona method from A2 milk of indigenous cow breeds. This traditional process preserves all natural nutrients and gives our ghee a distinctive golden colour, rich aroma, and superior taste that machine-processed ghee cannot match." },
    { q: "Do you offer bulk orders?", a: "Yes, we offer special pricing for bulk orders. Please contact us through our contact page or WhatsApp for bulk order enquiries." },
    { q: "Is your packaging eco-friendly?", a: "We use glass jars for our ghee products to preserve freshness and reduce environmental impact. Our packaging materials are recyclable and we are constantly looking for more sustainable options." },
];

const FAQ = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const toggleFAQ = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className="min-h-screen">
            <SEO
                title="Frequently Asked Questions | Achyutam Organics"
                description="Everything you need to know about our products, production process, and farm-to-home delivery."
                canonicalUrl="/faq"
            />

            {/* Hero Section */}
            <section className="relative h-[50vh] md:h-[60vh] flex items-center justify-center overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${bilonaProcess})` }}
                >
                    <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/60 to-black/80" />
                </div>
                <div className="relative z-10 text-center px-4 animate-fade-in">
                    <h1 className="text-4xl md:text-6xl font-playfair mb-4 text-white">Frequently Asked Questions</h1>
                    <p className="text-white/90 font-lato text-lg md:text-xl max-w-3xl mx-auto">
                        Everything you need to know about our traditional Bilona ghee and farm-fresh products
                    </p>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-12 md:py-24 px-4 bg-secondary">
                <AnimateOnScroll>
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-playfair mb-4">Frequently Asked Questions</h2>
                        <div className="w-16 h-1 bg-accent mx-auto rounded-full mb-6" />
                        <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
                            Find answers to common questions about our products and services
                        </p>
                    </div>
                </AnimateOnScroll>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
                    {faqs.map((faq, i) => (
                        <AnimateOnScroll key={faq.q} delay={i * 80}>
                            <div className="bg-card rounded-xl shadow-soft hover:shadow-glow transition-smooth border border-border/40 overflow-hidden">
                                <button
                                    className="w-full text-left p-6 text-sm sm:text-base transition-colors hover:text-accent focus:outline-none focus:text-accent"
                                    onClick={() => toggleFAQ(i)}
                                >
                                    <div className="flex items-center justify-between">
                                        <span className="font-playfair text-lg text-foreground font-semibold">{faq.q}</span>
                                        <ChevronDown className={`h-5 w-5 shrink-0 text-accent transition-transform duration-300 ${openIndex === i ? 'rotate-180' : ''}`} />
                                    </div>
                                </button>
                                <div className={`border-t border-border/40 p-6 bg-background/50 transition-all duration-300 ${openIndex === i ? 'block' : 'hidden'}`}>
                                    <p className="text-muted-foreground leading-relaxed font-lato">{faq.a}</p>
                                </div>
                            </div>
                        </AnimateOnScroll>
                    ))}
                </div>

                <AnimateOnScroll delay={300}>
                    <div className="mt-16 text-center bg-background rounded-3xl p-10 border border-border/40 shadow-soft">
                        <h3 className="text-3xl font-playfair mb-4">Still have questions?</h3>
                        <p className="text-muted-foreground mb-8">We're here to help you choose the best for your family.</p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <a href="/contact" className="rounded-full px-8 py-4 text-sm sm:text-base font-semibold bg-primary text-white hover:shadow-glow hover:scale-[1.02] transition-transform">Contact Us</a>
                            <a href="https://wa.me/919425156801" className="rounded-full px-8 py-4 text-sm sm:text-base font-semibold border-2 border-accent text-accent hover:bg-accent hover:text-accent-foreground transition-all duration-300">Order via WhatsApp</a>
                        </div>
                    </div>
                </AnimateOnScroll>
            </section>
        </div>
    );
};

export default FAQ;
