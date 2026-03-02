import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import AuthProvider from "./context/auth-context/index.jsx";
import InstructorProvider from "./context/instructor-context/index.jsx";
import StudentProvider from "./context/student-context/index.jsx";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { MsalProvider } from "@azure/msal-react";
import { msalInstance, googleClientId } from "./config/oauth-config";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <GoogleOAuthProvider clientId={googleClientId}>
      <MsalProvider instance={msalInstance}>
        <AuthProvider>
          <InstructorProvider>
            <StudentProvider>
              <App />
            </StudentProvider>
          </InstructorProvider>
        </AuthProvider>
      </MsalProvider>
    </GoogleOAuthProvider>
  </BrowserRouter>
);
