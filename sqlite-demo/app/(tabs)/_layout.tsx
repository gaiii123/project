// app/(tabs)/_layout.tsx
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: '#4fc3f7' },
        headerTintColor: '#fff',
        tabBarActiveTintColor: '#0288d1',
        tabBarStyle: { paddingBottom: 5 },
      }}
    >
      <Tabs.Screen 
        name="home" 
        options={{ 
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }} 
      />
      <Tabs.Screen 
        name="admin" 
        options={{ 
          title: 'NGO Admin',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="business" size={size} color={color} />
          ),
        }} 
      />
      <Tabs.Screen 
        name="donor" 
        options={{ 
          title: 'Donor',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="heart" size={size} color={color} />
          ),
        }} 
      />
      <Tabs.Screen 
        name="beneficiary" 
        options={{ 
          title: 'Beneficiary',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="people" size={size} color={color} />
          ),
        }} 
      />
      <Tabs.Screen 
        name="tracker" 
        options={{ 
          title: 'Tracker',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="stats-chart" size={size} color={color} />
          ),
        }} 
      />
    </Tabs>
  );
}