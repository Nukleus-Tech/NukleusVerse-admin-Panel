
import { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  CalendarCheck,
  Radio,
  CheckCircle2,
  CalendarClock,
} from "lucide-react";
import MeetingSearch from "../../components/meetings/MeetingSearch";
import MeetingTable from "../../components/meetings/MeetingTable";
import { getMeetingById, getMeetings } from "../../api/meetingsApi";

function formatDateTime(dateValue) {
  if (!dateValue) {
    return "—";
  }

  const date = new Date(dateValue);
  return Number.isNaN(date.getTime()) ? dateValue : date.toLocaleString();
}

function Meetings() {
  const [meetings, setMeetings] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const fetchMeetings = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getMeetings();

        console.log("MEETINGS API RESPONSE:", response);

        const apiMeetings = Array.isArray(response)
          ? response
          : response?.meetings || response?.data || [];

        const normalizedMeetings = apiMeetings.map((meeting) => {
          const backendStatus = String(
            meeting.status || "UNKNOWN"
          ).toUpperCase();

          let displayStatus = "Scheduled";

          if (backendStatus === "ACTIVE" || backendStatus === "LIVE") {
            displayStatus = "Live";
          } else if (
            backendStatus === "ENDED" ||
            backendStatus === "COMPLETED"
          ) {
            displayStatus = "Completed";
          } else if (
            backendStatus === "CANCELLED" ||
            backendStatus === "CANCELED"
          ) {
            displayStatus = "Cancelled";
          }

          const participantEmails = Array.isArray(
            meeting.participantEmails
          )
            ? meeting.participantEmails
            : [];

          return {
            ...meeting,

            id:
              meeting.id ||
              meeting.meetingId ||
              meeting.roomCode,

            meetingId:
              meeting.meetingId ||
              meeting.id,

            title:
              meeting.meetingName ||
              meeting.title ||
              "Untitled Meeting",

            meetingName:
              meeting.meetingName ||
              meeting.title ||
              "Untitled Meeting",

            host:
              meeting.hostEmail ||
              meeting.host ||
              "Unknown Host",

            hostEmail:
              meeting.hostEmail ||
              meeting.host ||
              "",

            roomCode:
              meeting.roomCode ||
              "—",

            status: displayStatus,

            backendStatus,

            participantEmails,

            participants:
              meeting.participants ??
              meeting.participantCount ??
              participantEmails.length,

            createdAt:
              meeting.createdAt ||
              meeting.startTime ||
              meeting.date ||
              null,

            endedAt:
              meeting.endedAt ||
              meeting.endTime ||
              null,
          };
        });

        if (isMounted) {
          setMeetings(normalizedMeetings);
        }
      } catch (error) {
        console.error("Meetings request failed", {
          message: error.message,
          code: error.code,
          status: error.response?.status,
          responseData: error.response?.data,
          hasResponse: Boolean(error.response),
          hasRequest: Boolean(error.request),
          requestUrl: error.config
            ? `${error.config.baseURL || ""}${error.config.url || ""}`
            : null,
          requestConfig: error.config
            ? {
                method: error.config.method,
                baseURL: error.config.baseURL,
                url: error.config.url,
                hasAuthorization: Boolean(
                  error.config.headers?.Authorization,
                ),
              }
            : null,
        });

        if (isMounted) {
          setError(
            error.response?.data?.message ||
              (error.response
                ? `Unable to load meetings (${error.response.status}).`
                : "Unable to connect to the meetings service. Please check your connection and try again.")
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchMeetings();

    return () => {
      isMounted = false;
    };
  }, []);

  async function handleViewMeeting(meetingId) {
    setDetailsLoading(true);
    setError("");

    try {
      const response = await getMeetingById(meetingId);
      const meeting = response?.meeting ?? response?.data ?? response;

      if (!meeting || typeof meeting !== "object") {
        setError(response?.message || "Unable to load meeting details.");
        return;
      }

      setSelectedMeeting(meeting);
    } catch (requestError) {
      if (requestError.response?.status !== 401) {
        setError(
          requestError.response?.data?.message ||
            "Unable to load meeting details.",
        );
      }
    } finally {
      setDetailsLoading(false);
    }
  }

  const filteredMeetings = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    if (!query) {
      return meetings;
    }

    return meetings.filter((meeting) => {
      return (
        meeting.title?.toLowerCase().includes(query) ||
        meeting.host?.toLowerCase().includes(query) ||
        meeting.hostEmail?.toLowerCase().includes(query) ||
        meeting.roomCode?.toLowerCase().includes(query) ||
        meeting.status?.toLowerCase().includes(query)
      );
    });
  }, [meetings, searchTerm]);

  const meetingStats = useMemo(() => {
    const today = new Date();

    const isToday = (dateValue) => {
      if (!dateValue) {
        return false;
      }

      const meetingDate = new Date(dateValue);

      if (Number.isNaN(meetingDate.getTime())) {
        return false;
      }

      return (
        meetingDate.getFullYear() === today.getFullYear() &&
        meetingDate.getMonth() === today.getMonth() &&
        meetingDate.getDate() === today.getDate()
      );
    };

    return {
      total: meetings.length,

      live: meetings.filter(
        (meeting) => meeting.status === "Live"
      ).length,

      completed: meetings.filter(
        (meeting) => meeting.status === "Completed"
      ).length,

      today: meetings.filter((meeting) =>
        isToday(meeting.createdAt)
      ).length,
    };
  }, [meetings]);

  const cards = [
    {
      label: "Total Meetings",
      value: meetingStats.total,
      icon: CalendarDays,
    },
    {
      label: "Live Meetings",
      value: meetingStats.live,
      icon: Radio,
    },
    {
      label: "Completed",
      value: meetingStats.completed,
      icon: CheckCircle2,
    },
    {
      label: "Today's Meetings",
      value: meetingStats.today,
      icon: CalendarClock,
    },
  ];

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
          <div>
            <h3 className="text-2xl font-semibold text-slate-950">
              Meetings
            </h3>

            <p className="mt-1 text-sm text-slate-600">
              Monitor live, scheduled, and completed VR meeting sessions.
            </p>
          </div>

          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-100 text-violet-700">
            <CalendarCheck size={24} />
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon;

          return (
            <div
              key={card.label}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-slate-500">
                  {card.label}
                </p>

                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-700">
                  <Icon size={20} />
                </span>
              </div>

              <h2 className="mt-4 text-3xl font-bold text-slate-950">
                {loading ? "—" : card.value}
              </h2>
            </div>
          );
        })}
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
          <MeetingSearch
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />

          <div className="text-sm text-slate-500">
            {loading
              ? "Loading meetings..."
              : `Showing ${filteredMeetings.length} of ${meetings.length} meetings`}
          </div>
        </div>

        {error && (
          <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
            <p className="text-sm font-medium text-red-600">
              {error}
            </p>
          </div>
        )}

        {!error && (
          <MeetingTable
            meetings={filteredMeetings}
            loading={loading}
            onViewMeeting={handleViewMeeting}
          />
        )}
      </section>

      {detailsLoading ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4">
          <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl">
            <p className="text-sm text-slate-600">Loading meeting details...</p>
          </div>
        </div>
      ) : selectedMeeting ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4">
          <div className="max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-xl font-semibold text-slate-950">
                  {selectedMeeting.meetingName ?? selectedMeeting.title ?? "Meeting Details"}
                </h3>
                <p className="mt-1 text-sm text-slate-600">
                  {selectedMeeting.hostEmail ?? selectedMeeting.host ?? "—"}
                </p>
              </div>
              <button
                type="button"
                className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                onClick={() => setSelectedMeeting(null)}
              >
                Close
              </button>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-xs text-slate-500">Meeting ID</p>
                <p className="mt-1 break-all font-semibold text-slate-900">
                  {selectedMeeting.meetingId ?? selectedMeeting.id ?? "—"}
                </p>
              </div>
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-xs text-slate-500">Room Code</p>
                <p className="mt-1 font-semibold text-slate-900">
                  {selectedMeeting.roomCode ?? "—"}
                </p>
              </div>
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-xs text-slate-500">Status</p>
                <p className="mt-1 font-semibold text-slate-900">
                  {selectedMeeting.status ?? "—"}
                </p>
              </div>
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-xs text-slate-500">Participants</p>
                <p className="mt-1 font-semibold text-slate-900">
                  {selectedMeeting.participants ??
                    selectedMeeting.participantCount ??
                    selectedMeeting.participantEmails?.length ??
                    0}
                </p>
              </div>
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-xs text-slate-500">Started</p>
                <p className="mt-1 font-semibold text-slate-900">
                  {formatDateTime(
                    selectedMeeting.startedAt ??
                      selectedMeeting.startTime ??
                      selectedMeeting.createdAt,
                  )}
                </p>
              </div>
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-xs text-slate-500">Ended</p>
                <p className="mt-1 font-semibold text-slate-900">
                  {formatDateTime(
                    selectedMeeting.endedAt ?? selectedMeeting.endTime,
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default Meetings;
