import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { fetchAdminStudentProgressService } from "@/services";
import {
  Users, BookOpen, CheckCircle, Search, ChevronDown, ChevronUp,
  RefreshCw, Mail, UserCircle, Award, ShieldCheck, ShieldX
} from "lucide-react";

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
      s.userEmail?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.userFullName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalEnrollments = studentsData.reduce((acc, s) => acc + (s.courses?.length || 0), 0);
  const completedEnrollments = studentsData.reduce(
    (acc, s) => acc + (s.courses?.filter((c) => c.isCompleted).length || 0),
    0
  );
  const activeStudents = studentsData.filter(s => s.status !== "blocked").length;

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
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total Students", value: studentsData.length, icon: Users, color: "bg-[#0067b8]" },
          { label: "Active", value: activeStudents, icon: ShieldCheck, color: "bg-emerald-600" },
          { label: "Enrollments", value: totalEnrollments, icon: BookOpen, color: "bg-violet-600" },
          { label: "Completions", value: completedEnrollments, icon: CheckCircle, color: "bg-amber-600" },
        ].map((stat) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-white rounded-xl border border-zinc-200 p-5 flex items-center gap-4 shadow-sm"
          >
            <div className={`${stat.color} p-2.5 rounded-lg shrink-0`}>
              <stat.icon className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-zinc-900">{stat.value}</p>
              <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider mt-0.5">{stat.label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-xl border border-zinc-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-zinc-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h2 className="text-lg font-bold text-zinc-900">Students ({filteredStudents.length})</h2>
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
            <p className="text-zinc-400 text-sm mt-1">Students will appear here once they sign up.</p>
          </div>
        ) : (
          <div className="divide-y divide-zinc-100">
            {filteredStudents.map((student) => {
              const isExpanded = expandedStudent === student.studentId;
              const avgProgress =
                student.courses?.length > 0
                  ? Math.round(
                      student.courses.reduce((sum, c) => sum + c.completionPercentage, 0) /
                        student.courses.length
                    )
                  : 0;
              const isBlocked = student.status === "blocked";

              return (
                <div key={student.studentId}>
                  {/* Student Summary Row */}
                  <button
                    onClick={() => setExpandedStudent(isExpanded ? null : student.studentId)}
                    className="w-full flex items-center gap-4 px-5 py-4 hover:bg-zinc-50 transition-colors text-left"
                  >
                    {/* Avatar */}
                    <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 bg-[#0067b8] flex items-center justify-center">
                      {student.profileImage ? (
                        <img src={student.profileImage} alt={student.userName} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-white font-bold text-sm">
                          {(student.userFullName || student.userName || "?")[0].toUpperCase()}
                        </span>
                      )}
                    </div>

                    {/* Name / Email */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-zinc-900 text-sm truncate">
                          {student.userFullName || student.userName || "N/A"}
                        </p>
                        {isBlocked ? (
                          <span className="hidden sm:inline-flex items-center gap-1 text-[9px] font-bold uppercase px-1.5 py-0.5 rounded-full bg-red-100 text-red-600">
                            <ShieldX className="h-2.5 w-2.5" /> Blocked
                          </span>
                        ) : (
                          <span className="hidden sm:inline-flex items-center gap-1 text-[9px] font-bold uppercase px-1.5 py-0.5 rounded-full bg-emerald-50 text-emerald-600">
                            <ShieldCheck className="h-2.5 w-2.5" /> Active
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-zinc-400 truncate">{student.userEmail}</p>
                    </div>

                    {/* Courses count */}
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

                  {/* Expanded Details */}
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="bg-zinc-50 border-t border-zinc-100 px-5 py-5"
                    >
                      {/* Profile Info Card */}
                      <div className="bg-white rounded-xl border border-zinc-100 p-5 mb-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-3">
                          <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-400">Profile Details</h4>
                          <div className="flex items-center gap-2.5 text-sm text-zinc-700">
                            <UserCircle className="h-4 w-4 text-zinc-400 shrink-0" />
                            <span><span className="font-semibold text-zinc-500">Username: </span>{student.userName || "—"}</span>
                          </div>
                          <div className="flex items-center gap-2.5 text-sm text-zinc-700">
                            <UserCircle className="h-4 w-4 text-zinc-400 shrink-0" />
                            <span><span className="font-semibold text-zinc-500">Full Name: </span>{student.userFullName || "—"}</span>
                          </div>
                          <div className="flex items-center gap-2.5 text-sm text-zinc-700">
                            <Mail className="h-4 w-4 text-zinc-400 shrink-0" />
                            <span><span className="font-semibold text-zinc-500">Email: </span>{student.userEmail || "—"}</span>
                          </div>
                          {student.userHeadline && (
                            <div className="flex items-start gap-2.5 text-sm text-zinc-700">
                              <Award className="h-4 w-4 text-zinc-400 shrink-0 mt-0.5" />
                              <span><span className="font-semibold text-zinc-500">Headline: </span>{student.userHeadline}</span>
                            </div>
                          )}
                          {student.userBio && (
                            <div className="text-sm text-zinc-600 bg-zinc-50 border border-zinc-100 rounded-lg p-3 mt-1 leading-relaxed">
                              {student.userBio}
                            </div>
                          )}
                        </div>

                        <div className="space-y-3">
                          <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-400">Enrollment Summary</h4>
                          <div className="grid grid-cols-2 gap-3">
                            <div className="bg-zinc-50 border border-zinc-100 rounded-lg p-3 text-center">
                              <p className="text-xl font-bold text-zinc-900">{student.courses?.length || 0}</p>
                              <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">Courses</p>
                            </div>
                            <div className="bg-zinc-50 border border-zinc-100 rounded-lg p-3 text-center">
                              <p className="text-xl font-bold text-emerald-600">{student.courses?.filter(c => c.isCompleted).length || 0}</p>
                              <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">Completed</p>
                            </div>
                          </div>
                          <div>
                            <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full ${isBlocked ? "bg-red-50 text-red-600" : "bg-emerald-50 text-emerald-700"}`}>
                              {isBlocked ? <ShieldX className="h-3 w-3" /> : <ShieldCheck className="h-3 w-3" />}
                              Account {isBlocked ? "Blocked" : "Active"}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Course Rows */}
                      <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-3">Enrolled Courses</h4>
                      {student.courses?.length === 0 ? (
                        <p className="text-sm text-zinc-400 py-2">No courses purchased yet.</p>
                      ) : (
                        <div className="space-y-2">
                          {student.courses.map((course) => (
                            <div key={course.courseId} className="flex items-center gap-4 bg-white rounded-lg border border-zinc-100 px-4 py-3">
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-zinc-800 truncate">{course.title}</p>
                                {course.dateOfPurchase && (
                                  <p className="text-[10px] text-zinc-400 mt-0.5">
                                    Purchased: {new Date(course.dateOfPurchase).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                                  </p>
                                )}
                              </div>

                              {course.isCompleted && (
                                <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full shrink-0">
                                  <CheckCircle className="h-3 w-3" /> Done
                                </span>
                              )}

                              <div className="flex items-center gap-3 w-44 shrink-0">
                                <div className="flex-1 h-2 bg-zinc-100 rounded-full overflow-hidden">
                                  <div
                                    className={`h-full rounded-full transition-all ${course.isCompleted ? "bg-emerald-500" : "bg-[#0067b8]"}`}
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
