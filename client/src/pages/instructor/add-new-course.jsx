import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
    ArrowLeft, 
    Save, 
    Sparkles, 
    Layout, 
    Database, 
    Settings, 
    Globe, 
    CheckCircle2, 
    Circle, 
    Eye, 
    Play,
    Info,
    AlertCircle,
    ChevronDown,
    Loader2
} from "lucide-react";
import CourseCurriculum from "@/components/instructor-view/courses/add-new-course/course-curriculum";
import CourseLanding from "@/components/instructor-view/courses/add-new-course/course-landing";
import CourseSettings from "@/components/instructor-view/courses/add-new-course/course-settings";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    courseCurriculumInitialFormData,
    courseLandingInitialFormData,
} from "@/config";
import { AuthContext } from "@/context/auth-context";
import { InstructorContext } from "@/context/instructor-context";
import {
    addNewCourseService,
    fetchInstructorCourseDetailsService,
    updateCourseByIdService,
} from "@/services";

function AddNewCoursePage() {
    const {
        courseLandingFormData,
        courseCurriculumFormData,
        setCourseLandingFormData,
        setCourseCurriculumFormData,
        currentEditedCourseId,
        setCurrentEditedCourseId,
    } = useContext(InstructorContext);

    const { auth } = useContext(AuthContext);
    const navigate = useNavigate();
    const params = useParams();

    const [activeTab, setActiveTab] = useState("curriculum");
    const [isSaving, setIsSaving] = useState(false);

    function isEmpty(value) {
        if (Array.isArray(value)) return value.length === 0;
        return value === "" || value === null || value === undefined;
    }

    function validateFormData() {
        for (const key in courseLandingFormData) {
            if (isEmpty(courseLandingFormData[key])) return false;
        }
        for (const item of courseCurriculumFormData) {
            if (isEmpty(item.title) || isEmpty(item.videoUrl)) return false;
        }
        return true;
    }

    async function handleSaveCourse() {
        setIsSaving(true);
        const courseFinalFormData = {
            instructorId: auth?.user?._id,
            instructorName: auth?.user?.userName,
            date: new Date(),
            ...courseLandingFormData,
            curriculum: courseCurriculumFormData,
            isPublished: true,
        };

        const response = currentEditedCourseId !== null
            ? await updateCourseByIdService(currentEditedCourseId, courseFinalFormData)
            : await addNewCourseService({ ...courseFinalFormData, students: [] });

        setIsSaving(false);
        if (response?.success) {
            setCourseLandingFormData(courseLandingInitialFormData);
            setCourseCurriculumFormData(courseCurriculumInitialFormData);
            navigate(-1);
            setCurrentEditedCourseId(null);
        }
    }

    async function fetchCurrentCourseDetails() {
        const response = await fetchInstructorCourseDetailsService(currentEditedCourseId);
        if (response?.success) {
            const setCourseFormData = Object.keys(courseLandingInitialFormData).reduce((acc, key) => {
                acc[key] = response?.data[key] || courseLandingInitialFormData[key];
                return acc;
            }, {});
            setCourseLandingFormData(setCourseFormData);
            setCourseCurriculumFormData(response?.data?.curriculum);
        }
    }

    useEffect(() => {
        if (currentEditedCourseId !== null) fetchCurrentCourseDetails();
    }, [currentEditedCourseId]);

    useEffect(() => {
        if (params?.courseId) setCurrentEditedCourseId(params?.courseId);
    }, [params?.courseId]);

    useEffect(() => {
        return () => {
            setCurrentEditedCourseId(null);
            setCourseLandingFormData(courseLandingInitialFormData);
            setCourseCurriculumFormData(courseCurriculumInitialFormData);
        };
    }, []);

    const completionSteps = [
        { label: "Curriculum Construction", status: !isEmpty(courseCurriculumFormData) },
        { label: "Course Landing Setup", status: !isEmpty(courseLandingFormData.title) && !isEmpty(courseLandingFormData.image) },
        { label: "Internal Node Settings", status: true },
        { label: "Media Optimization", status: courseCurriculumFormData.every(l => l.videoUrl) }
    ];

    const progressPercentage = Math.round((completionSteps.filter(s => s.status).length / completionSteps.length) * 100);

    return (
        <div className="min-h-screen bg-[#0a0a0f] text-[#f5f5f7] font-['Inter'] selection:bg-[#0071e3]/30">
            
            {/* STICKY WORKSPACE HEADER */}
            <header className="sticky top-0 h-[80px] bg-[#0a0a0f]/80 backdrop-blur-2xl border-b border-white/[0.04] z-50">
                <div className="max-w-[1600px] mx-auto h-full px-8 lg:px-12 flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <button 
                            onClick={() => navigate(-1)}
                            className="w-10 h-10 rounded-full bg-white/[0.03] border border-white/[0.06] flex items-center justify-center text-[#86868b] hover:text-[#f5f5f7] hover:bg-white/[0.06] transition-all"
                        >
                            <ArrowLeft size={20} />
                        </button>
                        <div className="h-10 w-px bg-white/[0.06] hidden sm:block" />
                        <div>
                            <div className="flex items-center gap-2 mb-0.5">
                                <span className="text-[#0071e3] font-black uppercase tracking-[0.1em] text-[10px]">Editor Node</span>
                                <span className="w-1.5 h-1.5 rounded-full bg-[#30d158] shadow-[0_0_8px_rgba(48,209,88,0.5)] animate-pulse" />
                            </div>
                            <h1 className="text-[20px] font-black tracking-tight leading-none lowercase">
                                {currentEditedCourseId ? "modify_course." : "create_course."}
                            </h1>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <button className="h-11 px-5 text-[#86868b] hover:text-[#f5f5f7] text-[13px] font-bold transition-all hidden sm:block">Preview Draft</button>
                        <Button
                            disabled={!validateFormData() || isSaving}
                            onClick={handleSaveCourse}
                            className="h-11 px-8 bg-[#0071e3] hover:bg-[#0077ed] text-white text-[13px] font-black rounded-xl shadow-xl shadow-[#0071e3]/20 transition-all active:scale-95 disabled:opacity-20 flex items-center gap-2"
                        >
                            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save size={18} strokeWidth={3} />}
                            {currentEditedCourseId ? "Update System" : "Deploy Course"}
                        </Button>
                    </div>
                </div>
            </header>

            <main className="max-w-[1600px] mx-auto px-8 lg:px-12 py-10">
                <div className="flex flex-col lg:flex-row gap-8 items-start">
                    
                    {/* LEFT COLUMN: EDITOR MODULES */}
                    <div className="flex-1 w-full space-y-8">
                        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                            <TabsList className="bg-transparent p-0 h-auto mb-10 flex border-b border-white/[0.04] gap-10">
                                {[
                                    { value: "curriculum", label: "01. Curriculum", icon: Database },
                                    { value: "course-landing-page", label: "02. Landing Page", icon: Layout },
                                    { value: "settings", label: "03. Settings", icon: Settings }
                                ].map(tab => (
                                    <TabsTrigger 
                                        key={tab.value}
                                        value={tab.value} 
                                        className="bg-transparent h-12 px-0 rounded-none border-b-2 border-transparent data-[state=active]:border-[#0071e3] data-[state=active]:text-[#f5f5f7] text-[#444] font-black text-[13px] uppercase tracking-widest transition-all"
                                    >
                                        <tab.icon className="w-4 h-4 mr-2" />
                                        {tab.label}
                                    </TabsTrigger>
                                ))}
                            </TabsList>

                            <div className="relative">
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={activeTab}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 10 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <TabsContent value="curriculum" className="mt-0 focus-visible:outline-none">
                                            <CourseCurriculum />
                                        </TabsContent>
                                        <TabsContent value="course-landing-page" className="mt-0 focus-visible:outline-none">
                                            <CourseLanding />
                                        </TabsContent>
                                        <TabsContent value="settings" className="mt-0 focus-visible:outline-none">
                                            <CourseSettings />
                                        </TabsContent>
                                    </motion.div>
                                </AnimatePresence>
                            </div>
                        </Tabs>
                    </div>

                    {/* RIGHT COLUMN: STICKY STATUS & PREVIEW */}
                    <aside className="w-full lg:w-[360px] lg:sticky lg:top-[120px] space-y-6">
                        
                        {/* Deployment Status */}
                        <div className="bg-[#111118] border border-white/[0.06] rounded-[24px] p-7 shadow-2xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-[#0071e3]/10 rounded-full blur-[50px] -translate-y-1/2 translate-x-1/2" />
                            <h3 className="text-[15px] font-black tracking-tight text-[#f5f5f7] mb-6 flex items-center gap-2">
                                <Globe size={16} className="text-[#0071e3]" /> System Checklist
                            </h3>
                            
                            <div className="space-y-4 mb-8">
                                {completionSteps.map((step, i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        <div className={`shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${step.status ? 'text-[#30d158]' : 'text-[#333]'}`}>
                                            {step.status ? <CheckCircle2 size={18} strokeWidth={3} /> : <Circle size={18} strokeWidth={2.5} />}
                                        </div>
                                        <span className={`text-[12px] font-bold ${step.status ? 'text-[#f5f5f7]' : 'text-[#444]'}`}>{step.label}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                                    <span className="text-[#555]">System Readiness</span>
                                    <span className="text-[#0071e3]">{progressPercentage}%</span>
                                </div>
                                <div className="h-[3px] bg-white/[0.03] rounded-full overflow-hidden">
                                    <motion.div 
                                        initial={{ width: 0 }} 
                                        animate={{ width: `${progressPercentage}%` }} 
                                        className="h-full bg-gradient-to-r from-[#0071e3] to-[#00d4ff] shadow-[0_0_10px_rgba(0,113,227,0.4)]" 
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Quick Insights */}
                        <div className="bg-[#111118] border border-white/[0.06] rounded-[24px] p-7 space-y-6">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-[#0071e3] flex items-center justify-center text-white shadow-xl shadow-[#0071e3]/20">
                                    <Sparkles size={20} />
                                </div>
                                <div>
                                    <p className="text-[13px] font-black text-[#f5f5f7] leading-none mb-1">Editor AI</p>
                                    <p className="text-[10px] text-[#555] font-bold uppercase tracking-widest">Optimizing visibility</p>
                                </div>
                            </div>
                            <p className="text-[12px] text-[#86868b] leading-relaxed">Ensure your course landing page includes a high-contrast thumbnail to increase CTR by up to <span className="text-[#30d158] font-bold">24%</span>.</p>
                            <button className="text-[11px] font-black text-[#0071e3] uppercase tracking-widest hover:underline flex items-center gap-1.5">
                                Read SEO Guide <ArrowLeft size={10} className="rotate-180" />
                            </button>
                        </div>

                        {/* Metadata Snapshot */}
                        <div className="bg-gradient-to-br from-[#111118] to-transparent border border-white/[0.04] rounded-[24px] p-6 space-y-5">
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-[#444] px-1 italic">Internal Metadata</h4>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center text-[12px]">
                                    <span className="text-[#555] font-medium">Author ID</span>
                                    <span className="text-[#86868b] font-mono">{auth?.user?._id?.substring(0, 10)}...</span>
                                </div>
                                <div className="flex justify-between items-center text-[12px]">
                                    <span className="text-[#555] font-medium">Node Rank</span>
                                    <span className="text-[#30d158] font-black uppercase text-[10px]">Super Admin</span>
                                </div>
                                <div className="flex justify-between items-center text-[12px]">
                                    <span className="text-[#555] font-medium">System Lag</span>
                                    <span className="text-[#86868b] font-mono tracking-tighter">14ms response</span>
                                </div>
                            </div>
                        </div>
                    </aside>
                </div>
            </main>

            <footer className="fixed bottom-0 left-0 right-0 h-[60px] bg-[#0a0a0f]/50 backdrop-blur-md border-t border-white/[0.04] px-12 items-center justify-center hidden lg:flex pointer-events-none z-40">
                <span className="text-[11px] text-[#222] font-black uppercase tracking-[0.3em]">System Environment v4.02 · Active Session</span>
            </footer>

        </div>
    );
}

export default AddNewCoursePage;
