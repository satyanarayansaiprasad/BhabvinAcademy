import { Route, Routes } from "react-router-dom";
import AuthPage from "./pages/auth";
import RouteGuard from "./components/route-guard";
import { useContext } from "react";
import { AuthContext } from "./context/auth-context";
import InstructorDashboardpage from "./pages/instructor";
import StudentViewCommonLayout from "./components/student-view/common-layout";
import StudentHomePage from "./pages/student/home";
import NotFoundPage from "./pages/not-found";
import AddNewCoursePage from "./pages/instructor/add-new-course";
import StudentViewCoursesPage from "./pages/student/courses";
import StudentViewCourseDetailsPage from "./pages/student/course-details";
import StudentCoursesPage from "./pages/student/student-courses";
import StudentViewCourseProgressPage from "./pages/student/course-progress";
import AboutUsPage from "./pages/student/about";
import CartPage from "./pages/student/cart";
import CheckoutPage from "./pages/student/checkout";
import StudentProfilePage from "./pages/student/profile";
import PrivacyPolicyPage from "./pages/student/privacy";
import TermsPage from "./pages/student/terms";
import ScrollToTop from "./components/scroll-to-top";
import { Toaster } from "./components/ui/toaster";

function App() {
  const { auth } = useContext(AuthContext);

  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route
          path="/auth"
          element={
            <RouteGuard
              element={<AuthPage />}
              authenticated={auth?.authenticate}
              user={auth?.user}
            />
          }
        />
        <Route
          path="/instructor"
          element={
            <RouteGuard
              element={<InstructorDashboardpage />}
              authenticated={auth?.authenticate}
              user={auth?.user}
            />
          }
        />
        <Route
          path="/instructor/create-new-course"
          element={
            <RouteGuard
              element={<AddNewCoursePage />}
              authenticated={auth?.authenticate}
              user={auth?.user}
            />
          }
        />
        <Route
          path="/instructor/edit-course/:courseId"
          element={
            <RouteGuard
              element={<AddNewCoursePage />}
              authenticated={auth?.authenticate}
              user={auth?.user}
            />
          }
        />
        <Route
          path="/"
          element={
            <StudentViewCommonLayout />
          }
        >
          <Route path="" element={<StudentHomePage />} />
          <Route path="home" element={<StudentHomePage />} />
          <Route path="courses" element={<StudentViewCoursesPage />} />
          <Route path="about" element={<AboutUsPage />} />
          <Route
            path="course/details/:id"
            element={<StudentViewCourseDetailsPage />}
          />
          <Route
            path="checkout"
            element={
              <RouteGuard
                element={<CheckoutPage />}
                authenticated={auth?.authenticate}
                user={auth?.user}
              />
            }
          />
          <Route
            path="student-courses"
            element={
              <RouteGuard
                element={<StudentCoursesPage />}
                authenticated={auth?.authenticate}
                user={auth?.user}
              />
            }
          />
          <Route
            path="course-progress/:id"
            element={
              <RouteGuard
                element={<StudentViewCourseProgressPage />}
                authenticated={auth?.authenticate}
                user={auth?.user}
              />
            }
          />
          <Route
            path="cart"
            element={
              <RouteGuard
                element={<CartPage />}
                authenticated={auth?.authenticate}
                user={auth?.user}
              />
            }
          />
          <Route
            path="profile"
            element={
              <RouteGuard
                element={<StudentProfilePage />}
                authenticated={auth?.authenticate}
                user={auth?.user}
              />
            }
          />
          <Route path="privacy" element={<PrivacyPolicyPage />} />
          <Route path="terms" element={<TermsPage />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <Toaster />
    </>
  );
}

export default App;
