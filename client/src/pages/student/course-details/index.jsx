import { useContext, useEffect, useState } from "react";
import { StudentContext } from "@/context/student-context";
import { AuthContext } from "@/context/auth-context";
import { fetchStudentViewCourseDetailsService } from "@/services";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { Check, Clock, Globe, Lock, Play, Share2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import VideoPlayer from "@/components/video-player";

function StudentViewCourseDetailsPage() {
  const {
    studentViewCourseDetails,
    setStudentViewCourseDetails,
    currentCourseDetailsId,
    setCurrentCourseDetailsId,
    loadingState,
    setLoadingState,
    handleAddToCart,
    cartItems,
    studentBoughtCoursesList,
  } = useContext(StudentContext);

  const { auth } = useContext(AuthContext);
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const { toast } = useToast();

  const [displayCurrentVideoFreePreview, setDisplayCurrentVideoFreePreview] = useState(null);
  const [showFreePreviewDialog, setShowFreePreviewDialog] = useState(false);
  const [isCurriculumOpen, setIsCurriculumOpen] = useState(true);

  const isCourseInCart = cartItems.some(item => item.courseId === studentViewCourseDetails?._id);
  const isCoursePurchased = studentBoughtCoursesList.some(item => item.courseId === studentViewCourseDetails?._id);

  async function fetchCourseDetails() {
    const response = await fetchStudentViewCourseDetailsService(currentCourseDetailsId);
    if (response?.success) {
      setStudentViewCourseDetails(response?.data);
      setLoadingState(false);
    } else {
      setStudentViewCourseDetails(null);
      setLoadingState(false);
    }
  }

  useEffect(() => {
    if (displayCurrentVideoFreePreview !== null) setShowFreePreviewDialog(true);
  }, [displayCurrentVideoFreePreview]);

  useEffect(() => {
    if (currentCourseDetailsId !== null) fetchCourseDetails();
  }, [currentCourseDetailsId]);

  useEffect(() => {
    if (id) setCurrentCourseDetailsId(id);
  }, [id]);

  useEffect(() => {
    if (!location.pathname.includes("course/details")) {
      setStudentViewCourseDetails(null);
      setCurrentCourseDetailsId(null);
    }
  }, [location.pathname]);

  function handleSetFreePreview(getCurrentVideoInfo) {
    setDisplayCurrentVideoFreePreview(getCurrentVideoInfo?.videoUrl);
  }

  async function handleBuyNow() {
    if (!auth?.authenticate) {
      navigate("/auth");
      return;
    }
    navigate("/checkout", { state: { course: studentViewCourseDetails } });
  }

  async function handleAddToCartLocal() {
    if (!auth?.authenticate) {
      toast({ title: "Please Sign In", variant: "destructive" });
      navigate("/auth");
      return;
    }
    if (isCourseInCart) {
      navigate("/cart");
      return;
    }
    const response = await handleAddToCart(studentViewCourseDetails?._id, auth?.user?._id);
    if (response?.success) {
      toast({ title: "Added to Cart" });
    }
  }

  function handleShare() {
    navigator.clipboard.writeText(window.location.href);
    toast({ title: "Link Copied!" });
  }

  const instructorName = studentViewCourseDetails?.instructorName || "Bhavin Khatri";
  const initials = instructorName.split(" ").map(n => n[0]).join("");

  if (loadingState || !studentViewCourseDetails) return (
    <div className="min-h-screen bg-white p-20 flex flex-col justify-center items-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen bg-white">
      
      {/* COURSE HERO SECTION */}
      <div className="bg-[#000] py-[2px] w-full">
        <div className="max-w-[1200px] mx-auto px-6 py-[70px] pb-[60px] grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-[60px] items-center">
          
          {/* Left panel: Info */}
          <div>
            <div className="text-[12px] font-semibold text-[#0071e3] uppercase tracking-[0.08em] mb-[14px]">
              {studentViewCourseDetails?.category}
            </div>
            <h1 className="text-[clamp(32px,4vw,52px)] font-extrabold text-[#f5f5f7] tracking-[-1.5px] leading-[1.1] mb-[18px]">
              {studentViewCourseDetails?.title}
            </h1>
            <p className="text-[17px] text-[#86868b] leading-[1.6] mb-[28px] font-light">
              {studentViewCourseDetails?.subtitle || studentViewCourseDetails?.description}
            </p>
            <div className="flex gap-[20px] flex-wrap mb-[32px]">
              <div className="flex items-center gap-[6px] text-[13px] text-[#86868b]">
                <strong className="text-[#f5f5f7] font-medium">{studentViewCourseDetails?.curriculum?.length || 0}</strong>
                <span>lessons</span>
              </div>
              <div className="flex items-center gap-[6px] text-[13px] text-[#86868b]">
                <strong className="text-[#f5f5f7] font-medium">{studentViewCourseDetails?.duration || 0} hrs</strong>
                <span>of content</span>
              </div>
              <div className="flex items-center gap-[6px] text-[13px] text-[#86868b]">
                <strong className="text-[#f5f5f7] font-medium">{studentViewCourseDetails?.level || 'All Levels'}</strong>
                <span>friendly</span>
              </div>
            </div>
            <div className="flex items-center gap-[10px]">
              <div className="w-[36px] h-[36px] rounded-full bg-[#0071e3] flex items-center justify-center text-[13px] font-semibold text-white">
                {initials}
              </div>
              <div className="text-[13px] text-[#86868b]">
                Created by <strong className="text-[#f5f5f7] font-medium">{instructorName}</strong> · Solution Architect & Trainer.
              </div>
            </div>
          </div>

          {/* Right panel: Sticky pricing card */}
          <div className="bg-[#1d1d1f] rounded-[18px] p-[32px_28px] border border-[#3d3d3f] text-white">
            <div className="text-[40px] font-extrabold text-[#f5f5f7] tracking-[-1px] mb-[4px] flex items-center justify-between">
              <span>₹{studentViewCourseDetails?.pricing || '3,999'}</span>
              <span className="bg-[#ff375f] text-white text-[11px] font-semibold px-[10px] py-[3px] rounded-[980px]">67% OFF</span>
            </div>
            <div className="text-[15px] text-[#6e6e73] line-through mb-[20px]">
              Original price: ₹{Math.round((studentViewCourseDetails?.pricing || 3999) * 3)}
            </div>

            <div className="space-y-[12px]">
              {isCoursePurchased ? (
                <button
                  onClick={() => navigate(`/course-progress/${studentViewCourseDetails?._id}`)}
                  className="w-full bg-[#0071e3] text-white py-[16px] rounded-[12px] text-[16px] font-semibold hover:bg-[#0077ed] transition-colors"
                >
                  Continue Learning
                </button>
              ) : (
                <>
                  <button
                    onClick={handleBuyNow}
                    className="w-full bg-[#0071e3] text-white py-[16px] rounded-[12px] text-[16px] font-semibold hover:bg-[#0077ed] transition-colors"
                  >
                    Enroll Now
                  </button>
                  <button
                    onClick={handleAddToCartLocal}
                    className="w-full bg-transparent text-[#f5f5f7] border border-[#3d3d3f] py-[14px] rounded-[12px] text-[15px] font-medium hover:border-[#86868b] transition-colors"
                  >
                    {isCourseInCart ? "Go to Cart" : "Add to Cart"}
                  </button>
                </>
              )}
            </div>

            <div className="border-t border-[#3d3d3f] mt-[20px] pt-[20px]">
              <div className="text-[12px] font-semibold text-[#6e6e73] uppercase tracking-[0.06em] mb-[14px]">
                This course includes
              </div>
              <div className="space-y-[10px]">
                <div className="flex items-center gap-[10px] text-[13px] text-[#d1d1d6]">
                  <div className="w-[6px] h-[6px] rounded-full bg-[#0071e3] shrink-0" />
                  <span>{studentViewCourseDetails?.duration || 36} hours of on-demand video</span>
                </div>
                <div className="flex items-center gap-[10px] text-[13px] text-[#d1d1d6]">
                  <div className="w-[6px] h-[6px] rounded-full bg-[#0071e3] shrink-0" />
                  <span>12 hands-on virtual lab sessions</span>
                </div>
                <div className="flex items-center gap-[10px] text-[13px] text-[#d1d1d6]">
                  <div className="w-[6px] h-[6px] rounded-full bg-[#0071e3] shrink-0" />
                  <span>3 full practice exams</span>
                </div>
                <div className="flex items-center gap-[10px] text-[13px] text-[#d1d1d6]">
                  <div className="w-[6px] h-[6px] rounded-full bg-[#0071e3] shrink-0" />
                  <span>Certificate of completion</span>
                </div>
                <div className="flex items-center gap-[10px] text-[13px] text-[#d1d1d6]">
                  <div className="w-[6px] h-[6px] rounded-full bg-[#0071e3] shrink-0" />
                  <span>Lifetime access & updates</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* COURSE BODY */}
      <div className="max-w-[1200px] mx-auto px-6 w-full">
        
        {/* SKILLS */}
        <div className="py-[64px] border-b border-[#e5e5e5]">
          <div className="text-[12px] font-semibold text-[#0071e3] uppercase tracking-[0.08em] mb-[10px]">Skills</div>
          <div className="text-[30px] font-bold text-[#1d1d1f] tracking-[-0.5px] mb-[28px]">What you'll learn</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-[32px] gap-y-[12px]">
            {studentViewCourseDetails?.objectives?.split("\n").filter(o => o.trim()).map((obj, i) => (
              <div key={i} className="flex items-start gap-[12px] text-[15px] text-[#1d1d1f] leading-[1.5]">
                <div className="w-[20px] h-[20px] rounded-full bg-[#e8f4e8] flex items-center justify-center shrink-0 mt-[2px] relative">
                  <span className="block w-[5px] h-[9px] border-r-[2px] border-b-[2px] border-[#1a7f1a] rotate-45 -translate-x-[0.5px] -translate-y-[1px]" />
                </div>
                <span>{obj}</span>
              </div>
            )) || (
              <>
                <div className="flex items-start gap-[12px] text-[15px] text-[#1d1d1f] leading-[1.5]">
                  <div className="w-[20px] h-[20px] rounded-full bg-[#e8f4e8] flex items-center justify-center shrink-0 mt-[2px] relative">
                    <span className="block w-[5px] h-[9px] border-r-[2px] border-b-[2px] border-[#1a7f1a] rotate-45 -translate-x-[0.5px] -translate-y-[1px]" />
                  </div>
                  <span>Understand virtualization and hypervisor configuration.</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* CURRICULUM */}
        <div className="py-[64px] border-b border-[#e5e5e5]">
          <div className="text-[12px] font-semibold text-[#0071e3] uppercase tracking-[0.08em] mb-[10px]">Curriculum</div>
          <div className="text-[30px] font-bold text-[#1d1d1f] tracking-[-0.5px] mb-[28px]">
            Course content · {studentViewCourseDetails?.curriculum?.length || 0} lessons · {studentViewCourseDetails?.duration || 0} hours
          </div>
          
          <div className="border border-[#e5e5e5] rounded-[12px] overflow-hidden">
            <div 
              onClick={() => setIsCurriculumOpen(!isCurriculumOpen)}
              className="flex items-center justify-between p-[18px_22px] cursor-pointer bg-[#f9f9f9] hover:bg-[#f3f3f3] transition-colors"
            >
              <div className="flex items-center gap-[14px]">
                <span className="text-[12px] font-semibold text-[#6e6e73]">01</span>
                <div>
                  <div className="text-[15px] font-semibold text-[#1d1d1f]">Course Outline & Material</div>
                  <div className="text-[12px] text-[#86868b] mt-[2px]">
                    {studentViewCourseDetails?.curriculum?.length || 0} lessons · {studentViewCourseDetails?.duration || 0} hours
                  </div>
                </div>
              </div>
              <span className={`text-[18px] text-[#86868b] transition-transform duration-300 ${isCurriculumOpen ? "rotate-180" : ""}`}>
                ▾
              </span>
            </div>

            {isCurriculumOpen && (
              <div className="px-[22px] py-[12px] pb-[18px] bg-white divide-y divide-[#f5f5f5]">
                {studentViewCourseDetails?.curriculum?.map((item, idx) => (
                  <div 
                    key={idx} 
                    onClick={() => item.freePreview && handleSetFreePreview(item)}
                    className={`flex items-center gap-[12px] py-[10px] text-[14px] text-[#3d3d3f] ${
                      item.freePreview ? "cursor-pointer hover:text-[#0071e3]" : ""
                    }`}
                  >
                    <div className="w-[28px] h-[28px] rounded-[8px] bg-[#e8f1fb] flex items-center justify-center text-[14px] text-[#0071e3] shrink-0">
                      ▶
                    </div>
                    <span>{item.title}</span>
                    {item.freePreview && (
                      <span className="text-[11px] font-bold text-[#0071e3] bg-[#e8f1fb] px-[8px] py-[2px] rounded-[980px] ml-2">
                        Free
                      </span>
                    )}
                    <span className="ml-auto text-[12px] text-[#86868b]">15 min</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* MEET INSTRUCTOR */}
        <div className="py-[64px] border-b border-[#e5e5e5]">
          <div className="text-[12px] font-semibold text-[#0071e3] uppercase tracking-[0.08em] mb-[10px]">Instructor</div>
          <div className="text-[30px] font-bold text-[#1d1d1f] tracking-[-0.5px] mb-[28px]">Meet your instructor</div>
          
          <div className="flex flex-col md:flex-row gap-[32px] items-start">
            <div className="w-[80px] h-[80px] rounded-full bg-[#0071e3] flex items-center justify-center text-[28px] font-bold text-white shrink-0">
              {initials}
            </div>
            <div className="flex-1">
              <h3 className="text-[22px] font-bold text-[#1d1d1f] mb-[4px]">{instructorName}</h3>
              <div className="text-[14px] text-[#0071e3] mb-[12px]">Senior Engineer & Trainer · 14 Years Experience</div>
              
              <div className="flex gap-[20px] mb-[16px]">
                <div>
                  <div className="text-[20px] font-bold text-[#1d1d1f]">4.9</div>
                  <div className="text-[12px] text-[#86868b]">Rating</div>
                </div>
                <div>
                  <div className="text-[20px] font-bold text-[#1d1d1f]">8,400+</div>
                  <div className="text-[12px] text-[#86868b]">Students</div>
                </div>
                <div>
                  <div className="text-[20px] font-bold text-[#1d1d1f]">6</div>
                  <div className="text-[12px] text-[#86868b]">Courses</div>
                </div>
              </div>
              <p className="text-[15px] text-[#6e6e73] leading-[1.7]">
                {instructorName} has designed and deployed enterprise network infrastructure for Fortune 500 companies. With multiple active industry certifications (Cisco, CompTIA, Microsoft), he is dedicated to delivering highly practical training centered around real-world virtual labs, deep fundamental clarity, and zero unnecessary fluff.
              </p>
            </div>
          </div>
        </div>

        {/* REVIEWS */}
        <div className="py-[64px]">
          <div className="text-[12px] font-semibold text-[#0071e3] uppercase tracking-[0.08em] mb-[10px]">Reviews</div>
          <div className="text-[30px] font-bold text-[#1d1d1f] tracking-[-0.5px] mb-[28px]">What learners say</div>
          
          <div className="flex flex-col md:flex-row gap-[40px] items-center p-[28px] bg-[#f9f9f9] rounded-[16px] mb-[36px]">
            <div className="text-[72px] font-extrabold text-[#1d1d1f] tracking-[-3px] leading-none">4.9</div>
            <div className="flex-1 w-full">
              <div className="text-[14px] text-[#1d1d1f] font-semibold mb-[12px]">Course Rating</div>
              <div className="space-y-[6px]">
                <div className="flex items-center gap-[10px]">
                  <span className="text-[12px] text-[#86868b] w-[40px]">5 ★</span>
                  <div className="flex-1 h-[6px] bg-[#e5e5e5] rounded-[3px] overflow-hidden">
                    <div className="h-full bg-[#ffd60a] rounded-[3px]" style={{ width: "88%" }} />
                  </div>
                  <span className="text-[12px] text-[#86868b] w-[28px] text-right">88%</span>
                </div>
                <div className="flex items-center gap-[10px]">
                  <span className="text-[12px] text-[#86868b] w-[40px]">4 ★</span>
                  <div className="flex-1 h-[6px] bg-[#e5e5e5] rounded-[3px] overflow-hidden">
                    <div className="h-full bg-[#ffd60a] rounded-[3px]" style={{ width: "9%" }} />
                  </div>
                  <span className="text-[12px] text-[#86868b] w-[28px] text-right">9%</span>
                </div>
                <div className="flex items-center gap-[10px]">
                  <span className="text-[12px] text-[#86868b] w-[40px]">3 ★</span>
                  <div className="flex-1 h-[6px] bg-[#e5e5e5] rounded-[3px] overflow-hidden">
                    <div className="h-full bg-[#ffd60a] rounded-[3px]" style={{ width: "2%" }} />
                  </div>
                  <span className="text-[12px] text-[#86868b] w-[28px] text-right">2%</span>
                </div>
                <div className="flex items-center gap-[10px]">
                  <span className="text-[12px] text-[#86868b] w-[40px]">2 ★</span>
                  <div className="flex-1 h-[6px] bg-[#e5e5e5] rounded-[3px] overflow-hidden">
                    <div className="h-full bg-[#ffd60a] rounded-[3px]" style={{ width: "1%" }} />
                  </div>
                  <span className="text-[12px] text-[#86868b] w-[28px] text-right">1%</span>
                </div>
              </div>
            </div>
            <div className="text-[15px] text-[#6e6e73] max-w-[200px] leading-[1.6]">
              Based on <strong className="text-[#1d1d1f]">2,841</strong> verified learner ratings
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-[16px]">
            
            {/* Review 1 */}
            <div className="border border-[#e5e5e5] rounded-[14px] p-[22px]">
              <div className="flex items-center gap-[12px] mb-[14px]">
                <div className="w-[38px] h-[38px] rounded-full bg-[#0071e3] flex items-center justify-center font-semibold text-white shrink-0">
                  RM
                </div>
                <div>
                  <div className="text-[14px] font-semibold text-[#1d1d1f]">Rahul Mehta</div>
                  <div className="text-[12px] text-[#86868b]">March 2026</div>
                </div>
              </div>
              <div className="text-[#ffd60a] tracking-[1px] text-[12px] mb-[8px]">★★★★★</div>
              <p className="text-[14px] text-[#3d3d3f] leading-[1.6]">
                Passed my certification on first attempt! The virtual labs are incredibly realistic and the instructor explains concepts better than anyone I've encountered online or offline.
              </p>
            </div>

            {/* Review 2 */}
            <div className="border border-[#e5e5e5] rounded-[14px] p-[22px]">
              <div className="flex items-center gap-[12px] mb-[14px]">
                <div className="w-[38px] h-[38px] rounded-full bg-[#1a7f1a] flex items-center justify-center font-semibold text-white shrink-0">
                  PS
                </div>
                <div>
                  <div className="text-[14px] font-semibold text-[#1d1d1f]">Priya Shah</div>
                  <div className="text-[12px] text-[#86868b]">February 2026</div>
                </div>
              </div>
              <div className="text-[#ffd60a] tracking-[1px] text-[12px] mb-[8px]">★★★★★</div>
              <p className="text-[14px] text-[#3d3d3f] leading-[1.6]">
                Coming from a non-technical background, I was nervous — but this course held my hand all the way. Now I feel confident building setups. Worth every rupee.
              </p>
            </div>

            {/* Review 3 */}
            <div className="border border-[#e5e5e5] rounded-[14px] p-[22px]">
              <div className="flex items-center gap-[12px] mb-[14px]">
                <div className="w-[38px] h-[38px] rounded-full bg-[#9b27af] flex items-center justify-center font-semibold text-white shrink-0">
                  VK
                </div>
                <div>
                  <div className="text-[14px] font-semibold text-[#1d1d1f]">Vikram Kaushik</div>
                  <div className="text-[12px] text-[#86868b]">January 2026</div>
                </div>
              </div>
              <div className="text-[#ffd60a] tracking-[1px] text-[12px] mb-[8px]">★★★★★</div>
              <p className="text-[14px] text-[#3d3d3f] leading-[1.6]">
                Best IT prep course in India. The practical Packet Tracer exercises make the concepts stick. I referred 5 colleagues — they all enrolled too.
              </p>
            </div>

            {/* Review 4 */}
            <div className="border border-[#e5e5e5] rounded-[14px] p-[22px]">
              <div className="flex items-center gap-[12px] mb-[14px]">
                <div className="w-[38px] h-[38px] rounded-full bg-[#c0392b] flex items-center justify-center font-semibold text-white shrink-0">
                  AN
                </div>
                <div>
                  <div className="text-[14px] font-semibold text-[#1d1d1f]">Arjun Nair</div>
                  <div className="text-[12px] text-[#86868b]">December 2025</div>
                </div>
              </div>
              <div className="text-[#ffd60a] tracking-[1px] text-[12px] mb-[8px]">★★★★★</div>
              <p className="text-[14px] text-[#3d3d3f] leading-[1.6]">
                The practice exams are spot-on. I felt completely prepared walking into the test centre. Cleared my certification with high grades. Bhavin is a legend.
              </p>
            </div>

          </div>
        </div>

      </div>

      {/* CTA BOTTOM BAND */}
      <div className="bg-[#000] py-[80px] px-6 text-center text-white flex flex-col items-center">
        <h2 className="text-[clamp(28px,4vw,48px)] font-bold tracking-[-1px] mb-[16px]">Ready to get certified?</h2>
        <p className="text-[17px] text-[#86868b] mb-[36px] max-w-[480px] mx-auto">Learn from industry experts and immerse yourself in an ocean of knowledge.</p>
        <button 
          onClick={handleBuyNow}
          className="bg-[#0071e3] text-white py-[16px] px-[40px] rounded-[980px] text-[17px] font-semibold hover:bg-[#0077ed] transition-colors"
        >
          Enroll Now — ₹{studentViewCourseDetails?.pricing || '3,999'}
        </button>
      </div>

      {/* Preview Dialog */}
      <Dialog open={showFreePreviewDialog} onOpenChange={(val) => {
        setShowFreePreviewDialog(val);
        if(!val) setDisplayCurrentVideoFreePreview(null);
      }}>
        <DialogContent className="max-w-[1000px] w-full p-0 border-none bg-black overflow-hidden aspect-video">
          <VideoPlayer url={displayCurrentVideoFreePreview} width="100%" height="100%" />
        </DialogContent>
      </Dialog>

    </div>
  );
}

export default StudentViewCourseDetailsPage;
