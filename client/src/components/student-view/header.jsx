import { TvMinimalPlay, Menu, X, ShoppingCart, User, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
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
    navigate("/auth");
  }

  const navLinks = [
    { label: "Home", path: "/home" },
    { label: "Courses", path: "/courses" },
    { label: "Paths", path: "/paths" },
    { label: "Instructors", path: "/instructors" },
    { label: "Blog", path: "/blog" },
    { label: "About", path: "/about" },
    { label: "Contact", path: "/contact" },
  ];

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-[1000] glass border-b border-[rgba(0,0,0,0.08)] h-[52px] flex items-center justify-center px-6">
        <div className="max-w-[1080px] w-full flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="text-[18px] font-bold tracking-[-0.5px] text-[#1d1d1f] hover:opacity-80 transition-opacity">
            Bhavin<span className="text-[#0071e3]">Academy</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-[20px]">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="text-[13px] text-[#1d1d1f] opacity-70 hover:opacity-100 transition-opacity font-normal no-underline"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            {auth?.authenticate ? (
              <div className="flex items-center gap-4">
                <Link to="/cart" className="relative opacity-70 hover:opacity-100 transition-opacity">
                  <ShoppingCart className="w-[18px] h-[18px]" />
                  {cartItems?.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-[#0071e3] text-white text-[10px] font-bold h-4 w-4 flex items-center justify-center rounded-full">
                      {cartItems.length}
                    </span>
                  )}
                </Link>
                <div className="h-4 w-[1px] bg-black/10 mx-1 hidden sm:block"></div>
                
                {/* User Menu Trigger (Simple for now) */}
                <div className="flex items-center gap-3">
                  <Link to="/profile" className="flex items-center gap-2 text-[13px] font-medium text-[#1d1d1f] opacity-70 hover:opacity-100 transition-opacity">
                    {auth?.user?.profileImage ? (
                      <img src={auth.user.profileImage} className="w-6 h-6 rounded-full object-cover" />
                    ) : (
                      <User className="w-[18px] h-[18px]" />
                    )}
                    <span className="hidden sm:inline">Account</span>
                  </Link>
                  <button onClick={handleLogout} className="opacity-70 hover:opacity-100 transition-opacity">
                    <LogOut className="w-[18px] h-[18px]" />
                  </button>
                </div>
              </div>
            ) : (
              <Link to="/auth" className="btn btn-blue py-[7px] px-[16px] text-[13px]">
                Sign in
              </Link>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-1 text-[#1d1d1f] opacity-70"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed inset-0 top-[52px] bg-white z-[999] md:hidden p-6 flex flex-col"
          >
            <nav className="flex flex-col gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-[20px] font-semibold text-[#1d1d1f] border-b border-black/5 pb-2"
                >
                  {link.label}
                </Link>
              ))}
              {auth?.authenticate && (
                <>
                  <Link
                    to="/student-courses"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-[20px] font-semibold text-[#1d1d1f] border-b border-black/5 pb-2"
                  >
                    My Learning
                  </Link>
                  <Link
                    to="/profile"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-[20px] font-semibold text-[#1d1d1f] border-b border-black/5 pb-2"
                  >
                    Profile Settings
                  </Link>
                </>
              )}
            </nav>
            
            <div className="mt-auto pt-6 flex flex-col gap-4">
              {!auth?.authenticate && (
                <Link to="/auth" onClick={() => setIsMobileMenuOpen(false)} className="btn btn-blue w-full h-[50px] text-[16px]">
                  Sign in
                </Link>
              )}
              {auth?.authenticate && (
                <button onClick={handleLogout} className="btn btn-outline w-full h-[50px] text-[16px]">
                  Log out
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default StudentViewCommonHeader;

