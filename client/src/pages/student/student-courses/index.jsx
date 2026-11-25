import { Button } from "@/components/ui/button";
import { AuthContext } from "@/context/auth-context";
import { StudentContext } from "@/context/student-context";
import { PlayCircle, BookOpen, GraduationCap, Trash2, AlertCircle, RefreshCw, ChevronLeft } from "lucide-react";
import { fetchStudentBoughtCoursesService, deleteStudentCourseService } from "@/services";
import { useToast } from "@/hooks/use-toast";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { getCourseImageUrl } from "@/utils/course-images";

function StudentCoursesPage() {
  const { auth } = useContext(AuthContext);
  const { studentBoughtCoursesList, setStudentBoughtCoursesList } = useContext(StudentContext);
  const { toast } = useToast();
  const [deletingCourseId, setDeletingCourseId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();

  async function fetchStudentBoughtCourses() {
    const response = await fetchStudentBoughtCoursesService(auth?.user?._id);
    if (response?.success) setStudentBoughtCoursesList(response?.data);
  }

  async function handleDeleteCourse(courseId) {
    setIsDeleting(true);
    const response = await deleteStudentCourseService(auth?.user?._id, courseId);
    setIsDeleting(false);
    setDeletingCourseId(null);
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
    <div className="bg-[#fafbfc] min-h-screen pt-20 xs:pt-24 md:pt-32 pb-16 font-sans">
      <div className="container mx-auto px-4 xs:px-6 max-w-7xl">
        {/* Header */}
        <div className="mb-10 text-left">
          <span className="text-xs font-bold text-[#0071e3] uppercase tracking-wider">My Learning</span>
          <h1 className="text-3xl xs:text-4xl md:text-5xl font-extrabold tracking-tight text-[#1d1d1f] mt-1 mb-2">My Courses</h1>
          <p className="text-[#86868b] font-normal text-sm xs:text-base">Continue your learning journey and track your certification milestones.</p>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 text-left">
          {studentBoughtCoursesList && studentBoughtCoursesList.length > 0 ? (
            studentBoughtCoursesList.map((course, index) => (
              <div
                key={course.courseId}
                onClick={() => navigate(`/course-progress/${course?.courseId}`)}
                className="group cursor-pointer bg-white rounded-2xl border border-[#e5e5e5] shadow-sm hover:shadow-xl hover:border-[#0071e3]/40 transition-all overflow-hidden flex flex-col justify-between"
              >
                <div>
                  <div className="aspect-video relative overflow-hidden bg-gray-100">
                    <img
                      src={getCourseImageUrl(course)}
                      alt={course?.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-white/90 text-[#0071e3] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
                        <PlayCircle className="h-6 w-6 fill-current" />
                      </div>
                    </div>
                  </div>

                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-[10px] font-bold text-[#0071e3] uppercase tracking-wider">
                        {course?.instructorName || "Bhavin Patel"}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-[#1d1d1f] leading-snug line-clamp-2 group-hover:text-[#0071e3] transition-colors">
                      {course?.title}
                    </h3>
                  </div>
                </div>

                <div className="p-5 pt-0">
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-1.5 text-[#0071e3] font-semibold text-xs">
                      <BookOpen className="h-3.5 w-3.5" />
                      <span>Resume Course</span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeletingCourseId(course.courseId);
                      }}
                      className="p-1.5 rounded-lg hover:bg-red-50 text-gray-300 hover:text-red-600 transition-colors"
                      title="Remove Course"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm border border-[#e5e5e5]">
                <GraduationCap className="h-10 w-10 text-gray-300" />
              </div>
              <h2 className="text-2xl font-bold text-[#1d1d1f] mb-2">No courses enrolled yet</h2>
              <p className="text-sm text-[#86868b] font-normal mb-8 max-w-sm">Ready to start your learning journey? Explore our curriculum and build real enterprise skills.</p>
              <Button
                onClick={() => navigate("/courses")}
                className="bg-[#0071e3] hover:bg-[#0077ed] text-white rounded-full h-12 px-8 text-sm font-semibold transition-colors"
              >
                Explore Courses
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Confirmation Modal */}
      {deletingCourseId && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[110] flex items-center justify-center p-6">
          <div className="bg-white rounded-sm p-10 max-w-sm w-full shadow-2xl text-center border border-[#e6e6e6]">
            <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-semibold tracking-tight text-black mb-2">Remove Course?</h2>
            <p className="text-[#616161] font-normal mb-8 text-sm px-4">
              You will lose access to this course immediately. You'll need to purchase it again to regain access.
            </p>
            <div className="flex flex-col gap-2">
              <Button
                onClick={() => handleDeleteCourse(deletingCourseId)}
                disabled={isDeleting}
                className="w-full bg-red-600 hover:bg-red-700 text-white rounded-sm h-12 font-semibold flex items-center justify-center gap-2 transition-none"
              >
                {isDeleting ? <RefreshCw className="h-4 w-4 animate-spin" /> : "Remove Permanently"}
              </Button>
              <Button
                variant="ghost"
                onClick={() => setDeletingCourseId(null)}
                className="w-full rounded-sm h-12 text-[#616161] font-semibold hover:bg-[#f2f2f2] transition-none"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default StudentCoursesPage;
