"use client";

import { ArrowRight, BrainCircuit, CircleCheckBig } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white overflow-hidden">
      {/* Header */}
      <header className="relative flex items-center justify-between px-6 lg:px-12 py-6 border-b border-white/5 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <BrainCircuit className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold bg-linear-to-r from-white to-white/60 bg-clip-text text-transparent">
            LearnLoop
          </h1>
        </div>

        <div className="flex gap-3">
          <Link
            href="/sign-in"
            className="rounded-lg px-5 py-2.5 text-sm font-medium text-white/70 hover:text-white hover:bg-white/5 transition-all duration-200"
          >
            Sign in
          </Link>
          <Link
            href="/sign-up"
            className="rounded-lg bg-linear-to-r from-blue-600 to-purple-600 px-5 py-2.5 text-sm font-semibold shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 hover:scale-105 transition-all duration-200"
          >
            Get started
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative">
        <div className="mx-auto max-w-6xl px-6 lg:px-12 pt-20 pb-32 text-center">
          {/* Floating badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm mb-8 animate-fade-in">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-sm text-white/70">
              Spaced repetition made simple
            </span>
          </div>

          <h2 className="text-5xl lg:text-7xl font-bold leading-tight mb-6 animate-fade-in-up">
            <span className="bg-linear-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-transparent">
              Remember <span className=" text-amber-100 text-8xl ">What</span>
              <br />
              you learn.
            </span>
          </h2>

          <p
            className="mt-6 text-lg lg:text-xl text-white/60 max-w-2xl mx-auto leading-relaxed animate-fade-in-up"
            style={{ animationDelay: "0.1s" }}
          >
            LearnLoop helps you capture knowledge and reviews it at the perfect
            moment using proven spaced repetition techniques.
          </p>

          {/* CTA Buttons */}
          <div
            className="mt-12 flex flex-col sm:flex-row justify-center gap-4 animate-fade-in-up"
            style={{ animationDelay: "0.2s" }}
          >
            <Link
              href="/sign-up"
              className="group rounded-xl bg-linear-to-r from-blue-600 to-purple-600 px-8 py-4 text-base font-semibold shadow-2xl shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-105 transition-all duration-300"
            >
              <span className="flex items-center justify-center gap-2">
                Start learning free
                <ArrowRight
                  className="w-4 h-4 text-white"
                  fill="currentColor"
                />
              </span>
            </Link>

            <Link
              href="/sign-in"
              className="rounded-xl border border-white/10 px-8 py-4 text-base font-medium text-white/70 hover:text-white hover:bg-white/5 hover:border-white/20 transition-all duration-300"
            >
              I already have an account
            </Link>
          </div>

          {/* Social proof */}
          <div
            className="mt-16 flex items-center justify-center gap-8 text-sm text-white/40 animate-fade-in"
            style={{ animationDelay: "0.3s" }}
          >
            <div className="flex items-center gap-2">
              <CircleCheckBig className="w-5 h-5 text-green-500" />

              <span>Free forever</span>
            </div>
            <div className="flex items-cen`ter gap-2">
              <CircleCheckBig className="w-5 h-5 text-green-500" />
              <span>No credit card</span>
            </div>
            <div className="flex items-center gap-2">
              <CircleCheckBig className="w-5 h-5 text-green-500" />
              <span>Cancel anytime</span>
            </div>
          </div>
        </div>

        {/* Feature Cards */}
        <section className="relative mx-auto max-w-7xl px-6 lg:px-12 pb-24">
          <div className="grid gap-6 md:grid-cols-3">
            {/* Card 1 */}
            <div
              className="group relative rounded-2xl border border-white/10 bg-linear-to-br from-white/5 to-white/0 p-8 hover:border-white/20 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 animate-fade-in-up"
              style={{ animationDelay: "0.1s" }}
            >
              <div className="mb-4 w-12 h-12 rounded-xl bg-linear-to-br from-blue-500/20 to-blue-600/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <svg
                  className="w-6 h-6 text-blue-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">
                Capture knowledge
              </h3>
              <p className="text-white/60 leading-relaxed">
                Save concepts, ideas, and insights instantly. Build your
                personal knowledge base effortlessly.
              </p>
            </div>

            {/* Card 2 */}
            <div
              className="group relative rounded-2xl border border-white/10 bg-linear-to-br from-white/5 to-white/0 p-8 hover:border-white/20 hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-300 animate-fade-in-up"
              style={{ animationDelay: "0.2s" }}
            >
              <div className="mb-4 w-12 h-12 rounded-xl bg-linear-to-br from-purple-500/20 to-purple-600/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <svg
                  className="w-6 h-6 text-purple-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">
                Smart reviews
              </h3>
              <p className="text-white/60 leading-relaxed">
                Review notes at optimal intervals. Our algorithm brings back
                content right before you forget.
              </p>
            </div>

            {/* Card 3 */}
            <div
              className="group relative rounded-2xl border border-white/10 bg-linear-to-br from-white/5 to-white/0 p-8 hover:border-white/20 hover:shadow-xl hover:shadow-pink-500/10 transition-all duration-300 animate-fade-in-up"
              style={{ animationDelay: "0.3s" }}
            >
              <div className="mb-4 w-12 h-12 rounded-xl bg-linear-to-br from-pink-500/20 to-pink-600/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <svg
                  className="w-6 h-6 text-pink-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">
                Track progress
              </h3>
              <p className="text-white/60 leading-relaxed">
                Visualize your learning journey. See what you&apos;ve mastered
                and where to focus next.
              </p>
            </div>
          </div>
        </section>

        {/* How it Works */}
        <section className="relative mx-auto max-w-5xl px-6 lg:px-12 pb-24">
          <div className="text-center mb-16">
            <h3 className="text-3xl lg:text-4xl font-bold mb-4 bg-linear-to-r from-white to-white/60 bg-clip-text text-transparent">
              How it works
            </h3>
            <p className="text-white/60 text-lg">
              Simple, effective, science-backed
            </p>
          </div>

          <div className="space-y-8">
            {/* Step 1 */}
            <div
              className="flex gap-6 items-start animate-fade-in-up"
              style={{ animationDelay: "0.1s" }}
            >
              <div className="shrink-0 w-10 h-10 rounded-full bg-linear-to-br from-blue-500 to-blue-600 flex items-center justify-center font-bold text-lg">
                1
              </div>
              <div className="flex-1">
                <h4 className="text-xl font-semibold mb-2">
                  Add what you learn
                </h4>
                <p className="text-white/60 leading-relaxed">
                  Jot down concepts, facts, or insights as you learn. Organize
                  by topics and mark difficulty levels.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div
              className="flex gap-6 items-start animate-fade-in-up"
              style={{ animationDelay: "0.2s" }}
            >
              <div className="shrink-0 w-10 h-10 rounded-full bg-linear-to-br from-purple-500 to-purple-600 flex items-center justify-center font-bold text-lg">
                2
              </div>
              <div className="flex-1">
                <h4 className="text-xl font-semibold mb-2">
                  Review at the right time
                </h4>
                <p className="text-white/60 leading-relaxed">
                  Get reminded to review notes before you forget them. Rate how
                  well you remember to optimize spacing.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div
              className="flex gap-6 items-start animate-fade-in-up"
              style={{ animationDelay: "0.3s" }}
            >
              <div className="shrink-0 w-10 h-10 rounded-full bg-linear-to-br from-pink-500 to-pink-600 flex items-center justify-center font-bold text-lg">
                3
              </div>
              <div className="flex-1">
                <h4 className="text-xl font-semibold mb-2">
                  Build lasting knowledge
                </h4>
                <p className="text-white/60 leading-relaxed">
                  Watch your retention improve over time. The more you review,
                  the longer the intervals become.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative border-t border-white/5 px-6 lg:px-12 py-8">
        <div className="mx-auto max-w-7xl flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-white/40">
          <div>© 2026 LearnLoop. All rights reserved.</div>
          <div className="flex gap-6">
            <Link
              href="/privacy"
              className="hover:text-white/60 transition-colors"
            >
              Privacy
            </Link>
            <Link
              href="/terms"
              className="hover:text-white/60 transition-colors"
            >
              Terms
            </Link>
            <Link
              href="/contact"
              className="hover:text-white/60 transition-colors"
            >
              Contact
            </Link>
          </div>
        </div>
      </footer>


    </div>
  );
}
