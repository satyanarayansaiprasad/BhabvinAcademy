import { GraduationCap, TvMinimalPlay, Menu, X, ShoppingCart, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/context/auth-context";
import { StudentContext } from "@/context/student-context";
import { motion, AnimatePresence } from "framer-motion";

function StudentViewCommonHeader() {
  const navigate = useNavigate();
  const { auth, resetCredentials } = useContext(AuthContext);
  const { cartItems, fetchCartItems, fetchBoughtCourses } = useContext(StudentContext);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (auth?.authenticate && auth?.user?._id) {
      fetchCartItems(auth?.user?._id);
      fetchBoughtCourses(auth?.user?._id);
    }
  }, [auth]);

  function handleLogout() {
    resetCredentials();
    sessionStorage.clear();
  }

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className="fixed top-0 w-full z-[1000] bg-white border-b border-zinc-200/50 shadow-sm"
      >
        <div className="container mx-auto px-3 xs:px-4 lg:px-8 h-14 xs:h-16 md:h-20 flex items-center justify-between bg-white relative">
          {/* Logo */}
          <div className="flex items-center space-x-2 xs:space-x-6">
            <Link to="/home" className="flex items-center group">
              <motion.div whileHover={{ rotate: 15 }} transition={{ type: "spring", stiffness: 300 }}>
                <GraduationCap className="h-6 w-6 xs:h-7 xs:w-7 md:h-8 md:w-8 mr-1.5 xs:mr-2 md:mr-3 text-emerald-600 group-hover:text-emerald-500 transition-colors" />
              </motion.div>
              <span className="font-extrabold text-sm xs:text-base md:text-xl font-serif tracking-tight text-zinc-900">
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

          {/* Right Actions */}
          <div className="flex items-center space-x-2 xs:space-x-3 md:space-x-4">
            <div className="hidden md:flex gap-4 items-center">
              {auth?.authenticate && (
                <>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate("/profile")}
                    className="flex cursor-pointer items-center gap-2 text-zinc-600 hover:text-zinc-900 transition-colors"
                  >
                    <span className="font-bold text-[14px]">Profile</span>
                    {auth?.user?.profileImage ? (
                      <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-zinc-100">
                        <img src={auth.user.profileImage} alt="Profile" className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <User className="w-5 h-5" />
                    )}
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate("/student-courses")}
                    className="flex cursor-pointer items-center gap-2 text-zinc-600 hover:text-zinc-900 transition-colors"
                  >
                    <span className="font-bold text-[14px]">My Learning</span>
                    <TvMinimalPlay className="w-5 h-5" />
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate("/cart")}
                    className="flex cursor-pointer items-center gap-2 text-zinc-600 hover:text-zinc-900 transition-colors relative"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    {cartItems?.length > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold h-4 w-4 flex items-center justify-center rounded-full">
                        {cartItems.length}
                      </span>
                    )}
                  </motion.div>
                </>
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

            {/* Cart icon on small screens when authenticated */}
            {auth?.authenticate && (
              <button
                onClick={() => navigate("/cart")}
                className="md:hidden relative p-2 text-zinc-600 min-w-[44px] min-h-[44px] flex items-center justify-center"
              >
                <ShoppingCart className="w-5 h-5" />
                {cartItems?.length > 0 && (
                  <span className="absolute top-1 right-1 bg-red-500 text-white text-[9px] font-bold h-3.5 w-3.5 flex items-center justify-center rounded-full">
                    {cartItems.length}
                  </span>
                )}
              </button>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden p-2.5 border border-zinc-200 rounded-xl bg-white hover:bg-zinc-50 text-zinc-900 transition-all active:scale-95 shadow-sm min-w-[44px] min-h-[44px] flex items-center justify-center"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu Drawer */}
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
            <div className="flex items-center justify-between px-4 xs:px-6 h-14 xs:h-16 border-b border-zinc-100 shrink-0">
              <div className="flex items-center">
                <GraduationCap className="h-6 w-6 xs:h-7 xs:w-7 mr-2 xs:mr-3 text-emerald-600" />
                <span className="font-extrabold text-sm xs:text-base font-serif tracking-tight text-zinc-900">
                  Bhavin Academy
                </span>
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2.5 border border-zinc-200 rounded-xl bg-zinc-50 text-zinc-900 transition-all active:scale-95 min-w-[44px] min-h-[44px] flex items-center justify-center"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile Drawer Content */}
            <div className="flex-1 overflow-y-auto p-6 xs:p-8 flex flex-col space-y-8 xs:space-y-12">
              <nav className="flex flex-col space-y-4 xs:space-y-6">
                {[
                  { label: "Home", path: "/home" },
                  { label: "Explore Courses", path: "/courses" },
                  { label: "About Us", path: "/about" },
                ].map(({ label, path }) => (
                  <button
                    key={path}
                    onClick={() => { navigate(path); setIsMobileMenuOpen(false); }}
                    className="text-left text-xl xs:text-2xl font-black text-zinc-900 tracking-tight hover:text-emerald-600 transition-colors min-h-[44px] flex items-center"
                  >
                    {label}
                  </button>
                ))}
                {auth?.authenticate && (
                  <>
                    <button
                      onClick={() => { navigate("/profile"); setIsMobileMenuOpen(false); }}
                      className="text-left text-xl xs:text-2xl font-black text-zinc-900 tracking-tight hover:text-emerald-600 transition-colors min-h-[44px] flex items-center"
                    >
                      Profile
                    </button>
                    <button
                      onClick={() => { navigate("/student-courses"); setIsMobileMenuOpen(false); }}
                      className="text-left text-xl xs:text-2xl font-black text-zinc-900 tracking-tight hover:text-emerald-600 transition-colors min-h-[44px] flex items-center"
                    >
                      My Courses
                    </button>
                    <button
                      onClick={() => { navigate("/cart"); setIsMobileMenuOpen(false); }}
                      className="text-left text-xl xs:text-2xl font-black text-zinc-900 tracking-tight hover:text-emerald-600 transition-colors min-h-[44px] flex items-center gap-3"
                    >
                      Cart
                      {cartItems?.length > 0 && (
                        <span className="bg-red-500 text-white text-xs font-bold h-5 w-5 flex items-center justify-center rounded-full">
                          {cartItems.length}
                        </span>
                      )}
                    </button>
                  </>
                )}
              </nav>

              <div className="pt-6 xs:pt-10 border-t border-zinc-100 mt-auto">
                {auth?.authenticate ? (
                  <Button
                    onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }}
                    variant="outline"
                    className="w-full rounded-2xl h-14 xs:h-16 font-black text-base xs:text-lg border-2 border-zinc-200 hover:bg-zinc-50"
                  >
                    Sign Out
                  </Button>
                ) : (
                  <Button
                    onClick={() => { navigate("/auth"); setIsMobileMenuOpen(false); }}
                    className="w-full rounded-2xl h-14 xs:h-16 bg-zinc-900 text-white font-black text-base xs:text-lg shadow-2xl shadow-zinc-900/10 active:scale-[0.98] transition-all"
                  >
                    Sign In
                  </Button>
                )}
              </div>
            </div>

            {/* Mobile Drawer Footer */}
            <div className="p-4 xs:p-6 bg-zinc-50 border-t border-zinc-100 flex items-center justify-between shrink-0">
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest italic">bhavin.academy</span>
              <div className="flex gap-3">
                <div className="w-7 h-7 xs:w-8 xs:h-8 rounded-full bg-zinc-200" />
                <div className="w-7 h-7 xs:w-8 xs:h-8 rounded-full bg-zinc-200" />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default StudentViewCommonHeader;
