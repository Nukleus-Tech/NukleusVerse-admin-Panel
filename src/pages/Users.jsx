import { useEffect, useMemo, useState } from "react";
import {
  Ban,
  UserRound,
  Users as UsersIcon,
  UserCheck,
  UserPlus,
} from "lucide-react";

import UserSearch from "../components/users/UserSearch";
import UserTable from "../components/users/UserTable";
import {
  blockUser,
  getUserById,
  getUsers,
  unblockUser,
} from "../api/usersApi";

const dummyUsers = [
  {
    id: 1,
    name: "Rajendra",
    email: "rajendra@gmail.com",
    totalMeetings: 10,
    hosted: 4,
    joined: 6,
    lastLogin: "Today 10:42 AM",
    status: "Active",
  },
  {
    id: 2,
    name: "Rahul",
    email: "rahul@gmail.com",
    totalMeetings: 14,
    hosted: 0,
    joined: 14,
    lastLogin: "Yesterday",
    status: "Active",
  },
  {
    id: 3,
    name: "Priya",
    email: "priya@gmail.com",
    totalMeetings: 9,
    hosted: 2,
    joined: 7,
    lastLogin: "2 days ago",
    status: "Blocked",
  },
];

function formatLastLogin(lastLogin) {
  if (!lastLogin || lastLogin === "Never Login") {
    return lastLogin ?? "—";
  }

  const date = new Date(lastLogin);
  return Number.isNaN(date.getTime()) ? lastLogin : date.toLocaleString();
}

function Users() {
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState(dummyUsers);
  const [userCards, setUserCards] = useState(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);

  useEffect(() => {
    let isCurrent = true;

    async function loadUsers() {
      try {
        const data = await getUsers();
        console.log("USERS API RESPONSE:", data);

        if (isCurrent) {
          setUsers(
            (data.users ?? []).map((user) => ({
              id: user.id,
              name: user.name ?? "—",
              email: user.email ?? "—",
              totalMeetings: user.totalMeetings ?? 0,
              hosted: user.hostedMeetings ?? 0,
              joined: user.joinedMeetings ?? 0,
              lastLogin: formatLastLogin(user.lastLogin),
              status:
                user.status === "BLOCKED"
                  ? "Blocked"
                  : user.status === "ACTIVE"
                    ? "Active"
                    : (user.status ?? "—"),
            })),
          );
          setUserCards(data.cards ?? null);
        }
      } catch (requestError) {
        if (isCurrent && requestError.response?.status !== 401) {
          setError(
            requestError.response?.data?.message || "Unable to load users.",
          );
        }
      }
    }

    loadUsers();

    return () => {
      isCurrent = false;
    };
  }, []);

  async function handleViewUser(id) {
    setDetailsLoading(true);
    setError("");
    setMessage("");

    try {
      const data = await getUserById(id);

      if (data.success !== true || !data.user) {
        setError(data.message || "Unable to load user details.");
        return;
      }

      setSelectedUser(data.user);
    } catch (requestError) {
      if (requestError.response?.status !== 401) {
        setError(
          requestError.response?.data?.message ||
            "Unable to load user details.",
        );
      }
    } finally {
      setDetailsLoading(false);
    }
  }

  async function handleToggleStatus(user) {
    const isBlocked = user.status === "Blocked";
    const action = isBlocked ? "unblock" : "block";

    if (!window.confirm(`Are you sure you want to ${action} ${user.name}?`)) {
      return;
    }

    setError("");
    setMessage("");

    try {
      const data = isBlocked
        ? await unblockUser(user.id)
        : await blockUser(user.id);

      if (data.success !== true) {
        setError(data.message || `Unable to ${action} user.`);
        return;
      }

      const nextStatus = isBlocked ? "Active" : "Blocked";

      setUsers((currentUsers) =>
        currentUsers.map((currentUser) =>
          currentUser.id === user.id
            ? { ...currentUser, status: nextStatus }
            : currentUser,
        ),
      );

      setUserCards((currentCards) => {
        if (!currentCards) {
          return currentCards;
        }

        return {
          ...currentCards,
          activeUsers:
            currentCards.activeUsers + (isBlocked ? 1 : -1),
          blockedUsers:
            currentCards.blockedUsers + (isBlocked ? -1 : 1),
        };
      });

      setMessage(data.message);
    } catch (requestError) {
      if (requestError.response?.status !== 401) {
        setError(
          requestError.response?.data?.message ||
            `Unable to ${action} user.`,
        );
      }
    }
  }

  const filteredUsers = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return users.filter(
      (user) =>
        user.name.toLowerCase().includes(normalizedSearch) ||
        user.email.toLowerCase().includes(normalizedSearch),
    );
  }, [searchTerm, users]);

  const activeUsers = users.filter(
    (user) => user.status === "Active",
  ).length;

  const blockedUsers = users.filter(
    (user) => user.status === "Blocked",
  ).length;

  const cards = [
    {
      label: "Total Users",
      value: userCards?.totalUsers ?? users.length,
      icon: UsersIcon,
    },
    {
      label: "Active Users",
      value: userCards?.activeUsers ?? activeUsers,
      icon: UserCheck,
    },
    {
      label: "Blocked Users",
      value: userCards?.blockedUsers ?? blockedUsers,
      icon: Ban,
    },
    {
      label: "New This Week",
      value: userCards?.newThisWeek ?? 2,
      icon: UserPlus,
    },
  ];

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
          <div>
            <h3 className="text-2xl font-semibold text-slate-950">
              Users
            </h3>

            <p className="mt-1 text-sm text-slate-600">
              Manage users and review their meeting activity.
            </p>

            {error ? (
              <p className="mt-2 text-sm text-red-600">{error}</p>
            ) : null}

            {message ? (
              <p className="mt-2 text-sm text-green-600">{message}</p>
            ) : null}
          </div>

          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-100 text-violet-700">
            <UserRound size={24} />
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
                {card.value}
              </h2>
            </div>
          );
        })}
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <UserSearch
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />

        <UserTable
          users={filteredUsers}
          onViewUser={handleViewUser}
          onToggleStatus={handleToggleStatus}
        />
      </section>

      {detailsLoading ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
            <p className="text-sm text-slate-600">Loading user details...</p>
          </div>
        </div>
      ) : selectedUser ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-xl font-semibold text-slate-950">
                  {selectedUser.name ?? "User Details"}
                </h3>
                <p className="mt-1 text-sm text-slate-600">
                  {selectedUser.email ?? "—"}
                </p>
              </div>
              <button
                type="button"
                className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                onClick={() => setSelectedUser(null)}
              >
                Close
              </button>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-xs text-slate-500">Status</p>
                <p className="mt-1 font-semibold text-slate-900">
                  {selectedUser.status ?? "—"}
                </p>
              </div>
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-xs text-slate-500">Last Login</p>
                <p className="mt-1 font-semibold text-slate-900">
                  {formatLastLogin(selectedUser.lastLogin)}
                </p>
              </div>
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-xs text-slate-500">Created At</p>
                <p className="mt-1 font-semibold text-slate-900">
                  {formatLastLogin(selectedUser.createdAt)}
                </p>
              </div>
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-xs text-slate-500">Current Meeting</p>
                <p className="mt-1 break-all font-semibold text-slate-900">
                  {selectedUser.currentMeetingId ?? "—"}
                </p>
              </div>
            </div>

            <div className="mt-6">
              <h4 className="font-semibold text-slate-950">
                Meeting Activity
              </h4>
              <div className="mt-3 grid grid-cols-3 gap-3">
                <div className="rounded-xl border border-slate-200 p-3 text-center">
                  <p className="text-2xl font-bold text-slate-950">
                    {selectedUser.meetingActivity?.totalMeetings ?? 0}
                  </p>
                  <p className="text-xs text-slate-500">Total</p>
                </div>
                <div className="rounded-xl border border-slate-200 p-3 text-center">
                  <p className="text-2xl font-bold text-slate-950">
                    {selectedUser.meetingActivity?.hostedMeetings ?? 0}
                  </p>
                  <p className="text-xs text-slate-500">Hosted</p>
                </div>
                <div className="rounded-xl border border-slate-200 p-3 text-center">
                  <p className="text-2xl font-bold text-slate-950">
                    {selectedUser.meetingActivity?.joinedMeetings ?? 0}
                  </p>
                  <p className="text-xs text-slate-500">Joined</p>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h4 className="font-semibold text-slate-950">Avatar</h4>
              <p className="mt-2 text-sm text-slate-600">
                Status: {selectedUser.avatar?.avatarStatus ?? "—"} · Image:{" "}
                {selectedUser.avatar?.imageAvailable ? "Available" : "Missing"}{" "}
                · Rigged: {selectedUser.avatar?.riggedAvatar ? "Yes" : "No"} ·
                Walking: {selectedUser.avatar?.walkingAvatar ? "Yes" : "No"} ·
                Idle: {selectedUser.avatar?.idleAvatar ? "Yes" : "No"}
              </p>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default Users;
