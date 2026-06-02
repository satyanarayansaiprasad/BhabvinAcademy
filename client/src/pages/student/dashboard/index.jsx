import React, { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { AuthContext } from "@/context/auth-context";
import { StudentContext } from "@/context/student-context";

function StudentDashboardPage() {
    const navigate = useNavigate();
    const { auth } = useContext(AuthContext);
    const { studentBoughtCoursesList, fetchBoughtCourses } = useContext(StudentContext);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        if (auth?.user?._id) {
            fetchBoughtCourses(auth?.user?._id);
        }
    }, [auth]);

    const userFullName = auth?.user?.userFullName || auth?.user?.userName || "Arjun Mehta";
    const userInitials = userFullName
        .split(" ")
        .map(n => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();

    // Mapping categories to banners, emojis and gradients
    const getCategoryStyles = (category) => {
        const cat = category?.toLowerCase();
        switch (cat) {
            case "microsoft":
                return {
                    emoji: "🪟",
                    gradient: "from-[#0078d4] to-[#005a9e]",
                    tag: "Microsoft"
                };
            case "linux":
                return {
                    emoji: "🐧",
                    gradient: "from-[#e95420] to-[#772953]",
                    tag: "Linux"
                };
            case "networking":
                return {
                    emoji: "🌐",
                    gradient: "from-[#1ba1e2] to-[#0050ef]",
                    tag: "Networking"
                };
            case "cloud":
                return {
                    emoji: "☁️",
                    gradient: "from-[#0089d6] to-[#00bcf2]",
                    tag: "Cloud"
                };
            case "security":
                return {
                    emoji: "🔒",
                    gradient: "from-[#107c10] to-[#004b1c]",
                    tag: "Security"
                };
            default:
                return {
                    emoji: "📚",
                    gradient: "from-[#60a5fa] to-[#2563eb]",
                    tag: "General"
                };
        }
    };

    // Default mock courses matching mockup if DB list is empty
    const mockCourses = [
        {
            courseId: "mock-1",
            title: "Windows Server Administration",
            category: "microsoft",
            progress: 50,
            curriculumLength: 56,
            lessonsLeft: 28,
            nextLesson: "DHCP Config"
        },
        {
            courseId: "mock-2",
            title: "Cisco CCNA Bootcamp",
            category: "networking",
            progress: 24,
            curriculumLength: 74,
            lessonsLeft: 56,
            nextLesson: "OSI Model"
        },
        {
            courseId: "mock-3",
            title: "Azure Fundamentals AZ-900",
            category: "cloud",
            progress: 16,
            curriculumLength: 38,
            lessonsLeft: 32,
            nextLesson: "Azure Core"
        }
    ];

    const coursesToRender = studentBoughtCoursesList && studentBoughtCoursesList.length > 0
        ? studentBoughtCoursesList.map(c => ({
              courseId: c.courseId,
              title: c.title,
              category: c.category || "networking",
              progress: c.progress || 0,
              curriculumLength: c.curriculumLength || 50,
              lessonsLeft: c.lessonsLeft || Math.max(0, 50 - Math.round((c.progress || 0) * 0.5)),
              nextLesson: c.nextLesson || "Next Lesson"
          }))
        : mockCourses;

    const heatmapData = [
        0,0,0,1,0,2,3,1,0,1,2,4,3,1,0,0,1,3,4,2,1,0,0,2,3,1,4,2,0,1,
        2,3,1,0,1,4,3,2,1,0,0,1,2,4,3,1,2,3,0,1,4,2,1,0,0,2,3,4,1,0,
        1,2,3,0,1,2,4,3,1,0,0,1,2,3,4,2,1,0,1,3,4,2,1,0,0,1,2,3,4,1
    ];

    const getHeatmapColorClass = (level) => {
        switch (level) {
            case 1: return "bg-[#bfdbfe]";
            case 2: return "bg-[#60a5fa]";
            case 3: return "bg-[#2563eb]";
            case 4: return "bg-[#0071e3]";
            default: return "bg-[#f0f0f0]";
        }
    };

    return (
        <div className="flex min-h-screen bg-[#f5f5f7] font-sans text-[#1d1d1f] text-left">
            
            {/* SIDEBAR */}
            <aside className="w-[240px] min-h-screen bg-black text-[#f5f5f7] flex flex-col fixed top-0 left-0 z-50 py-6 overflow-y-auto no-scrollbar border-r border-white/5">
                <div className="px-6 pb-4 border-b border-white/[0.08] mb-0">
                    <Link to="/" className="text-[22px] font-bold tracking-tight text-[#f5f5f7] no-underline">
                        Bhavin<span className="text-[#0071e3]">Academy</span>
                    </Link>
                </div>

                {/* User Profile */}
                <div 
                    onClick={() => navigate("/profile")}
                    className="p-[12px_16px_14px] border-b border-white/[0.08] mb-2 cursor-pointer hover:bg-white/5 transition-all"
                    title="View account details"
                >
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#0071e3] to-[#00d4ff] flex items-center justify-center font-bold text-[12px] text-white shrink-0">
                            {userInitials}
                        </div>
                        <div className="min-w-0 flex-1">
                            <div className="text-[15px] font-semibold text-white truncate">{userFullName}</div>
                            <div className="text-[12px] text-[#6e6e73] mt-[1px]">Pro Plan · View Account ›</div>
                        </div>
                        <span className="text-[13px] text-[#6e6e73] shrink-0">⌄</span>
                    </div>
                </div>

                {/* Nav Links */}
                <p className="px-[24px] py-[8px] text-[12px] font-semibold uppercase tracking-[0.1em] text-[#6e6e73] mt-2">Main</p>
                <ul className="list-none px-4 space-y-1">
                    <li>
                        <Link to="/dashboard" className="flex items-center gap-2.5 p-[9px_12px] rounded-[10px] text-[15px] font-medium text-[#4da3ff] bg-[#0071e3]/18 no-underline">
                            <span className="w-[18px] text-center">📊</span> Dashboard
                        </Link>
                    </li>
                    <li>
                        <Link to="/student-courses" className="flex items-center gap-2.5 p-[9px_12px] rounded-[10px] text-[15px] font-medium text-[#86868b] hover:bg-white/5 hover:text-[#f5f5f7] transition-all no-underline">
                            <span className="w-[18px] text-center">📚</span> My Courses
                            {studentBoughtCoursesList?.length > 0 && (
                                <span className="ml-auto bg-[#0071e3] text-white text-[10px] font-bold p-[2px_7px] rounded-full">
                                    {studentBoughtCoursesList.length}
                                </span>
                            )}
                        </Link>
                    </li>
                    <li>
                        <Link to="/courses" className="flex items-center gap-2.5 p-[9px_12px] rounded-[10px] text-[15px] font-medium text-[#86868b] hover:bg-white/5 hover:text-[#f5f5f7] transition-all no-underline">
                            <span className="w-[18px] text-center">🗺️</span> Learning Paths
                        </Link>
                    </li>
                    <li>
                        <Link to="/exams" className="flex items-center gap-2.5 p-[9px_12px] rounded-[10px] text-[15px] font-medium text-[#86868b] hover:bg-white/5 hover:text-[#f5f5f7] transition-all no-underline">
                            <span className="w-[18px] text-center">📝</span> Practice Exams
                        </Link>
                    </li>
                </ul>

                <p className="px-[24px] py-[8px] text-[12px] font-semibold uppercase tracking-[0.1em] text-[#6e6e73] mt-2">Track</p>
                <ul className="list-none px-4 space-y-1">
                    <li>
                        <Link to="/profile" className="flex items-center gap-2.5 p-[9px_12px] rounded-[10px] text-[15px] font-medium text-[#86868b] hover:bg-white/5 hover:text-[#f5f5f7] transition-all no-underline">
                            <span className="w-[18px] text-center">📈</span> Progress
                        </Link>
                    </li>
                </ul>  

                <p className="px-[24px] py-[8px] text-[12px] font-semibold uppercase tracking-[0.1em] text-[#6e6e73] mt-2">Settings</p>
                <ul className="list-none px-4 space-y-1">
                    <li>
                        <Link to="/contact" className="flex items-center gap-2.5 p-[9px_12px] rounded-[10px] text-[15px] font-medium text-[#86868b] hover:bg-white/5 hover:text-[#f5f5f7] transition-all no-underline">
                            <span className="w-[18px] text-center">💬</span> Support
                        </Link>
                    </li>
                </ul>
            </aside>

            {/* MAIN CONTENT AREA */}
            <main className="ml-[240px] flex-1 flex flex-col min-h-screen">
                
                {/* TOPBAR */}
                <header className="bg-[#f5f5f7]/90 backdrop-blur-[20px] border-b border-black/7 px-8 h-[58px] flex items-center justify-between sticky top-0 z-40">
                    <div>
                        <div className="text-[14px] font-semibold text-[#1d1d1f]">Good morning, {userFullName.split(" ")[0]} 👋</div>
                        <div className="text-[12px] text-[#86868b] mt-[1px]">
                            {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 bg-white border border-[#d2d2d7] rounded-[8px] p-[7px_12px] w-[220px]">
                            <span className="text-[14px] text-[#86868b]">🔍</span>
                            <input 
                                type="text" 
                                placeholder="Search courses, labs…" 
                                className="border-none bg-none outline-none text-[13px] text-[#1d1d1f] w-full"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <button className="w-[34px] h-[34px] rounded-[8px] border border-[#d2d2d7] bg-white flex items-center justify-center cursor-pointer text-[15px] relative transition-colors hover:border-[#0071e3]">
                            🔔
                            <div className="absolute top-[6px] right-[6px] w-[7px] h-[7px] bg-[#0071e3] rounded-full border-[1.5px] border-[#f5f5f7]" />
                        </button>
                        <button className="w-[34px] h-[34px] rounded-[8px] border border-[#d2d2d7] bg-white flex items-center justify-center cursor-pointer text-[15px] transition-colors hover:border-[#0071e3]">
                            🛒
                        </button>
                        <div className="flex items-center gap-1.5 bg-white border border-[#d2d2d7] rounded-[8px] p-[7px_12px] text-[13px] font-semibold text-[#1d1d1f] select-none">
                            <span className="text-[14px]">🔥</span>
                            <span>12</span>
                        </div>
                    </div>
                </header>

                {/* CONTENT */}
                <div className="p-[28px_32px_40px] flex-1">
                    
                    {/* STATS ROW */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-7">
                        <div className="bg-white rounded-[16px] p-[20px_20px_18px] border border-black/6 shadow-sm hover:shadow-md transition-shadow">
                            <div className="text-[28px] font-extrabold tracking-tight text-[#1d1d1f] leading-none">47.5</div>
                            <div className="text-[15px] font-semibold text-[#86868b] mt-1">Hours Learned</div>
                            <div className="text-[11px] font-semibold mt-2.5 inline-flex items-center gap-1 p-[2px_8px] rounded-full bg-[#e6f4ea] text-[#1d6f42]">
                                ↑ +3.2 this week
                            </div>
                        </div>
                        
                        <div className="bg-white rounded-[16px] p-[20px_20px_18px] border border-black/6 shadow-sm hover:shadow-md transition-shadow">
                            <div className="text-[28px] font-extrabold tracking-tight text-[#1d1d1f] leading-none">
                                {studentBoughtCoursesList?.length || 3}
                            </div>
                            <div className="text-[15px] font-semibold text-[#86868b] mt-1">Courses Enrolled</div>
                            <div className="text-[11px] font-semibold mt-2.5 inline-flex items-center gap-1 p-[2px_8px] rounded-full bg-[#f5f5f7] text-[#6e6e73]">
                                1 completed
                            </div>
                        </div>

                        <div className="bg-white rounded-[16px] p-[20px_20px_18px] border border-black/6 shadow-sm hover:shadow-md transition-shadow">
                            <div className="text-[28px] font-extrabold tracking-tight text-[#1d1d1f] leading-none">12</div>
                            <div className="text-[15px] font-semibold text-[#86868b] mt-1">Day Streak</div>
                            <div className="text-[11px] font-semibold mt-2.5 inline-flex items-center gap-1 p-[2px_8px] rounded-full bg-[#e6f4ea] text-[#1d6f42]">
                                ↑ Best: 21 days
                            </div>
                        </div>
                    </div>

                    {/* CONTINUE LEARNING */}
                    <div className="flex items-end justify-between mb-4 mt-8">
                        <div>
                            <div className="text-[11px] font-bold text-[#0071e3] uppercase tracking-wider mb-1">In Progress</div>
                            <h2 className="text-[22px] font-extrabold tracking-tight text-[#1d1d1f]">Continue Learning</h2>
                        </div>
                        <Link to="/student-courses" className="text-[13px] font-semibold text-[#0071e3] hover:underline">
                            See all courses ›
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 mb-7">
                        {coursesToRender.slice(0, 3).map((course, i) => {
                            const styles = getCategoryStyles(course.category);
                            return (
                                <div 
                                    key={course.courseId}
                                    onClick={() => navigate(`/course-progress/${course.courseId}`)}
                                    className="bg-white rounded-[18px] overflow-hidden border border-black/6 shadow-sm hover:-translate-y-[3px] hover:shadow-lg transition-all cursor-pointer group"
                                >
                                    <div className={`h-[120px] bg-gradient-to-br ${styles.gradient} flex items-center justify-center text-[48px] relative shrink-0`}>
                                        {styles.emoji}
                                        <button className="absolute bottom-2.5 right-2.5 bg-white/20 backdrop-blur-[8px] border border-white/30 text-white text-[11px] font-semibold p-[5px_12px] rounded-full cursor-pointer hover:bg-white/35 transition-all">
                                            ▶ Resume
                                        </button>
                                    </div>
                                    <div className="p-4">
                                        <div className="text-[10px] font-semibold text-[#6e6e73] uppercase tracking-wider mb-1">
                                            {styles.tag}
                                        </div>
                                        <h3 className="text-[15px] font-semibold text-[#1d1d1f] mb-2.5 leading-snug line-clamp-2 h-10 group-hover:text-[#0071e3] transition-colors">
                                            {course.title}
                                        </h3>
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-[11px] text-[#86868b] font-medium">
                                                Lesson {course.curriculumLength - course.lessonsLeft} of {course.curriculumLength}
                                            </span>
                                            <span className="text-[11px] font-bold text-[#0071e3]">{course.progress}%</span>
                                        </div>
                                        <div className="w-full h-1 bg-[#f0f0f0] rounded-full overflow-hidden mb-3">
                                            <div 
                                                className="h-full bg-gradient-to-r from-[#0071e3] to-[#00d4ff] rounded-full transition-all duration-500" 
                                                style={{ width: `${course.progress}%` }} 
                                            />
                                        </div>
                                        <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-[#f0f0f0]">
                                            <span className="text-[11px] text-[#86868b]">{course.lessonsLeft} lessons left</span>
                                            <span className="text-[11px] font-semibold text-[#0071e3]">
                                                Up next: {course.nextLesson} →
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* TWO COLUMN: PATH + LABS */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5 mb-7 mt-8">
                        
                        {/* Learning Path */}
                        <div className="bg-white rounded-[18px] border border-black/6 p-[22px_22px_18px] shadow-sm">
                            <div className="text-[11px] font-bold text-[#0071e3] uppercase tracking-wider mb-2">Active Path</div>
                            <div className="flex items-center justify-between mb-1.5">
                                <h3 className="text-[18px] font-bold tracking-tight text-[#1d1d1f]">Microsoft Engineer</h3>
                                <span className="bg-[#e8f1fb] text-[#0071e3] text-[11px] font-semibold p-[3px_10px] rounded-full">
                                    Path 01
                                </span>
                            </div>
                            <div className="text-[12px] text-[#86868b] mb-4.5">4 courses · Est. 14 weeks · MCSA prep</div>
                            
                            <div className="space-y-0 mt-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-[26px] h-[26px] rounded-full bg-[#0071e3] text-white flex items-center justify-center text-[11px] font-bold shrink-0">✓</div>
                                    <div className="flex-1 min-w-0">
                                        <div className="text-[13px] font-semibold text-[#1d1d1f]">Windows Fundamentals</div>
                                        <div className="text-[11px] text-[#86868b]">Completed · 22 hrs</div>
                                    </div>
                                    <span className="text-[14px] text-[#0071e3]">✓</span>
                                </div>
                                <div className="w-[2px] h-4 bg-[#0071e3] ml-[12px]" />
                                
                                <div className="flex items-center gap-3">
                                    <div className="w-[26px] h-[26px] rounded-full bg-[#e8f1fb] border-2 border-[#0071e3] text-[#0071e3] flex items-center justify-center text-[11px] font-bold shrink-0">2</div>
                                    <div className="flex-1 min-w-0">
                                        <div className="text-[13px] font-semibold text-[#1d1d1f]">Windows Server Admin</div>
                                        <div className="text-[11px] text-[#86868b]">In progress · 50% done</div>
                                    </div>
                                </div>
                                <div className="w-[2px] h-4 bg-[#d2d2d7] ml-[12px]" />

                                <div className="flex items-center gap-3">
                                    <div className="w-[26px] h-[26px] rounded-full bg-[#f5f5f7] border border-[#d2d2d7] text-[#86868b] flex items-center justify-center text-[11px] font-bold shrink-0">3</div>
                                    <div className="flex-1 min-w-0">
                                        <div className="text-[13px] font-semibold text-[#86868b]">Active Directory Mastery</div>
                                        <div className="text-[11px] text-[#86868b]">Locked · 20 hrs</div>
                                    </div>
                                </div>
                                <div className="w-[2px] h-4 bg-[#d2d2d7] ml-[12px]" />

                                <div className="flex items-center gap-3">
                                    <div className="w-[26px] h-[26px] rounded-full bg-[#f5f5f7] border border-[#d2d2d7] text-[#86868b] flex items-center justify-center text-[11px] font-bold shrink-0">4</div>
                                    <div className="flex-1 min-w-0">
                                        <div className="text-[13px] font-semibold text-[#86868b]">Microsoft 365 Admin</div>
                                        <div className="text-[11px] text-[#86868b]">Locked · 18 hrs</div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-[18px] pt-3.5 border-t border-[#f0f0f0]">
                                <div className="flex justify-between items-center mb-1.5">
                                    <span className="text-[12px] text-[#86868b] font-medium">Overall path progress</span>
                                    <span className="text-[12px] font-bold text-[#0071e3]">37%</span>
                                </div>
                                <div className="w-full h-1 bg-[#f0f0f0] rounded-full overflow-hidden">
                                    <div className="h-full bg-gradient-to-r from-[#0071e3] to-[#00d4ff] rounded-full" style={{ width: '37%' }} />
                                </div>
                            </div>
                        </div>

                        {/* Upcoming Labs */}
                        <div className="bg-white rounded-[18px] border border-black/6 p-[22px_22px_18px] shadow-sm">
                            <div className="text-[11px] font-bold text-[#0071e3] uppercase tracking-wider mb-2">Due Soon</div>
                            <h3 className="text-[18px] font-bold tracking-tight text-[#1d1d1f] mb-[4px]">Upcoming Labs & Exams</h3>
                            <div className="text-[12px] text-[#86868b] mb-4">Stay on track with your schedule</div>
                            
                            <div className="flex flex-col gap-2.5">
                                {[
                                    { title: "DHCP Server Configuration Lab", due: "Due in 2 days · Windows Server", icon: "🪟", color: "from-[#0078d4] to-[#005a9e]", tag: "Due Soon", tagClass: "bg-[#fff3cd] text-[#856404]" },
                                    { title: "Subnetting Practice Exam", due: "Due in 5 days · CCNA", icon: "🌐", color: "from-[#1ba1e2] to-[#0050ef]", tag: "New", tagClass: "bg-[#e8f1fb] text-[#0071e3]" },
                                    { title: "Bash Scripting Challenge", due: "Open · Linux Admin", icon: "🐧", color: "from-[#e95420] to-[#772953]", tag: "Open", tagClass: "bg-[#e6f4ea] text-[#1d6f42]" },
                                    { title: "Security+ Mock Exam #3", due: "Starts Apr 5 · CompTIA Sec+", icon: "🔒", color: "from-[#107c10] to-[#004b1c]", tag: "Upcoming", tagClass: "bg-[#e8f1fb] text-[#0071e3]" }
                                ].map((lab, i) => (
                                    <div 
                                        key={i}
                                        className="flex items-center gap-3 p-[12px_14px] rounded-[12px] bg-[#f5f5f7] cursor-pointer hover:bg-[#ebebeb] transition-colors"
                                    >
                                        <div className={`w-9 h-9 rounded-[10px] bg-gradient-to-br ${lab.color} flex items-center justify-center text-[18px] text-white shrink-0`}>
                                            {lab.icon}
                                        </div>
                                        <div className="flex-1 min-w-0 text-left">
                                            <div className="text-[13px] font-semibold text-[#1d1d1f] truncate">{lab.title}</div>
                                            <div className="text-[11px] text-[#86868b] mt-[2px]">{lab.due}</div>
                                        </div>
                                        <span className={`text-[10px] font-bold p-[3px_9px] rounded-full uppercase tracking-tighter shrink-0 ${lab.tagClass}`}>
                                            {lab.tag}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>

                    {/* ACTIVITY HEATMAP */}
                    <div className="bg-white rounded-[18px] border border-black/6 p-6 shadow-sm mt-8">
                        <div className="flex items-end justify-between mb-4">
                            <div>
                                <div className="text-[11px] font-bold text-[#0071e3] uppercase tracking-wider mb-1">Activity</div>
                                <h2 className="text-[20px] font-extrabold tracking-tight text-[#1d1d1f]">Study Activity — Last 3 Months</h2>
                            </div>
                            <div className="flex items-center gap-1.5 select-none">
                                <span className="text-[11px] text-[#86868b]">Less</span>
                                <div className="flex gap-[3px]">
                                    {["bg-[#f0f0f0]", "bg-[#bfdbfe]", "bg-[#60a5fa]", "bg-[#2563eb]", "bg-[#0071e3]"].map((color, i) => (
                                        <div key={i} className={`w-[12px] h-[12px] rounded-[2px] ${color}`} />
                                    ))}
                                </div>
                                <span className="text-[11px] text-[#86868b]">More</span>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-1">
                            {heatmapData.map((level, i) => (
                                <motion.div 
                                    key={i}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.2, delay: i * 0.002 }}
                                    className={`w-[14px] h-[14px] rounded-[3px] cursor-pointer transition-transform duration-100 hover:scale-130 ${getHeatmapColorClass(level)}`}
                                    title={`${level === 0 ? 'No activity' : level + ' lesson' + (level > 1 ? 's' : '')} studied`}
                                />
                            ))}
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
}

export default StudentDashboardPage;
