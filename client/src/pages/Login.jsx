import { useState, useEffect } from "react";
import api from "../api/api";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Redirect if already logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await api.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      window.location.href = "/dashboard";
    } catch {
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-[rgb(var(--color-bg-soft))]">

      {/* LEFT SIDE - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[rgb(var(--color-primary))] to-[rgb(var(--color-accent))]" />
        <div className="relative z-10 p-16 flex flex-col justify-center text-white">
          <h1 className="text-5xl font-bold mb-6 tracking-tight">
            CreatorOS
          </h1>
          <p className="text-xl opacity-90 max-w-md leading-relaxed">
            The operating system for creative professionals.
            Manage clients, projects and payments in one place.
          </p>
        </div>
      </div>

      {/* RIGHT SIDE - Login Card */}
      <div className="flex w-full lg:w-1/2 items-center justify-center px-6 sm:px-8">

        <div className="card w-full max-w-md p-8 sm:p-10">

          <h2 className="text-2xl font-semibold mb-2">
            Sign in
          </h2>

          <p className="text-sm text-[rgb(var(--color-text-muted))] mb-8">
            Access your dashboard
          </p>

          {error && (
            <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 p-3 rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">

            <div>
              <label className="block text-sm mb-1 text-[rgb(var(--color-text-muted))]">
                Email
              </label>
              <input
                type="email"
                required
                className="input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm mb-1 text-[rgb(var(--color-text-muted))]">
                Password
              </label>
              <input
                type="password"
                required
                className="input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full disabled:opacity-60"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>

          </form>

          <p className="text-sm text-[rgb(var(--color-text-muted))] mt-6">
            Don’t have an account?{" "}
            <Link
              to="/register"
              className="text-[rgb(var(--color-primary))] font-medium hover:underline"
            >
              Create one
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
}