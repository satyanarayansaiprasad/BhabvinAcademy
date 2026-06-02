import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";

export default function StudentPathsPage() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState("all");

  const paths = [
    {
      id: "path-01",
      num: "PATH 01",
      title: "Microsoft Engineer",
      desc: "Master the full Microsoft stack — from Windows Server administration to Azure cloud and Microsoft 365. Prepares you for MCSA and MCP certifications.",
      category: "microsoft",
      level: "Beginner → Advanced",
      coursesCount: 6,
      duration: "72 hrs",
      certs: 3,
      icon: "🪟",
      featured: true,
      pills: ["Windows Server", "Active Directory", "Azure", "Microsoft 365", "Intune"],
      bgClass: "from-[#0a1628] via-[#1a2d4a] to-[#0a1628]",
    },
    {
      id: "path-02",
      num: "PATH 02",
      title: "Linux Administrator",
      desc: "Command line mastery, shell scripting, service management, and LPIC certification prep. Build the skills every Linux sysadmin needs.",
      category: "linux",
      level: "All Levels",
      coursesCount: 5,
      duration: "58 hrs",
      icon: "🐧",
      pills: ["CLI", "Bash Scripting", "Services", "LPIC-1"],
      bgClass: "from-[#1a1a0a] to-[#3a3010]",
    },
    {
      id: "path-03",
      num: "PATH 03",
      title: "Network Engineer",
      desc: "Routing, switching, firewalls, and subnetting — complete CCNA and CompTIA Network+ exam preparation with hands-on labs.",
      category: "networking",
      level: "Beginner",
      coursesCount: 4,
      duration: "44 hrs",
      icon: "🌐",
      pills: ["TCP/IP", "Routing", "Firewalls", "CCNA"],
      bgClass: "from-[#0a1a28] to-[#103050]",
    },
    {
      id: "path-04",
      num: "PATH 04",
      title: "Cloud Architect",
      desc: "Design and deploy scalable cloud solutions on Azure. From AZ-900 fundamentals through AZ-104 and AZ-305 architect certification.",
      category: "cloud",
      level: "Intermediate",
      coursesCount: 5,
      duration: "54 hrs",
      icon: "☁️",
      pills: ["Azure", "AZ-900", "AZ-104", "AZ-305"],
      bgClass: "from-[#0a1e2e] to-[#08305a]",
    },
    {
      id: "path-05",
      num: "PATH 05",
      title: "Cybersecurity Analyst",
      desc: "From threat analysis to incident response, covering CompTIA Security+, CySA+, and ethical hacking fundamentals with real-world scenarios.",
      category: "security",
      level: "Advanced",
      coursesCount: 6,
      duration: "68 hrs",
      icon: "🔒",
      pills: ["Security+", "CySA+", "Ethical Hacking", "SIEM"],
      bgClass: "from-[#0a1a0a] to-[#0f3020]",
    },
    {
      id: "path-06",
      num: "PATH 06",
      title: "DevOps Engineer",
      desc: "CI/CD pipelines, containers, infrastructure as code, and monitoring. Hands-on with Docker, Kubernetes, Ansible, and Azure DevOps.",
      category: "devops",
      level: "Intermediate",
      coursesCount: 5,
      duration: "60 hrs",
      icon: "⚙️",
      pills: ["Docker", "Kubernetes", "Ansible", "CI/CD"],
      bgClass: "from-[#1a0a28] to-[#35155a]",
    },
    {
      id: "path-07",
      num: "PATH 07",
      title: "AI & Automation",
      desc: "Leverage AI tools and automation scripts to 10× your IT productivity. PowerShell, Python automation, Azure AI services, and Copilot integration.",
      category: "ai",
      level: "Beginner",
      coursesCount: 4,
      duration: "42 hrs",
      icon: "🤖",
      pills: ["PowerShell", "Python", "Azure AI", "Copilot"],
      bgClass: "from-[#0a0a1a] to-[#181850]",
    },
  ];

  const filterChips = [
    { id: "all", label: "All Paths" },
    { id: "microsoft", label: "🪟 Microsoft" },
    { id: "linux", label: "🐧 Linux" },
    { id: "networking", label: "🌐 Networking" },
    { id: "cloud", label: "☁️ Cloud" },
    { id: "security", label: "🔒 Security" },
    { id: "devops", label: "⚙️ DevOps" },
    { id: "ai", label: "🤖 AI & Automation" },
    { id: "beginner", label: "Beginner-Friendly" },
  ];

  const filteredPaths = paths.filter((path) => {
    if (filter === "all") return true;
    if (filter === "beginner") return path.level.toLowerCase().includes("beginner");
    return path.category === filter;
  });

  const featuredPath = paths.find((p) => p.featured);
  const showFeatured = filter === "all" || filter === featuredPath.category;

  return (
    <div className="bg-white min-h-screen text-[#1d1d1f] font-sans antialiased">
      {/* PAGE HERO */}
      <section className="bg-gradient-to-br from-black via-[#1a1a2e] to-black py-24 px-6 text-center relative overflow-hidden">
        <div className="absolute w-[700px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(0,113,227,0.22)_0%,transparent_70%)] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
        <div className="max-w-4xl mx-auto relative z-10">
          <p className="text-[13px] font-semibold text-[#0071e3] tracking-widest uppercase mb-4 animate-fade-in">
            Structured Learning Paths
          </p>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight text-[#f5f5f7] mb-6 leading-[1.05]">
            Your <span className="bg-gradient-to-r from-[#0071e3] to-[#00d4ff] bg-clip-text text-transparent">roadmap</span> to<br />IT mastery.
          </h1>
          <p className="text-[17px] md:text-[20px] text-[#86868b] leading-relaxed max-w-2xl mx-auto font-light mb-12">
            Curated sequences of courses built around real certifications and real career outcomes. Pick a path. Follow the roadmap. Get certified.
          </p>

          <div className="flex flex-wrap justify-center gap-12 mt-12 border-t border-white/10 pt-8">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-extrabold text-[#f5f5f7] tracking-tight">7</div>
              <div className="text-[13px] text-[#86868b] mt-1">Career Paths</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-extrabold text-[#f5f5f7] tracking-tight">180+</div>
              <div className="text-[13px] text-[#86868b] mt-1">Hours of Content</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-extrabold text-[#f5f5f7] tracking-tight">12</div>
              <div className="text-[13px] text-[#86868b] mt-1">Certifications Covered</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-extrabold text-[#f5f5f7] tracking-tight">4,200+</div>
              <div className="text-[13px] text-[#86868b] mt-1">Students Enrolled</div>
            </div>
          </div>
        </div>
      </section>

      {/* FILTER BAR */}
      <div className="bg-[#f5f5f7] border-b border-[#d2d2d7] sticky top-[52px] z-40 px-6 overflow-x-auto">
        <div className="max-w-[1080px] mx-auto flex items-center gap-2 py-3.5 scrollbar-none">
          {filterChips.map((chip) => (
            <button
              key={chip.id}
              onClick={() => setFilter(chip.id)}
              className={`flex-shrink-0 px-4 py-1.5 rounded-full text-[13px] font-semibold transition-all border ${
                filter === chip.id
                  ? "bg-[#0071e3] border-[#0071e3] text-white"
                  : "bg-white border-[#d2d2d7] text-[#1d1d1f] hover:border-[#0071e3] hover:text-[#0071e3]"
              }`}
            >
              {chip.label}
            </button>
          ))}
        </div>
      </div>

      {/* MAIN CONTENT */}
      <section className="py-20 px-6 max-w-[1080px] mx-auto">
        {/* FEATURED CARD */}
        {showFeatured && featuredPath && (
          <div className="mb-16">
            <p className="text-[13px] font-semibold text-[#0071e3] uppercase tracking-wider mb-2">Featured Path</p>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-2 text-[#1d1d1f]">Most popular this month</h2>
            <p className="text-[#6e6e73] mb-8 text-[16px]">Our most-enrolled path — and for good reason. This sequence takes you from zero to cloud-ready Microsoft engineer.</p>

            <div className="bg-black rounded-3xl overflow-hidden grid grid-cols-1 md:grid-cols-2 min-h-[380px] transition-shadow duration-300 hover:shadow-xl relative border border-white/5">
              <div className="p-8 md:p-12 flex flex-col justify-between">
                <div>
                  <div className="inline-flex items-center gap-1.5 bg-[#0071e3]/20 border border-[#0071e3]/35 text-[#40a9ff] px-3.5 py-1 rounded-full text-xs font-semibold tracking-wider uppercase mb-6">
                    ★ Most Popular
                  </div>
                  <div className="text-[13px] font-semibold text-[#0071e3] mb-2">{featuredPath.num}</div>
                  <h3 className="text-3xl md:text-4xl font-black text-[#f5f5f7] leading-tight mb-4">{featuredPath.title}</h3>
                  <p className="text-[15px] text-[#86868b] leading-relaxed mb-6 font-light">{featuredPath.desc}</p>
                  <div className="flex flex-wrap gap-2 mb-8">
                    {featuredPath.pills.map((pill, idx) => (
                      <span key={idx} className="text-[11px] font-medium bg-white/10 text-[#c7c7cc] px-3 py-1 rounded-full border border-white/10">
                        {pill}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-4 flex-wrap">
                  <button
                    onClick={() => navigate("/courses")}
                    className="inline-flex items-center gap-2 bg-[#0071e3] text-white px-6 py-3 rounded-full text-sm font-bold hover:bg-[#0077ed] transition-all cursor-pointer shadow-md"
                  >
                    Start Path →
                  </button>
                  <span className="text-[13px] text-[#86868b]">
                    {featuredPath.coursesCount} courses · {featuredPath.duration} · {featuredPath.level}
                  </span>
                </div>
              </div>
              <div className="relative flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#0a1628] via-[#1a2d4a] to-[#0a1628] py-16">
                <div className="text-center z-10">
                  <span className="text-[96px] block mb-4 filter drop-shadow-[0_0_35px_rgba(0,113,227,0.5)]">
                    {featuredPath.icon}
                  </span>
                  <div className="flex gap-6 justify-center">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-[#f5f5f7]">{featuredPath.coursesCount}</div>
                      <div className="text-[11px] text-[#86868b]">Courses</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-[#f5f5f7]">{featuredPath.duration}</div>
                      <div className="text-[11px] text-[#86868b]">Content</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-[#f5f5f7]">{featuredPath.certs}</div>
                      <div className="text-[11px] text-[#86868b]">Certs</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ALL PATHS GRID */}
        <div>
          <p className="text-[13px] font-semibold text-[#0071e3] uppercase tracking-wider mb-2">All Paths</p>
          <div className="flex items-end justify-between border-b border-[#d2d2d7] pb-4 mb-8">
            <h2 className="text-3xl font-extrabold tracking-tight text-[#1d1d1f] m-0">Choose your direction.</h2>
            <span className="text-sm text-[#86868b]">{filteredPaths.length} paths available</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {filteredPaths.map((path) => (
                <motion.div
                  key={path.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  onClick={() => navigate("/courses")}
                  className="border border-[#d2d2d7] rounded-3xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-[#0071e3] cursor-pointer bg-white flex flex-col"
                >
                  <div className={`h-[140px] flex items-center justify-center relative overflow-hidden bg-gradient-to-br ${path.bgClass}`}>
                    <span className="absolute top-[14px] left-[16px] text-[11px] font-bold text-white/40 tracking-wider">
                      {path.num}
                    </span>
                    <span className="absolute top-[12px] right-[12px] bg-black/50 backdrop-blur-md text-[#c7c7cc] text-[10px] font-semibold px-2.5 py-0.5 rounded-full tracking-wider">
                      {path.level}
                    </span>
                    <span className="text-[56px] filter drop-shadow-[0_4px_16px_rgba(0,0,0,0.5)] z-10">
                      {path.icon}
                    </span>
                  </div>
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="text-lg font-bold text-[#1d1d1f] mb-2">{path.title}</h4>
                      <p className="text-[13px] text-[#6e6e73] leading-relaxed mb-4">{path.desc}</p>
                      <div className="flex flex-wrap gap-1.5 mb-6">
                        {path.pills.map((pill, idx) => (
                          <span key={idx} className="text-[10px] font-medium bg-[#f5f5f7] text-[#1d1d1f] px-2.5 py-0.5 rounded-full">
                            {pill}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center justify-between border-t border-[#f5f5f7] pt-4 mt-auto">
                      <div className="flex gap-3 text-xs text-[#86868b]">
                        <span><strong>{path.coursesCount}</strong> courses</span>
                        <span><strong>{path.duration}</strong></span>
                      </div>
                      <span className="text-[13px] font-semibold text-[#0071e3] flex items-center gap-0.5 group">
                        Start <span className="transition-transform group-hover:translate-x-1">›</span>
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="bg-[#f5f5f7] py-20 px-6">
        <div className="max-w-[1080px] mx-auto">
          <p className="text-[13px] font-semibold text-[#0071e3] uppercase tracking-wider text-center mb-2">How It Works</p>
          <h2 className="text-3xl md:text-4xl font-extrabold text-center tracking-tight mb-12">From zero to certified<br />in four steps.</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { num: 1, icon: "🎯", title: "Pick Your Path", desc: "Choose a career direction aligned to your goals — whether that's your first IT role or your next certification." },
              { num: 2, icon: "📚", title: "Follow the Roadmap", desc: "Each path sequences courses from fundamentals to advanced topics — no guesswork about what to learn next." },
              { num: 3, icon: "🔬", title: "Practice in Labs", desc: "Reinforce every concept in real virtual labs and practice exams built around the actual certification objectives." },
              { num: 4, icon: "🏅", title: "Get Certified", desc: "Walk into your exam confident. Earn your cert. Level up your career — and come back for the next path." },
            ].map((step) => (
              <div key={step.num} className="text-center p-4">
                <div className="w-12 h-12 rounded-full bg-[#0071e3] text-white text-lg font-bold flex items-center justify-center mx-auto mb-6">
                  {step.num}
                </div>
                <div className="text-4xl mb-4">{step.icon}</div>
                <h4 className="text-[17px] font-bold mb-2">{step.title}</h4>
                <p className="text-sm text-[#6e6e73] leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CERTIFICATIONS */}
      <section className="bg-black py-20 px-6 text-white border-t border-white/5">
        <div className="max-w-[1080px] mx-auto text-center">
          <p className="text-[13px] font-semibold text-[#0071e3] uppercase tracking-wider mb-2">Certifications Covered</p>
          <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-2 text-[#f5f5f7]">Industry-recognised<br />credentials.</h2>
          <p className="text-[#86868b] text-[16px] mb-12 max-w-xl mx-auto">Every path is built around real vendor certifications that employers actively look for.</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: "🪟", name: "MCSA / MCP", org: "Microsoft" },
              { icon: "☁️", name: "AZ-900 / AZ-104 / AZ-305", org: "Microsoft Azure" },
              { icon: "🌐", name: "CCNA", org: "Cisco" },
              { icon: "🔒", name: "Security+ / CySA+", org: "CompTIA" },
              { icon: "🐧", name: "LPIC-1 / LPIC-2", org: "Linux Professional Institute" },
              { icon: "🌐", name: "Network+", org: "CompTIA" },
              { icon: "⚙️", name: "Azure DevOps", org: "Microsoft" },
              { icon: "🤖", name: "AI-900", org: "Microsoft Azure AI" },
            ].map((cert, idx) => (
              <div key={idx} className="bg-[#1d1d1f] border border-white/5 rounded-2xl p-6 text-center transition-all duration-200 hover:border-[#0071e3]/50 hover:bg-[#222]">
                <span className="text-4xl mb-4 block">{cert.icon}</span>
                <div className="font-semibold text-[15px] text-[#f5f5f7] mb-1">{cert.name}</div>
                <div className="text-xs text-[#86868b]">{cert.org}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STUDENT STORIES */}
      <section className="bg-white py-24 px-6">
        <div className="max-w-[900px] mx-auto">
          <p className="text-[13px] font-semibold text-[#0071e3] uppercase tracking-wider text-center mb-2">Student Stories</p>
          <h2 className="text-3xl font-extrabold text-center tracking-tight mb-12">Real results,<br />real careers.</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { path: "Microsoft Path", rating: "★★★★★", text: `"I completed the Microsoft Engineer path in 4 months while working full-time. Passed my AZ-104 on the first attempt and got a promotion two weeks later."`, author: "Rahul Mehta", role: "Systems Engineer, Pune", avatar: "R", avatarBg: "from-[#0071e3] to-[#00d4ff]" },
              { path: "Linux Path", rating: "★★★★★", text: `"The Linux Admin path is incredibly well-structured. Went from a Windows-only admin to confidently managing RHEL servers. The labs made all the difference."`, author: "Sara Al-Farsi", role: "IT Administrator, Dubai", avatar: "S", avatarBg: "from-[#e95420] to-[#ffd60a]" },
              { path: "Security Path", rating: "★★★★★", text: `"Bhavin's teaching style is clear and never overwhelming. I completed Security+ and CySA+ within 6 months. Now working as a SOC analyst."`, author: "Arjun Krishnan", role: "SOC Analyst, Bengaluru", avatar: "A", avatarBg: "from-[#107c10] to-[#00bcf2]" },
            ].map((story, idx) => (
              <div key={idx} className="bg-[#f5f5f7] rounded-2xl p-6 relative flex flex-col justify-between">
                <span className="absolute top-[20px] right-[20px] bg-[#e8f1fb] text-[#0071e3] text-[10px] font-semibold px-2.5 py-0.5 rounded-full">
                  {story.path}
                </span>
                <div>
                  <div className="text-[#ffd60a] text-sm tracking-wider mb-3">{story.rating}</div>
                  <p className="text-[15px] text-[#1d1d1f] leading-relaxed mb-6 font-light">{story.text}</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${story.avatarBg} text-white font-bold flex items-center justify-center text-[15px]`}>
                    {story.avatar}
                  </div>
                  <div>
                    <div className="text-[13px] font-semibold text-[#1d1d1f]">{story.author}</div>
                    <div className="text-xs text-[#86868b]">{story.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA BAND */}
      <section className="bg-[#0071e3] py-20 px-6 text-center text-white">
        <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-4">Pick your path.<br />Start today.</h2>
        <p className="text-[17px] text-white/75 mb-8 max-w-md mx-auto">Join thousands of IT professionals who chose structure over guesswork.</p>
        <button
          onClick={() => navigate("/courses")}
          className="bg-white text-[#0071e3] px-8 py-3.5 rounded-full font-bold text-[16px] hover:opacity-90 transition-all cursor-pointer border-none shadow-md"
        >
          Browse All Paths
        </button>
      </section>
    </div>
  );
}
