import CommonForm from "@/components/common-form";
import { signInFormControls, signUpFormControls } from "@/config";
import { AuthContext } from "@/context/auth-context";
import { GraduationCap, ArrowLeft, ShieldCheck, Sparkles } from "lucide-react";
import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { GoogleLogin } from "@react-oauth/google";
import { useMsal } from "@azure/msal-react";
import { loginRequest } from "@/config/oauth-config";

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
    <div className="min-h-screen bg-[#f2f2f2] flex flex-col">
      {/* Header */}
      <header className="fixed top-0 w-full px-6 py-4 flex items-center justify-between z-20 bg-white border-b border-[#e6e6e6] shadow-sm">
        <Link to={"/"} className="flex items-center gap-3 text-black">
          <div className="bg-black p-1.5 rounded-sm">
            <GraduationCap className="h-6 w-6 text-white" />
          </div>
          <span className="font-semibold text-xl tracking-tight">Bhavin Academy</span>
        </Link>
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-[#616161] hover:text-black font-semibold text-sm transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </button>
      </header>

      <main className="flex-1 flex items-center justify-center p-6 pt-32 pb-16">
        <div className="w-full max-w-[900px] grid grid-cols-1 lg:grid-cols-2 bg-white rounded-sm border border-[#e6e6e6] shadow-xl overflow-hidden">

          {/* Left Side: Branding */}
          <div className="hidden lg:flex flex-col justify-between p-12 bg-[#f8f9fa] border-r border-[#e6e6e6]">
            <div>
              <div className="w-12 h-12 rounded-sm bg-[#0067b8] flex items-center justify-center mb-8">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-3xl font-semibold tracking-tight text-black mb-6 leading-tight">
                Unlock your potential with professional learning.
              </h2>
              <p className="text-[#616161] font-normal text-sm leading-relaxed max-w-xs">
                Join a community of dedicated learners and master new skills through structured, high-quality content.
              </p>
            </div>
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <ShieldCheck className="h-5 w-5 text-emerald-600" />
                <span className="font-semibold text-xs text-black uppercase tracking-wider">Secure Access</span>
              </div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-[#d2d2d2]">© 2026 BHAVIN ACADEMY</p>
            </div>
          </div>

          {/* Right Side: Form */}
          <div className="p-8 md:p-12 flex flex-col justify-center">
            <div className="mb-10 flex bg-[#f2f2f2] p-1 rounded-sm">
              <button
                onClick={() => setActiveTab("signin")}
                className={`flex-1 py-2.5 rounded-sm font-semibold text-sm transition-none ${activeTab === 'signin' ? 'bg-white text-black shadow-sm' : 'text-[#616161] hover:text-black'}`}
              >
                Sign In
              </button>
              <button
                onClick={() => setActiveTab("signup")}
                className={`flex-1 py-2.5 rounded-sm font-semibold text-sm transition-none ${activeTab === 'signup' ? 'bg-white text-black shadow-sm' : 'text-[#616161] hover:text-black'}`}
              >
                Sign Up
              </button>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {activeTab === "signin" ? (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-2xl font-semibold tracking-tight text-black mb-1">Welcome back</h3>
                      <p className="text-[#616161] font-normal text-sm">Please enter your details to sign in.</p>
                    </div>
                    <div className="auth-form-container">
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
                          className="text-xs font-semibold text-[#0067b8] hover:underline"
                        >
                          Forgot Password?
                        </button>
                      </div>
                    </div>
                  </div>
                ) : activeTab === "signup" ? (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-2xl font-semibold tracking-tight text-black mb-1">Create an account</h3>
                      <p className="text-[#616161] font-normal text-sm">Start your learning journey today.</p>
                    </div>
                    <div className="auth-form-container">
                      <CommonForm
                        formControls={signUpFormControls}
                        buttonText={"Get Started"}
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
                  <span className="w-full border-t border-[#e6e6e6]" />
                </div>
                <div className="relative flex justify-center text-[10px] uppercase font-semibold tracking-wider">
                  <span className="bg-white px-4 text-[#616161]">Or continue with</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="w-full flex justify-center">
                  <GoogleLogin
                    onSuccess={onGoogleSuccess}
                    onError={() => console.log("Google Login Failed")}
                    useOneTap
                    theme="outline"
                    shape="square"
                    width="100%"
                  />
                </div>
                <button
                  onClick={onMicrosoftLogin}
                  className="w-full h-[40px] flex items-center justify-center gap-2 border border-[#d2d2d2] rounded-sm hover:bg-[#f2f2f2] transition-none font-semibold text-xs"
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

            <p className="mt-10 text-center text-xs text-[#616161] font-normal">
              By continuing, you agree to our <span className="text-black font-semibold hover:underline cursor-pointer">Terms</span> and <span className="text-black font-semibold hover:underline cursor-pointer">Privacy Policy</span>.
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
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-semibold tracking-tight text-black mb-1">
          {step === 1 ? "Reset Password" : "New Password"}
        </h3>
        <p className="text-[#616161] font-normal text-sm">
          {step === 1 ? "Enter your email to verify your identity." : "Set a new secure password for your account."}
        </p>
      </div>
      <form onSubmit={step === 1 ? onForgotSubmit : onResetSubmit} className="space-y-4 auth-form-container">
        {step === 1 ? (
          <div>
            <label className="text-xs font-semibold text-black mb-2 block uppercase tracking-wider">Email Address</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-12 px-4 rounded-sm border border-[#e6e6e6] focus:border-[#0067b8] focus:ring-0 transition-none font-normal text-sm"
              required
            />
          </div>
        ) : (
          <div>
            <label className="text-xs font-semibold text-black mb-2 block uppercase tracking-wider">New Password</label>
            <input
              type="password"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full h-12 px-4 rounded-sm border border-[#e6e6e6] focus:border-[#0067b8] focus:ring-0 transition-none font-normal text-sm"
              required
            />
          </div>
        )}
        <button type="submit" className="w-full h-12 bg-[#0067b8] text-white rounded-sm font-semibold text-sm hover:bg-[#005a9e] transition-none">
          {step === 1 ? "Verify Email" : "Reset Password"}
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("signin")}
          className="w-full text-center text-xs font-semibold text-[#616161] hover:text-black transition-colors py-2"
        >
          Back to Sign In
        </button>
      </form>
    </div>
  );
}

export default AuthPage;
