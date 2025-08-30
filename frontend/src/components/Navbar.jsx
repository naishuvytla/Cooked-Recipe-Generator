/* Layout for Navigation bar that stays at the top of the screen */

import { UserButton, SignedIn, SignedOut } from "@clerk/clerk-react";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <header className="fixed top-0 inset-x-0 z-30 bg-black/40 backdrop-blur">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between text-white">
        <Link to="/" className="text-xl font-extrabold text-white">COOKED</Link>

        <nav className="flex items-center gap-4">
          <SignedOut>
            <Link
              to="/sign-in"
              className="px-3 py-1.5 rounded-lg text-white hover:opacity-90"
            >
              Sign in
            </Link>
          </SignedOut>

          <SignedIn>
            <UserButton signOutUrl="/" />
          </SignedIn>
        </nav>
      </div>
    </header>
  );
}