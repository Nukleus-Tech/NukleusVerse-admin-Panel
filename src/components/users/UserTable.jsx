import { ExternalLink } from "lucide-react";
import UserActionButton from "./UserActionButton";
import UserStatusBadge from "./UserStatusBadge";

function UserTable({ users, onViewUser, onToggleStatus }) {
  return (
    <div className="mt-6 overflow-x-auto rounded-2xl border border-slate-200 bg-white">
      <table className="min-w-full text-left text-sm">
        <thead className="bg-slate-50 text-slate-600">
          <tr>
            <th className="px-5 py-4 font-semibold">User</th>
            <th className="px-5 py-4 font-semibold">Email</th>
            <th className="px-5 py-4 font-semibold">Total Meetings</th>
            <th className="px-5 py-4 font-semibold">Hosted</th>
            <th className="px-5 py-4 font-semibold">Joined</th>
            <th className="px-5 py-4 font-semibold">Last Login</th>
            <th className="px-5 py-4 font-semibold">Status</th>
            <th className="px-5 py-4 font-semibold">Action</th>
          </tr>
        </thead>

        <tbody>
          {users.length > 0 ? (
            users.map((user) => (
              <tr
                key={user.id}
                className="border-t border-slate-100 transition hover:bg-slate-50"
              >
                <td className="px-5 py-4 font-semibold text-slate-900">
                  {user.name}
                </td>

                <td className="px-5 py-4">
                  <a
                    href={`mailto:${user.email}`}
                    className="inline-flex items-center gap-1 text-slate-600 underline decoration-slate-300 underline-offset-4 hover:text-violet-700"
                  >
                    {user.email}
                    <ExternalLink size={13} />
                  </a>
                </td>

                <td className="px-5 py-4 text-slate-700">
                  {user.totalMeetings}
                </td>

                <td className="px-5 py-4 text-slate-700">
                  {user.hosted}
                </td>

                <td className="px-5 py-4 text-slate-700">
                  {user.joined}
                </td>

                <td className="px-5 py-4 text-slate-600">
                  {user.lastLogin}
                </td>

                <td className="px-5 py-4">
                  <UserStatusBadge status={user.status} />
                </td>

                <td className="px-5 py-4">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
                      onClick={() => onViewUser(user.id)}
                    >
                      View
                    </button>
                    <UserActionButton
                      status={user.status}
                      onToggleStatus={() => onToggleStatus(user)}
                    />
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={8}
                className="px-5 py-10 text-center text-sm text-slate-500"
              >
                No users found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default UserTable;
