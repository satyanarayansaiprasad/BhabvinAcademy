import { Navigate, useLocation } from "react-router-dom";
import { Fragment } from "react";

function RouteGuard({ authenticated, user, element }) {
  const location = useLocation();

  console.log(authenticated, user, "useruser");

  const publicPaths = ["/", "/home", "/courses", "/course/details"];
  const isPublicPath = publicPaths.some((path) => location.pathname === path || location.pathname.startsWith("/course/details/"));

  if (!authenticated && !location.pathname.includes("/auth") && !isPublicPath) {
    return <Navigate to="/auth" />;
  }

  if (
    authenticated &&
    user?.role !== "instructor" &&
    (location.pathname.includes("instructor") ||
      location.pathname.includes("/auth"))
  ) {
    return <Navigate to="/home" />;
  }

  if (
    authenticated &&
    user.role === "instructor" &&
    !location.pathname.includes("instructor") &&
    !location.pathname.includes("profile")
  ) {
    return <Navigate to="/instructor" />;
  }

  return <Fragment>{element}</Fragment>;
}

export default RouteGuard;
