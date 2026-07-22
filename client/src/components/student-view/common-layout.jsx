import { Outlet, useLocation } from "react-router-dom";
import StudentViewCommonHeader from "./header";
import Footer from "./footer";

function StudentViewCommonLayout() {
  const location = useLocation();
  return (
    <div className={`min-h-screen flex flex-col ${!location.pathname.includes("course-progress") ? "pt-[52px]" : ""}`}>
      {!location.pathname.includes("course-progress") ? (
        <StudentViewCommonHeader />
      ) : null}

      <main className="flex-1">
        <Outlet />
      </main>

      {!location.pathname.includes("course-progress") ? (
        <Footer />
      ) : null}
    </div>
  );
}

export default StudentViewCommonLayout;
