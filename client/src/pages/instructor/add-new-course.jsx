import CourseCurriculum from "@/components/instructor-view/courses/add-new-course/course-curriculum";
import CourseLanding from "@/components/instructor-view/courses/add-new-course/course-landing";
import CourseSettings from "@/components/instructor-view/courses/add-new-course/course-settings";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  courseCurriculumInitialFormData,
  courseLandingInitialFormData,
} from "@/config";
import { AuthContext } from "@/context/auth-context";
import { InstructorContext } from "@/context/instructor-context";
import {
  addNewCourseService,
  fetchInstructorCourseDetailsService,
  updateCourseByIdService,
} from "@/services";
import { useContext, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Save, Sparkles, Layout, Database, Settings } from "lucide-react";

function AddNewCoursePage() {
  const {
    courseLandingFormData,
    courseCurriculumFormData,
    setCourseLandingFormData,
    setCourseCurriculumFormData,
    currentEditedCourseId,
    setCurrentEditedCourseId,
  } = useContext(InstructorContext);

  const { auth } = useContext(AuthContext);
  const navigate = useNavigate();
  const params = useParams();

  const [activeTab, setActiveTab] = useState("curriculum");

  function isEmpty(value) {
    if (Array.isArray(value)) {
      return value.length === 0;
    }
    return value === "" || value === null || value === undefined;
  }

  function validateFormData() {
    for (const key in courseLandingFormData) {
      if (isEmpty(courseLandingFormData[key])) {
        return false;
      }
    }

    for (const item of courseCurriculumFormData) {
      if (isEmpty(item.title) || isEmpty(item.videoUrl)) {
        return false;
      }
    }

    return true;
  }

  async function handleCreateCourse() {
    const courseFinalFormData = {
      instructorId: auth?.user?._id,
      instructorName: auth?.user?.userName,
      date: new Date(),
      ...courseLandingFormData,
      curriculum: courseCurriculumFormData,
      isPublished: true,
    };

    const response =
      currentEditedCourseId !== null
        ? await updateCourseByIdService(
          currentEditedCourseId,
          courseFinalFormData
        )
        : await addNewCourseService({
          ...courseFinalFormData,
          students: [],
        });

    if (response?.success) {
      setCourseLandingFormData(courseLandingInitialFormData);
      setCourseCurriculumFormData(courseCurriculumInitialFormData);
      navigate(-1);
      setCurrentEditedCourseId(null);
    } else {
      // Add error handling feedback
      console.error("Failed to save course:", response?.message);
    }
  }

  async function fetchCurrentCourseDetails() {
    const response = await fetchInstructorCourseDetailsService(
      currentEditedCourseId
    );

    if (response?.success) {
      const setCourseFormData = Object.keys(
        courseLandingInitialFormData
      ).reduce((acc, key) => {
        acc[key] = response?.data[key] || courseLandingInitialFormData[key];
        return acc;
      }, {});

      setCourseLandingFormData(setCourseFormData);
      setCourseCurriculumFormData(response?.data?.curriculum);
    }
  }

  useEffect(() => {
    if (currentEditedCourseId !== null) fetchCurrentCourseDetails();
  }, [currentEditedCourseId]);

  useEffect(() => {
    if (params?.courseId) setCurrentEditedCourseId(params?.courseId);
  }, [params?.courseId]);

  useEffect(() => {
    return () => {
      setCurrentEditedCourseId(null);
      setCourseLandingFormData(courseLandingInitialFormData);
      setCourseCurriculumFormData(courseCurriculumInitialFormData);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#FBFBFC] text-zinc-900 font-sans pb-24">
      {/* Dynamic Header */}
      <header className="sticky top-0 bg-white/80 backdrop-blur-xl border-b border-zinc-200/60 z-30">
        <div className="max-w-[1400px] mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full hover:bg-zinc-100"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-xl font-black tracking-tighter text-zinc-900 leading-none mb-1">
                {currentEditedCourseId ? "Edit Course" : "Create New Course"}
              </h1>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                  Workspace Active
                </span>
              </div>
            </div>
          </div>

          <Button
            disabled={!validateFormData()}
            onClick={handleCreateCourse}
            className="bg-zinc-900 hover:bg-black text-white rounded-2xl h-12 px-8 font-bold shadow-xl shadow-zinc-200 transition-all hover:scale-105 active:scale-95 disabled:opacity-30 disabled:hover:scale-100 flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            <span>{currentEditedCourseId ? "Save Changes" : "Launch Course"}</span>
          </Button>
        </div>
      </header>

      <main className="max-w-[1200px] mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">

          {/* Sidebar Navigation */}
          <aside className="lg:col-span-1">
            <div className="sticky top-32 space-y-6">
              <div className="bg-white rounded-[32px] border border-zinc-200/60 p-6 shadow-sm">
                <div className="flex flex-col gap-1 mb-8">
                  <span className="text-blue-600 font-black text-[10px] uppercase tracking-widest">Instructor Tools</span>
                  <h2 className="text-2xl font-black tracking-tighter">Workflow.</h2>
                </div>

                <div className="space-y-2">
                  {[
                    { id: 'curriculum', label: 'Curriculum', icon: Database },
                    { id: 'course-landing-page', label: 'Landing Page', icon: Layout },
                    { id: 'settings', label: 'Settings', icon: Settings }
                  ].map((item) => (
                    <div
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`flex items-center gap-3 p-3 rounded-xl transition-colors cursor-pointer group ${activeTab === item.id ? 'bg-zinc-900 text-white' : 'hover:bg-zinc-50'}`}
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${activeTab === item.id ? 'bg-white/20' : 'bg-zinc-100 group-hover:bg-zinc-900 group-hover:text-white'}`}>
                        <item.icon className="h-4 w-4" />
                      </div>
                      <span className="font-bold text-sm tracking-tight transition-colors">{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-blue-600 rounded-[32px] p-8 text-white relative overflow-hidden group">
                <div className="relative z-10">
                  <Sparkles className="h-8 w-8 mb-4 opacity-50 group-hover:opacity-100 transition-opacity" />
                  <h3 className="text-xl font-black tracking-tighter mb-2">Need help?</h3>
                  <p className="text-blue-100 text-sm font-medium leading-relaxed opacity-80">
                    Check our best practices for course creation to maximize student engagement.
                  </p>
                </div>
                <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
              </div>
            </div>
          </aside>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="bg-zinc-100/50 p-1.5 rounded-2xl h-14 mb-10 inline-flex">
                <TabsTrigger value="curriculum" className="rounded-xl px-8 font-bold transition-all data-[state=active]:bg-white data-[state=active]:shadow-sm">Curriculum</TabsTrigger>
                <TabsTrigger value="course-landing-page" className="rounded-xl px-8 font-bold transition-all data-[state=active]:bg-white data-[state=active]:shadow-sm">Course Page</TabsTrigger>
                <TabsTrigger value="settings" className="rounded-xl px-8 font-bold transition-all data-[state=active]:bg-white data-[state=active]:shadow-sm">Settings</TabsTrigger>
              </TabsList>

              <AnimatePresence mode="wait">
                <TabsContent value="curriculum" className="focus-visible:outline-none">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    <CourseCurriculum />
                  </motion.div>
                </TabsContent>
                <TabsContent value="course-landing-page" className="focus-visible:outline-none">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    <CourseLanding />
                  </motion.div>
                </TabsContent>
                <TabsContent value="settings" className="focus-visible:outline-none">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    <CourseSettings />
                  </motion.div>
                </TabsContent>
              </AnimatePresence>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  );
}

export default AddNewCoursePage;
