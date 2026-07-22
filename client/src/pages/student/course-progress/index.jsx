import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
    Award,
    RotateCcw,
    Star,
    Share2,
    X,
    Search,
    ChevronDown,
    ChevronUp,
    CheckSquare,
    Square,
    Sparkles,
    Clock,
    Globe,
    Smartphone,
    PlayCircle,
    FileText,
    CheckCircle2,
    MoreVertical,
    Download,
    ExternalLink,
    HelpCircle
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
    const [sidebarTab, setSidebarTab] = useState("content"); // 'content' or 'ai'
    const [showConfetti, setShowConfetti] = useState(false);
    const [showCertificate, setShowCertificate] = useState(false);
    const [openSections, setOpenSections] = useState({});
    const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
    const [openResourcesDropdown, setOpenResourcesDropdown] = useState(null);

    // Interactive state for Notes & Q&A
    const [notes, setNotes] = useState([
        { time: "08:15", text: "Key concept: Allocate largest subnets first when implementing VLSM address schemes." },
        { time: "14:30", text: "RFC 3021 allows /31 subnets on point-to-point serial and WAN links." }
    ]);
    const [newNoteText, setNewNoteText] = useState("");
    
    const [qaList, setQaList] = useState([
        {
            user: "Vijay Sharma",
            userInitials: "VS",
            userBg: "#5850ec",
            time: "2 days ago · at 18:44",
            text: "When using VLSM, if we allocate a /26 first and then a /28, does the /28 have to come right after the /26 block?",
            likes: 8,
            reply: {
                name: "Bhavin Patel",
                initials: "BP",
                text: "Great question! The /28 can go anywhere in the remaining space — no strict ordering is required protocol-wise."
            }
        }
    ]);
    const [newQuestionText, setNewQuestionText] = useState("");
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        fetchCurrentCourseProgress();
    }, [id]);

    async function fetchCurrentCourseProgress() {
        const response = await getCurrentCourseProgressService(auth?.user?._id, id);
        if (response?.success) {
            const courseDetails = response?.data?.courseDetails;
            const progress = response?.data?.progress;

            setStudentCurrentCourseProgress({
                courseDetails: courseDetails,
                progress: progress,
            });
            
            // Set up initial curriculum sections state (all expanded by default)
            if (courseDetails?.curriculum) {
                const initialSections = {};
                courseDetails.curriculum.forEach((item, idx) => {
                    const secTitle = item.section || "Section 1: Course Curriculum";
                    initialSections[secTitle] = true;
                });
                setOpenSections(initialSections);
            }

            if (response?.data?.completed) {
                setCurrentLecture(courseDetails?.curriculum[0]);
                setShowConfetti(true);
            } else if (progress?.length === 0) {
                setCurrentLecture(courseDetails?.curriculum[0]);
            } else {
                const lastIdx = progress.reduceRight((acc, obj, index) => acc === -1 && obj.viewed ? index : acc, -1);
                setCurrentLecture(courseDetails?.curriculum[lastIdx + 1] || courseDetails?.curriculum[0]);
            }
        }
    }

    const toggleSection = (secTitle) => {
        setOpenSections(prev => ({
            ...prev,
            [secTitle]: !prev[secTitle]
        }));
    };

    const handleMarkAsDone = async (lectureId) => {
        const targetId = lectureId || currentLecture?._id;
        if (targetId) {
            const response = await markLectureAsViewedService(
                auth?.user?._id, 
                studentCurrentCourseProgress?.courseDetails?._id, 
                targetId
            );
            if (response?.success) fetchCurrentCourseProgress();
        }
    };

    const handleSaveNote = () => {
        if (!newNoteText.trim()) return;
        const note = {
            time: "05:20",
            text: newNoteText.trim()
        };
        setNotes([note, ...notes]);
        setNewNoteText("");
    };

    const handlePostQuestion = () => {
        if (!newQuestionText.trim()) return;
        const initials = auth?.user?.userFullName ? auth.user.userFullName.split(" ").map(n => n[0]).join("").toUpperCase() : "ST";
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

    const curriculum = studentCurrentCourseProgress?.courseDetails?.curriculum || [];
    const viewedCount = studentCurrentCourseProgress?.progress?.filter(p => p.viewed).length || 0;
    const totalLectures = curriculum.length || 1;
    const progressValue = Math.round((viewedCount / totalLectures) * 100) || 0;

    // Group curriculum by section
    const groupedCurriculum = curriculum.reduce((acc, item, index) => {
        const secTitle = item.section || "Section 1: Course Curriculum";
        if (!acc[secTitle]) acc[secTitle] = [];
        acc[secTitle].push({ ...item, originalIndex: index });
        return acc;
    }, {});

    const userInitials = auth?.user?.userFullName 
        ? auth.user.userFullName.split(" ").map(n => n[0]).join("").toUpperCase() 
        : "BP";

    return (
        <div className="flex flex-col h-screen bg-[#1c1d1f] font-sans overflow-hidden text-white select-none">
            {showConfetti && <Confetti recycle={false} numberOfPieces={500} gravity={0.1} />}

            {/* TOP UDEMY DARK NAVBAR */}
            <nav className="h-[56px] bg-[#1c1d1f] border-b border-[#2d2f31] flex items-center justify-between px-4 sticky top-0 z-[100] shrink-0">
                {/* Left logo & course title */}
                <div className="flex items-center gap-3 min-w-0 flex-1">
                    <Link to="/" className="text-[18px] font-bold text-white no-underline tracking-tight shrink-0 hover:opacity-90">
                        Bhavin<span className="text-[#0071e3]">Academy</span>
                    </Link>
                    <div className="w-[1px] h-5 bg-[#3e4143] shrink-0 hidden sm:block" />
                    <h1 className="text-[14px] font-semibold text-[#f7f9fa] truncate max-w-[550px]" title={studentCurrentCourseProgress?.courseDetails?.title}>
                        {studentCurrentCourseProgress?.courseDetails?.title || "Digital Marketing, Social Media & AI Mastery"}
                    </h1>
                </div>

                {/* Right controls */}
                <div className="flex items-center gap-3 shrink-0">
                    {/* Star Rating Button */}
                    <button 
                        onClick={() => alert("Thank you for your 5-star rating!")}
                        className="hidden md:flex items-center gap-1.5 text-[13px] font-medium text-white hover:text-amber-400 bg-transparent border-none cursor-pointer px-2 py-1 transition-colors"
                    >
                        <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                        <span>Your rating</span>
                    </button>

                    {/* Progress / Get Certificate pill */}
                    <button 
                        onClick={() => progressValue === 100 ? setShowCertificate(true) : alert(`Course ${progressValue}% complete. Complete all lectures to claim your certificate.`)}
                        className="flex items-center gap-2 bg-transparent border border-[#6a6f73] hover:border-white text-white rounded-[4px] px-3 py-1.5 text-[12px] font-bold cursor-pointer transition-colors"
                    >
                        <div className="w-5 h-5 rounded-full border-2 border-white/40 flex items-center justify-center text-[9px]">
                            {progressValue}%
                        </div>
                        <span className="hidden sm:inline">{progressValue === 100 ? "Get Certificate 🏆" : "Get Certificate"}</span>
                    </button>

                    {/* Share Button */}
                    <button 
                        onClick={() => {
                            navigator.clipboard?.writeText(window.location.href);
                            alert("Course link copied to clipboard!");
                        }}
                        className="hidden sm:flex items-center gap-1.5 bg-transparent border border-[#6a6f73] hover:border-white text-white rounded-[4px] px-3 py-1.5 text-[12px] font-bold cursor-pointer transition-colors"
                    >
                        <Share2 className="w-3.5 h-3.5" />
                        <span>Share</span>
                    </button>

                    {/* Menu dots */}
                    <button className="text-white hover:bg-white/10 p-2 rounded-full cursor-pointer bg-transparent border-none">
                        <MoreVertical className="w-4 h-4" />
                    </button>
                </div>
            </nav>

            {/* MAIN LEARNING CONTENT SPLIT GRID */}
            <div className="flex flex-1 overflow-hidden min-h-0 relative">
                
                {/* MAIN COLUMN (PLAYER + TABS + OVERVIEW) */}
                <main className="flex-1 flex flex-col overflow-y-auto min-h-0 bg-white text-[#1c1d1f]">
                    
                    {/* VIDEO CONTAINER */}
                    <div className="bg-black aspect-video w-full shrink-0 relative overflow-hidden flex items-center justify-center">
                        <VideoPlayer
                            width="100%"
                            height="100%"
                            url={currentLecture?.videoUrl}
                            onProgressUpdate={setCurrentLecture}
                            progressData={currentLecture}
                        />
                    </div>

                    {/* SEPARATE DOWNLOADABLE FILE / RESOURCE BANNER */}
                    {currentLecture?.fileUrl && (
                        <div className="bg-[#f0f7ff] border-b border-[#bfdbfe] p-4 px-6 flex items-center justify-between flex-wrap gap-3 shrink-0">
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-lg bg-[#0071e3] text-white flex items-center justify-center shrink-0">
                                    <FileText className="w-5 h-5" />
                                </div>
                                <div>
                                    <div className="text-sm font-bold text-[#1c1d1f]">
                                        {currentLecture?.fileName || "Downloadable Resource Document"}
                                    </div>
                                    <div className="text-xs text-[#6a6f73]">
                                        Section resource file (PDF / Document)
                                    </div>
                                </div>
                            </div>
                            <a
                                href={currentLecture.fileUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                download
                                className="bg-[#0071e3] hover:bg-[#0077ed] text-white text-xs font-bold px-4 py-2 rounded-lg flex items-center gap-2 no-underline transition-colors shadow-sm"
                            >
                                <Download className="w-4 h-4" /> Download File Resource
                            </a>
                        </div>
                    )}

                    {/* SUB-VIDEO TABS NAVBAR */}
                    <div className="flex items-center border-b border-[#d1d7dc] px-6 bg-white shrink-0 overflow-x-auto no-scrollbar">
                        <button className="p-3 text-gray-600 hover:text-black bg-transparent border-none cursor-pointer">
                            <Search className="w-4 h-4" />
                        </button>

                        {[
                            { id: "overview", label: "Overview" },
                            { id: "qa", label: "Q&A" },
                            { id: "notes", label: "Notes" },
                            { id: "announcements", label: "Announcements" },
                            { id: "reviews", label: "Reviews" },
                            { id: "learning-tools", label: "Learning Tools" },
                        ].map(tab => (
                            <button 
                                key={tab.id} 
                                onClick={() => setActiveTab(tab.id)}
                                className={`py-4 px-4 text-[14px] font-bold cursor-pointer relative transition-colors border-none bg-transparent whitespace-nowrap ${
                                    activeTab === tab.id 
                                        ? 'text-[#1c1d1f] border-b-2 border-[#1c1d1f]' 
                                        : 'text-[#6a6f73] hover:text-[#1c1d1f]'
                                }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* TAB CONTENT AREA */}
                    <div className="p-6 md:p-8 flex-1 bg-white text-left max-w-[1000px]">
                        
                        {/* TAB 1: OVERVIEW */}
                        {activeTab === "overview" && (
                            <div className="space-y-8">
                                {/* Title & Stats */}
                                <div>
                                    <h2 className="text-[24px] font-bold text-[#1c1d1f] leading-snug mb-3">
                                        {studentCurrentCourseProgress?.courseDetails?.title || "Digital Marketing, Social Media, ChatGPT, Prompt Engineering, Google Ads, Facebook, SEO, WordPress, Instagram, YouTube."}
                                    </h2>

                                    {/* Ratings & Enrolled Bar */}
                                    <div className="flex items-center gap-4 text-[13px] text-[#2d2f31] flex-wrap mb-2">
                                        <div className="flex items-center gap-1">
                                            <span className="font-bold text-amber-600">4.5</span>
                                            <div className="flex text-amber-500">
                                                {"★".repeat(5)}
                                            </div>
                                            <span className="text-[#6a6f73] ml-1">(95,020 ratings)</span>
                                        </div>
                                        <span className="text-gray-300">•</span>
                                        <span className="font-semibold">290,864 Students</span>
                                        <span className="text-gray-300">•</span>
                                        <span className="font-semibold">96.5 hours Total</span>
                                    </div>

                                    {/* Meta Tags */}
                                    <div className="flex items-center gap-4 text-[13px] text-[#6a6f73] flex-wrap">
                                        <span className="flex items-center gap-1.5">
                                            <Clock className="w-3.5 h-3.5" /> Last updated June 2024
                                        </span>
                                        <span className="flex items-center gap-1.5">
                                            <Globe className="w-3.5 h-3.5" /> English [Auto], French, Arabic, <button className="text-[#0071e3] underline bg-transparent border-none cursor-pointer">20 more</button>
                                        </span>
                                    </div>
                                </div>

                                <hr className="border-t border-[#d1d7dc]" />

                                {/* Schedule Learning Time Card */}
                                <div className="bg-[#f7f9fa] border border-[#d1d7dc] rounded-[8px] p-5 flex items-start gap-4">
                                    <div className="p-3 bg-white rounded-full border border-[#d1d7dc] text-[#1c1d1f] shrink-0">
                                        <Clock className="w-6 h-6" />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="text-[16px] font-bold text-[#1c1d1f] mb-1">Schedule learning time</h4>
                                        <p className="text-[14px] text-[#6a6f73] leading-relaxed mb-4">
                                            Learning a little each day adds up. Research shows that students who make learning a habit are more likely to reach their goals. Get time slots to learn and get reminders using your learning schedule.
                                        </p>
                                        <div className="flex items-center gap-3">
                                            <button className="bg-[#a435f0] hover:bg-[#8710d8] text-white text-[13px] font-bold px-4 py-2 rounded-[4px] border-none cursor-pointer transition-colors">
                                                Get started
                                            </button>
                                            <button className="bg-transparent text-[#1c1d1f] hover:bg-gray-200 text-[13px] font-bold px-4 py-2 rounded-[4px] border-none cursor-pointer transition-colors">
                                                Dismiss
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* By the Numbers Section */}
                                <div>
                                    <h3 className="text-[18px] font-bold text-[#1c1d1f] mb-4">By the numbers</h3>
                                    <div className="grid grid-cols-2 md:grid-cols-2 gap-x-12 gap-y-3 text-[14px] text-[#2d2f31]">
                                        <div className="flex justify-between py-1 border-b border-gray-100">
                                            <span className="text-[#6a6f73]">Skill level:</span>
                                            <span className="font-semibold">{studentCurrentCourseProgress?.courseDetails?.level || "All Levels"}</span>
                                        </div>
                                        <div className="flex justify-between py-1 border-b border-gray-100">
                                            <span className="text-[#6a6f73]">Lectures:</span>
                                            <span className="font-semibold">{totalLectures}</span>
                                        </div>
                                        <div className="flex justify-between py-1 border-b border-gray-100">
                                            <span className="text-[#6a6f73]">Students:</span>
                                            <span className="font-semibold">290,861</span>
                                        </div>
                                        <div className="flex justify-between py-1 border-b border-gray-100">
                                            <span className="text-[#6a6f73]">Video:</span>
                                            <span className="font-semibold">96.5 total hours</span>
                                        </div>
                                        <div className="flex justify-between py-1 border-b border-gray-100">
                                            <span className="text-[#6a6f73]">Languages:</span>
                                            <span className="font-semibold">English</span>
                                        </div>
                                        <div className="flex justify-between py-1 border-b border-gray-100">
                                            <span className="text-[#6a6f73]">Captions:</span>
                                            <span className="font-semibold">Yes</span>
                                        </div>
                                    </div>
                                </div>

                                <hr className="border-t border-[#d1d7dc]" />

                                {/* Certificates Section */}
                                <div>
                                    <h3 className="text-[18px] font-bold text-[#1c1d1f] mb-2">Certificates</h3>
                                    <p className="text-[14px] text-[#6a6f73] mb-4">Get BhavinAcademy certificate by completing entire course</p>
                                    <button 
                                        onClick={() => progressValue === 100 ? setShowCertificate(true) : alert("Complete 100% of the course to unlock certificate!")}
                                        className="border border-[#1c1d1f] bg-white text-[#1c1d1f] font-bold text-[13px] px-5 py-2.5 rounded-[4px] hover:bg-[#f7f9fa] transition-colors cursor-pointer"
                                    >
                                        BhavinAcademy certificate
                                    </button>
                                </div>

                                <hr className="border-t border-[#d1d7dc]" />

                                {/* Features Section */}
                                <div>
                                    <h3 className="text-[18px] font-bold text-[#1c1d1f] mb-2">Features</h3>
                                    <p className="text-[14px] text-[#2d2f31] flex items-center gap-2">
                                        Available on <span className="font-bold text-[#a435f0]">iOS</span> and <span className="font-bold text-[#a435f0]">Android</span>
                                    </p>
                                </div>

                                <hr className="border-t border-[#d1d7dc]" />

                                {/* Description Section */}
                                <div>
                                    <h3 className="text-[18px] font-bold text-[#1c1d1f] mb-3">Description</h3>
                                    <div className={`text-[14px] text-[#2d2f31] leading-relaxed relative ${!isDescriptionExpanded ? 'line-clamp-4' : ''}`}>
                                        <p className="font-semibold mb-2">Congratulations, You Found It!</p>
                                        <p className="mb-2">
                                            {studentCurrentCourseProgress?.courseDetails?.description || 
                                             "The Most Complete Course on Digital Marketing, Social Media, ChatGPT, Prompt Engineering, Google Ads, Facebook, SEO, WordPress, Instagram, YouTube."}
                                        </p>
                                        <p>Instead of buying 27 different courses, this masterclass combines all essential topics into a single structured curriculum designed for career growth and hands-on skill mastery.</p>
                                    </div>
                                    <button 
                                        onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                                        className="mt-3 text-[#a435f0] hover:text-[#8710d8] font-bold text-[14px] flex items-center gap-1 bg-transparent border-none cursor-pointer"
                                    >
                                        {isDescriptionExpanded ? "Show less ▲" : "Show more ▼"}
                                    </button>
                                </div>

                            </div>
                        )}

                        {/* TAB 2: Q&A */}
                        {activeTab === "qa" && (
                            <div className="space-y-6 max-w-[800px]">
                                <div className="flex gap-3 items-start">
                                    <div className="w-[36px] h-[36px] rounded-full bg-[#a435f0] shrink-0 flex items-center justify-center text-[13px] font-bold text-white">
                                        {userInitials}
                                    </div>
                                    <div className="flex-1">
                                        <textarea 
                                            className="w-full bg-white border border-[#d1d7dc] rounded-[4px] p-3 text-[14px] text-[#1c1d1f] outline-none min-h-[90px] focus:border-[#a435f0] transition-colors placeholder:text-[#6a6f73]" 
                                            placeholder="Ask a question about this lecture..."
                                            value={newQuestionText}
                                            onChange={(e) => setNewQuestionText(e.target.value)}
                                        />
                                        <button 
                                            className="mt-2 bg-[#a435f0] text-white border-none px-4 py-2 rounded-[4px] text-[13px] font-bold cursor-pointer hover:bg-[#8710d8] transition-colors"
                                            onClick={handlePostQuestion}
                                        >
                                            Post Question
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-6 pt-4 border-t border-[#d1d7dc]">
                                    {qaList.map((qa, idx) => (
                                        <div key={idx} className="space-y-3">
                                            <div className="flex gap-3 items-start">
                                                <div 
                                                    className="w-[36px] h-[36px] rounded-full flex items-center justify-center text-[12px] font-bold text-white shrink-0"
                                                    style={{ backgroundColor: qa.userBg }}
                                                >
                                                    {qa.userInitials}
                                                </div>
                                                <div>
                                                    <div className="text-[14px] font-bold text-[#1c1d1f]">{qa.user}</div>
                                                    <div className="text-[12px] text-[#6a6f73]">{qa.time}</div>
                                                </div>
                                            </div>
                                            <p className="text-[14px] text-[#2d2f31] leading-relaxed pl-12">{qa.text}</p>
                                            {qa.reply && (
                                                <div className="ml-12 p-4 bg-[#f7f9fa] rounded-[8px] border-l-4 border-[#a435f0]">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className="text-[13px] font-bold text-[#1c1d1f]">{qa.reply.name}</span>
                                                        <span className="text-[10px] font-bold bg-[#a435f0] text-white px-1.5 py-0.5 rounded">Instructor</span>
                                                    </div>
                                                    <p className="text-[13px] text-[#2d2f31]">{qa.reply.text}</p>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* TAB 3: NOTES */}
                        {activeTab === "notes" && (
                            <div className="max-w-[800px] space-y-6">
                                <div>
                                    <textarea 
                                        className="w-full min-h-[140px] bg-white border border-[#d1d7dc] rounded-[4px] p-4 text-[14px] text-[#1c1d1f] outline-none focus:border-[#a435f0] transition-colors placeholder:text-[#6a6f73]"
                                        placeholder="Create a new note at 05:20..."
                                        value={newNoteText}
                                        onChange={(e) => setNewNoteText(e.target.value)}
                                    />
                                    <div className="flex justify-end mt-2">
                                        <button 
                                            className="bg-[#a435f0] text-white border-none px-5 py-2 rounded-[4px] text-[13px] font-bold cursor-pointer hover:bg-[#8710d8] transition-colors"
                                            onClick={handleSaveNote}
                                        >
                                            Save Note
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <h4 className="text-[14px] font-bold text-[#1c1d1f]">Your Saved Notes</h4>
                                    {notes.map((note, idx) => (
                                        <div key={idx} className="p-4 rounded-[6px] bg-[#f7f9fa] border border-[#d1d7dc]">
                                            <span className="text-[12px] font-bold bg-[#1c1d1f] text-white px-2 py-0.5 rounded mr-2">
                                                {note.time}
                                            </span>
                                            <span className="text-[14px] text-[#2d2f31]">{note.text}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* TAB 4: ANNOUNCEMENTS */}
                        {activeTab === "announcements" && (
                            <div className="max-w-[800px] space-y-4">
                                <div className="p-6 bg-[#f7f9fa] border border-[#d1d7dc] rounded-[8px]">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="w-10 h-10 rounded-full bg-[#0071e3] text-white font-bold flex items-center justify-center text-sm">BP</div>
                                        <div>
                                            <div className="font-bold text-[15px] text-[#1c1d1f]">Bhavin Patel</div>
                                            <div className="text-[12px] text-[#6a6f73]">Posted 3 days ago</div>
                                        </div>
                                    </div>
                                    <h4 className="font-bold text-[16px] mb-2 text-[#1c1d1f]">New AI & ChatGPT Prompting Modules Added!</h4>
                                    <p className="text-[14px] text-[#6a6f73] leading-relaxed">
                                        We have updated the curriculum with 12 new hands-on AI workflow lectures. Make sure to check out Section 14 for the updated resources!
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* TAB 5: REVIEWS */}
                        {activeTab === "reviews" && (
                            <div className="max-w-[800px] space-y-6">
                                <div className="flex items-center gap-6 p-6 bg-[#f7f9fa] border border-[#d1d7dc] rounded-[8px]">
                                    <div className="text-center">
                                        <div className="text-[48px] font-black text-[#1c1d1f] leading-none">4.5</div>
                                        <div className="text-amber-500 text-[18px] my-1">★★★★★</div>
                                        <div className="text-[12px] text-[#6a6f73]">Course Rating</div>
                                    </div>
                                    <div className="flex-1 space-y-1 text-[12px]">
                                        {[5, 4, 3, 2, 1].map((stars) => (
                                            <div key={stars} className="flex items-center gap-2">
                                                <span className="w-12 text-[#6a6f73]">{stars} stars</span>
                                                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                                                    <div className="h-full bg-amber-500" style={{ width: `${stars === 5 ? 70 : stars === 4 ? 20 : 5}%` }} />
                                                </div>
                                                <span className="w-8 text-[#6a6f73]">{stars === 5 ? '70%' : '20%'}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* TAB 6: LEARNING TOOLS */}
                        {activeTab === "learning-tools" && (
                            <div className="max-w-[800px] space-y-4">
                                <div className="p-6 border border-[#d1d7dc] rounded-[8px] bg-[#f7f9fa]">
                                    <h4 className="font-bold text-[16px] text-[#1c1d1f] mb-2">Learning Reminders</h4>
                                    <p className="text-[14px] text-[#6a6f73] mb-4">Set up push notifications or calendar invites to keep your study schedule on track.</p>
                                    <button className="bg-[#1c1d1f] text-white text-[13px] font-bold px-4 py-2 rounded-[4px] border-none cursor-pointer">
                                        Sync Calendar (.ics)
                                    </button>
                                </div>
                            </div>
                        )}

                    </div>

                    {/* UDEMY BOTTOM FOOTER */}
                    <footer className="bg-[#1c1d1f] text-white mt-auto pt-10 pb-8 px-6 md:px-12 border-t border-[#2d2f31]">
                        {/* Top banner */}
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-8 border-b border-[#2d2f31]">
                            <div>
                                <h4 className="text-[16px] font-bold text-white mb-1">Teach the world online</h4>
                                <p className="text-[13px] text-[#aeaeb2]">Create an online video course, reach students across the globe, and earn money</p>
                            </div>
                            <button className="border border-white hover:bg-white/10 text-white font-bold text-[13px] px-5 py-2.5 rounded-[4px] bg-transparent cursor-pointer whitespace-nowrap">
                                Teach on BhavinAcademy
                            </button>
                        </div>

                        {/* Companies banner */}
                        <div className="py-6 border-b border-[#2d2f31] flex flex-col md:flex-row items-center justify-between gap-4">
                            <span className="text-[13px] font-bold text-[#aeaeb2]">Top companies choose BhavinAcademy Business to build in-demand career skills.</span>
                            <div className="flex items-center gap-6 text-[#aeaeb2] font-black text-sm tracking-wider opacity-75">
                                <span>NASDAQ</span>
                                <span>VOLKSWAGEN</span>
                                <span>NETAPP</span>
                                <span>EVENTBRITE</span>
                            </div>
                        </div>

                        {/* Links Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-8 text-[12px] text-[#aeaeb2]">
                            <div className="space-y-2">
                                <div className="font-bold text-white mb-2">In-demand Careers</div>
                                <div>Data Scientist</div>
                                <div>Full Stack Web Developer</div>
                                <div>Cloud Engineer</div>
                                <div>Project Manager</div>
                            </div>
                            <div className="space-y-2">
                                <div className="font-bold text-white mb-2">Web Development</div>
                                <div>JavaScript</div>
                                <div>React JS</div>
                                <div>Angular</div>
                                <div>Node.js</div>
                            </div>
                            <div className="space-y-2">
                                <div className="font-bold text-white mb-2">IT Certifications</div>
                                <div>Amazon AWS</div>
                                <div>Microsoft Azure</div>
                                <div>Cisco CCNA</div>
                                <div>CompTIA Security+</div>
                            </div>
                            <div className="space-y-2">
                                <div className="font-bold text-white mb-2">Leadership & AI</div>
                                <div>Management Skills</div>
                                <div>Artificial Intelligence</div>
                                <div>ChatGPT Prompting</div>
                                <div>Data Analytics</div>
                            </div>
                        </div>

                        {/* Copyright */}
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-[#2d2f31] text-[12px] text-[#aeaeb2]">
                            <div className="flex items-center gap-3">
                                <span className="text-[16px] font-bold text-white">Bhavin<span className="text-[#0071e3]">Academy</span></span>
                                <span>© 2026 BhavinAcademy, Inc.</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <button className="hover:text-white bg-transparent border-none cursor-pointer text-[#aeaeb2]">Cookie settings</button>
                                <button className="flex items-center gap-1 hover:text-white bg-transparent border-none cursor-pointer text-[#aeaeb2]">
                                    <Globe className="w-3.5 h-3.5" /> English
                                </button>
                            </div>
                        </div>
                    </footer>
                </main>

                {/* RIGHT SIDEBAR (COURSE CONTENT ACCORDION) */}
                {isSideBarOpen ? (
                    <aside className="w-[360px] md:w-[400px] bg-white border-l border-[#d1d7dc] flex flex-col shrink-0 overflow-hidden text-left z-20">
                        {/* Sidebar Header with Tabs & Close button */}
                        <div className="flex items-center justify-between border-b border-[#d1d7dc] px-4 py-3 bg-white shrink-0">
                            <div className="flex items-center gap-4 text-[14px]">
                                <button 
                                    onClick={() => setSidebarTab("content")}
                                    className={`font-bold pb-1 bg-transparent border-none cursor-pointer ${sidebarTab === "content" ? 'text-[#1c1d1f] border-b-2 border-[#1c1d1f]' : 'text-[#6a6f73]'}`}
                                >
                                    Course content
                                </button>
                                <button 
                                    onClick={() => setSidebarTab("ai")}
                                    className={`font-bold pb-1 flex items-center gap-1 bg-transparent border-none cursor-pointer ${sidebarTab === "ai" ? 'text-[#1c1d1f] border-b-2 border-[#1c1d1f]' : 'text-[#6a6f73]'}`}
                                >
                                    <Sparkles className="w-3.5 h-3.5 text-[#a435f0]" /> AI Assistant
                                </button>
                            </div>
                            <button 
                                onClick={() => setIsSideBarOpen(false)}
                                className="text-[#1c1d1f] hover:bg-gray-100 p-1.5 rounded-full cursor-pointer bg-transparent border-none"
                                title="Close sidebar"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Sidebar Content (Sections Accordion) */}
                        {sidebarTab === "content" ? (
                            <div className="flex-1 overflow-y-auto no-scrollbar">
                                {Object.keys(groupedCurriculum).map((secTitle, secIdx) => {
                                    const sectionLectures = groupedCurriculum[secTitle];
                                    const completedSecCount = sectionLectures.filter(l => studentCurrentCourseProgress?.progress?.find(p => p.lectureId === l._id)?.viewed).length;
                                    const isExpanded = openSections[secTitle] !== false;

                                    return (
                                        <div key={secIdx} className="border-b border-[#d1d7dc]">
                                            {/* Section Accordion Header */}
                                            <div 
                                                onClick={() => toggleSection(secTitle)}
                                                className="p-4 bg-[#f7f9fa] hover:bg-[#e9ecef] cursor-pointer flex items-start justify-between gap-2 transition-colors select-none"
                                            >
                                                <div>
                                                    <h3 className="text-[14px] font-bold text-[#1c1d1f] leading-snug">
                                                        {secTitle}
                                                    </h3>
                                                    <div className="text-[12px] text-[#6a6f73] mt-1">
                                                        {completedSecCount} / {sectionLectures.length} | {sectionLectures.length * 8}m
                                                    </div>
                                                </div>
                                                <button className="bg-transparent border-none cursor-pointer text-[#1c1d1f] mt-0.5">
                                                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                                </button>
                                            </div>

                                            {/* Lectures List inside section */}
                                            {isExpanded && (
                                                <div className="divide-y divide-gray-100 bg-white">
                                                    {sectionLectures.map((lecture) => {
                                                        const isDone = studentCurrentCourseProgress?.progress?.find(p => p.lectureId === lecture._id)?.viewed;
                                                        const isCurrent = currentLecture?._id === lecture._id;

                                                        return (
                                                            <div 
                                                                key={lecture._id}
                                                                className={`p-3.5 px-4 flex items-start gap-3 transition-colors relative group ${
                                                                    isCurrent ? 'bg-[#f7f9fa]' : 'hover:bg-gray-50'
                                                                }`}
                                                            >
                                                                {/* Checkbox */}
                                                                <button 
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        handleMarkAsDone(lecture._id);
                                                                    }}
                                                                    className="mt-0.5 text-[#1c1d1f] hover:text-[#a435f0] bg-transparent border-none cursor-pointer shrink-0"
                                                                >
                                                                    {isDone ? (
                                                                        <CheckSquare className="w-4 h-4 text-[#1c1d1f] fill-[#1c1d1f] text-white" />
                                                                    ) : (
                                                                        <Square className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                                                                    )}
                                                                </button>

                                                                {/* Title & info */}
                                                                <div 
                                                                    className="flex-1 min-w-0 cursor-pointer"
                                                                    onClick={() => setCurrentLecture(lecture)}
                                                                >
                                                                    <div className={`text-[13px] leading-snug line-clamp-2 ${isCurrent ? 'font-bold text-[#1c1d1f]' : 'text-[#2d2f31]'}`}>
                                                                        {lecture.title}
                                                                    </div>
                                                                    <div className="flex items-center gap-2 mt-1 text-[11px] text-[#6a6f73]">
                                                                        <span className="flex items-center gap-1">
                                                                            <PlayCircle className="w-3 h-3 text-gray-400" /> 8 min
                                                                        </span>
                                                                    </div>
                                                                </div>

                                                                {/* Resources dropdown / download button */}
                                                                {lecture.fileUrl ? (
                                                                    <a 
                                                                        href={lecture.fileUrl}
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        download
                                                                        onClick={(e) => e.stopPropagation()}
                                                                        className="flex items-center gap-1 border border-emerald-200 text-emerald-700 hover:bg-emerald-50 rounded-[4px] px-2 py-1 text-[11px] font-semibold bg-white cursor-pointer no-underline shrink-0"
                                                                        title="Download attached file resource"
                                                                    >
                                                                        <Download className="w-3 h-3 text-emerald-600" />
                                                                        <span>File</span>
                                                                    </a>
                                                                ) : (
                                                                    <div className="relative shrink-0">
                                                                        <button 
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                setOpenResourcesDropdown(openResourcesDropdown === lecture._id ? null : lecture._id);
                                                                            }}
                                                                            className="flex items-center gap-1 border border-[#d1d7dc] text-[#1c1d1f] hover:bg-gray-100 rounded-[4px] px-2 py-1 text-[11px] font-semibold bg-white cursor-pointer"
                                                                        >
                                                                            <FileText className="w-3 h-3 text-[#0071e3]" />
                                                                            <span>Resources</span>
                                                                            <ChevronDown className="w-3 h-3" />
                                                                        </button>

                                                                        {/* Dropdown Menu */}
                                                                        {openResourcesDropdown === lecture._id && (
                                                                            <div className="absolute right-0 top-7 w-48 bg-white border border-[#d1d7dc] rounded-[4px] shadow-lg z-50 p-2 space-y-1">
                                                                                <a 
                                                                                    href="#" 
                                                                                    onClick={(e) => { e.preventDefault(); alert("Downloading lecture notes..."); }}
                                                                                    className="flex items-center gap-2 p-1.5 text-[12px] text-[#1c1d1f] hover:bg-gray-100 rounded no-underline"
                                                                                >
                                                                                    <Download className="w-3.5 h-3.5 text-[#0071e3]" /> Lecture PDF Notes
                                                                                </a>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            /* AI Assistant Tab */
                            <div className="p-5 flex-1 flex flex-col space-y-4">
                                <div className="p-4 bg-[#f0f7ff] border border-[#bfdbfe] rounded-[8px] text-[13px] text-[#1c1d1f]">
                                    <div className="font-bold mb-1 flex items-center gap-1.5 text-[#0071e3]">
                                        <Sparkles className="w-4 h-4" /> AI Study Assistant
                                    </div>
                                    Ask any question about this lecture or request a quick summary!
                                </div>
                                <div className="flex-1 border border-[#d1d7dc] rounded-[8px] p-3 text-[13px] text-gray-500 overflow-y-auto">
                                    AI Assistant is ready. Type your prompt below.
                                </div>
                                <div className="flex gap-2">
                                    <input 
                                        type="text"
                                        placeholder="Ask AI about this video..."
                                        className="flex-1 border border-[#d1d7dc] rounded-[4px] px-3 py-2 text-[13px] outline-none focus:border-[#a435f0]"
                                    />
                                    <button className="bg-[#a435f0] text-white px-3 py-2 rounded-[4px] font-bold text-[12px] border-none cursor-pointer">
                                        Ask
                                    </button>
                                </div>
                            </div>
                        )}
                    </aside>
                ) : (
                    /* Toggle button to reopen sidebar */
                    <button 
                        onClick={() => setIsSideBarOpen(true)}
                        className="fixed right-0 top-24 bg-[#1c1d1f] text-white p-2.5 rounded-l-md shadow-lg border border-r-0 border-[#2d2f31] z-30 cursor-pointer flex items-center gap-1 text-[12px] font-bold"
                    >
                        <span>Course Content</span> ◀
                    </button>
                )}
            </div>

            {/* COMPLETION CELEBRATION MODAL */}
            <AnimatePresence>
                {showConfetti && (
                    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm">
                        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white text-[#1c1d1f] rounded-[24px] p-10 max-w-lg w-full text-center shadow-2xl relative overflow-hidden">
                            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#0071e3] to-[#a435f0]" />
                            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Award className="w-10 h-10 text-green-600" />
                            </div>
                            <h2 className="text-[28px] font-bold tracking-tight mb-3">Congratulations!</h2>
                            <p className="text-[14px] text-[#6a6f73] leading-relaxed mb-8">
                                You have successfully completed <span className="text-[#1c1d1f] font-bold">"{studentCurrentCourseProgress?.courseDetails?.title}"</span>.
                            </p>
                            <div className="flex flex-col gap-3">
                                <button className="w-full bg-[#a435f0] text-white text-[14px] font-bold py-3.5 rounded-[4px] hover:bg-[#8710d8] transition-colors border-none cursor-pointer" onClick={() => setShowCertificate(true)}>
                                    Claim Your Certificate 🏆
                                </button>
                                <div className="grid grid-cols-2 gap-3">
                                    <button className="bg-white border border-[#d1d7dc] text-[#1c1d1f] text-[13px] font-bold py-3 rounded-[4px] hover:bg-gray-50 cursor-pointer" onClick={() => navigate("/student-courses")}>
                                        My Courses
                                    </button>
                                    <button className="bg-white border border-[#d1d7dc] text-[#1c1d1f] text-[13px] font-bold py-3 rounded-[4px] hover:bg-gray-50 flex items-center justify-center gap-2 cursor-pointer" onClick={async () => {
                                        const response = await resetCourseProgressService(auth?.user?._id, studentCurrentCourseProgress?.courseDetails?._id);
                                        if (response?.success) { setShowConfetti(false); fetchCurrentCourseProgress(); }
                                    }}>
                                        <RotateCcw size={15}/> Rewatch
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* CERTIFICATE DOWNLOADING COMPONENT */}
            {showCertificate && (
                <Certificate
                    key={studentCurrentCourseProgress?.courseDetails?._id}
                    userName={auth?.user?.userFullName || auth?.user?.userName}
                    courseTitle={studentCurrentCourseProgress?.courseDetails?.title}
                    completionDate={new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
                    instructorName={studentCurrentCourseProgress?.courseDetails?.instructorName || "Bhavin Patel"}
                    silentDownload={true}
                    onDownloadComplete={() => setShowCertificate(false)}
                />
            )}
        </div>
    );
}

export default StudentViewCourseProgressPage;
