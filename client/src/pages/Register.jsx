import { useState } from "react";
import api, { setAuthToken, setUser } from "../api/api";
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

      if (res.data.success) {

        // Save auth
        setAuthToken(res.data.token);
        setUser(res.data.user);

        // Go directly to dashboard (AUTO LOGIN)
        navigate("/dashboard");

      } else {

        setError(
          res.data.message ||
          res.data.error ||
          "Registration failed"
        );

      }

    } catch (err) {

      setError(
        err.response?.data?.error ||
        err.message ||
        "Registration failed"
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
            The modern OS for creative professionals.
          </p>

        </div>

      </div>



      {/* DESKTOP LEFT PANEL */}
      <div className="hidden lg:flex lg:w-1/2 auth-header relative overflow-hidden">

        <div className="absolute top-24 left-24 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-float"></div>

        <div className="absolute bottom-24 right-24 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-float"></div>

        <div className="relative z-10 p-16 flex flex-col justify-center text-white animate-fadeIn">

          <h1 className="text-5xl font-bold tracking-tight mb-6">
            Join CreatorOS
          </h1>

          <p className="text-lg opacity-90 max-w-md leading-relaxed">
            Manage clients, projects, and payments in one modern workspace built for creators.
          </p>

        </div>

      </div>



      {/* REGISTER CARD */}
      <div className="flex flex-1 items-center justify-center px-6 py-10 lg:py-0">

        <div className="card w-full max-w-md p-8 sm:p-10 shadow-card animate-slideUp">

          <h2 className="text-2xl font-semibold">
            Create account
          </h2>

          <p className="text-sm text-[rgb(var(--color-text-muted))] mt-1 mb-8">
            Start using CreatorOS today
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
              className="btn-primary w-full"
            >
              {loading ? "Creating account..." : "Create account"}
            </button>


          </form>


          <p className="text-sm text-center text-[rgb(var(--color-text-muted))] mt-6">

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