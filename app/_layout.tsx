import React from 'react';
import { Slot } from 'expo-router';
import { AuthProvider } from '../context/AuthContext';
import { ClothingProvider } from '../context/ClothingContext';

export default function RootLayout() {
  return (
    <AuthProvider>
      <ClothingProvider>
        <Slot />
      </ClothingProvider>
    </AuthProvider>
  );
}
