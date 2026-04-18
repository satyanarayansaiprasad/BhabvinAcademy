import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
    ChevronLeft, 
    Save, 
    Eye, 
    Send, 
    Image as ImageIcon, 
    Type, 
    Link as LinkIcon, 
    List, 
    MoreHorizontal,
    Bold,
    Italic,
    Underline,
    Code,
    Quote,
    AlignLeft,
    AlignCenter,
    CheckCircle2,
    Calendar,
    Tag,
    Share2,
    Settings,
    Layout,
    ArrowUpRight,
    Search,
    X,
    Maximize2,
    Check
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

function BlogEditPage() {
    const navigate = useNavigate();
    const [title, setTitle] = useState("Azure AZ-104 in 60 Days: The Study Plan That Actually Works");
    const [slug, setSlug] = useState("azure-az-104-60-day-study-plan");
    const [excerpt, setExcerpt] = useState("Stop reading every book cover to cover. Here's the focused, exam-aligned 60-day plan that took dozens of BhavinAcademy students from zero to certified — with time to spare.");
    const [content, setContent] = useState("");
    const [status, setStatus] = useState("draft");
    const [isSaving, setIsSaving] = useState(false);
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    const [coverImage, setCoverImage] = useState(null);
    const [focusMode, setFocusMode] = useState(false);
    const [tags, setTags] = useState(["AZ-104", "Azure", "Certification"]);
    const [newTag, setNewTag] = useState("");

    // Simulate auto-save
    useEffect(() => {
        if (hasUnsavedChanges) {
            const timer = setTimeout(() => {
                handleSave();
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [hasUnsavedChanges]);

    const handleSave = () => {
        setIsSaving(true);
        setTimeout(() => {
            setIsSaving(false);
            setHasUnsavedChanges(false);
        }, 800);
    };

    const handleTitleChange = (e) => {
        setTitle(e.target.value);
        setHasUnsavedChanges(true);
        // Auto-generate slug
        setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-'));
    };

    const addTag = (e) => {
        if (e.key === 'Enter' && newTag.trim()) {
            if (!tags.includes(newTag.trim())) {
                setTags([...tags, newTag.trim()]);
            }
            setNewTag("");
            setHasUnsavedChanges(true);
        }
    };

    const removeTag = (tagToRemove) => {
        setTags(tags.filter(t => t !== tagToRemove));
        setHasUnsavedChanges(true);
    };

    const triggerImageUpload = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                setCoverImage(URL.createObjectURL(file));
                setHasUnsavedChanges(true);
            }
        };
        input.click();
    };

    return (
        <div className="min-h-screen bg-[#f5f5f7] font-['Inter'] selection:bg-[#0071e3]/20">
            {/* ─── NAV ─────────────────────────────────────────────── */}
            <nav className="sticky top-0 z-[100] h-[52px] bg-white/80 backdrop-blur-xl border-b border-[#000]/[0.08] flex items-center px-6">
                <div className="max-w-[1400px] w-full mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link to="/" className="text-[17px] font-black tracking-tighter">Bhvin<span className="text-[#0071e3]">Academy.</span></Link>
                        <div className="h-4 w-[1px] bg-[#000]/[0.1]" />
                        <div className="flex items-center gap-2 text-[12px] font-bold text-[#86868b]">
                            <Link to="/instructor" className="hover:text-[#0071e3] transition-colors">Dashboard</Link>
                            <span className="opacity-30">/</span>
                            <Link to="/instructor/blogs" className="hover:text-[#0071e3] transition-colors">Blog Posts</Link>
                            <span className="opacity-30">/</span>
                            <span className="text-[#1d1d1f]">Edit Post</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <AnimatePresence>
                            {hasUnsavedChanges ? (
                                <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="flex items-center gap-2 text-[12px] font-bold text-[#ff9f0a] bg-[#ff9f0a]/10 px-3 py-1.5 rounded-full border border-[#ff9f0a]/20">
                                    <div className="w-1.5 h-1.5 rounded-full bg-[#ff9f0a] animate-pulse" />
                                    Unsaved Changes
                                </motion.div>
                            ) : (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 text-[12px] font-bold text-[#30d158]">
                                    <CheckCircle2 size={14} />
                                    Saved just now
                                </motion.div>
                            )}
                        </AnimatePresence>
                        <button onClick={() => setFocusMode(!focusMode)} className="h-9 px-4 rounded-xl border border-[#d2d2d7] text-[12px] font-black uppercase tracking-widest text-[#1d1d1f] hover:border-[#0071e3] hover:text-[#0071e3] transition-all flex items-center gap-2">
                            {focusMode ? <Maximize2 size={14} /> : <Layout size={14} />} 
                            {focusMode ? "Exit Focus" : "Focus Mode"}
                        </button>
                        <button className="h-9 px-4 rounded-xl border border-[#0071e3]/30 text-[12px] font-black uppercase tracking-widest text-[#0071e3] hover:bg-[#0071e3]/5 transition-all flex items-center gap-2">
                             <Eye size={14} /> Preview
                        </button>
                        <button onClick={() => setStatus('published')} className="h-9 px-6 rounded-xl bg-[#0071e3] text-white font-black text-[12px] uppercase tracking-widest hover:bg-[#0077ed] transition-all shadow-lg shadow-[#0071e3]/20 flex items-center gap-2">
                             <Send size={14} /> Publish
                        </button>
                    </div>
                </div>
            </nav>

            <div className={`max-w-[1400px] mx-auto py-10 px-6 grid transition-all duration-500 gap-8 ${focusMode ? 'grid-cols-1 max-w-[900px]' : 'grid-cols-1 lg:grid-cols-[1fr_320px]'}`}>
                
                {/* ─── MAIN EDITOR COLUMN ──────────────────────────────── */}
                <div className="space-y-6">
                    
                    {/* COVER UPLOAD */}
                    <div 
                        onClick={triggerImageUpload}
                        className={`relative group h-[280px] rounded-[32px] border-2 border-dashed transition-all duration-300 flex flex-col items-center justify-center cursor-pointer overflow-hidden ${coverImage ? 'border-transparent' : 'border-[#d2d2d7] hover:border-[#0071e3] hover:bg-[#0071e3]/[0.02]'}`}
                    >
                        {coverImage ? (
                            <>
                                <img src={coverImage} alt="Cover" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 backdrop-blur-sm">
                                    <button className="h-10 px-6 rounded-full bg-white text-black font-black text-[11px] uppercase tracking-widest hover:bg-[#f5f5f7] transition-all">Replace Logic</button>
                                    <button onClick={(e) => { e.stopPropagation(); setCoverImage(null); }} className="h-10 px-6 rounded-full bg-red-500 text-white font-black text-[11px] uppercase tracking-widest hover:bg-red-600 transition-all">Remove Node</button>
                                </div>
                            </>
                        ) : (
                            <div className="text-center group-hover:translate-y-[-4px] transition-transform">
                                <div className="w-16 h-16 rounded-3xl bg-[#f5f5f7] border border-[#d2d2d7] flex items-center justify-center mx-auto mb-4 group-hover:border-[#0071e3] group-hover:bg-white transition-all">
                                    <ImageIcon size={24} className="text-[#86868b] group-hover:text-[#0071e3] transition-colors" />
                                </div>
                                <h3 className="text-[15px] font-black text-[#1d1d1f] mb-1">Upload Editorial Cover</h3>
                                <p className="text-[12px] text-[#86868b] font-medium tracking-tight">Recommended: 1200 x 630px · Alpha PNG/JPG Only</p>
                            </div>
                        )}
                    </div>

                    {/* META CARD */}
                    <div className="bg-white rounded-[32px] p-10 shadow-sm border border-[#000]/[0.03]">
                        <textarea 
                            value={title}
                            onChange={handleTitleChange}
                            placeholder="Primary Intel Headline..."
                            className="w-full text-[42px] font-black text-[#1d1d1f] placeholder-[#d2d2d7] leading-[1.1] tracking-tight bg-transparent border-none outline-none resize-none mb-8 scrollbar-hide h-auto"
                            rows={1}
                            onInput={(e) => { e.target.style.height = 'auto'; e.target.style.height = e.target.scrollHeight + 'px'; }}
                        />
                        
                        <div className="space-y-6 pt-10 border-t border-[#f5f5f7]">
                            <div className="grid grid-cols-1 md:grid-cols-[100px_1fr] items-center gap-4">
                                <label className="text-[11px] font-black text-[#86868b] uppercase tracking-[0.2em]">Asset Slug</label>
                                <div className="flex items-center gap-2 text-[13px] font-medium text-[#86868b] bg-[#f5f5f7] px-4 py-3 rounded-2xl border border-[#000]/[0.03]">
                                    <span className="opacity-40">bhavinacademy.com/blog/</span>
                                    <input 
                                        value={slug}
                                        onChange={(e) => { setSlug(e.target.value); setHasUnsavedChanges(true); }}
                                        className="bg-transparent border-none outline-none text-[#0071e3] font-bold flex-1"
                                    />
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-[100px_1fr] items-start gap-4">
                                <label className="text-[11px] font-black text-[#86868b] uppercase tracking-[0.2em] mt-3">Excerpt</label>
                                <div className="relative">
                                    <textarea 
                                        value={excerpt}
                                        onChange={(e) => { setExcerpt(e.target.value); setHasUnsavedChanges(true); }}
                                        placeholder="Brief intellectual summary for listing grids..."
                                        className="w-full bg-[#f5f5f7] border border-[#000]/[0.03] rounded-2xl p-5 text-[14px] leading-relaxed font-light outline-none focus:bg-white focus:border-[#0071e3]/30 transition-all resize-none min-h-[100px]"
                                    />
                                    <div className="absolute bottom-4 right-4 text-[10px] font-black text-[#86868b] tracking-widest opacity-40">{excerpt.length}/160</div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="grid grid-cols-1 md:grid-cols-[100px_1fr] items-center gap-4">
                                    <label className="text-[11px] font-black text-[#86868b] uppercase tracking-[0.2em]">Author</label>
                                    <select className="bg-[#f5f5f7] border border-[#000]/[0.03] rounded-2xl px-4 py-3 text-[13px] font-bold outline-none cursor-pointer hover:border-[#0071e3]/30 transition-all">
                                        <option>Bhavin Khatri</option>
                                        <option>Guest Architect</option>
                                        <option>Technical Advisor</option>
                                    </select>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-[100px_1fr] items-center gap-4">
                                    <label className="text-[11px] font-black text-[#86868b] uppercase tracking-[0.2em]">Read Time</label>
                                    <input value="8 min read" className="bg-[#f5f5f7] border border-[#000]/[0.03] rounded-2xl px-4 py-3 text-[13px] font-bold outline-none" readOnly />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RICH TEXT EDITOR */}
                    <div className="bg-white rounded-[32px] overflow-hidden shadow-sm border border-[#000]/[0.03]">
                        {/* TOOLBAR */}
                        <div className="h-14 border-b border-[#f5f5f7] flex items-center px-6 gap-2 bg-white sticky top-[52px] z-[80]">
                            <div className="flex items-center gap-1.5 pr-4 border-r border-[#f5f5f7]">
                                <select className="text-[12px] font-black uppercase tracking-widest outline-none bg-transparent cursor-pointer">
                                    <option>Paragraph</option>
                                    <option>Heading 2</option>
                                    <option>Heading 3</option>
                                    <option>Code Block</option>
                                </select>
                            </div>
                            <div className="flex items-center gap-1">
                                <button className="w-8 h-8 rounded-lg flex items-center justify-center text-[#444] hover:bg-[#f5f5f7] hover:text-black transition-all"><Bold size={16} /></button>
                                <button className="w-8 h-8 rounded-lg flex items-center justify-center text-[#444] hover:bg-[#f5f5f7] hover:text-black transition-all"><Italic size={16} /></button>
                                <button className="w-8 h-8 rounded-lg flex items-center justify-center text-[#444] hover:bg-[#f5f5f7] hover:text-black transition-all"><Underline size={16} /></button>
                            </div>
                            <div className="h-4 w-[1px] bg-[#f5f5f7]" />
                            <div className="flex items-center gap-1">
                                <button className="w-8 h-8 rounded-lg flex items-center justify-center text-[#444] hover:bg-[#f5f5f7] hover:text-black transition-all"><AlignLeft size={16} /></button>
                                <button className="w-8 h-8 rounded-lg flex items-center justify-center text-[#444] hover:bg-[#f5f5f7] hover:text-black transition-all"><AlignCenter size={16} /></button>
                            </div>
                            <div className="h-4 w-[1px] bg-[#f5f5f7]" />
                            <div className="flex items-center gap-1">
                                <button className="w-8 h-8 rounded-lg flex items-center justify-center text-[#444] hover:bg-[#f5f5f7] hover:text-black transition-all"><LinkIcon size={16} /></button>
                                <button className="w-8 h-8 rounded-lg flex items-center justify-center text-[#444] hover:bg-[#f5f5f7] hover:text-black transition-all"><ImageIcon size={16} /></button>
                                <button className="w-8 h-8 rounded-lg flex items-center justify-center text-[#444] hover:bg-[#f5f5f7] hover:text-black transition-all"><Code size={16} /></button>
                                <button className="w-8 h-8 rounded-lg flex items-center justify-center text-[#444] hover:bg-[#f5f5f7] hover:text-black transition-all"><Quote size={16} /></button>
                            </div>
                            <div className="flex-1" />
                            <div className="text-[11px] font-black text-[#86868b] uppercase tracking-widest opacity-40">1,248 Words</div>
                        </div>
                        
                        {/* BODY */}
                        <div className="p-12 min-h-[500px] outline-none text-[18px] leading-[1.8] font-light text-[#1d1d1f] relative">
                            <h2>Why Most AZ-104 Study Plans Fail</h2>
                            <p>The most common mistake candidates make is treating the AZ-104 like a textbook exam. They buy every recommended book, try to read cover to cover, and end up overwhelmed six weeks in with half the syllabus still untouched.</p>
                            <p>This plan takes a different approach. It's <strong>exam-aligned, not book-aligned</strong> — built around the official Microsoft skills outline, weighted by the percentage each domain actually contributes to your score.</p>
                            <div className="my-10 p-8 rounded-3xl bg-[#f5f5f7] border-l-4 border-[#0071e3] italic text-[#6e6e73] font-normal">
                                "The goal is not to know everything about Azure. The goal is to know what matters for the exam — and to know it cold."
                            </div>
                            <h3>The 60-Day Framework</h3>
                            <p>Every topic should be followed by a lab. Don't just read about creating a virtual network — create one. Deploy a VM. Set up a storage account. The Azure free tier gives you enough credits to run all of these labs without paying a penny.</p>
                            <div className="absolute top-12 left-12 text-[80px] opacity-[0.02] font-black pointer-events-none select-none">ARCHITECTURE</div>
                        </div>
                    </div>
                </div>

                {/* ─── SIDEBAR ─────────────────────────────────────────── */}
                <AnimatePresence>
                    {!focusMode && (
                        <motion.aside 
                            initial={{ opacity: 0, x: 20 }} 
                            animate={{ opacity: 1, x: 0 }} 
                            exit={{ opacity: 0, x: 20 }}
                            className="space-y-6 sticky top-[80px] h-fit"
                        >
                            {/* PUBLISH CARD */}
                            <div className="bg-white rounded-[32px] p-8 border border-[#000]/[0.03] shadow-sm">
                                <h3 className="text-[13px] font-black mb-6 uppercase tracking-[0.2em] flex items-center gap-2">
                                    <Send size={14} className="text-[#0071e3]" /> Publication
                                </h3>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[12px] font-bold text-[#86868b]">Current Status</span>
                                        <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${status === 'draft' ? 'bg-[#ff9f0a]/10 text-[#ff9f0a]' : 'bg-[#30d158]/10 text-[#30d158]'}`}>
                                            {status}
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-[12px] font-bold text-[#86868b]">Visibility</span>
                                        <select className="bg-transparent text-[12px] font-black text-[#1d1d1f] outline-none cursor-pointer">
                                            <option>Public</option>
                                            <option>Premium Only</option>
                                            <option>Private</option>
                                        </select>
                                    </div>
                                    <div className="h-[1px] bg-[#f5f5f7] my-2" />
                                    <div className="flex flex-col gap-2">
                                        <label className="text-[10px] font-black text-[#86868b] uppercase tracking-widest">Schedule Publication</label>
                                        <div className="flex items-center gap-2 bg-[#f5f5f7] p-3 rounded-xl border border-[#000]/[0.03] text-[12px] font-bold text-[#1d1d1f]">
                                            <Calendar size={14} className="opacity-40" />
                                            April 28, 2026 · 09:00
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* CATEGORIES */}
                            <div className="bg-white rounded-[32px] p-8 border border-[#000]/[0.03] shadow-sm">
                                <h3 className="text-[13px] font-black mb-6 uppercase tracking-[0.2em] flex items-center gap-2">
                                    <Layout size={14} className="text-[#0071e3]" /> Categories
                                </h3>
                                <div className="space-y-3">
                                    {["Cloud", "Microsoft", "Linux", "Security"].map(cat => (
                                        <label key={cat} className="flex items-center gap-3 group cursor-pointer">
                                            <div className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center transition-all ${cat === 'Cloud' ? 'border-[#0071e3] bg-[#0071e3]' : 'border-[#d2d2d7] group-hover:border-[#0071e3]'}`}>
                                                {cat === 'Cloud' && <Check size={12} className="text-white" />}
                                            </div>
                                            <span className={`text-[13px] font-bold transition-colors ${cat === 'Cloud' ? 'text-[#1d1d1f]' : 'text-[#86868b] group-hover:text-black'}`}>{cat}</span>
                                        </label>
                                    ))}
                                    <button className="text-[11px] font-black text-[#0071e3] uppercase tracking-widest mt-4 hover:opacity-70 transition-opacity underline underline-offset-4 decoration-[#0071e3]/30">Add New Category</button>
                                </div>
                            </div>

                            {/* TAGS */}
                            <div className="bg-white rounded-[32px] p-8 border border-[#000]/[0.03] shadow-sm">
                                <h3 className="text-[13px] font-black mb-6 uppercase tracking-[0.2em] flex items-center gap-2">
                                    <Tag size={14} className="text-[#0071e3]" /> Intelligence Tags
                                </h3>
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {tags.map(tag => (
                                        <span key={tag} className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#f5f5f7] text-[#1d1d1f] text-[11px] font-bold rounded-lg group">
                                            {tag}
                                            <button onClick={() => removeTag(tag)} className="opacity-20 group-hover:opacity-100 hover:text-red-500 transition-all"><X size={12} /></button>
                                        </span>
                                    ))}
                                </div>
                                <input 
                                    value={newTag}
                                    onChange={(e) => setNewTag(e.target.value)}
                                    onKeyDown={addTag}
                                    placeholder="Press enter to add..."
                                    className="w-full bg-[#f5f5f7] border border-[#d2d2d7] rounded-xl px-4 py-3 text-[12px] font-medium outline-none focus:border-[#0071e3] transition-all"
                                />
                            </div>

                            {/* SEO PREVIEW */}
                            <div className="bg-white rounded-[32px] p-8 border border-[#000]/[0.03] shadow-sm">
                                <h3 className="text-[13px] font-black mb-6 uppercase tracking-[0.2em] flex items-center gap-2">
                                    <Search size={14} className="text-[#30d158]" /> SEO Audit
                                </h3>
                                <div className="p-4 rounded-2xl bg-[#fafafa] border border-[#d2d2d7]/50 mb-6">
                                    <div className="text-[11px] text-[#1a6c2a] mb-1">bhavinacademy.com › blog › {slug}</div>
                                    <div className="text-[14px] text-[#1a0dab] font-bold mb-2 line-clamp-1">{title}</div>
                                    <div className="text-[12px] text-[#4d5156] leading-relaxed line-clamp-2">{excerpt}</div>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-1.5 h-1.5 rounded-full bg-[#30d158]" />
                                        <span className="text-[11px] font-bold text-[#6e6e73]">Title length optimal</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-1.5 h-1.5 rounded-full bg-[#30d158]" />
                                        <span className="text-[11px] font-bold text-[#6e6e73]">Meta description found</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-1.5 h-1.5 rounded-full bg-[#ff9f0a]" />
                                        <span className="text-[11px] font-bold text-[#6e6e73]">Keywords density low</span>
                                    </div>
                                </div>
                            </div>
                        </motion.aside>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}

export default BlogEditPage;
