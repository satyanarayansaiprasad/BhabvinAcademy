import { addToCartService, fetchCartItemsService, fetchStudentBoughtCoursesService } from "@/services";
import { createContext, useEffect, useState } from "react";

export const StudentContext = createContext(null);

export default function StudentProvider({ children }) {
  const [studentViewCoursesList, setStudentViewCoursesList] = useState([]);
  const [loadingState, setLoadingState] = useState(true);
  const [studentViewCourseDetails, setStudentViewCourseDetails] =
    useState(null);
  const [currentCourseDetailsId, setCurrentCourseDetailsId] = useState(null);
  const [studentBoughtCoursesList, setStudentBoughtCoursesList] = useState([]);
  const [studentCurrentCourseProgress, setStudentCurrentCourseProgress] =
    useState({});
  const [cartItems, setCartItems] = useState([]);

  async function handleAddToCart(courseId, userId) {
    const response = await addToCartService({
      userId,
      courseId,
    });
    if (response?.success) {
      setCartItems(response?.data?.items);
    }
    return response;
  }

  async function fetchCartItems(userId) {
    const response = await fetchCartItemsService(userId);
    if (response?.success) {
      setCartItems(response?.data);
    }
  }

  async function fetchBoughtCourses(userId) {
    const response = await fetchStudentBoughtCoursesService(userId);
    if (response?.success) {
      setStudentBoughtCoursesList(response?.data);
    }
  }

  return (
    <StudentContext.Provider
      value={{
        studentViewCoursesList,
        setStudentViewCoursesList,
        loadingState,
        setLoadingState,
        studentViewCourseDetails,
        setStudentViewCourseDetails,
        currentCourseDetailsId,
        setCurrentCourseDetailsId,
        studentBoughtCoursesList,
        setStudentBoughtCoursesList,
        studentCurrentCourseProgress,
        setStudentCurrentCourseProgress,
        cartItems,
        setCartItems,
        handleAddToCart,
        fetchCartItems,
        fetchBoughtCourses,
      }}
    >
      {children}
    </StudentContext.Provider>
  );
}
