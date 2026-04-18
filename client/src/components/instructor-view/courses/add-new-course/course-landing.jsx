import React, { useContext } from "react";
import { motion } from "framer-motion";
import { Sparkles, Layout, Globe, Image as ImageIcon, Type, AlignLeft, List, Target } from "lucide-react";
import { InstructorContext } from "@/context/instructor-context";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
    Select, 
    SelectContent, 
    SelectItem, 
    SelectTrigger, 
    SelectValue 
} from "@/components/ui/select";
import { courseCategories, languages, courseLevels } from "@/config";

function CourseLanding() {
    const { courseLandingFormData, setCourseLandingFormData } = useContext(InstructorContext);

    function handleChange(name, value) {
        setFormData({
            ...courseLandingFormData,
            [name]: value
        });
    }

    const setFormData = setCourseLandingFormData;

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-10 pb-20"
        >
            {/* MAIN FORM PANEL */}
            <div className="bg-[#111118] border border-white/[0.06] rounded-[32px] p-10 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#0071e3] to-transparent opacity-30" />
                
                <div className="flex items-center gap-5 mb-12 pb-8 border-b border-white/[0.04]">
                    <div className="w-12 h-12 rounded-2xl bg-[#0071e3]/10 flex items-center justify-center text-[#0071e3] shadow-lg shadow-[#0071e3]/5">
                        <Layout className="h-6 w-6" />
                    </div>
                    <div>
                        <h3 className="text-[20px] font-black tracking-tight text-[#f5f5f7] leading-none mb-1">Landing Page Content.</h3>
                        <p className="text-[#86868b] text-[12px] font-medium tracking-tight italic">Construct the primary semantic data for student discovery.</p>
                    </div>
                </div>

                <div className="space-y-8">
                    {/* Title & Subtitle */}
                    <div className="grid grid-cols-1 gap-8">
                        <div className="space-y-1.5">
                            <Label className="text-[9px] font-black uppercase tracking-widest text-[#444] ml-1 flex items-center gap-2">
                                <Type size={12} className="text-[#0071e3]" /> Course Primary Identity
                            </Label>
                            <Input
                                placeholder="e.g. Master Class: Cyber Security Architecture v4.0"
                                value={courseLandingFormData.title}
                                onChange={(e) => handleChange("title", e.target.value)}
                                className="h-14 bg-white/[0.03] border-white/[0.08] rounded-2xl text-[16px] font-black text-[#f5f5f7] focus:border-[#0071e3]/50 transition-all outline-none px-6"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-[9px] font-black uppercase tracking-widest text-[#444] ml-1 flex items-center gap-2">
                                <AlignLeft size={12} /> Semantic Subtitle
                            </Label>
                            <Input
                                placeholder="A concise, high-impact description of the course value proposition..."
                                value={courseLandingFormData.subtitle}
                                onChange={(e) => handleChange("subtitle", e.target.value)}
                                className="h-14 bg-white/[0.03] border-white/[0.08] rounded-2xl text-[14px] font-medium text-[#86868b] focus:border-[#0071e3]/50 transition-all outline-none px-6"
                            />
                        </div>
                    </div>

                    {/* Metadata Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-1.5">
                            <Label className="text-[9px] font-black uppercase tracking-widest text-[#444] ml-1">Classification</Label>
                            <Select value={courseLandingFormData.category} onValueChange={(v) => handleChange("category", v)}>
                                <SelectTrigger className="h-12 bg-white/[0.03] border-white/[0.08] rounded-xl text-[13px] text-[#f5f5f7] outline-none">
                                    <SelectValue placeholder="Select Category" />
                                </SelectTrigger>
                                <SelectContent className="bg-[#1c1c1e] border-white/10 text-[#f5f5f7]">
                                    {courseCategories.map(cat => <SelectItem key={cat.id} value={cat.id}>{cat.label}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-[9px] font-black uppercase tracking-widest text-[#444] ml-1">Complexity</Label>
                            <Select value={courseLandingFormData.level} onValueChange={(v) => handleChange("level", v)}>
                                <SelectTrigger className="h-12 bg-white/[0.03] border-white/[0.08] rounded-xl text-[13px] text-[#f5f5f7] outline-none">
                                    <SelectValue placeholder="Select Level" />
                                </SelectTrigger>
                                <SelectContent className="bg-[#1c1c1e] border-white/10 text-[#f5f5f7]">
                                    {courseLevels.map(lvl => <SelectItem key={lvl.id} value={lvl.id}>{lvl.label}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-[9px] font-black uppercase tracking-widest text-[#444] ml-1">Primary Language</Label>
                            <Select value={courseLandingFormData.primaryLanguage} onValueChange={(v) => handleChange("primaryLanguage", v)}>
                                <SelectTrigger className="h-12 bg-white/[0.03] border-white/[0.08] rounded-xl text-[13px] text-[#f5f5f7] outline-none">
                                    <SelectValue placeholder="Select Language" />
                                </SelectTrigger>
                                <SelectContent className="bg-[#1c1c1e] border-white/10 text-[#f5f5f7]">
                                    {languages.map(lang => <SelectItem key={lang.id} value={lang.id}>{lang.label}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Detailed Content */}
                    <div className="space-y-8 pt-4">
                        <div className="space-y-1.5">
                            <Label className="text-[9px] font-black uppercase tracking-widest text-[#444] ml-1">Course Abstract</Label>
                            <Textarea
                                placeholder="Describe the course curriculum, target audience, and learning philosophy..."
                                value={courseLandingFormData.description}
                                onChange={(e) => handleChange("description", e.target.value)}
                                className="min-h-[160px] bg-white/[0.03] border-white/[0.08] rounded-2xl text-[13px] font-medium text-[#86868b] focus:border-[#0071e3]/50 transition-all outline-none leading-relaxed p-6 no-scrollbar"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-1.5">
                                <Label className="text-[9px] font-black uppercase tracking-widest text-[#444] ml-1 flex items-center gap-2">
                                    <Target size={12} className="text-[#30d158]" /> Key Learning Objectives
                                </Label>
                                <Textarea
                                    placeholder="List the technical proficiencies students will acquire (comma separated or bulk)..."
                                    value={courseLandingFormData.objectives}
                                    onChange={(e) => handleChange("objectives", e.target.value)}
                                    className="min-h-[120px] bg-white/[0.03] border-white/[0.08] rounded-2xl text-[12px] font-bold text-[#f5f5f7] focus:border-[#0071e3]/50 transition-all outline-none p-5"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-[9px] font-black uppercase tracking-widest text-[#444] ml-1 flex items-center gap-2">
                                    <List size={12} className="text-[#bf5af2]" /> Prerequisites & Hardware
                                </Label>
                                <Textarea
                                    placeholder="Essential knowledge or system requirements needed prior to initiation..."
                                    value={courseLandingFormData.welcomeMessage}
                                    onChange={(e) => handleChange("welcomeMessage", e.target.value)}
                                    className="min-h-[120px] bg-white/[0.03] border-white/[0.08] rounded-2xl text-[12px] font-bold text-[#f5f5f7] focus:border-[#0071e3]/50 transition-all outline-none p-5"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Asset Pipeline */}
                    <div className="pt-8 border-t border-white/[0.04] space-y-6">
                         <div className="flex items-center gap-2">
                            <ImageIcon size={14} className="text-[#ff9f0a]" />
                            <h4 className="text-[14px] font-black tracking-tight text-[#f5f5f7]">VFX & Media Assets.</h4>
                         </div>
                         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="md:col-span-2 space-y-1.5">
                                <Label className="text-[9px] font-black uppercase tracking-widest text-[#444] ml-1">Asset Hash (Image URL)</Label>
                                <Input
                                    placeholder="Enter secure Cloudinary or S3 link for course banner..."
                                    value={courseLandingFormData.image}
                                    onChange={(e) => handleChange("image", e.target.value)}
                                    className="h-14 bg-white/[0.03] border-white/[0.08] rounded-2xl text-[12px] font-mono text-[#0071e3] focus:border-[#0071e3]/50 transition-all outline-none px-6"
                                />
                            </div>
                            <div className="aspect-video bg-white/[0.02] border border-white/[0.06] rounded-[24px] overflow-hidden group relative">
                                {courseLandingFormData.image ? (
                                    <img src={courseLandingFormData.image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="Preview" />
                                ) : (
                                    <div className="w-full h-full flex flex-col items-center justify-center text-[#222]">
                                        <ImageIcon size={32} />
                                        <span className="text-[9px] font-black uppercase tracking-widest mt-2">Awaiting Stream</span>
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                                    <span className="text-[10px] font-black text-white uppercase tracking-widest">Real-time Alpha Preview</span>
                                </div>
                            </div>
                         </div>
                    </div>
                </div>
            </div>

            {/* INSIGHT CARD */}
            <div className="bg-[#0071e3]/5 border border-[#0071e3]/10 rounded-[32px] p-8 relative overflow-hidden group">
                <div className="relative z-10 flex items-start gap-6">
                    <div className="w-12 h-12 rounded-2xl bg-[#0071e3] flex items-center justify-center shrink-0 shadow-lg shadow-[#0071e3]/20 transition-transform group-hover:rotate-12">
                        <Sparkles className="h-6 w-6 text-white" />
                    </div>
                    <div>
                        <h4 className="text-[15px] font-black tracking-tight text-[#f5f5f7] mb-1">Semantic Optimization Node.</h4>
                        <p className="text-[#86868b] text-[13px] leading-relaxed max-w-2xl">
                            Analytical models indicate that landing pages with systematic categorization and precise complexity levels achieve a <span className="text-[#30d158] font-bold">42.8%</span> higher retention rate during core student exploration cycles. Ensure your abstract is clear and concise.
                        </p>
                    </div>
                </div>
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#0071e3]/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            </div>
        </motion.div>
    );
}

export default CourseLanding;
