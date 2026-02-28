import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getHomeConfigService, updateHomeConfigService, fetchInstructorCourseListService } from "@/services";
import { Plus, Trash2, Save, Sparkles } from "lucide-react";
import { useEffect, useState, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AuthContext } from "@/context/auth-context";

function InstructorHomeConfig() {
    const [skillPillars, setSkillPillars] = useState([]);
    const [newSkill, setNewSkill] = useState("");
    const [studentReviews, setStudentReviews] = useState([]);
    const [newReview, setNewReview] = useState({ studentName: "", reviewText: "" });
    const [featuredSections, setFeaturedSections] = useState({
        trending: [],
        recent: [],
    });
    const [categories, setCategories] = useState([]);
    const [newCategory, setNewCategory] = useState({ id: "", label: "" });
    const [allCourses, setAllCourses] = useState([]);
    const [loading, setLoading] = useState(false);
    const { auth } = useContext(AuthContext);

    const [searchTerm, setSearchTerm] = useState("");

    async function fetchConfig() {
        const response = await getHomeConfigService();
        if (response?.success) {
            setSkillPillars(response?.data?.skillPillars || []);
            setStudentReviews(response?.data?.studentReviews || []);

            // Normalize sections to ensure we deal with IDs when updating but keep objects for display if needed
            // However, it's easier to store IDs in state and find objects from allCourses for display
            setFeaturedSections(response?.data?.featuredCourseSections || {
                trending: [],
                recent: [],
            });
            setCategories(response?.data?.categories || []);
        }
    }

    async function fetchAllCourses() {
        const response = await fetchInstructorCourseListService();
        if (response?.success) {
            setAllCourses(response?.data);
        }
    }

    async function handleUpdateConfig() {
        setLoading(true);

        // Ensure we only send IDs to the backend
        const processedSections = {
            trending: featuredSections.trending.map(c => c._id || c),
            recent: featuredSections.recent.map(c => c._id || c),
        };

        const response = await updateHomeConfigService({
            skillPillars,
            studentReviews,
            featuredCourseSections: processedSections,
            categories
        });
        if (response?.success) {
            alert("Home configuration updated successfully!");
            fetchConfig(); // Refresh to get populated data
        }
        setLoading(false);
    }

    function handleAddSkill() {
        if (newSkill.trim() !== "") {
            setSkillPillars([...skillPillars, { label: newSkill.trim() }]);
            setNewSkill("");
        }
    }

    function handleRemoveSkill(index) {
        setSkillPillars(skillPillars.filter((_, i) => i !== index));
    }

    function handleAddReview() {
        if (newReview.studentName.trim() !== "" && newReview.reviewText.trim() !== "") {
            setStudentReviews([
                ...studentReviews,
                { ...newReview, studentImage: `https://i.pravatar.cc/150?u=${Math.random()}` }
            ]);
            setNewReview({ studentName: "", reviewText: "" });
        }
    }

    function handleRemoveReview(index) {
        setStudentReviews(studentReviews.filter((_, i) => i !== index));
    }

    function handleAddCategory() {
        if (newCategory.id.trim() !== "" && newCategory.label.trim() !== "") {
            setCategories([...categories, { ...newCategory }]);
            setNewCategory({ id: "", label: "" });
        }
    }

    function handleRemoveCategory(index) {
        setCategories(categories.filter((_, i) => i !== index));
    }

    useEffect(() => {
        fetchConfig();
        fetchAllCourses();
    }, []);

    function toggleCourseInSection(section, course) {
        setFeaturedSections(prev => {
            const currentSection = Array.isArray(prev[section]) ? prev[section] : [];
            const isSelected = currentSection.some(c => (c._id || c) === course._id);

            const updatedSection = isSelected
                ? currentSection.filter(c => (c._id || c) !== course._id)
                : [...currentSection, course]; // We store the whole object for immediate UI feedback

            return {
                ...prev,
                [section]: updatedSection
            };
        });
    }

    const filteredCourses = allCourses.filter(course =>
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-[40px] border border-zinc-200/60 shadow-sm overflow-hidden"
        >
            <div className="p-10 border-b border-zinc-100 flex items-center justify-between gap-6">
                <div>
                    <h2 className="text-3xl font-black tracking-tighter text-zinc-900 mb-1">Home Config.</h2>
                    <p className="text-zinc-500 font-medium tracking-tight">Manage your platform's curated content.</p>
                </div>
                <Button
                    disabled={loading}
                    onClick={handleUpdateConfig}
                    className="bg-zinc-900 hover:bg-black text-white rounded-2xl h-14 px-8 font-bold shadow-lg shadow-zinc-100 transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
                >
                    <Save className="h-5 w-5" />
                    <span>{loading ? "Saving..." : "Save Changes"}</span>
                </Button>
            </div>

            <div className="p-10 space-y-12">
                {/* Skill Marquee Section */}
                {auth?.user?.role !== "sub-admin" && (
                    <section>
                        <div className="flex flex-col gap-1 mb-8">
                            <span className="text-blue-600 font-black text-[10px] uppercase tracking-widest flex items-center gap-2">
                                <Sparkles className="h-3 w-3" /> Mastery Pillars
                            </span>
                            <h3 className="text-2xl font-black tracking-tighter">Skill Marquee.</h3>
                            <p className="text-zinc-500 text-sm font-medium">Skills that slide on the home page.</p>
                        </div>

                        <div className="flex gap-4 mb-10">
                            <Input
                                value={newSkill}
                                onChange={(e) => setNewSkill(e.target.value)}
                                placeholder="Enter skill name (e.g. Blockchain)"
                                className="rounded-2xl h-14 border-zinc-200 focus:ring-zinc-900 transition-all text-lg font-medium"
                                onKeyPress={(e) => e.key === 'Enter' && handleAddSkill()}
                            />
                            <Button
                                onClick={handleAddSkill}
                                className="bg-blue-600 hover:bg-blue-700 text-white rounded-2xl h-14 px-8 font-bold flex items-center gap-2 shrink-0 transition-all hover:scale-105 active:scale-95"
                            >
                                <Plus className="h-5 w-5" />
                                <span>Add Skill</span>
                            </Button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <AnimatePresence>
                                {skillPillars.map((skill, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        className="flex items-center justify-between p-4 px-6 rounded-2xl bg-zinc-50 border border-zinc-100 group hover:border-zinc-300 hover:bg-white transition-all shadow-sm"
                                    >
                                        <span className="font-bold text-lg text-zinc-900">{skill.label}</span>
                                        <Button
                                            onClick={() => handleRemoveSkill(index)}
                                            variant="ghost"
                                            size="icon"
                                            className="rounded-full h-10 w-10 text-zinc-300 hover:text-red-500 hover:bg-red-50 transition-all"
                                        >
                                            <Trash2 className="h-5 w-5" />
                                        </Button>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    </section>
                )}

                {/* Testimonials Section */}
                {auth?.user?.role !== "sub-admin" && (
                    <section className="pt-12 border-t border-zinc-100">
                        <div className="flex flex-col gap-1 mb-8">
                            <span className="text-emerald-600 font-black text-[10px] uppercase tracking-widest flex items-center gap-2">
                                <Sparkles className="h-3 w-3" /> Testimonials
                            </span>
                            <h3 className="text-2xl font-black tracking-tighter">Student Reviews.</h3>
                            <p className="text-zinc-500 text-sm font-medium">Manage student feedback.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                            <Input
                                value={newReview.studentName}
                                onChange={(e) => setNewReview({ ...newReview, studentName: e.target.value })}
                                placeholder="Student Name"
                                className="rounded-2xl h-14 border-zinc-200"
                            />
                            <Input
                                value={newReview.reviewText}
                                onChange={(e) => setNewReview({ ...newReview, reviewText: e.target.value })}
                                placeholder="Review Text"
                                className="rounded-2xl h-14 border-zinc-200"
                            />
                        </div>
                        <Button
                            onClick={handleAddReview}
                            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl h-14 font-bold flex items-center gap-2 mb-10 transition-all hover:scale-[1.01] active:scale-[0.99]"
                        >
                            <Plus className="h-5 w-5" />
                            <span>Add Review</span>
                        </Button>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <AnimatePresence>
                                {studentReviews.map((review, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        className="p-6 rounded-[32px] bg-white border border-zinc-200 shadow-sm relative group"
                                    >
                                        <div className="flex items-center gap-4 mb-4">
                                            <img src={review.studentImage} className="w-12 h-12 rounded-full border-2 border-zinc-100" alt="" />
                                            <span className="font-bold text-lg">{review.studentName}</span>
                                        </div>
                                        <p className="text-zinc-500 italic text-sm">"{review.reviewText}"</p>
                                        <Button
                                            onClick={() => handleRemoveReview(index)}
                                            variant="ghost"
                                            size="icon"
                                            className="absolute top-4 right-4 text-zinc-300 hover:text-red-500 hover:bg-red-50 rounded-full"
                                        >
                                            <Trash2 className="h-5 w-5" />
                                        </Button>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    </section>
                )}

                {/* Featured Sections */}
                <section className="pt-12 border-t border-zinc-100">
                    <div className="flex flex-col gap-1 mb-8">
                        <span className="text-purple-600 font-black text-[10px] uppercase tracking-widest flex items-center gap-2">
                            <Sparkles className="h-3 w-3" /> Curation
                        </span>
                        <h3 className="text-2xl font-black tracking-tighter">Featured Sections.</h3>
                        <p className="text-zinc-500 text-sm font-medium">Assign courses to Trending, Most Demanded, or Recent sections.</p>
                    </div>

                    <div className="mb-10">
                        <Input
                            placeholder="Find a course to add..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="h-16 rounded-2xl border-zinc-200 text-xl font-bold tracking-tight px-8 focus:ring-purple-600 transition-all shadow-sm"
                        />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {['trending', 'recent'].map(section => (
                            <div key={section} className="flex flex-col gap-6">
                                <div className="flex items-center justify-between">
                                    <h4 className="text-xl font-black capitalize text-zinc-900 flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full bg-purple-600" />
                                        {section === 'recent' ? 'Recent Additions' : 'Trending Courses'}
                                    </h4>
                                    <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-[10px] font-black uppercase">
                                        {featuredSections[section]?.length || 0} selected
                                    </span>
                                </div>

                                <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-zinc-200 scrollbar-track-transparent">
                                    {(searchTerm ? filteredCourses : allCourses).map(course => {
                                        const isSelected = featuredSections[section]?.some(c => (c._id || c) === course._id);
                                        return (
                                            <div
                                                key={course._id}
                                                onClick={() => toggleCourseInSection(section, course)}
                                                className={`group cursor-pointer p-3 rounded-2xl border-2 transition-all duration-300 flex items-center gap-4 ${isSelected
                                                    ? "border-purple-600 bg-purple-50/50 shadow-md"
                                                    : "border-zinc-100 bg-white hover:border-zinc-200"
                                                    }`}
                                            >
                                                <div className="w-16 h-12 rounded-lg overflow-hidden shrink-0 bg-zinc-100">
                                                    <img src={course.image} className="w-full h-full object-cover" alt="" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className={`text-sm font-bold truncate ${isSelected ? "text-purple-900" : "text-zinc-700"}`}>
                                                        {course.title}
                                                    </p>
                                                    <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest truncate">{course.category}</p>
                                                </div>
                                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${isSelected ? "bg-purple-600 border-purple-600" : "border-zinc-200 group-hover:border-zinc-400"
                                                    }`}>
                                                    {isSelected && <Plus className="w-3 h-3 text-white rotate-45" />}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Category Section */}
                {auth?.user?.role !== "sub-admin" && (
                    <section className="pt-12 border-t border-zinc-100">
                        <div className="flex flex-col gap-1 mb-8">
                            <span className="text-orange-600 font-black text-[10px] uppercase tracking-widest flex items-center gap-2">
                                <Sparkles className="h-3 w-3" /> Taxonomy
                            </span>
                            <h3 className="text-2xl font-black tracking-tighter">Category Manager.</h3>
                            <p className="text-zinc-500 text-sm font-medium">Manage categories for home page and filters.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                            <Input
                                value={newCategory.label}
                                onChange={(e) => setNewCategory({ ...newCategory, label: e.target.value, id: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                                placeholder="Category Name (e.g. Web Design)"
                                className="rounded-2xl h-14 border-zinc-200"
                            />
                            <Input
                                value={newCategory.id}
                                onChange={(e) => setNewCategory({ ...newCategory, id: e.target.value })}
                                placeholder="Category ID (slug)"
                                className="rounded-2xl h-14 border-zinc-200"
                            />
                        </div>
                        <Button
                            onClick={handleAddCategory}
                            className="w-full bg-orange-600 hover:bg-orange-700 text-white rounded-2xl h-14 font-bold flex items-center gap-2 mb-10"
                        >
                            <Plus className="h-5 w-5" />
                            <span>Add Category</span>
                        </Button>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <AnimatePresence>
                                {categories.map((cat, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        className="flex items-center justify-between p-4 px-6 rounded-2xl bg-zinc-50 border border-zinc-100 group hover:border-zinc-300 hover:bg-white transition-all shadow-sm"
                                    >
                                        <div className="flex flex-col">
                                            <span className="font-bold text-lg text-zinc-900 leading-none mb-1">{cat.label}</span>
                                            <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest">{cat.id}</span>
                                        </div>
                                        <Button
                                            onClick={() => handleRemoveCategory(index)}
                                            variant="ghost"
                                            size="icon"
                                            className="rounded-full h-10 w-10 text-zinc-300 hover:text-red-500 hover:bg-red-50 transition-all"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    </section>
                )}
            </div>
        </motion.div>
    );
}

export default InstructorHomeConfig;
