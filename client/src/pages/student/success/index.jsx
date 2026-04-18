import React from "react";
import { motion } from "framer-motion";
import { CheckCircle2, ArrowRight, BookOpen, Layout } from "lucide-react";
import { Link } from "react-router-dom";

function SuccessPage() {
    return (
        <div className="min-h-screen bg-[#0a0a0f] text-[#f5f5f7] font-['Inter'] flex flex-col items-center justify-center p-6 selection:bg-[#0071e3]/30">
            <div className="max-w-[500px] w-full text-center">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    className="w-24 h-24 bg-[#30d158]/10 text-[#30d158] rounded-[34px] flex items-center justify-center mx-auto mb-10 shadow-2xl shadow-[#30d158]/10"
                >
                    <CheckCircle2 size={48} strokeWidth={2.5} />
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                >
                    <p className="text-[11px] font-black text-[#0071e3] uppercase tracking-[0.4em] mb-6">Enrolment Synchronised</p>
                    <h1 className="text-[clamp(32px,5vw,48px)] font-black tracking-[-2px] leading-[0.95] mb-8">
                        Protocol <span className="italic bg-[linear-gradient(90deg,#0071e3,#00d4ff)] bg-clip-text text-transparent">Activated.</span>
                    </h1>
                    <p className="text-[16px] text-[#86868b] leading-relaxed mb-12 font-light">
                        Your transaction has been validated and your access nodes have been initialized. You can now begin your transition to mastery.
                    </p>

                    <div className="grid grid-cols-1 gap-4">
                        <Link to="/student-courses" className="h-16 bg-[#0071e3] text-white rounded-2xl flex items-center justify-center gap-3 font-black text-[14px] uppercase tracking-[0.2em] hover:bg-[#0077ed] transition-all shadow-xl shadow-[#0071e3]/20 active:scale-95 group">
                            Access My Repositories <BookOpen size={18} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link to="/dashboard" className="h-16 bg-white/[0.03] border border-white/[0.08] text-white rounded-2xl flex items-center justify-center gap-3 font-black text-[14px] uppercase tracking-[0.2em] hover:bg-white/[0.05] transition-all active:scale-95">
                            <Layout size={18} /> View Dashboard
                        </Link>
                    </div>
                </motion.div>

                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="mt-16 pt-16 border-t border-white/[0.05] text-[10px] font-black text-[#444] uppercase tracking-[0.3em]"
                >
                    Reference ID: {Math.random().toString(36).substring(7).toUpperCase()} · BhavinAcademy.
                </motion.div>
            </div>
        </div>
    );
}

export default SuccessPage;
