/* Layout for Landing Page which opens when user first opens the app */

import { SignedIn, SignedOut } from "@clerk/clerk-react";
import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <main className="min-h-screen pt-24 px-6 pb-16">
      <section className="mx-auto max-w-5xl">
        <style>{`
          @keyframes bob {
            0% { transform: translateY(0) }
            50% { transform: translateY(-6px) }
            100% { transform: translateY(0) }
          }
        `}</style>

        <div className="relative overflow-hidden rounded-2xl bg-black/35 backdrop-blur-sm">
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-transparent" />
          <div className="relative px-6 py-16 sm:px-10 sm:py-20 md:px-16">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white drop-shadow">
              Random ingredients got you feeling <span className="text-amber-500">cooked</span>?
            </h1>

            <p className="mt-4 max-w-2xl text-base sm:text-lg text-white/80">
              Add what you have. Select what you want. Let <span className="font-semibold">Cooked</span> suggest a quick recipe for you to <span className="text-amber-500">cook up</span>.
            </p>

            <div className="mt-4 flex items-center gap-6">
              <SignedOut>
                <Link
                  to="/sign-in"
                  className="inline-flex items-center justify-center rounded-xl bg-amber-700 px-6 py-3 text-white font-medium hover:bg-black"
                >
                  Get started now
                </Link>
              </SignedOut>

              <div className="flex gap-4">
                <style>{`
                  @keyframes bounceJar {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-10px); }
                }
              `}</style>

                <svg
                  viewBox="0 0 64 64"
                  className="h-14 w-14"
                  style={{ animation: "bounceJar 2s infinite" }}
                >
                  <rect x="12" y="18" width="40" height="36" rx="8" ry="10" fill="#3f527eff" />
                  <rect x="8" y="10" width="48" height="12" rx="8" fill="#6f80a9ff" />
                </svg>

                <svg
                  viewBox="0 0 64 64"
                  className="h-14 w-14"
                  style={{ animation: "bounceJar 3s infinite 0.3s" }}
                >
                  <rect x="12" y="18" width="40" height="36" rx="8" ry="10" fill="#896d44ff" />
                  <rect x="8" y="10" width="48" height="12" rx="8" fill="#b59a70ff" />
                </svg>

                <svg
                  viewBox="0 0 64 64"
                  className="h-14 w-14"
                  style={{ animation: "bounceJar 2s infinite 0.6s" }}
                >
                  <rect x="12" y="18" width="40" height="36" rx="8" ry="10" fill="#50683dff" />
                  <rect x="8" y="10" width="48" height="12" rx="8" fill="#6F8A5B" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}