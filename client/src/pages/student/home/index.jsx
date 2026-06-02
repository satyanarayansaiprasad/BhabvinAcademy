import { useContext, useEffect, useState } from "react";
import { StudentContext } from "@/context/student-context";
import { fetchStudentViewCourseListService } from "@/services";
import { useNavigate } from "react-router-dom";
import CourseCard from "@/components/student-view/course-card";

function StudentHomePage() {
  const { studentViewCoursesList, setStudentViewCoursesList } = useContext(StudentContext);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  async function fetchAllStudentViewCourses() {
    const response = await fetchStudentViewCourseListService("");
    if (response?.success) setStudentViewCoursesList(response?.data);
  }

  useEffect(() => {
    fetchAllStudentViewCourses();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/courses?search=${encodeURIComponent(searchTerm)}`);
    } else {
      navigate("/courses");
    }
  };

  return (
    <div className="bg-surface text-on-surface font-body min-h-screen">
      {/* Hero Section */}
      <section className="relative px-6 py-20 md:py-32 overflow-hidden bg-surface">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 z-10 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-secondary-container/20 text-secondary rounded-full mb-6 text-sm font-medium">
              <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
              Science-Backed Methodology
            </div>
            <h1 className="text-5xl md:text-7xl font-headline font-extrabold text-on-surface mb-8 leading-tight tracking-tighter">
              Find the Best Health Products <span className="text-primary">Backed by Research</span>
            </h1>
            <p className="text-xl text-on-surface-variant mb-10 max-w-xl font-normal">
              Unbiased, clinical reviews of supplements and wellness gear. We cut through the noise to bring you the truth.
            </p>
            {/* Search Bar */}
            <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row gap-4 max-w-2xl bg-surface-container-lowest p-2 rounded-2xl shadow-atmospheric">
              <div className="flex-grow flex items-center px-4 bg-surface-container-low rounded-xl">
                <span className="material-symbols-outlined text-outline">search</span>
                <input 
                  className="w-full bg-transparent border-none focus:ring-0 text-on-surface py-4 px-3 font-medium text-sm outline-none" 
                  placeholder="Search supplements (e.g. Magnesium, Omega-3)" 
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button type="submit" className="cta-gradient text-on-primary px-8 py-4 rounded-xl font-bold text-lg hover:scale-[1.02] transition-transform shadow-lg">
                Search Reviews
              </button>
            </form>
          </div>
          <div className="lg:col-span-5 relative">
            <div className="aspect-square rounded-3xl overflow-hidden shadow-atmospheric transform rotate-3">
              <img 
                className="w-full h-full object-cover" 
                alt="Premium glass supplement bottle on a clean white laboratory surface" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCbZZEyaWcBXKhOgWkk3MQZkPwTbsQqW0bbg5t7e7Emof8crslydEiIJfvzlYFkbviyaIAVJA2Oal7oHmgECGgW7zsVB36_7uB0AJbjtL9F8zZW8C5PKjyZHlJUPZ3BMUDxH0ETNLtGomZH_NonjGr7ituY6fmNNEIDhNg234GO0wZgEObUdpUAk3hsB0WWg1U-g4vrVwFPCfJWkggwoSPNdDyQqwnFV9Td80Fo_YEYPIwIHakCjKEK2nwEAkcVnzGoNk7_zE0NTxU1"
              />
            </div>
            {/* Overlapping Expert Chip */}
            <div className="absolute -bottom-6 -left-6 bg-surface-container-lowest p-6 rounded-2xl shadow-atmospheric flex items-center gap-4 max-w-xs border-l-4 border-primary">
              <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                <img 
                  className="w-full h-full object-cover" 
                  alt="Dr. Sarah Chen" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBE-NcO9ciIge5UlYwnf3scUFa1X1fcPlICoLYPi07Cx93y_b3deLJ3pzhwkdEYSGL4oe6Nt00ZP5L1Hw-XW2RctCRIOdB2q6CI2LnRmYNMz-POw07BzwtusZB-zIGs-DK9HMnJnCI4gc48eSsfAK5OIKl58DAa_PwNxNYhi2XHcSCISeqOsqxdMcOIG_s8iQNO5QgOMxSZSPdRcNusNcVCVPkUn0zCnwB5URJsrPWnVHvEq-nePTwBt5xiihKA8kJq28kdG1LeAmk7"
                />
              </div>
              <div className="text-left">
                <p className="text-sm font-bold text-on-surface leading-tight">Dr. Sarah Chen</p>
                <p className="text-xs text-on-surface-variant">Lead Clinical Reviewer</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Indicators Section */}
      <section className="bg-surface-container-low py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-wrap justify-between items-center gap-8 opacity-60 grayscale hover:grayscale-0 transition-all duration-500 text-lg font-headline font-extrabold text-on-surface">
            <span>CLINICAL STUDIES</span>
            <span>PHARMA GRADE</span>
            <span>THIRD-PARTY TESTED</span>
            <span>EXPERT VERIFIED</span>
            <span>ETHICAL SOURCING</span>
          </div>
        </div>
      </section>

      {/* Expert Review Section */}
      <section className="py-24 bg-surface">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6 text-left">
            <div className="max-w-2xl">
              <h2 className="text-4xl font-headline font-extrabold text-on-surface mb-4 leading-tight">Expert Panel Insights</h2>
              <p className="text-lg text-on-surface-variant">Our reviews are conducted by a multidisciplinary team of clinicians and researchers. No influence from brands, ever.</p>
            </div>
            <button onClick={() => navigate("/about")} className="text-primary font-bold flex items-center gap-2 group hover:underline">
              Meet the Panel <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Expert Card 1 */}
            <div className="bg-surface-container-lowest p-8 rounded-3xl shadow-atmospheric flex flex-col gap-6 relative text-left">
              <div className="w-16 h-16 rounded-2xl overflow-hidden shrink-0">
                <img 
                  className="w-full h-full object-cover" 
                  alt="Dr. Michael Vance" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDGcsfM5zInkeMX-_jyqDJBGHX0KXMTPmH8ys9yvKhrQ8aOiyZ15MFRYWWQnkOkaWJdS5FvXCwaXrBeGMFwjlcOPKG3CfW3WynwwMQK6VwxC34GnkSlPXTKqYSrtgudr1V9MHjfg7Mcot0HSTV__PD9J5Ezk-nHtYHGG4O-PccHl24gtrxgydUHk31fk5R_izgFtNvYti7F39bxRrQTWc4SYFYkoQe6ys2wXM6zT71U7HkbpunK8I1UzFVOf4IOSAuEoB4xpG5Jmrsp"
                />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-1 text-on-surface">Dr. Michael Vance</h3>
                <p className="text-primary text-sm font-semibold uppercase tracking-wider mb-4">Functional Medicine</p>
                <p className="text-on-surface-variant italic font-body">"We verify every ingredient label against independent laboratory reports to ensure safety."</p>
              </div>
              <div className="pt-6 mt-auto flex items-center gap-2 border-t border-surface-container-high">
                <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                <span className="text-xs font-bold text-secondary tracking-widest uppercase">Expert Verified</span>
              </div>
            </div>
            
            {/* Expert Card 2 */}
            <div className="bg-surface-container-lowest p-8 rounded-3xl shadow-atmospheric flex flex-col gap-6 text-left">
              <div className="w-16 h-16 rounded-2xl overflow-hidden shrink-0">
                <img 
                  className="w-full h-full object-cover" 
                  alt="Dr. Elena Rodriguez" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDja63aBQVXp43H5y7-Q05SAm2aCpGHU8XuqmvOyWtaIAYN2c1OC6MhWdIoABkfOXTbQbtP0CsQk0jeMDjw0ZPKPndAZzGaPPueW84QW8XUEPr8kfZD8qRi6wIKxMlzdFRd0drQswPropCKy_ccp8V2J-weYH4Jqy2CTzjQl2cP40e0LKl-XfvXf2RcGiqeacp0BsR_A-6IrOAwH3jKgIJ6caAf_d2rHZMT8LkKlb0yUEExniXliGIb4vK0EpJ2uXZlFJYowW3lA9Tq"
                />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-1 text-on-surface">Dr. Elena Rodriguez</h3>
                <p className="text-primary text-sm font-semibold uppercase tracking-wider mb-4">Biochemistry Research</p>
                <p className="text-on-surface-variant italic font-body">"Bioavailability is the most overlooked factor. We prioritize products that actually get absorbed."</p>
              </div>
              <div className="pt-6 mt-auto flex items-center gap-2 border-t border-surface-container-high">
                <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>science</span>
                <span className="text-xs font-bold text-secondary tracking-widest uppercase">Scientific Review</span>
              </div>
            </div>
            
            {/* Expert Card 3 */}
            <div className="bg-surface-container-lowest p-8 rounded-3xl shadow-atmospheric flex flex-col gap-6 text-left">
              <div className="w-16 h-16 rounded-2xl overflow-hidden shrink-0">
                <img 
                  className="w-full h-full object-cover" 
                  alt="Dr. James Wilson" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBXX5I_PqLECNyrlvtqjYEVFaQEP2s_UMK831liOO95lxQ0jsSIKKa9NGckY4fCAuwZwV3L_Glrh1gZ34cypBnb12FL2EWL7I84cKaCVXs08zRsoEHhqtjM4g3uJY6eqX1Tfq_Et8byxeDhBg1hpKJCPSIm2CjVJf8XKOGPRGSrm1DT4riTg02ZT9vPY5S2Jq8oVSjsljjqJQ8D5eUGqDsJz8QqwP3bysRPvFeY7054jwmzxtxrop8TRc3BZXMmMERhFfweoYTgUI18"
                />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-1 text-on-surface">Dr. James Wilson</h3>
                <p className="text-primary text-sm font-semibold uppercase tracking-wider mb-4">Integrative Health</p>
                <p className="text-on-surface-variant italic font-body">"Purity is paramount. Our panel screens for heavy metals and synthetic fillers in every brand."</p>
              </div>
              <div className="pt-6 mt-auto flex items-center gap-2 border-t border-surface-container-high">
                <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>verified_user</span>
                <span className="text-xs font-bold text-secondary tracking-widest uppercase">Panel Approved</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-24 bg-surface-container-low">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-16 text-left">
            <h2 className="text-4xl font-headline font-extrabold text-on-surface mb-4">Top Rated Supplements</h2>
            <p className="text-lg text-on-surface-variant max-w-2xl">Products scoring 4.5/5 or higher across our clinical benchmarking metrics.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {studentViewCoursesList && studentViewCoursesList.length > 0 ? (
              studentViewCoursesList.slice(0, 4).map((course) => (
                <CourseCard 
                  key={course._id} 
                  course={course} 
                  onClick={(id) => navigate(`/course/details/${id}`)}
                />
              ))
            ) : (
              [...Array(4)].map((_, i) => (
                <div key={i} className="aspect-square bg-surface-container-lowest rounded-3xl animate-pulse shadow-atmospheric" />
              ))
            )}
          </div>
        </div>
      </section>

      {/* Newsletter / CTA */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto bg-primary rounded-[3rem] p-12 md:p-20 relative overflow-hidden text-center">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
          </div>
          <div className="relative z-10 max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-headline font-extrabold text-on-primary mb-6">Stay Informed with Clinical Clarity</h2>
            <p className="text-xl text-primary-fixed mb-10">Get expert-vetted health product guides and breaking research summaries delivered to your inbox every Tuesday.</p>
            <div className="flex flex-col md:flex-row gap-4 max-w-lg mx-auto">
              <input className="flex-grow px-6 py-4 rounded-xl bg-on-primary/10 border border-on-primary/20 text-on-primary placeholder:text-on-primary/50 focus:ring-2 focus:ring-on-primary/50 transition-all outline-none" placeholder="Your work email" type="email"/>
              <button className="bg-surface-container-lowest text-primary px-8 py-4 rounded-xl font-bold hover:scale-105 transition-transform shadow-xl">
                Join 50k+ Readers
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default StudentHomePage;
