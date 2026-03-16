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
    <div className="bg-white rounded-sm border border-[#e6e6e6] p-6">
      <div className="flex items-center justify-between mb-6 text-black">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          <h2 className="font-semibold text-base">Filters</h2>
        </div>
        {onClose && (
          <button onClick={onClose} className="p-2 rounded-sm hover:bg-[#f2f2f2] text-[#616161]">
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
      <div className="space-y-8">
        {Object.keys(filterOptions).map((keyItem) => (
          <div key={keyItem}>
            <h3 className="text-[10px] font-semibold text-[#616161] uppercase tracking-wider mb-3">{keyItem}</h3>
            <div className="grid gap-2">
              {filterOptions[keyItem].map((option) => (
                <Label key={option.id} className="flex items-center gap-2 cursor-pointer group">
                  <Checkbox
                    id={option.id}
                    checked={filters[keyItem]?.indexOf(option.id) > -1}
                    onCheckedChange={() => handleFilterOnChange(keyItem, option)}
                    className="rounded-sm border-[#d2d2d2] data-[state=checked]:bg-[#0067b8] data-[state=checked]:border-[#0067b8] h-4 w-4 transition-none"
                  />
                  <span className={`text-sm font-normal transition-colors ${filters[keyItem]?.indexOf(option.id) > -1 ? "text-black font-semibold" : "text-[#616161] group-hover:text-black"}`}>
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
        className="w-full mt-8 text-[#616161] border border-[#e6e6e6] rounded-sm h-10 hover:bg-[#f2f2f2] font-semibold text-sm transition-none"
        onClick={() => { setFilters({}); sessionStorage.removeItem("filters"); }}
      >
        Clear all filters
      </Button>
    </div>
  );

  return (
    <div className="bg-[#f2f2f2] min-h-screen">
      <div className="container mx-auto px-4 xs:px-5 lg:px-6 py-12">
        {/* Header */}
        <div className="flex flex-col xs:flex-row xs:items-end justify-between mb-10 gap-4">
          <div>
            <h1 className="text-3xl xs:text-4xl md:text-5xl font-semibold tracking-tight text-black mb-2">Explore Courses</h1>
            <p className="text-[#616161] font-normal text-sm xs:text-base">Browse our full catalog of specialized learning content.</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-semibold text-[#616161] bg-white border border-[#e6e6e6] px-3 py-1 rounded-sm uppercase tracking-wider">
              {studentViewCoursesList.length} Results
            </span>
            {/* Mobile Filter Button */}
            <Button
              variant="outline"
              onClick={() => setIsFilterOpen(true)}
              className="lg:hidden flex items-center gap-2 h-10 px-4 rounded-sm border-[#e6e6e6] bg-white font-semibold text-black text-sm transition-none"
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filters
              {Object.values(filters).flat().length > 0 && (
                <span className="bg-[#0067b8] text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                  {Object.values(filters).flat().length}
                </span>
              )}
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="flex items-center gap-2 h-10 px-4 rounded-sm border-[#e6e6e6] bg-white hover:bg-[#f2f2f2] transition-none font-semibold text-black text-sm"
                >
                  <ArrowUpDown className="h-4 w-4" />
                  <span>Sort By</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[180px] rounded-sm p-1 shadow-lg bg-white border-[#e6e6e6]">
                <DropdownMenuRadioGroup value={sort} onValueChange={(value) => setSort(value)}>
                  {sortOptions.map((sortItem) => (
                    <DropdownMenuRadioItem value={sortItem.id} key={sortItem.id} className="rounded-sm cursor-pointer py-2 font-semibold text-xs hover:bg-[#f2f2f2] transition-none">
                      {sortItem.label}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-72 shrink-0">
            <div className="sticky top-28">
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
                className="fixed inset-0 bg-black/40 z-[2000] lg:hidden"
                onClick={() => setIsFilterOpen(false)}
              >
                <motion.div
                  initial={{ x: "-100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: "-100%" }}
                  transition={{ type: "tween", duration: 0.3 }}
                  className="absolute left-0 top-0 bottom-0 w-full max-w-xs bg-[#f2f2f2] overflow-y-auto p-6"
                  onClick={e => e.stopPropagation()}
                >
                  <FilterSidebar onClose={() => setIsFilterOpen(false)} />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Course List */}
          <main className="flex-1">
            <div className="space-y-4">
              {loadingState ? (
                <div className="space-y-4">
                  {[...Array(4)].map((_, i) => (
                    <Skeleton key={i} className="h-[180px] w-full rounded-sm" />
                  ))}
                </div>
              ) : studentViewCoursesList && studentViewCoursesList.length > 0 ? (
                <div className="space-y-4">
                  {studentViewCoursesList.map((courseItem) => (
                    <div
                      key={courseItem?._id}
                      onClick={() => handleCourseNavigate(courseItem?._id)}
                      className="group cursor-pointer bg-white rounded-sm border border-[#e6e6e6] p-4 flex flex-col sm:flex-row gap-6 shadow-sm hover:border-[#0067b8]/40 transition-colors overflow-hidden"
                    >
                      <div className="w-full sm:w-60 h-36 rounded-sm overflow-hidden relative shrink-0">
                        <img
                          src={courseItem?.image}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>

                      <div className="flex-1 flex flex-col py-1">
                        <div className="flex items-start justify-between gap-4 mb-2">
                          <h3 className="text-lg font-semibold text-black group-hover:text-[#0067b8] transition-colors leading-tight line-clamp-2">
                            {courseItem?.title}
                          </h3>
                        </div>
                        <p className="text-xs font-normal text-[#616161] mb-4">
                          By <span className="text-black font-semibold">{courseItem?.instructorName}</span>
                        </p>
                        <div className="flex flex-wrap items-center gap-3 mt-auto mb-4">
                          <span className="flex items-center gap-1.5 px-2 py-0.5 bg-[#f2f2f2] rounded-sm text-[10px] font-semibold text-[#616161]">
                            <Layers className="h-3 w-3" />
                            {courseItem?.curriculum?.length} Lectures
                          </span>
                          <span className="px-2 py-0.5 bg-[#0067b8]/5 rounded-sm text-[10px] font-semibold text-[#0067b8] uppercase tracking-wider">
                            {courseItem?.level}
                          </span>
                        </div>
                        <div className="pt-4 border-t border-[#f2f2f2] flex items-center justify-between">
                          <div className="flex flex-col">
                            <div className="flex items-center gap-1 mb-1">
                              <span className="text-black font-semibold text-sm">4.8</span>
                              <div className="flex text-black text-xs">★★★★★</div>
                            </div>
                            <p className="text-xl font-bold text-black tracking-tight">₹{courseItem?.pricing}</p>
                          </div>
                          {studentBoughtCoursesList.some(item => item.courseId === courseItem?._id) ? (
                            <Button
                              onClick={(e) => { e.stopPropagation(); navigate(`/course-progress/${courseItem?._id}`); }}
                              className="bg-[#0067b8] text-white hover:bg-[#005a9e] rounded-sm h-10 px-6 flex items-center gap-2 font-semibold transition-none text-xs"
                            >
                              <TvMinimalPlay className="w-4 h-4" />
                              Continue
                            </Button>
                          ) : (
                            <Button
                              onClick={(e) => { e.stopPropagation(); handleAddToCartLocal(courseItem?._id); }}
                              className="bg-black text-white hover:bg-zinc-800 rounded-sm h-10 px-6 flex items-center gap-2 font-semibold transition-none text-xs"
                            >
                              <ShoppingCart className="w-4 h-4" />
                              {cartItems.some(item => item.courseId === courseItem?._id) ? "Go to Cart" : "Add to Cart"}
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="w-16 h-16 bg-[#f2f2f2] rounded-full flex items-center justify-center mb-6">
                    <Filter className="h-8 w-8 text-[#d2d2d2]" />
                  </div>
                  <h2 className="text-xl font-semibold text-black mb-2">No Courses Found</h2>
                  <p className="text-[#616161] font-normal text-sm">Try adjusting your filters to find what you're looking for.</p>
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
