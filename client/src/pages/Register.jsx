import { useState, useEffect } from "react";
import api from "../api/api";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Redirect if already logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await api.post("/auth/register", form);

      // CHECK SUCCESS
      if (res.data.success) {
        
        // SAVE TOKEN
        localStorage.setItem("token", res.data.token);

        // SAVE USER (optional but recommended)
        localStorage.setItem("user", JSON.stringify(res.data.user));

        // REDIRECT TO DASHBOARD
        navigate("/dashboard", { replace: true });

      } else {
        setError(res.data.message || res.data.error || "Registration failed");
      }

    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Registration failed. Try different email."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-[rgb(var(--color-bg-soft))]">

      {/* LEFT SIDE */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[rgb(var(--color-primary))] to-[rgb(var(--color-accent))]" />
        <div className="relative z-10 p-16 flex flex-col justify-center text-white">
          <h1 className="text-5xl font-bold mb-6 tracking-tight">
            Join CreatorOS
          </h1>
          <p className="text-xl opacity-90 max-w-md leading-relaxed">
            Start managing your creative business with structure and clarity.
          </p>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex w-full lg:w-1/2 items-center justify-center px-6 sm:px-8">

        <div className="card w-full max-w-md p-8 sm:p-10">

          <h2 className="text-2xl font-semibold mb-2">
            Create Account
          </h2>

          <p className="text-sm text-[rgb(var(--color-text-muted))] mb-8">
            Register to get started
          </p>

          {error && (
            <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 p-3 rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-5">

            <div>
              <label className="block text-sm mb-1 text-[rgb(var(--color-text-muted))]">
                Name
              </label>
              <input
                type="text"
                name="name"
                required
                value={form.name}
                onChange={handleChange}
                className="input"
              />
            </div>

            <div>
              <label className="block text-sm mb-1 text-[rgb(var(--color-text-muted))]">
                Email
              </label>
              <input
                type="email"
                name="email"
                required
                value={form.email}
                onChange={handleChange}
                className="input"
              />
            </div>

            <div>
              <label className="block text-sm mb-1 text-[rgb(var(--color-text-muted))]">
                Password
              </label>
              <input
                type="password"
                name="password"
                required
                value={form.password}
                onChange={handleChange}
                className="input"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full disabled:opacity-60"
            >
              {loading ? "Creating account..." : "Register"}
            </button>

          </form>

          <p className="text-sm text-[rgb(var(--color-text-muted))] mt-6">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-[rgb(var(--color-primary))] font-medium hover:underline"
            >
              Sign in
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
}