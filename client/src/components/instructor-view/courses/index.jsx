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
  courseCurriculumInitialFormData,
  courseLandingInitialFormData,
} from "@/config";
import { InstructorContext } from "@/context/instructor-context";
import { deleteCourseService } from "@/services";
import { Edit, Plus, Trash2, Users, DollarSign, Book, Download } from "lucide-react";
import { exportToCSV } from "@/utils/export";
import { useContext, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

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
    if (window.confirm("Are you sure you want to delete this course?")) {
      const response = await deleteCourseService(courseId);
      if (response?.success) {
        fetchAllCourses();
      }
    }
  }

  function handleExportReport() {
    if (!filteredCourses) return;
    const exportData = filteredCourses.map(course => ({
      "Course Name": course.title || "Untitled Course",
      "Category": course.category || "N/A",
      "Created Date": course.date ? new Date(course.date).toLocaleDateString("en-IN") : "N/A",
      "Total Students": course.students?.length || 0,
      "Total Revenue": `₹${course?.students?.reduce((acc, student) => acc + parseFloat(student.paidAmount || 0), 0)?.toFixed(2) || "0.00"}`
    }));
    exportToCSV(exportData, `course_status_report_${new Date().toLocaleDateString()}.csv`);
  }

  const filteredCourses = (listOfCourses || []).filter((course) => {
    const matchesSearch = course.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.category?.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (period === "all" && !fromDate && !toDate) return true;

    const courseDate = course.date ? new Date(course.date) : null;
    if (!courseDate) return period === "all";

    const now = new Date();
    let startDate = null;

    if (period === "lastMonth") {
      startDate = new Date();
      startDate.setMonth(now.getMonth() - 1);
    } else if (period === "last3Months") {
      startDate = new Date();
      startDate.setMonth(now.getMonth() - 3);
    } else if (period === "last6Months") {
      startDate = new Date();
      startDate.setMonth(now.getMonth() - 6);
    } else if (period === "lastYear") {
      startDate = new Date();
      startDate.setFullYear(now.getFullYear() - 1);
    } else if (period === "custom") {
      const customFrom = fromDate ? new Date(fromDate) : null;
      const customTo = toDate ? new Date(toDate) : null;

      if (customFrom) {
        customFrom.setHours(0, 0, 0, 0);
        if (courseDate < customFrom) return false;
      }
      if (customTo) {
        customTo.setHours(23, 59, 59, 999);
        if (courseDate > customTo) return false;
      }
      return true;
    }

    if (startDate) {
      return courseDate >= startDate;
    }

    return true;
  });

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-[40px] border border-zinc-200/60 shadow-sm overflow-hidden"
    >
      <div className="p-10 border-b border-zinc-100 flex flex-col gap-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h2 className="text-3xl font-black tracking-tighter text-zinc-900 mb-1">All Courses.</h2>
            <p className="text-zinc-500 font-medium tracking-tight">Manage and track your educational content.</p>
          </div>
          <div className="flex items-center gap-4">
            <Button
              onClick={handleExportReport}
              variant="outline"
              className="rounded-2xl h-14 px-8 font-bold border-zinc-200 hover:bg-zinc-50 transition-all flex items-center gap-2"
            >
              <Download className="h-5 w-5" />
              <span>Export Report</span>
            </Button>
            <Button
              onClick={() => {
                setCurrentEditedCourseId(null);
                setCourseLandingFormData(courseLandingInitialFormData);
                setCourseCurriculumFormData(courseCurriculumInitialFormData);
                navigate("/instructor/create-new-course");
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-2xl h-14 px-8 font-bold shadow-lg shadow-blue-100 transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
            >
              <Plus className="h-5 w-5" />
              <span>Create New Course</span>
            </Button>
          </div>
        </div>

        {/* Filters Section */}
        <div className="flex flex-col md:flex-row items-end gap-4 p-6 bg-zinc-50 rounded-[32px] border border-zinc-100">
          <div className="flex-1 w-full space-y-1.5">
            <Label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 ml-1">Search Courses</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
              <Input
                placeholder="Search by title or category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white border-zinc-200 h-12 rounded-xl"
              />
            </div>
          </div>

          <div className="w-full md:w-48 space-y-1.5">
            <Label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 ml-1">Period</Label>
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger className="bg-white border-zinc-200 h-12 rounded-xl">
                <SelectValue placeholder="Select Period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Lifetime</SelectItem>
                <SelectItem value="lastMonth">Last Month</SelectItem>
                <SelectItem value="last3Months">Last 3 Months</SelectItem>
                <SelectItem value="last6Months">Last 6 Months</SelectItem>
                <SelectItem value="lastYear">Last 1 Year</SelectItem>
                <SelectItem value="custom">Custom Range</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {period === "custom" && (
            <>
              <div className="w-full md:w-40 space-y-1.5">
                <Label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 ml-1">From</Label>
                <Input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="bg-white border-zinc-200 h-12 rounded-xl"
                />
              </div>
              <div className="w-full md:w-40 space-y-1.5">
                <Label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 ml-1">To</Label>
                <Input
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="bg-white border-zinc-200 h-12 rounded-xl"
                />
              </div>
            </>
          )}

          {(period !== "all" || searchQuery || fromDate || toDate) && (
            <Button
              variant="ghost"
              onClick={() => {
                setPeriod("all");
                setSearchQuery("");
                setFromDate("");
                setToDate("");
              }}
              className="h-12 px-6 font-bold text-zinc-400 hover:text-zinc-900"
            >
              Reset
            </Button>
          )}
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table className="w-full">
          <TableHeader className="bg-zinc-50/50">
            <TableRow className="hover:bg-transparent border-zinc-100">
              <TableHead className="py-6 px-10 font-bold text-zinc-400 uppercase tracking-widest text-[10px]">Course Details</TableHead>
              <TableHead className="py-6 px-10 font-bold text-zinc-400 uppercase tracking-widest text-[10px]">Stats</TableHead>
              <TableHead className="py-6 px-10 font-bold text-zinc-400 uppercase tracking-widest text-[10px] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCourses && filteredCourses.length > 0 ? (
              filteredCourses.map((course) => (
                <TableRow key={course?._id} className="group hover:bg-zinc-50/50 transition-colors border-zinc-100">
                  <TableCell className="py-8 px-10">
                    <div className="flex items-center gap-4">
                      <div className="w-20 h-14 rounded-xl overflow-hidden bg-zinc-100 shrink-0">
                        <img src={course?.image} alt={course?.title} className="w-full h-full object-cover" />
                      </div>
                      <div className="max-w-md">
                        <p className="font-bold text-zinc-900 text-lg leading-tight mb-1 group-hover:text-blue-600 transition-colors">
                          {course?.title}
                        </p>
                        <p className="text-zinc-400 text-xs font-bold uppercase tracking-widest">{course?.category}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="py-8 px-10">
                    <div className="flex items-center gap-6">
                      <div className="flex flex-col">
                        <span className="text-zinc-400 text-[10px] uppercase font-bold tracking-tighter mb-1 flex items-center gap-1">
                          <Users className="h-3 w-3" /> Students
                        </span>
                        <span className="font-bold text-zinc-900">{course?.students?.length || 0}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-zinc-400 text-[10px] uppercase font-bold tracking-tighter mb-1 flex items-center gap-1">
                          <DollarSign className="h-3 w-3" /> Revenue
                        </span>
                        <span className="font-bold text-zinc-900">
                          ₹{course?.students?.reduce((acc, student) => acc + parseFloat(student.paidAmount || 0), 0)?.toFixed(2) || "0.00"}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="py-8 px-10 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        onClick={() => navigate(`/instructor/edit-course/${course?._id}`)}
                        variant="outline"
                        className="rounded-xl border-zinc-200 hover:bg-zinc-900 hover:text-white transition-all font-bold px-4 flex items-center gap-2"
                      >
                        <Edit className="h-4 w-4" />
                        <span>Edit</span>
                      </Button>
                      <Button
                        onClick={() => handleDeleteCourse(course?._id)}
                        variant="ghost"
                        size="icon"
                        className="rounded-xl text-zinc-300 hover:text-red-500 hover:bg-red-50 transition-all"
                      >
                        <Trash2 className="h-5 w-5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} className="py-32 text-center">
                  <div className="flex flex-col items-center">
                    <Book className="h-12 w-12 text-zinc-200 mb-4" />
                    <h3 className="text-xl font-bold text-zinc-900 mb-1">No courses yet.</h3>
                    <p className="text-zinc-400 font-medium">Create your first masterpiece and start teaching.</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </motion.div>
  );
}

export default InstructorCourses;
