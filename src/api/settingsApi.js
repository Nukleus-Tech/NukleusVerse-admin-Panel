import api from "./axios";

export const getAdminProfile = async () => {
  const response = await api.get("/api/admin/settings/profile");
  return response.data;
};

export const getSystemInformation = async () => {
  const response = await api.get("/api/admin/settings/system");
  return response.data;
};
