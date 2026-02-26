import MediaProgressbar from "@/components/media-progress-bar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import VideoPlayer from "@/components/video-player";
import { courseCurriculumInitialFormData } from "@/config";
import { InstructorContext } from "@/context/instructor-context";
import {
  mediaBulkUploadService,
  mediaDeleteService,
  mediaUploadService,
} from "@/services";
import { Upload, Plus, Trash2, Video, GripVertical, Check, Eye, EyeOff, FileVideo } from "lucide-react";
import { useContext, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

function CourseCurriculum() {
  const {
    courseCurriculumFormData,
    setCourseCurriculumFormData,
    mediaUploadProgress,
    setMediaUploadProgress,
    mediaUploadProgressPercentage,
    setMediaUploadProgressPercentage,
  } = useContext(InstructorContext);

  const bulkUploadInputRef = useRef(null);

  function handleNewLecture() {
    setCourseCurriculumFormData([
      ...courseCurriculumFormData,
      {
        ...courseCurriculumInitialFormData[0],
      },
    ]);
  }

  function handleCourseTitleChange(event, currentIndex) {
    let cpyCourseCurriculumFormData = [...courseCurriculumFormData];
    cpyCourseCurriculumFormData[currentIndex] = {
      ...cpyCourseCurriculumFormData[currentIndex],
      title: event.target.value,
    };

    setCourseCurriculumFormData(cpyCourseCurriculumFormData);
  }

  function handleFreePreviewChange(currentValue, currentIndex) {
    let cpyCourseCurriculumFormData = [...courseCurriculumFormData];
    cpyCourseCurriculumFormData[currentIndex] = {
      ...cpyCourseCurriculumFormData[currentIndex],
      freePreview: currentValue,
    };

    setCourseCurriculumFormData(cpyCourseCurriculumFormData);
  }

  async function handleSingleLectureUpload(event, currentIndex) {
    const selectedFile = event.target.files[0];

    if (selectedFile) {
      const videoFormData = new FormData();
      videoFormData.append("file", selectedFile);

      try {
        setMediaUploadProgress(true);
        const response = await mediaUploadService(
          videoFormData,
          setMediaUploadProgressPercentage
        );
        if (response.success) {
          let cpyCourseCurriculumFormData = [...courseCurriculumFormData];
          cpyCourseCurriculumFormData[currentIndex] = {
            ...cpyCourseCurriculumFormData[currentIndex],
            videoUrl: response?.data?.url,
            public_id: response?.data?.public_id,
          };
          setCourseCurriculumFormData(cpyCourseCurriculumFormData);
          setMediaUploadProgress(false);
        }
      } catch (error) {
        console.log(error);
        setMediaUploadProgress(false);
      }
    }
  }

  async function handleReplaceVideo(currentIndex) {
    let cpyCourseCurriculumFormData = [...courseCurriculumFormData];
    const getCurrentVideoPublicId =
      cpyCourseCurriculumFormData[currentIndex].public_id;

    if (getCurrentVideoPublicId) {
      await mediaDeleteService(getCurrentVideoPublicId);
    }

    cpyCourseCurriculumFormData[currentIndex] = {
      ...cpyCourseCurriculumFormData[currentIndex],
      videoUrl: "",
      public_id: "",
    };

    setCourseCurriculumFormData(cpyCourseCurriculumFormData);
  }

  function isCourseCurriculumFormDataValid() {
    return courseCurriculumFormData.every((item) => {
      return (
        item &&
        typeof item === "object" &&
        item.title.trim() !== "" &&
        item.videoUrl.trim() !== ""
      );
    });
  }

  function handleOpenBulkUploadDialog() {
    bulkUploadInputRef.current?.click();
  }

  function areAllCourseCurriculumFormDataObjectsEmpty(arr) {
    return arr.every((obj) => {
      return Object.entries(obj).every(([key, value]) => {
        if (typeof value === "boolean") {
          return true;
        }
        return value === "";
      });
    });
  }

  async function handleMediaBulkUpload(event) {
    const selectedFiles = Array.from(event.target.files);
    const bulkFormData = new FormData();

    selectedFiles.forEach((fileItem) => bulkFormData.append("files", fileItem));

    try {
      setMediaUploadProgress(true);
      const response = await mediaBulkUploadService(
        bulkFormData,
        setMediaUploadProgressPercentage
      );

      if (response?.success) {
        let cpyCourseCurriculumFormdata =
          areAllCourseCurriculumFormDataObjectsEmpty(courseCurriculumFormData)
            ? []
            : [...courseCurriculumFormData];

        cpyCourseCurriculumFormdata = [
          ...cpyCourseCurriculumFormdata,
          ...response?.data.map((item, index) => ({
            videoUrl: item?.url,
            public_id: item?.public_id,
            title: `Lecture ${cpyCourseCurriculumFormdata.length + (index + 1)
              }`,
            freePreview: false,
          })),
        ];
        setCourseCurriculumFormData(cpyCourseCurriculumFormdata);
        setMediaUploadProgress(false);
      }
    } catch (e) {
      console.log(e);
      setMediaUploadProgress(false);
    }
  }

  async function handleDeleteLecture(currentIndex) {
    let cpyCourseCurriculumFormData = [...courseCurriculumFormData];
    const getCurrentSelectedVideoPublicId =
      cpyCourseCurriculumFormData[currentIndex].public_id;

    if (getCurrentSelectedVideoPublicId) {
      await mediaDeleteService(getCurrentSelectedVideoPublicId);
    }

    cpyCourseCurriculumFormData = cpyCourseCurriculumFormData.filter(
      (_, index) => index !== currentIndex
    );

    setCourseCurriculumFormData(cpyCourseCurriculumFormData);
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="space-y-8"
    >
      <div className="bg-white rounded-[40px] border border-zinc-200/60 p-10 shadow-sm relative overflow-hidden">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12 pb-8 border-b border-zinc-100 relative z-10">
          <div>
            <h3 className="text-3xl font-black tracking-tighter text-zinc-900 mb-1 leading-none">Curriculum.</h3>
            <p className="text-zinc-500 font-medium tracking-tight">Construct your learning path lecture by lecture.</p>
          </div>
          <div className="flex items-center gap-4">
            <input
              type="file"
              ref={bulkUploadInputRef}
              accept="video/*"
              multiple
              className="hidden"
              onChange={handleMediaBulkUpload}
            />
            <Button
              variant="outline"
              className="rounded-2xl h-12 px-6 font-bold border-zinc-200 hover:bg-zinc-900 hover:text-white transition-all transition-colors flex items-center gap-2"
              onClick={handleOpenBulkUploadDialog}
            >
              <Upload className="w-4 h-4" />
              Bulk Upload
            </Button>
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-2xl h-12 px-6 font-bold shadow-lg shadow-blue-100 transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
              onClick={handleNewLecture}
              disabled={mediaUploadProgress}
            >
              <Plus className="h-5 w-5" />
              Add Lecture
            </Button>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {mediaUploadProgress && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-8 p-6 bg-blue-50 rounded-[32px] border border-blue-100"
            >
              <MediaProgressbar
                isMediaUploading={mediaUploadProgress}
                progress={mediaUploadProgressPercentage}
              />
            </motion.div>
          )}
        </AnimatePresence>

        <div className="space-y-6">
          <AnimatePresence>
            {courseCurriculumFormData.map((curriculumItem, index) => (
              <motion.div
                key={index}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-zinc-50/50 rounded-[32px] border border-zinc-200 p-8 shadow-sm group hover:bg-white hover:shadow-xl transition-all hover:border-zinc-300"
              >
                <div className="flex flex-col lg:flex-row gap-8">
                  {/* Left: Video Preview / Upload */}
                  <div className="w-full lg:w-[400px] shrink-0">
                    {curriculumItem?.videoUrl ? (
                      <div className="space-y-4">
                        <div className="aspect-video rounded-2xl overflow-hidden border-2 border-white shadow-xl bg-black">
                          <VideoPlayer
                            url={curriculumItem?.videoUrl}
                            width="100%"
                            height="100%"
                          />
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 rounded-xl h-10 font-bold border-zinc-200 hover:bg-zinc-100"
                            onClick={() => handleReplaceVideo(index)}
                          >
                            <RefreshCw className="h-3.5 w-3.5 mr-2" />
                            Replace
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 rounded-xl h-10 font-bold text-red-500 border-red-100 hover:bg-red-50 hover:border-red-200"
                            onClick={() => handleDeleteLecture(index)}
                          >
                            <Trash2 className="h-3.5 w-3.5 mr-2" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center justify-center w-full aspect-video border-2 border-dashed border-zinc-200 rounded-2xl cursor-pointer hover:bg-white hover:border-blue-400 transition-all group/upload">
                        <div className="flex flex-col items-center justify-center p-6 text-center">
                          <div className="w-12 h-12 rounded-full bg-zinc-100 flex items-center justify-center mb-4 group-hover/upload:bg-blue-600 group-hover/upload:text-white transition-colors">
                            <FileVideo className="h-6 w-6" />
                          </div>
                          <p className="text-sm font-black tracking-tighter text-zinc-900 mb-1">Upload Lecture Video</p>
                          <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">MP4 preferred</p>
                        </div>
                        <input
                          type="file"
                          accept="video/*"
                          onChange={(event) => handleSingleLectureUpload(event, index)}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>

                  {/* Right: metadata content */}
                  <div className="flex-1 space-y-6">
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-lg bg-zinc-900 text-white flex items-center justify-center font-black text-xs">
                        {index + 1}
                      </span>
                      <h4 className="text-xl font-black tracking-tighter text-zinc-900">Lecture Configuration.</h4>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Lecture Title</Label>
                        <Input
                          placeholder="e.g. Introduction to Neural Networks"
                          className="rounded-xl h-12 px-4 bg-white border-zinc-200 font-bold focus:ring-blue-500/10 focus:border-blue-500"
                          onChange={(event) => handleCourseTitleChange(event, index)}
                          value={curriculumItem?.title}
                        />
                      </div>

                      <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-zinc-100 shadow-sm">
                        <div className="flex items-center gap-4">
                          <div className={`p-2 rounded-xl ${curriculumItem?.freePreview ? 'bg-emerald-50 text-emerald-600' : 'bg-zinc-50 text-zinc-400'}`}>
                            {curriculumItem?.freePreview ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-zinc-900 leading-none mb-1">Free Preview</p>
                            <p className="text-xs text-zinc-400 font-medium">Allow students to watch this for free.</p>
                          </div>
                        </div>
                        <Switch
                          checked={curriculumItem?.freePreview}
                          onCheckedChange={(value) => handleFreePreviewChange(value, index)}
                          className="data-[state=checked]:bg-emerald-500"
                        />
                      </div>
                    </div>

                    {curriculumItem?.videoUrl && (
                      <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 px-4 py-2 rounded-xl self-start">
                        <Check className="h-4 w-4" />
                        <span className="text-xs font-black tracking-tight uppercase">Video Optimized</span>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {courseCurriculumFormData.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-20 text-center flex flex-col items-center"
          >
            <div className="w-20 h-20 rounded-full bg-zinc-50 flex items-center justify-center mb-6">
              <Video className="h-10 w-10 text-zinc-200" />
            </div>
            <h4 className="text-xl font-bold text-zinc-400">Your curriculum is empty.</h4>
            <p className="text-zinc-400 text-sm mb-8">Add your first lecture to start building your course.</p>
            <Button
              className="bg-zinc-900 hover:bg-black text-white rounded-2xl h-14 px-10 font-bold flex items-center gap-2"
              onClick={handleNewLecture}
            >
              <Plus className="h-5 w-5" />
              Add First Lecture
            </Button>
          </motion.div>
        )}
      </div>

      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
    </motion.div>
  );
}

export default CourseCurriculum;
