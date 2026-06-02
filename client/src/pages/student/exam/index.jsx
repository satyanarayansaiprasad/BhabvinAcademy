import React, { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Clock } from "lucide-react";

// ─── QUESTIONS DATA ────────────────────────────────────────────────────
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
        explanation: "`show ip route` displays the router's routing table, including directly connected networks, static routes, and dynamically learned routes."
    },
    {
        text: "What does the acronym `OSPF` stand for?",
        options: ["Open Shortest Path First", "Open System Path Forwarding", "Optimal Shortest Path Framework", "Open Standard Protocol Framework"],
        answer: 0,
        explanation: "OSPF stands for Open Shortest Path First — a link-state routing protocol that uses Dijkstra's algorithm to calculate the shortest path to all known destinations."
    },
    {
        text: "Which protocol operates at Layer 4 of the OSI model and provides reliable, connection-oriented communication?",
        options: ["UDP", "IP", "TCP", "ICMP"],
        answer: 2,
        explanation: "TCP (Transmission Control Protocol) operates at Layer 4 (Transport Layer) and ensures reliable data delivery using acknowledgements, sequencing, and flow control."
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
        explanation: "RFC 1918 defines three private ranges: 10.0.0.0/8, 172.16.0.0/12, and 192.168.0.0/16. All three are correct, so 'All of the above' is the right answer."
    },
    {
        text: "What is the purpose of the Spanning Tree Protocol (STP)?",
        options: ["To assign IP addresses dynamically", "To prevent routing loops in Layer 3", "To prevent switching loops in Layer 2 networks", "To encrypt traffic between switches"],
        answer: 2,
        explanation: "STP (IEEE 802.1D) prevents Layer 2 switching loops by placing redundant ports in a blocking state, ensuring only one active path exists between any two network nodes."
    },
    {
        text: "Which of the following best describes a VLAN?",
        options: ["A physical grouping of devices in the same room", "A logical segmentation of a network at Layer 2", "A routing technique used between ISPs", "A type of wireless security protocol"],
        answer: 1,
        explanation: "A VLAN (Virtual LAN) is a logical grouping of devices at Layer 2 regardless of physical location. It provides traffic isolation, security, and improved network management."
    },
    {
        text: "What port number does HTTPS use by default?",
        options: ["80", "21", "8080", "443"],
        answer: 3,
        explanation: "HTTPS (HTTP Secure) uses port 443 by default. It encrypts communication using TLS/SSL, providing secure transmission over the web."
    }
];

function StudentExamPage() {
    const { id } = useParams();
    const [current, setCurrent] = useState(0);
    const [userAnswers, setUserAnswers] = useState(new Array(questions.length).fill(null)); // null=unanswered, -1=skipped, 0-3=chosen
    const [revealed, setRevealed] = useState(new Array(questions.length).fill(false));
    const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 minutes
    const [isFinished, setIsFinished] = useState(false);
    const [showReview, setShowReview] = useState(false);
    const timerRef = useRef(null);

    useEffect(() => {
        if (!isFinished && timeLeft > 0) {
            timerRef.current = setInterval(() => setTimeLeft(t => t - 1), 1000);
        } else if (timeLeft === 0) {
            submitExam();
        }
        return () => clearInterval(timerRef.current);
    }, [isFinished, timeLeft]);

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60).toString().padStart(2, '0');
        const s = (seconds % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    };

    const handleSelectOption = (idx) => {
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

    const skipQuestion = () => {
        if (userAnswers[current] === null) {
            const newAnswers = [...userAnswers];
            newAnswers[current] = -1;
            setUserAnswers(newAnswers);
        }
        if (current < questions.length - 1) navigate(1);
    };

    const submitExam = () => {
        clearInterval(timerRef.current);
        setIsFinished(true);
    };

    const retakeExam = () => {
        setCurrent(0);
        setUserAnswers(new Array(questions.length).fill(null));
        setRevealed(new Array(questions.length).fill(false));
        setTimeLeft(15 * 60);
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

    const letters = ['A', 'B', 'C', 'D'];

    return (
        <div className="min-h-screen bg-[#0a0a0f] text-[#f5f5f7] font-sans selection:bg-[#0071e3]/30 flex flex-col justify-between">
            
            {/* NAV */}
            <nav className="sticky top-0 z-[100] bg-black/85 backdrop-blur-[20px] border-b border-white/8 h-[52px] flex items-center justify-center">
                <div className="max-w-[1080px] w-full flex items-center justify-between px-6">
                    <div className="text-[18px] font-bold tracking-tight text-[#f5f5f7]">
                        Bhavin<span className="text-[#0071e3]">Academy</span>
                    </div>
                    <ul className="hidden md:flex gap-5 list-none text-left">
                        <li><Link to="/courses" className="text-[13px] text-[#f5f5f7]/60 no-underline hover:text-[#f5f5f7] transition-all">Courses</Link></li>
                        <li><Link to="/blog" className="text-[13px] text-[#f5f5f7]/60 no-underline hover:text-[#f5f5f7] transition-all">Blog</Link></li>
                        <li><Link to="/about" className="text-[13px] text-[#f5f5f7]/60 no-underline hover:text-[#f5f5f7] transition-all">About</Link></li>
                        <li><Link to="/contact" className="text-[13px] text-[#f5f5f7]/60 no-underline hover:text-[#f5f5f7] transition-all">Contact</Link></li>
                    </ul>
                    <button className="bg-[#0071e3] text-white border-none py-[7px] px-[16px] rounded-[980px] text-[13px] font-medium hover:bg-[#0077ed] transition-colors cursor-pointer">
                        Sign in
                    </button>
                </div>
            </nav>

            {/* EXAM WRAPPER */}
            <div className="max-w-[860px] w-full mx-auto p-[48px_24px_80px] flex-1 text-left">
                {!isFinished ? (
                    <div className="w-full">
                        {/* Header */}
                        <div className="mb-10">
                            <div className="text-[12px] text-[#86868b] mb-4 flex items-center gap-1.5 font-light">
                                <Link to="/courses" className="text-[#0071e3] no-underline hover:underline">Courses</Link>
                                <span className="opacity-40">›</span>
                                <Link to="/courses" className="text-[#0071e3] no-underline hover:underline">Cisco CCNA Bootcamp</Link>
                                <span className="opacity-40">›</span>
                                <span className="text-[#86868b]">Practice Exam</span>
                            </div>
                            <div className="flex items-start justify-between gap-5 flex-wrap">
                                <div>
                                    <h1 className="text-[clamp(26px,4vw,38px)] font-extrabold tracking-tight leading-[1.1]">
                                        CCNA <em className="not-italic bg-gradient-to-r from-[#0071e3] to-[#00d4ff] bg-clip-text text-transparent">Practice</em> Exam
                                    </h1>
                                    <div className="flex gap-5 mt-3.5 flex-wrap">
                                        <span className="text-[13px] text-[#86868b] flex items-center gap-1.5">
                                            <span className="w-1.5 h-1.5 rounded-full bg-[#0071e3] inline-block" />
                                            {questions.length} Questions
                                        </span>
                                        <span className="text-[13px] text-[#86868b] flex items-center gap-1.5">
                                            <span className="w-1.5 h-1.5 rounded-full bg-[#0071e3] inline-block" />
                                            Networking Fundamentals
                                        </span>
                                        <span className="text-[13px] text-[#86868b] flex items-center gap-1.5">
                                            <span className="w-1.5 h-1.5 rounded-full bg-[#0071e3] inline-block" />
                                            Intermediate
                                        </span>
                                    </div>
                                </div>
                                <div className={`bg-[#1d1d1f] border rounded-full py-1.5 px-4 text-[13px] font-semibold flex items-center gap-1.5 transition-colors ${timeLeft <= 120 ? 'border-red-500/40 text-red-500' : 'border-white/10 text-[#f5f5f7]'}`}>
                                    <Clock className="w-3.5 h-3.5 opacity-60" />
                                    <span>{formatTime(timeLeft)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Progress */}
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-[13px] text-[#86868b] font-medium">Question {current + 1} of {questions.length}</span>
                            <span className="text-[13px] font-bold text-[#f5f5f7]">
                                {userAnswers.filter(a => a !== null && a !== -1).length} answered
                            </span>
                        </div>
                        <div className="bg-[#1d1d1f] rounded-full h-[4px] mb-10 overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-[#0071e3] to-[#00d4ff] rounded-full transition-all duration-500" style={{ width: `${((current + 1) / questions.length) * 100}%` }} />
                        </div>

                        {/* Question Map */}
                        <div className="flex gap-2 flex-wrap mb-6">
                            {questions.map((_, i) => {
                                let mapClass = "border-white/10 bg-white/3 text-[#6e6e73]";
                                if (i === current) mapClass = "border-[#0071e3] bg-[#0071e3]/20 text-[#0071e3]";
                                else if (userAnswers[i] === -1) mapClass = "border-[#ff9f0a]/40 bg-[#ff9f0a]/10 text-[#ff9f0a]";
                                else if (userAnswers[i] !== null) mapClass = "border-[#30d158]/40 bg-[#30d158]/10 text-[#30d158]";

                                return (
                                    <button
                                        key={i}
                                        onClick={() => setCurrent(i)}
                                        className={`w-8 h-8 rounded-lg border text-[11px] font-semibold flex items-center justify-center cursor-pointer transition-all ${mapClass} hover:border-[#0071e3]/50 hover:text-[#0071e3]`}
                                    >
                                        {i + 1}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Question Card */}
                        <div className="bg-[#1d1d1f] border border-white/8 rounded-[20px] p-10 mb-6">
                            <div className="text-[12px] font-semibold text-[#0071e3] uppercase tracking-wider mb-4 flex items-center gap-2">
                                Question {String(current + 1).padStart(2, '0')}
                                <span className="flex-1 h-[1px] bg-[#0071e3]/20" />
                            </div>
                            <p className="text-[18px] font-medium leading-[1.65] text-[#f5f5f7] mb-8">
                                {questions[current].text}
                            </p>
                            <div className="flex flex-col gap-3">
                                {questions[current].options.map((opt, i) => {
                                    let optionClass = "border-white/10 bg-white/2 hover:border-[#0071e3]/50 hover:bg-[#0071e3]/5 hover:translate-x-[3px]";
                                    if (userAnswers[current] === i) optionClass = "border-[#0071e3] bg-[#0071e3]/12";
                                    if (revealed[current]) {
                                        if (i === questions[current].answer) optionClass = "border-[#30d158] bg-[#30d158]/10 pointer-events-none";
                                        else if (userAnswers[current] === i && i !== questions[current].answer) optionClass = "border-[#ff453a] bg-[#ff453a]/10 pointer-events-none";
                                        else optionClass = "border-white/10 bg-transparent opacity-50 pointer-events-none";
                                    }

                                    return (
                                        <div
                                            key={i}
                                            onClick={() => handleSelectOption(i)}
                                            className={`flex items-start gap-4 p-[16px_20px] rounded-[14px] border-2 cursor-pointer transition-all ${optionClass}`}
                                        >
                                            <div className={`w-[22px] h-[22px] rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${userAnswers[current] === i ? 'border-[#0071e3] bg-[#0071e3]' : revealed[current] && i === questions[current].answer ? 'border-[#30d158] bg-[#30d158]' : revealed[current] && userAnswers[current] === i ? 'border-[#ff453a] bg-[#ff453a]' : 'border-white/20'}`}>
                                                {(userAnswers[current] === i || (revealed[current] && i === questions[current].answer)) && (
                                                    <div className="w-2 h-2 rounded-full bg-white" />
                                                )}
                                            </div>
                                            <div className={`text-[11px] font-bold mt-[3px] shrink-0 transition-colors ${userAnswers[current] === i ? 'text-[#0071e3]' : revealed[current] && i === questions[current].answer ? 'text-[#30d158]' : revealed[current] && userAnswers[current] === i ? 'text-[#ff453a]' : 'text-[#86868b]'}`}>
                                                {letters[i]}
                                            </div>
                                            <div className="text-[15px] leading-[1.6] text-[#d1d1d6] font-normal">
                                                {opt}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {revealed[current] && (
                                <div className={`border rounded-[12px] p-[18px_20px] mt-5 ${userAnswers[current] === questions[current].answer ? 'bg-[#30d158]/7 border-[#30d158]/25 text-[#30d158]' : 'bg-[#ff453a]/7 border-[#ff453a]/25 text-[#ff453a]'}`}>
                                    <div className="text-[12px] font-bold uppercase tracking-wider mb-[6px]">
                                        {userAnswers[current] === questions[current].answer ? '✓ Correct' : '✗ Incorrect'}
                                    </div>
                                    <p className="text-[14px] text-[#86868b] leading-[1.65] font-normal">
                                        {questions[current].explanation}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Actions */}
                        <div className="flex items-center justify-between gap-3">
                            <button
                                onClick={() => navigate(-1)}
                                disabled={current === 0}
                                className="bg-transparent text-[#86868b] border border-white/12 p-[12px_24px] rounded-[980px] text-[14px] font-medium cursor-pointer transition-all hover:text-[#f5f5f7] hover:border-white/30 disabled:opacity-30 disabled:cursor-default"
                            >
                                ← Previous
                            </button>
                            <div className="flex gap-[10px]">
                                {!revealed[current] && (
                                    <button
                                        onClick={skipQuestion}
                                        className="bg-transparent text-[#86868b] border border-white/12 p-[12px_24px] rounded-[980px] text-[14px] font-medium cursor-pointer transition-all hover:text-[#f5f5f7] hover:border-white/30"
                                    >
                                        Skip
                                    </button>
                                )}
                                {current < questions.length - 1 ? (
                                    <button
                                        onClick={() => navigate(1)}
                                        className="bg-[#0071e3] text-white border-none p-[12px_28px] rounded-[980px] text-[14px] font-semibold cursor-pointer hover:bg-[#0077ed] transition-colors"
                                    >
                                        Next →
                                    </button>
                                ) : (
                                    <button
                                        onClick={submitExam}
                                        className="bg-gradient-to-r from-[#0071e3] to-[#00a6ff] text-white border-none p-[12px_32px] rounded-[980px] text-[14px] font-bold cursor-pointer hover:shadow-[0_6px_28px_rgba(0,113,227,0.5)] transition-all shadow-[0_4px_20px_rgba(0,113,227,0.35)]"
                                    >
                                        Submit Exam
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="w-full">
                        {/* Results Screen */}
                        <div className="bg-[#1d1d1f] border border-white/8 rounded-[24px] p-[56px_48px] text-center mb-6">
                            <span className="text-[72px] mb-6 block">{stats.score >= 70 ? '🎉' : '📚'}</span>
                            <div className={`text-[80px] font-black tracking-tighter leading-none mb-2 bg-gradient-to-r bg-clip-text text-transparent ${stats.score >= 70 ? 'from-[#30d158] to-[#00d4ff]' : 'from-[#ff453a] to-[#ff9f0a]'}`}>
                                {stats.score}%
                            </div>
                            <div className="text-[14px] text-[#86868b] mb-8 font-light">
                                {stats.score >= 70 
                                    ? 'Well done! You passed the practice exam.' 
                                    : 'Keep studying — you need 70% to pass. Review your answers below.'}
                            </div>
                            <div className="grid grid-cols-3 gap-4 mb-10 max-w-[500px] mx-auto">
                                <div className="bg-white/4 border border-white/8 rounded-[14px] p-5">
                                    <div className="text-[28px] font-extrabold text-[#30d158] leading-none mb-1">{stats.correct}</div>
                                    <div className="text-[12px] text-[#6e6e73] font-medium">Correct</div>
                                </div>
                                <div className="bg-white/4 border border-white/8 rounded-[14px] p-5">
                                    <div className="text-[28px] font-extrabold text-[#ff453a] leading-none mb-1">{stats.wrong}</div>
                                    <div className="text-[12px] text-[#6e6e73] font-medium">Incorrect</div>
                                </div>
                                <div className="bg-white/4 border border-white/8 rounded-[14px] p-5">
                                    <div className="text-[28px] font-extrabold text-[#0071e3] leading-none mb-1">{stats.skipped}</div>
                                    <div className="text-[12px] text-[#6e6e73] font-medium">Skipped</div>
                                </div>
                            </div>
                            <div className="flex gap-3 justify-center flex-wrap">
                                <button 
                                    onClick={retakeExam}
                                    className="bg-transparent text-[#0071e3] border border-[#0071e3] p-[12px_28px] rounded-[980px] text-[14px] font-semibold cursor-pointer hover:bg-[#0071e3]/10 transition-colors"
                                >
                                    ↩ Retake Exam
                                </button>
                                <button 
                                    onClick={() => setShowReview(!showReview)}
                                    className="bg-[#0071e3] text-white border-none p-[12px_28px] rounded-[980px] text-[14px] font-semibold cursor-pointer hover:bg-[#0077ed] transition-colors"
                                >
                                    Review Answers
                                </button>
                            </div>
                        </div>

                        {showReview && (
                            <div className="space-y-4">
                                {questions.map((q, qi) => {
                                    const ua = userAnswers[qi];
                                    const isCorrect = ua === q.answer;
                                    const status = ua === null || ua === -1 ? 'skipped' : isCorrect ? 'correct' : 'wrong';
                                    const badge = { correct: '✓ Correct', wrong: '✗ Incorrect', skipped: '— Skipped' }[status];
                                    const badgeColorClass = { correct: 'text-[#30d158]', wrong: 'text-[#ff453a]', skipped: 'text-[#ff9f0a]' }[status];
                                    
                                    return (
                                        <div key={qi} className="bg-[#1d1d1f] border border-white/7 rounded-[16px] p-7">
                                            <div className={`text-[12px] font-bold uppercase tracking-wider mb-2.5 ${badgeColorClass}`}>
                                                Q{qi + 1} — {badge}
                                            </div>
                                            <p className="text-[15px] text-[#f5f5f7] mb-4 leading-[1.6]">
                                                {q.text}
                                            </p>
                                            <div className="flex flex-col gap-2 mb-3">
                                                {q.options.map((o, i) => {
                                                    let reviewOptClass = "border-white/8 bg-transparent text-[#86868b]";
                                                    if (i === q.answer) reviewOptClass = "border-[#30d158] bg-[#30d158]/8 text-[#30d158]";
                                                    else if (i === ua && !isCorrect) reviewOptClass = "border-[#ff453a] bg-[#ff453a]/8 text-[#ff453a]";

                                                    return (
                                                        <div 
                                                            key={i} 
                                                            className={`p-[10px_14px] border-2 rounded-[10px] text-[14px] ${reviewOptClass}`}
                                                        >
                                                            {letters[i]}. {o}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                            <div className="bg-[#0071e3]/8 border border-[#0071e3]/20 rounded-[10px] p-3.5 text-[13px] text-[#86868b] leading-[1.6]">
                                                {q.explanation}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* FOOTER */}
            <footer className="bg-[#0a0a0f] border-t border-white/8 p-[40px_24px_24px] text-left shrink-0">
                <div className="max-w-[1080px] mx-auto flex justify-between items-center flex-wrap gap-4">
                    <div className="text-[16px] font-bold text-[#f5f5f7]">
                        Bhavin<span className="text-[#0071e3]">Academy</span>
                    </div>
                    <div className="text-[13px] text-[#6e6e73]">
                        © 2026 BhavinAcademy. All rights reserved.
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default StudentExamPage;
