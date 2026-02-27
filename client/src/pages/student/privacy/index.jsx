import { motion } from "framer-motion";

function PrivacyPolicyPage() {
    return (
        <div className="min-h-screen bg-white pt-20 pb-20">
            <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-zinc-900 mb-8 lowercase">
                        Privacy Policy.
                    </h1>
                    <p className="text-zinc-500 font-medium mb-12">Last Updated: February 27, 2026</p>

                    <div className="space-y-12 text-zinc-700 leading-relaxed font-medium">
                        <section>
                            <h2 className="text-2xl font-bold text-zinc-900 mb-4 tracking-tight">1. Introduction</h2>
                            <p>
                                Welcome to Bhavin Academy. We value your privacy and are committed to protecting your personal data. This Privacy Policy explains how we collect, use, and safeguard your information when you visit our platform.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-zinc-900 mb-4 tracking-tight">2. Information We Collect</h2>
                            <ul className="list-disc pl-6 space-y-3">
                                <li><strong>Personal Identification Information:</strong> Name, email address, phone number, and payment details.</li>
                                <li><strong>Account Information:</strong> Username, password, and profile preferences.</li>
                                <li><strong>Usage Data:</strong> Courses viewed, progress tracking, and interaction with platform features.</li>
                                <li><strong>Technical Data:</strong> IP address, browser type, and device information.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-zinc-900 mb-4 tracking-tight">3. How We Use Your Information</h2>
                            <p>We use the collected data for various purposes, including:</p>
                            <ul className="list-disc pl-6 mt-4 space-y-3">
                                <li>Providing and maintaining our learning services.</li>
                                <li>Processing transactions and sending purchase confirmations.</li>
                                <li>Personalizing your learning experience.</li>
                                <li>Communicating with you about updates, promotions, and support.</li>
                                <li>Ensuring the security and integrity of our platform.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-zinc-900 mb-4 tracking-tight">4. Data Security</h2>
                            <p>
                                We implement industry-standard security measures to protect your data from unauthorized access, alteration, or disclosure. This includes encrypted payment processing and secure server environments.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-zinc-900 mb-4 tracking-tight">5. Third-Party Services</h2>
                            <p>
                                We may use third-party providers for payment processing (e.g., Razorpay, PayPal) and media hosting (e.g., Cloudinary). These services have their own privacy policies governing how they handle your data.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-zinc-900 mb-4 tracking-tight">6. Your Rights</h2>
                            <p>
                                You have the right to access, correct, or delete your personal information. You can manage your account settings directly or contact our support team for assistance.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-zinc-900 mb-4 tracking-tight">7. Changes to This Policy</h2>
                            <p>
                                We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last Updated" date.
                            </p>
                        </section>

                        <section className="pt-8 border-t border-zinc-100">
                            <h2 className="text-2xl font-bold text-zinc-900 mb-4 tracking-tight">Contact Us</h2>
                            <p>If you have any questions about this Privacy Policy, please contact us at:</p>
                            <p className="mt-2 text-blue-600 font-bold">privacy@bhavinacademy.com</p>
                        </section>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}

export default PrivacyPolicyPage;
