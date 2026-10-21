import { useCallback, useMemo, useState } from "react";
import { loginAdmin } from "../api/authApi";
import AuthContext from "./authContextValue";
import {
  clearAuth,
  getAdmin,
  getToken,
  saveAuth,
} from "../utils/authStorage";

function AuthProvider({ children }) {
  const [user, setUser] = useState(() => getAdmin());
  const [token, setToken] = useState(() => getToken());

  const login = useCallback(async (email, password) => {
    try {
      const data = await loginAdmin(
        email.trim(),
        password.trim()
      );

      if (data?.success !== true) {
        return {
          success: false,
          message:
            data?.message || "Invalid email or password",
        };
      }

      if (!data?.admin || !data?.token) {
        return {
          success: false,
          message: "Invalid login response from server",
        };
      }

      saveAuth(data.token, data.admin);

      setToken(data.token);
      setUser(data.admin);

      return {
        success: true,
        admin: data.admin,
      };
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message ||
          error.message ||
          "Login failed. Please try again.",
      };
    }
  }, []);

  const logout = useCallback(() => {
    clearAuth();
    setToken(null);
    setUser(null);
  }, []);

  const contextValue = useMemo(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(token),
      login,
      logout,
    }),
    [user, token, login, logout]
  );

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
