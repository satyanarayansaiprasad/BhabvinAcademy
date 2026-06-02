import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
    Award,
    RotateCcw
} from "lucide-react";
import { AuthContext } from "@/context/auth-context";
import { StudentContext } from "@/context/student-context";
import { 
    getCurrentCourseProgressService, 
    markLectureAsViewedService, 
    resetCourseProgressService 
} from "@/services";
import VideoPlayer from "@/components/video-player";
import Certificate from "@/components/certificate";
import Confetti from "react-confetti";

function StudentViewCourseProgressPage() {
    const navigate = useNavigate();
    const { id } = useParams();
    const { auth } = useContext(AuthContext);
    const { studentCurrentCourseProgress, setStudentCurrentCourseProgress } = useContext(StudentContext);
    
    const [currentLecture, setCurrentLecture] = useState(null);
    const [activeTab, setActiveTab] = useState("overview");
    const [isSideBarOpen, setIsSideBarOpen] = useState(true);
    const [showConfetti, setShowConfetti] = useState(false);
    const [showCertificate, setShowCertificate] = useState(false);
    const [openModules, setOpenModules] = useState([0]); // First module open by default

    // Interactive state for Notes & Q&A
    const [notes, setNotes] = useState([
        { time: "08:15", text: "Remember: /24 = 255.255.255.0 = 256 addresses, 254 usable. The -2 accounts for network address and broadcast." },
        { time: "11:40", text: "VLSM trick: always allocate the largest subnet first, then work downward. Prevents address space waste." }
    ]);
    const [newNoteText, setNewNoteText] = useState("");
    const [qaList, setQaList] = useState([
        {
            user: "Vijay Sharma",
            userInitials: "VS",
            userBg: "#9b27af",
            time: "2 days ago · at 18:44",
            text: "When using VLSM, if we allocate a /26 first and then a /28, does the /28 have to come right after the /26 block or can it be anywhere in the remaining address space?",
            likes: 8,
            reply: {
                name: "Ankit Kumar",
                initials: "AK",
                text: "Great question, Vijay! The /28 can go anywhere in the remaining space — no strict ordering is required protocol-wise. In practice we start from the beginning of remaining space to avoid fragmentation and keep the address plan readable. The CCNA exam tests whether you can find valid subnets, not placement order."
            }
        },
        {
            user: "Pooja Raghavan",
            userInitials: "PR",
            userBg: "#c0392b",
            time: "5 days ago · at 31:20",
            text: "Is /31 actually usable for point-to-point links? I thought you always need a network and broadcast address?",
            likes: 14,
            reply: {
                name: "Ankit Kumar",
                initials: "AK",
                text: "Excellent catch — yes! RFC 3021 allows /31 on point-to-point links. Both addresses are usable as host addresses. Cisco IOS supports this and it saves address space on WAN links. I cover this in Part 2 as well!"
            }
        }
    ]);
    const [newQuestionText, setNewQuestionText] = useState("");

    useEffect(() => {
        fetchCurrentCourseProgress();
    }, [id]);

    async function fetchCurrentCourseProgress() {
        const response = await getCurrentCourseProgressService(auth?.user?._id, id);
        if (response?.success) {
            setStudentCurrentCourseProgress({
                courseDetails: response?.data?.courseDetails,
                progress: response?.data?.progress,
            });
            
            if (response?.data?.completed) {
                setCurrentLecture(response?.data?.courseDetails?.curriculum[0]);
                setShowConfetti(true);
            } else if (response?.data?.progress?.length === 0) {
                setCurrentLecture(response?.data?.courseDetails?.curriculum[0]);
            } else {
                const lastIdx = response?.data?.progress.reduceRight((acc, obj, index) => acc === -1 && obj.viewed ? index : acc, -1);
                setCurrentLecture(response?.data?.courseDetails?.curriculum[lastIdx + 1] || response?.data?.courseDetails?.curriculum[0]);
            }
        }
    }

    const toggleModule = (idx) => {
        setOpenModules(prev => prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]);
    };

    const handleMarkAsDone = async () => {
        if (currentLecture) {
            const response = await markLectureAsViewedService(auth?.user?._id, studentCurrentCourseProgress?.courseDetails?._id, currentLecture._id);
            if (response?.success) fetchCurrentCourseProgress();
        }
    };

    const handleSaveNote = () => {
        if (!newNoteText.trim()) return;
        const note = {
            time: "14:32",
            text: newNoteText.trim()
        };
        setNotes([note, ...notes]);
        setNewNoteText("");
    };

    const handlePostQuestion = () => {
        if (!newQuestionText.trim()) return;
        const initials = auth?.user?.userFullName ? auth.user.userFullName.split(" ").map(n => n[0]).join("").toUpperCase() : "AM";
        const question = {
            user: auth?.user?.userFullName || auth?.user?.userName || "Student",
            userInitials: initials,
            userBg: "#0071e3",
            time: "Just now",
            text: newQuestionText.trim(),
            likes: 0
        };
        setQaList([question, ...qaList]);
        setNewQuestionText("");
    };

    const progressValue = Math.round((studentCurrentCourseProgress?.progress?.filter(p => p.viewed).length / studentCurrentCourseProgress?.courseDetails?.curriculum.length) * 100) || 0;

    const userInitials = auth?.user?.userFullName 
        ? auth.user.userFullName.split(" ").map(n => n[0]).join("").toUpperCase() 
        : "RV";

    return (
        <div className="flex flex-col h-screen bg-[#f5f7fa] font-sans overflow-hidden text-[#1a1a2e]">
            {showConfetti && <Confetti recycle={false} numberOfPieces={500} gravity={0.1} />}

            {/* TOP NAVBAR */}
            <nav className="h-[52px] bg-white/95 backdrop-blur-[20px] border-b border-[#e2e8f0] flex items-center justify-between px-5 sticky top-0 z-[100] shadow-[0_1px_4px_rgba(0,0,0,0.06)] shrink-0">
                <div className="flex items-center gap-4 min-w-0">
                    <Link to="/" className="text-[17px] font-bold text-[#1a1a2e] no-underline tracking-tight">
                        Bhavin<span className="text-[#0071e3]">Academy</span>
                    </Link>
                    <div className="w-[1px] h-5 bg-[#d1d9e0]" />
                    <div className="text-[13px] text-[#64748b] truncate max-w-[300px]" title={studentCurrentCourseProgress?.courseDetails?.title}>
                        {studentCurrentCourseProgress?.courseDetails?.title}
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    <div className="hidden md:flex items-center gap-2.5">
                        <div className="w-[160px] h-[4px] bg-[#e2e8f0] rounded-[2px] overflow-hidden">
                            <motion.div initial={{ width: 0 }} animate={{ width: `${progressValue}%` }} className="h-full bg-[#0071e3] rounded-[2px]" />
                        </div>
                        <span className="text-[12px] text-[#64748b]">{progressValue}% complete</span>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button 
                        onClick={() => {
                            alert('Keyboard Shortcuts:\nSpace — Play/Pause\nN — Next lesson\nP — Previous lesson');
                        }}
                        className="bg-transparent border-none cursor-pointer text-[#64748b] text-[16px] w-[34px] h-[34px] rounded-[8px] flex items-center justify-center hover:bg-[#f1f5f9] hover:text-[#1a1a2e] transition-all"
                        title="Keyboard Shortcuts"
                    >
                        ⌨
                    </button>
                    <button 
                        onClick={() => {
                            setActiveTab("notes");
                        }}
                        className="bg-transparent border-none cursor-pointer text-[#64748b] text-[16px] w-[34px] h-[34px] rounded-[8px] flex items-center justify-center hover:bg-[#f1f5f9] hover:text-[#1a1a2e] transition-all"
                        title="My Notes"
                    >
                        📝
                    </button>
                    <div className="w-[30px] h-[30px] rounded-full bg-[#0071e3] flex items-center justify-center text-[11px] font-bold text-white cursor-pointer" title="Your profile">
                        {userInitials}
                    </div>
                </div>
            </nav>

            {/* MAIN PLAYER GRID */}
            <div className="flex flex-1 overflow-hidden min-h-0">
                
                {/* LEFT COL: VIDEO + CONTENT */}
                <main className="flex-1 flex flex-col overflow-y-auto no-scrollbar min-h-0 bg-[#f5f7fa]">
                    
                    {/* VIDEO WRAPPER */}
                    <div className="bg-black aspect-video w-full shrink-0 relative overflow-hidden">
                        <VideoPlayer
                            width="100%"
                            height="100%"
                            url={currentLecture?.videoUrl}
                            onProgressUpdate={setCurrentLecture}
                            progressData={currentLecture}
                        />
                    </div>

                    {/* LESSON NAV BAR */}
                    <div className="flex items-center justify-between p-[14px_24px] border-b border-[#e2e8f0] bg-white shrink-0 gap-[10px] flex-wrap text-left">
                        <div className="flex items-center gap-2 text-[13px] text-[#94a3b8] font-light">
                            Module 01 · Networking Fundamentals
                            <span className="text-[#1a1a2e] mx-1">›</span>
                            <span className="text-[#1a1a2e] font-medium">{currentLecture?.title}</span>
                        </div>
                        <div className="flex items-center gap-[14px] flex-wrap">
                            <div className="flex items-center gap-2 cursor-pointer select-none" onClick={handleMarkAsDone}>
                                <div className={`w-[18px] h-[18px] rounded-[5px] border-2 flex items-center justify-center transition-all ${studentCurrentCourseProgress?.progress?.find(p => p.lectureId === currentLecture?._id)?.viewed ? 'bg-[#16a34a] border-[#16a34a]' : 'border-[#cbd5e1]'}`}>
                                    {studentCurrentCourseProgress?.progress?.find(p => p.lectureId === currentLecture?._id)?.viewed && (
                                        <div className="w-[4px] h-[8px] border-r-2 border-b-2 border-white rotate-45 -translate-y-[1px]" />
                                    )}
                                </div>
                                <span className="text-[13px] text-[#64748b]">
                                    {studentCurrentCourseProgress?.progress?.find(p => p.lectureId === currentLecture?._id)?.viewed ? 'Completed ✓' : 'Mark as complete'}
                                </span>
                            </div>
                            <div className="flex gap-2">
                                <button 
                                    className="flex items-center gap-1.5 bg-[#f1f5f9] text-[#475569] border border-[#e2e8f0] p-[7px_14px] rounded-[8px] text-[13px] font-medium cursor-pointer hover:bg-[#e2e8f0] hover:border-[#cbd5e1] transition-all" 
                                    onClick={() => {
                                        const idx = studentCurrentCourseProgress?.courseDetails?.curriculum.indexOf(currentLecture);
                                        if (idx > 0) setCurrentLecture(studentCurrentCourseProgress.courseDetails.curriculum[idx - 1]);
                                    }}
                                >
                                    ‹ Previous
                                </button>
                                <button 
                                    className="flex items-center gap-1.5 bg-[#0071e3] text-white border border-[#0071e3] p-[7px_14px] rounded-[8px] text-[13px] font-medium cursor-pointer hover:bg-[#0077ed] transition-all" 
                                    onClick={() => {
                                        const idx = studentCurrentCourseProgress?.courseDetails?.curriculum.indexOf(currentLecture);
                                        if (idx < studentCurrentCourseProgress?.courseDetails?.curriculum.length - 1) {
                                            setCurrentLecture(studentCurrentCourseProgress.courseDetails.curriculum[idx + 1]);
                                        }
                                    }}
                                >
                                    Next ›
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* TABS */}
                    <div className="flex border-b border-[#e2e8f0] px-6 bg-white shrink-0">
                        {[
                            { id: "overview", label: "Overview" },
                            { id: "notes", label: "Notes" },
                            { id: "resources", label: "Resources" },
                            { id: "qa", label: `Q&A` },
                        ].map(tab => (
                            <button 
                                key={tab.id} 
                                onClick={() => setActiveTab(tab.id)}
                                className={`p-[14px_16px] text-[14px] font-medium cursor-pointer relative transition-all border-none bg-transparent ${activeTab === tab.id ? 'text-[#1a1a2e] after:content-[""] after:absolute after:bottom-[-1px] after:left-0 after:right-0 after:h-[2px] after:bg-[#0071e3] after:rounded-[1px]' : 'text-[#94a3b8] hover:text-[#475569]'}`}
                            >
                                {tab.label}
                                {tab.id === "qa" && (
                                    <span className="bg-[#eff6ff] text-[#0071e3] text-[10px] font-bold p-[1px_6px] rounded-[10px] ml-1">
                                        {qaList.length}
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>

                    {/* TAB CONTENT */}
                    <div className="p-[28px_24px] flex-1 bg-[#f5f7fa] text-left">
                        {activeTab === "overview" && (
                            <div className="space-y-8 max-w-[800px]">
                                <div className="overview-section">
                                    <h3 className="text-[17px] font-bold mb-3.5 text-[#1a1a2e]">About this lesson</h3>
                                    <p className="text-[15px] text-[#475569] leading-[1.75]">
                                        {studentCurrentCourseProgress?.courseDetails?.description || 
                                         "In this lesson, you'll build a rock-solid understanding of IP subnetting — the skill that defines every network engineer. We'll break down binary addressing, CIDR notation, and subnet masks step by step, with Packet Tracer exercises following each concept. By the end you'll be able to design and calculate subnets mentally, a skill that appears on every CCNA exam."}
                                    </p>
                                </div>
                                <div className="overview-section">
                                    <h3 className="text-[17px] font-bold mb-3.5 text-[#1a1a2e]">What you'll learn</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-[10px_24px]">
                                        {[
                                            "Binary-to-decimal conversion at speed",
                                            "CIDR notation and prefix lengths",
                                            "Calculating network & broadcast addresses",
                                            "Determining usable host ranges per subnet",
                                            "Subnet design for real enterprise topologies",
                                            "Variable Length Subnet Masking (VLSM)"
                                        ].map((item, idx) => (
                                            <div key={idx} className="flex items-start gap-2.5 text-[14px] text-[#334155] leading-normal">
                                                <div className="w-[18px] h-[18px] rounded-full bg-[#dcfce7] border border-[#16a34a] flex items-center justify-center shrink-0 mt-[1px] text-[9px] text-[#16a34a] font-bold">✓</div>
                                                <span>{item}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === "notes" && (
                            <div className="max-w-[800px]">
                                <div className="flex gap-2 mb-4 items-center flex-wrap">
                                    <span className="text-[13px] text-[#64748b]">Timestamp:</span>
                                    <button 
                                        className="text-[12px] font-semibold text-[#0071e3] bg-[#eff6ff] border border-[#bfdbfe] p-[5px_12px] rounded-[6px] cursor-pointer hover:bg-[#dbeafe] transition-all"
                                        onClick={() => setNewNoteText(prev => prev + "[@ 14:32] ")}
                                    >
                                        + 14:32
                                    </button>
                                    <span className="text-[12px] text-[#94a3b8]">Insert current video timestamp into note</span>
                                </div>
                                <textarea 
                                    className="w-full min-h-[160px] bg-white border border-[#e2e8f0] rounded-[12px] p-4 text-[14px] text-[#1a1a2e] leading-[1.7] resize-y outline-none focus:border-[#93c5fd] focus:shadow-[0_0_0_3px_rgba(0,113,227,0.08)] transition-all placeholder:text-[#cbd5e1]"
                                    placeholder="Type your notes here... Use timestamps to link notes to specific moments in the video."
                                    value={newNoteText}
                                    onChange={(e) => setNewNoteText(e.target.value)}
                                />
                                <div className="flex justify-end mt-3">
                                    <button 
                                        className="bg-[#0071e3] text-white border-none p-[8px_20px] rounded-[8px] text-[13px] font-semibold cursor-pointer hover:bg-[#0077ed] transition-all"
                                        onClick={handleSaveNote}
                                    >
                                        Save Note
                                    </button>
                                </div>

                                <div className="mt-8">
                                    <h4 className="text-[13px] font-semibold text-[#94a3b8] uppercase tracking-[0.06em] mb-3.5">Saved Notes</h4>
                                    <div className="space-y-3">
                                        {notes.map((note, idx) => (
                                            <div key={idx} className="p-4 rounded-[10px] bg-white border border-[#e2e8f0] shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
                                                <div className="text-[11px] font-semibold text-[#0071e3] mb-1.5">@ {note.time}</div>
                                                <div className="text-[14px] text-[#334155] leading-[1.6]">{note.text}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === "resources" && (
                            <div className="space-y-2.5 max-w-[800px]">
                                {[
                                    { name: "Subnetting Quick Reference Sheet", meta: "PDF · 2 pages · Printable cheat sheet", icon: "📄", bg: "bg-[#fee2e2]" },
                                    { name: "Packet Tracer Lab: Subnet Design Exercise", meta: ".pkt file · Cisco Packet Tracer 8.2+", icon: "🔬", bg: "bg-[#dbeafe]" },
                                    { name: "Subnet Mask Cheat Table (/1–/32)", meta: "PDF · Full CIDR table with host counts", icon: "📊", bg: "bg-[#fee2e2]" },
                                    { name: "RFC 1878 — Variable Length Subnet Table", meta: "External link · IETF official document", icon: "🔗", bg: "bg-[#fef9c3]" }
                                ].map((res, idx) => (
                                    <div key={idx} className="flex items-center gap-3.5 p-[14px_16px] rounded-[12px] bg-white border border-[#e2e8f0] shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-[0_2px_8px_rgba(0,0,0,0.08)] hover:bg-[#f8fafc] cursor-pointer transition-all">
                                        <div className={`w-[38px] h-[38px] rounded-[10px] ${res.bg} flex items-center justify-center text-[18px] shrink-0`}>
                                            {res.icon}
                                        </div>
                                        <div className="flex-1">
                                            <div className="text-[14px] font-medium text-[#1a1a2e] mb-[2px]">{res.name}</div>
                                            <div className="text-[12px] text-[#94a3b8]">{res.meta}</div>
                                        </div>
                                        <button className="text-[11px] font-semibold text-[#0071e3] p-[5px_12px] rounded-[6px] bg-[#eff6ff] border border-[#bfdbfe] cursor-pointer hover:bg-[#dbeafe] transition-all whitespace-nowrap">
                                            {res.icon === "🔗" ? "Open ↗" : "Download"}
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        {activeTab === "qa" && (
                            <div className="max-w-[800px] space-y-7">
                                <div className="flex gap-3 items-start">
                                    <div className="w-[36px] h-[36px] rounded-full bg-[#0071e3] shrink-0 flex items-center justify-center text-[12px] font-bold text-white">
                                        {userInitials}
                                    </div>
                                    <div className="flex-1">
                                        <textarea 
                                            className="w-full bg-white border border-[#e2e8f0] rounded-[12px] p-[14px_16px] text-[14px] text-[#1a1a2e] outline-none min-h-[90px] focus:border-[#93c5fd] focus:shadow-[0_0_0_3px_rgba(0,113,227,0.08)] transition-all placeholder:text-[#cbd5e1]" 
                                            placeholder="Ask a question about this lesson..."
                                            value={newQuestionText}
                                            onChange={(e) => setNewQuestionText(e.target.value)}
                                        />
                                        <button 
                                            className="mt-2.5 bg-[#0071e3] text-white border-none p-[8px_20px] rounded-[8px] text-[13px] font-semibold cursor-pointer hover:bg-[#0077ed] transition-all"
                                            onClick={handlePostQuestion}
                                        >
                                            Post Question
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-6 pt-4 border-t border-[#f1f5f9]">
                                    {qaList.map((qa, idx) => (
                                        <div key={idx} className="pt-4 first:pt-0 border-t first:border-none border-[#f1f5f9]">
                                            <div className="flex gap-3 items-start mb-2.5">
                                                <div 
                                                    className="w-[34px] h-[34px] rounded-full flex items-center justify-center text-[12px] font-bold text-white shrink-0"
                                                    style={{ backgroundColor: qa.userBg }}
                                                >
                                                    {qa.userInitials}
                                                </div>
                                                <div>
                                                    <div className="text-[13px] font-semibold text-[#1a1a2e]">{qa.user}</div>
                                                    <div className="text-[11px] text-[#94a3b8]">{qa.time}</div>
                                                </div>
                                            </div>
                                            <p className="text-[14px] text-[#334155] leading-[1.65] pl-[46px]">{qa.text}</p>
                                            <div className="flex gap-4 pl-[46px] mt-2.5">
                                                <button className="text-[12px] text-[#94a3b8] hover:text-[#0071e3] bg-none border-none cursor-pointer flex items-center gap-1">
                                                    👍 {qa.likes}
                                                </button>
                                                <button className="text-[12px] text-[#94a3b8] hover:text-[#0071e3] bg-none border-none cursor-pointer">
                                                    Reply
                                                </button>
                                            </div>

                                            {qa.reply && (
                                                <div className="ml-[46px] mt-3.5 p-[14px_16px] bg-[#f0f7ff] rounded-[10px] border-l-2 border-[#0071e3]">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <div className="w-[26px] h-[26px] rounded-full bg-[#dcfce7] flex items-center justify-center text-[10px] font-bold text-[#16a34a] shrink-0">
                                                            {qa.reply.initials}
                                                        </div>
                                                        <span className="text-[12px] font-semibold text-[#16a34a]">{qa.reply.name}</span>
                                                        <span className="text-[10px] font-semibold bg-[#dcfce7] text-[#16a34a] p-[1px_7px] rounded-[4px] border border-[#bbf7d0]">
                                                            Instructor
                                                        </span>
                                                    </div>
                                                    <p className="text-[13px] text-[#475569] leading-[1.65]">{qa.reply.text}</p>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </main>

                {/* RIGHT SIDEBAR */}
                <aside className="w-[360px] border-l border-[#e2e8f0] bg-white flex flex-col shrink-0 overflow-hidden relative shadow-[-1px_0_0_#f1f5f9] text-left">
                    <div className="p-[16px_18px] border-b border-[#f1f5f9] shrink-0 bg-[#fafbfc]">
                        <h3 className="text-[13px] font-semibold text-[#1a1a2e] mb-2">Course Content</h3>
                        <div className="flex gap-3 text-[12px] text-[#94a3b8] mb-3">
                            <span className="smeta"><strong>{studentCurrentCourseProgress?.courseDetails?.curriculum?.length || 0}</strong> lessons</span>
                            <span className="smeta"><strong>6h 20m</strong> total</span>
                            <span className="smeta"><strong>4</strong> labs</span>
                        </div>
                        <div className="flex items-center gap-2 mt-3">
                            <div className="flex-1 h-[3px] bg-[#e2e8f0] rounded-[2px] overflow-hidden">
                                <div className="h-full bg-[#0071e3] rounded-[2px] transition-all duration-500" style={{ width: `${progressValue}%` }} />
                            </div>
                            <span className="text-[11px] text-[#94a3b8] whitespace-nowrap">{progressValue}% done</span>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto no-scrollbar">
                        {[0].map(modIdx => (
                            <div key={modIdx} className="border-b border-[#f1f5f9]">
                                <div 
                                    className="p-[14px_18px] flex items-center justify-between cursor-pointer hover:bg-[#f8fafc] transition-all"
                                    onClick={() => toggleModule(modIdx)}
                                >
                                    <div className="min-w-0">
                                        <div className="text-[11px] font-semibold text-[#94a3b8] uppercase tracking-[0.06em] mb-[3px]">Module 01</div>
                                        <div className="text-[13px] font-semibold text-[#334155] leading-[1.35] truncate">
                                            Networking Fundamentals
                                        </div>
                                    </div>
                                    <span className={`text-[14px] text-[#94a3b8] transition-transform duration-300 ${openModules.includes(modIdx) ? 'rotate-180' : ''}`}>▾</span>
                                </div>
                                
                                {openModules.includes(modIdx) && (
                                    <div className="overflow-hidden bg-[#fafbfc]">
                                        {studentCurrentCourseProgress?.courseDetails?.curriculum.map((item, i) => {
                                            const isDone = studentCurrentCourseProgress?.progress?.find(p => p.lectureId === item._id)?.viewed;
                                            const isCurrent = currentLecture?._id === item._id;
                                            return (
                                                <div 
                                                    key={item._id} 
                                                    onClick={() => setCurrentLecture(item)}
                                                    className={`flex items-center gap-2.5 p-[10px_18px] cursor-pointer relative transition-all border-none ${isCurrent ? 'bg-[#eff6ff] before:content-[""] before:absolute before:left-0 before:top-0 before:bottom-0 before:width-[3px] before:bg-[#0071e3] before:rounded-[0_2px_2px_0]' : 'hover:bg-[#f8fafc]'}`}
                                                >
                                                    <div className={`w-[20px] h-[20px] rounded-full shrink-0 flex items-center justify-center text-[9px] ${isDone ? 'bg-[#dcfce7] border border-[#16a34a] text-[#16a34a] font-bold' : isCurrent ? 'bg-[#eff6ff] border border-[#0071e3] text-[#0071e3]' : 'bg-[#f1f5f9] border border-[#e2e8f0] text-gray-300'}`}>
                                                        {isDone ? "✓" : isCurrent ? "▶" : "🔒"}
                                                    </div>
                                                    <div className="min-w-0 flex-1">
                                                        <div className={`text-[13px] leading-[1.35] truncate ${isCurrent ? 'font-semibold text-[#1a1a2e]' : 'text-[#475569]'}`}>
                                                            {item.title}
                                                        </div>
                                                        <div className="flex items-center gap-1.5 mt-0.5 text-[11px] text-[#94a3b8]">
                                                            {i === 0 && <span className="text-[9px] font-bold text-[#0071e3] bg-[#eff6ff] border border-[#bfdbfe] p-[1px_6px] rounded-[3px]">FREE</span>}
                                                            {i === 7 && <span className="text-[9px] font-bold text-[#b45309] bg-[#fef3c7] border border-[#fde68a] p-[1px_6px] rounded-[3px]">LAB</span>}
                                                        </div>
                                                    </div>
                                                    <span className="text-[11px] text-[#94a3b8] shrink-0">22 min</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </aside>
            </div>

            {/* COMPLETION MODAL */}
            <AnimatePresence>
                {showConfetti && (
                    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm">
                        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white rounded-[32px] p-12 max-w-lg w-full text-center shadow-2xl relative overflow-hidden">
                            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#0071e3] to-[#00d4ff]" />
                            <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-8 relative">
                                <Award className="w-12 h-12 text-green-600" />
                            </div>
                            <h2 className="text-[32px] font-black tracking-tight text-[#1d1d1f] mb-4 leading-tight">Mastery Achieved!</h2>
                            <p className="text-[15px] text-[#86868b] leading-relaxed mb-10 max-w-sm mx-auto">
                                Congratulations on completing <span className="text-[#1d1d1f] font-bold">"{studentCurrentCourseProgress?.courseDetails?.title}"</span>. You've earned a verified skill badge and completed all labs.
                            </p>
                            <div className="flex flex-col gap-3">
                                <button className="w-full bg-[#0071e3] text-white text-[14px] font-black py-4 rounded-2xl hover:bg-[#0077ed] transition-all flex items-center justify-center gap-2 border-none cursor-pointer" onClick={() => setShowCertificate(true)}>Claim Your Certificate</button>
                                <div className="grid grid-cols-2 gap-3">
                                    <button className="bg-white border border-[#e2e8f0] text-[#1d1d1f] text-[13px] font-bold py-3.5 rounded-2xl hover:bg-[#f5f7fa] flex items-center justify-center gap-2 cursor-pointer" onClick={() => navigate("/student-courses")}>My Courses</button>
                                    <button className="bg-white border border-[#e2e8f0] text-[#1d1d1f] text-[13px] font-bold py-3.5 rounded-2xl hover:bg-[#f5f7fa] flex items-center justify-center gap-2 cursor-pointer" onClick={async () => {
                                        const response = await resetCourseProgressService(auth?.user?._id, studentCurrentCourseProgress?.courseDetails?._id);
                                        if (response?.success) { setShowConfetti(false); fetchCurrentCourseProgress(); }
                                    }}><RotateCcw size={16}/> Rewatch</button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* CERTIFICATE DOWNLOADING */}
            {showCertificate && (
                <Certificate
                    key={studentCurrentCourseProgress?.courseDetails?._id}
                    userName={auth?.user?.userFullName || auth?.user?.userName}
                    courseTitle={studentCurrentCourseProgress?.courseDetails?.title}
                    completionDate={new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
                    instructorName={studentCurrentCourseProgress?.courseDetails?.instructorName}
                    silentDownload={true}
                    onDownloadComplete={() => setShowCertificate(false)}
                />
            )}
        </div>
    );
}

export default StudentViewCourseProgressPage;
