import { courseCategories } from "@/config";
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

function StudentHomePage() {
  const { studentViewCoursesList, setStudentViewCoursesList } =
    useContext(StudentContext);
  const { auth } = useContext(AuthContext);
  const [skillPillars, setSkillPillars] = useState([]);
  const [categories, setCategories] = useState([]);
  const [featuredSections, setFeaturedSections] = useState({
    trending: [],
    mostDemanded: [],
    recent: [],
  });

  const navigate = useNavigate();

  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);

  function handleNavigateToCoursesPage(getCurrentId) {
    const currentFilter = {
      category: [getCurrentId],
    };
    sessionStorage.setItem("filters", JSON.stringify(currentFilter));
    navigate(`/courses?category=${encodeURIComponent(getCurrentId)}`);
  }

  async function fetchAllStudentViewCourses() {
    const response = await fetchStudentViewCourseListService("");
    if (response?.success) setStudentViewCoursesList(response?.data);
  }

  async function handleCourseNavigate(getCurrentCourseId) {
    if (!auth?.authenticate) {
      navigate(`/course/details/${getCurrentCourseId}`);
      return;
    }

    const response = await checkCoursePurchaseInfoService(
      getCurrentCourseId,
      auth?.user?._id
    );

    if (response?.success) {
      if (response?.data) {
        navigate(`/course-progress/${getCurrentCourseId}`);
      } else {
        navigate(`/course/details/${getCurrentCourseId}`);
      }
    }
  }

  async function fetchHomeConfig() {
    const response = await getHomeConfigService();
    if (response?.success) {
      setSkillPillars(response?.data?.skillPillars || []);
      setFeaturedSections(response?.data?.featuredCourseSections || {
        trending: [],
        mostDemanded: [],
        recent: [],
      });
      setCategories(response?.data?.categories || []);
    }
  }

  useEffect(() => {
    fetchAllStudentViewCourses();
    fetchHomeConfig();
  }, []);

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
        className="group cursor-pointer bg-white rounded-[32px] overflow-hidden border border-zinc-200/60 shadow-sm hover:shadow-2xl transition-all duration-500"
      >
        <div className="aspect-[16/10] overflow-hidden relative">
          <img src={course.image} alt={course.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
          <div className="absolute top-4 left-4 flex gap-2">
            <span className="px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-[10px] font-black uppercase tracking-widest text-zinc-900 border border-zinc-200">
              {course.category}
            </span>
            {isOwned && (
              <span className="px-3 py-1 rounded-full bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest border-none">
                Owned
              </span>
            )}
          </div>
        </div>
        <div className="p-8">
          <h3 className="text-lg font-bold text-zinc-900 mb-2 line-clamp-1">{course.title}</h3>
          <p className="text-zinc-500 text-sm font-medium mb-6">By <span className="text-zinc-900">{course.instructorName}</span></p>
          <div className="flex items-center justify-between">
            <span className="text-xl font-black text-zinc-900">₹{course.pricing}</span>
            <span className={`text-sm font-bold group-hover:translate-x-1 transition-transform ${isOwned ? "text-emerald-600" : "text-blue-600"}`}>
              {isOwned ? "Continue Learning →" : "Buy Now →"}
            </span>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen bg-black overflow-hidden flex flex-col justify-center">
        {/* Background Decorative Images/Glows */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-600/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2 pointer-events-none" />

        <div className="container mx-auto px-4 lg:px-8 relative z-10 pt-20">
          <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
            {/* Hero Text */}
            <motion.div
              style={{ opacity, scale }}
              className="flex-1 text-center lg:text-left pt-12"
            >
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="mb-8 inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/20 bg-white/5 backdrop-blur-md text-white/80 text-sm font-medium"
              >
                <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                <span>Next Generation Learning v2.0</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
                className="text-3xl md:text-[50px] font-black tracking-tighter text-white mb-8 leading-[1.1]"
              >
                Learn <br />
                <span className="bg-gradient-to-r from-blue-400 via-emerald-400 to-indigo-400 bg-clip-text text-transparent italic">
                  Without Limits.
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
                className="text-base text-zinc-400 max-w-xl mb-12 font-medium leading-relaxed"
              >
                Experience the most immersive learning platform ever built.
                Industry-leading courses, beautifully rendered on every screen.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.6, ease: "easeOut" }}
                className="flex flex-col sm:flex-row items-center gap-4"
              >
                <Button
                  onClick={() => navigate("/courses")}
                  className="w-full sm:w-auto bg-white text-black hover:bg-zinc-200 hover:text-black rounded-2xl h-16 px-10 text-xl font-black transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-white/10"
                >
                  Get Started
                </Button>
                <Button
                  variant="outline"
                  className="w-full sm:w-auto bg-white/5 text-white border-white/20 hover:bg-white/10 hover:text-white rounded-2xl h-16 px-10 text-xl font-black backdrop-blur-md transition-all hover:scale-105 active:scale-95"
                >
                  Watch Demo
                </Button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 1 }}
                className="mt-16 flex items-center gap-6"
              >
                <div className="flex -space-x-4">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="w-12 h-12 rounded-full border-4 border-black bg-zinc-800 overflow-hidden shadow-xl">
                      <img src={`https://i.pravatar.cc/150?u=${i}`} alt="User" />
                    </div>
                  ))}
                </div>
                <div>
                  <p className="text-white font-black text-sm tracking-tight">20k+ Active Students</p>
                  <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Global Community</p>
                </div>
              </motion.div>
            </motion.div>

            {/* Hero Visuals */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
              className="flex-1 relative hidden lg:block"
            >
              <div className="relative aspect-[4/5] w-full max-w-[600px] mx-auto group">
                {/* Main Image */}
                <div className="absolute inset-0 rounded-[60px] overflow-hidden border-8 border-white/5 shadow-2xl rotate-3 translate-x-10 -translate-y-10 group-hover:rotate-0 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-1000 z-10 bg-zinc-900">
                  <img
                    src="/hero_student_learning_1772016137096.png"
                    alt="Student Learning"
                    className="w-full h-full object-cover opacity-80"
                  />
                </div>

                {/* Secondary Image */}
                <div className="absolute top-1/2 -left-20 w-80 aspect-square rounded-[40px] overflow-hidden border-8 border-white/5 shadow-2xl -rotate-6 group-hover:rotate-0 transition-all duration-1000 z-20 hidden xl:block bg-zinc-900">
                  <img
                    src="/hero_tech_setup_1772016494691.png"
                    alt="Tech Setup"
                    className="w-full h-full object-cover opacity-60"
                  />
                </div>

                {/* Tertiary Element */}
                <div className="absolute -bottom-10 -right-10 w-64 aspect-square rounded-[40px] overflow-hidden border-8 border-white/5 shadow-2xl rotate-12 group-hover:rotate-0 transition-all duration-1000 z-0 bg-blue-600/20 backdrop-blur-3xl p-8 flex flex-col justify-end">
                  <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center mb-4">
                    <span className="text-black font-black">AI</span>
                  </div>
                  <p className="text-white font-black leading-none">Smart Features</p>
                  <p className="text-white/40 text-xs font-bold uppercase tracking-widest mt-2">Enhanced Learning</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/20 hidden md:block"
        >
          <div className="w-6 h-10 rounded-full border-2 border-current flex justify-center p-1">
            <div className="w-1 h-2 bg-current rounded-full" />
          </div>
        </motion.div>
      </section>

      {/* Mastery Pillars - Marquee */}
      <section className="py-12 bg-white border-y border-zinc-200 overflow-hidden">
        <div className="max-w-[1400px] mx-auto">
          <p className="text-center text-zinc-500 font-bold mb-8 uppercase tracking-widest text-[10px]">
            Master the skills that power the future
          </p>
          <div className="relative flex overflow-x-hidden">
            <div className="animate-marquee whitespace-nowrap flex items-center gap-16 md:gap-32 px-16">
              {skillPillars.length > 0 ? (
                <>
                  {skillPillars.map((skill, index) => (
                    <span key={index} className="text-3xl font-black tracking-tighter text-zinc-800 uppercase">
                      {skill.label}
                    </span>
                  ))}
                  {/* Duplicate for seamless scrolling */}
                  {skillPillars.map((skill, index) => (
                    <span key={`dup-${index}`} className="text-3xl font-black tracking-tighter text-zinc-800 uppercase">
                      {skill.label}
                    </span>
                  ))}
                </>
              ) : (
                <>
                  <span className="text-3xl font-black tracking-tighter text-zinc-800">Web Development</span>
                  <span className="text-3xl font-extrabold text-zinc-800 italic">Cloud Architecture</span>
                  <span className="text-3xl font-black text-zinc-800">Machine Learning</span>
                  <span className="text-3xl font-bold font-mono text-zinc-800 tracking-tighter">UI/UX MASTERY</span>
                  <span className="text-3xl font-extrabold text-zinc-800">CYBER SECURITY</span>
                  <span className="text-3xl font-black text-zinc-800 italic">Data Science</span>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Compact Categories / Topics - Sliding Marquee Reverse */}
      <section className="py-20 bg-white border-b border-zinc-100 overflow-hidden">
        <div className="relative flex overflow-x-hidden">
          <div className="animate-marquee-reverse whitespace-nowrap flex items-center gap-4 px-4">
            {(categories.length > 0 ? categories : courseCategories).map((category) => (
              <motion.button
                key={category.id}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleNavigateToCoursesPage(category.id)}
                className="px-6 py-3 rounded-2xl bg-zinc-50 border border-zinc-200 text-zinc-900 font-bold text-sm shadow-sm hover:shadow-md transition-all whitespace-nowrap"
              >
                {category.label}
              </motion.button>
            ))}
            {/* Duplicate for seamless scrolling */}
            {(categories.length > 0 ? categories : courseCategories).map((category) => (
              <motion.button
                key={`dup-${category.id}`}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleNavigateToCoursesPage(category.id)}
                className="px-6 py-3 rounded-2xl bg-zinc-50 border border-zinc-200 text-zinc-900 font-bold text-sm shadow-sm hover:shadow-md transition-all whitespace-nowrap"
              >
                {category.label}
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* Course Sections */}
      <section className="py-32 space-y-40 bg-slate-50">
        {/* Trending Courses */}
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <span className="text-blue-600 font-black text-[10px] uppercase tracking-widest block mb-2">Popular Now</span>
              <h2 className="text-[28px] font-black tracking-tighter text-zinc-900">Trending Courses.</h2>
            </div>
            <Button
              onClick={() => navigate("/courses")}
              variant="ghost"
              className="font-bold text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-xl h-12"
            >
              View all →
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
            {(featuredSections?.trending?.length > 0 ? featuredSections.trending : studentViewCoursesList.slice(0, 3)).map((course, index) => (
              <CourseCard key={course._id} course={course} handleCourseNavigate={handleCourseNavigate} index={index} />
            ))}
          </div>
        </div>

        {/* Most Demanded Courses */}
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <span className="text-emerald-600 font-black text-[10px] uppercase tracking-widest block mb-2">High Enrollment</span>
              <h2 className="text-[28px] font-black tracking-tighter text-zinc-900">Most Demanded.</h2>
            </div>
            <Button
              onClick={() => navigate("/courses")}
              variant="ghost"
              className="font-bold text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-xl h-12"
            >
              Explore →
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
            {featuredSections?.mostDemanded?.length > 0
              ? featuredSections.mostDemanded.map((course, index) => (
                <CourseCard key={course._id} course={course} handleCourseNavigate={handleCourseNavigate} index={index} />
              ))
              : studentViewCoursesList && [...studentViewCoursesList]
                .sort((a, b) => (b.students?.length || 0) - (a.students?.length || 0))
                .slice(0, 3)
                .map((course, index) => (
                  <CourseCard key={course._id} course={course} handleCourseNavigate={handleCourseNavigate} index={index} />
                ))}
          </div>
        </div>

        {/* Recent Courses */}
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <span className="text-purple-600 font-black text-[10px] uppercase tracking-widest block mb-2">Fresh Content</span>
              <h2 className="text-[28px] font-black tracking-tighter text-zinc-900">Recent Additions.</h2>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
            {featuredSections?.recent?.length > 0
              ? featuredSections.recent.map((course, index) => (
                <CourseCard key={course._id} course={course} handleCourseNavigate={handleCourseNavigate} index={index} />
              ))
              : studentViewCoursesList && [...studentViewCoursesList]
                .sort((a, b) => new Date(b.date) - new Date(a.date))
                .slice(0, 3)
                .map((course, index) => (
                  <CourseCard key={course._id} course={course} handleCourseNavigate={handleCourseNavigate} index={index} />
                ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 bg-slate-50">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            {...fadeUp}
            className="bg-zinc-900 rounded-[40px] p-12 md:p-20 text-center text-white relative overflow-hidden shadow-2xl"
          >
            {/* Background Image with Overlay */}
            <div className="absolute inset-0 z-0">
              <img
                src="/cta_background.png"
                alt="Background"
                className="w-full h-full object-cover opacity-30 mix-blend-overlay"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/80 via-transparent to-zinc-950/80" />
            </div>

            <div className="relative z-10 max-w-2xl mx-auto">
              <h2 className="text-[28px] font-black tracking-tighter mb-6 leading-tight text-white">
                The future belongs <br className="hidden md:block" /> to the curious.
              </h2>
              <p className="text-base text-zinc-400 mb-10 font-medium">
                Join 20,000+ students mastering skills from the world's most innovative instructors.
              </p>
              <Button
                onClick={() => navigate("/auth")}
                className="bg-white text-black hover:bg-zinc-200 rounded-2xl h-14 px-10 text-lg font-black shadow-xl transition-all hover:scale-105 active:scale-95"
              >
                Sign Up Now
              </Button>
            </div>

            {/* Subtle Decorative Elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 z-0" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/20 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2 z-0" />
          </motion.div>
        </div>
      </section>
    </div>
  );
}

export default StudentHomePage;
