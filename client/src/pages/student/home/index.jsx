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
import { Star, Heart, Palette, BookOpen } from "lucide-react";

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
        variants={{
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 }
        }}
        onClick={() => handleCourseNavigate(course._id)}
        className="group cursor-pointer bg-white overflow-hidden flex flex-col h-full border border-transparent hover:shadow-[0_12px_24px_rgba(0,0,0,0.08)] transition-all duration-300"
      >
        <div className="aspect-[16/9] overflow-hidden relative">
          <img src={course.image} alt={course.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
          {isOwned && (
            <div className="absolute top-2 left-2 px-2 py-0.5 bg-[#0067b8] text-white text-[10px] font-bold uppercase tracking-widest rounded-sm">
              Owned
            </div>
          )}
        </div>
        <div className="p-5 flex flex-col flex-grow">
          <h3 className="text-lg font-semibold text-black mb-2 line-clamp-2 leading-tight group-hover:text-[#0067b8] transition-colors">{course.title}</h3>
          <p className="text-[#616161] text-xs font-normal mb-4">By <span className="text-black">{course.instructorName}</span></p>
          <div className="mt-auto flex items-center justify-between">
            <span className="text-xl font-bold text-black">₹{course.pricing}</span>
            <Button variant="link" className={`p-0 h-auto font-bold text-sm ${isOwned ? "text-emerald-700" : "text-[#0067b8]"} hover:no-underline`}>
              {isOwned ? "Continue" : "Learn more"} →
            </Button>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Microsoft Style Hero Section */}
      <section className="relative bg-white pt-20 pb-12 lg:pt-32 lg:pb-24 border-b border-[#e6e6e6]">
        <div className="container mx-auto px-4 lg:px-6 max-w-7xl">
          <div className="flex flex-col lg:flex-row items-center gap-12 xl:gap-20">
            {/* Left Column: Text */}
            <motion.div 
              initial="initial"
              animate="animate"
              variants={{
                initial: { opacity: 0, x: -20 },
                animate: { opacity: 1, x: 0, transition: { staggerChildren: 0.1, duration: 0.8 } }
              }}
              className="lg:w-1/2 text-center lg:text-left z-10"
            >
              <motion.h1 
                variants={{ initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 } }}
                className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight text-black leading-[1.1] mb-6"
              >
                Build your future with <br />
                <span className="text-[#0067b8]">professional learning.</span>
              </motion.h1>
              
              <motion.p 
                variants={{ initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 } }}
                className="text-[#616161] text-lg md:text-xl max-w-xl mb-10 leading-relaxed mx-auto lg:mx-0"
              >
                Discover a world of knowledge with structured courses and official developer 
                documentation designed to help you master new skills at every stage.
              </motion.p>
              
              <motion.div 
                variants={{ initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 } }}
                className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4"
              >
                <Button 
                  onClick={() => navigate("/courses")} 
                  className="bg-[#0067b8] text-white rounded-sm px-10 h-12 text-sm font-semibold hover:bg-[#005a9e] transition-all shadow-md w-full sm:w-auto"
                >
                  Explore Documentation
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => navigate("/about")}
                  className="bg-transparent text-black border-black border-[1.5px] rounded-sm px-10 h-12 text-sm font-semibold hover:bg-black/5 w-full sm:w-auto transition-all"
                >
                  Learn how it works
                </Button>
              </motion.div>
            </motion.div>

            {/* Right Column: High-Fidelity Image */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="lg:w-1/2 relative w-full"
            >
              <div className="relative rounded-sm overflow-hidden shadow-[0_40px_80px_-15px_rgba(0,0,0,0.15)] bg-[#f2f2f2]">
                <img 
                  src="/microsoft_hero.png" 
                  alt="Professional Learning Ecosystem" 
                  className="w-full h-auto object-cover" 
                />
              </div>
              {/* Dynamic Overlay Label */}
              <div className="absolute -bottom-6 -left-6 bg-white p-5 shadow-2xl rounded-sm border border-[#e6e6e6] hidden md:block">
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-10 bg-[#0067b8] rounded-full" />
                  <div>
                    <p className="text-[10px] font-bold text-[#616161] uppercase tracking-widest">Enrollment Active</p>
                    <p className="text-base font-semibold text-black">Join 10k+ Learners</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Structured Skill Pillars Grid (Redesigned from Marquee) */}
      <section className="py-20 lg:py-28 bg-[#f2f2f2]">
        <div className="container mx-auto px-4 lg:px-6 max-w-7xl">
          <div className="mb-16 text-center lg:text-left">
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-black mb-4">Choose your learning path.</h2>
            <p className="text-[#616161] text-lg max-w-2xl">Tailored experiences for every discipline, from advanced technology to creative arts.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {/* Featured Technology Pillar with Image */}
            <div className="col-span-1 md:col-span-2 lg:col-span-2 row-span-1 bg-white p-2 rounded-sm border border-[#e6e6e6] flex flex-col sm:flex-row gap-6 hover:shadow-lg transition-shadow">
              <div className="w-full sm:w-1/2 overflow-hidden rounded-sm bg-[#0067b8]/5">
                <img src="/technical_skills.png" alt="Technology Pillar" className="w-full h-full object-cover" />
              </div>
              <div className="w-full sm:w-1/2 p-4 flex flex-col justify-center">
                <span className="text-[#0067b8] font-bold text-xs uppercase tracking-[0.2em] mb-3">Featured</span>
                <h3 className="text-2xl font-semibold text-black mb-4">Advanced Tech</h3>
                <p className="text-[#616161] text-sm mb-6 leading-relaxed">Master Azure, Copilot, and cloud infrastructure with expert-led paths.</p>
                <Button onClick={() => handleNavigateToCoursesPage('technology')} variant="link" className="p-0 h-auto justify-start text-[#0067b8] font-bold text-sm hover:translate-x-1 transition-transform">
                  Explore Tech →
                </Button>
              </div>
            </div>

            {/* Other Pillars */}
            {[
              { id: "well-being", label: "Well-being", icon: <Heart className="w-6 h-6" />, desc: "Yoga, health, and balanced lifestyle practices.", color: "bg-orange-500" },
              { id: "personal-mastery", label: "Growth", icon: <Star className="w-6 h-6" />, desc: "Strategies for personal and professional development.", color: "bg-blue-500" },
              { id: "creative-arts", label: "Creative Arts", icon: <Palette className="w-6 h-6" />, desc: "Expression through digital and physical art forms.", color: "bg-purple-500" },
              { id: "certification", label: "Certifications", icon: <BookOpen className="w-6 h-6" />, desc: "Validate your skills with professional badges.", color: "bg-emerald-500" },
            ].map((pillar) => (
              <div 
                key={pillar.id}
                onClick={() => handleNavigateToCoursesPage(pillar.id)}
                className="group cursor-pointer bg-white p-8 rounded-sm border border-[#e6e6e6] hover:border-[#0067b8] hover:shadow-xl transition-all flex flex-col justify-between"
              >
                <div className={`${pillar.color} w-12 h-12 rounded-sm flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform`}>
                  {pillar.icon}
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-black mb-3">{pillar.label}</h3>
                  <p className="text-[#616161] text-sm mb-6 leading-relaxed">{pillar.desc}</p>
                </div>
                <span className="text-[#0067b8] font-bold text-xs uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                  View Path →
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Courses Sections */}
      <section className="py-24 lg:py-32 bg-white">
        <div className="container mx-auto px-4 lg:px-6 max-w-7xl">
          {[
            { key: "trending", label: "Trending Now", title: "Popular paths.", desc: "The most sought-after skills in the industry right now." },
            { key: "recent", label: "Recently Added", title: "New releases.", desc: "Stay ahead of the curve with our latest course additions." },
          ].map(({ key, label, title, desc }) => (
            <div key={key} className="mb-32 last:mb-0">
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 border-b border-[#e6e6e6] pb-8 gap-6">
                <div className="max-w-xl">
                  <span className="text-[#0067b8] font-bold text-xs uppercase tracking-[0.3em] block mb-3">{label}</span>
                  <h2 className="text-3xl md:text-5xl font-semibold tracking-tight text-black mb-4">{title}</h2>
                  <p className="text-[#616161] text-lg">{desc}</p>
                </div>
                <Button onClick={() => navigate("/courses")} variant="outline" className="border-black border-[1.5px] rounded-sm font-bold h-12 px-8 text-sm hover:bg-black/5 transition-all">
                  View catalog
                </Button>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {featuredSections?.[key]?.length > 0 ? (
                  featuredSections[key].map((course, index) => (
                    <CourseCard key={course._id} course={course} handleCourseNavigate={handleCourseNavigate} index={index} />
                  ))
                ) : (
                  <div className="col-span-full py-20 text-center bg-[#f2f2f2] rounded-sm border border-dashed border-[#e6e6e6]">
                    <p className="text-[#616161] font-medium italic">No courses available for this track yet.</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Clean Call to Action */}
      <section className="py-24 md:py-40 bg-black text-white relative overflow-hidden">
        {/* Subtle Background Graphic */}
        <div className="absolute top-0 right-0 w-1/3 h-full bg-[#0067b8]/10 skew-x-[-15deg] translate-x-1/2 z-0" />
        
        <div className="container mx-auto px-4 lg:px-6 max-w-5xl relative z-10">
          <div className="text-center">
            <h2 className="text-4xl md:text-6xl font-semibold tracking-tight mb-8 leading-tight">
              Empowering every developer <br /> to achieve more.
            </h2>
            <p className="text-gray-400 text-lg md:text-xl mb-12 max-w-2xl mx-auto leading-relaxed">
              Join Bhavin Academy today and gain access to premium curriculum, official documentation, 
              and a community of professional learners.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Button
                onClick={() => navigate("/auth")}
                className="bg-white text-black hover:bg-gray-200 rounded-sm h-14 px-14 text-base font-bold transition-all w-full sm:w-auto"
              >
                Join for free
              </Button>
              <Button
                onClick={() => navigate("/courses")}
                variant="outline"
                className="bg-transparent text-white border-white border-[2px] rounded-sm h-14 px-14 text-base font-bold hover:bg-white/10 w-full sm:w-auto transition-all"
              >
                Explore catalog
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default StudentHomePage;
