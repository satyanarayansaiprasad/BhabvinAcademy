import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
    Mail, 
    MessageCircle, 
    Users, 
    Globe, 
    CheckCircle2, 
    Send, 
    Plus,
    HelpCircle,
    ArrowUpRight,
    Clock,
    ArrowRight
} from "lucide-react";
import { Link } from "react-router-dom";
import { submitContactService } from "../../../services";

function ContactPage() {
    const [formData, setFormData] = useState({
        fname: "",
        lname: "",
        email: "",
        topic: "",
        message: ""
    });
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [openFaq, setOpenFaq] = useState(0);

    const reveal = {
        initial: { opacity: 0, y: 30 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true },
        transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
    };

    const faqs = [
        { q: "Do you offer refunds if I'm not satisfied?", a: "Yes. We offer a full refund within 7 days of purchase if you haven't completed more than 20% of the course. Just email us and we'll process it promptly — no questions asked." },
        { q: "How long do I have access to a course after purchasing?", a: "Lifetime access. Once you purchase a course, it's yours forever — including all future updates we make to the content. You can revisit it anytime from any device." },
        { q: "Are the courses suitable for complete beginners?", a: "Many of our courses are designed for beginners with no prior experience, while others require some foundational knowledge. Each course page clearly states the required skill level." },
        { q: "Can I access courses on mobile?", a: "Absolutely. BhavinAcademy is fully responsive and works smoothly on smartphones and tablets. You can learn on the go from any modern browser." },
        { q: "Do you offer group or corporate pricing?", a: "Yes! We offer discounted plans for teams of 5 or more, with a centralised admin dashboard and progress tracking. Select 'Team / Corporate Training' as your topic." },
    ];

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);
        try {
            const data = await submitContactService({
                name: `${formData.fname} ${formData.lname}`.trim(),
                email: formData.email,
                category: formData.topic,
                message: formData.message
            });
            if (data.success) {
                setIsSubmitted(true);
            } else {
                setError(data.message || "Something went wrong.");
            }
        } catch (err) {
            setError(err.message || "Failed to submit form.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-white font-['Inter'] selection:bg-[#0071e3]/20">
            {/* ─── PAGE HERO ───────────────────────────────────────── */}
            <section className="bg-[linear-gradient(160deg,#000_0%,#1a1a2e_50%,#000_100%)] min-h-[50vh] flex flex-col items-center justify-center p-6 relative overflow-hidden text-center text-white">
                <div className="absolute w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle,rgba(0,113,227,0.22)_0%,transparent_70%)] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none blur-[100px]" />
                <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                    className="relative z-10"
                >
                    <p className="text-[11px] font-black text-[#0071e3] uppercase tracking-[0.4em] mb-6">Connect with Protocol</p>
                    <h1 className="text-[clamp(42px,7vw,88px)] font-black tracking-[-3px] leading-[0.95] mb-8 max-w-[900px]">
                        We're here to <br /><span className="italic bg-[linear-gradient(90deg,#0071e3,#00d4ff)] bg-clip-text text-transparent">Accelerate</span> your growth.
                    </h1>
                    <p className="text-[19px] text-[#86868b] max-w-[540px] mx-auto font-light leading-relaxed">
                        Have a technical query, account request, or partnership proposal? Our team is synchronized to assist.
                    </p>
                </motion.div>
            </section>

            {/* ─── CONTACT CORE ─────────────────────────────────────── */}
            <section className="bg-[#f5f5f7] py-24 px-6 md:py-32">
                <div className="max-w-[1080px] mx-auto grid grid-cols-1 lg:grid-cols-[1fr_550px] gap-16 items-start text-left">
                    
                    {/* INFO MATRIX */}
                    <div className="space-y-12">
                        <div>
                            <div className="text-[11px] font-black text-[#0071e3] uppercase tracking-[0.4em] mb-6 flex items-center gap-4">
                                Entry Points <div className="h-[1px] flex-1 bg-[#000]/[0.05]" />
                            </div>
                            <h2 className="text-[38px] font-black text-[#1d1d1f] tracking-tighter leading-none mb-6">Initiate a<br />conversation.</h2>
                            <p className="text-[16px] text-[#6e6e73] leading-relaxed font-light pr-12">Select your preferred communication vector below, or utilize the secure form for direct node sync.</p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
                            {[
                                { icon: <Mail size={20} />, title: "Support Terminal", value: "support@bhavinacademy.com", sub: "For all technical & account queries" },
                                { icon: <MessageCircle size={20} />, title: "Live Intelligence", value: "Sync via Chat →", sub: "Available Mon–Fri, 9:00 - 18:00 IST" },
                                { icon: <Users size={20} />, title: "Enterprise Logic", value: "Talk to our Architects →", sub: "For group & corporate training clusters" },
                                { icon: <Globe size={20} />, title: "HQ Coordinates", value: "Gujarat, India 🇮🇳", sub: "Global digital-first operations" },
                            ].map((item, i) => (
                                <motion.div 
                                    key={i} 
                                    {...reveal} 
                                    transition={{ delay: i * 0.05 }} 
                                    className="bg-white rounded-[32px] p-8 flex items-start gap-6 hover:shadow-[0_24px_48px_rgba(0,0,0,0.06)] transition-all cursor-default group border border-transparent hover:border-[#0071e3]/10"
                                >
                                    <div className="w-14 h-14 rounded-2xl bg-[#f5f5f7] text-[#0071e3] flex items-center justify-center shrink-0 group-hover:bg-[#0071e3] group-hover:text-white transition-all group-hover:scale-105 duration-500">{item.icon}</div>
                                    <div>
                                        <h4 className="text-[11px] font-black text-[#86868b] uppercase tracking-widest mb-1">{item.title}</h4>
                                        <div className="text-[17px] font-black text-[#1d1d1f] group-hover:text-[#0071e3] transition-colors mb-1 tracking-tight flex items-center gap-2">
                                            {item.value} {item.value.includes('→') && <ArrowUpRight size={14} className="opacity-40" />}
                                        </div>
                                        <p className="text-[13px] text-[#6e6e73] font-light">{item.sub}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        <div className="bg-white rounded-[32px] p-8 border-l-4 border-[#0071e3] shadow-sm flex items-center gap-6">
                            <div className="w-12 h-12 rounded-full bg-[#0071e3]/10 flex items-center justify-center shrink-0">
                                <Clock size={20} className="text-[#0071e3]" />
                            </div>
                            <p className="text-[14px] text-[#6e6e73] leading-relaxed font-medium">
                                <span className="text-[#1d1d1f] font-black uppercase text-[10px] tracking-widest block mb-1">Standard Response Protocol</span>
                                All direct inquiries are resolved within 24 hours (Standard Business Cycles).
                            </p>
                        </div>
                    </div>

                    {/* TRANSMISSION FORM */}
                    <motion.div {...reveal} className="bg-white rounded-[44px] p-12 md:p-16 shadow-[0_32px_64px_rgba(0,0,0,0.08)] relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-[#0071e3]/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none group-hover:bg-[#0071e3]/10 transition-colors duration-1000" />
                        
                        {!isSubmitted ? (
                            <div className="relative z-10">
                                <h3 className="text-[28px] font-black text-[#1d1d1f] tracking-tight mb-3 flex items-center gap-3">Transmit Message <Send size={24} className="text-[#0071e3]" /></h3>
                                <p className="text-[15px] text-[#6e6e73] mb-12 font-light">Input your parameters below to sync with our advisory core.</p>

                                <form onSubmit={handleSubmit} className="space-y-8">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <div className="space-y-3">
                                            <label className="text-[11px] font-black text-[#86868b] uppercase tracking-widest">First Name</label>
                                            <input type="text" placeholder="e.g. Ravi" className="w-full h-14 px-5 bg-[#f5f5f7] border border-transparent rounded-[20px] text-[15px] font-medium outline-none focus:bg-white focus:border-[#0071e3]/30 focus:shadow-xl focus:shadow-blue-500/5 transition-all" required value={formData.fname} onChange={(e) => setFormData({...formData, fname: e.target.value})} />
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-[11px] font-black text-[#86868b] uppercase tracking-widest">Last Name</label>
                                            <input type="text" placeholder="e.g. Sharma" className="w-full h-14 px-5 bg-[#f5f5f7] border border-transparent rounded-[20px] text-[15px] font-medium outline-none focus:bg-white focus:border-[#0071e3]/30 focus:shadow-xl focus:shadow-blue-500/5 transition-all" value={formData.lname} onChange={(e) => setFormData({...formData, lname: e.target.value})} />
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-[11px] font-black text-[#86868b] uppercase tracking-widest">Email Address</label>
                                        <input type="email" placeholder="terminal@domain.com" className="w-full h-14 px-5 bg-[#f5f5f7] border border-transparent rounded-[20px] text-[15px] font-medium outline-none focus:bg-white focus:border-[#0071e3]/30 focus:shadow-xl focus:shadow-blue-500/5 transition-all" required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-[11px] font-black text-[#86868b] uppercase tracking-widest">Inquiry Vector</label>
                                        <select className="w-full h-14 px-5 bg-[#f5f5f7] border border-transparent rounded-[20px] text-[15px] font-bold outline-none focus:bg-white focus:border-[#0071e3]/30 transition-all cursor-pointer appearance-none" required value={formData.topic} onChange={(e) => setFormData({...formData, topic: e.target.value})}>
                                            <option value="" disabled>Select Protocol Category...</option>
                                            <option value="course">Technical Course Query</option>
                                            <option value="enroll">Account Access Synchronisation</option>
                                            <option value="billing">Transactional Audit Reply</option>
                                            <option value="team">Enterprise Cluster Training</option>
                                            <option value="other">General Protocol Feedback</option>
                                        </select>
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-[11px] font-black text-[#86868b] uppercase tracking-widest">Message Intel</label>
                                        <textarea placeholder="Provide detailed intelligence regarding your query..." className="w-full min-h-[160px] p-6 bg-[#f5f5f7] border border-transparent rounded-[24px] text-[15px] font-light leading-relaxed outline-none focus:bg-white focus:border-[#0071e3]/30 focus:shadow-xl focus:shadow-blue-500/5 transition-all resize-none" maxLength="1000" required value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})}></textarea>
                                        <div className="text-[10px] text-[#b0b0b5] text-right font-black uppercase tracking-widest opacity-40">{formData.message.length} / 1000 CHARS</div>
                                    </div>

                                    {error && <div className="text-red-500 text-sm font-medium">{error}</div>}
                                    <div className="flex flex-col sm:flex-row items-center justify-between gap-8 pt-6 border-t border-[#f5f5f7]">
                                        <p className="text-[11px] text-[#86868b] max-w-[280px] font-medium leading-relaxed italic pr-6 border-l-2 border-[#f5f5f7] pl-4">Your data is governed by strict technical secrecy protocols. No 3rd party leakage.</p>
                                        <button type="submit" disabled={isSubmitting} className="h-16 px-12 bg-[#0071e3] text-white rounded-[24px] text-[14px] font-black uppercase tracking-[0.2em] hover:bg-[#0077ed] transition-all flex items-center gap-3 shadow-2xl shadow-[#0071e3]/20 active:scale-95 group/btn disabled:opacity-50">
                                            {isSubmitting ? "Syncing..." : "Sync Now"} <ArrowRight size={20} className="group-hover/btn:translate-x-1 transition-transform" />
                                        </button>
                                    </div>
                                </form>
                            </div>
                        ) : (
                            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center py-24 text-center">
                                <div className="w-24 h-24 bg-[#30d158]/10 text-[#30d158] rounded-[34px] flex items-center justify-center mb-8 shadow-xl shadow-[#30d158]/5">
                                    <CheckCircle2 size={44} strokeWidth={2.5} />
                                </div>
                                <h3 className="text-[32px] font-black text-[#1d1d1f] mb-3 tracking-tighter">Transmission Successful.</h3>
                                <p className="text-[16px] text-[#6e6e73] max-w-[340px] font-light leading-relaxed">Intelligence received. Our advisory core will synchronize with your email within 24 hours.</p>
                                <button onClick={() => setIsSubmitted(false)} className="mt-12 text-[12px] font-black text-[#0071e3] uppercase tracking-[0.3em] hover:scale-105 transition-all decoration-[#0071e3]/20 underline underline-offset-8">New Transmission</button>
                            </motion.div>
                        )}
                    </motion.div>
                </div>
            </section>

            {/* SYSDEMIC FAQ ACCORDION */}
            <section className="bg-white py-32 px-6">
                <div className="max-w-[840px] mx-auto text-left">
                    <div className="mb-20">
                        <div className="text-[11px] font-black text-[#0071e3] uppercase tracking-[0.4em] mb-6 flex items-center gap-4">
                            Knowledge Base <div className="h-[1px] w-24 bg-[#000]/[0.05]" />
                        </div>
                        <h2 className="text-[44px] font-black text-[#1d1d1f] tracking-tighter leading-none mb-6">Expedited Audit.</h2>
                        <p className="text-[18px] text-[#6e6e73] font-light max-w-[500px]">Common protocol clarifications for immediate resolution.</p>
                    </div>

                    <div className="space-y-4">
                        {faqs.map((faq, i) => (
                            <div key={i} className={`rounded-[32px] border transition-all duration-500 overflow-hidden ${openFaq === i ? 'bg-[#f5f5f7] border-transparent shadow-sm' : 'bg-white border-[#000]/[0.04]'}`}>
                                <button 
                                    onClick={() => setOpenFaq(openFaq === i ? -1 : i)}
                                    className="w-full flex items-center justify-between gap-8 p-8 text-left group"
                                >
                                    <span className={`text-[17px] font-black tracking-tight leading-snug transition-colors ${openFaq === i ? 'text-[#0071e3]' : 'text-[#1d1d1f] group-hover:text-[#0071e3]'}`}>
                                        <span className="opacity-20 mr-4 text-[12px] font-black font-mono">0{i+1}</span>
                                        {faq.q}
                                    </span>
                                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 transition-all duration-500 ${openFaq === i ? 'bg-[#0071e3] text-white rotate-45' : 'bg-[#f5f5f7] text-[#86868b] group-hover:bg-[#0071e3]/10 group-hover:text-[#0071e3]'}`}>
                                        <Plus size={20} strokeWidth={2.5} />
                                    </div>
                                </button>
                                <AnimatePresence>
                                    {openFaq === i && (
                                        <motion.div 
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            className="overflow-hidden"
                                        >
                                            <div className="px-10 pb-10 pt-2 flex items-start gap-6">
                                                <div className="h-20 w-[2px] bg-[#0071e3]/20 shrink-0" />
                                                <p className="text-[15px] text-[#6e6e73] leading-relaxed italic font-light pr-12">{faq.a}</p>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* SYNC TERMINAL CTA */}
            <section className="bg-[#0071e3] py-24 px-6 text-center text-white relative group overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                <motion.div {...reveal} className="max-w-[700px] mx-auto relative z-10">
                    <h2 className="text-[clamp(36px,6vw,68px)] font-black tracking-tighter leading-[0.9] mb-10">Initiate your <br /><span className="italic opacity-80 decoration-white/30 underline underline-offset-[16px]">Ascension</span> protocol.</h2>
                    <p className="text-[19px] text-white/80 font-light mb-14 max-w-[500px] mx-auto leading-relaxed">Commit to the high-fidelity roadmap. Transform clinical theory into production mastery.</p>
                    <Link to="/courses" className="h-20 px-14 bg-white text-[#0071e3] rounded-[24px] text-[15px] font-black uppercase tracking-[0.3em] hover:scale-105 transition-all shadow-2xl active:scale-95 inline-flex items-center gap-4 group/btn">
                        Explore Repositories <HelpCircle size={20} className="transition-transform group-hover/btn:scale-110" />
                    </Link>
                </motion.div>
            </section>
        </div>
    );
}

export default ContactPage;
