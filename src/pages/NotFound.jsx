import { Link } from "react-router-dom";

function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <section className="max-w-md rounded-lg border border-slate-200 bg-white p-8 text-center shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-wide text-violet-600">
          404
        </p>
        <h1 className="mt-2 text-2xl font-semibold text-slate-950">
          Page not found
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          The route you opened does not exist in the admin panel.
        </p>
        <Link
          className="mt-6 inline-flex rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-violet-700"
          to="/dashboard"
        >
          Go to dashboard
        </Link>
      </section>
    </main>
  );
}

export default NotFound;
