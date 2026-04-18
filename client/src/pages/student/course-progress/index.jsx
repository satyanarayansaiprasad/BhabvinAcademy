import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
    ChevronLeft, 
    ChevronRight, 
    Play, 
    Pause, 
    CheckCircle2, 
    Info, 
    FileText, 
    HelpCircle, 
    MessageSquare, 
    Download, 
    Laptop, 
    Link as LinkIcon,
    Maximize,
    Volume2,
    Settings as SettingsIcon,
    RotateCcw,
    Award,
    MoreVertical,
    LayoutList
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
import { Button } from "@/components/ui/button";

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

    const progressValue = Math.round((studentCurrentCourseProgress?.progress?.filter(p => p.viewed).length / studentCurrentCourseProgress?.courseDetails?.curriculum.length) * 100) || 0;

    return (
        <div className="flex flex-col h-screen bg-[#f5f7fa] font-['Inter'] overflow-hidden">
            {showConfetti && <Confetti recycle={false} numberOfPieces={500} gravity={0.1} />}

            {/* TOP NAVBAR */}
            <nav className="h-[52px] bg-white/90 backdrop-blur-xl border-b border-[#e2e8f0] flex items-center justify-between px-5 sticky top-0 z-[100] shadow-sm shrink-0">
                <div className="flex items-center gap-4 min-w-0">
                    <Link to="/" className="text-[17px] font-bold tracking-tight shrink-0">Bhavin<span className="text-[#0071e3]">Academy</span></Link>
                    <div className="w-px h-5 bg-[#d1d9e0]" />
                    <div className="text-[13px] text-[#64748b] truncate max-w-[300px]">{studentCurrentCourseProgress?.courseDetails?.title}</div>
                </div>

                <div className="flex items-center gap-10">
                    <div className="hidden md:flex items-center gap-3">
                        <div className="w-40 h-1 bg-[#e2e8f0] rounded-full overflow-hidden">
                            <motion.div initial={{ width: 0 }} animate={{ width: `${progressValue}%` }} className="h-full bg-[#0071e3]" />
                        </div>
                        <span className="text-[12px] font-bold text-[#64748b] whitespace-nowrap">{progressValue}% complete</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <button className="w-9 h-9 rounded-lg flex items-center justify-center text-[#64748b] hover:bg-[#f1f5f9] hover:text-[#1d1d1f] transition-all"><SettingsIcon size={16} /></button>
                        <button onClick={() => setIsSideBarOpen(!isSideBarOpen)} className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all ${isSideBarOpen ? 'bg-[#f1f5f9] text-[#0071e3]' : 'text-[#64748b] hover:bg-[#f1f5f9]'}`}><LayoutList size={18} /></button>
                        <div className="w-8 h-8 rounded-full bg-[#0071e3] flex items-center justify-center text-[11px] font-black text-white cursor-pointer ml-2">AM</div>
                    </div>
                </div>
            </nav>

            {/* MAIN PLAYER LAYOUT */}
            <div className="flex flex-1 overflow-hidden">
                
                {/* LEFT: CONTENT */}
                <main className="flex-1 flex flex-col overflow-y-auto no-scrollbar">
                    
                    {/* VIDEO WRAPPER */}
                    <div className="bg-black aspect-video w-full shrink-0 relative flex items-center justify-center">
                        <VideoPlayer
                            width="100%"
                            height="100%"
                            url={currentLecture?.videoUrl}
                            onProgressUpdate={setCurrentLecture}
                            progressData={currentLecture}
                        />
                    </div>

                    {/* LESSON CONTROLS BAR */}
                    <div className="bg-white border-b border-[#e2e8f0] px-6 py-4 flex flex-wrap items-center justify-between gap-4 shrink-0">
                        <div className="flex items-center gap-2 text-[13px] text-[#94a3b8]">
                            Lesson {studentCurrentCourseProgress?.courseDetails?.curriculum.indexOf(currentLecture) + 1}
                            <ChevronRight size={14} />
                            <span className="text-[#1a1a2e] font-bold">{currentLecture?.title}</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <button className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg border border-[#cbd5e1] text-[13px] font-bold text-[#475569] hover:bg-[#f1f5f9] transition-all" onClick={() => {
                                const idx = studentCurrentCourseProgress?.courseDetails?.curriculum.indexOf(currentLecture);
                                if(idx > 0) setCurrentLecture(studentCurrentCourseProgress.courseDetails.curriculum[idx-1]);
                            }}><ChevronLeft size={16}/> Previous</button>
                            
                            <button className="flex items-center gap-2 px-4 py-1.5 rounded-lg border border-[#cbd5e1] text-[13px] font-bold text-[#64748b] hover:bg-[#f1f5f9]" onClick={handleMarkAsDone}>
                                <div className={`w-4 h-4 rounded-[4px] border-2 flex items-center justify-center transition-all ${studentCurrentCourseProgress?.progress?.find(p => p.lectureId === currentLecture?._id)?.viewed ? 'bg-green-600 border-green-600' : 'border-[#cbd5e1]'}`}>
                                    {studentCurrentCourseProgress?.progress?.find(p => p.lectureId === currentLecture?._id)?.viewed && <CheckCircle2 size={12} className="text-white" />}
                                </div>
                                {studentCurrentCourseProgress?.progress?.find(p => p.lectureId === currentLecture?._id)?.viewed ? 'Completed ✓' : 'Mark as complete'}
                            </button>

                            <button className="flex items-center gap-1.5 px-6 py-1.5 rounded-lg bg-[#0071e3] text-white text-[13px] font-black hover:bg-[#0077ed] transition-all shadow-md" onClick={() => {
                                const idx = studentCurrentCourseProgress?.courseDetails?.curriculum.indexOf(currentLecture);
                                if(idx < studentCurrentCourseProgress?.courseDetails?.curriculum.length - 1) setCurrentLecture(studentCurrentCourseProgress.curriculum[idx+1]);
                            }}>Next <ChevronRight size={16}/></button>
                        </div>
                    </div>

                    {/* TABS BAR */}
                    <div className="bg-white px-6 flex gap-8 border-b border-[#e2e8f0] shrink-0">
                        {[
                            { id: "overview", label: "Overview" },
                            { id: "notes", label: "Notes" },
                            { id: "resources", label: "Resources" },
                            { id: "qa", label: "Q&A" },
                        ].map(tab => (
                            <button 
                                key={tab.id} 
                                onClick={() => setActiveTab(tab.id)}
                                className={`py-4 text-[14px] font-bold relative transition-all ${activeTab === tab.id ? 'text-[#1d1d1f]' : 'text-[#94a3b8] hover:text-[#64748b]'}`}
                            >
                                {tab.label}
                                {activeTab === tab.id && <motion.div layoutId="tabUnderline" className="absolute bottom-[-1px] left-0 right-0 h-0.5 bg-[#0071e3]" />}
                            </button>
                        ))}
                    </div>

                    {/* TAB CONTENT */}
                    <div className="p-8 flex-1">
                        <AnimatePresence mode="wait">
                            {activeTab === "overview" && (
                                <motion.div key="overview" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl space-y-10">
                                    <section>
                                        <h3 className="text-[17px] font-black text-[#1a1a2e] mb-4">About this lesson</h3>
                                        <p className="text-[15px] text-[#475569] leading-relaxed">{studentCurrentCourseProgress?.courseDetails?.description}</p>
                                    </section>
                                    <section>
                                        <h3 className="text-[17px] font-black text-[#1a1a2e] mb-6">What you'll learn</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {["Binary-to-decimal conversion at speed", "CIDR notation and prefix lengths", "Calculating network & broadcast addresses", "Determining usable host ranges", "Subnet design for real enterprises", "VLSM Deep Dive"].map((l, i) => (
                                                <div key={i} className="flex gap-3 text-[14px] text-[#334155]">
                                                    <div className="w-5 h-5 rounded-full bg-[#dcfce7] border border-[#16a34a] flex items-center justify-center text-[10px] text-[#16a34a] shrink-0 mt-0.5">✓</div>
                                                    {l}
                                                </div>
                                            ))}
                                        </div>
                                    </section>
                                </motion.div>
                            )}

                            {activeTab === "notes" && (
                                <motion.div key="notes" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl">
                                    <div className="flex gap-4 mb-6">
                                        <button className="px-4 py-1.5 rounded-lg bg-[#eff6ff] border border-[#bfdbfe] text-[#0071e3] text-[12px] font-bold hover:bg-[#dbeafe]">+ 14:32</button>
                                        <span className="text-[12px] text-[#94a3b8] mt-1.5">Insert current timestamp</span>
                                    </div>
                                    <textarea className="w-full bg-white border border-[#e2e8f0] rounded-xl p-6 text-[14px] leading-relaxed outline-none focus:border-[#93c5fd] min-h-[160px] shadow-sm" placeholder="Type your notes here..." />
                                    <div className="flex justify-end mt-4">
                                        <button className="bg-[#0071e3] text-white text-[13px] font-black px-6 py-2 rounded-lg">Save Note</button>
                                    </div>
                                </motion.div>
                            )}

                            {activeTab === "resources" && (
                                <motion.div key="resources" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl space-y-4">
                                    {[
                                        { t: "Subnetting Quick Reference Sheet", m: "PDF · 2 pages · Cheat sheet", icon: <FileText className="text-red-500" />, bg: "bg-red-50" },
                                        { t: "Packet Tracer Lab: Exercise", m: ".pkt file · Packet Tracer 8.2+", icon: <Laptop className="text-blue-500" />, bg: "bg-blue-50" },
                                        { t: "RFC 1878 — VLSM Table", m: "External Link", icon: <LinkIcon className="text-yellow-600" />, bg: "bg-yellow-50" },
                                    ].map((r, i) => (
                                        <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-white border border-[#e2e8f0] hover:shadow-lg transition-all cursor-pointer group">
                                            <div className={`w-10 h-10 rounded-xl ${r.bg} flex items-center justify-center text-xl`}>{r.icon}</div>
                                            <div className="flex-1">
                                                <div className="text-[14px] font-bold text-[#1a1a2e] group-hover:text-[#0071e3] transition-colors">{r.t}</div>
                                                <div className="text-[12px] text-[#94a3b8] mt-0.5">{r.m}</div>
                                            </div>
                                            <button className="text-[11px] font-black px-4 py-1.5 rounded-lg bg-[#eff6ff] text-[#0071e3] border border-[#bfdbfe]">Download</button>
                                        </div>
                                    ))}
                                </motion.div>
                            )}

                            {activeTab === "qa" && (
                                <motion.div key="qa" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl space-y-8">
                                    <div className="flex gap-4">
                                        <div className="w-9 h-9 rounded-full bg-[#0071e3] flex items-center justify-center text-[12px] font-black text-white shrink-0">AM</div>
                                        <div className="flex-1">
                                            <textarea className="w-full bg-white border border-[#e2e8f0] rounded-xl p-4 text-[14px] min-h-[100px] outline-none focus:border-[#0071e3]" placeholder="Ask a question..." />
                                            <button className="mt-3 bg-[#0071e3] text-white text-[13px] font-bold px-6 py-2 rounded-lg shadow-md">Post Question</button>
                                        </div>
                                    </div>
                                    <div className="space-y-6 pt-6 divide-y divide-[#f1f5f9]">
                                        {[1, 2].map(q => (
                                            <div key={q} className="pt-6 relative">
                                                <div className="flex gap-3 mb-3">
                                                    <div className="w-8 h-8 rounded-full bg-slate-200" />
                                                    <div>
                                                        <div className="text-[13px] font-bold">Vijay Sharma</div>
                                                        <div className="text-[11px] text-[#94a3b8]">2 days ago · at 18:44</div>
                                                    </div>
                                                </div>
                                                <p className="text-[14px] text-[#334155] pl-11 leading-relaxed">When using VLSM, if we allocate a /26 first and then a /28, does the /28 have to come right after the /26 block?</p>
                                                <div className="flex gap-4 pl-11 mt-4">
                                                    <button className="text-[12px] text-[#94a3b8] flex items-center gap-1.5 hover:text-[#0071e3]">👍 8</button>
                                                    <button className="text-[12px] text-[#94a3b8] hover:text-[#0071e3]">Reply</button>
                                                </div>
                                                <div className="ml-11 mt-6 p-4 bg-[#f0f7ff] rounded-xl border-l-[3px] border-[#0071e3]">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <div className="w-6 h-6 rounded-full bg-[#dcfce7] text-[#16a34a] text-[10px] font-black flex items-center justify-center shrink-0">AK</div>
                                                        <span className="text-[12px] font-bold text-[#16a34a]">Ankit Kumar</span>
                                                        <span className="text-[9px] font-black uppercase tracking-widest bg-[#dcfce7] border border-[#bbf7d0] px-1.5 rounded-sm">Instructor</span>
                                                    </div>
                                                    <p className="text-[13px] text-[#475569] leading-relaxed">Great question, Vijay! The /28 can go anywhere in the remaining space... protocol-wise no strict ordering is required.</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </main>

                {/* RIGHT: SIDEBAR (Curriculum) */}
                <AnimatePresence>
                    {isSideBarOpen && (
                        <motion.aside initial={{ x: 400 }} animate={{ x: 0 }} exit={{ x: 400 }} className="w-[360px] bg-white border-l border-[#e2e8f0] flex flex-col shrink-0 overflow-hidden relative z-50 shadow-2xl">
                            <div className="p-5 border-b border-[#f1f5f9] bg-[#fafbfc]">
                                <h3 className="text-[13px] font-bold text-[#1a1a2e] mb-3">Course Content</h3>
                                <div className="flex gap-4 text-[11px] text-[#94a3b8] mb-4">
                                    <span><strong>74</strong> lessons</span>
                                    <span><strong>36h</strong> total</span>
                                    <span><strong>24</strong> labs</span>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between text-[11px] text-[#94a3b8] font-bold">
                                        <span>Progress</span>
                                        <span>{progressValue}% done</span>
                                    </div>
                                    <div className="h-[3px] bg-[#e2e8f0] rounded-full overflow-hidden">
                                        <div className="h-full bg-[#0071e3]" style={{ width: `${progressValue}%` }} />
                                    </div>
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto no-scrollbar">
                                {[0].map(modIdx => (
                                    <div key={modIdx} className="border-b border-[#f1f5f9]">
                                        <div 
                                            className="px-5 py-4 flex items-center justify-between cursor-pointer hover:bg-[#f8fafc] transition-colors"
                                            onClick={() => toggleModule(modIdx)}
                                        >
                                            <div className="min-w-0">
                                                <div className="text-[11px] font-bold text-[#94a3b8] uppercase tracking-widest mb-0.5">Module 01</div>
                                                <div className="text-[13px] font-bold text-[#334155] leading-tight">Networking Fundamentals</div>
                                            </div>
                                            <ChevronLeft className={`w-4 h-4 text-[#94a3b8] transition-all ${openModules.includes(modIdx) ? '-rotate-90' : ''}`} />
                                        </div>
                                        
                                        <AnimatePresence>
                                            {openModules.includes(modIdx) && (
                                                <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="overflow-hidden bg-[#fafbfc]">
                                                    {studentCurrentCourseProgress?.courseDetails?.curriculum.map((item, i) => {
                                                        const isDone = studentCurrentCourseProgress?.progress?.find(p => p.lectureId === item._id)?.viewed;
                                                        const isCurrent = currentLecture?._id === item._id;
                                                        return (
                                                            <div 
                                                                key={item._id} 
                                                                onClick={() => setCurrentLecture(item)}
                                                                className={`flex items-center gap-3 px-5 py-3.5 cursor-pointer relative transition-all ${isCurrent ? 'bg-[#eff6ff] border-l-[3px] border-[#0071e3]' : 'hover:bg-[#f8fafc] border-l-[3px] border-transparent'}`}
                                                            >
                                                                <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 border-2 transition-all ${isDone ? 'bg-[#dcfce7] border-[#16a34a] text-[#16a34a]' : isCurrent ? 'bg-[#eff6ff] border-[#0071e3] text-[#0071e3]' : 'bg-[#f1f5f9] border-[#e2e8f0]'}`}>
                                                                    {isDone ? <CheckCircle2 size={12} className="font-bold" /> : <Play size={8} className={isCurrent ? 'fill-current' : 'text-gray-300'} />}
                                                                </div>
                                                                <div className="min-w-0 flex-1">
                                                                    <div className={`text-[13px] leading-tight truncate ${isCurrent ? 'font-bold text-[#1a1a2e]' : 'text-[#475569]'}`}>{item.title}</div>
                                                                    <div className="flex items-center gap-2 mt-1 text-[11px] text-[#94a3b8]">
                                                                        <span>{i + 1} • 22 min</span>
                                                                        {i === 0 && <span className="text-[9px] font-black text-[#0071e3] bg-[#eff6ff] border border-[#bfdbfe] px-1.5 rounded-sm">FREE</span>}
                                                                        {i === 7 && <span className="text-[9px] font-black text-[#b45309] bg-[#fef3c7] border border-[#fde68a] px-1.5 rounded-sm uppercase tracking-tighter">Lab</span>}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                ))}
                            </div>
                        </motion.aside>
                    )}
                </AnimatePresence>
            </div>

            {/* COMPLETION MODAL */}
            <AnimatePresence>
                {showConfetti && (
                    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm">
                        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white rounded-[32px] p-12 max-w-lg w-full text-center shadow-2xl relative overflow-hidden">
                            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#0071e3] to-[#00d4ff]" />
                            <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-8 relative">
                                <Award className="w-12 h-12 text-green-600" />
                                <div className="absolute -top-2 -right-2 bg-yellow-400 text-white rounded-full p-2 border-4 border-white"><Trophy size={20} /></div>
                            </div>
                            <h2 className="text-[32px] font-black tracking-tight text-[#1d1d1f] mb-4 leading-tight">Mastery Achieved!</h2>
                            <p className="text-[15px] text-[#86868b] leading-relaxed mb-10 max-w-sm mx-auto">
                                Congratulations on completing <span className="text-[#1d1d1f] font-bold">"{studentCurrentCourseProgress?.courseDetails?.title}"</span>. You've unlocked 24 labs and earned a verified skill badge.
                            </p>
                            <div className="flex flex-col gap-3">
                                <button className="w-full bg-[#0071e3] text-white text-[14px] font-black py-4 rounded-2xl hover:bg-[#0077ed] transition-all flex items-center justify-center gap-2" onClick={() => setShowCertificate(true)}><Download size={18} /> Claim Your Certificate</button>
                                <div className="grid grid-cols-2 gap-3">
                                    <button className="bg-white border border-[#e2e8f0] text-[#1d1d1f] text-[13px] font-bold py-3.5 rounded-2xl hover:bg-[#f5f7fa] flex items-center justify-center gap-2" onClick={() => navigate("/student-courses")}><LayoutList size={16}/> My Courses</button>
                                    <button className="bg-white border border-[#e2e8f0] text-[#1d1d1f] text-[13px] font-bold py-3.5 rounded-2xl hover:bg-[#f5f7fa] flex items-center justify-center gap-2" onClick={async () => {
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
