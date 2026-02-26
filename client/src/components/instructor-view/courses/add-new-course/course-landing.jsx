import FormControls from "@/components/common-form/form-controls";
import { courseLandingPageFormControls } from "@/config";
import { InstructorContext } from "@/context/instructor-context";
import { useContext } from "react";
import { motion } from "framer-motion";
import { Sparkles, Layout } from "lucide-react";

function CourseLanding() {
  const { courseLandingFormData, setCourseLandingFormData } =
    useContext(InstructorContext);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="bg-white rounded-[32px] border border-zinc-200/60 p-8 shadow-sm">
        <div className="flex items-center gap-4 mb-8 pb-8 border-b border-zinc-100">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
            <Layout className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-2xl font-black tracking-tighter text-zinc-900 leading-none mb-1">Landing Page Content.</h3>
            <p className="text-zinc-400 font-medium text-sm">This is the first thing students will see. Make it count.</p>
          </div>
        </div>

        <div className="auth-form-container">
          <FormControls
            formControls={courseLandingPageFormControls}
            formData={courseLandingFormData}
            setFormData={setCourseLandingFormData}
          />
        </div>
      </div>

      <div className="bg-zinc-900 rounded-[32px] p-8 text-white relative overflow-hidden">
        <div className="relative z-10 flex items-start gap-6">
          <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center shrink-0">
            <Sparkles className="h-6 w-6 text-blue-400" />
          </div>
          <div>
            <h4 className="text-lg font-black tracking-tighter mb-1">Conversion Tip.</h4>
            <p className="text-zinc-400 text-sm leading-relaxed max-w-xl">
              Courses with high-quality descriptions and clear objectives see a 40% higher conversion rate. Keep your title punchy and your subtitle descriptive.
            </p>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />
      </div>
    </motion.div>
  );
}

export default CourseLanding;
