import { useState } from "react";
import { Link, useLocation } from "wouter";
import {
  forgotPassword as apiForgotPassword,
  resetPassword as apiResetPassword
} from "../services/api";

import { useAuth } from "../context/AuthContext";
function Login() {
  const [mode, setMode] = useState("login"); // "login", "forgot", "reset"

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const [, navigate] = useLocation();
  const { login } = useAuth();

  async function handleLoginSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccessMsg("");

    try {
      const user = await login(email, password);

      console.log("Logged in user:", user);

      if (user?.role === "Admin") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      console.error(err);
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }
  async function handleForgotSubmit(e) {
    e.preventDefault();
    if (!email) {
      setError("Please enter your email address.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccessMsg("");

    try {
      const res = await apiForgotPassword(email);
      setSuccessMsg(res.message || "OTP sent to your email.");
      setMode("reset");
    } catch (err) {
      setError(err.message || "Failed to send OTP.");
    } finally {
      setLoading(false);
    }
  }

  async function handleResetSubmit(e) {
    e.preventDefault();
    if (!otp || !password) {
      setError("Please enter the OTP and your new password.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccessMsg("");

    try {
      const res = await apiResetPassword(email, otp, password);
      setSuccessMsg(res.message || "Password successfully reset!");
      setMode("login");
      setPassword("");
      setOtp("");
    } catch (err) {
      setError(err.message || "Failed to reset password.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Side */}
      <div className="hidden md:flex w-1/2 bg-blue-600 relative overflow-hidden items-center justify-center p-10">
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-blue-500 opacity-40 -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full bg-blue-700 opacity-30 translate-y-1/2 -translate-x-1/2" />

        <div className="relative z-10 w-full">
          <div className="w-full h-64 rounded-2xl overflow-hidden bg-gradient-to-b from-blue-400 to-blue-800 flex items-center justify-center mb-6">
            <div className="text-center text-white">
              <div className="text-7xl mb-4">🏛️</div>
              <p className="text-xl font-bold">Apna mohalla</p>
              <p className="text-sm text-blue-200 mt-1">Connect. Manage. Thrive.</p>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 flex items-center gap-3 border border-white/20">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white text-lg">🏢</div>
            <div>
              <p className="text-white font-semibold text-sm">Apna mohalla Platform</p>
              <p className="text-blue-200 text-xs">Empowering campus voices since 2026</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 bg-white">
        <div className="w-full max-w-sm">
          <h1 className="text-3xl font-bold text-gray-900 mb-1">
            {mode === "login" && "Login"}
            {mode === "forgot" && "Forgot Password"}
            {mode === "reset" && "Reset Password"}
          </h1>

          <p className="text-sm text-gray-500 mb-8">
            {mode === "login" && "Access your resident portal and stay connected with the Apna mohalla community."}
            {mode === "forgot" && "Enter your email address to receive a verification code."}
            {mode === "reset" && "Enter the verification code sent to your email along with your new password."}
          </p>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">
              {error}
            </div>
          )}

          {successMsg && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg">
              {successMsg}
            </div>
          )}

          {/* LOGIN FORM */}
          {mode === "login" && (
            <form onSubmit={handleLoginSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">✉</span>
                  <input
                    type="email"
                    placeholder="name@iqra.edu.pk"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-sm font-medium text-gray-700">Password</label>
                </div>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔒</span>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full pl-9 pr-10 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    {showPassword ? "🙈" : "👁️"}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg transition"
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </form>
          )}

          {/* FORGOT PASSWORD FORM */}
          {mode === "forgot" && (
            <form onSubmit={handleForgotSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">✉</span>
                  <input
                    type="email"
                    placeholder="name@iqra.edu.pk"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg transition"
              >
                {loading ? "Sending..." : "Send Verification Code"}
              </button>

              <div className="text-center mt-4">
                <button
                  type="button"
                  onClick={() => { setMode("login"); setError(""); setSuccessMsg(""); }}
                  className="text-sm text-gray-500 hover:text-gray-700 transition"
                >
                  ← Back to Login
                </button>
              </div>
            </form>
          )}

          {/* RESET PASSWORD FORM */}
          {mode === "reset" && (
            <form onSubmit={handleResetSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Verification Code (OTP)</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔑</span>
                  <input
                    type="text"
                    placeholder="123456"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                    maxLength={6}
                    className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">New Password</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔒</span>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full pl-9 pr-10 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    {showPassword ? "🙈" : "👁️"}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg transition"
              >
                {loading ? "Resetting..." : "Reset Password"}
              </button>

              <div className="text-center mt-4">
                <button
                  type="button"
                  onClick={() => { setMode("login"); setError(""); setSuccessMsg(""); setPassword(""); }}
                  className="text-sm text-gray-500 hover:text-gray-700 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          {mode === "login" && (
            <>
              <div className="my-6 flex items-center gap-3">
                <div className="flex-1 h-px bg-gray-200" />
                <span className="text-xs text-gray-400">OR</span>
                <div className="flex-1 h-px bg-gray-200" />
              </div>

              <p className="text-center text-sm text-gray-500">
                New to the community?{" "}
                <Link
                  href="/register"
                  className="text-blue-600 font-semibold hover:underline"
                >
                  Create an account
                </Link>
              </p>
            </>
          )}
        </div>

        <p className="absolute bottom-6 text-xs text-gray-400">
          © 2026 Apna mohalla Community Management. All rights reserved.
        </p>
      </div>
    </div>
  );
}

export default Login;