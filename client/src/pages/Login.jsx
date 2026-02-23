import { useState } from "react";
import api, { setAuthToken, setUser } from "../api/api";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {

  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");


  const handleChange = (e) => {

    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

  };


  const handleLogin = async (e) => {

    e.preventDefault();

    setError("");
    setLoading(true);

    try {

      const res = await api.post("/auth/login", form);

      if (res.data.success) {

        // Save auth token
        setAuthToken(res.data.token);

        // Save user data
        setUser(res.data.user);

        // Go to dashboard
        navigate("/dashboard");

      } else {

        setError(
          res.data.message ||
          res.data.error ||
          "Login failed"
        );

      }

    } catch (err) {

      setError(
        err.response?.data?.error ||
        err.message ||
        "Invalid email or password"
      );

    } finally {

      setLoading(false);

    }

  };


  return (

    <div className="min-h-screen flex flex-col lg:flex-row bg-[rgb(var(--color-bg-soft))] auth-glow">


      {/* MOBILE HEADER */}
      <div className="lg:hidden auth-header px-6 pt-16 pb-20 text-white relative overflow-hidden">

        <div className="absolute -top-32 -right-32 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-float"></div>

        <div className="relative z-10 animate-fadeIn">

          <h1 className="text-3xl font-bold tracking-tight">
            CreatorOS
          </h1>

          <p className="mt-2 text-sm opacity-90 max-w-xs">
            Welcome back.
          </p>

        </div>

      </div>



      {/* DESKTOP LEFT PANEL */}
      <div className="hidden lg:flex lg:w-1/2 auth-header relative overflow-hidden">

        <div className="absolute top-24 left-24 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-float"></div>

        <div className="absolute bottom-24 right-24 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-float"></div>

        <div className="relative z-10 p-16 flex flex-col justify-center text-white animate-fadeIn">

          <h1 className="text-5xl font-bold tracking-tight mb-6">
            Welcome back
          </h1>

          <p className="text-lg opacity-90 max-w-md leading-relaxed">
            Log in to manage your clients, projects, and payments.
          </p>

        </div>

      </div>



      {/* LOGIN CARD */}
      <div className="flex flex-1 items-center justify-center px-6 py-10 lg:py-0">

        <div className="card w-full max-w-md p-8 sm:p-10 shadow-card animate-slideUp">

          <h2 className="text-2xl font-semibold">
            Sign in
          </h2>

          <p className="text-sm text-[rgb(var(--color-text-muted))] mt-1 mb-8">
            Enter your credentials
          </p>


          {error && (
            <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 p-3 rounded-lg">
              {error}
            </div>
          )}


          <form onSubmit={handleLogin} className="space-y-5">


            {/* Email */}
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
                placeholder="john@example.com"
              />

            </div>



            {/* Password */}
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
                placeholder="••••••••"
              />

            </div>



            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>


          </form>


          <p className="text-sm text-center text-[rgb(var(--color-text-muted))] mt-6">

            Don’t have an account?{" "}

            <Link
              to="/register"
              className="text-[rgb(var(--color-primary))] font-medium hover:underline"
            >
              Create account
            </Link>

          </p>

        </div>

      </div>

    </div>

  );

}