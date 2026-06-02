import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function StudentInstructorsPage() {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState("All");

  const filterOptions = [
    "All",
    "Microsoft",
    "Linux",
    "Networking",
    "Cloud & Azure",
    "Cybersecurity",
    "Active Directory",
  ];

  return (
    <div className="bg-white min-h-screen text-[#1d1d1f] font-sans antialiased">
      {/* HERO SECTION */}
      <section className="min-h-[50vh] flex flex-col items-center justify-center bg-gradient-to-br from-black via-[#1a1a2e] to-black py-20 px-6 text-center relative overflow-hidden">
        <div className="absolute w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle,rgba(0,113,227,0.22)_0%,transparent_70%)] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
        <div className="max-w-4xl mx-auto relative z-10">
          <p className="text-[13px] font-semibold text-[#0071e3] tracking-widest uppercase mb-4">
            Meet Your Instructors
          </p>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight text-[#f5f5f7] mb-6 leading-[1.05]">
            Taught by experts.<br />
            <span className="bg-gradient-to-r from-[#0071e3] to-[#00d4ff] bg-clip-text text-transparent italic">
              Built for your career.
            </span>
          </h1>
          <p className="text-[17px] md:text-[19px] text-[#86868b] leading-relaxed max-w-xl mx-auto font-light mb-10">
            Industry veterans with decades of hands-on experience. Every BhavinAcademy instructor holds active certifications and teaches from the field — not the textbook.
          </p>
          <div className="flex flex-wrap gap-8 justify-center mt-8">
            <div className="text-center">
              <div className="text-3xl font-extrabold text-white">1</div>
              <div className="text-[12px] text-[#86868b] mt-1 tracking-wider uppercase">Expert Instructor</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-extrabold text-white">180+</div>
              <div className="text-[12px] text-[#86868b] mt-1 tracking-wider uppercase">Courses Created</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-extrabold text-white">4.9★</div>
              <div className="text-[12px] text-[#86868b] mt-1 tracking-wider uppercase">Avg. Rating</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-extrabold text-white">12K+</div>
              <div className="text-[12px] text-[#86868b] mt-1 tracking-wider uppercase">Students Taught</div>
            </div>
          </div>
        </div>
      </section>

      {/* FILTER BAR */}
      <div className="bg-[#f5f5f7] border-b border-[#d2d2d7] px-6 overflow-x-auto">
        <div className="max-w-[1080px] mx-auto flex items-center gap-2 h-[52px] scrollbar-none">
          {filterOptions.map((opt) => (
            <button
              key={opt}
              onClick={() => setActiveFilter(opt)}
              className={`px-3.5 py-1.5 rounded-full text-[13px] font-semibold transition-all border-none cursor-pointer ${
                activeFilter === opt
                  ? "bg-[#0071e3] text-white"
                  : "bg-transparent text-[#6e6e73] hover:bg-[#e8e8ed] hover:text-[#1d1d1f]"
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>

      {/* FEATURED INSTRUCTOR */}
      <section className="bg-black py-20 px-6 text-white">
        <div className="max-w-[1080px] mx-auto">
          <p className="text-[13px] font-semibold text-[#0071e3] uppercase tracking-wider mb-2">Featured Instructor</p>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-8">Spotlight of the Month</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
            <div className="bg-[#1d1d1f] rounded-2xl p-8 md:p-10 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-5 mb-8">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#0071e3] to-[#00d4ff] flex items-center justify-center text-3xl">
                    👨‍💻
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-[#f5f5f7] tracking-tight">Bhavin Khatri</h3>
                    <p className="text-sm text-[#86868b] mt-1">Senior IT Instructor & Systems Specialist · BhavinAcademy</p>
                  </div>
                </div>
                <p className="text-[15px] text-[#86868b] leading-relaxed mb-6 font-light">
                  Bhavin Khatri is the sole instructor behind every BhavinAcademy course — bringing deep, hands-on expertise across Microsoft, Linux, Networking, Cloud, and Cybersecurity. Every lesson is built from real-world experience, not just slides, giving learners the practical edge they need to pass exams and perform on the job.
                </p>
                <div className="flex flex-wrap gap-2 mb-8">
                  {["CCIE Routing & Switching", "CompTIA Security+", "CCNA", "Palo Alto PCNSE", "Firewall Design"].map((tag, idx) => (
                    <span key={idx} className="text-[11px] font-medium bg-[#0071e3]/15 text-[#0071e3] px-3 py-1 rounded-full border border-[#0071e3]/25">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <a href="/about" className="text-[15px] font-medium text-[#0071e3] hover:underline flex items-center gap-1">
                View full profile <span className="text-lg">›</span>
              </a>
            </div>

            <div className="bg-[#0071e3] rounded-2xl p-8 md:p-10 grid grid-cols-2 gap-6 align-content-start">
              <div className="bg-white/10 rounded-xl p-6">
                <div className="text-4xl font-extrabold text-white tracking-tight">8</div>
                <div className="text-[13px] text-white/70 mt-1">Courses on platform</div>
              </div>
              <div className="bg-white/10 rounded-xl p-6">
                <div className="text-4xl font-extrabold text-white tracking-tight">3,400+</div>
                <div className="text-[13px] text-white/70 mt-1">Students Enrolled</div>
              </div>
              <div className="bg-white/10 rounded-xl p-6">
                <div className="text-4xl font-extrabold text-white tracking-tight">4.97</div>
                <div className="text-[13px] text-white/70 mt-1">Average Rating</div>
              </div>
              <div className="bg-white/10 rounded-xl p-6">
                <div className="text-4xl font-extrabold text-white tracking-tight">92%</div>
                <div className="text-[13px] text-white/70 mt-1">Exam Pass Rate</div>
              </div>
              <div className="col-span-2 bg-black/15 rounded-xl p-6">
                <p className="text-[17px] font-light text-white italic leading-relaxed">
                  "I don't teach theory. I teach you what I'd do at 2 AM when a core switch goes down and your boss is calling."
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BECOME AN INSTRUCTOR */}
      <section className="bg-white py-20 px-6">
        <div className="max-w-[1080px] mx-auto">
          <p className="text-[13px] font-semibold text-[#0071e3] uppercase tracking-wider mb-2">Teach on BhavinAcademy</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mt-8">
            <div>
              <h2 className="text-3xl md:text-5xl font-black tracking-tight leading-tight text-[#1d1d1f] mb-4">
                Share your expertise.<br />Shape IT careers.
              </h2>
              <p className="text-[15px] text-[#6e6e73] leading-relaxed mb-8">
                We're always looking for experienced IT professionals who are passionate about teaching. If you hold active certifications and have real-world experience, we'd love to build together.
              </p>
              <div className="space-y-6">
                {[
                  { num: 1, title: "Apply Online", desc: "Submit your certifications, work history, and a short video sample. Our team reviews every application personally." },
                  { num: 2, title: "Curriculum Workshop", desc: "Work with our instructional designers to structure your course for maximum learner success and certification outcomes." },
                  { num: 3, title: "Record & Launch", desc: "Use our production support or record from your own studio. We handle hosting, streaming, labs, and marketing." },
                ].map((step) => (
                  <div key={step.num} className="flex gap-4">
                    <div className="w-9 h-9 rounded-full bg-[#0071e3] text-white text-sm font-bold flex items-center justify-center flex-shrink-0">
                      {step.num}
                    </div>
                    <div>
                      <h4 className="text-[15px] font-semibold text-[#1d1d1f] mb-1">{step.title}</h4>
                      <p className="text-sm text-[#6e6e73] leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-black to-[#1a1a2e] rounded-3xl p-10 text-center text-white">
              <div className="text-5xl mb-6">🎓</div>
              <h3 className="text-2xl font-bold tracking-tight text-[#f5f5f7] mb-3">
                Ready to teach<br />12,000+ learners?
              </h3>
              <p className="text-[14px] text-[#86868b] leading-relaxed mb-8">
                Join Bhavin Khatri in building the next generation of IT professionals on BhavinAcademy. Competitive revenue share, full production support, and a platform that puts instructors first.
              </p>
              <button
                onClick={() => navigate("/contact")}
                className="bg-[#0071e3] text-white px-7 py-3 rounded-full font-semibold text-[15px] hover:bg-[#0077ed] transition-all border-none cursor-pointer"
              >
                Apply to Teach
              </button>
              <p className="text-xs text-[#6e6e73] mt-3">Applications reviewed within 5 business days</p>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIAL SECTION */}
      <section className="bg-black py-24 px-6 text-center">
        <div className="max-w-[760px] mx-auto">
          <div className="text-[#ffd60a] text-xl tracking-wider mb-4">★★★★★</div>
          <p className="text-2xl md:text-3xl font-light text-[#f5f5f7] leading-relaxed mb-8">
            "Bhavin's CCNA course is unlike anything I'd seen before. He shows you <strong className="font-bold text-white">real packet captures</strong>, real misconfigurations, and exactly how to fix them. I passed first attempt."
          </p>
          <div className="text-sm text-[#86868b]">Sneha Joshi · Network Support Engineer, HCL · Bengaluru</div>
        </div>
      </section>

      {/* CTA BAND */}
      <section className="bg-[#0071e3] py-20 px-6 text-center text-white">
        <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-4">Learn from the<br />best in the field.</h2>
        <p className="text-[17px] text-white/75 mb-8 max-w-lg mx-auto">Over 12,000 learners trust BhavinAcademy instructors to guide them to certification and beyond.</p>
        <button
          onClick={() => navigate("/courses")}
          className="bg-white text-[#0071e3] px-8 py-3.5 rounded-full font-bold text-[16px] hover:opacity-90 transition-all cursor-pointer border-none shadow-md"
        >
          Browse All Courses
        </button>
      </section>
    </div>
  );
}
