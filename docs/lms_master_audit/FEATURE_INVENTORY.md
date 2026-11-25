# 2. FEATURE INVENTORY (FEATURE_INVENTORY.md)

**Project:** Bhavin Academy LMS  
**Verification Methodology:** Static source code audit, controller inspection, client service mapping, and route validation.  
**Date:** November 25, 2026  

---

## Category 1: Fully Implemented and Functional Features

1. **Course Discovery & Filtering:**
   - Client: `client/src/pages/student/courses/index.jsx`
   - Server: `server/controllers/student-controller/course-controller.js` (`getAllStudentViewCourses`)
   - Capabilities: Multi-category selection, difficulty level filtering (Beginner, Intermediate, Advanced), price sorting, search query debounce.

2. **Course Details Showcase:**
   - Client: `client/src/pages/student/course-details/index.jsx`
   - Server: `server/controllers/student-controller/course-controller.js` (`getStudentViewCourseDetails`)
   - Capabilities: Course metadata, instructor credentials, curriculum breakdown, Free Preview video modal, Free Preview rich-text notes modal, direct browser document links.

3. **Dual Payment Integration & Enrollment Execution:**
   - Client: `client/src/pages/student/checkout/index.jsx`
   - Server: `server/controllers/student-controller/order-controller.js`
   - Capabilities: Razorpay checkout modal with cryptographic HMAC SHA-256 signature verification; zero-cost free order enrollment verification; automatic `StudentCourses` record generation and `Cart` clearing.

4. **Classroom Player & Chapter Navigation:**
   - Client: `client/src/pages/student/course-progress/index.jsx`
   - Server: `server/controllers/student-controller/course-progress-controller.js`
   - Capabilities: Video streaming via `VideoPlayer`, readable document/notes canvas, real-time chapter accordion navigation, manual and automatic lecture completion tracking, certificate generation via `html2canvas` / `jsPDF`.

5. **Student Practice Exam Engine:**
   - Client: `client/src/pages/student/exam/index.jsx`
   - Capabilities: Timed 10-question CCNA/IT certification simulator, instant score computation, question review with technical explanations, retake functionality.

6. **Instructor Course Builder:**
   - Client: `client/src/pages/instructor/index.jsx`
   - Server: `server/controllers/instructor-controller/course-controller.js`
   - Capabilities: Course creation, section grouping, multi-type lesson additions (video/doc/quiz), custom duration inputs, pricing toggles, Cloudinary media upload integration.

7. **Student Analytics & Multi-Course Excel Export:**
   - Client: `client/src/pages/instructor/index.jsx`, `client/src/utils/export.js`
   - Server: `server/controllers/instructor-controller/student-progress-controller.js`
   - Capabilities: User-grouped progress view with collapsible multi-course cards, structured XLSX export.

---

## Category 2: Partially Implemented or Malfunctioning Features

1. **Cart Synchronization Across Devices / Logouts:**
   - Client: `client/src/pages/student/cart/index.jsx`
   - Server: `server/controllers/student-controller/cart-controller.js`
   - Defect: When a student adds an item to the cart, the server endpoint does not require authentication headers. If the user logs in on another device or refreshes with a cleared localStorage, cart items may desync or become orphaned in MongoDB.

2. **Student Profile Password Change:**
   - Client: `client/src/pages/student/profile/index.jsx` (Lines 350-380)
   - Server: `server/controllers/auth-controller/index.js`
   - Defect: The "Update Password" button on the student profile page only checks `newPassword !== confirmPassword` locally in client state and triggers a client toast! It **never calls an API endpoint** to update the password in MongoDB (`User.password`).

3. **Danger Zone: Delete Account:**
   - Client: `client/src/pages/student/profile/index.jsx` (Lines 385-400)
   - Defect: The "Delete Account" button triggers a client `confirm()` dialog and displays "Account deletion request submitted!" but **has no corresponding backend endpoint** to delete the user or anonymize data.

4. **Lecture Notes & Discussion Q&A in Classroom Player:**
   - Client: `client/src/pages/student/course-progress/index.jsx` (Tabs: "qa" and "notes")
   - Defect: The student can type notes or post questions in the classroom player tabs, but the entries are stored **only in transient React component state (`useState`)**. On page reload or chapter switch, all student notes and Q&A messages disappear completely because there is no MongoDB model or endpoint for user lecture notes!

5. **Course Rating & Review Submission:**
   - Client: `client/src/pages/student/course-progress/index.jsx` (Navbar star button and "Reviews" tab)
   - Defect: Clicking the navbar rating triggers `alert("Thank you for your 5-star rating!")`. The Reviews tab displays hardcoded distribution percentages (70% 5-star, 20% 4-star) and cannot persist user reviews.

---

## Category 3: Present in UI but Missing Backend Integration

1. **AI Assistant in Course Player:**
   - Client: `client/src/pages/student/course-progress/index.jsx` (Sidebar tab: "ai")
   - Defect: Displays an input box with "Ask AI about this video..." and a purple "Ask" button. No backend AI route or LLM integration is implemented; clicking "Ask" does nothing.

2. **Sync Calendar (.ics) Reminder:**
   - Client: `client/src/pages/student/course-progress/index.jsx` ("Learning Tools" tab)
   - Defect: "Sync Calendar (.ics)" button exists in the UI but does not trigger an `.ics` file generator or calendar API.

3. **Sub-Admin CRUD Management:**
   - Server: Endpoints exist in `server/routes/auth-routes/index.js` (`/register-sub-admin`, `/sub-admins`, etc.)
   - Client: No dedicated UI view exists in the student or instructor dashboards to manage sub-admins.
