import { createContext, useContext, useEffect, useState, useCallback } from "react";
import * as SecureStore from "expo-secure-store";
import AsyncStorage from "@react-native-async-storage/async-storage";

const TOKEN_KEY = "denis-the-barber-auth-token";
const CLIENT_KEY = "denis-the-barber:auth-client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [client, setClient] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    async function restore() {
      const available = await SecureStore.isAvailableAsync();
      const storedToken = available ? await SecureStore.getItemAsync(TOKEN_KEY) : null;
      const storedClient = await AsyncStorage.getItem(CLIENT_KEY);
      setToken(storedToken);
      setClient(storedClient ? JSON.parse(storedClient) : null);
      setReady(true);
    }
    restore();
  }, []);

  const login = useCallback(async (newToken, newClient) => {
    setToken(newToken);
    setClient(newClient);
    if (await SecureStore.isAvailableAsync()) {
      await SecureStore.setItemAsync(TOKEN_KEY, newToken);
    }
    await AsyncStorage.setItem(CLIENT_KEY, JSON.stringify(newClient));
  }, []);

  const logout = useCallback(async () => {
    setToken(null);
    setClient(null);
    if (await SecureStore.isAvailableAsync()) {
      await SecureStore.deleteItemAsync(TOKEN_KEY);
    }
    await AsyncStorage.removeItem(CLIENT_KEY);
  }, []);

  if (!ready) return null;

  return (
    <AuthContext.Provider value={{ token, client, isAuthenticated: !!token, login, logout }}>
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
