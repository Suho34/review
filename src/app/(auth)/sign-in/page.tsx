"use client";

import { FormEvent, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  AtSign,
  ChevronLeft,
  Loader2,
  Lock,
  ShieldAlert,
} from "lucide-react";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSignIn = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error } = await authClient.signIn.email({
        email,
        password,
        rememberMe: true,
      });

      if (error) {
        setError(error.message ?? "Sign-in failed.");
        return;
      }

      router.replace("/dashboard");
      router.refresh();
    } catch {
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-[#0a0a0f] px-4 overflow-hidden">
      {/* Back to home link */}
      <Link
        href="/"
        className="absolute top-6 left-6 flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors group"
      >
        <ChevronLeft className="w-4 h-4 text-white/40 group-hover:text-white transition-colors" />
        Back to home
      </Link>

      {/* Sign-in card */}
      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold bg-linear-to-r from-white to-white/60 bg-clip-text text-transparent">
              LearnLoop
            </span>
          </div>
        </div>

        <form
          onSubmit={handleSignIn}
          className="relative space-y-6 rounded-2xl border border-white/10 bg-linear-to-br from-white/5 to-white/0 p-8 shadow-2xl backdrop-blur-xl"
        >
          {/* Header */}
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white mb-2">Welcome back</h1>
            <p className="text-sm text-white/60">
              Sign in to continue learning
            </p>
          </div>

          {/* Email input */}
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-white/80"
            >
              Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <AtSign className="w-5 h-5 text-white/40" />
              </div>
              <input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                required
                className="w-full rounded-xl border border-white/10 bg-white/5 pl-10 pr-4 py-3 text-sm text-white placeholder-white/40 focus:border-blue-500/50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
          </div>

          {/* Password input */}
          <div className="space-y-2">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-white/80"
            >
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="w-5 h-5 text-white/40" />
              </div>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                required
                className="w-full rounded-xl border border-white/10 bg-white/5 pl-10 pr-4 py-3 text-sm text-white placeholder-white/40 focus:border-blue-500/50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
          </div>

          {/* Error message */}
          {error && (
            <div className="flex items-start gap-3 rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3 animate-shake">
              <ShieldAlert className="w-5 h-5 text-red-400 mt-1" />
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading}
            className="group relative w-full rounded-xl bg-linear-to-r from-blue-600 to-purple-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-[1.02] transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100 overflow-hidden"
          >
            {loading && (
              <div className="absolute inset-0 bg-linear-to-r from-blue-600 to-purple-600 animate-pulse" />
            )}
            <span className="relative flex items-center justify-center gap-2">
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 text-white animate-spin " />
                  Signing in...
                </>
              ) : (
                <>
                  Sign in
                  <ArrowLeft className="w-4 h-4 text-white/80 group-hover:text-white transition-colors" />
                </>
              )}
            </span>
          </button>

          {/* Info text */}
          <div className="pt-4 border-t border-white/10">
            <p className="text-xs text-center text-white/50 leading-relaxed">
              Don&apos;t have an account?{" "}
              <Link
                href="/sign-up"
                className="text-blue-400 hover:text-blue-300 transition-colors"
              >
                Sign up
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
