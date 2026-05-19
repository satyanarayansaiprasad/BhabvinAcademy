import React, { useState, useContext, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
    LayoutDashboard, 
    BookOpen, 
    Route, 
    FileText, 
    TrendingUp, 
    Settings, 
    Bell, 
    ShoppingCart, 
    ChevronLeft,
    CheckCircle2,
    Trophy,
    Award,
    Mail,
    Phone,
    MapPin,
    Globe,
    CreditCard,
    Shield,
    Trash2,
    Lock,
    Save,
    MoreVertical,
    Download,
    Star
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "@/context/auth-context";
import { StudentContext } from "@/context/student-context";
import { getCourseImageUrl } from "@/utils/course-images";
import { updateUserProfileService } from "@/services";

function StudentProfilePage() {
    const { auth, setAuth } = useContext(AuthContext);
    const { studentBoughtCoursesList, fetchBoughtCourses } = useContext(StudentContext);
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState("profile");
    const [showToast, setShowToast] = useState(false);

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [headline, setHeadline] = useState("");
    const [bio, setBio] = useState("");
    const [profileImage, setProfileImage] = useState("");

    useEffect(() => {
        if (auth?.user?._id) {
            fetchBoughtCourses(auth?.user?._id);
        }
    }, [auth]);

    useEffect(() => {
        if (auth?.user) {
            const nameParts = (auth.user.userFullName || auth.user.userName || "").trim().split(" ");
            setFirstName(nameParts[0] || "");
            setLastName(nameParts.slice(1).join(" ") || "");
            setHeadline(auth.user.userHeadline || "");
            setBio(auth.user.userBio || "");
            setProfileImage(auth.user.profileImage || "");
        }
    }, [auth?.user]);

    const triggerToast = (msg) => {
        setShowToast(msg);
        setTimeout(() => setShowToast(false), 3000);
    };

    const handleSaveChanges = async () => {
        try {
            const updatedFullName = `${firstName} ${lastName}`.trim();
            const response = await updateUserProfileService({
                userId: auth?.user?._id,
                userFullName: updatedFullName,
                userHeadline: headline,
                userBio: bio,
                profileImage: profileImage
            });
            if (response?.success) {
                setAuth({
                    ...auth,
                    user: {
                        ...auth.user,
                        userFullName: updatedFullName,
                        userHeadline: headline,
                        userBio: bio,
                        profileImage: profileImage
                    }
                });
                triggerToast("Profile updated successfully!");
            } else {
                triggerToast(response?.message || "Failed to update profile");
            }
        } catch (e) {
            console.error(e);
            triggerToast("An error occurred while updating profile");
        }
    };

    const reveal = {
        initial: { opacity: 0, y: 15 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.4 }
    };

    const userFullName = auth?.user?.userFullName || auth?.user?.userName || "Student";
    const userInitials = userFullName
        .split(" ")
        .map(n => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();

    const sidebarNav = [
        { icon: <LayoutDashboard size={18} />, label: "Dashboard", path: "/dashboard" },
        { icon: <BookOpen size={18} />, label: "My Courses", path: "/student-courses", badge: studentBoughtCoursesList?.length?.toString() },
        { icon: <FileText size={18} />, label: "Practice Exams", path: "/exams" },
    ];

    const tabs = [
        { id: "profile", label: "Profile" },
        { id: "progress", label: "Progress" },
        { id: "billing", label: "Billing" },
        { id: "notifications", label: "Notifications" },
        { id: "security", label: "Security" },
    ];

    return (
        <div className="flex min-h-screen bg-[#f5f5f7] font-['Inter']">
            {/* SIDEBAR */}
            <aside className="w-[240px] bg-black text-white flex flex-col fixed inset-y-0 left-0 z-50">
                <div className="p-6 border-b border-white/10">
                    <Link to="/" className="text-[22px] font-bold tracking-tight">Bhavin<span className="text-[#0071e3]">Academy</span></Link>
                </div>

                <div 
                    onClick={() => navigate("/profile")}
                    className="p-4 border-b border-white/10 hover:bg-white/5 transition-colors cursor-pointer group"
                >
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#0071e3] to-[#00d4ff] flex items-center justify-center font-bold text-[12px] text-white">
                            {auth?.user?.profileImage ? (
                                <img src={auth.user.profileImage} className="w-full h-full rounded-full object-cover" />
                            ) : (
                                userInitials
                            )}
                        </div>
                        <div className="min-w-0 flex-1">
                            <div className="text-[14px] font-bold truncate">{userFullName}</div>
                            <div className="text-[11px] text-[#86868b]">View Account ›</div>
                        </div>
                        <MoreVertical size={14} className="text-[#86868b] group-hover:text-white" />
                    </div>
                </div>

                <nav className="flex-1 p-4 space-y-8 overflow-y-auto no-scrollbar">
                    <div>
                        <p className="text-[10px] font-black text-[#86868b] uppercase tracking-widest px-3 mb-4">Main</p>
                        <ul className="space-y-1">
                            {sidebarNav.map((item, i) => (
                                <li key={i}>
                                    <Link to={item.path} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-[14px] font-semibold transition-all text-[#86868b] hover:bg-white/5 hover:text-white`}>
                                        {item.icon}
                                        {item.label}
                                        {item.badge && <span className="ml-auto bg-[#0071e3] text-white text-[10px] font-black px-2 py-0.5 rounded-full">{item.badge}</span>}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-[#86868b] uppercase tracking-widest px-3 mb-4">Track</p>
                        <ul className="space-y-1">
                            <li><Link to="/profile" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[14px] font-semibold text-[#86868b] hover:bg-white/5 hover:text-white transition-all"><TrendingUp size={18} /> Progress</Link></li>
                        </ul>
                    </div>
                    <div className="mt-auto pt-8">
                        <p className="text-[10px] font-black text-[#86868b] uppercase tracking-widest px-3 mb-4">Settings</p>
                        <ul className="space-y-1">
                            <li><Link to="/profile" className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-[14px] font-semibold transition-all bg-[#0071e3]/20 text-[#40a9ff]`}><Settings size={18} /> Account Settings</Link></li>
                        </ul>
                    </div>
                </nav>
            </aside>

            {/* MAIN CONTENT */}
            <main className="ml-[240px] flex-1 flex flex-col min-h-screen">
                {/* TOPBAR */}
                <header className="h-[58px] bg-white/80 backdrop-blur-xl border-b border-[#000]/5 sticky top-0 z-40 px-8 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link to="/dashboard" className="flex items-center gap-2 px-3 py-1.5 border border-[#d2d2d7] rounded-lg bg-white text-[13px] font-semibold text-[#6e6e73] hover:border-[#0071e3] hover:text-[#0071e3] transition-all">
                            <ChevronLeft size={14} /> Back
                        </Link>
                        <div className="text-[13px] text-[#86868b]">Dashboard › <span className="text-[#1d1d1f] font-bold">Account</span></div>
                    </div>
                    <div className="flex items-center gap-4">
                        <button className="w-9 h-9 border border-[#d2d2d7] rounded-lg flex items-center justify-center text-[#1d1d1f] hover:border-[#0071e3] transition-all relative"><Bell size={18} /></button>
                        <button className="w-9 h-9 border border-[#d2d2d7] rounded-lg flex items-center justify-center text-[#1d1d1f] hover:border-[#0071e3] transition-all"><ShoppingCart size={18} /></button>
                    </div>
                </header>

                <div className="p-8 pb-20 max-w-[1000px]">
                    <div className="text-[11px] font-black text-[#0071e3] uppercase tracking-widest mb-1">My Account</div>
                    <h1 className="text-[26px] font-extrabold tracking-tight text-[#1d1d1f] mb-8">Account Details</h1>

                    {/* PROFILE HERO */}
                    <div className="bg-black rounded-[24px] p-8 mb-8 relative overflow-hidden flex items-center gap-8">
                        <div className="absolute left-[-40px] top-[-40px] w-64 h-64 rounded-full bg-[#0071e3]/20 blur-[100px] pointer-events-none" />
                        <div className="relative z-10 w-22 h-22 rounded-full bg-gradient-to-br from-[#0071e3] to-[#00d4ff] flex items-center justify-center text-[30px] font-black text-white border-4 border-white/10 shadow-2xl shrink-0 overflow-hidden">
                            {auth?.user?.profileImage ? (
                                <img src={auth.user.profileImage} className="w-full h-full object-cover" />
                            ) : (
                                userInitials
                            )}
                        </div>
                        <div className="relative z-10 flex-1 min-w-0">
                            <h2 className="text-[26px] font-black text-[#f5f5f7] leading-none mb-2">{userFullName}</h2>
                            <div className="flex flex-wrap items-center gap-4 mb-4">
                                <span className="text-[13px] text-[#86868b]">{auth?.user?.userEmail || "student@email.com"}</span>
                                <span className="bg-[#0071e3]/20 border border-[#40a9ff]/30 text-[#40a9ff] text-[11px] font-black px-3 py-0.5 rounded-full uppercase tracking-widest">Student</span>
                            </div>
                            <div className="flex gap-6">
                                {[
                                    { v: "47.5", l: "Hours" },
                                    { v: studentBoughtCoursesList?.length?.toString() || "0", l: "Courses" },
                                    { v: "12", l: "Streak" },
                                    { v: studentBoughtCoursesList?.filter(c => c.progress === 100)?.length?.toString() || "0", l: "Cert" },
                                ].map((s, i) => (
                                    <div key={i} className="flex flex-col">
                                        <div className="text-[20px] font-black text-white leading-none">{s.v}</div>
                                        <div className="text-[10px] font-bold text-[#6e6e73] uppercase mt-1 tracking-tighter">{s.l}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="relative z-10 flex flex-col gap-2 shrink-0">
                            <button className="bg-[#0071e3] text-white text-[13px] font-black px-6 py-2.5 rounded-full hover:bg-[#0077ed] transition-all" onClick={() => setActiveTab("profile")}>Edit Profile</button>
                            <button className="bg-white/10 text-white text-[13px] font-bold px-6 py-2.5 rounded-full border border-white/15 hover:bg-white/20 transition-all">Manage Plan</button>
                        </div>
                    </div>

                    {/* TABS */}
                    <div className="bg-white border border-[#e8e8ed] rounded-xl p-1 inline-flex gap-1 mb-6">
                        {tabs.map(tab => (
                            <button 
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`px-5 py-1.5 rounded-lg text-[13px] font-bold transition-all ${activeTab === tab.id ? 'bg-[#0071e3] text-white shadow-lg' : 'text-[#6e6e73] hover:text-[#1d1d1f]'}`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* TAB CONTENT */}
                    <AnimatePresence mode="wait">
                        {activeTab === "profile" && (
                            <motion.div key="profile" {...reveal} className="space-y-4">
                                <div className="bg-white rounded-2xl p-8 border border-black/5 shadow-sm">
                                    <h3 className="text-[15px] font-black text-[#1d1d1f] mb-1">Personal Information</h3>
                                    <p className="text-[12px] text-[#86868b] mb-6">Update your name, bio and contact details.</p>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <label className="text-[11px] font-black text-[#86868b] uppercase tracking-widest">First Name</label>
                                            <input 
                                                type="text" 
                                                className="w-full bg-[#f5f5f7] border border-[#e8e8ed] rounded-xl px-4 py-2.5 text-[14px] outline-none focus:border-[#0071e3] focus:bg-white transition-all" 
                                                value={firstName} 
                                                onChange={(e) => setFirstName(e.target.value)} 
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[11px] font-black text-[#86868b] uppercase tracking-widest">Last Name</label>
                                            <input 
                                                type="text" 
                                                className="w-full bg-[#f5f5f7] border border-[#e8e8ed] rounded-xl px-4 py-2.5 text-[14px] outline-none focus:border-[#0071e3] focus:bg-white transition-all" 
                                                value={lastName} 
                                                onChange={(e) => setLastName(e.target.value)} 
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[11px] font-black text-[#86868b] uppercase tracking-widest">Email Address</label>
                                            <input 
                                                type="email" 
                                                disabled 
                                                className="w-full bg-[#f5f5f7] border border-[#e8e8ed] rounded-xl px-4 py-2.5 text-[14px] outline-none opacity-60 cursor-not-allowed" 
                                                value={auth?.user?.userEmail || ""} 
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[11px] font-black text-[#86868b] uppercase tracking-widest">Headline</label>
                                            <input 
                                                type="text" 
                                                className="w-full bg-[#f5f5f7] border border-[#e8e8ed] rounded-xl px-4 py-2.5 text-[14px] outline-none focus:border-[#0071e3] focus:bg-white transition-all" 
                                                value={headline} 
                                                placeholder="e.g. Cybersecurity Student" 
                                                onChange={(e) => setHeadline(e.target.value)} 
                                            />
                                        </div>
                                        <div className="space-y-1.5 md:col-span-2">
                                            <label className="text-[11px] font-black text-[#86868b] uppercase tracking-widest">Avatar Image URL</label>
                                            <input 
                                                type="text" 
                                                className="w-full bg-[#f5f5f7] border border-[#e8e8ed] rounded-xl px-4 py-2.5 text-[14px] outline-none focus:border-[#0071e3] focus:bg-white transition-all" 
                                                value={profileImage} 
                                                placeholder="https://images.unsplash.com/photo-..." 
                                                onChange={(e) => setProfileImage(e.target.value)} 
                                            />
                                        </div>
                                        <div className="space-y-1.5 md:col-span-2">
                                            <label className="text-[11px] font-black text-[#86868b] uppercase tracking-widest">Bio</label>
                                            <textarea 
                                                rows="3" 
                                                className="w-full bg-[#f5f5f7] border border-[#e8e8ed] rounded-xl px-4 py-2.5 text-[14px] outline-none focus:border-[#0071e3] focus:bg-white transition-all resize-none" 
                                                value={bio} 
                                                onChange={(e) => setBio(e.target.value)} 
                                            />
                                        </div>
                                    </div>
                                    <div className="mt-8 pt-6 border-t border-[#f0f0f0] flex justify-end gap-3">
                                        <button 
                                            className="px-5 py-2 rounded-full border border-[#d2d2d7] text-[13px] font-bold text-[#6e6e73] hover:border-[#1d1d1f] hover:text-[#1d1d1f] transition-all"
                                            onClick={() => {
                                                if (auth?.user) {
                                                    const nameParts = (auth.user.userFullName || auth.user.userName || "").trim().split(" ");
                                                    setFirstName(nameParts[0] || "");
                                                    setLastName(nameParts.slice(1).join(" ") || "");
                                                    setHeadline(auth.user.userHeadline || "");
                                                    setBio(auth.user.userBio || "");
                                                    setProfileImage(auth.user.profileImage || "");
                                                }
                                            }}
                                        >
                                            Cancel
                                        </button>
                                        <button onClick={handleSaveChanges} className="px-6 py-2 rounded-full bg-[#0071e3] text-white text-[13px] font-black hover:bg-[#0077ed] transition-all shadow-lg active:scale-95">Save Changes</button>
                                    </div>
                                </div>

                                <div className="bg-white rounded-2xl p-8 border border-black/5 shadow-sm">
                                    <h3 className="text-[15px] font-black text-[#1d1d1f] mb-1">Location & Preferences</h3>
                                    <p className="text-[12px] text-[#86868b] mb-6">Set your region, language and timezone.</p>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <label className="text-[11px] font-black text-[#86868b] uppercase tracking-widest">Country</label>
                                            <select className="w-full bg-[#f5f5f7] border border-[#e8e8ed] rounded-xl px-4 py-2.5 text-[14px] outline-none focus:border-[#0071e3] focus:bg-white transition-all">
                                                <option>India</option>
                                                <option>United States</option>
                                            </select>
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[11px] font-black text-[#86868b] uppercase tracking-widest">Language</label>
                                            <select className="w-full bg-[#f5f5f7] border border-[#e8e8ed] rounded-xl px-4 py-2.5 text-[14px] outline-none focus:border-[#0071e3] focus:bg-white transition-all">
                                                <option>English</option>
                                                <option>Hindi</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="mt-8 pt-6 border-t border-[#f0f0f0] flex justify-end">
                                        <button onClick={() => triggerToast("Preferences saved")} className="px-6 py-2 rounded-full bg-[#0071e3] text-white text-[13px] font-black">Save Changes</button>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {activeTab === "progress" && (
                            <motion.div key="progress" {...reveal} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                    <div className="bg-white p-6 rounded-2xl border border-black/5">
                                        <div className="text-[24px] font-black">
                                            {studentBoughtCoursesList?.length ? (studentBoughtCoursesList.length * 12.5).toFixed(1) : "0.0"}
                                        </div>
                                        <div className="text-[12px] text-[#86868b]">Total Hours</div>
                                        <div className="mt-2 text-[10px] font-black text-[#1d6f42] bg-[#e6f4ea] px-2 py-0.5 rounded-full inline-block">↑ +3.2 this week</div>
                                    </div>
                                    <div className="bg-white p-6 rounded-2xl border border-black/5">
                                        <div className="text-[24px] font-black">12</div>
                                        <div className="text-[12px] text-[#86868b]">Day Streak</div>
                                        <div className="mt-2 text-[10px] font-black text-[#1d6f42] bg-[#e6f4ea] px-2 py-0.5 rounded-full inline-block">↑ Best: 21 days</div>
                                    </div>
                                    <div className="bg-white p-6 rounded-2xl border border-black/5">
                                        <div className="text-[24px] font-black">
                                            {studentBoughtCoursesList?.reduce((acc, curr) => acc + (curr.progress > 0 ? Math.ceil(curr.progress / 5) : 0), 0) || 0}
                                        </div>
                                        <div className="text-[12px] text-[#86868b]">Lessons Done</div>
                                        <div className="mt-2 text-[10px] font-black text-[#86868b] bg-[#f5f5f7] px-2 py-0.5 rounded-full inline-block">Across {studentBoughtCoursesList?.length || 0} courses</div>
                                    </div>
                                </div>

                                <div className="bg-white rounded-2xl p-8 border border-black/5 shadow-sm">
                                    <h3 className="text-[15px] font-black text-[#1d1d1f] mb-1">Course Progress</h3>
                                    <p className="text-[12px] text-[#86868b] mb-6">Track your progress across all enrolled courses.</p>
                                    <div className="space-y-3">
                                        {studentBoughtCoursesList && studentBoughtCoursesList.length > 0 ? (
                                            studentBoughtCoursesList.map((c, i) => (
                                                <div 
                                                    key={c.courseId} 
                                                    onClick={() => navigate(`/course-progress/${c.courseId}`)}
                                                    className="flex items-center gap-4 p-4 rounded-xl bg-[#f5f5f7] hover:bg-[#ebebeb] transition-all cursor-pointer"
                                                >
                                                    <div className="w-11 h-11 rounded-xl overflow-hidden bg-[#f5f5f7] flex items-center justify-center shrink-0">
                                                        <img src={getCourseImageUrl(c)} className="w-full h-full object-cover" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="text-[14px] font-bold text-[#1d1d1f] truncate">{c.title}</div>
                                                        <div className="flex items-center gap-3 mt-1.5">
                                                            <div className="flex-1 h-1.5 bg-[#e8e8ed] rounded-full overflow-hidden">
                                                                <div className="h-full bg-gradient-to-r from-[#0071e3] to-[#00d4ff]" style={{ width: `${c.progress || 0}%` }} />
                                                            </div>
                                                            <span className="text-[12px] font-black text-[#0071e3]">{c.progress || 0}%</span>
                                                        </div>
                                                        <div className="text-[11px] text-[#86868b] mt-1.5">Instructor: {c.instructorName || "Instructor"}</div>
                                                    </div>
                                                    <span className="text-[11px] font-black px-3 py-1 rounded-full bg-[#e8f1fb] text-[#0071e3]">
                                                        {c.progress === 100 ? "Completed" : "In Progress"}
                                                    </span>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="text-center py-8 text-[#86868b] text-[13px]">
                                                No course progress to display. Explore courses to begin!
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="bg-white rounded-2xl p-8 border border-black/5 shadow-sm">
                                    <h3 className="text-[15px] font-black text-[#1d1d1f] mb-1">Certificates Earned</h3>
                                    <div className="space-y-3 mt-6">
                                        {studentBoughtCoursesList && studentBoughtCoursesList.filter(c => c.progress === 100).length > 0 ? (
                                            studentBoughtCoursesList.filter(c => c.progress === 100).map((c, i) => (
                                                <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-[#f5f5f7]">
                                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#ffd60a] to-[#ff9f0a] flex items-center justify-center text-xl">🏆</div>
                                                    <div className="flex-1">
                                                        <div className="text-[13px] font-bold">{c.title} — Certificate</div>
                                                        <div className="text-[11px] text-[#86868b]">Issued Mar 10, 2025 · Verified</div>
                                                    </div>
                                                    <button className="text-[12px] font-black text-[#0071e3] hover:underline" onClick={() => triggerToast("Certificate downloaded")}>⬇ Download</button>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="text-[#86868b] text-[12px]">Complete any course to earn your verified certificate.</div>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {activeTab === "billing" && (
                            <motion.div key="billing" {...reveal} className="space-y-4">
                                <div className="bg-black rounded-2xl p-8 relative overflow-hidden">
                                    <div className="absolute right-[-30px] top-[-30px] w-48 h-48 rounded-full bg-[#0071e3]/20 blur-[60px] pointer-events-none" />
                                    <div className="text-[11px] font-black text-[#40a9ff] uppercase tracking-widest mb-1">Current Plan</div>
                                    <h3 className="text-[22px] font-black text-white mb-2">Pro Plan</h3>
                                    <p className="text-[13px] text-[#86868b] max-w-sm mb-6">Full access to all courses, labs, practice exams and certificates.</p>
                                    <div className="flex flex-wrap gap-4 mb-8">
                                        {["Unlimited access", "Virtual labs", "Certificates"].map((f, i) => (
                                            <div key={i} className="flex items-center gap-2 text-[13px] text-[#d2d2d7]">
                                                <CheckCircle2 size={14} className="text-[#0071e3]" /> {f}
                                            </div>
                                        ))}
                                    </div>
                                    <div className="text-[12px] text-[#6e6e73] mb-6">Next renewal: <strong className="text-[#86868b]">January 14, 2026</strong> · ₹2,499/year</div>
                                    <div className="flex gap-3">
                                        <button className="bg-[#0071e3] text-white text-[13px] font-black px-6 py-2 rounded-full hover:bg-[#0077ed]">Upgrade Plan</button>
                                        <button className="bg-white/10 text-white text-[13px] font-bold px-6 py-2 rounded-full border border-white/15 hover:bg-white/20 transition-all">Manage Billing</button>
                                    </div>
                                </div>

                                <div className="bg-white rounded-2xl p-8 border border-black/5 shadow-sm">
                                    <div className="flex items-center justify-between mb-6">
                                        <div>
                                            <h3 className="text-[15px] font-black text-[#1d1d1f] mb-1">Payment Method</h3>
                                            <p className="text-[12px] text-[#86868b]">Your saved payment details.</p>
                                        </div>
                                        <button className="text-[12px] font-black text-[#0071e3] hover:underline">+ Add New</button>
                                    </div>
                                    <div className="flex items-center gap-4 p-4 bg-[#f5f5f7] rounded-xl">
                                        <div className="w-11 h-8 bg-[#1a1f71] rounded flex items-center justify-center text-[11px] font-black text-white shrink-0">VISA</div>
                                        <div className="flex-1">
                                            <div className="text-[14px] font-bold">Visa ending in 4242</div>
                                            <div className="text-[11px] text-[#86868b]">Expires 08 / 2027</div>
                                        </div>
                                        <span className="text-[10px] font-black px-2.5 py-1 rounded-full bg-[#e6f4ea] text-[#1d6f42]">Default</span>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {activeTab === "notifications" && (
                            <motion.div key="notifications" {...reveal}>
                                <div className="bg-white rounded-2xl p-8 border border-black/5 shadow-sm">
                                    <h3 className="text-[15px] font-black text-[#1d1d1f] mb-1">Email Notifications</h3>
                                    <p className="text-[12px] text-[#86868b] mb-6">Choose which emails you want to receive.</p>
                                    <div className="divide-y divide-[#f0f0f0]">
                                        {[
                                            { t: "Course Updates", d: "New lessons and content added to your courses.", c: true },
                                            { t: "Lab Reminders", d: "Reminders before upcoming labs and exams.", c: true },
                                            { t: "Streak Alerts", d: "Get notified if you're about to lose your streak.", c: true },
                                            { t: "Weekly Progress", d: "Summary of your weekly activity.", c: false },
                                        ].map((n, i) => (
                                            <div key={i} className="flex items-center justify-between py-4">
                                                <div>
                                                    <div className="text-[14px] font-bold text-[#1d1d1f]">{n.t}</div>
                                                    <div className="text-[12px] text-[#86868b] mt-0.5">{n.d}</div>
                                                </div>
                                                <label className="relative inline-flex items-center cursor-pointer">
                                                    <input type="checkbox" className="sr-only peer" defaultChecked={n.c} />
                                                    <div className="w-11 h-6 bg-[#d2d2d7] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0071e3]" />
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="mt-8 pt-6 border-t border-[#f0f0f0] flex justify-end">
                                        <button onClick={() => triggerToast("Preferences saved")} className="px-6 py-2 rounded-full bg-[#0071e3] text-white text-[13px] font-black">Save Preferences</button>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {activeTab === "security" && (
                            <motion.div key="security" {...reveal} className="space-y-4">
                                <div className="bg-white rounded-2xl p-8 border border-black/5 shadow-sm">
                                    <h3 className="text-[15px] font-black text-[#1d1d1f] mb-1">Security Overview</h3>
                                    <p className="text-[12px] text-[#86868b] mb-6">Manage your password, 2FA and active sessions.</p>
                                    <div className="divide-y divide-[#f0f0f0]">
                                        {[
                                            { t: "Password", d: "Last changed 3 months ago", s: "Strong", ok: true },
                                            { t: "Two-Factor Auth", d: "Authenticator app enabled", s: "Active", ok: true },
                                            { t: "Backup Email", d: "Not configured", s: "Missing", ok: false },
                                        ].map((s, i) => (
                                            <div key={i} className="flex items-center justify-between py-4">
                                                <div>
                                                    <div className="text-[14px] font-bold text-[#1d1d1f]">{s.t}</div>
                                                    <div className="text-[12px] text-[#86868b] mt-0.5">{s.d}</div>
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <div className={`flex items-center gap-1.5 text-[12px] font-bold ${s.ok ? 'text-[#1d6f42]' : 'text-[#b25000]'}`}>
                                                        <div className={`w-1.5 h-1.5 rounded-full ${s.ok ? 'bg-green-500' : 'bg-orange-500'}`} /> {s.s}
                                                    </div>
                                                    <button className="px-4 py-1.5 border border-[#d2d2d7] rounded-full text-[12px] font-bold hover:border-[#0071e3] transition-all" onClick={() => triggerToast("Settings opened")}>Manage</button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="bg-red-50/50 border border-red-200 rounded-2xl p-8">
                                    <h3 className="text-[14px] font-black text-red-700 mb-1">⚠ Danger Zone</h3>
                                    <p className="text-[12px] text-[#86868b] mb-6">Deleting your account is permanent. All your progress and data will be removed immediately.</p>
                                    <button className="bg-red-600 text-white text-[13px] font-black px-6 py-2 rounded-full hover:bg-red-700 active:scale-95 transition-all">Delete Account</button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </main>

            {/* TOAST SYSTEM */}
            <AnimatePresence>
                {showToast && (
                    <motion.div 
                        initial={{ opacity: 0, y: 100 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 100 }}
                        className="fixed bottom-8 right-8 z-[100] bg-[#1d1d1f] text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 border border-white/10"
                    >
                        <div className="w-5 h-5 rounded-full bg-[#34c759] flex items-center justify-center text-[10px] font-black text-white">✓</div>
                        <span className="text-[14px] font-bold">{showToast}</span>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default StudentProfilePage;
