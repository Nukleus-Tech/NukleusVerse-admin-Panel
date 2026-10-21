import api from "./axios";

export const getNotes = async () => {
  const response = await api.get("/api/admin/notes");
  return response.data;
};

export const getNotesByMeetingId = async (meetingId) => {
  const response = await api.get(`/api/admin/notes/${meetingId}`);
  return response.data;
};
