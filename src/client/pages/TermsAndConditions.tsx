import { motion } from "framer-motion";
import SEO from "@/components/SEO";

const TermsAndConditions = () => {
    return (
        <div className="pt-24 min-h-screen bg-slate-50 font-manrope">
            <SEO
                title="Terms & Conditions | Achyutam Organics"
                description="Read our terms of service, including product ordering, farm-to-home delivery, and quality assurance for Achyutam Organics dairy products."
                canonicalUrl="/terms-and-conditions"
            />
            <div className="container mx-auto px-4 py-12 max-w-4xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <h1 className="text-4xl md:text-6xl font-playfair font-bold text-center text-primary mb-12">
                        Terms & Conditions
                    </h1>

                    <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm space-y-8 text-slate-600 leading-relaxed border border-border/50">
                        <section>
                            <h2 className="text-2xl font-bold text-slate-800 mb-4 font-playfair">1. Introduction</h2>
                            <p>
                                Welcome to Achyutam Organics. By accessing our website and purchasing our organic dairy products, you agree to be bound by these Terms and Conditions. Please read them carefully before making a purchase.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-slate-800 mb-4 font-playfair">2. Products & Quality</h2>
                            <p>
                                We take pride in the purity of our A2 Desi Cow Ghee and fresh dairy products. Our Ghee is made using the traditional Bilona method. As these are natural products, slight variations in color, aroma, and texture are normal and signify their authentic nature.
                            </p>
                            <p className="mt-2">
                                All prices are listed in Indian Rupees (INR) and are subject to change without notice. We reserve the right to modify or discontinue any product or delivery service at any time.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-slate-800 mb-4 font-playfair">3. Orders & Payments</h2>
                            <p>
                                By placing an order, you confirm that all details provided are accurate. We utilize secure payment gateways for transactions. Orders are subject to acceptance and delivery slot availability.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-slate-800 mb-4 font-playfair">4. Shipping & Farm-to-Home Delivery</h2>
                            <p>
                                We aim to deliver fresh products as per the selected schedule. Delivery times may vary based on your location and dairy production cycles. Achyutam Organics is not liable for delays caused by logistics partners or unforeseen farm conditions.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-slate-800 mb-4 font-playfair">5. Returns & Refunds</h2>
                            <p>
                                Due to the perishable nature of dairy products, we only accept returns or provide refunds for damaged or incorrect items reported immediately upon delivery with photo proof. Quality concerns must be raised within 12 hours of receipt.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-slate-800 mb-4 font-playfair">6. Intellectual Property</h2>
                            <p>
                                All content on this website, including images of our farm and products, text, and brand designs, is the property of Achyutam Organics and is protected by copyright laws. Unauthorized use is prohibited.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-slate-800 mb-4 font-playfair">7. Contact Information</h2>
                            <p>
                                For any queries regarding these terms, please contact us at <a href="mailto:hello@achyutamorganics.com" className="text-primary hover:underline font-semibold">hello@achyutamorganics.com</a>.
                            </p>
                        </section>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default TermsAndConditions;
