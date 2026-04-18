import { Route, Routes } from "react-router-dom";
import AuthPage from "./pages/auth";
import RouteGuard from "./components/route-guard";
import { useContext, useEffect } from "react";
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
import CategoryPage from "./pages/student/category";
import SubCategoryPage from "./pages/student/subcategory";
import ScrollToTop from "./components/scroll-to-top";
import { Toaster } from "./components/ui/toaster";
import PaymentReturnPage from "./pages/student/payment-return";
import BlogPage from "./pages/student/blog";
import PathsPage from "./pages/student/paths";
import ContactPage from "./pages/student/contact";
import StudentExamPage from "./pages/student/exam";
import StudentDashboardPage from "./pages/student/dashboard";
import SuccessPage from "./pages/student/success";
import BlogEditPage from "./pages/instructor/blog-edit";

function App() {
  const { auth } = useContext(AuthContext);

  // Block DevTools and inspect globally
  useEffect(() => {
    const handleContextMenu = (e) => {
      e.preventDefault();
      return false;
    };

    const handleKeyDown = (e) => {
      // Block F12
      if (e.keyCode === 123) {
        e.preventDefault();
        return false;
      }
      // Block Ctrl+Shift+I (Inspector)
      if (e.ctrlKey && e.shiftKey && e.keyCode === 73) {
        e.preventDefault();
        return false;
      }
      // Block Ctrl+Shift+J (Console)
      if (e.ctrlKey && e.shiftKey && e.keyCode === 74) {
        e.preventDefault();
        return false;
      }
      // Block Ctrl+Shift+C (Element picker)
      if (e.ctrlKey && e.shiftKey && e.keyCode === 67) {
        e.preventDefault();
        return false;
      }
      // Block Ctrl+U (View source)
      if (e.ctrlKey && e.keyCode === 85) {
        e.preventDefault();
        return false;
      }
      // Block Cmd+Option+I (Mac Inspector)
      if (e.metaKey && e.altKey && e.keyCode === 73) {
        e.preventDefault();
        return false;
      }
      // Block Cmd+Option+J (Mac Console)
      if (e.metaKey && e.altKey && e.keyCode === 74) {
        e.preventDefault();
        return false;
      }
      // Block Cmd+Option+C (Mac Element picker)
      if (e.metaKey && e.altKey && e.keyCode === 67) {
        e.preventDefault();
        return false;
      }
      // Block Cmd+Option+U (Mac View source)
      if (e.metaKey && e.altKey && e.keyCode === 85) {
        e.preventDefault();
        return false;
      }
    };

    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

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
          path="/instructor/blog-edit"
          element={
            <RouteGuard
              element={<BlogEditPage />}
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
          <Route path="category/:id" element={<CategoryPage />} />
          <Route path="subcategory/:id" element={<SubCategoryPage />} />
          <Route path="about" element={<AboutUsPage />} />
          <Route path="blog" element={<BlogPage />} />
          <Route path="paths" element={<PathsPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="success" element={<SuccessPage />} />
          <Route
            path="course/details/:id"
            element={<StudentViewCourseDetailsPage />}
          />
          <Route
            path="dashboard"
            element={
              <RouteGuard
                element={<StudentDashboardPage />}
                authenticated={auth?.authenticate}
                user={auth?.user}
              />
            }
          />
          <Route
            path="exams"
            element={
              <RouteGuard
                element={<StudentExamPage />}
                authenticated={auth?.authenticate}
                user={auth?.user}
              />
            }
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
          <Route
            path="payment-return"
            element={
              <RouteGuard
                element={<PaymentReturnPage />}
                authenticated={auth?.authenticate}
                user={auth?.user}
              />
            }
          />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <Toaster />
    </>
  );
}

export default App;
