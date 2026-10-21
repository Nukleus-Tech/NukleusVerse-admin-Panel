function RecordingActionButton({ downloading, onDownload }) {
  return (
    <div className="flex gap-2">
      <button
        className="rounded-lg bg-violet-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
        disabled={downloading}
        onClick={onDownload}
        type="button"
      >
        {downloading ? "Downloading..." : "Download"}
      </button>
    </div>
  );
}

export default RecordingActionButton;
