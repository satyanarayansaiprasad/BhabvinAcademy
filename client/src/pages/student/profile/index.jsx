import React, { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { AuthContext } from "@/context/auth-context";
import { StudentContext } from "@/context/student-context";
import { updateUserProfileService } from "@/services";

function StudentProfilePage() {
    const { auth, setAuth } = useContext(AuthContext);
    const { studentBoughtCoursesList, fetchBoughtCourses } = useContext(StudentContext);
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState("profile");
    const [showToast, setShowToast] = useState(false);

    // Profile state
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [phone, setPhone] = useState("+91 98765 43210");
    const [bio, setBio] = useState("");
    
    // Preferences state
    const [country, setCountry] = useState("India");
    const [city, setCity] = useState("Mumbai");
    const [language, setLanguage] = useState("English");
    const [timezone, setTimezone] = useState("IST (UTC +5:30)");

    // Change password state
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

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
            setBio(auth.user.userBio || "IT enthusiast working toward MCSA certification. Passionate about Windows Server and networking.");
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
                userHeadline: auth?.user?.userHeadline || "Student",
                userBio: bio,
                profileImage: auth?.user?.profileImage || ""
            });
            if (response?.success) {
                setAuth({
                    ...auth,
                    user: {
                        ...auth.user,
                        userFullName: updatedFullName,
                        userBio: bio
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

    const userFullName = auth?.user?.userFullName || auth?.user?.userName || "Arjun Mehta";
    const userInitials = userFullName
        .split(" ")
        .map(n => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();

    const sidebarNav = [
        { label: "Dashboard", path: "/dashboard", icon: "📊" },
        { label: "My Courses", path: "/student-courses", icon: "📚", badge: studentBoughtCoursesList?.length?.toString() },
        { label: "Learning Paths", path: "/courses", icon: "🗺️" },
        { label: "Practice Exams", path: "/exams", icon: "📝" },
    ];

    const tabs = [
        { id: "profile", label: "Profile" },
        { id: "progress", label: "Progress" },
        { id: "billing", label: "Billing" },
        { id: "notifications", label: "Notifications" },
        { id: "security", label: "Security" },
    ];

    const heatmapData = [
        0,0,0,1,0,2,3,1,0,1,2,4,3,1,0,0,1,3,4,2,1,0,0,2,3,1,4,2,0,1,
        2,3,1,0,1,4,3,2,1,0,0,1,2,4,3,1,2,3,0,1,4,2,1,0,0,2,3,4,1,0,
        1,2,3,0,1,2,4,3,1,0,0,1,2,3,4,2,1,0,1,3,4,2,1,0,0,1,2,3,4,1
    ];

    const getHeatmapColorClass = (level) => {
        switch (level) {
            case 1: return "bg-[#bfdbfe]";
            case 2: return "bg-[#60a5fa]";
            case 3: return "bg-[#2563eb]";
            case 4: return "bg-[#0071e3]";
            default: return "bg-[#f0f0f0]";
        }
    };

    return (
        <div className="flex min-h-screen bg-[#f5f5f7] font-sans text-[#1d1d1f] text-left">
            
            {/* SIDEBAR */}
            <aside className="w-[240px] min-h-screen bg-black text-[#f5f5f7] flex flex-col fixed top-0 left-0 z-50 py-6 overflow-y-auto no-scrollbar border-r border-white/5">
                <div className="px-6 pb-4 border-b border-white/[0.08] mb-0">
                    <Link to="/dashboard" className="text-[22px] font-bold tracking-tight text-[#f5f5f7] no-underline">
                        Bhavin<span>Academy</span>
                    </Link>
                </div>

                {/* User Profile */}
                <div 
                    onClick={() => navigate("/profile")}
                    className="p-[12px_16px_14px] border-b border-white/[0.08] mb-2 cursor-pointer hover:bg-white/5 transition-all"
                >
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#0071e3] to-[#00d4ff] flex items-center justify-center font-bold text-[12px] text-white shrink-0">
                            {userInitials}
                        </div>
                        <div className="min-w-0 flex-1">
                            <div className="text-[15px] font-semibold text-white truncate">{userFullName}</div>
                            <div className="text-[12px] text-[#6e6e73] mt-[1px]">Pro Plan · View Account ›</div>
                        </div>
                        <span className="text-[13px] text-[#0071e3] shrink-0">●</span>
                    </div>
                </div>

                <p className="px-[24px] py-[8px] text-[12px] font-semibold uppercase tracking-[0.1em] text-[#6e6e73] mt-2">Main</p>
                <ul className="list-none px-4 space-y-1">
                    {sidebarNav.map((item, idx) => (
                        <li key={idx}>
                            <Link 
                                to={item.path} 
                                className="flex items-center gap-2.5 p-[9px_12px] rounded-[10px] text-[15px] font-medium text-[#86868b] hover:bg-white/5 hover:text-[#f5f5f7] transition-all no-underline"
                            >
                                <span className="w-[18px] text-center">{item.icon}</span> {item.label}
                                {item.badge && (
                                    <span className="ml-auto bg-[#0071e3] text-white text-[10px] font-bold p-[2px_7px] rounded-full">
                                        {item.badge}
                                    </span>
                                )}
                            </Link>
                        </li>
                    ))}
                </ul>

                <p className="px-[24px] py-[8px] text-[12px] font-semibold uppercase tracking-[0.1em] text-[#6e6e73] mt-2">Track</p>
                <ul className="list-none px-4 space-y-1">
                    <li>
                        <Link to="/profile" className="flex items-center gap-2.5 p-[9px_12px] rounded-[10px] text-[15px] font-medium text-[#86868b] hover:bg-white/5 hover:text-[#f5f5f7] transition-all no-underline">
                            <span className="w-[18px] text-center">📈</span> Progress
                        </Link>
                    </li>
                </ul>

                <p className="px-[24px] py-[8px] text-[12px] font-semibold uppercase tracking-[0.1em] text-[#6e6e73] mt-2">Settings</p>
                <ul className="list-none px-4 space-y-1">
                    <li>
                        <Link to="/contact" className="flex items-center gap-2.5 p-[9px_12px] rounded-[10px] text-[15px] font-medium text-[#86868b] hover:bg-white/5 hover:text-[#f5f5f7] transition-all no-underline">
                            <span className="w-[18px] text-center">💬</span> Support
                        </Link>
                    </li>
                </ul>
            </aside>

            {/* MAIN CONTENT AREA */}
            <main className="ml-[240px] flex-1 flex flex-col min-h-screen">
                
                {/* TOPBAR */}
                <header className="bg-[#f5f5f7]/90 backdrop-blur-[20px] border-b border-black/7 px-8 h-[58px] flex items-center justify-between sticky top-0 z-40 shrink-0">
                    <div className="flex items-center gap-2.5">
                        <Link 
                            to="/dashboard" 
                            className="flex items-center gap-1.5 text-[13px] font-medium text-[#6e6e73] no-underline p-[6px_12px] rounded-[8px] border border-[#d2d2d7] bg-white cursor-pointer hover:border-[#0071e3] hover:text-[#0071e3] transition-all"
                        >
                            ← Back
                        </Link>
                        <div className="text-[13px] text-[#86868b]">
                            Dashboard &rsaquo; <span className="text-[#1d1d1f] font-semibold">Account</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="w-[34px] h-[34px] rounded-[8px] border border-[#d2d2d7] bg-white flex items-center justify-center cursor-pointer text-[15px] relative transition-colors hover:border-[#0071e3]">
                            🔔
                            <div className="absolute top-[6px] right-[6px] w-[7px] h-[7px] bg-[#0071e3] rounded-full border-[1.5px] border-[#f5f5f7]" />
                        </button>
                        <button className="w-[34px] h-[34px] rounded-[8px] border border-[#d2d2d7] bg-white flex items-center justify-center cursor-pointer text-[15px] transition-colors hover:border-[#0071e3]">
                            🛒
                        </button>
                    </div>
                </header>

                {/* CONTENT WRAPPER */}
                <div className="p-[28px_32px_60px] flex-1">
                    
                    <div className="text-[11px] font-bold text-[#0071e3] uppercase tracking-wider mb-[4px]">
                        My Account
                    </div>
                    <h1 className="text-[26px] font-extrabold tracking-tight text-[#1d1d1f] mb-[24px]">
                        Account Details
                    </h1>

                    {/* PROFILE HERO */}
                    <div className="bg-black border border-white/8 rounded-[22px] p-[32px_36px] flex items-center gap-[28px] mb-[20px] relative overflow-hidden shrink-0">
                        <div className="absolute left-[-40px] top-[-40px] w-[260px] h-[260px] rounded-full bg-[radial-gradient(circle,rgba(0,113,227,0.2)_0%,transparent_70%)] pointer-events-none" />
                        <div className="relative z-10 w-[88px] h-[88px] rounded-full bg-gradient-to-br from-[#0071e3] to-[#00d4ff] flex items-center justify-center text-[30px] font-extrabold text-white shrink-0 border-3 border-white/12">
                            {userInitials}
                        </div>
                        <div className="relative z-10 flex-1 min-w-0 text-left">
                            <h2 className="text-[26px] font-extrabold tracking-tight text-[#f5f5f7] mb-[4px] leading-[1]">
                                {userFullName}
                            </h2>
                            <div className="flex items-center gap-4 flex-wrap mt-[4px]">
                                <span className="text-[13px] text-[#86868b]">{auth?.user?.userEmail || "arjun.mehta@email.com"}</span>
                                <span className="inline-flex items-center bg-[#0071e3]/20 border border-[#0071e3]/35 text-[#4da3ff] text-[11px] font-bold p-[3px_12px] rounded-full tracking-wider uppercase">
                                    Pro Plan
                                </span>
                                <span className="text-[12px] text-[#6e6e73]">Member since Jan 2025</span>
                            </div>
                            <div className="flex gap-6 mt-[18px]">
                                <div className="flex flex-col">
                                    <div className="text-[22px] font-bold text-[#f5f5f7] leading-[1]">47.5</div>
                                    <div className="text-[11px] text-[#6e6e73] mt-[3px] font-medium">Hours Learned</div>
                                </div>
                                <div className="w-[1px] bg-white/10" />
                                <div className="flex flex-col">
                                    <div className="text-[22px] font-bold text-[#f5f5f7] leading-[1]">
                                        {studentBoughtCoursesList?.length || 3}
                                    </div>
                                    <div className="text-[11px] text-[#6e6e73] mt-[3px] font-medium">Courses</div>
                                </div>
                                <div className="w-[1px] bg-white/10" />
                                <div className="flex flex-col">
                                    <div className="text-[22px] font-bold text-[#f5f5f7] leading-[1]">12</div>
                                    <div className="text-[11px] text-[#6e6e73] mt-[3px] font-medium">Day Streak</div>
                                </div>
                                <div className="w-[1px] bg-white/10" />
                                <div className="flex flex-col">
                                    <div className="text-[22px] font-bold text-[#f5f5f7] leading-[1]">1</div>
                                    <div className="text-[11px] text-[#6e6e73] mt-[3px] font-medium">Certificate</div>
                                </div>
                            </div>
                        </div>
                        <div className="relative z-10 flex flex-col gap-2 shrink-0">
                            <button 
                                onClick={() => setActiveTab("profile")}
                                className="bg-[#0071e3] text-white border-none p-[10px_22px] rounded-[980px] text-[13px] font-semibold cursor-pointer hover:bg-[#0077ed] transition-colors"
                            >
                                Edit Profile
                            </button>
                            <button 
                                onClick={() => setActiveTab("billing")}
                                className="bg-white/8 text-[#f5f5f7] border border-white/15 p-[10px_22px] rounded-[980px] text-[13px] font-semibold cursor-pointer hover:bg-white/14 transition-colors"
                            >
                                Manage Plan
                            </button>
                        </div>
                    </div>

                    {/* TABS ROW */}
                    <div className="flex gap-[4px] bg-white border border-[#e8e8ed] rounded-[12px] p-[4px] w-fit mb-5">
                        {tabs.map(tab => (
                            <button 
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`p-[8px_18px] rounded-[9px] text-[13px] font-medium cursor-pointer border-none bg-transparent transition-all ${activeTab === tab.id ? 'bg-[#0071e3] text-white font-semibold shadow-[0_2px_8px_rgba(0,113,227,0.3)]' : 'text-[#6e6e73] hover:text-[#1d1d1f]'}`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* TAB PANELS */}
                    <div>
                        {activeTab === "profile" && (
                            <div className="space-y-3.5">
                                {/* Personal Info */}
                                <div className="bg-white border border-black/6 rounded-[18px] p-[24px_24px_20px]">
                                    <h3 className="text-[15px] font-bold text-[#1d1d1f] mb-[2px]">Personal Information</h3>
                                    <p className="text-[12px] text-[#86868b] mb-[20px]">Update your name, bio and contact details.</p>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                                        <div className="flex flex-col gap-1">
                                            <label className="text-[11px] font-bold uppercase tracking-wider text-[#86868b]">First Name</label>
                                            <input 
                                                type="text" 
                                                className="font-sans text-[14px] text-[#1d1d1f] bg-[#f5f5f7] border border-[#e8e8ed] rounded-[10px] p-[10px_13px] outline-none focus:border-[#0071e3] focus:bg-white transition-all"
                                                value={firstName}
                                                onChange={(e) => setFirstName(e.target.value)}
                                            />
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <label className="text-[11px] font-bold uppercase tracking-wider text-[#86868b]">Last Name</label>
                                            <input 
                                                type="text" 
                                                className="font-sans text-[14px] text-[#1d1d1f] bg-[#f5f5f7] border border-[#e8e8ed] rounded-[10px] p-[10px_13px] outline-none focus:border-[#0071e3] focus:bg-white transition-all"
                                                value={lastName}
                                                onChange={(e) => setLastName(e.target.value)}
                                            />
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <label className="text-[11px] font-bold uppercase tracking-wider text-[#86868b]">Email Address</label>
                                            <input 
                                                type="email" 
                                                className="font-sans text-[14px] text-[#86868b] bg-[#f5f5f7] border border-[#e8e8ed] rounded-[10px] p-[10px_13px] outline-none cursor-default"
                                                value={auth?.user?.userEmail || "arjun.mehta@email.com"}
                                                readOnly
                                            />
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <label className="text-[11px] font-bold uppercase tracking-wider text-[#86868b]">Phone Number</label>
                                            <input 
                                                type="tel" 
                                                className="font-sans text-[14px] text-[#1d1d1f] bg-[#f5f5f7] border border-[#e8e8ed] rounded-[10px] p-[10px_13px] outline-none focus:border-[#0071e3] focus:bg-white transition-all"
                                                value={phone}
                                                onChange={(e) => setPhone(e.target.value)}
                                            />
                                        </div>
                                        <div className="flex flex-col gap-1 md:col-span-2">
                                            <label className="text-[11px] font-bold uppercase tracking-wider text-[#86868b]">Bio</label>
                                            <textarea 
                                                rows="3" 
                                                className="font-sans text-[14px] text-[#1d1d1f] bg-[#f5f5f7] border border-[#e8e8ed] rounded-[10px] p-[10px_13px] outline-none focus:border-[#0071e3] focus:bg-white transition-all resize-none"
                                                value={bio}
                                                onChange={(e) => setBio(e.target.value)}
                                                placeholder="Tell us a little about yourself…"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-end gap-2.5 mt-[18px] pt-4 border-t border-[#f0f0f0]">
                                        <button 
                                            className="bg-transparent text-[#6e6e73] border border-[#d2d2d7] p-[10px_20px] rounded-[980px] text-[13px] font-medium cursor-pointer hover:border-[#1d1d1f] hover:text-[#1d1d1f] transition-all"
                                            onClick={() => {
                                                if (auth?.user) {
                                                    const nameParts = (auth.user.userFullName || auth.user.userName || "").trim().split(" ");
                                                    setFirstName(nameParts[0] || "");
                                                    setLastName(nameParts.slice(1).join(" ") || "");
                                                    setBio(auth.user.userBio || "");
                                                }
                                            }}
                                        >
                                            Cancel
                                        </button>
                                        <button 
                                            className="bg-[#0071e3] text-white border-none p-[10px_24px] rounded-[980px] text-[13px] font-semibold cursor-pointer hover:bg-[#0077ed] transition-colors"
                                            onClick={handleSaveChanges}
                                        >
                                            Save Changes
                                        </button>
                                    </div>
                                </div>

                                {/* Location & Preferences */}
                                <div className="bg-white border border-black/6 rounded-[18px] p-[24px_24px_20px]">
                                    <h3 className="text-[15px] font-bold text-[#1d1d1f] mb-[2px]">Location & Preferences</h3>
                                    <p className="text-[12px] text-[#86868b] mb-[20px]">Set your region, language and timezone.</p>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                                        <div className="flex flex-col gap-1">
                                            <label className="text-[11px] font-bold uppercase tracking-wider text-[#86868b]">Country</label>
                                            <select 
                                                className="font-sans text-[14px] text-[#1d1d1f] bg-[#f5f5f7] border border-[#e8e8ed] rounded-[10px] p-[10px_13px] outline-none focus:border-[#0071e3] focus:bg-white cursor-pointer transition-all"
                                                value={country}
                                                onChange={(e) => setCountry(e.target.value)}
                                            >
                                                <option>India</option>
                                                <option>United States</option>
                                                <option>United Kingdom</option>
                                                <option>Canada</option>
                                                <option>Australia</option>
                                            </select>
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <label className="text-[11px] font-bold uppercase tracking-wider text-[#86868b]">City</label>
                                            <input 
                                                type="text" 
                                                className="font-sans text-[14px] text-[#1d1d1f] bg-[#f5f5f7] border border-[#e8e8ed] rounded-[10px] p-[10px_13px] outline-none focus:border-[#0071e3] focus:bg-white transition-all"
                                                value={city}
                                                onChange={(e) => setCity(e.target.value)}
                                            />
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <label className="text-[11px] font-bold uppercase tracking-wider text-[#86868b]">Language</label>
                                            <select 
                                                className="font-sans text-[14px] text-[#1d1d1f] bg-[#f5f5f7] border border-[#e8e8ed] rounded-[10px] p-[10px_13px] outline-none focus:border-[#0071e3] focus:bg-white cursor-pointer transition-all"
                                                value={language}
                                                onChange={(e) => setLanguage(e.target.value)}
                                            >
                                                <option>English</option>
                                                <option>Hindi</option>
                                                <option>Gujarati</option>
                                            </select>
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <label className="text-[11px] font-bold uppercase tracking-wider text-[#86868b]">Timezone</label>
                                            <select 
                                                className="font-sans text-[14px] text-[#1d1d1f] bg-[#f5f5f7] border border-[#e8e8ed] rounded-[10px] p-[10px_13px] outline-none focus:border-[#0071e3] focus:bg-white cursor-pointer transition-all"
                                                value={timezone}
                                                onChange={(e) => setTimezone(e.target.value)}
                                            >
                                                <option>IST (UTC +5:30)</option>
                                                <option>UTC</option>
                                                <option>EST (UTC -5)</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-end gap-2.5 mt-[18px] pt-4 border-t border-[#f0f0f0]">
                                        <button className="bg-transparent text-[#6e6e73] border border-[#d2d2d7] p-[10px_20px] rounded-[980px] text-[13px] font-medium cursor-pointer hover:border-[#1d1d1f] hover:text-[#1d1d1f] transition-all">Cancel</button>
                                        <button 
                                            onClick={() => triggerToast("Preferences saved successfully!")}
                                            className="bg-[#0071e3] text-white border-none p-[10px_24px] rounded-[980px] text-[13px] font-semibold cursor-pointer hover:bg-[#0077ed] transition-colors"
                                        >
                                            Save Changes
                                        </button>
                                    </div>
                                </div>

                                {/* Account Info readonly */}
                                <div className="bg-white border border-black/6 rounded-[18px] p-[24px_24px_20px]">
                                    <h3 className="text-[15px] font-bold text-[#1d1d1f] mb-[2px]">Account Info</h3>
                                    <p className="text-[12px] text-[#86868b] mb-[20px]">Read-only details managed by BhavinAcademy.</p>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                                        <div className="flex flex-col gap-1">
                                            <label className="text-[11px] font-bold uppercase tracking-wider text-[#86868b]">Student ID</label>
                                            <input type="text" className="font-sans text-[14px] text-[#86868b] bg-[#f5f5f7] border border-[#e8e8ed] rounded-[10px] p-[10px_13px] cursor-default outline-none" value="SL-2025-00481" readOnly />
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <label className="text-[11px] font-bold uppercase tracking-wider text-[#86868b]">Member Since</label>
                                            <input type="text" className="font-sans text-[14px] text-[#86868b] bg-[#f5f5f7] border border-[#e8e8ed] rounded-[10px] p-[10px_13px] cursor-default outline-none" value="January 14, 2025" readOnly />
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <label className="text-[11px] font-bold uppercase tracking-wider text-[#86868b]">Current Plan</label>
                                            <input type="text" className="font-sans text-[14px] text-[#86868b] bg-[#f5f5f7] border border-[#e8e8ed] rounded-[10px] p-[10px_13px] cursor-default outline-none" value="Pro Plan (Active)" readOnly />
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <label className="text-[11px] font-bold uppercase tracking-wider text-[#86868b]">Last Login</label>
                                            <input type="text" className="font-sans text-[14px] text-[#86868b] bg-[#f5f5f7] border border-[#e8e8ed] rounded-[10px] p-[10px_13px] cursor-default outline-none" value="Today, 9:14 AM" readOnly />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === "progress" && (
                            <div className="space-y-3.5">
                                {/* Mini Stats */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                    <div className="bg-white p-4.5 rounded-[14px] border border-black/6">
                                        <div className="text-[24px] font-extrabold tracking-tight leading-none text-[#1d1d1f]">47.5</div>
                                        <div className="text-[12px] text-[#86868b] font-medium mt-1">Total Hours Learned</div>
                                        <div className="mt-2 text-[10px] font-bold text-[#1d6f42] bg-[#e6f4ea] px-2 py-0.5 rounded-full inline-block">↑ +3.2 this week</div>
                                    </div>
                                    <div className="bg-white p-4.5 rounded-[14px] border border-black/6">
                                        <div className="text-[24px] font-extrabold tracking-tight leading-none text-[#1d1d1f]">12</div>
                                        <div className="text-[12px] text-[#86868b] font-medium mt-1">Current Streak</div>
                                        <div className="mt-2 text-[10px] font-bold text-[#1d6f42] bg-[#e6f4ea] px-2 py-0.5 rounded-full inline-block">↑ Best: 21 days</div>
                                    </div>
                                    <div className="bg-white p-4.5 rounded-[14px] border border-black/6">
                                        <div className="text-[24px] font-extrabold tracking-tight leading-none text-[#1d1d1f]">86</div>
                                        <div className="text-[12px] text-[#86868b] font-medium mt-1">Lessons Completed</div>
                                        <div className="mt-2 text-[10px] font-bold text-[#6e6e73] bg-[#f5f5f7] px-2 py-0.5 rounded-full inline-block">Across 3 courses</div>
                                    </div>
                                </div>

                                {/* Course Progress */}
                                <div className="bg-white border border-black/6 rounded-[18px] p-[24px_24px_20px]">
                                    <h3 className="text-[15px] font-bold text-[#1d1d1f] mb-[2px]">Course Progress</h3>
                                    <p className="text-[12px] text-[#86868b] mb-[20px]">Track your progress across all enrolled courses.</p>
                                    <div className="flex flex-col gap-3">
                                        {[
                                            { title: "Windows Server Administration", pct: 50, meta: "Lesson 28 of 56 · 22 hrs total", color: "from-[#0078d4] to-[#005a9e]", icon: "🪟" },
                                            { title: "Cisco CCNA Bootcamp", pct: 24, meta: "Lesson 18 of 74 · 36 hrs total", color: "from-[#1ba1e2] to-[#0050ef]", icon: "🌐" },
                                            { title: "Azure Fundamentals AZ-900", pct: 16, meta: "Lesson 6 of 38 · 18 hrs total", color: "from-[#0089d6] to-[#00bcf2]", icon: "☁️" }
                                        ].map((item, idx) => (
                                            <div 
                                                key={idx}
                                                onClick={() => navigate("/dashboard")}
                                                className="flex items-center gap-[14px] p-[14px_16px] bg-[#f5f5f7] rounded-[13px] hover:bg-[#ebebeb] transition-all cursor-pointer"
                                            >
                                                <div className="w-[42px] h-[42px] rounded-[11px] bg-gradient-to-br from-[#0071e3] to-[#00d4ff] flex items-center justify-center text-[20px] shrink-0 text-white">
                                                    {item.icon}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="text-[14px] font-semibold text-[#1d1d1f] truncate mb-[5px]">{item.title}</div>
                                                    <div className="flex items-center gap-[10px]">
                                                        <div className="flex-1 h-[5px] bg-[#e8e8ed] rounded-full overflow-hidden">
                                                            <div className="h-full bg-gradient-to-r from-[#0071e3] to-[#00d4ff] rounded-full" style={{ width: `${item.pct}%` }} />
                                                        </div>
                                                        <span className="text-[12px] font-bold text-[#0071e3] shrink-0">{item.pct}%</span>
                                                    </div>
                                                    <div className="text-[11px] text-[#86868b] mt-[3px]">{item.meta}</div>
                                                </div>
                                                <span className="text-[11px] font-semibold bg-[#e8f1fb] text-[#0071e3] p-[3px_10px] rounded-full shrink-0">
                                                    In Progress
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Certificates */}
                                <div className="bg-white border border-black/6 rounded-[18px] p-[24px_24px_20px]">
                                    <h3 className="text-[15px] font-bold text-[#1d1d1f] mb-[2px]">Certificates Earned</h3>
                                    <p className="text-[12px] text-[#86868b] mb-[20px]">Download or share your achievements.</p>
                                    <div className="flex flex-col gap-2.5">
                                        <div className="flex items-center gap-[14px] p-[14px_16px] bg-[#f5f5f7] rounded-[13px]">
                                            <div className="w-[40px] h-[40px] rounded-[10px] bg-gradient-to-br from-[#ffd60a] to-[#ff9f0a] flex items-center justify-center text-[20px] shrink-0">🏆</div>
                                            <div className="flex-1 min-w-0">
                                                <div className="text-[13px] font-semibold text-[#1d1d1f] truncate">Windows Fundamentals — Completion Certificate</div>
                                                <div className="text-[11px] text-[#86868b] mt-[2px]">Issued March 10, 2025 · BhavinAcademy Certified</div>
                                            </div>
                                            <button 
                                                onClick={() => triggerToast("Certificate downloaded successfully!")}
                                                className="text-[12px] font-semibold text-[#0071e3] bg-transparent border-none cursor-pointer hover:underline"
                                            >
                                                ⬇ Download
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Study Activity Heatmap */}
                                <div className="bg-white border border-black/6 rounded-[18px] p-[24px_24px_20px]">
                                    <h3 className="text-[15px] font-bold text-[#1d1d1f] mb-[2px]">Study Activity</h3>
                                    <p className="text-[12px] text-[#86868b] mb-[20px]">Your learning activity over the last 3 months.</p>
                                    
                                    <div className="flex flex-wrap gap-1.5">
                                        {heatmapData.map((level, i) => (
                                            <div 
                                                key={i}
                                                className={`w-[12px] h-[12px] rounded-[2px] cursor-pointer hover:scale-130 transition-transform ${getHeatmapColorClass(level)}`}
                                                title={`${level === 0 ? 'No activity' : level + ' lesson' + (level > 1 ? 's' : '')} studied`}
                                            />
                                        ))}
                                    </div>

                                    <div className="flex items-center gap-1.5 mt-2 justify-end select-none">
                                        <span className="text-[10px] text-[#86868b]">Less</span>
                                        <div className="flex gap-[3px]">
                                            {["bg-[#f0f0f0]", "bg-[#bfdbfe]", "bg-[#60a5fa]", "bg-[#2563eb]", "bg-[#0071e3]"].map((color, i) => (
                                                <div key={i} className={`w-[10px] h-[10px] rounded-[2px] ${color}`} />
                                            ))}
                                        </div>
                                        <span className="text-[10px] text-[#86868b]">More</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === "billing" && (
                            <div className="space-y-3.5">
                                {/* Plan Card */}
                                <div className="bg-black border border-white/8 rounded-[18px] p-6 relative overflow-hidden text-left text-white shrink-0">
                                    <div className="absolute right-[-30px] top-[-30px] w-[180px] h-[180px] rounded-full bg-[radial-gradient(circle,rgba(0,113,227,0.25)_0%,transparent_70%)] pointer-events-none" />
                                    <div className="text-[11px] font-bold text-[#4da3ff] uppercase tracking-wider mb-[6px]">Current Plan</div>
                                    <h3 className="text-[22px] font-black text-[#f5f5f7] mb-[4px] leading-[1]">Pro Plan</h3>
                                    <p className="text-[13px] text-[#86868b] mb-[18px] leading-[1.5] max-w-[400px]">
                                        Full access to all courses, labs, practice exams and certificates.
                                    </p>
                                    <div className="flex flex-col gap-1.5 mb-[20px]">
                                        {[
                                            "Unlimited course access",
                                            "All virtual labs & practice exams",
                                            "Downloadable certificates",
                                            "Priority support"
                                        ].map((feat, idx) => (
                                            <div key={idx} className="flex items-center gap-2 text-[13px] text-[#d2d2d7]">
                                                <div className="w-[18px] h-[18px] rounded-full bg-[#0071e3]/25 flex items-center justify-center text-[10px] text-[#4da3ff] font-bold">✓</div>
                                                <span>{feat}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="text-[12px] text-[#6e6e73] mb-[16px]">Next renewal: <strong className="text-[#86868b]">January 14, 2026</strong> · ₹2,499/year</div>
                                    <div className="flex gap-[10px]">
                                        <button 
                                            onClick={() => triggerToast("Redirecting to upgrade options…")}
                                            className="bg-[#0071e3] text-white border-none p-[10px_20px] rounded-[980px] text-[13px] font-semibold cursor-pointer hover:bg-[#0077ed] transition-colors"
                                        >
                                            Upgrade Plan
                                        </button>
                                        <button 
                                            onClick={() => triggerToast("Opening billing portal…")}
                                            className="bg-white/8 text-[#f5f5f7] border border-white/15 p-[10px_18px] rounded-[980px] text-[13px] font-semibold cursor-pointer hover:bg-white/14 transition-colors"
                                        >
                                            Manage Billing
                                        </button>
                                    </div>
                                </div>

                                {/* Payment Method */}
                                <div className="bg-white border border-black/6 rounded-[18px] p-[24px_24px_20px]">
                                    <div className="flex items-start justify-between mb-[18px]">
                                        <div>
                                            <h3 className="text-[15px] font-bold text-[#1d1d1f] mb-[2px]">Payment Method</h3>
                                            <p className="text-[12px] text-[#86868b]">Your saved payment details.</p>
                                        </div>
                                        <button 
                                            onClick={() => triggerToast("Opening payment editor…")}
                                            className="text-[12px] font-semibold text-[#0071e3] hover:underline bg-none border-none cursor-pointer p-0"
                                        >
                                            + Add New
                                        </button>
                                    </div>
                                    <div className="flex items-center gap-[14px] p-[14px_16px] bg-[#f5f5f7] rounded-[13px]">
                                        <div className="w-[44px] h-[30px] bg-gradient-to-br from-[#1a1f71] to-[#1a1f71] rounded-[6px] flex items-center justify-center text-[11px] font-bold text-white shrink-0 tracking-wider">
                                            VISA
                                        </div>
                                        <div className="flex-1">
                                            <div className="text-[14px] font-semibold text-[#1d1d1f]">Visa ending in 4242</div>
                                            <div className="text-[12px] text-[#86868b] mt-[2px]">Expires 08 / 2027</div>
                                        </div>
                                        <span className="text-[11px] font-semibold bg-[#e6f4ea] text-[#1d6f42] p-[3px_10px] rounded-full shrink-0">
                                            Default
                                        </span>
                                    </div>
                                </div>

                                {/* Billing History */}
                                <div className="bg-white border border-black/6 rounded-[18px] p-[24px_24px_20px]">
                                    <h3 className="text-[15px] font-bold text-[#1d1d1f] mb-[2px]">Billing History</h3>
                                    <p className="text-[12px] text-[#86868b] mb-[20px]">Past payments and invoices.</p>
                                    <div className="divide-y divide-[#f0f0f0]">
                                        {[
                                            { desc: "Pro Plan — Annual", date: "Jan 14, 2025", amount: "₹2,499" },
                                            { desc: "Pro Plan — Annual", date: "Jan 14, 2024", amount: "₹1,999" }
                                        ].map((invoice, i) => (
                                            <div key={i} className="flex items-center justify-between py-[13px] first:pt-0 last:pb-0">
                                                <div>
                                                    <div className="text-[13px] font-semibold text-[#1d1d1f]">{invoice.desc}</div>
                                                    <div className="text-[11px] text-[#86868b] mt-[2px]">{invoice.date}</div>
                                                </div>
                                                <div className="flex items-center gap-[12px]">
                                                    <span className="text-[14px] font-bold text-[#1d1d1f]">{invoice.amount}</span>
                                                    <button 
                                                        onClick={() => triggerToast("Invoice downloading...")}
                                                        className="text-[12px] font-semibold text-[#0071e3] border border-[#d2d2d7] bg-white p-[6px_14px] rounded-[980px] cursor-pointer hover:border-[#0071e3] transition-colors"
                                                    >
                                                        Invoice
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === "notifications" && (
                            <div className="bg-white border border-black/6 rounded-[18px] p-[24px_24px_20px]">
                                <h3 className="text-[15px] font-bold text-[#1d1d1f] mb-[2px]">Email Notifications</h3>
                                <p className="text-[12px] text-[#86868b] mb-[20px]">Choose which emails you want to receive.</p>
                                <div className="divide-y divide-[#f0f0f0]">
                                    {[
                                        { title: "Course Updates", desc: "New lessons and content added to your courses.", checked: true },
                                        { title: "Lab Reminders", desc: "Reminders before upcoming labs and exams.", checked: true },
                                        { title: "Streak Alerts", desc: "Get notified if you're about to lose your streak.", checked: true },
                                        { title: "Weekly Progress Report", desc: "Summary of your weekly learning activity.", checked: false },
                                        { title: "Promotions & Offers", desc: "New courses, discounts and special offers.", checked: false }
                                    ].map((notif, idx) => (
                                        <div key={idx} className="flex items-center justify-between py-[13px] first:pt-0 last:pb-0">
                                            <div>
                                                <div className="text-[14px] font-semibold text-[#1d1d1f]">{notif.title}</div>
                                                <div className="text-[12px] text-[#86868b] mt-[2px]">{notif.desc}</div>
                                            </div>
                                            <label className="relative inline-flex items-center cursor-pointer w-[40px] h-[22px] shrink-0">
                                                <input type="checkbox" className="sr-only peer" defaultChecked={notif.checked} />
                                                <div className="w-full h-full bg-[#d2d2d7] rounded-full transition-all peer peer-checked:bg-[#0071e3] after:content-[''] after:absolute after:top-[3px] after:left-[3px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-[18px] after:shadow-[0_1px_4px_rgba(0,0,0,0.15)]" />
                                            </label>
                                        </div>
                                    ))}
                                </div>
                                <div className="flex justify-end mt-4 pt-3.5 border-t border-[#f0f0f0]">
                                    <button 
                                        onClick={() => triggerToast("Notification preferences saved successfully!")}
                                        className="bg-[#0071e3] text-white border-none p-[10px_24px] rounded-[980px] text-[13px] font-semibold cursor-pointer hover:bg-[#0077ed] transition-colors"
                                    >
                                        Save Preferences
                                    </button>
                                </div>
                            </div>
                        )}

                        {activeTab === "security" && (
                            <div className="space-y-3.5">
                                {/* Security Overview */}
                                <div className="bg-white border border-black/6 rounded-[18px] p-[24px_24px_20px]">
                                    <h3 className="text-[15px] font-bold text-[#1d1d1f] mb-[2px]">Security Overview</h3>
                                    <p className="text-[12px] text-[#86868b] mb-[20px]">Manage your password, 2FA and active sessions.</p>
                                    <div className="divide-y divide-[#f0f0f0]">
                                        <div className="flex items-center justify-between py-3.5 first:pt-0">
                                            <div>
                                                <div className="text-[14px] font-semibold text-[#1d1d1f]">Password</div>
                                                <div className="text-[12px] text-[#86868b] mt-[2px]">Last changed 3 months ago</div>
                                            </div>
                                            <div className="flex items-center gap-[10px]">
                                                <div className="flex items-center gap-1.5 text-[12px] font-semibold text-[#1d6f42]">
                                                    <div className="w-[7px] h-[7px] bg-[#34c759] rounded-full shrink-0" />
                                                    Strong
                                                </div>
                                                <button 
                                                    onClick={() => triggerToast("Password reset link sent to your email")}
                                                    className="bg-transparent border border-[#d2d2d7] text-[#0071e3] font-semibold p-[6px_14px] rounded-[980px] text-[12px] cursor-pointer hover:border-[#0071e3] transition-colors"
                                                >
                                                    Change
                                                </button>
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-center justify-between py-3.5">
                                            <div>
                                                <div className="text-[14px] font-semibold text-[#1d1d1f]">Two-Factor Authentication</div>
                                                <div className="text-[12px] text-[#86868b] mt-[2px]">Authenticator app (Google Authenticator)</div>
                                            </div>
                                            <div className="flex items-center gap-[10px]">
                                                <div className="flex items-center gap-1.5 text-[12px] font-semibold text-[#1d6f42]">
                                                    <div className="w-[7px] h-[7px] bg-[#34c759] rounded-full shrink-0" />
                                                    Enabled
                                                </div>
                                                <button 
                                                    onClick={() => triggerToast("Opening 2FA settings...")}
                                                    className="bg-transparent border border-[#d2d2d7] text-[#0071e3] font-semibold p-[6px_14px] rounded-[980px] text-[12px] cursor-pointer hover:border-[#0071e3] transition-colors"
                                                >
                                                    Manage
                                                </button>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between py-3.5">
                                            <div>
                                                <div className="text-[14px] font-semibold text-[#1d1d1f]">Backup Email</div>
                                                <div className="text-[12px] text-[#86868b] mt-[2px]">Not configured</div>
                                            </div>
                                            <div className="flex items-center gap-[10px]">
                                                <div className="flex items-center gap-1.5 text-[12px] font-semibold text-[#b25000]">
                                                    <div className="w-[7px] h-[7px] bg-[#ff9f0a] rounded-full shrink-0" />
                                                    Missing
                                                </div>
                                                <button 
                                                    onClick={() => triggerToast("Opening backup setup...")}
                                                    className="bg-transparent border border-[#d2d2d7] text-[#0071e3] font-semibold p-[6px_14px] rounded-[980px] text-[12px] cursor-pointer hover:border-[#0071e3] transition-colors"
                                                >
                                                    Add
                                                </button>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between py-3.5 last:pb-0">
                                            <div>
                                                <div className="text-[14px] font-semibold text-[#1d1d1f]">Active Sessions</div>
                                                <div className="text-[12px] text-[#86868b] mt-[2px]">2 devices — Chrome on Windows, iPhone 14</div>
                                            </div>
                                            <button 
                                                onClick={() => triggerToast("Opening active sessions tracker...")}
                                                className="bg-transparent border border-[#d2d2d7] text-[#0071e3] font-semibold p-[6px_14px] rounded-[980px] text-[12px] cursor-pointer hover:border-[#0071e3] transition-colors"
                                            >
                                                View All
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Change Password Card */}
                                <div className="bg-white border border-black/6 rounded-[18px] p-[24px_24px_20px]">
                                    <h3 className="text-[15px] font-bold text-[#1d1d1f] mb-[2px]">Change Password</h3>
                                    <p className="text-[12px] text-[#86868b] mb-[20px]">Use a strong password with at least 8 characters.</p>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                                        <div className="flex flex-col gap-1 md:col-span-2">
                                            <label className="text-[11px] font-bold uppercase tracking-wider text-[#86868b]">Current Password</label>
                                            <input 
                                                type="password" 
                                                placeholder="Enter current password" 
                                                className="font-sans text-[14px] text-[#1d1d1f] bg-[#f5f5f7] border border-[#e8e8ed] rounded-[10px] p-[10px_13px] outline-none focus:border-[#0071e3] focus:bg-white transition-all"
                                                value={currentPassword}
                                                onChange={(e) => setCurrentPassword(e.target.value)}
                                            />
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <label className="text-[11px] font-bold uppercase tracking-wider text-[#86868b]">New Password</label>
                                            <input 
                                                type="password" 
                                                placeholder="Min. 8 characters" 
                                                className="font-sans text-[14px] text-[#1d1d1f] bg-[#f5f5f7] border border-[#e8e8ed] rounded-[10px] p-[10px_13px] outline-none focus:border-[#0071e3] focus:bg-white transition-all"
                                                value={newPassword}
                                                onChange={(e) => setNewPassword(e.target.value)}
                                            />
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <label className="text-[11px] font-bold uppercase tracking-wider text-[#86868b]">Confirm New Password</label>
                                            <input 
                                                type="password" 
                                                placeholder="Repeat new password" 
                                                className="font-sans text-[14px] text-[#1d1d1f] bg-[#f5f5f7] border border-[#e8e8ed] rounded-[10px] p-[10px_13px] outline-none focus:border-[#0071e3] focus:bg-white transition-all"
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-end gap-2.5 mt-[18px] pt-4 border-t border-[#f0f0f0]">
                                        <button className="bg-transparent text-[#6e6e73] border border-[#d2d2d7] p-[10px_20px] rounded-[980px] text-[13px] font-medium cursor-pointer hover:border-[#1d1d1f] hover:text-[#1d1d1f] transition-all">Cancel</button>
                                        <button 
                                            onClick={() => {
                                                if (newPassword !== confirmPassword) {
                                                    triggerToast("Passwords do not match!");
                                                    return;
                                                }
                                                triggerToast("Password updated successfully!");
                                                setCurrentPassword("");
                                                setNewPassword("");
                                                setConfirmPassword("");
                                            }}
                                            className="bg-[#0071e3] text-white border-none p-[10px_24px] rounded-[980px] text-[13px] font-semibold cursor-pointer hover:bg-[#0077ed] transition-colors"
                                        >
                                            Update Password
                                        </button>
                                    </div>
                                </div>

                                {/* Danger Zone */}
                                <div className="bg-[#fff5f5] border border-[#fecaca] rounded-[18px] p-[22px_24px]">
                                    <h3 className="text-[14px] font-bold text-[#b71c1c] mb-[4px]">⚠ Danger Zone</h3>
                                    <p className="text-[12px] text-[#86868b] mb-[14px] leading-[1.5]">
                                        Deleting your account is permanent and cannot be undone. All your progress, certificates and data will be removed immediately.
                                    </p>
                                    <button 
                                        onClick={() => {
                                            if (confirm("Are you sure? This cannot be undone. All your data will be permanently deleted.")) {
                                                triggerToast("Account deletion request submitted!");
                                            }
                                        }}
                                        className="bg-[#ff3b30] text-white border-none p-[9px_18px] rounded-[980px] text-[13px] font-semibold cursor-pointer hover:bg-[#d92b20] transition-colors"
                                    >
                                        Delete Account
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                </div>
            </main>

            {/* TOAST NOTIFICATION SYSTEM */}
            <AnimatePresence>
                {showToast && (
                    <motion.div 
                        initial={{ opacity: 0, y: 80 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 80 }}
                        className="fixed bottom-[28px] right-[28px] bg-[#1d1d1f] text-[#f5f5f7] p-[12px_20px] rounded-[12px] text-[13px] font-medium flex items-center gap-[8px] z-[999] shadow-[0_8px_24px_rgba(0,0,0,0.3)]"
                    >
                        <div className="w-[20px] h-[20px] rounded-full bg-[#34c759] flex items-center justify-center text-[11px] font-bold shrink-0 text-white">✓</div>
                        <span>{showToast}</span>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default StudentProfilePage;
