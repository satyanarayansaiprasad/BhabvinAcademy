import InstructorCourses from "@/components/instructor-view/courses";
import InstructorDashboard from "@/components/instructor-view/dashboard";
import InstructorHomeConfig from "@/components/instructor-view/home-config";
import InstructorUsers from "@/components/instructor-view/users";
import InstructorStudentsData from "@/components/instructor-view/students";
import { Button } from "@/components/ui/button";
import { AuthContext } from "@/context/auth-context";
import { InstructorContext } from "@/context/instructor-context";
import { fetchInstructorCourseListService } from "@/services";
import { 
  LayoutDashboard, 
  Book, 
  Settings as SettingsIcon, 
  Users, 
  User, 
  LogOut, 
  ChevronRight,
  TrendingUp,
  LineChart,
  Grid,
  FileText
} from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

function InstructorDashboardpage() {
  const navigate = useNavigate();
  const { auth, resetCredentials } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState(auth?.user?.role === "sub-admin" ? "courses" : "dashboard");
  const { instructorCoursesList, setInstructorCoursesList } = useContext(InstructorContext);

  async function fetchAllCourses() {
    const response = await fetchInstructorCourseListService();
    if (response?.success) setInstructorCoursesList(response?.data);
  }

  useEffect(() => {
    fetchAllCourses();
  }, []);

  const allMenuItems = [
    {
      group: "Overview",
      items: [
        {
          icon: LayoutDashboard,
          label: "Dashboard",
          value: "dashboard",
          component: <InstructorDashboard listOfCourses={instructorCoursesList} />,
        },
        {
          icon: LineChart,
          label: "Analytics",
          value: "analytics",
          component: <div className="text-zinc-500 italic p-10">Analytics module coming soon...</div>,
        }
      ]
    },
    {
      group: "Management",
      items: [
        {
          icon: Users,
          label: "Students",
          value: "students",
          count: "12.4k",
          component: <InstructorStudentsData />,
        },
        {
          icon: Book,
          label: "Courses",
          value: "courses",
          count: instructorCoursesList?.length || 0,
          component: <InstructorCourses listOfCourses={instructorCoursesList} fetchAllCourses={fetchAllCourses} />,
        },
        {
          icon: Grid,
          label: "Learning Paths",
          value: "paths",
          component: <div className="text-zinc-500 italic p-10">Paths module coming soon...</div>,
        }
      ]
    },
    {
      group: "System",
      items: [
        {
          icon: SettingsIcon,
          label: "Home Config",
          value: "home-config",
          component: <InstructorHomeConfig />,
        },
        {
          icon: User,
          label: "Users",
          value: "users",
          component: <InstructorUsers />,
        }
      ]
    }
  ];

  const menuItems = auth?.user?.role === "sub-admin"
    ? allMenuItems.map(group => ({
        ...group,
        items: group.items.filter(item => item.value === "courses" || item.value === "home-config")
      })).filter(group => group.items.length > 0)
    : allMenuItems;

  function handleLogout() {
    resetCredentials();
    sessionStorage.clear();
    navigate("/auth");
  }

  const activeLabel = allMenuItems.flatMap(g => g.items).find(i => i.value === activeTab)?.label || activeTab;

  return (
    <div className="flex min-h-screen bg-[#0a0a0f] text-[#f5f5f7] font-['Inter'] selection:bg-[#0071e3]/30">
      
      {/* SIDEBAR */}
      <aside className="fixed left-0 top-0 h-screen w-[240px] bg-[#111118] border-r border-white/[0.06] hidden md:flex flex-col z-50">
        <div className="p-7 mb-4">
          <div className="flex items-center gap-2 group cursor-pointer" onClick={() => navigate("/")}>
            <span className="font-bold text-[19px] tracking-tight text-[#f5f5f7]">Bhavin<span className="text-[#0071e3]">Academy</span></span>
            <span className="text-[9px] font-black uppercase tracking-[0.1em] text-white/40 bg-white/[0.05] px-1.5 py-0.5 rounded ml-1 border border-white/[0.05]">Admin</span>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-8 overflow-y-auto no-scrollbar pb-10">
          {menuItems.map((group, gIdx) => (
            <div key={gIdx} className="space-y-1">
              <h3 className="px-4 text-[10px] font-bold text-[#444] uppercase tracking-[0.15em] mb-3">{group.group}</h3>
              {group.items.map((item) => (
                <button
                  key={item.value}
                  onClick={() => setActiveTab(item.value)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all group ${activeTab === item.value
                    ? "bg-[#0071e3]/15 text-[#0071e3]"
                    : "text-[#86868b] hover:text-[#f5f5f7] hover:bg-white/[0.05]"
                    }`}
                >
                  <item.icon className={`w-[18px] h-[18px] ${activeTab === item.value ? "text-[#0071e3]" : "text-[#86868b] group-hover:text-[#f5f5f7]"}`} strokeWidth={activeTab === item.value ? 2.5 : 2} />
                  <span className="text-[13px] font-medium tracking-tight">{item.label}</span>
                  {item.count && (
                    <span className={`ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full ${activeTab === item.value ? "bg-[#0071e3]/20 text-[#0071e3]" : "bg-white/[0.08] text-[#86868b]"}`}>{item.count}</span>
                  )}
                </button>
              ))}
            </div>
          ))}
        </nav>

        <div className="p-6 border-t border-white/[0.06]">
          <div className="flex items-center gap-3 mb-6 p-2 rounded-xl bg-white/[0.03]">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#0071e3] to-[#00d4ff] flex items-center justify-center font-black text-[12px] text-white shadow-lg shadow-[#0071e3]/20">
              {auth?.user?.userName?.substring(0, 2).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[12px] font-bold truncate leading-none">{auth?.user?.userName}</p>
              <p className="text-[10px] text-[#555] mt-1 font-medium">{auth?.user?.role === "instructor" ? "Super Admin" : "Staff"}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full h-10 flex items-center gap-3 px-4 rounded-xl text-[#86868b] hover:text-[#ff453a] hover:bg-[#ff453a]/10 transition-all font-bold text-[13px] group"
          >
            <LogOut className="w-4 h-4 text-[#86868b] group-hover:text-[#ff453a]" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 md:ml-[240px] min-h-screen relative flex flex-col">
        
        {/* TOP BAR */}
        <header className="h-[72px] flex items-center justify-between px-8 lg:px-12 sticky top-0 bg-[#0a0a0f]/80 backdrop-blur-xl z-40 border-b border-white/[0.04]">
          <div>
            <span className="text-[#0071e3] font-bold uppercase tracking-[0.1em] text-[10px] mb-1 block">Admin Panel</span>
            <h1 className="text-[20px] font-black tracking-tight text-[#f5f5f7] lowercase">
              {activeLabel}.
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <select className="bg-white/[0.06] border border-white/[0.1] text-[#f5f5f7] text-[13px] font-medium px-4 py-2 rounded-xl outline-none focus:border-[#0071e3] transition-all cursor-pointer appearance-none pr-10 bg-[url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2212%22 height=%2212%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%2386868b%22 stroke-width=%222%22%3E%3Cpath d=%22M6 9l6 6 6-6%22/%3E%3C/svg%3E')] bg-no-repeat bg-[center_right_12px]">
              <option>Last 30 days</option>
              <option>Last 90 days</option>
              <option>This year</option>
              <option>All time</option>
            </select>
            <button className="h-10 px-5 bg-[#0071e3] hover:bg-[#0077ed] text-white text-[13px] font-bold rounded-xl transition-all shadow-lg shadow-[#0071e3]/20">Export</button>
          </div>
        </header>

        {/* VIEW SCROLLER */}
        <div className="flex-1 p-8 lg:p-12 overflow-y-auto no-scrollbar">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              {menuItems.flatMap(g => g.items).find((item) => item.value === activeTab)?.component}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

export default InstructorDashboardpage;
