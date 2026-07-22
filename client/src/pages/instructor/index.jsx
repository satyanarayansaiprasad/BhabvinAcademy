import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "@/context/auth-context";
import { useToast } from "@/hooks/use-toast";
import {
  fetchInstructorCourseListService,
  addNewCourseService,
  fetchInstructorCourseDetailsService,
  updateCourseByIdService,
  deleteCourseService,
  fetchAdminStudentProgressService,
  deleteAdminStudentService,
  fetchCategoriesService,
  addNewCategoryService,
  updateCategoryService,
  deleteCategoryService,
  mediaUploadService,
} from "@/services";
import {
  TvMinimalPlay,
  Users,
  DollarSign,
  Star,
  Clock,
  Plus,
  Trash2,
  Edit,
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  MoveUp,
  MoveDown,
  LayoutDashboard,
  BookOpen,
  GraduationCap,
  Sparkles,
  Play,
  FileText,
  HelpCircle,
  Eye,
  AlertTriangle,
  FolderKanban,
  Download,
  FileSpreadsheet,
  Upload,
  Image as ImageIcon,
  Loader2,
  ChevronRight
} from "lucide-react";

// Banner gradients definitions matching the mockups
const bannerGradients = [
  { name: "Windows Blue", value: "linear-gradient(135deg,#0078d4,#005a9e)", class: "from-[#0078d4] to-[#005a9e]" },
  { name: "Linux Orange", value: "linear-gradient(135deg,#e95420,#772953)", class: "from-[#e95420] to-[#772953]" },
  { name: "Networking Blue", value: "linear-gradient(135deg,#1ba1e2,#0050ef)", class: "from-[#1ba1e2] to-[#0050ef]" },
  { name: "Azure Cyan", value: "linear-gradient(135deg,#0089d6,#00bcf2)", class: "from-[#0089d6] to-[#00bcf2]" },
  { name: "Security Green", value: "linear-gradient(135deg,#107c10,#004b1c)", class: "from-[#107c10] to-[#004b1c]" },
  { name: "Purple", value: "linear-gradient(135deg,#5c2d91,#8764b8)", class: "from-[#5c2d91] to-[#8764b8]" },
];

function InstructorPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { auth } = useContext(AuthContext);
  const { toast } = useToast();

  const isEditMode = id !== undefined;
  const isCreateNew = id === "create";

  // Tab State for Main Dashboard
  const [activeTab, setActiveTab] = useState("dashboard");

  // Main Dashboard Data
  const [courses, setCourses] = useState([]);
  const [studentsProgress, setStudentsProgress] = useState([]);
  const [categoriesList, setCategoriesList] = useState([]);
  const [loadingDashboard, setLoadingDashboard] = useState(true);

  // Course Editor Form States
  const [courseTitle, setCourseTitle] = useState("");
  const [shortDesc, setShortDesc] = useState("");
  const [fullDesc, setFullDesc] = useState("");
  const [category, setCategory] = useState("Microsoft");
  const [difficulty, setDifficulty] = useState("Intermediate");
  const [language, setLanguage] = useState("English");
  const [estimatedHours, setEstimatedHours] = useState(10);
  const [welcomeMessage, setWelcomeMessage] = useState("");
  
  // Banner Emoji, Gradient & Custom Image URL
  const [bannerIcon, setBannerIcon] = useState("🪟");
  const [bannerGradient, setBannerGradient] = useState("linear-gradient(135deg,#0078d4,#005a9e)");
  const [bannerMode, setBannerMode] = useState("gradient"); // 'gradient' or 'image'
  const [bannerImageUrl, setBannerImageUrl] = useState("");
  const [uploadingBannerImage, setUploadingBannerImage] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Curriculum Builder (Section -> Lessons)
  const [sections, setSections] = useState([
    {
      id: "sec_1",
      title: "Section 1 — Getting Started",
      lessons: [
        { id: "les_1", title: "Introduction to the course", type: "video", videoUrl: "", fileUrl: "", fileName: "", freePreview: true, notes: "" }
      ]
    }
  ]);

  // Pricing & Access
  const [pricingType, setPricingType] = useState("free");
  const [price, setPrice] = useState(0);

  // Requirements & Outcomes
  const [prerequisites, setPrerequisites] = useState("");
  const [outcomes, setOutcomes] = useState("");
  const [targetAudience, setTargetAudience] = useState("");

  const [savingCourse, setSavingCourse] = useState(false);

  // Category Management Form State
  const [newCatName, setNewCatName] = useState("");
  const [editingCatId, setEditingCatId] = useState(null);
  const [editingCatName, setEditingCatName] = useState("");
  const [savingCategory, setSavingCategory] = useState(false);

  // Expanded Student Accordion State
  const [expandedStudentEmails, setExpandedStudentEmails] = useState({});

  function toggleStudentExpand(email) {
    setExpandedStudentEmails(prev => ({
      ...prev,
      [email]: !prev[email]
    }));
  }

  // Group student progress records by unique student (studentEmail || studentId)
  const groupedStudents = React.useMemo(() => {
    const map = new Map();

    (studentsProgress || []).forEach((item) => {
      const key = (item.studentEmail || item.studentId || "unknown").toLowerCase().trim();

      if (!map.has(key)) {
        map.set(key, {
          studentId: item.studentId,
          studentName: item.studentName || "Student",
          studentEmail: item.studentEmail || "student@example.com",
          totalSpent: 0,
          courses: [],
        });
      }

      const group = map.get(key);
      const paidNum = typeof item.paidAmount === "string" 
        ? (parseFloat(item.paidAmount.replace(/[^\d.]/g, "")) || 0)
        : (Number(item.paidAmount) || 0);

      group.totalSpent += paidNum;
      group.courses.push({
        ...item,
        numericPaidAmount: paidNum,
      });
    });

    return Array.from(map.values()).map(group => {
      const avgProgress = group.courses.length > 0
        ? Math.round(group.courses.reduce((s, c) => s + (c.progress || 0), 0) / group.courses.length)
        : 0;
      
      const totalCompleted = group.courses.filter(c => c.completed || c.progress === 100).length;
      
      let overallPerf = "Getting Started";
      if (avgProgress >= 80 || (totalCompleted === group.courses.length && group.courses.length > 0)) overallPerf = "High Performer";
      else if (avgProgress >= 40 || totalCompleted > 0) overallPerf = "Active Learner";

      return {
        ...group,
        avgProgress,
        totalCompleted,
        overallPerf,
      };
    });
  }, [studentsProgress]);

  // Fetch Dashboard & Category data
  async function loadDashboardData() {
    setLoadingDashboard(true);
    try {
      const coursesRes = await fetchInstructorCourseListService();
      const progressRes = await fetchAdminStudentProgressService();
      const catRes = await fetchCategoriesService();

      if (coursesRes?.success) setCourses(coursesRes.data);
      if (progressRes?.success) setStudentsProgress(progressRes.data);
      if (catRes?.success) setCategoriesList(catRes.data);
    } catch (err) {
      console.error(err);
      toast({
        title: "Error fetching data",
        description: "Could not load dashboard information.",
        variant: "destructive"
      });
    } finally {
      setLoadingDashboard(false);
    }
  }

  async function loadCategoriesData() {
    try {
      const catRes = await fetchCategoriesService();
      if (catRes?.success) setCategoriesList(catRes.data);
    } catch (err) {
      console.error(err);
    }
  }

  // Category CRUD Handlers
  async function handleAddCategory() {
    if (!newCatName || !newCatName.trim()) {
      toast({
        title: "Validation Error",
        description: "Category name cannot be empty.",
        variant: "destructive",
      });
      return;
    }

    const trimmed = newCatName.trim();
    const isDuplicate = categoriesList.some(
      (cat) => cat.name.toLowerCase() === trimmed.toLowerCase()
    );

    if (isDuplicate) {
      toast({
        title: "Duplicate Category",
        description: "A category with this name already exists.",
        variant: "destructive",
      });
      return;
    }

    setSavingCategory(true);
    try {
      const res = await addNewCategoryService({ name: trimmed });
      if (res?.success) {
        toast({
          title: "Category Created",
          description: `Category "${trimmed}" has been created successfully.`,
        });
        setNewCatName("");
        loadCategoriesData();
      } else {
        toast({
          title: "Error",
          description: res?.message || "Failed to create category.",
          variant: "destructive",
        });
      }
    } catch (err) {
      toast({
        title: "Error",
        description: err.response?.data?.message || "Error creating category.",
        variant: "destructive",
      });
    } finally {
      setSavingCategory(false);
    }
  }

  async function handleUpdateCategory(id) {
    if (!editingCatName || !editingCatName.trim()) {
      toast({
        title: "Validation Error",
        description: "Category name cannot be empty.",
        variant: "destructive",
      });
      return;
    }

    const trimmed = editingCatName.trim();
    const isDuplicate = categoriesList.some(
      (cat) => cat._id !== id && cat.name.toLowerCase() === trimmed.toLowerCase()
    );

    if (isDuplicate) {
      toast({
        title: "Duplicate Category",
        description: "Another category with this name already exists.",
        variant: "destructive",
      });
      return;
    }

    try {
      const res = await updateCategoryService(id, { name: trimmed });
      if (res?.success) {
        toast({
          title: "Category Updated",
          description: "Category updated successfully.",
        });
        setEditingCatId(null);
        setEditingCatName("");
        loadCategoriesData();
      }
    } catch (err) {
      toast({
        title: "Error",
        description: err.response?.data?.message || "Error updating category.",
        variant: "destructive",
      });
    }
  }

  async function handleDeleteCategory(id) {
    if (!window.confirm("Are you sure you want to delete this category?")) return;
    try {
      const res = await deleteCategoryService(id);
      if (res?.success) {
        toast({
          title: "Category Deleted",
          description: "Category has been removed.",
        });
        loadCategoriesData();
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to delete category.",
        variant: "destructive",
      });
    }
  }

  function handleDownloadStudentReport() {
    if (!groupedStudents || groupedStudents.length === 0) {
      toast({
        title: "No Student Data",
        description: "There are no student progress records available to export.",
        variant: "destructive",
      });
      return;
    }

    const headers = [
      "Student Name",
      "Student Email",
      "Total Courses Purchased",
      "Total Student Spend",
      "Enrolled Course Title",
      "Purchase Date",
      "Course Paid Amount",
      "Course Progress (%)",
      "Course Status",
      "Performance Status",
    ];

    const rows = [];

    groupedStudents.forEach((student) => {
      student.courses.forEach((item) => {
        const pDate = item.dateOfPurchase ? new Date(item.dateOfPurchase).toLocaleDateString("en-IN") : "N/A";
        const pAmt = item.paidAmount || `₹${item.numericPaidAmount || 489}`;
        const perf = item.performance || (item.progress >= 80 ? "High Performer" : item.progress >= 40 ? "Active Learner" : "Getting Started");

        rows.push([
          `"${(student.studentName || "Student").replace(/"/g, '""')}"`,
          `"${(student.studentEmail || "").replace(/"/g, '""')}"`,
          `"${student.courses.length} Courses"`,
          `"₹${student.totalSpent.toFixed(2)}"`,
          `"${(item.courseTitle || "").replace(/"/g, '""')}"`,
          `"${pDate}"`,
          `"${pAmt}"`,
          `"${item.progress || 0}%"`,
          `"${item.completed ? "Completed" : "In Progress"}"`,
          `"${perf}"`,
        ]);
      });
    });

    // Use BOM \uFEFF for proper UTF-8 Excel formatting
    const csvString = "\uFEFF" + [headers.join(","), ...rows.map((e) => e.join(","))].join("\r\n");
    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `BhavinAcademy_Student_Progress_Report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: "Excel/CSV Report Exported",
      description: `Exported ${rows.length} enrollment records across ${groupedStudents.length} students successfully.`,
    });
  }

  async function handleBannerImageFileUpload(e) {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setBannerImageUrl(event.target.result);
    };
    reader.readAsDataURL(selectedFile);

    const imageFormData = new FormData();
    imageFormData.append("file", selectedFile);

    setUploadingBannerImage(true);
    try {
      const res = await mediaUploadService(imageFormData, (progress) => {
        setUploadProgress(progress);
      });
      if (res?.success && res?.data?.url) {
        setBannerImageUrl(res.data.url);
        toast({
          title: "Image Uploaded",
          description: "Course banner image uploaded successfully.",
        });
      }
    } catch (err) {
      console.error("Image upload error:", err);
    } finally {
      setUploadingBannerImage(false);
    }
  }

  useEffect(() => {
    if (!isEditMode) {
      loadDashboardData();
    }
  }, [isEditMode]);

  // Fetch details if editing an existing course
  useEffect(() => {
    if (isEditMode && !isCreateNew) {
      async function loadCourseDetails() {
        try {
          const res = await fetchInstructorCourseDetailsService(id);
          if (res?.success && res.data) {
            const course = res.data;
            setCourseTitle(course.title || "");
            setShortDesc(course.subtitle || "");
            setFullDesc(course.description || "");
            setCategory(course.category ? course.category.charAt(0).toUpperCase() + course.category.slice(1) : "Microsoft");
            setDifficulty(course.level || "Intermediate");
            setLanguage(course.primaryLanguage || "English");
            setWelcomeMessage(course.welcomeMessage || "");
            setPrice(course.pricing || 0);
            setPricingType(course.pricing > 0 ? "standalone" : "free");
            setOutcomes(course.objectives || "");

            // Extract banner details from image field
            if (course.image) {
              if (course.image.includes("|")) {
                const parts = course.image.split("|");
                setBannerIcon(parts[0]);
                setBannerGradient(parts[1]);
                setBannerMode("gradient");
              } else if (course.image.startsWith("http://") || course.image.startsWith("https://") || course.image.startsWith("/") || course.image.startsWith("data:")) {
                setBannerImageUrl(course.image);
                setBannerMode("image");
              } else if (course.image.startsWith("linear-gradient")) {
                setBannerGradient(course.image);
                setBannerMode("gradient");
              } else {
                setBannerIcon(course.image);
                setBannerMode("gradient");
              }
            }

            // Construct section-grouped curriculum from database flat array
            if (course.curriculum && course.curriculum.length > 0) {
              const secMap = {};
              course.curriculum.forEach((item, index) => {
                const secTitle = item.section || "Section 1 — Getting Started";
                if (!secMap[secTitle]) {
                  secMap[secTitle] = [];
                }
                secMap[secTitle].push({
                  id: item._id || `les_${index}_${Date.now()}`,
                  title: item.title,
                  type: item.videoSource === "doc" ? "doc" : item.videoSource === "quiz" ? "quiz" : "video",
                  videoUrl: item.videoUrl || "",
                  fileUrl: item.fileUrl || "",
                  fileName: item.fileName || "",
                  freePreview: item.freePreview || false,
                  notes: item.notes || ""
                });
              });

              const parsedSections = Object.keys(secMap).map((title, idx) => ({
                id: `sec_${idx}_${Date.now()}`,
                title: title,
                lessons: secMap[title]
              }));
              setSections(parsedSections);
            }
          }
        } catch (err) {
          console.error(err);
          toast({
            title: "Error loading course",
            description: "Could not fetch course details.",
            variant: "destructive"
          });
          navigate("/instructor");
        }
      }
      loadCourseDetails();
    } else if (isCreateNew) {
      // Reset form states for fresh create
      setCourseTitle("");
      setShortDesc("");
      setFullDesc("");
      setCategory("Microsoft");
      setDifficulty("Intermediate");
      setLanguage("English");
      setEstimatedHours(10);
      setWelcomeMessage("");
      setBannerIcon("🪟");
      setBannerGradient("linear-gradient(135deg,#0078d4,#005a9e)");
      setPricingType("free");
      setPrice(0);
      setPrerequisites("");
      setOutcomes("");
      setTargetAudience("");
      setSections([
        {
          id: "sec_1",
          title: "Section 1 — Getting Started",
          lessons: [
            { id: "les_1", title: "Introduction to the course", type: "video", videoUrl: "", fileUrl: "", fileName: "", freePreview: true, notes: "" }
          ]
        }
      ]);
    }
  }, [id, isEditMode, isCreateNew]);

  // Handle Save (Draft or Published)
  async function handleSaveCourse(isPublishing) {
    if (!courseTitle.trim()) {
      toast({
        title: "Course title required",
        description: "Please enter a course title before saving.",
        variant: "destructive"
      });
      return;
    }

    setSavingCourse(true);

    // Flatten curriculum sections state into flat Mongoose array format
    const flatCurriculum = [];
    sections.forEach(sec => {
      sec.lessons.forEach(les => {
        flatCurriculum.push({
          title: les.title,
          videoUrl: les.videoUrl,
          fileUrl: les.fileUrl,
          fileName: les.fileName || les.title,
          freePreview: les.freePreview,
          videoSource: les.type, // 'video', 'doc', 'quiz'
          notes: les.notes,
          section: sec.title
        });
      });
    });

    const courseImagePayload = bannerMode === "image" && bannerImageUrl.trim()
      ? bannerImageUrl.trim()
      : `${bannerIcon}|${bannerGradient}`;

    const payload = {
      instructorId: auth?.user?._id || "admin_123",
      instructorName: auth?.user?.userFullName || auth?.user?.userName || "Bhavin Patel",
      date: new Date(),
      title: courseTitle,
      category: category.toLowerCase(),
      level: difficulty,
      primaryLanguage: language,
      subtitle: shortDesc,
      description: fullDesc,
      image: courseImagePayload,
      welcomeMessage: welcomeMessage || `Welcome to ${courseTitle}!`,
      pricing: pricingType === "free" ? 0 : Number(price),
      objectives: outcomes,
      curriculum: flatCurriculum,
      isPublished: isPublishing
    };

    try {
      let res;
      if (isCreateNew) {
        res = await addNewCourseService(payload);
      } else {
        res = await updateCourseByIdService(id, payload);
      }

      if (res?.success) {
        toast({
          title: isPublishing ? "Course Published! 🚀" : "Draft Saved Successfully! 💾",
          description: isPublishing ? "Your course is now live." : "Course draft details preserved.",
        });
        navigate("/instructor");
      } else {
        toast({
          title: "Save failed",
          description: res?.message || "Something went wrong.",
          variant: "destructive"
        });
      }
    } catch (err) {
      console.error(err);
      toast({
        title: "Error saving course",
        description: err.message || "Failed to make request.",
        variant: "destructive"
      });
    } finally {
      setSavingCourse(false);
    }
  }

  // Delete Course
  async function handleDeleteCourse(courseId) {
    if (!confirm("Are you sure you want to delete this course? This cannot be undone.")) return;
    try {
      const res = await deleteCourseService(courseId);
      if (res?.success) {
        toast({
          title: "Course Deleted",
          description: "The course has been successfully deleted from the platform."
        });
        loadDashboardData();
      }
    } catch (err) {
      console.error(err);
      toast({
        title: "Delete failed",
        description: "Could not remove the course.",
        variant: "destructive"
      });
    }
  }

  // Unenroll student / delete progress
  async function handleDeleteStudent(studentId) {
    if (!confirm("Are you sure you want to remove this student's enrollment and progress?")) return;
    try {
      const res = await deleteAdminStudentService(studentId);
      if (res?.success) {
        toast({
          title: "Student Unenrolled",
          description: "The student's progress and registration have been deleted."
        });
        loadDashboardData();
      }
    } catch (err) {
      console.error(err);
      toast({
        title: "Action failed",
        description: "Could not remove the student's enrollment.",
        variant: "destructive"
      });
    }
  }

  // Curriculum functions
  function addSection() {
    setSections([
      ...sections,
      {
        id: `sec_${Date.now()}`,
        title: `Section ${sections.length + 1} — New Section`,
        lessons: []
      }
    ]);
  }

  function updateSectionTitle(secId, newTitle) {
    setSections(sections.map(sec => sec.id === secId ? { ...sec, title: newTitle } : sec));
  }

  function addLesson(secId, type) {
    const defaultTitle = type === "video" ? "New Video Lesson" : type === "quiz" ? "New Quiz" : "New Document";
    setSections(sections.map(sec => {
      if (sec.id === secId) {
        return {
          ...sec,
          lessons: [
            ...sec.lessons,
            {
              id: `les_${Date.now()}`,
              title: defaultTitle,
              type: type,
              videoUrl: "",
              freePreview: false,
              notes: ""
            }
          ]
        };
      }
      return sec;
    }));
  }

  function updateLessonField(secId, lesId, field, value) {
    setSections(sections.map(sec => {
      if (sec.id === secId) {
        return {
          ...sec,
          lessons: sec.lessons.map(les => les.id === lesId ? { ...les, [field]: value } : les)
        };
      }
      return sec;
    }));
  }

  function removeLesson(secId, lesId) {
    setSections(sections.map(sec => {
      if (sec.id === secId) {
        return {
          ...sec,
          lessons: sec.lessons.filter(les => les.id !== lesId)
        };
      }
      return sec;
    }));
  }

  // Dynamic calculations for KPI values
  const totalRevenue = studentsProgress.reduce((sum, item) => {
    const val = typeof item.paidAmount === "string" 
      ? parseFloat(item.paidAmount.replace(/[^\d.]/g, "")) 
      : (typeof item.paidAmount === "number" ? item.paidAmount : 489);
    return sum + (isNaN(val) ? 489 : val);
  }, 0);
  const totalStudentsCount = new Set(studentsProgress.map(s => s.studentId)).size || studentsProgress.length;

  // Active swatch gradient styling
  const bannerGradientObj = bannerGradients.find(g => g.value === bannerGradient) || bannerGradients[0];

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-[#f5f5f7] font-sans antialiased flex">
      {/* Dynamic CSS injecting Inter and Apple theme settings */}
      <style>{`
        body { background-color: #0a0a0f; color: #f5f5f7; }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #2a2a2f; border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: #3a3a3f; }
      `}</style>

      {/* DASHBOARD MODE */}
      {!isEditMode && (
        <>
          {/* SIDEBAR */}
          <aside className="w-[240px] bg-[#111118] border-r border-[#22222d] flex flex-col shrink-0 z-40 fixed h-screen">
            <div className="p-6 border-b border-[#22222d] flex items-center justify-between">
              <span className="text-[18px] font-extrabold tracking-tight">
                Bhavin<span className="text-[#0071e3]">Academy</span>
              </span>
              <span className="bg-[#0071e3] text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded tracking-wide uppercase">Admin</span>
            </div>
            
            <nav className="flex-1 py-6 px-4 flex flex-col gap-1.5">
              <div className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest px-3 mb-2">Overview</div>
              <button
                onClick={() => setActiveTab("dashboard")}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all text-left ${
                  activeTab === "dashboard" ? "bg-[#0071e3]/15 text-[#0071e3]" : "text-gray-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                <LayoutDashboard className="w-[16px] h-[16px]" />
                Dashboard
              </button>
              
              <div className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest px-3 mt-6 mb-2">Management</div>
              <button
                onClick={() => setActiveTab("courses")}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all text-left ${
                  activeTab === "courses" ? "bg-[#0071e3]/15 text-[#0071e3]" : "text-gray-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                <BookOpen className="w-[16px] h-[16px]" />
                Courses
                {courses.length > 0 && <span className="ml-auto text-[10px] bg-white/10 px-2 py-0.5 rounded-full text-gray-400">{courses.length}</span>}
              </button>
              <button
                onClick={() => setActiveTab("students")}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all text-left ${
                  activeTab === "students" ? "bg-[#0071e3]/15 text-[#0071e3]" : "text-gray-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                <Users className="w-[16px] h-[16px]" />
                Students
                {studentsProgress.length > 0 && <span className="ml-auto text-[10px] bg-white/10 px-2 py-0.5 rounded-full text-gray-400">{studentsProgress.length}</span>}
              </button>
              <button
                onClick={() => setActiveTab("categories")}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all text-left ${
                  activeTab === "categories" ? "bg-[#0071e3]/15 text-[#0071e3]" : "text-gray-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                <FolderKanban className="w-[16px] h-[16px]" />
                Categories
                {categoriesList.length > 0 && <span className="ml-auto text-[10px] bg-white/10 px-2 py-0.5 rounded-full text-gray-400">{categoriesList.length}</span>}
              </button>

              <div className="mt-auto border-t border-[#22222d] pt-4 flex flex-col gap-2">
                <button
                  onClick={() => navigate("/")}
                  className="flex items-center gap-3 px-3 py-2 text-[13px] font-medium text-gray-400 hover:text-white transition-colors"
                >
                  <ArrowLeft className="w-[15px] h-[15px]" />
                  Student View
                </button>
              </div>
            </nav>

            <div className="p-4 border-t border-[#22222d] bg-[#0c0c12]">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#0071e3] to-[#00d4ff] flex items-center justify-center font-bold text-white text-xs">
                  {auth?.user?.userFullName ? auth.user.userFullName.slice(0, 2).toUpperCase() : "AD"}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[12px] font-bold text-[#f5f5f7] truncate">{auth?.user?.userFullName || auth?.user?.userName || "Admin User"}</div>
                  <div className="text-[10px] text-gray-500 capitalize">{auth?.user?.role || "Administrator"}</div>
                </div>
              </div>
            </div>
          </aside>

          {/* MAIN PANELS CONTAINER */}
          <main className="flex-1 ml-[240px] p-8 min-h-screen">
            {/* MAIN CONTENT TOP BAR */}
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-2xl font-bold tracking-tight text-[#f5f5f7]">
                {activeTab === "dashboard" && "Platform Overview"}
                {activeTab === "courses" && "Course Management"}
                {activeTab === "students" && "Enrolled Students"}
                {activeTab === "categories" && "Category Management"}
              </h1>
              <div className="flex items-center gap-3">
                {(activeTab === "students" || activeTab === "dashboard") && (
                  <button
                    onClick={handleDownloadStudentReport}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold py-2.5 px-4 rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-emerald-600/20 cursor-pointer"
                  >
                    <FileSpreadsheet className="w-4 h-4" /> Export Excel Report
                  </button>
                )}
                {activeTab === "courses" && (
                  <button
                    onClick={() => navigate("/instructor/course/edit/create")}
                    className="bg-[#0071e3] text-white hover:bg-[#0077ed] text-xs font-semibold py-2.5 px-4 rounded-xl flex items-center gap-1.5 transition-all shadow-lg shadow-[#0071e3]/10"
                  >
                    <Plus className="w-4 h-4" /> Add Course
                  </button>
                )}
              </div>
            </div>

            {loadingDashboard ? (
              <div className="flex flex-col items-center justify-center h-[50vh] gap-3">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#0071e3]"></div>
                <p className="text-xs text-gray-500">Loading platform metrics...</p>
              </div>
            ) : (
              <>
                {/* TAB 1: DASHBOARD */}
                {activeTab === "dashboard" && (
                  <div className="space-y-6">
                    {/* KPI CARDS */}
                    <div className="grid grid-cols-4 gap-4">
                      <div className="bg-[#111118] border border-[#22222d] rounded-2xl p-5 relative overflow-hidden transition-all hover:border-[#0071e3]/40">
                        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#0071e3] to-[#00d4ff]"></div>
                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Total Students</span>
                        <div className="text-3xl font-extrabold text-white mt-2 tracking-tight">{totalStudentsCount || 847}</div>
                        <span className="text-[11px] text-emerald-500 mt-2 block">↑ 18.4% <span className="text-gray-500">vs last month</span></span>
                      </div>
                      <div className="bg-[#111118] border border-[#22222d] rounded-2xl p-5 relative overflow-hidden transition-all hover:border-[#30d158]/40">
                        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#30d158] to-[#32ade6]"></div>
                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Total Courses</span>
                        <div className="text-3xl font-extrabold text-white mt-2 tracking-tight">{courses.length || 12}</div>
                        <span className="text-[11px] text-emerald-500 mt-2 block">↑ 8.3% <span className="text-gray-500">new modules</span></span>
                      </div>
                      <div className="bg-[#111118] border border-[#22222d] rounded-2xl p-5 relative overflow-hidden transition-all hover:border-[#ffd60a]/40">
                        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#ffd60a] to-[#ff9f0a]"></div>
                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Avg. Rating</span>
                        <div className="text-3xl font-extrabold text-white mt-2 tracking-tight">4.82</div>
                        <span className="text-[11px] text-emerald-500 mt-2 block">↑ 0.12 <span className="text-gray-500">based on feedback</span></span>
                      </div>
                      <div className="bg-[#111118] border border-[#22222d] rounded-2xl p-5 relative overflow-hidden transition-all hover:border-[#bf5af2]/40">
                        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#bf5af2] to-[#0071e3]"></div>
                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Enrollments</span>
                        <div className="text-3xl font-extrabold text-white mt-2 tracking-tight">{studentsProgress.length || 142}</div>
                        <span className="text-[11px] text-emerald-500 mt-2 block">↑ 31.7% <span className="text-gray-500">active learning</span></span>
                      </div>
                    </div>

                    {/* CHARTS LAYER */}
                    <div className="grid grid-cols-3 gap-5">
                      {/* Donut Chart */}
                      <div className="bg-[#111118] border border-[#22222d] rounded-2xl p-6 col-span-1 flex flex-col">
                        <div className="text-sm font-bold mb-4">Enrollments by Category</div>
                        <div className="flex flex-col items-center justify-center flex-1 my-4">
                          <svg className="w-[140px] h-[140px] mb-6" viewBox="0 0 140 140">
                            {/* Static Premium SVG Donut segments */}
                            <path d="M70,15 A55,55 0 0 1 120,45 L104,52 A38,38 0 0 0 70,32 Z" fill="#0071e3" stroke="#111118" strokeWidth="2" />
                            <path d="M120,45 A55,55 0 0 1 115,105 L101,94 A38,38 0 0 0 104,52 Z" fill="#30d158" stroke="#111118" strokeWidth="2" />
                            <path d="M115,105 A55,55 0 0 1 60,125 L63,108 A38,38 0 0 0 101,94 Z" fill="#ffd60a" stroke="#111118" strokeWidth="2" />
                            <path d="M60,125 A55,55 0 0 1 15,80 L32,77 A38,38 0 0 0 63,108 Z" fill="#bf5af2" stroke="#111118" strokeWidth="2" />
                            <path d="M15,80 A55,55 0 0 1 70,15 L70,32 A38,38 0 0 0 32,77 Z" fill="#ff9f0a" stroke="#111118" strokeWidth="2" />
                            <circle cx="70" cy="70" r="30" fill="#111118" />
                            <text x="70" y="68" textAnchor="middle" fill="#f5f5f7" fontSize="12" fontWeight="700">100%</text>
                            <text x="70" y="80" textAnchor="middle" fill="#555" fontSize="8">Metrics</text>
                          </svg>
                          <div className="w-full grid grid-cols-2 gap-2 text-xs">
                            <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-[#0071e3]"></span>Microsoft</div>
                            <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-[#30d158]"></span>Linux</div>
                            <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-[#ffd60a]"></span>Networking</div>
                            <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-[#bf5af2]"></span>Cloud</div>
                          </div>
                        </div>
                      </div>

                      {/* Revenue Line Chart */}
                      <div className="bg-[#111118] border border-[#22222d] rounded-2xl p-6 col-span-2 flex flex-col">
                        <div className="text-sm font-bold mb-4">Enrollment Activity Trends</div>
                        <div className="flex-1 h-[200px] relative mt-4">
                          <svg className="w-full h-full" viewBox="0 0 600 200" preserveAspectRatio="none">
                            <defs>
                              <linearGradient id="revGrad" x1="0" x2="0" y1="0" y2="1">
                                <stop offset="0%" stopColor="#0071e3" stopOpacity="0.25"/>
                                <stop offset="100%" stopColor="#0071e3" stopOpacity="0"/>
                              </linearGradient>
                            </defs>
                            <line x1="10" y1="10" x2="590" y2="10" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
                            <line x1="10" y1="70" x2="590" y2="70" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
                            <line x1="10" y1="130" x2="590" y2="130" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
                            <line x1="10" y1="180" x2="590" y2="180" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
                            
                            <path d="M10,180 L50,150 L100,160 L180,110 L260,95 L340,120 L420,80 L500,60 L590,30 L590,180 Z" fill="url(#revGrad)" />
                            <path d="M10,180 L50,150 L100,160 L180,110 L260,95 L340,120 L420,80 L500,60 L590,30" fill="none" stroke="#0071e3" strokeWidth="2" strokeLinecap="round" />
                            
                            <circle cx="590" cy="30" r="4" fill="#0071e3" stroke="#111118" strokeWidth="2" />
                          </svg>
                        </div>
                        <div className="flex justify-between text-[10px] text-gray-500 mt-2 px-1">
                          <span>Jan</span><span>Mar</span><span>May</span><span>Jul</span><span>Sep</span><span>Nov</span><span>Dec</span>
                        </div>
                      </div>
                    </div>

                    {/* TOP PERFORMING COURSES */}
                    <div className="bg-[#111118] border border-[#22222d] rounded-2xl p-6">
                      <div className="flex justify-between items-center mb-6">
                        <div className="text-sm font-bold">Top Performing Courses</div>
                        <button onClick={() => setActiveTab("courses")} className="text-xs text-[#0071e3] font-medium hover:underline">Manage courses ›</button>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                          <thead>
                            <tr className="border-b border-[#22222d] text-[10px] uppercase text-gray-500 font-bold tracking-wider">
                              <th className="pb-3">Course Title</th>
                              <th className="pb-3 text-center">Category</th>
                              <th className="pb-3 text-center">Pricing</th>
                              <th className="pb-3 text-center">Status</th>
                              <th className="pb-3 text-right">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-[#22222d] text-sm">
                            {courses.slice(0, 5).map(c => {
                              const courseImage = c.image || "🪟|linear-gradient(135deg,#0078d4,#005a9e)";
                              const [emoji, gradient] = courseImage.includes("|") ? courseImage.split("|") : ["📚", courseImage];
                              return (
                                <tr key={c._id} className="hover:bg-white/5 transition-colors">
                                  <td className="py-4">
                                    <div className="flex items-center gap-3">
                                      <div className="w-9 h-9 rounded-lg flex items-center justify-center text-lg select-none shrink-0" style={{ background: gradient || "rgba(255,255,255,0.05)" }}>
                                        {emoji}
                                      </div>
                                      <div>
                                        <div className="font-semibold text-white">{c.title}</div>
                                        <div className="text-xs text-gray-500 capitalize">{c.level || "All Levels"}</div>
                                      </div>
                                    </div>
                                  </td>
                                  <td className="py-4 text-center">
                                    <span className="px-2.5 py-0.5 rounded-full text-xs bg-white/5 text-gray-400 capitalize">{c.category}</span>
                                  </td>
                                  <td className="py-4 text-center font-medium text-emerald-400">
                                    {c.pricing > 0 ? `₹${c.pricing}` : "Included"}
                                  </td>
                                  <td className="py-4 text-center">
                                    {c.isPublished ? (
                                      <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full uppercase">Published</span>
                                    ) : (
                                      <span className="text-[10px] font-bold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-full uppercase">Draft</span>
                                    )}
                                  </td>
                                  <td className="py-4 text-right">
                                    <div className="flex justify-end gap-2">
                                      <button onClick={() => navigate(`/instructor/course/edit/${c._id}`)} className="p-1.5 rounded bg-white/5 hover:bg-[#0071e3] hover:text-white text-gray-400 transition-colors">
                                        <Edit className="w-3.5 h-3.5" />
                                      </button>
                                      <button onClick={() => handleDeleteCourse(c._id)} className="p-1.5 rounded bg-white/5 hover:bg-red-500 hover:text-white text-gray-400 transition-colors">
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              );
                            })}
                            {courses.length === 0 && (
                              <tr>
                                <td colSpan="5" className="py-8 text-center text-gray-500 text-xs">No courses registered. Click Add Course to create one!</td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 2: COURSES */}
                {activeTab === "courses" && (
                  <div className="bg-[#111118] border border-[#22222d] rounded-2xl p-6">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="border-b border-[#22222d] text-[10px] uppercase text-gray-500 font-bold tracking-wider">
                            <th className="pb-3">Course</th>
                            <th className="pb-3 text-center">Category</th>
                            <th className="pb-3 text-center">Difficulty</th>
                            <th className="pb-3 text-center">Pricing</th>
                            <th className="pb-3 text-center">Status</th>
                            <th className="pb-3 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#22222d] text-sm">
                          {courses.map(c => {
                            const courseImage = c.image || "🪟|linear-gradient(135deg,#0078d4,#005a9e)";
                            const [emoji, gradient] = courseImage.includes("|") ? courseImage.split("|") : ["📚", courseImage];
                            return (
                              <tr key={c._id} className="hover:bg-white/5 transition-colors">
                                <td className="py-4">
                                  <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-lg flex items-center justify-center text-lg select-none shrink-0" style={{ background: gradient }}>
                                      {emoji}
                                    </div>
                                    <div>
                                      <div className="font-semibold text-white">{c.title}</div>
                                      <div className="text-xs text-gray-500">{c.curriculum?.length || 0} lessons · {c.duration || 0} hours</div>
                                    </div>
                                  </div>
                                </td>
                                <td className="py-4 text-center">
                                  <span className="px-2.5 py-0.5 rounded-full text-xs bg-white/5 text-gray-400 capitalize">{c.category}</span>
                                </td>
                                <td className="py-4 text-center text-gray-400 capitalize">
                                  {c.level || "Intermediate"}
                                </td>
                                <td className="py-4 text-center font-semibold text-emerald-400">
                                  {c.pricing > 0 ? `₹${c.pricing}` : "Included in Plan"}
                                </td>
                                <td className="py-4 text-center">
                                  {c.isPublished ? (
                                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full uppercase">Published</span>
                                  ) : (
                                    <span className="text-[10px] font-bold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-full uppercase">Draft</span>
                                  )}
                                </td>
                                <td className="py-4 text-right">
                                  <div className="flex justify-end gap-2">
                                    <button onClick={() => navigate(`/instructor/course/edit/${c._id}`)} className="p-2 rounded bg-white/5 hover:bg-[#0071e3] hover:text-white text-gray-400 transition-colors">
                                      <Edit className="w-4 h-4" />
                                    </button>
                                    <button onClick={() => handleDeleteCourse(c._id)} className="p-2 rounded bg-white/5 hover:bg-red-500 hover:text-white text-gray-400 transition-colors">
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                          {courses.length === 0 && (
                            <tr>
                              <td colSpan="6" className="py-12 text-center text-gray-500 text-xs">No courses registered yet. Click the "Add Course" button to create your first class.</td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* TAB 3: STUDENTS */}
                {activeTab === "students" && (
                  <div className="bg-[#111118] border border-[#22222d] rounded-2xl p-6 space-y-4">
                    <div className="flex justify-between items-center flex-wrap gap-3 pb-2 border-b border-[#22222d]">
                      <div>
                        <h3 className="text-base font-bold text-white">Student Enrollment & Performance Analytics</h3>
                        <p className="text-xs text-gray-400">Grouped by student with course breakdown, progress metrics, and Excel reporting.</p>
                      </div>
                      <button
                        onClick={handleDownloadStudentReport}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-2 transition-all shadow-md cursor-pointer"
                      >
                        <FileSpreadsheet className="w-4 h-4" /> Download Excel Report (.csv)
                      </button>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="border-b border-[#22222d] text-[10px] uppercase text-gray-500 font-bold tracking-wider">
                            <th className="pb-3 pl-2">Student</th>
                            <th className="pb-3 text-center">Courses Enrolled</th>
                            <th className="pb-3 text-center">Total Spent</th>
                            <th className="pb-3 text-center">Avg Progress</th>
                            <th className="pb-3 text-center">Completion</th>
                            <th className="pb-3 text-center">Performance</th>
                            <th className="pb-3 text-right pr-2">Course Breakdown</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#22222d] text-sm">
                          {groupedStudents.map((student, idx) => {
                            const isExpanded = !!expandedStudentEmails[student.studentEmail];

                            return (
                              <React.Fragment key={idx}>
                                {/* MAIN PARENT ROW */}
                                <tr
                                  onClick={() => toggleStudentExpand(student.studentEmail)}
                                  className={`hover:bg-white/5 transition-colors cursor-pointer ${
                                    isExpanded ? "bg-white/[0.03]" : ""
                                  }`}
                                >
                                  <td className="py-4 pl-2">
                                    <div className="flex items-center gap-3">
                                      <button
                                        type="button"
                                        className="p-1 rounded-md bg-white/5 hover:bg-[#0071e3] text-gray-400 hover:text-white transition-colors"
                                      >
                                        {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                                      </button>
                                      <div>
                                        <div className="font-semibold text-white flex items-center gap-2">
                                          {student.studentName}
                                        </div>
                                        <div className="text-xs text-gray-500">{student.studentEmail}</div>
                                      </div>
                                    </div>
                                  </td>

                                  <td className="py-4 text-center">
                                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-[#0071e3]/10 text-[#0071e3] border border-[#0071e3]/20">
                                      {student.courses.length} {student.courses.length === 1 ? "Course" : "Courses"}
                                    </span>
                                  </td>

                                  <td className="py-4 text-center font-bold text-emerald-400 text-xs">
                                    ₹{student.totalSpent.toFixed(2)}
                                  </td>

                                  <td className="py-4">
                                    <div className="flex items-center justify-center gap-2">
                                      <div className="w-20 h-1.5 bg-white/5 rounded-full overflow-hidden shrink-0">
                                        <div
                                          className="bg-gradient-to-r from-[#0071e3] to-[#00d4ff] h-full"
                                          style={{ width: `${student.avgProgress}%` }}
                                        ></div>
                                      </div>
                                      <span className="text-xs font-semibold text-gray-300">{student.avgProgress}%</span>
                                    </div>
                                  </td>

                                  <td className="py-4 text-center">
                                    <span className="text-[11px] font-semibold text-gray-300">
                                      {student.totalCompleted} / {student.courses.length} Done
                                    </span>
                                  </td>

                                  <td className="py-4 text-center">
                                    <span
                                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase ${
                                        student.overallPerf === "High Performer"
                                          ? "text-purple-400 bg-purple-500/10"
                                          : student.overallPerf === "Active Learner"
                                          ? "text-emerald-400 bg-emerald-500/10"
                                          : "text-amber-400 bg-amber-500/10"
                                      }`}
                                    >
                                      {student.overallPerf}
                                    </span>
                                  </td>

                                  <td className="py-4 text-right pr-2">
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        toggleStudentExpand(student.studentEmail);
                                      }}
                                      className="text-xs font-semibold text-[#0071e3] hover:underline flex items-center gap-1 ml-auto"
                                    >
                                      {isExpanded ? "Hide Details" : `View Courses (${student.courses.length})`}
                                      {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                                    </button>
                                  </td>
                                </tr>

                                {/* EXPANDED SUB-TABLE ROW */}
                                {isExpanded && (
                                  <tr>
                                    <td colSpan="7" className="p-0 border-b border-[#22222d]">
                                      <div className="bg-[#0a0a0f] p-4 m-2 rounded-xl border border-[#22222d] space-y-3">
                                        <div className="text-xs font-bold text-gray-400 uppercase tracking-wider flex justify-between items-center">
                                          <span>Enrolled Courses for {student.studentName}</span>
                                          <span className="text-gray-500 normal-case font-normal text-[11px]">
                                            Click trash icon to unenroll course
                                          </span>
                                        </div>

                                        <table className="w-full text-left text-xs border-collapse">
                                          <thead>
                                            <tr className="border-b border-[#22222d] text-[10px] uppercase text-gray-500 font-bold">
                                              <th className="pb-2">Course Title</th>
                                              <th className="pb-2">Purchase Date</th>
                                              <th className="pb-2">Paid Amount</th>
                                              <th className="pb-2 text-center">Progress</th>
                                              <th className="pb-2 text-center">Status</th>
                                              <th className="pb-2 text-center">Performance</th>
                                              <th className="pb-2 text-right">Actions</th>
                                            </tr>
                                          </thead>
                                          <tbody className="divide-y divide-[#22222d]/60">
                                            {student.courses.map((cItem, cIdx) => {
                                              const pDate = cItem.dateOfPurchase
                                                ? new Date(cItem.dateOfPurchase).toLocaleDateString("en-IN", {
                                                    day: "2-digit",
                                                    month: "short",
                                                    year: "numeric",
                                                  })
                                                : "N/A";
                                              const cPerf =
                                                cItem.performance ||
                                                (cItem.progress >= 80
                                                  ? "High Performer"
                                                  : cItem.progress >= 40
                                                  ? "Active Learner"
                                                  : "Getting Started");

                                              return (
                                                <tr key={cIdx} className="hover:bg-white/5 transition-colors">
                                                  <td className="py-3 font-medium text-white">
                                                    {cItem.courseTitle}
                                                  </td>
                                                  <td className="py-3 text-gray-400">
                                                    {pDate}
                                                  </td>
                                                  <td className="py-3 font-semibold text-emerald-400">
                                                    {cItem.paidAmount || `₹${cItem.numericPaidAmount}`}
                                                  </td>
                                                  <td className="py-3">
                                                    <div className="flex items-center justify-center gap-2">
                                                      <div className="w-16 h-1.5 bg-white/5 rounded-full overflow-hidden shrink-0">
                                                        <div
                                                          className="bg-gradient-to-r from-[#0071e3] to-[#00d4ff] h-full"
                                                          style={{ width: `${cItem.progress || 0}%` }}
                                                        ></div>
                                                      </div>
                                                      <span className="font-semibold text-gray-300">{cItem.progress || 0}%</span>
                                                    </div>
                                                  </td>
                                                  <td className="py-3 text-center">
                                                    {cItem.completed ? (
                                                      <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full uppercase">
                                                        Completed
                                                      </span>
                                                    ) : (
                                                      <span className="text-[10px] font-bold text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded-full uppercase">
                                                        In Progress
                                                      </span>
                                                    )}
                                                  </td>
                                                  <td className="py-3 text-center">
                                                    <span
                                                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                                                        cPerf === "High Performer"
                                                          ? "text-purple-400 bg-purple-500/10"
                                                          : cPerf === "Active Learner"
                                                          ? "text-emerald-400 bg-emerald-500/10"
                                                          : "text-amber-400 bg-amber-500/10"
                                                      }`}
                                                    >
                                                      {cPerf}
                                                    </span>
                                                  </td>
                                                  <td className="py-3 text-right">
                                                    <button
                                                      onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDeleteStudent(cItem.studentId);
                                                      }}
                                                      className="p-1.5 rounded bg-white/5 hover:bg-red-500 hover:text-white text-gray-400 transition-colors"
                                                      title="Unenroll student"
                                                    >
                                                      <Trash2 className="w-3.5 h-3.5" />
                                                    </button>
                                                  </td>
                                                </tr>
                                              );
                                            })}
                                          </tbody>
                                        </table>
                                      </div>
                                    </td>
                                  </tr>
                                )}
                              </React.Fragment>
                            );
                          })}
                          {groupedStudents.length === 0 && (
                            <tr>
                              <td colSpan="7" className="py-12 text-center text-gray-500 text-xs">
                                No student enrollments registered on the platform.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* TAB 4: CATEGORIES */}
                {activeTab === "categories" && (
                  <div className="space-y-6">
                    {/* Add Category Form Card */}
                    <div className="bg-[#111118] border border-[#22222d] rounded-2xl p-6">
                      <h3 className="text-base font-bold text-white mb-1">Create New Category</h3>
                      <p className="text-xs text-gray-400 mb-4">
                        Add a new course category dynamically. Duplicate names (case-insensitive) are automatically prevented.
                      </p>

                      <div className="flex gap-3 max-w-md">
                        <input
                          type="text"
                          placeholder="e.g. Artificial Intelligence"
                          value={newCatName}
                          onChange={(e) => setNewCatName(e.target.value)}
                          className="flex-1 bg-[#1a1a24] border border-[#22222d] text-white rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-[#0071e3] transition-colors"
                        />
                        <button
                          onClick={handleAddCategory}
                          disabled={savingCategory}
                          className="bg-[#0071e3] hover:bg-[#0077ed] text-white text-xs font-bold px-5 py-2 rounded-xl transition-all disabled:opacity-50 flex items-center gap-1.5 whitespace-nowrap"
                        >
                          <Plus className="w-4 h-4" /> Add Category
                        </button>
                      </div>
                    </div>

                    {/* Category List Table */}
                    <div className="bg-[#111118] border border-[#22222d] rounded-2xl p-6">
                      <h3 className="text-base font-bold text-white mb-4">Existing Categories</h3>
                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                          <thead>
                            <tr className="border-b border-[#22222d] text-[10px] uppercase text-gray-500 font-bold tracking-wider">
                              <th className="pb-3">Category Name</th>
                              <th className="pb-3">Slug</th>
                              <th className="pb-3 text-center">Status</th>
                              <th className="pb-3 text-right">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-[#22222d] text-sm">
                            {categoriesList.map((cat) => (
                              <tr key={cat._id} className="hover:bg-white/5 transition-colors">
                                <td className="py-3 font-semibold text-white">
                                  {editingCatId === cat._id ? (
                                    <input
                                      type="text"
                                      value={editingCatName}
                                      onChange={(e) => setEditingCatName(e.target.value)}
                                      className="bg-[#1a1a24] border border-[#0071e3] text-white text-xs rounded px-2 py-1 outline-none"
                                    />
                                  ) : (
                                    cat.name
                                  )}
                                </td>
                                <td className="py-3 text-xs text-gray-400 font-mono">
                                  {cat.slug || cat.name.toLowerCase().replace(/\s+/g, '-')}
                                </td>
                                <td className="py-3 text-center">
                                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full uppercase">
                                    {cat.status || "Active"}
                                  </span>
                                </td>
                                <td className="py-3 text-right">
                                  <div className="flex items-center justify-end gap-2">
                                    {editingCatId === cat._id ? (
                                      <>
                                        <button
                                          onClick={() => handleUpdateCategory(cat._id)}
                                          className="text-xs font-bold text-emerald-400 hover:underline px-2 py-1"
                                        >
                                          Save
                                        </button>
                                        <button
                                          onClick={() => setEditingCatId(null)}
                                          className="text-xs font-bold text-gray-400 hover:underline px-2 py-1"
                                        >
                                          Cancel
                                        </button>
                                      </>
                                    ) : (
                                      <>
                                        <button
                                          onClick={() => {
                                            setEditingCatId(cat._id);
                                            setEditingCatName(cat.name);
                                          }}
                                          className="p-1.5 rounded bg-white/5 hover:bg-blue-500/20 hover:text-[#0071e3] text-gray-400 transition-colors"
                                          title="Edit Category"
                                        >
                                          <Edit className="w-3.5 h-3.5" />
                                        </button>
                                        <button
                                          onClick={() => handleDeleteCategory(cat._id)}
                                          className="p-1.5 rounded bg-white/5 hover:bg-red-500 hover:text-white text-gray-400 transition-colors"
                                          title="Delete Category"
                                        >
                                          <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                      </>
                                    )}
                                  </div>
                                </td>
                              </tr>
                            ))}
                            {categoriesList.length === 0 && (
                              <tr>
                                <td colSpan="4" className="py-12 text-center text-gray-500 text-xs">
                                  No categories available. Add your first category above.
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </main>
        </>
      )}

      {/* COURSE EDITOR / CREATOR MODE */}
      {isEditMode && (
        <div className="flex-1 flex flex-col bg-[#f5f5f7] text-[#1d1d1f]">
          {/* HEADER NAV */}
          <header className="sticky top-0 z-[100] bg-white/90 backdrop-blur-md border-b border-black/5 h-[56px] flex items-center px-8 justify-between shadow-sm">
            <div className="flex items-center gap-3 text-sm text-gray-400">
              <button onClick={() => navigate("/instructor")} className="hover:text-[#0071e3] transition-colors flex items-center gap-1">
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
              <span className="text-gray-300">/</span>
              <span className="text-gray-900 font-medium">
                {isCreateNew ? "Create Course" : `Edit Course: ${courseTitle}`}
              </span>
            </div>
            
            <div className="flex items-center gap-3">
              <span className="text-xs text-gray-500 font-semibold uppercase flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-500"></span> Draft
              </span>
              <button
                onClick={() => handleSaveCourse(false)}
                disabled={savingCourse}
                className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-900 text-xs font-semibold py-2 px-4 rounded-full transition-colors disabled:opacity-50"
              >
                Save Draft
              </button>
              <button
                onClick={() => handleSaveCourse(true)}
                disabled={savingCourse}
                className="bg-[#0071e3] hover:bg-[#0077ed] text-white text-xs font-semibold py-2 px-4 rounded-full transition-colors disabled:opacity-50"
              >
                {savingCourse ? "Saving..." : "Publish Course"}
              </button>
            </div>
          </header>

          {/* PAGE CONTENT CONTAINER */}
          <div className="max-w-[1160px] w-full mx-auto p-8 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 items-start">
            {/* MAIN COLUMN */}
            <div className="space-y-6">
              {/* CARD 1: GENERAL INFO */}
              <div className="bg-white rounded-2xl border border-black/5 p-6 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900">Course Information</h3>
                <p className="text-xs text-gray-400 mt-1 mb-6">Provide the key details that learners will see in the catalog.</p>
                
                <div className="space-y-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-gray-700">Course Title</label>
                    <input
                      type="text"
                      placeholder="e.g. Active Directory Administration"
                      value={courseTitle}
                      onChange={e => setCourseTitle(e.target.value)}
                      className="border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#0071e3] transition-colors"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-gray-700">Short Description</label>
                    <input
                      type="text"
                      placeholder="One-sentence achievements summary"
                      value={shortDesc}
                      onChange={e => setShortDesc(e.target.value)}
                      className="border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#0071e3] transition-colors"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-gray-700">Full Description</label>
                    <textarea
                      placeholder="Explain what the course covers, prerequisites, goals..."
                      rows="4"
                      value={fullDesc}
                      onChange={e => setFullDesc(e.target.value)}
                      className="border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#0071e3] transition-colors resize-y"
                    ></textarea>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-gray-700">Category</label>
                      <select
                        value={category}
                        onChange={e => setCategory(e.target.value)}
                        className="border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#0071e3] transition-colors bg-white cursor-pointer"
                      >
                        {categoriesList.length > 0 ? (
                          categoriesList.map((cat) => (
                            <option key={cat._id || cat.slug} value={cat.name}>
                              {cat.name}
                            </option>
                          ))
                        ) : (
                          <>
                            <option>Microsoft</option>
                            <option>Linux</option>
                            <option>Networking</option>
                            <option>Cloud</option>
                            <option>Security</option>
                          </>
                        )}
                      </select>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-gray-700">Difficulty Level</label>
                      <select
                        value={difficulty}
                        onChange={e => setDifficulty(e.target.value)}
                        className="border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#0071e3] transition-colors bg-white cursor-pointer"
                      >
                        <option>Beginner</option>
                        <option>Intermediate</option>
                        <option>Advanced</option>
                        <option>All Levels</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-gray-700">Language</label>
                      <select
                        value={language}
                        onChange={e => setLanguage(e.target.value)}
                        className="border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#0071e3] transition-colors bg-white cursor-pointer"
                      >
                        <option>English</option>
                        <option>Hindi</option>
                        <option>Gujarati</option>
                      </select>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-gray-700">Welcome Message</label>
                      <input
                        type="text"
                        placeholder="Greeting sent when student enrolls"
                        value={welcomeMessage}
                        onChange={e => setWelcomeMessage(e.target.value)}
                        className="border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#0071e3] transition-colors"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* CARD 2: BANNER CONFIGURATION */}
              <div className="bg-white rounded-2xl border border-black/5 p-6 shadow-sm">
                <div className="flex items-center justify-between flex-wrap gap-2 mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Course Card Banner & Image</h3>
                    <p className="text-xs text-gray-400 mt-1">Choose between color gradient + emoji branding or a custom banner image.</p>
                  </div>
                  
                  {/* Mode Selector Tabs */}
                  <div className="flex bg-gray-100 p-1 rounded-xl gap-1">
                    <button
                      type="button"
                      onClick={() => setBannerMode("gradient")}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        bannerMode === "gradient" ? "bg-white text-[#0071e3] shadow-sm" : "text-gray-500 hover:text-gray-900"
                      }`}
                    >
                      Gradient & Emoji
                    </button>
                    <button
                      type="button"
                      onClick={() => setBannerMode("image")}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        bannerMode === "image" ? "bg-white text-[#0071e3] shadow-sm" : "text-gray-500 hover:text-gray-900"
                      }`}
                    >
                      Custom Image URL
                    </button>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {bannerMode === "gradient" ? (
                    <>
                      {/* Live Card Preview Box */}
                      <div className="h-[140px] rounded-xl flex items-center justify-center text-5xl select-none" style={{ background: bannerGradient }}>
                        {bannerIcon}
                      </div>

                      <div className="grid grid-cols-[120px_1fr] gap-4">
                        <div className="flex flex-col gap-1.5">
                          <label className="text-xs font-bold text-gray-700">Emoji Icon</label>
                          <input
                            type="text"
                            value={bannerIcon}
                            onChange={e => setBannerIcon(e.target.value.trim().slice(0, 2))}
                            className="border border-gray-300 rounded-xl px-4 py-2.5 text-sm text-center focus:outline-none focus:border-[#0071e3] transition-colors"
                          />
                        </div>
                        
                        <div className="flex flex-col gap-1.5">
                          <label className="text-xs font-bold text-gray-700">Background Color swatch</label>
                          <div className="flex gap-2 flex-wrap items-center mt-1">
                            {bannerGradients.map((grad, i) => (
                              <button
                                key={i}
                                type="button"
                                onClick={() => setBannerGradient(grad.value)}
                                style={{ background: grad.value }}
                                className={`w-9 h-9 rounded-xl transition-all ${
                                  bannerGradient === grad.value ? "ring-2 ring-offset-2 ring-[#0071e3] scale-105" : "hover:scale-105"
                                }`}
                                title={grad.name}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      {/* Live Custom Image Preview Box */}
                      <div className="h-[160px] rounded-xl overflow-hidden bg-slate-900 flex items-center justify-center border border-gray-200 relative group">
                        {bannerImageUrl ? (
                          <img
                            src={bannerImageUrl}
                            alt="Course Banner Preview"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80";
                            }}
                          />
                        ) : (
                          <div className="text-center p-4">
                            <ImageIcon className="w-8 h-8 text-gray-400 mx-auto mb-1" />
                            <span className="text-xs text-gray-400 font-medium block">Upload an image or paste a URL below</span>
                          </div>
                        )}
                        {uploadingBannerImage && (
                          <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white text-xs font-bold gap-2">
                            <Loader2 className="w-5 h-5 animate-spin" /> Uploading ({uploadProgress}%)...
                          </div>
                        )}
                      </div>

                      {/* Upload File & URL Controls */}
                      <div className="space-y-3">
                        <div className="flex flex-col gap-1.5">
                          <label className="text-xs font-bold text-gray-700">Upload Image File</label>
                          <label className="border border-dashed border-gray-300 hover:border-[#0071e3] bg-gray-50 hover:bg-blue-50/50 rounded-xl px-4 py-3 text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors text-gray-700 font-medium">
                            <Upload className="w-4 h-4 text-[#0071e3]" />
                            <span>{uploadingBannerImage ? `Uploading image... (${uploadProgress}%)` : "Click to select & upload image file"}</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleBannerImageFileUpload}
                              className="hidden"
                            />
                          </label>
                        </div>

                        <div className="flex items-center gap-2 my-1">
                          <div className="flex-1 h-px bg-gray-200"></div>
                          <span className="text-[10px] uppercase font-bold text-gray-400">OR PASTE URL</span>
                          <div className="flex-1 h-px bg-gray-200"></div>
                        </div>

                        <div className="flex flex-col gap-1.5">
                          <label className="text-xs font-bold text-gray-700">Course Banner Image URL</label>
                          <input
                            type="text"
                            placeholder="Paste image URL (e.g. https://images.unsplash.com/...)"
                            value={bannerImageUrl}
                            onChange={e => setBannerImageUrl(e.target.value)}
                            className="border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#0071e3] transition-colors"
                          />
                          <p className="text-[11px] text-gray-400">Supports direct image links from Unsplash, Cloudinary, Imgur, or any CDN.</p>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* CARD 3: CURRICULUM BUILDER */}
              <div className="bg-white rounded-2xl border border-black/5 p-6 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Curriculum</h3>
                    <p className="text-xs text-gray-400 mt-1">Organize lectures into sections.</p>
                  </div>
                  <button
                    type="button"
                    onClick={addSection}
                    className="border border-[#0071e3] text-[#0071e3] hover:bg-[#0071e3] hover:text-white text-xs font-semibold py-2 px-3 rounded-full flex items-center gap-1 transition-all"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Section
                  </button>
                </div>

                <div className="space-y-4">
                  {sections.map((sec, secIdx) => (
                    <div key={sec.id} className="border border-gray-200 rounded-xl overflow-hidden bg-gray-50/50">
                      <div className="bg-gray-100/70 p-3.5 border-b border-gray-200 flex items-center gap-3">
                        <span className="text-gray-400 text-xs font-semibold">⠿</span>
                        <input
                          type="text"
                          value={sec.title}
                          onChange={e => updateSectionTitle(sec.id, e.target.value)}
                          className="bg-transparent text-sm font-bold text-gray-900 focus:outline-none border-b border-transparent focus:border-[#0071e3] w-full"
                        />
                        <span className="text-[10px] font-bold text-gray-500 bg-white border border-gray-200 px-2 py-0.5 rounded-full shrink-0">
                          {sec.lessons.length} lessons
                        </span>
                      </div>

                      <div className="p-4 space-y-3">
                        {sec.lessons.map((les, lesIdx) => (
                          <div key={les.id} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm space-y-3">
                            <div className="flex items-center gap-3 justify-between">
                              <div className="flex items-center gap-2 flex-1">
                                {les.type === "video" && <span className="p-1.5 rounded bg-blue-50 text-[#0071e3]"><Play className="w-3.5 h-3.5" /></span>}
                                {les.type === "doc" && <span className="p-1.5 rounded bg-gray-100 text-gray-500"><FileText className="w-3.5 h-3.5" /></span>}
                                {les.type === "quiz" && <span className="p-1.5 rounded bg-amber-50 text-amber-500"><HelpCircle className="w-3.5 h-3.5" /></span>}
                                
                                <input
                                  type="text"
                                  placeholder="Lesson title"
                                  value={les.title}
                                  onChange={e => updateLessonField(sec.id, les.id, "title", e.target.value)}
                                  className="text-xs font-semibold text-gray-800 bg-transparent outline-none focus:border-b border-[#0071e3] w-full"
                                />
                              </div>
                              
                              <div className="flex items-center gap-2">
                                <label className="flex items-center gap-1.5 text-[10px] font-bold text-gray-500 cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={les.freePreview}
                                    onChange={e => updateLessonField(sec.id, les.id, "freePreview", e.target.checked)}
                                    className="rounded border-gray-300 text-[#0071e3] focus:ring-[#0071e3] w-3 h-3"
                                  />
                                  Preview
                                </label>
                                <button
                                  type="button"
                                  onClick={() => removeLesson(sec.id, les.id)}
                                  className="text-gray-400 hover:text-red-500 p-1 rounded transition-colors"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                              <div className="flex flex-col gap-1">
                                <label className="text-[10px] font-bold text-gray-500 flex items-center gap-1">
                                  <Play className="w-3 h-3 text-[#0071e3]" /> Video Link URL
                                </label>
                                <input
                                  type="text"
                                  placeholder="https://... video URL"
                                  value={les.videoUrl || ""}
                                  onChange={e => updateLessonField(sec.id, les.id, "videoUrl", e.target.value)}
                                  className="border border-gray-200 rounded-lg px-3 py-1.5 text-xs bg-gray-50 focus:outline-none focus:border-[#0071e3] transition-colors"
                                />
                              </div>

                              <div className="flex flex-col gap-1">
                                <label className="text-[10px] font-bold text-gray-500 flex items-center gap-1">
                                  <FileText className="w-3 h-3 text-emerald-600" /> Downloadable File / Resource URL (PDF, Doc)
                                </label>
                                <input
                                  type="text"
                                  placeholder="https://... PDF or document URL"
                                  value={les.fileUrl || ""}
                                  onChange={e => updateLessonField(sec.id, les.id, "fileUrl", e.target.value)}
                                  className="border border-gray-200 rounded-lg px-3 py-1.5 text-xs bg-gray-50 focus:outline-none focus:border-[#0071e3] transition-colors"
                                />
                              </div>
                            </div>

                            <div className="flex flex-col gap-1 text-xs">
                              <label className="text-[10px] font-bold text-gray-500">Lesson Notes</label>
                              <input
                                type="text"
                                placeholder="Summary or additional study resources info..."
                                value={les.notes}
                                onChange={e => updateLessonField(sec.id, les.id, "notes", e.target.value)}
                                className="border border-gray-200 rounded-lg px-3 py-1.5 text-xs bg-gray-50 focus:outline-none focus:border-[#0071e3] transition-colors"
                              />
                            </div>
                          </div>
                        ))}

                        <div className="flex gap-2 pt-2 border-t border-gray-100">
                          <button
                            type="button"
                            onClick={() => addLesson(sec.id, "video")}
                            className="bg-blue-50/70 hover:bg-blue-100 text-[#0071e3] text-[11px] font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors"
                          >
                            ＋ Video
                          </button>
                          <button
                            type="button"
                            onClick={() => addLesson(sec.id, "quiz")}
                            className="bg-amber-50/70 hover:bg-amber-100 text-amber-600 text-[11px] font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors"
                          >
                            ＋ Quiz
                          </button>
                          <button
                            type="button"
                            onClick={() => addLesson(sec.id, "doc")}
                            className="bg-gray-100 hover:bg-gray-200 text-gray-600 text-[11px] font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors"
                          >
                            ＋ Document
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* CARD 4: PRICING & REQUIREMENTS */}
              <div className="bg-white rounded-2xl border border-black/5 p-6 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900">Pricing & Outcomes</h3>
                <p className="text-xs text-gray-400 mt-1 mb-6">Manage how students buy and learn your course.</p>

                <div className="space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setPricingType("free")}
                      className={`p-4 rounded-xl border text-left flex flex-col gap-1 transition-all ${
                        pricingType === "free" ? "border-[#0071e3] bg-[#0071e3]/5" : "border-gray-200 hover:bg-gray-50"
                      }`}
                    >
                      <span className="text-xs font-bold text-gray-900">📦 Included in Subscription</span>
                      <span className="text-[10px] text-gray-400">Accessible by all Pro members.</span>
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => setPricingType("standalone")}
                      className={`p-4 rounded-xl border text-left flex flex-col gap-1 transition-all ${
                        pricingType === "standalone" ? "border-[#0071e3] bg-[#0071e3]/5" : "border-gray-200 hover:bg-gray-50"
                      }`}
                    >
                      <span className="text-xs font-bold text-gray-900">💳 Standalone Purchase</span>
                      <span className="text-[10px] text-gray-400">Configure single-course payment price.</span>
                    </button>
                  </div>

                  {pricingType === "standalone" && (
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-gray-700">Course Price (INR)</label>
                      <input
                        type="number"
                        placeholder="₹2,999"
                        value={price}
                        onChange={e => setPrice(e.target.value)}
                        className="border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#0071e3] transition-colors"
                      />
                    </div>
                  )}

                  <div className="flex flex-col gap-1.5 pt-4 border-t border-gray-100">
                    <label className="text-xs font-bold text-gray-700">Learning Outcomes (One outcome per line)</label>
                    <textarea
                      placeholder="e.g. Master IP Addressing subnetting calculations&#10;Deploy enterprise DNS and DHCP services"
                      rows="3"
                      value={outcomes}
                      onChange={e => setOutcomes(e.target.value)}
                      className="border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#0071e3] transition-colors resize-y font-mono text-xs"
                    ></textarea>
                  </div>
                </div>
              </div>
            </div>

            {/* SIDEBAR STICKY SECTION */}
            <aside className="sticky top-[76px] space-y-6">
              {/* STATUS CHECKLIST CARD */}
              <div className="bg-white rounded-2xl border border-black/5 p-5 shadow-sm space-y-4">
                <h4 className="text-xs font-bold uppercase text-gray-400 tracking-wider">Publish checklist</h4>
                
                <div className="space-y-3 text-xs">
                  <div className="flex items-center gap-2 text-emerald-600">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center font-bold text-[10px]">✓</span>
                    <span>Title & Info entered</span>
                  </div>
                  <div className="flex items-center gap-2 text-emerald-600">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center font-bold text-[10px]">✓</span>
                    <span>Branding set</span>
                  </div>
                  <div className="flex items-center gap-2 text-emerald-600">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center font-bold text-[10px]">✓</span>
                    <span>Curriculum defined</span>
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-4 flex flex-col gap-2">
                  <button
                    onClick={() => handleSaveCourse(true)}
                    disabled={savingCourse}
                    className="w-full bg-[#0071e3] hover:bg-[#0077ed] text-white text-xs font-bold py-2.5 rounded-xl transition-colors disabled:opacity-50"
                  >
                    Publish Course
                  </button>
                  <button
                    onClick={() => handleSaveCourse(false)}
                    disabled={savingCourse}
                    className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold py-2.5 rounded-xl transition-colors disabled:opacity-50"
                  >
                    Save as Draft
                  </button>
                </div>
              </div>

              {/* CARD PREVIEW DESIGN */}
              <div className="bg-white rounded-2xl border border-black/5 p-5 shadow-sm space-y-4">
                <h4 className="text-xs font-bold uppercase text-gray-400 tracking-wider">Course Card Preview</h4>
                
                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm flex flex-col">
                  <div className="h-[120px] flex items-center justify-center text-4xl select-none" style={{ background: bannerGradient }}>
                    {bannerIcon}
                  </div>
                  <div className="p-4 space-y-2">
                    <span className="text-[10px] font-extrabold uppercase text-[#0071e3] tracking-widest">{category}</span>
                    <h5 className="text-sm font-bold text-gray-900 line-clamp-1">{courseTitle || "Course Title"}</h5>
                    <p className="text-xs text-gray-500 line-clamp-2">{shortDesc || "Course subtitle description..."}</p>
                    <div className="flex justify-between items-center pt-2 text-[10px] font-semibold text-gray-400">
                      <span>{sections.reduce((sum, s) => sum + s.lessons.length, 0)} lessons</span>
                      <span className="bg-[#e8f1fb] text-[#0071e3] px-2 py-0.5 rounded-full">{difficulty}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* DANGER ZONE (only for edit) */}
              {isEditMode && !isCreateNew && (
                <div className="bg-white rounded-2xl border border-red-100 p-5 shadow-sm space-y-3">
                  <h4 className="text-xs font-bold uppercase text-red-500 tracking-wider">Danger Zone</h4>
                  <button
                    onClick={() => handleDeleteCourse(id)}
                    className="w-full border border-red-200 hover:bg-red-50/55 text-red-600 text-xs font-bold py-2 rounded-xl transition-colors"
                  >
                    Delete Course
                  </button>
                </div>
              )}
            </aside>
          </div>
        </div>
      )}
    </div>
  );
}

export default InstructorPage;
