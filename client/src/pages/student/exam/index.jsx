import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useParams, Link } from "react-router-dom";
import { 
    Clock, 
    ChevronLeft, 
    ChevronRight, 
    CheckCircle2, 
    XCircle, 
    AlertCircle, 
    RotateCcw, 
    Eye, 
    Flag, 
    BookOpen,
    ArrowLeft,
    Share2,
    Calendar,
    Award
} from "lucide-react";

// ─── QUESTIONS DATA (Injected from Demo) ────────────────────────────────
const questions = [
    {
        text: "Which layer of the OSI model is responsible for logical addressing and routing?",
        options: ["Data Link Layer", "Network Layer", "Transport Layer", "Session Layer"],
        answer: 1,
        explanation: "The Network Layer (Layer 3) handles logical addressing (IP addresses) and determines the best path for data to travel across networks."
    },
    {
        text: "What is the default subnet mask for a Class C IP address?",
        options: ["255.0.0.0", "255.255.0.0", "255.255.255.0", "255.255.255.128"],
        answer: 2,
        explanation: "Class C addresses use a default subnet mask of 255.255.255.0 (/24), allowing up to 254 usable host addresses per network."
    },
    {
        text: "Which command is used to display the routing table on a Cisco router?",
        options: ["show ip arp", "show interfaces", "show ip route", "show version"],
        answer: 2,
        explanation: "show ip route displays the router's routing table, including directly connected networks, static routes, and dynamically learned routes."
    },
    {
        text: "What does the acronym OSPF stand for?",
        options: ["Open Shortest Path First", "Open System Path Forwarding", "Optimal Shortest Path Framework", "Open Standard Protocol Framework"],
        answer: 0,
        explanation: "OSPF stands for Open Shortest Path First — a link-state routing protocol that uses Dijkstra's algorithm to calculate the shortest path."
    },
    {
        text: "Which protocol operates at Layer 4 of the OSI model and provides reliable, connection-oriented communication?",
        options: ["UDP", "IP", "TCP", "ICMP"],
        answer: 2,
        explanation: "TCP (Transmission Control Protocol) operates at Layer 4 (Transport Layer) and ensures reliable data delivery using acknowledgements."
    },
    {
        text: "A switch receives a frame with an unknown destination MAC address. What does it do?",
        options: ["Drops the frame", "Sends it back to the source", "Floods it out all ports except the source", "Routes it to the default gateway"],
        answer: 2,
        explanation: "When a switch receives a frame destined for an unknown MAC address, it floods the frame out all ports except the one it was received on — this is called unknown unicast flooding."
    },
    {
        text: "Which IP address range is defined as private by RFC 1918?",
        options: ["10.0.0.0 – 10.255.255.255", "172.16.0.0 – 172.31.255.255", "192.168.0.0 – 192.168.255.255", "All of the above"],
        answer: 3,
        explanation: "RFC 1918 defines three private ranges: 10.0.0.0/8, 172.16.0.0/12, and 192.168.0.0/16. All three are correct."
    },
    {
        text: "What is the purpose of the Spanning Tree Protocol (STP)?",
        options: ["To assign IP addresses dynamically", "To prevent routing loops in Layer 3", "To prevent switching loops in Layer 2 networks", "To encrypt traffic between switches"],
        answer: 2,
        explanation: "STP prevents Layer 2 switching loops by placing redundant ports in a blocking state, ensuring only one active path exists."
    },
    {
        text: "Which of the following best describes a VLAN?",
        options: ["A physical grouping", "A logical segmentation at Layer 2", "A routing technique", "Wireless security protocol"],
        answer: 1,
        explanation: "A VLAN is a logical grouping of devices at Layer 2 regardless of physical location. It provides traffic isolation and security."
    },
    {
        text: "What port number does HTTPS use by default?",
        options: ["80", "21", "8080", "443"],
        answer: 3,
        explanation: "HTTPS uses port 443 by default. It encrypts communication using TLS/SSL, providing secure transmission."
    }
];

function StudentExamPage() {
    const { id } = useParams();
    const [current, setCurrent] = useState(0);
    const [userAnswers, setUserAnswers] = useState(new Array(questions.length).fill(null));
    const [revealed, setRevealed] = useState(new Array(questions.length).fill(false));
    const [time, setTime] = useState(15 * 60); // 15 mins
    const [isFinished, setIsFinished] = useState(false);
    const [showReview, setShowReview] = useState(false);
    const timerRef = useRef(null);

    useEffect(() => {
        if (!isFinished && time > 0) {
            timerRef.current = setInterval(() => setTime(t => t - 1), 1000);
        } else if (time === 0) {
            finishExam();
        }
        return () => clearInterval(timerRef.current);
    }, [isFinished, time]);

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60).toString().padStart(2, '0');
        const s = (seconds % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    };

    const handleSelect = (idx) => {
        if (revealed[current]) return;
        const newAnswers = [...userAnswers];
        newAnswers[current] = idx;
        setUserAnswers(newAnswers);
        
        const newReveals = [...revealed];
        newReveals[current] = true;
        setRevealed(newReveals);
    };

    const navigate = (dir) => {
        setCurrent(Math.max(0, Math.min(questions.length - 1, current + dir)));
    };

    const finishExam = () => {
        clearInterval(timerRef.current);
        setIsFinished(true);
    };

    const retakeExam = () => {
        setCurrent(0);
        setUserAnswers(new Array(questions.length).fill(null));
        setRevealed(new Array(questions.length).fill(false));
        setTime(15 * 60);
        setIsFinished(false);
        setShowReview(false);
    };

    const stats = isFinished ? (() => {
        let correct = 0, wrong = 0, skipped = 0;
        userAnswers.forEach((ans, i) => {
            if (ans === null || ans === -1) skipped++;
            else if (ans === questions[i].answer) correct++;
            else wrong++;
        });
        const score = Math.round((correct / questions.length) * 100);
        return { score, correct, wrong, skipped };
    })() : null;

    if (isFinished) {
        return (
            <div className="min-h-screen bg-[#0a0a0f] text-[#f5f5f7] font-['Inter'] selection:bg-[#0071e3]/30">
                <div className="max-w-[700px] mx-auto py-24 px-6 text-center">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }} 
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-[#1d1d1f] rounded-[40px] p-12 md:p-20 border border-white/[0.08] shadow-2xl relative overflow-hidden"
                    >
                         <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-transparent via-[#0071e3] to-transparent opacity-40 shadow-[0_0_20px_rgba(0,113,227,0.4)]" />
                         
                         <span className="text-8xl mb-10 block filter drop-shadow-[0_0_30px_rgba(255,255,255,0.1)]">
                            {stats.score >= 70 ? "🏆" : "📚"}
                         </span>

                         <h2 className={`text-9xl font-black mb-4 tracking-tighter leading-none ${stats.score >= 70 ? "bg-gradient-to-br from-[#30d158] to-[#00d4ff] bg-clip-text text-transparent" : "bg-gradient-to-br from-[#ff453a] to-[#ff9f0a] bg-clip-text text-transparent"}`}>
                            {stats.score}%
                         </h2>

                         <p className="text-[12px] text-[#86868b] uppercase tracking-[0.3em] font-black mb-12">
                            {stats.score >= 70 ? "Performance Protocol: Cleared" : "Knowledge Gap Detected: Study Required"}
                         </p>

                         <div className="grid grid-cols-3 gap-4 mb-14">
                            <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6">
                                <div className="text-3xl font-black text-[#30d158]">{stats.correct}</div>
                                <div className="text-[10px] text-[#444] uppercase font-black tracking-widest mt-1">Correct</div>
                            </div>
                            <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6">
                                <div className="text-3xl font-black text-[#ff453a]">{stats.wrong}</div>
                                <div className="text-[10px] text-[#444] uppercase font-black tracking-widest mt-1">Faulty</div>
                            </div>
                            <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6">
                                <div className="text-3xl font-black text-[#0071e3]">{stats.skipped}</div>
                                <div className="text-[10px] text-[#444] uppercase font-black tracking-widest mt-1">Untouched</div>
                            </div>
                         </div>

                         <div className="flex flex-wrap gap-4 justify-center">
                            <button onClick={retakeExam} className="h-14 px-10 rounded-2xl border border-white/[0.1] text-white font-black text-[13px] uppercase tracking-widest hover:bg-white/[0.05] transition-all flex items-center gap-3 active:scale-95">
                                <RotateCcw size={18} /> Restart Initialisation
                            </button>
                            <button onClick={() => setShowReview(!showReview)} className="h-14 px-10 rounded-2xl bg-[#0071e3] text-white font-black text-[13px] uppercase tracking-widest hover:bg-[#0077ed] transition-all flex items-center gap-3 shadow-xl shadow-[#0071e3]/20 active:scale-95">
                                <Eye size={18} strokeWidth={2.5} /> {showReview ? "Hide Analysis" : "Audit Analysis"}
                            </button>
                         </div>
                    </motion.div>

                    <AnimatePresence>
                        {showReview && (
                            <motion.div 
                                initial={{ opacity: 0, y: 30 }} 
                                animate={{ opacity: 1, y: 0 }} 
                                exit={{ opacity: 0, y: 30 }}
                                className="mt-16 text-left space-y-8"
                            >
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="h-[1px] flex-1 bg-white/[0.06]" />
                                    <span className="text-[10px] font-black text-[#444] uppercase tracking-[0.4em]">Audit Trail</span>
                                    <div className="h-[1px] flex-1 bg-white/[0.06]" />
                                </div>
                                {questions.map((q, i) => (
                                    <div key={i} className="bg-[#111118] border border-white/[0.06] rounded-3xl p-8 relative group">
                                         <div className={`absolute top-0 right-8 px-4 py-1.5 rounded-b-xl text-[9px] font-black uppercase tracking-widest ${userAnswers[i] === q.answer ? 'bg-[#30d158]/10 text-[#30d158]' : userAnswers[i] === null ? 'bg-[#ff9f0a]/10 text-[#ff9f0a]' : 'bg-[#ff453a]/10 text-[#ff453a]'}`}>
                                            Node Q{i+1}: {userAnswers[i] === q.answer ? 'Valid' : userAnswers[i] === null ? 'Skipped' : 'Error'}
                                         </div>
                                         <p className="text-[17px] text-[#f5f5f7] mb-8 font-medium leading-relaxed pr-20">{q.text}</p>
                                         <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            {q.options.map((opt, oi) => (
                                                <div key={oi} className={`p-4 rounded-xl border text-[13px] font-medium transition-all ${oi === q.answer ? 'bg-[#30d158]/5 border-[#30d158]/20 text-[#30d158]' : oi === userAnswers[i] ? 'bg-[#ff453a]/5 border-[#ff453a]/20 text-[#ff453a]' : 'bg-white/[0.01] border-white/[0.04] text-[#444]'}`}>
                                                    <span className="opacity-40 mr-2">{String.fromCharCode(65 + oi)}.</span> {opt}
                                                </div>
                                            ))}
                                         </div>
                                         <div className="mt-8 p-6 rounded-2xl bg-white/[0.02] border border-white/[0.04] relative">
                                             <div className="absolute -top-3 left-6 px-3 py-1 bg-[#111118] border border-white/[0.06] rounded-full text-[8px] font-black text-[#0071e3] uppercase tracking-widest">Logic Breakdown</div>
                                             <p className="text-[12px] text-[#86868b] leading-relaxed italic pr-4">{q.explanation}</p>
                                         </div>
                                    </div>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <Link to="/courses" className="mt-20 inline-flex items-center gap-3 text-[#333] hover:text-white transition-all text-xs font-black uppercase tracking-widest group">
                        <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" /> Terminate Instance & Exit
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0a0a0f] text-[#f5f5f7] font-['Inter'] selection:bg-[#0071e3]/30">
            
            {/* NAV BAR */}
            <nav className="sticky top-0 z-[100] h-[64px] bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-white/[0.04] flex items-center px-8">
                <div className="max-w-[1200px] w-full mx-auto flex items-center justify-between">
                    <div className="text-[18px] font-black tracking-tighter">Bhvin<span className="text-[#0071e3]">Academy.</span></div>
                    <div className="flex items-center gap-6">
                        <span className="text-[10px] font-black text-[#444] uppercase tracking-widest hidden md:block">Active Session: CCNA_EXAM_01</span>
                        <div className={`flex items-center gap-3 px-5 py-2.5 bg-[#111118] border rounded-2xl text-[14px] font-black transition-all shadow-inner ${time < 120 ? 'border-[#ff453a]/30 text-[#ff453a] shadow-[#ff453a]/5' : 'border-white/[0.06] text-white'}`}>
                            <Clock size={16} className="opacity-40" />
                            {formatTime(time)}
                        </div>
                    </div>
                </div>
            </nav>

            <div className="max-w-[860px] mx-auto py-16 px-6">
                
                {/* HEADER */}
                <header className="mb-14">
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#333] mb-6">
                        <Link to="/courses" className="text-[#0071e3] hover:opacity-80 transition-opacity">Repository</Link>
                        <span className="opacity-20">/</span>
                        <span className="text-[#444]">Practice Exam 0x01</span>
                    </div>
                    <div className="flex flex-col gap-2">
                        <h1 className="text-[clamp(32px,5vw,48px)] font-black tracking-tighter leading-none mb-4">
                            Exam <span className="bg-gradient-to-r from-[#0071e3] to-[#00d4ff] bg-clip-text text-transparent italic">Protocol.</span>
                        </h1>
                        <div className="flex flex-wrap gap-8">
                            <div className="flex items-center gap-2.5">
                                <div className="w-1 h-1 rounded-full bg-[#0071e3]" />
                                <span className="text-[12px] font-black text-[#444] uppercase tracking-widest">{questions.length} Query Nodes</span>
                            </div>
                            <div className="flex items-center gap-2.5">
                                <div className="w-1 h-1 rounded-full bg-[#0071e3]" />
                                <span className="text-[12px] font-black text-[#444] uppercase tracking-widest">Logic Complexity: High</span>
                            </div>
                        </div>
                    </div>
                </header>

                {/* PROGRESS MONITOR */}
                <div className="mb-12">
                    <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-[0.2em] text-[#444] mb-4 pr-1">
                        <span>Node {current + 1} <span className="opacity-20 mx-1">/</span> {questions.length}</span>
                        <span>{userAnswers.filter(a => a !== null).length} Committed</span>
                    </div>
                    <div className="h-[3px] bg-white/[0.02] rounded-full overflow-hidden">
                        <motion.div 
                            initial={{ width: 0 }} 
                            animate={{ width: `${((current + 1) / questions.length) * 100}%` }} 
                            className="h-full bg-gradient-to-r from-[#0071e3] to-[#00d4ff] shadow-[0_0_15px_rgba(0,113,227,0.4)]" 
                        />
                    </div>
                </div>

                {/* VISUAL NAVIGATION GRID */}
                <div className="flex flex-wrap gap-2.5 mb-14">
                    {questions.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setCurrent(i)}
                            className={`w-10 h-10 rounded-xl border text-[11px] font-black transition-all ${current === i ? 'border-[#0071e3] bg-[#0071e3]/10 text-[#0071e3] shadow-lg shadow-[#0071e3]/10' : userAnswers[i] !== null ? 'border-[#30d158]/40 bg-[#30d158]/5 text-[#30d158]' : 'border-white/[0.04] bg-white/[0.01] text-[#333] hover:border-white/[0.1] hover:text-white'}`}
                        >
                            {String(i + 1).padStart(2, '0')}
                        </button>
                    ))}
                </div>

                {/* CORE QUESTION NODE */}
                <AnimatePresence mode="wait">
                    <motion.div 
                        key={current} 
                        initial={{ opacity: 0, x: 20 }} 
                        animate={{ opacity: 1, x: 0 }} 
                        exit={{ opacity: 0, x: -20 }}
                        className="bg-[#111118] border border-white/[0.06] rounded-[40px] p-10 md:p-14 mb-10 shadow-2xl relative overflow-hidden group"
                    >
                        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#0071e3]/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none group-hover:bg-[#0071e3]/10 transition-colors duration-1000" />
                        
                        <div className="relative z-10">
                            <div className="flex items-center gap-4 mb-12">
                                <span className="text-[10px] font-black text-[#0071e3] uppercase tracking-[0.4em]">Node Identifier {String(current + 1).padStart(2, '0')}</span>
                                <div className="h-[1px] flex-1 bg-white/[0.03]" />
                            </div>
                            
                            <p className="text-[22px] font-medium text-[#f5f5f7] mb-12 leading-relaxed tracking-tight underline-offset-8 decoration-[#0071e3]/20">
                                {questions[current].text}
                            </p>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {questions[current].options.map((opt, i) => (
                                    <button
                                        key={i}
                                        onClick={() => handleSelect(i)}
                                        disabled={revealed[current]}
                                        className={`group relative w-full p-6 rounded-2xl border text-left flex items-start gap-4 transition-all overflow-hidden ${revealed[current] ? (i === questions[current].answer ? 'border-[#30d158]/40 bg-[#30d158]/10 text-white shadow-lg shadow-[#30d158]/5' : i === userAnswers[current] ? 'border-[#ff453a]/40 bg-[#ff453a]/10 text-white' : 'border-white/[0.02] bg-transparent text-[#222]') : (userAnswers[current] === i ? 'border-[#0071e3]/50 bg-[#0071e3]/10 text-white shadow-xl shadow-[#0071e3]/10' : 'border-white/[0.06] bg-white/[0.02] text-[#86868b] hover:border-[#0071e3]/40 hover:bg-white/[0.04] hover:text-white')}`}
                                    >
                                        <div className={`w-6 h-6 rounded-xl border-2 shrink-0 flex items-center justify-center transition-all ${revealed[current] ? (i === questions[current].answer ? 'border-[#30d158] bg-[#30d158]' : i === userAnswers[current] ? 'border-[#ff453a] bg-[#ff453a]' : 'border-white/5') : (userAnswers[current] === i ? 'border-[#0071e3] bg-[#0071e3]' : 'border-white/10 group-hover:border-[#0071e3]')}`}>
                                            <div className={`w-2 h-2 rounded-full bg-white transition-all ${userAnswers[current] === i || (revealed[current] && i === questions[current].answer) ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`} />
                                        </div>
                                        <div className="flex-1">
                                            <span className="text-[11px] font-black text-[#333] mr-3 group-hover:text-[#0071e3] transition-colors">{String.fromCharCode(65 + i)}</span>
                                            <span className="text-[15px] font-medium line-clamp-2 leading-snug">{opt}</span>
                                        </div>
                                    </button>
                                ))}
                            </div>

                            <AnimatePresence>
                                {revealed[current] && (
                                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} className="mt-12 pt-10 border-t border-white/[0.04]">
                                        <div className={`flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.3em] mb-4 ${userAnswers[current] === questions[current].answer ? 'text-[#30d158]' : 'text-[#ff453a]'}`}>
                                            {userAnswers[current] === questions[current].answer ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
                                            Node Valuation: {userAnswers[current] === questions[current].answer ? 'Success' : 'Faulty'}
                                        </div>
                                        <div className="p-6 rounded-3xl bg-white/[0.01] border border-white/[0.04] text-[14px] text-[#86868b] leading-relaxed italic relative">
                                            <div className="absolute top-4 right-6 opacity-10 font-black text-4xl">?</div>
                                            {questions[current].explanation}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>
                </AnimatePresence>

                {/* FOOTER CONTROL SEQUENCE */}
                <div className="flex items-center justify-between gap-6">
                    <button onClick={() => navigate(-1)} disabled={current === 0} className="h-14 px-10 rounded-2xl border border-white/[0.06] bg-white/[0.01] text-[#444] hover:text-white hover:border-white/[0.1] transition-all font-black text-[13px] uppercase tracking-widest disabled:opacity-5 flex items-center gap-3 active:scale-95">
                        <ChevronLeft size={18} /> Previous Sequence
                    </button>
                    
                    {current < questions.length - 1 ? (
                        <button onClick={() => navigate(1)} className="h-14 px-10 rounded-2xl bg-[#111118] text-white border border-white/[0.06] hover:bg-white/[0.04] transition-all font-black text-[13px] uppercase tracking-widest flex items-center gap-3 active:scale-95">
                            Next Stage <ChevronRight size={18} />
                        </button>
                    ) : (
                        <button onClick={finishExam} className="h-16 px-12 rounded-[24px] bg-[#0071e3] text-white font-black text-[14px] uppercase tracking-[0.2em] hover:bg-[#0077ed] transition-all shadow-2xl shadow-[#0071e3]/30 flex items-center gap-3 active:scale-95">
                            Sync Core & Finalize <CheckCircle2 size={20} />
                        </button>
                    )}
                </div>

            </div>
        </div>
    );
}

export default StudentExamPage;
