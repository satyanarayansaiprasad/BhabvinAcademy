import { useContext, useState, useEffect } from "react";
import { AuthContext } from "@/context/auth-context";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import {
    User,
    Mail,
    Camera,
    Save,
    X,
    Loader2,
    CheckCircle2,
    Award,
    FileText,
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
                        description: "Preview updated. Don't forget to save changes.",
                    });
                }
            } catch (error) {
                toast({
                    title: "Upload Failed",
                    description: "Image could not be uploaded.",
                    variant: "destructive",
                });
            } finally {
                setUploading(false);
                setUploadProgress(0);
            }
        }
    }

    async function handleUpdateProfile() {
        if (!formData.userFullName.trim()) {
            toast({
                title: "Error",
                description: "Name cannot be empty.",
                variant: "destructive"
            });
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
                setAuth({
                    ...auth,
                    user: response.data,
                });
                setIsEditing(false);
                toast({
                    title: "Profile Saved",
                    description: "Your digital identity has been updated.",
                });
            }
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to save changes.",
                variant: "destructive",
            });
        } finally {
            setUpdating(false);
        }
    }

    if (!auth?.user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <Loader2 className="h-10 w-10 animate-spin text-zinc-900" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FBFBFC] pt-32 pb-24">
            <div className="container mx-auto px-4 max-w-4xl">

                {/* Main Profile Card - Centered */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col items-center"
                >
                    <div className="w-full bg-white rounded-[48px] p-10 md:p-16 shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-zinc-100 relative overflow-hidden">
                        {/* Abstract Background Decoration */}
                        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-50/50 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />

                        <div className="relative z-10 flex flex-col items-center text-center">

                            {/* Avatar with Ring */}
                            <div className="relative mb-10 group">
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    className="w-40 h-40 md:w-48 md:h-48 rounded-[50px] overflow-hidden border-[6px] border-white shadow-2xl relative bg-zinc-50"
                                >
                                    {formData.profileImage ? (
                                        <img src={formData.profileImage} alt="Profile" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-zinc-200">
                                            <User className="w-24 h-24" />
                                        </div>
                                    )}

                                    <AnimatePresence>
                                        {uploading && (
                                            <motion.div
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center p-6"
                                            >
                                                <Loader2 className="w-8 h-8 animate-spin text-white mb-3" />
                                                <MediaProgressbar isMediaUploading={uploading} progress={uploadProgress} />
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>

                                {isEditing && (
                                    <label className="absolute -bottom-2 -right-2 w-14 h-14 bg-zinc-900 text-white rounded-[20px] flex items-center justify-center shadow-2xl cursor-pointer hover:bg-black transition-all border-4 border-white active:scale-90">
                                        <Camera className="w-6 h-6" />
                                        <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                                    </label>
                                )}
                            </div>

                            {/* Info Section */}
                            <div className="w-full max-w-lg">
                                {isEditing ? (
                                    <div className="space-y-4 mb-10 text-left">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-4">Full Name</label>
                                            <Input
                                                value={formData.userFullName}
                                                onChange={(e) => setFormData(prev => ({ ...prev, userFullName: e.target.value }))}
                                                className="h-16 rounded-3xl border-zinc-100 text-xl font-bold focus:ring-zinc-900"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-4">Headline / Role</label>
                                            <Input
                                                value={formData.userHeadline}
                                                onChange={(e) => setFormData(prev => ({ ...prev, userHeadline: e.target.value }))}
                                                className="h-16 rounded-3xl border-zinc-100 text-lg font-medium text-blue-600 focus:ring-blue-600"
                                                placeholder="e.g. Full Stack Developer"
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    <div className="mb-10">
                                        <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-zinc-900 mb-4 uppercase">
                                            {auth.user.userFullName || auth.user.userName}
                                        </h1>
                                        <p className="text-xl font-bold text-blue-600 tracking-tight">
                                            {auth.user.userHeadline || "Scholar Member"}
                                        </p>
                                        <div className="flex items-center justify-center gap-6 mt-6">
                                            <div className="flex items-center gap-2 text-zinc-400 font-bold text-sm">
                                                <Mail className="w-4 h-4" /> {auth.user.userEmail}
                                            </div>
                                            <div className="w-1.5 h-1.5 rounded-full bg-zinc-200" />
                                            <div className="flex items-center gap-2 text-zinc-400 font-bold text-sm capitalize">
                                                <CheckCircle2 className="w-4 h-4 text-zinc-900" /> {auth.user.role}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Action Buttons */}
                                <div className="flex items-center justify-center gap-4">
                                    {isEditing ? (
                                        <>
                                            <Button
                                                onClick={handleUpdateProfile}
                                                disabled={updating || uploading}
                                                className="bg-zinc-900 hover:bg-black text-white rounded-3xl h-16 px-10 font-bold flex items-center gap-3 transition-all hover:scale-105"
                                            >
                                                {updating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                                                Save Changes
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                onClick={() => setIsEditing(false)}
                                                className="rounded-3xl h-16 px-8 font-bold text-zinc-400 hover:text-red-500 hover:bg-red-50"
                                            >
                                                Cancel
                                            </Button>
                                        </>
                                    ) : (
                                        <Button
                                            onClick={() => setIsEditing(true)}
                                            className="bg-white border-2 border-zinc-900 text-zinc-900 hover:bg-zinc-900 hover:text-white rounded-[32px] h-16 px-12 font-black transition-all hover:scale-105 active:scale-95 shadow-xl shadow-zinc-900/5 uppercase tracking-tighter"
                                        >
                                            Edit Identity
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Certificates Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mt-20 space-y-10"
                >
                    <div className="flex items-center justify-between border-b border-zinc-100 pb-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-amber-500 rounded-2xl rotate-3 shadow-lg shadow-amber-500/20">
                                <Award className="w-6 h-6 text-white" />
                            </div>
                            <h2 className="text-3xl font-black tracking-tighter text-zinc-900">Academic Achievements.</h2>
                        </div>
                        <span className="bg-zinc-900 text-white font-black text-[10px] px-4 py-2 rounded-full uppercase tracking-widest shadow-lg shadow-zinc-900/10">
                            {completedCourses.length} Earned
                        </span>
                    </div>

                    {completedCourses.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {completedCourses.map((course) => (
                                <motion.div
                                    key={course.courseId}
                                    whileHover={{ y: -6 }}
                                    className="bg-white rounded-[40px] p-8 border border-zinc-100 shadow-sm hover:shadow-2xl transition-all group flex items-center justify-between"
                                >
                                    <div className="flex items-center gap-6">
                                        <div className="w-16 h-16 bg-amber-50 rounded-[20px] flex items-center justify-center shrink-0 group-hover:bg-amber-500 transition-colors shadow-inner">
                                            <Award className="w-8 h-8 text-amber-500 group-hover:text-white transition-colors" />
                                        </div>
                                        <div className="max-w-[200px]">
                                            <h3 className="font-black text-zinc-900 text-xl leading-tight mb-2 truncate">
                                                {course.title}
                                            </h3>
                                            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                                                Completed: {new Date(course.completionDate).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                    <Button
                                        onClick={() => setSelectedCertificate(course)}
                                        className="rounded-[20px] h-14 w-14 p-0 bg-zinc-50 hover:bg-zinc-900 text-zinc-300 hover:text-white transition-all shadow-inner border-none"
                                    >
                                        <ExternalLink className="w-6 h-6" />
                                    </Button>
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white rounded-[50px] p-24 text-center border-2 border-dashed border-zinc-100 shadow-inner">
                            <div className="w-24 h-24 bg-zinc-50 rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl">
                                <FileText className="w-10 h-10 text-zinc-200" />
                            </div>
                            <h3 className="font-black text-3xl text-zinc-900 mb-3 tracking-tighter">Your wall is empty.</h3>
                            <p className="text-zinc-400 font-medium max-w-[280px] mx-auto text-lg leading-relaxed">
                                Complete your first course to unlock an official industry-standard certificate.
                            </p>
                        </div>
                    )}
                </motion.div>

                {/* Highly Scaled Certificate Viewer */}
                <Dialog open={!!selectedCertificate} onOpenChange={() => setSelectedCertificate(null)}>
                    <DialogContent className="max-w-[1100px] p-0 border-none bg-transparent shadow-none">
                        {selectedCertificate && (
                            <Certificate
                                userName={auth?.user?.userFullName || auth?.user?.userName}
                                courseTitle={selectedCertificate.title}
                                completionDate={new Date(selectedCertificate.completionDate).toLocaleDateString('en-IN', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
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
