import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
    Users, 
    DollarSign, 
    TrendingUp, 
    Download, 
    Star, 
    Clock, 
    MapPin, 
    ArrowUpRight, 
    ArrowDownRight, 
    MoreHorizontal,
    Play
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
    Table, 
    TableBody, 
    TableCell, 
    TableHead, 
    TableHeader, 
    TableRow 
} from "@/components/ui/table";
import { exportToCSV } from "@/utils/export";

function InstructorDashboard({ listOfCourses }) {
    
    function calculateStats() {
        if (!listOfCourses || !Array.isArray(listOfCourses)) {
            return { totalProfit: "0", totalStudents: 0, studentList: [] };
        }

        let totalProfit = 0;
        let totalStudents = 0;
        const studentList = [];

        listOfCourses.forEach((course) => {
            if (course?.students?.length) {
                totalStudents += course.students.length;
                course.students.forEach((student) => {
                    totalProfit += student.paidAmount ? parseFloat(student.paidAmount) : (course.pricing || 0);
                    studentList.push({
                        courseTitle: course.title || "Untitled Course",
                        studentName: student.studentName || "Guest",
                        studentEmail: student.studentEmail || "N/A",
                        purchasedDate: student.purchasedDate || null,
                    });
                });
            }
        });

        return {
            totalProfit: totalProfit.toLocaleString('en-IN'),
            totalStudents: totalStudents.toLocaleString(),
            studentList: [...studentList].sort((a, b) => new Date(b.purchasedDate) - new Date(a.purchasedDate))
        };
    }

    const stats = calculateStats();

    function handleExport() {
        const exportData = stats.studentList.map(s => ({
            "Course": s.courseTitle,
            "Student": s.studentName,
            "Email": s.studentEmail,
            "Date": s.purchasedDate ? new Date(s.purchasedDate).toLocaleDateString() : 'N/A'
        }));
        exportToCSV(exportData, `admin_overview_${new Date().toISOString().split('T')[0]}.csv`);
    }

    // Chart Components (Internal simple SVG implementations for high fidelity)
    const Sparkline = ({ color }) => (
        <svg viewBox="0 0 100 30" className="w-full h-8 mt-3 opacity-50">
            <motion.path
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                d="M0 25 L10 18 L20 22 L30 10 L40 20 L50 5 L60 25 L70 15 L80 10 L90 18 L100 2"
                fill="none"
                stroke={color}
                strokeWidth="2"
                strokeLinecap="round"
            />
        </svg>
    );

    return (
        <div className="space-y-8 pb-20">
            
            {/* KPI GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: "Total Students", value: stats.totalStudents, up: "18.4%", color: "#0071e3", bg: "before:bg-gradient-to-r before:from-[#0071e3] before:to-[#00d4ff]" },
                    { label: "Total Revenue", value: `₹${stats.totalProfit}`, up: "23.1%", color: "#30d158", bg: "before:bg-gradient-to-r before:from-[#30d158] before:to-[#32ade6]" },
                    { label: "Avg. Rating", value: "4.71", up: "0.09", color: "#ffd60a", bg: "before:bg-gradient-to-r before:from-[#ffd60a] before:to-[#ff9f0a]" },
                    { label: "Total Watch Time", value: "94.3K h", up: "31.7%", color: "#bf5af2", bg: "before:bg-gradient-to-r before:from-[#bf5af2] before:to-[#0071e3]" },
                ].map((card, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className={`bg-[#111118] border border-white/[0.06] rounded-2xl p-6 relative overflow-hidden group hover:border-[#0071e3]/40 transition-all cursor-default ${card.bg} before:absolute before:top-0 before:left-0 before:right-0 before:h-[2px]`}
                    >
                        <div className="text-[10px] font-bold text-[#555] uppercase tracking-widest mb-2">{card.label}</div>
                        <div className="text-[28px] font-black tracking-tight text-[#f5f5f7] leading-none mb-3">{card.value}</div>
                        <div className="flex items-center gap-1.5 text-[11px] font-bold">
                            <span className="text-[#30d158] flex items-center">↑ {card.up}</span>
                            <span className="text-[#555]">vs last period</span>
                        </div>
                        <Sparkline color={card.color} />
                    </motion.div>
                ))}
            </div>

            {/* SECOND ROW: REVENUE + ENROLLMENT */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Revenue Line Chart */}
                <div className="lg:col-span-2 bg-[#111118] border border-white/[0.06] rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-[14px] font-bold text-[#f5f5f7] tracking-tight">Monthly Revenue</h3>
                            <p className="text-[11px] text-[#555] mt-0.5">Subscription & one-time purchases · ₹</p>
                        </div>
                        <button className="text-[11px] font-bold text-[#0071e3] hover:underline">View all</button>
                    </div>
                    <div className="h-[200px] w-full relative">
                        <svg viewBox="0 0 600 200" className="w-full h-full overflow-visible">
                            <defs>
                                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#0071e3" stopOpacity="0.2" />
                                    <stop offset="100%" stopColor="#0071e3" stopOpacity="0" />
                                </linearGradient>
                            </defs>
                            {/* Grid lines */}
                            {[0, 1, 2, 3].map(i => (
                                <line key={i} x1="0" y1={10 + i * 60} x2="600" y2={10 + i * 60} stroke="white" strokeOpacity="0.04" strokeWidth="1" />
                            ))}
                            {/* Line path */}
                            <motion.path
                                initial={{ pathLength: 0 }}
                                animate={{ pathLength: 1 }}
                                transition={{ duration: 1.5, ease: "easeInOut" }}
                                d="M0 160 Q80 140 120 150 T200 110 T300 90 T400 105 T500 60 T600 40"
                                fill="none"
                                stroke="#0071e3"
                                strokeWidth="3"
                                strokeLinecap="round"
                            />
                            {/* Area fill */}
                            <motion.path
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 1 }}
                                d="M0 160 Q80 140 120 150 T200 110 T300 90 T400 105 T500 60 T600 40 L600 200 L0 200 Z"
                                fill="url(#revGrad)"
                            />
                            {/* Highlight dot */}
                            <circle cx="600" cy="40" r="5" fill="#0071e3" stroke="#111118" strokeWidth="2" />
                        </svg>
                        <div className="flex justify-between mt-4 px-2">
                            {["Apr", "Jun", "Aug", "Oct", "Dec", "Feb"].map(m => (
                                <span key={m} className="text-[9px] font-bold text-[#3a3a3a] uppercase">{m}</span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Enrollment Donut */}
                <div className="bg-[#111118] border border-white/[0.06] rounded-2xl p-6 flex flex-col items-center">
                    <div className="w-full text-left mb-6">
                        <h3 className="text-[14px] font-bold text-[#f5f5f7] tracking-tight">Category Distribution</h3>
                        <p className="text-[11px] text-[#555] mt-0.5">Active enrollments</p>
                    </div>
                    <div className="relative w-40 h-40 mb-8">
                        <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                            <circle cx="50" cy="50" r="40" fill="none" stroke="white" strokeOpacity="0.05" strokeWidth="12" />
                            <motion.circle 
                                cx="50" cy="50" r="40" fill="none" stroke="#0071e3" strokeWidth="12"
                                strokeDasharray="251.2" strokeDashoffset="62.8"
                                initial={{ strokeDashoffset: 251.2 }}
                                animate={{ strokeDashoffset: 62.8 }}
                                transition={{ duration: 1.5, ease: "easeOut" }}
                            />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-[20px] font-black leading-none">12.5K</span>
                            <span className="text-[9px] text-[#555] font-bold uppercase mt-1">Users</span>
                        </div>
                    </div>
                    <div className="w-full space-y-2.5">
                        {[
                            { label: "Microsoft", pct: "38%", color: "#0071e3" },
                            { label: "Cyber Security", pct: "26%", color: "#30d158" },
                            { label: "Networking", pct: "21%", color: "#ffd60a" },
                            { label: "Cloud", pct: "15%", color: "#bf5af2" },
                        ].map((cat, i) => (
                            <div key={i} className="flex items-center justify-between text-[11px]">
                                <div className="flex items-center gap-2 text-[#86868b]">
                                    <div className="w-2 h-2 rounded-full" style={{ background: cat.color }} />
                                    {cat.label}
                                </div>
                                <span className="font-bold text-[#f5f5f7]">{cat.pct}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* THIRD ROW: WATCH TIME + GAUGE + GEO */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Watch Time Bar Chart */}
                <div className="bg-[#111118] border border-white/[0.06] rounded-2xl p-6">
                    <div className="mb-6">
                        <h3 className="text-[14px] font-bold text-[#f5f5f7]">Daily Stream Time</h3>
                        <p className="text-[11px] text-[#555] mt-0.5">Hours per day (last 14 days)</p>
                    </div>
                    <div className="flex items-end justify-between h-32 gap-1.5 px-1">
                        {[40, 60, 45, 80, 75, 95, 90, 100, 85, 95, 80, 90, 85, 92].map((v, i) => (
                            <motion.div 
                                key={i}
                                initial={{ height: 0 }}
                                animate={{ height: `${v}%` }}
                                transition={{ delay: i * 0.05, duration: 0.8 }}
                                className={`flex-1 rounded-t-sm ${i === 13 ? 'bg-[#0071e3]' : 'bg-white/10 group-hover:bg-white/20'}`}
                            />
                        ))}
                    </div>
                    <div className="flex justify-between mt-3 text-[10px] font-bold text-[#333]">
                        <span>14D AGO</span>
                        <span>TODAY</span>
                    </div>
                </div>

                {/* Rating Gauge */}
                <div className="bg-[#111118] border border-white/[0.06] rounded-2xl p-6 flex flex-col items-center">
                    <div className="w-full text-left mb-4">
                        <h3 className="text-[14px] font-bold text-[#f5f5f7]">Student Satisfaction</h3>
                        <p className="text-[11px] text-[#555] mt-0.5">Global avg. from 8,240 reviews</p>
                    </div>
                    <div className="relative w-full aspect-video flex items-center justify-center overflow-hidden">
                        <svg viewBox="0 0 160 90" className="w-[180px] h-[100px]">
                            <path d="M 15,85 A 65,65 0 0 1 145,85" fill="none" stroke="white" strokeOpacity="0.05" strokeWidth="10" strokeLinecap="round" />
                            <motion.path 
                                d="M 15,85 A 65,65 0 0 1 145,85" fill="none" stroke="#ffd60a" strokeWidth="10" strokeLinecap="round"
                                strokeDasharray="204.2" strokeDashoffset="40.8"
                                initial={{ strokeDashoffset: 204.2 }}
                                animate={{ strokeDashoffset: 40.8 }}
                                transition={{ duration: 1.5, delay: 0.5 }}
                            />
                        </svg>
                        <div className="absolute bottom-2 flex flex-col items-center">
                            <span className="text-[32px] font-black leading-none">4.71</span>
                            <span className="flex items-center gap-1 text-[10px] text-[#ffd60a] font-bold mt-1">
                                <Star size={10} fill="currentColor" /> out of 5.0
                            </span>
                        </div>
                    </div>
                    <div className="w-full space-y-1.5 mt-2">
                        {[
                            { s: "★★★★★", p: 68 },
                            { s: "★★★★☆", p: 20 },
                            { s: "★★★☆☆", p: 8 },
                        ].map((r, i) => (
                            <div key={i} className="flex items-center gap-3">
                                <span className="text-[10px] text-[#ffd60a] w-14 tracking-tighter shrink-0">{r.s}</span>
                                <div className="flex-1 h-1 bg-white/[0.03] rounded-full overflow-hidden">
                                    <motion.div initial={{ width: 0 }} animate={{ width: `${r.p}%` }} className="h-full bg-[#ffd60a]" />
                                </div>
                                <span className="text-[10px] text-[#444] font-bold w-6 text-right shrink-0">{r.p}%</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Geo Students */}
                <div className="bg-[#111118] border border-white/[0.06] rounded-2xl p-6">
                    <div className="mb-6">
                        <h3 className="text-[14px] font-bold text-[#f5f5f7]">Top Learning Hubs</h3>
                        <p className="text-[11px] text-[#555] mt-0.5">Geographical student spread</p>
                    </div>
                    <div className="space-y-4">
                        {[
                            { country: "India", students: "8,421", pct: 68, flag: "🇮🇳" },
                            { country: "United States", students: "1,240", pct: 10, flag: "🇺🇸" },
                            { country: "United Kingdom", students: "820", pct: 7, flag: "🇬🇧" },
                            { country: "Germany", students: "512", pct: 4, flag: "🇩🇪" },
                        ].map((geo, i) => (
                            <div key={i} className="space-y-1.5">
                                <div className="flex items-center justify-between text-[11px]">
                                    <div className="flex items-center gap-3">
                                        <span className="text-sm">{geo.flag}</span>
                                        <span className="font-bold text-[#f5f5f7]">{geo.country}</span>
                                    </div>
                                    <span className="font-bold text-[#555]">{geo.students}</span>
                                </div>
                                <div className="w-full h-[3px] bg-white/[0.03] rounded-full overflow-hidden">
                                    <motion.div initial={{ width: 0 }} animate={{ width: `${geo.pct}%` }} className="h-full bg-gradient-to-r from-[#0071e3] to-[#00d4ff]" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>

            {/* RECENT ENROLLMENTS TABLE */}
            <div className="bg-[#111118] border border-white/[0.06] rounded-2xl overflow-hidden">
                <div className="p-7 flex items-center justify-between">
                    <div>
                        <h3 className="text-[15px] font-black tracking-tight text-[#f5f5f7]">Recent Progress Activity.</h3>
                        <p className="text-[11px] text-[#555] mt-0.5">Latest student enrollments and updates</p>
                    </div>
                    <Button onClick={handleExport} className="h-9 px-4 bg-white/[0.04] hover:bg-white/[0.08] text-[#86868b] text-[12px] font-bold rounded-xl flex items-center gap-2 transition-all">
                        <Download size={14} /> Export Report
                    </Button>
                </div>
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader className="bg-white/[0.01] border-white/[0.04]">
                            <TableRow className="hover:bg-transparent">
                                <TableHead className="py-5 px-7 font-bold text-[#3a3a3a] uppercase tracking-widest text-[9px]">Course Name</TableHead>
                                <TableHead className="py-5 px-7 font-bold text-[#3a3a3a] uppercase tracking-widest text-[9px]">Student Name</TableHead>
                                <TableHead className="py-5 px-7 font-bold text-[#3a3a3a] uppercase tracking-widest text-[9px]">Status</TableHead>
                                <TableHead className="py-5 px-7 font-bold text-[#3a3a3a] uppercase tracking-widest text-[9px] text-right">Date</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {stats.studentList.length > 0 ? (
                                stats.studentList.slice(0, 8).map((studentItem, index) => (
                                    <TableRow key={index} className="border-white/[0.04] group hover:bg-white/[0.02] transition-colors">
                                        <TableCell className="py-5 px-7">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-white/[0.04] flex items-center justify-center text-sm shrink-0">🎓</div>
                                                <span className="font-bold text-[#f5f5f7] text-[13px] group-hover:text-[#0071e3] transition-colors">{studentItem.courseTitle}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="py-5 px-7">
                                            <div className="flex items-center gap-2">
                                                <div className="w-6 h-6 rounded-full bg-slate-700 flex items-center justify-center text-[10px] font-black text-white shrink-0 uppercase">{studentItem.studentName.substring(0,2)}</div>
                                                <span className="text-[13px] text-[#86868b]">{studentItem.studentName}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="py-5 px-7">
                                            <span className="px-2 py-0.5 rounded-full bg-[#0071e3]/10 text-[#0071e3] text-[9px] font-black uppercase tracking-tighter">Enrolled</span>
                                        </TableCell>
                                        <TableCell className="py-5 px-7 text-right text-[12px] text-[#444] font-medium">
                                            {studentItem.purchasedDate ? new Date(studentItem.purchasedDate).toLocaleDateString() : 'N/A'}
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={4} className="py-20 text-center text-[#444] font-bold italic text-sm">No activity recorded yet.</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>

            {/* ACTIVITY FEED MODAL / PREVIEW */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="bg-[#111118] border border-white/[0.06] rounded-2xl p-7">
                    <h3 className="text-[14px] font-black text-[#f5f5f7] mb-6">Recent Activity</h3>
                    <div className="space-y-6">
                        {[
                            { dot: "#0071e3", text: "<strong>Priya Nair</strong> enrolled in <strong>Linux System Admin</strong>", time: "2 min ago" },
                            { dot: "#30d158", text: "<strong>Azure AZ-900</strong> course rating updated to <strong>4.6 ★</strong>", time: "14 min ago" },
                            { dot: "#ffd60a", text: "<strong>Rajesh Kumar</strong> completed <strong>CCNA Bootcamp</strong>", time: "31 min ago" },
                            { dot: "#bf5af2", text: "New subscription plan activated by <strong>TechCorp Pvt Ltd</strong>", time: "1 h ago" },
                        ].map((act, i) => (
                            <div key={i} className="flex gap-4">
                                <div className="mt-1.5 shrink-0">
                                    <div className="w-2 h-2 rounded-full" style={{ background: act.dot }} />
                                    {i !== 3 && <div className="w-px h-8 bg-white/[0.05] mx-auto mt-2" />}
                                </div>
                                <div>
                                    <p className="text-[12px] text-[#86868b] leading-relaxed" dangerouslySetInnerHTML={{ __html: act.text }} />
                                    <p className="text-[10px] text-[#3a3a3a] mt-1 font-bold uppercase">{act.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="bg-gradient-to-br from-[#0071e3]/10 to-transparent border border-[#0071e3]/20 rounded-2xl p-7 flex flex-col justify-center items-center text-center">
                    <div className="w-16 h-16 bg-[#0071e3] rounded-2xl shadow-xl shadow-[#0071e3]/30 flex items-center justify-center mb-6">
                        <Play fill="white" className="ml-1" />
                    </div>
                    <h3 className="text-[18px] font-black text-[#f5f5f7] mb-2">New Instructor Guide</h3>
                    <p className="text-[13px] text-[#86868b] max-w-[280px] leading-relaxed">Learn how to maximize your course reach and engage your students effectively.</p>
                    <Button className="mt-8 h-10 px-8 bg-[#0071e3] hover:bg-[#0077ed] text-white text-[13px] font-black rounded-xl">Watch Tutorial</Button>
                </div>
            </div>

        </div>
    );
}

export default InstructorDashboard;
