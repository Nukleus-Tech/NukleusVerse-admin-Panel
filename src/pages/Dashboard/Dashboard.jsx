import {
  CalendarClock,
  FileText,
  Radio,
  Users,
  Video,
  Activity,
} from "lucide-react";
import { useEffect, useState } from "react";
import { getDashboardData } from "../../api/dashboardApi";

const fallbackStats = [
  { label: "Total Users", value: "152", icon: Users },
  { label: "Active Users", value: "24", icon: Radio },
  { label: "Total Meetings", value: "67", icon: CalendarClock },
  { label: "Recordings", value: "34", icon: Video },
  { label: "Notes", value: "89", icon: FileText },
];

const fallbackRecentMeetings = [
  { name: "Weekly Team Sync", host: "Admin", status: "Completed" },
  { name: "Client Demo Room", host: "Atul", status: "Active" },
  { name: "Design Review", host: "Nukleus Team", status: "Completed" },
];

function Dashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let isCurrent = true;

    async function loadDashboard() {
      try {
        const data = await getDashboardData();
        console.log("DASHBOARD API RESPONSE:", data);

        if (isCurrent) {
          setDashboardData(data);
        }
      } catch (requestError) {
        if (isCurrent && requestError.response?.status !== 401) {
          setError(
            requestError.response?.data?.message ||
              "Unable to load the latest dashboard data.",
          );
        }
      }
    }

    loadDashboard();

    return () => {
      isCurrent = false;
    };
  }, []);

  const cards = dashboardData?.cards;
  const stats = fallbackStats.map((stat) => {
    const values = {
      "Total Users": cards?.totalUsers,
      "Active Users": cards?.activeUsers,
      "Total Meetings": cards?.totalMeetings,
      Recordings: cards?.recordings,
      Notes: cards?.notes,
    };

    return { ...stat, value: values[stat.label] ?? stat.value };
  });
  const activities = dashboardData?.activities ?? [
    "New user joined meeting room.",
    "Recording generated successfully.",
    "PDF summary created for meeting.",
  ];
  const recentMeetings =
    dashboardData?.recentMeetings?.map((meeting) => ({
      name: meeting.meetingName ?? "Untitled meeting",
      host: meeting.hostEmail ?? "Unknown",
      status: meeting.status ?? "Unknown",
    })) ?? fallbackRecentMeetings;

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-200">
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="mt-1 text-sm text-slate-500">
          Overview of NukleusVerse users, meetings, recordings and notes.
        </p>
        {error ? (
          <p className="mt-2 text-sm text-red-600">{error}</p>
        ) : null}
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.label}
              className="rounded-2xl bg-white p-5 shadow-sm border border-slate-200"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-500">{stat.label}</p>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100 text-violet-700">
                  <Icon size={20} />
                </div>
              </div>
              <h2 className="mt-5 text-3xl font-bold text-slate-900">
                {stat.value}
              </h2>
            </div>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-200">
          <div className="flex items-center gap-2">
            <Activity size={20} className="text-violet-600" />
            <h2 className="text-lg font-semibold text-slate-900">
              Recent Activity
            </h2>
          </div>

          <div className="mt-5 space-y-4">
            {activities.map((activity) => (
              <p key={activity} className="text-sm text-slate-600">
                {activity}
              </p>
            ))}
          </div>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-200">
          <h2 className="text-lg font-semibold text-slate-900">
            Recent Meetings
          </h2>

          <div className="mt-5 space-y-3">
            {recentMeetings.map((meeting, index) => (
              <div
                key={`${meeting.name}-${meeting.host}-${index}`}
                className="flex items-center justify-between rounded-xl border border-slate-200 p-4"
              >
                <div>
                  <p className="font-medium text-slate-900">{meeting.name}</p>
                  <p className="text-sm text-slate-500">Host: {meeting.host}</p>
                </div>

                <span className="rounded-full bg-violet-100 px-3 py-1 text-xs font-medium text-violet-700">
                  {meeting.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
