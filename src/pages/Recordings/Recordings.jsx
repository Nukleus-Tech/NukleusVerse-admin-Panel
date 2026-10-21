import { useEffect, useMemo, useState } from "react";
import {
  Video,
  HardDrive,
  CheckCircle2,
  Clock3,
} from "lucide-react";

import RecordingSearch from "../../components/recordings/RecordingSearch";
import RecordingTable from "../../components/recordings/RecordingTable";
import { getRecordings } from "../../api/recordingsApi";

function formatStatus(status) {
  const normalizedStatus = String(status ?? "Unknown").toLowerCase();
  return normalizedStatus.charAt(0).toUpperCase() + normalizedStatus.slice(1);
}

function formatDate(dateValue) {
  const date = new Date(dateValue);
  return Number.isNaN(date.getTime()) ? (dateValue ?? "—") : date.toLocaleString();
}

function getStorageUsed(recordings) {
  const totalMegabytes = recordings.reduce((total, recording) => {
    const match = String(recording.fileSize).match(/([\d.]+)\s*(KB|MB|GB)/i);

    if (!match) {
      return total;
    }

    const value = Number(match[1]);
    const unit = match[2].toUpperCase();

    if (unit === "GB") return total + value * 1024;
    if (unit === "KB") return total + value / 1024;
    return total + value;
  }, 0);

  return totalMegabytes >= 1024
    ? `${(totalMegabytes / 1024).toFixed(2)} GB`
    : `${totalMegabytes.toFixed(2)} MB`;
}

function Recordings() {
  const [searchTerm, setSearchTerm] = useState("");
  const [recordings, setRecordings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isCurrent = true;

    async function loadRecordings() {
      try {
        const response = await getRecordings();
        console.log("RECORDINGS API RESPONSE:", response);

        const apiRecordings = Array.isArray(response)
          ? response
          : Array.isArray(response?.recordings)
            ? response.recordings
            : Array.isArray(response?.data)
              ? response.data
              : [];

        if (isCurrent) {
          setRecordings(
            apiRecordings.map((recording) => ({
              id: recording.meetingId ?? recording.id,
              title: recording.recordingName ?? "Untitled Recording",
              meeting: recording.meetingName ?? "Untitled Meeting",
              host: recording.hostEmail ?? "Unknown Host",
              duration: recording.duration ?? "—",
              fileSize: recording.fileSize ?? "Not Available",
              created: formatDate(recording.created),
              status: formatStatus(recording.status),
              recordingUrl: recording.recordingUrl ?? null,
            })),
          );
        }
      } catch (requestError) {
        if (isCurrent && requestError.response?.status !== 401) {
          setError(
            requestError.response?.data?.message ||
              "Unable to load recordings.",
          );
        }
      } finally {
        if (isCurrent) {
          setLoading(false);
        }
      }
    }

    loadRecordings();

    return () => {
      isCurrent = false;
    };
  }, []);

  const filteredRecordings = useMemo(() => {
    return recordings.filter(
      (recording) =>
        recording.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        recording.meeting.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [recordings, searchTerm]);

  const available = recordings.filter(
    (r) => r.status === "Available",
  ).length;

  const processing = recordings.filter(
    (r) => r.status === "Processing",
  ).length;

  const cards = [
    {
      label: "Total Recordings",
      value: recordings.length,
      icon: Video,
    },
    {
      label: "Available",
      value: available,
      icon: CheckCircle2,
    },
    {
      label: "Processing",
      value: processing,
      icon: Clock3,
    },
    {
      label: "Storage Used",
      value: getStorageUsed(recordings),
      icon: HardDrive,
    },
  ];

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-semibold text-slate-950">
              Recordings
            </h3>

            <p className="mt-1 text-sm text-slate-600">
              Manage meeting recordings stored on the platform.
            </p>
          </div>

          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-100 text-violet-700">
            <Video size={22} />
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
                <p className="text-sm text-slate-500">{card.label}</p>

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100 text-violet-700">
                  <Icon size={20} />
                </div>
              </div>

              <h2 className="mt-4 text-3xl font-bold">
                {loading ? "—" : card.value}
              </h2>
            </div>
          );
        })}
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <RecordingSearch
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />

          {/* <button className="flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-3 text-sm font-semibold text-white hover:bg-violet-700">
            <Download size={18} />
            Download All
          </button> */}
        </div>

        {loading ? (
          <p className="mt-6 text-sm text-slate-500">Loading recordings...</p>
        ) : error ? (
          <p className="mt-6 text-sm text-red-600">{error}</p>
        ) : (
          <RecordingTable recordings={filteredRecordings} />
        )}
      </section>
    </div>
  );
}

export default Recordings;
