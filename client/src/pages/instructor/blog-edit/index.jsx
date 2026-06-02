import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import {
  ArrowLeft,
  Bold,
  Italic,
  List,
  Quote,
  Code,
  Link2,
  Eye,
  CheckCircle,
  HelpCircle,
  FileText,
  AlertCircle,
  Image as ImageIcon,
  Tag
} from "lucide-react";

export default function InstructorBlogEditPage() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [post, setPost] = useState({
    title: "Azure AZ-104 in 60 Days: The Study Plan That Actually Works",
    slug: "azure-az104-in-60-days-study-plan",
    excerpt: "Stop reading every book cover to cover. Here's the focused, exam-aligned 60-day plan that took dozens of BhavinAcademy students from zero to certified.",
    readTime: "8 min read",
    category: "cloud",
    tags: ["Cloud", "Azure", "AZ-104", "Certification"],
    content: "<h2>Getting Started with AZ-104</h2><p>The Microsoft Certified: Azure Administrator Associate certification is one of the most sought-after credentials in IT today. However, many candidates fail because they focus on raw theory instead of practical, lab-based scenarios.</p><blockquote>\"Practice is the key to mastering cloud architectures. If you haven't deployed it, you don't know it.\"</blockquote><p>In this guide, we break down the exact curriculum study phases and lab exercises required to build confidence and pass the test on your first attempt.</p>",
    coverImage: "",
    isPublished: false,
  });

  const [tagInput, setTagInput] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [focusMode, setFocusMode] = useState(false);
  const editorRef = useRef(null);

  // Load from localStorage if present
  useEffect(() => {
    const saved = localStorage.getItem("bhavinacademy_blog_draft");
    if (saved) {
      try {
        setPost(JSON.parse(saved));
      } catch (e) {}
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let updatedSlug = post.slug;
    if (name === "title") {
      // Auto-generate slug from title
      updatedSlug = value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
    }
    setPost({ ...post, [name]: value, slug: updatedSlug });
  };

  const handleAddTag = (e) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      if (!post.tags.includes(tagInput.trim())) {
        setPost({ ...post, tags: [...post.tags, tagInput.trim()] });
      }
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagName) => {
    setPost({ ...post, tags: post.tags.filter((t) => t !== tagName) });
  };

  const handleSaveDraft = () => {
    setIsSaving(true);
    localStorage.setItem("bhavinacademy_blog_draft", JSON.stringify(post));
    setTimeout(() => {
      setIsSaving(false);
      toast({ title: "Draft saved successfully!" });
    }, 600);
  };

  const handlePublish = () => {
    setIsSaving(true);
    const updated = { ...post, isPublished: true };
    setPost(updated);
    localStorage.setItem("bhavinacademy_blog_draft", JSON.stringify(updated));
    setTimeout(() => {
      setIsSaving(false);
      toast({ title: "Blog post published successfully! 🎉" });
      navigate("/instructor");
    }, 800);
  };

  // Format content toolbar actions
  const formatText = (command) => {
    document.execCommand(command, false, null);
  };

  const insertLink = () => {
    const url = prompt("Enter link URL:");
    if (url) {
      document.execCommand("createLink", false, url);
    }
  };

  return (
    <div className={`bg-[#f5f5f7] text-[#1d1d1f] min-h-screen font-sans flex flex-col text-left transition-all ${focusMode ? "bg-[#fafafa]" : ""}`}>
      {/* Navbar */}
      <nav className="bg-white border-b border-black/[0.08] sticky top-0 z-[100] h-[52px] flex items-center px-8 justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/instructor")}
            className="p-1.5 hover:bg-[#f5f5f7] rounded-xl transition-all border-none bg-transparent cursor-pointer"
          >
            <ArrowLeft size={16} />
          </button>
          <span className="text-[13px] text-[#86868b]">Dashboard</span>
          <span className="text-white/20">›</span>
          <span className="text-[13px] text-[#1d1d1f] font-semibold">Blog Posts</span>
          <span className="text-white/20">›</span>
          <span className="text-[13px] text-[#86868b]">Edit Post</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-xs text-[#6e6e73]">
            <div className={`w-2 h-2 rounded-full ${post.isPublished ? "bg-green-500" : "bg-yellow-500"}`} />
            {post.isPublished ? "Published" : "Draft"}
          </div>
          <button
            onClick={() => setFocusMode(!focusMode)}
            className="bg-transparent border border-[#d2d2d7] text-xs font-semibold px-4 py-2 rounded-full cursor-pointer hover:bg-[#f5f5f7] flex items-center gap-1"
          >
            {focusMode ? "Exit Focus Mode" : "Focus Mode"}
          </button>
          <button
            onClick={handleSaveDraft}
            className="bg-transparent border border-[#d2d2d7] text-xs font-semibold px-4 py-2 rounded-full cursor-pointer hover:bg-[#f5f5f7]"
          >
            {isSaving ? "Saving..." : "Save Draft"}
          </button>
          <button
            onClick={handlePublish}
            className="bg-[#0071e3] text-white hover:bg-[#0077ed] text-xs font-bold px-5 py-2 rounded-full cursor-pointer border-none shadow-md"
          >
            Publish Post
          </button>
        </div>
      </nav>

      {/* Editor Body Wrapper */}
      <div className={`max-w-[1400px] mx-auto w-full px-6 py-8 grid grid-cols-1 ${focusMode ? "lg:grid-cols-1 max-w-[800px]" : "lg:grid-cols-[1fr_320px]"} gap-6 items-start`}>
        {/* Main Editor Columns */}
        <div className="space-y-6">
          {/* Cover image area */}
          {!focusMode && (
            <div className="bg-white border-2 border-dashed border-[#d2d2d7] hover:border-[#0071e3] rounded-3xl p-12 text-center cursor-pointer transition-all bg-[#fafafa]">
              <div className="w-12 h-12 rounded-2xl bg-white border border-[#d2d2d7] flex items-center justify-center mx-auto mb-4">
                <ImageIcon className="text-[#86868b]" size={20} />
              </div>
              <div className="font-semibold text-sm">Add a cover image</div>
              <div className="text-xs text-[#86868b] mt-1">Recommended 1200×630px · JPG, PNG</div>
            </div>
          )}

          {/* Title and Short details */}
          <div className="bg-white border border-black/[0.07] rounded-3xl p-8">
            <input
              type="text"
              name="title"
              className="w-full text-3xl font-extrabold tracking-tight border-none outline-none placeholder:text-[#d2d2d7] resize-none"
              placeholder="Post Title"
              value={post.title}
              onChange={handleInputChange}
            />
            <div className="h-[1px] bg-black/5 my-6" />

            <div className="space-y-4 text-xs">
              <div className="flex items-center gap-4">
                <span className="font-semibold text-[#86868b] w-20">SLUG:</span>
                <span className="text-[#86868b] font-mono">bhavinacademy.com/blog/</span>
                <input
                  type="text"
                  name="slug"
                  className="flex-1 bg-[#f5f5f7] border border-[#d2d2d7] rounded-lg p-2 font-mono"
                  placeholder="post-slug"
                  value={post.slug}
                  onChange={handleInputChange}
                />
              </div>
              <div className="flex items-center gap-4">
                <span className="font-semibold text-[#86868b] w-20">EXCERPT:</span>
                <textarea
                  name="excerpt"
                  className="flex-1 bg-[#f5f5f7] border border-[#d2d2d7] rounded-lg p-3 min-h-[60px] line-height-relaxed"
                  placeholder="One-line summary for grids..."
                  value={post.excerpt}
                  onChange={handleInputChange}
                />
              </div>
              <div className="flex items-center gap-4">
                <span className="font-semibold text-[#86868b] w-20">READ TIME:</span>
                <input
                  type="text"
                  name="readTime"
                  className="bg-[#f5f5f7] border border-[#d2d2d7] rounded-lg p-2 w-28"
                  placeholder="8 min read"
                  value={post.readTime}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>

          {/* Editor Rich-Text Card */}
          <div className="bg-white border border-black/[0.07] rounded-3xl overflow-hidden">
            {/* Rich text Toolbar */}
            <div className="bg-[#fafafa] border-b border-black/5 p-3 flex gap-2 items-center flex-wrap">
              <button
                type="button"
                onClick={() => formatText("bold")}
                className="p-1.5 hover:bg-white rounded-lg border-none bg-transparent cursor-pointer"
                title="Bold"
              >
                <Bold size={15} />
              </button>
              <button
                type="button"
                onClick={() => formatText("italic")}
                className="p-1.5 hover:bg-white rounded-lg border-none bg-transparent cursor-pointer"
                title="Italic"
              >
                <Italic size={15} />
              </button>
              <button
                type="button"
                onClick={() => formatText("insertUnorderedList")}
                className="p-1.5 hover:bg-white rounded-lg border-none bg-transparent cursor-pointer"
                title="Bullet List"
              >
                <List size={15} />
              </button>
              <button
                type="button"
                onClick={() => formatText("formatBlock", "blockquote")}
                className="p-1.5 hover:bg-white rounded-lg border-none bg-transparent cursor-pointer"
                title="Blockquote"
              >
                <Quote size={15} />
              </button>
              <button
                type="button"
                onClick={() => formatText("formatBlock", "pre")}
                className="p-1.5 hover:bg-white rounded-lg border-none bg-transparent cursor-pointer"
                title="Code block"
              >
                <Code size={15} />
              </button>
              <button
                type="button"
                onClick={insertLink}
                className="p-1.5 hover:bg-white rounded-lg border-none bg-transparent cursor-pointer"
                title="Link"
              >
                <Link2 size={15} />
              </button>
            </div>

            {/* Editable Content Frame */}
            <div
              ref={editorRef}
              className="p-8 min-h-[400px] outline-none prose max-w-none text-[15px] leading-relaxed text-[#1d1d1f]"
              contentEditable
              suppressContentEditableWarning
              onBlur={() => setPost({ ...post, content: editorRef.current.innerHTML })}
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </div>
        </div>

        {/* Sidebar Info - Category / Tags / SEO Preview */}
        {!focusMode && (
          <div className="space-y-6">
            {/* Category selection */}
            <div className="bg-white border border-black/[0.07] rounded-3xl p-6">
              <h4 className="font-bold text-sm mb-4">Post Category</h4>
              <select
                name="category"
                className="w-full bg-[#f5f5f7] border border-[#d2d2d7] rounded-xl p-3 text-xs outline-none cursor-pointer"
                value={post.category}
                onChange={handleInputChange}
              >
                <option value="cloud">Cloud & Azure</option>
                <option value="microsoft">Microsoft</option>
                <option value="linux">Linux</option>
                <option value="networking">Networking</option>
                <option value="security">Security</option>
                <option value="career">IT Career</option>
              </select>
            </div>

            {/* Tags build card */}
            <div className="bg-white border border-black/[0.07] rounded-3xl p-6">
              <h4 className="font-bold text-sm mb-3">Tags & Topics</h4>
              <div className="flex flex-wrap gap-1.5 mb-4">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 bg-[#f5f5f7] border border-black/5 text-[#1d1d1f] text-[11px] font-medium px-2.5 py-0.5 rounded-full"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="text-[#86868b] hover:text-red-500 font-bold border-none bg-transparent cursor-pointer text-xs"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <input
                type="text"
                className="w-full border border-[#d2d2d7] rounded-xl p-2.5 text-xs outline-none focus:border-[#0071e3]"
                placeholder="Press Enter to add tag..."
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleAddTag}
              />
            </div>

            {/* SEO preview card */}
            <div className="bg-white border border-black/[0.07] rounded-3xl p-6 space-y-4">
              <h4 className="font-bold text-sm mb-2 flex items-center gap-1.5">
                <Sparkles size={16} className="text-[#0071e3]" /> SEO Optimization
              </h4>
              <div className="border border-[#d2d2d7] rounded-xl p-4 bg-[#fafafa] text-xs">
                <div className="text-[11px] text-[#1a6c2a] truncate">bhavinacademy.com › blog › {post.slug}</div>
                <div className="text-[#1a0dab] font-semibold text-[14px] leading-tight hover:underline cursor-pointer truncate mt-1">
                  {post.title}
                </div>
                <div className="text-[#4d5156] leading-relaxed mt-1 text-[11px]">
                  {post.excerpt || "No summary provided. Excerpts are vital for SEO crawl..."}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
