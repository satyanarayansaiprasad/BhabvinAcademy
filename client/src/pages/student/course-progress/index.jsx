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
    <div className="flex flex-col h-screen bg-white text-black font-sans overflow-hidden">
      {showConfetti && <Confetti opacity={0.6} recycle={false} numberOfPieces={500} />}

      {/* Header */}
      <header className="flex items-center justify-between px-4 xs:px-6 py-3 bg-white border-b border-[#e6e6e6] z-20 shrink-0">
        <div className="flex items-center gap-4 min-w-0">
          <button
            onClick={() => navigate("/student-courses")}
            className="flex items-center gap-2 text-[#616161] hover:text-black transition-colors font-semibold text-sm shrink-0"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>My Learning</span>
          </button>
          <div className="h-4 w-px bg-[#e6e6e6] hidden md:block" />
          <h1 className="text-sm font-semibold tracking-tight text-black hidden xs:block max-w-md truncate">
            {studentCurrentCourseProgress?.courseDetails?.title}
          </h1>
        </div>

        <div className="flex items-center gap-4 shrink-0">
          <div className="hidden lg:flex flex-col items-end px-4">
            <span className="text-[10px] font-semibold text-[#616161] uppercase tracking-wider mb-0.5">Progress</span>
            <span className="text-xs font-bold text-[#0067b8]">
              {Math.round((studentCurrentCourseProgress?.progress?.filter(p => p.viewed).length / studentCurrentCourseProgress?.courseDetails?.curriculum.length) * 100) || 0}% Complete
            </span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className={`rounded-sm transition-none h-10 w-10 ${isSideBarOpen ? "bg-[#f2f2f2] text-black" : "text-[#616161] hover:bg-[#f2f2f2]"}`}
            onClick={() => setIsSideBarOpen(!isSideBarOpen)}
          >
            <LayoutList className="h-4 w-4" />
          </Button>
        </div>
      </header>

      <div className="flex flex-1 relative overflow-hidden bg-[#f2f2f2]">
        {/* Main Player */}
        <main className={`flex-1 flex flex-col transition-all duration-300 ease-in-out overflow-hidden ${isSideBarOpen ? "md:mr-[360px] lg:mr-[400px]" : "mr-0"}`}>
          <div className="flex-1 bg-black relative flex items-center justify-center">
            <VideoPlayer
              width="100%"
              height="100%"
              url={currentLecture?.videoUrl}
              onProgressUpdate={setCurrentLecture}
              progressData={currentLecture}
            />
          </div>

          <div className="p-6 md:p-10 bg-white border-t border-[#e6e6e6] shrink-0 overflow-y-auto">
            <span className="text-[#0067b8] font-semibold text-[10px] uppercase tracking-wider mb-2 block">Now playing</span>
            <h2 className="text-xl md:text-2xl font-semibold tracking-tight text-black mb-4">{currentLecture?.title}</h2>
            <p className="text-[#616161] font-normal max-w-3xl leading-relaxed text-sm">
              {studentCurrentCourseProgress?.courseDetails?.subtitle}
            </p>

            {currentLecture?.notes && (
              <div className="mt-8 space-y-4">
                <div className="flex items-center gap-2 text-[#0067b8]">
                  <Info className="h-4 w-4" />
                  <span className="text-[10px] font-semibold uppercase tracking-wider">Lesson Notes</span>
                </div>
                <div className="bg-[#f2f2f2] border border-[#e6e6e6] rounded-sm p-6">
                  <pre className="text-[#616161] font-sans text-sm leading-relaxed whitespace-pre-wrap break-words">
                    {currentLecture?.notes}
                  </pre>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10 pt-10 border-t border-[#e6e6e6]">
              {currentLecture?.links && currentLecture?.links.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-[#616161]">
                    <LayoutList className="h-4 w-4" />
                    <h3 className="text-xs font-semibold uppercase tracking-wider">Resources</h3>
                  </div>
                  <div className="space-y-2">
                    {currentLecture?.links.map((link, index) => (
                      <a
                        key={index}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-4 rounded-sm bg-white border border-[#e6e6e6] hover:bg-[#f2f2f2] transition-colors group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-sm bg-[#0067b8]/10 text-[#0067b8] flex items-center justify-center">
                            <Play className="h-3.5 w-3.5" />
                          </div>
                          <span className="text-sm font-semibold text-black">{link.title}</span>
                        </div>
                        <ChevronLeft className="h-4 w-4 text-[#616161] rotate-180" />
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {currentLecture?.pdfs && currentLecture?.pdfs.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-[#616161]">
                    <Info className="h-4 w-4" />
                    <h3 className="text-xs font-semibold uppercase tracking-wider">Attachments</h3>
                  </div>
                  <div className="space-y-2">
                    {currentLecture?.pdfs.map((pdf, index) => (
                      <a
                        key={index}
                        href={pdf.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-4 rounded-sm bg-white border border-[#e6e6e6] hover:border-[#0067b8] transition-colors group"
                      >
                        <div className="w-8 h-8 rounded-sm bg-red-50 text-red-600 flex items-center justify-center">
                          <Info className="h-4 w-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-black truncate">{pdf.title}</p>
                          <span className="text-[10px] font-normal text-[#616161] uppercase tracking-wider">PDF</span>
                        </div>
                        <ChevronLeft className="h-4 w-4 text-[#616161] rotate-180" />
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>

        {/* Sidebar */}
        <AnimatePresence>
          {isSideBarOpen && (
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className="fixed top-[57px] right-0 bottom-0 w-full xs:w-80 md:w-[360px] lg:w-[400px] bg-white border-l border-[#e6e6e6] z-10 flex flex-col shadow-lg"
            >
              <Tabs defaultValue="content" className="flex flex-col h-full">
                <TabsList className="grid grid-cols-2 p-1 bg-[#f2f2f2] mx-4 mt-6 rounded-sm h-12 shrink-0">
                  <TabsTrigger
                    value="content"
                    className="rounded-sm data-[state=active]:bg-white data-[state=active]:text-[#0067b8] data-[state=active]:shadow-sm text-[#616161] font-semibold transition-none text-sm"
                  >
                    Curriculum
                  </TabsTrigger>
                  <TabsTrigger
                    value="overview"
                    className="rounded-sm data-[state=active]:bg-white data-[state=active]:text-[#0067b8] data-[state=active]:shadow-sm text-[#616161] font-semibold transition-none text-sm"
                  >
                    Overview
                  </TabsTrigger>
                </TabsList>

                <div className="flex-1 overflow-hidden mt-4">
                  <TabsContent value="content" className="h-full m-0">
                    <ScrollArea className="h-full">
                      <div className="px-4 py-2 space-y-1">
                        {studentCurrentCourseProgress?.courseDetails?.curriculum.map((item, index) => {
                          const isViewed = studentCurrentCourseProgress?.progress?.find(
                            (p) => p.lectureId === item._id
                          )?.viewed;
                          const isCurrent = currentLecture?._id === item._id;
                          return (
                            <div
                              key={item._id}
                              onClick={() => setCurrentLecture(item)}
                              className={`flex items-center gap-3 p-3 rounded-sm cursor-pointer transition-colors border ${isCurrent
                                ? "bg-[#0067b8]/5 border-[#0067b8]"
                                : "bg-white border-transparent hover:bg-[#f2f2f2]"
                                }`}
                            >
                              <div className={`w-8 h-8 rounded-sm flex items-center justify-center shrink-0 ${isCurrent ? "bg-[#0067b8] text-white" : isViewed ? "bg-emerald-50 text-emerald-600" : "bg-[#f2f2f2] text-[#616161]"
                                }`}>
                                {isViewed ? (
                                  <Check className="h-4 w-4" />
                                ) : (
                                  <Play className={`h-3.5 w-3.5 ${isCurrent ? "text-white fill-current" : ""}`} />
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className={`text-sm font-semibold tracking-tight truncate ${isCurrent ? "text-[#0067b8]" : "text-black"}`}>
                                  {item?.title}
                                </p>
                                <span className={`text-[10px] font-normal uppercase tracking-wider ${isCurrent ? "text-[#0067b8]/70" : "text-[#616161]"}`}>
                                  Lecture {index + 1}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </ScrollArea>
                  </TabsContent>

                  <TabsContent value="overview" className="h-full m-0">
                    <ScrollArea className="h-full">
                      <div className="p-6">
                        <div className="flex items-center gap-2 mb-4 text-black">
                          <Info className="h-4 w-4 text-[#0067b8] shrink-0" />
                          <h2 className="text-lg font-semibold tracking-tight">About this course</h2>
                        </div>
                        <p className="text-[#616161] font-normal leading-relaxed mb-8 text-sm">
                          {studentCurrentCourseProgress?.courseDetails?.description}
                        </p>
                        <div className="p-4 rounded-sm bg-[#f2f2f2] border border-[#e6e6e6]">
                          <h3 className="text-[10px] font-semibold uppercase tracking-wider text-[#616161] mb-4">Instructor</h3>
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-[#d2d2d2] overflow-hidden shrink-0">
                              <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100" alt="Instructor" />
                            </div>
                            <div>
                              <p className="font-semibold text-black tracking-tight text-sm">{studentCurrentCourseProgress?.courseDetails?.instructorName}</p>
                              <p className="text-[10px] font-normal text-[#616161] uppercase tracking-wider">Course Instructor</p>
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
        <DialogContent className="max-w-[400px] border-none bg-white p-8 rounded-sm text-center text-black">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <GraduationCap className="h-8 w-8 text-red-600" />
          </div>
          <DialogHeader className="mb-6">
            <DialogTitle className="text-xl font-semibold tracking-tight text-black">Access Denied</DialogTitle>
            <DialogDescription className="text-[#616161] font-normal text-sm">
              You haven't enrolled in this course yet. Please visit the course page to get full access.
            </DialogDescription>
          </DialogHeader>
          <Button
            onClick={() => navigate("/courses")}
            className="w-full bg-[#0067b8] text-white hover:bg-[#005a9e] rounded-sm h-12 text-sm font-semibold transition-none"
          >
            Go to Explore
          </Button>
        </DialogContent>
      </Dialog>

      {/* Course Complete Dialog */}
      <Dialog open={showCourseCompleteDialog} onOpenChange={setShowCourseCompleteDialog}>
        <DialogContent className="max-w-[500px] border-none bg-white p-10 rounded-sm text-center text-black shadow-2xl">
          <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-8 relative">
            <Check className="h-10 w-10 text-emerald-600" />
          </div>
          <DialogHeader className="mb-8">
            <DialogTitle className="text-3xl font-semibold tracking-tight text-black mb-4">Mastery Achieved</DialogTitle>
            <DialogDescription className="text-[#616161] font-normal text-sm leading-relaxed">
              Congratulations! You've successfully completed <br />
              <span className="text-black font-semibold">"{studentCurrentCourseProgress?.courseDetails?.title}"</span>.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-3 mt-4">
            <div className="grid grid-cols-2 gap-3">
              <Button
                onClick={() => navigate("/student-courses")}
                variant="outline"
                className="bg-white text-black border-[#e6e6e6] hover:bg-[#f2f2f2] rounded-sm h-12 text-sm font-semibold transition-none"
              >
                My Courses
              </Button>
              <Button
                variant="outline"
                onClick={handleRewatchCourse}
                className="bg-white text-black border-[#e6e6e6] hover:bg-[#f2f2f2] rounded-sm h-12 text-sm font-semibold flex items-center justify-center gap-2 transition-none"
              >
                <RotateCcw className="h-4 w-4" />
                Rewatch
              </Button>
            </div>
            <Button
              onClick={() => { setShowCertificate(true); setShowCourseCompleteDialog(false); }}
              className="bg-[#0067b8] hover:bg-[#005a9e] text-white rounded-sm h-12 text-sm font-semibold flex items-center justify-center gap-2 transition-none"
            >
              <Award className="h-5 w-5" />
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
