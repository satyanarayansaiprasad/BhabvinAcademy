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
      <header
        className="fixed top-0 w-full z-[1000] bg-white border-b border-[#e6e6e6] shadow-sm"
      >
        <div className="container mx-auto px-4 lg:px-6 h-12 xs:h-14 md:h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-8">
            <Link to="/home" className="flex items-center gap-2 text-[#000000] group">
              <div className="bg-[#0067b8] p-1 rounded-sm">
                <GraduationCap className="h-5 w-5 text-white" />
              </div>
              <span className="font-semibold text-lg tracking-tight">
                Bhavin Academy
              </span>
            </Link>
            <nav className="hidden md:flex items-center space-x-2">
              <Button
                variant="ghost"
                onClick={() => navigate("/courses")}
                className="text-sm font-normal text-[#616161] hover:text-black hover:bg-[#f2f2f2] rounded-sm px-3 h-8"
              >
                Courses
              </Button>
              <Button
                variant="ghost"
                onClick={() => navigate("/about")}
                className="text-sm font-normal text-[#616161] hover:text-black hover:bg-[#f2f2f2] rounded-sm px-3 h-8"
              >
                About
              </Button>
            </nav>
          </div>

          {/* Right Actions */}
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex gap-6 items-center">
              {auth?.authenticate && (
                <>
                  <div
                    onClick={() => navigate("/profile")}
                    className="flex cursor-pointer items-center gap-2 text-[#616161] hover:text-black transition-colors"
                  >
                    <span className="text-sm">Profile</span>
                    {auth?.user?.profileImage ? (
                      <div className="w-6 h-6 rounded-full overflow-hidden border border-[#e6e6e6]">
                        <img src={auth.user.profileImage} alt="Profile" className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <User className="w-4 h-4" />
                    )}
                  </div>
                  <div
                    onClick={() => navigate("/student-courses")}
                    className="flex cursor-pointer items-center gap-2 text-[#616161] hover:text-black transition-colors"
                  >
                    <span className="text-sm">My Learning</span>
                    <TvMinimalPlay className="w-4 h-4" />
                  </div>
                  <div
                    onClick={() => navigate("/cart")}
                    className="flex cursor-pointer items-center gap-2 text-[#616161] hover:text-black transition-colors relative"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    {cartItems?.length > 0 && (
                      <span className="absolute -top-1 -right-1 bg-[#0067b8] text-white text-[10px] font-bold h-3.5 w-3.5 flex items-center justify-center rounded-full leading-none">
                        {cartItems.length}
                      </span>
                    )}
                  </div>
                </>
              )}
              {auth?.authenticate ? (
                <Button onClick={handleLogout} variant="outline" className="rounded-sm border-[#e6e6e6] text-black hover:bg-[#f2f2f2] text-sm font-normal px-4 h-8 transition-none">
                  Sign out
                </Button>
              ) : (
                <Button onClick={() => navigate("/auth")} className="rounded-sm bg-[#0067b8] text-white hover:shadow-md transition-shadow text-sm font-semibold px-4 h-8">
                  Sign in
                </Button>
              )}
            </div>

            {/* Cart icon on small screens when authenticated */}
            {auth?.authenticate && (
              <button
                onClick={() => navigate("/cart")}
                className="md:hidden relative p-2 text-[#616161] min-w-[40px] min-h-[40px] flex items-center justify-center"
              >
                <ShoppingCart className="w-5 h-5" />
                {cartItems?.length > 0 && (
                  <span className="absolute top-1 right-1 bg-[#0067b8] text-white text-[9px] font-bold h-3.5 w-3.5 flex items-center justify-center rounded-full">
                    {cartItems.length}
                  </span>
                )}
              </button>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden p-2 border border-[#e6e6e6] rounded-sm bg-white hover:bg-[#f2f2f2] text-black transition-none min-w-[40px] min-h-[40px] flex items-center justify-center"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

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
            <div className="flex items-center justify-between px-4 h-14 border-b border-[#e6e6e6] shrink-0">
              <div className="flex items-center gap-2 text-[#000000]">
                <div className="bg-[#0067b8] p-1 rounded-sm">
                  <GraduationCap className="h-5 w-5 text-white" />
                </div>
                <span className="font-semibold text-lg tracking-tight">
                  Bhavin Academy
                </span>
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 border border-[#e6e6e6] rounded-sm bg-[#f2f2f2] text-black min-w-[40px] min-h-[40px] flex items-center justify-center"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile Drawer Content */}
            <div className="flex-1 overflow-y-auto p-6 flex flex-col space-y-6">
              <nav className="flex flex-col space-y-4">
                {[
                  { label: "Home", path: "/home" },
                  { label: "Courses", path: "/courses" },
                  { label: "About", path: "/about" },
                ].map(({ label, path }) => (
                  <button
                    key={path}
                    onClick={() => { navigate(path); setIsMobileMenuOpen(false); }}
                    className="text-left text-lg font-semibold text-black hover:text-[#0067b8] transition-colors h-10 flex items-center"
                  >
                    {label}
                  </button>
                ))}
                {auth?.authenticate && (
                  <>
                    <button
                      onClick={() => { navigate("/profile"); setIsMobileMenuOpen(false); }}
                      className="text-left text-lg font-semibold text-black hover:text-[#0067b8] transition-colors h-10 flex items-center"
                    >
                      Profile
                    </button>
                    <button
                      onClick={() => { navigate("/student-courses"); setIsMobileMenuOpen(false); }}
                      className="text-left text-lg font-semibold text-black hover:text-[#0067b8] transition-colors h-10 flex items-center"
                    >
                      My Courses
                    </button>
                    <button
                      onClick={() => { navigate("/cart"); setIsMobileMenuOpen(false); }}
                      className="text-left text-lg font-semibold text-black hover:text-[#0067b8] transition-colors h-10 flex items-center gap-3"
                    >
                      Cart
                      {cartItems?.length > 0 && (
                        <span className="bg-[#0067b8] text-white text-xs font-bold h-5 w-5 flex items-center justify-center rounded-full leading-none">
                          {cartItems.length}
                        </span>
                      )}
                    </button>
                  </>
                )}
              </nav>

              <div className="pt-6 border-t border-[#e6e6e6] mt-auto">
                {auth?.authenticate ? (
                  <Button
                    onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }}
                    variant="outline"
                    className="w-full rounded-sm h-12 font-semibold text-base border border-[#e6e6e6] hover:bg-[#f2f2f2] text-black"
                  >
                    Sign out
                  </Button>
                ) : (
                  <Button
                    onClick={() => { navigate("/auth"); setIsMobileMenuOpen(false); }}
                    className="w-full rounded-sm h-12 bg-[#0067b8] text-white font-semibold text-base shadow-md active:scale-[0.98] transition-all"
                  >
                    Sign in
                  </Button>
                )}
              </div>
            </div>

            {/* Mobile Drawer Footer */}
            <div className="p-4 bg-[#f2f2f2] border-t border-[#e6e6e6] flex items-center justify-between shrink-0">
              <span className="text-[10px] font-semibold text-[#616161] uppercase tracking-widest italic">bhavin.academy</span>
              <div className="flex gap-2">
                <div className="w-6 h-6 rounded-sm bg-[#e6e6e6]" />
                <div className="w-6 h-6 rounded-sm bg-[#e6e6e6]" />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default StudentViewCommonHeader;
