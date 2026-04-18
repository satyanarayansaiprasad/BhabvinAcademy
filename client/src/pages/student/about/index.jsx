import React from "react";
import { motion } from "framer-motion";
import { GraduationCap, Award, Globe, Users, CheckCircle2, Quote, Laptop, Building2, UserCheck, Mic2, Target, Beaker, Sprout, Share2, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

function AboutUsPage() {
    const reveal = {
        initial: { opacity: 0, y: 30 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true },
        transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] }
    };

    const stats = [
        { icon: <Laptop className="w-5 h-5" />, label: "Years in enterprise IT", value: "15+", suffix: "+" },
        { icon: <Building2 className="w-5 h-5" />, label: "Companies worked in", value: "7+", suffix: "+" },
        { icon: <UserCheck className="w-5 h-5" />, label: "Customers served", value: "500+", suffix: "+" },
        { icon: <Mic2 className="w-5 h-5" />, label: "Training & events conducted", value: "450+", suffix: "+" },
    ];

    return (
        <div className="min-h-screen bg-white font-['Inter']">
            {/* HERO SECTION */}
            <section className="relative min-h-[80vh] flex flex-col items-center justify-center p-6 bg-[linear-gradient(160deg,#000_0%,#1a1a2e_50%,#000_100%)] overflow-hidden text-center">
                <div className="absolute w-[700px] h-[700px] rounded-full bg-[radial-gradient(circle,rgba(0,113,227,0.2)_0%,transparent_70%)] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
                <div className="absolute w-[300px] h-[300px] rounded-full bg-[radial-gradient(circle,rgba(0,212,255,0.08)_0%,transparent_70%)] bottom-1/4 right-1/4 pointer-events-none" />
                
                <motion.div {...reveal}>
                    <div className="text-[12px] font-bold text-[#0071e3] uppercase tracking-[0.1em] mb-4">About Bhavin Academy</div>
                    <h1 className="text-[clamp(40px,7vw,80px)] font-extrabold text-[#f5f5f7] leading-[1.05] tracking-[-2.5px] max-w-[900px] mb-8">
                        Built by a practitioner.<br />
                        <span className="bg-[linear-gradient(90deg,#0071e3,#00d4ff)] bg-clip-text text-transparent italic">For practitioners.</span>
                    </h1>
                    <p className="text-[18px] text-[#86868b] leading-[1.6] max-w-[600px] mx-auto font-light">
                        Bhavin Academy is built on a fundamental: Master the depth, scale the width with applied knowledge.
                    </p>
                </motion.div>

                <div className="absolute bottom-12 flex flex-col items-center gap-2 opacity-30">
                    <span className="text-[10px] text-white uppercase tracking-widest">Scroll Down</span>
                    <div className="w-[1px] h-10 bg-gradient-to-b from-white to-transparent" />
                </div>
            </section>

            {/* THE STORY */}
            <section className="py-24 px-6 md:py-32">
                <div className="max-w-[1080px] mx-auto grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-16 items-start">
                    <motion.div {...reveal} className="space-y-8">
                        <div>
                            <div className="text-[13px] font-bold text-[#0071e3] uppercase tracking-[0.06em] mb-4">The Story</div>
                            <h2 className="text-[clamp(32px,5vw,48px)] font-extrabold text-[#1d1d1f] tracking-[-1.5px] leading-[1.1]">
                                Not just a teacher.<br />A career <span className="text-[#0071e3]">witness</span>.
                            </h2>
                        </div>
                        <div className="text-[16px] text-[#6e6e73] leading-[1.8] space-y-6">
                            <p>I started my IT career the hard way. I was self-taught - studying late into the night after a full-time job, chasing technologies that felt impossibly distant, and implementing everything I learned. Every lab mistake, every exam I failed before I passed, and every concept that finally "clicked" is woven into the DNA of BhavinAcademy today.</p>
                            <p>After <strong>15+ years in enterprise IT</strong>; spanning Windows infrastructure, Active Directory, and Linux administration to networking and cloud security, I realized that most people in the industry strive for the right path through applied knowledge and a simplified learning methodology. Answering a long-standing calling to support this mission, I have dedicated myself to teaching the skills I’ve mastered to help others walk their path efficiently.</p>
                            <p>This platform is the result of my passion for IT, and Life Enhancement. Now, it’s your turn to put it to work for your career and growth.</p>
                            <p className="text-[#1d1d1f] font-medium">Wish you a great journey ahead!</p>
                        </div>
                        <Link to="/courses" className="inline-flex items-center gap-2 text-[15px] font-semibold text-[#0071e3] hover:underline">
                            Explore all courses <ArrowRight className="w-4 h-4" />
                        </Link>
                    </motion.div>

                    <motion.div {...reveal} transition={{ delay: 0.2 }} className="sticky top-[80px]">
                        <div className="bg-black text-[#f5f5f7] rounded-[24px] p-8 shadow-2xl overflow-hidden relative">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                            <div className="relative z-10">
                                <div className="w-20 h-20 rounded-full bg-[linear-gradient(135deg,#0071e3,#00d4ff)] flex items-center justify-center text-3xl font-extrabold mb-6">BK</div>
                                <h3 className="text-[22px] font-extrabold tracking-tight mb-1">Bhavin Khatri</h3>
                                <p className="text-[13px] text-[#86868b] leading-tight mb-6">Founder & Lead Instructor<br />BhavinAcademy</p>
                                
                                <div className="w-full h-[1px] bg-white/10 mb-6" />
                                
                                <div className="space-y-4">
                                    {[
                                        { icon: "🧑‍💻", text: "<strong>15+ years</strong> in enterprise IT" },
                                        { icon: "🏢", text: "Worked in <strong>7+ companies</strong>" },
                                        { icon: "🤝", text: "Served <strong>500+ customers</strong>" },
                                        { icon: "🎙️", text: "Conducted <strong>450+ training</strong>" },
                                        { icon: "🌍", text: "Based in <strong>India</strong> · Global reach" },
                                    ].map((row, i) => (
                                        <div key={i} className="flex items-start gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-[#0071e3]/20 border border-[#0071e3]/30 flex items-center justify-center text-[15px] shrink-0">{row.icon}</div>
                                            <span className="text-[13px] text-[#c7c7cc] leading-[1.4]" dangerouslySetInnerHTML={{ __html: row.text }} />
                                        </div>
                                    ))}
                                </div>

                                <div className="flex flex-wrap gap-2 mt-8">
                                    {["MCSA", "AZ-104", "CCNA", "LPIC-1", "Security+", "Network+"].map((cert, i) => (
                                        <span key={i} className="text-[10px] font-bold bg-[#0071e3]/20 text-[#40a9ff] border border-[#0071e3]/30 px-2.5 py-1 rounded-full uppercase tracking-wider">{cert}</span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* NUMBERS BAND */}
            <section className="bg-black py-24 px-6 overflow-hidden">
                <div className="max-w-[1080px] mx-auto">
                    <p className="text-[13px] font-bold text-[#0071e3]/70 uppercase tracking-[0.1em] mb-12">By the numbers</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-[2px] bg-white/10 rounded-[20px] overflow-hidden border border-white/10">
                        {stats.map((stat, i) => (
                            <motion.div 
                                key={i} 
                                {...reveal}
                                transition={{ delay: i * 0.1 }}
                                className="bg-black p-10 relative overflow-hidden group"
                            >
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-[#0071e3]/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                                <div className="relative z-10">
                                    <div className="text-[clamp(42px,5vw,64px)] font-black text-[#f5f5f7] leading-none mb-3 tracking-[-3px]">
                                        {stat.value.replace('+', '')}<span className="text-[0.6em] text-[#0071e3] tracking-normal">+</span>
                                    </div>
                                    <div className="text-[13px] text-[#86868b] leading-tight font-light">{stat.label}</div>
                                </div>
                                <div className="absolute top-6 right-6 opacity-10 group-hover:opacity-20 transition-opacity">{stat.icon}</div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* MISSION SECTION */}
            <section className="bg-[#f5f5f7] py-24 px-6">
                <div className="max-w-[1080px] mx-auto">
                    <div className="mb-16">
                        <div className="text-[13px] font-bold text-[#0071e3] uppercase tracking-[0.06em] mb-4">Our Mission</div>
                        <h2 className="text-[clamp(28px,4.5vw,46px)] font-extrabold text-[#1d1d1f] tracking-[-1.5px] leading-[1.1]">
                            Every principle that<br />guides how we teach.
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            { icon: "🎯", color: "blue", title: "Exam-ready, job-ready", desc: "Certifications open doors — but it's real-world competence that keeps them open. Every course ensures you do both." },
                            { icon: "🔬", color: "dark", title: "Labs before lectures", desc: "You don't learn to drive by reading a manual. Every concept is reinforced with a hands-on lab environment." },
                            { icon: "🌱", color: "green", title: "Fundamentals never expire", desc: "Cloud providers shift, but TCP/IP and identity concepts remain timeless. We prioritize foundations over trends." },
                        ].map((v, i) => (
                            <motion.div 
                                key={i}
                                {...reveal}
                                transition={{ delay: i * 0.1 }}
                                className="bg-white border border-transparent hover:border-[#0071e3]/30 rounded-[20px] p-10 transition-all hover:shadow-xl hover:-translate-y-1"
                            >
                                <div className="w-14 h-14 rounded-2xl bg-black/5 flex items-center justify-center text-2xl mb-6">{v.icon}</div>
                                <h3 className="text-[20px] font-extrabold text-[#1d1d1f] mb-4 tracking-[-0.4px]">{v.title}</h3>
                                <p className="text-[14px] text-[#6e6e73] leading-[1.7]">{v.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* PHILOSOPHY */}
            <section className="bg-black py-32 px-6 text-center relative overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#0071e3]/10 rounded-full blur-[120px] pointer-events-none" />
                <div className="max-w-[800px] mx-auto relative z-10">
                    <Quote className="w-20 h-20 text-[#0071e3]/20 mx-auto mb-8" />
                    <p className="text-[clamp(22px,3vw,34px)] font-light text-[#f5f5f7] leading-[1.6] tracking-[-0.5px] mb-10">
                        "While technology shifts with every decade, your value remains constant through two rules: <strong>Master the fundamentals</strong>, as they are timeless; and <strong>keep learning</strong>, for the world never stops turning."
                    </p>
                    <div className="text-[14px] text-[#86868b] uppercase tracking-widest font-bold">· Bhavin Khatri ·</div>
                    <div className="text-[12px] text-[#86868b]/40 mt-2">Founder, BhavinAcademy</div>
                </div>
            </section>

            {/* WHAT WE COVER Grid */}
            <section className="py-24 px-6 md:py-32">
                <div className="max-w-[1080px] mx-auto">
                    <motion.div {...reveal} className="mb-16">
                        <div className="text-[13px] font-bold text-[#0071e3] uppercase tracking-[0.06em] mb-4">What We Cover</div>
                        <h2 className="text-[clamp(32px,5vw,48px)] font-extrabold text-[#1d1d1f] tracking-[-1.5px] leading-[1.1]">
                            Six domains. One platform.
                        </h2>
                    </motion.div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[
                            { title: "Microsoft & Cloud", icon: "🪟", color: "from-[#001830] to-[#003a6b]", pills: ["Server", "AD DS", "M365", "Azure"] },
                            { title: "Linux Systems", icon: "🐧", color: "from-[#1a0e00] to-[#3d2200]", pills: ["Ubuntu", "RHEL", "Bash", "LPIC"] },
                            { title: "Networking", icon: "🌐", color: "from-[#001a30] to-[#003060]", pills: ["Cisco", "TCP/IP", "VPN", "CCNA"] },
                            { title: "Cybersecurity", icon: "🔒", color: "from-[#001a0a] to-[#003018]", pills: ["Security+", "IAM", "PKI", "SIEM"] },
                            { title: "DevOps & Iac", icon: "⚙️", color: "from-[#130020] to-[#2a0040]", pills: ["Ansible", "Terraform", "Git", "Pipelines"] },
                            { title: "Modern Workplace", icon: "💼", color: "from-[#1e1e1e] to-[#333]", pills: ["Intune", "Endpoint", "Collaboration", "MS-900"] },
                        ].map((domain, i) => (
                            <motion.div 
                                key={i}
                                {...reveal}
                                transition={{ delay: i * 0.05 }}
                                className={`rounded-[24px] p-10 bg-gradient-to-br ${domain.color} text-white hover:scale-[1.02] transition-transform cursor-pointer group shadow-xl`}
                            >
                                <div className="text-4xl mb-6 group-hover:scale-110 transition-transform inline-block">{domain.icon}</div>
                                <h3 className="text-[20px] font-bold mb-3">{domain.title}</h3>
                                <p className="text-[13px] text-white/50 font-light mb-6">Master enterprise-grade implementation with hands-on scenarios.</p>
                                <div className="flex flex-wrap gap-2">
                                    {domain.pills.map((pill, pi) => (
                                        <span key={pi} className="text-[10px] font-bold bg-white/10 px-2.5 py-1 rounded-full">{pill}</span>
                                    ))}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA SECTION */}
            <section className="bg-[#0071e3] py-24 px-6 text-center text-white">
                <motion.div {...reveal} className="max-w-[600px] mx-auto">
                    <h2 className="text-[clamp(32px,5vw,52px)] font-extrabold tracking-[-1.5px] leading-[1.1] mb-6">
                        Ready to start<br />your IT journey?
                    </h2>
                    <p className="text-[18px] text-white/70 font-light mb-10">
                        Join 20,000+ students on their path to becoming industry experts.
                    </p>
                    <Link to="/courses" className="inline-block bg-white text-[#0071e3] px-10 py-5 rounded-full text-[16px] font-bold hover:bg-white/90 transition-colors shadow-2xl">
                        Explore All Courses
                    </Link>
                </motion.div>
            </section>
        </div>
    );
}

export default AboutUsPage;
