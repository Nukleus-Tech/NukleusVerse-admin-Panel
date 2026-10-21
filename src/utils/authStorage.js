const TOKEN_KEY = "nukleus_admin_token";
const ADMIN_KEY = "nukleus_admin_user";

export const saveAuth = (token, admin) => {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(ADMIN_KEY, JSON.stringify(admin));
};

export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

export const getAdmin = () => {
  const admin = localStorage.getItem(ADMIN_KEY);

  if (!admin) {
    return null;
  }

  try {
    return JSON.parse(admin);
  } catch {
    localStorage.removeItem(ADMIN_KEY);
    return null;
  }
};

export const clearAuth = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(ADMIN_KEY);
};