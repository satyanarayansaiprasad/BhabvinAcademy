import { Navigate, useLocation } from "react-router-dom";
import { Fragment } from "react";
import { Skeleton } from "@/components/ui/skeleton";

function RouteGuard({ authenticated, user, element, isLoading }) {
  const location = useLocation();

  const publicPaths = ["/", "/home", "/courses", "/course/details"];
  const isPublicPath = publicPaths.some((path) => location.pathname === path || location.pathname.startsWith("/course/details/"));

  if (isLoading) {
    if (isPublicPath) {
      return <Fragment>{element}</Fragment>; // Render public pages immediately!
    }
    return <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>; // Show loader for protected paths while checking auth
  }

  if (!authenticated && !location.pathname.includes("/auth") && !isPublicPath) {
    return <Navigate to="/auth" />;
  }

  if (
    authenticated &&
    user?.role !== "instructor" &&
    user?.role !== "sub-admin" &&
    (location.pathname.includes("instructor") ||
      location.pathname.includes("/auth"))
  ) {
    return <Navigate to="/home" />;
  }

  if (
    authenticated &&
    (user?.role === "instructor" || user?.role === "sub-admin") &&
    !location.pathname.includes("instructor") &&
    !location.pathname.includes("profile")
  ) {
    return <Navigate to="/instructor" />;
  }

  return <Fragment>{element}</Fragment>;
}

export default RouteGuard;
