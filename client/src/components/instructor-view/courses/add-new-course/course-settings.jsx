import React, { useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
    Image as ImageIcon, 
    Upload, 
    RefreshCw, 
    DollarSign, 
    Clock, 
    ShieldCheck, 
    Sparkles, 
    Zap,
    Lock,
    Globe
} from "lucide-react";
import MediaProgressbar from "@/components/media-progress-bar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
    Select, 
    SelectContent, 
    SelectItem, 
    SelectTrigger, 
    SelectValue 
} from "@/components/ui/select";
import { InstructorContext } from "@/context/instructor-context";
import { mediaUploadService } from "@/services";

function CourseSettings() {
    const {
        courseLandingFormData,
        setCourseLandingFormData,
        mediaUploadProgress,
        setMediaUploadProgress,
        mediaUploadProgressPercentage,
        setMediaUploadProgressPercentage,
    } = useContext(InstructorContext);

    async function handleImageUploadChange(event) {
        const selectedImage = event.target.files[0];
        if (selectedImage) {
            const imageFormData = new FormData();
            imageFormData.append("file", selectedImage);
            try {
                setMediaUploadProgress(true);
                const response = await mediaUploadService(imageFormData, setMediaUploadProgressPercentage);
                if (response.success) {
                    setCourseLandingFormData({
                        ...courseLandingFormData,
                        image: response.data.url,
                    });
                    setMediaUploadProgress(false);
                }
            } catch (e) {
                console.log(e);
                setMediaUploadProgress(false);
            }
        }
    }

    function handleChange(name, value) {
        setCourseLandingFormData({
            ...courseLandingFormData,
            [name]: value
        });
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-10 pb-20"
        >
            {/* COMMERCIAL PARAMETERS */}
            <div className="bg-[#111118] border border-white/[0.06] rounded-[32px] p-10 shadow-2xl relative overflow-hidden">
                <div className="flex items-center gap-5 mb-12 pb-8 border-b border-white/[0.04]">
                    <div className="w-12 h-12 rounded-2xl bg-[#30d158]/10 flex items-center justify-center text-[#30d158]">
                        <Zap className="h-6 w-6" />
                    </div>
                    <div>
                        <h3 className="text-[20px] font-black tracking-tight text-[#f5f5f7] leading-none mb-1">Commercial Logic.</h3>
                        <p className="text-[#86868b] text-[12px] font-medium tracking-tight italic">Define the monetization strategy and access protocols.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-4">
                        <div className="space-y-1.5">
                            <Label className="text-[9px] font-black uppercase tracking-widest text-[#444] ml-1 flex items-center gap-2">
                                <DollarSign size={12} className="text-[#30d158]" /> Subscription Valuation
                            </Label>
                            <div className="relative">
                                <div className="absolute left-6 top-1/2 -translate-y-1/2 text-[#30d158] font-black text-lg">$</div>
                                <Input
                                    type="number"
                                    placeholder="0.00"
                                    value={courseLandingFormData.pricing}
                                    onChange={(e) => handleChange("pricing", e.target.value)}
                                    className="h-16 pl-12 bg-white/[0.03] border-white/[0.08] rounded-2xl text-[24px] font-black text-[#f5f5f7] focus:border-[#30d158]/50 transition-all outline-none"
                                />
                            </div>
                            <p className="text-[10px] text-[#333] font-bold uppercase tracking-widest ml-1 pt-1">Suggested Average: $49.00 - $199.00</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-1.5">
                            <Label className="text-[9px] font-black uppercase tracking-widest text-[#444] ml-1 flex items-center gap-2">
                                <Clock size={12} className="text-[#bf5af2]" /> Access Persistence
                            </Label>
                            <Select value={courseLandingFormData.accessType} onValueChange={(v) => handleChange("accessType", v)}>
                                <SelectTrigger className="h-16 bg-white/[0.03] border-white/[0.08] rounded-2xl text-[15px] font-bold text-[#f5f5f7] outline-none px-6">
                                    <SelectValue placeholder="Select Access Type" />
                                </SelectTrigger>
                                <SelectContent className="bg-[#1c1c1e] border-white/10 text-[#f5f5f7]">
                                    <SelectItem value="Lifetime Access">Lifetime Alpha Access</SelectItem>
                                    <SelectItem value="1 Year Access">12 Month Subscription</SelectItem>
                                    <SelectItem value="2 Year Access">24 Month Subscription</SelectItem>
                                    <SelectItem value="5 Year Access">60 Month Subscription</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>
            </div>

            {/* VISUAL IDENTITY CONFIG */}
            <div className="bg-[#111118] border border-white/[0.06] rounded-[32px] p-10 shadow-2xl relative overflow-hidden">
                <div className="flex items-center gap-5 mb-12 pb-8 border-b border-white/[0.04]">
                    <div className="w-12 h-12 rounded-2xl bg-[#ff9f0a]/10 flex items-center justify-center text-[#ff9f0a]">
                        <ImageIcon className="h-6 w-6" />
                    </div>
                    <div>
                        <h3 className="text-[20px] font-black tracking-tight text-[#f5f5f7] leading-none mb-1">Visual Identity.</h3>
                        <p className="text-[#86868b] text-[12px] font-medium tracking-tight italic">Synthesize a high-impact branding banner for external display.</p>
                    </div>
                </div>

                <div className="space-y-8">
                    <AnimatePresence mode="wait">
                        {mediaUploadProgress && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="p-6 bg-[#0071e3]/10 border border-[#0071e3]/20 rounded-2xl"
                            >
                                <MediaProgressbar isMediaUploading={mediaUploadProgress} progress={mediaUploadProgressPercentage} />
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="relative group">
                        {courseLandingFormData?.image ? (
                            <div className="relative rounded-[24px] overflow-hidden border border-white/[0.06] shadow-2xl aspect-video max-w-2xl mx-auto">
                                <img
                                    src={courseLandingFormData.image}
                                    alt="Course Banner"
                                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 backdrop-blur-md">
                                    <label className="bg-white text-[#0a0a0f] h-12 px-6 rounded-xl font-black text-[13px] uppercase tracking-widest flex items-center gap-2 cursor-pointer hover:bg-[#f5f5f7] transition-all transform hover:scale-105 active:scale-95">
                                        <RefreshCw className="h-4 w-4" />
                                        Replace Alpha Asset
                                        <input onChange={handleImageUploadChange} type="file" accept="image/*" className="hidden" />
                                    </label>
                                </div>
                                <div className="absolute bottom-6 left-6 flex items-center gap-2">
                                     <span className="px-3 py-1 bg-black/40 backdrop-blur-xl border border-white/10 rounded-full text-[10px] font-black text-white uppercase tracking-[0.2em]">Alpha Preview Node</span>
                                </div>
                            </div>
                        ) : (
                            <label className="flex flex-col items-center justify-center w-full aspect-video max-w-2xl mx-auto border-2 border-dashed border-white/[0.04] bg-white/[0.01] rounded-[32px] cursor-pointer hover:bg-white/[0.03] hover:border-[#0071e3]/40 transition-all group p-12">
                                <div className="flex flex-col items-center justify-center text-center">
                                    <div className="w-20 h-20 rounded-3xl bg-white/[0.04] flex items-center justify-center mb-6 border border-white/[0.06] group-hover:bg-[#0071e3] transition-all group-hover:rotate-6">
                                        <Upload className="h-8 w-8 text-[#444] group-hover:text-white" />
                                    </div>
                                    <p className="text-[20px] font-black tracking-tight text-[#f5f5f7] mb-2">Initialize Banner Upload.</p>
                                    <p className="text-[11px] text-[#444] font-bold uppercase tracking-[0.2em] mb-4">Lossless PNG or WebP Preferred</p>
                                    <div className="flex gap-2">
                                        <span className="text-[8px] px-2 py-0.5 bg-white/5 border border-white/5 rounded text-[#555] font-black uppercase">Max 5MB</span>
                                        <span className="text-[8px] px-2 py-0.5 bg-white/5 border border-white/5 rounded text-[#555] font-black uppercase">16:9 Ratio</span>
                                    </div>
                                </div>
                                <input onChange={handleImageUploadChange} type="file" accept="image/*" className="hidden" />
                            </label>
                        )}
                    </div>
                </div>
            </div>

            {/* SECURITY & DEPLOYMENT INFO */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-[#111118] border border-white/[0.06] rounded-[24px] p-6 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-[#30d158]/10 flex items-center justify-center text-[#30d158]"><ShieldCheck size={20} /></div>
                    <div>
                        <p className="text-[14px] font-black text-[#f5f5f7] mb-0.5">TLS Secured Transaction</p>
                        <p className="text-[10px] text-[#444] font-black uppercase tracking-widest">End-to-end monetization encryption</p>
                    </div>
                </div>
                <div className="bg-[#111118] border border-white/[0.06] rounded-[24px] p-6 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-[#0071e3]/10 flex items-center justify-center text-[#0071e3]"><Globe size={20} /></div>
                    <div>
                        <p className="text-[14px] font-black text-[#f5f5f7] mb-0.5">Global Node Availability</p>
                        <p className="text-[10px] text-[#444] font-black uppercase tracking-widest">Distributed content delivery active</p>
                    </div>
                </div>
            </div>

            <div className="bg-gradient-to-br from-[#111118] to-transparent border border-white/[0.04] rounded-[32px] p-8 relative overflow-hidden group">
                 <div className="relative z-10 flex items-center gap-4">
                    <Sparkles className="text-[#0071e3] h-5 w-5" />
                    <p className="text-[12px] text-[#86868b] leading-relaxed font-medium">System suggests a <span className="text-[#f5f5f7] font-bold">Lifetime Access</span> protocol for high-density introductory courses to maximize user lifetime value (LTV).</p>
                 </div>
            </div>

        </motion.div>
    );
}

export default CourseSettings;
