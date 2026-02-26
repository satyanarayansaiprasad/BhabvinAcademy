import { useContext, useState, useEffect } from "react";
import { AuthContext } from "@/context/auth-context";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { User, Mail, Camera, Save, X, Loader2, CheckCircle2, Trophy, BookOpen, Clock } from "lucide-react";
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
    });
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        if (auth?.user) {
            setFormData({
                userFullName: auth.user.userFullName || "",
                profileImage: auth.user.profileImage || "",
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
            <div className="container mx-auto px-4 lg:px-8 max-w-5xl">
                <div className="grid lg:grid-cols-12 gap-12">

                    {/* Left Column: Main Profile Card */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="lg:col-span-8 space-y-8"
                    >
                        {/* Header Section */}
                        <div className="relative bg-white rounded-[48px] p-10 shadow-xl shadow-blue-900/5 border border-white overflow-hidden group">
                            {/* Background Accent */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />

                            <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
                                {/* Avatar Section */}
                                <div className="relative">
                                    <motion.div
                                        whileHover={{ scale: 1.02 }}
                                        className="w-40 h-40 rounded-[40px] overflow-hidden border-4 border-white shadow-2xl relative bg-zinc-100"
                                    >
                                        {formData.profileImage ? (
                                            <img
                                                src={formData.profileImage}
                                                alt="Profile"
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-zinc-300">
                                                <User className="w-16 h-16" />
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
                                            <input type="file" className="hidden" accept="image/*" onChangeCapture={handleImageUpload} />
                                        </label>
                                    )}
                                </div>

                                {/* Identity Section */}
                                <div className="flex-1 text-center md:text-left">
                                    <div className="mb-6">
                                        <span className="text-blue-600 font-black text-[10px] uppercase tracking-[0.2em] mb-2 block">Student Account</span>
                                        {isEditing ? (
                                            <div className="space-y-4">
                                                <Input
                                                    value={formData.userFullName}
                                                    onChange={(e) => setFormData(prev => ({ ...prev, userFullName: e.target.value }))}
                                                    className="text-3xl font-black tracking-tighter h-14 rounded-2xl border-zinc-200 focus:ring-4 focus:ring-blue-100 transition-all text-center md:text-left"
                                                    placeholder="Your Full Name"
                                                />
                                            </div>
                                        ) : (
                                            <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-zinc-900 leading-none">
                                                {auth.user.userFullName || auth.user.userName}
                                            </h1>
                                        )}
                                        <p className="text-zinc-400 font-medium mt-2 flex items-center justify-center md:justify-start gap-2">
                                            <Mail className="w-4 h-4" /> {auth.user.userEmail}
                                        </p>
                                    </div>

                                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                                        {isEditing ? (
                                            <>
                                                <Button
                                                    onClick={handleUpdateProfile}
                                                    disabled={updating || uploading}
                                                    className="bg-zinc-900 hover:bg-black text-white hover:text-white rounded-2xl h-12 px-8 font-bold flex items-center gap-2 shadow-xl shadow-zinc-200 transition-all hover:scale-105"
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

                        {/* Account Details Card */}
                        <Card className="rounded-[40px] border-zinc-200/60 shadow-xl shadow-blue-900/5 overflow-hidden">
                            <CardContent className="p-10">
                                <h3 className="text-xl font-black tracking-tighter mb-8 flex items-center gap-3">
                                    <div className="w-2 h-8 bg-blue-600 rounded-full" />
                                    Account Details.
                                </h3>

                                <div className="grid sm:grid-cols-2 gap-8">
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Username</p>
                                        <p className="text-lg font-bold text-zinc-900">@{auth.user.userName}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Membership</p>
                                        <div className="flex items-center gap-2">
                                            <p className="text-lg font-bold text-zinc-900 capitalize">{auth.user.role}</p>
                                            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase tracking-tighter">Verified</span>
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Joined On</p>
                                        <p className="text-lg font-bold text-zinc-900">February 2026</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Right Column: Stats & Progress */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="lg:col-span-4 space-y-8"
                    >
                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 gap-4">
                            {stats.map((stat, index) => (
                                <div key={index} className="bg-white rounded-[32px] p-6 border border-zinc-100 shadow-sm hover:shadow-md transition-shadow">
                                    <div className={`w-10 h-10 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center mb-4`}>
                                        <stat.icon size={20} />
                                    </div>
                                    <p className="text-2xl font-black tracking-tighter text-zinc-900">{stat.value}</p>
                                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{stat.label}</p>
                                </div>
                            ))}
                        </div>

                        {/* Achievement Card */}
                        <div className="bg-zinc-900 rounded-[40px] p-8 text-white relative overflow-hidden group">
                            <div className="relative z-10">
                                <Trophy className="h-10 w-10 text-amber-400 mb-6 group-hover:rotate-12 transition-transform duration-500" />
                                <h4 className="text-xl font-black tracking-tighter mb-2">Expert Path.</h4>
                                <p className="text-zinc-400 text-sm font-medium leading-relaxed mb-6">
                                    You are in the top 5% of active students this month. Complete one more lesson to reach Level 12.
                                </p>
                                <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: "85%" }}
                                        className="h-full bg-amber-400"
                                    />
                                </div>
                                <div className="flex justify-between mt-2">
                                    <span className="text-[10px] font-bold uppercase text-white/40 tracking-widest">Level 11</span>
                                    <span className="text-[10px] font-bold uppercase text-white/40 tracking-widest">85% XP</span>
                                </div>
                            </div>
                            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/10 rounded-full blur-[40px] -translate-y-1/2 translate-x-1/2" />
                        </div>
                    </motion.div>

                </div>
            </div>
        </div>
    );
}

export default StudentProfilePage;
