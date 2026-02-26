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
    <div className="bg-[#FBFBFC] min-h-screen">
      {/* Cinematic Hero Section */}
      <section className="relative bg-zinc-950 text-white pt-32 pb-24 overflow-hidden">
        {/* Abstract Glow */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />

        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <div className="max-w-4xl">
            <motion.div {...fadeUp} className="flex items-center gap-3 mb-6">
              <span className="px-3 py-1 rounded-full bg-blue-500/80 backdrop-blur-md text-[10px] font-bold tracking-widest uppercase">
                {studentViewCourseDetails?.category}
              </span>
              <span className="flex items-center gap-1 text-yellow-500 text-sm font-bold">
                <Star className="h-4 w-4 fill-current" />
                4.9 (1,240 reviews)
              </span>
            </motion.div>

            <motion.h1
              {...fadeUp}
              transition={{ delay: 0.1 }}
              className="text-3xl md:text-[50px] font-black tracking-tighter leading-tight mb-8"
            >
              {studentViewCourseDetails?.title}
            </motion.h1>

            <motion.p
              {...fadeUp}
              transition={{ delay: 0.2 }}
              className="text-base text-zinc-400 font-medium mb-12 leading-relaxed"
            >
              {studentViewCourseDetails?.subtitle}
            </motion.p>

            <motion.div
              {...fadeUp}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap items-center gap-8 text-zinc-400 font-bold text-sm tracking-tight"
            >
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 overflow-hidden">
                  <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100" alt="Avatar" />
                </div>
                <span>{studentViewCourseDetails?.instructorName}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>Last updated {studentViewCourseDetails?.date?.split("T")[0]}</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                <span>{studentViewCourseDetails?.primaryLanguage}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span>{studentViewCourseDetails?.students?.length} enrolled</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 lg:px-8 py-16">
        <div className="flex flex-col lg:flex-row gap-16">
          {/* Main Content */}
          <main className="flex-1 space-y-16">

            {/* What you'll learn */}
            <motion.section
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="bg-white rounded-[40px] border border-zinc-200/60 p-10 shadow-sm"
            >
              <h2 className="text-[22px] font-black tracking-tighter mb-8 text-zinc-900 flex items-center gap-3">
                <Info className="h-8 w-8 text-blue-600" />
                What you'll learn.
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {studentViewCourseDetails?.objectives
                  ?.split(",")
                  .map((objective, index) => (
                    <div key={index} className="flex items-start gap-4 group">
                      <div className="mt-1 flex-shrink-0 w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center group-hover:bg-blue-600 transition-colors">
                        <CheckCircle className="h-4 w-4 text-blue-600 group-hover:text-white transition-colors" />
                      </div>
                      <span className="text-zinc-600 font-medium leading-relaxed group-hover:text-zinc-900 transition-colors">{objective}</span>
                    </div>
                  ))}
              </div>
            </motion.section>

            {/* Curriculum */}
            <section>
              <h2 className="text-[22px] font-black tracking-tighter mb-8 text-zinc-900">Curriculum.</h2>
              <div className="bg-white rounded-[40px] border border-zinc-200/60 shadow-sm divide-y divide-zinc-100 overflow-hidden">
                {studentViewCourseDetails?.curriculum?.map(
                  (curriculumItem, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ x: 10 }}
                      className={`${curriculumItem?.freePreview
                        ? "cursor-pointer hover:bg-zinc-50/50"
                        : "cursor-not-allowed opacity-60"
                        } flex items-center justify-between p-8 transition-all group`}
                      onClick={
                        curriculumItem?.freePreview
                          ? () => handleSetFreePreview(curriculumItem)
                          : null
                      }
                    >
                      <div className="flex items-center gap-6">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${curriculumItem?.freePreview ? "bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white" : "bg-zinc-100 text-zinc-400"}`}>
                          {curriculumItem?.freePreview ? (
                            <Play className="h-5 w-5 fill-current" />
                          ) : (
                            <Lock className="h-5 w-5" />
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-zinc-900 text-base group-hover:text-blue-600 transition-colors">{curriculumItem?.title}</p>
                          <p className="text-zinc-400 text-xs font-medium">{curriculumItem?.freePreview ? "Free Preview" : "Paid Content"}</p>
                        </div>
                      </div>

                      {curriculumItem?.freePreview && (
                        <span className="text-blue-600 font-black text-xs uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                          Watch now →
                        </span>
                      )}
                    </motion.div>
                  )
                )}
              </div>
            </section>

            {/* Description */}
            <section>
              <h2 className="text-[22px] font-black tracking-tighter mb-8 text-zinc-900">Description.</h2>
              <div className="bg-white rounded-[40px] border border-zinc-200/60 p-10 shadow-sm">
                <p className="text-base text-zinc-600 leading-relaxed font-medium whitespace-pre-line">
                  {studentViewCourseDetails?.description}
                </p>
              </div>
            </section>
          </main>

          {/* Sticky Enrollment Sidebar */}
          <aside className="w-full lg:w-[450px] shrink-0">
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              className="sticky top-28"
            >
              <Card className="rounded-[48px] border-zinc-200/60 shadow-2xl overflow-hidden group">
                <CardContent className="p-0">
                  {/* Preview Container */}
                  <div className="relative aspect-video bg-zinc-900 overflow-hidden">
                    <img
                      src={studentViewCourseDetails?.image}
                      alt={studentViewCourseDetails?.title}
                      className="w-full h-full object-cover opacity-60 transition-transform duration-1000 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center text-white">
                      <div
                        onClick={() => {
                          if (getIndexOfFreePreviewUrl !== -1) {
                            handleSetFreePreview(studentViewCourseDetails?.curriculum[getIndexOfFreePreviewUrl]);
                          }
                        }}
                        className="w-16 h-16 rounded-full bg-white text-black flex items-center justify-center mb-4 cursor-pointer hover:scale-110 transition-transform shadow-2xl shadow-white/20"
                      >
                        <Play className="h-6 w-6 fill-current" />
                      </div>
                      <p className="font-bold text-sm tracking-widest uppercase mb-1">Preview this course</p>
                    </div>
                  </div>

                  <div className="p-10">
                    <div className="flex items-center justify-between mb-8">
                      <div>
                        <p className="text-zinc-400 font-bold uppercase tracking-widest text-[10px] mb-1">Lifetime Access</p>
                        <h3 className="text-[28px] font-black tracking-tighter text-zinc-900">₹{studentViewCourseDetails?.pricing}</h3>
                      </div>
                      <Button
                        onClick={handleShare}
                        variant="ghost"
                        className="rounded-full w-12 h-12 p-0 text-zinc-400 border border-zinc-100 hover:bg-zinc-50"
                      >
                        <Share2 className="h-5 w-5" />
                      </Button>
                    </div>

                    <div className="space-y-4">
                      <Button
                        onClick={handleBuyNow}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-[24px] h-16 text-xl font-bold shadow-xl shadow-blue-100 transition-all hover:scale-105 active:scale-95"
                      >
                        Buy Now
                      </Button>
                      <Button
                        variant="outline"
                        onClick={handleAddToCartLocal}
                        className="w-full rounded-[24px] h-16 text-lg font-bold border-zinc-200 text-zinc-700 hover:bg-zinc-50"
                      >
                        {isCourseInCart ? "Go to Cart" : "Add to Cart"}
                      </Button>
                    </div>

                    <div className="mt-8 pt-8 border-t border-zinc-100 flex items-center justify-center gap-2 text-zinc-400 font-medium text-xs">
                      <Lock className="h-3 w-3" />
                      30-Day Money-Back Guarantee
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="mt-8 px-6 text-center text-zinc-400 text-sm font-medium">
                Get full access to study materials, quizzes, and a certificate of completion.
              </div>
            </motion.div>
          </aside>
        </div>
      </div>

      {/* Free Preview Dialog */}
      <Dialog
        open={showFreePreviewDialog}
        onOpenChange={() => {
          setShowFreePreviewDialog(false);
          setDisplayCurrentVideoFreePreview(null);
        }}
      >
        <DialogContent className="max-w-[1000px] border-none bg-zinc-950 p-0 rounded-[40px] overflow-hidden text-white shadow-3xl">
          <div className="flex flex-col lg:flex-row h-full">
            <div className="flex-1 bg-black aspect-video lg:aspect-auto">
              <VideoPlayer
                url={displayCurrentVideoFreePreview}
                width="100%"
                height="100%"
              />
            </div>

            <div className="w-full lg:w-[350px] p-8 bg-zinc-900 border-l border-white/5 flex flex-col">
              <DialogHeader className="mb-8">
                <DialogTitle className="text-2xl font-black tracking-tighter text-white">Course Preview.</DialogTitle>
                <p className="text-zinc-500 font-medium">Watch free samples from the curriculum.</p>
              </DialogHeader>

              <div className="flex-1 overflow-y-auto space-y-4 hide-scrollbar">
                {studentViewCourseDetails?.curriculum
                  ?.filter((item) => item.freePreview)
                  .map((filteredItem, idx) => (
                    <motion.div
                      key={idx}
                      whileHover={{ x: 4 }}
                      onClick={() => handleSetFreePreview(filteredItem)}
                      className={`p-4 rounded-2xl cursor-pointer transition-all border ${displayCurrentVideoFreePreview === filteredItem.videoUrl ? "bg-blue-600 border-blue-500 shadow-lg shadow-blue-600/20" : "bg-white/5 border-white/5 hover:bg-white/10"}`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${displayCurrentVideoFreePreview === filteredItem.videoUrl ? "bg-white/20" : "bg-blue-600/20"}`}>
                          <Play className={`h-4 w-4 ${displayCurrentVideoFreePreview === filteredItem.videoUrl ? "text-white" : "text-blue-500"} fill-current`} />
                        </div>
                        <span className="font-bold text-sm tracking-tight line-clamp-1">{filteredItem?.title}</span>
                      </div>
                    </motion.div>
                  ))}
              </div>

              <DialogFooter className="mt-8 pt-8 border-t border-white/5">
                <DialogClose asChild>
                  <Button type="button" className="w-full bg-white/5 hover:bg-white/10 text-white rounded-2xl border-none">
                    Close Preview
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
