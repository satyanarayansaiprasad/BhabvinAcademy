# 7. IMPLEMENTATION ROADMAP & STAGING (IMPLEMENTATION_ROADMAP.md)

**Project:** Bhavin Academy LMS  
**Execution Strategy:** Strict staged deployment with continuous automated build checks and regression validation.  
**Date:** November 25, 2026  

---

## Stage 1: Critical Security Hardening & Access Control (P0)
- **Goal:** Seal all unprotected administrative and student API routes against unauthorized access and IDOR attacks.
- **Actions:**
  1. Attach `authenticateMiddleware` to all routes in `server/routes/instructor-routes/course-routes.js` and `student-progress-routes.js`.
  2. Implement role-checking middleware verifying that `req.user.role === 'admin' || req.user.role === 'instructor'`.
  3. Enforce token authentication on student order creation (`order-routes.js`) and cart endpoints (`cart-routes.js`).
  4. Eliminate the insecure `"JWT_SECRET"` fallback string in `auth-middleware.js` and `auth-controller`.
- **Files Modified:**
  - `server/routes/instructor-routes/course-routes.js`
  - `server/routes/instructor-routes/student-progress-routes.js`
  - `server/routes/student-routes/order-routes.js`
  - `server/routes/student-routes/cart-routes.js`
  - `server/middleware/auth-middleware.js`
  - `server/controllers/auth-controller/index.js`
- **Testing Procedure:** Send unauthenticated cURL requests to `/instructor/course/delete/:id` and `/instructor/student-progress/get`; verify `401 Unauthorized` is returned.

---

## Stage 2: Data Integrity & Business Logic Corrections (P1)
- **Goal:** Fix flawed percentage calculations and backend password update logic.
- **Actions:**
  1. Fix progress calculation in `student-progress-controller.js` to divide `viewedCount` by `course.curriculum.length` instead of `progress.lecturesProgress.length`.
  2. Implement `updatePassword` API endpoint in `server/controllers/auth-controller/index.js` and register `/auth/update-password`.
  3. Wire the student profile "Update Password" form in `client/src/pages/student/profile/index.jsx` to call `updatePasswordService`.
- **Files Modified:**
  - `server/controllers/instructor-controller/student-progress-controller.js`
  - `server/controllers/auth-controller/index.js`
  - `server/routes/auth-routes/index.js`
  - `client/src/services/index.js`
  - `client/src/pages/student/profile/index.jsx`
- **Testing Procedure:** Verify password change in database; verify student progress metrics reflect real curriculum completion in instructor table.

---

## Stage 3: Student Experience & Learning Workflow Refinements (P1 / P2)
- **Goal:** Polish student learning journey to match modern Udemy-level usability while strictly keeping existing design.
- **Actions:**
  1. On `/student-courses` (My Learning), render active percentage progress bars on each enrolled course card.
  2. In the classroom player (`course-progress/index.jsx`), ensure clicking "Next Lesson" auto-advances through sections smoothly.
  3. Remove invasive global right-click and keyboard blocks from `client/src/App.jsx`.
  4. Provide clean empty states and informative tooltips for the player tabs.
- **Files Modified:**
  - `client/src/pages/student/student-courses/index.jsx`
  - `client/src/pages/student/course-progress/index.jsx`
  - `client/src/App.jsx`
- **Testing Procedure:** Verify student courses progress display; test next lesson auto-advance; confirm right-click works normally.

---

## Stage 4: Database Safety & Index Optimization (P2)
- **Goal:** Ensure database indexes prevent race conditions and improve query performance.
- **Actions:**
  1. Add unique compound index on `CourseProgressSchema` for `{ userId: 1, courseId: 1 }`.
  2. Add unique index on `UserSchema.userEmail`.
  3. Add index on `CartSchema.userId`.
- **Files Modified:**
  - `server/models/CourseProgress.js`
  - `server/models/User.js`
  - `server/models/Cart.js`
- **Testing Procedure:** Run Node script to inspect Mongoose schema indexes and verify index registration.

---

## Stage 5: Full Regression Testing & Production Build Validation (P0)
- **Goal:** Ensure entire client and server compile cleanly with zero errors.
- **Actions:**
  1. Run `cd client && npm run build`.
  2. Validate all route guards, API mocks, and environment variables.
  3. Run server validation script.
