"use client";

import Link from "next/link";
import { useState } from "react";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      alert("Functionality under development");
    }, 500);
  };

  const handleGoogleLogin = () => {
    alert("Google Login functionality under development");
  };

  return (
    <div className="min-h-screen w-full flex bg-white text-gray-900 font-sans">
      {/* Left Section: Typography & Art */}
      <div className="hidden lg:flex w-1/2 bg-gray-50 relative overflow-hidden flex-col justify-between p-12">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-[-20%] left-[-20%] w-[800px] h-[800px] bg-purple-200/50 rounded-full blur-[100px] animate-pulse mix-blend-multiply" />
          <div className="absolute bottom-[-20%] right-[-20%] w-[800px] h-[800px] bg-blue-200/50 rounded-full blur-[100px] animate-pulse delay-1000 mix-blend-multiply" />
        </div>

        <div className="relative z-10">
          <div className="text-2xl font-bold tracking-tight text-gray-900">office.</div>
        </div>

        <div className="relative z-10 max-w-lg">
          <h1 className="text-6xl font-extrabold tracking-tight leading-tight mb-6">
            Welcome back to the future of work.
          </h1>
          <p className="text-xl text-gray-600 font-medium">
            Streamline your workflow, manage your tasks, and collaborate with your team in one unified platform.
          </p>
        </div>

        <div className="relative z-10 text-sm text-gray-500 font-medium">
          © 2024 NJ Tech Studio. All rights reserved.
        </div>
      </div>

      {/* Right Section: Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-12 relative">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">Sign in to your account</h2>
            <p className="mt-2 text-gray-600">
              Welcome back! Please enter your details.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Email</label>
              <input
                type="email"
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600/20 focus:border-purple-600 transition-all duration-300"
                placeholder="name@company.com"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Password</label>
              <input
                type="password"
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600/20 focus:border-purple-600 transition-all duration-300"
                placeholder="••••••••"
              />
            </div>

            <div className="flex items-center justify-between">
              <div
                className="text-sm font-semibold text-purple-600 hover:text-purple-700 cursor-pointer transition-colors"
                onClick={() => alert("Forgot password functionality under development")}
              >
                Forgot password?
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gray-900 text-white font-bold py-3.5 rounded-xl hover:bg-black transform hover:scale-[1.01] active:scale-[0.99] transition-all duration-300 shadow-lg shadow-gray-200 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <div className="flex items-center gap-4">
            <div className="h-px bg-gray-200 flex-1" />
            <span className="text-gray-500 text-sm font-medium">OR</span>
            <div className="h-px bg-gray-200 flex-1" />
          </div>

          <button
            onClick={handleGoogleLogin}
            className="w-full bg-white border border-gray-200 text-gray-700 font-semibold py-3.5 rounded-xl hover:bg-gray-50 hover:border-gray-300 transform hover:scale-[1.01] active:scale-[0.99] transition-all duration-300 flex items-center justify-center gap-3"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                style={{ fill: "#4285F4" }}
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                style={{ fill: "#34A853" }}
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                style={{ fill: "#FBBC05" }}
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                style={{ fill: "#EA4335" }}
              />
            </svg>
            Sign in with Google
          </button>

          <p className="text-center text-gray-600 text-sm">
            Don't have an account?{" "}
            <Link
              href="/register"
              className="font-semibold text-purple-600 hover:text-purple-700 transition-colors hover:underline"
            >
              Sign up for free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
