// app/(tabs)/_layout.tsx
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useState, useEffect } from 'react';
import { getUserRole } from '../../Utils/auth';

export default function TabLayout() {
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    loadUserRole();
  }, []);

  const loadUserRole = async () => {
    const role = await getUserRole();
    setUserRole(role);
  };

  // Beneficiary-specific tabs
  if (userRole === 'beneficiary') {
    return (
      <Tabs
        screenOptions={{
          headerStyle: { backgroundColor: '#A855F7' }, // Purple for beneficiary
          headerTintColor: '#fff',
          tabBarActiveTintColor: '#A855F7',
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
          name="donor" 
          options={{ 
            href: null,
          }} 
        />
        <Tabs.Screen 
          name="admin-home" 
          options={{ 
            href: null,
          }} 
        />
        <Tabs.Screen 
          name="donor-home" 
          options={{ 
            href: null,
          }} 
        />
      </Tabs>
    );
  }

  // Donor-specific tabs
  if (userRole === 'donor') {
    return (
      <Tabs
        screenOptions={{
          headerStyle: { backgroundColor: '#EF4444' }, // Red for donor
          headerTintColor: '#fff',
          tabBarActiveTintColor: '#EF4444',
          tabBarInactiveTintColor: '#757575',
          tabBarStyle: { paddingBottom: 4, paddingTop: 5, height: 80 },
          tabBarLabelStyle: { fontSize: 12, fontWeight: '600' },
          tabBarShowLabel: true,
        }}
      >
        <Tabs.Screen 
          name="donor-home" 
          options={{ 
            title: 'Home',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="heart" size={size} color={color} />
            ),
          }} 
        />
        <Tabs.Screen 
          name="donor" 
          options={{ 
            title: 'Projects',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="search" size={size} color={color} />
            ),
          }} 
        />
        <Tabs.Screen 
          name="reports" 
          options={{ 
            title: 'My Donations',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="list" size={size} color={color} />
            ),
          }} 
        />
        {/* Hide tabs that are not relevant for donors */}
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
          name="beneficiary" 
          options={{ 
            href: null,
          }} 
        />
        <Tabs.Screen 
          name="admin-home" 
          options={{ 
            href: null,
          }} 
        />
        <Tabs.Screen 
          name="beneficiary-home" 
          options={{ 
            href: null,
          }} 
        />
      </Tabs>
    );
  }

  // Admin-specific tabs
  if (userRole === 'admin') {
    return (
      <Tabs
        screenOptions={{
          headerStyle: { backgroundColor: '#4F46E5' }, // Indigo for admin
          headerTintColor: '#fff',
          tabBarActiveTintColor: '#4F46E5',
          tabBarInactiveTintColor: '#757575',
          tabBarStyle: { paddingBottom: 4, paddingTop: 5, height: 80 },
          tabBarLabelStyle: { fontSize: 12, fontWeight: '600' },
          tabBarShowLabel: true,
        }}
      >
        <Tabs.Screen 
          name="admin-home" 
          options={{ 
            title: 'Dashboard',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="shield-checkmark" size={size} color={color} />
            ),
          }} 
        />
        <Tabs.Screen 
          name="admin" 
          options={{ 
            title: 'Projects',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="business" size={size} color={color} />
            ),
          }} 
        />
        <Tabs.Screen 
          name="beneficiary" 
          options={{ 
            title: 'Applications',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="people" size={size} color={color} />
            ),
          }} 
        />
        <Tabs.Screen 
          name="reports" 
          options={{ 
            title: 'Analytics',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="stats-chart" size={size} color={color} />
            ),
          }} 
        />
        {/* Hide tabs that are not relevant for admin */}
        <Tabs.Screen 
          name="home" 
          options={{ 
            href: null,
          }} 
        />
        <Tabs.Screen 
          name="donor" 
          options={{ 
            href: null,
          }} 
        />
        <Tabs.Screen 
          name="donor-home" 
          options={{ 
            href: null,
          }} 
        />
        <Tabs.Screen 
          name="beneficiary-home" 
          options={{ 
            href: null,
          }} 
        />
      </Tabs>
    );
  }

  // Default/Public tabs (fallback)
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
          title: 'Projects',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="business" size={size} color={color} />
          ),
        }} 
      />
      <Tabs.Screen 
        name="donor" 
        options={{ 
          title: 'AI-Insights',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="sparkles" size={size} color={color} />
          ),
        }} 
      />
      <Tabs.Screen 
        name="beneficiary" 
        options={{ 
          title: 'Applications',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="people" size={size} color={color} />
          ),
        }} 
      />
      <Tabs.Screen 
        name="reports" 
        options={{ 
          title: 'Reports',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="stats-chart" size={size} color={color} />
          ),
        }} 
      />
      {/* Hide role-specific home screens */}
      <Tabs.Screen 
        name="admin-home" 
        options={{ 
          href: null,
        }} 
      />
      <Tabs.Screen 
        name="donor-home" 
        options={{ 
          href: null,
        }} 
      />
      <Tabs.Screen 
        name="beneficiary-home" 
        options={{ 
          href: null,
        }} 
      />
    </Tabs>
  ); 
}