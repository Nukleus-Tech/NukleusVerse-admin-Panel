import api from "./axios";

export const getUsers = async () => {
  const response = await api.get("/api/admin/users");
  return response.data;
};

export const getUserById = async (id) => {
  const response = await api.get(`/api/admin/users/${id}`);
  return response.data;
};

export const blockUser = async (id) => {
  const response = await api.put(`/api/admin/users/${id}/block`);
  return response.data;
};

export const unblockUser = async (id) => {
  const response = await api.put(`/api/admin/users/${id}/unblock`);
  return response.data;
};
