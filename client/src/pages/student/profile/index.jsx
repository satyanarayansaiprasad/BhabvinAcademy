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
        <div className="min-h-screen bg-white pb-20">
            {/* Hero Banner */}
            <div className="relative h-[300px] xs:h-[350px] md:h-[450px] w-full bg-[#f2f2f2] border-b border-[#e6e6e6] overflow-hidden pt-24">
                <div className="container mx-auto px-4 xs:px-6 h-full flex flex-col justify-end pb-12 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col xs:flex-row items-start xs:items-end gap-6 xs:gap-10"
                    >
                        {/* Avatar */}
                        <div className="relative group">
                            <div className="w-24 h-24 xs:w-36 xs:h-36 md:w-48 md:h-48 rounded-sm overflow-hidden border-4 border-white shadow-lg relative bg-[#f2f2f2]">
                                {formData.profileImage ? (
                                    <img src={formData.profileImage} alt="Identity" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-[#d2d2d2]">
                                        <User className="w-12 h-12 xs:w-16 xs:h-16 md:w-24 md:h-24" />
                                    </div>
                                )}
                                <AnimatePresence>
                                    {uploading && (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="absolute inset-0 bg-white/80 flex flex-col items-center justify-center p-4"
                                        >
                                            <Loader2 className="w-8 h-8 animate-spin text-[#0067b8] mb-3" />
                                            <MediaProgressbar isMediaUploading={uploading} progress={uploadProgress} />
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                            {isEditing && (
                                <motion.label
                                    whileHover={{ scale: 1.05 }}
                                    className="absolute -bottom-2 -right-2 w-10 h-10 bg-[#0067b8] text-white rounded-sm flex items-center justify-center shadow-lg cursor-pointer border-2 border-white z-20"
                                >
                                    <Camera className="w-5 h-5" />
                                    <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                                </motion.label>
                            )}
                        </div>

                        {/* Name & Headline */}
                        <div className="flex-1 text-left pb-4">
                            {isEditing ? (
                                <div className="space-y-3 max-w-xl">
                                    <Input
                                        value={formData.userFullName}
                                        onChange={(e) => setFormData(prev => ({ ...prev, userFullName: e.target.value }))}
                                        className="h-12 xs:h-14 md:h-16 rounded-sm bg-white border-[#e6e6e6] text-black text-xl md:text-3xl font-semibold placeholder:text-[#d2d2d2] focus:ring-[#0067b8]"
                                        placeholder="Full Name"
                                    />
                                    <Input
                                        value={formData.userHeadline}
                                        onChange={(e) => setFormData(prev => ({ ...prev, userHeadline: e.target.value }))}
                                        className="h-10 xs:h-12 rounded-sm bg-white border-[#e6e6e6] text-[#0067b8] text-sm md:text-base font-semibold placeholder:text-[#0067b8]/40 focus:ring-[#0067b8]"
                                        placeholder="Professional Headline"
                                    />
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    <div className="flex items-center gap-3">
                                        <h1 className="text-2xl xs:text-4xl md:text-5xl font-semibold tracking-tight text-black leading-none">
                                            {auth.user.userFullName || auth.user.userName}
                                        </h1>
                                        <div className="bg-[#0067b8]/10 p-1.5 rounded-sm">
                                            <ShieldCheck className="w-4 h-4 md:w-5 md:h-5 text-[#0067b8]" />
                                        </div>
                                    </div>
                                    <p className="text-base xs:text-xl md:text-2xl font-normal text-[#616161] tracking-tight">
                                        {auth.user.userHeadline || "Individual Learner"}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Desktop Stats */}
                        <div className="hidden lg:flex items-center gap-10 bg-white border border-[#e6e6e6] p-8 rounded-sm shadow-sm mb-4">
                            <div className="text-center">
                                <p className="text-black text-3xl font-semibold leading-none mb-1">{completedCourses.length}</p>
                                <p className="text-[#616161] text-[10px] uppercase font-semibold tracking-wider">Awards</p>
                            </div>
                            <div className="w-[1px] h-10 bg-[#e6e6e6]" />
                            <div className="text-center">
                                <p className="text-black text-3xl font-semibold leading-none mb-1">08</p>
                                <p className="text-[#616161] text-[10px] uppercase font-semibold tracking-wider">Courses</p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Body */}
            <div className="container mx-auto px-4 xs:px-6 mt-[-40px] xs:mt-[-50px] md:mt-[-60px] relative z-20">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-10">
                    {/* Left Panel */}
                    <div className="lg:col-span-4 space-y-8">
                        {/* Mobile Stats */}
                        <div className="flex lg:hidden items-stretch gap-4 bg-white rounded-sm border border-[#e6e6e6] shadow-md p-6">
                            <div className="flex-1 text-center">
                                <p className="text-black text-2xl font-semibold leading-none mb-1">{completedCourses.length}</p>
                                <p className="text-[#616161] text-[10px] uppercase font-semibold tracking-wider">Awards</p>
                            </div>
                            <div className="w-[1px] bg-[#e6e6e6]" />
                            <div className="flex-1 text-center">
                                <p className="text-black text-2xl font-semibold leading-none mb-1">08</p>
                                <p className="text-[#616161] text-[10px] uppercase font-semibold tracking-wider">Courses</p>
                            </div>
                        </div>

                        {/* Status Card */}
                        <Card className="rounded-sm border-[#e6e6e6] shadow-md bg-white overflow-hidden">
                            <CardContent className="p-6 md:p-8 space-y-6">
                                <div className="space-y-5">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-[#f2f2f2] rounded-sm">
                                            <Mail className="w-5 h-5 text-[#616161]" />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-[10px] font-semibold uppercase tracking-wider text-[#616161]">Email Address</p>
                                            <p className="text-black font-semibold text-sm truncate">{auth.user.userEmail}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-[#f2f2f2] rounded-sm">
                                            <Trophy className="w-5 h-5 text-[#0067b8]" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-semibold uppercase tracking-wider text-[#616161]">Membership</p>
                                            <p className="text-black font-semibold text-sm">Verified Learner</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="h-[1px] bg-[#e6e6e6] w-full" />

                                <div className="flex flex-col gap-4">
                                    {isEditing ? (
                                        <div className="flex gap-3">
                                            <Button
                                                onClick={handleUpdateProfile}
                                                disabled={updating || uploading}
                                                className="flex-1 bg-[#0067b8] hover:bg-[#005a9e] text-white rounded-sm h-12 md:h-14 font-semibold tracking-tight flex items-center justify-center gap-2 transition-none shadow-sm"
                                            >
                                                {updating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                                Save changes
                                            </Button>
                                            <Button
                                                variant="outline"
                                                onClick={() => setIsEditing(false)}
                                                className="h-12 md:h-14 px-4 rounded-sm border-[#e6e6e6] text-black hover:bg-[#f2f2f2] transition-none"
                                            >
                                                <X className="w-5 h-5" />
                                            </Button>
                                        </div>
                                    ) : (
                                        <Button
                                            onClick={() => setIsEditing(true)}
                                            className="w-full bg-[#0067b8] hover:bg-[#005a9e] text-white rounded-sm h-12 md:h-14 font-semibold tracking-tight transition-none shadow-sm uppercase text-xs"
                                        >
                                            Edit profile
                                        </Button>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Streak Card */}
                        <div className="bg-[#f2f2f2] border border-[#e6e6e6] rounded-sm p-6 md:p-8 text-black shadow-sm relative overflow-hidden group">
                            <Star className="w-8 h-8 text-[#0067b8] mb-4 group-hover:rotate-12 transition-transform duration-500" />
                            <h3 className="text-xl font-semibold tracking-tight mb-2">Learning streak</h3>
                            <p className="text-[#616161] text-sm leading-relaxed">You've completed 4 modules this week. Keep going to earn your next badge!</p>
                        </div>
                    </div>

                    {/* Right Panel: Hall of Fame */}
                    <div className="lg:col-span-8 space-y-8 md:space-y-10">
                        <div className="flex items-center justify-between border-b border-[#e6e6e6] pb-6 md:pb-8">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 md:w-14 md:h-14 bg-[#0067b8] rounded-sm flex items-center justify-center shadow-lg shrink-0">
                                    <Award className="w-6 h-6 md:w-8 md:h-8 text-white" />
                                </div>
                                <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold tracking-tight text-black">
                                    Hall of Fame
                                </h2>
                            </div>
                            <div className="hidden xs:block px-4 py-2 bg-[#0067b8]/10 rounded-sm text-[#0067b8] font-semibold text-xs tracking-wider">
                                {completedCourses.length} ACHIEVEMENTS
                            </div>
                        </div>

                        {completedCourses.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                                {completedCourses.map((course, idx) => (
                                    <motion.div
                                        key={course.courseId}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.05 * idx }}
                                        className="group"
                                    >
                                        <Card className="relative overflow-hidden border-[#e6e6e6] shadow-md rounded-sm bg-white p-0 transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-lg">
                                            <CardContent className="p-6 md:p-8 flex flex-col justify-between h-[280px] md:h-[320px]">
                                                <div className="space-y-4 md:space-y-6">
                                                    <div className="flex items-center justify-between">
                                                        <div className="p-3 bg-[#f2f2f2] rounded-sm group-hover:bg-[#0067b8] transition-colors duration-300">
                                                            <Award className="w-6 h-6 md:w-8 md:h-8 text-[#0067b8] group-hover:text-white" />
                                                        </div>
                                                        <ShieldCheck className="w-5 h-5 md:w-6 md:h-6 text-[#28a745]/30 group-hover:text-[#28a745] transition-colors" />
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] font-semibold tracking-widest text-[#616161] uppercase mb-2">Verified Achievement</p>
                                                        <h3 className="text-xl md:text-2xl font-semibold text-black leading-tight tracking-tight mb-2 line-clamp-2">
                                                            {course.title}
                                                        </h3>
                                                    </div>
                                                </div>
                                                <div className="pt-6 border-t border-[#f2f2f2] flex items-center justify-between">
                                                    <div className="space-y-1 text-left">
                                                        <p className="text-[9px] font-semibold text-[#616161] uppercase tracking-wider">Earned on</p>
                                                        <p className="text-black font-semibold text-xs md:text-sm">{new Date(course.completionDate).toLocaleDateString()}</p>
                                                    </div>
                                                    <motion.button
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        onClick={() => handleTriggerDownload(course)}
                                                        className="w-12 h-12 md:w-14 md:h-14 rounded-sm bg-[#0067b8] text-white flex items-center justify-center shadow-md hover:bg-[#005a9e] transition-none group/btn"
                                                    >
                                                        <Download className="w-5 h-5 md:w-6 md:h-6 group-hover/btn:translate-y-0.5 transition-transform" />
                                                    </motion.button>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                ))}
                            </div>
                        ) : (
                            <div className="bg-[#f2f2f2] rounded-sm p-12 md:p-20 text-center border-2 border-dashed border-[#e6e6e6] flex flex-col items-center">
                                <div className="w-16 h-16 md:w-24 md:h-24 bg-white rounded-sm flex items-center justify-center mb-6 shadow-sm">
                                    <BookOpen className="w-8 h-8 md:w-12 md:h-12 text-[#d2d2d2]" />
                                </div>
                                <h3 className="font-semibold text-2xl md:text-3xl text-black mb-3">The Hall Awaits</h3>
                                <p className="text-[#616161] font-normal max-w-sm text-base md:text-lg leading-relaxed">
                                    Your wall of excellence is currently empty. Complete a course to earn your first certification.
                                </p>
                                <Button className="mt-8 bg-[#0067b8] hover:bg-[#005a9e] text-white rounded-sm px-8 h-12 font-semibold uppercase tracking-wider text-xs transition-none shadow-sm">
                                    Browse Courses
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
