import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import api from "../api/axios";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);


  // ==========================================
  // LOAD CURRENT USER
  // ==========================================

  const loadUser = async () => {

    const token =
      localStorage.getItem("accessToken");

    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {

      const response =
        await api.get("/auth/me");

      setUser(response.data.user);

    } catch (error) {

      console.error(
        "Unable to load user:",
        error
      );

      localStorage.removeItem(
        "accessToken"
      );

      setUser(null);

    } finally {

      setLoading(false);

    }
  };


  // ==========================================
  // CHECK USER WHEN APP STARTS
  // ==========================================

  useEffect(() => {

    loadUser();

  }, []);


  // ==========================================
  // LOGIN
  // ==========================================

  const login = async (credentials) => {

    const response =
      await api.post(
        "/auth/login",
        credentials
      );

    const {
      accessToken,
      user,
    } = response.data;


    if (accessToken) {

      localStorage.setItem(
        "accessToken",
        accessToken
      );

    }

    setUser(user);

    return response.data;
  };


  // ==========================================
  // LOGOUT
  // ==========================================

  const logout = async () => {

    try {

      await api.post(
        "/auth/logout"
      );

    } catch (error) {

      console.error(
        "Logout error:",
        error
      );

    } finally {

      localStorage.removeItem(
        "accessToken"
      );

      setUser(null);

    }
  };


  const updateUser = (updatedUser) => {
    setUser((prev) => (prev ? { ...prev, ...updatedUser } : updatedUser));
  };


  // ==========================================
  // CONTEXT
  // ==========================================

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated:
          Boolean(user),
        login,
        logout,
        loadUser,
        updateUser,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}


// ==========================================
// USE AUTH
// ==========================================

export function useAuth() {

  return useContext(
    AuthContext
  );

}