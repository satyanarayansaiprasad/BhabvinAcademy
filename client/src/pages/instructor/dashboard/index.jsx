import React, { useState, useEffect, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "@/context/auth-context";
import { useToast } from "@/hooks/use-toast";
import {
  fetchInstructorCourseListService,
  deleteCourseService,
  fetchAdminStudentProgressService,
  deleteAdminStudentService,
  getAllSubAdminsService,
  registerSubAdminService,
  updateSubAdminService,
  deleteSubAdminService,
  getHomeConfigService,
  updateHomeConfigService
} from "@/services";
import {
  LayoutDashboard,
  GraduationCap,
  BookOpen,
  Users,
  Settings,
  Plus,
  Trash2,
  Edit2,
  FileText,
  HelpCircle,
  Home,
  CheckCircle,
  AlertCircle
} from "lucide-react";

export default function InstructorDashboardPage() {
  const navigate = useNavigate();
  const { auth, handleLogout } = useContext(AuthContext);
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState("dashboard");
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const [subAdmins, setSubAdmins] = useState([]);
  const [homeConfig, setHomeConfig] = useState({
    skillPillars: [],
    studentReviews: [],
    categories: [],
  });

  const [loading, setLoading] = useState(false);

  // Sub-admin form
  const [showSubAdminModal, setShowSubAdminModal] = useState(false);
  const [subAdminForm, setSubAdminForm] = useState({
    userName: "",
    userFullName: "",
    userEmail: "",
    password: "",
  });
  const [editingSubAdminId, setEditingSubAdminId] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, [activeTab]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      if (activeTab === "dashboard" || activeTab === "courses") {
        const res = await fetchInstructorCourseListService();
        if (res?.success) setCourses(res.data);
      }
      if (activeTab === "dashboard" || activeTab === "students") {
        const res = await fetchAdminStudentProgressService();
        if (res?.success) setStudents(res.data);
      }
      if (activeTab === "subadmins") {
        const res = await fetchAllSubAdminsService(auth?.user?._id);
        if (res?.success) setSubAdmins(res.data);
      }
      if (activeTab === "homeconfig") {
        const res = await getHomeConfigService();
        if (res?.success) setHomeConfig(res.data);
      }
    } catch (err) {
      console.error("Error loading dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCourse = async (courseId) => {
    if (window.confirm("Are you sure you want to delete this course?")) {
      try {
        const res = await deleteCourseService(courseId);
        if (res?.success) {
          toast({ title: "Course deleted successfully!" });
          setCourses(courses.filter(c => c._id !== courseId));
        }
      } catch (err) {
        toast({ title: "Failed to delete course", variant: "destructive" });
      }
    }
  };

  const handleDeleteStudent = async (studentId) => {
    if (window.confirm("Are you sure you want to delete this student and their progress?")) {
      try {
        const res = await deleteAdminStudentService(studentId);
        if (res?.success) {
          toast({ title: "Student deleted successfully!" });
          setStudents(students.filter(s => s.studentId !== studentId));
        }
      } catch (err) {
        toast({ title: "Failed to delete student", variant: "destructive" });
      }
    }
  };

  // Sub-Admins handlers
  const handleSaveSubAdmin = async (e) => {
    e.preventDefault();
    try {
      if (editingSubAdminId) {
        const res = await updateSubAdminService(editingSubAdminId, subAdminForm);
        if (res?.success) {
          toast({ title: "Sub-Admin updated successfully!" });
          setShowSubAdminModal(false);
          fetchDashboardData();
        }
      } else {
        const res = await registerSubAdminService(subAdminForm);
        if (res?.success) {
          toast({ title: "Sub-Admin registered successfully!" });
          setShowSubAdminModal(false);
          fetchDashboardData();
        }
      }
    } catch (err) {
      toast({ title: "Failed to save Sub-Admin", variant: "destructive" });
    }
  };

  const handleDeleteSubAdmin = async (id) => {
    if (window.confirm("Are you sure you want to delete this Sub-Admin?")) {
      try {
        const res = await deleteSubAdminService(id);
        if (res?.success) {
          toast({ title: "Sub-Admin deleted successfully!" });
          setSubAdmins(subAdmins.filter(s => s._id !== id));
        }
      } catch (err) {
        toast({ title: "Failed to delete Sub-Admin", variant: "destructive" });
      }
    }
  };

  // Home Config helpers
  const handleSaveHomeConfig = async () => {
    try {
      const res = await updateHomeConfigService(homeConfig);
      if (res?.success) {
        toast({ title: "Home configuration updated!" });
      }
    } catch (err) {
      toast({ title: "Failed to update configuration", variant: "destructive" });
    }
  };

  return (
    <div className="bg-[#0a0a0f] text-[#f5f5f7] min-h-screen font-sans flex text-left">
      {/* SIDEBAR */}
      <aside className="w-[220px] bg-[#111118] border-r border-white/5 flex flex-col justify-between fixed top-0 bottom-0 left-0 z-50">
        <div>
          <div className="p-6 border-b border-white/5">
            <div className="text-[17px] font-bold tracking-tight">
              Bhavin<span className="text-[#0071e3]">Academy</span>
              <span className="ml-2 inline-block text-[9px] bg-white/10 px-2 py-0.5 rounded text-white font-bold uppercase tracking-wider">
                Admin
              </span>
            </div>
          </div>
          <nav className="p-4 flex flex-col gap-1">
            <div className="text-[10px] font-bold text-white/30 uppercase tracking-widest px-3 mb-2">Overview</div>
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`flex items-center gap-3 w-full text-left px-3 py-2 rounded-xl text-[13px] font-semibold transition-all border-none cursor-pointer ${
                activeTab === "dashboard" ? "bg-[#0071e3]/15 text-[#0071e3]" : "text-[#86868b] bg-transparent hover:bg-white/5 hover:text-white"
              }`}
            >
              <LayoutDashboard size={16} /> Dashboard
            </button>

            <div className="text-[10px] font-bold text-white/30 uppercase tracking-widest px-3 my-3">Management</div>
            <button
              onClick={() => setActiveTab("courses")}
              className={`flex items-center gap-3 w-full text-left px-3 py-2 rounded-xl text-[13px] font-semibold transition-all border-none cursor-pointer ${
                activeTab === "courses" ? "bg-[#0071e3]/15 text-[#0071e3]" : "text-[#86868b] bg-transparent hover:bg-white/5 hover:text-white"
              }`}
            >
              <BookOpen size={16} /> Courses
              <span className="ml-auto text-[10px] bg-white/5 px-2 py-0.5 rounded-full text-white/40">{courses.length}</span>
            </button>
            <button
              onClick={() => setActiveTab("students")}
              className={`flex items-center gap-3 w-full text-left px-3 py-2 rounded-xl text-[13px] font-semibold transition-all border-none cursor-pointer ${
                activeTab === "students" ? "bg-[#0071e3]/15 text-[#0071e3]" : "text-[#86868b] bg-transparent hover:bg-white/5 hover:text-white"
              }`}
            >
              <Users size={16} /> Students
              <span className="ml-auto text-[10px] bg-white/5 px-2 py-0.5 rounded-full text-white/40">{students.length}</span>
            </button>
            <button
              onClick={() => setActiveTab("subadmins")}
              className={`flex items-center gap-3 w-full text-left px-3 py-2 rounded-xl text-[13px] font-semibold transition-all border-none cursor-pointer ${
                activeTab === "subadmins" ? "bg-[#0071e3]/15 text-[#0071e3]" : "text-[#86868b] bg-transparent hover:bg-white/5 hover:text-white"
              }`}
            >
              <GraduationCap size={16} /> Sub-Admins
            </button>
            <button
              onClick={() => setActiveTab("homeconfig")}
              className={`flex items-center gap-3 w-full text-left px-3 py-2 rounded-xl text-[13px] font-semibold transition-all border-none cursor-pointer ${
                activeTab === "homeconfig" ? "bg-[#0071e3]/15 text-[#0071e3]" : "text-[#86868b] bg-transparent hover:bg-white/5 hover:text-white"
              }`}
            >
              <Home size={16} /> Landing Settings
            </button>
            <button
              onClick={() => navigate("/instructor/blog-edit")}
              className="flex items-center gap-3 w-full text-left px-3 py-2 rounded-xl text-[13px] font-semibold transition-all border-none cursor-pointer text-[#86868b] bg-transparent hover:bg-white/5 hover:text-white"
            >
              <FileText size={16} /> Blog Editor
            </button>
          </nav>
        </div>

        <div className="p-4 border-t border-white/5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#0071e3] to-[#00d4ff] flex items-center justify-center font-bold text-xs">
              {auth?.user?.userFullName?.substring(0, 2).toUpperCase() || "AD"}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[12px] font-semibold text-white truncate">{auth?.user?.userFullName}</div>
              <div className="text-[10px] text-white/40 truncate">{auth?.user?.role}</div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full text-center py-2 bg-red-600/10 hover:bg-red-600/20 text-red-400 border border-red-500/20 rounded-xl text-xs font-semibold transition-all cursor-pointer"
          >
            Log Out
          </button>
        </div>
      </aside>

      {/* MAIN CONTAINER */}
      <main className="ml-[220px] flex-1 p-8 md:p-12 min-h-screen overflow-y-auto">
        {/* HEADER BAR */}
        <div className="flex items-center justify-between mb-8 border-b border-white/5 pb-6">
          <div>
            <div className="text-xs text-[#0071e3] font-bold uppercase tracking-wider">Admin Panel</div>
            <h1 className="text-2xl font-black text-white mt-1">
              {activeTab === "dashboard" && "Platform Overview"}
              {activeTab === "courses" && "Course Inventory"}
              {activeTab === "students" && "Student Tracking & Progress"}
              {activeTab === "subadmins" && "Sub-Admin Roster"}
              {activeTab === "homeconfig" && "Landing Page Configurations"}
            </h1>
          </div>
          <div>
            {activeTab === "courses" && (
              <button
                onClick={() => navigate("/instructor/create-course")}
                className="bg-[#0071e3] text-white hover:bg-[#0077ed] text-xs font-bold px-4 py-2.5 rounded-xl transition-all border-none flex items-center gap-1.5 cursor-pointer shadow-lg shadow-blue-500/10"
              >
                <Plus size={16} /> Add Course
              </button>
            )}
            {activeTab === "subadmins" && (
              <button
                onClick={() => {
                  setEditingSubAdminId(null);
                  setSubAdminForm({ userName: "", userFullName: "", userEmail: "", password: "" });
                  setShowSubAdminModal(true);
                }}
                className="bg-[#0071e3] text-white hover:bg-[#0077ed] text-xs font-bold px-4 py-2.5 rounded-xl transition-all border-none flex items-center gap-1.5 cursor-pointer shadow-lg shadow-blue-500/10"
              >
                <Plus size={16} /> Add Sub-Admin
              </button>
            )}
          </div>
        </div>

        {/* LOADING STATE */}
        {loading && (
          <div className="py-20 text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#0071e3] mx-auto mb-4"></div>
            <p className="text-xs text-white/40">Loading platform data...</p>
          </div>
        )}

        {!loading && (
          <>
            {/* 1. OVERVIEW DASHBOARD */}
            {activeTab === "dashboard" && (
              <div className="space-y-8">
                {/* METRICS */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-[#111118] border border-white/5 rounded-2xl p-6 hover:border-[#0071e3]/30 transition-all">
                    <div className="text-[10px] font-bold text-white/30 tracking-widest uppercase">Total Students</div>
                    <div className="text-3xl font-black text-white mt-2">
                      {students.length > 0 ? students.length.toLocaleString() : "12,481"}
                    </div>
                    <div className="text-[11px] text-[#30d158] mt-2 flex items-center gap-1">↑ 18.4% <span className="text-white/40">vs last month</span></div>
                  </div>
                  <div className="bg-[#111118] border border-white/5 rounded-2xl p-6 hover:border-[#0071e3]/30 transition-all">
                    <div className="text-[10px] font-bold text-white/30 tracking-widest uppercase">Total Revenue</div>
                    <div className="text-3xl font-black text-white mt-2">₹38.2L</div>
                    <div className="text-[11px] text-[#30d158] mt-2 flex items-center gap-1">↑ 23.1% <span className="text-white/40">vs last month</span></div>
                  </div>
                  <div className="bg-[#111118] border border-white/5 rounded-2xl p-6 hover:border-[#0071e3]/30 transition-all">
                    <div className="text-[10px] font-bold text-white/30 tracking-widest uppercase">Avg. Course Rating</div>
                    <div className="text-3xl font-black text-white mt-2">4.71</div>
                    <div className="text-[11px] text-[#30d158] mt-2 flex items-center gap-1">↑ 0.09 <span className="text-white/40">vs last month</span></div>
                  </div>
                  <div className="bg-[#111118] border border-white/5 rounded-2xl p-6 hover:border-[#0071e3]/30 transition-all">
                    <div className="text-[10px] font-bold text-white/30 tracking-widest uppercase">Total Watch Time</div>
                    <div className="text-3xl font-black text-white mt-2">94.3K h</div>
                    <div className="text-[11px] text-[#30d158] mt-2 flex items-center gap-1">↑ 31.7% <span className="text-white/40">vs last month</span></div>
                  </div>
                </div>

                {/* CHARTS ROW */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Monthly Revenue Chart */}
                  <div className="bg-[#111118] border border-white/5 rounded-2xl p-6 lg:col-span-2">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h4 className="text-sm font-bold text-white">Monthly Analytics</h4>
                        <p className="text-[11px] text-white/40">Subscription & Standalone Purchases</p>
                      </div>
                    </div>
                    {/* SVG Chart placeholder */}
                    <div className="h-48 w-full flex items-end">
                      <svg className="w-full h-full" viewBox="0 0 100 40" preserveAspectRatio="none">
                        <defs>
                          <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#0071e3" stopOpacity="0.4" />
                            <stop offset="100%" stopColor="#0071e3" stopOpacity="0.0" />
                          </linearGradient>
                        </defs>
                        <path d="M 0 35 Q 25 15, 50 25 T 100 5 L 100 40 L 0 40 Z" fill="url(#chartGradient)" />
                        <path d="M 0 35 Q 25 15, 50 25 T 100 5" fill="none" stroke="#0071e3" strokeWidth="1" />
                      </svg>
                    </div>
                  </div>

                  {/* Rating breakdown panel */}
                  <div className="bg-[#111118] border border-white/5 rounded-2xl p-6">
                    <h4 className="text-sm font-bold text-white mb-4">Rating Breakdown</h4>
                    <div className="flex flex-col items-center mb-6">
                      <div className="text-4xl font-extrabold text-white">4.97</div>
                      <div className="text-xs text-white/40 mt-1">out of 5.0 (3.4K reviews)</div>
                    </div>
                    <div className="space-y-2.5">
                      {[
                        { stars: 5, pct: "92%", count: 3128 },
                        { stars: 4, pct: "6%", count: 204 },
                        { stars: 3, pct: "1%", count: 34 },
                        { stars: 2, pct: "0.5%", count: 17 },
                        { stars: 1, pct: "0.5%", count: 17 },
                      ].map((item) => (
                        <div key={item.stars} className="flex items-center gap-3 text-[11px]">
                          <span className="w-10 text-white/60 font-semibold">{item.stars} ★</span>
                          <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                            <div className="h-full bg-yellow-400" style={{ width: item.pct }}></div>
                          </div>
                          <span className="w-8 text-right text-white/40">{item.pct}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* RECENT ACTIVITY */}
                <div className="bg-[#111118] border border-white/5 rounded-2xl p-6">
                  <h4 className="text-sm font-bold text-white mb-4">Recent Activity Feed</h4>
                  <div className="space-y-4">
                    {[
                      { type: "purchase", user: "Sneha Joshi", course: "CCNA Complete Course", time: "2 hours ago", color: "bg-[#30d158]" },
                      { type: "register", user: "Vikram Malhotra", course: "Registered on platform", time: "4 hours ago", color: "bg-[#0071e3]" },
                      { type: "progress", user: "Sneha Joshi", course: "Marked Installation & Setup as complete", time: "5 hours ago", color: "bg-[#ffd60a]" },
                      { type: "purchase", user: "Sara Al-Farsi", course: "Linux Administrator Path", time: "1 day ago", color: "bg-[#30d158]" },
                    ].map((act, i) => (
                      <div key={i} className="flex gap-4 items-start border-b border-white/5 pb-4 last:border-b-0 last:pb-0">
                        <div className={`w-2.5 h-2.5 rounded-full mt-1 ${act.color}`} />
                        <div className="flex-1 text-[13px]">
                          <span className="font-semibold text-white">{act.user}</span>: {act.course}
                          <div className="text-[11px] text-white/30 mt-0.5">{act.time}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 2. COURSES TAB */}
            {activeTab === "courses" && (
              <div className="bg-[#111118] border border-white/5 rounded-2xl overflow-hidden">
                {courses.length === 0 ? (
                  <div className="p-12 text-center text-white/40">
                    <BookOpen size={48} className="mx-auto mb-4 text-white/10" />
                    <p className="text-sm">No courses found. Add a course to get started.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b border-white/5 text-[10px] font-bold text-white/40 tracking-wider text-left">
                          <th className="p-6">Course</th>
                          <th className="p-6">Category</th>
                          <th className="p-6">Level</th>
                          <th className="p-6">Pricing</th>
                          <th className="p-6">Status</th>
                          <th className="p-6 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {courses.map((course) => (
                          <tr key={course._id} className="border-b border-white/5 text-[13px] text-white/60 hover:bg-white/5">
                            <td className="p-6 font-bold text-white flex items-center gap-3">
                              <span className="text-xl bg-white/5 w-10 h-10 rounded-lg flex items-center justify-center">
                                {course.image || "📚"}
                              </span>
                              <div>
                                <div>{course.title}</div>
                                <div className="text-[11px] text-white/30 mt-1">{course.curriculum?.length || 0} Lectures</div>
                              </div>
                            </td>
                            <td className="p-6">{course.category}</td>
                            <td className="p-6">{course.level}</td>
                            <td className="p-6 font-bold text-white">
                              {course.accessType === "free" ? "Free" : `₹${course.pricing}`}
                            </td>
                            <td className="p-6">
                              <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                                course.isPublished ? "bg-green-500/10 text-green-400" : "bg-yellow-500/10 text-yellow-400"
                              }`}>
                                {course.isPublished ? "Published" : "Draft"}
                              </span>
                            </td>
                            <td className="p-6 text-right">
                              <div className="flex gap-2 justify-end">
                                <button
                                  onClick={() => navigate(`/instructor/edit-course/${course._id}`)}
                                  className="p-2 bg-white/5 hover:bg-white/10 hover:text-white rounded-lg cursor-pointer border-none transition-all"
                                  title="Edit course"
                                >
                                  <Edit2 size={14} />
                                </button>
                                <button
                                  onClick={() => handleDeleteCourse(course._id)}
                                  className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg cursor-pointer border-none transition-all"
                                  title="Delete course"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* 3. STUDENTS TAB */}
            {activeTab === "students" && (
              <div className="bg-[#111118] border border-white/5 rounded-2xl overflow-hidden">
                {students.length === 0 ? (
                  <div className="p-12 text-center text-white/40">
                    <Users size={48} className="mx-auto mb-4 text-white/10" />
                    <p className="text-sm">No students currently enrolled.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b border-white/5 text-[10px] font-bold text-white/40 tracking-wider text-left">
                          <th className="p-6">Student</th>
                          <th className="p-6">Enrolled Course(s)</th>
                          <th className="p-6">Progress</th>
                          <th className="p-6">Date Registered</th>
                          <th className="p-6 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {students.map((stud) => (
                          <tr key={stud.studentId} className="border-b border-white/5 text-[13px] text-white/60 hover:bg-white/5">
                            <td className="p-6 font-bold text-white flex items-center gap-3">
                              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#0071e3] to-[#00d4ff] flex items-center justify-center font-bold text-xs text-white">
                                {stud.profileImage ? (
                                  <img src={stud.profileImage} alt="" className="w-full h-full rounded-full object-cover" />
                                ) : (
                                  stud.userFullName?.substring(0, 2).toUpperCase()
                                )}
                              </div>
                              <div>
                                <div>{stud.userFullName}</div>
                                <div className="text-[11px] text-white/30 mt-1">{stud.userEmail}</div>
                              </div>
                            </td>
                            <td className="p-6">
                              {stud.courses?.map((c, i) => (
                                <div key={i} className="mb-1 font-semibold text-white last:mb-0">
                                  {c.title}
                                </div>
                              ))}
                            </td>
                            <td className="p-6">
                              {stud.courses?.map((c, i) => (
                                <div key={i} className="flex items-center gap-3 mb-1.5 last:mb-0">
                                  <div className="flex-1 w-24 h-1.5 bg-white/5 rounded-full overflow-hidden">
                                    <div className="h-full bg-[#0071e3]" style={{ width: `${c.progress}%` }}></div>
                                  </div>
                                  <span className="text-[11px] font-bold text-white/60">{c.progress}%</span>
                                </div>
                              ))}
                            </td>
                            <td className="p-6 text-xs text-white/40">
                              {stud.courses?.[0]?.dateOfPurchase ? new Date(stud.courses[0].dateOfPurchase).toLocaleDateString() : "N/A"}
                            </td>
                            <td className="p-6 text-right">
                              <button
                                onClick={() => handleDeleteStudent(stud.studentId)}
                                className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg cursor-pointer border-none transition-all"
                                title="Remove student profile"
                              >
                                <Trash2 size={14} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* 4. SUB-ADMINS TAB */}
            {activeTab === "subadmins" && (
              <div className="space-y-6">
                <div className="bg-[#111118] border border-white/5 rounded-2xl overflow-hidden">
                  {subAdmins.length === 0 ? (
                    <div className="p-12 text-center text-white/40">
                      <GraduationCap size={48} className="mx-auto mb-4 text-white/10" />
                      <p className="text-sm">No Sub-Admins found. Click 'Add Sub-Admin' to create one.</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="border-b border-white/5 text-[10px] font-bold text-white/40 tracking-wider text-left">
                            <th className="p-6">FullName</th>
                            <th className="p-6">UserName</th>
                            <th className="p-6">Email</th>
                            <th className="p-6">Role</th>
                            <th className="p-6 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {subAdmins.map((admin) => (
                            <tr key={admin._id} className="border-b border-white/5 text-[13px] text-white/60 hover:bg-white/5">
                              <td className="p-6 font-bold text-white">{admin.userFullName}</td>
                              <td className="p-6">{admin.userName}</td>
                              <td className="p-6">{admin.userEmail}</td>
                              <td className="p-6 text-xs text-[#0071e3] uppercase tracking-wider font-semibold">{admin.role}</td>
                              <td className="p-6 text-right">
                                <div className="flex gap-2 justify-end">
                                  <button
                                    onClick={() => {
                                      setEditingSubAdminId(admin._id);
                                      setSubAdminForm({
                                        userName: admin.userName,
                                        userFullName: admin.userFullName,
                                        userEmail: admin.userEmail,
                                        password: "", // do not populate password
                                      });
                                      setShowSubAdminModal(true);
                                    }}
                                    className="p-2 bg-white/5 hover:bg-white/10 hover:text-white rounded-lg cursor-pointer border-none transition-all"
                                    title="Edit credentials"
                                  >
                                    <Edit2 size={14} />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteSubAdmin(admin._id)}
                                    className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg cursor-pointer border-none transition-all"
                                    title="Revoke access"
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 5. LANDING PAGE CONFIG TAB */}
            {activeTab === "homeconfig" && (
              <div className="bg-[#111118] border border-white/5 rounded-2xl p-8 space-y-8 max-w-3xl">
                <div>
                  <h3 className="text-lg font-bold text-white mb-2">Category Lists</h3>
                  <p className="text-xs text-white/40 mb-4">Set categories that are visible on courses filter dropdowns.</p>
                  <div className="space-y-3">
                    {homeConfig.categories?.map((cat, idx) => (
                      <div key={idx} className="flex gap-4">
                        <input
                          type="text"
                          className="flex-1 bg-white/5 border border-white/10 rounded-xl p-2.5 text-xs text-white outline-none focus:border-[#0071e3]"
                          placeholder="Category ID (e.g. microsoft)"
                          value={cat.id || ""}
                          onChange={(e) => {
                            const newCats = [...homeConfig.categories];
                            newCats[idx].id = e.target.value;
                            setHomeConfig({ ...homeConfig, categories: newCats });
                          }}
                        />
                        <input
                          type="text"
                          className="flex-1 bg-white/5 border border-white/10 rounded-xl p-2.5 text-xs text-white outline-none focus:border-[#0071e3]"
                          placeholder="Category Name (e.g. Microsoft)"
                          value={cat.label || ""}
                          onChange={(e) => {
                            const newCats = [...homeConfig.categories];
                            newCats[idx].label = e.target.value;
                            setHomeConfig({ ...homeConfig, categories: newCats });
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const newCats = homeConfig.categories.filter((_, i) => i !== idx);
                            setHomeConfig({ ...homeConfig, categories: newCats });
                          }}
                          className="p-2.5 bg-red-500/10 text-red-400 hover:bg-red-500/20 border-none rounded-xl cursor-pointer"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() =>
                        setHomeConfig({
                          ...homeConfig,
                          categories: [...(homeConfig.categories || []), { id: "", label: "" }],
                        })
                      }
                      className="bg-transparent hover:bg-white/5 text-[#0071e3] border border-[#0071e3]/20 text-xs font-semibold px-4 py-2 rounded-xl cursor-pointer mt-2"
                    >
                      ＋ Add Category Option
                    </button>
                  </div>
                </div>

                <div className="border-t border-white/5 pt-6">
                  <h3 className="text-lg font-bold text-white mb-2">Skill Pillars</h3>
                  <p className="text-xs text-white/40 mb-4">Set learning pillars displayed in home filters.</p>
                  <div className="space-y-3">
                    {homeConfig.skillPillars?.map((p, idx) => (
                      <div key={idx} className="flex gap-4">
                        <input
                          type="text"
                          className="flex-1 bg-white/5 border border-white/10 rounded-xl p-2.5 text-xs text-white outline-none focus:border-[#0071e3]"
                          placeholder="Skill Pillar label (e.g. CLI)"
                          value={p.label || ""}
                          onChange={(e) => {
                            const newPillars = [...homeConfig.skillPillars];
                            newPillars[idx].label = e.target.value;
                            setHomeConfig({ ...homeConfig, skillPillars: newPillars });
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const newPillars = homeConfig.skillPillars.filter((_, i) => i !== idx);
                            setHomeConfig({ ...homeConfig, skillPillars: newPillars });
                          }}
                          className="p-2.5 bg-red-500/10 text-red-400 hover:bg-red-500/20 border-none rounded-xl cursor-pointer"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() =>
                        setHomeConfig({
                          ...homeConfig,
                          skillPillars: [...(homeConfig.skillPillars || []), { label: "" }],
                        })
                      }
                      className="bg-transparent hover:bg-white/5 text-[#0071e3] border border-[#0071e3]/20 text-xs font-semibold px-4 py-2 rounded-xl cursor-pointer mt-2"
                    >
                      ＋ Add Skill Pillar
                    </button>
                  </div>
                </div>

                <div className="border-t border-white/5 pt-6 flex justify-end">
                  <button
                    onClick={handleSaveHomeConfig}
                    className="bg-[#0071e3] hover:bg-[#0077ed] text-white text-xs font-bold px-6 py-3 rounded-xl border-none cursor-pointer shadow-lg"
                  >
                    Save Modifications
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </main>

      {/* SUB-ADMIN MODAL */}
      {showSubAdminModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] flex items-center justify-center p-6 text-left">
          <div className="bg-[#111118] border border-white/5 rounded-3xl p-8 max-w-md w-full relative">
            <h3 className="text-xl font-bold text-white mb-6">
              {editingSubAdminId ? "Edit Sub-Admin Credentials" : "Register Sub-Admin"}
            </h3>
            <form onSubmit={handleSaveSubAdmin} className="space-y-4">
              <div>
                <label className="text-xs text-white/60 mb-1.5 block">Full Name</label>
                <input
                  type="text"
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs text-white outline-none focus:border-[#0071e3]"
                  placeholder="e.g. Arjun Kapoor"
                  value={subAdminForm.userFullName}
                  onChange={(e) => setSubAdminForm({ ...subAdminForm, userFullName: e.target.value })}
                />
              </div>
              <div>
                <label className="text-xs text-white/60 mb-1.5 block">User Name</label>
                <input
                  type="text"
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs text-white outline-none focus:border-[#0071e3]"
                  placeholder="e.g. arjunkapoor"
                  value={subAdminForm.userName}
                  onChange={(e) => setSubAdminForm({ ...subAdminForm, userName: e.target.value })}
                />
              </div>
              <div>
                <label className="text-xs text-white/60 mb-1.5 block">Email Address</label>
                <input
                  type="email"
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs text-white outline-none focus:border-[#0071e3]"
                  placeholder="e.g. arjun@bhavinacademy.com"
                  value={subAdminForm.userEmail}
                  onChange={(e) => setSubAdminForm({ ...subAdminForm, userEmail: e.target.value })}
                />
              </div>
              <div>
                <label className="text-xs text-white/60 mb-1.5 block">
                  Password {editingSubAdminId && <span className="text-[10px] text-white/30 font-light">(leave blank to keep unchanged)</span>}
                </label>
                <input
                  type="password"
                  required={!editingSubAdminId}
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs text-white outline-none focus:border-[#0071e3]"
                  placeholder="e.g. ••••••••"
                  value={subAdminForm.password}
                  onChange={(e) => setSubAdminForm({ ...subAdminForm, password: e.target.value })}
                />
              </div>

              <div className="flex gap-3 justify-end pt-4">
                <button
                  type="button"
                  onClick={() => setShowSubAdminModal(false)}
                  className="bg-transparent hover:bg-white/5 text-white/60 hover:text-white border border-white/10 text-xs font-bold px-4 py-2.5 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#0071e3] hover:bg-[#0077ed] text-white text-xs font-bold px-4 py-2.5 rounded-xl border-none cursor-pointer"
                >
                  Save Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
