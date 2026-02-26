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
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
      className="fixed top-0 w-full z-[1000] bg-white/95 backdrop-blur-xl border-b border-zinc-200/50 shadow-sm"
    >
      <div className="container mx-auto px-4 lg:px-8 h-20 flex items-center justify-between bg-white relative z-[1001]">
        <div className="flex items-center space-x-6">
          <Link to="/home" className="flex items-center group">
            <motion.div whileHover={{ rotate: 15 }} transition={{ type: "spring", stiffness: 300 }}>
              <GraduationCap className="h-8 w-8 mr-3 text-emerald-600 group-hover:text-emerald-500 transition-colors" />
            </motion.div>
            <span className="font-extrabold md:text-xl text-[16px] font-serif tracking-tight text-zinc-900 lowercase">
              Bhavin<span className="text-emerald-600">.</span>Academy
            </span>
          </Link>
          <div className="hidden md:flex items-center space-x-1">
            <Button
              variant="ghost"
              onClick={() => navigate("/courses")}
              className="text-[14px] font-bold text-zinc-600 hover:text-black hover:bg-zinc-100/50 rounded-full px-4 uppercase tracking-wider"
            >
              Explore
            </Button>
            <Button
              variant="ghost"
              onClick={() => navigate("/about")}
              className="text-[14px] font-bold text-zinc-600 hover:text-black hover:bg-zinc-100/50 rounded-full px-4 uppercase tracking-wider"
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
                <span className="font-bold text-[14px] uppercase tracking-wider">My Mastery</span>
                <TvMinimalPlay className="w-5 h-5" />
              </motion.div>
            )}
            {auth?.authenticate ? (
              <Button onClick={handleLogout} variant="outline" className="rounded-xl border-zinc-200 hover:bg-zinc-50 font-bold px-6 text-xs uppercase tracking-widest">
                Sign Out
              </Button>
            ) : (
              <Button onClick={() => navigate("/auth")} className="rounded-xl bg-zinc-900 text-white hover:bg-zinc-800 font-bold px-6 shadow-md hover:shadow-lg transition-all text-xs uppercase tracking-widest">
                Sign In
              </Button>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-3 border border-zinc-200 rounded-xl bg-white hover:bg-zinc-50 text-zinc-900 transition-all active:scale-95 shadow-sm"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            variants={menuVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ type: "spring", damping: 30, stiffness: 200 }}
            className="fixed inset-0 top-[80px] bg-white !opacity-100 z-[999] md:hidden flex flex-col p-0 overflow-hidden shadow-2xl"
          >
            {/* Scrollable Content Container with guaranteed solid background */}
            <div className="flex-1 overflow-y-auto bg-white flex flex-col p-10 space-y-12">
              <nav className="flex flex-col space-y-10">
                <div className="space-y-6">
                  <span className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-600 mb-2 block">Menu</span>
                  <div className="flex flex-col space-y-2">
                    <button
                      onClick={() => {
                        navigate("/courses");
                        setIsMobileMenuOpen(false);
                      }}
                      className="text-left text-4xl font-black text-zinc-900 tracking-tighter hover:text-emerald-600 transition-colors py-2"
                    >
                      Explore.
                    </button>
                    <button
                      onClick={() => {
                        navigate("/about");
                        setIsMobileMenuOpen(false);
                      }}
                      className="text-left text-4xl font-black text-zinc-900 tracking-tighter hover:text-emerald-600 transition-colors py-2"
                    >
                      Academy.
                    </button>
                    {auth?.authenticate && (
                      <button
                        onClick={() => {
                          navigate("/student-courses");
                          setIsMobileMenuOpen(false);
                        }}
                        className="text-left text-4xl font-black text-zinc-900 tracking-tighter hover:text-emerald-600 transition-colors py-2"
                      >
                        Mastery.
                      </button>
                    )}
                  </div>
                </div>
              </nav>

              <div className="pt-12 border-t border-zinc-100 flex flex-col space-y-6">
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400 mb-2 block">Profile</span>
                {auth?.authenticate ? (
                  <Button
                    onClick={() => {
                      handleLogout();
                      setIsMobileMenuOpen(false);
                    }}
                    variant="outline"
                    className="w-full rounded-2xl h-16 font-black text-lg border-2 border-zinc-200 hover:bg-zinc-50 tracking-tight"
                  >
                    Sign Out.
                  </Button>
                ) : (
                  <Button
                    onClick={() => {
                      navigate("/auth");
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full rounded-2xl h-16 bg-zinc-900 text-white font-black text-lg shadow-2xl shadow-zinc-900/10 active:scale-[0.98] transition-all tracking-tight"
                  >
                    Sign In.
                  </Button>
                )}
              </div>
            </div>

            {/* Bottom Brand Bar */}
            <div className="p-8 bg-zinc-50 border-t border-zinc-100 flex items-center justify-between">
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">© 2026 Academy</span>
              <GraduationCap className="h-5 w-5 text-zinc-300" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

export default StudentViewCommonHeader;
