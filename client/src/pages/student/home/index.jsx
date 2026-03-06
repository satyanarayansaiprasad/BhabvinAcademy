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
        whileHover={{ y: -12 }}
        onClick={() => handleCourseNavigate(course._id)}
        className="group cursor-pointer bg-white rounded-[40px] overflow-hidden border border-black/5 shadow-sm hover:shadow-2xl transition-all duration-500"
      >
        <div className="aspect-[16/11] overflow-hidden relative">
          <img src={course.image} alt={course.title} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
          <div className="absolute top-4 left-4 flex gap-2">
            <span className="px-4 py-1.5 rounded-full bg-white/90 backdrop-blur-md text-[10px] font-black uppercase tracking-widest text-[#6B8377] border border-black/5">
              {course.category}
            </span>
            {isOwned && (
              <span className="px-4 py-1.5 rounded-full bg-[#E6FF55] text-black text-[10px] font-black uppercase tracking-widest border-none">
                Owned
              </span>
            )}
          </div>
        </div>
        <div className="p-8 xs:p-10">
          <h3 className="text-xl xs:text-2xl font-black text-black mb-2 line-clamp-2 leading-tight tracking-tight">{course.title}</h3>
          <p className="text-[#6B8377] text-sm font-bold mb-8 flex items-center gap-2">
            By <span className="text-black uppercase tracking-widest text-xs">{course.instructorName}</span>
          </p>
          <div className="flex items-center justify-between pt-4 border-t border-black/5">
            <span className="text-2xl font-black text-black tracking-tighter">₹{course.pricing}</span>
            <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${isOwned ? "bg-[#E6FF55] text-black" : "bg-black text-white group-hover:bg-[#E6FF55] group-hover:text-black"}`}>
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-none stroke-current stroke-2"><path d="M5 12h14m-7-7l7 7-7 7" /></svg>
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative px-4 xs:px-6 lg:px-12 pt-28 pb-16 min-h-[90vh] flex items-center overflow-hidden bg-[#8BA396]">
        <div className="container mx-auto max-w-[1400px] relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">

          {/* Left Content: Title and Quote */}
          <div className="w-full lg:w-3/5 space-y-12">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
            >
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center">
                  <svg viewBox="0 0 24 24" className="w-6 h-6 fill-[#8BA396]" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
                  </svg>
                </div>
                <span className="text-white font-bold tracking-widest uppercase text-sm">#creative challenge</span>
              </div>

              <h1 className="text-6xl xs:text-7xl md:text-8xl lg:text-9xl font-black text-white leading-[0.9] tracking-tighter">
                Bagaimana <br /> Mungkin
              </h1>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="max-w-md"
            >
              <div className="flex gap-4 mb-6">
                <span className="text-4xl text-white font-serif">“</span>
                <p className="text-white text-lg font-medium leading-relaxed opacity-90 italic">
                  Bagaimana mungkin kau mendapatkan <br />
                  hal yang luar biasa, sedangkan kau belum <br />
                  mengubah kebiasaan-kebiasaan burukmu.
                </p>
              </div>
              <p className="text-white text-sm font-bold opacity-70 ml-8">(Syeikh Ibnu Atha'illah)</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 1 }}
              className="flex items-center gap-6 pt-8"
            >
              <Button
                onClick={() => navigate("/courses")}
                className="bg-[#E6FF55] hover:bg-[#D4EB00] text-black rounded-full px-10 h-16 font-black text-lg transition-transform hover:scale-105"
              >
                Visit site ↗
              </Button>
            </motion.div>
          </div>

          {/* Right Content: Books Image and Vertical Nav */}
          <div className="w-full lg:w-2/5 relative flex justify-center lg:justify-end">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 1 }}
              className="relative z-10"
            >
              <div className="bg-[#A3B9AE] rounded-[80px] p-4 xs:p-8 shadow-2xl overflow-hidden aspect-[4/5] w-full max-w-[450px]">
                <img
                  src="/new_hero_books_3d.png"
                  alt="3D Books"
                  className="w-full h-full object-contain pointer-events-none transform -rotate-6 scale-110"
                />
              </div>
            </motion.div>

            {/* Vertical Navigation Labels */}
            <div className="hidden xl:flex flex-col gap-12 absolute -right-20 top-1/2 -translate-y-1/2">
              {['STORY', 'REELS', 'FEED'].map((item, i) => (
                <div key={item} className="flex items-center gap-4">
                  <div className={`w-2 h-2 rounded-full ${i === 0 ? 'bg-[#E6FF55]' : 'bg-white/30'}`} />
                  <span className={`text-sm font-black tracking-widest ${i === 0 ? 'text-[#E6FF55]' : 'text-white/50'}`}>
                    {item}
                  </span>
                </div>
              ))}
            </div>

            {/* Bottom Floating Icons */}
            <div className="absolute right-0 -bottom-8 flex flex-col gap-4 z-20">
              <div className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center text-white cursor-pointer hover:bg-white/20 transition-all">
                <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" /></svg>
              </div>
              <div className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center text-white cursor-pointer hover:bg-white/20 transition-all">
                <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current"><path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" /></svg>
              </div>
              <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center text-black shadow-2xl cursor-pointer hover:scale-110 transition-transform">
                <svg viewBox="0 0 24 24" className="w-8 h-8 fill-none stroke-current stroke-2"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative Background Elements */}
        <div className="absolute top-0 right-0 w-1/3 h-full bg-[#A3B9AE] rounded-l-[200px] z-0 opacity-50" />
      </section>

      {/* Mastery Pillars - Marquee */}
      <section className="py-8 xs:py-12 bg-[#E6FF55] border-y border-black/5 overflow-hidden">
        <div className="max-w-[1400px] mx-auto">
          <p className="text-center text-black/60 font-black mb-5 xs:mb-8 uppercase tracking-[0.2em] text-[10px] xs:text-[12px]">
            Master the skills that power the future
          </p>
          <div className="relative flex overflow-x-hidden">
            <div className="animate-marquee whitespace-nowrap flex items-center gap-8 xs:gap-16 md:gap-32 px-8 xs:px-16">
              {skillPillars.length > 0 ? (
                <>
                  {skillPillars.map((skill, index) => (
                    <span key={index} className="text-lg xs:text-2xl md:text-4xl font-black tracking-tighter text-black uppercase">{skill.label}</span>
                  ))}
                  {skillPillars.map((skill, index) => (
                    <span key={`dup-${index}`} className="text-lg xs:text-2xl md:text-4xl font-black tracking-tighter text-black uppercase">{skill.label}</span>
                  ))}
                </>
              ) : (
                <>
                  {topLevelCategories.map((cat, i) => (
                    <span key={i} className="text-lg xs:text-2xl md:text-4xl font-black tracking-tighter text-black uppercase">{cat.label}</span>
                  ))}
                  {topLevelCategories.map((cat, i) => (
                    <span key={`d-${i}`} className="text-lg xs:text-2xl md:text-4xl font-black tracking-tighter text-black uppercase">{cat.label}</span>
                  ))}
                </>
              )}
            </div>
          </div>
        </div>
      </section>



      {/* Course Sections */}
      <section className="py-16 xs:py-24 md:py-32 space-y-20 bg-[#8BA396]/5">
        {[
          { key: "trending", label: "Popular Now", color: "text-[#6B8377]", title: "Trending Courses.", btn: "View all →", btnColor: "text-black hover:text-[#54685E] hover:bg-white/50" },
          { key: "recent", label: "Fresh Content", color: "text-[#6B8377]", title: "Recent Additions.", btn: null, btnColor: "" },
        ].map(({ key, label, color, title, btn, btnColor }) => (
          <div key={key} className="container mx-auto px-4 xs:px-5 lg:px-8">
            <div className="flex items-center justify-between mb-6 xs:mb-10 md:mb-12">
              <div>
                <span className={`${color} font-black text-[10px] xs:text-[12px] uppercase tracking-[0.2em] block mb-1 xs:mb-2`}>{label}</span>
                <h2 className="text-2xl xs:text-3xl md:text-4xl font-black tracking-tighter text-black">{title}</h2>
              </div>
              {btn && (
                <Button onClick={() => navigate("/courses")} variant="ghost" className={`font-black rounded-full h-12 xs:h-14 px-6 text-sm xs:text-base ${btnColor}`}>
                  {btn}
                </Button>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 xs:gap-10">
              {featuredSections?.[key]?.length > 0 ? (
                featuredSections[key].map((course, index) => (
                  <CourseCard key={course._id} course={course} handleCourseNavigate={handleCourseNavigate} index={index} />
                ))
              ) : (
                <p className="text-black/40 font-bold col-span-full text-center py-10 italic">No courses selected yet.</p>
              )}
            </div>
          </div>
        ))}
      </section>

      {/* CTA Section */}
      <section className="py-16 xs:py-24 md:py-32 bg-[#8BA396]/5">
        <div className="container mx-auto px-4 xs:px-5 lg:px-8">
          <motion.div
            {...fadeUp}
            className="bg-black rounded-[60px] p-10 md:p-24 text-center text-white relative overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.2)]"
          >
            <div className="absolute inset-0 z-0">
              <div className="absolute inset-0 bg-[#E6FF55]/10 mix-blend-overlay" />
              <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/80" />
            </div>
            <div className="relative z-10 max-w-3xl mx-auto space-y-8">
              <h2 className="text-4xl xs:text-5xl md:text-7xl font-black tracking-tighter leading-[0.9] text-white">
                The future belongs <br /> to the curious.
              </h2>
              <p className="text-lg xs:text-xl text-white/60 max-w-xl mx-auto font-medium">
                Join 20,000+ students mastering skills from the world's most innovative instructors.
              </p>
              <div className="pt-8">
                <Button
                  onClick={() => navigate("/auth")}
                  className="bg-[#E6FF55] text-black hover:bg-[#D4EB00] rounded-full h-20 px-12 text-xl font-black transition-all hover:scale-110 active:scale-95 shadow-[0_20px_40px_rgba(230,255,85,0.2)] w-full xs:w-auto"
                >
                  Sign Up Now ↗
                </Button>
              </div>
            </div>
            {/* Decorative circles */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-[#E6FF55]/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 z-0" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#8BA396]/20 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2 z-0" />
          </motion.div>
        </div>
      </section>
    </div>
  );
}

export default StudentHomePage;
