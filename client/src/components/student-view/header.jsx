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
    { label: "Reviews", path: "/courses" },
    { label: "About Authority", path: "/about" },
    { label: "Blog", path: "/blog" },
    { label: "Contact Clinical", path: "/contact" },
  ];

  return (
    <>
      <header className="fixed top-0 w-full z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-sm dark:shadow-none border-b border-transparent">
        <div className="flex justify-between items-center px-6 py-4 max-w-7xl mx-auto w-full">
          {/* Logo / Branding */}
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
              className="md:hidden flex items-center justify-center text-primary"
            >
              <span className="material-symbols-outlined text-blue-700">menu</span>
            </button>
            <Link to="/" className="flex items-center gap-2 no-underline">
              <span className="material-symbols-outlined text-blue-700" style={{ fontVariationSettings: "'FILL' 1" }}>clinical_notes</span>
              <span className="text-xl font-extrabold text-blue-800 dark:text-white font-headline tracking-tight">Editorial Health</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex gap-8 items-center">
            {navLinks.map((link) => {
              const isActive = window.location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`${
                    isActive 
                      ? "text-blue-700 border-b-2 border-blue-700 font-semibold" 
                      : "text-slate-600 dark:text-slate-400 hover:text-blue-600 transition-colors font-semibold"
                  } font-headline text-sm no-underline pb-0.5`}
                >
                  {link.label}
                </Link>
              );
            })}
            {auth?.authenticate && (
              <Link 
                to="/dashboard" 
                className={`${
                  window.location.pathname === "/dashboard" 
                    ? "text-blue-700 border-b-2 border-blue-700 font-semibold" 
                    : "text-slate-600 dark:text-slate-400 hover:text-blue-600 transition-colors font-semibold"
                } font-headline text-sm no-underline pb-0.5`}
              >
                Dashboard
              </Link>
            )}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center gap-4">
            <span className="material-symbols-outlined text-slate-600 cursor-pointer" onClick={() => navigate("/courses")}>search</span>
            
            {auth?.authenticate ? (
              <div className="flex items-center gap-4">
                {/* Cart Icon */}
                <Link to="/cart" className="relative text-slate-600 hover:text-blue-600 transition-colors flex items-center">
                  <span className="material-symbols-outlined">shopping_cart</span>
                  {cartItems?.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-blue-700 text-white text-[10px] font-bold h-4 w-4 flex items-center justify-center rounded-full">
                      {cartItems.length}
                    </span>
                  )}
                </Link>
                
                {/* User Avatar */}
                <Link to="/profile" className="h-9 w-9 rounded-full overflow-hidden bg-surface-container-high border-2 border-primary-fixed flex items-center justify-center shrink-0">
                  {auth?.user?.profileImage ? (
                    <img src={auth.user.profileImage} alt={auth.user.userName} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-xs font-bold text-blue-800 uppercase">{auth.user.userName?.slice(0, 2)}</span>
                  )}
                </Link>

                {/* Logout Button */}
                <button onClick={handleLogout} className="text-slate-600 hover:text-blue-600 transition-colors flex items-center" title="Sign out">
                  <span className="material-symbols-outlined">logout</span>
                </button>
              </div>
            ) : (
              <button 
                onClick={() => navigate("/auth")} 
                className="cta-gradient text-on-primary px-5 py-2 rounded-xl text-sm font-semibold transition-transform active:scale-95 duration-150"
              >
                Subscribe
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black z-40 md:hidden"
            />
            {/* Drawer */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.25 }}
              className="fixed left-0 top-0 h-full w-64 bg-slate-50 dark:bg-slate-950 z-50 md:hidden flex flex-col pt-16 shadow-2xl"
            >
              <div className="p-6">
                {auth?.authenticate && (
                  <div className="flex items-center gap-3 mb-8 border-b border-slate-200/20 pb-6">
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-primary-fixed flex items-center justify-center shrink-0">
                      {auth?.user?.profileImage ? (
                        <img src={auth.user.profileImage} alt={auth.user.userName} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-sm font-bold text-blue-800 uppercase">{auth.user.userName?.slice(0, 2)}</span>
                      )}
                    </div>
                    <div>
                      <p className="font-manrope text-sm font-bold text-on-background">{auth.user.userName}</p>
                      <p className="text-[10px] text-secondary font-bold uppercase tracking-wider">Expert Reader</p>
                    </div>
                  </div>
                )}
                
                <nav className="flex flex-col gap-4">
                  {navLinks.map((link) => (
                    <Link
                      key={link.path}
                      to={link.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="font-headline text-base font-semibold text-slate-600 dark:text-slate-400 hover:text-blue-600 transition-colors no-underline py-1"
                    >
                      {link.label}
                    </Link>
                  ))}
                  {auth?.authenticate && (
                    <>
                      <Link
                        to="/dashboard"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="font-headline text-base font-semibold text-slate-600 dark:text-slate-400 hover:text-blue-600 transition-colors no-underline py-1"
                      >
                        Dashboard
                      </Link>
                      <Link
                        to="/profile"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="font-headline text-base font-semibold text-slate-600 dark:text-slate-400 hover:text-blue-600 transition-colors no-underline py-1"
                      >
                        Profile Settings
                      </Link>
                    </>
                  )}
                </nav>

                <div className="mt-8 pt-6 border-t border-slate-200/20 flex flex-col gap-4">
                  {auth?.authenticate ? (
                    <button 
                      onClick={() => { setIsMobileMenuOpen(false); handleLogout(); }} 
                      className="w-full py-3 bg-surface-container-high text-on-surface font-bold rounded-xl text-sm"
                    >
                      Sign Out
                    </button>
                  ) : (
                    <button 
                      onClick={() => { setIsMobileMenuOpen(false); navigate("/auth"); }} 
                      className="w-full py-3 cta-gradient text-white font-bold rounded-xl text-sm shadow-md"
                    >
                      Subscribe
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

export default StudentViewCommonHeader;

