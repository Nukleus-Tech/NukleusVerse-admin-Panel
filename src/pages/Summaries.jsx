import { Bot, FileText, Mail, Sparkles } from "lucide-react";

function Summaries() {
  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-semibold text-slate-950">
              AI Summaries
            </h3>
            <p className="mt-1 text-sm text-slate-600">
              AI-generated summaries, PDF reports, and email delivery tracking
              will be connected later.
            </p>
          </div>

          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-100 text-violet-700">
            <Bot size={22} />
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <Sparkles className="text-violet-700" size={22} />
          <p className="mt-3 text-sm text-slate-500">AI Summaries</p>
          <h2 className="mt-1 text-3xl font-bold">Coming Soon</h2>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <FileText className="text-violet-700" size={22} />
          <p className="mt-3 text-sm text-slate-500">PDF Reports</p>
          <h2 className="mt-1 text-3xl font-bold">Coming Soon</h2>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <Mail className="text-violet-700" size={22} />
          <p className="mt-3 text-sm text-slate-500">Email Delivery</p>
          <h2 className="mt-1 text-3xl font-bold">Coming Soon</h2>
        </div>
      </section>
    </div>
  );
}

export default Summaries;