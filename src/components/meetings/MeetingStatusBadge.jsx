function MeetingStatusBadge({ status }) {
  const styles = {
    Live: "bg-green-100 text-green-700",
    Completed: "bg-violet-100 text-violet-700",
    Scheduled: "bg-yellow-100 text-yellow-700",
    Cancelled: "bg-red-100 text-red-700",
  };

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-semibold ${
        styles[status] || "bg-slate-100 text-slate-700"
      }`}
    >
      {status}
    </span>
  );
}

export default MeetingStatusBadge;