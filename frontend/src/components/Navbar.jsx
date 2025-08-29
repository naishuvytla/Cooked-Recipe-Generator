/* Layout for Navigation bar that stays at the top of the screen */

import { UserButton, SignedIn, SignedOut } from "@clerk/clerk-react";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <header className="bg-white border-b sticky top-0 z-20">
      <div className="mx-auto max-w-5xl px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-xl font-semibold">
          Cooked
        </Link>

        <nav className="flex items-center gap-4">
          <SignedOut>
            <Link
              to="/sign-in"
              className="px-3 py-1.5 rounded-lg bg-gray-900 text-white hover:opacity-90"
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