import React, { useState, useContext, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "@/context/auth-context";
import { StudentContext } from "@/context/student-context";
import { getCourseImageUrl } from "@/utils/course-images";

function StudentDashboardPage() {
    const navigate = useNavigate();
    const { auth } = useContext(AuthContext);
    const { studentBoughtCoursesList, fetchBoughtCourses } = useContext(StudentContext);

    useEffect(() => {
        if (auth?.user?._id) {
            fetchBoughtCourses(auth?.user?._id);
        }
    }, [auth]);

    const reveal = {
        initial: { opacity: 0, y: 15 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.4 }
    };

    const heatmapData = [
        0,0,0,1,0,2,3,1,0,1,2,4,3,1,0,0,1,3,4,2,1,0,0,2,3,1,4,2,0,1,
        2,3,1,0,1,4,3,2,1,0,0,1,2,4,3,1,2,3,0,1,4,2,1,0,0,2,3,4,1,0,
        1,2,3,0,1,2,4,3,1,0,0,1,2,3,4,2,1,0,1,3,4,2,1,0,0,1,2,3,4,1
    ];

    const getHeatmapColor = (level) => {
        switch(level) {
            case 1: return "bg-blue-200";
            case 2: return "bg-blue-400";
            case 3: return "bg-blue-600";
            case 4: return "bg-blue-700";
            default: return "bg-slate-100";
        }
    };

    const userFullName = auth?.user?.userFullName || auth?.user?.userName || "Student";
    const userInitials = userFullName
        .split(" ")
        .map(n => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();

    const sidebarNav = [
        { icon: "dashboard", label: "Dashboard", path: "/dashboard", active: true },
        { icon: "bar_chart", label: "My Courses", path: "/student-courses", badge: studentBoughtCoursesList?.length?.toString() },
        { icon: "edit_note", label: "Practice Exams", path: "/exams" },
        { icon: "settings", label: "Profile Settings", path: "/profile" },
    ];

    return (
        <div className="flex min-h-screen bg-surface font-body text-on-surface">
            {/* NavigationDrawer (Web Sidebar) */}
            <aside className="fixed left-0 top-0 h-full z-40 hidden md:flex flex-col w-64 bg-surface-container-low border-r-0">
                <div className="p-8 pt-24 flex-grow flex flex-col justify-between">
                    <div>
                        {/* Profile Info */}
                        <div className="flex items-center gap-4 mb-10">
                            <div className="w-12 h-12 rounded-full overflow-hidden bg-primary-fixed flex items-center justify-center font-bold text-sm text-primary flex-shrink-0">
                                {auth?.user?.profileImage ? (
                                    <img src={auth.user.profileImage} className="w-full h-full object-cover" alt="Profile" />
                                ) : (
                                    userInitials
                                )}
                            </div>
                            <div className="min-w-0">
                                <p className="font-headline text-sm font-bold text-on-background truncate">{userFullName}</p>
                                <p className="text-xs text-slate-500">Expert Verified</p>
                            </div>
                        </div>

                        {/* Navigation Menu */}
                        <nav className="space-y-2">
                            {sidebarNav.map((item, i) => (
                                <Link 
                                    key={i} 
                                    to={item.path} 
                                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all font-headline text-sm no-underline ${
                                        item.active 
                                            ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-l-4 border-blue-700" 
                                            : "text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-900 hover:translate-x-1"
                                    }`}
                                >
                                    <span className="material-symbols-outlined text-lg">{item.icon}</span>
                                    <span>{item.label}</span>
                                    {item.badge && (
                                        <span className="ml-auto bg-blue-700 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                                            {item.badge}
                                        </span>
                                    )}
                                </Link>
                            ))}
                        </nav>
                    </div>

                    {/* Bottom Logout in Sidebar */}
                    <div className="pt-6 border-t border-slate-200">
                        <Link 
                            to="/profile"
                            className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-900 hover:translate-x-1 transition-all rounded-lg font-headline text-sm no-underline"
                        >
                            <span className="material-symbols-outlined text-lg">account_circle</span>
                            <span>Account Details</span>
                        </Link>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="md:ml-64 flex-1 pt-12 pb-32 px-6 md:px-10 max-w-7xl">
                {/* Hero Header */}
                <div className="mb-10 text-left">
                    <h1 className="text-3xl font-headline font-extrabold tracking-tight text-on-background mb-2">Editorial Overview</h1>
                    <p className="text-on-surface-variant font-body">Clinical insights and performance metrics for the last 30 days.</p>
                </div>

                {/* Bento Grid Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10 text-left">
                    {/* Card 1: Total Posts */}
                    <div className="bg-surface-container-lowest p-6 rounded-xl shadow-atmospheric relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <span className="material-symbols-outlined text-6xl text-on-surface">article</span>
                        </div>
                        <p className="text-xs font-label font-semibold text-slate-500 uppercase tracking-wider mb-1">Total Posts</p>
                        <p className="text-3xl font-headline font-bold text-primary">248</p>
                        <p className="text-[10px] mt-2 flex items-center gap-1 text-secondary font-medium">
                            <span className="material-symbols-outlined text-xs">trending_up</span> +12 this month
                        </p>
                    </div>

                    {/* Card 2: Monthly Traffic */}
                    <div className="bg-surface-container-lowest p-6 rounded-xl shadow-atmospheric relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <span className="material-symbols-outlined text-6xl text-on-surface">monitoring</span>
                        </div>
                        <p className="text-xs font-label font-semibold text-slate-500 uppercase tracking-wider mb-1">Monthly Traffic</p>
                        <p className="text-3xl font-headline font-bold text-primary">84.2k</p>
                        <p className="text-[10px] mt-2 flex items-center gap-1 text-secondary font-medium">
                            <span className="material-symbols-outlined text-xs">trending_up</span> +5.4% vs last month
                        </p>
                    </div>

                    {/* Card 3: CTR */}
                    <div className="bg-surface-container-lowest p-6 rounded-xl shadow-atmospheric relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <span className="material-symbols-outlined text-6xl text-on-surface">ads_click</span>
                        </div>
                        <p className="text-xs font-label font-semibold text-slate-500 uppercase tracking-wider mb-1">CTR</p>
                        <p className="text-3xl font-headline font-bold text-primary">12.4%</p>
                        <p className="text-[10px] mt-2 flex items-center gap-1 text-error font-medium">
                            <span className="material-symbols-outlined text-xs">trending_down</span> -0.8% drop
                        </p>
                    </div>

                    {/* Card 4: Affiliate Revenue */}
                    <div className="bg-surface-container-lowest p-6 rounded-xl shadow-atmospheric border-l-4 border-secondary relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <span className="material-symbols-outlined text-6xl text-on-surface">payments</span>
                        </div>
                        <p className="text-xs font-label font-semibold text-slate-500 uppercase tracking-wider mb-1">Affiliate Revenue</p>
                        <p className="text-3xl font-headline font-bold text-on-secondary-container">$12,450</p>
                        <p className="text-[10px] mt-2 font-medium text-secondary">Payout pending: $2.1k</p>
                    </div>
                </div>

                {/* Main 2-Column Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-left">
                    {/* Left Column (Main Stats & Enrolled Courses) */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Dynamic Purchased Courses Section (Continue Learning) */}
                        <div className="space-y-6">
                            <div className="flex items-end justify-between">
                                <div>
                                    <div className="text-[11px] font-black text-primary uppercase tracking-widest mb-1">In Progress</div>
                                    <h2 className="text-[22px] font-headline font-extrabold tracking-tight text-on-background">Continue Learning</h2>
                                </div>
                                <Link to="/student-courses" className="text-[13px] font-bold text-primary hover:underline">See all courses ›</Link>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {studentBoughtCoursesList && studentBoughtCoursesList.length > 0 ? (
                                    studentBoughtCoursesList.slice(0, 4).map((c, i) => (
                                        <motion.div 
                                            key={c.courseId} 
                                            {...reveal} 
                                            transition={{ delay: i * 0.1 }} 
                                            onClick={() => navigate(`/course-progress/${c.courseId}`)}
                                            className="bg-surface-container-lowest rounded-2xl overflow-hidden shadow-atmospheric group cursor-pointer hover:scale-[1.01] transition-all duration-300"
                                        >
                                            <div className="h-[140px] relative overflow-hidden bg-surface-container-low flex items-center justify-center shrink-0">
                                                <img 
                                                    src={getCourseImageUrl(c)} 
                                                    alt={c.title}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                />
                                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                                                    <button className="bg-white text-black text-[11px] font-bold px-4 py-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-sm">▶ Resume</button>
                                                </div>
                                            </div>
                                            <div className="p-5">
                                                <div className="text-[10px] font-black text-primary uppercase tracking-widest mb-1">{c.instructorName || "Instructor"}</div>
                                                <h3 className="font-headline text-sm font-bold text-on-background mb-3 leading-snug line-clamp-2 h-10 group-hover:text-primary transition-colors">{c.title}</h3>
                                                <div className="flex justify-between text-[11px] font-bold mb-2">
                                                    <span className="text-slate-500">Progress</span>
                                                    <span className="text-primary">{c.progress || 0}%</span>
                                                </div>
                                                <div className="h-1 bg-surface-container-low rounded-full overflow-hidden mb-4">
                                                    <div className="h-full bg-gradient-to-r from-primary to-primary-container" style={{ width: `${c.progress || 0}%` }} />
                                                </div>
                                                <div className="flex items-center justify-between text-[11px]">
                                                    <span className="text-slate-400 font-label">Click to open course</span>
                                                    <span className="text-primary font-bold">Resume →</span>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))
                                ) : (
                                    <div className="col-span-full bg-surface-container-lowest rounded-2xl p-10 shadow-atmospheric text-center flex flex-col items-center py-16">
                                        <span className="material-symbols-outlined text-slate-300 text-5xl mb-4">menu_book</span>
                                        <h3 className="font-headline text-[16px] font-bold text-on-background mb-1">No courses in progress</h3>
                                        <p className="text-[13px] text-slate-500 mb-6 max-w-xs font-body">You have not enrolled in any courses yet. Start your journey today!</p>
                                        <Link to="/courses" className="cta-gradient text-white text-[12px] font-bold px-6 py-2.5 rounded-full transition-all shadow-md">Explore Courses</Link>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Recent Editorial Content */}
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-headline font-bold text-on-background">Recent Editorial Content</h2>
                                <button onClick={() => navigate("/blog")} className="text-sm font-label font-semibold text-primary hover:underline">View all posts</button>
                            </div>
                            <div className="bg-surface-container-lowest rounded-2xl overflow-hidden shadow-atmospheric">
                                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                                    {/* Post Item 1 */}
                                    <div className="p-5 flex items-center gap-4 hover:bg-surface-container-low transition-colors group cursor-pointer" onClick={() => navigate("/blog")}>
                                        <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-surface-container-low">
                                            <img alt="Vitamin Review" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuClXSSu1Fz9ug4LlgZ3_-pTtQ-BPQHAS2kvw0Hi_ivOrnbEKwfNCVKnVF3WNyEjWoIXediIprej2lRTC4k_gHNBSl62xiiXGfFhXHw8KIHBqgr2Bjv3ySYhXX85Wcb5EOn-81AfhPoQY-gBmLVUXXFecaowHAW8oiPuIm1N-ZqATlvD4eZj7F5JgCxP1cv4YCvpvjetmuaUvM5zPM3yRb6e0kxCwnmt5cy6ssnmgjWYkQxpsTc5DIDa37u0Vt9djAWWfhYK7DaNaCqd"/>
                                        </div>
                                        <div className="flex-grow">
                                            <h3 className="font-headline font-bold text-on-background text-sm group-hover:text-primary transition-colors">Top 10 Clinical-Grade Vitamin D Supplements for 2024</h3>
                                            <div className="flex items-center gap-3 mt-1">
                                                <span className="bg-secondary-container/20 text-secondary text-[10px] px-2 py-0.5 rounded-full font-bold">Published</span>
                                                <span className="text-[10px] text-slate-400 font-label">Modified 2h ago</span>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs font-label text-slate-400 mb-1">SEO Score</p>
                                            <span className="text-sm font-headline font-bold text-secondary">96/100</span>
                                        </div>
                                    </div>
                                    {/* Post Item 2 */}
                                    <div className="p-5 flex items-center gap-4 hover:bg-surface-container-low transition-colors group cursor-pointer" onClick={() => navigate("/blog")}>
                                        <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-surface-container-low">
                                            <img alt="Yoga Guide" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBbcEut881uwJZ8-37STMfvlmyUhCrEX_6FSfN2CY6I8GawLuU67mHZ61GlMxRifGFVX6zhDsoXLzWsA7JuSFGfCvVvqYLR2buR_axgGZfDlFLxbmicAaLpsBUoV8sqJR096myrfmGzTZ07zrjZ_06-PBdiGHICjZe6mGsVbguln7ggwUiG1SpBDFXixvkHvNs_5xNlsdQRevI4oL8bb7-3dcS0EAJtKcsaROsQt-jvY8LTUQ-Mcnpz9GgmlLtDVQ8y7t2KTbG2Ht9I"/>
                                        </div>
                                        <div className="flex-grow">
                                            <h3 className="font-headline font-bold text-on-background text-sm group-hover:text-primary transition-colors">The Impact of Cortisol on Sleep Quality: A Medical Review</h3>
                                            <div className="flex items-center gap-3 mt-1">
                                                <span className="bg-surface-container-highest text-on-surface-variant text-[10px] px-2 py-0.5 rounded-full font-bold">Draft</span>
                                                <span className="text-[10px] text-slate-400 font-label">Modified 5h ago</span>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs font-label text-slate-400 mb-1">SEO Score</p>
                                            <span className="text-sm font-headline font-bold text-primary">82/100</span>
                                        </div>
                                    </div>
                                    {/* Post Item 3 */}
                                    <div className="p-5 flex items-center gap-4 hover:bg-surface-container-low transition-colors group cursor-pointer" onClick={() => navigate("/blog")}>
                                        <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-surface-container-low">
                                            <img alt="Nutrition" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAUj37mmnUVNnAwRH6iqx7etoXz75LAf8QtWT3jUmTxj2sTWhR994F9ofcB7FPq19cTPCx0R9jH1SKpbKLTA3i01Pq6xRhqyOvQAIpkrTxBFixlsLm_W6GAfkKPL0dVaZR_2GsnEfsqsKByQ5jsUVKQmwbTqqEePO4j2Yn3iKvAVc4kISXnlc6H-1Vm8RVmFqImcR1qwv60fdmH1DPsVFnjimSWH-n3GdWpADaZLG_CJmfVGBm8n3HUAj5IUwPm7NYdMgWvs7Mqxt3t"/>
                                        </div>
                                        <div className="flex-grow">
                                            <h3 className="font-headline font-bold text-on-background text-sm group-hover:text-primary transition-colors">Intermittent Fasting: Clinical Long-term Outcomes Analyzed</h3>
                                            <div className="flex items-center gap-3 mt-1">
                                                <span className="bg-secondary-container/20 text-secondary text-[10px] px-2 py-0.5 rounded-full font-bold">Published</span>
                                                <span className="text-[10px] text-slate-400 font-label">Modified 1d ago</span>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs font-label text-slate-400 mb-1">SEO Score</p>
                                            <span className="text-sm font-headline font-bold text-secondary">91/100</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Consistency Heatmap */}
                        <div className="bg-surface-container-lowest rounded-2xl p-8 shadow-atmospheric">
                            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
                                <div>
                                    <div className="text-[11px] font-black text-primary uppercase tracking-widest mb-1">Consistency</div>
                                    <h2 className="text-[20px] font-headline font-extrabold tracking-tight text-on-background">Study Activity — Last 3 Months</h2>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-[11px] text-slate-400">Less</span>
                                    <div className="flex gap-1">
                                        {[0, 1, 2, 3, 4].map(l => (
                                            <div key={l} className={`w-3 h-3 rounded-sm ${getHeatmapColor(l)}`} />
                                        ))}
                                    </div>
                                    <span className="text-[11px] text-slate-400">More</span>
                                </div>
                            </div>
                            
                            <div className="flex flex-wrap gap-1.5 justify-center sm:justify-start">
                                {heatmapData.map((level, i) => (
                                    <motion.div 
                                        key={i} 
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ delay: i * 0.005 }}
                                        className={`w-3.5 h-3.5 rounded-[3px] ${getHeatmapColor(level)} transition-transform hover:scale-150 cursor-pointer`}
                                        title={`${level} lessons completed`}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Column (Alerts & Side Panels) */}
                    <div className="space-y-6">
                        {/* SEO Alert Card */}
                        <div className="bg-error-container/30 rounded-2xl p-6 border-l-4 border-error shadow-atmospheric">
                            <div className="flex items-start gap-3 mb-4">
                                <span className="material-symbols-outlined text-error">report</span>
                                <div>
                                    <h3 className="font-headline font-bold text-on-error-container text-sm">SEO Alert</h3>
                                    <p className="text-xs text-on-error-container/80 mt-1">Optimization required for site health.</p>
                                </div>
                            </div>
                            <div className="bg-white/50 rounded-xl p-4 mb-4">
                                <p className="text-xs font-medium text-on-background">Missing meta descriptions detected on <span className="font-bold">3 pages</span>.</p>
                                <div className="mt-2 space-y-1">
                                    <p className="text-[10px] text-slate-500 truncate">/reviews/magnesium-glycinate</p>
                                    <p className="text-[10px] text-slate-500 truncate">/guides/stress-management</p>
                                </div>
                            </div>
                            <button className="w-full py-2.5 bg-error text-white text-xs font-bold rounded-lg hover:scale-[1.02] active:scale-[0.98] transition-transform">Fix Issues Now</button>
                        </div>

                        {/* Review Status Card */}
                        <div className="bg-primary-container text-white rounded-2xl p-6 shadow-atmospheric overflow-hidden relative">
                            <div className="absolute -right-4 -bottom-4 opacity-20">
                                <span className="material-symbols-outlined text-8xl" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                            </div>
                            <h3 className="font-headline font-bold text-lg mb-2">Review Status</h3>
                            <p className="text-xs text-on-primary-container/90 mb-6 leading-relaxed">4 posts are currently waiting for medical board verification before publishing.</p>
                            <button className="px-4 py-2.5 bg-white text-primary text-xs font-bold rounded-lg hover:bg-slate-100 transition-colors">Start Verification</button>
                        </div>

                        {/* Active Learning Path Card */}
                        <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-atmospheric">
                            <div className="text-[11px] font-black text-primary uppercase tracking-widest mb-2">Active Path</div>
                            <div className="flex items-center justify-between mb-1">
                                <h3 className="font-headline text-md font-extrabold tracking-tight">Microsoft Engineer</h3>
                                <span className="bg-[#e8f1fb] text-primary text-[11px] font-bold px-2.5 py-1 rounded-full">Path 01</span>
                            </div>
                            <p className="text-[12px] text-slate-400 mb-8">4 courses · Est. 14 weeks · MCSA prep</p>

                            <div className="space-y-0">
                                {[
                                    { label: "Windows Fundamentals", status: "done", time: "22 hrs" },
                                    { label: "Windows Server Admin", status: "active", time: "50% done" },
                                    { label: "Active Directory Mastery", status: "todo", time: "20 hrs" },
                                    { label: "Microsoft 365 Admin", status: "todo", time: "18 hrs" },
                                ].map((step, i, arr) => (
                                    <React.Fragment key={i}>
                                        <div className="flex items-center gap-4">
                                            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[12px] font-black border-2 transition-colors ${step.status === 'done' ? 'bg-primary border-primary text-white' : step.status === 'active' ? 'bg-[#e8f1fb] border-primary text-primary' : 'bg-surface-container-low border-slate-300 text-slate-500'}`}>
                                                {step.status === 'done' ? <span className="material-symbols-outlined text-sm font-bold">check</span> : i + 1}
                                            </div>
                                            <div className="flex-1">
                                                <div className={`text-[13px] font-bold ${step.status === 'todo' ? 'text-slate-400' : 'text-on-background'}`}>{step.label}</div>
                                                <div className="text-[11px] text-slate-400">{step.time}</div>
                                            </div>
                                            {step.status === 'done' && <span className="material-symbols-outlined text-primary text-lg font-bold">check_circle</span>}
                                        </div>
                                        {i < arr.length - 1 && (
                                            <div className={`w-0.5 h-6 ml-3.5 my-1 ${step.status === 'done' ? 'bg-primary' : 'bg-slate-200'}`} />
                                        )}
                                    </React.Fragment>
                                ))}
                            </div>

                            <div className="mt-8 pt-6 border-t border-slate-100">
                                <div className="flex justify-between text-[12px] font-bold mb-2">
                                    <span className="text-slate-400">Overall Progress</span>
                                    <span className="text-primary">37%</span>
                                </div>
                                <div className="h-1.5 bg-surface-container-low rounded-full overflow-hidden">
                                    <div className="h-full bg-gradient-to-r from-primary to-primary-container" style={{ width: '37%' }} />
                                </div>
                            </div>
                        </div>

                        {/* Due Soon / Labs Card */}
                        <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-atmospheric">
                            <div className="text-[11px] font-black text-primary uppercase tracking-widest mb-2">Due Soon</div>
                            <h3 className="font-headline text-md font-extrabold tracking-tight mb-1">Labs & Exams</h3>
                            <p className="text-[12px] text-slate-400 mb-6">Stay on track with your certification goals</p>

                            <div className="space-y-3">
                                {[
                                    { title: "DHCP Server Configuration", due: "2 days", tag: "Due Soon", tagColor: "bg-red-50 text-red-600", icon: "dns", color: "from-[#0078d4] to-[#005a9e]" },
                                    { title: "Subnetting Practice Exam", due: "5 days", tag: "New", tagColor: "bg-blue-50 text-blue-600", icon: "lan", color: "from-[#1ba1e2] to-[#0050ef]" },
                                    { title: "Bash Scripting Challenge", due: "Open", tag: "High Priority", tagColor: "bg-orange-50 text-orange-600", icon: "terminal", color: "from-[#e95420] to-[#772953]" },
                                    { title: "Azure Storage Explorer Lab", due: "1 week", tag: "Upcoming", tagColor: "bg-gray-100 text-gray-600", icon: "cloud", color: "from-[#0089d6] to-[#00bcf2]" },
                                ].map((lab, i) => (
                                    <div key={i} className="flex items-center gap-4 p-3 rounded-xl bg-surface-container-low hover:bg-surface-container-high transition-colors cursor-pointer group">
                                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${lab.color} flex items-center justify-center text-white shrink-0`}>
                                            <span className="material-symbols-outlined">{lab.icon}</span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="text-[13px] font-bold text-on-background truncate group-hover:text-primary transition-colors">{lab.title}</div>
                                            <div className="text-[11px] text-slate-400 mt-0.5">Due in {lab.due}</div>
                                        </div>
                                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-tighter ${lab.tagColor}`}>{lab.tag}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Live Activity */}
                        <div className="bg-surface-container-low rounded-2xl p-6 shadow-sm">
                            <h3 className="font-headline font-bold text-on-background text-sm mb-4">Live Activity</h3>
                            <div className="space-y-4">
                                <div className="flex gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-secondary mt-1.5"></div>
                                    <p className="text-[11px] text-on-surface-variant font-body">
                                        <span className="font-bold text-on-background">Dr. Aris Thorne</span> verified "Vitamin D Guide"
                                    </p>
                                </div>
                                <div className="flex gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5"></div>
                                    <p className="text-[11px] text-on-surface-variant font-body">
                                        <span className="font-bold text-on-background">System</span> generated SEO report
                                    </p>
                                </div>
                                <div className="flex gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-slate-300 mt-1.5"></div>
                                    <p className="text-[11px] text-on-surface-variant font-body">
                                        <span className="font-bold text-on-background">New Affiliate</span> conversion from Amazon
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* BottomNavBar (Mobile) */}
            <nav className="fixed bottom-0 w-full z-50 rounded-t-2xl md:hidden bg-white/90 dark:bg-slate-900/90 backdrop-blur-md shadow-[0_-4px_20px_rgba(0,0,0,0.05)] border-t border-slate-100 dark:border-slate-800">
                <div className="flex justify-around items-center h-16 px-4">
                    <button onClick={() => navigate("/courses")} className="flex flex-col items-center gap-1 text-slate-400 dark:text-slate-600 font-headline text-[10px] font-semibold active:scale-95 transition-all">
                        <span className="material-symbols-outlined">verified</span>
                        <span>Reviews</span>
                    </button>
                    <button onClick={() => navigate("/courses")} className="flex flex-col items-center gap-1 text-slate-400 dark:text-slate-600 font-headline text-[10px] font-semibold active:scale-95 transition-all">
                        <span className="material-symbols-outlined">star</span>
                        <span>Top Picks</span>
                    </button>
                    <button onClick={() => navigate("/blog")} className="flex flex-col items-center gap-1 text-slate-400 dark:text-slate-600 font-headline text-[10px] font-semibold active:scale-95 transition-all">
                        <span className="material-symbols-outlined">menu_book</span>
                        <span>Guides</span>
                    </button>
                    <button onClick={() => navigate("/profile")} className="flex flex-col items-center gap-1 text-slate-400 dark:text-slate-600 font-headline text-[10px] font-semibold active:scale-95 transition-all">
                        <span className="material-symbols-outlined">account_circle</span>
                        <span>Profile</span>
                    </button>
                </div>
            </nav>
        </div>
    );
}

export default StudentDashboardPage;
