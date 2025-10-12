// app/layouts/BeneficiaryTabLayout.tsx
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function BeneficiaryTabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: '#4fc3f7' },
        headerTintColor: '#fff',
        tabBarActiveTintColor: '#0288d1',
        tabBarInactiveTintColor: '#757575',
        tabBarStyle: { paddingBottom: 4, paddingTop: 5, height: 80 },
        tabBarLabelStyle: { fontSize: 12, fontWeight: '600' },
        tabBarShowLabel: true,
      }}
    >
      <Tabs.Screen 
        name="beneficiary-home" 
        options={{ 
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }} 
      />
      <Tabs.Screen 
        name="beneficiary" 
        options={{ 
          title: 'My Applications',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="document-text" size={size} color={color} />
          ),
        }} 
      />
      <Tabs.Screen 
        name="reports" 
        options={{ 
          title: 'History',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="time" size={size} color={color} />
          ),
        }} 
      />
      {/* Hide tabs that are not relevant for beneficiaries */}
      <Tabs.Screen 
        name="home" 
        options={{ 
          href: null,
        }} 
      />
      <Tabs.Screen 
        name="admin" 
        options={{ 
          href: null,
        }} 
      />
      <Tabs.Screen 
        name="ai-insights" 
        options={{ 
          href: null,
        }} 
      />
      <Tabs.Screen 
        name="applications" 
        options={{ 
          href: null,
        }} 
      />
    </Tabs>
  );
}
