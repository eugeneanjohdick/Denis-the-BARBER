import { createContext, useContext, useEffect, useState, useCallback } from "react";
import * as SecureStore from "expo-secure-store";

const TOKEN_KEY = "denis-the-barber:auth-token";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    SecureStore.isAvailableAsync()
      .then((available) => (available ? SecureStore.getItemAsync(TOKEN_KEY) : null))
      .then((stored) => setToken(stored))
      .finally(() => setReady(true));
  }, []);

  const login = useCallback(async (newToken) => {
    setToken(newToken);
    if (await SecureStore.isAvailableAsync()) {
      await SecureStore.setItemAsync(TOKEN_KEY, newToken);
    }
  }, []);

  const logout = useCallback(async () => {
    setToken(null);
    if (await SecureStore.isAvailableAsync()) {
      await SecureStore.deleteItemAsync(TOKEN_KEY);
    }
  }, []);

  if (!ready) return null;

  return (
    <AuthContext.Provider value={{ token, isAuthenticated: !!token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth doit etre utilise a l'interieur d'un AuthProvider");
  }
  return ctx;
}
