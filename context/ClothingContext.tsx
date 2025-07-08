import React, { createContext, useState, useContext, ReactNode } from "react";

export type ClothingItem = {
  id: string;
  name: string;
  imageUri: string;
  category: string;
};

type ClothingContextType = {
  clothes: ClothingItem[];
  addClothing: (item: Omit<ClothingItem, "id">) => void;
};

const ClothingContext = createContext<ClothingContextType | undefined>(undefined);

export function ClothingProvider({ children }: { children: ReactNode }) {
  const [clothes, setClothes] = useState<ClothingItem[]>([
    {
      id: "1",
      name: "White T-Shirt",
      imageUri: "https://via.placeholder.com/100",
      category: "Top",
    },
    {
      id: "2",
      name: "Blue Jeans",
      imageUri: "https://via.placeholder.com/100",
      category: "Bottom",
    },
    {
      id: "3",
      name: "Black Hoodie",
      imageUri: "https://via.placeholder.com/100",
      category: "Top",
    },
  ]);

  function addClothing(item: Omit<ClothingItem, "id">) {
    const newItem = { ...item, id: Date.now().toString() };
    setClothes((prev) => [...prev, newItem]);
  }

  return (
    <ClothingContext.Provider value={{ clothes, addClothing }}>
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
