import { GraduationCap, TvMinimalPlay } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { useContext } from "react";
import { AuthContext } from "@/context/auth-context";
import { motion } from "framer-motion";

function StudentViewCommonHeader() {
  const navigate = useNavigate();
  const { auth, resetCredentials } = useContext(AuthContext);

  function handleLogout() {
    resetCredentials();
    sessionStorage.clear();
  }

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
      className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-lg border-b border-zinc-200/50 shadow-sm"
    >
      <div className="container mx-auto px-4 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <Link to="/home" className="flex items-center group">
            <motion.div whileHover={{ rotate: 15 }} transition={{ type: "spring", stiffness: 300 }}>
              <GraduationCap className="h-8 w-8 mr-3 text-zinc-900 group-hover:text-blue-600 transition-colors" />
            </motion.div>
            <span className="font-extrabold md:text-xl text-[14px] font-serif tracking-tight text-zinc-900">
              Bhavin Academy
            </span>
          </Link>
          <div className="hidden md:flex items-center space-x-1">
            <Button
              variant="ghost"
              onClick={() => {
                location.pathname.includes("/courses")
                  ? null
                  : navigate("/courses");
              }}
              className="text-[14px] font-medium text-zinc-600 hover:text-black hover:bg-zinc-100/50 rounded-full px-4"
            >
              Explore Courses
            </Button>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex gap-4 items-center">
            {auth?.authenticate && (
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/student-courses")}
                className="flex cursor-pointer items-center gap-2 text-zinc-600 hover:text-zinc-900 transition-colors"
              >
                <span className="font-bold text-[14px]">
                  My Courses
                </span>
                <TvMinimalPlay className="w-5 h-5" />
              </motion.div>
            )}
            {auth?.authenticate ? (
              <Button onClick={handleLogout} variant="outline" className="rounded-full border-zinc-300 hover:bg-zinc-100 font-semibold px-6">
                Sign Out
              </Button>
            ) : (
              <Button onClick={() => navigate("/auth")} className="rounded-full bg-zinc-900 text-white hover:bg-zinc-800 font-semibold px-6 shadow-md hover:shadow-lg transition-all">
                Sign In
              </Button>
            )}
          </div>
        </div>
      </div>
    </motion.header>
  );
}

export default StudentViewCommonHeader;
