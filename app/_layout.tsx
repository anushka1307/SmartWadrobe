// app/_layout.tsx
import React from 'react';
import { ClothingProvider } from '@/context/ClothingContext';
import { Slot } from 'expo-router';

export default function RootLayout() {
  return (
    <ClothingProvider>
      <Slot />
    </ClothingProvider>
  );
}
