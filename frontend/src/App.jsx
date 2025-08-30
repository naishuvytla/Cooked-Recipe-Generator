import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { SignedIn, SignedOut, SignIn } from "@clerk/clerk-react";
import Navbar from "./components/Navbar.jsx";
import Landing from "./pages/Landing.jsx";
import Pantry from "./pages/Pantry.jsx";

export default function App() {
  const location = useLocation();
  const isAuthRoute =
    location.pathname.startsWith("/sign-in") ||
    location.pathname.startsWith("/sign-up");

  return (
    <div className="min-h-screen text-white">
      {!isAuthRoute && <Navbar />}

      <SignedOut>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route
            path="/sign-in/*"
            element={
              <div className="flex min-h-screen items-center justify-center">
                <SignIn routing="path" path="/sign-in" />
              </div>
            }
          />
          <Route path="/pantry" element={<Navigate to="/sign-in" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </SignedOut>

      <SignedIn>
        <div className={isAuthRoute ? "" : "pt-16"}>
          <Routes>
            <Route path="/" element={<Navigate to="/pantry" replace />} />
            <Route path="/pantry" element={<Pantry />} />
            <Route path="*" element={<Navigate to="/pantry" replace />} />
          </Routes>
        </div>
      </SignedIn>
    </div>
  );
}