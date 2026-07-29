import { createContext, useContext, useEffect, useState, useCallback } from "react";
import * as SecureStore from "expo-secure-store";
import AsyncStorage from "@react-native-async-storage/async-storage";

const TOKEN_KEY = "denis-the-barber:admin-auth-token";
const STAFF_KEY = "denis-the-barber:admin-auth-staff";

const AdminAuthContext = createContext(null);

export function AdminAuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [staff, setStaff] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    async function restore() {
      const available = await SecureStore.isAvailableAsync();
      const storedToken = available ? await SecureStore.getItemAsync(TOKEN_KEY) : null;
      const storedStaff = await AsyncStorage.getItem(STAFF_KEY);
      setToken(storedToken);
      setStaff(storedStaff ? JSON.parse(storedStaff) : null);
      setReady(true);
    }
    restore();
  }, []);

  const login = useCallback(async (newToken, newStaff) => {
    setToken(newToken);
    setStaff(newStaff);
    if (await SecureStore.isAvailableAsync()) {
      await SecureStore.setItemAsync(TOKEN_KEY, newToken);
    }
    await AsyncStorage.setItem(STAFF_KEY, JSON.stringify(newStaff));
  }, []);

  const logout = useCallback(async () => {
    setToken(null);
    setStaff(null);
    if (await SecureStore.isAvailableAsync()) {
      await SecureStore.deleteItemAsync(TOKEN_KEY);
    }
    await AsyncStorage.removeItem(STAFF_KEY);
  }, []);

  if (!ready) return null;

  return (
    <AdminAuthContext.Provider
      value={{
        token,
        staff,
        isAdminAuthenticated: !!token,
        isManager: staff?.adminLevel === "manager",
        login,
        logout,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) {
    throw new Error("useAdminAuth doit etre utilise a l'interieur d'un AdminAuthProvider");
  }
  return ctx;
}
