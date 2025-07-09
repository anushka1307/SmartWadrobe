import React, { createContext, useState, useEffect, ReactNode } from "react";
import * as SecureStoreWrapper from "./secureStoreWrapper"; // <-- import wrapper

type AuthContextType = {
  userToken: string | null;
  loading: boolean;
  signIn: (token: string) => Promise<void>;
  signOut: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextType>({
  userToken: null,
  loading: true,
  signIn: async () => {},
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [userToken, setUserToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadToken = async () => {
      const token = await SecureStoreWrapper.getItemAsync("userToken");
      if (token) setUserToken(token);
      setLoading(false);
    };
    loadToken();
  }, []);

  const signIn = async (token: string) => {
    await SecureStoreWrapper.setItemAsync("userToken", token);
    setUserToken(token);
  };

  const signOut = async () => {
    await SecureStoreWrapper.deleteItemAsync("userToken");
    setUserToken(null);
  };

  return (
    <AuthContext.Provider value={{ userToken, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}
