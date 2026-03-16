import axiosInstance from "@/api/axiosInstance";

export async function registerService(formData) {
  const { data } = await axiosInstance.post("/auth/register", {
    ...formData,
  });

  return data;
}

export async function registerSubAdminService(formData) {
  const { data } = await axiosInstance.post("/auth/register-sub-admin", {
    ...formData,
  });

  return data;
}

export async function loginService(formData) {
  const { data } = await axiosInstance.post("/auth/login", formData);

  return data;
}

export async function checkAuthService() {
  try {
    const { data } = await axiosInstance.get("/auth/check-auth");
    return data;
  } catch (error) {
    return { success: false, message: "Not authenticated" };
  }
}

export async function fetchAllSubAdminsService(currentUserId) {
  const { data } = await axiosInstance.get(`/auth/sub-admins?currentUserId=${currentUserId}`);

  return data;
}

export async function updateSubAdminService(id, formData) {
  const { data } = await axiosInstance.put(`/auth/sub-admins/update/${id}`, formData);

  return data;
}

export async function deleteSubAdminService(id) {
  const { data } = await axiosInstance.delete(`/auth/sub-admins/delete/${id}`);

  return data;
}

export async function mediaUploadService(formData, onProgressCallback) {
  const { data } = await axiosInstance.post("/media/upload", formData, {
    onUploadProgress: (progressEvent) => {
      const percentCompleted = Math.round(
        (progressEvent.loaded * 100) / progressEvent.total
      );
      onProgressCallback(percentCompleted);
    },
  });

  return data;
}

export async function mediaDeleteService(id) {
  const { data } = await axiosInstance.delete(`/media/delete/${id}`);

  return data;
}

export async function fetchInstructorCourseListService() {
  const { data } = await axiosInstance.get(`/instructor/course/get`);

  return data;
}

export async function addNewCourseService(formData) {
  const { data } = await axiosInstance.post(`/instructor/course/add`, formData);

  return data;
}

export async function fetchInstructorCourseDetailsService(id) {
  const { data } = await axiosInstance.get(
    `/instructor/course/get/details/${id}`
  );

  return data;
}

export async function updateCourseByIdService(id, formData) {
  const { data } = await axiosInstance.put(
    `/instructor/course/update/${id}`,
    formData
  );

  return data;
}

export async function mediaBulkUploadService(formData, onProgressCallback) {
  const { data } = await axiosInstance.post("/media/bulk-upload", formData, {
    onUploadProgress: (progressEvent) => {
      const percentCompleted = Math.round(
        (progressEvent.loaded * 100) / progressEvent.total
      );
      onProgressCallback(percentCompleted);
    },
  });

  return data;
}

export async function fetchStudentViewCourseListService(query) {
  const { data } = await axiosInstance.get(
    `/student/course/get${query ? `?${query}` : ""}`
  );

  return data;
}

export async function fetchStudentViewCourseDetailsService(courseId) {
  const { data } = await axiosInstance.get(
    `/student/course/get/details/${courseId}`
  );

  return data;
}

export async function checkCoursePurchaseInfoService(courseId, studentId) {
  const { data } = await axiosInstance.get(
    `/student/course/purchase-info/${courseId}/${studentId}`
  );

  return data;
}

export async function createPaymentService(formData) {
  const { data } = await axiosInstance.post(`/student/order/create`, formData);

  return data;
}

export async function createFreeOrderService(formData) {
  const { data } = await axiosInstance.post(
    `/student/order/create-free`,
    formData
  );

  return data;
}

export async function captureAndFinalizePaymentService(
  razorpay_order_id,
  razorpay_payment_id,
  razorpay_signature,
  orderId
) {
  const { data } = await axiosInstance.post(`/student/order/capture`, {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    orderId,
  });

  return data;
}

export async function fetchStudentBoughtCoursesService(studentId) {
  const { data } = await axiosInstance.get(
    `/student/courses-bought/get/${studentId}`
  );

  return data;
}

export async function getCurrentCourseProgressService(userId, courseId) {
  const { data } = await axiosInstance.get(
    `/student/course-progress/get/${userId}/${courseId}`
  );

  return data;
}

export async function fetchStudentCompletedCoursesService(userId) {
  const { data } = await axiosInstance.get(
    `/student/course-progress/completed-courses/${userId}`
  );

  return data;
}

export async function markLectureAsViewedService(userId, courseId, lectureId) {
  const { data } = await axiosInstance.post(
    `/student/course-progress/mark-lecture-viewed`,
    {
      userId,
      courseId,
      lectureId,
    }
  );

  return data;
}

export async function resetCourseProgressService(userId, courseId) {
  const { data } = await axiosInstance.post(
    `/student/course-progress/reset-progress`,
    {
      userId,
      courseId,
    }
  );

  return data;
}

export async function deleteCourseService(id) {
  const { data } = await axiosInstance.delete(`/instructor/course/delete/${id}`);

  return data;
}

export async function getHomeConfigService() {
  const { data } = await axiosInstance.get("/home-config/get");

  return data;
}

export async function updateHomeConfigService(formData) {
  const { data } = await axiosInstance.put("/home-config/update", formData);

  return data;
}
export async function addToCartService(formData) {
  const { data } = await axiosInstance.post("/student/cart/add", formData);
  return data;
}

export async function fetchCartItemsService(userId) {
  const { data } = await axiosInstance.get(`/student/cart/get/${userId}`);
  return data;
}

export async function deleteCartItemService(userId, courseId) {
  const { data } = await axiosInstance.delete(
    `/student/cart/delete/${userId}/${courseId}`
  );
  return data;
}

export async function forgotPasswordService(formData) {
  const { data } = await axiosInstance.post("/auth/forgot-password", formData);
  return data;
}

export async function resetPasswordService(formData) {
  const { data } = await axiosInstance.post("/auth/reset-password", formData);
  return data;
}

export async function updateUserProfileService(formData) {
  const { data } = await axiosInstance.put("/auth/update-profile", formData);
  return data;
}
export async function deleteStudentCourseService(studentId, courseId) {
  const { data } = await axiosInstance.delete(`/student/courses-bought/delete/${studentId}/${courseId}`);
  return data;
}
export async function googleLoginService(formData) {
  const { data } = await axiosInstance.post("/auth/google-login", formData);
  return data;
}

export async function microsoftLoginService(formData) {
  const { data } = await axiosInstance.post("/auth/microsoft-login", formData);
  return data;
}

export async function fetchAdminStudentProgressService() {
  const { data } = await axiosInstance.get("/instructor/student-progress/get");
  return data;
}

export async function deleteAdminStudentService(studentId) {
  const { data } = await axiosInstance.delete(`/instructor/student-progress/delete/${studentId}`);
  return data;
}
