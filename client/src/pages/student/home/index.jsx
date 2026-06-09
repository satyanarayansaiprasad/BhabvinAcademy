import { useContext, useEffect } from "react";
import { StudentContext } from "@/context/student-context";
import { fetchStudentViewCourseListService } from "@/services";
import { useNavigate } from "react-router-dom";
import CourseCard from "@/components/student-view/course-card";

function StudentHomePage() {
  const { studentViewCoursesList, setStudentViewCoursesList } = useContext(StudentContext);
  const navigate = useNavigate();

  async function fetchAllStudentViewCourses() {
    const response = await fetchStudentViewCourseListService("");
    if (response?.success) setStudentViewCoursesList(response?.data);
  }

  useEffect(() => {
    fetchAllStudentViewCourses();
  }, []);

  const tickerItems = [
    "🪟 Windows Server", "🐧 Linux Administration", "☁️ Azure AZ-900", 
    "🔒 CompTIA Security+", "⚙️ Active Directory", "📡 Network+",
    "🪟 Windows Server", "🐧 Linux Administration", "☁️ Azure AZ-900", 
    "🔒 CompTIA Security+", "⚙️ Active Directory", "📡 Network+"
  ];

  return (
    <div className="flex flex-col">
      {/* HERO */}
      <section className="min-h-[90vh] bg-[linear-gradient(160deg,#000_0%,#1a1a2e_50%,#000_100%)] flex flex-col items-center justify-center text-center px-6 relative overflow-hidden">
        <div className="absolute w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle,rgba(0,113,227,0.25)_0%,transparent_70%)] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
        <p className="text-[13px] font-medium text-[#0071e3] tracking-[0.04em] mb-[16px] uppercase">Online IT Education</p>
        <h1 className="text-[clamp(40px,6vw,80px)] font-extrabold leading-[1.05] tracking-[-2px] text-[#f5f5f7] mb-[20px] max-w-[800px]">
          Learn IT.<br />
          <span className="bg-gradient-to-r from-[#0071e3] to-[#00d4ff] bg-clip-text text-transparent">Master IT.</span><br />
          Grow with IT.
        </h1>
        <p className="text-[clamp(16px,2vw,21px)] text-[#86868b] leading-[1.6] max-w-[560px] mb-[40px] font-light">
          Master Microsoft, Linux, Cloud and Security with expert-led training built to empower your growth.
        </p>
        <div className="flex gap-[16px] flex-wrap justify-center">
          <button onClick={() => navigate('/courses')} className="bg-[#0071e3] text-white py-[14px] px-[28px] rounded-[980px] text-[16px] font-medium hover:bg-[#0077ed] transition-colors">
            Explore Courses
          </button>
        </div>
      </section>

      {/* TICKER */}
      <div className="bg-[#f5f5f7] py-[12px] border-t border-b border-[#d2d2d7] overflow-hidden">
        <div className="flex gap-[120px] animate-marquee w-max">
          {tickerItems.map((item, i) => (
            <div key={i} className="text-[20px] font-medium text-[#6e6e73] whitespace-nowrap">
              {item.split(' ')[0]} <span className="text-[#1d1d1f] font-semibold">{item.split(' ').slice(1).join(' ')}</span>
            </div>
          ))}
          {tickerItems.map((item, i) => (
            <div key={`dup-${i}`} className="text-[20px] font-medium text-[#6e6e73] whitespace-nowrap">
              {item.split(' ')[0]} <span className="text-[#1d1d1f] font-semibold">{item.split(' ').slice(1).join(' ')}</span>
            </div>
          ))}
        </div>
      </div>

      {/* FEATURED COURSES - Apple Style */}
      <section className="bg-black py-[80px] px-6">
        <div className="max-w-[1080px] mx-auto">
          <p className="text-[13px] font-semibold text-[#86868b] uppercase tracking-[0.06em] mb-[10px]">Featured Courses</p>
          <h2 className="text-[36px] font-bold text-[#f5f5f7] tracking-[-1px] mb-8">The courses everyone's talking about.</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-[16px]">
            {/* Main Featured Card */}
            <div className="bg-[#0071e3] rounded-[18px] p-[48px_40px] min-h-[380px] flex flex-col justify-between relative overflow-hidden md:row-span-2">
              <div>
                <div className="text-[12px] font-bold uppercase tracking-[0.08em] opacity-60 text-white mb-[12px]">New · Microsoft</div>
                <div className="text-[32px] font-bold tracking-[-0.5px] leading-[1.15] text-white mb-[10px]">Microsoft 365<br />Administration</div>
                <div className="text-[15px] leading-[1.6] opacity-70 text-white max-w-[300px]">From subscriptions to Entra ID, Defender, Purview, and Mobile Device Management.</div>
              </div>
              <div>
                <button onClick={() => navigate('/courses')} className="text-white text-[15px] font-medium flex items-center gap-1 hover:underline">
                  Learn more ›
                </button>
              </div>
              <div className="absolute right-[36px] bottom-[36px] text-[64px] opacity-18 select-none">🪟</div>
            </div>

            {/* Sub Featured Cards */}
            <div className="bg-[#1d1d1f] rounded-[18px] p-[48px_40px] min-h-[180px] flex flex-col justify-between relative overflow-hidden">
              <div>
                <div className="text-[12px] font-bold uppercase tracking-[0.08em] opacity-60 text-white mb-[12px]">Trending · Linux</div>
                <div className="text-[26px] font-bold tracking-[-0.5px] leading-[1.15] text-white mb-[10px]">Linux System<br />Administration</div>
              </div>
              <button onClick={() => navigate('/courses')} className="text-white text-[15px] font-medium flex items-center gap-1 hover:underline self-start">
                Learn more ›
              </button>
              <div className="absolute right-[36px] bottom-[36px] text-[64px] opacity-18 select-none">🐧</div>
            </div>

            <div className="bg-[#f5f5f7] rounded-[18px] p-[48px_40px] min-h-[180px] flex flex-col justify-between relative overflow-hidden text-[#1d1d1f]">
              <div>
                <div className="text-[12px] font-bold uppercase tracking-[0.08em] opacity-60 text-[#86868b] mb-[12px]">Best Seller</div>
                <div className="text-[26px] font-bold tracking-[-0.5px] leading-[1.15] text-[#1d1d1f] mb-[10px]">Security &<br />Compliance</div>
              </div>
              <button onClick={() => navigate('/courses')} className="text-[#0071e3] text-[15px] font-medium flex items-center gap-1 hover:underline self-start">
                Learn more ›
              </button>
              <div className="absolute right-[36px] bottom-[36px] text-[64px] opacity-18 select-none">🌐</div>
            </div>
          </div>

          {/* Second Row of Featured Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-[16px] mt-[16px]">
            <div className="bg-[#1a3a2a] rounded-[18px] p-[48px_40px] min-h-[220px] flex flex-col justify-between relative overflow-hidden">
              <div>
                <div className="text-[12px] font-bold uppercase tracking-[0.08em] opacity-60 text-white mb-[12px]">Cloud</div>
                <div className="text-[22px] font-bold tracking-[-0.5px] text-white mb-[10px]">Azure AZ-900</div>
              </div>
              <button onClick={() => navigate('/courses')} className="text-white text-[15px] font-medium flex items-center gap-1 hover:underline self-start">
                Learn more ›
              </button>
              <div className="absolute right-[36px] bottom-[36px] text-[48px] opacity-18 select-none">☁️</div>
            </div>

            <div className="bg-[#2d1a1a] rounded-[18px] p-[48px_40px] min-h-[220px] flex flex-col justify-between relative overflow-hidden">
              <div>
                <div className="text-[12px] font-bold uppercase tracking-[0.08em] opacity-60 text-white mb-[12px]">Security</div>
                <div className="text-[22px] font-bold tracking-[-0.5px] text-white mb-[10px]">CompTIA Security+</div>
              </div>
              <button onClick={() => navigate('/courses')} className="text-white text-[15px] font-medium flex items-center gap-1 hover:underline self-start">
                Learn more ›
              </button>
              <div className="absolute right-[36px] bottom-[36px] text-[48px] opacity-18 select-none">🔒</div>
            </div>

            <div className="bg-[#1a1a3a] rounded-[18px] p-[48px_40px] min-h-[220px] flex flex-col justify-between relative overflow-hidden">
              <div>
                <div className="text-[12px] font-bold uppercase tracking-[0.08em] opacity-60 text-white mb-[12px]">Microsoft</div>
                <div className="text-[22px] font-bold tracking-[-0.5px] text-white mb-[10px]">Active Directory</div>
              </div>
              <button onClick={() => navigate('/courses')} className="text-white text-[15px] font-medium flex items-center gap-1 hover:underline self-start">
                Learn more ›
              </button>
              <div className="absolute right-[36px] bottom-[36px] text-[48px] opacity-18 select-none">⚙️</div>
            </div>
          </div>

        </div>
      </section>

      {/* ALL COURSES GRID */}
      <section className="bg-[#f5f5f7] py-[80px] px-6">
        <div className="max-w-[1080px] mx-auto">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-[13px] font-semibold text-[#0071e3] uppercase tracking-[0.06em] mb-[10px]">Browse</p>
              <h2 className="text-[36px] font-bold tracking-[-1px] text-[#1d1d1f]">Courses</h2>
            </div>
            <button onClick={() => navigate('/courses')} className="text-[#0071e3] text-[15px] font-medium hover:underline">
              See all courses ›
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-[16px]">
            {studentViewCoursesList && studentViewCoursesList.length > 0 ? (
              studentViewCoursesList.slice(0, 6).map((course) => (
                <CourseCard 
                  key={course._id} 
                  course={course} 
                  onClick={(id) => navigate(`/course/details/${id}`)}
                />
              ))
            ) : (
              [...Array(6)].map((_, i) => (
                <div key={i} className="h-[300px] bg-white rounded-[18px] animate-pulse" />
              ))
            )}
          </div>
        </div>
      </section>

      {/* TESTIMONIAL */}
      <section className="bg-black py-[100px] px-6 text-center">
        <div className="max-w-[760px] mx-auto">
          <p className="text-[clamp(22px,3vw,36px)] font-light text-[#f5f5f7] leading-[1.5] tracking-[-0.5px] mb-8">
            "While technology shifts with every decade, your value remains constant through two rules: <strong>Master the fundamentals</strong>, as they are timeless; and <strong>keep learning</strong>, for the world never stops turning."
          </p>
          <div className="text-[14px] text-[#86868b]">· Bhavin Khatri ·</div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#0071e3] py-[80px] px-6 text-center flex flex-col items-center">
        <h2 className="text-[clamp(28px,4vw,52px)] font-extrabold text-white tracking-[-1.5px] mb-[16px] leading-[1.05]">
          Ready to start<br />your IT journey?
        </h2>
        <p className="text-[17px] text-[rgba(255,255,255,0.75)] mb-[36px] max-w-[480px] mx-auto">
          Learn from industry experts and immerse yourself in an ocean of knowledge.
        </p>
        <button onClick={() => navigate('/auth')} className="bg-white text-[#0071e3] border-none py-[14px] px-[32px] rounded-[980px] text-[16px] font-semibold cursor-pointer transition-opacity duration-200 hover:opacity-90">
          Get Started
        </button>
      </section>
    </div>
  );
}

export default StudentHomePage;
