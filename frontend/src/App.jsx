import { Routes, Route, Navigate } from "react-router-dom";
import { SignedIn, SignedOut, SignIn } from "@clerk/clerk-react";
import Navbar from "./components/Navbar.jsx";
import Landing from "./pages/Landing.jsx";
import Pantry from "./pages/Pantry.jsx";

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <Navbar />

      {/* New / Signed out users see landing page */}
      <SignedOut>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/sign-in/*" element={<SignIn routing="path" path="/sign-in" />} />
          {/* If a user tries to visit /pantry while signed out redirect to /sign-in */}
          <Route path="/pantry" element={<Navigate to="/sign-in" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </SignedOut>

      {/* Signed in users see pantry page */}
      <SignedIn>
        <Routes>
          <Route path="/" element={<Navigate to="/pantry" replace />} />
          <Route path="/pantry" element={<Pantry />} />
          <Route path="*" element={<Navigate to="/pantry" replace />} />
        </Routes>
      </SignedIn>
    </div>
  );
}