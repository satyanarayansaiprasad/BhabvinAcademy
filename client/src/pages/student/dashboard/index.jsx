import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
    LayoutDashboard, 
    BookOpen, 
    Route, 
    FileText, 
    TrendingUp, 
    Settings, 
    Search, 
    Bell, 
    ShoppingCart, 
    Play, 
    CheckCircle2, 
    Clock, 
    ChevronRight,
    Flame,
    MoreVertical
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

function StudentDashboardPage() {
    const location = useLocation();
    const [searchQuery, setSearchQuery] = useState("");

    const reveal = {
        initial: { opacity: 0, y: 15 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.4 }
    };

    const heatmapData = [
        0,0,0,1,0,2,3,1,0,1,2,4,3,1,0,0,1,3,4,2,1,0,0,2,3,1,4,2,0,1,
        2,3,1,0,1,4,3,2,1,0,0,1,2,4,3,1,2,3,0,1,4,2,1,0,0,2,3,4,1,0,
        1,2,3,0,1,2,4,3,1,0,0,1,2,3,4,2,1,0,1,3,4,2,1,0,0,1,2,3,4,1
    ];

    const getHeatmapColor = (level) => {
        switch(level) {
            case 1: return "bg-blue-200";
            case 2: return "bg-blue-400";
            case 3: return "bg-blue-600";
            case 4: return "bg-blue-700";
            default: return "bg-[#f0f0f0]";
        }
    };

    const sidebarNav = [
        { icon: <LayoutDashboard size={18} />, label: "Dashboard", path: "/dashboard", active: true },
        { icon: <BookOpen size={18} />, label: "My Courses", path: "/student-courses", badge: "3" },
        { icon: <Route size={18} />, label: "Learning Paths", path: "/paths" },
        { icon: <FileText size={18} />, label: "Practice Exams", path: "/exams" },
    ];

    return (
        <div className="flex min-h-screen bg-[#f5f5f7] font-['Inter']">
            {/* SIDEBAR */}
            <aside className="w-[240px] bg-black text-white flex flex-col fixed inset-y-0 left-0 z-50">
                <div className="p-6 border-b border-white/10">
                    <Link to="/" className="text-[22px] font-bold tracking-tight">Bhavin<span className="text-[#0071e3]">Academy</span></Link>
                </div>

                <div className="p-4 border-b border-white/10 hover:bg-white/5 transition-colors cursor-pointer group">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#0071e3] to-[#00d4ff] flex items-center justify-center font-bold text-[12px]">AM</div>
                        <div className="min-w-0 flex-1">
                            <div className="text-[14px] font-bold truncate">Arjun Mehta</div>
                            <div className="text-[11px] text-[#86868b]">Pro Plan · View Account ›</div>
                        </div>
                        <MoreVertical size={14} className="text-[#86868b] group-hover:text-white" />
                    </div>
                </div>

                <nav className="flex-1 p-4 space-y-8 overflow-y-auto no-scrollbar">
                    <div>
                        <p className="text-[10px] font-black text-[#86868b] uppercase tracking-widest px-3 mb-4">Main</p>
                        <ul className="space-y-1">
                            {sidebarNav.map((item, i) => (
                                <li key={i}>
                                    <Link to={item.path} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-[14px] font-semibold transition-all ${item.active ? 'bg-[#0071e3]/20 text-[#40a9ff]' : 'text-[#86868b] hover:bg-white/5 hover:text-white'}`}>
                                        <span className={item.active ? 'text-[#0071e3]' : ''}>{item.icon}</span>
                                        {item.label}
                                        {item.badge && <span className="ml-auto bg-[#0071e3] text-white text-[10px] font-black px-2 py-0.5 rounded-full">{item.badge}</span>}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <p className="text-[10px] font-black text-[#86868b] uppercase tracking-widest px-3 mb-4">Track</p>
                        <ul className="space-y-1">
                            <li><Link className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[14px] font-semibold text-[#86868b] hover:bg-white/5 hover:text-white transition-all"><TrendingUp size={18} /> Progress</Link></li>
                        </ul>
                    </div>

                    <div className="mt-auto pt-8">
                        <p className="text-[10px] font-black text-[#86868b] uppercase tracking-widest px-3 mb-4">Settings</p>
                        <ul className="space-y-1">
                            <li><Link className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[14px] font-semibold text-[#86868b] hover:bg-white/5 hover:text-white transition-all"><Settings size={18} /> Account Settings</Link></li>
                        </ul>
                    </div>
                </nav>
            </aside>

            {/* MAIN CONTENT */}
            <main className="ml-[240px] flex-1 flex flex-col min-h-screen">
                {/* TOPBAR */}
                <header className="h-[58px] bg-white/80 backdrop-blur-xl border-b border-[#000]/5 sticky top-0 z-40 px-8 flex items-center justify-between">
                    <div>
                        <div className="text-[14px] font-bold text-[#1d1d1f]">Good morning, Arjun 👋</div>
                        <div className="text-[11px] text-[#86868b]">Wednesday, 1 April 2026</div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="relative w-[220px]">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#86868b]" size={14} />
                            <input 
                                type="text" 
                                placeholder="Search courses, labs..." 
                                className="w-full bg-[#f5f5f7] border border-[#d2d2d7] rounded-lg pl-9 pr-4 py-1.5 text-[13px] outline-none focus:border-[#0071e3] focus:bg-white transition-all"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <button className="w-9 h-9 border border-[#d2d2d7] rounded-lg flex items-center justify-center text-[#1d1d1f] hover:border-[#0071e3] transition-all relative">
                            <Bell size={18} />
                            <div className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#0071e3] rounded-full ring-2 ring-white" />
                        </button>
                        <button className="w-9 h-9 border border-[#d2d2d7] rounded-lg flex items-center justify-center text-[#1d1d1f] hover:border-[#0071e3] transition-all">
                            <ShoppingCart size={18} />
                        </button>
                    </div>
                </header>

                <div className="p-8">
                    {/* STATS */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-10">
                        {[
                            { val: "47.5", label: "Hours Learned", change: "↑ +3.2 this week", up: true },
                            { val: "3", label: "Courses Enrolled", change: "1 completed", neutral: true },
                            { val: "12", label: "Day Streak", change: "↑ Best: 21 days", up: true },
                        ].map((s, i) => (
                            <motion.div key={i} {...reveal} transition={{ delay: i * 0.1 }} className="bg-white rounded-2xl p-6 border border-black/5 hover:shadow-lg transition-shadow">
                                <div className="text-[28px] font-extrabold tracking-tight text-[#1d1d1f]">{s.val}</div>
                                <div className="text-[15px] font-medium text-[#86868b] mt-1">{s.label}</div>
                                <div className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold mt-3 ${s.up ? 'bg-[#e6f4ea] text-[#1d6f42]' : 'bg-[#f5f5f7] text-[#6e6e73]'}`}>
                                    {s.change}
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* CONTINUE LEARNING */}
                    <div className="mb-10">
                        <div className="flex items-end justify-between mb-6">
                            <div>
                                <div className="text-[11px] font-black text-[#0071e3] uppercase tracking-widest mb-1">In Progress</div>
                                <h2 className="text-[22px] font-extrabold tracking-tight text-[#1d1d1f]">Continue Learning</h2>
                            </div>
                            <Link to="/student-courses" className="text-[13px] font-bold text-[#0071e3] hover:underline">See all courses ›</Link>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {[
                                { title: "Windows Server Administration", tag: "Microsoft", progress: 50, color: "from-[#0078d4] to-[#005a9e]", icon: "🪟", next: "DHCP Config" },
                                { title: "Cisco CCNA Bootcamp", tag: "Networking", progress: 24, color: "from-[#1ba1e2] to-[#0050ef]", icon: "🌐", next: "OSI Model" },
                                { title: "Azure Fundamentals AZ-900", tag: "Cloud", progress: 16, color: "from-[#0089d6] to-[#00bcf2]", icon: "☁️", next: "Azure Core" },
                            ].map((c, i) => (
                                <motion.div key={i} {...reveal} transition={{ delay: i * 0.1 }} className="bg-white rounded-[20px] overflow-hidden border border-black/5 group cursor-pointer hover:shadow-2xl transition-all">
                                    <div className={`h-[120px] bg-gradient-to-br ${c.color} relative flex items-center justify-center overflow-hidden`}>
                                        <span className="text-5xl drop-shadow-lg group-hover:scale-110 transition-transform duration-500">{c.icon}</span>
                                        <button className="absolute bottom-3 right-3 bg-white/20 backdrop-blur-md border border-white/30 text-white text-[11px] font-bold px-4 py-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">▶ Resume</button>
                                    </div>
                                    <div className="p-5">
                                        <div className="text-[10px] font-black text-[#86868b] uppercase tracking-widest mb-1">{c.tag}</div>
                                        <h3 className="text-[15px] font-bold text-[#1d1d1f] mb-3 leading-snug line-clamp-2 h-10">{c.title}</h3>
                                        <div className="flex justify-between text-[11px] font-bold mb-2">
                                            <span className="text-[#86868b]">Progress</span>
                                            <span className="text-[#0071e3]">{c.progress}%</span>
                                        </div>
                                        <div className="h-1 bg-[#f0f0f0] rounded-full overflow-hidden mb-4">
                                            <div className="h-full bg-gradient-to-r from-[#0071e3] to-[#00d4ff]" style={{ width: `${c.progress}%` }} />
                                        </div>
                                        <div className="flex items-center justify-between text-[11px]">
                                            <span className="text-[#86868b]">Last activity: 2h ago</span>
                                            <span className="text-[#0071e3] font-bold">Next: {c.next} →</span>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* TWO COLUMN */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-10">
                        {/* Learning Path CARD */}
                        <div className="bg-white rounded-[24px] p-8 border border-black/5 shadow-sm">
                            <div className="text-[11px] font-black text-[#0071e3] uppercase tracking-widest mb-2">Active Path</div>
                            <div className="flex items-center justify-between mb-1">
                                <h3 className="text-[20px] font-extrabold tracking-tight">Microsoft Engineer</h3>
                                <span className="bg-[#e8f1fb] text-[#0071e3] text-[11px] font-bold px-2.5 py-1 rounded-full">Path 01</span>
                            </div>
                            <p className="text-[12px] text-[#86868b] mb-8">4 courses · Est. 14 weeks · MCSA prep</p>

                            <div className="space-y-0">
                                {[
                                    { label: "Windows Fundamentals", status: "done", time: "22 hrs" },
                                    { label: "Windows Server Admin", status: "active", time: "50% done" },
                                    { label: "Active Directory Mastery", status: "todo", time: "20 hrs" },
                                    { label: "Microsoft 365 Admin", status: "todo", time: "18 hrs" },
                                ].map((step, i, arr) => (
                                    <React.Fragment key={i}>
                                        <div className="flex items-center gap-4">
                                            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[12px] font-black border-2 transition-colors ${step.status === 'done' ? 'bg-[#0071e3] border-[#0071e3] text-white' : step.status === 'active' ? 'bg-[#e8f1fb] border-[#0071e3] text-[#0071e3]' : 'bg-[#f5f5f7] border-[#d2d2d7] text-[#86868b]'}`}>
                                                {step.status === 'done' ? <CheckCircle2 size={14} /> : i + 1}
                                            </div>
                                            <div className="flex-1">
                                                <div className={`text-[13px] font-bold ${step.status === 'todo' ? 'text-[#86868b]' : 'text-[#1d1d1f]'}`}>{step.label}</div>
                                                <div className="text-[11px] text-[#86868b]">{step.time}</div>
                                            </div>
                                            {step.status === 'done' && <CheckCircle2 size={16} className="text-[#0071e3]" />}
                                        </div>
                                        {i < arr.length - 1 && (
                                            <div className={`w-0.5 h-6 ml-3.5 my-1 ${step.status === 'done' ? 'bg-[#0071e3]' : 'bg-[#d2d2d7]'}`} />
                                        )}
                                    </React.Fragment>
                                ))}
                            </div>

                            <div className="mt-8 pt-6 border-t border-[#f0f0f0]">
                                <div className="flex justify-between text-[12px] font-bold mb-2">
                                    <span className="text-[#86868b]">Overall Progress</span>
                                    <span className="text-[#0071e3]">37%</span>
                                </div>
                                <div className="h-1.5 bg-[#f0f0f0] rounded-full overflow-hidden">
                                    <div className="h-full bg-gradient-to-r from-[#0071e3] to-[#00d4ff]" style={{ width: '37%' }} />
                                </div>
                            </div>
                        </div>

                        {/* UPCOMING LABS */}
                        <div className="bg-white rounded-[24px] p-8 border border-black/5 shadow-sm">
                            <div className="text-[11px] font-black text-[#0071e3] uppercase tracking-widest mb-2">Due Soon</div>
                            <h3 className="text-[20px] font-extrabold tracking-tight mb-1">Labs & Exams</h3>
                            <p className="text-[12px] text-[#86868b] mb-8">Stay on track with your certification goals</p>

                            <div className="space-y-3">
                                {[
                                    { title: "DHCP Server Configuration", due: "2 days", tag: "Due Soon", tagColor: "bg-red-50 text-red-600", icon: "🪟", color: "from-[#0078d4] to-[#005a9e]" },
                                    { title: "Subnetting Practice Exam", due: "5 days", tag: "New", tagColor: "bg-blue-50 text-blue-600", icon: "🌐", color: "from-[#1ba1e2] to-[#0050ef]" },
                                    { title: "Bash Scripting Challenge", due: "Open", tag: "High Priority", tagColor: "bg-orange-50 text-orange-600", icon: "🐧", color: "from-[#e95420] to-[#772953]" },
                                    { title: "Azure Storage Explorer Lab", due: "1 week", tag: "Upcoming", tagColor: "bg-gray-100 text-gray-600", icon: "☁️", color: "from-[#0089d6] to-[#00bcf2]" },
                                ].map((lab, i) => (
                                    <div key={i} className="flex items-center gap-4 p-3.5 rounded-2xl bg-[#f5f5f7] hover:bg-[#ebebeb] transition-colors cursor-pointer group">
                                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${lab.color} flex items-center justify-center text-lg shrink-0`}>{lab.icon}</div>
                                        <div className="flex-1 min-w-0">
                                            <div className="text-[13px] font-bold text-[#1d1d1f] truncate group-hover:text-[#0071e3] transition-colors">{lab.title}</div>
                                            <div className="text-[11px] text-[#86868b] mt-0.5">Due in {lab.due}</div>
                                        </div>
                                        <span className={`text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-tighter ${lab.tagColor}`}>{lab.tag}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* ACTIVITY HEATMAP */}
                    <div className="bg-white rounded-[24px] p-8 border border-black/5 shadow-sm">
                        <div className="flex items-end justify-between mb-8">
                            <div>
                                <div className="text-[11px] font-black text-[#0071e3] uppercase tracking-widest mb-1">Consistency</div>
                                <h2 className="text-[20px] font-extrabold tracking-tight text-[#1d1d1f]">Study Activity — Last 3 Months</h2>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-[11px] text-[#86868b]">Less</span>
                                <div className="flex gap-1">
                                    {[0, 1, 2, 3, 4].map(l => (
                                        <div key={l} className={`w-3 h-3 rounded-sm ${getHeatmapColor(l)}`} />
                                    ))}
                                </div>
                                <span className="text-[11px] text-[#86868b]">More</span>
                            </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-1.5">
                            {heatmapData.map((level, i) => (
                                <motion.div 
                                    key={i} 
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: i * 0.005 }}
                                    className={`w-3.5 h-3.5 rounded-[3px] ${getHeatmapColor(level)} transition-transform hover:scale-150 cursor-pointer`}
                                    title={`${level} lessons completed`}
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
