import CommonForm from "@/components/common-form";
import { signInFormControls, signUpFormControls } from "@/config";
import { AuthContext } from "@/context/auth-context";
import { GraduationCap, ArrowLeft, ShieldCheck, Sparkles } from "lucide-react";
import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { GoogleLogin } from "@react-oauth/google";
import { useMsal } from "@azure/msal-react";
import { loginRequest } from "@/config/oauth-config"; // I need to add this to config

function AuthPage() {
  const [activeTab, setActiveTab] = useState("signin");
  const navigate = useNavigate();
  const {
    signInFormData, setSignInFormData,
    signUpFormData, setSignUpFormData,
    handleRegisterUser, handleLoginUser,
    handleGoogleLogin, handleMicrosoftLogin,
  } = useContext(AuthContext);

  const { instance } = useMsal();

  function checkIfSignInFormIsValid() {
    return signInFormData && signInFormData.userEmail !== "" && signInFormData.password !== "";
  }
  function checkIfSignUpFormIsValid() {
    return signUpFormData && signUpFormData.userName !== "" && signUpFormData.userEmail !== "" && signUpFormData.password !== "";
  }

  const onGoogleSuccess = async (response) => {
    await handleGoogleLogin(response.credential);
  };

  const onMicrosoftLogin = async () => {
    try {
      const loginResponse = await instance.loginPopup({
        ...loginRequest,
      });
      if (loginResponse) {
        await handleMicrosoftLogin({
          microsoftId: loginResponse.uniqueId,
          email: loginResponse.account.username,
          name: loginResponse.account.name,
        });
      }
    } catch (error) {
      console.error("Microsoft Login Error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Header */}
      <header className="fixed top-0 w-full px-4 xs:px-6 py-3 xs:py-6 flex items-center justify-between z-20">
        <Link to={"/"} className="flex items-center gap-3 text-zinc-900 group">
          <div className="bg-zinc-900 p-1.5 rounded-lg group-hover:scale-110 transition-transform">
            <GraduationCap className="h-6 w-6 text-white" />
          </div>
          <span className="font-extrabold text-xl tracking-tight">Bhavin Academy</span>
        </Link>
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-1.5 xs:gap-2 text-zinc-400 hover:text-zinc-900 font-bold text-xs xs:text-sm transition-colors min-h-[44px]"
        >
          <ArrowLeft className="h-3.5 w-3.5 xs:h-4 xs:w-4" />
          Back
        </button>
      </header>

      <main className="flex-1 flex items-center justify-center p-3 xs:p-6 pt-20 xs:pt-24">
        <div className="w-full max-w-[1000px] grid grid-cols-1 lg:grid-cols-2 bg-white rounded-[24px] xs:rounded-[48px] shadow-2xl overflow-hidden border border-zinc-200/50">

          {/* Left Side: Branding - hidden on small screens */}
          <div className="hidden lg:flex flex-col justify-between p-16 bg-zinc-950 text-white relative overflow-hidden">
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center mb-8">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-[28px] font-black tracking-tighter leading-tight mb-6">
                Start your <br />learning <br />revolution.
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
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">© 2026 BHAVIN ACADEMY GLOBAL</p>
            </div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-blue-600/10 rounded-full blur-[100px]" />
          </div>

          {/* Right Side: Form */}
          <div className="p-5 xs:p-8 md:p-16 flex flex-col justify-center">
            <div className="mb-6 xs:mb-10 flex bg-zinc-100 p-1 xs:p-1.5 rounded-xl xs:rounded-2xl h-12 xs:h-14">
              <button
                onClick={() => setActiveTab("signin")}
                className={`flex-1 rounded-lg xs:rounded-xl font-bold text-xs xs:text-sm transition-all min-h-[40px] ${activeTab === 'signin' ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-400 hover:text-zinc-600'}`}
              >
                Sign In
              </button>
              <button
                onClick={() => setActiveTab("signup")}
                className={`flex-1 rounded-lg xs:rounded-xl font-bold text-xs xs:text-sm transition-all min-h-[40px] ${activeTab === 'signup' ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-400 hover:text-zinc-600'}`}
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
                  <div className="space-y-4 xs:space-y-6">
                    <div>
                      <h3 className="text-xl xs:text-[22px] font-black tracking-tighter text-zinc-900 mb-1 xs:mb-2">Welcome Back.</h3>
                      <p className="text-zinc-500 font-medium text-sm xs:text-base">Continue your journey to excellence.</p>
                    </div>
                    <div className="space-y-3 xs:space-y-4 pt-2 xs:pt-4 auth-form-container">
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
                          className="text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors min-h-[44px] px-2"
                        >
                          Forgot Password?
                        </button>
                      </div>
                    </div>
                  </div>
                ) : activeTab === "signup" ? (
                  <div className="space-y-4 xs:space-y-6">
                    <div>
                      <h3 className="text-xl xs:text-[22px] font-black tracking-tighter text-zinc-900 mb-1 xs:mb-2">Join the Academy.</h3>
                      <p className="text-zinc-500 font-medium text-sm xs:text-base">Setup your profile and start learning.</p>
                    </div>
                    <div className="space-y-3 xs:space-y-4 pt-2 xs:pt-4 auth-form-container">
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

            <div className="mt-8 space-y-4">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-zinc-200" />
                </div>
                <div className="relative flex justify-center text-[10px] uppercase font-black tracking-widest">
                  <span className="bg-white px-4 text-zinc-400">Or continue with</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="w-full flex justify-center">
                  <GoogleLogin
                    onSuccess={onGoogleSuccess}
                    onError={() => console.log("Google Login Failed")}
                    useOneTap
                    theme="outline"
                    shape="pill"
                    width="100%"
                  />
                </div>
                <button
                  onClick={onMicrosoftLogin}
                  className="w-full h-[40px] flex items-center justify-center gap-2 border border-zinc-200 rounded-full hover:bg-zinc-50 transition-all font-bold text-xs"
                >
                  <svg className="w-4 h-4" viewBox="0 0 23 23">
                    <path fill="#f3f3f3" d="M0 0h23v23H0z" />
                    <path fill="#f35325" d="M1 1h10v10H1z" />
                    <path fill="#81bc06" d="M12 1h10v10H12z" />
                    <path fill="#05a6f0" d="M1 12h10v10H1z" />
                    <path fill="#ffba08" d="M12 12h10v10H12z" />
                  </svg>
                  Microsoft
                </button>
              </div>
            </div>

            <p className="mt-8 xs:mt-12 text-center text-xs text-zinc-400 font-medium">
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
  const [step, setStep] = useState(1);
  const { handleForgotPassword, handleResetPassword } = useContext(AuthContext);

  async function onForgotSubmit(e) {
    e.preventDefault();
    const data = await handleForgotPassword(email);
    if (data.success) setStep(2);
  }

  async function onResetSubmit(e) {
    e.preventDefault();
    const data = await handleResetPassword(email, newPassword);
    if (data.success) setActiveTab("signin");
  }

  return (
    <div className="space-y-4 xs:space-y-6">
      <div>
        <h3 className="text-xl xs:text-[22px] font-black tracking-tighter text-zinc-900 mb-1 xs:mb-2">
          {step === 1 ? "Reset Password." : "New Password."}
        </h3>
        <p className="text-zinc-500 font-medium text-sm xs:text-base">
          {step === 1 ? "Enter your email to verify your identity." : "Set a new secure password for your account."}
        </p>
      </div>
      <form onSubmit={step === 1 ? onForgotSubmit : onResetSubmit} className="space-y-3 xs:space-y-4 pt-2 xs:pt-4 auth-form-container">
        {step === 1 ? (
          <div>
            <label className="text-sm font-bold text-zinc-900 mb-2 block">Email Address</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-12 px-4 xs:px-5 rounded-xl border border-zinc-200 focus:border-zinc-900 focus:ring-0 transition-all font-medium text-sm xs:text-base"
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
              className="w-full h-12 px-4 xs:px-5 rounded-xl border border-zinc-200 focus:border-zinc-900 focus:ring-0 transition-all font-medium text-sm xs:text-base"
              required
            />
          </div>
        )}
        <button type="submit" className="w-full h-12 xs:h-14 bg-zinc-900 text-white rounded-xl xs:rounded-2xl font-black text-sm shadow-lg shadow-zinc-900/10 hover:bg-zinc-800 transition-all active:scale-95 min-h-[44px]">
          {step === 1 ? "Verify Email" : "Reset Password"}
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("signin")}
          className="w-full text-center text-xs font-bold text-zinc-400 hover:text-zinc-600 transition-colors py-2 min-h-[44px]"
        >
          Back to Sign In
        </button>
      </form>
    </div>
  );
}

export default AuthPage;
