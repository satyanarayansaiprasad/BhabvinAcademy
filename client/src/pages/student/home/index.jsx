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
      <section className="relative pt-20 pb-12 lg:pt-24 lg:pb-32 bg-[#f2f2f2] overflow-hidden border-b border-[#e6e6e6]">
        <div className="container mx-auto px-4 lg:px-6 relative z-10 max-w-7xl">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            {/* Left Content */}
            <div className="lg:w-3/5 text-center lg:text-left">
              <div className="inline-block bg-[#0067b8]/10 text-[#0067b8] text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-sm mb-6">
                Redefining Online Learning
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight text-black leading-tight mb-6">
                Skills for your future. <br />
                <span className="text-[#0067b8]">Start your journey today.</span>
              </h1>
              <p className="text-[#616161] text-lg md:text-xl max-w-2xl mb-10 leading-relaxed mx-auto lg:mx-0">
                Access world-class training and documentation on Bhavin Academy. 
                Learn at your own pace with our comprehensive, expert-led courses.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <Button 
                  onClick={() => navigate("/courses")} 
                  className="bg-[#0067b8] text-white rounded-sm px-8 h-12 text-base font-semibold hover:bg-[#005a9e] transition-colors w-full sm:w-auto shadow-sm"
                >
                  Explore Documentation
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => navigate("/about")}
                  className="bg-white text-black border-[#e6e6e6] rounded-sm px-8 h-12 text-base font-semibold hover:bg-[#f2f2f2] w-full sm:w-auto transition-colors"
                >
                  Learn More
                </Button>
              </div>
            </div>

            {/* Right Image/Graphic */}
            <div className="lg:w-2/5 relative flex justify-center">
              <div className="relative w-full aspect-square max-w-[440px] rounded-sm overflow-hidden border border-[#e6e6e6] bg-white shadow-lg">
                <img 
                  src="/hero_portrait_dark.png" 
                  alt="Learning" 
                  className="w-full h-full object-cover grayscale-[20%]" 
                />
              </div>
              {/* Subtle accent squares common in MS designs */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-[#0067b8]/10 -z-10" />
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-[#0067b8]/5 -z-10" />
            </div>
          </div>
        </div>
      </section>

      {/* Course Sections */}
      <section className="py-16 md:py-24 space-y-24 bg-white">
        {[
          { key: "trending", label: "Most popular", color: "text-[#0067b8]", title: "Popular paths.", btn: "View everything", btnColor: "text-[#0067b8] hover:bg-[#f2f2f2]" },
          { key: "recent", label: "Recently added", color: "text-[#616161]", title: "New releases.", btn: null, btnColor: "" },
        ].map(({ key, label, color, title, btn, btnColor }) => (
          <div key={key} className="container mx-auto px-4 lg:px-6 max-w-7xl">
            <div className="flex items-end justify-between mb-8 border-b border-[#e6e6e6] pb-4">
              <div>
                <span className={`${color} font-semibold text-xs uppercase tracking-wider block mb-1`}>{label}</span>
                <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-black">{title}</h2>
              </div>
              {btn && (
                <Button onClick={() => navigate("/courses")} variant="ghost" className={`font-semibold rounded-sm h-10 text-sm ${btnColor} transition-none`}>
                  {btn} →
                </Button>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {featuredSections?.[key]?.length > 0 ? (
                featuredSections[key].map((course, index) => (
                  <CourseCard key={course._id} course={course} handleCourseNavigate={handleCourseNavigate} index={index} />
                ))
              ) : (
                <p className="text-[#616161] font-normal col-span-full py-10">No courses matching your criteria were found.</p>
              )}
            </div>
          </div>
        ))}
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32 bg-[#f2f2f2] border-t border-[#e6e6e6]">
        <div className="container mx-auto px-4 lg:px-6 max-w-5xl">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-black mb-6">
              Unlock your potential. <br /> Start learning for free today.
            </h2>
            <p className="text-[#616161] text-lg mb-10 max-w-2xl mx-auto">
              Whether you're just starting out or looking to advance your career, 
              Bhavin Academy has the resources you need to succeed.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                onClick={() => navigate("/auth")}
                className="bg-[#0067b8] text-white hover:bg-[#005a9e] rounded-sm h-12 px-10 text-base font-semibold transition-none w-full sm:w-auto shadow-sm"
              >
                Join Now
              </Button>
              <Button
                onClick={() => navigate("/courses")}
                variant="outline"
                className="bg-white text-black border-[#e6e6e6] rounded-sm h-12 px-10 text-base font-semibold hover:bg-[#f2f2f2] w-full sm:w-auto transition-none"
              >
                Browse Catalog
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default StudentHomePage;
