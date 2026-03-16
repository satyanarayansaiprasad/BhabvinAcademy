import { Button } from "@/components/ui/button";
import { AuthContext } from "@/context/auth-context";
import { StudentContext } from "@/context/student-context";
import { PlayCircle, BookOpen, GraduationCap, Trash2, AlertCircle, RefreshCw, ChevronLeft } from "lucide-react";
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
    <div className="bg-[#f2f2f2] min-h-screen pt-20 xs:pt-24 md:pt-32 pb-16">
      <div className="container mx-auto px-4 xs:px-6">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl xs:text-4xl md:text-5xl font-semibold tracking-tight text-black mb-2">My Courses</h1>
          <p className="text-[#616161] font-normal text-sm xs:text-base">Continue your learning journey and track your progress.</p>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {studentBoughtCoursesList && studentBoughtCoursesList.length > 0 ? (
            studentBoughtCoursesList.map((course, index) => (
              <div
                key={course.courseId}
                onClick={() => navigate(`/course-progress/${course?.courseId}`)}
                className="group cursor-pointer bg-white rounded-sm border border-[#e6e6e6] shadow-sm hover:border-[#0067b8]/40 transition-colors overflow-hidden"
              >
                <div className="aspect-video relative overflow-hidden bg-[#f2f2f2]">
                  <img
                    src={course?.courseImage}
                    alt={course?.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                    <div className="w-10 h-10 rounded-sm bg-white text-black flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm">
                      <PlayCircle className="h-5 w-5 fill-current" />
                    </div>
                  </div>
                </div>

                <div className="p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-2 py-0.5 rounded-sm bg-[#f2f2f2] text-[10px] font-semibold text-[#616161] uppercase tracking-wider">
                      {course?.instructorName}
                    </span>
                  </div>
                  <h3 className="text-base font-semibold text-black leading-tight mb-6 line-clamp-2 group-hover:text-[#0067b8] transition-colors">
                    {course?.title}
                  </h3>
                  <div className="flex items-center justify-between pt-4 border-t border-[#f2f2f2]">
                    <div className="flex items-center gap-2 text-[#616161] font-semibold text-[10px] uppercase tracking-wider">
                      <BookOpen className="h-3.5 w-3.5" />
                      <span>Continue</span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeletingCourseId(course.courseId);
                      }}
                      className="p-1.5 rounded-sm hover:bg-red-50 text-[#d2d2d2] hover:text-red-600 transition-colors"
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
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm border border-[#e6e6e6]">
                <GraduationCap className="h-8 w-8 text-[#d2d2d2]" />
              </div>
              <h2 className="text-xl font-semibold text-black mb-2">No courses found</h2>
              <p className="text-sm text-[#616161] font-normal mb-8 max-w-sm">Ready to start your learning journey? Explore our catalog and find your perfect course.</p>
              <Button
                onClick={() => navigate("/courses")}
                className="bg-black text-white rounded-sm h-12 px-8 text-sm font-semibold transition-none"
              >
                Explore Catalog
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
