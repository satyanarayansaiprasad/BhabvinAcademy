import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import VideoPlayer from "@/components/video-player";
import { AuthContext } from "@/context/auth-context";
import { StudentContext } from "@/context/student-context";
import {
  getCurrentCourseProgressService,
  markLectureAsViewedService,
  resetCourseProgressService,
} from "@/services";
import { Check, ChevronLeft, ChevronRight, Play, LayoutList, Info, GraduationCap, RotateCcw } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import Confetti from "react-confetti";
import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

function StudentViewCourseProgressPage() {
  const navigate = useNavigate();
  const { auth } = useContext(AuthContext);
  const { studentCurrentCourseProgress, setStudentCurrentCourseProgress } =
    useContext(StudentContext);
  const [lockCourse, setLockCourse] = useState(false);
  const [currentLecture, setCurrentLecture] = useState(null);
  const [showCourseCompleteDialog, setShowCourseCompleteDialog] =
    useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isSideBarOpen, setIsSideBarOpen] = useState(true);
  const { id } = useParams();

  async function fetchCurrentCourseProgress() {
    const response = await getCurrentCourseProgressService(auth?.user?._id, id);
    if (response?.success) {
      if (!response?.data?.isPurchased) {
        setLockCourse(true);
      } else {
        setStudentCurrentCourseProgress({
          courseDetails: response?.data?.courseDetails,
          progress: response?.data?.progress,
        });

        if (response?.data?.completed) {
          setCurrentLecture(response?.data?.courseDetails?.curriculum[0]);
          setShowCourseCompleteDialog(true);
          setShowConfetti(true);

          return;
        }

        if (response?.data?.progress?.length === 0) {
          setCurrentLecture(response?.data?.courseDetails?.curriculum[0]);
        } else {
          const lastIndexOfViewedAsTrue = response?.data?.progress.reduceRight(
            (acc, obj, index) => {
              return acc === -1 && obj.viewed ? index : acc;
            },
            -1
          );

          setCurrentLecture(
            response?.data?.courseDetails?.curriculum[
            lastIndexOfViewedAsTrue + 1
            ] || response?.data?.courseDetails?.curriculum[0]
          );
        }
      }
    }
  }

  async function updateCourseProgress() {
    if (currentLecture) {
      const response = await markLectureAsViewedService(
        auth?.user?._id,
        studentCurrentCourseProgress?.courseDetails?._id,
        currentLecture._id
      );

      if (response?.success) {
        fetchCurrentCourseProgress();
      }
    }
  }

  async function handleRewatchCourse() {
    const response = await resetCourseProgressService(
      auth?.user?._id,
      studentCurrentCourseProgress?.courseDetails?._id
    );

    if (response?.success) {
      setCurrentLecture(null);
      setShowConfetti(false);
      setShowCourseCompleteDialog(false);
      fetchCurrentCourseProgress();
    }
  }

  useEffect(() => {
    fetchCurrentCourseProgress();
  }, [id]);

  useEffect(() => {
    if (currentLecture?.progressValue === 1) updateCourseProgress();
  }, [currentLecture]);

  useEffect(() => {
    if (showConfetti) setTimeout(() => setShowConfetti(false), 15000);
  }, [showConfetti]);

  return (
    <div className="flex flex-col h-screen bg-black text-white font-sans overflow-hidden">
      {showConfetti && <Confetti opacity={0.6} recycle={false} numberOfPieces={500} />}

      {/* Premium Header */}
      <header className="flex items-center justify-between px-6 py-4 bg-zinc-950/50 backdrop-blur-xl border-b border-white/5 z-20">
        <div className="flex items-center gap-6">
          <motion.button
            whileHover={{ x: -4 }}
            onClick={() => navigate("/student-courses")}
            className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors font-bold text-sm"
          >
            <ChevronLeft className="h-5 w-5" />
            <span>My Learning</span>
          </motion.button>

          <div className="h-4 w-px bg-white/10 hidden md:block" />

          <h1 className="text-base font-bold tracking-tight text-white/90 hidden md:block max-w-md truncate">
            {studentCurrentCourseProgress?.courseDetails?.title}
          </h1>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden lg:flex flex-col items-end px-4">
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest leading-none mb-1">Your Progress</span>
            <span className="text-xs font-black text-blue-500">
              {Math.round((studentCurrentCourseProgress?.progress?.filter(p => p.viewed).length / studentCurrentCourseProgress?.courseDetails?.curriculum.length) * 100) || 0}% Complete
            </span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className={`rounded-xl transition-all ${isSideBarOpen ? "bg-white/10 text-white" : "text-zinc-500 hover:text-white hover:bg-white/5"}`}
            onClick={() => setIsSideBarOpen(!isSideBarOpen)}
          >
            <LayoutList className="h-5 w-5" />
          </Button>
        </div>
      </header>

      <div className="flex flex-1 relative overflow-hidden">
        {/* Main Content (Player) */}
        <main className={`flex-1 flex flex-col transition-all duration-500 ease-in-out ${isSideBarOpen ? "md:mr-[400px]" : "mr-0"}`}>
          <div className="flex-1 bg-black relative flex items-center justify-center">
            <VideoPlayer
              width="100%"
              height="100%"
              url={currentLecture?.videoUrl}
              onProgressUpdate={setCurrentLecture}
              progressData={currentLecture}
            />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-8 lg:p-12 bg-zinc-950 border-t border-white/5"
          >
            <span className="text-blue-500 font-bold text-xs uppercase tracking-widest mb-2 block">Now playing</span>
            <h2 className="text-[35px] font-black tracking-tighter text-white mb-4">{currentLecture?.title}</h2>
            <p className="text-zinc-500 font-medium max-w-3xl leading-relaxed">
              {studentCurrentCourseProgress?.courseDetails?.subtitle}
            </p>
          </motion.div>
        </main>

        {/* Course Content Sidebar */}
        <AnimatePresence>
          {isSideBarOpen && (
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-[73px] right-0 bottom-0 w-full md:w-[400px] bg-zinc-950 border-l border-white/5 z-10 flex flex-col shadow-2xl"
            >
              <Tabs defaultValue="content" className="flex flex-col h-full">
                <TabsList className="grid grid-cols-2 p-2 bg-white/5 mx-6 mt-6 rounded-2xl h-14">
                  <TabsTrigger
                    value="content"
                    className="rounded-xl data-[state=active]:bg-zinc-900 data-[state=active]:text-white text-zinc-500 font-bold transition-all"
                  >
                    Content
                  </TabsTrigger>
                  <TabsTrigger
                    value="overview"
                    className="rounded-xl data-[state=active]:bg-zinc-900 data-[state=active]:text-white text-zinc-500 font-bold transition-all"
                  >
                    Overview
                  </TabsTrigger>
                </TabsList>

                <div className="flex-1 overflow-hidden mt-4">
                  <TabsContent value="content" className="h-full m-0">
                    <ScrollArea className="h-full">
                      <div className="px-6 py-4 space-y-2">
                        {studentCurrentCourseProgress?.courseDetails?.curriculum.map((item, index) => {
                          const isViewed = studentCurrentCourseProgress?.progress?.find(
                            (progressItem) => progressItem.lectureId === item._id
                          )?.viewed;
                          const isCurrent = currentLecture?._id === item._id;

                          return (
                            <motion.div
                              key={item._id}
                              whileHover={{ x: 4 }}
                              onClick={() => setCurrentLecture(item)}
                              className={`flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-all border ${isCurrent
                                ? "bg-blue-600 border-blue-500 shadow-lg shadow-blue-600/20"
                                : "bg-white/0 border-transparent hover:bg-white/5 hover:border-white/5"
                                }`}
                            >
                              <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${isCurrent ? "bg-white/20" : isViewed ? "bg-emerald-500/10 text-emerald-500" : "bg-white/5 text-zinc-500"
                                }`}>
                                {isViewed ? (
                                  <Check className="h-4 w-4" />
                                ) : (
                                  <Play className={`h-4 w-4 ${isCurrent ? "text-white fill-current" : ""}`} />
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className={`text-sm font-bold tracking-tight truncate ${isCurrent ? "text-white" : "text-zinc-200"}`}>
                                  {item?.title}
                                </p>
                                <span className={`text-[10px] font-bold uppercase tracking-widest ${isCurrent ? "text-white/60" : "text-zinc-500"}`}>
                                  Lecture {index + 1}
                                </span>
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                    </ScrollArea>
                  </TabsContent>

                  <TabsContent value="overview" className="h-full m-0">
                    <ScrollArea className="h-full">
                      <div className="p-8">
                        <div className="flex items-center gap-3 mb-6 text-zinc-100">
                          <Info className="h-5 w-5 text-blue-500" />
                          <h2 className="text-[28px] font-black tracking-tighter">About Course.</h2>
                        </div>
                        <p className="text-zinc-400 font-medium leading-relaxed mb-10">
                          {studentCurrentCourseProgress?.courseDetails?.description}
                        </p>

                        <div className="p-6 rounded-3xl bg-white/5 border border-white/5">
                          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-500 mb-4">Instructor</h3>
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-zinc-800 overflow-hidden ring-2 ring-white/10">
                              <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100" />
                            </div>
                            <div>
                              <p className="font-bold text-white tracking-tight">{studentCurrentCourseProgress?.courseDetails?.instructorName}</p>
                              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Master Instructor</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </ScrollArea>
                  </TabsContent>
                </div>
              </Tabs>
            </motion.aside>
          )}
        </AnimatePresence>
      </div>

      {/* Course Locked Modal */}
      <Dialog open={lockCourse}>
        <DialogContent className="max-w-md border-none bg-zinc-950 p-8 rounded-[40px] text-center text-white">
          <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <GraduationCap className="h-10 w-10 text-red-500" />
          </div>
          <DialogHeader className="mb-8">
            <DialogTitle className="text-[35px] font-black tracking-tighter text-white">Access Denied.</DialogTitle>
            <DialogDescription className="text-zinc-500 font-medium text-base">
              You haven't enrolled in this course yet. Please visit the course page to get full access.
            </DialogDescription>
          </DialogHeader>
          <Button
            onClick={() => navigate("/courses")}
            className="w-full bg-white text-black hover:bg-zinc-200 rounded-[20px] h-14 text-base font-black"
          >
            Go to Explore
          </Button>
        </DialogContent>
      </Dialog>

      {/* Course Completion Modal */}
      <Dialog open={showCourseCompleteDialog}>
        <DialogContent className="max-w-lg border-none bg-zinc-950 p-12 rounded-[50px] text-center text-white shadow-3xl">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-28 h-28 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-8 relative"
          >
            <div className="absolute inset-0 bg-emerald-500 rounded-full blur-2xl opacity-20" />
            <Check className="h-14 w-14 text-emerald-500" />
          </motion.div>

          <DialogHeader className="mb-10">
            <DialogTitle className="text-4xl md:text-[50px] font-black tracking-tighter text-white mb-4">Mastery Achieved.</DialogTitle>
            <DialogDescription className="text-zinc-400 font-medium text-base leading-relaxed">
              Congratulations! You've successfully completed <br />
              <span className="text-white font-bold">"{studentCurrentCourseProgress?.courseDetails?.title}"</span>.
              You're now ready for the next challenge.
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-4">
            <Button
              onClick={() => navigate("/student-courses")}
              className="bg-white text-black hover:bg-zinc-200 rounded-[24px] h-16 text-base font-black flex items-center justify-center gap-2"
            >
              My Courses
            </Button>
            <Button
              variant="outline"
              onClick={handleRewatchCourse}
              className="bg-white/5 border-white/10 hover:bg-white/10 text-white rounded-[24px] h-16 text-base font-black flex items-center justify-center gap-2"
            >
              <RotateCcw className="h-5 w-5" />
              Rewatch
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default StudentViewCourseProgressPage;
