import api from "./axios";

export const getRecordings = async () => {
  const response = await api.get("/api/admin/recordings");
  return response.data;
};

export const getRecordingDownload = async (meetingId) => {
  const response = await api.get(
    `/api/admin/recordings/${meetingId}/download`,
  );
  return response.data;
};
