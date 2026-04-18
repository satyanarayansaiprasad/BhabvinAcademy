import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { filterOptions, sortOptions } from "@/config";
import { AuthContext } from "@/context/auth-context";
import { StudentContext } from "@/context/student-context";
import { fetchStudentViewCourseListService } from "@/services";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Search, Grid, List, ChevronRight, Filter, X } from "lucide-react";
import CourseCard from "@/components/student-view/course-card";

function createSearchParamsHelper(filterParams) {
  const queryParams = [];
  for (const [key, value] of Object.entries(filterParams)) {
    if (Array.isArray(value) && value.length > 0) {
      const paramValue = value.join(",");
      queryParams.push(`${key}=${encodeURIComponent(paramValue)}`);
    }
  }
  return queryParams.join("&");
}

function StudentViewCoursesPage() {
  const [sort, setSort] = useState("price-lowtohigh");
  const [filters, setFilters] = useState({});
  const [searchParams, setSearchParams] = useSearchParams();
  const [viewType, setViewType] = useState("grid"); // grid | list
  const [searchTerm, setSearchTerm] = useState("");

  const {
    studentViewCoursesList,
    setStudentViewCoursesList,
    loadingState,
    setLoadingState,
  } = useContext(StudentContext);
  
  const navigate = useNavigate();
  const { auth } = useContext(AuthContext);

  function handleFilterOnChange(getSectionId, getCurrentOptionId) {
    let cpyFilters = { ...filters };
    if (!cpyFilters[getSectionId]) {
      cpyFilters[getSectionId] = [getCurrentOptionId];
    } else {
      const index = cpyFilters[getSectionId].indexOf(getCurrentOptionId);
      if (index === -1) cpyFilters[getSectionId].push(getCurrentOptionId);
      else cpyFilters[getSectionId].splice(index, 1);
    }
    setFilters(cpyFilters);
  }

  async function fetchAllCourses(filters, sort) {
    setLoadingState(true);
    const buildQueryStringForFilters = createSearchParamsHelper(filters);
    const query = new URLSearchParams(buildQueryStringForFilters);
    if (sort) query.set("sortBy", sort);
    const response = await fetchStudentViewCourseListService(query.toString());
    if (response?.success) setStudentViewCoursesList(response?.data);
    setLoadingState(false);
  }

  useEffect(() => {
    const buildQueryStringForFilters = createSearchParamsHelper(filters);
    const query = new URLSearchParams(buildQueryStringForFilters);
    if (sort) query.set("sortBy", sort);
    setSearchParams(query);
  }, [filters, sort]);

  useEffect(() => {
    const initialFilters = {};
    const queryParams = new URLSearchParams(window.location.search);
    for (const [key, value] of queryParams.entries()) {
      if (key !== "sortBy") initialFilters[key] = value.split(",");
    }
    setFilters(initialFilters);
    setSort(queryParams.get("sortBy") || "price-lowtohigh");
  }, []);

  useEffect(() => {
    fetchAllCourses(filters, sort);
  }, [filters, sort]);

  // Derived filtered list for local search
  const filteredCourses = studentViewCoursesList?.filter(course => 
    course.title.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* PAGE HEADER */}
      <section className="bg-[linear-gradient(160deg,#000_0%,#1a1a2e_50%,#000_100%)] p-[64px_24px_56px] text-center relative overflow-hidden">
        <div className="absolute w-[500px] h-[300px] rounded-full bg-[radial-gradient(circle,rgba(0,113,227,0.22)_0%,transparent_70%)] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
        <p className="text-[12px] font-semibold text-[#0071e3] uppercase tracking-[0.08em] mb-3">Course Catalog</p>
        <h1 className="text-[clamp(32px,5vw,58px)] font-extrabold tracking-[-1.5px] text-[#f5f5f7] mb-3">
          All <span className="bg-[linear-gradient(90deg,#0071e3,#00d4ff)] bg-clip-text text-transparent italic">Courses</span>
        </h1>
        <p className="text-[16px] text-[#86868b] max-w-[480px] mx-auto leading-[1.6] font-light">
          Expert-led IT training across Microsoft, Linux, Cloud, Networking and Security - to help you build your skillset.
        </p>
      </section>

      {/* STATS ROW */}
      <div className="bg-[#f5f5f7] border-b border-[#d2d2d7] py-5 px-6">
        <div className="max-w-[1080px] mx-auto flex items-center gap-10 flex-wrap">
          <div className="flex flex-col">
            <span className="text-[22px] font-bold text-[#1d1d1f]">{studentViewCoursesList?.length || 0}</span>
            <span className="text-[12px] text-[#86868b]">Courses</span>
          </div>
          <div className="w-[1px] h-9 bg-[#d2d2d7] hidden sm:block"></div>
          <div className="flex flex-col">
            <span className="text-[22px] font-bold text-[#1d1d1f]">600+</span>
            <span className="text-[12px] text-[#86868b]">Lessons</span>
          </div>
          <div className="w-[1px] h-9 bg-[#d2d2d7] hidden sm:block"></div>
          <div className="flex flex-col">
            <span className="text-[22px] font-bold text-[#1d1d1f]">5 Topics</span>
            <span className="text-[12px] text-[#86868b]">Categories</span>
          </div>
        </div>
      </div>

      {/* CONTROLS BAR (Sticky) */}
      <div className="sticky top-[52px] z-50 bg-white border-b border-[#d2d2d7] py-4 px-6 overflow-x-auto overflow-y-hidden">
        <div className="max-w-[1080px] mx-auto flex items-center gap-4 min-w-max">
          <div className="relative w-[340px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#86868b] w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search courses..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#f5f5f7] border border-[#d2d2d7] rounded-[10px] py-[9px] pl-9 pr-3 text-[14px] outline-none focus:border-[#0071e3] transition-colors"
            />
          </div>
          <div className="flex gap-2">
            {["all", "microsoft", "linux", "networking", "cloud", "security"].map((cat) => (
              <button 
                key={cat}
                onClick={() => handleFilterOnChange("category", cat === "all" ? null : cat)}
                className={`px-4 py-[7px] border rounded-[980px] text-[13px] font-medium transition-all ${
                  (cat === "all" && !filters.category?.length) || filters.category?.includes(cat)
                    ? "bg-[#0071e3] border-[#0071e3] text-white"
                    : "bg-white border-[#d2d2d7] text-[#6e6e73] hover:border-[#0071e3] hover:text-[#0071e3]"
                }`}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>
          <div className="ml-auto">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="border-[#d2d2d7] rounded-[10px] text-[13px] h-auto py-2">
                  Sort: {sortOptions.find(s => s.id === sort)?.label || "Featured"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="rounded-[10px] border-[#d2d2d7]">
                <DropdownMenuRadioGroup value={sort} onValueChange={setSort}>
                  {sortOptions.map((opt) => (
                    <DropdownMenuRadioItem key={opt.id} value={opt.id} className="text-[13px]">
                      {opt.label}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="max-w-[1128px] mx-auto w-full px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-8">
          {/* SIDEBAR */}
          <aside className="hidden lg:block space-y-7">
            {Object.keys(filterOptions).map((key) => (
              <div key={key} className="flex flex-col">
                <h3 className="text-[12px] font-bold text-[#86868b] uppercase tracking-[0.06em] mb-3">{key}</h3>
                <div className="flex flex-col gap-2">
                  {filterOptions[key].map((opt) => (
                    <div 
                      key={opt.id} 
                      className="flex items-center justify-between group cursor-pointer py-1"
                      onClick={() => handleFilterOnChange(key, opt.id)}
                    >
                      <div className="flex items-center gap-2 text-[13px] text-[#1d1d1f]">
                        <div className={`w-4 h-4 border rounded-[4px] flex items-center justify-center transition-all ${
                          filters[key]?.includes(opt.id) ? "bg-[#0071e3] border-[#0071e3]" : "border-[#d2d2d7] group-hover:border-[#0071e3]"
                        }`}>
                          {filters[key]?.includes(opt.id) && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                        </div>
                        {opt.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            <button 
              onClick={() => setFilters({})} 
              className="text-[12px] text-[#0071e3] font-medium hover:underline p-0"
            >
              Clear all filters
            </button>
          </aside>

          {/* MAIN GRID */}
          <main>
            <div className="flex items-center justify-between mb-5">
              <p className="text-[14px] text-[#6e6e73]">
                <strong className="text-[#1d1d1f]">{filteredCourses.length}</strong> courses found
              </p>
              <div className="flex gap-1">
                <button 
                  onClick={() => setViewType("grid")}
                  className={`p-1.5 rounded-[8px] border transition-all ${viewType === "grid" ? "bg-[#f5f5f7] border-[#b0b0b5]" : "bg-white border-[#d2d2d7] hover:bg-[#f5f5f7]"}`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button 
                   onClick={() => setViewType("list")}
                   className={`p-1.5 rounded-[8px] border transition-all ${viewType === "list" ? "bg-[#f5f5f7] border-[#b0b0b5]" : "bg-white border-[#d2d2d7] hover:bg-[#f5f5f7]"}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className={`grid gap-4 ${viewType === "grid" ? "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3" : "grid-cols-1 md:grid-cols-2"}`}>
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
                <div className="col-span-full py-20 text-center">
                  <div className="text-[48px] mb-4">🔍</div>
                  <h3 className="text-[20px] font-bold text-[#1d1d1f] mb-2">No courses found</h3>
                  <p className="text-[#86868b] text-[15px]">Try adjusting your search or filters.</p>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default StudentViewCoursesPage;

