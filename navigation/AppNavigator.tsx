import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import HomeScreen from '@/screens/HomeScreen';
import AddClothingScreen from '@/screens/AddClothingScreen';
import OutfitSuggestionsScreen from '@/screens/OutfitSuggestionsScreen';

// Define your tab param list with exact screen names
export type RootTabParamList = {
  Home: undefined;
  'Add Clothing': undefined;
  Suggestions: undefined;
};

const Tab = createBottomTabNavigator<RootTabParamList>();

export default function AppNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: true,
        tabBarActiveTintColor: '#0A84FF',
        tabBarInactiveTintColor: '#888',
        tabBarStyle: { backgroundColor: '#fafafa' },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: 'Home' }}
      />
      <Tab.Screen
        name="Add Clothing"
        component={AddClothingScreen}
        options={{ title: 'Add Clothing' }}
      />
      <Tab.Screen
        name="Suggestions"
        component={OutfitSuggestionsScreen}
        options={{ title: 'Suggestions' }}
      />
    </Tab.Navigator>
  );
}
