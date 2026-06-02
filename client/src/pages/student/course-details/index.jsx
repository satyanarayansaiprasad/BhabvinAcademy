import React, { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { StudentContext } from "@/context/student-context";
import { AuthContext } from "@/context/auth-context";
import { fetchStudentViewCourseDetailsService } from "@/services";
import { useToast } from "@/hooks/use-toast";
import VideoPlayer from "@/components/video-player";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";

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
    <div className="bg-surface font-body text-on-surface leading-relaxed overflow-x-hidden min-h-screen">
      <main className="pt-24 pb-12 px-4 md:px-6 max-w-7xl mx-auto">
        {/* Breadcrumbs & Category */}
        <div className="flex items-center gap-2 mb-6 text-xs font-semibold text-primary uppercase tracking-widest text-left">
          <span>Clinical Reviews</span>
          <span className="material-symbols-outlined text-[10px]">chevron_right</span>
          <span>{studentViewCourseDetails?.category || "Immunity Boosters"}</span>
        </div>

        {/* Hero Section: Editorial Header */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16 text-left">
          <div className="lg:col-span-8">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-headline font-extrabold text-on-surface leading-[1.1] mb-8 tracking-tight">
              {studentViewCourseDetails?.title}: A Scientific Review
            </h1>
            
            {/* Author Section */}
            <div className="flex items-center gap-4 p-4 rounded-xl bg-surface-container-low w-fit mb-8">
              <div className="w-14 h-14 rounded-full bg-primary-fixed flex items-center justify-center text-primary font-bold text-lg uppercase shrink-0">
                {studentViewCourseDetails?.instructorName?.slice(0, 2)}
              </div>
              <div>
                <p className="text-sm font-headline font-bold text-on-surface">{studentViewCourseDetails?.instructorName || "Dr. Alan Grant"}</p>
                <p className="text-xs text-on-surface-variant">Certified Lead Instructor • Clinical Reviewer</p>
              </div>
              <div className="ml-4 px-3 py-1 rounded-full bg-secondary/10 text-secondary text-[10px] font-bold flex items-center gap-1">
                <span className="material-symbols-outlined text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                EXPERT VERIFIED
              </div>
            </div>

            <p className="text-lg md:text-xl text-on-surface-variant leading-relaxed font-light mb-8 italic">
              "{studentViewCourseDetails?.subtitle || "In an era of misinformation, clinical evidence is our only compass. We've spent 200+ hours analyzing bioavailability and trial data."}"
            </p>

            {/* Product Gallery (Hero Style) */}
            <div 
              className="relative rounded-2xl overflow-hidden mb-12 aspect-[16/9] group shadow-2xl shadow-on-surface/5 cursor-pointer"
              onClick={() => {
                const preview = studentViewCourseDetails?.curriculum?.find(c => c.freePreview);
                if (preview) handleSetFreePreview(preview);
              }}
            >
              <img 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                alt={studentViewCourseDetails?.title}
                src={studentViewCourseDetails?.image}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
              <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end">
                <div className="bg-white/90 backdrop-blur p-4 rounded-xl border border-white/20">
                  <p className="text-primary font-bold text-sm">Top Recommendation</p>
                  <h3 className="text-on-surface font-headline font-extrabold text-xl">{studentViewCourseDetails?.title}</h3>
                </div>
                <div className="flex gap-2">
                  <button className="w-10 h-10 rounded-full bg-white/90 backdrop-blur flex items-center justify-center text-primary shadow-lg"><span className="material-symbols-outlined">play_arrow</span></button>
                  <button onClick={(e) => { e.stopPropagation(); handleShare(); }} className="w-10 h-10 rounded-full bg-white/90 backdrop-blur flex items-center justify-center text-primary shadow-lg"><span className="material-symbols-outlined">share</span></button>
                </div>
              </div>
            </div>
          </div>

          {/* Sticky Table of Contents / Sidebar */}
          <aside className="hidden lg:block lg:col-span-4 text-left">
            <div className="sticky top-28 p-8 rounded-2xl bg-surface-container-low border border-outline-variant/10">
              <h4 className="font-headline font-bold text-on-surface mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">list_alt</span>
                On This Page
              </h4>
              <ul className="space-y-4 text-sm font-medium">
                <li><a className="text-primary border-l-4 border-primary pl-3 block" href="#overview">Scientific Overview</a></li>
                <li><a className="text-on-surface-variant hover:text-primary transition-colors pl-4 block" href="#curriculum">Curriculum Breakdown</a></li>
                <li><a className="text-on-surface-variant hover:text-primary transition-colors pl-4 block" href="#benefits">Primary Benefits</a></li>
                <li><a className="text-on-surface-variant hover:text-primary transition-colors pl-4 block" href="#proscons">Pros &amp; Cons</a></li>
                <li><a className="text-on-surface-variant hover:text-primary transition-colors pl-4 block" href="#faq">Safety &amp; Side Effects</a></li>
              </ul>
              
              <div className="mt-10 pt-8 border-t border-outline-variant/20">
                <p className="text-[10px] text-on-surface-variant uppercase tracking-widest mb-4">Current Best Deal</p>
                <div className="p-4 rounded-xl bg-primary-container/20 border border-primary/10">
                  <p className="text-xs font-bold text-primary mb-1">{studentViewCourseDetails?.title}</p>
                  <p className="text-xl font-black text-on-surface mb-3">₹{studentViewCourseDetails?.pricing} <span className="text-xs font-normal line-through opacity-50">₹{Math.round(studentViewCourseDetails?.pricing * 1.5)}</span></p>
                  
                  {isCoursePurchased ? (
                    <button 
                      onClick={() => navigate(`/course-progress/${studentViewCourseDetails?._id}`)}
                      className="w-full py-3 bg-gradient-to-br from-primary to-primary-container text-white rounded-lg font-bold text-sm scale-102 transition-transform"
                    >
                      Continue Learning
                    </button>
                  ) : (
                    <div className="flex flex-col gap-2">
                      <button onClick={handleBuyNow} className="w-full py-3 bg-gradient-to-br from-primary to-primary-container text-white rounded-lg font-bold text-sm scale-102 transition-transform">Buy Now</button>
                      <button onClick={handleAddToCartLocal} className="w-full py-3 bg-surface-container-high text-on-surface rounded-lg font-bold text-sm hover:bg-slate-200 transition-colors">
                        {isCourseInCart ? "Go to Cart" : "Add to Cart"}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </aside>
        </section>

        {/* Main Content Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 text-left">
          <div className="lg:col-span-8 space-y-24">
            
            {/* Overview Section */}
            <section className="scroll-mt-28" id="overview">
              <div className="flex items-center gap-3 mb-6">
                <span className="h-[2px] w-12 bg-primary rounded-full"></span>
                <h2 className="text-2xl md:text-3xl font-headline font-extrabold tracking-tight">The Clinical Landscape</h2>
              </div>
              <div className="prose prose-slate max-w-none text-on-surface-variant text-lg leading-relaxed space-y-6 font-body">
                <p>
                  {studentViewCourseDetails?.description || "Most commercial courses rely on outdated rote-learning methodologies. Our curriculum focuses heavily on hands-on practice, scenario-based labs, and deep concept comprehension."}
                </p>
              </div>
            </section>

            {/* Curriculum Breakdown Section */}
            <section className="scroll-mt-28 p-8 md:p-12 rounded-3xl bg-surface-container-low" id="curriculum">
              <h2 className="text-2xl md:text-3xl font-headline font-extrabold mb-10 text-center">Curriculum Matrix</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {studentViewCourseDetails?.curriculum?.map((item, idx) => (
                  <div 
                    key={idx} 
                    className={`p-6 rounded-2xl bg-surface-container-lowest shadow-sm flex gap-4 cursor-pointer hover:border-primary/20 border border-transparent transition-all ${
                      item.freePreview ? "" : "opacity-75"
                    }`}
                    onClick={() => item.freePreview && handleSetFreePreview(item)}
                  >
                    <span className="material-symbols-outlined text-secondary text-3xl">
                      {item.freePreview ? "play_circle" : "lock"}
                    </span>
                    <div>
                      <h4 className="font-bold font-headline text-on-surface">{item.title}</h4>
                      <p className="text-sm text-on-surface-variant mt-2 font-body">
                        {item.freePreview ? "Free Lesson Preview Available" : "Course module requires enrollment."}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Benefits Section */}
            <section className="scroll-mt-28" id="benefits">
              <h2 className="text-2xl md:text-3xl font-headline font-extrabold mb-10">Observed Benefits</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2 p-8 rounded-3xl bg-primary text-white flex flex-col md:flex-row gap-8 items-center">
                  <div className="text-center md:text-left">
                    <h3 className="text-2xl font-headline font-bold mb-4">Hands-On Lab Environments</h3>
                    <p className="text-on-primary-container text-sm leading-relaxed font-body">
                      Our metrics confirm that students learn 3x faster when applying concepts in sandboxed virtual labs immediately after the lecture segment.
                    </p>
                  </div>
                  <div className="w-48 h-48 rounded-2xl bg-primary-container shrink-0 flex items-center justify-center text-6xl">
                    💻
                  </div>
                </div>
                <div className="p-6 rounded-3xl bg-secondary-container/20 border border-secondary/10">
                  <h4 className="font-bold font-headline text-on-secondary-container mb-2">Core Competency</h4>
                  <p className="text-sm text-on-surface-variant font-body">Emphasis on critical thinking rather than just passing exam dumps.</p>
                </div>
                <div className="p-6 rounded-3xl bg-surface-container-low border border-outline-variant/10">
                  <h4 className="font-bold font-headline text-on-surface mb-2">Updated Material</h4>
                  <p className="text-sm text-on-surface-variant font-body">Course notes and videos are updated continuously as technology shifts.</p>
                </div>
              </div>
            </section>

            {/* Pros & Cons Section */}
            <section className="scroll-mt-28 grid grid-cols-1 md:grid-cols-2 gap-0 overflow-hidden rounded-3xl" id="proscons">
              <div className="p-10 bg-secondary/5 border-r border-outline-variant/10">
                <div className="flex items-center gap-2 mb-6 text-secondary">
                  <span className="material-symbols-outlined">check_circle</span>
                  <h3 className="font-headline font-bold text-lg uppercase tracking-wider">The Clinical Edge</h3>
                </div>
                <ul className="space-y-4 text-sm font-medium text-on-surface font-body">
                  <li className="flex items-start gap-3"><span className="w-1.5 h-1.5 rounded-full bg-secondary mt-2 shrink-0"></span> Real-world Sandbox Labs</li>
                  <li className="flex items-start gap-3"><span className="w-1.5 h-1.5 rounded-full bg-secondary mt-2 shrink-0"></span> Certified Professional Instructor</li>
                  <li className="flex items-start gap-3"><span className="w-1.5 h-1.5 rounded-full bg-secondary mt-2 shrink-0"></span> Lifetime Curriculum Updates</li>
                  <li className="flex items-start gap-3"><span className="w-1.5 h-1.5 rounded-full bg-secondary mt-2 shrink-0"></span> Active Discord Learning Community</li>
                </ul>
              </div>
              <div className="p-10 bg-error/5">
                <div className="flex items-center gap-2 mb-6 text-error">
                  <span className="material-symbols-outlined">cancel</span>
                  <h3 className="font-headline font-bold text-lg uppercase tracking-wider">Limitations</h3>
                </div>
                <ul className="space-y-4 text-sm font-medium text-on-surface font-body">
                  <li className="flex items-start gap-3"><span className="w-1.5 h-1.5 rounded-full bg-error mt-2 shrink-0"></span> High learning intensity</li>
                  <li className="flex items-start gap-3"><span className="w-1.5 h-1.5 rounded-full bg-error mt-2 shrink-0"></span> Requires dedicated daily hours</li>
                  <li className="flex items-start gap-3"><span className="w-1.5 h-1.5 rounded-full bg-error mt-2 shrink-0"></span> Not suitable for instant cheat-sheet seekers</li>
                </ul>
              </div>
            </section>

            {/* FAQ / Objectives Section */}
            <section className="scroll-mt-28" id="faq">
              <h2 className="text-2xl md:text-3xl font-headline font-extrabold mb-10">Frequently Asked Questions</h2>
              <div className="space-y-4">
                <div className="p-6 rounded-2xl bg-surface-container-low">
                  <h4 className="font-bold text-on-surface mb-2 font-headline">Will this help me pass certification exams?</h4>
                  <p className="text-sm text-on-surface-variant leading-relaxed font-body">Yes. The material is mapped directly to the official certification blueprints and includes mock practice questions.</p>
                </div>
                <div className="p-6 rounded-2xl bg-surface-container-low">
                  <h4 class="font-bold text-on-surface mb-2 font-headline">Is there any lab coding support?</h4>
                  <p className="text-sm text-on-surface-variant leading-relaxed font-body">Yes, all code snippets, template configurations, and infrastructure code are provided in our Git repository.</p>
                </div>
                <div className="p-6 rounded-2xl bg-surface-container-low">
                  <h4 class="font-bold text-on-surface mb-2 font-headline">Do you offer certificates?</h4>
                  <p className="text-sm text-on-surface-variant leading-relaxed font-body">Yes, a shareable PDF certificate is issued automatically upon 100% course curriculum completion.</p>
                </div>
              </div>
            </section>

          </div>
          
          {/* Mobile Deal Sidebar */}
          <aside className="lg:hidden col-span-full mt-10">
            <div className="p-8 rounded-3xl bg-white shadow-xl shadow-on-surface/5 border border-outline-variant/10">
              <img 
                className="w-full aspect-video object-cover rounded-xl mb-6" 
                alt={studentViewCourseDetails?.title}
                src={studentViewCourseDetails?.image}
              />
              <div className="text-center mb-8">
                <h3 className="text-2xl font-headline font-black mb-2">{studentViewCourseDetails?.title}</h3>
                <p className="text-sm text-on-surface-variant font-body">₹{studentViewCourseDetails?.pricing}</p>
              </div>
              
              {isCoursePurchased ? (
                <button 
                  onClick={() => navigate(`/course-progress/${studentViewCourseDetails?._id}`)}
                  className="w-full py-5 bg-gradient-to-br from-primary to-primary-container text-white text-center rounded-xl font-bold text-lg"
                >
                  Continue Learning
                </button>
              ) : (
                <div className="flex flex-col gap-2">
                  <button onClick={handleBuyNow} className="w-full py-5 bg-gradient-to-br from-primary to-primary-container text-white text-center rounded-xl font-bold text-lg">Buy Now</button>
                  <button onClick={handleAddToCartLocal} className="w-full py-5 bg-surface-container-high text-on-surface text-center rounded-xl font-bold text-lg">
                    {isCourseInCart ? "Go to Cart" : "Add to Cart"}
                  </button>
                </div>
              )}
            </div>
          </aside>
        </div>
      </main>

      {/* Video Preview Dialog */}
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
