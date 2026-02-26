import React from "react";
import { motion } from "framer-motion";
import { GraduationCap, Award, Globe, Users } from "lucide-react";

function AboutUsPage() {
    const fadeUp = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6 },
    };

    const stats = [
        { icon: <Users className="w-6 h-6" />, label: "Students", value: "20,000+" },
        { icon: <Globe className="w-6 h-6" />, label: "Countries", value: "50+" },
        { icon: <Award className="w-6 h-6" />, label: "Courses", value: "500+" },
    ];

    return (
        <div className="min-h-screen pt-32 pb-20 bg-slate-50">
            <div className="container mx-auto px-4 lg:px-8">
                {/* Main Section */}
                <section className="relative">
                    <motion.div
                        {...fadeUp}
                        className="bg-white rounded-[40px] p-8 md:p-16 shadow-2xl overflow-hidden relative"
                    >
                        {/* Background Accents */}
                        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
                        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/5 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />

                        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                            <div>
                                <span className="text-blue-600 font-black text-xs uppercase tracking-[0.2em] block mb-4">
                                    About Bhavin Academy
                                </span>
                                <h1 className="text-3xl md:text-[50px] font-black tracking-tighter text-zinc-900 mb-8 leading-tight">
                                    Empowering the next <br /> generation of masters.
                                </h1>
                                <p className="text-base text-zinc-600 font-medium mb-12 leading-relaxed">
                                    Bhavin Academy is a premium learning ecosystem designed for professionals who refuse to settle for average. We combine world-class instruction with high-fidelity digital experiences to help you master the skills that matter in the modern economy.
                                </p>

                                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                                    {stats.map((stat, index) => (
                                        <div key={index} className="flex flex-col gap-1">
                                            <div className="text-blue-600 mb-2">{stat.icon}</div>
                                            <span className="text-xl font-black text-zinc-900 leading-none">{stat.value}</span>
                                            <span className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">{stat.label}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="relative h-full">
                                <div className="aspect-square lg:aspect-auto lg:h-[600px] rounded-[32px] overflow-hidden relative group border border-zinc-200 shadow-2xl">
                                    <img
                                        src="/about_us_hero.png"
                                        alt="Students Learning"
                                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/60 via-transparent to-transparent opacity-60" />

                                    <div className="absolute inset-6 md:inset-10 flex flex-col justify-end">
                                        <div className="bg-white/10 backdrop-blur-xl p-6 rounded-2xl border border-white/20">
                                            <h3 className="text-xl font-bold text-white mb-1">Global Academy</h3>
                                            <p className="text-white/80 text-sm font-medium">Join 20,000+ students on your journey to mastery.</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Decorative Badge */}
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 0.5, type: "spring" }}
                                    className="absolute -bottom-6 -right-6 bg-zinc-900 text-white p-8 rounded-full shadow-2xl"
                                >
                                    <Award className="w-10 h-10" />
                                </motion.div>
                            </div>
                        </div>
                    </motion.div>
                </section>
            </div>
        </div>
    );
}

export default AboutUsPage;
