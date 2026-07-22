import { courseSubCategories } from "@/config";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchStudentViewCourseListService } from "@/services";
import { Button } from "@/components/ui/button";
import CourseCard from "@/components/student-view/course-card";

function SubCategoryPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    // Find the subcategory label for the title
    let subCategoryLabel = id;
    for (const catKey in courseSubCategories) {
        const sub = courseSubCategories[catKey].find(s => s.id === id);
        if (sub) {
            subCategoryLabel = sub.label;
            break;
        }
    }

    useEffect(() => {
        async function fetchCourses() {
            setLoading(true);
            try {
                const response = await fetchStudentViewCourseListService(`?category=${id}`);
                if (response?.success) {
                    setCourses(response.data);
                }
            } catch (error) {
                console.error("Failed to fetch courses for subcategory", error);
            } finally {
                setLoading(false);
            }
        }
        fetchCourses();
    }, [id]);

    return (
        <div className="min-h-screen bg-slate-50 pt-24 xs:pt-32 pb-16">
            <div className="container mx-auto px-4 xs:px-6 lg:px-8">
                <div className="mb-12">
                    <button onClick={() => navigate(-1)} className="text-zinc-500 hover:text-zinc-900 text-sm font-bold flex items-center gap-2 mb-6 transition-colors">
                        ← Back to Categories
                    </button>
                    <span className="text-emerald-600 font-black text-xs uppercase tracking-widest block mb-2">Sub-category</span>
                    <h1 className="text-3xl xs:text-4xl md:text-5xl font-black tracking-tighter text-zinc-900 mb-4">{subCategoryLabel}</h1>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center p-20">
                        <div className="w-8 h-8 rounded-full border-4 border-zinc-200 border-t-zinc-900 animate-spin" />
                    </div>
                ) : courses.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {courses.map((course) => (
                            <CourseCard
                                key={course._id}
                                course={course}
                                onClick={(courseId) => navigate(`/course/details/${courseId}`)}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="p-12 md:p-24 bg-white rounded-3xl border border-zinc-200 shadow-sm text-center flex flex-col items-center justify-center min-h-[40vh]">
                        <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-6">
                            <div className="w-8 h-8 border-4 border-zinc-300 rounded-full border-t-zinc-400" />
                        </div>
                        <h3 className="text-xl xs:text-2xl md:text-3xl font-black text-zinc-900 mb-4">Content Coming Soon</h3>
                        <p className="text-zinc-500 font-medium text-base md:text-lg max-w-md">
                            This page has no content right now. Please re-visit later.
                        </p>
                        <Button onClick={() => navigate(-1)} className="mt-8 px-8 h-12 rounded-xl bg-zinc-900 text-white font-bold hover:bg-zinc-800 transition-colors shadow-lg shadow-zinc-900/10">
                            Go Back
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default SubCategoryPage;
