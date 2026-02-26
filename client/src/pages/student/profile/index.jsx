import { useContext } from "react";
import { AuthContext } from "@/context/auth-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { User, Mail, Tag, BadgeCheck } from "lucide-react";

function StudentProfilePage() {
    const { auth } = useContext(AuthContext);

    if (!auth?.user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-zinc-500 font-bold">Please sign in to view your profile.</p>
            </div>
        );
    }

    const profileData = [
        {
            icon: BadgeCheck,
            label: "Full Name",
            value: auth.user.userFullName || "No full name provided",
            color: "text-blue-600",
            bg: "bg-blue-50",
        },
        {
            icon: User,
            label: "Username",
            value: auth.user.userName,
            color: "text-purple-600",
            bg: "bg-purple-50",
        },
        {
            icon: Mail,
            label: "Email Address",
            value: auth.user.userEmail,
            color: "text-emerald-600",
            bg: "bg-emerald-50",
        },
        {
            icon: Tag,
            label: "Account Role",
            value: auth.user.role === "student" ? "Student" : "Instructor",
            color: "text-amber-600",
            bg: "bg-amber-50",
        },
    ];

    return (
        <div className="min-h-screen bg-slate-50 pt-32 pb-20">
            <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-12"
                >
                    <div className="text-center md:text-left">
                        <h1 className="text-[50px] font-black tracking-tighter text-zinc-900 leading-none mb-4">
                            Your Profile.
                        </h1>
                        <p className="text-zinc-500 font-medium text-lg">
                            Manage your personal information and account settings.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        {profileData.map((item, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.1 }}
                                whileHover={{ y: -5 }}
                            >
                                <Card className="rounded-[32px] border-zinc-200/60 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group">
                                    <CardContent className="p-8 flex items-center gap-6">
                                        <div className={`w-14 h-14 rounded-2xl ${item.bg} flex items-center justify-center ${item.color} group-hover:scale-110 transition-transform`}>
                                            <item.icon className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <p className="text-zinc-400 font-bold uppercase tracking-widest text-[10px] mb-1">
                                                {item.label}
                                            </p>
                                            <h3 className="text-xl font-bold text-zinc-900 tracking-tight">
                                                {item.value}
                                            </h3>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>

                    <Card className="rounded-[40px] bg-zinc-900 border-none shadow-2xl p-12 text-white relative overflow-hidden">
                        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                            <div className="text-center md:text-left">
                                <h2 className="text-2xl font-black tracking-tighter mb-2">Continuous Learning.</h2>
                                <p className="text-zinc-400 font-medium">You have mastered 0 courses so far. Keep pushing your limits!</p>
                            </div>
                            <div className="h-20 w-20 rounded-full bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                                <span className="text-2xl font-black">0%</span>
                            </div>
                        </div>
                        {/* Decorative Glow */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 z-0" />
                    </Card>
                </motion.div>
            </div>
        </div>
    );
}

export default StudentProfilePage;
