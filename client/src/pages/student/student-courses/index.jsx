import { Button } from "@/components/ui/button";
import { AuthContext } from "@/context/auth-context";
import { StudentContext } from "@/context/student-context";
import { PlayCircle, BookOpen, GraduationCap, Trash2, AlertCircle } from "lucide-react";
import { fetchStudentBoughtCoursesService, deleteStudentCourseService } from "@/services";
import { useToast } from "@/hooks/use-toast";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

function StudentCoursesPage() {
  const { auth } = useContext(AuthContext);
  const { studentBoughtCoursesList, setStudentBoughtCoursesList } = useContext(StudentContext);
  const { toast } = useToast();
  const [deletingCourseId, setDeletingCourseId] = useState(null);
  const navigate = useNavigate();

  async function fetchStudentBoughtCourses() {
    const response = await fetchStudentBoughtCoursesService(auth?.user?._id);
    if (response?.success) setStudentBoughtCoursesList(response?.data);
  }

  async function handleDeleteCourse(courseId) {
    setDeletingCourseId(null);
    const response = await deleteStudentCourseService(auth?.user?._id, courseId);
    if (response?.success) {
      toast({ title: "Course Removed", description: "You have removed this course from your learning list." });
      fetchStudentBoughtCourses();
    } else {
      toast({ title: "Error", description: response?.message || "Failed to remove course.", variant: "destructive" });
    }
  }

  useEffect(() => {
    fetchStudentBoughtCourses();
  }, []);

  const fadeUp = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.6 } };

  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="container mx-auto px-4 xs:px-5 lg:px-8 py-10 xs:py-16">
        {/* Header */}
        <motion.div {...fadeUp} className="mb-8 xs:mb-12">
          <h1 className="text-3xl xs:text-4xl md:text-[50px] font-black tracking-tighter text-zinc-900 mb-1 xs:mb-2">My Learning.</h1>
          <p className="text-zinc-500 font-medium text-sm xs:text-base">Continue where you left off and master your skills.</p>
        </motion.div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 xs:gap-6 md:gap-8">
          {studentBoughtCoursesList && studentBoughtCoursesList.length > 0 ? (
            studentBoughtCoursesList.map((course, index) => (
              <motion.div
                key={course.courseId}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -8 }}
                onClick={() => navigate(`/course-progress/${course?.courseId}`)}
                className="group cursor-pointer bg-white rounded-[28px] xs:rounded-[40px] border border-zinc-200/60 shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden"
              >
                <div className="aspect-video relative overflow-hidden bg-zinc-100">
                  <img
                    src={course?.courseImage}
                    alt={course?.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                    <div className="w-10 h-10 xs:w-12 xs:h-12 rounded-full bg-white text-black flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300 shadow-xl">
                      <PlayCircle className="h-5 w-5 xs:h-6 xs:w-6 fill-current" />
                    </div>
                  </div>
                </div>

                <div className="p-4 xs:p-6 md:p-8">
                  <div className="flex items-center gap-2 mb-2 xs:mb-4">
                    <span className="px-2 py-0.5 rounded-md bg-zinc-100 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                      {course?.instructorName}
                    </span>
                  </div>
                  <h3 className="text-sm xs:text-lg font-bold text-zinc-900 leading-tight mb-3 xs:mb-6 line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {course?.title}
                  </h3>
                  <div className="flex items-center justify-between pt-3 xs:pt-6 border-t border-zinc-50">
                    <div className="flex items-center gap-1.5 xs:gap-2 text-zinc-400 font-bold text-[10px] uppercase tracking-tighter">
                      <BookOpen className="h-3 w-3 xs:h-4 xs:w-4" />
                      <span className="hidden xs:inline">Continue Course</span>
                      <span className="xs:hidden">Continue</span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeletingCourseId(course.courseId);
                      }}
                      className="p-2 rounded-full hover:bg-red-50 text-zinc-300 hover:text-red-500 transition-colors"
                      title="Delete Course"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <span className="text-blue-600 font-black text-xs uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity block mt-2 mt-4 pt-4 border-t border-zinc-50">
                    Resume →
                  </span>
                </div>
              </motion.div>
            ))
          ) : (
            <motion.div {...fadeUp} className="col-span-full flex flex-col items-center justify-center py-20 xs:py-32 text-center">
              <div className="w-16 h-16 xs:w-24 xs:h-24 bg-white rounded-full flex items-center justify-center mb-5 xs:mb-8 shadow-sm">
                <GraduationCap className="h-8 w-8 xs:h-10 xs:w-10 text-zinc-300" />
              </div>
              <h2 className="text-xl xs:text-2xl font-bold text-zinc-900 mb-2 xs:mb-4">You haven't enrolled in any courses yet.</h2>
              <p className="text-sm xs:text-base text-zinc-500 font-medium mb-6 xs:mb-10 max-w-sm">Ready to start your learning journey? Explore our catalog and find your perfect course.</p>
              <Button
                onClick={() => navigate("/courses")}
                className="bg-zinc-900 hover:bg-black text-white rounded-xl xs:rounded-2xl h-12 xs:h-14 px-6 xs:px-10 text-sm xs:text-base font-bold shadow-xl shadow-zinc-200 min-w-[44px]"
              >
                Explore Catalog
              </Button>
            </motion.div>
          )}
        </div>
      </div>

      {/* Confirmation Modal */}
      {deletingCourseId && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[110] flex items-center justify-center p-6">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-[32px] p-8 xs:p-10 max-w-sm w-full shadow-2xl text-center"
          >
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-black tracking-tighter text-zinc-900 mb-3">Delete Course?</h2>
            <p className="text-zinc-500 font-medium mb-8 text-center px-4">
              You will lose access to this course immediately. To regain access, you'll need to purchase it again.
            </p>
            <div className="flex flex-col gap-3">
              <Button
                onClick={() => handleDeleteCourse(deletingCourseId)}
                className="w-full bg-red-500 hover:bg-red-600 text-white rounded-2xl h-12 font-bold shadow-lg shadow-red-100"
              >
                Yes, Delete Permanently
              </Button>
              <Button
                variant="ghost"
                onClick={() => setDeletingCourseId(null)}
                className="w-full rounded-2xl h-12 text-zinc-500 font-bold hover:bg-zinc-100"
              >
                Cancel
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

export default StudentCoursesPage;
