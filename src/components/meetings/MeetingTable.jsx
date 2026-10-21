import MeetingStatusBadge from "./MeetingStatusBadge";
import RecordingStatusBadge from "./RecordingStatusBadge";
import SummaryStatusBadge from "./SummaryStatusBadge";
import MeetingActionButton from "./MeetingActionButton";

function MeetingTable({ meetings, onViewMeeting }) {
  return (
    <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <table className="min-w-full text-left text-sm">
        <thead className="bg-slate-50">
          <tr>
            <th className="px-5 py-4 font-semibold text-slate-600">
              Meeting
            </th>

            <th className="px-5 py-4 font-semibold text-slate-600">
              Host
            </th>

            <th className="px-5 py-4 font-semibold text-slate-600">
              Participants
            </th>

            <th className="px-5 py-4 font-semibold text-slate-600">
              Started
            </th>

            <th className="px-5 py-4 font-semibold text-slate-600">
              Duration
            </th>

            <th className="px-5 py-4 font-semibold text-slate-600">
              Status
            </th>

            <th className="px-5 py-4 font-semibold text-slate-600">
              Recording
            </th>

            <th className="px-5 py-4 font-semibold text-slate-600">
              Summary
            </th>

            <th className="px-5 py-4 font-semibold text-slate-600">
              Action
            </th>
          </tr>
        </thead>

        <tbody>
          {meetings.map((meeting) => (
            <tr
              key={meeting.id}
              className="border-t border-slate-100 hover:bg-slate-50"
            >
              <td className="px-5 py-4 font-semibold text-slate-900">
                {meeting.title}
              </td>

              <td className="px-5 py-4">
                {meeting.host}
              </td>

              <td className="px-5 py-4">
                {meeting.participants}
              </td>

              <td className="px-5 py-4">
                {meeting.started}
              </td>

              <td className="px-5 py-4">
                {meeting.duration}
              </td>

              <td className="px-5 py-4">
                <MeetingStatusBadge
                  status={meeting.status}
                />
              </td>

              <td className="px-5 py-4">
                <RecordingStatusBadge
                  status={meeting.recording}
                />
              </td>

              <td className="px-5 py-4">
                <SummaryStatusBadge
                  status={meeting.summary}
                />
              </td>

              <td className="px-5 py-4">
                <MeetingActionButton
                  onClick={() => onViewMeeting(meeting.meetingId)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default MeetingTable;
