import { Navigate, Route, Routes } from "react-router-dom";
import AdminLayout from "../layout/AdminLayout.jsx";
import Dashboard from "../pages/Dashboard/Dashboard.jsx";
import Login from "../pages/Login.jsx";
import Meetings from "../pages/Meetings/Meetings.jsx";
import Notes from "../pages/Notes/Notes.jsx";
import NotFound from "../pages/NotFound.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";
import Recordings from "../pages/Recordings/Recordings.jsx";
import Settings from "../pages/Settings.jsx";
import Summaries from "../pages/Summaries.jsx";
import Users from "../pages/Users.jsx";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<AdminLayout />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/users" element={<Users />} />
          <Route path="/meetings" element={<Meetings />} />
          <Route path="/recordings" element={<Recordings />} />
          <Route path="/notes" element={<Notes />} />
          <Route path="/summaries" element={<Summaries />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default AppRoutes;
