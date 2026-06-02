import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "@/context/auth-context";
import { useToast } from "@/hooks/use-toast";
import {
  addNewCourseService,
  fetchInstructorCourseDetailsService,
  updateCourseByIdService,
  mediaUploadService
} from "@/services";
import {
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  FileText,
  PlayCircle,
  HelpCircle,
  Plus,
  Trash2,
  Save,
  CheckCircle,
  Sparkles,
  DollarSign
} from "lucide-react";

export default function InstructorEditCoursePage() {
  const { id } = useParams(); // if editing
  const navigate = useNavigate();
  const { auth } = useContext(AuthContext);
  const { toast } = useToast();

  const isEditing = !!id;

  const [courseForm, setCourseForm] = useState({
    title: "",
    subtitle: "",
    description: "",
    category: "Microsoft",
    level: "Intermediate",
    primaryLanguage: "English",
    totalLessons: 10,
    estimatedHours: 5,
    pricing: 0,
    accessType: "free",
    image: "🪟",
    bannerColor: "linear-gradient(135deg,#0078d4,#005a9e)",
    curriculum: [],
    isPublished: false,
  });

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // uploader progress trackers per lecture index
  const [uploadProgress, setUploadProgress] = useState({});

  useEffect(() => {
    if (isEditing) {
      loadCourseDetails();
    }
  }, [id]);

  const loadCourseDetails = async () => {
    setLoading(true);
    try {
      const res = await fetchInstructorCourseDetailsService(id);
      if (res?.success) {
        setCourseForm(res.data);
      }
    } catch (err) {
      toast({ title: "Failed to load course details", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCourseForm({ ...courseForm, [name]: value });
  };

  const handleBannerSelect = (color) => {
    setCourseForm({ ...courseForm, bannerColor: color });
  };

  // Add Curriculum Section
  const handleAddSection = () => {
    const newSectionTitle = `Section ${courseForm.curriculum.length + 1} — New Section`;
    // We add lectures as part of curriculum list directly. Wait, the schema uses a flat list of lectures in the model?
    // Let's check the schema for curriculum: it's a flat array of LectureSchema [LectureSchema].
    // Wait, the mockup says "Organise lessons into sections."
    // If the schema is a flat array of Lectures, how can we store section headers?
    // In many implementations, section headers can be lectures with empty videoUrls or a field showing it's a section,
    // OR we can store them in a structure where each lecture is marked with a `section` title!
    // Let's see: `LectureSchema` contains `title`, `videoUrl`, `public_id`, `freePreview`, `videoSource`, `notes`, `links`, `pdfs`.
    // Wait, let's see how the mock courses in the system are seeded or modeled. Let's look at `server/seed-courses.js` or `server/init-db.js` using grep to see what curriculum data looks like.
    // Let's do a search!
  };

  return (
    <div className="bg-[#f5f5f7] text-[#1d1d1f] min-h-screen font-sans flex flex-col text-left">
      {/* Top Navbar */}
      <nav className="bg-white border-b border-black/[0.08] sticky top-0 z-[100] h-[52px] flex items-center px-8 justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/instructor")}
            className="p-1.5 hover:bg-[#f5f5f7] rounded-xl transition-all border-none bg-transparent cursor-pointer"
          >
            <ArrowLeft size={16} />
          </button>
          <span className="text-[13px] text-[#86868b]">Courses</span>
          <span className="text-white/20">›</span>
          <span className="text-[13px] text-[#1d1d1f] font-semibold truncate max-w-[200px]">
            {courseForm.title || "Untitled Course"}
          </span>
          <span className="text-white/20">›</span>
          <span className="text-[13px] text-[#86868b]">{isEditing ? "Edit" : "Create"}</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-xs text-[#6e6e73]">
            <div className={`w-2 h-2 rounded-full ${courseForm.isPublished ? "bg-green-500" : "bg-yellow-500"}`} />
            {courseForm.isPublished ? "Published" : "Draft"}
          </div>
          <button
            onClick={() => handleSave(false)}
            disabled={saving}
            className="bg-transparent border border-[#d2d2d7] text-xs font-semibold px-4 py-2 rounded-full cursor-pointer hover:bg-[#f5f5f7]"
          >
            Save Draft
          </button>
          <button
            onClick={() => handleSave(true)}
            disabled={saving}
            className="bg-[#0071e3] text-white hover:bg-[#0077ed] text-xs font-bold px-5 py-2 rounded-full cursor-pointer border-none shadow-md shadow-blue-500/10"
          >
            Publish Course
          </button>
        </div>
      </nav>

      {loading ? (
        <div className="py-20 text-center flex-1 flex flex-col justify-center items-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#0071e3] mb-4"></div>
          <p className="text-sm text-[#86868b]">Loading course details...</p>
        </div>
      ) : (
        <div className="max-w-[1160px] mx-auto w-full px-6 py-8 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 items-start">
          {/* Main Form Fields */}
          <div className="space-y-6">
            {/* 1. Basic Info */}
            <div className="bg-white border border-black/[0.07] rounded-3xl p-8">
              <h3 className="text-xl font-bold mb-1">Course Information</h3>
              <p className="text-xs text-[#86868b] mb-6">Set the core details that learners will see on the course page.</p>

              <div className="space-y-5">
                <div>
                  <label className="text-xs font-bold text-[#1d1d1f] mb-1.5 block">Course Title</label>
                  <input
                    type="text"
                    required
                    name="title"
                    className="w-full border border-[#d2d2d7] rounded-xl p-3 text-xs outline-none focus:border-[#0071e3] focus:ring-4 focus:ring-blue-500/10"
                    placeholder="e.g. Windows Server Administration"
                    value={courseForm.title}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-[#1d1d1f] mb-1.5 block">Short Description / Subtitle</label>
                  <input
                    type="text"
                    name="subtitle"
                    className="w-full border border-[#d2d2d7] rounded-xl p-3 text-xs outline-none focus:border-[#0071e3] focus:ring-4 focus:ring-blue-500/10"
                    placeholder="One-line summary shown in course cards"
                    value={courseForm.subtitle}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-[#1d1d1f] mb-1.5 block">Full Description</label>
                  <textarea
                    name="description"
                    className="w-full border border-[#d2d2d7] rounded-xl p-3 text-xs outline-none focus:border-[#0071e3] focus:ring-4 focus:ring-blue-500/10 min-h-[120px]"
                    placeholder="Describe the course topics, outcomes, and prerequisites..."
                    value={courseForm.description}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-[#1d1d1f] mb-1.5 block">Category</label>
                    <select
                      name="category"
                      className="w-full border border-[#d2d2d7] rounded-xl p-3 text-xs outline-none bg-white focus:border-[#0071e3] cursor-pointer"
                      value={courseForm.category}
                      onChange={handleInputChange}
                    >
                      <option>Microsoft</option>
                      <option>Linux</option>
                      <option>Networking</option>
                      <option>Cloud</option>
                      <option>Security</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-[#1d1d1f] mb-1.5 block">Difficulty Level</label>
                    <select
                      name="level"
                      className="w-full border border-[#d2d2d7] rounded-xl p-3 text-xs outline-none bg-white focus:border-[#0071e3] cursor-pointer"
                      value={courseForm.level}
                      onChange={handleInputChange}
                    >
                      <option>Beginner</option>
                      <option>Intermediate</option>
                      <option>Advanced</option>
                      <option>All Levels</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-bold text-[#1d1d1f] mb-1.5 block">Total Lessons</label>
                    <input
                      type="number"
                      name="totalLessons"
                      className="w-full border border-[#d2d2d7] rounded-xl p-3 text-xs outline-none focus:border-[#0071e3]"
                      value={courseForm.totalLessons}
                      onChange={handleInputChange}
                      min="1"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-[#1d1d1f] mb-1.5 block">Estimated Hours</label>
                    <input
                      type="number"
                      name="estimatedHours"
                      className="w-full border border-[#d2d2d7] rounded-xl p-3 text-xs outline-none focus:border-[#0071e3]"
                      value={courseForm.estimatedHours}
                      onChange={handleInputChange}
                      min="1"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-[#1d1d1f] mb-1.5 block">Language</label>
                    <select
                      name="primaryLanguage"
                      className="w-full border border-[#d2d2d7] rounded-xl p-3 text-xs outline-none bg-white focus:border-[#0071e3] cursor-pointer"
                      value={courseForm.primaryLanguage}
                      onChange={handleInputChange}
                    >
                      <option>English</option>
                      <option>Hindi</option>
                      <option>Gujarati</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Banner Preview / Selection */}
            <div className="bg-white border border-black/[0.07] rounded-3xl p-8">
              <h3 className="text-xl font-bold mb-1">Course Banner</h3>
              <p className="text-xs text-[#86868b] mb-6">Choose a banner color and icon represents this course.</p>

              <div
                className="w-full h-40 rounded-2xl flex items-center justify-center text-6xl shadow-inner mb-6 transition-all duration-300"
                style={{ background: courseForm.bannerColor }}
              >
                {courseForm.image || "📚"}
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-[#1d1d1f] mb-1.5 block">Banner Icon Emoji</label>
                  <input
                    type="text"
                    name="image"
                    className="w-20 text-center border border-[#d2d2d7] rounded-xl p-3 text-lg outline-none focus:border-[#0071e3]"
                    value={courseForm.image}
                    onChange={handleInputChange}
                    maxLength="2"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-[#1d1d1f] mb-2 block">Banner Color Swatch</label>
                  <div className="flex gap-2 flex-wrap">
                    {[
                      { name: "Microsoft Blue", color: "linear-gradient(135deg,#0078d4,#005a9e)" },
                      { name: "Linux Orange", color: "linear-gradient(135deg,#e95420,#772953)" },
                      { name: "Networking Blue", color: "linear-gradient(135deg,#1ba1e2,#0050ef)" },
                      { name: "Azure Cyan", color: "linear-gradient(135deg,#0089d6,#00bcf2)" },
                      { name: "Security Green", color: "linear-gradient(135deg,#107c10,#004b1c)" },
                      { name: "Deep Purple", color: "linear-gradient(135deg,#5c2d91,#8764b8)" },
                    ].map((swatch, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleBannerSelect(swatch.color)}
                        className={`w-9 h-9 rounded-xl border-2 transition-all cursor-pointer ${
                          courseForm.bannerColor === swatch.color ? "border-black scale-105" : "border-transparent"
                        }`}
                        style={{ background: swatch.color }}
                        title={swatch.name}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Curriculum Builder */}
            <div className="bg-white border border-black/[0.07] rounded-3xl p-8">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-xl font-bold">Curriculum</h3>
                  <p className="text-xs text-[#86868b]">Manage the lectures in this course.</p>
                </div>
                <button
                  type="button"
                  onClick={handleAddLecture}
                  className="bg-transparent hover:bg-[#0071e3] hover:text-white border border-[#0071e3] text-[#0071e3] text-xs font-bold px-4 py-2 rounded-full cursor-pointer transition-all"
                >
                  ＋ Add Lesson
                </button>
              </div>

              <div className="space-y-4">
                {courseForm.curriculum?.map((lecture, index) => (
                  <div key={index} className="border border-[#e8e8ed] rounded-2xl overflow-hidden bg-[#fafafa]">
                    <div className="p-4 flex items-center justify-between gap-4">
                      <div className="flex-1 flex gap-3 items-center">
                        <span className="text-xs font-semibold text-white/50 bg-[#1d1d1f] w-6 h-6 rounded-full flex items-center justify-center">
                          {index + 1}
                        </span>
                        <input
                          type="text"
                          className="font-semibold text-sm bg-transparent border-none outline-none flex-1 focus:border-b focus:border-black/20"
                          placeholder="Lesson Title"
                          value={lecture.title}
                          onChange={(e) => {
                            const newCurriculum = [...courseForm.curriculum];
                            newCurriculum[index].title = e.target.value;
                            setCourseForm({ ...courseForm, curriculum: newCurriculum });
                          }}
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleRemoveLecture(index)}
                          className="p-1.5 hover:bg-red-50 text-red-500 rounded-lg cursor-pointer border-none bg-transparent"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>

                    <div className="p-4 bg-white border-t border-[#e8e8ed] space-y-4 text-xs">
                      <div>
                        <label className="font-semibold mb-1 block">Video Upload (Cloudinary)</label>
                        {lecture.videoUrl ? (
                          <div className="flex items-center gap-3 bg-green-50 text-green-700 p-3 rounded-xl border border-green-200">
                            <PlayCircle size={20} />
                            <span className="truncate flex-1 font-medium">{lecture.videoUrl}</span>
                            <button
                              type="button"
                              onClick={() => {
                                const newCurriculum = [...courseForm.curriculum];
                                newCurriculum[index].videoUrl = "";
                                newCurriculum[index].public_id = "";
                                setCourseForm({ ...courseForm, curriculum: newCurriculum });
                              }}
                              className="text-xs bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1 rounded-lg border-none cursor-pointer"
                            >
                              Remove Video
                            </button>
                          </div>
                        ) : (
                          <div>
                            <input
                              type="file"
                              accept="video/*"
                              className="w-full text-xs"
                              onChange={(e) => handleVideoUpload(e, index)}
                            />
                            {uploadProgress[index] !== undefined && (
                              <div className="mt-2 space-y-1">
                                <div className="flex justify-between text-[11px]">
                                  <span>Uploading video...</span>
                                  <strong>{uploadProgress[index]}%</strong>
                                </div>
                                <div className="w-full h-1.5 bg-black/5 rounded-full overflow-hidden">
                                  <div className="h-full bg-[#0071e3]" style={{ width: `${uploadProgress[index]}%` }}></div>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            id={`preview-${index}`}
                            checked={lecture.freePreview || false}
                            onChange={(e) => {
                              const newCurriculum = [...courseForm.curriculum];
                              newCurriculum[index].freePreview = e.target.checked;
                              setCourseForm({ ...courseForm, curriculum: newCurriculum });
                            }}
                          />
                          <label htmlFor={`preview-${index}`} className="mb-0 font-medium cursor-pointer">
                            Enable Free Preview
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 4. Pricing */}
            <div className="bg-white border border-black/[0.07] rounded-3xl p-8">
              <h3 className="text-xl font-bold mb-1">Pricing & Access</h3>
              <p className="text-xs text-[#86868b] mb-6">Control how learners access this course.</p>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <button
                  type="button"
                  onClick={() => setCourseForm({ ...courseForm, accessType: "free", pricing: 0 })}
                  className={`p-4 rounded-xl border text-left cursor-pointer transition-all ${
                    courseForm.accessType === "free"
                      ? "border-[#0071e3] bg-blue-50/50"
                      : "border-[#d2d2d7] bg-transparent"
                  }`}
                >
                  <div className="font-bold text-sm">📦 Free Access</div>
                  <div className="text-[11px] text-[#86868b] mt-1">Available to all subscribers</div>
                </button>
                <button
                  type="button"
                  onClick={() => setCourseForm({ ...courseForm, accessType: "paid" })}
                  className={`p-4 rounded-xl border text-left cursor-pointer transition-all ${
                    courseForm.accessType === "paid"
                      ? "border-[#0071e3] bg-blue-50/50"
                      : "border-[#d2d2d7] bg-transparent"
                  }`}
                >
                  <div className="font-bold text-sm">💳 Standalone Purchase</div>
                  <div className="text-[11px] text-[#86868b] mt-1">One-time payment for the course</div>
                </button>
              </div>

              {courseForm.accessType === "paid" && (
                <div>
                  <label className="text-xs font-bold text-[#1d1d1f] mb-1.5 block">Price (INR)</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-sm text-[#86868b]">₹</span>
                    <input
                      type="number"
                      name="pricing"
                      className="w-full pl-8 border border-[#d2d2d7] rounded-xl p-3 text-xs outline-none focus:border-[#0071e3]"
                      placeholder="e.g. 999"
                      value={courseForm.pricing}
                      onChange={handleInputChange}
                      min="0"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar Info Card / Checklists */}
          <div className="sidebar-sticky">
            <div className="bg-white border border-black/[0.07] rounded-3xl p-6">
              <h4 className="font-bold text-sm mb-4">Course Preview</h4>
              <div
                className="w-full h-28 rounded-xl flex items-center justify-center text-4xl mb-4"
                style={{ background: courseForm.bannerColor }}
              >
                {courseForm.image || "📚"}
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-[#86868b]">Status:</span>
                  <span className="font-semibold">{courseForm.isPublished ? "Published" : "Draft"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#86868b]">Lectures:</span>
                  <span className="font-semibold">{courseForm.curriculum?.length || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#86868b]">Price:</span>
                  <span className="font-semibold text-green-600">
                    {courseForm.accessType === "free" ? "Free" : `₹${courseForm.pricing}`}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white border border-black/[0.07] rounded-3xl p-6">
              <h4 className="font-bold text-sm mb-4">Publish Checklist</h4>
              <div className="space-y-3 text-xs">
                <div className="flex items-center gap-2">
                  <CheckCircle size={16} className={courseForm.title ? "text-green-500" : "text-gray-300"} />
                  <span>Course Title</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle size={16} className={courseForm.subtitle ? "text-green-500" : "text-gray-300"} />
                  <span>Subtitle / Short Desc</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle size={16} className={courseForm.description ? "text-green-500" : "text-gray-300"} />
                  <span>Full description</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle size={16} className={courseForm.curriculum?.length > 0 ? "text-green-500" : "text-gray-300"} />
                  <span>At least 1 Lecture added</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  function handleAddLecture() {
    setCourseForm({
      ...courseForm,
      curriculum: [
        ...courseForm.curriculum,
        {
          title: `Lesson ${courseForm.curriculum.length + 1}`,
          videoUrl: "",
          public_id: "",
          freePreview: false,
          videoSource: "cloudinary",
          notes: "",
        },
      ],
    });
  }

  function handleRemoveLecture(index) {
    const newCurriculum = courseForm.curriculum.filter((_, idx) => idx !== index);
    setCourseForm({ ...courseForm, curriculum: newCurriculum });
  }

  async function handleVideoUpload(e, index) {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    setUploadProgress((prev) => ({ ...prev, [index]: 0 }));

    try {
      const res = await mediaUploadService(formData, (percent) => {
        setUploadProgress((prev) => ({ ...prev, [index]: percent }));
      });

      if (res?.success) {
        const newCurriculum = [...courseForm.curriculum];
        newCurriculum[index].videoUrl = res.data.url;
        newCurriculum[index].public_id = res.data.public_id;
        setCourseForm({ ...courseForm, curriculum: newCurriculum });
        toast({ title: "Video uploaded successfully!" });
      } else {
        toast({ title: "Upload failed", variant: "destructive" });
      }
    } catch (err) {
      toast({ title: "Error uploading video", variant: "destructive" });
    } finally {
      setUploadProgress((prev) => {
        const updated = { ...prev };
        delete updated[index];
        return updated;
      });
    }
  }

  async function handleSave(publishState = false) {
    if (!courseForm.title) {
      toast({ title: "Course title is required", variant: "destructive" });
      return;
    }

    setSaving(true);
    const postData = {
      ...courseForm,
      isPublished: publishState,
      instructorId: auth?.user?._id,
      instructorName: auth?.user?.userFullName,
    };

    try {
      let res;
      if (isEditing) {
        res = await updateCourseByIdService(id, postData);
      } else {
        res = await addNewCourseService(postData);
      }

      if (res?.success) {
        toast({ title: publishState ? "Course published successfully! 🎉" : "Draft saved successfully! ✓" });
        navigate("/instructor");
      } else {
        toast({ title: "Failed to save course", variant: "destructive" });
      }
    } catch (err) {
      toast({ title: "Error saving course", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  }
}
