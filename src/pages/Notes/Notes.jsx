import { useEffect, useMemo, useState } from "react";
import { FileText, NotebookText, CalendarClock, UserRound } from "lucide-react";
import NotesSearch from "../../components/notes/NotesSearch";
import { getNotes, getNotesByMeetingId } from "../../api/notesApi";

function formatDate(dateValue) {
  const date = new Date(dateValue);
  return Number.isNaN(date.getTime()) ? (dateValue ?? "—") : date.toLocaleString();
}

function Notes() {
  const [searchTerm, setSearchTerm] = useState("");
  const [notes, setNotes] = useState([]);
  const [noteCards, setNoteCards] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isCurrent = true;

    async function loadNotes() {
      try {
        const response = await getNotes();
        console.log("NOTES API RESPONSE:", response);

        const apiNotes = Array.isArray(response)
          ? response
          : Array.isArray(response?.notes)
            ? response.notes
            : Array.isArray(response?.data)
              ? response.data
              : [];

        if (isCurrent) {
          setNotes(
            apiNotes.map((note) => ({
              id: note.meetingId ?? note.id,
              meetingId: note.meetingId ?? note.id,
              meeting: note.meetingName ?? "Untitled Meeting",
              host: note.hostEmail ?? "Unknown Host",
              note: note.notesPreview ?? "—",
              created: formatDate(note.created),
              notesUrl: note.notesUrl ?? null,
            })),
          );
          setNoteCards(response?.cards ?? null);
        }
      } catch (requestError) {
        if (isCurrent && requestError.response?.status !== 401) {
          setError(
            requestError.response?.data?.message || "Unable to load notes.",
          );
        }
      } finally {
        if (isCurrent) {
          setLoading(false);
        }
      }
    }

    loadNotes();

    return () => {
      isCurrent = false;
    };
  }, []);

  async function handleViewNotes(meetingId) {
    const notesWindow = window.open("", "_blank");

    if (!notesWindow) {
      setError("Please allow pop-ups to view notes.");
      return;
    }

    notesWindow.opener = null;

    try {
      const response = await getNotesByMeetingId(meetingId);
      const note = response?.notes ?? response?.data ?? response;

      if (note?.notesUrl) {
        notesWindow.location.replace(note.notesUrl);
      } else {
        notesWindow.close();
        setError("Notes file is not available.");
      }
    } catch (requestError) {
      notesWindow.close();

      if (requestError.response?.status !== 401) {
        setError(
          requestError.response?.data?.message || "Unable to load notes.",
        );
      }
    }
  }

  const filteredNotes = useMemo(() => {
    return notes.filter(
      (note) =>
        note.meeting.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.host.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.note.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [notes, searchTerm]);

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-semibold text-slate-950">
              Meeting Notes
            </h3>
            <p className="mt-1 text-sm text-slate-600">
              View raw notes captured during VR meetings.
            </p>
          </div>

          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-100 text-violet-700">
            <NotebookText size={22} />
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <FileText className="text-violet-700" size={22} />
          <p className="mt-3 text-sm text-slate-500">Total Notes</p>
          <h2 className="mt-1 text-3xl font-bold">
            {loading ? "—" : (noteCards?.totalNotes ?? notes.length)}
          </h2>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <CalendarClock className="text-violet-700" size={22} />
          <p className="mt-3 text-sm text-slate-500">Today</p>
          <h2 className="mt-1 text-3xl font-bold">
            {loading ? "—" : (noteCards?.today ?? 0)}
          </h2>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <UserRound className="text-violet-700" size={22} />
          <p className="mt-3 text-sm text-slate-500">Hosts</p>
          <h2 className="mt-1 text-3xl font-bold">
            {loading
              ? "—"
              : (noteCards?.hosts ?? new Set(notes.map((note) => note.host)).size)}
          </h2>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <NotesSearch searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

        {loading ? (
          <p className="mt-6 text-sm text-slate-500">Loading notes...</p>
        ) : error ? (
          <p className="mt-6 text-sm text-red-600">{error}</p>
        ) : null}

        {!loading && !error ? (
          <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="px-5 py-4">Meeting</th>
                <th className="px-5 py-4">Host</th>
                <th className="px-5 py-4">Notes Preview</th>
                <th className="px-5 py-4">Created</th>
                <th className="px-5 py-4">Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredNotes.map((note) => (
                <tr key={note.id} className="border-t border-slate-100 hover:bg-slate-50">
                  <td className="px-5 py-4 font-semibold text-slate-900">
                    {note.meeting}
                  </td>
                  <td className="px-5 py-4">{note.host}</td>
                  <td className="px-5 py-4 text-slate-600">{note.note}</td>
                  <td className="px-5 py-4 text-slate-600">{note.created}</td>
                  <td className="px-5 py-4">
                    <button
                      className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold hover:bg-slate-50"
                      onClick={() => handleViewNotes(note.meetingId)}
                      type="button"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        ) : null}
      </section>
    </div>
  );
}

export default Notes;
