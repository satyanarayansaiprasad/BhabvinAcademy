import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
    Search, 
    Play, 
    ArrowRight, 
    Mail, 
    Calendar, 
    Clock, 
    Tag, 
    ChevronRight, 
    Quote,
    Filter,
    ArrowUpRight,
    Youtube,
    TrendingUp
} from "lucide-react";
import { Link } from "react-router-dom";

function BlogPage() {
    const [activeTab, setActiveTab] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");

    const reveal = {
        initial: { opacity: 0, y: 30 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true },
        transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
    };

    const categories = [
        { id: "all", label: "All", emoji: "🗂️" },
        { id: "microsoft", label: "Microsoft", emoji: "🪟" },
        { id: "linux", label: "Linux", emoji: "🐧" },
        { id: "cloud", label: "Cloud", emoji: "☁️" },
        { id: "security", label: "Security", emoji: "🔒" },
        { id: "career", label: "Career", emoji: "🎯" },
        { id: "networking", label: "Networking", emoji: "🌐" },
    ];

    const posts = [
        {
            id: 1,
            title: "Azure AZ-104 in 60 Days: The Study Plan That Actually Works",
            excerpt: "Stop reading every book cover to cover. Here's the focused, exam-aligned 60-day plan that took dozens of BhavinAcademy students from zero to certified — with time to spare.",
            category: "cloud",
            tag: "Cloud",
            emoji: "☁️",
            date: "Mar 28, 2026",
            readTime: "8 min read",
            author: "Bhavin Khatri",
            featured: true,
            color: "from-[#0a1628] to-[#1e3a5f]"
        },
        {
            id: 2,
            title: "Active Directory in 2026: What's Changed and What Still Matters",
            excerpt: "A practical breakdown of what's new in AD, what deprecated features you can stop worrying about, and what fundamentals never go out of style.",
            category: "microsoft",
            tag: "Microsoft",
            emoji: "🪟",
            date: "Mar 22, 2026",
            readTime: "6 min read",
            color: "from-[#0a1628] to-[#1a3060]"
        },
        {
            id: 3,
            title: "Bash Scripting for Beginners: Automate Your Way to Sysadmin Zen",
            excerpt: "You don't need to be a developer to write powerful shell scripts. This beginner-friendly guide walks you from 'Hello World' to real automation tasks.",
            category: "linux",
            tag: "Linux",
            emoji: "🐧",
            date: "Mar 18, 2026",
            readTime: "10 min read",
            color: "from-[#1a1a0a] to-[#3a3010]"
        },
        {
            id: 4,
            title: "CompTIA Security+: 10 Exam Tips Nobody Tells You",
            excerpt: "Beyond the study guide — the practical strategies, question-reading tricks, and mindset shifts that separate passing scores from failing ones.",
            category: "security",
            tag: "Security",
            emoji: "🔒",
            date: "Mar 14, 2026",
            readTime: "7 min read",
            color: "from-[#0a1a0a] to-[#0f3020]"
        },
        {
            id: 5,
            title: "Subnetting Explained: Finally Make It Click in Under 30 Minutes",
            excerpt: "Stop memorising subnet tables and start understanding the logic. This visual walkthrough will make subnetting intuitive for CCNA and beyond.",
            category: "networking",
            tag: "Networking",
            emoji: "🌐",
            date: "Mar 9, 2026",
            readTime: "9 min read",
            color: "from-[#0a1a28] to-[#103050]"
        },
        {
            id: 6,
            title: "IT Career Roadmap 2026: Which Certifications Pay the Most?",
            excerpt: "A data-driven look at which IT certifications are commanding the highest salaries right now — and which paths have the best ROI.",
            category: "career",
            tag: "Career",
            emoji: "🎯",
            date: "Mar 5, 2026",
            readTime: "11 min read",
            color: "from-[#0a0a1a] to-[#181850]"
        }
    ];

    const popularPosts = [
        { id: 1, title: "Azure AZ-104 in 60 Days: The Study Plan That Actually Works", category: "Cloud", readTime: "8 min read", emoji: "☁️" },
        { id: 2, title: "IT Career Roadmap 2026: Which Certifications Pay the Most?", category: "Career", readTime: "11 min read", emoji: "🎯" },
        { id: 3, title: "Subnetting Explained: Finally Make It Click in Under 30 Minutes", category: "Networking", readTime: "9 min read", emoji: "🌐" },
        { id: 4, title: "CompTIA Security+: 10 Exam Tips Nobody Tells You", category: "Security", readTime: "7 min read", emoji: "🔒" }
    ];

    const filteredPosts = posts.filter(post => {
        const matchesCategory = activeTab === "all" || post.category === activeTab;
        const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const featuredPost = posts.find(p => p.featured);

    return (
        <div className="min-h-screen bg-white font-['Inter'] selection:bg-[#0071e3]/20">
            {/* ─── PAGE HERO ───────────────────────────────────────── */}
            <section className="bg-[linear-gradient(160deg,#000_0%,#1a1a2e_55%,#000_100%)] p-[120px_24px_100px] relative overflow-hidden text-center">
                <div className="absolute w-[600px] h-[400px] rounded-full bg-[radial-gradient(circle,rgba(0,113,227,0.22)_0%,transparent_70%)] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none blur-[60px]" />
                <motion.div 
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                    className="relative z-10"
                >
                    <p className="text-[12px] font-black text-[#0071e3] uppercase tracking-[0.3em] mb-6">The BhavinAcademy Editorial</p>
                    <h1 className="text-[clamp(40px,7vw,84px)] font-black text-[#f5f5f7] leading-[0.95] tracking-[-3px] mb-8">
                        IT Insights.<br /><span className="bg-[linear-gradient(90deg,#0071e3,#00d4ff)] bg-clip-text text-transparent italic">Field-Tested Logic.</span>
                    </h1>
                    <p className="text-[18px] text-[#86868b] leading-[1.6] max-w-[600px] mx-auto font-light">
                        Tutorials, exam strategies, and technical deep-dives written by practitioners, for practitioners. No fluff, just technical clarity.
                    </p>
                </motion.div>
            </section>

            {/* ─── SEARCH + FILTERS ─────────────────────────────────── */}
            <div className="sticky top-[52px] z-[90] bg-white/80 backdrop-blur-xl border-b border-[#000]/[0.08] py-4 px-6 shadow-sm">
                <div className="max-w-[1080px] mx-auto flex flex-wrap items-center justify-between gap-6">
                    <div className="relative flex-1 min-w-[240px] max-w-[340px]">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#86868b]" />
                        <input 
                            type="text"
                            placeholder="Enter keyword to search..."
                            className="w-full pl-11 pr-4 h-11 bg-[#f5f5f7] border border-[#d2d2d7]/60 rounded-2xl text-[13px] font-medium outline-none focus:bg-white focus:border-[#0071e3] focus:ring-4 focus:ring-[#0071e3]/5 transition-all"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    
                    <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar items-center">
                        <Filter className="w-4 h-4 text-[#86868b] mr-2" />
                        {categories.map(cat => (
                            <button
                                key={cat.id}
                                onClick={() => setActiveTab(cat.id)}
                                className={`h-9 px-5 rounded-full text-[12px] font-black uppercase tracking-wider whitespace-nowrap border transition-all ${activeTab === cat.id ? 'bg-[#0071e3] border-[#0071e3] text-white shadow-lg shadow-blue-500/20' : 'bg-white border-[#d2d2d7] text-[#6e6e73] hover:border-[#0071e3] hover:text-[#0071e3]'}`}
                            >
                                {cat.label}
                            </button>
                        ))}
                    </div>
                    
                    <div className="text-[12px] font-black text-[#86868b] uppercase tracking-widest hidden lg:block opacity-40">
                        {filteredPosts.length} Results Found
                    </div>
                </div>
            </div>

            {/* ─── MAIN CONTENT ─────────────────────────────────────── */}
            <main className="bg-[#f5f5f7] py-20 px-6">
                <div className="max-w-[1080px] mx-auto grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-12 items-start text-left">
                    
                    {/* LEFT COLUMN: ARTICLES */}
                    <div className="space-y-16">
                        {/* FEATURED POST */}
                        {featuredPost && activeTab === 'all' && (
                            <motion.div {...reveal}>
                                <div className="text-[11px] font-black text-[#0071e3] uppercase tracking-[0.4em] mb-6 flex items-center gap-4">
                                    Featured Intelligence <div className="h-[1px] flex-1 bg-[#000]/[0.05]" />
                                </div>
                                <div className="bg-black rounded-[40px] overflow-hidden grid grid-cols-1 md:grid-cols-2 group cursor-pointer shadow-2xl hover:-translate-y-2 transition-all duration-500">
                                    <div className={`relative bg-gradient-to-br ${featuredPost.color} flex items-center justify-center min-h-[360px]`}>
                                        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        <span className="text-[120px] group-hover:scale-110 transition-transform duration-700 select-none filter drop-shadow-[0_0_30px_rgba(255,255,255,0.1)]">{featuredPost.emoji}</span>
                                    </div>
                                    <div className="p-12 flex flex-col justify-between">
                                        <div>
                                            <div className="inline-flex items-center gap-2 bg-[#0071e3]/20 border border-[#0071e3]/30 text-[#40a9ff] px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.1em] mb-6">
                                                <TrendingUp size={12} /> {featuredPost.tag}
                                            </div>
                                            <h2 className="text-[clamp(24px,3vw,34px)] font-black text-[#f5f5f7] leading-[1.1] mb-6 group-hover:text-[#0071e3] transition-colors tracking-tight">{featuredPost.title}</h2>
                                            <p className="text-[15px] text-[#86868b] leading-[1.7] mb-8 font-light line-clamp-3">{featuredPost.excerpt}</p>
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-4 text-[13px] text-[#86868b]">
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0071e3] to-[#00d4ff] flex items-center justify-center text-white font-black text-[12px] shadow-lg shadow-blue-500/20">BK</div>
                                                <div>
                                                    <div className="text-white font-bold leading-none mb-1">{featuredPost.author}</div>
                                                    <div className="text-[11px] opacity-60 font-medium uppercase tracking-wider">{featuredPost.date} · {featuredPost.readTime}</div>
                                                </div>
                                            </div>
                                            <button className="flex items-center gap-2 text-[13px] font-black text-[#0071e3] mt-10 uppercase tracking-widest group/btn">
                                                Read Intelligence <ArrowUpRight className="w-4 h-4 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* ARTICLES GRID */}
                        <div className="text-left">
                            <div className="text-[11px] font-black text-[#0071e3] uppercase tracking-[0.4em] mb-8 flex items-center gap-4">
                                Latest Technical Nodes <div className="h-[1px] flex-1 bg-[#000]/[0.05]" />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                                {filteredPosts.filter(p => !p.featured || activeTab !== 'all').map(post => (
                                    <motion.div key={post.id} {...reveal} className="bg-white rounded-[32px] overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.04)] hover:shadow-[0_24px_48px_rgba(0,0,0,0.1)] hover:-translate-y-2 transition-all duration-500 group cursor-pointer border border-[#000]/[0.04]">
                                        <div className={`h-48 relative bg-gradient-to-br ${post.color} flex items-center justify-center overflow-hidden`}>
                                            <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-10 transition-opacity" />
                                            <span className="text-6xl group-hover:scale-110 transition-transform duration-700 relative z-10 select-none">{post.emoji}</span>
                                            <span className="absolute top-4 left-4 bg-black/60 backdrop-blur-xl px-3 py-1.5 rounded-full text-[10px] text-white/90 font-black uppercase tracking-widest border border-white/10">{post.tag}</span>
                                        </div>
                                        <div className="p-8">
                                            <h3 className="text-[18px] font-black text-[#1d1d1f] mb-4 leading-[1.35] group-hover:text-[#0071e3] transition-colors line-clamp-2 tracking-tight">{post.title}</h3>
                                            <p className="text-[14px] text-[#6e6e73] leading-[1.7] mb-8 line-clamp-2 font-light">{post.excerpt}</p>
                                            <div className="flex items-center justify-between pt-6 border-t border-[#f5f5f7] text-[11px] text-[#86868b] font-black uppercase tracking-widest">
                                                <div className="flex items-center gap-2 opacity-60"><Calendar className="w-3.5 h-3.5" /> {post.date}</div>
                                                <div className="flex items-center gap-2 opacity-60"><Clock className="w-3.5 h-3.5" /> {post.readTime}</div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                            <div className="mt-20 text-center">
                                <button className="h-14 px-12 bg-white border border-[#d2d2d7] rounded-full text-[14px] font-black text-[#1d1d1f] uppercase tracking-[0.2em] hover:border-[#0071e3] hover:text-[#0071e3] hover:shadow-xl hover:shadow-[#0071e3]/5 hover:-translate-y-1 transition-all active:scale-95">Load More Intelligence</button>
                            </div>
                        </div>
                    </div>

                    {/* ─── SIDEBAR ─────────────────────────────────────────── */}
                    <aside className="sticky top-[110px] space-y-8 text-left">
                        {/* NEWSLETTER */}
                        <div className="bg-black rounded-[32px] p-10 text-white relative overflow-hidden group shadow-2xl">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-[#0071e3] blur-[60px] opacity-20 -translate-y-1/2 translate-x-1/2" />
                            <h3 className="text-[16px] font-black mb-4 flex items-center gap-2 uppercase tracking-wide">Protocol: Updates <Mail className="w-4 h-4 text-[#0071e3]" /></h3>
                            <p className="text-[13px] text-[#86868b] leading-[1.6] mb-8 font-light">Get field-tested IT strategies and exam insights delivered once a week. Zero noise protocol.</p>
                            <div className="space-y-4">
                                <input 
                                    type="email" 
                                    placeholder="Enter terminal email..."
                                    className="w-full bg-white/[0.03] border border-white/[0.08] rounded-2xl px-5 py-4 text-[13px] outline-none focus:border-[#0071e3] focus:bg-white/[0.05] transition-all font-medium"
                                />
                                <button className="w-full h-14 bg-[#0071e3] rounded-2xl text-[13px] font-black uppercase tracking-[0.2em] hover:bg-[#0077ed] transition-all active:scale-95 shadow-xl shadow-[#0071e3]/20">Subscribe Now</button>
                            </div>
                        </div>

                        {/* MOST READ (Ranked) */}
                        <div className="bg-white rounded-[32px] p-8 border border-[#000]/[0.05] shadow-sm">
                            <h3 className="text-[14px] font-black mb-8 uppercase tracking-[0.2em] flex items-center gap-2"><TrendingUp size={16} className="text-[#0071e3]" /> High-Velocity</h3>
                            <div className="space-y-8">
                                {popularPosts.map((post, i) => (
                                    <div key={post.id} className="flex gap-5 group cursor-pointer relative items-start">
                                        <span className="text-[28px] font-black text-[#000]/[0.05] leading-none select-none tracking-tighter group-hover:text-[#0071e3]/20 transition-colors">0{i+1}</span>
                                        <div>
                                            <h4 className="text-[13.5px] font-black text-[#1d1d1f] leading-[1.4] group-hover:text-[#0071e3] transition-colors tracking-tight line-clamp-2">{post.title}</h4>
                                            <div className="text-[11px] text-[#86868b] mt-2 flex items-center gap-2 font-black uppercase tracking-wider opacity-60">{post.emoji} {post.category} · {post.readTime}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* TOPICS CLOUD */}
                        <div className="bg-white rounded-[32px] p-8 border border-[#000]/[0.05] shadow-sm">
                            <h3 className="text-[14px] font-black mb-6 uppercase tracking-[0.2em]">Pillars</h3>
                            <div className="flex flex-wrap gap-2">
                                {categories.slice(1).map(cat => (
                                    <button key={cat.id} className="px-4 py-2 bg-[#f5f5f7] border border-transparent rounded-xl text-[11px] font-black uppercase tracking-widest text-[#1d1d1f] hover:border-[#0071e3] hover:text-[#0071e3] hover:bg-white transition-all">
                                        {cat.label}
                                    </button>
                                ))}
                                <button className="px-4 py-2 bg-[#f5f5f7] border border-transparent rounded-xl text-[11px] font-black uppercase tracking-widest text-[#1d1d1f] hover:border-[#0071e3] hover:text-[#0071e3] hover:bg-white transition-all">DEVOPS</button>
                                <button className="px-4 py-2 bg-[#f5f5f7] border border-transparent rounded-xl text-[11px] font-black uppercase tracking-widest text-[#1d1d1f] hover:border-[#0071e3] hover:text-[#0071e3] hover:bg-white transition-all">AUTOMATION</button>
                            </div>
                        </div>

                        {/* LATEST VIDEO NODE */}
                        <div className="bg-white rounded-[32px] p-8 border border-[#000]/[0.05] shadow-sm group">
                            <h3 className="text-[14px] font-black mb-6 uppercase tracking-[0.2em] flex items-center gap-2"><Youtube size={16} className="text-[#ff0000]" /> Intelligence Reel</h3>
                            <div className="aspect-video bg-black rounded-2xl overflow-hidden relative cursor-pointer mb-5 shadow-inner">
                                <div className="absolute inset-0 bg-gradient-to-br from-[#0a1628] to-[#1e3a5f] flex items-center justify-center">
                                    <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center group-hover:scale-110 group-hover:bg-white/20 transition-all duration-500 shadow-2xl">
                                        <Play className="w-6 h-6 text-white fill-current" />
                                    </div>
                                </div>
                                <div className="absolute bottom-4 right-4 h-6 px-2 bg-black/60 backdrop-blur-md rounded-md text-[10px] text-white flex items-center font-black">22:45</div>
                            </div>
                            <h4 className="text-[14px] font-black leading-tight tracking-tight group-hover:text-[#0071e3] transition-colors">How I blueprint AZ-104 study clusters for first-attempt success.</h4>
                            <div className="text-[10px] text-[#86868b] mt-3 font-black uppercase tracking-[0.1em]">☁️ Cloud Architecture · 14k Views</div>
                        </div>
                    </aside>
                </div>
            </main>

            {/* ─── QUOTE SECTION ───────────────────────────────────── */}
            <section className="bg-black py-32 px-6 text-center border-t border-white/[0.05] relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#0071e3]/30 to-transparent" />
                <div className="max-w-[800px] mx-auto relative z-10">
                    <Quote className="w-16 h-16 text-[#0071e3]/10 mx-auto mb-10" />
                    <p className="text-[clamp(24px,3vw,38px)] font-light text-[#f5f5f7] leading-[1.6] mb-12 tracking-tight">
                        "While technology shifts with every decade, your value remains constant through two rules: <strong className="font-black text-white">Master the fundamentals</strong>, as they are timeless; and <strong className="font-black text-white">keep learning</strong>, for the world never stops turning."
                    </p>
                    <div className="inline-flex items-center gap-4">
                        <div className="h-[1px] w-12 bg-white/[0.1]" />
                        <div className="text-[12px] text-[#86868b] font-black uppercase tracking-[0.4em]">Bhavin Khatri</div>
                        <div className="h-[1px] w-12 bg-white/[0.1]" />
                    </div>
                </div>
            </section>

            {/* ─── CTA ──────────────────────────────────────────────── */}
            <section className="bg-[#0071e3] py-24 px-6 text-center text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white opacity-5 rounded-full -translate-y-1/2 translate-x-1/2 blur-[100px]" />
                <h2 className="text-[clamp(32px,5vw,56px)] font-black tracking-tighter mb-6">Transition from Analysis to Mastery.</h2>
                <p className="text-[18px] text-white/70 font-light mb-12 max-w-[500px] mx-auto">Turn intellectual insights into production-grade skills with our deep-dive lab clusters.</p>
                <Link to="/courses" className="inline-flex items-center h-16 px-12 bg-white text-[#0071e3] rounded-full text-[15px] font-black uppercase tracking-[0.2em] hover:bg-white/90 hover:scale-105 transition-all shadow-2xl active:scale-95 group">
                    Explore Repositories <ArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
            </section>
        </div>
    );
}

export default BlogPage;
