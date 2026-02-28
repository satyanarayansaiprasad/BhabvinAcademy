import { useContext, useState, useEffect } from "react";
import { AuthContext } from "@/context/auth-context";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import {
    User, Mail, Camera, Save, X, Loader2,
    Award, Download, Trophy, BookOpen,
    ArrowRight, Star, ShieldCheck
} from "lucide-react";
import { mediaUploadService, updateUserProfileService, fetchStudentCompletedCoursesService } from "@/services";
import { useToast } from "@/hooks/use-toast";
import MediaProgressbar from "@/components/media-progress-bar";
import Certificate from "@/components/certificate";

function StudentProfilePage() {
    const { auth, setAuth } = useContext(AuthContext);
    const { toast } = useToast();

    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({ userFullName: "", profileImage: "", userHeadline: "" });
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [updating, setUpdating] = useState(false);
    const [completedCourses, setCompletedCourses] = useState([]);
    const [downloadingCourse, setDownloadingCourse] = useState(null);
    const [loadingCompletedCourses, setLoadingCompletedCourses] = useState(false);

    useEffect(() => {
        if (auth?.user) {
            setFormData({
                userFullName: auth.user.userFullName || "",
                profileImage: auth.user.profileImage || "",
                userHeadline: auth.user.userHeadline || "",
            });
            fetchCompletedCourses();
        }
    }, [auth]);

    async function fetchCompletedCourses() {
        try {
            setLoadingCompletedCourses(true);
            const response = await fetchStudentCompletedCoursesService(auth.user._id);
            if (response.success) setCompletedCourses(response.data);
        } catch (error) {
            console.error("Failed to fetch completed courses:", error);
        } finally {
            setLoadingCompletedCourses(false);
        }
    }

    async function handleImageUpload(event) {
        const file = event.target.files[0];
        if (file) {
            const imageFormData = new FormData();
            imageFormData.append("file", file);
            try {
                setUploading(true);
                const response = await mediaUploadService(imageFormData, setUploadProgress);
                if (response.success) {
                    setFormData(prev => ({ ...prev, profileImage: response.data.url }));
                    toast({ title: "Visual Identity Updated", description: "Preview synced. Save to finalize." });
                }
            } catch {
                toast({ title: "System Error", description: "Identity asset could not be synced.", variant: "destructive" });
            } finally {
                setUploading(false);
                setUploadProgress(0);
            }
        }
    }

    async function handleUpdateProfile() {
        if (!formData.userFullName.trim()) {
            toast({ title: "Validation Error", description: "Name is a required credential.", variant: "destructive" });
            return;
        }
        try {
            setUpdating(true);
            const response = await updateUserProfileService({
                userId: auth.user._id,
                userFullName: formData.userFullName,
                profileImage: formData.profileImage,
                userHeadline: formData.userHeadline,
            });
            if (response.success) {
                setAuth({ ...auth, user: response.data });
                setIsEditing(false);
                toast({ title: "Identity Verified", description: "Your professional profile has been securely updated." });
            }
        } catch {
            toast({ title: "Update Failed", description: "Security layer blocked the update or server error.", variant: "destructive" });
        } finally {
            setUpdating(false);
        }
    }

    const handleTriggerDownload = (course) => {
        toast({ title: "Securing Credentials", description: `Generating certificate for ${course.title}...` });
        setDownloadingCourse(course);
    };

    if (!auth?.user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#0F172A]">
                <Loader2 className="h-12 w-12 animate-spin text-amber-500" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FDFDFF] pb-16 xs:pb-32">
            {/* Hero Banner */}
            <div className="relative h-[280px] xs:h-[350px] md:h-[450px] w-full bg-[#0F172A] overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/40 via-transparent to-amber-900/20" />
                <div className="absolute top-0 right-0 w-[400px] xs:w-[600px] md:w-[800px] h-[400px] xs:h-[600px] md:h-[800px] bg-amber-500/10 rounded-full blur-[150px] -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-[300px] xs:w-[400px] md:w-[600px] h-[300px] xs:h-[400px] md:h-[600px] bg-blue-500/10 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2" />

                <div className="container mx-auto px-4 xs:px-6 h-full flex flex-col justify-end pb-14 xs:pb-20 md:pb-24 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col xs:flex-row items-start xs:items-end gap-5 xs:gap-10"
                    >
                        {/* Avatar */}
                        <div className="relative group">
                            <div className="w-24 h-24 xs:w-36 xs:h-36 md:w-48 md:h-48 rounded-[28px] xs:rounded-[40px] md:rounded-[60px] overflow-hidden border-[4px] xs:border-[6px] md:border-[8px] border-[#0F172A] shadow-2xl relative bg-zinc-800">
                                {formData.profileImage ? (
                                    <img src={formData.profileImage} alt="Identity" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-zinc-700">
                                        <User className="w-12 h-12 xs:w-16 xs:h-16 md:w-24 md:h-24" />
                                    </div>
                                )}
                                <AnimatePresence>
                                    {uploading && (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="absolute inset-0 bg-black/80 backdrop-blur-md flex flex-col items-center justify-center p-4 xs:p-8"
                                        >
                                            <Loader2 className="w-8 h-8 xs:w-10 xs:h-10 animate-spin text-amber-500 mb-3 xs:mb-4" />
                                            <MediaProgressbar isMediaUploading={uploading} progress={uploadProgress} />
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                            {isEditing && (
                                <motion.label
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    className="absolute -bottom-3 -right-3 w-12 h-12 xs:w-14 xs:h-14 md:w-16 md:h-16 bg-amber-500 text-[#0F172A] rounded-[16px] xs:rounded-[20px] md:rounded-[24px] flex items-center justify-center shadow-xl cursor-pointer border-4 border-[#0F172A] z-20 min-w-[44px] min-h-[44px]"
                                >
                                    <Camera className="w-5 h-5 xs:w-6 xs:h-6 md:w-7 md:h-7" />
                                    <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                                </motion.label>
                            )}
                        </div>

                        {/* Name & Headline */}
                        <div className="flex-1 text-left pb-2 xs:pb-4">
                            {isEditing ? (
                                <div className="space-y-3 xs:space-y-4 max-w-xl">
                                    <Input
                                        value={formData.userFullName}
                                        onChange={(e) => setFormData(prev => ({ ...prev, userFullName: e.target.value }))}
                                        className="h-12 xs:h-14 md:h-16 rounded-[16px] xs:rounded-[20px] md:rounded-[24px] bg-white/5 border-white/10 text-white text-base xs:text-xl md:text-3xl font-black placeholder:text-white/20 focus:ring-amber-500"
                                        placeholder="Full Name"
                                    />
                                    <Input
                                        value={formData.userHeadline}
                                        onChange={(e) => setFormData(prev => ({ ...prev, userHeadline: e.target.value }))}
                                        className="h-11 xs:h-12 md:h-14 rounded-[14px] xs:rounded-[18px] md:rounded-[20px] bg-white/5 border-white/10 text-amber-400 text-sm xs:text-base md:text-lg font-bold placeholder:text-amber-400/20 focus:ring-amber-500"
                                        placeholder="Professional Headline"
                                    />
                                </div>
                            ) : (
                                <div className="space-y-2 xs:space-y-3">
                                    <div className="flex items-center gap-3 xs:gap-4">
                                        <h1 className="text-2xl xs:text-4xl md:text-5xl lg:text-7xl font-black tracking-tighter text-white uppercase leading-none">
                                            {auth.user.userFullName || auth.user.userName}
                                        </h1>
                                        <div className="hidden xs:block bg-amber-500/10 border border-amber-500/20 p-1.5 xs:p-2 rounded-lg xs:rounded-xl shrink-0">
                                            <ShieldCheck className="w-4 h-4 xs:w-5 xs:h-5 md:w-6 md:h-6 text-amber-500" />
                                        </div>
                                    </div>
                                    <p className="text-base xs:text-xl md:text-2xl font-bold text-amber-400/90 tracking-tight">
                                        {auth.user.userHeadline || "Elite Scholar"}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Desktop Stats */}
                        <div className="hidden lg:flex items-center gap-10 bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-[40px] shadow-4xl mb-4">
                            <div className="text-center">
                                <p className="text-white text-3xl font-black leading-none mb-1">{completedCourses.length}</p>
                                <p className="text-white/40 text-[10px] uppercase font-black tracking-[0.2em]">Awards</p>
                            </div>
                            <div className="w-[1px] h-10 bg-white/10" />
                            <div className="text-center">
                                <p className="text-white text-3xl font-black leading-none mb-1">08</p>
                                <p className="text-white/40 text-[10px] uppercase font-black tracking-[0.2em]">Courses</p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Body */}
            <div className="container mx-auto px-4 xs:px-6 mt-[-40px] xs:mt-[-50px] md:mt-[-60px] relative z-20">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 xs:gap-8 md:gap-10">
                    {/* Left Panel */}
                    <div className="lg:col-span-4 space-y-5 xs:space-y-8 md:space-y-10">
                        {/* Mobile Stats */}
                        <div className="flex lg:hidden items-stretch gap-4 bg-white rounded-[28px] xs:rounded-[40px] border-none shadow-lg xs:shadow-xl overflow-hidden p-5 xs:p-8">
                            <div className="flex-1 text-center">
                                <p className="text-[#0F172A] text-2xl xs:text-3xl font-black leading-none mb-1">{completedCourses.length}</p>
                                <p className="text-zinc-400 text-[10px] uppercase font-black tracking-[0.2em]">Awards</p>
                            </div>
                            <div className="w-[1px] bg-zinc-100" />
                            <div className="flex-1 text-center">
                                <p className="text-[#0F172A] text-2xl xs:text-3xl font-black leading-none mb-1">08</p>
                                <p className="text-zinc-400 text-[10px] uppercase font-black tracking-[0.2em]">Courses</p>
                            </div>
                        </div>

                        {/* Status Card */}
                        <Card className="rounded-[28px] xs:rounded-[48px] border-none shadow-lg xs:shadow-xl bg-white overflow-hidden">
                            <CardContent className="p-5 xs:p-8 md:p-10 space-y-5 xs:space-y-8">
                                <div className="space-y-4 xs:space-y-6">
                                    <div className="flex items-center gap-3 xs:gap-4">
                                        <div className="p-2 xs:p-3 bg-zinc-50 rounded-xl xs:rounded-2xl">
                                            <Mail className="w-4 h-4 xs:w-6 xs:h-6 text-zinc-400" />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Official Email</p>
                                            <p className="text-zinc-900 font-bold text-sm xs:text-base truncate">{auth.user.userEmail}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 xs:gap-4">
                                        <div className="p-2 xs:p-3 bg-zinc-50 rounded-xl xs:rounded-2xl">
                                            <Trophy className="w-4 h-4 xs:w-6 xs:h-6 text-amber-500" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Membership Tier</p>
                                            <p className="text-zinc-900 font-black uppercase text-xs xs:text-sm tracking-tight">VIP Premium Scholar</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="h-[1px] bg-zinc-50 w-full" />

                                <div className="flex flex-col gap-3 xs:gap-4">
                                    {isEditing ? (
                                        <div className="flex gap-3 xs:gap-4">
                                            <Button
                                                onClick={handleUpdateProfile}
                                                disabled={updating || uploading}
                                                className="flex-1 bg-[#0F172A] hover:bg-black text-white rounded-[18px] xs:rounded-[24px] h-12 xs:h-14 md:h-16 font-black tracking-tight flex items-center gap-2 xs:gap-3 transition-all hover:scale-[1.02] shadow-2xl xs:shadow-3xl text-sm xs:text-base min-h-[44px]"
                                            >
                                                {updating ? <Loader2 className="w-4 h-4 xs:w-5 xs:h-5 animate-spin" /> : <Save className="w-4 h-4 xs:w-5 xs:h-5" />}
                                                Confirm
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                onClick={() => setIsEditing(false)}
                                                className="h-12 xs:h-14 md:h-16 w-12 xs:w-14 md:w-16 p-0 rounded-[18px] xs:rounded-[24px] border-2 border-zinc-100 hover:bg-red-50 hover:text-red-500 text-zinc-400 transition-all min-w-[44px] min-h-[44px]"
                                            >
                                                <X className="w-5 h-5 xs:w-6 xs:h-6" />
                                            </Button>
                                        </div>
                                    ) : (
                                        <Button
                                            onClick={() => setIsEditing(true)}
                                            className="w-full bg-white border-2 border-zinc-900 text-zinc-900 hover:bg-zinc-900 hover:text-white rounded-[20px] xs:rounded-[28px] h-12 xs:h-14 md:h-16 font-black tracking-tight transition-all hover:scale-[1.02] active:scale-95 shadow-lg xs:shadow-xl uppercase text-xs min-h-[44px]"
                                        >
                                            Edit Professional Identity
                                        </Button>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Streak Card */}
                        <div className="bg-gradient-to-br from-[#0F172A] to-[#1E293B] rounded-[28px] xs:rounded-[48px] p-6 xs:p-8 md:p-10 text-white shadow-lg xs:shadow-2xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-24 xs:w-32 h-24 xs:h-32 bg-amber-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                            <Star className="w-8 h-8 xs:w-10 xs:h-10 text-amber-500 mb-4 xs:mb-6 group-hover:rotate-12 transition-transform" />
                            <h3 className="text-xl xs:text-2xl font-black tracking-tight mb-2">Learning Streak</h3>
                            <p className="text-white/50 text-xs xs:text-sm leading-relaxed mb-4 xs:mb-6">You've completed 4 modules this week. Keep the momentum going to unlock the Master Badge.</p>
                            <Button variant="link" className="text-amber-400 p-0 h-auto font-black flex items-center gap-2 group/btn text-sm xs:text-base">
                                View Dashboard <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                            </Button>
                        </div>
                    </div>

                    {/* Right Panel: Hall of Fame */}
                    <div className="lg:col-span-8 space-y-8 xs:space-y-12">
                        <div className="flex items-center justify-between border-b border-zinc-100 pb-5 xs:pb-8 md:pb-10">
                            <div className="flex items-center gap-3 xs:gap-6">
                                <div className="w-10 h-10 xs:w-14 xs:h-14 md:w-16 md:h-16 bg-[#0F172A] rounded-[16px] xs:rounded-[24px] flex items-center justify-center rotate-3 shadow-xl shrink-0">
                                    <Award className="w-6 h-6 xs:w-7 xs:h-7 md:w-8 md:h-8 text-amber-500" />
                                </div>
                                <h2 className="text-2xl xs:text-3xl md:text-4xl lg:text-5xl font-black tracking-tighter text-[#0F172A] uppercase">
                                    Hall of Fame
                                </h2>
                            </div>
                            <div className="flex items-center gap-2 xs:gap-3">
                                <div className="hidden xs:block px-3 xs:px-5 py-1.5 xs:py-2 bg-amber-500 rounded-full text-[#0F172A] font-black text-xs shadow-lg shadow-amber-500/20">
                                    {completedCourses.length} EARNED
                                </div>
                            </div>
                        </div>

                        {completedCourses.length > 0 ? (
                            <div className="grid grid-cols-1 xs:grid-cols-2 gap-5 xs:gap-8 md:gap-10">
                                {completedCourses.map((course, idx) => (
                                    <motion.div
                                        key={course.courseId}
                                        initial={{ opacity: 0, y: 30 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.1 * idx }}
                                        className="group relative"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-br from-amber-400 to-amber-600 rounded-[36px] xs:rounded-[50px] opacity-0 group-hover:opacity-100 blur-[20px] transition-all duration-500 -z-10 scale-95" />
                                        <Card className="relative overflow-hidden border-none shadow-lg xs:shadow-2xl rounded-[36px] xs:rounded-[48px] bg-white p-0.5 xs:p-1 transition-all duration-500 group-hover:-translate-y-2 group-hover:shadow-6xl">
                                            <CardContent className="p-6 xs:p-8 md:p-10 flex flex-col justify-between h-[260px] xs:h-[320px] md:h-[360px]">
                                                <div className="space-y-4 xs:space-y-6">
                                                    <div className="flex items-center justify-between">
                                                        <div className="p-3 xs:p-4 bg-zinc-50 rounded-[16px] xs:rounded-[20px] group-hover:bg-[#0F172A] transition-colors">
                                                            <Award className="w-6 h-6 xs:w-8 xs:h-8 text-amber-500" />
                                                        </div>
                                                        <ShieldCheck className="w-5 h-5 xs:w-6 xs:h-6 text-emerald-500 opacity-20 group-hover:opacity-100 transition-opacity" />
                                                    </div>
                                                    <div>
                                                        <p className="text-[11px] font-black tracking-[0.3em] text-zinc-300 uppercase mb-1 xs:mb-2">Verified Achievement</p>
                                                        <h3 className="text-xl xs:text-2xl md:text-3xl font-black text-[#0F172A] leading-[1.1] tracking-tighter mb-2 xs:mb-4 line-clamp-2">
                                                            {course.title}
                                                        </h3>
                                                    </div>
                                                </div>
                                                <div className="pt-4 xs:pt-6 md:pt-8 border-t border-zinc-50 flex items-center justify-between">
                                                    <div className="space-y-1">
                                                        <p className="text-[9px] font-black text-zinc-300 uppercase tracking-widest">Convocation</p>
                                                        <p className="text-zinc-600 font-bold text-xs xs:text-sm">{new Date(course.completionDate).toLocaleDateString()}</p>
                                                    </div>
                                                    <motion.button
                                                        whileHover={{ scale: 1.1 }}
                                                        whileTap={{ scale: 0.9 }}
                                                        onClick={() => handleTriggerDownload(course)}
                                                        className="w-12 h-12 xs:w-14 xs:h-14 md:w-16 md:h-16 rounded-[16px] xs:rounded-[20px] md:rounded-[24px] bg-[#0F172A] text-white flex items-center justify-center shadow-xl hover:bg-black transition-all group/btn min-w-[44px] min-h-[44px]"
                                                    >
                                                        <Download className="w-5 h-5 xs:w-6 xs:h-6 group-hover/btn:translate-y-1 transition-transform" />
                                                    </motion.button>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                ))}
                            </div>
                        ) : (
                            <div className="bg-white rounded-[40px] xs:rounded-[60px] p-10 xs:p-16 md:p-24 text-center border-2 border-dashed border-zinc-100 shadow-inner flex flex-col items-center">
                                <div className="w-20 h-20 xs:w-28 xs:h-28 md:w-32 md:h-32 bg-zinc-50 rounded-full flex items-center justify-center mb-6 xs:mb-8 md:mb-10 shadow-sm">
                                    <BookOpen className="w-10 h-10 xs:w-12 xs:h-12 md:w-14 md:h-14 text-zinc-200" />
                                </div>
                                <h3 className="font-black text-2xl xs:text-3xl md:text-4xl text-[#0F172A] mb-2 xs:mb-4 tracking-tighter uppercase">The Hall Awaits.</h3>
                                <p className="text-zinc-400 font-medium max-w-[280px] xs:max-w-[320px] text-base xs:text-lg md:text-xl leading-relaxed">
                                    Your wall of excellence is currently silent. Complete a course to earn your first elite credential.
                                </p>
                                <Button className="mt-8 xs:mt-10 md:mt-12 bg-zinc-900 text-white rounded-full px-8 xs:px-10 h-12 xs:h-14 md:h-16 font-bold uppercase tracking-widest text-xs hover:bg-black min-h-[44px]">
                                    Explore Courses
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Certificate Downloader */}
            <AnimatePresence>
                {downloadingCourse && (
                    <Certificate
                        key={downloadingCourse.courseId}
                        userName={auth?.user?.userFullName || auth?.user?.userName}
                        courseTitle={downloadingCourse.title}
                        completionDate={new Date(downloadingCourse.completionDate).toLocaleDateString('en-IN', {
                            year: 'numeric', month: 'long', day: 'numeric'
                        })}
                        instructorName={downloadingCourse.instructorName}
                        silentDownload={true}
                        onDownloadComplete={() => setDownloadingCourse(null)}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}

export default StudentProfilePage;
