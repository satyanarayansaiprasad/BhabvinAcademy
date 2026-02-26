import { GraduationCap, TvMinimalPlay, Menu, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { useContext, useState } from "react";
import { AuthContext } from "@/context/auth-context";
import { motion, AnimatePresence } from "framer-motion";

function StudentViewCommonHeader() {
  const navigate = useNavigate();
  const { auth, resetCredentials } = useContext(AuthContext);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  function handleLogout() {
    resetCredentials();
    sessionStorage.clear();
  }

  const menuVariants = {
    initial: { x: "100%" },
    animate: { x: 0 },
    exit: { x: "100%" },
  };

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className="fixed top-0 w-full z-[1000] bg-white border-b border-zinc-200/50 shadow-sm"
      >
        <div className="container mx-auto px-4 lg:px-8 h-20 flex items-center justify-between bg-white relative">
          <div className="flex items-center space-x-6">
            <Link to="/home" className="flex items-center group">
              <motion.div whileHover={{ rotate: 15 }} transition={{ type: "spring", stiffness: 300 }}>
                <GraduationCap className="h-8 w-8 mr-3 text-emerald-600 group-hover:text-emerald-500 transition-colors" />
              </motion.div>
              <span className="font-extrabold md:text-xl text-[18px] font-serif tracking-tight text-zinc-900">
                Bhavin Academy
              </span>
            </Link>
            <div className="hidden md:flex items-center space-x-1">
              <Button
                variant="ghost"
                onClick={() => navigate("/courses")}
                className="text-[14px] font-bold text-zinc-600 hover:text-black hover:bg-zinc-100/50 rounded-full px-4"
              >
                Explore Courses
              </Button>
              <Button
                variant="ghost"
                onClick={() => navigate("/about")}
                className="text-[14px] font-bold text-zinc-600 hover:text-black hover:bg-zinc-100/50 rounded-full px-4"
              >
                About Us
              </Button>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="hidden md:flex gap-4 items-center">
              {auth?.authenticate && (
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate("/student-courses")}
                  className="flex cursor-pointer items-center gap-2 text-zinc-600 hover:text-zinc-900 transition-colors"
                >
                  <span className="font-bold text-[14px]">My Courses</span>
                  <TvMinimalPlay className="w-5 h-5" />
                </motion.div>
              )}
              {auth?.authenticate ? (
                <Button onClick={handleLogout} variant="outline" className="rounded-xl border-zinc-200 hover:bg-zinc-50 font-bold px-6">
                  Sign Out
                </Button>
              ) : (
                <Button onClick={() => navigate("/auth")} className="rounded-xl bg-zinc-900 text-white hover:bg-zinc-800 font-bold px-6 shadow-md hover:shadow-lg transition-all">
                  Sign In
                </Button>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden p-3 border border-zinc-200 rounded-xl bg-white hover:bg-zinc-50 text-zinc-900 transition-all active:scale-95 shadow-sm"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu Drawer - Full Screen Overlay with Internal Header */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed inset-0 bg-white z-[5000] md:hidden flex flex-col"
          >
            {/* Mobile Drawer Header */}
            <div className="flex items-center justify-between px-6 h-20 border-b border-zinc-100 shrink-0">
              <div className="flex items-center">
                <GraduationCap className="h-8 w-8 mr-3 text-emerald-600" />
                <span className="font-extrabold text-[18px] font-serif tracking-tight text-zinc-900">
                  Bhavin Academy
                </span>
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-3 border border-zinc-200 rounded-xl bg-zinc-50 text-zinc-900 transition-all active:scale-95"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Mobile Drawer Content */}
            <div className="flex-1 overflow-y-auto p-8 flex flex-col space-y-12">
              <nav className="flex flex-col space-y-6">
                <button
                  onClick={() => {
                    navigate("/home");
                    setIsMobileMenuOpen(false);
                  }}
                  className="text-left text-2xl font-black text-zinc-900 tracking-tight hover:text-emerald-600 transition-colors"
                >
                  Home
                </button>
                <button
                  onClick={() => {
                    navigate("/courses");
                    setIsMobileMenuOpen(false);
                  }}
                  className="text-left text-2xl font-black text-zinc-900 tracking-tight hover:text-emerald-600 transition-colors"
                >
                  Explore Courses
                </button>
                <button
                  onClick={() => {
                    navigate("/about");
                    setIsMobileMenuOpen(false);
                  }}
                  className="text-left text-2xl font-black text-zinc-900 tracking-tight hover:text-emerald-600 transition-colors"
                >
                  About Us
                </button>
                {auth?.authenticate && (
                  <button
                    onClick={() => {
                      navigate("/student-courses");
                      setIsMobileMenuOpen(false);
                    }}
                    className="text-left text-2xl font-black text-zinc-900 tracking-tight hover:text-emerald-600 transition-colors"
                  >
                    My Courses
                  </button>
                )}
              </nav>

              <div className="pt-10 border-t border-zinc-100 mt-auto">
                {auth?.authenticate ? (
                  <Button
                    onClick={() => {
                      handleLogout();
                      setIsMobileMenuOpen(false);
                    }}
                    variant="outline"
                    className="w-full rounded-2xl h-16 font-black text-lg border-2 border-zinc-200 hover:bg-zinc-50"
                  >
                    Sign Out
                  </Button>
                ) : (
                  <Button
                    onClick={() => {
                      navigate("/auth");
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full rounded-2xl h-16 bg-zinc-900 text-white font-black text-lg shadow-2xl shadow-zinc-900/10 active:scale-[0.98] transition-all"
                  >
                    Sign In
                  </Button>
                )}
              </div>
            </div>

            {/* Mobile Drawer Footer */}
            <div className="p-8 bg-zinc-50 border-t border-zinc-100 flex items-center justify-between shrink-0">
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest italic">bhavin.academy</span>
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-zinc-200" />
                <div className="w-8 h-8 rounded-full bg-zinc-200" />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default StudentViewCommonHeader;
