import { useContext, useState, useEffect } from "react";
import { AuthContext } from "@/context/auth-context";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { motion, AnimatePresence } from "framer-motion";
import {
    User,
    Mail,
    Camera,
    Save,
    X,
    Loader2,
    CheckCircle2,
    Trophy,
    BookOpen,
    Clock,
    FileText,
    Briefcase,
    ExternalLink
} from "lucide-react";
import { mediaUploadService, updateUserProfileService, fetchStudentCompletedCoursesService } from "@/services";
import { useToast } from "@/hooks/use-toast";
import MediaProgressbar from "@/components/media-progress-bar";
import Certificate from "@/components/certificate";
import { Dialog, DialogContent } from "@/components/ui/dialog";

function StudentProfilePage() {
    const { auth, setAuth } = useContext(AuthContext);
    const { toast } = useToast();

    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        userFullName: "",
        profileImage: "",
        userHeadline: "",
        userBio: "",
    });
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [updating, setUpdating] = useState(false);
    const [completedCourses, setCompletedCourses] = useState([]);
    const [selectedCertificate, setSelectedCertificate] = useState(null);
    const [loadingCompletedCourses, setLoadingCompletedCourses] = useState(false);

    useEffect(() => {
        if (auth?.user) {
            setFormData({
                userFullName: auth.user.userFullName || "",
                profileImage: auth.user.profileImage || "",
                userHeadline: auth.user.userHeadline || "",
                userBio: auth.user.userBio || "",
            });
            fetchCompletedCourses();
        }
    }, [auth]);

    async function fetchCompletedCourses() {
        try {
            setLoadingCompletedCourses(true);
            const response = await fetchStudentCompletedCoursesService(auth.user._id);
            if (response.success) {
                setCompletedCourses(response.data);
            }
        } catch (error) {
            console.error("Failed to fetch completed courses:", error);
        } finally {
            setLoadingCompletedCourses(false);
        }
    }

    if (!auth?.user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center"
                >
                    <Loader2 className="h-10 w-10 animate-spin text-blue-600 mx-auto mb-4" />
                    <p className="text-zinc-500 font-bold">Waking up your profile...</p>
                </motion.div>
            </div>
        );
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
                    toast({
                        title: "Image Uploaded",
                        description: "Your profile picture has been staged for saving.",
                    });
                }
            } catch (error) {
                toast({
                    title: "Upload Failed",
                    description: "Could not upload image to Cloudinary.",
                    variant: "destructive",
                });
            } finally {
                setUploading(false);
                setUploadProgress(0);
            }
        }
    }

    async function handleUpdateProfile() {
        try {
            setUpdating(true);
            const response = await updateUserProfileService({
                userId: auth.user._id,
                userFullName: formData.userFullName,
                profileImage: formData.profileImage,
                userHeadline: formData.userHeadline,
                userBio: formData.userBio,
            });

            if (response.success) {
                setAuth({
                    ...auth,
                    user: response.data,
                });
                setIsEditing(false);
                toast({
                    title: "Profile Updated",
                    description: "Your changes have been saved successfully.",
                });
            }
        } catch (error) {
            toast({
                title: "Update Failed",
                description: "Something went wrong while saving your profile.",
                variant: "destructive",
            });
        } finally {
            setUpdating(false);
        }
    }

    const stats = [
        { label: "Enrolled", value: "12", icon: BookOpen, color: "text-blue-600", bg: "bg-blue-50" },
        { label: "Completed", value: "4", icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50" },
        { label: "Points", value: "2400", icon: Trophy, color: "text-amber-600", bg: "bg-amber-50" },
        { label: "Hours", value: "86", icon: Clock, color: "text-purple-600", bg: "bg-purple-50" },
    ];

    return (
        <div className="min-h-screen bg-[#F8FAFC] pt-32 pb-24 selection:bg-blue-100">
            <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
                <div className="flex justify-center">
                    {/* Main Identity Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="w-full space-y-8"
                    >
                        {/* Premium Header Section */}
                        <div className="relative bg-white rounded-[48px] p-10 shadow-xl shadow-blue-900/5 border border-white overflow-hidden group">
                            <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />

                            <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-10">
                                {/* Avatar Section */}
                                <div className="relative shrink-0">
                                    <motion.div
                                        whileHover={{ scale: 1.02 }}
                                        className="w-44 h-44 rounded-[40px] overflow-hidden border-4 border-white shadow-2xl relative bg-zinc-100"
                                    >
                                        {formData.profileImage ? (
                                            <img
                                                src={formData.profileImage}
                                                alt="Profile"
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-zinc-300">
                                                <User className="w-20 h-20" />
                                            </div>
                                        )}

                                        <AnimatePresence>
                                            {uploading && (
                                                <motion.div
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    exit={{ opacity: 0 }}
                                                    className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center p-4"
                                                >
                                                    <Loader2 className="w-8 h-8 animate-spin text-white mb-2" />
                                                    <div className="w-full px-2">
                                                        <MediaProgressbar isMediaUploading={uploading} progress={uploadProgress} />
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </motion.div>

                                    {isEditing && (
                                        <label className="absolute -bottom-2 -right-2 w-12 h-12 bg-blue-600 text-white rounded-2xl flex items-center justify-center shadow-lg cursor-pointer hover:bg-blue-700 hover:scale-110 active:scale-90 transition-all border-4 border-white">
                                            <Camera className="w-5 h-5" />
                                            <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                                        </label>
                                    )}
                                </div>

                                {/* Identity Information */}
                                <div className="flex-1 w-full text-center md:text-left">
                                    <div className="mb-8">
                                        <span className="text-blue-600 font-black text-[10px] uppercase tracking-[0.2em] mb-3 block">Global Talent</span>
                                        {isEditing ? (
                                            <div className="space-y-4">
                                                <Input
                                                    value={formData.userFullName}
                                                    onChange={(e) => setFormData(prev => ({ ...prev, userFullName: e.target.value }))}
                                                    className="text-3xl font-black tracking-tighter h-14 rounded-2xl border-zinc-200 focus:ring-4 focus:ring-blue-100 transition-all text-center md:text-left"
                                                    placeholder="Your Full Name"
                                                />
                                                <Input
                                                    value={formData.userHeadline}
                                                    onChange={(e) => setFormData(prev => ({ ...prev, userHeadline: e.target.value }))}
                                                    className="text-lg font-bold text-blue-600 h-12 rounded-xl border-zinc-200 focus:ring-4 focus:ring-blue-100 transition-all text-center md:text-left"
                                                    placeholder="e.g. Master Student | UI Designer"
                                                />
                                            </div>
                                        ) : (
                                            <>
                                                <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-zinc-900 leading-none mb-2">
                                                    {auth.user.userFullName || auth.user.userName}
                                                </h1>
                                                <p className="text-lg font-bold text-blue-600 bg-blue-50/50 inline-block px-4 py-1 rounded-full">
                                                    {auth.user.userHeadline || "Aspiring Scholar"}
                                                </p>
                                            </>
                                        )}
                                        <div className="mt-4 flex flex-wrap items-center justify-center md:justify-start gap-4">
                                            <p className="text-zinc-400 text-sm font-medium flex items-center gap-2">
                                                <Mail className="w-4 h-4" /> {auth.user.userEmail}
                                            </p>
                                            <span className="w-1 h-1 rounded-full bg-zinc-300 hidden md:block" />
                                            <p className="text-zinc-400 text-sm font-medium flex items-center gap-2 capitalize">
                                                {auth.user.role === 'instructor' ? <CheckCircle2 className="w-4 h-4 text-blue-600" /> : <User className="w-4 h-4" />} {auth.user.role} Member
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-2">
                                        {isEditing ? (
                                            <>
                                                <Button
                                                    onClick={handleUpdateProfile}
                                                    disabled={updating || uploading}
                                                    className="bg-zinc-900 hover:bg-black text-white rounded-2xl h-12 px-8 font-bold flex items-center gap-2 shadow-xl shadow-zinc-200 transition-all hover:scale-105"
                                                >
                                                    {updating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                                    Save Changes
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    onClick={() => {
                                                        setIsEditing(false);
                                                        setFormData({
                                                            userFullName: auth.user.userFullName || "",
                                                            profileImage: auth.user.profileImage || "",
                                                            userHeadline: auth.user.userHeadline || "",
                                                            userBio: auth.user.userBio || "",
                                                        });
                                                    }}
                                                    className="rounded-2xl h-12 px-6 font-bold text-zinc-400 hover:text-red-500 hover:bg-red-50"
                                                >
                                                    <X className="w-4 h-4 mr-2" /> Cancel
                                                </Button>
                                            </>
                                        ) : (
                                            <Button
                                                onClick={() => setIsEditing(true)}
                                                className="bg-white border-2 border-zinc-900 text-zinc-900 hover:bg-zinc-900 hover:text-white rounded-2xl h-12 px-8 font-bold transition-all hover:scale-105 active:scale-95"
                                            >
                                                Edit Profile
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Certificates Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mt-12 space-y-6"
                >
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Award className="w-6 h-6 text-amber-500" />
                            <h2 className="text-2xl font-black tracking-tighter text-zinc-900">My Certificates.</h2>
                        </div>
                        <span className="bg-zinc-100 text-zinc-500 font-bold text-xs px-3 py-1 rounded-full">
                            {completedCourses.length} Achievement{completedCourses.length !== 1 ? 's' : ''}
                        </span>
                    </div>

                    {completedCourses.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {completedCourses.map((course) => (
                                <motion.div
                                    key={course.courseId}
                                    whileHover={{ y: -4 }}
                                    className="bg-white rounded-[32px] p-6 border border-zinc-100 shadow-sm hover:shadow-xl transition-all group flex items-center justify-between"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-amber-500 transition-colors">
                                            <Award className="w-7 h-7 text-amber-500 group-hover:text-white transition-colors" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-zinc-900 text-base leading-tight">
                                                {course.title}
                                            </h3>
                                            <p className="text-xs font-medium text-zinc-400 mt-1">
                                                Completed on {new Date(course.completionDate).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                    <Button
                                        onClick={() => setSelectedCertificate(course)}
                                        variant="ghost"
                                        size="icon"
                                        className="rounded-xl hover:bg-zinc-50 text-zinc-400 hover:text-blue-600"
                                    >
                                        <ExternalLink className="w-5 h-5" />
                                    </Button>
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white rounded-[40px] p-12 text-center border-2 border-dashed border-zinc-100">
                            <div className="w-16 h-16 bg-zinc-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                <FileText className="w-8 h-8 text-zinc-300" />
                            </div>
                            <h3 className="font-bold text-zinc-900">No certificates yet</h3>
                            <p className="text-sm text-zinc-500 font-medium max-w-[240px] mx-auto mt-2">
                                Complete your enrolled courses to unlock premium designed certificates.
                            </p>
                        </div>
                    )}
                </motion.div>

                {/* Certificate Viewer Dialog */}
                <Dialog open={!!selectedCertificate} onOpenChange={() => setSelectedCertificate(null)}>
                    <DialogContent className="max-w-5xl p-0 border-none bg-transparent shadow-none">
                        {selectedCertificate && (
                            <Certificate
                                userName={auth?.user?.userFullName || auth?.user?.userName}
                                courseTitle={selectedCertificate.title}
                                completionDate={new Date(selectedCertificate.completionDate).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
                                instructorName={selectedCertificate.instructorName}
                            />
                        )}
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
}

export default StudentProfilePage;
