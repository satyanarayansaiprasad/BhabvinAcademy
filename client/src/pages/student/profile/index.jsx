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
import { mediaUploadService, updateUserProfileService } from "@/services";
import { useToast } from "@/components/ui/use-toast";
import MediaProgressbar from "@/components/media-progress-bar";

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

    useEffect(() => {
        if (auth?.user) {
            setFormData({
                userFullName: auth.user.userFullName || "",
                profileImage: auth.user.profileImage || "",
                userHeadline: auth.user.userHeadline || "",
                userBio: auth.user.userBio || "",
            });
        }
    }, [auth]);

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
            <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
                <div className="grid lg:grid-cols-12 gap-12">

                    {/* Left Column: Main Identity Card */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="lg:col-span-8 space-y-8"
                    >
                        {/* Premium Header Section */}
                        <div className="relative bg-white rounded-[48px] p-10 shadow-xl shadow-blue-900/5 border border-white overflow-hidden group">
                            <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />

                            <div className="relative z-10 flex flex-col md:flex-row items-start gap-10">
                                {/* Avatar Section */}
                                <div className="relative shrink-0 mx-auto md:mx-0">
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
                                                    className="text-3xl font-black tracking-tighter h-14 rounded-2xl border-zinc-200 focus:ring-4 focus:ring-blue-100 transition-all"
                                                    placeholder="Your Full Name"
                                                />
                                                <Input
                                                    value={formData.userHeadline}
                                                    onChange={(e) => setFormData(prev => ({ ...prev, userHeadline: e.target.value }))}
                                                    className="text-lg font-bold text-blue-600 h-12 rounded-xl border-zinc-200 focus:ring-4 focus:ring-blue-100 transition-all"
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
                                            <p className="text-zinc-400 text-sm font-medium flex items-center gap-2">
                                                <Briefcase className="w-4 h-4" /> Student Member
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

                        {/* Bio Section Card */}
                        <Card className="rounded-[40px] border-zinc-200/60 shadow-xl shadow-blue-900/5 overflow-hidden">
                            <CardContent className="p-10">
                                <div className="flex items-center justify-between mb-8">
                                    <h3 className="text-xl font-black tracking-tighter flex items-center gap-3">
                                        <div className="w-2 h-8 bg-blue-600 rounded-full" />
                                        About Me.
                                    </h3>
                                    <FileText className="text-zinc-200 w-8 h-8" />
                                </div>

                                {isEditing ? (
                                    <Textarea
                                        value={formData.userBio}
                                        onChange={(e) => setFormData(prev => ({ ...prev, userBio: e.target.value }))}
                                        className="min-h-[160px] rounded-[24px] border-zinc-200 p-6 font-medium leading-relaxed focus:ring-4 focus:ring-blue-100 transition-all"
                                        placeholder="Tell your story. What are your goals? What are you learning? Most students write about their passion for tech or business."
                                    />
                                ) : (
                                    <div className="bg-zinc-50/50 rounded-[32px] p-8 border border-zinc-100">
                                        <p className="text-zinc-600 font-medium leading-[1.8] italic">
                                            {auth.user.userBio || "This student hasn't shared their story yet. Click 'Edit Profile' to add a bio and let others know what motivates you!"}
                                        </p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Right Column: Stats & Meta Information */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="lg:col-span-4 space-y-8"
                    >
                        {/* Achievement Card */}
                        <div className="bg-zinc-900 rounded-[40px] p-8 text-white relative overflow-hidden group">
                            <div className="relative z-10">
                                <div className="flex items-center justify-between mb-6">
                                    <Trophy className="h-10 w-10 text-amber-400 group-hover:rotate-12 transition-transform duration-500" />
                                    <span className="text-[10px] font-black uppercase text-white tracking-[0.2em] bg-white/10 px-3 py-1 rounded-full">Pro Student</span>
                                </div>
                                <h4 className="text-xl font-black tracking-tighter mb-2">Expert Path.</h4>
                                <p className="text-zinc-400 text-sm font-medium leading-relaxed mb-8">
                                    You are in the top 5% of active students this month. Complete one more lesson to reach Level 12.
                                </p>

                                <div className="space-y-4">
                                    <div className="h-2.5 w-full bg-white/10 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: "85%" }}
                                            transition={{ duration: 1.5, ease: "easeOut" }}
                                            className="h-full bg-gradient-to-r from-amber-400 to-amber-200"
                                        />
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-[11px] font-extrabold uppercase text-white/40 tracking-widest">Level 11</span>
                                        <span className="text-[11px] font-extrabold uppercase text-amber-400 tracking-widest">85% XP</span>
                                    </div>
                                </div>
                            </div>

                            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/10 rounded-full blur-[40px] -translate-y-1/2 translate-x-1/2" />
                        </div>

                        {/* Quick Stats Grid */}
                        <div className="grid grid-cols-2 gap-4">
                            {stats.map((stat, index) => (
                                <motion.div
                                    key={index}
                                    whileHover={{ y: -5 }}
                                    className="bg-white rounded-[32px] p-6 border border-zinc-100 shadow-sm hover:shadow-lg transition-all"
                                >
                                    <div className={`w-10 h-10 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center mb-4`}>
                                        <stat.icon size={20} />
                                    </div>
                                    <p className="text-2xl font-black tracking-tighter text-zinc-900">{stat.value}</p>
                                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.1em]">{stat.label}</p>
                                </motion.div>
                            ))}
                        </div>

                        {/* Account Metadata Card */}
                        <Card className="rounded-[40px] border-zinc-200/60 shadow-xl shadow-blue-900/5 bg-white">
                            <CardContent className="p-8">
                                <h4 className="text-[10px] font-black uppercase text-zinc-400 tracking-widest mb-6">Social Discovery</h4>
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between group cursor-pointer">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-zinc-100 flex items-center justify-center text-zinc-500 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                                <User size={16} />
                                            </div>
                                            <span className="text-sm font-bold text-zinc-900 group-hover:text-blue-600 transition-colors">Public Profile</span>
                                        </div>
                                        <ExternalLink size={14} className="text-zinc-300 group-hover:text-blue-600" />
                                    </div>
                                    <div className="flex items-center justify-between group cursor-pointer">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-zinc-100 flex items-center justify-center text-zinc-500 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                                                <CheckCircle2 size={16} />
                                            </div>
                                            <span className="text-sm font-bold text-zinc-900 group-hover:text-emerald-600 transition-colors">Certificates (4)</span>
                                        </div>
                                        <ExternalLink size={14} className="text-zinc-300 group-hover:text-emerald-600" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                </div>
            </div>
        </div>
    );
}

export default StudentProfilePage;
