import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { authApi } from "../services/authApi";
import { getToken, setToken as persistToken } from "../services/api";

const AuthContext = createContext(null);

const USER_KEY = "mamoun_user";

export function AuthProvider({ children }) {
  const [token, setTokenState] = useState(() => getToken());
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  });
  // Reserved for when auth state needs to be hydrated from an async
  // "who am I" call on app load; not needed in mock mode.
  const initializing = false;

  // Keep localStorage in sync with in-memory user object.
  useEffect(() => {
    if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
    else localStorage.removeItem(USER_KEY);
  }, [user]);

  const login = async ({ email, password, role }) => {
    const result = await authApi.login({ email, password, role });
    persistToken(result.token);
    setTokenState(result.token);
    setUser(result.user);
    return result.user;
  };

  const signup = async ({ fullName, email, password, role }) => {
    const result = await authApi.signup({ fullName, email, password, role });
    persistToken(result.token);
    setTokenState(result.token);
    setUser(result.user);
    return result.user;
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } finally {
      persistToken(null);
      setTokenState(null);
      setUser(null);
    }
  };

  const value = useMemo(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(token && user),
      initializing,
      login,
      signup,
      logout,
    }),
    [user, token, initializing]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
