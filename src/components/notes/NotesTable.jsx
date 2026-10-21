import EmailStatusBadge from "./EmailStatusBadge";
import NotesActionButton from "./NotesActionButton";
import SummaryStatusBadge from "./SummaryStatusBadge";

function NotesTable({ notes }) {
  return (
    <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <table className="min-w-full text-left text-sm">
        <thead className="bg-slate-50 text-slate-600">
          <tr>
            <th className="px-5 py-4">Meeting</th>
            <th className="px-5 py-4">Host</th>
            <th className="px-5 py-4">Summary</th>
            <th className="px-5 py-4">PDF</th>
            <th className="px-5 py-4">Host Email</th>
            <th className="px-5 py-4">Participants Email</th>
            <th className="px-5 py-4">Action</th>
          </tr>
        </thead>

        <tbody>
          {notes.map((note) => (
            <tr key={note.id} className="border-t border-slate-100 hover:bg-slate-50">
              <td className="px-5 py-4 font-semibold text-slate-900">{note.meeting}</td>
              <td className="px-5 py-4">{note.host}</td>
              <td className="px-5 py-4">
                <SummaryStatusBadge status={note.summaryStatus} />
              </td>
              <td className="px-5 py-4">{note.pdfStatus}</td>
              <td className="px-5 py-4">
                <EmailStatusBadge status={note.hostEmailStatus} />
              </td>
              <td className="px-5 py-4">
                <EmailStatusBadge status={note.participantEmailStatus} />
              </td>
              <td className="px-5 py-4">
                <NotesActionButton />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default NotesTable;