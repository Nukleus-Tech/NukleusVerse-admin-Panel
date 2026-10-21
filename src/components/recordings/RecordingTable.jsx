import RecordingActionButton from "./RecordingActionButton";
import RecordingStatusBadge from "./RecordingStatusBadge";

function RecordingTable({ downloadingId, onDownload, recordings }) {
  return (
    <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <table className="min-w-full text-left text-sm">
        <thead className="bg-slate-50 text-slate-600">
          <tr>
            <th className="px-5 py-4">Recording</th>
            <th className="px-5 py-4">Meeting</th>
            <th className="px-5 py-4">Host</th>
            <th className="px-5 py-4">Duration</th>
            <th className="px-5 py-4">File Size</th>
            <th className="px-5 py-4">Created</th>
            <th className="px-5 py-4">Status</th>
            <th className="px-5 py-4">Action</th>
          </tr>
        </thead>

        <tbody>
          {recordings.map((recording) => (
            <tr
              key={recording.id}
              className="border-t border-slate-100 hover:bg-slate-50"
            >
              <td className="px-5 py-4 font-semibold text-slate-900">
                {recording.title}
              </td>
              <td className="px-5 py-4">{recording.meeting}</td>
              <td className="px-5 py-4">{recording.host}</td>
              <td className="px-5 py-4">{recording.duration}</td>
              <td className="px-5 py-4">{recording.fileSize}</td>
              <td className="px-5 py-4 text-slate-600">{recording.created}</td>
              <td className="px-5 py-4">
                <RecordingStatusBadge status={recording.status} />
              </td>
              <td className="px-5 py-4">
                <RecordingActionButton
                  downloading={downloadingId === recording.id}
                  onDownload={() => onDownload(recording.id)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default RecordingTable;
