import React, { useContext, useState } from "react";
import { AuthContext } from "@/context/auth-context";
import { Link, useNavigate } from "react-router-dom";
import { useMsal } from "@azure/msal-react";
import { loginRequest } from "@/config/oauth-config";

function AuthPage() {
  const [activeTab, setActiveTab] = useState("signin"); // signin | signup
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
    return (
      signUpFormData &&
      signUpFormData.userName !== "" &&
      signUpFormData.userFullName !== "" &&
      signUpFormData.userEmail !== "" &&
      signUpFormData.password !== ""
    );
  }

  const onGoogleSuccess = async () => {
    // Standard mock token or flow
    await handleGoogleLogin("google-oauth-token-placeholder");
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
    <div className="min-h-screen bg-black flex flex-col font-sans text-[#f5f5f7]">
      
      {/* ─── NAV ─────────────────────────────────────────────── */}
      <nav className="sticky top-0 z-[100] bg-black/85 backdrop-blur-[20px] border-b border-white/8 h-[52px] flex items-center justify-center">
        <div className="max-w-[1080px] w-full flex items-center justify-between px-6">
          <Link to="/" className="text-[18px] font-bold tracking-[-0.5px] text-[#f5f5f7]">
            Bhavin<span className="text-[#0071e3]">Academy</span>
          </Link>
          <div className="flex items-center gap-6">
            <Link to="/" className="text-[13px] text-[#f5f5f7] opacity-60 hover:opacity-100 transition-opacity">
              Back to Home
            </Link>
            <button 
              onClick={() => setActiveTab(activeTab === "signin" ? "signup" : "signin")}
              className="bg-[#0071e3] text-white py-[7px] px-[16px] rounded-[980px] text-[13px] font-medium hover:bg-[#0077ed] transition-colors cursor-pointer border-none"
            >
              {activeTab === "signin" ? "Create Account" : "Sign In"}
            </button>
          </div>
        </div>
      </nav>

      {/* ─── LOGIN SPLIT ─────────────────────────────────────── */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 min-h-[calc(100vh-52px)]">
        
        {/* LEFT — brand panel */}
        <div className="hidden lg:flex flex-col justify-center p-[64px_56px] bg-gradient-to-br from-black via-[#1a1a2e] to-black relative overflow-hidden border-r border-white/6">
          <div className="absolute w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(0,113,227,0.3)_0%,transparent_65%)] top-1/2 left-[40%] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
          <div className="absolute w-[250px] h-[250px] rounded-full bg-[radial-gradient(circle,rgba(0,212,255,0.15)_0%,transparent_70%)] top-[20%] right-[-60px] pointer-events-none" />
          
          <div className="relative z-10 max-w-[440px] text-left">
            <p className="text-[12px] font-semibold text-[#0071e3] uppercase tracking-[0.08em] mb-[20px]">
              Welcome to Bhavin Academy
            </p>
            <h2 className="text-[clamp(32px,3.5vw,52px)] font-extrabold text-[#f5f5f7] leading-[1.05] tracking-[-1.5px] mb-[20px]">
              Begin your journey<br />of <em className="not-italic bg-gradient-to-r from-[#0071e3] to-[#00d4ff] bg-clip-text text-transparent">enhancement.</em>
            </h2>
            <p className="text-[15px] text-[#86868b] leading-[1.7] max-w-[380px] font-light mb-[48px]">
              You're the only person who can own your growth. Take the lead and invest in yourself today.
            </p>

            <div className="bg-white/5 border border-white/9 rounded-[14px] p-[20px_22px] max-w-[400px] backdrop-blur-[8px]">
              <p className="text-[14px] text-[#d1d1d6] leading-[1.6] font-light">
                "Every expert was once a beginner. Every pro was once an amateur. Log in, keep going, your next milestone is one session away."
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT — form panel */}
        <div className="bg-[#0a0a0a] flex flex-col items-center justify-center p-[64px_56px]">
          <div className="w-full max-w-[400px] text-left">
            <h1 className="text-[28px] font-bold tracking-[-0.8px] text-[#f5f5f7] mb-[6px]">
              {activeTab === "signin" ? "Sign in to Bhavin Academy" : "Create an Account"}
            </h1>
            
            {activeTab === "signup" && (
              <p className="text-[14px] text-[#6e6e73] mb-[18px] font-light">
                Register your parameters to begin.
              </p>
            )}

            {/* Divider */}
            <div className="flex items-center gap-[12px] mb-[28px] mt-[12px]">
              <div className="flex-1 h-[1px] bg-white/8" />
              <span className="text-[12px] text-[#6e6e73] uppercase tracking-wider whitespace-nowrap">
                {activeTab === "signin" ? "sign in with email" : "register with email"}
              </span>
              <div className="flex-1 h-[1px] bg-white/8" />
            </div>

            {/* Form */}
            {activeTab === "signin" ? (
              <form onSubmit={handleLoginUser} className="space-y-[16px]">
                <div className="flex flex-col">
                  <label className="text-[13px] font-medium text-[#d1d1d6] mb-[6px]">Email address</label>
                  <input 
                    type="email" 
                    placeholder="you@example.com" 
                    required
                    value={signInFormData.userEmail}
                    onChange={(e) => setSignInFormData({ ...signInFormData, userEmail: e.target.value })}
                    className="w-full px-[14px] py-[12px] border border-white/10 rounded-[10px] text-[15px] text-[#f5f5f7] bg-white/5 outline-none focus:border-[#0071e3] focus:shadow-[0_0_0_3px_rgba(0,113,227,0.18)] focus:bg-[#0071e3]/4 transition-all"
                  />
                </div>
                <div className="flex flex-col">
                  <label className="text-[13px] font-medium text-[#d1d1d6] mb-[6px]">Password</label>
                  <input 
                    type="password" 
                    placeholder="••••••••" 
                    required
                    value={signInFormData.password}
                    onChange={(e) => setSignInFormData({ ...signInFormData, password: e.target.value })}
                    className="w-full px-[14px] py-[12px] border border-white/10 rounded-[10px] text-[15px] text-[#f5f5f7] bg-white/5 outline-none focus:border-[#0071e3] focus:shadow-[0_0_0_3px_rgba(0,113,227,0.18)] focus:bg-[#0071e3]/4 transition-all mb-[4px]"
                  />
                  <button 
                    type="button" 
                    onClick={() => alert('Password reset link sent!')} 
                    className="text-[13px] text-[#0071e3] hover:underline bg-none border-none p-0 cursor-pointer self-start"
                  >
                    Forgot password?
                  </button>
                </div>
                
                <div className="pt-2">
                  {/* Social buttons under Password input and above Sign In button */}
                  <div className="flex gap-[10px] mb-[24px]">
                    <button 
                      type="button"
                      onClick={onGoogleSuccess}
                      className="flex-1 flex items-center justify-center gap-[8px] border border-white/10 rounded-[10px] py-[11px] px-[16px] text-[13px] font-medium text-[#f5f5f7] bg-white/4 cursor-pointer hover:border-[#0071e3] hover:bg-[#0071e3]/8 transition-all"
                    >
                      <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                      Continue with Google
                    </button>
                    <button 
                      type="button"
                      onClick={onMicrosoftLogin}
                      className="flex-1 flex items-center justify-center gap-[8px] border border-white/10 rounded-[10px] py-[11px] px-[16px] text-[13px] font-medium text-[#f5f5f7] bg-white/4 cursor-pointer hover:border-[#0071e3] hover:bg-[#0071e3]/8 transition-all"
                    >
                      <svg className="w-[18px] h-[18px]" viewBox="0 0 23 23"><rect x="1" y="1" width="10" height="10" fill="#f35325"/><rect x="12" y="1" width="10" height="10" fill="#81bc06"/><rect x="1" y="12" width="10" height="10" fill="#05a6f0"/><rect x="12" y="12" width="10" height="10" fill="#ffba08"/></svg>
                      Microsoft
                    </button>
                  </div>

                  <button 
                    type="submit" 
                    disabled={!checkIfSignInFormIsValid()}
                    className="w-full bg-[#0071e3] text-white py-[14px] rounded-[980px] text-[15px] font-semibold hover:bg-[#0077ed] active:scale-[0.99] transition-all disabled:opacity-50 border-none cursor-pointer"
                  >
                    Sign In
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleRegisterUser} className="space-y-[16px]">
                <div className="flex flex-col">
                  <label className="text-[13px] font-medium text-[#d1d1d6] mb-[6px]">User Name</label>
                  <input 
                    type="text" 
                    placeholder="Enter username" 
                    required
                    value={signUpFormData.userName}
                    onChange={(e) => setSignUpFormData({ ...signUpFormData, userName: e.target.value })}
                    className="w-full px-[14px] py-[12px] border border-white/10 rounded-[10px] text-[15px] text-[#f5f5f7] bg-white/5 outline-none focus:border-[#0071e3] focus:shadow-[0_0_0_3px_rgba(0,113,227,0.18)] focus:bg-[#0071e3]/4 transition-all"
                  />
                </div>
                <div className="flex flex-col">
                  <label className="text-[13px] font-medium text-[#d1d1d6] mb-[6px]">Full Name</label>
                  <input 
                    type="text" 
                    placeholder="Enter full name" 
                    required
                    value={signUpFormData.userFullName}
                    onChange={(e) => setSignUpFormData({ ...signUpFormData, userFullName: e.target.value })}
                    className="w-full px-[14px] py-[12px] border border-white/10 rounded-[10px] text-[15px] text-[#f5f5f7] bg-white/5 outline-none focus:border-[#0071e3] focus:shadow-[0_0_0_3px_rgba(0,113,227,0.18)] focus:bg-[#0071e3]/4 transition-all"
                  />
                </div>
                <div className="flex flex-col">
                  <label className="text-[13px] font-medium text-[#d1d1d6] mb-[6px]">Email address</label>
                  <input 
                    type="email" 
                    placeholder="you@example.com" 
                    required
                    value={signUpFormData.userEmail}
                    onChange={(e) => setSignUpFormData({ ...signUpFormData, userEmail: e.target.value })}
                    className="w-full px-[14px] py-[12px] border border-white/10 rounded-[10px] text-[15px] text-[#f5f5f7] bg-white/5 outline-none focus:border-[#0071e3] focus:shadow-[0_0_0_3px_rgba(0,113,227,0.18)] focus:bg-[#0071e3]/4 transition-all"
                  />
                </div>
                <div className="flex flex-col">
                  <label className="text-[13px] font-medium text-[#d1d1d6] mb-[6px]">Password</label>
                  <input 
                    type="password" 
                    placeholder="••••••••" 
                    required
                    value={signUpFormData.password}
                    onChange={(e) => setSignUpFormData({ ...signUpFormData, password: e.target.value })}
                    className="w-full px-[14px] py-[12px] border border-white/10 rounded-[10px] text-[15px] text-[#f5f5f7] bg-white/5 outline-none focus:border-[#0071e3] focus:shadow-[0_0_0_3px_rgba(0,113,227,0.18)] focus:bg-[#0071e3]/4 transition-all"
                  />
                </div>

                <div className="pt-2">
                  <div className="flex gap-[10px] mb-[24px]">
                    <button 
                      type="button"
                      onClick={onGoogleSuccess}
                      className="flex-1 flex items-center justify-center gap-[8px] border border-white/10 rounded-[10px] py-[11px] px-[16px] text-[13px] font-medium text-[#f5f5f7] bg-white/4 cursor-pointer hover:border-[#0071e3] hover:bg-[#0071e3]/8 transition-all"
                    >
                      <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                      Continue with Google
                    </button>
                    <button 
                      type="button"
                      onClick={onMicrosoftLogin}
                      className="flex-1 flex items-center justify-center gap-[8px] border border-white/10 rounded-[10px] py-[11px] px-[16px] text-[13px] font-medium text-[#f5f5f7] bg-white/4 cursor-pointer hover:border-[#0071e3] hover:bg-[#0071e3]/8 transition-all"
                    >
                      <svg className="w-[18px] h-[18px]" viewBox="0 0 23 23"><rect x="1" y="1" width="10" height="10" fill="#f35325"/><rect x="12" y="1" width="10" height="10" fill="#81bc06"/><rect x="1" y="12" width="10" height="10" fill="#05a6f0"/><rect x="12" y="12" width="10" height="10" fill="#ffba08"/></svg>
                      Microsoft
                    </button>
                  </div>

                  <button 
                    type="submit" 
                    disabled={!checkIfSignUpFormIsValid()}
                    className="w-full bg-[#0071e3] text-white py-[14px] rounded-[980px] text-[15px] font-semibold hover:bg-[#0077ed] active:scale-[0.99] transition-all disabled:opacity-50 border-none cursor-pointer"
                  >
                    Get Started
                  </button>
                </div>
              </form>
            )}

            {/* Signup/Signin row */}
            <div className="text-center mt-[24px] text-[13px] text-[#6e6e73]">
              {activeTab === "signin" ? (
                <>New to BhavinAcademy? <button onClick={() => setActiveTab("signup")} className="text-[#0071e3] font-semibold hover:underline bg-none border-none p-0 cursor-pointer">Sign up</button></>
              ) : (
                <>Already have an account? <button onClick={() => setActiveTab("signin")} className="text-[#0071e3] font-semibold hover:underline bg-none border-none p-0 cursor-pointer">Sign in</button></>
              )}
            </div>

            {/* Trust Badges */}
            <div className="flex items-center justify-center gap-[20px] mt-[32px] pt-[24px] border-t border-white/7 opacity-30 select-none">
              <div className="flex items-center gap-[5px] text-[11px] text-[#86868b] font-light">
                <span>🔒</span> Secure SSL
              </div>
              <div className="flex items-center gap-[5px] text-[11px] text-[#86868b] font-light">
                <span>📋</span> GDPR Ready
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* FOOTER */}
      <footer className="bg-[#0a0a0a] border-t border-white/8 pt-[40px] pb-[24px] px-6 text-left">
        <div className="max-w-[1080px] mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-[32px] pb-[32px] border-b border-white/8 mb-[24px]">
            <div className="flex flex-col">
              <h4 className="text-[13px] font-semibold text-[#f5f5f7] mb-[12px]">Courses</h4>
              <ul className="list-none flex flex-col gap-[8px]">
                <li><Link to="/courses" className="text-[13px] text-[#6e6e73] hover:text-[#0071e3] transition-colors">Microsoft Courses</Link></li>
                <li><Link to="/courses" className="text-[13px] text-[#6e6e73] hover:text-[#0071e3] transition-colors">Linux Courses</Link></li>
                <li><Link to="/courses" className="text-[13px] text-[#6e6e73] hover:text-[#0071e3] transition-colors">Networking</Link></li>
                <li><Link to="/courses" className="text-[13px] text-[#6e6e73] hover:text-[#0071e3] transition-colors">Cloud & Azure</Link></li>
                <li><Link to="/courses" className="text-[13px] text-[#6e6e73] hover:text-[#0071e3] transition-colors">Cybersecurity</Link></li>
              </ul>
            </div>
            <div className="flex flex-col">
              <h4 className="text-[13px] font-semibold text-[#f5f5f7] mb-[12px]">Learning Paths</h4>
              <ul className="list-none flex flex-col gap-[8px]">
                <li><Link to="/courses" className="text-[13px] text-[#6e6e73] hover:text-[#0071e3] transition-colors">Microsoft Engineer</Link></li>
                <li><Link to="/courses" className="text-[13px] text-[#6e6e73] hover:text-[#0071e3] transition-colors">Linux Administrator</Link></li>
                <li><Link to="/courses" className="text-[13px] text-[#6e6e73] hover:text-[#0071e3] transition-colors">Network Engineer</Link></li>
                <li><Link to="/courses" className="text-[13px] text-[#6e6e73] hover:text-[#0071e3] transition-colors">Cloud Architect</Link></li>
              </ul>
            </div>
            <div className="flex flex-col">
              <h4 className="text-[13px] font-semibold text-[#f5f5f7] mb-[12px]">Platform</h4>
              <ul className="list-none flex flex-col gap-[8px]">
                <li><Link to="/courses" className="text-[13px] text-[#6e6e73] hover:text-[#0071e3] transition-colors">Virtual Labs</Link></li>
                <li><Link to="/courses" className="text-[13px] text-[#6e6e73] hover:text-[#0071e3] transition-colors">Practice Exams</Link></li>
                <li><Link to="/courses" className="text-[13px] text-[#6e6e73] hover:text-[#0071e3] transition-colors">Certifications</Link></li>
                <li><Link to="/courses" className="text-[13px] text-[#6e6e73] hover:text-[#0071e3] transition-colors">Community</Link></li>
              </ul>
            </div>
            <div className="flex flex-col">
              <h4 className="text-[13px] font-semibold text-[#f5f5f7] mb-[12px]">Company</h4>
              <ul className="list-none flex flex-col gap-[8px]">
                <li><Link to="/about" className="text-[13px] text-[#6e6e73] hover:text-[#0071e3] transition-colors">About Us</Link></li>
                <li><Link to="/blog" className="text-[13px] text-[#6e6e73] hover:text-[#0071e3] transition-colors">Blog</Link></li>
                <li><Link to="/contact" className="text-[13px] text-[#6e6e73] hover:text-[#0071e3] transition-colors">Contact</Link></li>
              </ul>
            </div>
          </div>
          <div className="flex justify-between items-center flex-wrap gap-4">
            <div className="text-[16px] font-bold text-[#f5f5f7]">
              Bhavin<span className="text-[#0071e3]">Academy</span>
            </div>
            <div className="text-[13px] text-[#6e6e73]">
              © 2026 Bhavin Academy. All rights reserved.
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}

export default AuthPage;
