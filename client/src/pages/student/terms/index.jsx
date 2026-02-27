import { motion } from "framer-motion";

function TermsPage() {
    return (
        <div className="min-h-screen bg-white pt-20 pb-20">
            <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-zinc-900 mb-8 lowercase">
                        Terms of Service.
                    </h1>
                    <p className="text-zinc-500 font-medium mb-12">Last Updated: February 27, 2026</p>

                    <div className="space-y-12 text-zinc-700 leading-relaxed font-medium">
                        <section>
                            <h2 className="text-2xl font-bold text-zinc-900 mb-4 tracking-tight">1. Agreement to Terms</h2>
                            <p>
                                By accessing or using Bhavin Academy, you agree to be bound by these Terms of Service. If you do not agree to all terms, you may not use our services.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-zinc-900 mb-4 tracking-tight">2. Use of License</h2>
                            <p>
                                When you purchase a course, Bhavin Academy grants you a limited, non-exclusive, non-transferable license to access and view the course content for your personal, non-commercial education only.
                            </p>
                            <p className="mt-4">You may not:</p>
                            <ul className="list-disc pl-6 mt-2 space-y-3">
                                <li>Share your account credentials with others.</li>
                                <li>Download, record, or redistribute course content without explicit permission.</li>
                                <li>Use the platform for any illegal or unauthorized purpose.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-zinc-900 mb-4 tracking-tight">3. Account Responsibility</h2>
                            <p>
                                You are responsible for maintaining the confidentiality of your account and password. You agree to notify us immediately of any unauthorized use of your account.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-zinc-900 mb-4 tracking-tight">4. Payments and Refunds</h2>
                            <p>
                                All payments are processed securely through third-party providers. Courses are generally non-refundable once content has been accessed, unless otherwise specified by local laws or platform guarantees.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-zinc-900 mb-4 tracking-tight">5. Intellectual Property</h2>
                            <p>
                                All content on the platform, including text, graphics, logos, and videos, is the property of Bhavin Academy or its instructors and is protected by copyright and other intellectual property laws.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-zinc-900 mb-4 tracking-tight">6. Limitation of Liability</h2>
                            <p>
                                Bhavin Academy is not liable for any indirect, incidental, or consequential damages arising from your use of the platform. We do not guarantee specific career outcomes from taking our courses.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-zinc-900 mb-4 tracking-tight">7. Governing Law</h2>
                            <p>
                                These terms are governed by the laws of the jurisdiction in which Bhavin Academy operates, without regard to conflict of law principles.
                            </p>
                        </section>

                        <section className="pt-8 border-t border-zinc-100">
                            <h2 className="text-2xl font-bold text-zinc-900 mb-4 tracking-tight">Questions?</h2>
                            <p>If you have any questions regarding these terms, please reach out to:</p>
                            <p className="mt-2 text-blue-600 font-bold">legal@bhavinacademy.com</p>
                        </section>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}

export default TermsPage;
