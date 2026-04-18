import CommonForm from "@/components/common-form";
import { signInFormControls, signUpFormControls } from "@/config";
import { AuthContext } from "@/context/auth-context";
import { ChevronRight, Sparkles, Quote, CheckCircle2 } from "lucide-react";
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
      const loginResponse = await instance.loginPopup({ ...loginRequest });
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
    <div className="min-h-screen bg-black flex flex-col font-['Inter']">
      {/* MINIMAL NAV */}
      <nav className="h-[52px] border-b border-white/10 flex items-center justify-center px-6 sticky top-0 z-[100] bg-black/80 backdrop-blur-xl">
        <div className="max-w-[1080px] w-full flex items-center justify-between">
            <Link to="/" className="text-[18px] font-bold tracking-tight text-[#f5f5f7]">
                Bhavin<span className="text-[#0071e3]">Academy</span>
            </Link>
            <div className="flex items-center gap-6">
                <Link to="/" className="text-[13px] text-[#f5f5f7]/60 hover:text-[#f5f5f7] transition-colors">Back to Home</Link>
                <button 
                  onClick={() => setActiveTab(activeTab === 'signin' ? 'signup' : 'signin')}
                  className="bg-[#0071e3] text-white px-4 py-1.5 rounded-full text-[13px] font-medium hover:bg-[#0077ed] transition-colors"
                >
                  {activeTab === 'signin' ? 'Create Account' : 'Sign In'}
                </button>
            </div>
        </div>
      </nav>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2">
        {/* LEFT: BRAND PANEL */}
        <div className="hidden lg:flex flex-col justify-center p-16 relative overflow-hidden bg-[linear-gradient(160deg,#000_0%,#1a1a2e_60%,#000_100%)] border-r border-white/10">
            <div className="absolute w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(0,113,227,0.25)_0%,transparent_65%)] top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
            <div className="absolute w-[250px] h-[250px] rounded-full bg-[radial-gradient(circle,rgba(0,212,255,0.1)_0%,transparent_70%)] top-20 -right-16 pointer-events-none" />
            
            <div className="relative z-10 max-w-[440px]">
                <div className="text-[12px] font-bold text-[#0071e3] uppercase tracking-[0.1em] mb-6 flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    Welcome to Bhavin Academy
                </div>
                <h2 className="text-[clamp(32px,3.5vw,52px)] font-extrabold text-[#f5f5f7] leading-[1.05] tracking-[-1.5px] mb-6">
                    Begin your journey<br />of <span className="bg-[linear-gradient(90deg,#0071e3,#00d4ff)] bg-clip-text text-transparent italic">enhancement.</span>
                </h2>
                <p className="text-[16px] text-[#86868b] leading-[1.7] font-light mb-12">
                    Professional training across Microsoft, Linux, and Cloud. You're the only person who can own your growth. Take the lead today.
                </p>

                <div className="space-y-6">
                    <div className="bg-white/5 border border-white/10 rounded-[18px] p-6 backdrop-blur-md">
                        <Quote className="w-8 h-8 text-[#0071e3] mb-4 opacity-50" />
                        <p className="text-[14px] text-[#d1d1d6] leading-[1.6] italic mb-4">
                            "Every expert was once a beginner. Log in, keep going, your next milestone is one session away."
                        </p>
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-[#0071e3] flex items-center justify-center text-[11px] font-bold text-white">BA</div>
                            <span className="text-[12px] text-[#86868b]">Bhavin Academy Team</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* RIGHT: FORM PANEL */}
        <div className="bg-[#0a0a0a] flex flex-col items-center justify-center p-8 lg:p-20 relative">
            <div className="w-full max-w-[400px]">
                <div className="mb-10 text-center lg:text-left">
                    <h1 className="text-[28px] font-bold tracking-tight text-[#f5f5f7] mb-2">
                        {activeTab === 'signin' ? 'Sign in to Academy' : 'Create an Account'}
                    </h1>
                    <p className="text-[14px] text-[#6e6e73] font-light">
                        Discover expert-led IT courses and build your skills.
                    </p>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-8">
                    <button 
                      onClick={onGoogleSuccess}
                      className="flex items-center justify-center gap-2 h-11 border border-white/10 rounded-[12px] bg-white/5 text-[13px] font-medium text-[#f5f5f7] hover:bg-white/10 transition-colors"
                    >
                         <svg className="w-4 h-4" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                         Google
                    </button>
                    <button 
                      onClick={onMicrosoftLogin}
                      className="flex items-center justify-center gap-2 h-11 border border-white/10 rounded-[12px] bg-white/5 text-[13px] font-medium text-[#f5f5f7] hover:bg-white/10 transition-colors"
                    >
                        <svg className="w-4 h-4" viewBox="0 0 23 23"><path fill="#f35325" d="M1 1h10v10H1z"/><path fill="#81bc06" d="M12 1h10v10H12z"/><path fill="#05a6f0" d="M1 12h10v10H1z"/><path fill="#ffba08" d="M12 12h10v10H12z"/></svg>
                        Microsoft
                    </button>
                </div>

                <div className="flex items-center gap-4 mb-8">
                    <div className="flex-1 h-[1px] bg-white/10"></div>
                    <span className="text-[12px] text-[#6e6e73] font-medium uppercase tracking-wider">Or email</span>
                    <div className="flex-1 h-[1px] bg-white/10"></div>
                </div>

                <AnimatePresence mode="wait">
                    <motion.div 
                      key={activeTab}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="auth-form-dark"
                    >
                        <CommonForm 
                          formControls={activeTab === 'signin' ? signInFormControls : signUpFormControls}
                          formData={activeTab === 'signin' ? signInFormData : signUpFormData}
                          setFormData={activeTab === 'signin' ? setSignInFormData : setSignUpFormData}
                          buttonText={activeTab === 'signin' ? "Sign In" : "Get Started"}
                          isButtonDisabled={activeTab === 'signin' ? !checkIfSignInFormIsValid() : !checkIfSignUpFormIsValid()}
                          handleSubmit={activeTab === 'signin' ? handleLoginUser : handleRegisterUser}
                        />

                        {activeTab === 'signin' && (
                            <div className="mt-4 text-center">
                                <button
                                    onClick={() => setActiveTab('forgot')}
                                    className="text-[13px] text-[#0071e3] hover:underline"
                                >
                                    Forgot password?
                                </button>
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>

                <div className="mt-8 text-center text-[13px] text-[#6e6e73]">
                    {activeTab === 'signin' ? (
                        <>New to Academy? <button onClick={() => setActiveTab('signup')} className="text-[#0071e3] font-semibold hover:underline">Create account</button></>
                    ) : (
                        <>Already have an account? <button onClick={() => setActiveTab('signin')} className="text-[#0071e3] font-semibold hover:underline">Sign in</button></>
                    )}
                </div>

                <div className="mt-12 flex items-center justify-center gap-6 pt-8 border-t border-white/5 opacity-30">
                     <div className="flex items-center gap-1.5 text-[11px] text-[#f5f5f7]">
                        <CheckCircle2 className="w-3 h-3" /> Secure SSL
                     </div>
                     <div className="flex items-center gap-1.5 text-[11px] text-[#f5f5f7]">
                        <CheckCircle2 className="w-3 h-3" /> GDPR Ready
                     </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}

export default AuthPage;

