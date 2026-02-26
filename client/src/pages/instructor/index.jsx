import InstructorCourses from "@/components/instructor-view/courses";
import InstructorDashboard from "@/components/instructor-view/dashboard";
import InstructorHomeConfig from "@/components/instructor-view/home-config";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { AuthContext } from "@/context/auth-context";
import { InstructorContext } from "@/context/instructor-context";
import { fetchInstructorCourseListService } from "@/services";
import { BarChart, Book, LogOut, LayoutDashboard, GraduationCap, Settings as SettingsIcon, User } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

function InstructorDashboardpage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dashboard");
  const { auth, resetCredentials } = useContext(AuthContext);
  const { instructorCoursesList, setInstructorCoursesList } =
    useContext(InstructorContext);

  async function fetchAllCourses() {
    const response = await fetchInstructorCourseListService();
    if (response?.success) setInstructorCoursesList(response?.data);
  }

  useEffect(() => {
    fetchAllCourses();
  }, []);

  const menuItems = [
    {
      icon: LayoutDashboard,
      label: "Overview",
      value: "dashboard",
      component: <InstructorDashboard listOfCourses={instructorCoursesList} />,
    },
    {
      icon: Book,
      label: "Courses",
      value: "courses",
      component: <InstructorCourses listOfCourses={instructorCoursesList} fetchAllCourses={fetchAllCourses} />,
    },
    {
      icon: SettingsIcon,
      label: "Home Config",
      value: "home-config",
      component: <InstructorHomeConfig />,
    },
    {
      icon: User,
      label: "My Profile",
      value: "profile",
      action: () => navigate("/profile"),
    },
  ];

  function handleLogout() {
    resetCredentials();
    sessionStorage.clear();
  }

  return (
    <div className="flex min-h-screen bg-[#FBFBFC] text-zinc-900 font-sans">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-zinc-200 hidden md:flex flex-col z-30">
        <div className="p-8">
          <div className="flex items-center gap-3 mb-10 px-2 text-zinc-900">
            <div className="bg-zinc-900 p-1.5 rounded-lg">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <span className="font-extrabold text-xl tracking-tight">Bhavin Academy</span>
          </div>

          <nav className="space-y-1">
            {menuItems.map((menuItem) => (
              <motion.button
                key={menuItem.value}
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  if (menuItem.action) menuItem.action();
                  else setActiveTab(menuItem.value);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${activeTab === menuItem.value
                  ? "bg-zinc-900 text-white shadow-lg shadow-zinc-200"
                  : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100"
                  }`}
              >
                <menuItem.icon className={`h-5 w-5 ${activeTab === menuItem.value ? "text-white" : "text-zinc-400"}`} />
                <span className="font-bold text-[15px]">{menuItem.label}</span>
              </motion.button>
            ))}
          </nav>
        </div>

        <div className="mt-auto p-8 border-t border-zinc-100">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-zinc-500 hover:text-red-600 hover:bg-red-50 transition-all duration-200 group"
          >
            <LogOut className="h-5 w-5 text-zinc-400 group-hover:text-red-500" />
            <span className="font-bold text-[15px]">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 min-h-screen relative">
        <div className="max-w-6xl mx-auto p-8 lg:p-12">
          <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="text-zinc-400 font-bold uppercase tracking-widest text-[10px] mb-2 block">Instructor Portal</span>
              <h1 className="text-[50px] font-extrabold tracking-tighter text-zinc-900 lowercase">
                {activeTab}.
              </h1>
            </motion.div>

            <div className="flex items-center gap-4">
              <div
                onClick={() => navigate("/profile")}
                className="h-12 w-12 rounded-2xl bg-zinc-100 border-2 border-white shadow-xl overflow-hidden cursor-pointer hover:scale-105 active:scale-95 transition-all group"
              >
                {auth?.user?.profileImage ? (
                  <img src={auth.user.profileImage} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-zinc-400">
                    <User className="w-6 h-6" />
                  </div>
                )}
              </div>
            </div>
          </header>

          <div className="relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              >
                {menuItems.find((item) => item.value === activeTab)?.component}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  );
}

export default InstructorDashboardpage;
