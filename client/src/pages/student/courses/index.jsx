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
import { Skeleton } from "@/components/ui/skeleton";
import { filterOptions, sortOptions } from "@/config";
import { AuthContext } from "@/context/auth-context";
import { StudentContext } from "@/context/student-context";
import {
  checkCoursePurchaseInfoService,
  fetchStudentViewCourseListService,
  getHomeConfigService,
} from "@/services";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpDown, Filter, ShoppingCart, Layers, TvMinimalPlay, X, SlidersHorizontal } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const {
    studentViewCoursesList,
    setStudentViewCoursesList,
    loadingState,
    setLoadingState,
    cartItems,
    handleAddToCart,
    studentBoughtCoursesList,
  } = useContext(StudentContext);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { auth } = useContext(AuthContext);

  function handleFilterOnChange(getSectionId, getCurrentOption) {
    let cpyFilters = { ...filters };
    const indexOfCurrentSection = Object.keys(cpyFilters).indexOf(getSectionId);
    if (indexOfCurrentSection === -1) {
      cpyFilters[getSectionId] = [getCurrentOption.id];
    } else {
      const indexOfCurrentOption = cpyFilters[getSectionId].indexOf(getCurrentOption.id);
      if (indexOfCurrentOption === -1)
        cpyFilters[getSectionId] = [...cpyFilters[getSectionId], getCurrentOption.id];
      else {
        const updatedSection = [...cpyFilters[getSectionId]];
        updatedSection.splice(indexOfCurrentOption, 1);
        cpyFilters[getSectionId] = updatedSection;
      }
    }
    setFilters(cpyFilters);
    sessionStorage.setItem("filters", JSON.stringify(cpyFilters));
  }

  async function fetchAllStudentViewCourses(filters, sort) {
    setLoadingState(true);
    try {
      const buildQueryStringForFilters = createSearchParamsHelper(filters);
      const query = new URLSearchParams(buildQueryStringForFilters);
      if (sort) query.set("sortBy", sort);
      const response = await fetchStudentViewCourseListService(query.toString());
      if (response?.success) setStudentViewCoursesList(response?.data);
    } catch (error) {
      console.error(error);
      toast({ title: "Error", description: "Failed to fetch courses.", variant: "destructive" });
    } finally {
      setLoadingState(false);
    }
  }

  async function handleCourseNavigate(getCurrentCourseId) {
    if (!auth?.authenticate) { navigate(`/course/details/${getCurrentCourseId}`); return; }
    const response = await checkCoursePurchaseInfoService(getCurrentCourseId, auth?.user?._id);
    if (response?.success) {
      navigate(response?.data ? `/course-progress/${getCurrentCourseId}` : `/course/details/${getCurrentCourseId}`);
    }
  }

  async function handleAddToCartLocal(courseId) {
    if (!auth?.authenticate) {
      toast({ title: "Please Sign In", description: "You need to be signed in to add courses to your cart.", variant: "destructive" });
      navigate("/auth"); return;
    }
    if (cartItems.some(item => item.courseId === courseId)) { navigate("/cart"); return; }
    const response = await handleAddToCart(courseId, auth?.user?._id);
    if (response?.success) toast({ title: "Added to Cart", description: "The course has been added to your cart successfully." });
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
    setFilters(Object.keys(initialFilters).length > 0 ? initialFilters : JSON.parse(sessionStorage.getItem("filters") || "{}"));
    setSort(queryParams.get("sortBy") || "price-lowtohigh");
  }, []);

  useEffect(() => { if (filters !== null && sort !== null) fetchAllStudentViewCourses(filters, sort); }, [filters, sort]);
  useEffect(() => { return () => { sessionStorage.removeItem("filters"); }; }, []);

  const FilterSidebar = ({ onClose }) => (
    <div className="bg-white rounded-[24px] xs:rounded-[32px] border border-zinc-200/60 p-5 xs:p-8 shadow-sm">
      <div className="flex items-center justify-between mb-6 xs:mb-8 text-zinc-900">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 xs:h-5 xs:w-5" />
          <h2 className="font-bold text-sm xs:text-base">Filters</h2>
        </div>
        {onClose && (
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-zinc-100 text-zinc-500 min-w-[44px] min-h-[44px] flex items-center justify-center">
            <X className="h-5 w-5" />
          </button>
        )}
      </div>
      <div className="space-y-6 xs:space-y-10">
        {Object.keys(filterOptions).map((keyItem) => (
          <div key={keyItem}>
            <h3 className="text-[10px] xs:text-xs font-bold text-zinc-400 uppercase tracking-widest mb-3 xs:mb-4">{keyItem}</h3>
            <div className="grid gap-2 xs:gap-3">
              {filterOptions[keyItem].map((option) => (
                <Label key={option.id} className="flex items-center gap-2 xs:gap-3 cursor-pointer group">
                  <Checkbox
                    id={option.id}
                    checked={filters[keyItem]?.indexOf(option.id) > -1}
                    onCheckedChange={() => handleFilterOnChange(keyItem, option)}
                    className="rounded-md border-zinc-300 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600 h-4 w-4 xs:h-5 xs:w-5"
                  />
                  <span className={`text-sm xs:text-[15px] font-medium transition-colors ${filters[keyItem]?.indexOf(option.id) > -1 ? "text-zinc-900 font-bold" : "text-zinc-500 group-hover:text-zinc-800"}`}>
                    {option.label}
                  </span>
                </Label>
              ))}
            </div>
          </div>
        ))}
      </div>
      <Button
        variant="ghost"
        className="w-full mt-6 xs:mt-10 text-zinc-400 border border-zinc-100 rounded-xl xs:rounded-2xl h-10 xs:h-12 hover:bg-zinc-50 font-bold text-sm"
        onClick={() => { setFilters({}); sessionStorage.removeItem("filters"); }}
      >
        Clear all filters
      </Button>
    </div>
  );

  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="container mx-auto px-4 xs:px-5 lg:px-8 py-8 xs:py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col xs:flex-row xs:items-end justify-between mb-8 xs:mb-12 gap-4"
        >
          <div>
            <h1 className="text-3xl xs:text-4xl md:text-[50px] font-bold tracking-tight text-zinc-900 mb-1 xs:mb-2">Explore Courses</h1>
            <p className="text-zinc-500 font-medium text-sm xs:text-base">Discover your next passion from our curated catalog.</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-zinc-400 bg-zinc-100 px-3 py-1 rounded-full">
              {studentViewCoursesList.length} Results
            </span>
            {/* Mobile Filter Button */}
            <Button
              variant="outline"
              onClick={() => setIsFilterOpen(true)}
              className="lg:hidden flex items-center gap-2 h-10 xs:h-11 px-4 rounded-full border-zinc-200 bg-white shadow-sm font-bold text-zinc-700 text-sm"
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filters
              {Object.values(filters).flat().length > 0 && (
                <span className="bg-blue-600 text-white text-xs font-bold h-5 w-5 rounded-full flex items-center justify-center">
                  {Object.values(filters).flat().length}
                </span>
              )}
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="flex items-center gap-2 h-10 xs:h-11 px-4 xs:px-5 rounded-full border-zinc-200 bg-white shadow-sm hover:shadow-md transition-all font-bold text-zinc-700 text-sm"
                >
                  <ArrowUpDown className="h-3.5 w-3.5 xs:h-4 xs:w-4" />
                  <span>Sort</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[180px] xs:w-[200px] rounded-2xl p-2 shadow-2xl border-zinc-100">
                <DropdownMenuRadioGroup value={sort} onValueChange={(value) => setSort(value)}>
                  {sortOptions.map((sortItem) => (
                    <DropdownMenuRadioItem value={sortItem.id} key={sortItem.id} className="rounded-xl cursor-pointer py-2 xs:py-2.5 font-medium text-sm">
                      {sortItem.label}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-6 xs:gap-8 md:gap-12">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-72 shrink-0">
            <div className="sticky top-24 xs:top-28">
              <FilterSidebar />
            </div>
          </aside>

          {/* Mobile Filter Drawer */}
          <AnimatePresence>
            {isFilterOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 z-[2000] lg:hidden"
                onClick={() => setIsFilterOpen(false)}
              >
                <motion.div
                  initial={{ x: "-100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: "-100%" }}
                  transition={{ type: "spring", damping: 25, stiffness: 200 }}
                  className="absolute left-0 top-0 bottom-0 w-full max-w-sm bg-slate-50 overflow-y-auto p-4 xs:p-6"
                  onClick={e => e.stopPropagation()}
                >
                  <FilterSidebar onClose={() => setIsFilterOpen(false)} />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Course List */}
          <main className="flex-1">
            <AnimatePresence mode="popLayout">
              {loadingState ? (
                <div className="grid gap-4 xs:gap-6">
                  {[...Array(4)].map((_, i) => (
                    <Skeleton key={i} className="h-[160px] xs:h-[200px] w-full rounded-[24px] xs:rounded-[32px]" />
                  ))}
                </div>
              ) : studentViewCoursesList && studentViewCoursesList.length > 0 ? (
                <motion.div layout className="grid gap-4 xs:gap-6">
                  {studentViewCoursesList.map((courseItem) => (
                    <motion.div
                      layout
                      key={courseItem?._id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      whileHover={{ y: -5 }}
                      onClick={() => handleCourseNavigate(courseItem?._id)}
                      className="group cursor-pointer bg-white rounded-[24px] xs:rounded-[32px] border border-zinc-200/60 p-4 xs:p-6 flex flex-col sm:flex-row gap-4 xs:gap-6 md:gap-8 shadow-sm hover:shadow-xl hover:border-zinc-300 transition-all duration-300 overflow-hidden"
                    >
                      <div className="w-full sm:w-48 md:w-72 h-36 xs:h-44 rounded-xl xs:rounded-2xl overflow-hidden relative shrink-0">
                        <img
                          src={courseItem?.image}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                      </div>

                      <div className="flex-1 flex flex-col py-0 xs:py-1">
                        <div className="flex items-start justify-between gap-4 mb-1.5 xs:mb-2">
                          <h3 className="text-base xs:text-xl font-bold text-zinc-900 group-hover:text-blue-600 transition-colors leading-tight line-clamp-2">
                            {courseItem?.title}
                          </h3>
                        </div>
                        <p className="text-xs xs:text-[15px] font-medium text-zinc-500 mb-3 xs:mb-4">
                          By <span className="text-zinc-800 font-bold">{courseItem?.instructorName}</span>
                        </p>
                        <div className="flex flex-wrap items-center gap-2 xs:gap-3 mt-auto mb-3 xs:mb-4">
                          <span className="flex items-center gap-1.5 px-2 xs:px-3 py-1 bg-zinc-100 rounded-full text-[10px] xs:text-xs font-bold text-zinc-600">
                            <Layers className="h-3 w-3" />
                            {courseItem?.curriculum?.length} Lectures
                          </span>
                          <span className="px-2 xs:px-3 py-1 bg-blue-50 rounded-full text-[10px] xs:text-xs font-bold text-blue-600 uppercase tracking-wider">
                            {courseItem?.level}
                          </span>
                        </div>
                        <div className="pt-3 xs:pt-4 border-t border-zinc-100 flex items-center justify-between">
                          <div className="flex flex-col">
                            <div className="flex items-center gap-1 mb-1">
                              <span className="text-zinc-900 font-bold text-sm xs:text-base">4.8</span>
                              <div className="flex text-yellow-500 text-xs">★★★★★</div>
                            </div>
                            <p className="text-lg xs:text-2xl font-extrabold text-zinc-900 tracking-tighter">₹{courseItem?.pricing}</p>
                          </div>
                          {studentBoughtCoursesList.some(item => item.courseId === courseItem?._id) ? (
                            <Button
                              onClick={(e) => { e.stopPropagation(); navigate(`/course-progress/${courseItem?._id}`); }}
                              className="bg-emerald-600 text-white hover:bg-emerald-700 rounded-xl xs:rounded-2xl h-10 xs:h-12 px-4 xs:px-6 flex items-center gap-1.5 xs:gap-2 font-bold shadow-lg shadow-emerald-900/10 active:scale-95 transition-all text-xs xs:text-sm"
                            >
                              <TvMinimalPlay className="w-3.5 h-3.5 xs:w-4 xs:h-4" />
                              Continue
                            </Button>
                          ) : (
                            <Button
                              onClick={(e) => { e.stopPropagation(); handleAddToCartLocal(courseItem?._id); }}
                              className="bg-zinc-900 text-white hover:bg-zinc-800 rounded-xl xs:rounded-2xl h-10 xs:h-12 px-4 xs:px-6 flex items-center gap-1.5 xs:gap-2 font-bold shadow-lg shadow-zinc-900/10 active:scale-95 transition-all text-xs xs:text-sm"
                            >
                              <ShoppingCart className="w-3.5 h-3.5 xs:w-4 xs:h-4" />
                              {cartItems.some(item => item.courseId === courseItem?._id) ? "Go to Cart" : "Add"}
                            </Button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center py-20 xs:py-32 text-center"
                >
                  <div className="w-16 h-16 xs:w-20 xs:h-20 bg-zinc-100 rounded-full flex items-center justify-center mb-4 xs:mb-6">
                    <Filter className="h-8 w-8 xs:h-10 xs:w-10 text-zinc-300" />
                  </div>
                  <h2 className="text-xl xs:text-2xl font-bold text-zinc-900 mb-2">No Courses Found</h2>
                  <p className="text-zinc-500 font-medium text-sm xs:text-base">Try adjusting your filters to find what you're looking for.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </main>
        </div>
      </div>
    </div>
  );
}

export default StudentViewCoursesPage;
