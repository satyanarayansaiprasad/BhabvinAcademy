import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getHomeConfigService, updateHomeConfigService } from "@/services";
import { Plus, Trash2, Save, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

function InstructorHomeConfig() {
    const [skillPillars, setSkillPillars] = useState([]);
    const [newSkill, setNewSkill] = useState("");
    const [studentReviews, setStudentReviews] = useState([]);
    const [newReview, setNewReview] = useState({ studentName: "", reviewText: "" });
    const [featuredSections, setFeaturedSections] = useState({
        trending: [],
        mostDemanded: [],
        recent: [],
    });
    const [categories, setCategories] = useState([]);
    const [newCategory, setNewCategory] = useState({ id: "", label: "" });
    const [allCourses, setAllCourses] = useState([]);
    const [loading, setLoading] = useState(false);

    async function fetchConfig() {
        const response = await getHomeConfigService();
        if (response?.success) {
            setSkillPillars(response?.data?.skillPillars || []);
            setStudentReviews(response?.data?.studentReviews || []);
            setFeaturedSections(response?.data?.featuredCourseSections || {
                trending: [],
                mostDemanded: [],
                recent: [],
            });
            setCategories(response?.data?.categories || []);
        }
    }

    async function fetchAllCourses() {
        // We reuse the instructor courses list or fetch a fresh one
        const response = await fetchInstructorCourseListService();
        if (response?.success) {
            setAllCourses(response?.data);
        }
    }

    async function handleUpdateConfig() {
        setLoading(true);
        const response = await updateHomeConfigService({
            skillPillars,
            studentReviews,
            featuredCourseSections: featuredSections,
            categories
        });
        if (response?.success) {
            alert("Home configuration updated successfully!");
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
        const updatedSkills = skillPillars.filter((_, i) => i !== index);
        setSkillPillars(updatedSkills);
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
        const updatedReviews = studentReviews.filter((_, i) => i !== index);
        setStudentReviews(updatedReviews);
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

    function toggleCourseInSection(section, courseId) {
        setFeaturedSections(prev => {
            const currentSection = Array.isArray(prev[section]) ? prev[section] : [];
            const updatedSection = currentSection.find(c => (c._id || c) === courseId)
                ? currentSection.filter(c => (c._id || c) !== courseId)
                : [...currentSection, courseId];

            return {
                ...prev,
                [section]: updatedSection
            };
        });
    }

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-[40px] border border-zinc-200/60 shadow-sm overflow-hidden"
        >
            <div className="p-10 border-b border-zinc-100 flex items-center justify-between gap-6">
                <div>
                    <h2 className="text-3xl font-black tracking-tighter text-zinc-900 mb-1">Home Config.</h2>
                    <p className="text-zinc-500 font-medium tracking-tight">Manage the dynamic marquee skills on the home page.</p>
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
                <section>
                    <div className="flex flex-col gap-1 mb-8">
                        <span className="text-blue-600 font-black text-[10px] uppercase tracking-widest flex items-center gap-2">
                            <Sparkles className="h-3 w-3" /> Mastery Pillars
                        </span>
                        <h3 className="text-2xl font-black tracking-tighter">Skill Marquee.</h3>
                        <p className="text-zinc-500 text-sm font-medium">Add or remove skills that slide on the home page marquee section.</p>
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
                                    className="flex items-center justify-between p-4 px-6 rounded-2xl bg-zinc-50 border border-zinc-100 group hover:border-zinc-300 hover:bg-white transition-all shadow-sm hover:shadow-xl"
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

                    {skillPillars.length === 0 && (
                        <div className="py-20 text-center bg-zinc-50 rounded-[32px] border-2 border-dashed border-zinc-200">
                            <p className="text-zinc-400 font-bold">No skills added yet. Add your first skill above.</p>
                        </div>
                    )}
                </section>

                <section className="pt-12 border-t border-zinc-100">
                    <div className="flex flex-col gap-1 mb-8">
                        <span className="text-emerald-600 font-black text-[10px] uppercase tracking-widest flex items-center gap-2">
                            <Sparkles className="h-3 w-3" /> Testimonials
                        </span>
                        <h3 className="text-2xl font-black tracking-tighter">Student Reviews.</h3>
                        <p className="text-zinc-500 text-sm font-medium">Manage the scattered "paper" reviews shown on the home page.</p>
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

                <section className="pt-12 border-t border-zinc-100">
                    <div className="flex flex-col gap-1 mb-8">
                        <span className="text-purple-600 font-black text-[10px] uppercase tracking-widest flex items-center gap-2">
                            <Sparkles className="h-3 w-3" /> Curation
                        </span>
                        <h3 className="text-2xl font-black tracking-tighter">Featured Course Sections.</h3>
                        <p className="text-zinc-500 text-sm font-medium">Select which courses appear in the home page sections.</p>
                    </div>

                    <div className="space-y-12">
                        {['trending', 'mostDemanded', 'recent'].map(section => (
                            <div key={section} className="bg-zinc-50/50 p-8 rounded-[32px] border border-zinc-100">
                                <h4 className="text-lg font-bold mb-6 capitalize text-zinc-900 flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-purple-500" />
                                    {section.replace(/([A-Z])/g, ' $1')}
                                </h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-h-[400px] overflow-y-auto p-2 scrollbar-hide">
                                    {allCourses.map(course => {
                                        const isSelected = featuredSections[section]?.some(c => (c._id || c) === course._id);
                                        return (
                                            <div
                                                key={course._id}
                                                onClick={() => toggleCourseInSection(section, course._id)}
                                                className={`cursor-pointer p-4 rounded-2xl border-2 transition-all duration-300 flex flex-col gap-2 ${isSelected
                                                    ? "border-purple-600 bg-purple-50/50 shadow-md"
                                                    : "border-zinc-100 bg-white hover:border-zinc-300"
                                                    }`}
                                            >
                                                <div className="aspect-video rounded-lg overflow-hidden shrink-0">
                                                    <img src={course.image} className="w-full h-full object-cover" alt="" />
                                                </div>
                                                <span className={`text-[13px] font-bold line-clamp-2 leading-tight ${isSelected ? "text-purple-900" : "text-zinc-700"}`}>
                                                    {course.title}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="pt-12 border-t border-zinc-100">
                    <div className="flex flex-col gap-1 mb-8">
                        <span className="text-orange-600 font-black text-[10px] uppercase tracking-widest flex items-center gap-2">
                            <Sparkles className="h-3 w-3" /> Taxonomy
                        </span>
                        <h3 className="text-2xl font-black tracking-tighter">Category Management.</h3>
                        <p className="text-zinc-500 text-sm font-medium">Add categories for the home page slider and course filters.</p>
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
                        className="w-full bg-orange-600 hover:bg-orange-700 text-white rounded-2xl h-14 font-bold flex items-center gap-2 mb-10 transition-all hover:scale-[1.01] active:scale-[0.99]"
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
            </div>
        </motion.div>
    );
}

export default InstructorHomeConfig;
