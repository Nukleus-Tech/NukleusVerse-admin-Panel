function UserStatusBadge({ status }) {
  const isBlocked = status === "Blocked";

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-semibold ${
        isBlocked
          ? "bg-red-100 text-red-700"
          : "bg-green-100 text-green-700"
      }`}
    >
      {status}
    </span>
  );
}

export default UserStatusBadge;