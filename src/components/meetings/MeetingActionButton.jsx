function MeetingActionButton({ onClick }) {
  return (
    <button
      className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold hover:bg-slate-50"
      onClick={onClick}
      type="button"
    >
      View
    </button>
  );
}

export default MeetingActionButton;
