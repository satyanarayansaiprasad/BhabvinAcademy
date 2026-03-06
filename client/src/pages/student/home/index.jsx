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
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.1, duration: 0.6 }}
        whileHover={{ y: -10 }}
        onClick={() => handleCourseNavigate(course._id)}
        className="group cursor-pointer bg-white rounded-[24px] xs:rounded-[32px] overflow-hidden border border-zinc-200/60 shadow-sm hover:shadow-2xl transition-all duration-500"
      >
        <div className="aspect-[16/10] overflow-hidden relative">
          <img src={course.image} alt={course.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
          <div className="absolute top-3 left-3 flex gap-2">
            <span className="px-2 xs:px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-[9px] xs:text-[10px] font-black uppercase tracking-widest text-zinc-900 border border-zinc-200">
              {course.category}
            </span>
            {isOwned && (
              <span className="px-2 xs:px-3 py-1 rounded-full bg-emerald-500 text-white text-[9px] xs:text-[10px] font-black uppercase tracking-widest border-none">
                Owned
              </span>
            )}
          </div>
        </div>
        <div className="p-4 xs:p-6 md:p-8">
          <h3 className="text-base xs:text-lg font-bold text-zinc-900 mb-1.5 xs:mb-2 line-clamp-2">{course.title}</h3>
          <p className="text-zinc-500 text-xs xs:text-sm font-medium mb-4 xs:mb-6">By <span className="text-zinc-900">{course.instructorName}</span></p>
          <div className="flex items-center justify-between">
            <span className="text-lg xs:text-xl font-black text-zinc-900">₹{course.pricing}</span>
            <span className={`text-xs xs:text-sm font-bold group-hover:translate-x-1 transition-transform ${isOwned ? "text-emerald-600" : "text-blue-600"}`}>
              {isOwned ? "Continue →" : "Buy Now →"}
            </span>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative pt-24 pb-16 lg:pt-32 lg:pb-[120px] bg-black overflow-hidden flex flex-col items-center justify-center min-h-[85vh]">
        <div className="absolute top-0 right-0 w-[300px] xs:w-[400px] md:w-[600px] h-[300px] xs:h-[400px] md:h-[600px] bg-blue-600/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[300px] xs:w-[400px] md:w-[600px] h-[300px] xs:h-[400px] md:h-[600px] bg-purple-600/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2 pointer-events-none" />

        <div className="container mx-auto px-4 xs:px-5 lg:px-8 relative z-10 w-full max-w-[1200px]">

          {/* Top Title Centered */}
          <motion.div
            style={{ opacity, scale }}
            className="text-center w-full mx-auto mb-10 xs:mb-12"
          >
            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
              className="text-3xl xs:text-4xl sm:text-5xl md:text-[60px] lg:text-[72px] font-black tracking-tighter text-white leading-none"
            >
              Expand Your <br className="hidden sm:block" />
              <span className="bg-gradient-to-r from-blue-400 via-emerald-400 to-indigo-400 bg-clip-text text-transparent italic pl-0 sm:pl-2">
                Boundaries, Embrace Growth.
              </span>
            </motion.h1>
          </motion.div>

          {/* Middle Layout */}
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-8 w-full mt-8 lg:mt-16">

            {/* Left Col */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="lg:w-1/3 flex flex-col items-center lg:items-start text-center lg:text-left order-2 lg:order-1"
            >
              <div className="bg-white/5 border border-white/10 text-emerald-400 text-[10px] xs:text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-4 xs:mb-5 flex items-center gap-2 shadow-lg w-max backdrop-blur-md">
                <Star className="h-3.5 w-3.5 fill-current" />
                Premium Quality
              </div>
              <p className="text-zinc-400 font-medium text-sm xs:text-base leading-relaxed max-w-xs xl:max-w-sm">
                Experience the most immersive learning platform ever built.
                Industry-leading courses, beautifully rendered on every screen.
              </p>
            </motion.div>

            {/* Center Col: Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
              className="lg:w-1/3 relative flex justify-center items-center order-1 lg:order-2"
            >
              <div className="relative w-[260px] h-[260px] xs:w-[320px] xs:h-[320px] md:w-[380px] md:h-[380px] rounded-full overflow-hidden border-[10px] xs:border-[16px] border-black shadow-[0_0_80px_rgba(0,0,0,0.8)] bg-black group z-10">
                <img src="/hero_portrait_dark.png" alt="Happy Student" className="w-full h-full object-cover opacity-90 transition-transform duration-1000 group-hover:scale-105" />
              </div>

              {/* Overlapping Buttons Bottom Center */}
              <div className="absolute -bottom-6 xs:-bottom-8 z-20 flex bg-black p-2 xs:p-2.5 rounded-[32px] border border-white/10 shadow-2xl w-max whitespace-nowrap">
                <Button onClick={() => navigate("/courses")} className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-full px-5 xs:px-8 h-10 xs:h-12 md:h-14 font-black text-sm xs:text-base transition-all hover:scale-105 active:scale-95 shadow-lg shadow-emerald-500/20">
                  Get Started
                </Button>
                <Button variant="ghost" className="text-white hover:text-emerald-400 hover:bg-white/5 rounded-full px-5 xs:px-8 h-10 xs:h-12 md:h-14 font-black text-sm xs:text-base transition-all ml-1 border border-transparent hover:border-white/10">
                  Watch Demo
                </Button>
              </div>
            </motion.div>

            {/* Right Col */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7, duration: 0.8 }}
              className="lg:w-1/3 flex flex-col items-center lg:items-end text-center lg:text-right order-3 lg:order-3 pt-4 lg:pt-0"
            >
              <div className="flex gap-1 text-emerald-400 mb-2 xs:mb-3">
                {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-5 h-5 xs:w-6 xs:h-6 fill-current" />)}
              </div>
              <p className="text-white font-black text-3xl xs:text-4xl lg:text-5xl tracking-tight mb-1">20k+</p>
              <p className="text-zinc-500 font-bold uppercase tracking-widest text-[10px] xs:text-xs">Active Students</p>
            </motion.div>
          </div>

        </div>

        {/* Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-6 xs:bottom-10 left-1/2 -translate-x-1/2 text-white/20 hidden md:block"
        >
          <div className="w-6 h-10 rounded-full border-2 border-current flex justify-center p-1">
            <div className="w-1 h-2 bg-current rounded-full" />
          </div>
        </motion.div>
      </section>

      {/* Mastery Pillars - Marquee */}
      <section className="py-8 xs:py-12 bg-white border-y border-zinc-200 overflow-hidden">
        <div className="max-w-[1400px] mx-auto">
          <p className="text-center text-zinc-500 font-bold mb-5 xs:mb-8 uppercase tracking-widest text-[9px] xs:text-[10px]">
            Master the skills that power the future
          </p>
          <div className="relative flex overflow-x-hidden">
            <div className="animate-marquee whitespace-nowrap flex items-center gap-8 xs:gap-16 md:gap-32 px-8 xs:px-16">
              {skillPillars.length > 0 ? (
                <>
                  {skillPillars.map((skill, index) => (
                    <span key={index} className="text-lg xs:text-2xl md:text-3xl font-black tracking-tighter text-zinc-800 uppercase">{skill.label}</span>
                  ))}
                  {skillPillars.map((skill, index) => (
                    <span key={`dup-${index}`} className="text-lg xs:text-2xl md:text-3xl font-black tracking-tighter text-zinc-800 uppercase">{skill.label}</span>
                  ))}
                </>
              ) : (
                <>
                  {topLevelCategories.map((cat, i) => (
                    <span key={i} className="text-lg xs:text-2xl md:text-3xl font-black tracking-tighter text-zinc-800 uppercase">{cat.label}</span>
                  ))}
                  {topLevelCategories.map((cat, i) => (
                    <span key={`d-${i}`} className="text-lg xs:text-2xl md:text-3xl font-black tracking-tighter text-zinc-800 uppercase">{cat.label}</span>
                  ))}
                </>
              )}
            </div>
          </div>
        </div>
      </section>



      {/* Course Sections */}
      <section className="py-16 xs:py-24 md:py-32 space-y-20 xs:py-32 xs:space-y-28 md:space-y-40 bg-slate-50">
        {[
          { key: "trending", label: "Popular Now", color: "text-blue-600", title: "Trending Courses.", btn: "View all →", btnColor: "text-blue-600 hover:text-blue-700 hover:bg-blue-50" },
          { key: "recent", label: "Fresh Content", color: "text-purple-600", title: "Recent Additions.", btn: null, btnColor: "" },
        ].map(({ key, label, color, title, btn, btnColor }) => (
          <div key={key} className="container mx-auto px-4 xs:px-5 lg:px-8">
            <div className="flex items-center justify-between mb-6 xs:mb-10 md:mb-12">
              <div>
                <span className={`${color} font-black text-[9px] xs:text-[10px] uppercase tracking-widest block mb-1 xs:mb-2`}>{label}</span>
                <h2 className="text-xl xs:text-2xl md:text-[28px] font-black tracking-tighter text-zinc-900">{title}</h2>
              </div>
              {btn && (
                <Button onClick={() => navigate("/courses")} variant="ghost" className={`font-bold rounded-xl h-10 xs:h-12 text-sm xs:text-base ${btnColor}`}>
                  {btn}
                </Button>
              )}
            </div>
            <div className="grid grid-cols-1 xs:grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 xs:gap-6 md:gap-8 lg:gap-12">
              {featuredSections?.[key]?.length > 0 ? (
                featuredSections[key].map((course, index) => (
                  <CourseCard key={course._id} course={course} handleCourseNavigate={handleCourseNavigate} index={index} />
                ))
              ) : (
                <p className="text-zinc-400 font-bold col-span-full text-center py-10">No courses selected.</p>
              )}
            </div>
          </div>
        ))}
      </section>

      {/* CTA Section */}
      <section className="py-16 xs:py-24 md:py-32 bg-slate-50">
        <div className="container mx-auto px-4 xs:px-5 lg:px-8">
          <motion.div
            {...fadeUp}
            className="bg-zinc-900 rounded-[24px] xs:rounded-[32px] md:rounded-[40px] p-6 xs:p-10 md:p-20 text-center text-white relative overflow-hidden shadow-2xl"
          >
            <div className="absolute inset-0 z-0">
              <img src="/cta_background.png" alt="Background" className="w-full h-full object-cover opacity-30 mix-blend-overlay" />
              <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/80 via-transparent to-zinc-950/80" />
            </div>
            <div className="relative z-10 max-w-2xl mx-auto">
              <h2 className="text-xl xs:text-2xl md:text-[28px] font-black tracking-tighter mb-4 xs:mb-6 leading-tight text-white">
                The future belongs <br className="hidden md:block" /> to the curious.
              </h2>
              <p className="text-sm xs:text-base text-zinc-400 mb-6 xs:mb-10 font-medium">
                Join 20,000+ students mastering skills from the world's most innovative instructors.
              </p>
              <Button
                onClick={() => navigate("/auth")}
                className="bg-white text-black hover:bg-zinc-200 rounded-xl xs:rounded-2xl h-12 xs:h-14 px-6 xs:px-10 text-base xs:text-lg font-black shadow-xl transition-all hover:scale-105 active:scale-95 w-full xs:w-auto"
              >
                Sign Up Now
              </Button>
            </div>
            <div className="absolute top-0 right-0 w-32 xs:w-64 h-32 xs:h-64 bg-blue-500/20 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 z-0" />
            <div className="absolute bottom-0 left-0 w-32 xs:w-64 h-32 xs:h-64 bg-purple-500/20 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2 z-0" />
          </motion.div>
        </div>
      </section>
    </div>
  );
}

export default StudentHomePage;
