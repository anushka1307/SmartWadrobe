import React, { createContext, useState, useContext, ReactNode } from "react";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";
export type ClothingItem = {
  id: string;
  name: string;
  imageUri: string;
  category: string;
};

type ClothingContextType = {
  clothes: ClothingItem[];
  fetchClothes: () => Promise<void>;
};

const ClothingContext = createContext<ClothingContextType | undefined>(
  undefined
);

export function ClothingProvider({ children }: { children: ReactNode }) {
  const [clothes, setClothes] = useState<ClothingItem[]>([]);

  async function getToken() {
    if (Platform.OS === "web") {
      // On web, use localStorage
      return localStorage.getItem("userToken");
    } else {
      // On native, use SecureStore
      return SecureStore.getItemAsync("userToken");
    }
  }

  async function fetchClothes() {
    try {
      const token = await getToken();
      if (!token) return;

      const response = await axios.get(
        "http://192.168.1.180:3000/api/users/getClothing",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setClothes(
        response.data.map((item: any) => ({
          id: item._id,
          name: item.clothing_name,
          imageUri: item.image,
          category: item.category,
        }))
      );
    } catch (error: any) {
      console.error(
        "Failed to fetch clothes:",
        error.response?.data || error.message
      );
    }
  }

  return (
    <ClothingContext.Provider value={{ clothes, fetchClothes }}>
      {children}
    </ClothingContext.Provider>
  );
}

export function useClothing() {
  const context = useContext(ClothingContext);
  if (!context) {
    throw new Error("useClothing must be used within ClothingProvider");
  }
  return context;
}
