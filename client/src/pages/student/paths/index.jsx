import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
    Laptop, 
    Clock, 
    GraduationCap, 
    Users, 
    Shield, 
    Globe, 
    Terminal, 
    Server, 
    Cpu, 
    Search, 
    ArrowRight, 
    Star, 
    CheckCircle2,
    Map,
    Award,
    Compass,
    Target
} from "lucide-react";
import { Link } from "react-router-dom";

function PathsPage() {
    const [activeFilter, setActiveFilter] = useState("all");

    const reveal = {
        initial: { opacity: 0, y: 30 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true },
        transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
    };

    const stats = [
        { num: "7", label: "Career Clusters" },
        { num: "240+", label: "Labs Available" },
        { num: "12", label: "Certification Nodes" },
        { num: "4.8/5", label: "Path Satisfaction" },
    ];

    const filters = [
        { id: "all", label: "Discovery" },
        { id: "microsoft", label: "🪟 Microsoft" },
        { id: "linux", label: "🐧 Linux" },
        { id: "networking", label: "🌐 Networking" },
        { id: "cloud", label: "☁️ Azure" },
        { id: "security", label: "🔒 Security" },
        { id: "devops", label: "⚙️ DevOps" },
    ];

    const paths = [
        {
            id: 2,
            title: "Linux Administrator",
            desc: "Command line mastery, shell scripting, service management, and LPIC certification prep. Build the skills every Linux sysadmin needs.",
            category: "linux",
            icon: "🐧",
            level: "Tier 1",
            courses: 5,
            duration: "58h",
            pills: ["CLI Mastery", "Bash Scripting", "Services", "LPIC-1"],
            color: "from-[#1a1a0a] to-[#3a3010]"
        },
        {
            id: 3,
            title: "Network Engineer",
            desc: "Routing, switching, firewalls, and subnetting — complete CCNA and CompTIA Network+ exam preparation with hands-on labs.",
            category: "networking",
            icon: "🌐",
            level: "Tier 2",
            courses: 4,
            duration: "44h",
            pills: ["TCP/IP", "VLANs", "Routing", "CCNA"],
            color: "from-[#0a1a28] to-[#103050]"
        },
        {
            id: 4,
            title: "Cloud Architect",
            desc: "Design and deploy scalable cloud solutions on Azure. From AZ-900 fundamentals through AZ-104 and AZ-305 architect certification.",
            category: "cloud",
            icon: "☁️",
            level: "Tier 3",
            courses: 5,
            duration: "54h",
            pills: ["Azure", "Identity", "Compute", "AZ-305"],
            color: "from-[#0a1e2e] to-[#08305a]"
        },
        {
            id: 5,
            title: "Cybersecurity Analyst",
            desc: "From threat analysis to incident response, covering CompTIA Security+, CySA+, and ethical hacking fundamentals with real-world scenarios.",
            category: "security",
            icon: "🔒",
            level: "Advanced",
            courses: 6,
            duration: "68h",
            pills: ["Security+", "Ethical Hacking", "SIEM", "CySA+"],
            color: "from-[#0a1a0a] to-[#0f3020]"
        },
        {
            id: 6,
            title: "DevOps Engineer",
            desc: "CI/CD pipelines, containers, infrastructure as code, and monitoring. Hands-on with Docker, Kubernetes, Ansible, and Azure DevOps.",
            category: "devops",
            icon: "⚙️",
            level: "Intermediate",
            courses: 5,
            duration: "60h",
            pills: ["Docker", "K8s", "Ansible", "CI/CD"],
            color: "from-[#1a0a28] to-[#35155a]"
        }
    ];

    const filteredPaths = paths.filter(p => activeFilter === "all" || p.category === activeFilter);

    return (
        <div className="min-h-screen bg-white font-['Inter'] selection:bg-[#0071e3]/20">
            {/* ─── PAGE HERO ───────────────────────────────────────── */}
            <section className="bg-[linear-gradient(160deg,#000_0%,#1a1a2e_55%,#000_100%)] pt-32 pb-24 px-6 relative overflow-hidden text-center">
                <div className="absolute w-[800px] h-[600px] rounded-full bg-[radial-gradient(circle,rgba(0,113,227,0.22)_0%,transparent_70%)] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none blur-[100px]" />
                <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                    className="relative z-10"
                >
                    <p className="text-[11px] font-black text-[#0071e3] uppercase tracking-[0.4em] mb-6 flex items-center justify-center gap-3">
                        <Map size={14} /> Knowledge Cartography
                    </p>
                    <h1 className="text-[clamp(42px,7vw,88px)] font-black text-[#f5f5f7] leading-[0.95] tracking-[-3px] mb-8 max-w-[900px] mx-auto">
                        Precision <span className="italic bg-[linear-gradient(90deg,#0071e3,#00d4ff)] bg-clip-text text-transparent">Roadmaps</span><br />for Modern Careers.
                    </h1>
                    <p className="text-[19px] text-[#86868b] leading-[1.6] max-w-[540px] mx-auto font-light mb-16">
                        Curated sequences of technical nodes built around official certification objectives and real-world performance protocols.
                    </p>

                    <div className="flex flex-wrap justify-center gap-16">
                        {stats.map((stat, i) => (
                            <div key={i} className="text-center group">
                                <div className="text-[36px] font-black text-[#f5f5f7] tracking-tighter group-hover:scale-110 transition-transform duration-500">{stat.num}</div>
                                <div className="text-[11px] font-black text-[#444] uppercase tracking-widest mt-2">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </section>

            {/* ─── SYSDEMIC FILTERS ─────────────────────────────────── */}
            <div className="sticky top-[52px] z-[90] bg-[#f5f5f7]/95 backdrop-blur-xl border-b border-[#000]/[0.05] shadow-sm">
                <div className="max-w-[1080px] mx-auto flex items-center justify-center gap-3 py-4 px-6 overflow-x-auto no-scrollbar">
                    <Compass size={16} className="text-[#86868b] mr-4 hidden md:block" />
                    {filters.map(f => (
                        <button
                            key={f.id}
                            onClick={() => setActiveFilter(f.id)}
                            className={`h-10 px-6 rounded-full text-[11px] font-black uppercase tracking-widest whitespace-nowrap border transition-all active:scale-95 ${activeFilter === f.id ? 'bg-[#0071e3] border-[#0071e3] text-white shadow-xl shadow-blue-500/20' : 'bg-white border-[#d2d2d7] text-[#1d1d1f] hover:border-[#0071e3] hover:text-[#0071e3]'}`}
                        >
                            {f.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* ─── MAIN PATHS GRID ──────────────────────────────────── */}
            <section className="py-24 px-6 overflow-hidden">
                <div className="max-w-[1080px] mx-auto">
                    
                    {/* FEATURED INTELLIGENCE */}
                    {(activeFilter === 'all' || activeFilter === 'microsoft') && (
                        <motion.div {...reveal} className="mb-24">
                            <div className="text-[11px] font-black text-[#0071e3] uppercase tracking-[0.4em] mb-10 flex items-center gap-6">
                                Priority Intelligence <div className="h-[1px] flex-1 bg-[#000]/[0.05]" />
                            </div>

                            <div className="bg-black rounded-[48px] overflow-hidden grid grid-cols-1 md:grid-cols-[1fr_420px] min-h-[400px] shadow-[0_32px_64px_rgba(0,0,0,0.2)] relative group cursor-pointer hover:-translate-y-2 transition-all duration-700">
                                <div className="p-16 flex flex-col justify-between">
                                    <div>
                                        <div className="inline-flex items-center gap-2 bg-[#0071e3]/20 border border-[#0071e3]/30 text-[#40a9ff] px-4 py-1.5 rounded-full text-[10px] font-black mb-8 tracking-[0.2em] uppercase"><Award size={14} className="animate-pulse" /> Cluster 01: Priority</div>
                                        <h3 className="text-[clamp(32px,4vw,48px)] font-black text-[#f5f5f7] leading-[0.95] mb-6 tracking-tight">Microsoft Stack Master.</h3>
                                        <p className="text-[16px] text-[#86868b] leading-[1.7] max-w-[420px] mb-10 font-light">Comprehensive roadmap covering Azure infrastructure, Active Directory federation, and Intune device lifecycle management.</p>
                                        <div className="flex flex-wrap gap-2.5 mb-10">
                                            {["Server 2025", "AD FS", "Azure Arc", "Intune", "Sentinel"].map((p, i) => (
                                                <span key={i} className="text-[10px] font-black uppercase tracking-widest bg-white/[0.03] text-[#c7c7cc] border border-white/[0.08] px-4 py-1.5 rounded-full group-hover:border-[#0071e3]/30 transition-colors">{p}</span>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-8">
                                        <button className="h-14 px-10 bg-[#0071e3] hover:bg-[#0077ed] text-white text-[13px] font-black uppercase tracking-[0.2em] rounded-2xl transition-all shadow-xl shadow-[#0071e3]/20 flex items-center gap-3 active:scale-95">Initiate Path <ArrowRight size={18} /></button>
                                        <div className="flex flex-col">
                                          <span className="text-[14px] font-black text-white leading-none">72 Modules</span>
                                          <span className="text-[11px] text-[#86868b] mt-1 font-bold uppercase tracking-wider">Expertise Tier 3</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="relative bg-[#111] overflow-hidden">
                                     <div className="absolute inset-0 bg-gradient-to-br from-[#0a1628] to-[#1e3a5f] opacity-80" />
                                     <div className="absolute inset-0 flex items-center justify-center filter drop-shadow-[0_0_40px_rgba(0,113,227,0.4)] group-hover:scale-110 transition-transform duration-1000">
                                        <span className="text-[160px] select-none">🪟</span>
                                     </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* DISCOVERY GRID */}
                    <div>
                        <div className="flex items-end justify-between mb-12">
                            <div>
                                <div className="text-[11px] font-black text-[#0071e3] uppercase tracking-[0.4em] mb-4 flex items-center gap-4">
                                    Strategic Repositories <div className="h-[1px] w-24 bg-[#000]/[0.05]" />
                                </div>
                                <h2 className="text-[38px] font-black text-[#1d1d1f] tracking-tighter leading-none">Architect your trajectory.</h2>
                            </div>
                            <span className="text-[12px] font-black text-[#86868b] uppercase tracking-widest hidden md:block opacity-40">{filteredPaths.length} Active Nodes</span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filteredPaths.map((path, i) => (
                                <motion.div 
                                    key={path.id}
                                    {...reveal}
                                    transition={{ delay: i * 0.05 }}
                                    className="bg-white border border-[#000]/[0.04] rounded-[40px] overflow-hidden group cursor-pointer shadow-[0_4px_30px_rgba(0,0,0,0.03)] hover:shadow-[0_32px_64px_rgba(0,0,0,0.1)] hover:border-[#0071e3]/20 transition-all duration-500 hover:-translate-y-2"
                                >
                                    <div className={`h-[160px] relative bg-gradient-to-br ${path.color} flex items-center justify-center overflow-hidden`}>
                                        <div className="absolute top-6 left-8 flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-white opacity-40" />
                                            <span className="text-[10px] font-black text-white/40 tracking-[0.2em] uppercase">Node 0x0{path.id}</span>
                                        </div>
                                        <div className="absolute bottom-6 right-8 text-[9px] font-black bg-black/40 backdrop-blur-md text-white/80 px-4 py-1.5 rounded-full uppercase tracking-widest border border-white/10 group-hover:bg-[#0071e3] transition-colors">{path.level}</div>
                                        <span className="text-7xl group-hover:scale-110 transition-transform duration-1000 drop-shadow-2xl select-none filter group-hover:brightness-110">{path.icon}</span>
                                    </div>
                                    <div className="p-10">
                                        <h3 className="text-[20px] font-black text-[#1d1d1f] mb-4 leading-tight tracking-tight group-hover:text-[#0071e3] transition-colors">{path.title}</h3>
                                        <p className="text-[14px] text-[#6e6e73] leading-[1.7] mb-8 line-clamp-2 md:line-clamp-3 font-light">{path.desc}</p>
                                        <div className="flex flex-wrap gap-2.5 mb-10">
                                            {path.pills.map((p, pi) => (
                                                <span key={pi} className="text-[10px] font-black uppercase tracking-wider bg-[#f5f5f7] text-[#1d1d1f] px-3.5 py-1.5 rounded-xl border border-transparent group-hover:border-[#0071e3]/10 transition-all">{p}</span>
                                            ))}
                                        </div>
                                        <div className="flex items-center justify-between pt-8 border-t border-[#f5f5f7]">
                                            <div className="flex gap-6">
                                                <div className="flex flex-col">
                                                    <span className="text-[14px] font-black text-[#1d1d1f] tracking-tighter">{path.courses}</span>
                                                    <span className="text-[10px] font-black text-[#86868b] uppercase tracking-widest">Nodes</span>
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-[14px] font-black text-[#1d1d1f] tracking-tighter">{path.duration}</span>
                                                    <span className="text-[10px] font-black text-[#86868b] uppercase tracking-widest">Audit</span>
                                                </div>
                                            </div>
                                            <div className="w-12 h-12 rounded-2xl bg-[#f5f5f7] group-hover:bg-[#0071e3] group-hover:text-white flex items-center justify-center transition-all shadow-sm group-hover:shadow-lg group-hover:shadow-blue-500/30 group-hover:-translate-y-1">
                                                <ArrowRight size={20} />
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* SYSDEMIC SEQUENCE: HOW IT WORKS */}
            <section className="bg-[#f5f5f7] py-32 px-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#0071e3]/5 rounded-full blur-[100px] translate-x-1/2 -translate-y-1/2" />
                <div className="max-w-[1080px] mx-auto relative z-10">
                    <div className="text-center mb-24">
                        <div className="text-[11px] font-black text-[#0071e3] uppercase tracking-[0.4em] mb-6">Execution Logic</div>
                        <h2 className="text-[42px] font-black text-[#1d1d1f] tracking-tighter leading-[0.95] mb-6">Zero to Mastery in four cycles.</h2>
                        <p className="text-[18px] text-[#86868b] max-w-[500px] mx-auto font-light leading-relaxed">Each roadmap sequences courses from fundamentals to professional-grade expertise.</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
                        {[
                            { step: "01", icon: <Target size={24} className="text-[#0071e3]" />, title: "Vector Selection", desc: "Choose a career trajectory aligned to your professional objectives — from Helpdesk to Architect." },
                            { step: "02", icon: <Compass size={24} className="text-[#0071e3]" />, title: "Roadmap Sync", desc: "Each path sequences technical nodes from fundamentals to advanced. No fragmented knowledge." },
                            { step: "03", icon: <Terminal size={24} className="text-[#0071e3]" />, title: "Lab Protocol", desc: "Reinforce every node in high-fidelity virtual labs built around real global certification labs." },
                            { step: "04", icon: <Award size={24} className="text-[#0071e3]" />, title: "Certification", desc: "Pass your exam with high confidence. Earn globally recognized credentials. Iterate. Upgrade." },
                        ].map((s, i) => (
                            <motion.div key={i} {...reveal} transition={{ delay: i * 0.1 }} className="text-left p-10 bg-white rounded-[40px] shadow-[0_8px_30px_rgba(0,0,0,0.02)] border border-transparent hover:border-[#0071e3]/10 transition-all duration-500 group">
                                <div className="text-[11px] font-black text-[#0071e3]/20 uppercase tracking-[0.3em] mb-8 group-hover:text-[#0071e3]/40 transition-colors">CYCLE {s.step}</div>
                                <div className="w-16 h-16 rounded-[20px] bg-[#f5f5f7] flex items-center justify-center mb-8 group-hover:bg-[#0071e3]/5 transition-all group-hover:scale-110">{s.icon}</div>
                                <h3 className="text-[18px] font-black mb-4 tracking-tight leading-tight">{s.title}</h3>
                                <p className="text-[14px] text-[#6e6e73] leading-[1.7] font-light">{s.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA: INITIATE SYNC */}
            <section className="bg-[#0071e3] py-32 px-6 text-center text-white relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent" />
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-white opacity-5 rounded-full -translate-y-1/2 translate-x-1/2 blur-[100px] group-hover:opacity-10 transition-opacity duration-1000" />
                <motion.div {...reveal} className="max-w-[700px] mx-auto relative z-10">
                    <h2 className="text-[clamp(32px,6vw,68px)] font-black tracking-tighter leading-[0.9] mb-10">Select your Vector.<br />Synchronize Mastery.</h2>
                    <p className="text-[19px] text-white/70 font-light mb-14 max-w-[500px] mx-auto leading-relaxed">Join 4,200+ professionals who prioritize structured roadmap logic over random learning.</p>
                    <button className="h-20 px-14 bg-white text-[#0071e3] rounded-[24px] text-[15px] font-black uppercase tracking-[0.3em] hover:scale-105 transition-all shadow-2xl active:scale-95 flex items-center gap-4 mx-auto group/btn">
                        Discover All Clusters <Search size={20} className="transition-transform group-hover/btn:scale-110" />
                    </button>
                    <div className="mt-14 pt-14 border-t border-white/10 flex flex-wrap justify-center gap-12 text-[10px] font-black uppercase tracking-[0.3em] text-white/40">
                      <span>Azure Cloud Architecture</span>
                      <span>Linux SysAdmin Mastery</span>
                      <span>Enterprise Networking (CCNA)</span>
                    </div>
                </motion.div>
            </section>
        </div>
    );
}

export default PathsPage;
