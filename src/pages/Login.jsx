import { LockKeyhole, LogIn, Mail } from "lucide-react";
import { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import nukleusLogo from "../assets/nukleus-logo.png";
import useAuth from "../hooks/useAuth";

function Login() {
  const { isAuthenticated, login } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [email, setEmail] = useState("admin@nukleus.work");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const redirectTo = location.state?.from?.pathname || "/dashboard";

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    console.log("LOGIN BUTTON CLICKED");
    setError("");
    setIsSubmitting(true);

    const result = await login(email, password);

    if (!result.success) {
      setError(result.message);
      setIsSubmitting(false);
      return;
    }

    setIsSubmitting(false);
    navigate(redirectTo, { replace: true });
  }

  return (
    <main className="flex min-h-screen bg-slate-100">
      <section className="hidden min-h-screen w-[44%] flex-col justify-between bg-slate-950 p-10 text-white lg:flex">
        <div className="flex items-center gap-3">
          <img
            src={nukleusLogo}
            alt="Nukleus logo"
            width={44}
            height={44}
            className="h-11 w-11 shrink-0 object-contain"
          />
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-violet-200">
              NukleusVerse
            </p>
            <h1 className="text-lg font-semibold">Admin Panel</h1>
          </div>
        </div>

        <div className="max-w-md">
          <p className="text-sm font-medium uppercase tracking-wide text-violet-200">
          NukleusVerse Meeting Platform
          </p>
          <h2 className="mt-4 text-4xl font-semibold leading-tight">
            Monitor users, meetings, recordings, and AI summaries.
          </h2>
          <p className="mt-5 text-sm leading-6 text-slate-300">
            Secure admin access for managing the operational side of the
            NukleusVerse meeting experience.
          </p>
        </div>

        <div className="rounded-lg border border-slate-800 bg-slate-900/70 p-4 text-sm text-slate-300">
          Secure backend authentication is active.
        </div>
      </section>

      <section className="flex flex-1 items-center justify-center px-4 py-10">
        <form
          className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-8 shadow-sm"
          onSubmit={handleSubmit}
        >
          <div className="mb-8">
            <p className="text-sm font-semibold uppercase tracking-wide text-violet-600">
              Admin Login
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-950">
              Welcome back
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Sign in to access the NukleusVerse admin console.
            </p>
          </div>

          <div className="space-y-4">
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Email</span>
              <div className="mt-2 flex items-center gap-3 rounded-lg border border-slate-200 bg-white px-3 py-2.5 focus-within:border-violet-500 focus-within:ring-2 focus-within:ring-violet-100">
                <Mail className="text-slate-400" size={18} />
                <input
                  className="w-full border-0 bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="admin@nukleus.work"
                  type="email"
                  value={email}
                />
              </div>
            </label>

            <label className="block">
              <span className="text-sm font-medium text-slate-700">
                Password
              </span>
              <div className="mt-2 flex items-center gap-3 rounded-lg border border-slate-200 bg-white px-3 py-2.5 focus-within:border-violet-500 focus-within:ring-2 focus-within:ring-violet-100">
                <LockKeyhole className="text-slate-400" size={18} />
                <input
                  className="w-full border-0 bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Enter admin password"
                  type="password"
                  value={password}
                />
              </div>
            </label>

            {error ? (
              <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700">
                {error}
              </div>
            ) : null}

            <button
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-70"
              disabled={isSubmitting}
              type="submit"
            >
              <LogIn size={18} />
              {isSubmitting ? "Signing in..." : "Sign in"}
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}

export default Login;
