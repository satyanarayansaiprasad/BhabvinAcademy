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
      <section className="relative pt-24 pb-20 lg:pt-32 lg:pb-40 bg-[#f2f2f2] overflow-hidden border-b border-[#e6e6e6]">
        {/* Background Decorative Elements */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full opacity-30">
            <svg width="100%" height="100%" viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <radialGradient id="grad1" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                  <stop offset="0%" style={{ stopColor: '#0067b8', stopOpacity: 0.1 }} />
                  <stop offset="100%" style={{ stopColor: '#f2f2f2', stopOpacity: 0 }} />
                </radialGradient>
              </defs>
              <circle cx="200" cy="200" r="400" fill="url(#grad1)" />
              <circle cx="800" cy="800" r="400" fill="url(#grad1)" />
            </svg>
          </div>
          {/* Subtle Geometric Accents */}
          <motion.div 
            animate={{ 
              y: [0, -20, 0],
              rotate: [0, 5, 0]
            }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/4 right-[10%] w-32 h-32 border-2 border-[#0067b8]/5 rounded-sm" 
          />
          <motion.div 
            animate={{ 
              x: [0, 20, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-1/4 left-[5%] w-48 h-48 bg-[#0067b8]/5 rounded-full blur-3xl" 
          />
        </div>

        <div className="container mx-auto px-4 lg:px-6 relative z-10 max-w-7xl">
          <div className="flex flex-col lg:flex-row items-center gap-16 xl:gap-24">
            {/* Left Content */}
            <motion.div 
              initial="initial"
              animate="animate"
              variants={{
                initial: { opacity: 0 },
                animate: { opacity: 1, transition: { staggerChildren: 0.2 } }
              }}
              className="lg:w-3/5 text-center lg:text-left"
            >
              <motion.div 
                variants={{
                  initial: { opacity: 0, y: 10 },
                  animate: { opacity: 1, y: 0 }
                }}
                className="inline-flex items-center gap-2 bg-[#0067b8]/10 text-[#0067b8] text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-sm mb-8"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#0067b8] animate-pulse" />
                Empowering the future of tech
              </motion.div>
              
              <motion.h1 
                variants={{
                  initial: { opacity: 0, y: 20 },
                  animate: { opacity: 1, y: 0 }
                }}
                className="text-4xl md:text-6xl lg:text-7xl font-semibold tracking-tight text-black leading-[1.1] mb-8"
              >
                Skills for your <br />
                <span className="text-[#0067b8]">professional journey.</span>
              </motion.h1>
              
              <motion.p 
                variants={{
                  initial: { opacity: 0, y: 20 },
                  animate: { opacity: 1, y: 0 }
                }}
                className="text-[#616161] text-lg md:text-xl max-w-2xl mb-12 leading-relaxed mx-auto lg:mx-0"
              >
                Discover professional-grade training and developer documentation. 
                Master new skills at your own pace with expert-led courses designed for real-world impact.
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
                  className="bg-[#0067b8] text-white rounded-sm px-10 h-14 text-base font-semibold hover:bg-[#005a9e] transition-all hover:shadow-lg w-full sm:w-auto active:scale-95"
                >
                  Explore Documentation
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => navigate("/about")}
                  className="bg-white text-black border-[#e6e6e6] rounded-sm px-10 h-14 text-base font-semibold hover:bg-[#f2f2f2] w-full sm:w-auto transition-all active:scale-95"
                >
                  How it works
                </Button>
              </motion.div>
            </motion.div>

            {/* Right Image/Graphic */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="lg:w-2/5 relative"
            >
              <div className="relative z-10 w-full aspect-square max-w-[500px] rounded-sm overflow-hidden bg-white shadow-2xl border border-[#e6e6e6] group">
                <img 
                  src="/hero_learning_illustration.png" 
                  alt="Professional Learning Illustration" 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                />
              </div>
              
              {/* Decorative Floating Cards/Elements */}
              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-6 -left-6 z-20 bg-white p-4 rounded-sm shadow-xl border border-[#e6e6e6] hidden sm:block"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-sm bg-[#0067b8]/10 flex items-center justify-center">
                    <Star className="w-5 h-5 text-[#0067b8]" />
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold text-[#616161] uppercase tracking-wider">Top Rated</p>
                    <p className="text-sm font-semibold text-black">Master Class</p>
                  </div>
                </div>
              </motion.div>

              <motion.div 
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute -bottom-6 -right-6 z-20 bg-white p-4 rounded-sm shadow-xl border border-[#e6e6e6] hidden sm:block"
              >
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-2">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-[#f2f2f2]" />
                    ))}
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold text-[#616161] uppercase tracking-wider">Join Over</p>
                    <p className="text-sm font-semibold text-black">10k+ Learners</p>
                  </div>
                </div>
              </motion.div>

              {/* Offset border frame */}
              <div className="absolute top-6 left-6 w-full h-full border-2 border-[#0067b8]/10 rounded-sm -z-10" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Category Marquee Section */}
      <section className="bg-white border-b border-[#e6e6e6] py-8 lg:py-12 overflow-hidden">
        <div className="container mx-auto px-4 lg:px-6 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-6 bg-[#0067b8] rounded-full" />
            <h2 className="text-sm font-semibold uppercase tracking-widest text-[#616161]">Explore Skill Pillars</h2>
          </div>
        </div>
        
        <div className="relative group">
          {/* Gradients for fading edges */}
          <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
          
          <div className="flex overflow-hidden whitespace-nowrap">
            <motion.div 
              animate={{ x: ["0%", "-50%"] }}
              transition={{ 
                duration: 30, 
                repeat: Infinity, 
                ease: "linear"
              }}
              className="flex gap-4 md:gap-6 py-4 px-4"
            >
              {[...categories, ...categories, ...categories, ...categories].map((category, idx) => (
                <div 
                  key={`${category.id}-${idx}`}
                  onClick={() => handleNavigateToCoursesPage(category.id)}
                  className="inline-flex items-center gap-3 px-6 py-4 bg-white border border-[#e6e6e6] rounded-sm hover:border-[#0067b8] hover:shadow-md cursor-pointer transition-all group/item"
                >
                  <div className="w-8 h-8 rounded-sm bg-[#f2f2f2] group-hover/item:bg-[#0067b8]/10 flex items-center justify-center transition-colors">
                    <Star className="w-4 h-4 text-[#616161] group-hover/item:text-[#0067b8]" />
                  </div>
                  <span className="text-sm font-semibold text-black tracking-tight">{category.label}</span>
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
