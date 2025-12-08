import { createContext, useContext, useState, useEffect } from "react";
import api from "../api/axios";

const AuthContext = createContext();

// Hook pour utiliser le contexte
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};

// Provider du contexte
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Charger user au démarrage
  useEffect(() => {
    const token = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (token && savedUser) {
      try {
        setUser(JSON.parse(savedUser));
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      } catch (err) {
        console.error("Erreur parsing user:", err);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    }

    setLoading(false);
  }, []);

  const login = async (email, password) => {
  try {
    const response = await api.post("/auth/login", { email, password });

    // Normaliser user._id
    const loggedUser = {
      ...response.data.user,
      _id: response.data.user._id || response.data.user.id
    };

    localStorage.setItem("token", response.data.token);
    localStorage.setItem("user", JSON.stringify(loggedUser));
    api.defaults.headers.common["Authorization"] = `Bearer ${response.data.token}`;
    setUser(loggedUser);
    return response.data;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

const register = async (username, email, password) => {
  try {
    const response = await api.post("/auth/register", { username, email, password });

    // Normaliser user._id
    const registeredUser = {
      ...response.data.user,
      _id: response.data.user._id || response.data.user.id
    };

    localStorage.setItem("token", response.data.token);
    localStorage.setItem("user", JSON.stringify(registeredUser));
    api.defaults.headers.common["Authorization"] = `Bearer ${response.data.token}`;
    setUser(registeredUser);
    return response.data;
  } catch (error) {
    console.error("Register error:", error);
    throw error;
  }
};


  // Logout
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    delete api.defaults.headers.common["Authorization"];
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser, // ← important pour EditProfile
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!user
      }}
    >
      {loading ? <p style={{ textAlign: "center" }}>Chargement...</p> : children}
    </AuthContext.Provider>
  );
};
