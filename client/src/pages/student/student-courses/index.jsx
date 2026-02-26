import { Button } from "@/components/ui/button";
import { AuthContext } from "@/context/auth-context";
import { StudentContext } from "@/context/student-context";
import { fetchStudentBoughtCoursesService } from "@/services";
import { PlayCircle, BookOpen, GraduationCap } from "lucide-react";
import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

function StudentCoursesPage() {
  const { auth } = useContext(AuthContext);
  const { studentBoughtCoursesList, setStudentBoughtCoursesList } =
    useContext(StudentContext);
  const navigate = useNavigate();

  async function fetchStudentBoughtCourses() {
    const response = await fetchStudentBoughtCoursesService(auth?.user?._id);
    if (response?.success) {
      setStudentBoughtCoursesList(response?.data);
    }
  }

  useEffect(() => {
    fetchStudentBoughtCourses();
  }, []);

  const fadeUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="container mx-auto px-4 lg:px-8 py-16">

        {/* Header */}
        <motion.div {...fadeUp} className="mb-12">
          <h1 className="text-4xl md:text-[50px] font-black tracking-tighter text-zinc-900 mb-2">My Learning.</h1>
          <p className="text-zinc-500 font-medium">Continue where you left off and master your skills.</p>
        </motion.div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {studentBoughtCoursesList && studentBoughtCoursesList.length > 0 ? (
            studentBoughtCoursesList.map((course, index) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -8 }}
                onClick={() => navigate(`/course-progress/${course?.courseId}`)}
                className="group cursor-pointer bg-white rounded-[40px] border border-zinc-200/60 shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden"
              >
                <div className="aspect-video relative overflow-hidden bg-zinc-100">
                  <img
                    src={course?.courseImage}
                    alt={course?.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300 shadow-xl">
                      <PlayCircle className="h-6 w-6 fill-current" />
                    </div>
                  </div>
                </div>

                <div className="p-8">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="px-2 py-0.5 rounded-md bg-zinc-100 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                      {course?.instructorName}
                    </span>
                  </div>
                  <h3 className="text-[28px] font-bold text-zinc-900 leading-tight mb-6 line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {course?.title}
                  </h3>

                  <div className="flex items-center justify-between pt-6 border-t border-zinc-50">
                    <div className="flex items-center gap-2 text-zinc-400 font-bold text-[10px] uppercase tracking-tighter">
                      <BookOpen className="h-4 w-4" />
                      <span>Continue Course</span>
                    </div>
                    <span className="text-blue-600 font-black text-xs uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                      Resume →
                    </span>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <motion.div
              {...fadeUp}
              className="col-span-full flex flex-col items-center justify-center py-32 text-center"
            >
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-8 shadow-sm">
                <GraduationCap className="h-10 w-10 text-zinc-300" />
              </div>
              <h2 className="text-[35px] font-bold text-zinc-900 mb-4">You haven't enrolled in any courses yet.</h2>
              <p className="text-base text-zinc-500 font-medium mb-10 max-w-sm">Ready to start your learning journey? Explore our catalog and find your perfect course.</p>
              <Button
                onClick={() => navigate("/courses")}
                className="bg-zinc-900 hover:bg-black text-white rounded-2xl h-14 px-10 text-base font-bold shadow-xl shadow-zinc-200"
              >
                Explore Catalog
              </Button>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

export default StudentCoursesPage;
