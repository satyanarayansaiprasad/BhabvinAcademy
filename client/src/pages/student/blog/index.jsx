import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Play, Calendar, Clock } from "lucide-react";

function BlogPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const categories = [
    { id: "all", label: "All", emoji: "" },
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

  const filteredPosts = useMemo(() => {
    return posts.filter(post => {
      const matchesCategory = activeTab === "all" || post.category === activeTab;
      const matchesSearch = 
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeTab, searchQuery]);

  const featuredPost = posts.find(p => p.featured);

  return (
    <div className="min-h-screen bg-white font-sans text-[#1d1d1f]">
      
      {/* PAGE HERO */}
      <section className="bg-gradient-to-br from-black via-[#1a1a2e] to-black py-[80px] px-6 text-center relative overflow-hidden">
        <div className="absolute w-[600px] h-[400px] rounded-full bg-[radial-gradient(circle,rgba(0,113,227,0.22)_0%,transparent_70%)] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
        <p className="text-[12px] font-semibold text-[#0071e3] uppercase tracking-[0.08em] mb-[14px] relative">
          The BhavinAcademy Blog
        </p>
        <h1 className="text-[clamp(34px,5.5vw,66px)] font-extrabold text-[#f5f5f7] tracking-[-2px] leading-[1.05] mb-[16px] relative">
          IT insights.<br />
          <em className="not-italic bg-gradient-to-r from-[#0071e3] to-[#00d4ff] bg-clip-text text-transparent">Straight from the field.</em>
        </h1>
        <p className="text-[clamp(15px,2vw,18px)] text-[#86868b] leading-[1.6] max-w-[500px] mx-auto font-light relative">
          Tutorials, exam tips, career advice, and deep-dives into Microsoft, Linux, Cloud & Security; written by practitioners, for practitioners.
        </p>
      </section>

      {/* SEARCH + FILTER CONTROLS */}
      <div className="bg-white border-b border-[#d2d2d7] py-[14px] px-6 sticky top-[52px] z-[90]">
        <div className="max-w-[1080px] mx-auto flex items-center gap-[12px] flex-wrap justify-between">
          
          {/* Search box */}
          <div className="relative flex-1 min-w-[180px] max-w-[300px]">
            <Search className="absolute left-[11px] top-1/2 -translate-y-1/2 w-4 h-4 text-[#86868b] pointer-events-none" />
            <input 
              type="text" 
              placeholder="Search articles…" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-[34px] pr-[12px] py-[8px] border border-[#d2d2d7] rounded-[10px] text-[13px] outline-none bg-[#f5f5f7] focus:border-[#0071e3] focus:bg-white transition-colors"
            />
          </div>

          {/* Category Filter tabs */}
          <div className="flex gap-[6px] flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveTab(cat.id)}
                className={`px-[15px] py-[6px] border rounded-[980px] text-[13px] font-medium transition-all ${
                  activeTab === cat.id
                    ? "bg-[#0071e3] border-[#0071e3] text-white"
                    : "bg-white border-[#d2d2d7] text-[#6e6e73] hover:border-[#0071e3] hover:text-[#0071e3]"
                }`}
              >
                {cat.emoji && <span className="mr-1">{cat.emoji}</span>}
                {cat.label}
              </button>
            ))}
          </div>

          {/* Counts */}
          <div className="ml-auto text-[13px] text-[#86868b]">
            {filteredPosts.length} articles
          </div>

        </div>
      </div>

      {/* MAIN CONTENT GRID */}
      <div className="bg-[#f5f5f7] py-[48px] px-6 pb-[80px]">
        <div className="max-w-[1080px] mx-auto grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-[32px] items-start">
          
          {/* LEFT COLUMN: ARTICLES */}
          <div className="flex flex-col gap-[36px]">
            
            {/* FEATURED POST */}
            {featuredPost && activeTab === "all" && (
              <div>
                <p className="text-[13px] font-semibold text-[#0071e3] uppercase tracking-[0.06em] mb-[16px]">Featured Article</p>
                <div 
                  onClick={() => navigate("/blog")}
                  className="bg-black rounded-[20px] overflow-hidden grid grid-cols-1 md:grid-cols-2 min-h-[320px] cursor-pointer hover:shadow-[0_24px_48px_rgba(0,0,0,0.2)] hover:-translate-y-[3px] transition-all duration-[0.3s]"
                >
                  <div className={`relative flex items-center justify-center min-h-[220px] bg-gradient-to-br ${featuredPost.color}`}>
                    <span className="text-[80px] select-none filter drop-shadow-[0_0_32px_rgba(0,113,227,0.5)]">
                      {featuredPost.emoji}
                    </span>
                  </div>
                  <div className="p-[40px_36px] flex flex-col justify-between text-white">
                    <div>
                      <span className="inline-block bg-white/20 border border-white/35 text-white px-[12px] py-[3px] rounded-[980px] text-[11px] font-semibold tracking-wide mb-[16px]">
                        {featuredPost.emoji} {featuredPost.tag}
                      </span>
                      <h2 className="text-[clamp(20px,2.5vw,28px)] font-bold tracking-[-0.6px] leading-[1.2] text-[#f5f5f7] mb-[12px]">
                        {featuredPost.title}
                      </h2>
                      <p className="text-[14px] text-[#86868b] leading-[1.65] mb-[24px] line-clamp-3">
                        {featuredPost.excerpt}
                      </p>
                    </div>
                    <div>
                      <div className="flex items-center gap-[12px] text-[13px] text-[#86868b]">
                        <div className="w-[32px] h-[32px] rounded-full bg-gradient-to-br from-[#0071e3] to-[#00d4ff] flex items-center justify-center font-bold text-white shrink-0">
                          B
                        </div>
                        <div>
                          <strong>{featuredPost.author}</strong> · {featuredPost.date} · {featuredPost.readTime}
                        </div>
                      </div>
                      <div className="inline-flex items-center gap-[4px] text-[13px] font-semibold text-[#0071e3] mt-[20px] hover:underline">
                        Read article ›
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ARTICLES LISTING */}
            <div>
              <p className="text-[13px] font-semibold text-[#0071e3] uppercase tracking-[0.06em] mb-[16px]">Latest Articles</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-[16px]">
                {filteredPosts.filter(p => !p.featured || activeTab !== 'all').map((post) => (
                  <div 
                    key={post.id}
                    onClick={() => navigate("/blog")}
                    className="bg-white rounded-[18px] overflow-hidden flex flex-col cursor-pointer hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-[0.3s]"
                  >
                    <div className={`h-[150px] flex items-center justify-center text-[52px] relative overflow-hidden bg-gradient-to-br ${post.color}`}>
                      <span className="select-none filter drop-shadow-[0_2px_12px_rgba(0,0,0,0.4)]">{post.emoji}</span>
                      <span className="absolute top-[10px] left-[12px] bg-black/55 backdrop-blur-[8px] text-[#c7c7cc] text-[10px] font-semibold px-[10px] py-[3px] rounded-[980px] tracking-wide">
                        {post.tag}
                      </span>
                    </div>
                    <div className="p-[20px] flex-1 flex flex-col">
                      <h3 className="text-[15px] font-bold text-[#1d1d1f] tracking-[-0.3px] leading-[1.35] mb-[8px] hover:text-[#0071e3] transition-colors">
                        {post.title}
                      </h3>
                      <p className="text-[13px] text-[#6e6e73] leading-[1.6] flex-1 mb-[16px] line-clamp-2">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center justify-between pt-[12px] border-t border-[#f5f5f7] text-[12px] text-[#86868b]">
                        <span>{post.date}</span>
                        <span>{post.readTime}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {filteredPosts.length > 4 && (
                <div className="text-center mt-[36px]">
                  <button className="bg-white text-[#1d1d1f] border border-[#d2d2d7] px-[32px] py-[12px] rounded-[980px] text-[14px] font-medium hover:border-[#0071e3] hover:text-[#0071e3] transition-colors">
                    Load More Articles
                  </button>
                </div>
              )}
            </div>

          </div>

          {/* RIGHT COLUMN: SIDEBAR */}
          <aside className="flex flex-col gap-[20px]">
            
            {/* Newsletter */}
            <div className="bg-black rounded-[18px] p-[28px] text-white overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#0071e3] blur-[60px] opacity-20 -translate-y-1/2 translate-x-1/2 pointer-events-none" />
              <h3 className="text-[15px] font-bold tracking-tight text-[#f5f5f7] mb-[16px]">Newsletter</h3>
              <p className="text-[13px] text-[#86868b] leading-[1.55] mb-[18px]">
                Get field-tested IT strategies and exam insights delivered once a week.
              </p>
              <form onSubmit={(e) => { e.preventDefault(); alert('Subscribed!'); }} className="space-y-[10px]">
                <input 
                  type="email" 
                  placeholder="Email address" 
                  required
                  style={{ color: "#f5f5f7" }}
                  className="w-full px-[14px] py-[10px] border border-white/12 rounded-[10px] bg-white/7 text-[#f5f5f7] text-[13px] outline-none focus:border-[#0071e3] transition-colors placeholder:text-gray-500"
                />
                <button type="submit" className="w-full bg-[#0071e3] text-white py-[10px] rounded-[10px] text-[13px] font-semibold hover:bg-[#0077ed] transition-colors">
                  Subscribe
                </button>
              </form>
            </div>

            {/* Popular posts */}
            <div className="bg-white rounded-[18px] p-[24px] border border-black/5 shadow-sm">
              <h3 className="text-[15px] font-bold text-[#1d1d1f] tracking-tight mb-[16px]">Popular Posts</h3>
              <div className="flex flex-col gap-[16px]">
                {popularPosts.map((post, i) => (
                  <div key={post.id} onClick={() => navigate("/blog")} className="flex gap-[12px] cursor-pointer group">
                    <span className="text-[20px] font-extrabold text-[#d2d2d7] leading-none mt-[2px] group-hover:text-[#0071e3] transition-colors">
                      0{i+1}
                    </span>
                    <div>
                      <h4 className="text-[13px] font-semibold text-[#1d1d1f] leading-[1.4] group-hover:text-[#0071e3] transition-colors line-clamp-2">
                        {post.title}
                      </h4>
                      <div className="text-[12px] text-[#86868b] mt-[3px]">
                        {post.category} · {post.readTime}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Topic pillars */}
            <div className="bg-white rounded-[18px] p-[24px] border border-black/5 shadow-sm">
              <h3 className="text-[15px] font-bold text-[#1d1d1f] tracking-tight mb-[16px]">Topics</h3>
              <div className="flex flex-wrap gap-[7px]">
                {categories.slice(1).map((cat) => (
                  <span 
                    key={cat.id} 
                    onClick={() => setActiveTab(cat.id)}
                    className="px-[14px] py-[6px] rounded-[980px] text-[12px] font-medium bg-[#f5f5f7] text-[#1d1d1f] cursor-pointer border border-transparent hover:border-[#0071e3] hover:text-[#0071e3] hover:bg-white transition-all"
                  >
                    {cat.label}
                  </span>
                ))}
              </div>
            </div>

            {/* Latest video node */}
            <div className="bg-white rounded-[18px] p-[24px] border border-black/5 shadow-sm group">
              <h3 className="text-[15px] font-bold text-[#1d1d1f] tracking-tight mb-[16px]">Latest Video</h3>
              <div 
                onClick={() => navigate("/")}
                className="rounded-[12px] overflow-hidden relative cursor-pointer mb-[14px]"
              >
                <div className="h-[130px] flex items-center justify-center bg-gradient-to-br from-[#0a1628] to-[#1e3a5f] relative">
                  <div className="w-[48px] h-[48px] rounded-full bg-white/15 backdrop-blur-[8px] flex items-center justify-center border-2 border-white/30 group-hover:scale-105 transition-transform duration-300">
                    <Play className="w-5 h-5 text-white fill-current translate-x-[1px]" />
                  </div>
                </div>
              </div>
              <h4 className="text-[13px] font-semibold text-[#1d1d1f] leading-[1.4] group-hover:text-[#0071e3] transition-colors">
                How I blueprint AZ-104 study clusters for first-attempt success.
              </h4>
              <div className="text-[12px] text-[#86868b] mt-[3px]">
                Cloud Architecture · 14k Views
              </div>
            </div>

          </aside>

        </div>
      </div>

      {/* QUOTE BAND */}
      <section className="bg-black py-[80px] px-6 text-center text-white relative overflow-hidden">
        <div className="max-w-[700px] mx-auto">
          <p className="text-[clamp(20px,3vw,34px)] font-light text-[#f5f5f7] leading-[1.55] tracking-[-0.5px] mb-[24px]">
            "While technology shifts with every decade, your value remains constant through two rules: <strong>Master the fundamentals</strong>, as they are timeless; and <strong>keep learning</strong>, for the world never stops turning."
          </p>
          <div className="text-[14px] text-[#86868b]">· Bhavin Khatri ·</div>
        </div>
      </section>

      {/* CTA BAND */}
      <section className="bg-[#0071e3] py-[72px] px-6 text-center text-white flex flex-col items-center">
        <h2 className="text-[clamp(26px,4vw,48px)] font-extrabold tracking-[-1.5px] mb-[14px] leading-tight">
          Ready to start your IT journey?
        </h2>
        <p className="text-[16px] text-[rgba(255,255,255,0.75)] mb-[32px] max-w-[460px] mx-auto">
          Learn from industry experts and immerse yourself in an ocean of knowledge.
        </p>
        <button onClick={() => navigate("/courses")} className="bg-white text-[#0071e3] border-none py-[13px] px-[30px] rounded-[980px] text-[15px] font-semibold cursor-pointer hover:opacity-90 transition-opacity">
          Explore Courses
        </button>
      </section>

    </div>
  );
}

export default BlogPage;
