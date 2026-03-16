import { topLevelCategories } from "@/config";
import { Button } from "@/components/ui/button";
import { useContext, useEffect } from "react";
import { StudentContext } from "@/context/student-context";
import {
  checkCoursePurchaseInfoService,
  fetchStudentViewCourseListService,
  getHomeConfigService,
} from "@/services";
import { AuthContext } from "@/context/auth-context";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Star } from "lucide-react";

function StudentHomePage() {
  const { studentViewCoursesList, setStudentViewCoursesList } = useContext(StudentContext);
  const { auth } = useContext(AuthContext);
  const [skillPillars, setSkillPillars] = useState([]);
  const [categories, setCategories] = useState([]);
  const [featuredSections, setFeaturedSections] = useState({ trending: [], mostDemanded: [], recent: [] });
  const navigate = useNavigate();
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);

  function handleNavigateToCoursesPage(getCurrentId) {
    const currentFilter = { category: [getCurrentId] };
    sessionStorage.setItem("filters", JSON.stringify(currentFilter));
    navigate(`/courses?category=${encodeURIComponent(getCurrentId)}`);
  }

  async function fetchAllStudentViewCourses() {
    const response = await fetchStudentViewCourseListService("");
    if (response?.success) setStudentViewCoursesList(response?.data);
  }

  async function handleCourseNavigate(getCurrentCourseId) {
    if (!auth?.authenticate) { navigate(`/course/details/${getCurrentCourseId}`); return; }
    const response = await checkCoursePurchaseInfoService(getCurrentCourseId, auth?.user?._id);
    if (response?.success) {
      navigate(response?.data ? `/course-progress/${getCurrentCourseId}` : `/course/details/${getCurrentCourseId}`);
    }
  }

  async function fetchHomeConfig() {
    const response = await getHomeConfigService();
    if (response?.success) {
      setSkillPillars(response?.data?.skillPillars || []);
      setFeaturedSections(response?.data?.featuredCourseSections || { trending: [], mostDemanded: [], recent: [] });
      setCategories(response?.data?.categories || []);
    }
  }

  useEffect(() => { fetchAllStudentViewCourses(); fetchHomeConfig(); }, []);

  const fadeUp = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.8, ease: "easeOut" }
  };

  const CourseCard = ({ course, handleCourseNavigate, index }) => {
    const { studentBoughtCoursesList } = useContext(StudentContext);
    const isOwned = studentBoughtCoursesList.some(item => item.courseId === course._id);
    return (
      <div
        onClick={() => handleCourseNavigate(course._id)}
        className="group cursor-pointer bg-white rounded-sm overflow-hidden border border-[#e6e6e6] hover:border-[#0067b8] transition-all duration-200"
      >
        <div className="aspect-[16/9] overflow-hidden relative border-b border-[#e6e6e6]">
          <img src={course.image} alt={course.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
          <div className="absolute top-2 left-2 flex gap-1.5">
            <span className="px-2 py-0.5 rounded-sm bg-white/90 backdrop-blur-sm text-[10px] font-semibold uppercase tracking-wider text-black border border-[#e6e6e6]">
              {course.category}
            </span>
            {isOwned && (
              <span className="px-2 py-0.5 rounded-sm bg-[#0067b8] text-white text-[10px] font-semibold uppercase tracking-wider border-none">
                Owned
              </span>
            )}
          </div>
        </div>
        <div className="p-4 flex flex-col h-full">
          <h3 className="text-base font-semibold text-black mb-1 line-clamp-2 leading-tight group-hover:text-[#0067b8] transition-colors">{course.title}</h3>
          <p className="text-[#616161] text-xs font-normal mb-auto">By <span className="text-black">{course.instructorName}</span></p>
          <div className="mt-4 flex items-center justify-between">
            <span className="text-lg font-bold text-black">₹{course.pricing}</span>
            <span className={`text-sm font-semibold transition-colors ${isOwned ? "text-emerald-700" : "text-[#0067b8]"}`}>
              {isOwned ? "Continue" : "Details"} →
            </span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative pt-24 pb-20 lg:pt-32 lg:pb-40 bg-white overflow-hidden border-b border-[#e6e6e6]">
        {/* Advanced Mesh Gradient Background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#0067b8]/10 blur-[120px] rounded-full animate-pulse" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#0067b8]/5 blur-[150px] rounded-full" />
          <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-emerald-500/5 blur-[100px] rounded-full" />
          
          {/* Animated Grid Pattern */}
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#0067b8 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        </div>

        <div className="container mx-auto px-4 lg:px-6 relative z-10 max-w-7xl">
          <div className="flex flex-col lg:flex-row items-center gap-16 xl:gap-24">
            {/* Left Content */}
            <motion.div 
              initial="initial"
              animate="animate"
              variants={{
                initial: { opacity: 0 },
                animate: { opacity: 1, transition: { staggerChildren: 0.15 } }
              }}
              className="lg:w-3/5 text-center lg:text-left"
            >
              <motion.div 
                variants={{
                  initial: { opacity: 0, y: 10 },
                  animate: { opacity: 1, y: 0 }
                }}
                className="inline-flex items-center gap-2 bg-[#0067b8]/10 text-[#0067b8] text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-sm mb-8 border border-[#0067b8]/20"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#0067b8] animate-ping" />
                Trusted by 10,000+ developers
              </motion.div>
              
              <motion.h1 
                variants={{
                  initial: { opacity: 0, y: 20 },
                  animate: { opacity: 1, y: 0 }
                }}
                className="text-4xl md:text-6xl lg:text-7xl font-semibold tracking-tight text-black leading-[1.05] mb-8"
              >
                The future of <br />
                <span className="text-[#0067b8] relative">
                  technical learning.
                  <svg className="absolute -bottom-3 left-0 w-full h-3 text-[#0067b8]/20" viewBox="0 0 100 10" preserveAspectRatio="none">
                    <path d="M0 5 Q 25 0, 50 5 T 100 5" fill="none" stroke="currentColor" strokeWidth="4" />
                  </svg>
                </span>
              </motion.h1>
              
              <motion.p 
                variants={{
                  initial: { opacity: 0, y: 20 },
                  animate: { opacity: 1, y: 0 }
                }}
                className="text-[#616161] text-lg md:text-xl max-w-2xl mb-12 leading-relaxed mx-auto lg:mx-0"
              >
                Access high-fidelity training modules and professional-grade developer documentation. 
                Built by experts, designed for the modern developer ecosystem.
              </motion.p>
              
              <motion.div 
                variants={{
                  initial: { opacity: 0, y: 20 },
                  animate: { opacity: 1, y: 0 }
                }}
                className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4"
              >
                <Button 
                  onClick={() => navigate("/courses")} 
                  className="bg-[#0067b8] text-white rounded-sm px-10 h-14 text-base font-semibold hover:bg-[#005a9e] transition-all hover:scale-[1.02] shadow-xl shadow-[#0067b8]/20 w-full sm:w-auto active:scale-95"
                >
                  Start Learning Free
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => navigate("/about")}
                  className="bg-white text-black border-[#e6e6e6] rounded-sm px-10 h-14 text-base font-semibold hover:bg-[#f2f2f2] w-full sm:w-auto transition-all active:scale-95"
                >
                  Explore Catalog
                </Button>
              </motion.div>
            </motion.div>

            {/* Right Image/Graphic */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="lg:w-2/5 relative"
            >
              <div className="relative z-10 w-full aspect-square max-w-[520px] rounded-sm overflow-hidden bg-white shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] border border-[#e6e6e6] group">
                <img 
                  src="/hero_learning_illustration.png" 
                  alt="Premium Tech Illustration" 
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
                />
                
                {/* Glass Overlay on Image */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
              
              {/* Dynamic Information Cards */}
              <motion.div 
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-10 -right-6 z-20 bg-white/90 backdrop-blur-md p-5 rounded-sm shadow-2xl border border-white/50 hidden md:block"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-sm bg-[#0067b8] flex items-center justify-center shadow-lg">
                    <Star className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-[#616161] uppercase tracking-[0.2em] mb-0.5">Premier Content</p>
                    <p className="text-base font-semibold text-black tracking-tight">Verified Excellence</p>
                  </div>
                </div>
              </motion.div>

              <motion.div 
                animate={{ y: [0, 15, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                className="absolute -bottom-10 -left-6 z-20 bg-white/90 backdrop-blur-md p-5 rounded-sm shadow-2xl border border-white/50 hidden md:block"
              >
                <div className="flex items-center gap-4">
                  <div className="flex -space-x-3">
                    {[
                      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80",
                      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80",
                      "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=100&q=80"
                    ].map((src, i) => (
                      <div key={i} className="w-10 h-10 rounded-full border-2 border-white overflow-hidden shadow-sm">
                        <img src={src} alt="Learner" className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-[#616161] uppercase tracking-[0.2em] mb-0.5">Global Reach</p>
                    <p className="text-base font-semibold text-black tracking-tight">10k+ Active Learners</p>
                  </div>
                </div>
              </motion.div>

              {/* Floating Decorative Shapes */}
              <div className="absolute top-1/2 left-[-15%] w-24 h-24 border border-[#0067b8]/10 rounded-sm -z-10 rotate-12" />
              <div className="absolute bottom-[20%] right-[-10%] w-32 h-32 bg-[#0067b8]/5 rounded-sm -z-10 -rotate-6" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Category Marquee Section */}
      <section className="bg-white border-b border-[#e6e6e6] py-12 lg:py-16 overflow-hidden">
        <div className="container mx-auto px-4 lg:px-6 mb-8 text-center lg:text-left">
          <div className="flex items-center justify-center lg:justify-start gap-4">
            <div className="w-2 h-8 bg-[#0067b8] rounded-full hidden lg:block" />
            <h2 className="text-base font-semibold uppercase tracking-[0.3em] text-[#616161]">Professional Skill Pillars</h2>
          </div>
        </div>
        
        <div className="relative">
          {/* Fading Edges */}
          <div className="absolute inset-y-0 left-0 w-40 bg-gradient-to-r from-white via-white/80 to-transparent z-10 pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-40 bg-gradient-to-l from-white via-white/80 to-transparent z-10 pointer-events-none" />
          
          <div className="flex overflow-hidden">
            <motion.div 
              animate={{ x: ["0%", "-50%"] }}
              transition={{ 
                duration: 40, 
                repeat: Infinity, 
                ease: "linear"
              }}
              className="flex gap-6 py-6"
            >
              {[...(categories?.length > 0 ? categories : topLevelCategories), ...(categories?.length > 0 ? categories : topLevelCategories), ...(categories?.length > 0 ? categories : topLevelCategories)].map((category, idx) => (
                <div 
                  key={`${category.id}-${idx}`}
                  onClick={() => handleNavigateToCoursesPage(category.id)}
                  className="flex-shrink-0 flex items-center gap-4 px-8 py-5 bg-white border border-[#e6e6e6] rounded-sm hover:border-[#0067b8] hover:shadow-[0_20px_40px_-12px_rgba(0,103,184,0.12)] cursor-pointer transition-all duration-300 group/item active:scale-95"
                >
                  <div className="w-10 h-10 rounded-sm bg-[#f2f2f2] group-hover/item:bg-[#0067b8] flex items-center justify-center transition-all duration-300">
                    <Star className="w-5 h-5 text-[#616161] group-hover/item:text-white" />
                  </div>
                  <span className="text-base font-semibold text-black tracking-tight">{category.label}</span>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Course Sections */}
      <section className="py-20 md:py-32 space-y-32 bg-white">
        {[
          { key: "trending", label: "Most popular", color: "text-[#0067b8]", title: "Popular paths.", btn: "View everything", btnColor: "text-[#0067b8] hover:bg-[#f2f2f2]" },
          { key: "recent", label: "Recently added", color: "text-[#616161]", title: "New releases.", btn: null, btnColor: "" },
        ].map(({ key, label, color, title, btn, btnColor }) => (
          <div key={key} className="container mx-auto px-4 lg:px-6 max-w-7xl">
            <div className="flex items-end justify-between mb-10 border-b border-[#e6e6e6] pb-6">
              <div>
                <span className={`${color} font-semibold text-xs uppercase tracking-wider block mb-2`}>{label}</span>
                <h2 className="text-2xl md:text-4xl font-semibold tracking-tight text-black">{title}</h2>
              </div>
              {btn && (
                <Button onClick={() => navigate("/courses")} variant="ghost" className={`font-semibold rounded-sm h-12 px-6 text-sm ${btnColor} transition-none`}>
                  {btn} →
                </Button>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {featuredSections?.[key]?.length > 0 ? (
                featuredSections[key].map((course, index) => (
                  <CourseCard key={course._id} course={course} handleCourseNavigate={handleCourseNavigate} index={index} />
                ))
              ) : (
                <p className="text-[#616161] font-normal col-span-full py-16 text-center bg-[#f2f2f2] rounded-sm border border-dashed border-[#e6e6e6]">
                  No courses matching your criteria were found.
                </p>
              )}
            </div>
          </div>
        ))}
      </section>

      {/* CTA Section */}
      <section className="py-24 md:py-40 bg-[#f2f2f2] border-t border-[#e6e6e6]">
        <div className="container mx-auto px-4 lg:px-6 max-w-5xl">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl md:text-5xl font-semibold tracking-tight text-black mb-8 leading-tight">
                Unlock your potential. <br /> Start learning for free today.
              </h2>
              <p className="text-[#616161] text-lg md:text-xl mb-12 max-w-2xl mx-auto leading-relaxed">
                Whether you're just starting out or looking to advance your career, 
                Bhavin Academy has the resources you need to succeed.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button
                  onClick={() => navigate("/auth")}
                  className="bg-[#0067b8] text-white hover:bg-[#005a9e] rounded-sm h-14 px-12 text-base font-semibold transition-all hover:shadow-lg w-full sm:w-auto active:scale-95"
                >
                  Join Now
                </Button>
                <Button
                  onClick={() => navigate("/courses")}
                  variant="outline"
                  className="bg-white text-black border-[#e6e6e6] rounded-sm h-14 px-12 text-base font-semibold hover:bg-[#f2f2f2] w-full sm:w-auto transition-all active:scale-95"
                >
                  Browse Catalog
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default StudentHomePage;
