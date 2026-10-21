function RecordingStatusBadge({ status }) {
  const styles = {
    Available: "bg-green-100 text-green-700",
    Processing: "bg-yellow-100 text-yellow-700",
    Failed: "bg-red-100 text-red-700",
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

export default RecordingStatusBadge;