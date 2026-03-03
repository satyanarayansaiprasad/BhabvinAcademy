import MediaProgressbar from "@/components/media-progress-bar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import VideoPlayer from "@/components/video-player";
import { courseCurriculumInitialFormData } from "@/config";
import { InstructorContext } from "@/context/instructor-context";
import {
  mediaBulkUploadService,
  mediaDeleteService,
  mediaUploadService,
} from "@/services";
import { Upload, Plus, Trash2, Video, Check, Eye, EyeOff, FileVideo, Youtube, Link as LinkIcon, RefreshCw, Lock, FileText, X, ExternalLink } from "lucide-react";
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
    setCourseCurriculumFormData((prev) => [
      {
        ...courseCurriculumInitialFormData[0],
        id: Math.random().toString(36).substring(2, 11),
      },
      ...prev,
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

  function handleLectureNotesChange(event, currentIndex) {
    let cpyCourseCurriculumFormData = [...courseCurriculumFormData];
    cpyCourseCurriculumFormData[currentIndex] = {
      ...cpyCourseCurriculumFormData[currentIndex],
      notes: event.target.value,
    };

    setCourseCurriculumFormData(cpyCourseCurriculumFormData);
  }

  function handleAddLink(currentIndex) {
    let cpyCourseCurriculumFormData = [...courseCurriculumFormData];
    cpyCourseCurriculumFormData[currentIndex] = {
      ...cpyCourseCurriculumFormData[currentIndex],
      links: [
        ...(cpyCourseCurriculumFormData[currentIndex].links || []),
        { title: "", url: "" },
      ],
    };

    setCourseCurriculumFormData(cpyCourseCurriculumFormData);
  }

  function handleLinkChange(event, currentIndex, linkIndex, field) {
    let cpyCourseCurriculumFormData = [...courseCurriculumFormData];
    const updatedLinks = [...(cpyCourseCurriculumFormData[currentIndex].links || [])];
    updatedLinks[linkIndex] = {
      ...updatedLinks[linkIndex],
      [field]: event.target.value,
    };

    cpyCourseCurriculumFormData[currentIndex] = {
      ...cpyCourseCurriculumFormData[currentIndex],
      links: updatedLinks,
    };

    setCourseCurriculumFormData(cpyCourseCurriculumFormData);
  }

  function handleRemoveLink(currentIndex, linkIndex) {
    let cpyCourseCurriculumFormData = [...courseCurriculumFormData];
    const updatedLinks = (cpyCourseCurriculumFormData[currentIndex].links || []).filter(
      (_, index) => index !== linkIndex
    );

    cpyCourseCurriculumFormData[currentIndex] = {
      ...cpyCourseCurriculumFormData[currentIndex],
      links: updatedLinks,
    };

    setCourseCurriculumFormData(cpyCourseCurriculumFormData);
  }

  async function handlePdfUpload(event, currentIndex) {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      if (selectedFile.size > 30 * 1024) {
        alert("PDF size must be less than 30KB");
        return;
      }

      const pdfFormData = new FormData();
      pdfFormData.append("file", selectedFile);

      try {
        setMediaUploadProgress(true);
        const response = await mediaUploadService(
          pdfFormData,
          setMediaUploadProgressPercentage
        );
        if (response.success) {
          let cpyCourseCurriculumFormData = [...courseCurriculumFormData];
          cpyCourseCurriculumFormData[currentIndex] = {
            ...cpyCourseCurriculumFormData[currentIndex],
            pdfs: [
              ...(cpyCourseCurriculumFormData[currentIndex].pdfs || []),
              {
                title: selectedFile.name,
                url: response?.data?.url,
                public_id: response?.data?.public_id,
              },
            ],
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

  async function handleRemovePdf(currentIndex, pdfIndex) {
    let cpyCourseCurriculumFormData = [...courseCurriculumFormData];
    const pdfs = cpyCourseCurriculumFormData[currentIndex].pdfs || [];
    const pdfToRemove = pdfs[pdfIndex];

    if (pdfToRemove?.public_id) {
      await mediaDeleteService(pdfToRemove.public_id);
    }

    const updatedPdfs = pdfs.filter((_, index) => index !== pdfIndex);

    cpyCourseCurriculumFormData[currentIndex] = {
      ...cpyCourseCurriculumFormData[currentIndex],
      pdfs: updatedPdfs,
    };

    setCourseCurriculumFormData(cpyCourseCurriculumFormData);
  }

  function handleVideoSourceChange(source, currentIndex) {
    let cpyCourseCurriculumFormData = [...courseCurriculumFormData];
    cpyCourseCurriculumFormData[currentIndex] = {
      ...cpyCourseCurriculumFormData[currentIndex],
      videoSource: source,
      videoUrl: "",
      public_id: "", // clear previous upload info
    };
    setCourseCurriculumFormData(cpyCourseCurriculumFormData);
  }

  function handleExternalUrlChange(event, currentIndex) {
    let cpyCourseCurriculumFormData = [...courseCurriculumFormData];
    cpyCourseCurriculumFormData[currentIndex] = {
      ...cpyCourseCurriculumFormData[currentIndex],
      videoUrl: event.target.value,
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
            videoSource: "upload",
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
          ...response?.data.map((item, index) => ({
            videoUrl: item?.url,
            public_id: item?.public_id,
            title: `Lecture ${cpyCourseCurriculumFormdata.length + (index + 1)
              }`,
            freePreview: false,
            videoSource: "upload",
            id: Math.random().toString(36).substring(2, 11) + index,
          })),
          ...cpyCourseCurriculumFormdata,
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
                key={curriculumItem.id || curriculumItem._id || `lecture-${index}`}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-zinc-50/50 rounded-[32px] border border-zinc-200 p-8 shadow-sm group hover:bg-white hover:shadow-xl transition-all hover:border-zinc-300"
              >
                <div className="flex flex-col lg:flex-row gap-8">
                  {/* Left: Video Preview / Upload Source selection */}
                  <div className="w-full lg:w-[450px] shrink-0 space-y-4">
                    <div className="flex gap-2 p-1 bg-zinc-100 rounded-2xl">
                      <Button
                        variant={curriculumItem?.videoSource === "upload" ? "secondary" : "ghost"}
                        onClick={() => handleVideoSourceChange("upload", index)}
                        className={`flex-1 rounded-xl h-10 font-bold transition-all ${curriculumItem?.videoSource === "upload" ? "bg-white shadow-sm" : "hover:bg-white/50"}`}
                      >
                        <FileVideo className="h-4 w-4 mr-2" />
                        Local Upload
                      </Button>
                      <Button
                        variant={curriculumItem?.videoSource === "external" ? "secondary" : "ghost"}
                        onClick={() => handleVideoSourceChange("external", index)}
                        className={`flex-1 rounded-xl h-10 font-bold transition-all ${curriculumItem?.videoSource === "external" ? "bg-white shadow-sm" : "hover:bg-white/50"}`}
                      >
                        <Youtube className="h-4 w-4 mr-2" />
                        External URL
                      </Button>
                    </div>

                    {curriculumItem?.videoUrl ? (
                      <div className="space-y-4">
                        <div className="aspect-video rounded-3xl overflow-hidden border-4 border-white shadow-2xl bg-black group/player relative">
                          <VideoPlayer
                            url={curriculumItem?.videoUrl}
                            width="100%"
                            height="100%"
                          />
                          <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover/player:opacity-100 transition-opacity">
                            <Button
                              variant="secondary"
                              size="icon"
                              className="rounded-full bg-white/90 backdrop-blur-md hover:bg-white shadow-xl"
                              onClick={() => handleReplaceVideo(index)}
                            >
                              <RefreshCw className="h-4 w-4 text-zinc-900" />
                            </Button>
                          </div>
                        </div>
                        <div className="flex items-center justify-between px-2">
                          <div className="flex items-center gap-2 text-zinc-400">
                            {curriculumItem?.videoSource === "external" ? (
                              <>
                                <LinkIcon className="h-3 w-3" />
                                <span className="text-[10px] font-bold truncate max-w-[200px]">{curriculumItem?.videoUrl}</span>
                              </>
                            ) : (
                              <>
                                <Check className="h-3.5 w-3.5 text-emerald-500" />
                                <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-600">Securely Uploaded</span>
                              </>
                            )}
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-500 hover:text-red-600 hover:bg-red-50 font-bold rounded-xl h-8"
                            onClick={() => handleDeleteLecture(index)}
                          >
                            <Trash2 className="h-3.5 w-3.5 mr-2" />
                            Delete Lecture
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {curriculumItem?.videoSource === "upload" ? (
                          <label className="flex flex-col items-center justify-center w-full aspect-video border-2 border-dashed border-zinc-200 rounded-[32px] cursor-pointer hover:bg-white hover:border-blue-400 transition-all group/upload relative overflow-hidden bg-zinc-50/50">
                            <div className="flex flex-col items-center justify-center p-8 text-center relative z-10">
                              <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center mb-4 group-hover/upload:bg-blue-600 group-hover/upload:text-white transition-all shadow-sm group-hover/upload:shadow-xl group-hover/upload:-translate-y-1">
                                <Upload className="h-6 w-6" />
                              </div>
                              <p className="text-lg font-black tracking-tighter text-zinc-900 mb-1">Drop lecture video here</p>
                              <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-[0.2em]">High quality MP4 preferred</p>
                            </div>
                            <input
                              type="file"
                              accept="video/*"
                              onChange={(event) => handleSingleLectureUpload(event, index)}
                              className="hidden"
                            />
                          </label>
                        ) : (
                          <div className="w-full aspect-video border-2 border-dashed border-zinc-200 rounded-[32px] bg-zinc-50/50 p-8 flex flex-col justify-center">
                            <div className="space-y-4">
                              <div className="flex flex-col items-center text-center">
                                <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center mb-4 shadow-sm">
                                  <Youtube className="h-6 w-6 text-red-500" />
                                </div>
                                <p className="text-lg font-black tracking-tighter text-zinc-900">External Video URL</p>
                                <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-[0.2em] mb-6">YouTube, Vimeo, etc.</p>
                              </div>
                              <div className="relative">
                                <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                                <Input
                                  value={curriculumItem?.videoUrl}
                                  onChange={(e) => handleExternalUrlChange(e, index)}
                                  placeholder="Paste video link here..."
                                  className="rounded-2xl h-14 pl-12 pr-4 bg-white border-zinc-200 font-medium focus:ring-4 focus:ring-blue-500/5 shadow-sm"
                                />
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Right: metadata content */}
                  <div className="flex-1 space-y-8 pt-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <div className="w-12 h-12 rounded-2xl bg-zinc-900 flex items-center justify-center">
                            <span className="text-white font-black text-lg leading-none">{index + 1}</span>
                          </div>
                          <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-blue-600 border-2 border-zinc-50 flex items-center justify-center">
                            <Check className="h-2.5 w-2.5 text-white" />
                          </div>
                        </div>
                        <div>
                          <h4 className="text-2xl font-black tracking-tighter text-zinc-900 leading-none">Lecture Configuration.</h4>
                          <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-1">Set basic metadata and visibility</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Lecture Title</Label>
                        <Input
                          placeholder="e.g. 01. Introduction to the course"
                          className="rounded-2xl h-14 px-6 bg-white border-zinc-200 font-bold text-lg focus:ring-4 focus:ring-blue-500/5 transition-all shadow-sm"
                          onChange={(event) => handleCourseTitleChange(event, index)}
                          value={curriculumItem?.title}
                        />
                      </div>

                      <div className="grid grid-cols-1 gap-4">
                        <div className={`flex items-center justify-between p-6 rounded-3xl border transition-all ${curriculumItem?.freePreview ? 'bg-emerald-50/50 border-emerald-100' : 'bg-white border-zinc-100 shadow-sm'}`}>
                          <div className="flex items-center gap-5">
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${curriculumItem?.freePreview ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'bg-zinc-50 text-zinc-400'}`}>
                              {curriculumItem?.freePreview ? <Eye className="h-6 w-6" /> : <EyeOff className="h-6 w-6" />}
                            </div>
                            <div>
                              <p className="text-base font-bold text-zinc-900 leading-none mb-1">Free Preview</p>
                              <p className="text-xs text-zinc-500 font-medium tracking-tight">Allow students to watch this for free.</p>
                            </div>
                          </div>
                          <Switch
                            checked={curriculumItem?.freePreview}
                            onCheckedChange={(value) => handleFreePreviewChange(value, index)}
                            className="data-[state=checked]:bg-emerald-500"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Lecture Notes</Label>
                        <Textarea
                          placeholder="Enter commands, strings or other notes here..."
                          className="rounded-2xl min-h-[120px] px-6 py-4 bg-white border-zinc-200 font-mono text-sm focus:ring-4 focus:ring-blue-500/5 transition-all shadow-sm"
                          onChange={(event) => handleLectureNotesChange(event, index)}
                          value={curriculumItem?.notes}
                        />
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">External Links</Label>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleAddLink(index)}
                            className="rounded-xl h-8 px-3 font-bold text-[10px] border-zinc-200 hover:bg-zinc-900 hover:text-white transition-all flex items-center gap-1"
                          >
                            <Plus className="w-3 h-3" />
                            Add Link
                          </Button>
                        </div>
                        <div className="space-y-3">
                          {curriculumItem?.links?.map((link, linkIndex) => (
                            <div key={linkIndex} className="flex gap-3 items-start animate-in fade-in slide-in-from-top-2 duration-300">
                              <div className="flex-1 space-y-2">
                                <Input
                                  placeholder="Link Title (e.g. Documentation)"
                                  className="rounded-xl h-10 px-4 bg-white border-zinc-200 text-xs font-bold focus:ring-2 focus:ring-blue-500/5 shadow-sm"
                                  value={link.title}
                                  onChange={(e) => handleLinkChange(e, index, linkIndex, "title")}
                                />
                                <Input
                                  placeholder="URL (https://...)"
                                  className="rounded-xl h-10 px-4 bg-white border-zinc-200 text-xs font-medium focus:ring-2 focus:ring-blue-500/5 shadow-sm"
                                  value={link.url}
                                  onChange={(e) => handleLinkChange(e, index, linkIndex, "url")}
                                />
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleRemoveLink(index, linkIndex)}
                                className="rounded-xl h-10 w-10 text-red-500 hover:text-red-600 hover:bg-red-50"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-4 pt-4 border-t border-zinc-100">
                        <div className="flex items-center justify-between">
                          <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">PDF Attachments (Max 30KB)</Label>
                          <div className="relative">
                            <input
                              type="file"
                              accept=".pdf"
                              className="hidden"
                              id={`pdf-upload-${index}`}
                              onChange={(e) => handlePdfUpload(e, index)}
                            />
                            <Button
                              variant="outline"
                              size="sm"
                              asChild
                              className="rounded-xl h-8 px-3 font-bold text-[10px] border-zinc-200 hover:bg-zinc-900 hover:text-white transition-all cursor-pointer"
                            >
                              <label htmlFor={`pdf-upload-${index}`} className="flex items-center gap-1">
                                <Upload className="w-3 h-3" />
                                Upload PDF
                              </label>
                            </Button>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 gap-3">
                          {curriculumItem?.pdfs?.map((pdf, pdfIndex) => (
                            <div key={pdfIndex} className="flex items-center justify-between p-4 bg-white border border-zinc-100 rounded-2xl shadow-sm group/pdf hover:border-zinc-200 transition-all">
                              <div className="flex items-center gap-3 min-w-0">
                                <div className="w-8 h-8 rounded-lg bg-red-50 text-red-500 flex items-center justify-center shrink-0">
                                  <FileText className="h-4 w-4" />
                                </div>
                                <div className="truncate">
                                  <p className="text-xs font-bold text-zinc-900 truncate">{pdf.title}</p>
                                  <a href={pdf.url} target="_blank" rel="noopener noreferrer" className="text-[10px] text-blue-500 hover:underline flex items-center gap-1">
                                    View File <ExternalLink className="w-2 h-2" />
                                  </a>
                                </div>
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleRemovePdf(index, pdfIndex)}
                                className="rounded-xl h-8 w-8 text-red-500 opacity-0 group-hover/pdf:opacity-100 transition-opacity hover:bg-red-50"
                              >
                                <X className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-zinc-100 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-zinc-400 font-medium text-xs">
                        <Lock className="w-3.5 h-3.5" />
                        SSL Secured Content
                      </div>
                    </div>
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
