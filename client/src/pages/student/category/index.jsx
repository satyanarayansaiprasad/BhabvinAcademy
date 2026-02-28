import { topLevelCategories, courseSubCategories } from "@/config";
import { Link, useParams } from "react-router-dom";

function CategoryPage() {
    const { id } = useParams();

    const categoryId = id?.toLowerCase();
    const category = topLevelCategories.find(c => c.id === categoryId);
    const subCategories = courseSubCategories[categoryId] || [];

    if (!category) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 bg-slate-50">
                <h2 className="text-2xl font-black text-zinc-900 mb-2">Category Not Found</h2>
                <p className="text-zinc-500 font-medium text-center">We couldn't find the category you're looking for.</p>
                <Link to="/" className="mt-6 px-6 py-2.5 bg-zinc-900 text-white font-bold rounded-xl hover:bg-zinc-800 transition-colors">
                    Return Home
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 pt-24 xs:pt-32 pb-16">
            <div className="container mx-auto px-4 xs:px-6 lg:px-8">
                <div className="mb-12">
                    <span className="text-blue-600 font-black text-xs uppercase tracking-widest block mb-2">Explore Category</span>
                    <h1 className="text-3xl xs:text-4xl md:text-5xl font-black tracking-tighter text-zinc-900 mb-4">{category.label}</h1>
                    <p className="text-zinc-500 font-medium text-lg max-w-2xl">
                        Dive into {category.label} and discover specialized topics to mastery your skills. Select a sub-category below to explore our curriculum.
                    </p>
                </div>

                {subCategories.length > 0 ? (
                    <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 content-start">
                        {subCategories.map((sub) => (
                            <Link
                                key={sub.id}
                                to={`/subcategory/${sub.id}`}
                                className="group p-6 bg-white rounded-2xl border border-zinc-200/60 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col items-start"
                            >
                                <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center mb-6 group-hover:bg-blue-50 transition-colors">
                                    <div className="w-6 h-6 rounded-full border-2 border-zinc-600 group-hover:border-blue-600 transition-colors" />
                                </div>
                                <h3 className="text-xl font-bold text-zinc-900 mb-2 group-hover:text-blue-600 transition-colors">{sub.label}</h3>
                                <span className="text-sm font-bold text-zinc-400 group-hover:text-blue-500 transition-colors mt-auto flex items-center gap-2">
                                    Explore courses <span className="group-hover:translate-x-1 transition-transform">→</span>
                                </span>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="p-12 bg-white rounded-3xl border border-zinc-200 shadow-sm text-center">
                        <h3 className="text-xl font-black text-zinc-900 mb-2">No Sub-categories Yet</h3>
                        <p className="text-zinc-500 font-medium">We are currently curating content for this category. Please check back later.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default CategoryPage;
