import { Route, Routes } from "react-router-dom";
import { useContext, useEffect, Suspense, lazy } from "react";
import { AuthContext } from "./context/auth-context";
import RouteGuard from "./components/route-guard";
import ScrollToTop from "./components/scroll-to-top";
import { Toaster } from "./components/ui/toaster";

const AuthPage = lazy(() => import("./pages/auth"));
const InstructorDashboardpage = lazy(() => import("./pages/instructor"));
const StudentViewCommonLayout = lazy(() => import("./components/student-view/common-layout"));
const StudentHomePage = lazy(() => import("./pages/student/home"));
const NotFoundPage = lazy(() => import("./pages/not-found"));
const AddNewCoursePage = lazy(() => import("./pages/instructor/add-new-course"));
const StudentViewCoursesPage = lazy(() => import("./pages/student/courses"));
const StudentViewCourseDetailsPage = lazy(() => import("./pages/student/course-details"));
const StudentCoursesPage = lazy(() => import("./pages/student/student-courses"));
const StudentViewCourseProgressPage = lazy(() => import("./pages/student/course-progress"));
const AboutUsPage = lazy(() => import("./pages/student/about"));
const CartPage = lazy(() => import("./pages/student/cart"));
const CheckoutPage = lazy(() => import("./pages/student/checkout"));
const StudentProfilePage = lazy(() => import("./pages/student/profile"));
const PrivacyPolicyPage = lazy(() => import("./pages/student/privacy"));
const TermsPage = lazy(() => import("./pages/student/terms"));
const CategoryPage = lazy(() => import("./pages/student/category"));
const SubCategoryPage = lazy(() => import("./pages/student/subcategory"));
const PaymentReturnPage = lazy(() => import("./pages/student/payment-return"));
const BlogPage = lazy(() => import("./pages/student/blog"));
const ContactPage = lazy(() => import("./pages/student/contact"));
const StudentExamPage = lazy(() => import("./pages/student/exam"));
const StudentDashboardPage = lazy(() => import("./pages/student/dashboard"));
const SuccessPage = lazy(() => import("./pages/student/success"));
const BlogEditPage = lazy(() => import("./pages/instructor/blog-edit"));

function App() {
  const { auth, isLoading } = useContext(AuthContext);

  useEffect(() => {
    const handleContextMenu = (e) => { e.preventDefault(); return false; };
    const handleKeyDown = (e) => {
      if (e.keyCode === 123 || 
         (e.ctrlKey && e.shiftKey && (e.keyCode === 73 || e.keyCode === 74 || e.keyCode === 67)) ||
         (e.ctrlKey && e.keyCode === 85) ||
         (e.metaKey && e.altKey && (e.keyCode === 73 || e.keyCode === 74 || e.keyCode === 67 || e.keyCode === 85))) {
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
      <Suspense fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      }>
        <Routes>
          <Route path="/auth" element={
              <RouteGuard element={<AuthPage />} authenticated={auth?.authenticate} user={auth?.user} isLoading={isLoading} />
            }
          />
          <Route path="/instructor" element={
              <RouteGuard element={<InstructorDashboardpage />} authenticated={auth?.authenticate} user={auth?.user} isLoading={isLoading} />
            }
          />
          <Route path="/instructor/create-new-course" element={
              <RouteGuard element={<AddNewCoursePage />} authenticated={auth?.authenticate} user={auth?.user} isLoading={isLoading} />
            }
          />
          <Route path="/instructor/edit-course/:courseId" element={
              <RouteGuard element={<AddNewCoursePage />} authenticated={auth?.authenticate} user={auth?.user} isLoading={isLoading} />
            }
          />
          <Route path="/instructor/blog-edit" element={
              <RouteGuard element={<BlogEditPage />} authenticated={auth?.authenticate} user={auth?.user} isLoading={isLoading} />
            }
          />
          <Route path="/" element={<StudentViewCommonLayout />}>
            <Route path="" element={<StudentHomePage />} />
            <Route path="home" element={<StudentHomePage />} />
            <Route path="courses" element={<StudentViewCoursesPage />} />
            <Route path="category/:id" element={<CategoryPage />} />
            <Route path="subcategory/:id" element={<SubCategoryPage />} />
            <Route path="about" element={<AboutUsPage />} />
            <Route path="blog" element={<BlogPage />} />
            <Route path="contact" element={<ContactPage />} />
            <Route path="success" element={<SuccessPage />} />
            <Route path="course/details/:id" element={<StudentViewCourseDetailsPage />} />
            <Route path="dashboard" element={
                <RouteGuard element={<StudentDashboardPage />} authenticated={auth?.authenticate} user={auth?.user} isLoading={isLoading} />
              }
            />
            <Route path="exams" element={
                <RouteGuard element={<StudentExamPage />} authenticated={auth?.authenticate} user={auth?.user} isLoading={isLoading} />
              }
            />
            <Route path="checkout" element={
                <RouteGuard element={<CheckoutPage />} authenticated={auth?.authenticate} user={auth?.user} isLoading={isLoading} />
              }
            />
            <Route path="student-courses" element={
                <RouteGuard element={<StudentCoursesPage />} authenticated={auth?.authenticate} user={auth?.user} isLoading={isLoading} />
              }
            />
            <Route path="course-progress/:id" element={
                <RouteGuard element={<StudentViewCourseProgressPage />} authenticated={auth?.authenticate} user={auth?.user} isLoading={isLoading} />
              }
            />
            <Route path="cart" element={
                <RouteGuard element={<CartPage />} authenticated={auth?.authenticate} user={auth?.user} isLoading={isLoading} />
              }
            />
            <Route path="profile" element={
                <RouteGuard element={<StudentProfilePage />} authenticated={auth?.authenticate} user={auth?.user} isLoading={isLoading} />
              }
            />
            <Route path="privacy" element={<PrivacyPolicyPage />} />
            <Route path="terms" element={<TermsPage />} />
            <Route path="payment-return" element={
                <RouteGuard element={<PaymentReturnPage />} authenticated={auth?.authenticate} user={auth?.user} isLoading={isLoading} />
              }
            />
          </Route>
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
      <Toaster />
    </>
  );
}

export default App;
