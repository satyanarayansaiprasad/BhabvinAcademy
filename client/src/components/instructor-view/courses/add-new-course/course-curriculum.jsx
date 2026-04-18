import React, { useContext, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
    Upload, 
    Plus, 
    Trash2, 
    Video, 
    Check, 
    Eye, 
    EyeOff, 
    FileVideo, 
    Youtube, 
    Link as LinkIcon, 
    RefreshCw, 
    Lock, 
    FileText, 
    X, 
    ExternalLink,
    GripVertical,
    CheckCircle2,
    MonitorPlay
} from "lucide-react";
import MediaProgressbar from "@/components/media-progress-bar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import VideoPlayer from "@/components/video-player";
import { courseCurriculumInitialFormData } from "@/config";
import { InstructorContext } from "@/context/instructor-context";
import {
    mediaBulkUploadService,
    mediaDeleteService,
    mediaUploadService,
} from "@/services";

function CourseCurriculum() {
    const {
        courseCurriculumFormData,
        setCourseCurriculumFormData,
        mediaUploadProgress,
        setMediaUploadProgress,
        mediaUploadProgressPercentage,
        setMediaUploadProgressPercentage,
    } = useContext(InstructorContext);

    const bulkUploadInputRef = useRef(null);

    function handleNewLecture() {
        setCourseCurriculumFormData((prev) => [
            {
                ...courseCurriculumInitialFormData[0],
                id: Math.random().toString(36).substring(2, 11),
            },
            ...prev,
        ]);
    }

    function handleCourseTitleChange(event, currentIndex) {
        let cpyCourseCurriculumFormData = [...courseCurriculumFormData];
        cpyCourseCurriculumFormData[currentIndex] = {
            ...cpyCourseCurriculumFormData[currentIndex],
            title: event.target.value,
        };
        setCourseCurriculumFormData(cpyCourseCurriculumFormData);
    }

    function handleFreePreviewChange(currentValue, currentIndex) {
        let cpyCourseCurriculumFormData = [...courseCurriculumFormData];
        cpyCourseCurriculumFormData[currentIndex] = {
            ...cpyCourseCurriculumFormData[currentIndex],
            freePreview: currentValue,
        };
        setCourseCurriculumFormData(cpyCourseCurriculumFormData);
    }

    function handleLectureNotesChange(event, currentIndex) {
        let cpyCourseCurriculumFormData = [...courseCurriculumFormData];
        cpyCourseCurriculumFormData[currentIndex] = {
            ...cpyCourseCurriculumFormData[currentIndex],
            notes: event.target.value,
        };
        setCourseCurriculumFormData(cpyCourseCurriculumFormData);
    }

    function handleAddLink(currentIndex) {
        let cpyCourseCurriculumFormData = [...courseCurriculumFormData];
        cpyCourseCurriculumFormData[currentIndex] = {
            ...cpyCourseCurriculumFormData[currentIndex],
            links: [
                ...(cpyCourseCurriculumFormData[currentIndex].links || []),
                { title: "", url: "" },
            ],
        };
        setCourseCurriculumFormData(cpyCourseCurriculumFormData);
    }

    function handleLinkChange(event, currentIndex, linkIndex, field) {
        let cpyCourseCurriculumFormData = [...courseCurriculumFormData];
        const updatedLinks = [...(cpyCourseCurriculumFormData[currentIndex].links || [])];
        updatedLinks[linkIndex] = {
            ...updatedLinks[linkIndex],
            [field]: event.target.value,
        };
        cpyCourseCurriculumFormData[currentIndex] = {
            ...cpyCourseCurriculumFormData[currentIndex],
            links: updatedLinks,
        };
        setCourseCurriculumFormData(cpyCourseCurriculumFormData);
    }

    function handleRemoveLink(currentIndex, linkIndex) {
        let cpyCourseCurriculumFormData = [...courseCurriculumFormData];
        const updatedLinks = (cpyCourseCurriculumFormData[currentIndex].links || []).filter(
            (_, index) => index !== linkIndex
        );
        cpyCourseCurriculumFormData[currentIndex] = {
            ...cpyCourseCurriculumFormData[currentIndex],
            links: updatedLinks,
        };
        setCourseCurriculumFormData(cpyCourseCurriculumFormData);
    }

    async function handlePdfUpload(event, currentIndex) {
        const selectedFile = event.target.files[0];
        if (selectedFile) {
            const pdfFormData = new FormData();
            pdfFormData.append("file", selectedFile);
            try {
                setMediaUploadProgress(true);
                const response = await mediaUploadService(pdfFormData, setMediaUploadProgressPercentage);
                if (response.success) {
                    let cpyCourseCurriculumFormData = [...courseCurriculumFormData];
                    cpyCourseCurriculumFormData[currentIndex] = {
                        ...cpyCourseCurriculumFormData[currentIndex],
                        pdfs: [
                            ...(cpyCourseCurriculumFormData[currentIndex].pdfs || []),
                            {
                                title: selectedFile.name,
                                url: response?.data?.url,
                                public_id: response?.data?.public_id,
                            },
                        ],
                    };
                    setCourseCurriculumFormData(cpyCourseCurriculumFormData);
                    setMediaUploadProgress(false);
                }
            } catch (error) {
                console.log(error);
                setMediaUploadProgress(false);
            }
        }
    }

    async function handleRemovePdf(currentIndex, pdfIndex) {
        let cpyCourseCurriculumFormData = [...courseCurriculumFormData];
        const pdfs = cpyCourseCurriculumFormData[currentIndex].pdfs || [];
        const pdfToRemove = pdfs[pdfIndex];
        if (pdfToRemove?.public_id) await mediaDeleteService(pdfToRemove.public_id);
        const updatedPdfs = pdfs.filter((_, index) => index !== pdfIndex);
        cpyCourseCurriculumFormData[currentIndex] = {
            ...cpyCourseCurriculumFormData[currentIndex],
            pdfs: updatedPdfs,
        };
        setCourseCurriculumFormData(cpyCourseCurriculumFormData);
    }

    function handleVideoSourceChange(source, currentIndex) {
        let cpyCourseCurriculumFormData = [...courseCurriculumFormData];
        cpyCourseCurriculumFormData[currentIndex] = {
            ...cpyCourseCurriculumFormData[currentIndex],
            videoSource: source,
            videoUrl: "",
            public_id: "",
        };
        setCourseCurriculumFormData(cpyCourseCurriculumFormData);
    }

    function handleExternalUrlChange(event, currentIndex) {
        let cpyCourseCurriculumFormData = [...courseCurriculumFormData];
        cpyCourseCurriculumFormData[currentIndex] = {
            ...cpyCourseCurriculumFormData[currentIndex],
            videoUrl: event.target.value,
        };
        setCourseCurriculumFormData(cpyCourseCurriculumFormData);
    }

    async function handleSingleLectureUpload(event, currentIndex) {
        const selectedFile = event.target.files[0];
        if (selectedFile) {
            const videoFormData = new FormData();
            videoFormData.append("file", selectedFile);
            try {
                setMediaUploadProgress(true);
                const response = await mediaUploadService(videoFormData, setMediaUploadProgressPercentage);
                if (response.success) {
                    let cpyCourseCurriculumFormData = [...courseCurriculumFormData];
                    cpyCourseCurriculumFormData[currentIndex] = {
                        ...cpyCourseCurriculumFormData[currentIndex],
                        videoUrl: response?.data?.url,
                        public_id: response?.data?.public_id,
                        videoSource: "upload",
                    };
                    setCourseCurriculumFormData(cpyCourseCurriculumFormData);
                    setMediaUploadProgress(false);
                }
            } catch (error) {
                console.log(error);
                setMediaUploadProgress(false);
            }
        }
    }

    async function handleReplaceVideo(currentIndex) {
        let cpyCourseCurriculumFormData = [...courseCurriculumFormData];
        const getCurrentVideoPublicId = cpyCourseCurriculumFormData[currentIndex].public_id;
        if (getCurrentVideoPublicId) await mediaDeleteService(getCurrentVideoPublicId);
        cpyCourseCurriculumFormData[currentIndex] = {
            ...cpyCourseCurriculumFormData[currentIndex],
            videoUrl: "",
            public_id: "",
        };
        setCourseCurriculumFormData(cpyCourseCurriculumFormData);
    }

    async function handleMediaBulkUpload(event) {
        const selectedFiles = Array.from(event.target.files);
        const bulkFormData = new FormData();
        selectedFiles.forEach((fileItem) => bulkFormData.append("files", fileItem));
        try {
            setMediaUploadProgress(true);
            const response = await mediaBulkUploadService(bulkFormData, setMediaUploadProgressPercentage);
            if (response?.success) {
                let cpyCourseCurriculumFormdata = [...courseCurriculumFormData];
                const newLectures = response?.data.map((item, index) => ({
                    videoUrl: item?.url,
                    public_id: item?.public_id,
                    title: `Module ${cpyCourseCurriculumFormdata.length + (response?.data.length - index)}`,
                    freePreview: false,
                    videoSource: "upload",
                    id: Math.random().toString(36).substring(2, 11) + index,
                }));
                setCourseCurriculumFormData([...newLectures, ...cpyCourseCurriculumFormdata]);
                setMediaUploadProgress(false);
            }
        } catch (e) {
            console.log(e);
            setMediaUploadProgress(false);
        }
    }

    async function handleDeleteLecture(currentIndex) {
        let cpyCourseCurriculumFormData = [...courseCurriculumFormData];
        const getCurrentSelectedVideoPublicId = cpyCourseCurriculumFormData[currentIndex].public_id;
        if (getCurrentSelectedVideoPublicId) await mediaDeleteService(getCurrentSelectedVideoPublicId);
        cpyCourseCurriculumFormData = cpyCourseCurriculumFormData.filter((_, index) => index !== currentIndex);
        setCourseCurriculumFormData(cpyCourseCurriculumFormData);
    }

    return (
        <div className="space-y-10">
            
            {/* MODULE ACTIONS */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-4 border-b border-white/[0.04]">
                <div>
                    <h3 className="text-[20px] font-black tracking-tight text-[#f5f5f7] mb-1 leading-none">Curriculum.</h3>
                    <p className="text-[#86868b] text-[12px] font-medium tracking-tight italic">Construct your educational sequence lecture by lecture.</p>
                </div>
                <div className="flex items-center gap-3">
                    <input type="file" ref={bulkUploadInputRef} accept="video/*" multiple className="hidden" onChange={handleMediaBulkUpload} />
                    <Button
                        onClick={() => bulkUploadInputRef.current?.click()}
                        className="h-10 px-5 bg-white/[0.04] hover:bg-white/[0.08] text-[#86868b] text-[12px] font-bold rounded-xl flex items-center gap-2 transition-all border border-white/[0.04]"
                    >
                        <Upload size={14} /> Bulk Add
                    </Button>
                    <Button
                        onClick={handleNewLecture}
                        disabled={mediaUploadProgress}
                        className="h-10 px-5 bg-[#0071e3] hover:bg-[#0077ed] text-white text-[12px] font-black rounded-xl flex items-center gap-2 shadow-lg shadow-[#0071e3]/20 transition-all active:scale-95"
                    >
                        <Plus size={16} strokeWidth={3} /> Add Module
                    </Button>
                </div>
            </div>

            {/* PROGRESS BAR */}
            <AnimatePresence>
                {mediaUploadProgress && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="p-6 bg-[#0071e3]/10 border border-[#0071e3]/20 rounded-2xl"
                    >
                        <MediaProgressbar isMediaUploading={mediaUploadProgress} progress={mediaUploadProgressPercentage} />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* CURRICULUM NODES */}
            <div className="space-y-6">
                <AnimatePresence>
                    {courseCurriculumFormData.map((item, index) => (
                        <motion.div
                            key={item.id || item._id || `node-${index}`}
                            layout
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-[#111118] border border-white/[0.06] rounded-[24px] overflow-hidden group hover:border-[#0071e3]/30 transition-all"
                        >
                            <div className="flex flex-col lg:flex-row divide-y lg:divide-y-0 lg:divide-x divide-white/[0.04]">
                                
                                {/* LEFT: MEDIA CONTROLLER */}
                                <div className="w-full lg:w-[420px] p-8 space-y-6 bg-white/[0.01]">
                                    <div className="flex gap-2 p-1 bg-white/[0.03] border border-white/[0.04] rounded-xl">
                                        <button 
                                            onClick={() => handleVideoSourceChange("upload", index)}
                                            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-[11px] font-black uppercase tracking-wider transition-all ${item?.videoSource === "upload" ? 'bg-[#0071e3] text-white shadow-lg shadow-[#0071e3]/20' : 'text-[#555] hover:text-[#86868b]'}`}
                                        >
                                            <FileVideo size={14} /> Node Upload
                                        </button>
                                        <button 
                                            onClick={() => handleVideoSourceChange("external", index)}
                                            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-[11px] font-black uppercase tracking-wider transition-all ${item?.videoSource === "external" ? 'bg-[#0071e3] text-white shadow-lg shadow-[#0071e3]/20' : 'text-[#555] hover:text-[#86868b]'}`}
                                        >
                                            <Youtube size={14} /> Cloud URL
                                        </button>
                                    </div>

                                    {item?.videoUrl ? (
                                        <div className="space-y-4">
                                            <div className="aspect-video rounded-2xl overflow-hidden border border-white/[0.06] bg-black group/player relative shadow-2xl">
                                                <VideoPlayer url={item?.videoUrl} width="100%" height="100%" />
                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/player:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                                                    <Button 
                                                        onClick={(e) => { e.stopPropagation(); handleReplaceVideo(index); }}
                                                        className="pointer-events-auto w-12 h-12 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 text-white flex items-center justify-center hover:bg-white hover:text-black transition-all"
                                                    >
                                                        <RefreshCw size={20} />
                                                    </Button>
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-[#3a3a3a]">
                                                <span className="flex items-center gap-1.5"><CheckCircle2 size={12} className="text-[#30d158]" /> Bitrate Optimized</span>
                                                <button onClick={() => handleDeleteLecture(index)} className="text-[#ff453a] hover:underline">Revoke Module</button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="aspect-video rounded-2xl border-2 border-dashed border-white/[0.04] bg-white/[0.01] hover:bg-white/[0.03] transition-all cursor-pointer flex flex-col items-center justify-center p-8 text-center" 
                                             onClick={() => item?.videoSource === "upload" && bulkUploadInputRef.current?.click()}>
                                            {item?.videoSource === "upload" ? (
                                                <>
                                                    <div className="w-12 h-12 rounded-2xl bg-white/[0.04] flex items-center justify-center mb-4 text-[#444] group-hover:bg-[#0071e3] group-hover:text-white transition-all">
                                                        <Upload size={20} />
                                                    </div>
                                                    <p className="text-[14px] font-black text-[#f5f5f7] mb-1">Initialize Upload</p>
                                                    <p className="text-[10px] text-[#555] font-bold uppercase tracking-widest">Supports H.264 / HEVC</p>
                                                </>
                                            ) : (
                                                <div className="w-full space-y-4">
                                                    <div className="w-12 h-12 rounded-full bg-[#ff453a]/10 flex items-center justify-center mx-auto mb-2"><Youtube size={20} className="text-[#ff453a]" /></div>
                                                    <Input 
                                                        value={item?.videoUrl} 
                                                        onChange={(e) => handleExternalUrlChange(e, index)} 
                                                        placeholder="Vimeo, YouTube or Cloud URL..." 
                                                        className="h-10 bg-white/[0.03] border-white/10 rounded-xl text-[12px] text-center" 
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* RIGHT: FORM NODE */}
                                <div className="flex-1 p-8 space-y-8 relative">
                                    <div className="absolute top-8 right-8 text-white/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                        <MonitorPlay size={100} strokeWidth={1} />
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-white/[0.03] flex items-center justify-center text-[15px] font-black text-[#555] border border-white/[0.05]">
                                            {String(courseCurriculumFormData.length - index).padStart(2, '0')}
                                        </div>
                                        <div>
                                            <h4 className="text-[16px] font-black tracking-tight text-[#f5f5f7] leading-none mb-1">Module Metadata.</h4>
                                            <p className="text-[10px] text-[#444] font-bold uppercase tracking-[0.15em]">Sequence Configuration</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 gap-6">
                                        <div className="space-y-1.5">
                                            <Label className="text-[9px] font-black uppercase tracking-widest text-[#444] ml-1">Module Identity</Label>
                                            <Input
                                                placeholder="Enter semantic title for this lecture..."
                                                value={item?.title}
                                                onChange={(e) => handleCourseTitleChange(e, index)}
                                                className="h-12 bg-white/[0.03] border-white/[0.08] rounded-xl text-[14px] font-bold text-[#f5f5f7] focus:border-[#0071e3]/50 transition-all outline-none"
                                            />
                                        </div>

                                        <div className="flex flex-col sm:flex-row gap-6">
                                            <div className="flex-1 space-y-1.5">
                                                <Label className="text-[9px] font-black uppercase tracking-widest text-[#444] ml-1">Knowledge Notes</Label>
                                                <Textarea
                                                    placeholder="Synthesize key takeaways, code snippets or commands..."
                                                    value={item?.notes}
                                                    onChange={(e) => handleLectureNotesChange(e, index)}
                                                    className="min-h-[100px] bg-white/[0.03] border-white/[0.08] rounded-xl text-[12px] font-medium text-[#86868b] focus:border-[#0071e3]/50 transition-all outline-none leading-relaxed no-scrollbar"
                                                />
                                            </div>
                                            <div className="w-full sm:w-[200px] space-y-4">
                                                <div className="space-y-1.5 pt-1">
                                                    <Label className="text-[9px] font-black uppercase tracking-widest text-[#444] ml-1">Access Protocol</Label>
                                                    <div className={`flex items-center justify-between p-3 rounded-xl border transition-all ${item?.freePreview ? 'bg-[#30d158]/5 border-[#30d158]/20' : 'bg-white/[0.02] border-white/[0.06]'}`}>
                                                        <div className="flex items-center gap-2">
                                                            {item?.freePreview ? <Eye size={14} className="text-[#30d158]" /> : <EyeOff size={14} className="text-[#444]" />}
                                                            <span className={`text-[11px] font-bold ${item?.freePreview ? 'text-[#30d158]' : 'text-[#555]'}`}>Free Demo</span>
                                                        </div>
                                                        <Switch 
                                                            checked={item?.freePreview} 
                                                            onCheckedChange={(v) => handleFreePreviewChange(v, index)} 
                                                            className="data-[state=checked]:bg-[#30d158]" 
                                                        />
                                                    </div>
                                                </div>
                                                <div className="space-y-1.5">
                                                     <div className="flex items-center justify-between px-1">
                                                        <Label className="text-[9px] font-black uppercase tracking-widest text-[#444]">Static Assets</Label>
                                                        <button onClick={() => bulkUploadInputRef.current?.click()} className="text-[10px] text-[#0071e3] font-black hover:underline transition-all">Upload PDF</button>
                                                     </div>
                                                     <div className="flex gap-1.5 flex-wrap">
                                                        {item?.pdfs?.map((pdf, pIdx) => (
                                                            <div key={pIdx} className="bg-white/[0.05] border border-white/[0.08] px-2 py-1 rounded-lg flex items-center gap-2">
                                                                <FileText size={10} className="text-red-500" />
                                                                <span className="text-[9px] font-bold text-[#86868b] max-w-[60px] truncate">{pdf.title}</span>
                                                                <button onClick={() => handleRemovePdf(index, pIdx)} className="text-[#444] hover:text-[#ff453a]"><X size={10} /></button>
                                                            </div>
                                                        ))}
                                                        {(!item?.pdfs || item.pdfs.length === 0) && <span className="text-[9px] text-[#333] font-bold italic py-1">No attachments</span>}
                                                     </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="absolute right-0 top-1/2 -translate-y-1/2 hidden lg:flex items-center justify-center p-2 opacity-5">
                                    <GripVertical size={24} className="text-[#444]" />
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {courseCurriculumFormData.length === 0 && (
                <div className="py-32 flex flex-col items-center justify-center text-center border-2 border-dashed border-white/[0.04] rounded-[32px] bg-white/[0.01]">
                    <div className="w-16 h-16 bg-white/[0.03] rounded-3xl flex items-center justify-center mb-6 text-3xl">🧩</div>
                    <h4 className="text-[18px] font-black text-[#f5f5f7] mb-2 tracking-tight">Curriculum Node Empty.</h4>
                    <p className="text-[13px] text-[#444] max-w-[320px] leading-relaxed mb-8 font-medium">Add modules to construct the educational sequence. Use bulk upload for high-efficiency population.</p>
                    <Button
                        onClick={handleNewLecture}
                        className="h-12 px-10 bg-[#f5f5f7] hover:bg-white text-[#0a0a0f] text-[13px] font-black rounded-xl shadow-xl shadow-white/5"
                    >
                        Initialize First Module
                    </Button>
                </div>
            )}

        </div>
    );
}

export default CourseCurriculum;
