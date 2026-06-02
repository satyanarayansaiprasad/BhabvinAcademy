import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { filterOptions, sortOptions, courseCategories } from "@/config";
import { StudentContext } from "@/context/student-context";
import { fetchStudentViewCourseListService } from "@/services";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Search, Grid, List } from "lucide-react";
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

  function handleFilterOnChange(getSectionId, getCurrentOptionId) {
    let cpyFilters = { ...filters };
    if (getCurrentOptionId === null) {
      delete cpyFilters[getSectionId];
    } else {
      if (!cpyFilters[getSectionId]) {
        cpyFilters[getSectionId] = [getCurrentOptionId];
      } else {
        const index = cpyFilters[getSectionId].indexOf(getCurrentOptionId);
        if (index === -1) cpyFilters[getSectionId].push(getCurrentOptionId);
        else cpyFilters[getSectionId].splice(index, 1);
      }
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
    
    const searchFromUrl = queryParams.get("search");
    if (searchFromUrl) {
      setSearchTerm(searchFromUrl);
    }
  }, []);

  useEffect(() => {
    fetchAllCourses(filters, sort);
  }, [filters, sort]);

  // Derived filtered list for local search
  const filteredCourses = studentViewCoursesList?.filter(course => 
    course.title.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  return (
    <div className="flex flex-col min-h-screen bg-surface font-body text-on-surface">
      {/* PAGE HEADER */}
      <section className="bg-surface-container-low py-16 px-6 text-center relative overflow-hidden border-b border-transparent">
        <div className="max-w-4xl mx-auto z-10 relative">
          <p className="text-[12px] font-headline font-bold text-primary uppercase tracking-[0.08em] mb-3">Clinical Database</p>
          <h1 className="text-[clamp(32px,5vw,48px)] font-headline font-extrabold tracking-tight text-on-surface mb-4">
            Expert Product <span className="text-primary">Reviews & Ratings</span>
          </h1>
          <p className="text-[16px] text-on-surface-variant max-w-[600px] mx-auto leading-[1.6] font-body">
            Unbiased analysis of wellness products and dietary supplements. We grade safety, purity, and clinical dosing guidelines.
          </p>
        </div>
      </section>

      {/* STATS ROW */}
      <div className="bg-surface py-6 px-6 border-b border-slate-100">
        <div className="max-w-[1080px] mx-auto flex items-center justify-center gap-12 flex-wrap">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-primary text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
            <div className="flex flex-col text-left">
              <span className="text-xl font-headline font-bold text-on-surface">{studentViewCoursesList?.length || 0}</span>
              <span className="text-[11px] text-slate-500 font-label">Active Reviews</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-primary text-3xl">clinical_notes</span>
            <div className="flex flex-col text-left">
              <span className="text-xl font-headline font-bold text-on-surface">600+</span>
              <span className="text-[11px] text-slate-500 font-label">Tested Ingredients</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-primary text-3xl">verified_user</span>
            <div className="flex flex-col text-left">
              <span className="text-xl font-headline font-bold text-on-surface">100%</span>
              <span className="text-[11px] text-slate-500 font-label">Independent Lab Reports</span>
            </div>
          </div>
        </div>
      </div>

      {/* CONTROLS BAR (Sticky below header) */}
      <div className="sticky top-[56px] z-30 bg-surface-container-lowest/85 backdrop-blur-xl border-b border-slate-100 py-4 px-6 overflow-x-auto overflow-y-hidden">
        <div className="max-w-[1080px] mx-auto flex items-center gap-4 min-w-max">
          <div className="relative w-[280px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-outline w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search reviews..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-surface-container-low border-none focus:ring-2 focus:ring-primary/20 rounded-xl py-2 pl-9 pr-3 text-xs text-on-surface outline-none transition-colors"
            />
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={() => handleFilterOnChange("category", null)}
              className={`px-4 py-2 rounded-full text-xs font-headline font-bold whitespace-nowrap transition-all ${
                (!filters.category || filters.category.length === 0)
                  ? "bg-primary text-white shadow-sm"
                  : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high"
              }`}
            >
              All Categories
            </button>
            {courseCategories.map((cat) => {
              const isActive = filters.category?.includes(cat.id);
              return (
                <button 
                  key={cat.id}
                  onClick={() => handleFilterOnChange("category", cat.id)}
                  className={`px-4 py-2 rounded-full text-xs font-headline font-bold whitespace-nowrap transition-all ${
                    isActive
                      ? "bg-primary text-white shadow-sm"
                      : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high"
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
          
          <div className="ml-auto">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high border-none rounded-xl text-xs font-headline font-bold h-auto py-2.5 px-4 shadow-none">
                  Sort: {sortOptions.find(s => s.id === sort)?.label || "Featured"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="rounded-xl border-slate-100">
                <DropdownMenuRadioGroup value={sort} onValueChange={setSort}>
                  {sortOptions.map((opt) => (
                    <DropdownMenuRadioItem key={opt.id} value={opt.id} className="text-xs font-body font-semibold">
                      {opt.label}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="max-w-[1128px] mx-auto w-full px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-8">
          {/* SIDEBAR FILTERS */}
          <aside className="hidden lg:block space-y-8 text-left">
            {Object.keys(filterOptions).map((key) => (
              <div key={key} className="flex flex-col">
                <h3 className="text-[11px] font-headline font-bold text-slate-500 uppercase tracking-wider mb-4">{key}</h3>
                <div className="flex flex-col gap-2">
                  {filterOptions[key].map((opt) => {
                    const isChecked = filters[key]?.includes(opt.id);
                    return (
                      <div 
                        key={opt.id} 
                        className="flex items-center justify-between group cursor-pointer py-1.5"
                        onClick={() => handleFilterOnChange(key, opt.id)}
                      >
                        <div className="flex items-center gap-3 text-sm text-on-surface font-body">
                          <div className={`w-4 h-4 rounded-md border flex items-center justify-center transition-all ${
                            isChecked 
                              ? "bg-primary border-primary text-white" 
                              : "border-outline-variant bg-surface-container-lowest group-hover:border-primary"
                          }`}>
                            {isChecked && (
                              <span className="material-symbols-outlined text-[10px] font-extrabold">check</span>
                            )}
                          </div>
                          <span className="group-hover:text-primary transition-colors text-xs font-medium">{opt.label}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
            <button 
              onClick={() => setFilters({})} 
              className="text-xs text-primary font-headline font-bold hover:underline p-0 mt-2 block"
            >
              Clear all filters
            </button>
          </aside>

          {/* MAIN GRID */}
          <main>
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-slate-500">
                Showing <strong className="text-on-surface font-semibold">{filteredCourses.length}</strong> reviews
              </p>
              <div className="flex gap-1">
                <button 
                  onClick={() => setViewType("grid")}
                  className={`p-2 rounded-xl border border-transparent transition-all ${viewType === "grid" ? "bg-surface-container-low text-primary" : "bg-transparent text-slate-400 hover:bg-surface-container-low"}`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button 
                   onClick={() => setViewType("list")}
                   className={`p-2 rounded-xl border border-transparent transition-all ${viewType === "list" ? "bg-surface-container-low text-primary" : "bg-transparent text-slate-400 hover:bg-surface-container-low"}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Catalog Grid/List Container */}
            <div className={`grid gap-6 ${viewType === "grid" ? "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3" : "grid-cols-1 md:grid-cols-2"}`}>
              {loadingState ? (
                [...Array(6)].map((_, i) => (
                  <div key={i} className="h-[280px] bg-surface-container-low rounded-2xl animate-pulse shadow-sm" />
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
                <div className="col-span-full py-20 text-center bg-surface-container-lowest rounded-2xl p-8 shadow-atmospheric">
                  <span className="material-symbols-outlined text-slate-300 text-5xl mb-4">search</span>
                  <h3 className="font-headline text-[18px] font-bold text-on-surface mb-2">No reviews found</h3>
                  <p className="text-slate-500 text-sm max-w-xs mx-auto">Try adjusting your filters or search terms.</p>
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
