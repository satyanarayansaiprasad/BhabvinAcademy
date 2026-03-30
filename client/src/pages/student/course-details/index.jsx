import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import VideoPlayer from "@/components/video-player";
import { AuthContext } from "@/context/auth-context";
import { StudentContext } from "@/context/student-context";
import {
  checkCoursePurchaseInfoService,
  createPaymentService,
  fetchStudentViewCourseDetailsService,
} from "@/services";
import { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, Globe, Lock, PlayCircle, Clock, Users, Play, Star, Share2, Info, ShoppingCart } from "lucide-react";
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

  const [displayCurrentVideoFreePreview, setDisplayCurrentVideoFreePreview] =
    useState(null);
  const [showFreePreviewDialog, setShowFreePreviewDialog] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const { toast } = useToast();

  const isCourseInCart = cartItems.some(item => item.courseId === studentViewCourseDetails?._id);
  const isCoursePurchased = studentBoughtCoursesList.some(item => item.courseId === studentViewCourseDetails?._id);

  async function fetchStudentViewCourseDetails() {
    const response = await fetchStudentViewCourseDetailsService(
      currentCourseDetailsId
    );

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
      toast({
        title: "Please Sign In",
        description: "You need to be signed in to add courses to your cart.",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }

    if (cartItems.some(item => item.courseId === studentViewCourseDetails?._id)) {
      navigate("/cart");
      return;
    }

    const response = await handleAddToCart(studentViewCourseDetails?._id, auth?.user?._id);
    if (response?.success) {
      toast({
        title: "Added to Cart",
        description: "The course has been added to your cart successfully.",
      });
    }
  }

  function handleShare() {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    toast({
      title: "Link Copied!",
      description: "Course link has been copied to your clipboard.",
    });
  }

  useEffect(() => {
    if (displayCurrentVideoFreePreview !== null) setShowFreePreviewDialog(true);
  }, [displayCurrentVideoFreePreview]);

  useEffect(() => {
    if (currentCourseDetailsId !== null) fetchStudentViewCourseDetails();
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

  if (loadingState) return (
    <div className="container mx-auto p-8 space-y-8">
      <Skeleton className="h-[400px] w-full rounded-[40px]" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <Skeleton className="h-20 w-3/4" />
          <Skeleton className="h-40 w-full" />
        </div>
        <Skeleton className="h-[500px] w-full" />
      </div>
    </div>
  );

  const getIndexOfFreePreviewUrl =
    studentViewCourseDetails !== null
      ? studentViewCourseDetails?.curriculum?.findIndex(
        (item) => item.freePreview
      )
      : -1;

  const fadeUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Breadcrumb / Category Header */}
      <section className="bg-[#f2f2f2] border-b border-[#e6e6e6] pt-20 pb-8 lg:pt-24">
        <div className="container mx-auto px-4 lg:px-6 relative z-10">
          <div className="max-w-4xl">
            <div className="flex items-center gap-3 mb-4">
              <span className="px-2 py-0.5 rounded-sm bg-[#0067b8] text-white text-[10px] font-semibold tracking-wider uppercase">
                {studentViewCourseDetails?.category}
              </span>
            </div>

            <h1 className="text-3xl md:text-5xl font-semibold tracking-tight text-black leading-tight mb-4">
              {studentViewCourseDetails?.title}
            </h1>

            <p className="text-lg text-[#616161] font-normal mb-8 leading-relaxed max-w-3xl">
              {studentViewCourseDetails?.subtitle}
            </p>

            <div className="flex flex-wrap items-center gap-6 text-[#616161] font-semibold text-sm">
              <div className="flex items-center gap-2 text-black">
                <div className="w-6 h-6 rounded-full bg-[#e6e6e6] border border-[#d2d2d2] overflow-hidden">
                  <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100" alt="Avatar" />
                </div>
                <span>{studentViewCourseDetails?.instructorName}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                <span>Last updated {studentViewCourseDetails?.date?.split("T")[0]}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Globe className="h-4 w-4" />
                <span>{studentViewCourseDetails?.primaryLanguage}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 lg:px-6 py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Main Content */}
          <main className="flex-1 space-y-12">

            {/* What you'll learn */}
            <section className="bg-white rounded-sm border border-[#e6e6e6] p-8">
              <h2 className="text-xl font-semibold tracking-tight mb-6 text-black flex items-center gap-3">
                <Info className="h-6 w-6 text-[#0067b8]" />
                What you'll learn.
              </h2>
              <div className="grid grid-cols-1 gap-4">
                {studentViewCourseDetails?.objectives
                  ?.split("\n")
                  .filter(objective => objective && /[a-zA-Z0-9]/.test(objective))
                  .map((objective, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="mt-1 flex-shrink-0 w-5 h-5 rounded-sm bg-[#0067b8]/5 flex items-center justify-center">
                        <CheckCircle className="h-3.5 w-3.5 text-[#0067b8]" />
                      </div>
                      <span className="text-[#616161] text-sm font-normal leading-normal">{objective}</span>
                    </div>
                  ))}
              </div>
            </section>

            {/* Curriculum */}
            <section>
              <h2 className="text-xl font-semibold tracking-tight mb-6 text-black">Curriculum.</h2>
              <div className="bg-white rounded-sm border border-[#e6e6e6] divide-y divide-[#e6e6e6] overflow-hidden">
                {studentViewCourseDetails?.curriculum?.map(
                  (curriculumItem, index) => (
                    <div
                      key={index}
                      className={`flex items-center justify-between p-6 transition-colors ${curriculumItem?.freePreview
                        ? "cursor-pointer hover:bg-[#f2f2f2]"
                        : "opacity-60"
                        }`}
                      onClick={
                        curriculumItem?.freePreview
                          ? () => handleSetFreePreview(curriculumItem)
                          : null
                      }
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-14 h-14 rounded-sm flex items-center justify-center shrink-0 ${curriculumItem?.freePreview ? "bg-[#0067b8]/10 text-[#0067b8]" : "bg-[#f2f2f2] text-[#616161]"}`}>
                          {curriculumItem?.freePreview ? (
                            <Play className="h-6 w-6 fill-current" />
                          ) : (
                            <Lock className="h-6 w-6" />
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-black text-sm">{curriculumItem?.title}</p>
                          <p className="text-[#616161] text-xs font-normal">{curriculumItem?.freePreview ? "Free Preview" : "Private"}</p>
                        </div>
                      </div>

                      {curriculumItem?.freePreview && (
                        <span className="text-[#0067b8] font-semibold text-xs transition-opacity">
                          Watch →
                        </span>
                      )}
                    </div>
                  )
                )}
              </div>
            </section>

            {/* Description */}
            <section>
              <h2 className="text-xl font-semibold tracking-tight mb-6 text-black">Description.</h2>
              <div className="bg-white rounded-sm border border-[#e6e6e6] p-8">
                <p className="text-sm text-[#616161] leading-relaxed font-normal whitespace-pre-line">
                  {studentViewCourseDetails?.description}
                </p>
              </div>
            </section>
          </main>

          {/* Sticky Enrollment Sidebar */}
          <aside className="w-full lg:w-[400px] shrink-0">
            <div className="sticky top-24">
              <Card className="rounded-sm border-[#e6e6e6] shadow-md overflow-hidden bg-white">
                <CardContent className="p-0">
                  {/* Preview Container */}
                  <div className="relative aspect-video bg-[#000000] overflow-hidden group">
                    <img
                      src={studentViewCourseDetails?.image}
                      alt={studentViewCourseDetails?.title}
                      className="w-full h-full object-cover opacity-70 group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center text-white bg-black/20">
                      <div
                        onClick={() => {
                          if (getIndexOfFreePreviewUrl !== -1) {
                            handleSetFreePreview(studentViewCourseDetails?.curriculum[getIndexOfFreePreviewUrl]);
                          }
                        }}
                        className="w-14 h-14 rounded-full bg-white text-black flex items-center justify-center mb-4 cursor-pointer hover:scale-110 transition-transform shadow-lg"
                      >
                        <Play className="h-5 w-5 fill-current" />
                      </div>
                      <p className="font-semibold text-xs tracking-wider uppercase">Preview course</p>
                    </div>
                  </div>

                  <div className="p-8">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <p className="text-[#0067b8] font-bold uppercase tracking-wider text-[10px] mb-1">{studentViewCourseDetails?.accessType || "Lifetime Access"}</p>
                        <h3 className="text-3xl font-bold tracking-tight text-black">₹{studentViewCourseDetails?.pricing}</h3>
                      </div>
                      <Button
                        onClick={handleShare}
                        variant="ghost"
                        className="rounded-sm w-10 h-10 p-0 text-[#616161] border border-[#e6e6e6] hover:bg-[#f2f2f2] transition-none"
                      >
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="space-y-3">
                      {isCoursePurchased ? (
                        <Button
                          onClick={() => navigate(`/course-progress/${studentViewCourseDetails?._id}`)}
                          className="w-full bg-[#0067b8] hover:bg-[#005a9e] text-white rounded-sm h-12 text-base font-semibold transition-none flex items-center justify-center gap-2"
                        >
                          <PlayCircle className="w-5 h-5" />
                          Start learning
                        </Button>
                      ) : (
                        <>
                          <Button
                            onClick={handleBuyNow}
                            className="w-full bg-[#0067b8] hover:bg-[#005a9e] text-white rounded-sm h-12 text-base font-semibold transition-none"
                          >
                            Buy now
                          </Button>
                          <Button
                            variant="outline"
                            onClick={handleAddToCartLocal}
                            className="w-full rounded-sm h-12 text-base font-semibold border-[#e6e6e6] text-black hover:bg-[#f2f2f2] transition-none"
                          >
                            {isCourseInCart ? "In cart" : "Add to cart"}
                          </Button>
                        </>
                      )}
                    </div>

                    <div className="mt-6 pt-6 border-t border-[#e6e6e6] flex items-center justify-center gap-2 text-[#b08902] font-bold text-xs">
                      <Lock className="h-3 w-3" />
                      7-Day Money-Back Guarantee
                    </div>
                  </div>
                </CardContent>
              </Card>


            </div>
          </aside>
        </div>
      </div>

      <Dialog
        open={showFreePreviewDialog}
        onOpenChange={() => {
          setShowFreePreviewDialog(false);
          setDisplayCurrentVideoFreePreview(null);
        }}
      >
        <DialogContent className="max-w-[1240px] w-[95vw] h-auto lg:h-[80vh] border-none bg-black p-0 rounded-sm overflow-hidden text-white shadow-2xl flex flex-col">
          <div className="flex flex-col lg:flex-row h-full overflow-hidden">
            <div className="flex-1 bg-black flex items-center justify-center min-h-[300px]">
              <VideoPlayer
                url={displayCurrentVideoFreePreview}
                width="100%"
                height="100%"
              />
            </div>

            <div className="w-full lg:w-[320px] p-6 bg-[#1a1a1a] border-l border-white/10 flex flex-col">
              <DialogHeader className="mb-6">
                <DialogTitle className="text-xl font-semibold tracking-tight text-white">Course Preview</DialogTitle>
                <p className="text-[#a1a1a1] text-xs font-normal">Watch samples from the curriculum.</p>
              </DialogHeader>

              <div className="flex-1 overflow-y-auto space-y-2 hide-scrollbar">
                {studentViewCourseDetails?.curriculum
                  ?.filter((item) => item.freePreview)
                  .map((filteredItem, idx) => (
                    <div
                      key={idx}
                      onClick={() => handleSetFreePreview(filteredItem)}
                      className={`p-3 rounded-sm cursor-pointer transition-colors border ${displayCurrentVideoFreePreview === filteredItem.videoUrl ? "bg-[#0067b8] border-[#0067b8]" : "bg-white/5 border-transparent hover:bg-white/10"}`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-sm flex items-center justify-center ${displayCurrentVideoFreePreview === filteredItem.videoUrl ? "bg-white/20" : "bg-[#0067b8]/20"}`}>
                          <Play className={`h-3.5 w-3.5 ${displayCurrentVideoFreePreview === filteredItem.videoUrl ? "text-white" : "text-[#0067b8]"} fill-current`} />
                        </div>
                        <span className="font-semibold text-sm tracking-tight line-clamp-1">{filteredItem?.title}</span>
                      </div>
                    </div>
                  ))}
              </div>

              <DialogFooter className="mt-6 pt-6 border-t border-white/10">
                <DialogClose asChild>
                  <Button type="button" className="w-full bg-white/10 hover:bg-white/20 text-white rounded-sm h-10 transition-none border-none text-sm font-semibold">
                    Close
                  </Button>
                </DialogClose>
              </DialogFooter>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default StudentViewCourseDetailsPage;
