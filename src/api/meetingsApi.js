import api from "./axios";

export const getMeetings = async () => {
  const response = await api.get("/api/admin/meetings");
  return response.data;
};

export const getMeetingById = async (meetingId) => {
  const response = await api.get(`/api/admin/meetings/${meetingId}`);
  return response.data;
};
