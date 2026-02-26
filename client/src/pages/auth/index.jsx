import CommonForm from "@/components/common-form";
import { signInFormControls, signUpFormControls } from "@/config";
import { AuthContext } from "@/context/auth-context";
import { GraduationCap, ArrowLeft, ShieldCheck, Sparkles } from "lucide-react";
import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

function AuthPage() {
  const [activeTab, setActiveTab] = useState("signin");
  const navigate = useNavigate();
  const {
    signInFormData,
    setSignInFormData,
    signUpFormData,
    setSignUpFormData,
    handleRegisterUser,
    handleLoginUser,
  } = useContext(AuthContext);

  function checkIfSignInFormIsValid() {
    return (
      signInFormData &&
      signInFormData.userEmail !== "" &&
      signInFormData.password !== ""
    );
  }

  function checkIfSignUpFormIsValid() {
    return (
      signUpFormData &&
      signUpFormData.userName !== "" &&
      signUpFormData.userEmail !== "" &&
      signUpFormData.password !== ""
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Header */}
      <header className="fixed top-0 w-full px-6 py-6 flex items-center justify-between z-20">
        <Link to={"/"} className="flex items-center gap-3 group">
          <div className="bg-zinc-900 p-2 rounded-xl group-hover:scale-110 transition-transform">
            <GraduationCap className="h-6 w-6 text-white" />
          </div>
          <span className="font-black text-xl tracking-tighter text-zinc-900">Bhavin Academy</span>
        </Link>

        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-zinc-400 hover:text-zinc-900 font-bold text-sm transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to home
        </button>
      </header>

      <main className="flex-1 flex items-center justify-center p-6 pt-24">
        <div className="w-full max-w-[1000px] grid grid-cols-1 lg:grid-cols-2 bg-white rounded-[48px] shadow-2xl overflow-hidden border border-zinc-200/50">

          {/* Left Side: Branding/Visual */}
          <div className="hidden lg:flex flex-col justify-between p-16 bg-zinc-950 text-white relative overflow-hidden">
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center mb-8">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-[28px] font-black tracking-tighter leading-tight mb-6">
                Start your <br />
                learning <br />
                revolution.
              </h2>
              <p className="text-zinc-400 font-medium text-base leading-relaxed max-w-xs">
                Join the most immersive community of high-achievers. Master any skill with cinematic precision.
              </p>
            </div>

            <div className="relative z-10 space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
                  <ShieldCheck className="h-5 w-5 text-emerald-500" />
                </div>
                <span className="font-bold text-sm text-zinc-300">Secure & Encrypted</span>
              </div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">
                © 2026 BHAVIN ACADEMY GLOBAL
              </p>
            </div>

            {/* Abstract Background Blur */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-blue-600/10 rounded-full blur-[100px]" />
          </div>

          {/* Right Side: Form */}
          <div className="p-8 md:p-16 flex flex-col justify-center">
            <div className="mb-10 flex bg-zinc-100 p-1.5 rounded-2xl h-14">
              <button
                onClick={() => setActiveTab("signin")}
                className={`flex-1 rounded-xl font-bold text-sm transition-all ${activeTab === 'signin' ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-400 hover:text-zinc-600'}`}
              >
                Sign In
              </button>
              <button
                onClick={() => setActiveTab("signup")}
                className={`flex-1 rounded-xl font-bold text-sm transition-all ${activeTab === 'signup' ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-400 hover:text-zinc-600'}`}
              >
                Sign Up
              </button>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {activeTab === "signin" ? (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-[22px] font-black tracking-tighter text-zinc-900 mb-2">Welcome Back.</h3>
                      <p className="text-zinc-500 font-medium">Continue your journey to excellence.</p>
                    </div>
                    <div className="space-y-4 pt-4 auth-form-container">
                      <CommonForm
                        formControls={signInFormControls}
                        buttonText={"Sign In"}
                        formData={signInFormData}
                        setFormData={setSignInFormData}
                        isButtonDisabled={!checkIfSignInFormIsValid()}
                        handleSubmit={handleLoginUser}
                      />
                      <div className="flex justify-end mt-2">
                        <button
                          onClick={() => setActiveTab("forgot")}
                          className="text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors"
                        >
                          Forgot Password?
                        </button>
                      </div>
                    </div>
                  </div>
                ) : activeTab === "signup" ? (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-[22px] font-black tracking-tighter text-zinc-900 mb-2">Join the Academy.</h3>
                      <p className="text-zinc-500 font-medium">Setup your profile and start learning.</p>
                    </div>
                    <div className="space-y-4 pt-4 auth-form-container">
                      <CommonForm
                        formControls={signUpFormControls}
                        buttonText={"Create Account"}
                        formData={signUpFormData}
                        setFormData={setSignUpFormData}
                        isButtonDisabled={!checkIfSignUpFormIsValid()}
                        handleSubmit={handleRegisterUser}
                      />
                    </div>
                  </div>
                ) : (
                  <ForgotPasswordSection setActiveTab={setActiveTab} />
                )}
              </motion.div>
            </AnimatePresence>

            <p className="mt-12 text-center text-xs text-zinc-400 font-medium">
              By continuing, you agree to our <span className="text-zinc-900 font-bold underline cursor-pointer">Terms of Service</span> and <span className="text-zinc-900 font-bold underline cursor-pointer">Privacy Policy</span>.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

function ForgotPasswordSection({ setActiveTab }) {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [step, setStep] = useState(1); // 1: Email, 2: New Password
  const { handleForgotPassword, handleResetPassword } = useContext(AuthContext);

  async function onForgotSubmit(e) {
    e.preventDefault();
    const data = await handleForgotPassword(email);
    if (data.success) {
      setStep(2);
    }
  }

  async function onResetSubmit(e) {
    e.preventDefault();
    const data = await handleResetPassword(email, newPassword);
    if (data.success) {
      setActiveTab("signin");
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-[22px] font-black tracking-tighter text-zinc-900 mb-2">
          {step === 1 ? "Reset Password." : "New Password."}
        </h3>
        <p className="text-zinc-500 font-medium">
          {step === 1 ? "Enter your email to verify your identity." : "Set a new secure password for your account."}
        </p>
      </div>

      <form onSubmit={step === 1 ? onForgotSubmit : onResetSubmit} className="space-y-4 pt-4 auth-form-container">
        {step === 1 ? (
          <div>
            <label className="text-sm font-bold text-zinc-900 mb-2 block">Email Address</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-12 px-5 rounded-xl border border-zinc-200 focus:border-zinc-900 focus:ring-0 transition-all font-medium"
              required
            />
          </div>
        ) : (
          <div>
            <label className="text-sm font-bold text-zinc-900 mb-2 block">New Password</label>
            <input
              type="password"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full h-12 px-5 rounded-xl border border-zinc-200 focus:border-zinc-900 focus:ring-0 transition-all font-medium"
              required
            />
          </div>
        )}

        <Button type="submit" className="w-full h-14 bg-zinc-900 text-white rounded-2xl font-black text-sm shadow-lg shadow-zinc-900/10">
          {step === 1 ? "Verify Email" : "Reset Password"}
        </Button>

        <button
          type="button"
          onClick={() => setActiveTab("signin")}
          className="w-full text-center text-xs font-bold text-zinc-400 hover:text-zinc-600 transition-colors py-2"
        >
          Back to Sign In
        </button>
      </form>
    </div>
  );
}

export default AuthPage;
