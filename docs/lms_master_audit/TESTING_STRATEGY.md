# 8. TESTING STRATEGY & VERIFICATION PLAN (TESTING_STRATEGY.md)

**Project:** Bhavin Academy LMS  
**Verification Level:** Enterprise Full-Stack Rigor  
**Date:** November 25, 2026  

---

## 1. Automated Build & Compilation Verification
- **Frontend Client Build:** `cd client && npm run build` (Vite production bundle compiler with rollup tree-shaking and minification).
- **Backend Syntax & Module Check:** Node.js runtime script checking module resolutions, Mongoose schema paths, and router mounts.

## 2. API Security & Access Control Test Cases

| Test Case ID | Target Endpoint | HTTP Method | Input Payload | Expected Response | Purpose |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **TC-SEC-01** | `/instructor/course/delete/test_id` | DELETE | None (No Token) | `401 Unauthorized` | Verify unauthenticated deletion is blocked |
| **TC-SEC-02** | `/instructor/student-progress/get` | GET | None (No Token) | `401 Unauthorized` | Verify student data is protected from public access |
| **TC-SEC-03** | `/instructor/course/add` | POST | Student Token (`role: 'student'`) | `403 Forbidden` | Verify privilege escalation is prevented |
| **TC-SEC-04** | `/auth/check-auth` | GET | Valid Bearer Token | `200 OK` + User details | Verify session validation |
| **TC-SEC-05** | `/auth/update-password` | PUT | Current + New Password | `200 OK` (or `400` if current is incorrect) | Verify password change verification |

## 3. End-to-End Functional Test Scenarios

### Scenario A: Free Course Enrollment & Learning Journey
1. Log in as student.
2. Select course with pricing = 0.
3. Click "Enroll Now" -> triggers `/student/order/create-free`.
4. Verify student is redirected to `/student-courses`.
5. Open course player `/course-progress/:id`.
6. Mark Lecture 1 viewed -> verify checkbox checks and progress bar increments.
7. Complete all lectures -> verify congratulatory confetti displays and certificate download button appears.

### Scenario B: Document & Notes Preview vs Video Playback
1. Open `/course/details/:id`.
2. Click on lecture with document icon -> verify document URL opens in new browser tab (`_blank`).
3. Click on lecture labeled "Additional Notes" -> verify rich-text reading modal opens.
4. Click on lecture with video URL -> verify video player dialog launches.

### Scenario C: Instructor Curriculum Management & Progress Export
1. Log in as instructor/admin.
2. Navigate to `/instructor`.
3. Create course with multi-section curriculum, custom lesson durations, and downloadable resources.
4. Save course -> verify persistence in MongoDB.
5. Navigate to Student Progress tab -> verify progress percentage calculation is mathematically correct.
6. Click "Export to Excel" -> verify XLSX file downloads with clean data formatting.
