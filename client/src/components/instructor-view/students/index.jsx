import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
    Users, 
    BookOpen, 
    CheckCircle, 
    Search, 
    ChevronDown, 
    ChevronUp,
    RefreshCw, 
    Mail, 
    UserCircle, 
    Award, 
    ShieldCheck, 
    ShieldX, 
    Trash2, 
    AlertCircle, 
    Download 
} from "lucide-react";
import { fetchAdminStudentProgressService, deleteAdminStudentService } from "@/services";
import { exportToCSV } from "@/utils/export";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function InstructorStudentsData() {
    const [studentsData, setStudentsData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [expandedStudent, setExpandedStudent] = useState(null);
    const [deletingStudent, setDeletingStudent] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [period, setPeriod] = useState("all");

    async function loadStudentsData() {
        setLoading(true);
        const response = await fetchAdminStudentProgressService();
        if (response?.success) setStudentsData(response.data);
        setLoading(false);
    }

    async function handleDeleteStudent() {
        if (!deletingStudent) return;
        setIsDeleting(true);
        const response = await deleteAdminStudentService(deletingStudent.studentId);
        setIsDeleting(false);
        setDeletingStudent(null);
        if (response?.success) {
            setStudentsData((prev) => prev.filter((s) => s.studentId !== deletingStudent.studentId));
        }
    }

    function handleExportStudents() {
        const exportData = filteredStudents.map(student => ({
            "Full Name": student.userFullName || student.userName,
            "Email": student.userEmail,
            "Enrollment Date": student.createdAt ? new Date(student.createdAt).toLocaleDateString() : "N/A",
            "Courses": student.courses?.length || 0,
            "Avg Progress": student.courses?.length > 0
                ? Math.round(student.courses.reduce((sum, c) => sum + c.completionPercentage, 0) / student.courses.length) + "%"
                : "0%"
        }));
        exportToCSV(exportData, `student_census_${new Date().toLocaleDateString()}.csv`);
    }

    useEffect(() => { loadStudentsData(); }, []);

    const filteredStudents = studentsData.filter((s) => {
        const matchesSearch = s.userName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.userEmail?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.userFullName?.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesSearch;
    });

    const activeStudentsCount = filteredStudents.filter(s => s.status !== "blocked").length;
    const totalEnrollmentsCount = filteredStudents.reduce((acc, s) => acc + (s.courses?.length || 0), 0);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-40 gap-4">
                <RefreshCw className="h-10 w-10 text-[#0071e3] animate-spin" />
                <p className="text-[12px] font-bold text-[#444] uppercase tracking-widest">Loading Records...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            
            {/* MODULE HEADER */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                <div>
                    <h2 className="text-[32px] font-black tracking-tighter text-[#f5f5f7] mb-1">students.</h2>
                    <p className="text-[#86868b] text-[13px] font-medium tracking-tight">Systematic census of active learners and progress tracking.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button
                        onClick={handleExportStudents}
                        className="h-11 px-6 bg-white/[0.04] hover:bg-white/[0.08] text-[#86868b] text-[13px] font-bold rounded-xl flex items-center gap-2 transition-all border border-white/[0.04]"
                    >
                        <Download size={16} /> Export Census
                    </Button>
                </div>
            </div>

            {/* QUICK STATS */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: "Total Census", value: studentsData.length, icon: Users, color: "bg-[#0071e3]" },
                    { label: "Active Nodes", value: activeStudentsCount, icon: ShieldCheck, color: "bg-[#30d158]" },
                    { label: "Live Subscriptions", value: totalEnrollmentsCount, icon: BookOpen, color: "bg-[#bf5af2]" },
                    { label: "Mastery Rate", value: "72%", icon: Award, color: "bg-[#ffd60a]" },
                ].map((stat, i) => (
                    <div key={i} className="bg-[#111118] border border-white/[0.06] rounded-2xl p-5 relative overflow-hidden group">
                        <div className={`absolute top-0 left-0 w-1 h-full ${stat.color} opacity-40 group-hover:opacity-100 transition-opacity`} />
                        <div className="flex items-center gap-4">
                            <div className={`${stat.color} w-9 h-9 rounded-xl flex items-center justify-center text-white shrink-0 shadow-lg shadow-black/20`}>
                                <stat.icon className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-[20px] font-black text-[#f5f5f7] leading-none mb-1">{stat.value}</p>
                                <p className="text-[9px] font-black text-[#444] uppercase tracking-[0.1em]">{stat.label}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* FILTERS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-5 bg-[#111118] border border-white/[0.06] rounded-2xl">
                <div className="md:col-span-2 space-y-1.5">
                    <Label className="text-[9px] font-bold uppercase tracking-[0.1em] text-[#444] ml-1">Search Database</Label>
                    <div className="relative">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#444]" />
                        <Input
                            placeholder="Name, email or unique student ID..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="h-11 pl-10 bg-white/[0.03] border-white/[0.08] rounded-xl text-[13px] text-[#f5f5f7] placeholder:text-[#3a3a3a] outline-none"
                        />
                    </div>
                </div>
                <div className="space-y-1.5">
                    <Label className="text-[9px] font-bold uppercase tracking-[0.1em] text-[#444] ml-1">Census Period</Label>
                    <Select value={period} onValueChange={setPeriod}>
                        <SelectTrigger className="h-11 bg-white/[0.03] border-white/[0.08] rounded-xl text-[13px] text-[#f5f5f7]">
                            <SelectValue placeholder="All Time" />
                        </SelectTrigger>
                        <SelectContent className="bg-[#1c1c1e] border-white/[0.1] text-[#f5f5f7]">
                            <SelectItem value="all">Lifetime Census</SelectItem>
                            <SelectItem value="recent">Last 30 Days</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* CENSUS LIST */}
            <div className="bg-[#111118] border border-white/[0.06] rounded-2xl overflow-hidden shadow-2xl">
                {filteredStudents.length === 0 ? (
                    <div className="py-32 text-center">
                        <div className="w-16 h-16 bg-white/[0.03] rounded-3xl flex items-center justify-center text-3xl mb-6 mx-auto">👥</div>
                        <h3 className="text-xl font-bold text-[#f5f5f7] mb-1">Database empty.</h3>
                        <p className="text-[#555] text-sm font-medium">No records found matching your current query.</p>
                    </div>
                ) : (
                    <div className="divide-y divide-white/[0.04]">
                        {filteredStudents.map((student) => {
                            const isExpanded = expandedStudent === student.studentId;
                            const avgProgress = student.courses?.length > 0
                                ? Math.round(student.courses.reduce((sum, c) => sum + c.completionPercentage, 0) / student.courses.length)
                                : 0;
                            const isBlocked = student.status === "blocked";

                            return (
                                <div key={student.studentId} className="group">
                                    <div className={`w-full flex items-center gap-4 px-6 py-4 transition-all ${isExpanded ? 'bg-white/[0.02]' : 'hover:bg-white/[0.01]'}`}>
                                        <button onClick={() => setExpandedStudent(isExpanded ? null : student.studentId)} className="flex flex-1 items-center gap-4 text-left min-w-0">
                                            <div className="w-11 h-11 rounded-full overflow-hidden shrink-0 border-2 border-white/[0.05] bg-gradient-to-tr from-[#0071e3] to-[#00d4ff] flex items-center justify-center shadow-lg">
                                                {student.profileImage ? (
                                                    <img src={student.profileImage} alt={student.userName} className="w-full h-full object-cover" />
                                                ) : (
                                                    <span className="text-white font-black text-xs uppercase">
                                                        {(student.userFullName || student.userName || "?")[0]}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-0.5">
                                                    <p className="font-bold text-[#f5f5f7] text-[15px] truncate group-hover:text-[#0071e3] transition-colors">
                                                        {student.userFullName || student.userName}
                                                    </p>
                                                    <span className={`px-1.5 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest ${isBlocked ? 'bg-[#ff453a]/10 text-[#ff453a]' : 'bg-[#30d158]/10 text-[#30d158]'}`}>
                                                        {isBlocked ? 'BLOCKED' : 'ACTIVE'}
                                                    </span>
                                                </div>
                                                <p className="text-[12px] text-[#555] truncate font-medium">{student.userEmail}</p>
                                            </div>
                                            
                                            <div className="hidden sm:flex items-center gap-4 shrink-0 px-6">
                                                <div className="text-center">
                                                    <p className="text-[14px] font-black text-[#f5f5f7] leading-none mb-1">{student.courses?.length || 0}</p>
                                                    <p className="text-[8px] text-[#333] font-black uppercase tracking-widest">Enrollments</p>
                                                </div>
                                                <div className="w-px h-6 bg-white/[0.04]" />
                                                <div className="w-32">
                                                    <div className="flex justify-between items-center mb-1.5 text-[9px] font-black text-[#444] uppercase tracking-tighter">
                                                        <span>Progress</span>
                                                        <span className="text-[#f5f5f7]">{avgProgress}%</span>
                                                    </div>
                                                    <div className="h-[3px] bg-white/[0.04] rounded-full overflow-hidden">
                                                        <div className="h-full bg-[#0071e3] transition-all duration-1000" style={{ width: `${avgProgress}%` }} />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="text-[#333] shrink-0">
                                                {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                            </div>
                                        </button>
                                        
                                        <button
                                            onClick={() => setDeletingStudent(student)}
                                            className="p-2 rounded-xl text-[#333] hover:text-[#ff453a] hover:bg-[#ff453a]/10 transition-all shrink-0"
                                            title="Delete Record"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>

                                    {/* EXPANDED PERFORMANCE DETAILS */}
                                    <AnimatePresence>
                                        {isExpanded && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: "auto", opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                className="overflow-hidden bg-[#0c0c11]"
                                            >
                                                <div className="p-8 space-y-8 border-t border-white/[0.02]">
                                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                                        {/* Profile Info */}
                                                        <div className="space-y-4">
                                                            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#444]">Administrative Profile</h4>
                                                            <div className="bg-[#111118] border border-white/[0.04] rounded-2xl p-6 space-y-4">
                                                                <div className="flex items-center gap-4">
                                                                    <div className="w-10 h-10 rounded-xl bg-white/[0.03] flex items-center justify-center text-[#86868b]"><BadgeCheck size={20} /></div>
                                                                    <div>
                                                                        <p className="text-[9px] font-black text-[#444] uppercase tracking-widest leading-none mb-1">Verification Status</p>
                                                                        <p className="text-[13px] font-bold text-[#f5f5f7]">Verified Professional Account</p>
                                                                    </div>
                                                                </div>
                                                                <div className="flex items-center gap-4">
                                                                    <div className="w-10 h-10 rounded-xl bg-white/[0.03] flex items-center justify-center text-[#86868b]"><Mail size={18} /></div>
                                                                    <div>
                                                                        <p className="text-[9px] font-black text-[#444] uppercase tracking-widest leading-none mb-1">Contact Metadata</p>
                                                                        <p className="text-[13px] font-bold text-[#f5f5f7]">{student.userEmail}</p>
                                                                    </div>
                                                                </div>
                                                                {student.userBio && (
                                                                    <div className="p-4 bg-white/[0.02] border border-white/[0.04] rounded-xl">
                                                                        <p className="text-[12px] text-[#86868b] leading-relaxed italic">"{student.userBio}"</p>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>

                                                        {/* Summary Metrics */}
                                                        <div className="space-y-4">
                                                            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#444]">Enrollment Metrics</h4>
                                                            <div className="grid grid-cols-2 gap-4">
                                                                <div className="bg-[#111118] border border-white/[0.04] rounded-2xl p-6 text-center group hover:border-[#0071e3]/30 transition-all">
                                                                    <p className="text-3xl font-black text-[#f5f5f7] mb-1 leading-none">{student.courses?.length || 0}</p>
                                                                    <p className="text-[9px] font-black text-[#444] uppercase tracking-[0.1em]">Subscriptions</p>
                                                                </div>
                                                                <div className="bg-[#111118] border border-white/[0.04] rounded-2xl p-6 text-center group hover:border-[#30d158]/30 transition-all">
                                                                    <p className="text-3xl font-black text-[#30d158] mb-1 leading-none">{student.courses?.filter(c => c.isCompleted).length || 0}</p>
                                                                    <p className="text-[9px] font-black text-[#444] uppercase tracking-[0.1em]">Certifications</p>
                                                                </div>
                                                            </div>
                                                            <div className={`p-4 rounded-xl flex items-center justify-between ${isBlocked ? 'bg-[#ff453a]/10 border border-[#ff453a]/20' : 'bg-[#30d158]/10 border border-[#30d158]/20'}`}>
                                                                <div className="flex items-center gap-3">
                                                                    {isBlocked ? <ShieldX className="h-4 w-4 text-[#ff453a]" /> : <ShieldCheck className="h-4 w-4 text-[#30d158]" />}
                                                                    <span className={`text-[12px] font-black uppercase tracking-widest ${isBlocked ? 'text-[#ff453a]' : 'text-[#30d158]'}`}>
                                                                        Security Status: {isBlocked ? 'Node Access Terminated' : 'Operational'}
                                                                    </span>
                                                                </div>
                                                                <button className="text-[10px] font-black text-[#f5f5f7] bg-white/[0.05] hover:bg-white/[0.1] px-3 py-1.5 rounded-lg border border-white/[0.05] transition-all">
                                                                    Toggle Access
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Course List */}
                                                    <div className="space-y-4 pt-4">
                                                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#444]">Detailed Progress Log</h4>
                                                        <div className="space-y-3">
                                                            {student.courses?.map((course) => (
                                                                <div key={course.courseId} className="flex items-center gap-4 bg-[#111118] border border-white/[0.04] rounded-2xl px-6 py-4 hover:border-[#0071e3]/20 transition-all group/item">
                                                                    <div className="w-10 h-10 rounded-xl bg-white/[0.02] flex items-center justify-center text-lg shrink-0">🎓</div>
                                                                    <div className="flex-1 min-w-0">
                                                                        <p className="text-[14px] font-bold text-[#f5f5f7] group-hover/item:text-[#0071e3] transition-colors truncate">{course.title}</p>
                                                                        <p className="text-[9px] text-[#444] font-bold uppercase tracking-widest mt-0.5">
                                                                            Subscription Node Active · Since {new Date(course.dateOfPurchase).toLocaleDateString()}
                                                                        </p>
                                                                    </div>
                                                                    <div className="flex items-center gap-6 shrink-0 px-4">
                                                                        {course.isCompleted && (
                                                                            <span className="flex items-center gap-1.5 text-[9px] font-black text-[#30d158] bg-[#30d158]/10 px-2 py-0.5 rounded-full border border-[#30d158]/20 shrink-0">
                                                                                <CheckCircle size={10} strokeWidth={4} /> CERTIFIED
                                                                            </span>
                                                                        )}
                                                                        <div className="w-32">
                                                                            <div className="flex justify-between items-center mb-1 text-[9px] font-black text-[#333] uppercase">
                                                                                <span>Progress</span>
                                                                                <span className={course.isCompleted ? 'text-[#30d158]' : 'text-[#f5f5f7]'}>{course.completionPercentage}%</span>
                                                                            </div>
                                                                            <div className="h-[2px] bg-white/[0.05] rounded-full overflow-hidden">
                                                                                <motion.div initial={{ width: 0 }} animate={{ width: `${course.completionPercentage}%` }} className={`h-full ${course.isCompleted ? 'bg-[#30d158]' : 'bg-[#0071e3]'}`} />
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* DELETE MODAL */}
            <AnimatePresence>
                {deletingStudent && (
                    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6 bg-[#0a0a0f]/80 backdrop-blur-xl">
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-[#1c1c1e] border border-white/[0.1] rounded-[32px] p-10 max-w-sm w-full text-center shadow-2xl relative overflow-hidden">
                            <div className="absolute top-0 left-0 right-0 h-1 bg-[#ff453a] opacity-40 shadow-[0_0_15px_rgba(255,69,58,0.5)]" />
                            <div className="w-16 h-16 bg-[#ff453a]/10 text-[#ff453a] border border-[#ff453a]/20 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-inner">
                                <AlertCircle size={32} />
                            </div>
                            <h2 className="text-[24px] font-black tracking-tight text-[#f5f5f7] mb-3 leading-tight">Terminate Record?</h2>
                            <p className="text-[13px] text-[#86868b] leading-relaxed mb-10 px-4">
                                You are about to permanently delete <span className="text-[#f5f5f7] font-bold">"{deletingStudent.userFullName || deletingStudent.userName}"</span> and all associated analytical data. This action is irreversible.
                            </p>
                            <div className="flex flex-col gap-3">
                                <button
                                    onClick={handleDeleteStudent}
                                    disabled={isDeleting}
                                    className="w-full h-14 bg-[#ff453a] hover:bg-[#ff3b30] text-white text-[14px] font-black rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-[#ff453a]/20 transition-all active:scale-95"
                                >
                                    {isDeleting ? <RefreshCw className="h-5 w-5 animate-spin" /> : <><Trash2 size={18} /> Confirm Termination</>}
                                </button>
                                <button
                                    onClick={() => setDeletingStudent(null)}
                                    className="w-full h-12 bg-white/[0.04] text-[#86868b] text-[13px] font-bold rounded-2xl hover:bg-white/[0.08] border border-white/[0.04] transition-all"
                                >
                                    Cancel Operation
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}

// Internal icon for consistency
const BadgeCheck = ({ size, color }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
);

export default InstructorStudentsData;
