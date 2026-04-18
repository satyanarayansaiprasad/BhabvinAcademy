import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import VideoPlayer from "@/components/video-player";
import { AuthContext } from "@/context/auth-context";
import { StudentContext } from "@/context/student-context";
import {
  fetchStudentViewCourseDetailsService,
} from "@/services";
import { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Check, Globe, Lock, Play, Clock, Share2, Info, ShoppingCart, BookOpen, Award, BarChart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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
  const [displayCurrentVideoFreePreview, setDisplayCurrentVideoFreePreview] = useState(null);
  const [showFreePreviewDialog, setShowFreePreviewDialog] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const { toast } = useToast();

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

  if (loadingState || !studentViewCourseDetails) return (
      <div className="min-h-screen animate-pulse bg-white p-20">
          <div className="h-64 bg-gray-100 rounded-[32px] mb-10"></div>
          <div className="h-10 bg-gray-100 w-1/2 mb-4"></div>
          <div className="h-4 bg-gray-100 w-full mb-2"></div>
          <div className="h-4 bg-gray-100 w-3/4 mb-2"></div>
      </div>
  );

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* HERO SECTION */}
      <section className="bg-[linear-gradient(160deg,#000_0%,#1a1a2e_50%,#000_100%)] p-[80px_24px_64px] relative overflow-hidden">
        <div className="absolute w-[600px] h-[400px] rounded-full bg-[radial-gradient(circle,rgba(0,113,227,0.18)_0%,transparent_70%)] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
        <div className="max-w-[1080px] mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-12 items-center">
          <div>
            <div className="text-[12px] font-bold text-[#0071e3] uppercase tracking-[0.08em] mb-4">Course Details</div>
            <h1 className="text-[clamp(32px,5vw,52px)] font-extrabold tracking-[-1.5px] text-[#f5f5f7] leading-[1.1] mb-5">
              {studentViewCourseDetails?.title}
            </h1>
            <p className="text-[18px] text-[#86868b] leading-[1.6] max-w-[600px] font-light mb-8">
              {studentViewCourseDetails?.subtitle}
            </p>
            <div className="flex items-center gap-6 text-[14px] text-[#86868b]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#333] flex items-center justify-center text-white text-[12px] font-bold">
                  {studentViewCourseDetails?.instructorName?.charAt(0)}
                </div>
                <span className="text-[#f5f5f7] font-medium">{studentViewCourseDetails?.instructorName}</span>
              </div>
              <div className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> Updated {studentViewCourseDetails?.date?.split('T')[0]}</div>
              <div className="flex items-center gap-1.5"><Globe className="w-4 h-4" /> {studentViewCourseDetails?.primaryLanguage}</div>
            </div>
          </div>
        </div>
      </section>

      {/* MAIN LAYOUT */}
      <div className="max-w-[1080px] mx-auto w-full px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-12 items-start">
          {/* CONTENT */}
          <main className="space-y-12">
            {/* What you'll learn */}
            <div className="border border-[#d2d2d7] rounded-[24px] p-8">
              <h2 className="text-[22px] font-bold tracking-[-0.5px] mb-6 flex items-center gap-2">
                <Info className="w-5 h-5 text-[#0071e3]" />
                What you'll learn
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
                {studentViewCourseDetails?.objectives?.split('\n').filter(o => o.trim()).map((obj, i) => (
                  <div key={i} className="flex gap-3 text-[14px] text-[#424245] leading-[1.5]">
                    <Check className="w-4 h-4 text-[#0071e3] shrink-0 mt-0.5" />
                    {obj}
                  </div>
                ))}
              </div>
            </div>

            {/* Curriculum */}
            <div>
              <h2 className="text-[22px] font-bold tracking-[-0.5px] mb-6">Course Content</h2>
              <div className="border border-[#d2d2d7] rounded-[24px] overflow-hidden divide-y divide-[#d2d2d7]">
                {studentViewCourseDetails?.curriculum?.map((item, i) => (
                  <div 
                    key={i} 
                    className={`flex items-center justify-between p-5 transition-colors ${item.freePreview ? "cursor-pointer hover:bg-[#f5f5f7]" : "opacity-60 grayscale-[0.5]"}`}
                    onClick={() => item.freePreview && handleSetFreePreview(item)}
                  >
                    <div className="flex items-center gap-4">
                      {item.freePreview ? (
                        <div className="w-8 h-8 rounded-full bg-[#0071e3]/10 flex items-center justify-center">
                          <Play className="w-4 h-4 text-[#0071e3] fill-current" />
                        </div>
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-[#f5f5f7] flex items-center justify-center">
                          <Lock className="w-3.5 h-3.5 text-[#86868b]" />
                        </div>
                      )}
                      <div>
                        <p className="text-[14px] font-bold text-[#1d1d1f]">{item.title}</p>
                        <p className="text-[12px] text-[#86868b]">{item.freePreview ? "Preview lesson" : "Restricted"}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Description */}
            <div>
              <h2 className="text-[22px] font-bold tracking-[-0.5px] mb-4">Description</h2>
              <div className="prose prose-sm max-w-none text-[#424245] leading-[1.7] whitespace-pre-wrap">
                {studentViewCourseDetails?.description}
              </div>
            </div>
          </main>

          {/* SIDEBAR */}
          <aside className="sticky top-[80px]">
            <div className="bg-white border border-[#d2d2d7] rounded-[24px] shadow-[0_20px_40px_rgba(0,0,0,0.05)] overflow-hidden">
               <div className="relative group cursor-pointer" onClick={() => {
                   const preview = studentViewCourseDetails?.curriculum?.find(c => c.freePreview);
                   if (preview) handleSetFreePreview(preview);
               }}>
                  <img 
                    src={studentViewCourseDetails?.image} 
                    className="w-full aspect-video object-cover"
                  />
                  <div className="absolute inset-0 bg-black/20 flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center mb-2">
                        <Play className="w-5 h-5 fill-current" />
                    </div>
                    <span className="text-[13px] font-bold">Preview course</span>
                  </div>
               </div>
               
               <div className="p-8">
                  <div className="flex items-center justify-between mb-8">
                    <span className="text-[36px] font-bold tracking-[-1px] text-[#1d1d1f]">₹{studentViewCourseDetails?.pricing}</span>
                    <button onClick={handleShare} className="p-2 border border-[#d2d2d7] rounded-full hover:bg-[#f5f5f7] transition-colors">
                        <Share2 className="w-4 h-4 text-[#1d1d1f]" />
                    </button>
                  </div>

                  <div className="space-y-3">
                    {isCoursePurchased ? (
                        <button 
                            onClick={() => navigate(`/course-progress/${studentViewCourseDetails?._id}`)}
                            className="btn btn-blue w-full h-[52px] text-[15px]"
                        >
                            Continue Learning
                        </button>
                    ) : (
                        <>
                            <button onClick={handleBuyNow} className="btn btn-blue w-full h-[52px] text-[15px]">Buy Now</button>
                            <button onClick={handleAddToCartLocal} className="btn btn-outline w-full h-[52px] text-[15px]">
                                {isCourseInCart ? "Go to Cart" : "Add to Cart"}
                            </button>
                        </>
                    )}
                  </div>

                  <div className="mt-8 pt-8 border-t border-[#d2d2d7] space-y-4">
                    <p className="text-[13px] font-bold text-[#1d1d1f] mb-4">This course includes:</p>
                    <div className="flex items-center gap-3 text-[13px] text-[#424245]">
                        <BookOpen className="w-4 h-4 text-[#86868b]" />
                        <span>{studentViewCourseDetails?.curriculum?.length} lessons</span>
                    </div>
                    <div className="flex items-center gap-3 text-[13px] text-[#424245]">
                        <BarChart className="w-4 h-4 text-[#86868b]" />
                        <span>{studentViewCourseDetails?.level} Level</span>
                    </div>
                    <div className="flex items-center gap-3 text-[13px] text-[#424245]">
                        <Award className="w-4 h-4 text-[#86868b]" />
                        <span>Certificate of completion</span>
                    </div>
                  </div>
               </div>
            </div>
          </aside>
        </div>
      </div>

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

