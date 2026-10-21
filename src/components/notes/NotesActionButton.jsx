function NotesActionButton() {
  return (
    <div className="flex gap-2">
      <button className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold hover:bg-slate-50">
        View
      </button>

      <button className="rounded-lg bg-violet-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-violet-700">
        Download PDF
      </button>
    </div>
  );
}

export default NotesActionButton;