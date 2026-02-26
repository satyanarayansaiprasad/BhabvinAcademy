import MediaProgressbar from "@/components/media-progress-bar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InstructorContext } from "@/context/instructor-context";
import { mediaUploadService, mediaDeleteService } from "@/services";
import { useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Image as ImageIcon, Upload, X, RefreshCw } from "lucide-react";

function CourseSettings() {
  const {
    courseLandingFormData,
    setCourseLandingFormData,
    mediaUploadProgress,
    setMediaUploadProgress,
    mediaUploadProgressPercentage,
    setMediaUploadProgressPercentage,
  } = useContext(InstructorContext);

  async function handleImageUploadChange(event) {
    const selectedImage = event.target.files[0];

    if (selectedImage) {
      const imageFormData = new FormData();
      imageFormData.append("file", selectedImage);

      try {
        setMediaUploadProgress(true);
        const response = await mediaUploadService(
          imageFormData,
          setMediaUploadProgressPercentage
        );
        if (response.success) {
          setCourseLandingFormData({
            ...courseLandingFormData,
            image: response.data.url,
          });
          setMediaUploadProgress(false);
        }
      } catch (e) {
        console.log(e);
        setMediaUploadProgress(false);
      }
    }
  }

  async function handleReplaceImage() {
    // Note: If we had the public_id for the image, we would delete it from Cloudinary here.
    // Since courseLandingFormData doesn't currently store image public_id, we'll just clear the URL.
    setCourseLandingFormData({
      ...courseLandingFormData,
      image: "",
    });
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-[32px] border border-zinc-200/60 p-10 shadow-sm"
    >
      <div className="flex items-center gap-4 mb-10 pb-8 border-b border-zinc-100">
        <div className="w-12 h-12 rounded-2xl bg-zinc-900 flex items-center justify-center text-white">
          <ImageIcon className="h-6 w-6" />
        </div>
        <div>
          <h3 className="text-2xl font-black tracking-tighter text-zinc-900 leading-none mb-1">Visual Identity.</h3>
          <p className="text-zinc-400 font-medium text-sm">Upload a high-resolution banner for your course.</p>
        </div>
      </div>

      <div className="space-y-8">
        <AnimatePresence mode="wait">
          {mediaUploadProgress ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-6 bg-blue-50/50 rounded-2xl border border-blue-100"
            >
              <MediaProgressbar
                isMediaUploading={mediaUploadProgress}
                progress={mediaUploadProgressPercentage}
              />
            </motion.div>
          ) : null}
        </AnimatePresence>

        <div className="relative group">
          {courseLandingFormData?.image ? (
            <div className="relative rounded-[32px] overflow-hidden border-4 border-white shadow-2xl">
              <img
                src={courseLandingFormData.image}
                alt="Course Banner"
                className="w-full aspect-video object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 backdrop-blur-sm">
                <button
                  onClick={handleReplaceImage}
                  className="bg-white text-zinc-900 h-12 px-6 rounded-xl font-bold flex items-center gap-2 hover:scale-105 active:scale-95 transition-all"
                >
                  <RefreshCw className="h-4 w-4" />
                  Replace Image
                </button>
              </div>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center w-full aspect-video border-2 border-dashed border-zinc-200 rounded-[32px] cursor-pointer hover:bg-zinc-50 hover:border-blue-400 transition-all group">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <div className="w-16 h-16 rounded-full bg-zinc-100 flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <Upload className="h-8 w-8" />
                </div>
                <p className="mb-2 text-lg font-black tracking-tighter text-zinc-900">Click to upload banner</p>
                <p className="text-xs text-zinc-400 font-bold uppercase tracking-widest">PNG, JPG or WebP (Max 5MB)</p>
              </div>
              <input
                onChange={handleImageUploadChange}
                type="file"
                accept="image/*"
                className="hidden"
              />
            </label>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default CourseSettings;
