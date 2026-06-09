import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import "./design-system.css";
import { BrowserRouter } from "react-router-dom";
import AuthProvider from "./context/auth-context/index.jsx";
import StudentProvider from "./context/student-context/index.jsx";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { MsalProvider } from "@azure/msal-react";
import { msalInstance, googleClientId } from "./config/oauth-config";

msalInstance.initialize().then(() => {
  createRoot(document.getElementById("root")).render(
    <BrowserRouter>
      <GoogleOAuthProvider clientId={googleClientId}>
        <MsalProvider instance={msalInstance}>
          <AuthProvider>
            <StudentProvider>
              <App />
            </StudentProvider>
          </AuthProvider>
        </MsalProvider>
      </GoogleOAuthProvider>
    </BrowserRouter>
  );
}).catch(err => {
  console.error("MSAL Initialization Error:", err);
});
