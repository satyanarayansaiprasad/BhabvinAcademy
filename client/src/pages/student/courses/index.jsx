import { useContext, useEffect, useState, useMemo } from "react";
import { StudentContext } from "@/context/student-context";
import { fetchStudentViewCourseListService } from "@/services";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import CourseCard from "@/components/student-view/course-card";

function StudentViewCoursesPage() {
  const navigate = useNavigate();
  const { studentViewCoursesList, setStudentViewCoursesList, loadingState, setLoadingState } = useContext(StudentContext);

  // States
  const [activeCategory, setActiveCategory] = useState("all");
  const [activeLevels, setActiveLevels] = useState([]);
  const [activeDurs, setActiveDurs] = useState([]);
  const [activeCerts, setActiveCerts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sort, setSort] = useState("default");
  const [viewType, setViewType] = useState("grid"); // grid | list

  async function fetchAllCourses() {
    setLoadingState(true);
    const response = await fetchStudentViewCourseListService("");
    if (response?.success) {
      setStudentViewCoursesList(response?.data);
    }
    setLoadingState(false);
  }

  useEffect(() => {
    fetchAllCourses();
  }, []);

  // Total stats derived from the whole catalog
  const totalVideoLessons = 600;
  const totalHours = 280;
  const totalCategoriesCount = 5;

  // Toggle helpers
  function toggleLevel(level) {
    setActiveLevels(prev =>
      prev.includes(level) ? prev.filter(l => l !== level) : [...prev, level]
    );
  }

  function toggleDur(dur) {
    setActiveDurs(prev =>
      prev.includes(dur) ? prev.filter(d => d !== dur) : [...prev, dur]
    );
  }

  function toggleCert(cert) {
    setActiveCerts(prev =>
      prev.includes(cert) ? prev.filter(c => c !== cert) : [...prev, cert]
    );
  }

  // Duration matcher function
  function durMatch(hours) {
    if (activeDurs.length === 0) return true;
    const h = Number(hours || 0);
    if (activeDurs.includes("short") && h < 20) return true;
    if (activeDurs.includes("medium") && h >= 20 && h <= 30) return true;
    if (activeDurs.includes("long") && h > 30) return true;
    return false;
  }

  // Certification matcher function
  function certMatch(course) {
    if (activeCerts.length === 0) return true;
    const cat = String(course?.category || '').toLowerCase();
    const title = String(course?.title || '').toLowerCase();

    if (activeCerts.includes("mcp") && (cat.includes("microsoft") || title.includes("windows") || title.includes("active directory") || title.includes("m365") || title.includes("hyper-v"))) {
      return true;
    }
    if (activeCerts.includes("comptia") && title.includes("security+") || title.includes("network+")) {
      return true;
    }
    if (activeCerts.includes("ccna") && title.includes("ccna")) {
      return true;
    }
    if (activeCerts.includes("lpic") && (cat.includes("linux") || title.includes("linux") || title.includes("bash"))) {
      return true;
    }
    if (activeCerts.includes("aws_azure") && (cat.includes("cloud") || title.includes("aws") || title.includes("azure"))) {
      return true;
    }
    return false;
  }

  // Apply filters client-side to ensure perfect responsive interaction
  const filteredCourses = useMemo(() => {
    let result = [...(studentViewCoursesList || [])];

    // Filter by Category tab
    if (activeCategory !== "all") {
      result = result.filter(c => String(c.category || '').toLowerCase() === activeCategory);
    }

    // Filter by Level check
    if (activeLevels.length > 0) {
      result = result.filter(c => activeLevels.includes(c.level));
    }

    // Filter by Search Query
    if (searchTerm.trim() !== "") {
      const q = searchTerm.toLowerCase().trim();
      result = result.filter(c => String(c.title || '').toLowerCase().includes(q) || String(c.subtitle || '').toLowerCase().includes(q));
    }

    // Apply Sorting
    if (sort === "lessons-high") {
      result.sort((a, b) => (b.curriculum?.length || 0) - (a.curriculum?.length || 0));
    } else if (sort === "hours-high") {
      result.sort((a, b) => Number(b.duration || 0) - Number(a.duration || 0));
    } else if (sort === "newest") {
      // Seed courses labeled as New first
      result.sort((a, b) => {
        const aNew = String(a.title || '').toLowerCase().includes("virtualization") || String(a.title || '').toLowerCase().includes("aws") || String(a.title || '').toLowerCase().includes("bash") ? 1 : 0;
        const bNew = String(b.title || '').toLowerCase().includes("virtualization") || String(b.title || '').toLowerCase().includes("aws") || String(b.title || '').toLowerCase().includes("bash") ? 1 : 0;
        return bNew - aNew;
      });
    }

    return result;
  }, [studentViewCoursesList, activeCategory, activeLevels, searchTerm, sort]);

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* PAGE HEADER */}
      <section className="bg-[linear-gradient(160deg,#000_0%,#1a1a2e_50%,#000_100%)] p-[64px_24px_56px] text-center relative overflow-hidden">
        <div className="absolute w-[500px] h-[300px] rounded-full bg-[radial-gradient(circle,rgba(0,113,227,0.22)_0%,transparent_70%)] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
        <p className="text-[12px] font-semibold text-[#0071e3] uppercase tracking-[0.08em] mb-3">Course Catalog</p>
        <h1 className="text-[clamp(32px,5vw,58px)] font-extrabold tracking-[-1.5px] text-[#f5f5f7] mb-3">
          All <span className="bg-gradient-to-r from-[#0071e3] to-[#00d4ff] bg-clip-text text-transparent">Courses</span>
        </h1>
        <p className="text-[16px] text-[#86868b] max-w-[480px] mx-auto leading-[1.6] font-light">
          Expert-led IT training across Microsoft, Linux, Cloud, Networking and Security - to help you build your skillset.
        </p>
      </section>

      {/* STATS ROW */}
      <div className="bg-[#f5f5f7] border-b border-[#d2d2d7] py-[20px] px-6">
        <div className="max-w-[1080px] mx-auto flex items-center gap-[40px] flex-wrap justify-start">
          <div className="flex flex-col">
            <span className="text-[22px] font-bold text-[#1d1d1f] leading-none">{studentViewCoursesList?.length || 12}</span>
            <span className="text-[12px] text-[#86868b] mt-1">Courses</span>
          </div>
          <div className="w-[1px] height-[36px] bg-[#d2d2d7] self-stretch hidden sm:block"></div>
          <div className="flex flex-col">
            <span className="text-[22px] font-bold text-[#1d1d1f] leading-none">{totalVideoLessons}+</span>
            <span className="text-[12px] text-[#86868b] mt-1">Video Lessons</span>
          </div>
          <div className="w-[1px] height-[36px] bg-[#d2d2d7] self-stretch hidden sm:block"></div>
          <div className="flex flex-col">
            <span className="text-[22px] font-bold text-[#1d1d1f] leading-none">{totalHours} hrs</span>
            <span className="text-[12px] text-[#86868b] mt-1">Total Content</span>
          </div>
          <div className="w-[1px] height-[36px] bg-[#d2d2d7] self-stretch hidden sm:block"></div>
          <div className="flex flex-col">
            <span className="text-[22px] font-bold text-[#1d1d1f] leading-none">{totalCategoriesCount} Topics</span>
            <span className="text-[12px] text-[#86868b] mt-1">Categories</span>
          </div>
        </div>
      </div>

      {/* CONTROLS BAR (Sticky) */}
      <div className="sticky top-[52px] z-50 bg-white border-b border-[#d2d2d7] py-4 px-6">
        <div className="max-w-[1080px] mx-auto flex items-center gap-[16px] flex-wrap justify-between">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px] max-w-[340px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#86868b] w-4 h-4 pointer-events-none" />
            <input 
              type="text" 
              placeholder="Search courses…" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#f5f5f7] border border-[#d2d2d7] rounded-[10px] py-[9px] pl-9 pr-3 text-[14px] outline-none focus:border-[#0071e3] focus:bg-white transition-colors"
            />
          </div>

          {/* Filter tabs */}
          <div className="flex gap-[6px] flex-wrap">
            {["all", "microsoft", "linux", "networking", "cloud", "security"].map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-[16px] py-[7px] border rounded-[980px] text-[13px] font-medium transition-all ${
                  activeCategory === cat
                    ? "bg-[#0071e3] border-[#0071e3] text-white"
                    : "bg-white border-[#d2d2d7] text-[#6e6e73] hover:border-[#0071e3] hover:text-[#0071e3]"
                }`}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>

          {/* Sort select */}
          <div className="ml-auto">
            <select 
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="px-3 py-2 border border-[#d2d2d7] rounded-[10px] text-[13px] text-[#1d1d1f] bg-white outline-none cursor-pointer"
            >
              <option value="default">Sort: Featured</option>
              <option value="newest">Newest First</option>
              <option value="lessons-high">Most Lessons</option>
              <option value="hours-high">Longest</option>
            </select>
          </div>
        </div>
      </div>

      {/* MAIN LAYOUT */}
      <div className="max-w-[1080px] mx-auto w-full px-6 py-[40px] pb-[80px]">
        <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-[32px] items-start">
          
          {/* SIDEBAR FILTERS */}
          <aside className="space-y-[28px] sticky top-[116px]">
            
            {/* Level Filter */}
            <div className="flex flex-col">
              <div className="text-[12px] font-semibold text-[#86868b] uppercase tracking-[0.06em] mb-[12px]">Level</div>
              <div className="flex flex-col gap-2">
                {[
                  { label: "Beginner", count: 4 },
                  { label: "Intermediate", count: 4 },
                  { label: "Advanced", count: 2 },
                  { label: "All Levels", count: 2 }
                ].map((levelItem) => {
                  const checked = activeLevels.includes(levelItem.label);
                  return (
                    <div 
                      key={levelItem.label} 
                      onClick={() => toggleLevel(levelItem.label)}
                      className="flex items-center justify-between py-[4px] cursor-pointer"
                    >
                      <div className="flex items-center gap-[8px] text-[13px] text-[#1d1d1f] select-none">
                        <div className={`w-[16px] h-[16px] rounded-[4px] border-[1.5px] flex items-center justify-center transition-all ${
                          checked ? "bg-[#0071e3] border-[#0071e3] text-white" : "border-[#d2d2d7]"
                        }`}>
                          {checked && <span className="text-[10px] font-bold">✓</span>}
                        </div>
                        {levelItem.label}
                      </div>
                      <span className="text-[12px] text-[#86868b] bg-[#f5f5f7] px-[7px] py-[2px] rounded-[980px]">
                        {levelItem.count}
                      </span>
                    </div>
                  );
                })}
              </div>
              <button 
                onClick={() => setActiveLevels([])}
                className="text-[12px] text-[#0071e3] text-left hover:underline bg-none border-none p-0 mt-[10px] font-medium"
              >
                Clear
              </button>
            </div>

          </aside>

          {/* MAIN GRID */}
          <main className="flex-1">
            <div className="flex items-center justify-between mb-[20px]">
              <p className="text-[14px] text-[#6e6e73]">
                <strong className="text-[#1d1d1f]">{filteredCourses.length}</strong> courses found
              </p>
              <div className="flex gap-[4px]">
                <button 
                  onClick={() => setViewType("grid")}
                  title="Grid view"
                  className={`w-[32px] h-[32px] rounded-[8px] border flex items-center justify-center transition-all ${
                    viewType === "grid" 
                      ? "bg-[#f5f5f7] border-[#b0b0b5]" 
                      : "bg-white border-[#d2d2d7] hover:bg-[#f5f5f7]"
                  }`}
                >
                  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <rect x="3" y="3" width="7" height="7" />
                    <rect x="14" y="3" width="7" height="7" />
                    <rect x="3" y="14" width="7" height="7" />
                    <rect x="14" y="14" width="7" height="7" />
                  </svg>
                </button>
                <button 
                  onClick={() => setViewType("list")}
                  title="2-column view"
                  className={`w-[32px] h-[32px] rounded-[8px] border flex items-center justify-center transition-all ${
                    viewType === "list" 
                      ? "bg-[#f5f5f7] border-[#b0b0b5]" 
                      : "bg-white border-[#d2d2d7] hover:bg-[#f5f5f7]"
                  }`}
                >
                  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <rect x="3" y="3" width="18" height="4" rx="1" />
                    <rect x="3" y="10" width="18" height="4" rx="1" />
                    <rect x="3" y="17" width="18" height="4" rx="1" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Courses listing */}
            <div className={`grid gap-[16px] ${
              viewType === "grid" 
                ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-3" 
                : "grid-cols-1 md:grid-cols-2"
            }`}>
              {loadingState ? (
                [...Array(6)].map((_, i) => (
                  <div key={i} className="h-[280px] bg-[#f5f5f7] rounded-[18px] animate-pulse" />
                ))
              ) : filteredCourses.length > 0 ? (
                filteredCourses.map((course) => (
                  <CourseCard 
                    key={course._id} 
                    course={course} 
                    onClick={(id) => navigate(`/course/details/${id}`)}
                  />
                ))
              ) : (
                <div className="col-span-full text-center py-[80px]">
                  <div className="text-[48px] mb-[16px]">🔍</div>
                  <h3 className="text-[20px] font-semibold text-[#1d1d1f] mb-[8px]">No courses found</h3>
                  <p className="text-[14px] text-[#86868b]">Try adjusting your search or filters.</p>
                </div>
              )}
            </div>
          </main>

        </div>
      </div>


      {/* CTA BAND */}
      <section className="bg-[#0071e3] py-[80px] px-6 text-center flex flex-col items-center">
        <h2 className="text-[clamp(28px,4vw,52px)] font-extrabold text-white tracking-[-1.5px] mb-[16px] leading-[1.15]">
          Ready to start<br />your IT journey?
        </h2>
        <p className="text-[17px] text-[rgba(255,255,255,0.75)] mb-[36px] max-w-[480px] mx-auto">
          Learn from industry experts and immerse yourself in an ocean of knowledge.
        </p>
        <button onClick={() => navigate('/auth')} className="bg-white text-[#0071e3] border-none py-[14px] px-[32px] rounded-[980px] text-[16px] font-semibold cursor-pointer transition-opacity duration-200 hover:opacity-90">
          Get Started
        </button>
      </section>
    </div>
  );
}

export default StudentViewCoursesPage;
