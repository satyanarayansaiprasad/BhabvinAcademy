# 4. SECURITY AUDIT & VULNERABILITY REGISTER (SECURITY_AUDIT.md)

**Project:** Bhavin Academy LMS  
**Classification Standard:** OWASP Top 10 (2021) / CWE / SANS Top 25  
**Audit Date:** November 25, 2026  
**Auditor:** Principal Security Architect & Certified Information Systems Auditor  

---

## 1. Critical & High-Severity Security Findings

### SEC-01: Broken Access Control & IDOR on Instructor/Admin Endpoints (OWASP A01:2021)
- **Severity:** CRITICAL (CVSS 9.1)
- **Affected Endpoints:**
  - `POST /instructor/course/add`
  - `PUT /instructor/course/update/:id`
  - `DELETE /instructor/course/delete/:id`
  - `GET /instructor/student-progress/get`
  - `DELETE /instructor/student-progress/delete/:studentId`
- **Vulnerability Detail:**
  Inspection of `server/routes/instructor-routes/course-routes.js` and `student-progress-routes.js` reveals that **ZERO authentication or authorization middleware** is attached to these routes!
  ```javascript
  // Current route definition in server/routes/instructor-routes/course-routes.js:
  router.post("/add", addNewCourse);
  router.put("/update/:id", updateCourse);
  router.delete("/delete/:id", deleteCourse);
  ```
  Any unauthenticated attacker on the internet can send a raw `DELETE /instructor/course/delete/<course_id>` or `DELETE /instructor/student-progress/delete/<student_id>` request and completely wipe out courses or student enrollment data!
- **Remediation:** Attach `authenticateMiddleware` and a role verification middleware checking `req.user.role === 'admin' || req.user.role === 'instructor'` to all instructor and sub-admin routes.

---

### SEC-02: Missing Authorization on Student Order Creation & Progress (OWASP A01:2021)
- **Severity:** HIGH (CVSS 8.2)
- **Affected Endpoints:**
  - `POST /student/order/create`
  - `POST /student/order/create-free`
  - `POST /student/order/capture`
  - `GET /student/courses-bought/get/:studentId`
  - `GET /student/course-progress/get/:userId/:courseId`
- **Vulnerability Detail:**
  In `order-routes.js`, `student-courses-routes.js`, and `course-progress-routes.js`, endpoints accept `userId` or `studentId` in the body or URL parameters without verifying that the authenticated user (`req.user._id`) matches the requested subject. Any user can query another student's courses or progress simply by passing their `userId`.
- **Remediation:** Enforce `authenticateMiddleware` on all student transactional endpoints and bind actions to `req.user._id`.

---

### SEC-03: Hardcoded JWT Secret Fallback (OWASP A07:2021)
- **Severity:** HIGH (CVSS 7.8)
- **Affected File:** `server/middleware/auth-middleware.js` (Line 21)
- **Vulnerability Detail:**
  ```javascript
  const payload = verifyToken(token, process.env.JWT_SECRET || "JWT_SECRET");
  ```
  If `JWT_SECRET` is unset in production, the server falls back to the well-known static string `"JWT_SECRET"`. An attacker can forge arbitrary JWTs with `role: "admin"` and bypass all client-side authentication checks.
- **Remediation:** Throw a fatal startup error if `process.env.JWT_SECRET` is undefined; remove the fallback string.

---

### SEC-04: Client-Side Context Menu & DevTools Disabling (Anti-Debug UX Defect)
- **Severity:** LOW / Usability Anti-Pattern (CWE-693)
- **Affected File:** `client/src/App.jsx` (Lines 28-44)
- **Vulnerability Detail:**
  ```javascript
  const handleContextMenu = (e) => { e.preventDefault(); return false; };
  const handleKeyDown = (e) => {
    if (e.keyCode === 123 || ...) e.preventDefault();
  };
  ```
  Disabling right-click and keyboard keys (F12, Ctrl+Shift+I) offers **zero real security** against attackers (who use proxy tools like Burp Suite or curl) while frustrating legitimate students who want to right-click links or open in new tabs.
- **Remediation:** Remove intrusive context-menu suppression or confine it strictly to DRM video playback canvases.

---

### SEC-05: Missing Rate Limiting on Authentication & Contact Endpoints (OWASP A04:2021)
- **Severity:** MEDIUM (CVSS 6.5)
- **Affected Endpoints:** `/auth/login`, `/auth/register`, `/contact/submit`
- **Vulnerability Detail:**
  No rate-limiting middleware (`express-rate-limit`) is mounted on login or contact submission. This leaves the platform vulnerable to brute-force credential stuffing and email bombing.
- **Remediation:** Apply `express-rate-limit` (e.g. 10 login attempts per 15 minutes, 5 contact submissions per hour).
