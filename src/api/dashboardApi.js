import api from "./axios";

export const getDashboardData = async () => {
  const response = await api.get("/api/admin/dashboard");
  return response.data;
};
