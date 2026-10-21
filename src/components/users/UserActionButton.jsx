function UserActionButton({ status, onToggleStatus }) {
  const isBlocked = status === "Blocked";

  return (
    <button
      onClick={onToggleStatus}
      className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
        isBlocked
          ? "border border-green-200 bg-green-50 text-green-700 hover:bg-green-100"
          : "border border-red-200 bg-red-50 text-red-700 hover:bg-red-100"
      }`}
    >
      {isBlocked ? "Unblock" : "Block"}
    </button>
  );
}

export default UserActionButton;