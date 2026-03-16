import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { fetchAdminStudentProgressService } from "@/services";
import { Users, BookOpen, CheckCircle, Search, ChevronDown, ChevronUp, RefreshCw } from "lucide-react";

function InstructorStudentsData() {
  const [studentsData, setStudentsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedStudent, setExpandedStudent] = useState(null);

  async function loadStudentsData() {
    setLoading(true);
    const response = await fetchAdminStudentProgressService();
    if (response?.success) {
      setStudentsData(response.data);
    }
    setLoading(false);
  }

  useEffect(() => {
    loadStudentsData();
  }, []);

  const filteredStudents = studentsData.filter(
    (s) =>
      s.userName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.userEmail?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalEnrollments = studentsData.reduce((acc, s) => acc + (s.courses?.length || 0), 0);
  const completedEnrollments = studentsData.reduce(
    (acc, s) => acc + (s.courses?.filter((c) => c.isCompleted).length || 0),
    0
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-40">
        <RefreshCw className="h-8 w-8 text-[#0067b8] animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {[
          { label: "Total Students", value: studentsData.length, icon: Users, color: "bg-[#0067b8]" },
          { label: "Total Enrollments", value: totalEnrollments, icon: BookOpen, color: "bg-violet-600" },
          { label: "Completed Courses", value: completedEnrollments, icon: CheckCircle, color: "bg-emerald-600" },
        ].map((stat) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-white rounded-xl border border-zinc-200 p-6 flex items-center gap-5 shadow-sm"
          >
            <div className={`${stat.color} p-3 rounded-lg shrink-0`}>
              <stat.icon className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-3xl font-bold text-zinc-900">{stat.value}</p>
              <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mt-0.5">{stat.label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Search & Table */}
      <div className="bg-white rounded-xl border border-zinc-200 shadow-sm overflow-hidden">
        {/* Table Header */}
        <div className="p-5 border-b border-zinc-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h2 className="text-lg font-bold text-zinc-900">All Students</h2>
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0067b8]/30 focus:border-[#0067b8]"
            />
          </div>
        </div>

        {filteredStudents.length === 0 ? (
          <div className="py-16 text-center">
            <Users className="h-10 w-10 text-zinc-300 mx-auto mb-3" />
            <p className="text-zinc-500 font-semibold">No students found.</p>
          </div>
        ) : (
          <div className="divide-y divide-zinc-100">
            {filteredStudents.map((student, idx) => {
              const isExpanded = expandedStudent === student.studentId;
              const avgProgress =
                student.courses?.length > 0
                  ? Math.round(
                      student.courses.reduce((sum, c) => sum + c.completionPercentage, 0) /
                        student.courses.length
                    )
                  : 0;

              return (
                <div key={student.studentId}>
                  {/* Student Row */}
                  <button
                    onClick={() => setExpandedStudent(isExpanded ? null : student.studentId)}
                    className="w-full flex items-center gap-4 px-5 py-4 hover:bg-zinc-50 transition-colors text-left"
                  >
                    {/* Avatar */}
                    <div className="w-9 h-9 rounded-full bg-[#0067b8] flex items-center justify-center text-white font-bold text-sm shrink-0">
                      {student.userName?.[0]?.toUpperCase() || "?"}
                    </div>

                    {/* Name / Email */}
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-zinc-900 text-sm truncate">{student.userName || "N/A"}</p>
                      <p className="text-xs text-zinc-400 truncate">{student.userEmail}</p>
                    </div>

                    {/* Courses Badge */}
                    <div className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-zinc-500 shrink-0">
                      <BookOpen className="h-3.5 w-3.5" />
                      {student.courses?.length || 0} course{student.courses?.length !== 1 ? "s" : ""}
                    </div>

                    {/* Avg Progress */}
                    <div className="hidden md:flex items-center gap-3 w-36 shrink-0">
                      <div className="flex-1 h-1.5 bg-zinc-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#0067b8] rounded-full transition-all"
                          style={{ width: `${avgProgress}%` }}
                        />
                      </div>
                      <span className="text-xs font-bold text-zinc-500 w-8 text-right">{avgProgress}%</span>
                    </div>

                    {/* Chevron */}
                    <div className="text-zinc-300 shrink-0">
                      {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </div>
                  </button>

                  {/* Expanded Course Details */}
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="bg-zinc-50 border-t border-zinc-100 px-5 py-4"
                    >
                      {student.courses?.length === 0 ? (
                        <p className="text-sm text-zinc-400 py-2">This student has not purchased any courses yet.</p>
                      ) : (
                        <div className="space-y-3">
                          {student.courses.map((course) => (
                            <div key={course.courseId} className="flex items-center gap-4 bg-white rounded-lg border border-zinc-100 px-4 py-3">
                              {/* Course Title */}
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-zinc-800 truncate">{course.title}</p>
                              </div>

                              {/* Completion Badge */}
                              {course.isCompleted && (
                                <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full shrink-0">
                                  <CheckCircle className="h-3 w-3" /> Done
                                </span>
                              )}

                              {/* Progress Bar */}
                              <div className="flex items-center gap-3 w-44 shrink-0">
                                <div className="flex-1 h-2 bg-zinc-100 rounded-full overflow-hidden">
                                  <div
                                    className={`h-full rounded-full transition-all ${
                                      course.isCompleted ? "bg-emerald-500" : "bg-[#0067b8]"
                                    }`}
                                    style={{ width: `${course.completionPercentage}%` }}
                                  />
                                </div>
                                <span className="text-xs font-bold text-zinc-500 w-9 text-right">
                                  {course.completionPercentage}%
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default InstructorStudentsData;
