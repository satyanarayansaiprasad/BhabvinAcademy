import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
    Edit, 
    Plus, 
    Trash2, 
    Users, 
    DollarSign, 
    Book, 
    Download, 
    Search,
    ChevronRight,
    Filter,
    MoreVertical,
    Star,
    ArrowUpDown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InstructorContext } from "@/context/instructor-context";
import { deleteCourseService } from "@/services";
import { exportToCSV } from "@/utils/export";
import { 
    courseCurriculumInitialFormData, 
    courseLandingInitialFormData 
} from "@/config";

function InstructorCourses({ listOfCourses, fetchAllCourses }) {
    const navigate = useNavigate();
    const {
        setCurrentEditedCourseId,
        setCourseLandingFormData,
        setCourseCurriculumFormData,
    } = useContext(InstructorContext);

    const [searchQuery, setSearchQuery] = useState("");
    const [period, setPeriod] = useState("all");
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");

    async function handleDeleteCourse(courseId) {
        if (window.confirm("Are you sure you want to delete this course? This action cannot be undone.")) {
            const response = await deleteCourseService(courseId);
            if (response?.success) fetchAllCourses();
        }
    }

    function handleExportReport() {
        if (!filteredCourses) return;
        const exportData = filteredCourses.map(course => ({
            "Course Name": course.title || "Untitled",
            "Category": course.category || "N/A",
            "Total Students": course.students?.length || 0,
            "Total Revenue": `₹${course?.students?.reduce((acc, s) => acc + parseFloat(s.paidAmount || 0), 0)?.toFixed(2) || "0.00"}`,
            "Status": "Published"
        }));
        exportToCSV(exportData, `course_inventory_${new Date().toLocaleDateString()}.csv`);
    }

    const filteredCourses = (listOfCourses || []).filter((course) => {
        const matchesSearch = course.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            course.category?.toLowerCase().includes(searchQuery.toLowerCase());
        if (!matchesSearch) return false;
        return true; 
    });

    return (
        <div className="space-y-6">
            
            {/* TOP ACTIONS */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                <div>
                    <h2 className="text-[32px] font-black tracking-tighter text-[#f5f5f7] mb-1">courses.</h2>
                    <p className="text-[#86868b] text-[13px] font-medium tracking-tight">Systematic inventory management and performance tracking.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button
                        onClick={handleExportReport}
                        className="h-11 px-6 bg-white/[0.04] hover:bg-white/[0.08] text-[#86868b] text-[13px] font-bold rounded-xl flex items-center gap-2 transition-all border border-white/[0.04]"
                    >
                        <Download size={16} /> Export CSV
                    </Button>
                    <Button
                        onClick={() => {
                            setCurrentEditedCourseId(null);
                            setCourseLandingFormData(courseLandingInitialFormData);
                            setCourseCurriculumFormData(courseCurriculumInitialFormData);
                            navigate("/instructor/create-new-course");
                        }}
                        className="h-11 px-6 bg-[#0071e3] hover:bg-[#0077ed] text-white text-[13px] font-bold rounded-xl flex items-center gap-2 shadow-lg shadow-[#0071e3]/20 transition-all active:scale-95"
                    >
                        <Plus size={18} strokeWidth={3} /> Create New Course
                    </Button>
                </div>
            </div>

            {/* FILTERS PANEL */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-5 bg-[#111118] border border-white/[0.06] rounded-2xl">
                <div className="md:col-span-2 space-y-1.5">
                    <Label className="text-[9px] font-bold uppercase tracking-[0.1em] text-[#444] ml-1">Search Inventory</Label>
                    <div className="relative">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#444]" />
                        <Input
                            placeholder="Title, category or keywords..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="h-11 pl-10 bg-white/[0.03] border-white/[0.08] rounded-xl text-[13px] text-[#f5f5f7] placeholder:text-[#3a3a3a] focus:border-[#0071e3]/50 transition-all"
                        />
                    </div>
                </div>

                <div className="space-y-1.5">
                    <Label className="text-[9px] font-bold uppercase tracking-[0.1em] text-[#444] ml-1">Course Status</Label>
                    <Select value={period} onValueChange={setPeriod}>
                        <SelectTrigger className="h-11 bg-white/[0.03] border-white/[0.08] rounded-xl text-[13px] text-[#f5f5f7] outline-none">
                            <SelectValue placeholder="All Status" />
                        </SelectTrigger>
                        <SelectContent className="bg-[#1c1c1e] border-white/[0.1] text-[#f5f5f7]">
                            <SelectItem value="all">Published</SelectItem>
                            <SelectItem value="draft">Drafts</SelectItem>
                            <SelectItem value="archived">Archived</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex items-end">
                    <Button
                        variant="ghost"
                        onClick={() => { setSearchQuery(""); setPeriod("all"); }}
                        className="h-11 w-full text-[12px] font-bold text-[#444] hover:text-[#f5f5f7] hover:bg-white/[0.04] transition-all"
                    >
                        Reset Filters
                    </Button>
                </div>
            </div>

            {/* INVENTORY TABLE */}
            <div className="bg-[#111118] border border-white/[0.06] rounded-2xl overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader className="bg-white/[0.01] border-b border-white/[0.04]">
                            <TableRow className="hover:bg-transparent">
                                <TableHead className="py-5 px-8 font-bold text-[#3a3a3a] uppercase tracking-widest text-[9px]">Course Details</TableHead>
                                <TableHead className="py-5 px-8 font-bold text-[#3a3a3a] uppercase tracking-widest text-[9px]">Metrics</TableHead>
                                <TableHead className="py-5 px-8 font-bold text-[#3a3a3a] uppercase tracking-widest text-[9px]">Revenue</TableHead>
                                <TableHead className="py-5 px-8 font-bold text-[#3a3a3a] uppercase tracking-widest text-[9px]">Rating</TableHead>
                                <TableHead className="py-5 px-8 font-bold text-[#3a3a3a] uppercase tracking-widest text-[9px] text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <AnimatePresence>
                                {filteredCourses && filteredCourses.length > 0 ? (
                                    filteredCourses.map((course, idx) => (
                                        <motion.tr
                                            key={course?._id}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="border-b border-white/[0.04] group hover:bg-white/[0.02] transition-colors"
                                        >
                                            <TableCell className="py-6 px-8">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-16 h-11 rounded-xl overflow-hidden bg-white/[0.04] shrink-0 border border-white/[0.06]">
                                                        {course?.image ? (
                                                            <img src={course?.image} alt={course?.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center text-lg">📚</div>
                                                        )}
                                                    </div>
                                                    <div className="max-w-[300px]">
                                                        <p className="font-bold text-[#f5f5f7] text-[14px] leading-tight mb-1 group-hover:text-[#0071e3] transition-colors truncate">
                                                            {course?.title}
                                                        </p>
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-[9px] font-black uppercase tracking-wider text-[#444]">{course?.category}</span>
                                                            <span className={`px-1.5 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest ${idx % 3 === 0 ? 'bg-[#0071e3]/10 text-[#0071e3]' : idx % 3 === 1 ? 'bg-[#30d158]/10 text-[#30d158]' : 'bg-[#ff9f0a]/10 text-[#ff9f0a]'}`}>
                                                                {idx % 3 === 0 ? 'TOP RATED' : idx % 3 === 1 ? 'TRENDING' : 'NEW'}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="py-6 px-8">
                                                <div className="space-y-1.5">
                                                    <div className="flex items-center gap-2 text-[12px] text-[#86868b]">
                                                        <Users size={12} className="text-[#3a3a3a]" />
                                                        <span className="font-bold text-[#f5f5f7]">{course?.students?.length || 0}</span>
                                                        <span className="text-[10px] uppercase font-bold text-[#333]">Students</span>
                                                    </div>
                                                    <div className="w-24 h-1 bg-white/[0.05] rounded-full overflow-hidden">
                                                        <div className="h-full bg-gradient-to-r from-[#0071e3] to-[#00d4ff] transition-all" style={{ width: `${Math.min((course?.students?.length || 0) * 10, 100)}%` }} />
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="py-6 px-8">
                                                <div className="flex flex-col">
                                                    <span className="text-[#30d158] font-black text-[14px]">₹{course?.students?.reduce((acc, s) => acc + parseFloat(s.paidAmount || 0), 0)?.toLocaleString('en-IN') || "0"}</span>
                                                    <span className="text-[9px] font-bold text-[#3a3a3a] uppercase tracking-tighter">Gross Revenue</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="py-6 px-8">
                                                <div className="flex items-center gap-1.5">
                                                    <Star size={12} fill="#ffd60a" className="text-[#ffd60a]" />
                                                    <span className="text-[13px] font-black text-[#f5f5f7]">4.8</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="py-6 px-8 text-right">
                                                <div className="flex items-center justify-end gap-2 opacity-10 md:opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <Button
                                                        onClick={() => navigate(`/instructor/edit-course/${course?._id}`)}
                                                        className="h-9 px-4 bg-white/[0.05] hover:bg-white/[0.1] text-[#f5f5f7] text-[12px] font-bold rounded-xl border border-white/[0.06] flex items-center gap-2 transition-all"
                                                    >
                                                        <Edit size={14} /> Edit
                                                    </Button>
                                                    <Button
                                                        onClick={() => handleDeleteCourse(course?._id)}
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-9 w-9 rounded-xl text-[#3a3a3a] hover:text-[#ff453a] hover:bg-[#ff453a]/10 transition-all"
                                                    >
                                                        <Trash2 size={16} />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </motion.tr>
                                    ))
                                ) : (
                                    <TableRow className="hover:bg-transparent">
                                        <TableCell colSpan={5} className="py-32 text-center">
                                            <div className="flex flex-col items-center">
                                                <div className="w-16 h-16 bg-white/[0.03] rounded-3xl flex items-center justify-center text-3xl mb-6">📂</div>
                                                <h3 className="text-xl font-bold text-[#f5f5f7] mb-1">No courses found.</h3>
                                                <p className="text-[#555] text-sm font-medium">Try adjusting your filters or create a new course.</p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </AnimatePresence>
                        </TableBody>
                    </Table>
                </div>
            </div>

            {/* SUMMARY BAR */}
            <div className="flex items-center justify-between p-6 bg-[#0071e3]/10 border border-[#0071e3]/20 rounded-2xl">
                 <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-[#0071e3] flex items-center justify-center shadow-lg shadow-[#0071e3]/20">
                        <Book className="text-white w-5 h-5" />
                    </div>
                    <div>
                        <p className="text-[14px] font-black text-[#f5f5f7]">Inventory Analysis complete.</p>
                        <p className="text-[11px] text-[#0071e3] font-bold uppercase tracking-wider">Total {filteredCourses?.length} Courses live on the platform</p>
                    </div>
                 </div>
                 <Button className="h-10 px-6 bg-[#0071e3] text-white text-[12px] font-black rounded-xl">Generate Audit Report</Button>
            </div>

        </div>
    );
}

export default InstructorCourses;
