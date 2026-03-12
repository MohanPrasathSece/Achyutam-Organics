import { motion } from "framer-motion";
import SEO from "@/components/SEO";

const PrivacyPolicy = () => {
    return (
        <div className="pt-24 min-h-screen bg-slate-50 font-manrope">
            <SEO
                title="Privacy Policy | Achyutam Organics"
                description="Our commitment to your privacy. Learn how Achyutam Organics handles and protects your personal information and payment data."
                canonicalUrl="/privacy-policy"
            />
            <div className="container mx-auto px-4 py-12 max-w-4xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <h1 className="text-4xl md:text-6xl font-playfair font-bold text-center text-primary mb-12">
                        Privacy Policy
                    </h1>

                    <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm space-y-8 text-slate-600 leading-relaxed border border-border/50">
                        <section>
                            <h2 className="text-2xl font-bold text-slate-800 mb-4 font-playfair">1. Information We Collect</h2>
                            <p>
                                When you visit Achyutam Organics or make a purchase, we collect certain information to fulfill your order and improve your experience. This includes:
                            </p>
                            <ul className="list-disc pl-5 mt-2 space-y-1">
                                <li>Personal identifiers (Name, Email, Phone Number, Shipping Address).</li>
                                <li>Payment information (processed securely via trusted gateways).</li>
                                <li>Order history and nutritional preferences.</li>
                                <li>Fresh and high-quality organic dairy product choices.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-slate-800 mb-4 font-playfair">2. How We Use Your Information</h2>
                            <p>
                                We use your data securely to:
                            </p>
                            <ul className="list-disc pl-5 mt-2 space-y-1">
                                <li>Process and deliver your fresh farm products.</li>
                                <li>Send order updates and delivery timing.</li>
                                <li>Respond to your farm-to-home service requests.</li>
                                <li>Improve our products based on your feedback.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-slate-800 mb-4 font-playfair">3. Data Protection</h2>
                            <p>
                                Your security is paramount. We implement strict security measures to protect your personal information. We do not sell, trade, or rent your personal identification information to others.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-slate-800 mb-4 font-playfair">4. Cookies</h2>
                            <p>
                                Our website uses cookies to enhance your browsing experience, analyze site traffic, and understand where our audience is coming from. You can choose to disable cookies through your browser settings.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-slate-800 mb-4 font-playfair">5. Third-Party Services</h2>
                            <p>
                                We may use third-party services (like payment gateways and logistics partners) who have their own privacy policies. We encourage you to review them.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-slate-800 mb-4 font-playfair">6. Contact Us</h2>
                            <p>
                                If you have questions about our Privacy Policy, please contact us at <a href="mailto:hello@achyutamorganics.com" className="text-primary hover:underline font-semibold">hello@achyutamorganics.com</a>.
                            </p>
                        </section>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
