import React, { useEffect, useState, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
    Plus, 
    Trash2, 
    Save, 
    Sparkles, 
    Zap, 
    Star, 
    Layers, 
    Hash, 
    Search, 
    CheckCircle2, 
    RefreshCw,
    X
} from "lucide-react";
import { 
    getHomeConfigService, 
    updateHomeConfigService, 
    fetchInstructorCourseListService 
} from "@/services";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
    const [isSaving, setIsSaving] = useState(false);
    const { auth } = useContext(AuthContext);
    const [searchTerm, setSearchTerm] = useState("");

    async function fetchConfig() {
        const response = await getHomeConfigService();
        if (response?.success) {
            setSkillPillars(response?.data?.skillPillars || []);
            setStudentReviews(response?.data?.studentReviews || []);
            setFeaturedSections(response?.data?.featuredCourseSections || { trending: [], recent: [] });
            setCategories(response?.data?.categories || []);
        }
    }

    async function fetchAllCourses() {
        const response = await fetchInstructorCourseListService();
        if (response?.success) setAllCourses(response?.data);
    }

    async function handleUpdateConfig() {
        setIsSaving(true);
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
        setIsSaving(false);
        if (response?.success) {
            fetchConfig();
        }
    }

    function handleAddSkill() {
        if (newSkill.trim() !== "") {
            setSkillPillars([...skillPillars, { label: newSkill.trim() }]);
            setNewSkill("");
        }
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

    function handleAddCategory() {
        if (newCategory.label.trim() !== "") {
            const id = newCategory.id || newCategory.label.toLowerCase().replace(/\s+/g, '-');
            setCategories([...categories, { ...newCategory, id }]);
            setNewCategory({ id: "", label: "" });
        }
    }

    function toggleCourseInSection(section, course) {
        setFeaturedSections(prev => {
            const currentSection = Array.isArray(prev[section]) ? prev[section] : [];
            const isSelected = currentSection.some(c => (c._id || c) === course._id);
            const updatedSection = isSelected
                ? currentSection.filter(c => (c._id || c) !== course._id)
                : [...currentSection, course];
            return { ...prev, [section]: updatedSection };
        });
    }

    useEffect(() => {
        fetchConfig();
        fetchAllCourses();
    }, []);

    const filteredCourses = allCourses.filter(course =>
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-10 pb-20">
            
            {/* MODULE HEADER */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                <div>
                    <h2 className="text-[32px] font-black tracking-tighter text-[#f5f5f7] mb-1">home_config.</h2>
                    <p className="text-[#86868b] text-[13px] font-medium tracking-tight">Systematic curation of platform primitives and editorial clusters.</p>
                </div>
                <Button
                    disabled={isSaving}
                    onClick={handleUpdateConfig}
                    className="h-12 px-8 bg-[#0071e3] hover:bg-[#0077ed] text-white text-[14px] font-black rounded-xl shadow-xl shadow-[#0071e3]/20 transition-all active:scale-95 disabled:opacity-50 flex items-center gap-2"
                >
                    {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save size={18} strokeWidth={3} />}
                    Sync Configuration
                </Button>
            </div>

            {/* CURATION GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* LEFT: PILLARS & REVIEWS stack */}
                <div className="lg:col-span-2 space-y-8">
                    
                    {/* SKILL PILLARS */}
                    <div className="bg-[#111118] border border-white/[0.06] rounded-[32px] p-8 shadow-2xl relative overflow-hidden">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-10 h-10 rounded-xl bg-[#0071e3]/10 flex items-center justify-center text-[#0071e3]"><Zap size={18} /></div>
                            <div>
                                <h3 className="text-[18px] font-black text-[#f5f5f7] leading-none mb-1">Mastery Pillars.</h3>
                                <p className="text-[10px] text-[#444] font-bold uppercase tracking-widest">Global Marquee Nodes</p>
                            </div>
                        </div>

                        <div className="flex gap-3 mb-8">
                            <Input
                                value={newSkill}
                                onChange={(e) => setNewSkill(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleAddSkill()}
                                placeholder="Enter skill node (e.g. Next.js Architecture)"
                                className="h-12 bg-white/[0.02] border-white/[0.08] rounded-xl text-[13px] text-[#f5f5f7] focus:border-[#0071e3]/50 transition-all outline-none"
                            />
                            <Button
                                onClick={handleAddSkill}
                                className="h-12 px-6 bg-white/[0.04] text-[#f5f5f7] text-[12px] font-black rounded-xl hover:bg-white/[0.08] border border-white/[0.1] transition-all"
                            >
                                <Plus size={16} />
                            </Button>
                        </div>

                        <div className="flex flex-wrap gap-2">
                             <AnimatePresence>
                                {skillPillars.map((skill, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        className="bg-white/[0.03] border border-white/[0.06] px-4 py-2 rounded-xl flex items-center gap-3 group transition-all hover:bg-white/[0.06] hover:border-[#0071e3]/30"
                                    >
                                        <span className="text-[13px] font-bold text-[#f5f5f7]">{skill.label}</span>
                                        <button onClick={() => setSkillPillars(skillPillars.filter((_, i) => i !== index))} className="text-[#333] hover:text-[#ff453a] transition-colors"><X size={14} /></button>
                                    </motion.div>
                                ))}
                             </AnimatePresence>
                             {skillPillars.length === 0 && <p className="text-[12px] text-[#222] italic font-bold">Awaiting node entry...</p>}
                        </div>
                    </div>

                    {/* STUDENT REVIEWS */}
                    <div className="bg-[#111118] border border-white/[0.06] rounded-[32px] p-8 shadow-2xl relative overflow-hidden">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-10 h-10 rounded-xl bg-[#30d158]/10 flex items-center justify-center text-[#30d158]"><Star size={18} /></div>
                            <div>
                                <h3 className="text-[18px] font-black text-[#f5f5f7] leading-none mb-1">Editorial Testimonials.</h3>
                                <p className="text-[10px] text-[#444] font-bold uppercase tracking-widest">Public Validation Nodes</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                            <Input
                                value={newReview.studentName}
                                onChange={(e) => setNewReview({ ...newReview, studentName: e.target.value })}
                                placeholder="Student identity..."
                                className="h-12 bg-white/[0.02] border-white/[0.08] rounded-xl text-[13px]"
                            />
                            <Input
                                value={newReview.reviewText}
                                onChange={(e) => setNewReview({ ...newReview, reviewText: e.target.value })}
                                placeholder="Validation transcript..."
                                className="h-12 bg-white/[0.02] border-white/[0.08] rounded-xl text-[13px]"
                            />
                        </div>
                        <Button onClick={handleAddReview} className="w-full h-12 bg-[#30d158] hover:bg-[#32d74b] text-[#0a0a0f] text-[12px] font-black rounded-xl mb-8 transition-all">
                             Archive Review Node
                        </Button>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <AnimatePresence>
                                {studentReviews.map((review, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.04] relative group hover:border-[#30d158]/30 transition-all"
                                    >
                                        <div className="flex items-center gap-3 mb-3">
                                            <img src={review.studentImage} className="w-8 h-8 rounded-full bg-slate-800" alt="" />
                                            <span className="text-[13px] font-black text-[#f5f5f7]">{review.studentName}</span>
                                        </div>
                                        <p className="text-[12px] text-[#86868b] leading-relaxed italic">"{review.reviewText}"</p>
                                        <button onClick={() => setStudentReviews(studentReviews.filter((_, i) => i !== index))} className="absolute top-4 right-4 text-[#222] hover:text-[#ff453a] opacity-0 group-hover:opacity-100 transition-all"><Trash2 size={14} /></button>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>

                {/* RIGHT: FEATURED CURATION */}
                <div className="lg:col-span-1 space-y-8">
                    <div className="bg-[#111118] border border-white/[0.06] rounded-[32px] p-8 shadow-2xl h-full flex flex-col">
                        <div className="flex items-center gap-4 mb-8">
                             <div className="w-10 h-10 rounded-xl bg-[#bf5af2]/10 flex items-center justify-center text-[#bf5af2]"><Layers size={18} /></div>
                             <div>
                                <h3 className="text-[18px] font-black text-[#f5f5f7] leading-none mb-1">Featured Clusters.</h3>
                                <p className="text-[10px] text-[#444] font-bold uppercase tracking-widest">Semantic Organization</p>
                             </div>
                        </div>

                        <div className="relative mb-6">
                            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#333]" />
                            <Input 
                                placeholder="Seek node for curation..." 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="h-12 pl-12 bg-white/[0.02] border-white/[0.08] rounded-xl text-[12px]"
                            />
                        </div>

                        <div className="flex-1 space-y-8 overflow-y-auto pr-2 no-scrollbar">
                            {['trending', 'recent'].map(section => (
                                <div key={section} className="space-y-4">
                                     <div className="flex items-center justify-between px-1">
                                        <h4 className="text-[12px] font-black uppercase tracking-widest text-[#444]">{section === 'recent' ? 'Latest Sequence' : 'Alpha Trend'}</h4>
                                        <span className="text-[10px] font-black text-[#bf5af2] bg-[#bf5af2]/10 px-2 py-0.5 rounded-full">{featuredSections[section]?.length || 0}</span>
                                     </div>
                                     <div className="space-y-2">
                                        {(searchTerm ? filteredCourses : allCourses.slice(0, 10)).map(course => {
                                             const isSelected = featuredSections[section]?.some(c => (c._id || c) === course._id);
                                             return (
                                                <button 
                                                    key={course._id}
                                                    onClick={() => toggleCourseInSection(section, course)}
                                                    className={`w-full flex items-center gap-3 p-2 rounded-xl border transition-all ${isSelected ? 'bg-[#bf5af2]/10 border-[#bf5af2]/30' : 'bg-transparent border-white/[0.02] hover:bg-white/[0.02] hover:border-white/[0.08]'}`}
                                                >
                                                    <div className="w-10 h-8 rounded-lg bg-slate-800 overflow-hidden shrink-0">
                                                        <img src={course.image} className="w-full h-full object-cover opacity-60" alt="" />
                                                    </div>
                                                    <div className="flex-1 text-left min-w-0">
                                                        <p className={`text-[12px] font-bold truncate ${isSelected ? 'text-[#bf5af2]' : 'text-[#f5f5f7]'}`}>{course.title}</p>
                                                        <p className="text-[9px] text-[#333] font-black uppercase tracking-tight">{course.category}</p>
                                                    </div>
                                                    {isSelected && <CheckCircle2 size={12} className="text-[#bf5af2] shrink-0" />}
                                                </button>
                                             );
                                        })}
                                     </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* TAXONOMY MANAGER */}
            <div className="bg-[#111118] border border-white/[0.06] rounded-[32px] p-10 shadow-2xl relative overflow-hidden">
                <div className="flex items-center gap-5 mb-10 pb-8 border-b border-white/[0.04]">
                    <div className="w-12 h-12 rounded-2xl bg-[#ff9f0a]/10 flex items-center justify-center text-[#ff9f0a]">
                        <Hash className="h-6 w-6" />
                    </div>
                    <div>
                        <h3 className="text-[20px] font-black tracking-tight text-[#f5f5f7] leading-none mb-1">Category Taxonomy.</h3>
                        <p className="text-[#86868b] text-[12px] font-medium tracking-tight italic">Manage discovery tags and content classification nodes.</p>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row gap-4 mb-10">
                    <Input
                        value={newCategory.label}
                        onChange={(e) => setNewCategory({ ...newCategory, label: e.target.value })}
                        placeholder="Node Identifier (e.g. Neural Networks)"
                        className="h-14 bg-white/[0.03] border-white/[0.08] rounded-2xl text-[14px] flex-1"
                    />
                     <Button onClick={handleAddCategory} className="h-14 px-10 bg-[#ff9f0a] hover:bg-[#ffb340] text-black text-[13px] font-black rounded-2xl transition-all shadow-xl shadow-[#ff9f0a]/20">
                        Integrate Tag
                    </Button>
                </div>

                <div className="grid grid-cols-2 shadow:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                    <AnimatePresence>
                        {categories.map((cat, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white/[0.02] border border-white/[0.05] p-4 rounded-2xl text-center group relative hover:border-[#ff9f0a]/30 transition-all"
                            >
                                <p className="text-[13px] font-black text-[#f5f5f7] mb-1 leading-tight">{cat.label}</p>
                                <p className="text-[9px] text-[#222] font-mono uppercase tracking-tighter">{cat.id}</p>
                                <button onClick={() => setCategories(categories.filter((_, i) => i !== index))} className="absolute -top-2 -right-2 w-6 h-6 bg-[#ff453a] text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-lg scale-75 group-hover:scale-100">
                                    <X size={12} strokeWidth={4} />
                                </button>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </div>

            <div className="bg-[#0071e3]/5 border border-[#0071e3]/10 rounded-3xl p-6 flex items-center gap-4">
                 <Sparkles className="text-[#0071e3] w-5 h-5 shrink-0" />
                 <p className="text-[12px] text-[#86868b] leading-relaxed">System sync logic is active. Configuration parameters are propagated to the home discovery node upon <span className="text-[#f5f5f7] font-bold">Sync Configuration</span> completion.</p>
            </div>
        </div>
    );
}

export default InstructorHomeConfig;
