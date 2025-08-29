/* Layout for Landing Page which opens when user first opens the app */

import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-16">
      <h1 className="text-3xl font-bold mb-3">Random ingredients got you feeling cooked?</h1>
      <p className="text-gray-600 mb-6">
        Add what you have. Select what you want. Let Cooked suggest a recipe for you to cook up.
      </p>
      <Link
        to="/sign-in"
        className="inline-block px-4 py-2 rounded-lg bg-gray-900 text-white hover:opacity-90"
      >
        Get started now
      </Link>
    </main>
  );
}