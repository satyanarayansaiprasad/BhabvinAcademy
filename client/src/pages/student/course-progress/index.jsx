import { Button } from "@/components/ui/button";
import { AuthContext } from "@/context/auth-context";
import { StudentContext } from "@/context/student-context";
import { Check, ChevronLeft, Play, LayoutList, Info, GraduationCap, RotateCcw } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import Confetti from "react-confetti";
import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Certificate from "@/components/certificate";
import { Award } from "lucide-react";
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
import {
  getCurrentCourseProgressService,
  markLectureAsViewedService,
  resetCourseProgressService,
} from "@/services";

function StudentViewCourseProgressPage() {
  const navigate = useNavigate();
  const { auth } = useContext(AuthContext);
  const { studentCurrentCourseProgress, setStudentCurrentCourseProgress } = useContext(StudentContext);
  const [lockCourse, setLockCourse] = useState(false);
  const [currentLecture, setCurrentLecture] = useState(null);
  const [showCourseCompleteDialog, setShowCourseCompleteDialog] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isSideBarOpen, setIsSideBarOpen] = useState(true);
  const [showCertificate, setShowCertificate] = useState(false);
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
            (acc, obj, index) => acc === -1 && obj.viewed ? index : acc, -1
          );
          setCurrentLecture(
            response?.data?.courseDetails?.curriculum[lastIndexOfViewedAsTrue + 1] ||
            response?.data?.courseDetails?.curriculum[0]
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
      if (response?.success) fetchCurrentCourseProgress();
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

  useEffect(() => { fetchCurrentCourseProgress(); }, [id]);
  useEffect(() => { if (currentLecture?.progressValue === 1) updateCourseProgress(); }, [currentLecture]);
  useEffect(() => { if (showConfetti) setTimeout(() => setShowConfetti(false), 15000); }, [showConfetti]);

  return (
    <div className="flex flex-col h-screen bg-black text-white font-sans overflow-hidden">
      {showConfetti && <Confetti opacity={0.6} recycle={false} numberOfPieces={500} />}

      {/* Header */}
      <header className="flex items-center justify-between px-3 xs:px-6 py-3 xs:py-4 bg-zinc-950/50 backdrop-blur-xl border-b border-white/5 z-20 shrink-0">
        <div className="flex items-center gap-2 xs:gap-6 min-w-0">
          <motion.button
            whileHover={{ x: -4 }}
            onClick={() => navigate("/student-courses")}
            className="flex items-center gap-1 xs:gap-2 text-zinc-400 hover:text-white transition-colors font-bold text-xs xs:text-sm shrink-0 min-h-[44px]"
          >
            <ChevronLeft className="h-4 w-4 xs:h-5 xs:w-5" />
            <span>My Learning</span>
          </motion.button>
          <div className="h-4 w-px bg-white/10 hidden md:block" />
          <h1 className="text-xs xs:text-sm md:text-base font-bold tracking-tight text-white/90 hidden xs:block max-w-[120px] sm:max-w-xs md:max-w-md truncate">
            {studentCurrentCourseProgress?.courseDetails?.title}
          </h1>
        </div>

        <div className="flex items-center gap-2 xs:gap-4 shrink-0">
          <div className="hidden lg:flex flex-col items-end px-4">
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest leading-none mb-1">Your Progress</span>
            <span className="text-xs font-black text-blue-500">
              {Math.round((studentCurrentCourseProgress?.progress?.filter(p => p.viewed).length / studentCurrentCourseProgress?.courseDetails?.curriculum.length) * 100) || 0}% Complete
            </span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className={`rounded-lg xs:rounded-xl transition-all min-w-[44px] min-h-[44px] ${isSideBarOpen ? "bg-white/10 text-white" : "text-zinc-500 hover:text-white hover:bg-white/5"}`}
            onClick={() => setIsSideBarOpen(!isSideBarOpen)}
          >
            <LayoutList className="h-4 w-4 xs:h-5 xs:w-5" />
          </Button>
        </div>
      </header>

      <div className="flex flex-1 relative overflow-hidden">
        {/* Main Player */}
        <main className={`flex-1 flex flex-col transition-all duration-500 ease-in-out overflow-hidden ${isSideBarOpen ? "md:mr-[360px] lg:mr-[400px]" : "mr-0"}`}>
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
            className="p-4 xs:p-6 md:p-8 lg:p-12 bg-zinc-950 border-t border-white/5 shrink-0"
          >
            <span className="text-blue-500 font-bold text-[10px] xs:text-xs uppercase tracking-widest mb-1 xs:mb-2 block">Now playing</span>
            <h2 className="text-lg xs:text-xl md:text-[28px] font-black tracking-tighter text-white mb-2 xs:mb-4 line-clamp-2">{currentLecture?.title}</h2>
            <p className="text-zinc-500 font-medium max-w-3xl leading-relaxed text-sm xs:text-base line-clamp-3 md:line-clamp-none mb-8">
              {studentCurrentCourseProgress?.courseDetails?.subtitle}
            </p>

            {currentLecture?.notes && (
              <div className="mt-8 space-y-4">
                <div className="flex items-center gap-2 text-blue-500">
                  <Info className="h-4 w-4" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Lesson Notes</span>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-3xl p-6 xs:p-8">
                  <pre className="text-zinc-300 font-mono text-xs xs:text-sm leading-relaxed whitespace-pre-wrap break-words">
                    {currentLecture?.notes}
                  </pre>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12 pt-12 border-t border-white/5">
              {currentLecture?.links && currentLecture?.links.length > 0 && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3 text-zinc-400">
                    <LayoutList className="h-4 w-4" />
                    <h3 className="text-xs font-black uppercase tracking-widest">Resources</h3>
                  </div>
                  <div className="grid grid-cols-1 gap-3">
                    {currentLecture?.links.map((link, index) => (
                      <motion.a
                        key={index}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ x: 8 }}
                        className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 transition-all group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center">
                            <Play className="h-3.5 w-3.5" />
                          </div>
                          <span className="text-sm font-bold text-zinc-200 group-hover:text-white transition-colors">{link.title}</span>
                        </div>
                        <ChevronLeft className="h-4 w-4 text-zinc-600 rotate-180" />
                      </motion.a>
                    ))}
                  </div>
                </div>
              )}

              {currentLecture?.pdfs && currentLecture?.pdfs.length > 0 && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3 text-zinc-400">
                    <Info className="h-4 w-4" />
                    <h3 className="text-xs font-black uppercase tracking-widest">Attachments</h3>
                  </div>
                  <div className="grid grid-cols-1 gap-3">
                    {currentLecture?.pdfs.map((pdf, index) => (
                      <motion.a
                        key={index}
                        href={pdf.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.02 }}
                        className="flex items-center gap-4 p-4 rounded-2xl bg-zinc-900 border border-white/5 hover:border-blue-500/50 transition-all group"
                      >
                        <div className="w-10 h-10 rounded-xl bg-red-500/10 text-red-500 flex items-center justify-center">
                          <Info className="h-5 w-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-zinc-200 truncate group-hover:text-white transition-colors">{pdf.title}</p>
                          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">PDF Document</span>
                        </div>
                        <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-zinc-400 group-hover:bg-blue-600 group-hover:text-white transition-all">
                          <ChevronLeft className="h-4 w-4 rotate-180" />
                        </div>
                      </motion.a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </main>

        {/* Sidebar */}
        <AnimatePresence>
          {isSideBarOpen && (
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-[57px] xs:top-[65px] right-0 bottom-0 w-full xs:w-80 md:w-[360px] lg:w-[400px] bg-zinc-950 border-l border-white/5 z-10 flex flex-col shadow-2xl"
            >
              <Tabs defaultValue="content" className="flex flex-col h-full">
                <TabsList className="grid grid-cols-2 p-1.5 xs:p-2 bg-white/5 mx-3 xs:mx-6 mt-3 xs:mt-6 rounded-xl xs:rounded-2xl h-11 xs:h-14 shrink-0">
                  <TabsTrigger
                    value="content"
                    className="rounded-lg xs:rounded-xl data-[state=active]:bg-zinc-900 data-[state=active]:text-white text-zinc-500 font-bold transition-all text-xs xs:text-sm"
                  >
                    Content
                  </TabsTrigger>
                  <TabsTrigger
                    value="overview"
                    className="rounded-lg xs:rounded-xl data-[state=active]:bg-zinc-900 data-[state=active]:text-white text-zinc-500 font-bold transition-all text-xs xs:text-sm"
                  >
                    Overview
                  </TabsTrigger>
                </TabsList>

                <div className="flex-1 overflow-hidden mt-3 xs:mt-4">
                  <TabsContent value="content" className="h-full m-0">
                    <ScrollArea className="h-full">
                      <div className="px-3 xs:px-6 py-3 xs:py-4 space-y-1.5 xs:space-y-2">
                        {studentCurrentCourseProgress?.courseDetails?.curriculum.map((item, index) => {
                          const isViewed = studentCurrentCourseProgress?.progress?.find(
                            (p) => p.lectureId === item._id
                          )?.viewed;
                          const isCurrent = currentLecture?._id === item._id;
                          return (
                            <motion.div
                              key={item._id}
                              whileHover={{ x: 4 }}
                              onClick={() => setCurrentLecture(item)}
                              className={`flex items-center gap-3 xs:gap-4 p-3 xs:p-4 rounded-xl xs:rounded-2xl cursor-pointer transition-all border ${isCurrent
                                ? "bg-blue-600 border-blue-500 shadow-lg shadow-blue-600/20"
                                : "bg-white/0 border-transparent hover:bg-white/5 hover:border-white/5"
                                }`}
                            >
                              <div className={`w-7 h-7 xs:w-8 xs:h-8 rounded-lg xs:rounded-xl flex items-center justify-center shrink-0 ${isCurrent ? "bg-white/20" : isViewed ? "bg-emerald-500/10 text-emerald-500" : "bg-white/5 text-zinc-500"
                                }`}>
                                {isViewed ? (
                                  <Check className="h-3.5 w-3.5 xs:h-4 xs:w-4" />
                                ) : (
                                  <Play className={`h-3.5 w-3.5 xs:h-4 xs:w-4 ${isCurrent ? "text-white fill-current" : ""}`} />
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className={`text-xs xs:text-sm font-bold tracking-tight truncate ${isCurrent ? "text-white" : "text-zinc-200"}`}>
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
                      <div className="p-5 xs:p-8">
                        <div className="flex items-center gap-2 xs:gap-3 mb-4 xs:mb-6 text-zinc-100">
                          <Info className="h-4 w-4 xs:h-5 xs:w-5 text-blue-500 shrink-0" />
                          <h2 className="text-base xs:text-lg font-black tracking-tighter">About Course.</h2>
                        </div>
                        <p className="text-zinc-400 font-medium leading-relaxed mb-6 xs:mb-10 text-sm xs:text-base">
                          {studentCurrentCourseProgress?.courseDetails?.description}
                        </p>
                        <div className="p-4 xs:p-6 rounded-2xl xs:rounded-3xl bg-white/5 border border-white/5">
                          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-500 mb-3 xs:mb-4">Instructor</h3>
                          <div className="flex items-center gap-3 xs:gap-4">
                            <div className="w-8 h-8 xs:w-10 xs:h-10 rounded-full bg-zinc-800 overflow-hidden ring-2 ring-white/10 shrink-0">
                              <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100" alt="Instructor" />
                            </div>
                            <div>
                              <p className="font-bold text-white tracking-tight text-sm xs:text-base">{studentCurrentCourseProgress?.courseDetails?.instructorName}</p>
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

      {/* Course Locked Dialog */}
      <Dialog open={lockCourse}>
        <DialogContent className="max-w-[90vw] xs:max-w-md border-none bg-zinc-950 p-6 xs:p-8 rounded-[28px] xs:rounded-[40px] text-center text-white">
          <div className="w-16 h-16 xs:w-20 xs:h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4 xs:mb-6">
            <GraduationCap className="h-8 w-8 xs:h-10 xs:w-10 text-red-500" />
          </div>
          <DialogHeader className="mb-5 xs:mb-8">
            <DialogTitle className="text-xl xs:text-2xl font-black tracking-tighter text-white">Access Denied.</DialogTitle>
            <DialogDescription className="text-zinc-500 font-medium text-sm xs:text-base">
              You haven't enrolled in this course yet. Please visit the course page to get full access.
            </DialogDescription>
          </DialogHeader>
          <Button
            onClick={() => navigate("/courses")}
            className="w-full bg-white text-black hover:bg-zinc-200 rounded-[16px] xs:rounded-[20px] h-12 xs:h-14 text-sm xs:text-base font-black min-h-[44px]"
          >
            Go to Explore
          </Button>
        </DialogContent>
      </Dialog>

      {/* Course Complete Dialog */}
      <Dialog open={showCourseCompleteDialog} onOpenChange={setShowCourseCompleteDialog}>
        <DialogContent className="max-w-[90vw] xs:max-w-lg border-none bg-zinc-950 p-8 xs:p-12 rounded-[32px] xs:rounded-[50px] text-center text-white shadow-3xl">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-20 h-20 xs:w-28 xs:h-28 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-5 xs:mb-8 relative"
          >
            <div className="absolute inset-0 bg-emerald-500 rounded-full blur-2xl opacity-20" />
            <Check className="h-10 w-10 xs:h-14 xs:w-14 text-emerald-500" />
          </motion.div>
          <DialogHeader className="mb-6 xs:mb-10">
            <DialogTitle className="text-2xl xs:text-3xl md:text-[50px] font-black tracking-tighter text-white mb-2 xs:mb-4">Mastery Achieved.</DialogTitle>
            <DialogDescription className="text-zinc-400 font-medium text-sm xs:text-base leading-relaxed">
              Congratulations! You've successfully completed <br />
              <span className="text-white font-bold">"{studentCurrentCourseProgress?.courseDetails?.title}"</span>.
              You're now ready for the next challenge.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-3 xs:gap-4 mt-4 xs:mt-8">
            <div className="grid grid-cols-2 gap-3 xs:gap-4">
              <Button
                onClick={() => navigate("/student-courses")}
                className="bg-white text-black hover:bg-zinc-200 rounded-[18px] xs:rounded-[24px] h-12 xs:h-16 text-sm xs:text-base font-black flex items-center justify-center gap-2 min-h-[44px]"
              >
                My Courses
              </Button>
              <Button
                variant="outline"
                onClick={handleRewatchCourse}
                className="bg-white/5 border-white/10 hover:bg-white/10 text-white rounded-[18px] xs:rounded-[24px] h-12 xs:h-16 text-sm xs:text-base font-black flex items-center justify-center gap-2 min-h-[44px]"
              >
                <RotateCcw className="h-4 w-4 xs:h-5 xs:w-5" />
                Rewatch
              </Button>
            </div>
            <Button
              onClick={() => { setShowCertificate(true); setShowCourseCompleteDialog(false); }}
              className="bg-amber-500 hover:bg-amber-600 text-white rounded-[18px] xs:rounded-[24px] h-12 xs:h-16 text-sm xs:text-base font-black flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 min-h-[44px]"
            >
              <Award className="h-5 w-5 xs:h-6 xs:w-6" />
              Claim Certificate
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {showCertificate && (
        <Certificate
          key={studentCurrentCourseProgress?.courseDetails?._id}
          userName={auth?.user?.userFullName || auth?.user?.userName}
          courseTitle={studentCurrentCourseProgress?.courseDetails?.title}
          completionDate={new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
          instructorName={studentCurrentCourseProgress?.courseDetails?.instructorName}
          silentDownload={true}
          onDownloadComplete={() => setShowCertificate(false)}
        />
      )}
    </div>
  );
}

export default StudentViewCourseProgressPage;
