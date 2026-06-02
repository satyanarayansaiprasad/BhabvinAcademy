import React from "react";
import { useNavigate } from "react-router-dom";

function AboutUsPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white font-sans text-[#1d1d1f]">
      
      {/* ─── PAGE HERO ─────────────────────────────────────── */}
      <section className="relative min-h-[88vh] bg-gradient-to-br from-black via-[#1a1a2e] to-black flex flex-col items-center justify-center text-center px-6 overflow-hidden">
        <div className="absolute w-[700px] h-[700px] rounded-full bg-[radial-gradient(circle,rgba(0,113,227,0.22)_0%,transparent_70%)] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
        <div className="absolute w-[300px] h-[300px] rounded-full bg-[radial-gradient(circle,rgba(0,212,255,0.1)_0%,transparent_70%)] bottom-[15%] right-[10%] pointer-events-none" />
        
        <p className="text-[13px] font-medium text-[#0071e3] tracking-[0.06em] uppercase mb-[18px] z-10">About BhavinAcademy</p>
        <h1 className="text-[clamp(42px,6vw,82px)] font-extrabold text-[#f5f5f7] tracking-[-2.5px] leading-[1.04] mb-[22px] max-w-[820px] z-10">
          Built by a practitioner.<br />
          <em className="not-italic bg-gradient-to-r from-[#0071e3] to-[#00d4ff] bg-clip-text text-transparent">For practitioners.</em>
        </h1>
        <p className="text-[clamp(16px,2vw,20px)] text-[#86868b] leading-[1.65] max-w-[580px] font-light z-10">
          BhavinAcademy is built on a fundamental: Master the depth, scale the width with applied knowledge.
        </p>
      </section>

      {/* ─── STORY SECTION ─────────────────────────────────── */}
      <section className="bg-white py-[100px] px-6">
        <div className="max-w-[1080px] mx-auto grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-[72px] items-start">
          
          {/* Story Content */}
          <div className="flex flex-col">
            <p className="text-[13px] font-semibold text-[#0071e3] uppercase tracking-[0.06em] mb-[10px]">The Story</p>
            <h2 className="text-[clamp(30px,4vw,48px)] font-extrabold tracking-[-1.5px] text-[#1d1d1f] leading-[1.1] mb-[28px]">
              Not just a teacher.<br />A career <em className="not-italic text-[#0071e3]">witness</em>.
            </h2>
            <p className="text-[16px] text-[#6e6e73] leading-[1.8] mb-[18px]">
              I started my IT career the hard way. I was self-taught - studying late into the night after a full-time job, chasing technologies that felt impossibly distant, and implementing everything I learned. Every lab mistake, every exam I failed before I passed, and every concept that finally "clicked" is woven into the DNA of BhavinAcademy today.
            </p>
            <p className="text-[16px] text-[#6e6e73] leading-[1.8] mb-[18px]">
              After <strong className="text-[#1d1d1f] font-semibold">15+ years in enterprise IT</strong>; spanning Windows infrastructure, Active Directory, and Linux administration to networking and cloud security, I realized that most people in the industry strive for the right path through applied knowledge and a simplified learning methodology. Answering a long-standing calling to support this mission, I have dedicated myself to teaching the skills I’ve mastered to help others walk their path efficiently.
            </p>
            <p className="text-[16px] text-[#6e6e73] leading-[1.8] mb-[18px]">
              This platform is the result of my passion for IT, and Life Enhancement. Now, it’s your turn to put it to work for your career and growth.
            </p>
            <p className="text-[16px] text-[#1d1d1f] font-semibold mb-[18px]">
              Wish you a great journey ahead!
            </p>
            <button onClick={() => navigate("/courses")} className="inline-flex items-center gap-[6px] text-[15px] font-semibold text-[#0071e3] hover:underline bg-none border-none p-0 text-left self-start mt-[10px]">
              Explore all courses ›
            </button>
          </div>

          {/* Profile Card */}
          <div className="bg-black rounded-[24px] p-[36px_32px] text-[#f5f5f7] sticky top-[80px] overflow-hidden border border-white/5 shadow-2xl">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            <div className="w-[88px] h-[88px] rounded-full bg-gradient-to-r from-[#0071e3] to-[#00d4ff] flex items-center justify-center text-[32px] font-extrabold text-white mb-[20px] tracking-[-1px]">
              BK
            </div>
            <div className="text-[22px] font-extrabold tracking-[-0.5px] mb-[4px]">Bhavin Khatri</div>
            <div className="text-[13px] text-[#86868b] leading-tight mb-[24px]">Founder & Lead Instructor<br />BhavinAcademy</div>
            
            <div className="h-[1px] bg-white/8 mb-[22px]" />
            
            <div className="space-y-[14px]">
              <div className="flex items-center gap-[12px]">
                <div className="w-[32px] h-[32px] rounded-[8px] bg-[#0071e3]/18 border border-[#0071e3]/25 flex items-center justify-center text-[15px] shrink-0">🧑‍💻</div>
                <div className="text-[13px] text-[#c7c7cc] leading-[1.4]"><strong className="text-[#f5f5f7] font-semibold">15+ years</strong> in enterprise IT</div>
              </div>
              <div className="flex items-center gap-[12px]">
                <div className="w-[32px] h-[32px] rounded-[8px] bg-[#0071e3]/18 border border-[#0071e3]/25 flex items-center justify-center text-[15px] shrink-0">🏢</div>
                <div className="text-[13px] text-[#c7c7cc] leading-[1.4]"><strong className="text-[#f5f5f7] font-semibold">Worked in 7+ companies</strong></div>
              </div>
              <div className="flex items-center gap-[12px]">
                <div className="w-[32px] h-[32px] rounded-[8px] bg-[#0071e3]/18 border border-[#0071e3]/25 flex items-center justify-center text-[15px] shrink-0">🤝</div>
                <div className="text-[13px] text-[#c7c7cc] leading-[1.4]"><strong className="text-[#f5f5f7] font-semibold">Served 500+ customers</strong></div>
              </div>
              <div className="flex items-center gap-[12px]">
                <div className="w-[32px] h-[32px] rounded-[8px] bg-[#0071e3]/18 border border-[#0071e3]/25 flex items-center justify-center text-[15px] shrink-0">🎙️</div>
                <div className="text-[13px] text-[#c7c7cc] leading-[1.4]"><strong className="text-[#f5f5f7] font-semibold">Conducted 450+ training & events</strong></div>
              </div>
              <div className="flex items-center gap-[12px]">
                <div className="w-[32px] h-[32px] rounded-[8px] bg-[#0071e3]/18 border border-[#0071e3]/25 flex items-center justify-center text-[15px] shrink-0">🌍</div>
                <div className="text-[13px] text-[#c7c7cc] leading-[1.4]">Based in <strong className="text-[#f5f5f7] font-semibold">India</strong> · Teaching globally</div>
              </div>
            </div>

            <div className="flex flex-wrap gap-[6px] mt-[22px]">
              {["MCSA", "AZ-104", "CCNA", "LPIC-1", "Security+", "Network+", "AZ-900", "MS-900"].map((cert) => (
                <span key={cert} className="text-[11px] font-semibold bg-[#0071e3]/18 border border-[#0071e3]/30 text-[#40a9ff] px-[11px] py-[4px] rounded-[980px] tracking-wide">
                  {cert}
                </span>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* ─── NUMBERS BAND ──────────────────────────────────── */}
      <section className="bg-black py-[80px] px-6 text-white">
        <div className="max-w-[1080px] mx-auto">
          <p className="text-[13px] font-semibold text-[#0071e3] uppercase tracking-[0.06em] mb-[10px]">By the numbers</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-[1px] bg-white/7 rounded-[20px] overflow-hidden mt-[48px]">
            {[
              { label: "Years in enterprise IT", val: "15", icon: "🧑‍💻" },
              { label: "Companies worked in", val: "7", icon: "🏢" },
              { label: "Customers served", val: "500", icon: "🤝" },
              { label: "Training & events conducted", val: "450", icon: "🎙️" }
            ].map((stat, i) => (
              <div key={i} className="bg-black p-[40px_32px] relative overflow-hidden group">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(0,113,227,0.06)_0%,transparent_60%)] pointer-events-none" />
                <div className="text-[clamp(42px,5vw,64px)] font-black text-[#f5f5f7] leading-none mb-[6px] tracking-[-3px] relative z-10">
                  {stat.val}<span className="text-[0.55em] tracking-normal text-[#0071e3]">+</span>
                </div>
                <div className="text-[13px] text-[#86868b] leading-[1.5] relative z-10">{stat.label}</div>
                <div className="absolute top-[24px] right-[24px] text-[32px] opacity-10 select-none">{stat.icon}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── MISSION / VALUES ──────────────────────────────── */}
      <section className="bg-[#f5f5f7] py-[100px] px-6">
        <div className="max-w-[1080px] mx-auto">
          <div className="mb-[48px]">
            <p className="text-[13px] font-semibold text-[#0071e3] uppercase tracking-[0.06em] mb-[10px]">Our Mission</p>
            <h2 className="text-[clamp(28px,4vw,46px)] font-extrabold text-[#1d1d1f] tracking-[-1.5px] leading-[1.1] mt-[10px]">
              Every principle that<br />guides how we teach.
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-[16px]">
            {/* Value 1 */}
            <div className="bg-white rounded-[20px] p-[36px_30px] border border-transparent hover:border-[#0071e3] hover:shadow-[0_8px_32px_rgba(0,113,227,0.1)] hover:-translate-y-1 transition-all duration-[0.3s]">
              <div className="w-[52px] h-[52px] rounded-[14px] bg-gradient-to-br from-[#0071e3]/12 to-[#00d4ff]/8 border border-[#0071e3]/18 flex items-center justify-center text-[24px] mb-[20px]">
                🎯
              </div>
              <div className="text-[12px] font-bold text-[#0071e3] uppercase tracking-[0.06em] mb-[10px]">01</div>
              <div className="text-[20px] font-bold text-[#1d1d1f] mb-[10px] tracking-[-0.4px]">Exam-ready, job-ready</div>
              <div className="text-[14px] text-[#6e6e73] leading-[1.7]">
                Certifications open doors — but it's real-world competence that keeps them open. Every course is designed so that passing the exam and doing the job are the same outcome.
              </div>
            </div>

            {/* Value 2 */}
            <div className="bg-white rounded-[20px] p-[36px_30px] border border-transparent hover:border-[#0071e3] hover:shadow-[0_8px_32px_rgba(0,113,227,0.1)] hover:-translate-y-1 transition-all duration-[0.3s]">
              <div className="w-[52px] h-[52px] rounded-[14px] bg-gradient-to-br from-[#1d1d1f]/8 to-[#1d1d1f]/4 border border-black/8 flex items-center justify-center text-[24px] mb-[20px]">
                🔬
              </div>
              <div className="text-[12px] font-bold text-[#0071e3] uppercase tracking-[0.06em] mb-[10px]">02</div>
              <div className="text-[20px] font-bold text-[#1d1d1f] mb-[10px] tracking-[-0.4px]">Labs before lectures</div>
              <div className="text-[14px] text-[#6e6e73] leading-[1.7]">
                You don't learn to drive by reading a manual. Every concept is reinforced with a hands-on lab, because muscle memory and mental models are built in the terminal, not in a PDF.
              </div>
            </div>

            {/* Value 3 */}
            <div className="bg-white rounded-[20px] p-[36px_30px] border border-transparent hover:border-[#0071e3] hover:shadow-[0_8px_32px_rgba(0,113,227,0.1)] hover:-translate-y-1 transition-all duration-[0.3s]">
              <div className="w-[52px] h-[52px] rounded-[14px] bg-gradient-to-br from-[#1a3a2a]/10 to-[#30d158]/6 border border-[#30d158]/15 flex items-center justify-center text-[24px] mb-[20px]">
                🌱
              </div>
              <div className="text-[12px] font-bold text-[#0071e3] uppercase tracking-[0.06em] mb-[10px]">03</div>
              <div className="text-[20px] font-bold text-[#1d1d1f] mb-[10px] tracking-[-0.4px]">Fundamentals never expire</div>
              <div className="text-[14px] text-[#6e6e73] leading-[1.7]">
                Cloud providers come and go. Vendors rebrand their products. But TCP/IP, Active Directory concepts, and Linux process management have been relevant for decades — and will be for decades more.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── TEACHING PHILOSOPHY ────────────────────────────── */}
      <section className="bg-black py-[110px] px-6 text-center text-white relative overflow-hidden">
        <div className="absolute w-[500px] h-[300px] rounded-full bg-[radial-gradient(circle,rgba(0,113,227,0.15)_0%,transparent_70%)] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
        <div className="max-w-[800px] mx-auto relative z-10 flex flex-col items-center">
          <span className="text-[120px] line-height-[0.6] text-[#0071e3]/20 font-black mb-[28px] block font-serif leading-none">“</span>
          <p className="text-[clamp(20px,3vw,32px)] font-light text-[#f5f5f7] leading-[1.6] tracking-[-0.5px] mb-[36px]">
            "While technology shifts with every decade, your value remains constant through two rules: <strong className="text-white">Master the fundamentals</strong>, as they are timeless; and <strong className="text-white">keep learning</strong>, for the world never stops turning."
          </p>
          <div className="text-[14px] text-[#86868b] tracking-wider font-semibold">· Bhavin Khatri ·</div>
          <div className="text-[12px] text-[#86868b]/60 mt-1">Founder, BhavinAcademy</div>
        </div>
      </section>

      {/* ─── WHAT WE COVER ─────────────────────────────────── */}
      <section className="bg-white py-[100px] px-6">
        <div className="max-w-[1080px] mx-auto">
          <div>
            <p className="text-[13px] font-semibold text-[#0071e3] uppercase tracking-[0.06em] mb-[10px]">What We Cover</p>
            <h2 className="text-[clamp(32px,5vw,46px)] font-extrabold tracking-[-1.5px] text-[#1d1d1f] mb-[48px]">
              Six domains. One platform.
            </h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[16px]">
            
            {/* Domain 1 */}
            <div onClick={() => navigate("/courses")} className="rounded-[20px] p-[36px_32px] min-h-[200px] bg-gradient-to-br from-[#001830] to-[#003a6b] text-white hover:scale-[1.02] transition-transform duration-[0.3s] shadow-lg cursor-pointer">
              <span className="text-[40px] mb-[18px] block select-none">🪟</span>
              <div className="text-[18px] font-bold text-[#f5f5f7] mb-[8px] tracking-tight">Microsoft & Windows</div>
              <div className="text-[13px] text-[#f5f5f7]/50 leading-[1.6] mb-[16px]">
                Windows Server, Active Directory, Group Policy, Microsoft 365, Intune, and Azure identity.
              </div>
              <div className="flex flex-wrap gap-[6px]">
                {["Windows Server", "AD DS", "Microsoft 365", "Intune"].map((pill) => (
                  <span key={pill} className="text-[10px] font-semibold bg-white/9 text-white/80 px-[10px] py-[3px] rounded-[980px]">{pill}</span>
                ))}
              </div>
            </div>

            {/* Domain 2 */}
            <div onClick={() => navigate("/courses")} className="rounded-[20px] p-[36px_32px] min-h-[200px] bg-gradient-to-br from-[#1a0e00] to-[#3d2200] text-white hover:scale-[1.02] transition-transform duration-[0.3s] shadow-lg cursor-pointer">
              <span className="text-[40px] mb-[18px] block select-none">🐧</span>
              <div className="text-[18px] font-bold text-[#f5f5f7] mb-[8px] tracking-tight">Linux Administration</div>
              <div className="text-[13px] text-[#f5f5f7]/50 leading-[1.6] mb-[16px]">
                System administration, Bash scripting, service management, and LPIC certification prep.
              </div>
              <div className="flex flex-wrap gap-[6px]">
                {["Ubuntu", "RHEL", "Bash", "LPIC-1"].map((pill) => (
                  <span key={pill} className="text-[10px] font-semibold bg-white/9 text-white/80 px-[10px] py-[3px] rounded-[980px]">{pill}</span>
                ))}
              </div>
            </div>

            {/* Domain 3 */}
            <div onClick={() => navigate("/courses")} className="rounded-[20px] p-[36px_32px] min-h-[200px] bg-gradient-to-br from-[#001a30] to-[#003060] text-white hover:scale-[1.02] transition-transform duration-[0.3s] shadow-lg cursor-pointer">
              <span className="text-[40px] mb-[18px] block select-none">🌐</span>
              <div className="text-[18px] font-bold text-[#f5f5f7] mb-[8px] tracking-tight">Networking</div>
              <div className="text-[13px] text-[#f5f5f7]/50 leading-[1.6] mb-[16px]">
                Routing, switching, subnetting, firewalls — built around CCNA and CompTIA Network+ objectives.
              </div>
              <div className="flex flex-wrap gap-[6px]">
                {["Cisco IOS", "TCP/IP", "VLANs", "CCNA"].map((pill) => (
                  <span key={pill} className="text-[10px] font-semibold bg-white/9 text-white/80 px-[10px] py-[3px] rounded-[980px]">{pill}</span>
                ))}
              </div>
            </div>

            {/* Domain 4 */}
            <div onClick={() => navigate("/courses")} className="rounded-[20px] p-[36px_32px] min-h-[200px] bg-gradient-to-br from-[#00131f] to-[#002a40] text-white hover:scale-[1.02] transition-transform duration-[0.3s] shadow-lg cursor-pointer">
              <span className="text-[40px] mb-[18px] block select-none">☁️</span>
              <div className="text-[18px] font-bold text-[#f5f5f7] mb-[8px] tracking-tight">Cloud & Azure</div>
              <div className="text-[13px] text-[#f5f5f7]/50 leading-[1.6] mb-[16px]">
                Azure fundamentals through to administrator-level management of compute, storage, and networking.
              </div>
              <div className="flex flex-wrap gap-[6px]">
                {["AZ-900", "AZ-104", "ARM", "Azure AD"].map((pill) => (
                  <span key={pill} className="text-[10px] font-semibold bg-white/9 text-white/80 px-[10px] py-[3px] rounded-[980px]">{pill}</span>
                ))}
              </div>
            </div>

            {/* Domain 5 */}
            <div onClick={() => navigate("/courses")} className="rounded-[20px] p-[36px_32px] min-h-[200px] bg-gradient-to-br from-[#001a0a] to-[#003018] text-white hover:scale-[1.02] transition-transform duration-[0.3s] shadow-lg cursor-pointer">
              <span className="text-[40px] mb-[18px] block select-none">🔒</span>
              <div className="text-[18px] font-bold text-[#f5f5f7] mb-[8px] tracking-tight">Cybersecurity</div>
              <div className="text-[13px] text-[#f5f5f7]/50 leading-[1.6] mb-[16px]">
                Threat landscape, access control, encryption, and CompTIA Security+ exam preparation.
              </div>
              <div className="flex flex-wrap gap-[6px]">
                {["Security+", "IAM", "PKI", "SIEM"].map((pill) => (
                  <span key={pill} className="text-[10px] font-semibold bg-white/9 text-white/80 px-[10px] py-[3px] rounded-[980px]">{pill}</span>
                ))}
              </div>
            </div>

            {/* Domain 6 */}
            <div onClick={() => navigate("/courses")} className="rounded-[20px] p-[36px_32px] min-h-[200px] bg-gradient-to-br from-[#130020] to-[#2a0040] text-white hover:scale-[1.02] transition-transform duration-[0.3s] shadow-lg cursor-pointer">
              <span className="text-[40px] mb-[18px] block select-none">⚙️</span>
              <div className="text-[18px] font-bold text-[#f5f5f7] mb-[8px] tracking-tight">DevOps & Automation</div>
              <div className="text-[13px] text-[#f5f5f7]/50 leading-[1.6] mb-[16px]">
                Infrastructure as code, PowerShell automation, Ansible, and CI/CD pipelines for sysadmins.
              </div>
              <div className="flex flex-wrap gap-[6px]">
                {["PowerShell", "Ansible", "Terraform", "Git"].map((pill) => (
                  <span key={pill} className="text-[10px] font-semibold bg-white/9 text-white/80 px-[10px] py-[3px] rounded-[980px]">{pill}</span>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ─── JOURNEY / TIMELINE ─────────────────────────────── */}
      <section className="bg-[#f5f5f7] py-[100px] px-6">
        <div className="max-w-[1080px] mx-auto">
          <div>
            <p className="text-[13px] font-semibold text-[#0071e3] uppercase tracking-[0.06em] mb-[10px]">The Journey</p>
            <h2 className="text-[clamp(28px,4vw,46px)] font-extrabold tracking-[-1.5px] text-[#1d1d1f] mb-[48px]">
              Fifteen years in the making.
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-[16px]">
            {/* Timeline 1 */}
            <div className="bg-white rounded-[20px] p-[32px_28px] border border-[#d2d2d7] hover:border-[#0071e3] hover:shadow-[0_6px_24px_rgba(0,113,227,0.08)] transition-all duration-[0.2s]">
              <div className="text-[13px] font-bold text-[#0071e3] mb-[10px] tracking-wide">2008 – 2012</div>
              <div className="text-[19px] font-bold text-[#1d1d1f] tracking-tight mb-[8px]">Started on the helpdesk</div>
              <div className="text-[14px] text-[#6e6e73] leading-[1.7]">
                Like most IT careers, it began with password resets and printer jams. But nights and weekends were spent deep in home labs — building, breaking, and rebuilding Windows domains from scratch.
              </div>
              <span className="inline-block text-[11px] font-semibold bg-[#e8f1fb] text-[#0071e3] px-[10px] py-[3px] rounded-[980px] mt-[14px]">
                🏁 The beginning
              </span>
            </div>

            {/* Timeline 2 */}
            <div className="bg-white rounded-[20px] p-[32px_28px] border border-[#d2d2d7] hover:border-[#0071e3] hover:shadow-[0_6px_24px_rgba(0,113,227,0.08)] transition-all duration-[0.2s]">
              <div className="text-[13px] font-bold text-[#0071e3] mb-[10px] tracking-wide">2012 – 2016</div>
              <div className="text-[19px] font-bold text-[#1d1d1f] tracking-tight mb-[8px]">Enterprise infrastructure engineer</div>
              <div className="text-[14px] text-[#6e6e73] leading-[1.7]">
                Moved into a large enterprise environment managing 2,000+ endpoint networks, Active Directory forests, and Windows Server infrastructure. First real exposure to what "production pressure" means.
              </div>
              <span className="inline-block text-[11px] font-semibold bg-[#e8f1fb] text-[#0071e3] px-[10px] py-[3px] rounded-[980px] mt-[14px]">
                📈 Levelling up
              </span>
            </div>

            {/* Timeline 3 */}
            <div className="bg-white rounded-[20px] p-[32px_28px] border border-[#d2d2d7] hover:border-[#0071e3] hover:shadow-[0_6px_24px_rgba(0,113,227,0.08)] transition-all duration-[0.2s]">
              <div className="text-[13px] font-bold text-[#0071e3] mb-[10px] tracking-wide">2016 – 2020</div>
              <div className="text-[19px] font-bold text-[#1d1d1f] tracking-tight mb-[8px]">Cloud migration & Linux</div>
              <div className="text-[14px] text-[#6e6e73] leading-[1.7]">
                Led the Azure migration for a mid-size organisation — hybrid identity, virtual networking, policy management. Simultaneously deepened Linux expertise for mixed-environment management.
              </div>
              <span className="inline-block text-[11px] font-semibold bg-[#e8f1fb] text-[#0071e3] px-[10px] py-[3px] rounded-[980px] mt-[14px]">
                ☁️ Going cloud
              </span>
            </div>

            {/* Timeline 4 */}
            <div className="bg-white rounded-[20px] p-[32px_28px] border border-[#d2d2d7] hover:border-[#0071e3] hover:shadow-[0_6px_24px_rgba(0,113,227,0.08)] transition-all duration-[0.2s]">
              <div className="text-[13px] font-bold text-[#0071e3] mb-[10px] tracking-wide">2020 – Present</div>
              <div className="text-[19px] font-bold text-[#1d1d1f] tracking-tight mb-[8px]">Built BhavinAcademy</div>
              <div className="text-[14px] text-[#6e6e73] leading-[1.7]">
                Took everything from 12 years in the field and built a platform that teaches IT the way it's actually practised — hands-on, scenario-driven, and brutally practical. 5,000+ students later, the mission continues.
              </div>
              <span className="inline-block text-[11px] font-semibold bg-[#e8f1fb] text-[#0071e3] px-[10px] py-[3px] rounded-[980px] mt-[14px]">
                🚀 The academy
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ─── TESTIMONIALS ──────────────────────────────────── */}
      <section className="bg-black py-[100px] px-6 text-white">
        <div className="max-w-[1080px] mx-auto">
          <div>
            <p className="text-[13px] font-semibold text-[#0071e3]/70 uppercase tracking-[0.06em] mb-[10px]">Student voices</p>
            <h2 className="text-[clamp(28px,4vw,44px)] font-extrabold text-[#f5f5f7] tracking-[-1.5px] leading-tight mb-[48px]">
              Careers changed.<br />In their own words.
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-[16px]">
            {/* Testimonial 1 */}
            <div className="bg-[#1d1d1f] rounded-[20px] p-[32px_28px]">
              <div className="text-[#ffd60a] text-[14px] tracking-widest mb-[16px]">★★★★★</div>
              <p className="text-[15px] text-[#c7c7cc] leading-[1.7] font-light mb-[24px]">
                "I came in with zero networking knowledge. After Bhavin's CCNA course I passed first attempt and landed a junior network engineer role within three months. The lab approach is <strong className="text-white font-semibold">genuinely different</strong> from anything else out there."
              </p>
              <div className="flex items-center gap-[12px]">
                <div className="w-[36px] h-[36px] rounded-full bg-gradient-to-br from-[#0071e3] to-[#00d4ff] flex items-center justify-center text-[13px] font-bold text-white shrink-0">
                  RK
                </div>
                <div>
                  <div className="text-[13px] font-semibold text-[#f5f5f7]">Rahul Kapoor</div>
                  <div className="text-[12px] text-[#6e6e73]">Network Engineer · Pune, India</div>
                </div>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-[#1d1d1f] rounded-[20px] p-[32px_28px]">
              <div className="text-[#ffd60a] text-[14px] tracking-widest mb-[16px]">★★★★★</div>
              <p className="text-[15px] text-[#c7c7cc] leading-[1.7] font-light mb-[24px]">
                "The AZ-104 course is the most thorough I've seen — and I bought four others before this one. What stood out was how Bhavin explains the <strong className="text-white font-semibold">why</strong> behind everything, not just the steps. I feel confident in Azure now."
              </p>
              <div className="flex items-center gap-[12px]">
                <div className="w-[36px] h-[36px] rounded-full bg-gradient-to-br from-[#107c10] to-[#30d158] flex items-center justify-center text-[13px] font-bold text-white shrink-0">
                  SA
                </div>
                <div>
                  <div className="text-[13px] font-semibold text-[#f5f5f7]">Sara Al-Mansouri</div>
                  <div className="text-[12px] text-[#6e6e73]">Cloud Administrator · Dubai, UAE</div>
                </div>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-[#1d1d1f] rounded-[20px] p-[32px_28px]">
              <div className="text-[#ffd60a] text-[14px] tracking-widest mb-[16px]">★★★★★</div>
              <p className="text-[15px] text-[#c7c7cc] leading-[1.7] font-light mb-[24px]">
                "I was a Windows-only admin terrified of Linux. The sysadmin course broke down every barrier. Six months later I'm managing a mixed environment daily. Bhavin explains it like <strong className="text-white font-semibold">a senior colleague, not a lecturer</strong>."
              </p>
              <div className="flex items-center gap-[12px]">
                <div className="w-[36px] h-[36px] rounded-full bg-gradient-to-br from-[#5c2d91] to-[#a76bde] flex items-center justify-center text-[13px] font-bold text-white shrink-0">
                  MF
                </div>
                <div>
                  <div className="text-[13px] font-semibold text-[#f5f5f7]">Marcus Fontaine</div>
                  <div className="text-[12px] text-[#6e6e73]">Systems Administrator · Toronto, Canada</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── CTA BAND ────────────────────────────────────────── */}
      <section className="bg-[#0071e3] py-[88px] px-6 text-center text-white flex flex-col items-center">
        <h2 className="text-[clamp(28px,4vw,52px)] font-extrabold tracking-[-1.5px] mb-[16px] leading-[1.15]">
          Ready to start<br />your IT journey?
        </h2>
        <p className="text-[17px] text-[rgba(255,255,255,0.75)] mb-[36px] max-w-[480px]">
          Learn from industry experts and immerse yourself in an ocean of knowledge.
        </p>
        <button onClick={() => navigate("/courses")} className="bg-white text-[#0071e3] border-none py-[14px] px-[32px] rounded-[980px] text-[16px] font-semibold cursor-pointer hover:opacity-90 transition-opacity">
          Explore Courses
        </button>
      </section>

    </div>
  );
}

export default AboutUsPage;
